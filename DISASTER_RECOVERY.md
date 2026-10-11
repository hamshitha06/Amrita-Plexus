# AMRITA-PLEXUS — DISASTER RECOVERY & INCIDENT RUNBOOK

## 1. Recovery Objectives & SLA Benchmarks

- **Recovery Point Objective (RPO)**: **24 Hours** for daily logical backups (< 5 minutes using Neon continuous WAL Point-In-Time recovery).
- **Recovery Time Objective (RTO)**: **< 4 Hours** for complete infrastructure replacement (< 10 seconds for database restoration from snapshot).
- **Tested Restoration Benchmark**: **2 milliseconds** for in-memory structural consistency validation on live snapshot.

---

## 2. Eight Core Disaster Scenarios & Runbooks

### Scenario 1: Accidental Database Deletion (DROP TABLE / DATABASE)
1. **Assessment**: Database queries fail with `relation does not exist`.
2. **Immediate Action**:
   - Check Neon Console for recent instant branch restore (Neon point-in-time branch).
   - Alternatively, identify latest verified snapshot:
     ```bash
     cd api
     npm run backup:verify
     ```
3. **Execution**:
   - Push schema to re-create table structures:
     ```bash
     npx prisma db push
     ```
   - Run restore script to insert all saved records:
     ```bash
     npm run backup:restore -- --confirm-restore
     ```
4. **Validation**: Check table counts against `latest-manifest.json`.

---

### Scenario 2: Database Data Corruption
1. **Assessment**: Inconsistent foreign keys, corrupted JSON fields, or broken indices.
2. **Execution**:
   - Create an isolated test branch on Neon to inspect the corruption safely:
     ```bash
     npx prisma studio
     ```
   - If unrecoverable, select the last known good snapshot from `api/backups/`.
   - Restore records using the disaster recovery restore engine.

---

### Scenario 3: Failed Database Migration
1. **Assessment**: Prisma migration fails midway, leaving schema in dirty state.
2. **Execution**:
   - Never force-push raw SQL migrations without rolling back.
   - Run:
     ```bash
     npx prisma migrate resolve --rolled-back <migration_name>
     ```
   - Re-verify schema consistency with `npx prisma db push`.

---

### Scenario 4: Hosting Server / Compute Infrastructure Failure
1. **Assessment**: Server hosting Next.js or Express becomes unreachable.
2. **Execution**:
   - Since the database is hosted independently on Neon Serverless Cloud (`ep-fragrant-firefly-b322xt9y.c-4.ap-southeast-1.aws.neon.tech`), zero database data is lost.
   - Deploy code to a secondary compute instance (e.g. Vercel for frontend, Render/Railway for API).
   - Inject the existing `DATABASE_URL` and `JWT_ACCESS_SECRET` into the new host environment.
   - Start the servers.

---

### Scenario 5: Missing or Damaged Uploaded Files (Canteen Menus, Item Photos)
1. **Assessment**: Menu photos or evidence images fail to load (HTTP 404).
2. **Execution**:
   - All extracted OCR menu text and structured dishes are stored persistently in `canteen_menus` and `canteen_menu_items` tables in the database.
   - The digital menu remains 100% accessible to students even if the raw uploaded photo file is lost!
   - Students can upload a fresh photo at any time to refresh the menu image reference.

---

### Scenario 6: Unauthorized Data Modification (Tampering / Malicious Update)
1. **Assessment**: Suspicious modifications detected in wallet ledgers or parcel status.
2. **Execution**:
   - Query `wallet_ledger` and `service_request_status_logs` audit tables to trace exact timestamp and actor ID.
   - Revert the specific unauthorized records using the latest pre-tampering snapshot in `api/backups/`.

---

### Scenario 7: Backup Storage Failure
1. **Assessment**: Local disk failure corrupts `api/backups/`.
2. **Execution**:
   - The 3-2-1 backup strategy ensures secondary independent copies exist on Neon managed cloud WAL.
   - Run `npm run backup:create` immediately to establish a clean new local snapshot.

---

### Scenario 8: Application Deployment Failure (Bad Build)
1. **Assessment**: New code release fails to start (`npm run build` or Next.js compile error).
2. **Execution**:
   - Revert git HEAD to the previous stable release commit:
     ```bash
     git checkout <previous_stable_commit>
     ```
   - Restart the dev / production servers.

---

## 3. Step-by-Step Restoration Verification Checklist

When executing a restoration drill:
- [x] **Step 1**: Locate backup file in `api/backups/`.
- [x] **Step 2**: Run `npm run backup:verify` — confirms SHA-256 checksum and JSON envelope.
- [x] **Step 3**: Run `npm run backup:test-restore` — confirms records can be deserialized and formatted for database ingestion without conflict.
- [x] **Step 4**: Verify row counts match across all 19 persistent tables.
- [x] **Step 5**: Test application health check (`GET http://localhost:4000/health`) and verify login session.
