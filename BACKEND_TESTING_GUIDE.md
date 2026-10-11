# AMRITA-PLEXUS — BEGINNER-FRIENDLY LOCAL TESTING & VERIFICATION GUIDE

This guide walks you step-by-step through running and verifying Amrita-Plexus locally.

---

## 1. Prerequisites & Environment Setup

Open **Git Bash** (or Windows PowerShell) in the project directory:

```bash
cd "C:\Users\Ari\Documents\Amrita-Plexus"
```

### Install Dependencies (if not already installed)
```bash
npm install
```

### Database Verification
Ensure the Neon PostgreSQL database connection is in sync:
```bash
cd api
npx prisma db push
cd ..
```

---

## 2. Starting the Application

You need two terminal windows:

### Terminal 1: Start the Backend API (Port 4000)
```bash
cd api
npm run dev
```
*Expected Output*:
```
[api] Server running on http://localhost:4000
[api] Environment: development
```

### Terminal 2: Start the Frontend Web App (Port 3000)
```bash
cd web
npm run dev
```
*Expected Output*:
```
- Local: http://localhost:3000
- Environments: .env.local
✓ Ready in 1200ms
```

Open your browser to: **http://localhost:3000**

---

## 3. Testing Representative Workflows

### Module 1: Canteen OCR & Digital Menu Extraction
1. Navigate to: **http://localhost:3000/canteen/upload-menu** (or click "📷 Upload Menu Photo" on the Canteen Dashboard).
2. **Step 1**: Click on one of the 3 canteens:
   - **Main Canteen** (`cant-1`)
   - **IT Block Canteen** (`cant-2`)
   - **MBA Canteen** (`cant-3`)
3. **Step 2**: Select an image:
   - Click "Select Image File" to upload your own blackboard menu image (JPEG, PNG, WebP).
   - Alternatively, use the Quick Preset buttons in the modal (**Blackboard Photo #1** or **#2**).
4. **Step 3**: Click **"Extract Dishes & Review Digital Menu"**:
   - Watch the live Tesseract.js progress bar (`Preprocessing` -> `Initializing OCR` -> `Recognizing Text` -> `Parsing Prices`).
5. **Step 4: Interactive Review Table**:
   - The digital menu table appears alongside the source photograph.
   - Edit any dish title (e.g. change "Veg Sandwich" or edit price from ₹40 to ₹45).
   - Click **"Add Missing Dish Row"** to add a new dish.
   - Click the Trash icon to remove any noisy row.
6. **Step 5: Publish**:
   - Click **"Publish Verified Menu"**.
   - Notice the toast confirmation and automatic timestamp in `Asia/Kolkata` time.
7. **Step 6: Separation Verification**:
   - Go to **http://localhost:3000/canteen/menu**.
   - Toggle between Main Canteen, IT Block Canteen, and MBA Canteen.
   - Confirm that menus published for Main Canteen do not leak into the other canteens!
   - Refresh the browser (F5) — notice the menu items persist from the database!

---

### Module 2: Carpooling (Concurrency-Safe Booking)
1. Navigate to: **http://localhost:3000/carpool/offer**
2. Fill out ride details (e.g., Origin: "Main Gate", Destination: "Railway Station", Seats: 3, Price: ₹150).
3. Click "Publish Ride".
4. Navigate to **http://localhost:3000/carpool/find**:
   - Search for the ride.
   - Book 2 seats.
   - Verify remaining seats count decreases to 1.
   - Attempting to book 2 more seats is rejected with an Overbooking error!

---

### Module 3: Parcel Delivery & 4-Digit OTP Verification
1. Navigate to: **http://localhost:3000/parcels/my-parcels**
2. Register a parcel for pickup (e.g. Courier: "Amazon Logistics", Gate: "Main Gate", Room: "A-204", Reward: ₹40).
3. Note the secret **4-digit numeric OTP** displayed on registration.
4. Open another tab or window to **http://localhost:3000/parcels/find-deliveries**:
   - Find the registered parcel and click "Accept Delivery".
   - Status changes to "In Transit".
5. Deliver the parcel:
   - Input an incorrect OTP (e.g. "0000") -> Notice it is rejected with "Invalid delivery verification OTP".
   - Input the correct 4-digit OTP -> Status transitions to "Delivered", and ₹40 is credited to the peer deliverer's wallet ledger!

---

### Module 4: Lost and Found (Physical Security Custody Desk)
1. Navigate to: **http://localhost:3000/lost-found/report-found**
2. Report a found item (e.g., "Silver Titan Wristwatch", Location: "Central Library").
3. Navigate to **http://localhost:3000/lost-found/custody**:
   - Notice the physical handover custody desk tracker.
   - Confirm there are **no lockers** — items are held physically at Campus Security Desks.
   - Security officer clicks "Confirm Physical Receipt" to acknowledge custody.

---

### Module 5: Complaints & Ticket Tracking
1. Navigate to: **http://localhost:3000/complaints/new**
2. Submit a complaint (e.g., Category: "Hostel", Subject: "Wi-Fi Router Reset Required").
3. Note the unique Ticket ID (e.g., `TKT-xxxx-xxxx`) and Tracking Secret.
4. Navigate to **http://localhost:3000/complaints/track**:
   - Enter your Ticket ID and Secret -> View live status and administrative updates.
5. Navigate to **http://localhost:3000/complaints/my-tickets**:
   - View your submitted tickets list that persists across browser refreshes!

---

## 4. Testing Database Backups & Disaster Recovery

Run these commands in your `api/` directory:

### Run a Database Backup Manually
```bash
cd api
npm run backup:create
```
*Expected Output*:
```
[Backup] Snapshot successfully generated and verified!
  File: C:\Users\Ari\Documents\Amrita-Plexus\api\backups\plexus-backup-....json
  Records Extracted: 27
  SHA-256 Checksum: ...
  Size: ... KB
```

### Inspect Backup Integrity
```bash
npm run backup:verify
```
*Expected Output*:
```
✔ SHA-256 Checksum Verified
✔ All 19 tables row counts match manifest exactly.
STATUS: PASSED (100% Valid & Restorable)
```

### Run an Isolated Disaster Recovery Drill
```bash
npm run backup:test-restore
```
*Expected Output*:
```
[DR Drill Success] Simulated recovery completed in < 10 ms.
  Records Validated: 27
  Integrity: 100% Consistent
```

---

## 5. Running Automated Test Suites

### Run All Backend API Tests (Vitest)
```bash
cd api
npm test
```
*Expected Output*: **26 passed** (Auth, Canteen, Carpooling, Parcels, Custody Desk, Lost & Found).

### Run All Web Frontend Tests (Vitest)
```bash
cd web
npm test
```
*Expected Output*: **24 passed** (Menu Parser, AI FAQ Guide, Complaints Database Layer).
