#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# AMRITA-PLEXUS DATABASE RESTORATION SCRIPT
# Downloads (if needed), decrypts via age identity, and restores to PostgreSQL.
# ==============================================================================

usage() {
  echo "Usage: $0 <backup-file-or-r2-key> <TARGET_DATABASE_URL> [--i-know-this-is-production]"
  echo "Example:"
  echo "  $0 daily/plexus-2026-10-11-0400.dump.age postgresql://postgres:pass@localhost:5432/test_db"
  echo "Required Environment Variables:"
  echo "  AGE_IDENTITY_FILE: Path to the private key identity file (e.g., ~/.age/key.txt)"
  exit 1
}

if [ "$#" -lt 2 ]; then
  usage
fi

BACKUP_SOURCE="$1"
TARGET_DATABASE_URL="$2"
FORCE_PROD_FLAG="${3:-}"

# 1. Load local .env.backup if present (to get R2 credentials if downloading from R2)
if [ -f ".env.backup" ]; then
  set -a
  # shellcheck source=/dev/null
  source ".env.backup"
  set +a
elif [ -f "../.env.backup" ]; then
  set -a
  # shellcheck source=/dev/null
  source "../.env.backup"
  set +a
fi

# 2. Production safety guard
PROD_DATABASE_URL="${DATABASE_URL:-}"
if [ -n "$PROD_DATABASE_URL" ] && [ "$TARGET_DATABASE_URL" = "$PROD_DATABASE_URL" ]; then
  if [ "$FORCE_PROD_FLAG" != "--i-know-this-is-production" ]; then
    echo "[-] CRITICAL SAFETY GUARD: Target database URL matches production DATABASE_URL!" >&2
    echo "[-] Refusing to overwrite production database unless explicitly confirmed with '--i-know-this-is-production'." >&2
    exit 1
  fi
  echo "[!] WARNING: Overwriting PRODUCTION database confirmed."
fi

# 3. Verify age identity file exists
if [ -z "${AGE_IDENTITY_FILE:-}" ] || [ ! -f "$AGE_IDENTITY_FILE" ]; then
  echo "[-] ERROR: AGE_IDENTITY_FILE not found or not specified." >&2
  echo "[-] Please export AGE_IDENTITY_FILE=/path/to/private-key.txt before running restore." >&2
  exit 1
fi

TEMP_DIR="$(mktemp -d)"
cleanup() {
  if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
  fi
}
trap cleanup EXIT

LOCAL_ENCRYPTED="${TEMP_DIR}/downloaded.dump.age"
DECRYPTED_DUMP="${TEMP_DIR}/restore.dump"

# 4. Resolve source: Local file vs Cloudflare R2 object
if [ -f "$BACKUP_SOURCE" ]; then
  echo "[+] Using local encrypted backup file: ${BACKUP_SOURCE}"
  cp "$BACKUP_SOURCE" "$LOCAL_ENCRYPTED"
else
  echo "[+] Backup source is remote R2 key: ${BACKUP_SOURCE}. Downloading from Cloudflare R2..."
  if [ -z "${R2_ACCOUNT_ID:-}" ] || [ -z "${R2_ACCESS_KEY_ID:-}" ] || [ -z "${R2_SECRET_ACCESS_KEY:-}" ] || [ -z "${R2_BUCKET:-}" ]; then
    echo "[-] ERROR: Cloudflare R2 credentials (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET) required for remote download." >&2
    exit 1
  fi
  export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
  export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
  export AWS_DEFAULT_REGION="auto"
  R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

  # Strip s3:// prefix if provided
  CLEAN_KEY="${BACKUP_SOURCE#s3://${R2_BUCKET}/}"
  aws --endpoint-url "$R2_ENDPOINT" s3 cp "s3://${R2_BUCKET}/${CLEAN_KEY}" "$LOCAL_ENCRYPTED"
fi

# 5. Decrypt using age private key identity
echo "[+] Decrypting backup using private identity file..."
age -d -i "$AGE_IDENTITY_FILE" -o "$DECRYPTED_DUMP" "$LOCAL_ENCRYPTED"
rm -f "$LOCAL_ENCRYPTED"

# 6. Execute pg_restore
echo "[+] Restoring PostgreSQL dump into target database..."
pg_restore --clean --if-exists --no-owner --dbname="$TARGET_DATABASE_URL" "$DECRYPTED_DUMP"

echo "[✓] Database restoration completed successfully at $(date -u +"%Y-%m-%dT%H:%M:%SZ")."
