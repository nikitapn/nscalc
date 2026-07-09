// Copyright (c) 2026 nikitapnn1@gmail.com
// NScalc Compute Worker — dials OUT to the nscalc server (works from behind
// NAT, unlike the server dialing in) and relays Ollama/RAG HTTP jobs to
// services running on this same machine. See idl/nscalc.npidl's
// ComputeChannel interface and server/Sources/NScalcServer/ComputeBroker.swift
// for the server side of this.
//
// Named ComputeWorker.swift (not main.swift) so `@main` can be used — a file
// literally named main.swift gets Swift's implicit top-level-script MainActor
// isolation, which trips "@Sendable closure risks data races" errors when
// passing job-handling closures into actor-isolated NPRPC stream calls.

import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif
import NScalc
import NPRPC

@inline(__always)
private func wlog(_ level: String = "I", _ message: String) {
    nplog(level, message, component: "ComputeWorker")
}

struct WorkerConfig {
    var serverURL: URL
    var workerToken: String
    var ollamaHost: URL
    var ragHost: URL?
    var ollamaTimeoutSeconds: TimeInterval
    var ragTimeoutSeconds: TimeInterval
    var insecureTLS: Bool
    var caCertPath: String?
}

enum WorkerConfigError: Error, CustomStringConvertible {
    case missingValue(String)
    case invalidValue(String, String)
    case missingRequired(String)

    var description: String {
        switch self {
        case .missingValue(let option): return "missing value for \(option)"
        case .invalidValue(let option, let value): return "invalid value for \(option): \(value)"
        case .missingRequired(let option): return "\(option) is required (flag or matching env var)"
        }
    }
}

private func printUsage() {
    print("""
    Usage: ComputeWorker [options]

      --server-url <url>     Base URL of the nscalc server (e.g. https://calc.example.com). Required. (env: NSCALC_SERVER_URL)
      --worker-token <token> Shared secret matching the server's --compute-worker-token. Required. (env: NSCALC_COMPUTE_WORKER_TOKEN)
      --ollama-host <url>    Local Ollama base URL to relay chat jobs to (default: http://localhost:11434). (env: NSCALC_WORKER_OLLAMA_HOST)
      --rag-host <url>       Local rag/serve.py base URL to relay search jobs to. If unset, RAG jobs are rejected. (env: NSCALC_WORKER_RAG_HOST)
      --ollama-timeout <s>   Per-request timeout in seconds for the local Ollama relay (default: 120). (env: NSCALC_WORKER_OLLAMA_TIMEOUT)
      --rag-timeout <s>      Per-request timeout in seconds for the local RAG relay (default: 20). (env: NSCALC_WORKER_RAG_TIMEOUT)
      --insecure-tls         Do not verify the server's TLS certificate on the NPRPC connection (self-signed dev certs; do not use in production). Does NOT affect the initial host.json fetch — see README for that. (env: NSCALC_WORKER_INSECURE_TLS=1)
      --ca-cert <path>       Trust this specific certificate file for the NPRPC connection (self-signed certs). Does NOT affect the initial host.json fetch. (env: NSCALC_WORKER_CA_CERT)
      --help                 Show this help message
    """)
}

private func optionValue(_ option: String, index: inout Int, args: [String]) throws -> String {
    let nextIndex = index + 1
    guard nextIndex < args.count else {
        throw WorkerConfigError.missingValue(option)
    }
    index = nextIndex
    return args[nextIndex]
}

