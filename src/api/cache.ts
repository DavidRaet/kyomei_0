interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const LS_PREFIX = 'kyomei:cache:';

function readFromLocalStorage<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (typeof parsed.expiresAt !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeToLocalStorage<T>(key: string, entry: CacheEntry<T>): void {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage full/unavailable (e.g. private browsing) - degrade to memory-only cache
  }
}

export async function withCache<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
  opts: { persist?: boolean } = {}
): Promise<T> {
  const persist = opts.persist ?? true;
  const now = Date.now();

  const memHit = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (memHit && memHit.expiresAt > now) return memHit.data;

  if (persist) {
    const lsHit = readFromLocalStorage<T>(key);
    if (lsHit && lsHit.expiresAt > now) {
      memoryCache.set(key, lsHit);
      return lsHit.data;
    }
  }

  const data = await fetcher();
  const entry: CacheEntry<T> = { data, expiresAt: now + ttlMs };
  memoryCache.set(key, entry);
  if (persist) writeToLocalStorage(key, entry);
  return data;
}

export function invalidateCache(key: string): void {
  memoryCache.delete(key);
  try {
    localStorage.removeItem(LS_PREFIX + key);
  } catch {
    // ignore
  }
}

export function clearAllCache(): void {
  memoryCache.clear();
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(LS_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
