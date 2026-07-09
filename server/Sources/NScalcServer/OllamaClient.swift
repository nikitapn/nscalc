// Copyright (c) 2026 nikitapnn1@gmail.com
// Minimal client for Ollama's /api/chat tool-calling endpoint.
// Uses Foundation's URLSession (no new Package.swift dependency).

import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

// MARK: - Dynamic JSON value

/// Represents arbitrary JSON — needed for tool-call `arguments` (whose shape
/// depends on the tool schema) and for building JSON-schema `parameters`
/// literals for outgoing tool definitions.
enum JSONValue: Codable, Sendable {
    case string(String)
    case number(Double)
    case bool(Bool)
    case object([String: JSONValue])
    case array([JSONValue])
    case null

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if container.decodeNil() {
            self = .null
        } else if let value = try? container.decode(Bool.self) {
            self = .bool(value)
        } else if let value = try? container.decode(Double.self) {
            self = .number(value)
        } else if let value = try? container.decode(String.self) {
            self = .string(value)
        } else if let value = try? container.decode([String: JSONValue].self) {
            self = .object(value)
        } else if let value = try? container.decode([JSONValue].self) {
            self = .array(value)
        } else {
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Unsupported JSON value")
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .string(let value): try container.encode(value)
        case .number(let value): try container.encode(value)
        case .bool(let value): try container.encode(value)
        case .object(let value): try container.encode(value)
        case .array(let value): try container.encode(value)
        case .null: try container.encodeNil()
        }
    }

    var stringValue: String? {
        if case .string(let value) = self { return value }
        return nil
    }

    var doubleValue: Double? {
        switch self {
        case .number(let value): return value
        case .string(let value): return Double(value)
        default: return nil
        }
    }

    var objectValue: [String: JSONValue]? {
        if case .object(let value) = self { return value }
        return nil
    }
}

// MARK: - Ollama /api/chat wire types

struct OllamaToolCallFunction: Codable, Sendable {
    var name: String
    var arguments: [String: JSONValue]
}

struct OllamaToolCall: Codable, Sendable {
    var function: OllamaToolCallFunction
}

struct OllamaMessage: Codable, Sendable {
    var role: String
    var content: String
    var tool_calls: [OllamaToolCall]?
    var tool_name: String?
    /// Base64-encoded image data — Ollama's vision input format for
    /// multimodal models (attached to a "user" message).
    var images: [String]?

    init(
        role: String,
        content: String,
        tool_calls: [OllamaToolCall]? = nil,
        tool_name: String? = nil,
        images: [String]? = nil
    ) {
        self.role = role
        self.content = content
        self.tool_calls = tool_calls
        self.tool_name = tool_name
        self.images = images
    }
}

struct OllamaToolFunction: Codable, Sendable {
    var name: String
    var description: String
    var parameters: JSONValue
}

struct OllamaTool: Codable, Sendable {
    var type: String = "function"
    var function: OllamaToolFunction
}

struct OllamaOptions: Codable, Sendable {
    /// Runtime context window size, in tokens. Ollama defaults this much
    /// lower than a model's architectural max (often 2048-4096) unless set
    /// explicitly — once a conversation's tokenized system+history+tool
    /// schemas exceed it, llama.cpp silently truncates older context to keep
    /// generating (visible in Ollama's logs as `truncated = 1`).
    var num_ctx: Int?
}

struct OllamaChatRequest: Codable, Sendable {
    var model: String
    var messages: [OllamaMessage]
    var tools: [OllamaTool]?
    var stream: Bool = false
    var options: OllamaOptions?
}

struct OllamaChatResponse: Codable, Sendable {
    var model: String
    var message: OllamaMessage
    var done: Bool
}

enum OllamaClientError: Error, Sendable {
    case httpStatus(Int)
}

// MARK: - Streaming delegate

/// Bridges URLSessionDataDelegate callbacks (received as raw bytes trickle
/// in) to an AsyncThrowingStream of decoded chunks. URLSession.bytes(for:) —
/// the modern async streaming API — is unavailable in this Linux Foundation
/// build, so this delegate-based approach is used instead.
private final class OllamaStreamDelegate: NSObject, URLSessionDataDelegate, @unchecked Sendable {
    private var buffer = Data()
    private let newline = Data([0x0A])
    private let continuation: AsyncThrowingStream<OllamaChatResponse, Error>.Continuation

    init(continuation: AsyncThrowingStream<OllamaChatResponse, Error>.Continuation) {
        self.continuation = continuation
    }

    func urlSession(
        _ session: URLSession,
        dataTask: URLSessionDataTask,
        didReceive response: URLResponse,
        completionHandler: @escaping (URLSession.ResponseDisposition) -> Void
    ) {
        if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
            continuation.finish(throwing: OllamaClientError.httpStatus(http.statusCode))
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
            guard !lineData.isEmpty else { continue }
            do {
                continuation.yield(try JSONDecoder().decode(OllamaChatResponse.self, from: lineData))
            } catch {
                continuation.finish(throwing: error)
            }
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

// MARK: - OllamaClient

struct OllamaClient: Sendable {
    let baseURL: URL
    let model: String
    private let timeoutSeconds: TimeInterval
    private let numCtx: Int?

    init(baseURL: URL, model: String, timeoutSeconds: TimeInterval = 45, numCtx: Int? = nil) {
        self.baseURL = baseURL
        self.model = model
        self.timeoutSeconds = timeoutSeconds
        self.numCtx = numCtx
    }

    private func makeSessionConfig() -> URLSessionConfiguration {
        let config = URLSessionConfiguration.ephemeral
        config.timeoutIntervalForRequest = timeoutSeconds
        config.timeoutIntervalForResource = timeoutSeconds
        return config
    }

    /// Non-streaming convenience, kept for callers that don't need incremental
    /// tokens — just drains chatStream without forwarding anything.
    func chat(messages: [OllamaMessage], tools: [OllamaTool]) async throws -> OllamaMessage {
        try await chatStream(messages: messages, tools: tools) { _ in }
    }

    /// Streams the response over Ollama's `/api/chat` (stream:true), invoking
    /// `onToken` for each content delta as it arrives, and returns the fully
    /// assembled message (content + any tool calls) once the stream ends.
    /// Safe to call from inside a bidi_stream's `connect()` handler — never
    /// blocks a thread while waiting on the network.
    func chatStream(
        messages: [OllamaMessage],
        tools: [OllamaTool],
        onToken: @Sendable (String) async -> Void
    ) async throws -> OllamaMessage {
        let request = OllamaChatRequest(
            model: model,
            messages: messages,
            tools: tools,
            stream: true,
            options: numCtx.map { OllamaOptions(num_ctx: $0) }
        )
        let body = try JSONEncoder().encode(request)

        var urlRequest = URLRequest(url: baseURL.appendingPathComponent("api/chat"))
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = body

        let sessionConfig = makeSessionConfig()
        let chunkStream = AsyncThrowingStream<OllamaChatResponse, Error> { continuation in
            let delegate = OllamaStreamDelegate(continuation: continuation)
            let session = URLSession(configuration: sessionConfig, delegate: delegate, delegateQueue: nil)
            session.dataTask(with: urlRequest).resume()
        }

        var content = ""
        var toolCalls: [OllamaToolCall]?
        for try await chunk in chunkStream {
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
}
