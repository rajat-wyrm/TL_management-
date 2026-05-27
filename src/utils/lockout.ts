var attempts = new Map<string, { count: number; lockedUntil: number }>();

export function recordFailedAttempt(key: string): { locked: boolean; waitMinutes?: number } {
  var now = Date.now();
  var entry = attempts.get(key) || { count: 0, lockedUntil: 0 };
  
  if (entry.lockedUntil > now) {
    return { locked: true, waitMinutes: Math.ceil((entry.lockedUntil - now) / 60000) };
  }
  
  entry.count++;
  if (entry.count >= 5) {
    entry.lockedUntil = now + 15 * 60 * 1000; // 15 min lockout
  }
  attempts.set(key, entry);
  return { locked: entry.lockedUntil > now };
}

export function resetAttempts(key: string): void {
  attempts.delete(key);
}

export function isLocked(key: string): boolean {
  var entry = attempts.get(key);
  if (!entry) return false;
  if (entry.lockedUntil > Date.now()) return true;
  attempts.delete(key);
  return false;
}
