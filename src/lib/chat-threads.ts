import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { UIMessage } from "ai";
import { loadJSON, saveJSON } from "@/lib/storage";

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const KEY = "apa.chat.threads";

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function read(): ChatThread[] {
  return loadJSON<ChatThread[]>(KEY, []);
}
function write(next: ChatThread[]) {
  saveJSON(KEY, next);
  emit();
}

export function useThreads() {
  const subscribe = useCallback((cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }, []);
  const threads = useSyncExternalStore(
    subscribe,
    () => read(),
    () => [] as ChatThread[],
  );
  return threads;
}

export function useThread(id: string | undefined) {
  const threads = useThreads();
  return id ? threads.find((t) => t.id === id) : undefined;
}

export function createThread(): ChatThread {
  const t: ChatThread = {
    id: crypto.randomUUID(),
    title: "New chat",
    updatedAt: Date.now(),
    messages: [],
  };
  write([t, ...read()]);
  return t;
}

export function updateThread(id: string, patch: Partial<ChatThread>) {
  const list = read();
  const idx = list.findIndex((t) => t.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], ...patch, updatedAt: Date.now() };
  write(list);
}

export function deleteThread(id: string) {
  write(read().filter((t) => t.id !== id));
}

export function deriveTitle(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New chat";
  const text = first.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  return text.slice(0, 40) || "New chat";
}

// Hook to persist messages whenever they change (debounced via effect deps).
export function usePersistMessages(
  id: string | undefined,
  messages: UIMessage[],
  status: string,
) {
  useEffect(() => {
    if (!id) return;
    if (status === "submitted" || status === "streaming") return;
    if (messages.length === 0) return;
    const list = read();
    const existing = list.find((t) => t.id === id);
    const title = existing && existing.title !== "New chat" ? existing.title : deriveTitle(messages);
    updateThread(id, { messages, title });
  }, [id, messages, status]);
}
