# 🛡️ Amrita-Plexus Database Backup & Disaster Recovery Guide

This document describes the automated, encrypted backup architecture, retention policies, and step-by-step restoration procedures for **Amrita-Plexus**.

---

## 1. Overview & Architecture

* **Source Database:** PostgreSQL on Neon (`neondb` instance).
* **Backup Destination:** Cloudflare R2 Object Storage (S3-compatible, isolated region).
* **Encryption Scheme:** Asymmetric encryption via `age`. 
  * The automated CI/CD pipeline and backup runner only hold the **public key** (`BACKUP_AGE_PUBLIC_KEY`).
  * Backups can be encrypted autonomously, but **cannot be decrypted** without the private key.
* **Key Custody:** The private key (`BACKUP_AGE_PRIVATE_KEY`) is held **only by the authorized administrator** and securely stored in GitHub Actions secrets for weekly restore testing. It is never placed in the repository or application servers.

---

## 2. Retention Policy

| Backup Tier | Schedule | Storage Prefix | Retention Policy | Safeguard |
| :--- | :--- | :--- | :--- | :--- |
| **Daily** | Everyday at 02:00 AM IST (20:30 UTC) | `daily/` | Retain last **7** days | Never prune if $< 3$ backups exist |
| **Weekly** | Every Sunday at 02:00 AM IST | `weekly/` | Retain last **4** weeks | Never prune if $< 3$ backups exist |

---

## 3. Recovery Targets

* **RPO (Recovery Point Objective):** `[To be benchmarked — Target: < 24 hours via scheduled backups]`
* **RTO (Recovery Time Objective):** `[To be benchmarked — Target: < 15 minutes]`

---

## 4. Step-by-Step Restoration Procedure

### Prerequisites
1. Ensure `age`, `pg_restore`, and `awscli` are installed on your machine.
2. Obtain your private `age` key identity file (e.g., `~/.age/key.txt`).
3. Ensure the target database exists and is reachable.

### Step 1: Export Credentials
```bash
export AGE_IDENTITY_FILE="/path/to/your/private-key.txt"
export R2_ACCOUNT_ID="your_cloudflare_account_id"
export R2_ACCESS_KEY_ID="your_r2_access_key_id"
export R2_SECRET_ACCESS_KEY="your_r2_secret_access_key"
export R2_BUCKET="plexus-backups"
```

### Step 2: Run Restore Script
To restore the latest daily snapshot to a local or staging database:
```bash
# Syntax: ./scripts/restore.sh <r2-object-key-or-local-file> <TARGET_DATABASE_URL>
./scripts/restore.sh daily/plexus-2026-10-11-0400.dump.age "postgresql://postgres:password@localhost:5432/plexus_restore"
```

> [!CAUTION]
> **Production Safety Lock:**
> The restore script automatically checks if `TARGET_DATABASE_URL` matches your production `DATABASE_URL`. It will abort immediately unless you pass the explicit confirmation flag:
> ```bash
> ./scripts/restore.sh <key> "$PROD_DATABASE_URL" --i-know-this-is-production
> ```

---

## 5. Monthly Maintenance Checklist

- [ ] Check Cloudflare R2 bucket storage usage and verify object retention counts.
- [ ] Review GitHub Actions run history for `Automated PostgreSQL Backup` (`db-backup.yml`).
- [ ] Check the weekly automated restoration report (`restore-test.yml`) to ensure duration remains within acceptable RTO.
- [ ] Rotate R2 API tokens every 90 days.

---

## 6. Incident Response Checklist (Database Outage / Data Corruption)

1. **Assess & Freeze:** Immediately put the web application into maintenance mode or suspend API worker containers to prevent further data corruption.
2. **Identify Target Timestamp:** Determine the point of failure or corruption to select the most appropriate backup (`daily/` or `weekly/`).
3. **Provision Target Database:** Spin up a clean Neon branch or PostgreSQL instance.
4. **Execute Restoration:** Run `./scripts/restore.sh` against the clean target database.
5. **Verify Data Integrity:** Connect via Prisma and verify critical row counts (`users`, `orders`, `transactions`).
6. **Switch Connection:** Update `DATABASE_URL` in production secrets to point to the newly restored database.
7. **Resume Traffic:** Deactivate maintenance mode and monitor API `/health` logs.
