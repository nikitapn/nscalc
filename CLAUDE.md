# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

NSCalc is a hydroponics nutrient-solution calculator with an integrated
"grow journal" (crop story timelines, image/video uploads, live watch
stream). Swift backend, Svelte/TS frontend, communicating over NPRPC (a
custom binary RPC protocol supporting WebSocket/HTTP3/WebTransport, defined
in `../nprpc` and symlinked into this repo at `external/nprpc`).

## Everything Swift-related builds inside Docker

There is no working host Swift toolchain for this project (Arch GCC-15 /
Foundation header issues) — `swift build`, SourceKit-LSP, and `npidl` (the
IDL compiler) all run inside the `nscalc-builder:latest` container, built
from `docker/Dockerfile.dev`. Don't try to invoke `swift` directly on the
host.

## Commands

A `justfile` wraps everything below as discoverable recipes (`just --list`;
e.g. `just build-server`, `just run-server --ollama-model qwen3.5:latest`).
It's a thin pass-through over these same scripts, not a replacement — the
scripts remain the source of truth.

```bash
./scripts/build-dev-image.sh              # build the nscalc-builder:latest image (do this first, once)
python3 scripts/gen_stubs.py              # regenerate NPRPC stubs (TS + Swift) from idl/*.npidl
python3 scripts/gen_stubs.py --ts         # ...TypeScript only -> client/src/rpc/
python3 scripts/gen_stubs.py --swift      # ...Swift only -> server/Sources/NScalc/
./scripts/build-swift-server.sh           # gen_stubs.py + swift build -c release, inside Docker
./scripts/build-swift-server.sh --debug   # debug build
./scripts/build-swift-server.sh --no-gen  # skip stub regen, just build
./scripts/run-swift-server.sh             # run the built server in Docker (https://localhost:8443)
./scripts/run-swift-server.sh --debug     # run under gdb
./scripts/run_chrome.sh                   # launch Chromium with the dev self-signed cert pre-trusted
./scripts/reset-dev-auth.sh               # reset local SQLite dev credentials
```

Client (run from `client/`):
```bash
npm run dev       # vite dev server (proxies /host.json and /mock to the Swift server, default localhost:8443)
npm run build     # vite build
npm run check     # svelte-check + tsc -p tsconfig.node.json — the closest thing to a typecheck/lint gate
```

There is no automated test suite in this repo (server or client) as of now — don't assume `npm test` or `swift test` targets exist.

Production packaging/deploy (see README for full flag list):
```bash
./scripts/package_prod.sh     # build a release bundle tarball
./scripts/smoke_prod.sh       # smoke-test the prod Docker image locally
./scripts/deploy.sh --ssh ... --hostname ... --cert-dir ... --dh-params ... --port 443
```

AI assistant / RAG / compute-worker (see "AI assistant, RAG, and the
compute-worker relay" under Architecture):
```bash
./scripts/build-compute-worker.sh      # build compute-worker/ inside Docker
./scripts/run-compute-worker-test.sh   # run it against a local test server (hardcoded config — read the script)
cd rag && .venv/bin/python serve.py    # start the RAG HTTP bridge (needs rag/docker-compose.yml's postgres up)
```

## Architecture

**IDL is the source of truth for the client/server contract.** `idl/*.npidl`
defines messages/enums/interfaces once; `scripts/gen_stubs.py` (via `npidl`
in Docker) generates both `client/src/rpc/*.ts` and
`server/Sources/NScalc/*.swift`. Both output directories are gitignored
(`server/Sources/NScalc/*.swift`, `client/src/rpc/*`) — they exist on disk
but aren't checked in, so after a fresh clone (or after editing an
`.npidl` file) you must run `gen_stubs.py` before building either side or
the generated types won't exist/be stale.

- `idl/nscalc.npidl` — calculator/auth/chat/realtime domain (`Solution`,
  `Fertilizer`, `Calculation`, `Authorizator`, `RegisteredUser`, `Calculator`,
  `Chat`, `Realtime`, `SiteEventService`), plus the AI assistant/compute
  relay (`AssistantService`, `ComputeChannel` — see the architecture section
  below).
