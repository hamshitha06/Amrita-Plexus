import { RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authenticate';

// Validation schemas
const createServiceRequestSchema = z.object({
  serviceId: z.string().optional(),
  serviceTitle: z.string().min(2),
  providerId: z.string().optional(),
  providerName: z.string().min(2),
  providerHostel: z.string().optional(),
  providerPhone: z.string().optional(),
  appointmentDate: z.string().min(2),
  customerNotes: z.string().min(2),
  price: z.number().int().nonnegative(),
  pricingModel: z.string().default('Fixed'),
});

const cancelServiceRequestSchema = z.object({
  cancellationReason: z.string().max(300).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['Accepted', 'In Progress', 'Completed', 'Rejected', 'Cancelled']),
  notes: z.string().max(300).optional(),
});

// GET /api/service-requests/my-requests
export const getMyRequests: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    if (!authUser) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }

    const emailPrefix = typeof authUser.email === 'string' ? authUser.email.split('@')[0] : '';

    const requests = await prisma.serviceRequest.findMany({
      where: {
        OR: [
          { requesterId: authUser.userId },
          { requesterName: emailPrefix },
        ],
      },
      include: {
        statusLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { requestedAt: 'desc' },
    });

    res.status(200).json({ data: requests });
  } catch (err) {
    next(err);
  }
};

// GET /api/service-requests/incoming
export const getIncomingRequests: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    if (!authUser) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }

    const emailPrefix = typeof authUser.email === 'string' ? authUser.email.split('@')[0] : '';

    const requests = await prisma.serviceRequest.findMany({
      where: {
        OR: [
          { providerId: authUser.userId },
          { providerName: { contains: emailPrefix, mode: 'insensitive' } },
        ],
      },
      include: {
        statusLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { requestedAt: 'desc' },
    });

    res.status(200).json({ data: requests });
  } catch (err) {
    next(err);
  }
};

// POST /api/service-requests
export const createServiceRequest: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    const data = createServiceRequestSchema.parse(req.body);

    const requesterName = typeof authUser?.email === 'string' ? authUser.email.split('@')[0] : 'Student Client';
    const requestNumber = `SRV-REQ-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReq = await prisma.serviceRequest.create({
      data: {
        requestNumber,
        serviceId: data.serviceId,
        serviceTitle: data.serviceTitle,
        requesterId: authUser?.userId,
        requesterName,
        requesterHostel: 'Hostel 4 Room 201',
        requesterPhone: '+91 98765 43211',
        providerId: data.providerId,
        providerName: data.providerName,
        providerHostel: data.providerHostel,
        providerPhone: data.providerPhone || '+91 90000 00000',
        appointmentDate: data.appointmentDate,
        customerNotes: data.customerNotes,
        price: data.price,
        pricingModel: data.pricingModel,
        status: 'Pending',
        statusLogs: {
          create: {
            previousStatus: 'None',
            newStatus: 'Pending',
            changedBy: requesterName,
            reason: 'Service request created by student client',
          },
        },
      },
      include: { statusLogs: true },
    });

    res.status(201).json({ data: newReq });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/service-requests/:id/cancel
export const cancelServiceRequest: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { cancellationReason } = cancelServiceRequestSchema.parse(req.body);

    const request = await prisma.serviceRequest.findFirst({
      where: {
        OR: [{ id: String(id) }, { requestNumber: String(id) }],
      },
    });

    if (!request) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Service request not found.' } });
      return;
    }

    // Ownership check: only the requester can cancel
    if (authUser && request.requesterId && request.requesterId !== authUser.userId) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Service request not found.' } });
      return;
    }

    // Rules: Completed, Rejected, or already Cancelled requests cannot be cancelled
    if (request.status === 'Completed') {
      res.status(400).json({ error: { code: 'INVALID_TRANSITION', message: 'Completed service requests cannot be cancelled.' } });
      return;
    }
    if (request.status === 'Cancelled') {
      res.status(400).json({ error: { code: 'ALREADY_CANCELLED', message: 'This service request is already cancelled.' } });
      return;
    }
    if (request.status === 'Rejected') {
      res.status(400).json({ error: { code: 'INVALID_TRANSITION', message: 'Rejected service requests cannot be cancelled.' } });
      return;
    }

    const changedBy = typeof authUser?.email === 'string' ? authUser.email.split('@')[0] : request.requesterName;

    const updated = await prisma.serviceRequest.update({
      where: { id: request.id },
      data: {
        status: 'Cancelled',
        cancellationReason: cancellationReason || 'Cancelled by student client',
        statusLogs: {
          create: {
            previousStatus: request.status,
            newStatus: 'Cancelled',
            changedBy,
            reason: cancellationReason || 'Student cancelled request',
          },
        },
      },
      include: { statusLogs: { orderBy: { createdAt: 'desc' } } },
    });

    res.status(200).json({ data: updated, message: 'Service request cancelled successfully.' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/service-requests/:id/status
export const updateServiceRequestStatus: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status: newStatus, notes } = updateStatusSchema.parse(req.body);

    const request = await prisma.serviceRequest.findFirst({
      where: {
        OR: [{ id: String(id) }, { requestNumber: String(id) }],
      },
    });

    if (!request) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Service request not found.' } });
      return;
    }

    // Provider check: only assigned provider can manage
    if (authUser && request.providerId && request.providerId !== authUser.userId) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Service request not found.' } });
      return;
    }

    // Valid transitions
    const validTransitions: Record<string, string[]> = {
      Pending: ['Accepted', 'Rejected', 'Cancelled'],
      Accepted: ['In Progress', 'Cancelled'],
      'In Progress': ['Completed', 'Cancelled'],
      Completed: [],
      Rejected: [],
      Cancelled: [],
    };

    const allowed = validTransitions[request.status] || [];
    if (!allowed.includes(newStatus)) {
      res.status(400).json({
        error: {
          code: 'INVALID_STATUS_TRANSITION',
          message: `Cannot transition service request from "${request.status}" to "${newStatus}".`,
        },
      });
      return;
    }

    const changedBy = typeof authUser?.email === 'string' ? authUser.email.split('@')[0] : request.providerName;

    const updated = await prisma.serviceRequest.update({
      where: { id: request.id },
      data: {
        status: newStatus,
        statusLogs: {
          create: {
            previousStatus: request.status,
            newStatus,
            changedBy,
            reason: notes || `Provider updated status to ${newStatus}`,
          },
        },
      },
      include: { statusLogs: { orderBy: { createdAt: 'desc' } } },
    });

    res.status(200).json({ data: updated, message: `Status updated to ${newStatus}.` });
  } catch (err) {
    next(err);
  }
};
