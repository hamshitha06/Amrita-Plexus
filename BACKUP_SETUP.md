# AMRITA-PLEXUS — AUTOMATED BACKUP SETUP & CONFIGURATION GUIDE

## 1. Overview

Amrita-Plexus includes an automated database backup system located in `api/scripts/`:
- `api/scripts/backup-db.ts`: Full atomic logical snapshot with SHA-256 verification and automatic pruning.
- `api/scripts/verify-backup.ts`: Cryptographic integrity and table count verification.
- `api/scripts/restore-db.ts`: Disaster recovery restoration engine with dry-run and isolated testing modes.

---

## 2. Environment Variables

The backup pipeline reads configuration from `api/.env`:

```env
# Database Connection (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_g0hZ5NfJvExA@ep-fragrant-firefly-b322xt9y.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Optional Backup Encryption & Offsite Settings
BACKUP_RETENTION_DAYS=14
BACKUP_MAX_SNAPSHOTS=10
BACKUP_STORAGE_DIR="backups"
```

---

## 3. Manual Execution Commands

From the `api/` directory (or root via workspaces):

```bash
# 1. Create a fresh verified database backup
cd api
npm run backup:create

# 2. Verify integrity of the latest backup (or specify path)
npm run backup:verify

# 3. Run an isolated Disaster Recovery restore drill
npm run backup:test-restore
```

---

## 4. Setting up Automated Scheduled Backups

### Option A: Linux / Production Server (Cron)

To schedule an automatic daily backup at **02:00 AM IST (20:30 UTC)**:

Open crontab:
```bash
crontab -e
```

Add the following cron entries:
```cron
# Daily Database Backup at 2:00 AM IST
0 2 * * * cd /home/deploy/Amrita-Plexus/api && /usr/bin/npm run backup:create >> /var/log/plexus-backup.log 2>&1

# Automated Backup Verification Check at 2:15 AM IST
15 2 * * * cd /home/deploy/Amrita-Plexus/api && /usr/bin/npm run backup:verify >> /var/log/plexus-backup-verify.log 2>&1
```

### Option B: Windows Server / Development (Task Scheduler)

Run the following in PowerShell as Administrator to register a daily task:

```powershell
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c cd /d C:\Users\Ari\Documents\Amrita-Plexus\api && npm run backup:create"
$trigger = New-ScheduledTaskTrigger -Daily -At "02:00AM"
Register-ScheduledTask -TaskName "AmritaPlexus_Daily_Backup" -Action $action -Trigger $trigger -Description "Daily Neon DB backup for Amrita-Plexus"
```

### Option C: GitHub Actions Workflow (Offsite Automation)

Create `.github/workflows/db-backup.yml` to trigger backups on a schedule:

```yaml
name: Automated Neon DB Backup
on:
  schedule:
    - cron: '30 20 * * *' # 2:00 AM IST daily
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run backup:create
        working-directory: api
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      - run: npm run backup:verify
        working-directory: api
```

---

## 5. Backup Storage & Rotation Policies

- Backups are stored in `api/backups/`.
- File naming format: `plexus-backup-YYYY-MM-DDTHH-mm-ss-sssZ.json`.
- A companion `latest-manifest.json` is updated with every backup run.
- **Safety Rule**: The rotation cleaner never deletes the last remaining valid backups, ensuring protection against catastrophic data loss.
- `api/backups/` is strictly added to `.gitignore` to prevent any database records from being accidentally checked into source control.