- `idl/grow_journal.npidl` — grow journal domain (`JournalService`,
  `UploadService`, `StoryStreamService`, `MediaService`). Note:
  `docs/GROW_JOURNAL_DESIGN.md` is the original design doc and says this is
  a draft "not wired into gen_stubs.py yet" — that's now stale, it *is*
  wired in and fully implemented server-side (`GrowJournal.swift`,
  `GrowJournalVideoProcessing.swift`) and client-side (`journalRpc.ts`,
  `Journal.svelte`). Treat the doc as historical background, not current state.

**Server** (`server/Sources/NScalcServer/`, Swift 6, `swift-tools-version: 6.0`):
- `main.swift` — parses CLI flags / `NSCALC_*` env vars, opens the SQLite DB,
  builds the NPRPC server (`RpcBuilder`), and activates one servant per
  interface on a shared POA with fixed object IDs (0=calculator, 1=authorizator,
  4=chat, 5=realtime, 6=journal, 7=journal_uploads, 8=journal_stream,
  9=journal_media, 10=site_events, 11=assistant, 12=compute_channel). These
  names are what `host.json` exposes and what the client looks up by name
  (see `getNscalcRpc`/`getJournalRpc` patterns) — if you add a new servant,
  activate it here and add it to `host.json` via `rpc.addToHostJson`.
- `Database/AppDatabase.swift` — GRDB `DatabaseQueue` wrapper; all schema
  changes go through `DatabaseMigrator` migrations registered here in order
  (`v1` initial schema, `v2_fertilizer_parsed_fields`, `v3_grow_journal`,
  `v4_grow_journal_recovery`, `v5_site_events`, `v6_fertilizer_purity_fix` —
  re-parses stored fertilizer formulas because `formula X purity Y` used to
  be a no-op, see `FertilizerFormulaParser.swift`). Add new migrations rather
  than editing old ones; `database/create.sql` mirrors `v1` for reference
  only and is not itself executed.
  `*Record.swift` files are the GRDB row types per table; `*Service`-style
  logic (solutions/fertilizers/calculations) sits alongside them.
- `GrowJournal.swift` / `GrowJournalVideoProcessing.swift` — the largest
  server files; story/update/media CRUD plus the video upload -> background
  transcode -> DASH packaging pipeline (ffmpeg + MP4Box), matching the flow
  documented in `docs/GROW_JOURNAL_DESIGN.md`.
- `Authorizator.swift` / `RegisteredUser.swift` — login/session/registration
  and per-user calculator mutations.
- Interop: RPC-generated types live in the separate `NScalc` target and are
  imported explicitly (`import NScalc`); both targets use
  `.interoperabilityMode(.Cxx)` since NPRPC's Swift bindings bridge a C++
  runtime (`/opt/nprpc_swift`, `/opt/nprpc` inside the Docker image).

**Client** (`client/src/`, Svelte 5 + TS + Vite + Tailwind v4):
- `App.svelte` — single shell owning view routing (a `currentView` union,
  not a router library), auth state, session-cookie restore, i18n locale,
  and the seasonal "site event" admin panel (fireworks/snow/petals overlays
  driven by server-persisted config via `SiteEventService`).
- `view/*.svelte` — one component per top-level view (Calculator, Solutions,
  Fertilizers, Journal). `Solution.svelte` and `Fertilizers.svelte` are the
  editable-catalog views; `Journal.svelte` is the grow-journal UI.
- `lib/nscalcRpc.ts` / `lib/journalRpc.ts` — lazily-initialized singleton
  RPC contexts. Pattern: `NPRPC.init()` once, then
  `NPRPC.narrow(rpc.host_info.objects[name], InterfaceType)` per interface —
  `name` must match what `main.swift` registered in `host.json`.
  `lib/calculatorEngine.ts` / `lib/calculatorPdf.ts` / `lib/catalogRpcCache.ts`
  hold calculation math and PDF export, decoupled from the RPC layer.
- `lib/i18n.ts` — all user-facing copy (`en`/`ru`) lives here as a
  translation table (`copy = translations[locale]`), not inline in
  components; when adding UI text, add it to both locales here rather than
  hardcoding strings in a `.svelte` file.
- Path aliases (`vite.config.ts` + `tsconfig.json`): `@/` → `client/src/`,
  `@rpc/` → `client/src/rpc/` (generated stubs), `nprpc` → the built ESM
  bundle at `external/nprpc/nprpc_js/dist/`. `external/nprpc` is a symlink
  to a sibling `../nprpc` checkout outside this repo — it must exist on disk
  for both the client build and Swift build to resolve.
