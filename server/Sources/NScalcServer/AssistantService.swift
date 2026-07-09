// Copyright (c) 2026 nikitapnn1@gmail.com
// AI crop assistant — Ollama tool-calling loop that creates/updates target
// nutrient Solutions on behalf of the logged-in user. Structured like
// SiteEvents.swift: a private store holding the logic, and a thin servant
// wrapper.

import Foundation
import NPRPC
import NScalc

@inline(__always)
private func aslog(_ level: String = "I", _ message: String) {
    nplog(level, message, component: "Assistant")
}

private func isTimeoutError(_ error: Error) -> Bool {
    (error as? URLError)?.code == .timedOut
}

private enum AssistantBackendError: LocalizedError, Sendable {
    case notConfigured

    var errorDescription: String? {
        switch self {
        case .notConfigured:
            return "not configured (no direct connection or compute worker available)"
        }
    }
}

private func formatSeconds(_ seconds: TimeInterval) -> String {
    String(format: "%.1fs", seconds)
}

// MARK: - Tool schemas

private func elementProperties() -> [String: JSONValue] {
    var props: [String: JSONValue] = [:]
    for column in elementColumns {
        props[column] = .object([
            "type": .string("number"),
            "description": .string("Target \(column) concentration in ppm (mg/L)."),
        ])
    }
    return props
}

private func elementsSchema(requireAll: Bool) -> JSONValue {
    .object([
        "type": .string("object"),
        "description": .string("Target nutrient concentrations in ppm, keyed by element name."),
        "properties": .object(elementProperties()),
        "required": requireAll ? .array(elementColumns.map { .string($0) }) : .array([]),
    ])
}

private func orderedElementValues(_ dict: [String: JSONValue]) -> [Double] {
    elementColumns.map { dict[$0]?.doubleValue ?? 0 }
}

private enum AssistantTools {
    static let listMySolutions = OllamaTool(function: OllamaToolFunction(
        name: "list_my_solutions",
        description: "List the current user's existing target nutrient solutions (id, name, and current ppm values). Call this before creating a new solution to check whether a similar one already exists, or to find the id of a solution to update.",
        parameters: .object([
            "type": .string("object"),
            "properties": .object([:]),
            "required": .array([]),
        ])
    ))

    static let createSolution = OllamaTool(function: OllamaToolFunction(
        name: "create_solution",
        description: "Create a new target nutrient solution (ppm profile) for a crop.",
        parameters: .object([
            "type": .string("object"),
            "properties": .object([
                "name": .object([
                    "type": .string("string"),
                    "description": .string("Short descriptive name, e.g. 'Lettuce - Vegetative'."),
                ]),
                "elements": elementsSchema(requireAll: true),
            ]),
            "required": .array([.string("name"), .string("elements")]),
        ])
    ))

    static let updateSolution = OllamaTool(function: OllamaToolFunction(
        name: "update_solution",
        description: "Update an existing target nutrient solution's name and/or ppm values. Only include the fields you want to change.",
        parameters: .object([
            "type": .string("object"),
            "properties": .object([
                "id": .object([
                    "type": .string("integer"),
                    "description": .string("The solution id, from list_my_solutions."),
                ]),
                "name": .object([
                    "type": .string("string"),
                    "description": .string("New name, if changing it."),
                ]),
                "elements": elementsSchema(requireAll: false),
            ]),
            "required": .array([.string("id")]),
        ])
    ))

    static let listMyFertilizers = OllamaTool(function: OllamaToolFunction(
        name: "list_my_fertilizers",
        description: "List the current user's existing fertilizer products (id, name, formula script, and derived nutrient percentages). Call this before creating a new fertilizer to check whether a similar one already exists, or to find the id of a fertilizer to update.",
        parameters: .object([
            "type": .string("object"),
            "properties": .object([:]),
            "required": .array([]),
        ])
    ))

