import { RequestHandler } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authenticate';

const registerParcelSchema = z.object({
  trackingNumber: z.string().min(4),
  courier: z.string().min(2),
  arrivalGate: z.string().min(2),
  destinationHostel: z.string().min(2),
  destinationRoom: z.string().min(1),
  reward: z.number().int().positive().max(150), // Fee cap of ₹150 for peer delivery
  amazonLink: z.string().optional(),
  weightEstimate: z.string().optional(),
});

const verifyOtpSchema = z.object({
  otp: z.string().regex(/^\d{4}$/, 'OTP must be 4 digits'),
});

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/**
 * GET /api/parcels
 * List parcels available for peer delivery or owned by user
 */
export const getParcels: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const { status, recipientOnly } = req.query;
    const userId = req.user?.userId;

    const where: Record<string, unknown> = {};

    if (recipientOnly === 'true' && userId) {
      where.recipientId = userId;
    } else if (typeof status === 'string' && status) {
      where.status = status;
    }

    const parcels = await prisma.parcelDelivery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        trackingNumber: true,
        courier: true,
        arrivalGate: true,
        destinationHostel: true,
        destinationRoom: true,
        recipientId: true,
        recipientName: true,
        delivererId: true,
        delivererName: true,
        reward: true,
        status: true,
        amazonLink: true,
        weightEstimate: true,
        createdAt: true,
        deliveredAt: true,
        // Notice: deliveryOtpHash is strictly OMITTED for privacy and security
      },
    });

    res.json({ success: true, data: parcels });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/parcels
 * Register a parcel for pickup with generated OTP
 */
export const registerParcel: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const parsed = registerParcelSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0].message } });
      return;
    }

    const recipientId = req.user?.userId || 'recipient-student';
    const recipientName = req.user?.email ? req.user.email.split('@')[0] : 'Campus Student';

    // Generate secure 4-digit numeric OTP
    const rawOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryOtpHash = hashOtp(rawOtp);

    const parcel = await prisma.parcelDelivery.create({
      data: {
        ...parsed.data,
        recipientId,
        recipientName,
        deliveryOtpHash,
        status: 'Awaiting Delivery',
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...parcel,
        // Return clear OTP ONLY to the registrant on initial creation
        deliveryOtp: rawOtp,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/parcels/:id/accept
 * Peer deliverer claims a parcel delivery
 */
export const acceptParcelDelivery: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const delivererId = req.user?.userId || 'peer-deliverer';
    const delivererName = req.user?.email ? req.user.email.split('@')[0] : 'Peer Student';

    const parcel = await prisma.parcelDelivery.findUnique({ where: { id } });
    if (!parcel) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Parcel not found.' } });
      return;
    }

    if (parcel.status !== 'Awaiting Delivery') {
      res.status(400).json({ error: { code: 'ALREADY_CLAIMED', message: 'Parcel is no longer awaiting delivery.' } });
      return;
    }

    const updated = await prisma.parcelDelivery.update({
      where: { id },
      data: {
        status: 'In Transit',
        delivererId,
        delivererName,
      },
      select: {
        id: true,
        trackingNumber: true,
        courier: true,
        arrivalGate: true,
        destinationHostel: true,
        destinationRoom: true,
        status: true,
        reward: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/parcels/:id/verify-otp
 * Deliverer provides recipient's 4-digit OTP to complete delivery and release funds
 */
export const verifyDeliveryOtp: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0].message } });
      return;
    }

    const providedHash = hashOtp(parsed.data.otp);

    const result = await prisma.$transaction(async tx => {
      const parcel = await tx.parcelDelivery.findUnique({ where: { id } });
      if (!parcel) {
        throw new Error('NOT_FOUND: Parcel does not exist');
      }

      if (parcel.status === 'Delivered') {
        throw new Error('ALREADY_DELIVERED: Parcel has already been completed.');
      }

      if (parcel.deliveryOtpHash !== providedHash) {
        throw new Error('INVALID_OTP: Invalid 4-digit delivery verification OTP.');
      }

      // Mark delivered
      const deliveredParcel = await tx.parcelDelivery.update({
        where: { id },
        data: {
          status: 'Delivered',
          deliveredAt: new Date(),
        },
      });

      // Release reward to deliverer wallet ledger
      if (parcel.delivererId && parcel.reward > 0) {
        await tx.walletLedger.create({
          data: {
            userId: parcel.delivererId,
            type: 'CREDIT',
            amount: parcel.reward,
            idempotencyKey: `PARCEL-REWARD-${parcel.id}`,
            reason: `Earned ₹${parcel.reward} peer delivery reward for parcel ${parcel.trackingNumber}`,
            runningBalance: parcel.reward,
          },
        });
      }

      return deliveredParcel;
    });

    res.json({
      success: true,
      message: 'Delivery verified successfully! Reward released to peer deliverer wallet.',
      data: {
        id: result.id,
        trackingNumber: result.trackingNumber,
        status: result.status,
        deliveredAt: result.deliveredAt,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('NOT_FOUND')) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Parcel not found.' } });
    } else if (msg.includes('INVALID_OTP')) {
      res.status(401).json({ error: { code: 'INVALID_OTP', message: 'Invalid delivery verification OTP.' } });
    } else if (msg.includes('ALREADY_DELIVERED')) {
      res.status(409).json({ error: { code: 'ALREADY_DELIVERED', message: 'Parcel is already marked delivered.' } });
    } else {
      next(err);
    }
  }
};
