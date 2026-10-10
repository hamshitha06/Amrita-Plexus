// Mock In-Memory Database for Complaints & Improvements

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
  secretHash: string; // The "hashed" tracking secret
  type: 'Complaint' | 'Improvement';
  category: ComplaintCategory;
  subject: string;
  description: string;
  evidenceFiles: string[]; // URLs or file names (mocked)
  status: ComplaintStatus;
  createdAt: string;
  updates: ComplaintUpdate[];
  rating?: number; // 1-5 feedback rating
  feedbackComment?: string;
}

// Global variable to persist across hot reloads in dev (Next.js)
const globalForComplaints = global as unknown as { complaintsDb: Complaint[] };
export const complaintsDb: Complaint[] = globalForComplaints.complaintsDb || [];
if (process.env.NODE_ENV !== 'production') globalForComplaints.complaintsDb = complaintsDb;

// Hash simulation for the tracking secret (in a real app, use bcrypt/argon2)
export function hashSecret(secret: string): string {
  // Simplistic hash mock for demo purposes ONLY
  return btoa(secret).split('').reverse().join('');
}

// Generate unique ticket ID
export function generateTicketId(): string {
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `TKT-${timestamp}-${randomStr}`;
}

// Generate tracking secret
export function generateTrackingSecret(): string {
  return Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
}

// API Functions

export function submitComplaint(
  type: 'Complaint' | 'Improvement',
  category: ComplaintCategory,
  subject: string,
  description: string,
  evidenceFiles: string[] = []
): { ticketId: string; trackingSecret: string } {
  const ticketId = generateTicketId();
  const trackingSecret = generateTrackingSecret();
  const secretHash = hashSecret(trackingSecret);

  const complaint: Complaint = {
    ticketId,
    secretHash,
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
      }
    ]
  };

  complaintsDb.push(complaint);
  return { ticketId, trackingSecret };
}

export function trackComplaint(ticketId: string, trackingSecret: string): Complaint | null {
  const hash = hashSecret(trackingSecret);
  const complaint = complaintsDb.find(c => c.ticketId === ticketId && c.secretHash === hash);
  if (!complaint) return null;
  return { ...complaint }; // Return copy
}

export function submitFeedback(ticketId: string, trackingSecret: string, rating: number, feedbackComment: string): boolean {
  const hash = hashSecret(trackingSecret);
  const complaint = complaintsDb.find(c => c.ticketId === ticketId && c.secretHash === hash);
  if (!complaint) return false;
  if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') return false;

  complaint.rating = rating;
  complaint.feedbackComment = feedbackComment;
  return true;
}

// Admin API Functions

export function adminGetAllComplaints(): Omit<Complaint, 'secretHash'>[] {
  // Strip the secret hash for admin view
  return complaintsDb.map(({ secretHash, ...rest }) => rest) as any;
}

export function adminUpdateComplaintStatus(ticketId: string, newStatus: ComplaintStatus, comment: string): boolean {
  const complaint = complaintsDb.find(c => c.ticketId === ticketId);
  if (!complaint) return false;

  complaint.status = newStatus;
  complaint.updates.push({
    id: Math.random().toString(36).substring(7),
    status: newStatus,
    comment,
    timestamp: new Date().toISOString()
  });

  return true;
}
