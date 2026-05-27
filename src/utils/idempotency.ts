var idempotencyStore = new Map<string, { status: number; body: string; expires: number }>();

export function checkIdempotency(key: string): { status: number; body: string } | null {
  var entry = idempotencyStore.get(key);
  if (entry && entry.expires > Date.now()) {
    return { status: entry.status, body: entry.body };
  }
  idempotencyStore.delete(key);
  return null;
}

export function storeIdempotency(key: string, status: number, body: string, ttlMs: number = 86400000): void {
  idempotencyStore.set(key, { status, body, expires: Date.now() + ttlMs });
}
