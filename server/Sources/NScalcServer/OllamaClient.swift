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

struct OllamaChatRequest: Codable, Sendable {
    var model: String
    var messages: [OllamaMessage]
    var tools: [OllamaTool]?
    var stream: Bool = false
}

struct OllamaChatResponse: Codable, Sendable {
    var model: String
    var message: OllamaMessage
    var done: Bool
}

enum OllamaClientError: Error, Sendable {
    case httpStatus(Int)
}

// MARK: - OllamaClient

struct OllamaClient: Sendable {
    let baseURL: URL
    let model: String
    private let session: URLSession

    init(baseURL: URL, model: String, timeoutSeconds: TimeInterval = 45) {
        self.baseURL = baseURL
        self.model = model
        let config = URLSessionConfiguration.ephemeral
        config.timeoutIntervalForRequest = timeoutSeconds
        config.timeoutIntervalForResource = timeoutSeconds
        self.session = URLSession(configuration: config)
    }

    /// Async — safe to call from inside a bidi_stream's `connect()` handler,
    /// which runs on Swift's cooperative concurrency pool. Must not block a
    /// thread while waiting on the network (that's why this uses URLSession's
    /// async API rather than a semaphore-blocked completion handler).
    func chat(messages: [OllamaMessage], tools: [OllamaTool]) async throws -> OllamaMessage {
        let request = OllamaChatRequest(model: model, messages: messages, tools: tools, stream: false)
        let body = try JSONEncoder().encode(request)

        var urlRequest = URLRequest(url: baseURL.appendingPathComponent("api/chat"))
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = body

        let (data, response) = try await session.data(for: urlRequest)
        if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
            throw OllamaClientError.httpStatus(http.statusCode)
        }
        return try JSONDecoder().decode(OllamaChatResponse.self, from: data).message
    }
}
