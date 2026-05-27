export function sanitize(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .substring(0, 500);
}

export function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) return { valid: false, message: 'Min 8 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Need uppercase' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Need lowercase' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Need number' };
  if (!/[^A-Za-z0-9]/.test(password)) return { valid: false, message: 'Need special char' };
  return { valid: true, message: 'OK' };
}
