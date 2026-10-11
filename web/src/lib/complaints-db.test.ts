import test from 'node:test';
import assert from 'node:assert';
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
} from './complaints-db.ts';

// Clear DB between tests
function clearDb() {
  complaintsDb.splice(0, complaintsDb.length);
}

test('generateTicketId produces TKT- prefixed unique IDs', () => {
  const id1 = generateTicketId();
  const id2 = generateTicketId();
  assert.ok(id1.startsWith('TKT-'));
  assert.notStrictEqual(id1, id2);
});

test('generateTrackingSecret produces non-empty strings', () => {
  const s = generateTrackingSecret();
  assert.ok(s.length >= 10);
});

test('hashSecret is deterministic', () => {
  const h1 = hashSecret('mysecret');
  const h2 = hashSecret('mysecret');
  assert.strictEqual(h1, h2);
});

test('hashSecret does not return the plain secret', () => {
  const s = 'mysecret123';
  assert.notStrictEqual(hashSecret(s), s);
});

test('submitComplaint creates a record and returns ticketId + trackingSecret', () => {
  clearDb();
  const result = submitComplaint('Complaint', 'Hostel', 'Dirty bathrooms', 'The hostel bathrooms have not been cleaned for a week. This is a demo description.');
  assert.ok(result.ticketId.startsWith('TKT-'));
  assert.ok(result.trackingSecret.length > 0);
  assert.strictEqual(complaintsDb.length, 1);
  assert.strictEqual(complaintsDb[0].status, 'Submitted');
  // trackingSecret MUST NOT be stored in the DB
  assert.notStrictEqual(complaintsDb[0].secretHash, result.trackingSecret);
});

test('trackComplaint finds the record with correct credentials', () => {
  clearDb();
  const { ticketId, trackingSecret } = submitComplaint('Improvement', 'Mess and Food', 'Better breakfast', 'Please provide more variety at breakfast. More items would improve satisfaction.');
  const found = trackComplaint(ticketId, trackingSecret);
  assert.ok(found);
  assert.strictEqual(found.ticketId, ticketId);
  assert.strictEqual(found.type, 'Improvement');
});

test('trackComplaint returns null for wrong secret', () => {
  clearDb();
  const { ticketId } = submitComplaint('Complaint', 'Infrastructure', 'Broken lights', 'The corridor lights on floor 3 have been non-functional for two weeks now.');
  const result = trackComplaint(ticketId, 'wrongsecret');
  assert.strictEqual(result, null);
});

test('trackComplaint returns null for unknown ticketId', () => {
  clearDb();
  const result = trackComplaint('TKT-0000-FAKE', 'anysecret');
  assert.strictEqual(result, null);
});

test('adminGetAllComplaints strips secretHash', () => {
  clearDb();
  submitComplaint('Complaint', 'Academics', 'Lab issues', 'The lab computers are outdated and often crash during exams, impacting performance significantly.');
  const list = adminGetAllComplaints();
  assert.ok(list.length > 0);
  // secretHash must not appear in any admin-visible record
  for (const c of list) {
    assert.ok(!('secretHash' in c), 'secretHash should not be in admin list');
  }
});

test('adminUpdateComplaintStatus transitions status correctly', () => {
  clearDb();
  const { ticketId, trackingSecret } = submitComplaint('Complaint', 'Transport', 'Late bus', 'The campus shuttle consistently arrives 30 minutes late in the mornings, affecting lecture attendance.');
  const ok = adminUpdateComplaintStatus(ticketId, 'Under Review', 'We have received your complaint and are reviewing it.');
  assert.ok(ok);
  const tracked = trackComplaint(ticketId, trackingSecret);
  assert.strictEqual(tracked?.status, 'Under Review');
  assert.ok(tracked?.updates.some(u => u.status === 'Under Review'));
});

test('adminUpdateComplaintStatus returns false for unknown ticket', () => {
  clearDb();
  const ok = adminUpdateComplaintStatus('TKT-FAKE-0000', 'Resolved', 'Resolved.');
  assert.strictEqual(ok, false);
});

test('submitFeedback works after complaint is resolved', () => {
  clearDb();
  const { ticketId, trackingSecret } = submitComplaint('Complaint', 'Campus Facilities', 'Gym closed', 'The gymnasium has been closed unexpectedly for over a month without any announcement or notice.');
  adminUpdateComplaintStatus(ticketId, 'Under Review', 'Reviewing.');
  adminUpdateComplaintStatus(ticketId, 'Resolved', 'Gym is now open.');
  const ok = submitFeedback(ticketId, trackingSecret, 4, 'Good resolution, thank you.');
  assert.ok(ok);
  const tracked = trackComplaint(ticketId, trackingSecret);
  assert.strictEqual(tracked?.rating, 4);
});

test('submitFeedback fails if ticket is not yet resolved', () => {
  clearDb();
  const { ticketId, trackingSecret } = submitComplaint('Complaint', 'Other', 'Test', 'This is a test complaint for the feedback-before-resolution validation path testing.');
  const ok = submitFeedback(ticketId, trackingSecret, 5, 'Thanks!');
  assert.strictEqual(ok, false);
});

test('submitFeedback fails with wrong secret', () => {
  clearDb();
  const { ticketId } = submitComplaint('Complaint', 'Other', 'Test', 'This is a test complaint for the wrong tracking secret validation path testing the system.');
  adminUpdateComplaintStatus(ticketId, 'Resolved', 'Done.');
  const ok = submitFeedback(ticketId, 'WRONG_SECRET', 5, 'Thanks!');
  assert.strictEqual(ok, false);
});