private func parseWorkerConfig() throws -> WorkerConfig {
    let env = ProcessInfo.processInfo.environment
    var serverURLString = env["NSCALC_SERVER_URL"]
    var workerToken = env["NSCALC_COMPUTE_WORKER_TOKEN"]
    var ollamaHostString = env["NSCALC_WORKER_OLLAMA_HOST"] ?? "http://localhost:11434"
    var ragHostString = env["NSCALC_WORKER_RAG_HOST"]
    var ollamaTimeoutSeconds = TimeInterval(env["NSCALC_WORKER_OLLAMA_TIMEOUT"] ?? "120") ?? 120
    var ragTimeoutSeconds = TimeInterval(env["NSCALC_WORKER_RAG_TIMEOUT"] ?? "20") ?? 20
    var insecureTLS = env["NSCALC_WORKER_INSECURE_TLS"] == "1"
    var caCertPath = env["NSCALC_WORKER_CA_CERT"]

    let args = Array(CommandLine.arguments.dropFirst())
    var index = 0
    while index < args.count {
        let argument = args[index]
        switch argument {
        case "--help":
            printUsage()
            exit(0)
        case "--server-url":
            serverURLString = try optionValue(argument, index: &index, args: args)
        case "--worker-token":
            workerToken = try optionValue(argument, index: &index, args: args)
        case "--ollama-host":
            ollamaHostString = try optionValue(argument, index: &index, args: args)
        case "--rag-host":
            ragHostString = try optionValue(argument, index: &index, args: args)
        case "--ollama-timeout":
            let value = try optionValue(argument, index: &index, args: args)
            guard let parsed = TimeInterval(value), parsed > 0 else {
                throw WorkerConfigError.invalidValue(argument, value)
            }
            ollamaTimeoutSeconds = parsed
        case "--rag-timeout":
            let value = try optionValue(argument, index: &index, args: args)
            guard let parsed = TimeInterval(value), parsed > 0 else {
                throw WorkerConfigError.invalidValue(argument, value)
            }
            ragTimeoutSeconds = parsed
        case "--insecure-tls":
            insecureTLS = true
        case "--ca-cert":
            caCertPath = try optionValue(argument, index: &index, args: args)
        default:
            throw WorkerConfigError.invalidValue("argument", argument)
        }
        index += 1
    }

    guard let serverURLString, let serverURL = URL(string: serverURLString) else {
        throw WorkerConfigError.missingRequired("--server-url")
    }
    guard let workerToken, !workerToken.isEmpty else {
        throw WorkerConfigError.missingRequired("--worker-token")
    }
    guard let ollamaHost = URL(string: ollamaHostString) else {
        throw WorkerConfigError.invalidValue("--ollama-host", ollamaHostString)
    }
    let ragHost = ragHostString.flatMap { URL(string: $0) }

    return WorkerConfig(
        serverURL: serverURL,
        workerToken: workerToken,
        ollamaHost: ollamaHost,
        ragHost: ragHost,
        ollamaTimeoutSeconds: ollamaTimeoutSeconds,
        ragTimeoutSeconds: ragTimeoutSeconds,
        insecureTLS: insecureTLS,
        caCertPath: caCertPath
    )
}

// MARK: - host.json discovery

private struct HostJson: Decodable {
    var secured: Bool
    var webtransport: Bool?
    var objects: [String: detail.ObjectId]
}

// Note: unlike the NPRPC connection itself (whose TLS trust is configured
// below via RpcBuilder.enableSslClientSelfSignedCert/disableSslClientVerification,
// implemented in the C++ core), this plain host.json fetch goes through
// Foundation's URLSession, and swift-corelibs-foundation on Linux has no
// public API to bypass/customize certificate validation per-request
// (URLProtectionSpace.serverTrust is a Darwin-only API, unavailable here).
// This is a non-issue for the real deployment target (a public server with
// a normal CA-issued cert — default validation just works); for local
// testing against a self-signed dev server, trust that cert at the OS level
// inside this container instead (e.g. drop it into
// /usr/local/share/ca-certificates/ and run update-ca-certificates), rather
// than trying to bypass validation in-process.
private func fetchHostJson(serverURL: URL) async throws -> HostJson {
    let url = serverURL.appendingPathComponent("host.json")
    let session = URLSession(configuration: .ephemeral)
    let (data, response) = try await session.data(from: url)
    if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
        throw RelayError.httpStatus(http.statusCode)
    }
    return try JSONDecoder().decode(HostJson.self, from: data)
}

