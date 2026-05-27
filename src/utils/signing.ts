import crypto from 'crypto';

export function createSignature(secret: string, method: string, path: string, timestamp: string, body: string): string {
  var payload = method + '|' + path + '|' + timestamp + '|' + body;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifySignature(secret: string, signature: string, method: string, path: string, timestamp: string, body: string, maxAge: number = 300000): boolean {
  if (Math.abs(Date.now() - parseInt(timestamp)) > maxAge) return false;
  var expected = createSignature(secret, method, path, timestamp, body);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function generateSigningSecret(): string {
  return 'sk_' + crypto.randomBytes(32).toString('hex');
}
