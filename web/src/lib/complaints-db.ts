import crypto from 'crypto';
import { prisma } from './prisma';

export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
export type ComplaintCategory = 'Hostel' | 'Mess and Food' | 'Infrastructure' | 'Academics' | 'Transport' | 'Campus Facilities' | 'Internet and Technology' | 'Other';

export interface ComplaintUpdate {
  id: string;
  status: ComplaintStatus;
  comment: string;
  timestamp: string;
}

export interface Complaint {
  ticketId: string; // Public ticket number e.g. TKT-1234
  secretHash: string; // Cryptographic SHA-256 hash of the tracking secret
  requesterId?: string; // Student ID (private / authenticated)
  type: 'Complaint' | 'Improvement';
  category: ComplaintCategory;
  subject: string;
  description: string;
  evidenceFiles: string[];
  status: ComplaintStatus;
  createdAt: string;
  updates: ComplaintUpdate[];
  rating?: number; // 1-5 feedback rating
  feedbackComment?: string;
  assignedTo?: string;
}

// Global variable to persist in-memory across hot reloads in dev (Next.js) & unit tests
const globalForComplaints = global as unknown as { complaintsDb: Complaint[] };
export const complaintsDb: Complaint[] = globalForComplaints.complaintsDb || [];
if (process.env.NODE_ENV !== 'production') globalForComplaints.complaintsDb = complaintsDb;

// Cryptographic SHA-256 hash for the tracking secret
export function hashSecret(secret: string): string {
  return crypto.createHash('sha256').update(secret.trim()).digest('hex');
}

// Generate unique ticket ID
export function generateTicketId(): string {
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `TKT-${timestamp}-${randomStr}`;
}

// Generate secure 32-character tracking secret
export function generateTrackingSecret(): string {
  return crypto.randomBytes(16).toString('hex');
}

// ── Synchronous API (for backwards-compatibility & instant unit test execution) ──

