import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

const request = supertest(app);

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function cleanDb() {
  await prisma.authToken.deleteMany();
  await prisma.user.deleteMany({ where: { collegeEmail: { endsWith: '@cb.amrita.edu' } } });
}

async function createVerifiedUser(email: string, password: string) {
  const argon2 = await import('argon2');
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  return prisma.user.create({
    data: {
      name: 'Test User',
      collegeEmail: email,
      passwordHash,
      roles: ['student'],
      verificationStatus: 'VERIFIED',
    },
  });
}

async function createPendingUser(email: string, password: string) {
  const argon2 = await import('argon2');
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  return prisma.user.create({
    data: {
      name: 'Test User',
      collegeEmail: email,
      passwordHash,
      roles: ['student'],
      verificationStatus: 'PENDING',
    },
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Auth API (Passwordless Email OTP)', () => {
  beforeAll(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await cleanDb();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await cleanDb();
  });

  // 1. Non-college email domain is rejected
  it('rejects requesting code with non-college email domain', async () => {
    const res = await request.post('/api/auth/request-code').send({
      email: 'outsider@gmail.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_DOMAIN');
  });

  // 2. Request code for valid Amrita email succeeds
  it('allows requesting OTP for valid amrita.edu email domain', async () => {
    const res = await request.post('/api/auth/request-code').send({
      email: 'student.test@cb.amrita.edu',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 3. Reject verify-code with incorrect code
  it('rejects verify-code with invalid OTP code', async () => {
    const res = await request.post('/api/auth/verify-code').send({
      email: 'student.test@cb.amrita.edu',
      code: '000000',
    });

    expect(res.status).toBe(400);
  });

  // 4. Reject unauthorized /api/auth/me without valid token
  it('rejects access to /api/auth/me with an invalid token', async () => {
    const res = await request
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
