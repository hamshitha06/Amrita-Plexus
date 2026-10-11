# AMRITA-PLEXUS — DATABASE SECURITY & INFORMATION PROTECTION

## 1. Threat Model & Data Classification

Amrita-Plexus processes sensitive academic, personal, and financial transaction records across the campus. The data is classified into three tiers:

| Tier | Sensitivity | Data Types | Security Controls |
|---|---|---|---|
| **Tier 1: High Sensitivity (PII & Auth)** | Secret / Confidential | Student college emails, password/code hashes, delivery OTP hashes, private verification details for Lost & Found items, complaint tracking secret hashes. | SHA-256 / Argon2 one-way cryptographic hashing, field-level omission from public API outputs, strict role-based access control. |
| **Tier 2: Financial & Transactional** | High Integrity | Wallet ledger balances, escrow hold/release keys, parcel rewards, canteen peer delivery fees. | Interactive DB transactions, Idempotency keys (`idempotencyKey`), preventing double-credit and negative balances. |
| **Tier 3: Operational & Public** | Campus Public | Published Canteen menus, general carpool routes, marketplace listings, hostel mess schedules. | Input sanitization, Zod validation, rate limiting. |

---

## 2. Authentication & Session Security

- **Passwordless Email OTP**:
  - OTP codes are strictly 6 numeric digits generated cryptographically.
  - Plain OTP codes are **NEVER stored in the database**; only the Argon2 / SHA-256 hash is saved.
  - Expires automatically in 10 minutes.
  - Enforces a maximum attempt limit (3 attempts) before invalidation.
- **Student Domain Verification**:
  - Only authorized college email domains (`@cb.amrita.edu`, `@amrita.edu`) can request login OTPs.
- **JWT Token Architecture**:
  - Short-lived Access Token (15 minutes), signed with server-side private secret.
  - Long-lived Refresh Token (7 days), stored in an `HttpOnly`, `SameSite=Lax`, `Secure` cookie.
  - Automatic token rotation: When a refresh token is used, a new pair is issued and the old token is marked revoked. If a revoked token is replayed, the entire session family is revoked.

---

## 3. Server-Side Authorization & IDOR Defense

- **Insecure Direct Object Reference (IDOR) Protection**:
  - In `Marketplace`: Only the `sellerId` matching `req.user.userId` can edit or delete an active listing.
  - In `Parcels`: Only the recipient or assigned deliverer can view tracking updates. Public listings omit recipient details and **strictly omit `deliveryOtpHash`**.
  - In `Lost & Found`: `privateVerificationDetails` (e.g. engravings, wallpaper photo, serial numbers) are strictly excluded from public listing endpoints (`GET /api/lost-found/items`). Only authorized security officers can view verification details during claim review.
  - In `Complaints`: Anonymous complaints use a client-side generated 32-character tracking secret. The server stores only `secretHash = sha256(secret)`. Even database administrators inspecting the database directly cannot view the secret or connect anonymous tickets to students.

---

## 4. Concurrency Safety & Financial Ledger Integrity

- **Carpooling Seats**:
  - Race condition prevention: When 2 passengers attempt to book the last available seat simultaneously, an interactive Prisma database transaction (`prisma.$transaction`) reads the row with concurrency protection, verifies `availableSeats >= requested`, decrements the seats atomically, and sets status to `FULL` if seats reach 0. Overbooking requests are rejected with HTTP 409 `OVERBOOKED`.
- **Wallet Ledger & Escrow**:
  - Every financial transaction uses a unique `idempotencyKey`.
  - Replayed requests return the existing record with `isIdempotentReplay: true` rather than processing a duplicate payout or deduction.
  - All balance changes generate an immutable `WalletLedger` audit record.

---

## 5. Network & Application Defense

- **Helmet**: Enables HTTP security headers (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, Content-Security-Policy).
- **CORS**: Strictly locked to authorized origin (`WEB_ORIGIN = http://localhost:3000`).
- **Rate Limiting**: `express-rate-limit` prevents brute-force login attempts and spam ticket creation.
- **SQL Injection Prevention**: 100% of database interactions run through Prisma ORM using parameterized SQL queries. Zero raw string concatenation.
- **Safe Payload Limits**: Express body parser enforces strict payload bounds to prevent Denial of Service (DoS) attacks via memory exhaustion.