    static let createFertilizer = OllamaTool(function: OllamaToolFunction(
        name: "create_fertilizer",
        description: "Create a new fertilizer product from its guaranteed-analysis label. `formula` must be a script in the fertilizer DSL described in your instructions — it is run through a chemistry parser that validates it before saving, so if it's rejected, fix the formula and call this again.",
        parameters: .object([
            "type": .string("object"),
            "properties": .object([
                "name": .object([
                    "type": .string("string"),
                    "description": .string("Product name, e.g. 'MasterBlend 4-18-38 Tomato'."),
                ]),
                "formula": .object([
                    "type": .string("string"),
                    "description": .string("Formula script in the fertilizer DSL, derived from the label's guaranteed analysis."),
                ]),
            ]),
            "required": .array([.string("name"), .string("formula")]),
        ])
    ))

    static let updateFertilizer = OllamaTool(function: OllamaToolFunction(
        name: "update_fertilizer",
        description: "Update an existing fertilizer's name and/or formula script. Only include the fields you want to change; the formula (if provided) is re-validated by the same chemistry parser as create_fertilizer.",
        parameters: .object([
            "type": .string("object"),
            "properties": .object([
                "id": .object([
                    "type": .string("integer"),
                    "description": .string("The fertilizer id, from list_my_fertilizers."),
                ]),
                "name": .object([
                    "type": .string("string"),
                    "description": .string("New name, if changing it."),
                ]),
                "formula": .object([
                    "type": .string("string"),
                    "description": .string("New formula script, if changing it."),
                ]),
            ]),
            "required": .array([.string("id")]),
        ])
    ))

    static let searchGrowingGuides = OllamaTool(function: OllamaToolFunction(
        name: "search_growing_guides",
        description: "Search a reference library of nutrient-solution and crop-specific growing guides for passages relevant to a question. Use this for general horticultural/nutrition questions — not just when creating a solution or fertilizer. Returns excerpts with source/heading/page — cite them in your answer.",
        parameters: .object([
            "type": .string("object"),
            "properties": .object([
                "query": .object([
                    "type": .string("string"),
                    "description": .string("A natural-language question or topic to search for."),
                ]),
            ]),
            "required": .array([.string("query")]),
        ])
    ))

    static let base: [OllamaTool] = [
        listMySolutions, createSolution, updateSolution,
        listMyFertilizers, createFertilizer, updateFertilizer,
    ]

    static func active(ragEnabled: Bool) -> [OllamaTool] {
        ragEnabled ? base + [searchGrowingGuides] : base
    }
}

// MARK: - AssistantStore

private struct AssistantStore: Sendable {
    private let sessionService: SessionService
    private let solutionService: SolutionService
    private let fertilizerService: FertilizerService
    private let ollama: OllamaClient?
    private let ollamaModel: String?
    private let ollamaNumCtx: Int?
    private let ragClient: RagClient?
    private let computeBroker: ComputeBroker?
    private let maxRounds = 4

