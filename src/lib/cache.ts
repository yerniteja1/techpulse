const CACHE = new Map<string, { data: unknown; expiresAt: number }>();

export function getCached<T>(key: string): T | null {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    CACHE.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache(key: string, data: unknown, ttlMs: number): void {
  CACHE.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export function clearCache(pattern?: string): void {
  if (!pattern) {
    CACHE.clear();
    return;
  }
  for (const key of CACHE.keys()) {
    if (key.includes(pattern)) {
      CACHE.delete(key);
    }
  }
}

export const CACHE_TTL = {
  headlines: 5 * 60 * 1000,
  category: 5 * 60 * 1000,
  article: 10 * 60 * 1000,
  search: 2 * 60 * 1000,
} as const;
