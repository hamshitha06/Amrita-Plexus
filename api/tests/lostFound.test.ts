import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';
import { signAccessToken } from '../src/lib/tokens';

const request = supertest(app);

describe('Lost and Found Module & Physical Custody Desk API', () => {
  let createdLostId = '';
  let createdFoundId = '';
  let createdClaimId = '';
  let handoverOtp = '';
  let testReporterId = 'test-reporter-uuid-1';
  let testClaimantId = 'test-claimant-uuid-2';
  let studentToken = '';
  let claimantToken = '';
  let staffToken = '';

  beforeAll(async () => {
    studentToken = await signAccessToken({
      userId: testReporterId,
      email: 'student.finder@cb.amrita.edu',
      roles: ['student'],
    });

    claimantToken = await signAccessToken({
      userId: testClaimantId,
      email: 'student.claimant@cb.amrita.edu',
      roles: ['student'],
    });

    staffToken = await signAccessToken({
      userId: 'sec-staff-1',
      email: 'security.officer@cb.amrita.edu',
      roles: ['staff', 'admin'],
    });

    // Ensure clean test environment for test items
    const testItems = await prisma.lostFoundItem.findMany({
      where: { title: { contains: '[TEST_ITEM]' } },
      select: { id: true },
    });
    const itemIds = testItems.map(i => i.id);

    if (itemIds.length > 0) {
      await prisma.lostFoundActivityLog.deleteMany({ where: { itemId: { in: itemIds } } });
      await prisma.itemCustodyRecord.deleteMany({ where: { itemId: { in: itemIds } } });
      await prisma.ownershipClaim.deleteMany({ where: { itemId: { in: itemIds } } });
      await prisma.lostFoundItem.deleteMany({ where: { id: { in: itemIds } } });
    }
  });

  afterAll(async () => {
    const testItems = await prisma.lostFoundItem.findMany({
      where: { title: { contains: '[TEST_ITEM]' } },
      select: { id: true },
    });
    const itemIds = testItems.map(i => i.id);

    if (itemIds.length > 0) {
      await prisma.lostFoundActivityLog.deleteMany({ where: { itemId: { in: itemIds } } });
      await prisma.itemCustodyRecord.deleteMany({ where: { itemId: { in: itemIds } } });
      await prisma.ownershipClaim.deleteMany({ where: { itemId: { in: itemIds } } });
      await prisma.lostFoundItem.deleteMany({ where: { id: { in: itemIds } } });
    }
    await prisma.$disconnect();
  });

  // 1 & 2. Student submits lost item report & persists in DB
  it('submits a lost item report and persists to database', async () => {
    const res = await request
      .post('/api/lost-found/lost')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: '[TEST_ITEM] Blue Milton Water Bottle',
        category: 'Everyday Belongings',
        publicDescription: 'Blue stainless steel 750ml water bottle lost near library lawn.',
        privateVerificationDetails: 'Red sticker on cap and scratch on base',
        location: 'Central Library Lawn',
        eventDate: '2026-10-11',
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.reportType).toBe('LOST');
    createdLostId = res.body.data.id;

    // Verify in database
    const dbItem = await prisma.lostFoundItem.findUnique({
      where: { id: createdLostId },
    });
    expect(dbItem).toBeDefined();
    expect(dbItem?.title).toBe('[TEST_ITEM] Blue Milton Water Bottle');
    expect(dbItem?.privateVerificationDetails).toBe('Red sticker on cap and scratch on base');
  });

  // 3 & 4. Student submits found item report & appears in listings
  it('submits a found item report and appears in public listings', async () => {
    const res = await request
      .post('/api/lost-found/found')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: '[TEST_ITEM] Casio Classwiz Calculator',
        category: 'Personal Belongings',
        publicDescription: 'Black scientific calculator left on desk in AB-204.',
        privateVerificationDetails: 'Roll number CB.EN.U4CSE21045 on battery door',
        location: 'Academic Block 2, Room AB-204',
        eventDate: '2026-10-11',
        custodyLocation: 'With Finder',
        securityLevel: 2,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.reportType).toBe('FOUND');
    createdFoundId = res.body.data.id;

    // Fetch public list
    const listRes = await request.get('/api/lost-found');
    expect(listRes.status).toBe(200);
    const foundInList = listRes.body.data.find((i: any) => i.id === createdFoundId);
    expect(foundInList).toBeDefined();
    expect(foundInList.title).toBe('[TEST_ITEM] Casio Classwiz Calculator');
  });

  // 5. Public API does NOT expose private verification details
  it('protects privacy: public list and details do not expose private verification details', async () => {
    const res = await request.get(`/api/lost-found/${createdFoundId}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    // Private verification details should be undefined for public viewer
    expect(res.body.data.privateVerificationDetails).toBeUndefined();
  });

  // 6. Student can submit an ownership claim
  it('allows student to submit an ownership claim with identifying evidence', async () => {
    const res = await request
      .post(`/api/lost-found/${createdFoundId}/claims`)
      .set('Authorization', `Bearer ${claimantToken}`)
      .send({
        answers: [
          { question: 'Model', answer: 'Casio fx-991EX' },
          { question: 'Identifying mark', answer: 'Roll number CB.EN.U4CSE21045 on battery door' },
        ],
        additionalNotes: 'Left it after 3rd period lab',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('Under Review');
    createdClaimId = res.body.data.id;
  });

  // 7 & 8. Unauthorized user cannot approve own claim
  it('rejects claim approval if reviewer is the claimant themselves', async () => {
    const res = await request
      .post(`/api/lost-found/claims/${createdClaimId}/review`)
      .set('Authorization', `Bearer ${claimantToken}`)
      .send({
        status: 'Approved',
        reviewerName: 'Self Approver',
      });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  // 9 & 10. Handover to security: moves to Handover Reported, NOT Custody Confirmed
  it('recording student handover sets custody to Handover Reported (not confirmed)', async () => {
    const res = await request
      .post(`/api/lost-found/${createdFoundId}/handover-report`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        custodyLocation: 'Main Gate Security Desk',
        notes: 'Handed over to Officer Pillai physically at 4:30 PM',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Handover Reported');

    // Verify item record in DB
    const item = await prisma.lostFoundItem.findUnique({
      where: { id: createdFoundId },
    });
    expect(item?.status).toBe('Handover Reported');
  });

  // 11 & 12. Authorized confirmation updates status to Custody Confirmed & logs activity
  it('authorized security staff confirms physical receipt and creates custody log', async () => {
    const res = await request
      .post(`/api/lost-found/${createdFoundId}/confirm-custody`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        staffName: 'Officer R. Pillai (SEC-88)',
        custodyLocation: 'Main Gate Security Desk',
        conditionNotes: 'Good condition, physically received at desk. [TEST_SUITE]',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Custody Confirmed');

    // Check activity log
    const logs = await prisma.lostFoundActivityLog.findMany({
      where: { itemId: createdFoundId },
    });
    expect(logs.length).toBeGreaterThan(0);
  });

  // 13. Authorized reviewer approves valid claim and generates handover OTP
  it('authorized reviewer approves ownership claim and generates handover OTP', async () => {
    const res = await request
      .post(`/api/lost-found/claims/${createdClaimId}/review`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        reviewerName: 'Officer R. Pillai (SEC-88)',
        status: 'Approved',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.claim.status).toBe('Approved');
    expect(res.body.data).toHaveProperty('handoverOtp');
    handoverOtp = res.body.data.handoverOtp;
    expect(handoverOtp).toMatch(/^\d{6}$/);
  });

  // 14 & 15. Verified return is recorded & returned items cannot be claimed again
  it('confirms physical return to owner with OTP verification and prevents re-claims', async () => {
    const returnRes = await request
      .post(`/api/lost-found/${createdFoundId}/confirm-return`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        claimId: createdClaimId,
        otp: handoverOtp,
        staffName: 'Officer R. Pillai (SEC-88)',
        recipientName: 'Student Claimant',
      });

    expect(returnRes.status).toBe(200);

    // Verify item is Returned in DB
    const item = await prisma.lostFoundItem.findUnique({
      where: { id: createdFoundId },
    });
    expect(item?.status).toBe('Returned');

    // Attempting to claim a returned item must fail
    const reClaimRes = await request
      .post(`/api/lost-found/${createdFoundId}/claims`)
      .set('Authorization', `Bearer ${claimantToken}`)
      .send({
        answers: [{ question: 'Model', answer: 'Casio' }],
      });

    expect(reClaimRes.status).toBe(400);
    expect(reClaimRes.body.error.code).toBe('ITEM_ALREADY_RETURNED');
  });

  // 16. Verify that lockers do NOT exist in the custody model
  it('verifies custody records store physical desks and do not store locker numbers', async () => {
    const custodyRecord = await prisma.itemCustodyRecord.findFirst({
      where: { itemId: createdFoundId },
    });

    expect(custodyRecord).toBeDefined();
    expect(custodyRecord?.custodyLocation).toBe('Main Gate Security Desk');
    // Schema has NO lockerNumber or storageLocker field
    expect((custodyRecord as any).lockerNumber).toBeUndefined();
    expect((custodyRecord as any).storageLocker).toBeUndefined();
  });
});