    private static let systemPrompt = """
        You are a hydroponics nutrient assistant for NScalc. When a user describes a crop and \
        growth stage, propose a target nutrient solution (ppm profile) using domain knowledge, and \
        use the provided tools to create or update it. The 14 elements are NO3, NH4, P, K, Ca, Mg, \
        S, Cl, Fe, Zn, B, Mn, Cu, Mo (all values in ppm / mg per liter). Prefer updating an existing \
        solution with a similar name over creating a duplicate — call list_my_solutions first if \
        unsure whether one already exists.

        If the user attaches a photo of a fertilizer bag or bottle, read its guaranteed-analysis \
        label and use create_fertilizer (or update_fertilizer, if list_my_fertilizers shows a close \
        match already exists) to save it. The `formula` argument is a small DSL, validated by a real \
        chemistry parser before saving — if it's rejected, read the error and retry with a corrected \
        formula rather than giving up. Grammar:
        - Statements are separated by `;`. `//` starts a line comment.
        - Direct percent-of-product assignment: `<Key> := <percent>;` where Key is one of \
          N-NO3, N-NH4, P, K, Ca, Mg, S, Cl, Fe, Zn, B, Mn, Cu, Mo. Use this only when the label \
          states an elemental percentage directly (uncommon).
        - Chemical-formula statement: `formula <ChemicalFormula> purity <percent>;` — parses a \
          molecular/oxide formula (atoms + optional parentheses/counts/hydrates like `MgSO4 * 7H2O`) \
          and converts it to elemental percent, then scales by `purity` = what percent of the whole \
          product's weight this compound makes up. This is the right form for the classic \
          guaranteed-analysis oxide notation almost every fertilizer label uses: phosphate as P2O5, \
          potash as K2O, and sometimes MgO/CaO/SO3. Use one `formula ... purity N;` statement per \
          label line.
        - Supported formula elements: H, B, C, N, O, Na, Mg, Al, Si, P, S, Cl, K, Ca, Mn, Fe, Co, Ni, \
          Cu, Zn, Mo, Ag. Only P, K, Ca, Mg, S, Cl, Fe, Zn, B, Mn, Cu, Mo, and N (auto-split into \
          N-NO3/N-NH4 from the formula's NO3/NH4/NH2 groups) map to tracked nutrients — others (O, Na, \
          Al, Si, Co, Ni, Ag) are only used for molecular-mass bookkeeping (e.g. the O in P2O5).
        - Each nutrient can only be set once across the whole script (by a direct assignment or by \
          exactly one formula statement) — don't state the same nutrient twice.
        - Optional metadata: `bottle := A|B|C;`, `cost := <number>;`, `density := <number>;` (marks a \
          liquid concentrate) or `solution := <number>;` (marks a pre-made nutrient solution).

        Worked example — a label reading "Total N 4% (3.5% nitrate, 0.5% ammoniacal), Available \
        Phosphate (P2O5) 18%, Soluble Potash (K2O) 38%", plus micronutrients:
        ```
        N-NO3 := 3.5;
        N-NH4 := 0.5;
        formula P2O5 purity 18;
        formula K2O purity 38;
        Mg := 0.5;
        B := 0.2;
        S := 6.1;
        ```

        You also have access to a reference library (nutrient-solution guides and crop-specific \
        growing guides) via search_growing_guides. Use it for general horticultural or nutrition \
        questions — not only when creating a solution or fertilizer — whenever your own knowledge \
        might be incomplete, outdated, or crop-specific. When you use a passage from it, cite it \
        inline like "(Source: <source>, <heading>, p. <page>)" using the fields the tool returns — \
        don't present retrieved facts as if they were your own general knowledge. If nothing relevant \
        comes back, say so and answer from your own knowledge instead of forcing a citation.

        Always finish with a short plain-language summary of what you did and why, written for the \
        end user.
        """

    init(
        db: AppDatabase,
        ollamaHost: String?,
        ollamaModel: String?,
        ollamaTimeoutSeconds: TimeInterval,
        ollamaNumCtx: Int?,
        ragHost: String?,
        ragTimeoutSeconds: TimeInterval,
        computeBroker: ComputeBroker?
    ) {
        self.sessionService = SessionService(db: db)
        self.solutionService = SolutionService(db: db)
        self.fertilizerService = FertilizerService(db: db)
        self.ollamaModel = (ollamaModel?.isEmpty == false) ? ollamaModel : nil
        self.ollamaNumCtx = ollamaNumCtx
        if let ollamaHost, let url = URL(string: ollamaHost), let ollamaModel, !ollamaModel.isEmpty {
            self.ollama = OllamaClient(baseURL: url, model: ollamaModel, timeoutSeconds: ollamaTimeoutSeconds, numCtx: ollamaNumCtx)
        } else {
            self.ollama = nil
        }
        if let ragHost, let url = URL(string: ragHost) {
            self.ragClient = RagClient(baseURL: url, timeoutSeconds: ragTimeoutSeconds)
        } else {
            self.ragClient = nil
        }
        self.computeBroker = computeBroker
    }

