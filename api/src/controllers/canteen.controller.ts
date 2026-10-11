import { RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authenticate';

// Validation schemas
const publishMenuSchema = z.object({
  canteenId: z.string().min(1),
  canteenName: z.string().min(1),
  imageReference: z.string().optional(),
  rawExtractedText: z.string().optional(),
  items: z.array(
    z.object({
      title: z.string().min(1),
      category: z.string().default('Snacks'),
      price: z.number().int().positive(),
      prepTime: z.string().default('10 mins'),
      isAvailable: z.boolean().default(true),
      aiVerifiedScore: z.number().default(98.5),
      needsReview: z.boolean().default(false),
    })
  ).min(1),
});

const createFoodRequestSchema = z.object({
  canteenId: z.string().min(1),
  canteenName: z.string().min(1),
  canteenLocation: z.string().default('Campus Canteen'),
  items: z.array(
    z.object({
      title: z.string().min(1),
      price: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
  deliveryAddress: z.string().min(1),
  instructions: z.string().optional(),
  foodSubtotal: z.number().int().positive(),
  deliveryFee: z.number().int().nonnegative(),
  totalAmount: z.number().int().positive(),
});

const updateRequestStatusSchema = z.object({
  status: z.enum(['Open', 'Accepted', 'Picked Up', 'Delivered', 'Cancelled']),
});

/**
 * GET /api/canteen/menus
 * Fetch active published menus, optionally filtered by canteenId
 */
export const getMenus: RequestHandler = async (req, res, next) => {
  try {
    const { canteenId } = req.query;

    const whereClause: { isCurrent: boolean; canteenId?: string } = {
      isCurrent: true,
    };
    if (typeof canteenId === 'string' && canteenId.trim()) {
      whereClause.canteenId = canteenId;
    }

    const menus = await prisma.canteenMenu.findMany({
      where: whereClause,
      include: {
        items: {
          orderBy: [{ category: 'asc' }, { title: 'asc' }],
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: 10,
    });

    res.json({
      success: true,
      data: menus,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/canteen/menus
 * Publish a verified digital canteen menu extracted from OCR
 */
export const publishMenu: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const parsed = publishMenuSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0].message } });
      return;
    }

    const { canteenId, canteenName, imageReference, rawExtractedText, items } = parsed.data;
    const uploaderId = req.user?.userId || 'anonymous-student';
    const uploaderName = req.user?.email ? req.user.email.split('@')[0] : 'Campus Student';

    // Transaction: mark older current menus for this canteen as isCurrent: false, then insert new menu with items
    const createdMenu = await prisma.$transaction(async tx => {
      await tx.canteenMenu.updateMany({
        where: { canteenId, isCurrent: true },
        data: { isCurrent: false },
      });

      const menu = await tx.canteenMenu.create({
        data: {
          canteenId,
          canteenName,
          uploaderId,
          uploaderName,
          imageReference: imageReference || null,
          rawExtractedText: rawExtractedText || null,
          reviewStatus: 'PUBLISHED',
          isCurrent: true,
          items: {
            create: items.map(item => ({
              canteenId,
              title: item.title,
              category: item.category,
              price: item.price,
              prepTime: item.prepTime,
              isAvailable: item.isAvailable,
              aiVerifiedScore: item.aiVerifiedScore,
              needsReview: item.needsReview,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return menu;
    });

    res.status(201).json({
      success: true,
      message: `Digital menu for ${canteenName} successfully published with ${items.length} dishes.`,
      data: createdMenu,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/canteen/requests
 * Fetch peer food requests
 */
export const getFoodRequests: RequestHandler = async (req, res, next) => {
  try {
    const { canteenId, status } = req.query;
    const where: Record<string, unknown> = {};

    if (typeof canteenId === 'string' && canteenId) {
      where.canteenId = canteenId;
    }
    if (typeof status === 'string' && status) {
      where.status = status;
    }

    const requests = await prisma.foodRequest.findMany({
      where,
      orderBy: { postedAt: 'desc' },
      take: 50,
    });

    res.json({ success: true, data: requests });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/canteen/requests
 * Create a new peer food request
 */
export const createFoodRequest: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const parsed = createFoodRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0].message } });
      return;
    }

    const requesterId = req.user?.userId || 'student-guest';
    const requesterName = req.user?.email ? req.user.email.split('@')[0] : 'Campus Student';
    const requestNumber = `FR-${Date.now().toString().slice(-6)}`;

    const newRequest = await prisma.foodRequest.create({
      data: {
        requestNumber,
        requesterId,
        requesterName,
        requesterRoom: 'Hostel Room',
        ...parsed.data,
        status: 'Open',
      },
    });

    res.status(201).json({ success: true, data: newRequest });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/canteen/requests/:id/status
 * Update food request status (accept, pickup, deliver)
 */
export const updateFoodRequestStatus: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const parsed = updateRequestStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0].message } });
      return;
    }

    const { status } = parsed.data;
    const delivererId = req.user?.userId;
    const delivererName = req.user?.email ? req.user.email.split('@')[0] : 'Campus Deliverer';

    const existing = await prisma.foodRequest.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Food request not found.' } });
      return;
    }

    const updated = await prisma.$transaction(async tx => {
      const reqUpdated = await tx.foodRequest.update({
        where: { id },
        data: {
          status,
          ...(status === 'Accepted' && { delivererId, delivererName }),
          ...(status === 'Delivered' && { completedAt: new Date() }),
        },
      });

      // If delivered, create a wallet ledger credit for deliverer
      if (status === 'Delivered' && existing.deliveryFee > 0 && delivererId) {
        await tx.walletLedger.create({
          data: {
            userId: delivererId,
            type: 'CREDIT',
            amount: existing.deliveryFee,
            idempotencyKey: `CANTEEN-FEE-${existing.id}`,
            reason: `Earned ₹${existing.deliveryFee} delivery fee for request #${existing.requestNumber}`,
            runningBalance: existing.deliveryFee,
          },
        });
      }

      return reqUpdated;
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