/// Prefers a secure WebSocket endpoint over plain ws/tcp/mem — `select_endpoint()`
/// otherwise ranks unencrypted/same-machine transports first, which is wrong
/// once this worker is dialing a public server over the internet rather than
/// loopback. Requires the server's --hostname to be a real, resolvable
/// address matching its TLS certificate (see README) — host.json just
/// echoes that hostname verbatim into these URLs.
private func preferringWss(_ objectId: detail.ObjectId) -> detail.ObjectId {
    var oid = objectId
    let wssURLs = oid.urls.split(separator: ";").filter { $0.hasPrefix("wss://") }
    if !wssURLs.isEmpty {
        oid.urls = wssURLs.map { "\($0);" }.joined()
    }
    return oid
}

// MARK: - Connection loop

private func connectOnce(config: WorkerConfig) async throws {
    wlog("I", "fetching host.json from \(config.serverURL.absoluteString)")
    let hostJson = try await fetchHostJson(serverURL: config.serverURL)
    guard var computeChannelOid = hostJson.objects["compute_channel"] else {
        throw WorkerConfigError.missingRequired("server host.json has no 'compute_channel' object — is the server built with ComputeChannel support and a --compute-worker-token configured?")
    }
    computeChannelOid = preferringWss(computeChannelOid)

    let builder = RpcBuilder().setLogLevel(.warn)
    if let caCertPath = config.caCertPath {
        _ = builder.enableSslClientSelfSignedCert(caCertPath)
    } else if config.insecureTLS {
        _ = builder.disableSslClientVerification()
    }
    let rpc = try builder.build()
    try rpc.startThreadPool(2)

    guard let object = NPRPCObject.fromObjectId(computeChannelOid) else {
        throw WorkerConfigError.invalidValue("compute_channel", "could not construct object reference")
    }
    guard let computeChannel = narrow(object, to: ComputeChannel.self) else {
        throw WorkerConfigError.invalidValue("compute_channel", "class id mismatch")
    }

    wlog("I", "connecting compute channel...")
    let stream = try computeChannel.connect(worker_token: config.workerToken)
    wlog("I", "compute channel connected — waiting for jobs")

    for try await job in stream.reader {
        switch job.kind {
        case .OllamaChatStream:
            Task {
                await handleOllamaChatStreamJob(
                    job,
                    ollamaBaseURL: config.ollamaHost,
                    writer: stream.writer,
                    timeoutSeconds: config.ollamaTimeoutSeconds
                )
            }
        case .RagSearch:
            guard let ragHost = config.ragHost else {
                wlog("W", "job \(job.job_id): RagSearch requested but no --rag-host configured")
                await stream.writer.write(ComputeJobResult(
                    job_id: job.job_id,
                    status: .Error,
                    chunk_json: nil,
                    error_message: "This worker has no --rag-host configured."
                ))
                continue
            }
            Task {
                await handleRagSearchJob(
                    job,
                    ragBaseURL: ragHost,
                    writer: stream.writer,
                    timeoutSeconds: config.ragTimeoutSeconds
                )
            }
        }
    }

    wlog("W", "compute channel stream ended")
}

@main
struct ComputeWorkerApp {
    static func main() async {
        let config: WorkerConfig
        do {
            config = try parseWorkerConfig()
        } catch {
            FileHandle.standardError.write(Data("Fatal: \(error)\n".utf8))
            exit(1)
        }

        wlog("I", "starting — server=\(config.serverURL.absoluteString) ollama=\(config.ollamaHost.absoluteString) rag=\(config.ragHost?.absoluteString ?? "(disabled)")")

        var backoffSeconds: TimeInterval = 2
        let maxBackoffSeconds: TimeInterval = 30
        while true {
            do {
                try await connectOnce(config: config)
                backoffSeconds = 2 // reset after a clean session
            } catch {
                wlog("E", "connection failed: \(error)")
            }
            wlog("I", "reconnecting in \(Int(backoffSeconds))s...")
            try? await Task.sleep(nanoseconds: UInt64(backoffSeconds * 1_000_000_000))
            backoffSeconds = min(backoffSeconds * 2, maxBackoffSeconds)
        }
    }
}