    /// Prefers a connected compute worker (relay) over a direct Ollama HTTP
    /// connection when both are available — the worker is what makes this
    /// work when Ollama sits behind NAT (e.g. on a laptop) and can't be
    /// dialed into directly from this server.
    private func chat(
        messages: [OllamaMessage],
        tools: [OllamaTool],
        workerAvailable: Bool,
        onToken: @Sendable (String) async -> Void
    ) async throws -> OllamaMessage {
        if workerAvailable, let computeBroker, let ollamaModel {
            return try await computeBroker.relayOllamaChatStream(
                model: ollamaModel,
                messages: messages,
                tools: tools,
                numCtx: ollamaNumCtx,
                onToken: onToken
            )
        }
        guard let ollama else {
            throw AssistantBackendError.notConfigured
        }
        return try await ollama.chatStream(messages: messages, tools: tools, onToken: onToken)
    }

    private func ragSearch(query: String, workerAvailable: Bool) async throws -> [RagChunk] {
        if workerAvailable, let computeBroker {
            return try await computeBroker.relayRagSearch(query: query)
        }
        guard let ragClient else {
            throw AssistantBackendError.notConfigured
        }
        return try await ragClient.search(query: query)
    }

    /// Processes one `AssistantAsk`, emitting progress/result events as they
    /// happen (rather than one blocking response) so the client sees feedback
    /// even while a slow model is still thinking. `emit` is called from this
    /// function's own async context — the caller (the servant) just forwards
    /// each event to its stream writer.
    func handle(ask: AssistantAsk, sessionId: String, emit: @Sendable (AssistantEvent) async -> Void) async {
        let askStart = Date()
        aslog("I", "ask \(ask.request_id) started (prompt_len=\(ask.prompt.count), has_image=\(ask.image != nil))")

        let workerAvailable = await computeBroker?.hasWorker ?? false
        guard ollama != nil || (workerAvailable && ollamaModel != nil) else {
            aslog("E", "ask \(ask.request_id) rejected: assistant not configured")
            await emit(AssistantEvent(
                request_id: ask.request_id,
                status: .Error,
                detail: "AI assistant is not configured (missing --ollama-model, and no direct --ollama-host or connected compute worker).",
                solution: nil,
                fertilizer: nil
            ))
            return
        }
        guard let user = try? sessionService.user(forSession: sessionId), let userId = user.id else {
            aslog("E", "ask \(ask.request_id) rejected: invalid or expired session")
            await emit(AssistantEvent(request_id: ask.request_id, status: .Error, detail: "Please log in again.", solution: nil, fertilizer: nil))
            return
        }

        await emit(AssistantEvent(request_id: ask.request_id, status: .Thinking, detail: nil, solution: nil, fertilizer: nil))

        var userMessage = OllamaMessage(role: "user", content: ask.prompt)
        if let image = ask.image {
            userMessage.images = [Data(image.data).base64EncodedString()]
        }
        var messages: [OllamaMessage] = [
            OllamaMessage(role: "system", content: Self.systemPrompt),
            userMessage,
        ]
        var lastTouchedSolution: SolutionRecord?
        var lastTouchedFertilizer: FertilizerRecord?
        let ragEnabled = ragClient != nil || workerAvailable

        for round in 0..<maxRounds {
            let roundStart = Date()
            let reply: OllamaMessage
            do {
                reply = try await chat(
                    messages: messages,
                    tools: AssistantTools.active(ragEnabled: ragEnabled),
                    workerAvailable: workerAvailable
                ) { token in
                    await emit(AssistantEvent(request_id: ask.request_id, status: .Token, detail: token, solution: nil, fertilizer: nil))
                }
            } catch {
                let elapsed = Date().timeIntervalSince(roundStart)
                if isTimeoutError(error) {
                    aslog("E", "ask \(ask.request_id) round \(round) TIMED OUT after \(formatSeconds(elapsed)) — model may be stuck or overloaded")
                    await emit(AssistantEvent(
                        request_id: ask.request_id,
                        status: .Error,
                        detail: "The AI model timed out after \(formatSeconds(elapsed)) without responding — it may be stuck or overloaded. Try again, or use a faster/smaller model.",
                        solution: nil,
                        fertilizer: nil
                    ))
                } else {
                    aslog("E", "ask \(ask.request_id) round \(round) failed after \(formatSeconds(elapsed)): \(error)")
                    await emit(AssistantEvent(
                        request_id: ask.request_id,
                        status: .Error,
                        detail: "Could not reach the AI assistant: \(error.localizedDescription)",
                        solution: nil,
                        fertilizer: nil
                    ))
                }
                return
            }
            let roundElapsed = Date().timeIntervalSince(roundStart)
            aslog("I", "ask \(ask.request_id) round \(round) completed in \(formatSeconds(roundElapsed)) (tool_calls=\(reply.tool_calls?.count ?? 0))")

            guard let calls = reply.tool_calls, !calls.isEmpty else {
                aslog("I", "ask \(ask.request_id) done in \(formatSeconds(Date().timeIntervalSince(askStart)))")
                await emit(AssistantEvent(
                    request_id: ask.request_id,
                    status: .Done,
                    detail: reply.content,
                    solution: lastTouchedSolution?.toRpc(),
                    fertilizer: lastTouchedFertilizer?.toRpc()
                ))
                return
            }

            messages.append(reply)
            for call in calls {
                aslog("I", "ask \(ask.request_id) calling tool \(call.function.name)")
                await emit(AssistantEvent(request_id: ask.request_id, status: .ToolCall, detail: call.function.name, solution: nil, fertilizer: nil))
                let toolStart = Date()
                let resultJSON = await executeTool(
                    call,
                    userId: userId,
                    user: user,
                    workerAvailable: workerAvailable,
                    lastTouchedSolution: &lastTouchedSolution,
                    lastTouchedFertilizer: &lastTouchedFertilizer
                )
                aslog("D", "ask \(ask.request_id) tool \(call.function.name) finished in \(formatSeconds(Date().timeIntervalSince(toolStart))): \(resultJSON)")
                messages.append(OllamaMessage(role: "tool", content: resultJSON, tool_name: call.function.name))
            }

            if round == maxRounds - 1 {
                aslog("W", "ask \(ask.request_id) exhausted \(maxRounds) rounds without a final answer")
                await emit(AssistantEvent(
                    request_id: ask.request_id,
                    status: .Done,
                    detail: "I made some changes but ran out of turns to summarize — check your Solutions/Fertilizers list.",
                    solution: lastTouchedSolution?.toRpc(),
                    fertilizer: lastTouchedFertilizer?.toRpc()
                ))
            }
        }
    }

