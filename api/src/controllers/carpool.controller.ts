import { RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authenticate';

const createRideSchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  vehicleType: z.string().min(2),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time: z.string().min(2),
  availableSeats: z.number().int().positive().max(8),
  pricePerSeat: z.number().int().nonnegative(),
});

const bookRideSchema = z.object({
  seatsBooked: z.number().int().positive().default(1),
  passengerName: z.string().optional(),
});

/**
 * GET /api/carpool/rides
 * Search and list available carpool rides
 */
export const getRides: RequestHandler = async (req, res, next) => {
  try {
    const { origin, destination, date } = req.query;
    const where: Record<string, unknown> = {
      status: 'AVAILABLE',
      availableSeats: { gt: 0 },
    };

    if (typeof origin === 'string' && origin.trim()) {
      where.origin = { contains: origin.trim(), mode: 'insensitive' };
    }
    if (typeof destination === 'string' && destination.trim()) {
      where.destination = { contains: destination.trim(), mode: 'insensitive' };
    }
    if (typeof date === 'string' && date.trim()) {
      where.date = date.trim();
    }

    const rides = await prisma.carpoolRide.findMany({
      where,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      take: 50,
      include: {
        bookings: true,
      },
    });

    res.json({ success: true, data: rides });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/carpool/rides
 * Offer / Create a carpool ride
 */
export const createRide: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const parsed = createRideSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0].message } });
      return;
    }

    const driverId = req.user?.userId || 'student-driver';
    const driverName = req.user?.email ? req.user.email.split('@')[0] : 'Campus Driver';

    const ride = await prisma.carpoolRide.create({
      data: {
        ...parsed.data,
        totalSeats: parsed.data.availableSeats,
        driverId,
        driverName,
        status: 'AVAILABLE',
      },
    });

    res.status(201).json({ success: true, data: ride });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/carpool/rides/:id/book
 * Concurrency-safe seat booking with capacity validation
 */
export const bookRide: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const parsed = bookRideSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0].message } });
      return;
    }

    const seatsToBook = parsed.data.seatsBooked;
    const passengerId = req.user?.userId || 'passenger-student';
    const passengerName = parsed.data.passengerName || (req.user?.email ? req.user.email.split('@')[0] : 'Passenger Student');

    // Concurrency-safe interactive transaction
    const result = await prisma.$transaction(async tx => {
      const ride = await tx.carpoolRide.findUnique({
        where: { id },
      });

      if (!ride) {
        throw new Error('NOT_FOUND: Ride does not exist');
      }

      if (ride.status !== 'AVAILABLE' || ride.availableSeats < seatsToBook) {
        throw new Error('OVERBOOKED: Not enough available seats for this ride');
      }

      const updatedSeats = ride.availableSeats - seatsToBook;
      const newStatus = updatedSeats === 0 ? 'FULL' : 'AVAILABLE';

      const updatedRide = await tx.carpoolRide.update({
        where: { id },
        data: {
          availableSeats: updatedSeats,
          status: newStatus,
        },
      });

      const booking = await tx.carpoolBooking.create({
        data: {
          rideId: id,
          passengerId,
          passengerName,
          seatsBooked: seatsToBook,
          totalPrice: ride.pricePerSeat * seatsToBook,
          status: 'ACCEPTED',
        },
      });

      return { ride: updatedRide, booking };
    });

    res.status(201).json({ success: true, data: result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('NOT_FOUND')) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ride not found.' } });
    } else if (msg.includes('OVERBOOKED')) {
      res.status(409).json({ error: { code: 'OVERBOOKED', message: 'Requested seats exceed available capacity.' } });
    } else {
      next(err);
    }
  }
};

/**
 * GET /api/carpool/my-rides
 */
export const getMyRides: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const driverId = req.user?.userId;
    const rides = await prisma.carpoolRide.findMany({
      where: driverId ? { driverId } : {},
      include: { bookings: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: rides });
  } catch (err) {
    next(err);
  }
};