export function submitComplaint(
  type: 'Complaint' | 'Improvement',
  category: ComplaintCategory,
  subject: string,
  description: string,
  evidenceFiles: string[] = [],
  requesterId?: string
): { ticketId: string; trackingSecret: string } {
  const ticketId = generateTicketId();
  const trackingSecret = generateTrackingSecret();
  const secretHash = hashSecret(trackingSecret);

  const complaint: Complaint = {
    ticketId,
    secretHash,
    requesterId,
    type,
    category,
    subject,
    description,
    evidenceFiles,
    status: 'Submitted',
    createdAt: new Date().toISOString(),
    updates: [
      {
        id: Math.random().toString(36).substring(7),
        status: 'Submitted',
        comment: 'Ticket has been successfully submitted and queued for review.',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  complaintsDb.push(complaint);

  // Background async persistence to Neon PostgreSQL if available
  submitComplaintAsync(type, category, subject, description, evidenceFiles, requesterId, ticketId, secretHash).catch(() => {});

  return { ticketId, trackingSecret };
}

export function trackComplaint(ticketId: string, trackingSecret: string): Complaint | null {
  const providedHash = hashSecret(trackingSecret);
  const complaint = complaintsDb.find((c) => {
    if (c.ticketId !== ticketId) return false;
    const bufA = Buffer.from(c.secretHash, 'hex');
    const bufB = Buffer.from(providedHash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  });

  if (!complaint) return null;
  return { ...complaint };
}

export function submitFeedback(ticketId: string, trackingSecret: string, rating: number, feedbackComment: string): boolean {
  const providedHash = hashSecret(trackingSecret);
  const complaint = complaintsDb.find((c) => {
    if (c.ticketId !== ticketId) return false;
    const bufA = Buffer.from(c.secretHash, 'hex');
    const bufB = Buffer.from(providedHash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  });

  if (!complaint) return false;
  if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') return false;

  complaint.rating = rating;
  complaint.feedbackComment = feedbackComment;

  // Background async persistence
  submitFeedbackAsync(ticketId, trackingSecret, rating, feedbackComment).catch(() => {});

  return true;
}

export function adminGetAllComplaints(): Omit<Complaint, 'secretHash'>[] {
  return complaintsDb.map((c) => {
    const { secretHash: _secretHash, ...rest } = c;
    void _secretHash;
    return rest;
  });
}

export function adminUpdateComplaintStatus(ticketId: string, newStatus: ComplaintStatus, comment: string): boolean {
  const complaint = complaintsDb.find((c) => c.ticketId === ticketId);
  if (!complaint) return false;

  complaint.status = newStatus;
  complaint.updates.push({
    id: Math.random().toString(36).substring(7),
    status: newStatus,
    comment,
    timestamp: new Date().toISOString(),
  });

  // Background async persistence
  adminUpdateComplaintStatusAsync(ticketId, newStatus, comment).catch(() => {});

  return true;
}

// ── Persistent PostgreSQL Database Functions (Neon + Prisma) ──────────────────

export async function submitComplaintAsync(
  type: 'Complaint' | 'Improvement',
  category: ComplaintCategory,
  subject: string,
  description: string,
  evidenceFiles: string[] = [],
  requesterId?: string,
  explicitTicketId?: string,
  explicitSecretHash?: string
): Promise<{ ticketId: string; trackingSecret: string }> {
  const ticketId = explicitTicketId || generateTicketId();
  const trackingSecret = explicitSecretHash ? '' : generateTrackingSecret();
  const secretHash = explicitSecretHash || hashSecret(trackingSecret);

  try {
    await prisma.complaintTicket.create({
      data: {
        ticketId,
        requesterId,
        type,
        category,
        subject,
        description,
        evidenceFiles,
        status: 'Submitted',
        secretHash,
        logs: {
          create: {
            actionType: 'SUBMITTED',
            newStatus: 'Submitted',
            comment: 'Ticket has been successfully submitted and queued for review.',
            visibility: 'PUBLIC',
          },
        },
      },
    });
  } catch (err) {
    // Falls back to in-memory store
    console.warn('[complaints-db] Database persist warning:', (err as Error).message);
  }

  return { ticketId, trackingSecret };
}

export async function getStudentTicketsAsync(requesterId: string): Promise<Omit<Complaint, 'secretHash'>[]> {
  try {
    const dbTickets = await prisma.complaintTicket.findMany({
      where: { requesterId },
      include: {
        logs: {
          where: { visibility: 'PUBLIC' },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbTickets.length > 0) {
      return dbTickets.map((t) => ({
        ticketId: t.ticketId,
        type: t.type as 'Complaint' | 'Improvement',
        category: t.category as ComplaintCategory,
        subject: t.subject,
        description: t.description,
        evidenceFiles: t.evidenceFiles,
        status: t.status as ComplaintStatus,
        createdAt: t.createdAt.toISOString(),
        updates: t.logs.map((l) => ({
          id: l.id,
          status: (l.newStatus || 'Submitted') as ComplaintStatus,
          comment: l.comment,
          timestamp: l.createdAt.toISOString(),
        })),
        rating: t.rating ?? undefined,
        feedbackComment: t.feedbackComment ?? undefined,
        assignedTo: t.assignedTo ?? undefined,
      }));
    }
  } catch {
    // Database fallback
  }

  // Memory fallback
  return complaintsDb
    .filter((c) => !requesterId || c.requesterId === requesterId)
    .map((c) => {
      const { secretHash: _s, ...rest } = c;
      void _s;
      return rest;
    });
}

export async function trackComplaintAsync(ticketId: string, trackingSecret: string): Promise<Complaint | null> {
  const providedHash = hashSecret(trackingSecret);

  try {
    const t = await prisma.complaintTicket.findUnique({
      where: { ticketId },
      include: {
        logs: {
          where: { visibility: 'PUBLIC' },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (t) {
      const bufA = Buffer.from(t.secretHash, 'hex');
      const bufB = Buffer.from(providedHash, 'hex');
      if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
        return {
          ticketId: t.ticketId,
          secretHash: t.secretHash,
          type: t.type as 'Complaint' | 'Improvement',
          category: t.category as ComplaintCategory,
          subject: t.subject,
          description: t.description,
          evidenceFiles: t.evidenceFiles,
          status: t.status as ComplaintStatus,
          createdAt: t.createdAt.toISOString(),
          updates: t.logs.map((l) => ({
            id: l.id,
            status: (l.newStatus || 'Submitted') as ComplaintStatus,
            comment: l.comment,
            timestamp: l.createdAt.toISOString(),
          })),
          rating: t.rating ?? undefined,
          feedbackComment: t.feedbackComment ?? undefined,
          assignedTo: t.assignedTo ?? undefined,
        };
      }
      return null;
    }
  } catch {}

  return trackComplaint(ticketId, trackingSecret);
}

export async function adminGetAllComplaintsAsync(): Promise<Omit<Complaint, 'secretHash'>[]> {
  try {
    const dbTickets = await prisma.complaintTicket.findMany({
      include: {
        logs: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbTickets.length > 0) {
      return dbTickets.map((t) => ({
        ticketId: t.ticketId,
        type: t.type as 'Complaint' | 'Improvement',
        category: t.category as ComplaintCategory,
        subject: t.subject,
        description: t.description,
        evidenceFiles: t.evidenceFiles,
        status: t.status as ComplaintStatus,
        createdAt: t.createdAt.toISOString(),
        updates: t.logs.map((l) => ({
          id: l.id,
          status: (l.newStatus || 'Submitted') as ComplaintStatus,
          comment: l.comment,
          timestamp: l.createdAt.toISOString(),
        })),
        rating: t.rating ?? undefined,
        feedbackComment: t.feedbackComment ?? undefined,
        assignedTo: t.assignedTo ?? undefined,
      }));
    }
  } catch {}

  return adminGetAllComplaints();
}

export async function adminUpdateComplaintStatusAsync(
  ticketId: string,
  newStatus: ComplaintStatus,
  comment: string,
  actorId?: string,
  visibility: 'PUBLIC' | 'INTERNAL' = 'PUBLIC'
): Promise<boolean> {
  try {
    const ticket = await prisma.complaintTicket.findUnique({ where: { ticketId } });
    if (!ticket) return false;

    await prisma.complaintTicket.update({
      where: { ticketId },
      data: {
        status: newStatus,
        resolvedAt: newStatus === 'Resolved' || newStatus === 'Closed' ? new Date() : undefined,
        logs: {
          create: {
            actorId,
            actionType: 'STATUS_UPDATE',
            previousStatus: ticket.status,
            newStatus,
            comment,
            visibility,
          },
        },
      },
    });

    return true;
  } catch {
    return adminUpdateComplaintStatus(ticketId, newStatus, comment);
  }
}

export async function submitFeedbackAsync(
  ticketId: string,
  trackingSecret: string,
  rating: number,
  feedbackComment: string
): Promise<boolean> {
  const providedHash = hashSecret(trackingSecret);

  try {
    const ticket = await prisma.complaintTicket.findUnique({ where: { ticketId } });
    if (!ticket) return false;
    if (ticket.status !== 'Resolved' && ticket.status !== 'Closed') return false;

    const bufA = Buffer.from(ticket.secretHash, 'hex');
    const bufB = Buffer.from(providedHash, 'hex');
    if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      return false;
    }

    await prisma.complaintTicket.update({
      where: { ticketId },
      data: {
        rating,
        feedbackComment,
        logs: {
          create: {
            actionType: 'FEEDBACK_SUBMITTED',
            comment: `Student submitted feedback: ${rating} stars. "${feedbackComment || 'No comment'}"`,
            visibility: 'PUBLIC',
          },
        },
      },
    });

    return true;
  } catch {
    return submitFeedback(ticketId, trackingSecret, rating, feedbackComment);
  }
}