    // MARK: Tool dispatch

    private func executeTool(
        _ call: OllamaToolCall,
        userId: Int64,
        user: UserRecord,
        workerAvailable: Bool,
        lastTouchedSolution: inout SolutionRecord?,
        lastTouchedFertilizer: inout FertilizerRecord?
    ) async -> String {
        switch call.function.name {
        case "list_my_solutions":
            return listSolutions(user: user)
        case "create_solution":
            return createSolution(call.function.arguments, userId: userId, lastTouchedSolution: &lastTouchedSolution)
        case "update_solution":
            return updateSolution(call.function.arguments, userId: userId, lastTouchedSolution: &lastTouchedSolution)
        case "list_my_fertilizers":
            return listFertilizers(user: user)
        case "create_fertilizer":
            return createFertilizer(call.function.arguments, userId: userId, lastTouchedFertilizer: &lastTouchedFertilizer)
        case "update_fertilizer":
            return updateFertilizer(call.function.arguments, userId: userId, lastTouchedFertilizer: &lastTouchedFertilizer)
        case "search_growing_guides":
            return await searchGrowingGuides(call.function.arguments, workerAvailable: workerAvailable)
        default:
            return jsonString(["error": "Unknown tool '\(call.function.name)'."])
        }
    }

    private func listSolutions(user: UserRecord) -> String {
        do {
            let page = try solutionService.listPage(query: "", author: user.name, cursor: "", limit: 20)
            let items: [[String: Any]] = page.items.map { record in
                var elements: [String: Double] = [:]
                for (index, column) in elementColumns.enumerated() {
                    elements[column] = record.elements[index]
                }
                return ["id": record.id ?? 0, "name": record.name, "elements": elements]
            }
            return jsonString(["solutions": items])
        } catch {
            return jsonString(["error": "Could not list solutions: \(error.localizedDescription)"])
        }
    }

