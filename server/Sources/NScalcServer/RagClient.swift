// Copyright (c) 2026 nikitapnn1@gmail.com
// Client for the rag/serve.py HTTP bridge — Swift has no equivalent of the
// sentence-transformers embedding model or pgvector, so retrieval happens in
// Python and is called over HTTP the same way OllamaClient calls Ollama.

import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

struct RagChunk: Codable, Sendable {
    var source: String
    var headings: [String]
    var pages: [Int]
    var text: String
    var score: Double
}

// Not private: reused by the ComputeChannel relay path (ComputeBroker.swift),
// which needs to build/parse the exact same wire JSON when a compute worker
// makes this HTTP call on our behalf instead of us calling it directly.
struct RagSearchRequest: Codable, Sendable {
    var query: String
    var top_k: Int
}

struct RagSearchResponse: Codable, Sendable {
    var results: [RagChunk]
}

enum RagClientError: Error, Sendable {
    case httpStatus(Int)
}

struct RagClient: Sendable {
    let baseURL: URL
    private let session: URLSession

    init(baseURL: URL, timeoutSeconds: TimeInterval = 20) {
        self.baseURL = baseURL
        let config = URLSessionConfiguration.ephemeral
        config.timeoutIntervalForRequest = timeoutSeconds
        config.timeoutIntervalForResource = timeoutSeconds
        self.session = URLSession(configuration: config)
    }

    func search(query: String, topK: Int = 5) async throws -> [RagChunk] {
        let request = RagSearchRequest(query: query, top_k: topK)
        let body = try JSONEncoder().encode(request)

        var urlRequest = URLRequest(url: baseURL.appendingPathComponent("search"))
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = body

        let (data, response) = try await session.data(for: urlRequest)
        if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
            throw RagClientError.httpStatus(http.statusCode)
        }
        return try JSONDecoder().decode(RagSearchResponse.self, from: data).results
    }
}