- Dev server proxies `/host.json` and `/mock` to the Swift server
  (`NSCALC_SWIFT_PROXY_TARGET`, default `http://localhost:8443`), so run the
  Swift server alongside `npm run dev` for the RPC calls to resolve.

**AI assistant, RAG, and the compute-worker relay** — a crop-advice assistant
built on top of the existing NPRPC server, not (yet) covered by the README:
- `AssistantService` (`idl/nscalc.npidl`, `server/Sources/NScalcServer/AssistantService.swift`)
  is a `bidi_stream` interface (`AssistantAsk`/`AssistantEvent`, statuses
  `Thinking`/`ToolCall`/`Token`/`Done`/`Error`) running a tool-calling loop
  against Ollama's `/api/chat`, streaming tokens back live. Tools call
  straight into existing services instead of duplicating logic:
  `create_solution`/`update_solution`/`list_my_solutions` → `SolutionService`,
  `create_fertilizer`/`update_fertilizer`/`list_my_fertilizers` →
  `FertilizerService` (goes through the real `FertilizerFormulaParser`, so a
  bad LLM-generated formula is rejected and the model retries rather than
  corrupting data), `search_growing_guides` → the RAG bridge below. Supports
  vision (a fertilizer-label photo → `AssistantImage` base64 → Ollama's
  vision input).
- `OllamaClient.swift` is hand-rolled around real Linux Foundation gaps:
  `URLSession.bytes(for:)` and `URLProtectionSpace.serverTrust` are both
  *unavailable* in swift-corelibs-foundation, so streaming uses a
  `URLSessionDataDelegate` bridged to `AsyncThrowingStream` instead of the
  modern async API. `--ollama-num-ctx` matters — Ollama's default context
  window (~2048-4096) is much smaller than a model's architectural max and
  silently truncates long conversations once exceeded (visible as
  `truncated = 1` in Ollama's own logs) unless raised.
- Poor man's RAG, running on a laptop via the compute broker (below):
  `rag/` is a separate Python project (its own `.venv`, sibling to the Swift
  code) — growing-guide PDFs → `docling` → chunked → embedded with
  `Qwen/Qwen3-Embedding-0.6B` → pgvector (`rag/docker-compose.yml`'s
  `nscalc-rag-postgres` container). `rag/serve.py` is a stdlib-only HTTP
  bridge (`POST /search`) since Swift has no embedding-model/pgvector
  equivalent; `RagClient.swift` calls it the same way `OllamaClient.swift`
  calls Ollama.
- `compute-worker/` (a separate Swift package + Dockerfile, sibling to
  `server/`, own generated `NScalc` stubs via `gen_stubs.py`) solves running
  Ollama/RAG on a NAT'd machine (a laptop) while `server/` runs on a public
  VPS: the worker dials *out* to the server — the server can't dial in past
  NAT — via a second `bidi_stream`, `ComputeChannel.Connect(worker_token)`,
  and relays raw JSON HTTP request/response bodies both ways without
  knowing Ollama's or the RAG bridge's schema at all (see the comment above
  `ComputeChannel` in `idl/nscalc.npidl`). Auth is a shared-secret token
  (`--compute-worker-token` on the server; unset means the channel refuses
  all connections, closed by default, not an open relay). `ComputeBroker`
  (`server/Sources/NScalcServer/ComputeBroker.swift`) is the actor
  multiplexing in-flight jobs over the one worker connection by job id;
  `AssistantStore` prefers a connected worker over any direct
  `--ollama-host`/`--rag-host` when one's live, falling back to direct HTTP
  otherwise — local dev without a worker still works unchanged.

## Data flow for a typical feature

Add/modify a message or interface in the relevant `idl/*.npidl` → run
`gen_stubs.py` → implement the servant method in the matching
`server/Sources/NScalcServer/*.swift` file (backed by a GRDB migration/record
if persisted) → register the servant/object in `main.swift` if it's new →
consume it from the client through the relevant `lib/*Rpc.ts` context and a
`view/*.svelte` component, adding any new copy to `lib/i18n.ts`.
