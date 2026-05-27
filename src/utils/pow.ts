import crypto from 'crypto';

var challenges = new Map<string, { challenge: string; difficulty: number; expires: number }>();

export function generateChallenge(difficulty: number = 4): { challenge: string; difficulty: number } {
  var challenge = crypto.randomBytes(32).toString('hex');
  var key = crypto.randomBytes(8).toString('hex');
  challenges.set(key, { challenge, difficulty, expires: Date.now() + 300000 });
  return { challenge: key + ':' + challenge, difficulty };
}

export function verifyPoW(challengeKey: string, nonce: number): boolean {
  var parts = challengeKey.split(':');
  var key = parts[0];
  var entry = challenges.get(key);
  if (!entry || entry.expires < Date.now()) {
    challenges.delete(key);
    return false;
  }
  var hash = crypto.createHash('sha256').update(entry.challenge + nonce).digest('hex');
  var valid = hash.startsWith('0'.repeat(entry.difficulty));
  if (valid) challenges.delete(key);
  return valid;
}
