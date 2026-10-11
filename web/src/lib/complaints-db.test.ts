import { describe, it, expect, beforeEach } from 'vitest';
import {
  submitComplaint,
  trackComplaint,
  submitFeedback,
  adminGetAllComplaints,
  adminUpdateComplaintStatus,
  hashSecret,
  generateTicketId,
  generateTrackingSecret,
  complaintsDb,
} from './complaints-db';

describe('Complaints & Improvements Database Layer', () => {
  beforeEach(() => {
    complaintsDb.splice(0, complaintsDb.length);
  });

  it('generateTicketId produces TKT- prefixed unique IDs', () => {
    const id1 = generateTicketId();
    const id2 = generateTicketId();
    expect(id1.startsWith('TKT-')).toBe(true);
    expect(id1).not.toBe(id2);
  });

  it('generateTrackingSecret produces non-empty strings', () => {
    const s = generateTrackingSecret();
    expect(s.length).toBeGreaterThanOrEqual(10);
  });

  it('hashSecret is deterministic', () => {
    const h1 = hashSecret('mysecret');
    const h2 = hashSecret('mysecret');
    expect(h1).toBe(h2);
  });

  it('hashSecret does not return the plain secret', () => {
    const s = 'mysecret123';
    expect(hashSecret(s)).not.toBe(s);
  });

  it('submitComplaint creates a record and returns ticketId + trackingSecret', () => {
    const result = submitComplaint('Complaint', 'Hostel', 'Dirty bathrooms', 'The hostel bathrooms have not been cleaned for a week. This is a demo description.');
    expect(result.ticketId.startsWith('TKT-')).toBe(true);
    expect(result.trackingSecret.length).toBeGreaterThan(0);
    expect(complaintsDb.length).toBe(1);
    expect(complaintsDb[0].status).toBe('Submitted');
    expect(complaintsDb[0].secretHash).not.toBe(result.trackingSecret);
  });

  it('trackComplaint finds the record with correct credentials', () => {
    const { ticketId, trackingSecret } = submitComplaint('Improvement', 'Mess and Food', 'Better breakfast', 'Please provide more variety at breakfast. More items would improve satisfaction.');
    const found = trackComplaint(ticketId, trackingSecret);
    expect(found).not.toBeNull();
    expect(found?.ticketId).toBe(ticketId);
    expect(found?.type).toBe('Improvement');
  });

  it('trackComplaint returns null for wrong secret', () => {
    const { ticketId } = submitComplaint('Complaint', 'Infrastructure', 'Broken lights', 'The corridor lights on floor 3 have been non-functional for two weeks now.');
    const result = trackComplaint(ticketId, 'wrongsecret');
    expect(result).toBeNull();
  });

  it('trackComplaint returns null for unknown ticketId', () => {
    const result = trackComplaint('TKT-0000-FAKE', 'anysecret');
    expect(result).toBeNull();
  });

  it('adminGetAllComplaints strips secretHash', () => {
    submitComplaint('Complaint', 'Academics', 'Lab issues', 'The lab computers are outdated and often crash during exams, impacting performance significantly.');
    const list = adminGetAllComplaints();
    expect(list.length).toBeGreaterThan(0);
    for (const c of list) {
      expect('secretHash' in c).toBe(false);
    }
  });

  it('adminUpdateComplaintStatus transitions status correctly', () => {
    const { ticketId, trackingSecret } = submitComplaint('Complaint', 'Transport', 'Late bus', 'The campus shuttle consistently arrives 30 minutes late in the mornings, affecting lecture attendance.');
    const ok = adminUpdateComplaintStatus(ticketId, 'Under Review', 'We have received your complaint and are reviewing it.');
    expect(ok).toBe(true);
    const tracked = trackComplaint(ticketId, trackingSecret);
    expect(tracked?.status).toBe('Under Review');
    expect(tracked?.updates.some(u => u.status === 'Under Review')).toBe(true);
  });

  it('adminUpdateComplaintStatus returns false for unknown ticket', () => {
    const ok = adminUpdateComplaintStatus('TKT-FAKE-0000', 'Resolved', 'Resolved.');
    expect(ok).toBe(false);
  });

  it('submitFeedback works after complaint is resolved', () => {
    const { ticketId, trackingSecret } = submitComplaint('Complaint', 'Campus Facilities', 'Gym closed', 'The gymnasium has been closed unexpectedly for over a month without any announcement or notice.');
    adminUpdateComplaintStatus(ticketId, 'Under Review', 'Reviewing.');
    adminUpdateComplaintStatus(ticketId, 'Resolved', 'Gym is now open.');
    const ok = submitFeedback(ticketId, trackingSecret, 4, 'Good resolution, thank you.');
    expect(ok).toBe(true);
    const tracked = trackComplaint(ticketId, trackingSecret);
    expect(tracked?.rating).toBe(4);
  });

  it('submitFeedback fails if ticket is not yet resolved', () => {
    const { ticketId, trackingSecret } = submitComplaint('Complaint', 'Other', 'Test', 'This is a test complaint for the feedback-before-resolution validation path testing.');
    const ok = submitFeedback(ticketId, trackingSecret, 5, 'Thanks!');
    expect(ok).toBe(false);
  });

  it('submitFeedback fails with wrong secret', () => {
    const { ticketId } = submitComplaint('Complaint', 'Other', 'Test', 'This is a test complaint for the wrong tracking secret validation path testing the system.');
    adminUpdateComplaintStatus(ticketId, 'Resolved', 'Done.');
    const ok = submitFeedback(ticketId, 'WRONG_SECRET', 5, 'Thanks!');
    expect(ok).toBe(false);
  });
});
