import * as crypto from 'crypto';

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function minutesFromNow(minutes: number): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
}
