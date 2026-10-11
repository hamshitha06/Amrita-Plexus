# Amrita-Plexus — Lost and Found & Physical Custody Desk Manual Testing Guide

This guide provides exact, step-by-step instructions to test and verify the **Lost and Found Module** and its **Physical Security Custody Desk** on your local machine.

---

## 🏛️ Key Campus Architecture Rule

> [!IMPORTANT]
> **No lockers are used on campus.** All lost belongings are stored physically by authorized campus security staff at dedicated campus security desks (e.g., Main Gate Security Desk, Central Library Security Counter, Academic Block Security Desks). The system maintains secure digital records of custody, 2-stage handovers, and authenticated returns without any locker mechanisms.

---

## Section A: Start the Application

### 1. Open Terminal and Navigate to the Repository
Open PowerShell or your preferred terminal:
```powershell
cd c:\Users\Ari\Documents\Amrita-Plexus
```

### 2. Verify Database Connection
The platform uses Neon Serverless PostgreSQL. Ensure `.env` is configured in `api/`:
```powershell
cd api
npx prisma db push
```
*(Expected output: `The database is already in sync with the Prisma schema` or schema updated successfully)*

### 3. Start the Backend API Server
In one terminal window:
```powershell
cd c:\Users\Ari\Documents\Amrita-Plexus\api
npm run dev
```
- **Backend URL:** `http://localhost:4000`
- **Health check:** Open `http://localhost:4000/api/health` in your browser. Expected: `{"status":"ok"}`.

### 4. Start the Frontend Next.js Web App
In a second terminal window:
```powershell
cd c:\Users\Ari\Documents\Amrita-Plexus\web
npm run dev
```
- **Frontend URL:** `http://localhost:3000`
- Open your browser to `http://localhost:3000`.

---

## Section B: Test Lost Item Reporting

1. **Navigate to Lost & Found:**
   - In the navigation sidebar, click on **Lost & Found** or open `http://localhost:3000/lost-found`.
2. **Click "Report Lost Item":**
   - Click the red **"+ Report Lost Item"** button (or go to `http://localhost:3000/lost-found/report-lost`).
3. **Fill in the Report Form:**
   - **Category:** `Personal Belongings`
   - **Item Name:** `Casio Classwiz fx-991EX Calculator`
   - **General Description:** `Black scientific calculator lost during Morning Mathematics exam.`
   - **Last Seen Location:** `Academic Block 2, Room AB-204`
   - **Date Lost:** Select yesterday or today.
   - **Private Distinguishing Features (Confidential):** `Roll number CB.EN.U4CSE23101 written in black marker on the back battery cover; scratch next to the solar panel.`
   - *(Optional)* Upload an image from your device.
4. **Submit:**
   - Click **"Submit Report & Start Matching Engine"**.
5. **Verify:**
   - You are redirected to **My Reports & Claims** (`/lost-found/my-items`).
   - Switch to the **My Lost Reports** tab.
   - Confirm your Casio calculator report appears with status **Reported**.
   - Notice that private features are securely saved.
   - Refresh the page (`F5`) to confirm the report persists.

---

## Section C: Test Found Item Reporting

1. **Navigate to Report Found Item:**
   - Open `http://localhost:3000/lost-found/report-found`.
2. **Fill in the Public & Private Details:**
   - **Category:** `Personal Belongings`
   - **Item Title / Name:** `Casio fx-991EX Scientific Calculator`
   - **Public Description:** `Black Casio calculator left behind on a corner desk in AB-204.` *(Do not reveal private markings here!)*
   - **Exact Campus Found Location:** `Academic Block 2, Room AB-204`
   - **Date Found:** Today's date.
   - **Photograph:** Upload an image or leave blank.
   - **Private Distinguishing Characteristics (Confidential):** `Has permanent black marker handwriting on the battery compartment door.`
   - **Current Item Custody Status:** Select:
     `Handover Reported: Main Gate Security Desk`
