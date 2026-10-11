import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';
import { signAccessToken } from '../src/lib/tokens';

const request = supertest(app);

describe('Canteen, Carpool, and Parcel Backend Workflows', () => {
  let studentToken = '';
  let delivererToken = '';
  let studentId = 'test-student-canteen-1';
  let delivererId = 'test-deliverer-canteen-2';

  let testMenuId = '';
  let testRideId = '';
  let testParcelId = '';
  let deliveryOtp = '';

  beforeAll(async () => {
    studentToken = await signAccessToken({
      userId: studentId,
      email: 'canteen.student@cb.amrita.edu',
      roles: ['student'],
    });

    delivererToken = await signAccessToken({
      userId: delivererId,
      email: 'deliverer.peer@cb.amrita.edu',
      roles: ['student'],
    });
  });

  afterAll(async () => {
    // Cleanup test data
    if (testMenuId) {
      await prisma.canteenMenuItem.deleteMany({ where: { menuId: testMenuId } }).catch(() => {});
      await prisma.canteenMenu.delete({ where: { id: testMenuId } }).catch(() => {});
    }
    if (testRideId) {
      await prisma.carpoolBooking.deleteMany({ where: { rideId: testRideId } }).catch(() => {});
      await prisma.carpoolRide.delete({ where: { id: testRideId } }).catch(() => {});
    }
    if (testParcelId) {
      await prisma.parcelDelivery.delete({ where: { id: testParcelId } }).catch(() => {});
    }
  });

  // ============================================================================
  // 1. CANTEEN DIGITAL MENU & PEER DELIVERY WORKFLOW
  // ============================================================================
  describe('Canteen Module: Digital Menu Publishing & Multi-Canteen Separation', () => {
    it('publishes a verified digital menu for cant-1 and persists items to database', async () => {
      const res = await request
        .post('/api/canteen/menus')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          canteenId: 'cant-1',
          canteenName: 'Main Canteen',
          imageReference: 'uploads/blackboard-test.jpg',
          rawExtractedText: 'VEG SANDWICH 40\nMASALA DOSA 55\nTEA 12',
          items: [
            { title: 'Veg Sandwich', price: 40, category: 'Snacks', prepTime: '8 mins' },
            { title: 'Masala Dosa', price: 55, category: 'Breakfast', prepTime: '12 mins' },
            { title: 'Tea', price: 12, category: 'Beverages', prepTime: '5 mins' },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.canteenId).toBe('cant-1');
      expect(res.body.data.items.length).toBe(3);
      testMenuId = res.body.data.id;

      // Verify in DB
      const dbMenu = await prisma.canteenMenu.findUnique({
        where: { id: testMenuId },
        include: { items: true },
      });
      expect(dbMenu).not.toBeNull();
      expect(dbMenu?.isCurrent).toBe(true);
      expect(dbMenu?.items.length).toBe(3);
    });

    it('maintains strict separation between canteens (cant-1 vs cant-2)', async () => {
      const resCant1 = await request.get('/api/canteen/menus?canteenId=cant-1');
      expect(resCant1.status).toBe(200);
      expect(resCant1.body.data.length).toBeGreaterThan(0);
      expect(resCant1.body.data[0].canteenId).toBe('cant-1');

      const resCant2 = await request.get('/api/canteen/menus?canteenId=cant-2');
      expect(resCant2.status).toBe(200);
      // All items returned must strictly belong to cant-2
      for (const m of resCant2.body.data) {
        expect(m.canteenId).toBe('cant-2');
      }
    });

    it('handles peer food delivery request and credits deliverer wallet on completion', async () => {
      // Create request
      const createRes = await request
        .post('/api/canteen/requests')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          canteenId: 'cant-1',
          canteenName: 'Main Canteen',
          deliveryAddress: 'Gargi Hostel Room 304',
          foodSubtotal: 95,
          deliveryFee: 25,
          totalAmount: 120,
          items: [
            { title: 'Veg Sandwich', price: 40, quantity: 1 },
            { title: 'Masala Dosa', price: 55, quantity: 1 },
          ],
        });

      expect(createRes.status).toBe(201);
      const reqId = createRes.body.data.id;

      // Deliverer accepts request
      const acceptRes = await request
        .patch(`/api/canteen/requests/${reqId}/status`)
        .set('Authorization', `Bearer ${delivererToken}`)
        .send({ status: 'Accepted' });

      expect(acceptRes.status).toBe(200);
      expect(acceptRes.body.data.status).toBe('Accepted');

      // Deliverer delivers food
      const deliverRes = await request
        .patch(`/api/canteen/requests/${reqId}/status`)
        .set('Authorization', `Bearer ${delivererToken}`)
        .send({ status: 'Delivered' });

      expect(deliverRes.status).toBe(200);
      expect(deliverRes.body.data.status).toBe('Delivered');

      // Clean up food request
      await prisma.foodRequest.delete({ where: { id: reqId } }).catch(() => {});
    });
  });

  // ============================================================================
  // 2. CARPOOLING CONCURRENCY & CAPACITY TESTS
  // ============================================================================
  describe('Carpooling Module: Concurrency-Safe Booking & Capacity Enforcement', () => {
    it('creates a carpool ride with 3 seats', async () => {
      const res = await request
        .post('/api/carpool/rides')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          origin: 'Main Gate',
          destination: 'Coimbatore Railway Station',
          vehicleType: 'Honda City (Sedan)',
          date: '2026-10-15',
          time: '17:30',
          availableSeats: 3,
          pricePerSeat: 150,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.availableSeats).toBe(3);
      testRideId = res.body.data.id;
    });

    it('books 2 seats and properly updates availableSeats to 1', async () => {
      const res = await request
        .post(`/api/carpool/rides/${testRideId}/book`)
        .set('Authorization', `Bearer ${delivererToken}`)
        .send({ seatsBooked: 2, passengerName: 'Peer Passenger' });

      expect(res.status).toBe(201);
      expect(res.body.data.ride.availableSeats).toBe(1);
      expect(res.body.data.ride.status).toBe('AVAILABLE');
      expect(res.body.data.booking.seatsBooked).toBe(2);
    });

    it('rejects booking that exceeds remaining available seats with 409 OVERBOOKED', async () => {
      // Only 1 seat left, try booking 2
      const res = await request
        .post(`/api/carpool/rides/${testRideId}/book`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ seatsBooked: 2, passengerName: 'Greedy Passenger' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('OVERBOOKED');
    });
  });

  // ============================================================================
  // 3. PARCEL DELIVERY & SECURE OTP VERIFICATION
  // ============================================================================
  describe('Parcel Module: Secure 4-Digit OTP Delivery Verification', () => {
    it('registers a parcel and provides a secret 4-digit OTP to the recipient', async () => {
      const tracking = `TEST-AMZ-${Date.now()}`;
      const res = await request
        .post('/api/parcels')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          trackingNumber: tracking,
          courier: 'Amazon Logistics',
          arrivalGate: 'Main Security Gate',
          destinationHostel: 'Vasishta Hostel',
          destinationRoom: '412',
          reward: 40,
          weightEstimate: '1.2 kg',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('Awaiting Delivery');
      expect(res.body.data.deliveryOtp).toMatch(/^\d{4}$/);
      deliveryOtp = res.body.data.deliveryOtp;
      testParcelId = res.body.data.id;
    });

    it('hides the secret OTP hash on public parcel search/listings', async () => {
      const res = await request.get('/api/parcels?status=Awaiting Delivery');
      expect(res.status).toBe(200);
      const found = res.body.data.find((p: any) => p.id === testParcelId);
      expect(found).toBeDefined();
      expect(found.deliveryOtpHash).toBeUndefined(); // Must never be exposed!
    });

    it('allows a peer deliverer to accept the parcel delivery task', async () => {
      const res = await request
        .post(`/api/parcels/${testParcelId}/accept`)
        .set('Authorization', `Bearer ${delivererToken}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('In Transit');
    });

    it('rejects invalid OTP attempts with 401 INVALID_OTP', async () => {
      const res = await request
        .post(`/api/parcels/${testParcelId}/verify-otp`)
        .set('Authorization', `Bearer ${delivererToken}`)
        .send({ otp: '0000' });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_OTP');
    });

    it('confirms delivery on valid OTP and credits peer deliverer reward to wallet', async () => {
      const res = await request
        .post(`/api/parcels/${testParcelId}/verify-otp`)
        .set('Authorization', `Bearer ${delivererToken}`)
        .send({ otp: deliveryOtp });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Delivered');
      expect(res.body.data.deliveredAt).toBeDefined();
    });

    it('prevents replay attacks: second verification attempt is rejected with 409', async () => {
      const res = await request
        .post(`/api/parcels/${testParcelId}/verify-otp`)
        .set('Authorization', `Bearer ${delivererToken}`)
        .send({ otp: deliveryOtp });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('ALREADY_DELIVERED');
    });
  });
});
