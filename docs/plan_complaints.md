# Implementation Plan: Anonymous Complaints and Improvements Module

## 1. Project Inspection Summary
- **Current State**: The application runs as a Single Page Application within `frontend/app/page.tsx`, managing its own state. The newly added `ai-guide` operates on its own Next.js route.
- **Database**: No external database (PostgreSQL, Prisma, etc.) is configured in `package.json`.
- **Styling**: Tailwind CSS is heavily utilized with a `slate` base, `indigo/teal/rose/emerald` accents, `rounded-xl` / `rounded-2xl` radii, and specific spacing (`p-5`, `p-8`).

## 2. Minimal Integration (Preserving Existing Functionality)
- **Fix Existing Build Error**: First, fix the TypeScript error in `src/lib/faq.test.ts` that caused the previous build to fail.
- **Sidebar & Header**: Make a minimal, additive change to `frontend/app/page.tsx` to insert a "Complaints" link into the sidebar and mobile header, mimicking the recent AI Guide integration.

## 3. Data Layer (Mock Backend)
Since no PostgreSQL backend exists, I will create `frontend/src/lib/complaints-db.ts` as an in-memory mock service.
- **Mock Notice**: All frontend pages for this module will explicitly display a "Mock Data Mode" warning to distinguish it from real persistence.
- **Anonymity**: The service will generate a public `ticketId` (e.g., `TKT-1234`) and a secure `trackingSecret` during submission. Only the hash of the secret is stored.

## 4. New Routes & Pages
1. **`/complaints`**: The landing page for the module. Offers "Submit a Ticket", "Track a Ticket", and a warning about anonymous submissions.
2. **`/complaints/new`**: Form with Category, Subject, Description, and mock evidence upload. Submitting provides the one-time `trackingSecret`.
3. **`/complaints/track`**: Status tracking. Requires both `ticketId` and `trackingSecret`. Allows users to provide 1-5 star feedback once resolved.
4. **`/admin/complaints`**: Administrator dashboard. Views all tickets (without seeing tracking secrets), updates statuses (Under Review -> In Progress -> Resolved), and provides analytics (total counts, categories, average ratings).

## 5. UI/UX Consistency
I will reuse the existing typography, `rounded-2xl` cards, `border-slate-200` borders, `bg-white` and `bg-slate-50` backgrounds, and standard input/button styling found in `page.tsx`.

No existing files (except `page.tsx` for the links and `faq.test.ts` for the TS fix) will be modified.

I am ready to proceed with these changes.
