export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export type SavedOutput = {
  id: string;
  createdAt: number;
  title: string;
  output: string;
  inputs: Record<string, string>;
};

export function pushSavedOutput(moduleKey: string, item: SavedOutput, max = 10) {
  const key = `apa.history.${moduleKey}`;
  const list = loadJSON<SavedOutput[]>(key, []);
  const next = [item, ...list].slice(0, max);
  saveJSON(key, next);
}

export function getSavedOutputs(moduleKey: string): SavedOutput[] {
  return loadJSON<SavedOutput[]>(`apa.history.${moduleKey}`, []);
}

export function deleteSavedOutput(moduleKey: string, id: string) {
  const key = `apa.history.${moduleKey}`;
  const list = loadJSON<SavedOutput[]>(key, []);
  saveJSON(
    key,
    list.filter((x) => x.id !== id),
  );
}
