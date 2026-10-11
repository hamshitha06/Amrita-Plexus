import { RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authenticate';

const updateMessScheduleSchema = z.object({
  hostelBlock: z.string().default('General'),
  dayOfWeek: z.string().min(3),
  mealType: z.enum(['Breakfast', 'Lunch', 'Snacks', 'Dinner']),
  menuItems: z.array(z.string()).min(1),
  timings: z.string().optional(),
});

/**
 * GET /api/hostel/mess-menu
 * Get weekly or daily mess menu
 */
export const getMessMenu: RequestHandler = async (req, res, next) => {
  try {
    const { hostelBlock, dayOfWeek } = req.query;
    const where: Record<string, unknown> = {};

    if (typeof hostelBlock === 'string' && hostelBlock) {
      where.hostelBlock = hostelBlock;
    }
    if (typeof dayOfWeek === 'string' && dayOfWeek) {
      where.dayOfWeek = dayOfWeek;
    }

    const schedules = await prisma.messMenuSchedule.findMany({
      where,
      orderBy: [{ dayOfWeek: 'asc' }, { mealType: 'asc' }],
    });

    res.json({ success: true, data: schedules });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/hostel/mess-menu
 * Update mess menu schedule by students
 */
export const updateMessMenu: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const parsed = updateMessScheduleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0].message } });
      return;
    }

    const { hostelBlock, dayOfWeek, mealType, menuItems } = parsed.data;
    const updatedBy = req.user?.email ? req.user.email.split('@')[0] : 'Campus Student';

    const schedule = await prisma.messMenuSchedule.upsert({
      where: {
        hostelName_dayOfWeek_mealType: {
          hostelName: hostelBlock,
          dayOfWeek,
          mealType,
        },
      },
      update: {
        menuItems,
        updatedBy,
      },
      create: {
        hostelName: hostelBlock,
        dayOfWeek,
        mealType,
        menuItems,
        updatedBy,
      },
    });

    res.json({ success: true, data: schedule });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/hostel/snacks
 * Get snack counter items and prices
 */
export const getSnacks: RequestHandler = async (_req, res, next) => {
  try {
    const snacks = await prisma.hostelSnackItem.findMany({
      orderBy: { category: 'asc' },
    });
    res.json({ success: true, data: snacks });
  } catch (err) {
    next(err);
  }
};
