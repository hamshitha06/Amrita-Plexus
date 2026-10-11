import { RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authenticate';

const createListingSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  category: z.string().min(2),
  condition: z.string().min(2),
  sellingPrice: z.number().int().positive(),
  originalPrice: z.number().int().optional(),
  pickupLocation: z.string().default('Campus Gate'),
  photos: z.array(z.string()).default([]),
  hostelBlock: z.string().optional(),
  contactPhone: z.string().optional(),
});

const updateListingSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  sellingPrice: z.number().int().positive().optional(),
  status: z.enum(['Available', 'Reserved', 'Sold', 'Deactivated']).optional(),
  pickupLocation: z.string().optional(),
});

/**
 * GET /api/marketplace
 * Browse & search marketplace listings
 */
export const getListings: RequestHandler = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    const where: Record<string, unknown> = {
      status: typeof status === 'string' && status ? status : 'Available',
    };

    if (typeof category === 'string' && category && category !== 'All') {
      where.category = category;
    }

    if (typeof search === 'string' && search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const listings = await prisma.marketplaceListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ success: true, data: listings });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/marketplace
 * Create a new item listing
 */
export const createListing: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const parsed = createListingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0].message } });
      return;
    }

    const sellerId = req.user?.userId || 'student-seller';
    const sellerName = req.user?.email ? req.user.email.split('@')[0] : 'Campus Student';

    const listing = await prisma.marketplaceListing.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
        condition: parsed.data.condition,
        sellingPrice: parsed.data.sellingPrice,
        originalPrice: parsed.data.originalPrice,
        pickupLocation: parsed.data.pickupLocation,
        photoUrl: parsed.data.photos[0] || null,
        sellerId,
        sellerName,
        status: 'Available',
      },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/marketplace/:id
 * Edit listing or mark RESERVED / SOLD
 */
export const updateListing: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const parsed = updateListingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0].message } });
      return;
    }

    const existing = await prisma.marketplaceListing.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Listing not found.' } });
      return;
    }

    // Ownership check if authenticated
    if (req.user?.userId && existing.sellerId && existing.sellerId !== req.user.userId) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'You are not authorized to update this listing.' } });
      return;
    }

    const updated = await prisma.marketplaceListing.update({
      where: { id },
      data: parsed.data,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/marketplace/:id
 * Deactivate or delete listing
 */
export const deleteListing: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.marketplaceListing.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Listing not found.' } });
      return;
    }

    if (req.user?.userId && existing.sellerId && existing.sellerId !== req.user.userId) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'You are not authorized to delete this listing.' } });
      return;
    }

    await prisma.marketplaceListing.delete({ where: { id } });
    res.json({ success: true, message: 'Listing deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
