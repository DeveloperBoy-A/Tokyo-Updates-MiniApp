export interface WatchlistItem {
  id: number;
  title: string;
  posterPath: string | null;
  year: number | null;
  mediaType: "movie" | "tv";
  addedAt: string;
}

const STORAGE_KEY = "tokyo_updates_watchlist_v1";

function browserAvailable(): boolean {
  return typeof window !== "undefined";
}

function parseWatchlist(raw: string | null): WatchlistItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value: unknown): value is WatchlistItem => {
      if (typeof value !== "object" || value === null) return false;
      const item = value as Partial<WatchlistItem>;
      return Number.isInteger(item.id) &&
        typeof item.title === "string" &&
        (item.mediaType === "movie" || item.mediaType === "tv") &&
        (item.posterPath === null || typeof item.posterPath === "string") &&
        (item.year === null || typeof item.year === "number") &&
        typeof item.addedAt === "string";
    });
  } catch {
    return [];
  }
}

function readWatchlist(): WatchlistItem[] {
  if (!browserAvailable()) return [];
  try {
    return parseWatchlist(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function writeWatchlist(items: WatchlistItem[]): void {
  if (!browserAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("tokyo:watchlist-updated", { detail: items }));
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Unable to save the watchlist.");
  }
}

export function getWatchlist(): WatchlistItem[] {
  return readWatchlist().sort((first, second) => second.addedAt.localeCompare(first.addedAt));
}

export function isInWatchlist(id: number, mediaType: "movie" | "tv"): boolean {
  return readWatchlist().some((item) => item.id === id && item.mediaType === mediaType);
}

export function addToWatchlist(item: Omit<WatchlistItem, "addedAt">): WatchlistItem[] {
  if (!Number.isInteger(item.id) || item.id <= 0 || !item.title.trim()) {
    throw new Error("A valid movie or TV title is required.");
  }
  const current = readWatchlist();
  if (current.some((entry) => entry.id === item.id && entry.mediaType === item.mediaType)) {
    return current;
  }
  const nextItem: WatchlistItem = { ...item, title: item.title.trim(), addedAt: new Date().toISOString() };
  const next = [nextItem, ...current].slice(0, 500);
  writeWatchlist(next);
  return next;
}

export function removeFromWatchlist(id: number, mediaType: "movie" | "tv"): WatchlistItem[] {
  const next = readWatchlist().filter((item) => item.id !== id || item.mediaType !== mediaType);
  writeWatchlist(next);
  return next;
}

export function toggleWatchlist(item: Omit<WatchlistItem, "addedAt">): { saved: boolean; items: WatchlistItem[] } {
  if (isInWatchlist(item.id, item.mediaType)) {
    return { saved: false, items: removeFromWatchlist(item.id, item.mediaType) };
  }
  return { saved: true, items: addToWatchlist(item) };
}

export function clearWatchlist(): void {
  writeWatchlist([]);
}

export function subscribeToWatchlist(listener: (items: WatchlistItem[]) => void): () => void {
  if (!browserAvailable()) return () => undefined;

  const handleCustomEvent = (event: Event): void => {
    const customEvent = event as CustomEvent<WatchlistItem[]>;
    listener(Array.isArray(customEvent.detail) ? customEvent.detail : readWatchlist());
  };
  const handleStorageEvent = (event: StorageEvent): void => {
    if (event.key === STORAGE_KEY || event.key === null) listener(readWatchlist());
  };

  window.addEventListener("tokyo:watchlist-updated", handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);
  return () => {
    window.removeEventListener("tokyo:watchlist-updated", handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
