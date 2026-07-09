// swift-tools-version: 6.0
// NScalc Compute Worker — dials out to the nscalc server and relays
// Ollama/RAG HTTP calls to local services (e.g. Ollama behind NAT on a
// laptop). Build ONLY inside the nprpc-dev:latest Docker image where
// /opt/nprpc_swift is pre-installed — see server/Package.swift for the same
// convention this mirrors.

import PackageDescription

let package = Package(
    name: "ComputeWorker",
    platforms: [
        .macOS(.v13),
    ],
    dependencies: [
        .package(path: "/opt/nprpc_swift"),
    ],
    targets: [
        // Generated RPC stubs for idl/nscalc.npidl — compiled as a separate
        // module so ComputeWorker imports them explicitly (`import NScalc`),
        // mirroring server/Package.swift's NScalc target.
        .target(
            name: "NScalc",
            dependencies: [
                .product(name: "NPRPC", package: "nprpc_swift"),
            ],
            path: "Sources/NScalc",
            swiftSettings: [
                .interoperabilityMode(.Cxx),
            ]
        ),
        .executableTarget(
            name: "ComputeWorker",
            dependencies: [
                "NScalc",
                .product(name: "NPRPC", package: "nprpc_swift"),
            ],
            path: "Sources/ComputeWorker",
            swiftSettings: [
                .interoperabilityMode(.Cxx),
            ]
        ),
    ]
)
