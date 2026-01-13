// In-memory cache for client-side
const memoryCache = new Map<string, { data: any; expires: number }>();

export function getCached<T>(key: string): T | null {
  const cached = memoryCache.get(key);
  
  if (!cached) return null;
  
  if (Date.now() > cached.expires) {
    memoryCache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

export function setCache<T>(key: string, data: T, ttlSeconds = 300): void {
  memoryCache.set(key, {
    data,
    expires: Date.now() + ttlSeconds * 1000,
  });
}

export function clearCache(key?: string): void {
  if (key) {
    memoryCache.delete(key);
  } else {
    memoryCache.clear();
  }
}

export function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, value] of memoryCache.entries()) {
    if (now > value.expires) {
      memoryCache.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(clearExpiredCache, 5 * 60 * 1000);
}
