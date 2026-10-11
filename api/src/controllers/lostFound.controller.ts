import { RequestHandler } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authenticate';

// ── Validation Schemas ────────────────────────────────────────────────────────

const reportLostSchema = z.object({
  title: z.string().min(2).max(120),
  category: z.string().min(2),
  publicDescription: z.string().min(10).max(2000),
  privateVerificationDetails: z.string().min(5).max(1000).optional(),
  location: z.string().min(2).max(150),
  eventDate: z.string().min(2),
  eventTime: z.string().optional(),
  photoUrl: z.string().optional(),
});

const reportFoundSchema = z.object({
  title: z.string().min(2).max(120),
  category: z.string().min(2),
  publicDescription: z.string().min(10).max(2000),
  privateVerificationDetails: z.string().min(5).max(1000),
  location: z.string().min(2).max(150),
  eventDate: z.string().min(2),
  eventTime: z.string().optional(),
  photoUrl: z.string().optional(),
  securityLevel: z.number().int().min(1).max(5).default(1),
  custodyLocation: z.string().min(2).default('Main Gate Security Desk'),
  handoverReported: z.boolean().default(false),
});

const submitClaimSchema = z.object({
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).min(1),
  evidencePhotoUrl: z.string().optional(),
  additionalNotes: z.string().max(500).optional(),
});

const handoverReportSchema = z.object({
  custodyLocation: z.string().min(2),
  notes: z.string().max(500).optional(),
});

const confirmCustodySchema = z.object({
  custodyLocation: z.string().min(2),
  conditionNotes: z.string().min(2),
  staffName: z.string().min(2),
  secondaryStaffName: z.string().optional(),
});

const reviewClaimSchema = z.object({
  status: z.enum(['Approved', 'Rejected']),
  reviewerName: z.string().min(2),
  notes: z.string().optional(),
});

const confirmReturnSchema = z.object({
  claimId: z.string(),
  otp: z.string().length(6),
  staffName: z.string().min(2),
  recipientName: z.string().optional(),
});

// ── Controller Handlers ───────────────────────────────────────────────────────

// POST /api/lost-found/lost
export const reportLostItem: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    const data = reportLostSchema.parse(req.body);

    const reporterName = typeof authUser?.email === 'string' ? authUser.email.split('@')[0] : 'Campus Student';
    const reporterEmail = typeof authUser?.email === 'string' ? authUser.email : 'student@cb.amrita.edu';

    const item = await prisma.lostFoundItem.create({
      data: {
        reportType: 'LOST',
        title: data.title,
        category: data.category,
        publicDescription: data.publicDescription,
        privateVerificationDetails: data.privateVerificationDetails,
        location: data.location,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        photoUrl: data.photoUrl,
        reporterId: authUser?.userId,
        reporterName,
        reporterEmail,
        securityLevel: 1,
        status: 'Reported',
        activityLogs: {
          create: {
            actorId: authUser?.userId,
            actorName: reporterName,
            action: 'REPORT_LOST',
            newStatus: 'Reported',
            remarks: 'Lost item report submitted by student',
            visibility: 'PUBLIC',
          },
        },
      },
      include: { activityLogs: true },
    });

    res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
};

// POST /api/lost-found/found
export const reportFoundItem: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    const data = reportFoundSchema.parse(req.body);

    const reporterName = typeof authUser?.email === 'string' ? authUser.email.split('@')[0] : 'Campus Student';
    const reporterEmail = typeof authUser?.email === 'string' ? authUser.email : 'student@cb.amrita.edu';

    const initialStatus = data.handoverReported ? 'Handover Reported' : 'Reported';

    const item = await prisma.lostFoundItem.create({
      data: {
        reportType: 'FOUND',
        title: data.title,
        category: data.category,
        publicDescription: data.publicDescription,
        privateVerificationDetails: data.privateVerificationDetails,
        location: data.location,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        photoUrl: data.photoUrl,
        reporterId: authUser?.userId,
        reporterName,
        reporterEmail,
        securityLevel: data.securityLevel,
        status: initialStatus,
        activityLogs: {
          create: {
            actorId: authUser?.userId,
            actorName: reporterName,
            action: 'REPORT_FOUND',
            newStatus: initialStatus,
            remarks: data.handoverReported
              ? `Found item reported. Student stated physical handover to ${data.custodyLocation}`
              : 'Found item reported by student finder',
            visibility: 'PUBLIC',
          },
        },
        custodyRecords: data.handoverReported ? {
          create: {
            custodyLocation: data.custodyLocation,
            reportedHandoverAt: new Date(),
            custodyStatus: 'Handover Reported',
          },
        } : undefined,
      },
      include: {
        custodyRecords: true,
        activityLogs: true,
      },
    });

    // Strip private verification details in the creation response
    const { privateVerificationDetails: _priv, ...safeItem } = item;
    void _priv;

    res.status(201).json({ data: safeItem });
  } catch (err) {
    next(err);
  }
};