3. **Notice the Campus Protocol Notice:**
   - Confirm that the UI explicitly states: *"Our campus Security Custody Desk stores items physically with authorized staff... No automated lockers are used on campus."*
4. **Submit:**
   - Click **"Publish Found Listing"**.
5. **Verify:**
   - The listing appears on the catalog dashboard (`/lost-found`).
   - Notice the status pill indicates `Handover Reported` or `Awaiting Secure Deposit`—it is **NOT** automatically labeled as confirmed security custody.
   - Private characteristics are **hidden** from the public catalog card.

---

## Section D: Test Ownership Claim

1. **Locate the Found Item in the Catalog:**
   - On `http://localhost:3000/lost-found`, find the item reported above.
2. **Submit Claim:**
   - Click **"This Is Mine — Verify Ownership"**.
   - The secure **Claim Verification Modal** opens.
3. **Answer Verification Questions:**
   - *Question 1:* Enter the model: `Casio fx-991EX Classwiz`.
   - *Question 2:* Enter identifying marks: `Roll number CB.EN.U4CSE23101 written in black marker on battery door.`
   - Add notes: `I was sitting in Room AB-204 row 3.`
4. **Submit:**
   - Click **"Submit Ownership Claim"**.
   - A success toast confirms: *"Ownership Claim submitted successfully!"*
5. **Verify Claim Status:**
   - Open `/lost-found/my-items` and select **My Claims**.
   - Verify the claim is listed with status: **Under Review**.
   - Confidential answers are visible only to the claimant and authorized reviewers.

---

## Section E: Test Security Custody Desk (No Lockers)

1. **Open Security Custody Desk:**
   - Navigate to `http://localhost:3000/lost-found/custody`.
2. **Verify Removal of All Locker References:**
   - [x] No locker assignment inputs exist.
   - [x] No locker numbers or tags appear.
   - [x] The form fields are: **Security Desk / Custody Location** (dropdown of physical campus desks), **Primary Receiving Officer**, **Secondary Officer** (for Level 5 items), and **Physical Condition Inspection Notes**.
3. **Test Student Handover Reporting (If item still with finder):**
   - In the **Custody Item Inventory** cards below, find any item marked with finder.
   - Click **"Handover to Security"**.
   - Select the target desk (e.g., `Main Gate Security Desk`).
   - Submit. Verify the status updates to **Handover Reported** with a gold badge.
4. **Test Authorized Physical Intake Confirmation:**
   - In the **Action 1 • Physical Desk Intake** card:
     - Select the item in the dropdown: `Select Item Received Physically`.
     - **Security Desk:** Choose `Main Gate Security Desk`.
     - **Primary Receiving Officer:** `Officer R. Pillai (SEC-88)`.
     - **Condition Notes:** `Calculator powers on, display intact, clean condition.`
   - Click **"Confirm Physical Custody Receipt"**.
5. **Verify Custody Confirmation:**
   - Success toast appears: *"Physical custody confirmed for Item at Main Gate Security Desk"*.
   - In the **Physical Custody Audit & Handover History** table at the bottom, an audit row is created with real timestamp and custody location.
   - The item card status transitions to **Custody Confirmed** (indigo badge).

---

## Section F: Test Claim Approval & Verified Physical Return

1. **Review Ownership Claim:**
   - On the Custody Desk page (`/lost-found/custody`), locate the **Ownership Claim Review Queue**.
   - Find the claim submitted in Section D.
   - Review the claimant's answers against the item's private characteristics.
   - Click **"Approve Claim"**.
2. **Handover OTP Generation:**
   - Success toast appears indicating that the claim has been **APPROVED** and an authentic **6-digit Handover OTP** was generated.
   - Switch to `/lost-found/my-items` (My Claims tab):
     - The claimant card now displays the green box: **🔑 One-Time Handover OTP: [6-digit code]** with instructions: *"Show this 6-digit OTP at Main Gate Security Desk along with your College ID to collect your item."*
3. **Execute Physical Return Verification:**
   - Back on `/lost-found/custody` under **Action 2 • Return to Verified Owner**:
     - Select the approved claim from the dropdown.
     - Enter the 6-digit OTP.
     - Click **"Confirm Physical Return to Owner"**.
