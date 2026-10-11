import { randomBytes, createHash } from 'crypto';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { env } from '../config/env';

// ─── Raw token generation ────────────────────────────────────────────────────

/** Generate a cryptographically secure random token */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

/** Hash a token for safe storage (SHA-256) */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// ─── JWT helpers ─────────────────────────────────────────────────────────────

export interface AccessTokenPayload extends JWTPayload {
  sub: string; // userId
  email: string;
  roles: string[];
}

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export async function signAccessToken(payload: {
  userId: string;
  email: string;
  roles: string[];
}): Promise<string> {
  return new SignJWT({
    email: payload.email,
    roles: payload.roles,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(env.JWT_ACCESS_EXPIRY)
    .sign(accessSecret);
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, accessSecret);
  return payload as AccessTokenPayload;
}

export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(env.JWT_REFRESH_EXPIRY)
    .sign(refreshSecret);
}

export async function verifyRefreshToken(
  token: string
): Promise<JWTPayload & { sub: string }> {
  const { payload } = await jwtVerify(token, refreshSecret);
  if (!payload.sub) throw new Error('Invalid refresh token');
  return payload as JWTPayload & { sub: string };
}

// ─── Expiry helpers ──────────────────────────────────────────────────────────

export function expiryFromNow(duration: string): Date {
  const now = Date.now();
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) throw new Error(`Invalid duration: ${duration}`);
  const [, num, unit] = match;
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };
  return new Date(now + parseInt(num, 10) * multipliers[unit]);
}