// GET /api/lost-found (Public view - NEVER exposes private details)
export const getLostFoundList: RequestHandler = async (req, res, next) => {
  try {
    const { reportType, category, search } = req.query;

    const where: any = {};
    if (typeof reportType === 'string') where.reportType = reportType;
    if (typeof category === 'string' && category !== 'All') where.category = category;
    if (typeof search === 'string' && search.trim()) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { publicDescription: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.lostFoundItem.findMany({
      where,
      select: {
        id: true,
        reportType: true,
        title: true,
        category: true,
        publicDescription: true,
        location: true,
        eventDate: true,
        eventTime: true,
        photoUrl: true,
        securityLevel: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // STRICT PRIVACY: privateVerificationDetails NOT selected!
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ data: items });
  } catch (err) {
    next(err);
  }
};

// GET /api/lost-found/mine
export const getMyLostFoundItems: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    if (!authUser) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }

    const userEmail = typeof authUser.email === 'string' ? authUser.email : '';

    const items = await prisma.lostFoundItem.findMany({
      where: {
        OR: [
          { reporterId: authUser.userId },
          { reporterEmail: userEmail },
        ],
      },
      include: {
        custodyRecords: true,
        claims: {
          select: {
            id: true,
            claimantName: true,
            status: true,
            advisoryScore: true,
            createdAt: true,
          },
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ data: items });
  } catch (err) {
    next(err);
  }
};

// GET /api/lost-found/:id
export const getLostFoundItemDetails: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const item = await prisma.lostFoundItem.findUnique({
      where: { id: String(id) },
      include: {
        custodyRecords: true,
        claims: {
          select: {
            id: true,
            claimantName: true,
            status: true,
            createdAt: true,
            reviewedAt: true,
          },
        },
        activityLogs: {
          where: { visibility: 'PUBLIC' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
      return;
    }

    // Only the reporter or an admin/staff can see private verification details
    const isOwner = authUser && (item.reporterId === authUser.userId || item.reporterEmail === authUser.email);
    const isStaff = authUser && (authUser.roles.includes('staff') || authUser.roles.includes('admin'));

    if (!isOwner && !isStaff) {
      const { privateVerificationDetails: _priv, ...safeItem } = item;
      void _priv;
      res.status(200).json({ data: safeItem });
      return;
    }

    res.status(200).json({ data: item });
  } catch (err) {
    next(err);
  }
};

// POST /api/lost-found/:id/claims
export const submitOwnershipClaim: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { answers, evidencePhotoUrl, additionalNotes } = submitClaimSchema.parse(req.body);

    const item = await prisma.lostFoundItem.findUnique({ where: { id: String(id) } });
    if (!item) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
      return;
    }

    if (item.reportType !== 'FOUND') {
      res.status(400).json({ error: { code: 'INVALID_ITEM', message: 'Claims can only be filed against found items.' } });
      return;
    }

    if (item.status === 'Returned' || item.status === 'Closed') {
      res.status(400).json({ error: { code: 'ITEM_ALREADY_RETURNED', message: 'This item has already been returned and collected.' } });
      return;
    }

    // Prevent self-claims
    if (authUser && (item.reporterId === authUser.userId || item.reporterEmail === authUser.email)) {
      res.status(400).json({ error: { code: 'SELF_CLAIM_NOT_ALLOWED', message: 'Finders cannot submit ownership claims on items they reported found.' } });
      return;
    }

    const claimantName = typeof authUser?.email === 'string' ? authUser.email.split('@')[0] : 'Claimant Student';
    const claimantEmail = typeof authUser?.email === 'string' ? authUser.email : 'claimant@cb.amrita.edu';

    // Limit repeated claims
    const existingClaimsCount = await prisma.ownershipClaim.count({
      where: {
        itemId: String(id),
        claimantEmail,
        status: { not: 'Rejected' },
      },
    });

    if (existingClaimsCount >= 3) {
      res.status(429).json({ error: { code: 'CLAIM_LIMIT_REACHED', message: 'Maximum claims limit reached for this item.' } });
      return;
    }

    const claim = await prisma.ownershipClaim.create({
      data: {
        itemId: String(id),
        claimantId: authUser?.userId,
        claimantName,
        claimantEmail,
        privateClaimDetails: answers,
        evidencePhotoUrl,
        additionalNotes,
        status: 'Under Review',
      },
    });

    // Update item status if it was just reported
    if (item.status === 'Reported' || item.status === 'Custody Confirmed') {
      await prisma.lostFoundItem.update({
        where: { id: String(id) },
        data: {
          status: 'Claim Under Review',
          activityLogs: {
            create: {
              actorId: authUser?.userId,
              actorName: claimantName,
              action: 'CLAIM_SUBMITTED',
              previousStatus: item.status,
              newStatus: 'Claim Under Review',
              remarks: 'Ownership claim submitted with verification answers',
              visibility: 'PUBLIC',
            },
          },
        },
      });
    }

    res.status(201).json({
      data: {
        id: claim.id,
        itemId: claim.itemId,
        status: claim.status,
        message: 'Ownership claim registered and queued for verification.',
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/lost-found/:id/handover-report (Student reports physical handover to security)
export const reportHandoverToSecurity: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { custodyLocation, notes } = handoverReportSchema.parse(req.body);

    const item = await prisma.lostFoundItem.findUnique({ where: { id: String(id) } });
    if (!item) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
      return;
    }

    // Only the reporter can report handover
    if (authUser && item.reporterId && item.reporterId !== authUser.userId) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
      return;
    }

    const actorName = typeof authUser?.email === 'string' ? authUser.email.split('@')[0] : item.reporterName;

    // Two-state enforcement: moves to 'Handover Reported', NEVER 'Custody Confirmed'
    const updated = await prisma.lostFoundItem.update({
      where: { id: String(id) },
      data: {
        status: 'Handover Reported',
        custodyRecords: {
          create: {
            custodyLocation,
            reportedHandoverAt: new Date(),
            custodyStatus: 'Handover Reported',
            conditionNotes: notes,
          },
        },
        activityLogs: {
          create: {
            actorId: authUser?.userId,
            actorName,
            action: 'HANDOVER_REPORTED',
            previousStatus: item.status,
            newStatus: 'Handover Reported',
            remarks: `Finder reported physical handover at ${custodyLocation}. Awaiting security confirmation.`,
            visibility: 'PUBLIC',
          },
        },
      },
      include: { custodyRecords: true, activityLogs: true },
    });

    res.status(200).json({
      data: updated,
      message: 'Physical handover reported. Security desk receipt confirmation pending.',
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/lost-found/:id/confirm-custody (Security / Admin confirms physical receipt)
export const confirmSecurityCustody: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { custodyLocation, conditionNotes, staffName, secondaryStaffName } = confirmCustodySchema.parse(req.body);

    const item = await prisma.lostFoundItem.findUnique({ where: { id: String(id) } });
    if (!item) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
      return;
    }

    // High value Dual-Staff check
    if (item.securityLevel === 5 && !secondaryStaffName) {
      res.status(400).json({
        error: {
          code: 'DUAL_STAFF_REQUIRED',
          message: 'Level 5 High-Value items require dual-staff authorization.',
        },
      });
      return;
    }

    // Create or update custody record to 'Custody Confirmed'
    const updated = await prisma.lostFoundItem.update({
      where: { id: String(id) },
      data: {
        status: 'Custody Confirmed',
        custodyRecords: {
          create: {
            custodyLocation,
            confirmedHandoverAt: new Date(),
            confirmedBy: staffName,
            secondaryOfficer: secondaryStaffName,
            conditionNotes,
            custodyStatus: 'Custody Confirmed',
          },
        },
        activityLogs: {
          create: {
            actorId: authUser?.userId,
            actorName: staffName,
            action: 'CUSTODY_CONFIRMED',
            previousStatus: item.status,
            newStatus: 'Custody Confirmed',
            remarks: `Physical receipt confirmed at ${custodyLocation} by ${staffName}. Item held in campus security custody.`,
            visibility: 'PUBLIC',
          },
        },
      },
      include: { custodyRecords: true, activityLogs: true },
    });

    res.status(200).json({
      data: updated,
      message: `Physical custody confirmed at ${custodyLocation}.`,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/lost-found/claims/:claimId/review
export const reviewOwnershipClaim: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    const claimId = Array.isArray(req.params.claimId) ? req.params.claimId[0] : req.params.claimId;
    const { status: decision, reviewerName, notes } = reviewClaimSchema.parse(req.body);

    const claim = await prisma.ownershipClaim.findUnique({
      where: { id: String(claimId) },
    });

    if (!claim) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Claim not found' } });
      return;
    }

    const item = await prisma.lostFoundItem.findUnique({
      where: { id: claim.itemId },
    });

    if (!item) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Associated item not found' } });
      return;
    }

    // Prevent claimants from reviewing their own claim
    if (authUser && (claim.claimantId === authUser.userId || claim.claimantEmail === authUser.email)) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'You cannot review your own ownership claim.' } });
      return;
    }

    // Generate 6-digit OTP code if approved
    const otp = decision === 'Approved' ? crypto.randomInt(100000, 999999).toString() : undefined;
    const otpHash = otp ? crypto.createHash('sha256').update(otp).digest('hex') : undefined;

    const updatedClaim = await prisma.ownershipClaim.update({
      where: { id: String(claimId) },
      data: {
        status: decision,
        reviewedBy: reviewerName,
        reviewedAt: new Date(),
      },
    });

    // Update item status and custody record with OTP hash
    const newStatus = decision === 'Approved' ? 'Approved for Handover' : item.status;
    await prisma.lostFoundItem.update({
      where: { id: claim.itemId },
      data: {
        status: newStatus,
        activityLogs: {
          create: {
            actorId: authUser?.userId,
            actorName: reviewerName,
            action: decision === 'Approved' ? 'CLAIM_APPROVED' : 'CLAIM_REJECTED',
            previousStatus: item.status,
            newStatus,
            remarks: `Claim reviewed by ${reviewerName}: ${decision}. ${notes || ''}`,
            visibility: 'PUBLIC',
          },
        },
      },
    });

    if (otpHash) {
      await prisma.itemCustodyRecord.updateMany({
        where: { itemId: claim.itemId, custodyStatus: 'Custody Confirmed' },
        data: { handoverOtpHash: otpHash },
      });
    }

    res.status(200).json({
      data: {
        claim: updatedClaim,
        handoverOtp: otp, // Returned to the approved claimant for physical pickup verification
        message: decision === 'Approved'
          ? 'Claim approved. Present the 6-digit OTP along with your physical College ID card at the Security Desk.'
          : 'Claim was not approved based on verification review.',
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/lost-found/:id/confirm-return (Verified physical return)
export const confirmVerifiedReturn: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { claimId, otp, staffName, recipientName } = confirmReturnSchema.parse(req.body);

    const item = await prisma.lostFoundItem.findUnique({
      where: { id: String(id) },
      include: { custodyRecords: true },
    });

    if (!item) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
      return;
    }

    if (item.status === 'Returned') {
      res.status(400).json({ error: { code: 'ALREADY_RETURNED', message: 'Item has already been marked as returned.' } });
      return;
    }

    // Verify OTP against stored hash
    const inputHash = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const latestCustody = item.custodyRecords.find(r => r.custodyStatus === 'Custody Confirmed');

    if (latestCustody?.handoverOtpHash && latestCustody.handoverOtpHash !== inputHash) {
      res.status(400).json({ error: { code: 'INVALID_OTP', message: 'Invalid 6-digit handover OTP code.' } });
      return;
    }

    // Execute return
    const now = new Date();
    await prisma.lostFoundItem.update({
      where: { id: String(id) },
      data: {
        status: 'Returned',
        activityLogs: {
          create: {
            actorId: authUser?.userId,
            actorName: staffName,
            action: 'ITEM_RETURNED',
            previousStatus: item.status,
            newStatus: 'Returned',
            remarks: `Physical return confirmed to verified owner (${recipientName || 'Verified Claimant'}) by Officer ${staffName}. Physical College ID verified.`,
            visibility: 'PUBLIC',
          },
        },
      },
    });

    await prisma.ownershipClaim.update({
      where: { id: claimId },
      data: { status: 'Returned' },
    });

    if (latestCustody) {
      await prisma.itemCustodyRecord.update({
        where: { id: latestCustody.id },
        data: {
          custodyStatus: 'Returned',
          returnedAt: now,
          recipientName: recipientName || 'Verified Student',
        },
      });
    }

    res.status(200).json({
      message: 'Item verified and successfully returned to owner. Digital custody record closed.',
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/lost-found/custody/records
export const getCustodyRecords: RequestHandler = async (_req, res, next) => {
  try {
    const records = await prisma.itemCustodyRecord.findMany({
      include: {
        item: {
          select: {
            id: true,
            title: true,
            category: true,
            securityLevel: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ data: records });
  } catch (err) {
    next(err);
  }
};
