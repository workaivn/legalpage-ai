import "server-only";

const buckets = new Map<string, { count: number; resetsAt: number }>();

export function assertRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetsAt < now) {
    buckets.set(key, { count: 1, resetsAt: now + windowMs });
    return;
  }

  if (bucket.count >= limit) {
    throw new Error("Too many requests. Please wait a moment and try again.");
  }

  bucket.count += 1;
}
