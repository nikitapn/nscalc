// Copyright (c) 2026 nikitapnn1@gmail.com
// Routes AssistantService's Ollama/RAG HTTP calls through a remote compute
// worker (e.g. a laptop behind NAT, running Ollama + rag/serve.py) instead
// of calling them directly — needed because the server can't dial into a
// NAT'd machine, but the worker can dial out to the server. The worker is a
// dumb JSON-over-HTTP relay (see idl/nscalc.npidl's ComputeChannel comment);
// all protocol knowledge (Ollama's chat schema, the RAG bridge's schema)
// stays here, just riding inside `request_body_json`/`chunk_json` strings.

import Foundation
import NPRPC
import NScalc

@inline(__always)
private func cblog(_ level: String = "I", _ message: String) {
    nplog(level, message, component: "ComputeBroker")
}

enum ComputeBrokerError: LocalizedError, Sendable {
    case noWorkerConnected
    case workerReportedError(String)
    case malformedRelayPayload

    var errorDescription: String? {
        switch self {
        case .noWorkerConnected:
            return "no compute worker is connected"
        case .workerReportedError(let message):
            return "compute worker error: \(message)"
        case .malformedRelayPayload:
            return "failed to build relay request payload"
        }
    }
}

/// Tracks the single currently-connected compute worker (last-connect-wins
/// for v1) and multiplexes in-flight jobs over its one bidi_stream by job id.
actor ComputeBroker {
    private var workerWriter: NPRPCStreamWriter<ComputeJobRequest>?
    private var pending: [String: AsyncThrowingStream<ComputeJobResult, Error>.Continuation] = [:]

    var hasWorker: Bool { workerWriter != nil }

    func attachWorker(writer: NPRPCStreamWriter<ComputeJobRequest>) {
        if workerWriter != nil {
            cblog("W", "a new compute worker connected while one was already active — replacing it")
        }
        workerWriter = writer
    }

    /// Only clears the active worker if `writer` is still the current one —
    /// avoids a stale disconnect from a *previous* worker clobbering a newer
    /// one that already reconnected.
    func detachWorker(writer: NPRPCStreamWriter<ComputeJobRequest>) {
        guard workerWriter === writer else { return }
        workerWriter = nil
        for continuation in pending.values {
            continuation.finish(throwing: ComputeBrokerError.noWorkerConnected)
        }
        pending.removeAll()
    }

    /// Sends one relay job to the connected worker and returns a stream of
    /// its results (one or more `.Chunk`, terminated by `.Done`/`.Error`).
    func submitJob(kind: ComputeJobKind, requestBodyJSON: String) async throws -> AsyncThrowingStream<ComputeJobResult, Error> {
        guard let workerWriter else {
            throw ComputeBrokerError.noWorkerConnected
        }
        let jobId = UUID().uuidString
        let (stream, continuation) = AsyncThrowingStream<ComputeJobResult, Error>.makeStream()
        pending[jobId] = continuation

        let request = ComputeJobRequest(job_id: jobId, kind: kind, request_body_json: requestBodyJSON)
        await workerWriter.write(request)
        return stream
    }

    /// Called from the worker's `connect()` read loop as results arrive.
    func deliver(_ result: ComputeJobResult) {
        guard let continuation = pending[result.job_id] else {
            cblog("W", "result for unknown/expired job \(result.job_id) — ignoring")
            return
        }
        switch result.status {
        case .Chunk:
            continuation.yield(result)
        case .Done:
            continuation.yield(result)
            continuation.finish()
            pending.removeValue(forKey: result.job_id)
        case .Error:
            continuation.finish(throwing: ComputeBrokerError.workerReportedError(result.error_message ?? "unknown worker error"))
            pending.removeValue(forKey: result.job_id)
        }
    }
}

// MARK: - Relay calls (mirror OllamaClient.chatStream / RagClient.search,
// but over the broker instead of a direct URLSession call)

extension ComputeBroker {
    func relayOllamaChatStream(
        model: String,
        messages: [OllamaMessage],
        tools: [OllamaTool],
        numCtx: Int?,
        onToken: @Sendable (String) async -> Void
    ) async throws -> OllamaMessage {
        let request = OllamaChatRequest(
            model: model,
            messages: messages,
            tools: tools,
            stream: true,
            options: numCtx.map { OllamaOptions(num_ctx: $0) }
        )
        let bodyData = try JSONEncoder().encode(request)
        guard let bodyJSON = String(data: bodyData, encoding: .utf8) else {
            throw ComputeBrokerError.malformedRelayPayload
        }

        let results = try await submitJob(kind: .OllamaChatStream, requestBodyJSON: bodyJSON)

        var content = ""
        var toolCalls: [OllamaToolCall]?
        for try await result in results {
            guard let chunkJSON = result.chunk_json, let chunkData = chunkJSON.data(using: .utf8) else {
                continue
            }
            let chunk = try JSONDecoder().decode(OllamaChatResponse.self, from: chunkData)
            if !chunk.message.content.isEmpty {
                content += chunk.message.content
                await onToken(chunk.message.content)
            }
            if let calls = chunk.message.tool_calls, !calls.isEmpty {
                toolCalls = calls
            }
        }

        return OllamaMessage(role: "assistant", content: content, tool_calls: toolCalls)
    }

    func relayRagSearch(query: String, topK: Int = 5) async throws -> [RagChunk] {
        let request = RagSearchRequest(query: query, top_k: topK)
        let bodyData = try JSONEncoder().encode(request)
        guard let bodyJSON = String(data: bodyData, encoding: .utf8) else {
            throw ComputeBrokerError.malformedRelayPayload
        }

        let results = try await submitJob(kind: .RagSearch, requestBodyJSON: bodyJSON)
        for try await result in results {
            guard let chunkJSON = result.chunk_json, let chunkData = chunkJSON.data(using: .utf8) else {
                continue
            }
            return try JSONDecoder().decode(RagSearchResponse.self, from: chunkData).results
        }
        return []
    }
}

// MARK: - ComputeChannelServantImpl

final class ComputeChannelServantImpl: ComputeChannelServant, @unchecked Sendable {
    private let broker: ComputeBroker
    private let expectedToken: String?

    init(broker: ComputeBroker, expectedToken: String?) {
        self.broker = broker
        self.expectedToken = expectedToken
        super.init()
    }

    override func connect(worker_token: String, stream: NPRPCBidiStream<ComputeJobRequest, ComputeJobResult>) async {
        guard let expectedToken, !expectedToken.isEmpty, worker_token == expectedToken else {
            cblog("E", "rejected compute worker connection: bad or missing token")
            stream.writer.close()
            return
        }

        cblog("I", "compute worker connected")
        await broker.attachWorker(writer: stream.writer)

        do {
            for try await result in stream.reader {
                await broker.deliver(result)
            }
        } catch {
            cblog("E", "compute worker stream failed: \(error)")
        }

        await broker.detachWorker(writer: stream.writer)
        stream.writer.close()
        cblog("I", "compute worker disconnected")
    }
}
