// Browser-side persistence for the AI assistant chat. The server is stateless
// across asks, so the client stores turns here and resends them as
// AssistantAsk.history. Text-only — images are not rehydrated into history.

const DB_NAME = "nscalc-assistant";
const DB_VERSION = 1;
const STORE_NAME = "conversations";

/** Max turns kept on disk / resent to the model (user+assistant each count). */
export const MAX_CONVERSATION_MESSAGES = 40;

export type AssistantChatRole = "user" | "assistant";

export type AssistantChatMessage = {
  id: string;
  role: AssistantChatRole;
  content: string;
  hasImage?: boolean;
  solutionName?: string | null;
  fertilizerName?: string | null;
  createdAt: number;
};

type ConversationRecord = {
  key: string;
  messages: AssistantChatMessage[];
  updatedAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error ?? new Error("Failed to open assistant IndexedDB"));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
  });
}

function runStore<T>(
  mode: IDBTransactionMode,
  work: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        const request = work(store);
        request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
        request.onsuccess = () => resolve(request.result);
        tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted"));
      }),
  );
}

function trimMessages(messages: AssistantChatMessage[]): AssistantChatMessage[] {
  if (messages.length <= MAX_CONVERSATION_MESSAGES) {
    return messages;
  }
  return messages.slice(messages.length - MAX_CONVERSATION_MESSAGES);
}

export async function loadConversation(key: string): Promise<AssistantChatMessage[]> {
  try {
    const record = await runStore<ConversationRecord | undefined>("readonly", (store) => store.get(key));
    if (!record?.messages || !Array.isArray(record.messages)) {
      return [];
    }
    return trimMessages(record.messages);
  } catch {
    return [];
  }
}

export async function saveConversation(key: string, messages: AssistantChatMessage[]): Promise<void> {
  const trimmed = trimMessages(messages);
  const record: ConversationRecord = {
    key,
    messages: trimmed,
    updatedAt: Date.now(),
  };
  try {
    await runStore("readwrite", (store) => store.put(record));
  } catch {
    // Persistence is best-effort — chat still works in-memory for the session.
  }
}

export async function clearConversation(key: string): Promise<void> {
  try {
    await runStore("readwrite", (store) => store.delete(key));
  } catch {
    // ignore
  }
}

export function conversationKeyForUser(userName: string | null | undefined): string {
  // One thread per browser login session id when present; a shared guest bucket
  // otherwise. Avoids leaking one user's chat into another's on a shared machine
  // after a re-login, while still working before auth.
  return userName ? `user:${userName}` : "guest";
}