    private func createSolution(
        _ arguments: [String: JSONValue],
        userId: Int64,
        lastTouchedSolution: inout SolutionRecord?
    ) -> String {
        guard let name = arguments["name"]?.stringValue,
              !name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        else {
            return jsonString(["error": "Missing or empty 'name'."])
        }
        guard let elementsDict = arguments["elements"]?.objectValue else {
            return jsonString(["error": "Missing 'elements' object."])
        }
        if let unknown = elementsDict.keys.first(where: { !elementColumns.contains($0) }) {
            return jsonString(["error": "Unknown element key '\(unknown)'. Valid keys: \(elementColumns.joined(separator: ", "))."])
        }

        do {
            let record = try solutionService.addSolution(userId: userId, name: name, elements: orderedElementValues(elementsDict))
            lastTouchedSolution = record
            return jsonString(["id": record.id ?? 0, "name": record.name, "status": "created"])
        } catch {
            return jsonString(["error": "Failed to create solution: \(error.localizedDescription)"])
        }
    }

    private func updateSolution(
        _ arguments: [String: JSONValue],
        userId: Int64,
        lastTouchedSolution: inout SolutionRecord?
    ) -> String {
        guard let idValue = arguments["id"]?.doubleValue else {
            return jsonString(["error": "Missing 'id'."])
        }
        let id = Int64(idValue)

        guard let existing = try? solutionService.getSolution(id: id), existing.userId == userId else {
            return jsonString(["error": "Solution \(id) not found or not owned by this user."])
        }

        do {
            if let name = arguments["name"]?.stringValue,
               !name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                try solutionService.updateName(id: id, userId: userId, name: name)
            }
            if let elementsDict = arguments["elements"]?.objectValue {
                if let unknown = elementsDict.keys.first(where: { !elementColumns.contains($0) }) {
                    return jsonString(["error": "Unknown element key '\(unknown)'. Valid keys: \(elementColumns.joined(separator: ", "))."])
                }
                let indexedValues: [(index: Int, value: Double)] = elementsDict.compactMap { key, value in
                    guard let index = elementColumns.firstIndex(of: key), let doubleValue = value.doubleValue else {
                        return nil
                    }
                    return (index: index, value: doubleValue)
                }
                if !indexedValues.isEmpty {
                    try solutionService.updateElements(id: id, userId: userId, indexedValues: indexedValues)
                }
            }
            let updated = try solutionService.getSolution(id: id)
            lastTouchedSolution = updated
            return jsonString(["id": id, "name": updated?.name ?? "", "status": "updated"])
        } catch {
            return jsonString(["error": "Failed to update solution: \(error.localizedDescription)"])
        }
    }

    private func listFertilizers(user: UserRecord) -> String {
        do {
            // FertilizerService.listPage has no author filter (unlike
            // SolutionService), so fetch a larger page and filter client-side.
            let page = try fertilizerService.listPage(query: "", cursor: "", limit: 60)
            let items: [[String: Any]] = page.items
                .filter { $0.userName == user.name }
                .prefix(20)
                .map { record in
                    var elements: [String: Double] = [:]
                    for (index, column) in elementColumns.enumerated() {
                        elements[column] = record.elements[index]
                    }
                    return ["id": record.id ?? 0, "name": record.name, "formula": record.formula, "elements": elements]
                }
            return jsonString(["fertilizers": items])
        } catch {
            return jsonString(["error": "Could not list fertilizers: \(error.localizedDescription)"])
        }
    }

    private func createFertilizer(
        _ arguments: [String: JSONValue],
        userId: Int64,
        lastTouchedFertilizer: inout FertilizerRecord?
    ) -> String {
        guard let name = arguments["name"]?.stringValue,
              !name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        else {
            return jsonString(["error": "Missing or empty 'name'."])
        }
        guard let formula = arguments["formula"]?.stringValue,
              !formula.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        else {
            return jsonString(["error": "Missing or empty 'formula'."])
        }

        do {
            let record = try fertilizerService.addFertilizer(userId: userId, name: name, formula: formula)
            lastTouchedFertilizer = record
            return jsonString(["id": record.id ?? 0, "name": record.name, "status": "created"])
        } catch let error as FertilizerValidationError {
            return jsonString(["error": "Formula rejected by parser: \(error.errorDescription ?? "invalid formula"). Fix the formula and try again."])
        } catch {
            return jsonString(["error": "Failed to create fertilizer: \(error.localizedDescription)"])
        }
    }

    private func updateFertilizer(
        _ arguments: [String: JSONValue],
        userId: Int64,
        lastTouchedFertilizer: inout FertilizerRecord?
    ) -> String {
        guard let idValue = arguments["id"]?.doubleValue else {
            return jsonString(["error": "Missing 'id'."])
        }
        let id = Int64(idValue)

        guard let existing = try? fertilizerService.getFertilizer(id: id), existing.userId == userId else {
            return jsonString(["error": "Fertilizer \(id) not found or not owned by this user."])
        }

        do {
            if let name = arguments["name"]?.stringValue,
               !name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                try fertilizerService.updateName(id: id, userId: userId, name: name)
            }
            if let formula = arguments["formula"]?.stringValue,
               !formula.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                try fertilizerService.updateFormula(id: id, userId: userId, formula: formula)
            }
            let updated = try fertilizerService.getFertilizer(id: id)
            lastTouchedFertilizer = updated
            return jsonString(["id": id, "name": updated?.name ?? "", "status": "updated"])
        } catch let error as FertilizerValidationError {
            return jsonString(["error": "Formula rejected by parser: \(error.errorDescription ?? "invalid formula"). Fix the formula and try again."])
        } catch {
            return jsonString(["error": "Failed to update fertilizer: \(error.localizedDescription)"])
        }
    }

    private func searchGrowingGuides(_ arguments: [String: JSONValue], workerAvailable: Bool) async -> String {
        guard let query = arguments["query"]?.stringValue,
              !query.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        else {
            return jsonString(["error": "Missing or empty 'query'."])
        }

        aslog("D", "search_growing_guides query: \(query)")

        do {
            let chunks = try await ragSearch(query: query, workerAvailable: workerAvailable)
            let items: [[String: Any]] = chunks.map { chunk in
                [
                    "source": chunk.source,
                    "headings": chunk.headings,
                    "pages": chunk.pages,
                    "text": chunk.text,
                    "score": chunk.score,
                ]
            }
            return jsonString(["results": items])
        } catch {
            return jsonString(["error": "Growing-guide search failed: \(error.localizedDescription)"])
        }
    }

    private func jsonString(_ value: [String: Any]) -> String {
        guard let data = try? JSONSerialization.data(withJSONObject: value) else {
            return "{}"
        }
        return String(data: data, encoding: .utf8) ?? "{}"
    }
}

