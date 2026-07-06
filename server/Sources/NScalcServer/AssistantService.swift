// Copyright (c) 2026 nikitapnn1@gmail.com
// AI crop assistant — Ollama tool-calling loop that creates/updates target
// nutrient Solutions on behalf of the logged-in user. Structured like
// SiteEvents.swift: a private store holding the logic, and a thin servant
// wrapper.

import Foundation
import NPRPC
import NScalc

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

    static let all: [OllamaTool] = [listMySolutions, createSolution, updateSolution]
}

// MARK: - AssistantStore

private struct AssistantStore: Sendable {
    private let sessionService: SessionService
    private let solutionService: SolutionService
    private let ollama: OllamaClient?
    private let maxRounds = 4

    private static let systemPrompt = """
        You are a hydroponics nutrient assistant for NScalc. When a user describes a crop and \
        growth stage, propose a target nutrient solution (ppm profile) using domain knowledge, and \
        use the provided tools to create or update it. The 14 elements are NO3, NH4, P, K, Ca, Mg, \
        S, Cl, Fe, Zn, B, Mn, Cu, Mo (all values in ppm / mg per liter). Prefer updating an existing \
        solution with a similar name over creating a duplicate — call list_my_solutions first if \
        unsure whether one already exists. Always finish with a short plain-language summary of what \
        you did and why, written for the end user.
        """

    init(db: AppDatabase, ollamaHost: String?, ollamaModel: String?) {
        self.sessionService = SessionService(db: db)
        self.solutionService = SolutionService(db: db)
        if let ollamaHost, let url = URL(string: ollamaHost), let ollamaModel, !ollamaModel.isEmpty {
            self.ollama = OllamaClient(baseURL: url, model: ollamaModel)
        } else {
            self.ollama = nil
        }
    }

    /// Processes one `AssistantAsk`, emitting progress/result events as they
    /// happen (rather than one blocking response) so the client sees feedback
    /// even while a slow model is still thinking. `emit` is called from this
    /// function's own async context — the caller (the servant) just forwards
    /// each event to its stream writer.
    func handle(ask: AssistantAsk, sessionId: String, emit: (AssistantEvent) async -> Void) async {
        guard let ollama else {
            await emit(AssistantEvent(
                request_id: ask.request_id,
                status: .Error,
                detail: "AI assistant is not configured (missing --ollama-host/--ollama-model).",
                solution: nil
            ))
            return
        }
        guard let user = try? sessionService.user(forSession: sessionId), let userId = user.id else {
            await emit(AssistantEvent(request_id: ask.request_id, status: .Error, detail: "Please log in again.", solution: nil))
            return
        }

        await emit(AssistantEvent(request_id: ask.request_id, status: .Thinking, detail: nil, solution: nil))

        var messages: [OllamaMessage] = [
            OllamaMessage(role: "system", content: Self.systemPrompt),
            OllamaMessage(role: "user", content: ask.prompt),
        ]
        var lastTouchedSolution: SolutionRecord?

        for round in 0..<maxRounds {
            let reply: OllamaMessage
            do {
                reply = try await ollama.chat(messages: messages, tools: AssistantTools.all)
            } catch {
                await emit(AssistantEvent(
                    request_id: ask.request_id,
                    status: .Error,
                    detail: "Could not reach the AI assistant: \(error.localizedDescription)",
                    solution: nil
                ))
                return
            }

            guard let calls = reply.tool_calls, !calls.isEmpty else {
                await emit(AssistantEvent(request_id: ask.request_id, status: .Done, detail: reply.content, solution: lastTouchedSolution?.toRpc()))
                return
            }

            messages.append(reply)
            for call in calls {
                await emit(AssistantEvent(request_id: ask.request_id, status: .ToolCall, detail: call.function.name, solution: nil))
                let resultJSON = executeTool(call, userId: userId, user: user, lastTouchedSolution: &lastTouchedSolution)
                messages.append(OllamaMessage(role: "tool", content: resultJSON, tool_name: call.function.name))
            }

            if round == maxRounds - 1 {
                await emit(AssistantEvent(
                    request_id: ask.request_id,
                    status: .Done,
                    detail: "I made some changes but ran out of turns to summarize — check your Solutions list.",
                    solution: lastTouchedSolution?.toRpc()
                ))
            }
        }
    }

    // MARK: Tool dispatch

    private func executeTool(
        _ call: OllamaToolCall,
        userId: Int64,
        user: UserRecord,
        lastTouchedSolution: inout SolutionRecord?
    ) -> String {
        switch call.function.name {
        case "list_my_solutions":
            return listSolutions(user: user)
        case "create_solution":
            return createSolution(call.function.arguments, userId: userId, lastTouchedSolution: &lastTouchedSolution)
        case "update_solution":
            return updateSolution(call.function.arguments, userId: userId, lastTouchedSolution: &lastTouchedSolution)
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

    init(db: AppDatabase, ollamaHost: String?, ollamaModel: String?) {
        self.store = AssistantStore(db: db, ollamaHost: ollamaHost, ollamaModel: ollamaModel)
        super.init()
    }

    override func connect(session_id: String, stream: NPRPCBidiStream<AssistantEvent, AssistantAsk>) async {
        do {
            for try await ask in stream.reader {
                await store.handle(ask: ask, sessionId: session_id) { event in
                    await stream.writer.write(event)
                }
            }
        } catch {
            print("[Assistant] stream failed for \(session_id): \(error)")
        }
        stream.writer.close()
    }
}
