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

describe('Auth API', () => {
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

  // 1. Non-college email is rejected
  it('rejects registration with a non-college email domain', async () => {
    const res = await request.post('/api/auth/register').send({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('INVALID_EMAIL_DOMAIN');
  });

  // 2. Login blocked before email verification
  it('blocks login for unverified accounts', async () => {
    await createPendingUser('pending@cb.amrita.edu', 'Password123!');

    const res = await request.post('/api/auth/login').send({
      email: 'pending@cb.amrita.edu',
      password: 'Password123!',
    });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('UNVERIFIED_EMAIL');
  });

  // 3. Successful login returns accessToken
  it('allows login for verified accounts and returns access token', async () => {
    await createVerifiedUser('verified@cb.amrita.edu', 'Password123!');

    const res = await request.post('/api/auth/login').send({
      email: 'verified@cb.amrita.edu',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user.email).toBe('verified@cb.amrita.edu');
    // Refresh token should be in httpOnly cookie
    expect(res.headers['set-cookie']).toBeDefined();
  });

  // 4. Refresh token rotation
  it('issues a new access token and rotates the refresh cookie', async () => {
    await createVerifiedUser('rotate@cb.amrita.edu', 'Password123!');

    // Login to get initial refresh cookie
    const loginRes = await request.post('/api/auth/login').send({
      email: 'rotate@cb.amrita.edu',
      password: 'Password123!',
    });

    expect(loginRes.status).toBe(200);
    const cookies = loginRes.headers['set-cookie'] as string[];
    expect(cookies).toBeDefined();

    // Use refresh token
    const refreshRes = await request
      .post('/api/auth/refresh')
      .set('Cookie', cookies);

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body).toHaveProperty('accessToken');
    // New cookie should be set (rotation)
    expect(refreshRes.headers['set-cookie']).toBeDefined();
  });

  // 5. Expired / invalid token rejected on /api/me
  it('rejects access to /api/me with an invalid token', async () => {
    const res = await request
      .get('/api/me')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