4. **Verify Return Outcome:**
   - Success toast appears: *"Handover Completed! Item marked as COLLECTED/RETURNED."*
   - Item status transitions to **Collected** / **Returned to Owner** (emerald badge).
   - In the Custody Audit History table, the status updates to: `Returned: [Timestamp]`.
   - The item cannot be claimed again (claim button disabled).

---

## Section G: Test Service Requests (Cancel Request & Provider Console)

### 1. Test "Cancel Request" (Student Perspective)
1. Navigate to `http://localhost:3000/services/my-requests`.
2. Locate a request with status `Pending` or `Accepted`.
3. Click **"Cancel Request"**.
4. A confirmation modal appears asking:
   - *"Are you sure you want to cancel your request for [Service Title]?"*
   - Optional reason input.
5. Enter a reason (e.g., `Schedule conflict; resolved independently`).
6. Click **"Confirm Cancellation"**.
7. Expected result:
   - Request status changes to **Cancelled** with a rose badge.
   - The cancellation reason is displayed on the card.
   - The button changes from an interactive "Cancel Request" to a static **"Request Cancelled"** pill.

### 2. Test "Provider Console → Manage" (Provider Perspective)
1. Navigate to `http://localhost:3000/services/manage`.
2. Under **Incoming Student Requests**:
   - Verify client attribution reads correctly: **"From: [Student Client Name]"** (not the provider's own name).
3. Click **"Manage →"** on any request.
4. A full management modal opens showing:
   - Client contact details (Name, Hostel, Phone).
   - Agreed rate and schedule.
   - Client requirements / notes.
   - Input for provider progress notes.
   - Workflow action buttons based on status:
     - `Pending`: **Accept Request** (moves to `Accepted`) or **Decline** (moves to `Rejected`).
     - `Accepted`: **Start Work (Mark In Progress)** (moves to `In Progress`).
     - `In Progress`: **Mark Service as Completed** (moves to `Completed`).
5. Click **Accept Request** or **Start Work**:
   - Status updates dynamically and updates the dashboard stats.

---

## Section H: Troubleshooting Guide

| Issue | Cause | Fix |
|---|---|---|
| **Buttons not responding** | Dev server hot reload paused | Refresh the browser page (`Ctrl+F5`) or check terminal console for client JS errors. |
| **API 401 Unauthorized** | Missing or expired token in API test | Use `signAccessToken` helper with valid user payload in automated requests. |
| **API 404 on item action** | Item ID mismatch | Ensure the item ID exists in the database. Fetch `/api/lost-found` to inspect available IDs. |
| **Cannot confirm custody** | Missing mandatory officer fields | Provide `Primary Receiving Officer` and `Physical Condition Notes`. If Level 5 item, provide `Secondary Staff Officer`. |
| **OTP verification fails** | Incorrect 6-digit code | Check the exact OTP shown on the student's My Claims card (`/lost-found/my-items`). |
| **Database connection error** | Neon DB timeout or IP change | Check that `DATABASE_URL` in `api/.env` is active and run `npx prisma db push` in `api/`. |

---

## Section I: Verification Checklist

- [x] All locker assignment, locker numbers, locker availability, and locker tags have been completely removed.
- [x] Physical custody tracking functions across campus security desks (Main Gate, Library, Academic Blocks, Hostel Gate).
- [x] 2-stage handover implemented: `Handover Reported` by student vs `Custody Confirmed` by authorized staff.
- [x] Private identifying features protected from public endpoints and public UI.
- [x] Ownership claims validated and approved by authorized reviewers.
- [x] Physical returns authenticated with 6-digit OTP and College ID verification.
- [x] Service requests "Cancel Request" modal and lifecycle functional.
- [x] Provider Console "Manage" button opens full booking modal with client attribution.
- [x] 14/14 automated tests pass in `api/`.
- [x] 19/19 automated tests pass in `web/`.
