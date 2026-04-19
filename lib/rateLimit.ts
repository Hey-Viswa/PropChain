import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, number[]>({
  max: 1000,
  ttl: 60_000, // 1 minute window
});

export function rateLimit(
  identifier: string,
  limit: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const windowStart = now - 60_000;
  const timestamps = (cache.get(identifier) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((timestamps[0] + 60_000 - now) / 1000),
    };
  }

  timestamps.push(now);
  cache.set(identifier, timestamps);
  return { allowed: true, remaining: limit - timestamps.length, resetIn: 60 };
}