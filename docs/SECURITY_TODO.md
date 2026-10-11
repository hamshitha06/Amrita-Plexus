# Security & Architecture Follow-Up Tasks

## 1. Admin Authentication & Role-Based Authorization
- **Current State**: Next.js route handlers (`/api/admin/complaints` and `/api/admin/complaints/status`) and pages (`/admin/complaints`) feature client-side and simulated role checks (`x-admin-role`, `Authorization` header). In production mode, endpoints are disabled by default unless `ENABLE_ADMIN_DEMO=true`.
- **Target Architecture**:
  - Integrate route handlers with the Express + Prisma backend session validation endpoint (or shared JWT token verification via public key).
  - Enforce server-side cookie or JWT decoding in Next.js middleware / server handlers to verify that `user.roles` contains `admin` before processing any ticket retrieval or status transition.
  - Return HTTP 401 (Unauthorized) for missing tokens and HTTP 403 (Forbidden) for non-admin accounts.

## 2. Complaints Persistence Migration (PostgreSQL + Prisma)
- **Current State**: The complaints engine is currently powered by an in-memory mock (`web/src/lib/complaints-db.ts`) with SHA-256 secret hashing and constant-time verification. Data resets when the Next.js process restarts.
- **Target Architecture**:
  - Migrate models into `api/prisma/schema.prisma`:
    - `Complaint`: `id`, `ticketId` (indexed, unique), `type`, `category`, `subject`, `description`, `evidenceFiles` (JSON/array), `status`, `secretHash`, `createdAt`, `updatedAt`, `rating`, `feedbackComment`.
    - `ComplaintUpdate`: `id`, `complaintId` (FK), `status`, `comment`, `timestamp`.
  - Expose RESTful endpoints on the Express backend (`/api/complaints`, `/api/complaints/track`, `/api/admin/complaints`).
  - Migrate client calls from Next.js route handlers to `apiClient.ts` calling the Express API.

## 3. Anonymous Secret & Lookup Hardening
- **Current State**:
  - SHA-256 hash stored in-memory using `crypto.createHash('sha256')`.
  - Verification uses `crypto.timingSafeEqual` to prevent timing attacks.
  - Single-use display of tracking secret on submission.
  - Generic 404 response on tracking failures to prevent ticket enumeration attacks.
- **Future Improvements**:
  - Upgrade secret hashing to Argon2id or bcrypt when migrated to the persistent database.
  - Apply strict per-IP rate limiting (e.g. max 5 lookup attempts per minute) via Redis or Express rate-limiter to defeat brute-force tracking secret attacks.

## 4. Payload Size Limits & Content Security
- **Current State**:
  - Payload limits enforced (50KB on submission, 10KB on tracking and status updates).
  - Zod schemas validate string lengths and enum values.
- **Future Improvements**:
  - For evidence attachments, implement presigned object storage uploads with virus scanning and MIME-type verification rather than direct filename passing.
