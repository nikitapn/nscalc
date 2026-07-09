// Copyright (c) 2026 nikitapnn1@gmail.com
// Raw HTTP relay helpers — the worker deliberately does NOT know Ollama's or
// the RAG bridge's JSON schemas. It just forwards request_body_json to the
// right local endpoint and relays back whatever comes over the wire,
// line-by-line for streaming calls. All schema knowledge lives server-side
// (OllamaClient.swift/RagClient.swift in the main nscalc server).

import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif
import NScalc
import NPRPC

enum RelayError: Error, CustomStringConvertible {
    case httpStatus(Int)
    case invalidRequestBody

    var description: String {
        switch self {
        case .httpStatus(let code): return "HTTP \(code)"
        case .invalidRequestBody: return "invalid request body"
        }
    }
}

/// Bridges URLSessionDataDelegate byte callbacks to an AsyncThrowingStream of
/// newline-delimited lines. URLSession.bytes(for:) — the modern async
/// streaming API — is unavailable in this Linux Foundation build (confirmed
/// against the same toolchain used to build the main nscalc server).
private final class LineStreamDelegate: NSObject, URLSessionDataDelegate, @unchecked Sendable {
    private var buffer = Data()
    private let newline = Data([0x0A])
    private let continuation: AsyncThrowingStream<String, Error>.Continuation

    init(continuation: AsyncThrowingStream<String, Error>.Continuation) {
        self.continuation = continuation
    }

    func urlSession(
        _ session: URLSession,
        dataTask: URLSessionDataTask,
        didReceive response: URLResponse,
        completionHandler: @escaping (URLSession.ResponseDisposition) -> Void
    ) {
        if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
            continuation.finish(throwing: RelayError.httpStatus(http.statusCode))
            completionHandler(.cancel)
            return
        }
        completionHandler(.allow)
    }

    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        buffer.append(data)
        while let range = buffer.range(of: newline) {
            let lineData = buffer.subdata(in: buffer.startIndex..<range.lowerBound)
            buffer.removeSubrange(buffer.startIndex..<range.upperBound)
            guard !lineData.isEmpty, let line = String(data: lineData, encoding: .utf8) else { continue }
            continuation.yield(line)
        }
    }

    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        if let error {
            continuation.finish(throwing: error)
        } else {
            continuation.finish()
        }
    }
}

func streamLines(url: URL, bodyJSON: String, timeoutSeconds: TimeInterval) -> AsyncThrowingStream<String, Error> {
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = Data(bodyJSON.utf8)

    let config = URLSessionConfiguration.ephemeral
    config.timeoutIntervalForRequest = timeoutSeconds
    config.timeoutIntervalForResource = timeoutSeconds

    return AsyncThrowingStream<String, Error> { continuation in
        let delegate = LineStreamDelegate(continuation: continuation)
        let session = URLSession(configuration: config, delegate: delegate, delegateQueue: nil)
        session.dataTask(with: request).resume()
    }
}

// MARK: - Job handlers

@inline(__always)
private func wlog(_ level: String = "I", _ message: String) {
    nplog(level, message, component: "ComputeWorker")
}

func handleOllamaChatStreamJob(
    _ job: ComputeJobRequest,
    ollamaBaseURL: URL,
    writer: NPRPCStreamWriter<ComputeJobResult>,
    timeoutSeconds: TimeInterval
) async {
    let url = ollamaBaseURL.appendingPathComponent("api/chat")
    wlog("I", "job \(job.job_id): relaying Ollama chat to \(url.absoluteString)")
    do {
        var lineCount = 0
        for try await line in streamLines(url: url, bodyJSON: job.request_body_json, timeoutSeconds: timeoutSeconds) {
            lineCount += 1
            await writer.write(ComputeJobResult(job_id: job.job_id, status: .Chunk, chunk_json: line, error_message: nil))
        }
        wlog("I", "job \(job.job_id): done (\(lineCount) chunks)")
        await writer.write(ComputeJobResult(job_id: job.job_id, status: .Done, chunk_json: nil, error_message: nil))
    } catch {
        wlog("E", "job \(job.job_id): Ollama relay failed: \(error)")
        await writer.write(ComputeJobResult(job_id: job.job_id, status: .Error, chunk_json: nil, error_message: "\(error)"))
    }
}

func handleRagSearchJob(
    _ job: ComputeJobRequest,
    ragBaseURL: URL,
    writer: NPRPCStreamWriter<ComputeJobResult>,
    timeoutSeconds: TimeInterval
) async {
    let url = ragBaseURL.appendingPathComponent("search")
    wlog("I", "job \(job.job_id): relaying RAG search to \(url.absoluteString)")

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = Data(job.request_body_json.utf8)

    let config = URLSessionConfiguration.ephemeral
    config.timeoutIntervalForRequest = timeoutSeconds
    config.timeoutIntervalForResource = timeoutSeconds
    let session = URLSession(configuration: config)

    do {
        let (data, response) = try await session.data(for: request)
        if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
            throw RelayError.httpStatus(http.statusCode)
        }
        let responseJSON = String(data: data, encoding: .utf8) ?? "{}"
        wlog("I", "job \(job.job_id): done")
        await writer.write(ComputeJobResult(job_id: job.job_id, status: .Done, chunk_json: responseJSON, error_message: nil))
    } catch {
        wlog("E", "job \(job.job_id): RAG relay failed: \(error)")
        await writer.write(ComputeJobResult(job_id: job.job_id, status: .Error, chunk_json: nil, error_message: "\(error)"))
    }
}