// MARK: - AssistantServiceServantImpl

final class AssistantServiceServantImpl: AssistantServiceServant, @unchecked Sendable {
    private let store: AssistantStore

    init(
        db: AppDatabase,
        ollamaHost: String?,
        ollamaModel: String?,
        ollamaTimeoutSeconds: TimeInterval,
        ollamaNumCtx: Int?,
        ragHost: String?,
        ragTimeoutSeconds: TimeInterval,
        computeBroker: ComputeBroker?
    ) {
        self.store = AssistantStore(
            db: db,
            ollamaHost: ollamaHost,
            ollamaModel: ollamaModel,
            ollamaTimeoutSeconds: ollamaTimeoutSeconds,
            ollamaNumCtx: ollamaNumCtx,
            ragHost: ragHost,
            ragTimeoutSeconds: ragTimeoutSeconds,
            computeBroker: computeBroker
        )
        super.init()
    }

    override func connect(session_id: String, stream: NPRPCBidiStream<AssistantEvent, AssistantAsk>) async {
        aslog("I", "stream connected: \(session_id)")
        do {
            for try await ask in stream.reader {
                await store.handle(ask: ask, sessionId: session_id) { event in
                    await stream.writer.write(event)
                }
            }
        } catch {
            aslog("E", "stream failed for \(session_id): \(error)")
        }
        stream.writer.close()
        aslog("I", "stream closed: \(session_id)")
    }
}
