#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# AMRITA-PLEXUS AUTOMATED ENCRYPTED POSTGRESQL BACKUP SCRIPT
# Backs up PostgreSQL to Cloudflare R2 with age public-key encryption.
# ==============================================================================

# 1. Load local .env.backup if present (development / manual run)
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

# 2. Validate required environment variables (without printing their values)
REQUIRED_VARS=("DATABASE_URL" "BACKUP_AGE_PUBLIC_KEY" "R2_ACCOUNT_ID" "R2_ACCESS_KEY_ID" "R2_SECRET_ACCESS_KEY" "R2_BUCKET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    MISSING_VARS+=("$var")
  fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
  echo "[-] ERROR: Missing required backup environment variable(s): ${MISSING_VARS[*]}" >&2
  echo "[-] Ensure these are set in the environment or in .env.backup" >&2
  exit 1
fi

# 3. Locate binaries (native path fallback for local Windows environments)
PG_DUMP_CMD="pg_dump"
if ! command -v pg_dump >/dev/null 2>&1; then
  if [ -f "/c/Program Files/PostgreSQL/18/bin/pg_dump.exe" ]; then
    PG_DUMP_CMD="/c/Program Files/PostgreSQL/18/bin/pg_dump.exe"
  fi
fi

AGE_CMD="age"
if ! command -v age >/dev/null 2>&1; then
  WINGET_AGE="/c/Users/Ari/AppData/Local/Microsoft/WinGet/Packages/FiloSottile.age_Microsoft.Winget.Source_8wekyb3d8bbwe/age/age.exe"
  if [ -f "$WINGET_AGE" ]; then
    AGE_CMD="$WINGET_AGE"
  fi
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if command -v aws >/dev/null 2>&1; then
  AWS_CMD="aws"
else
  AWS_CMD="node ${SCRIPT_DIR}/r2-cli.js"
fi

# Setup AWS CLI / R2 credentials
export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="auto"
R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

TIMESTAMP="$(date -u +"%Y-%m-%d-%H%M")"
BACKUP_FILENAME="plexus-${TIMESTAMP}.dump.age"
TEMP_DIR="$(mktemp -d)"

cleanup() {
  if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
  fi
}
trap cleanup EXIT

PLAIN_DUMP="${TEMP_DIR}/plain.dump"
ENCRYPTED_DUMP="${TEMP_DIR}/${BACKUP_FILENAME}"

echo "[+] Starting database dump at $(date -u +"%Y-%m-%dT%H:%M:%SZ")..."

# 4. Dump PostgreSQL database using pg_dump
"$PG_DUMP_CMD" --format=custom --no-owner --dbname="$DATABASE_URL" -f "$PLAIN_DUMP"

echo "[+] Database dump completed. Encrypting with age public key..."

# 5. Encrypt dump with age
"$AGE_CMD" -r "$BACKUP_AGE_PUBLIC_KEY" -o "$ENCRYPTED_DUMP" "$PLAIN_DUMP"

# Remove unencrypted plain dump immediately
rm -f "$PLAIN_DUMP"

echo "[+] Dump successfully encrypted (${BACKUP_FILENAME}). Uploading to Cloudflare R2..."

# 6. Upload encrypted backup to Cloudflare R2 (daily/)
$AWS_CMD --endpoint-url "$R2_ENDPOINT" s3 cp "$ENCRYPTED_DUMP" "s3://${R2_BUCKET}/daily/${BACKUP_FILENAME}"

# If today is Sunday (day 7), also copy to weekly/
DAY_OF_WEEK="$(date -u +%u)"
if [ "$DAY_OF_WEEK" -eq 7 ]; then
  echo "[+] Sunday detected. Storing weekly snapshot in weekly/${BACKUP_FILENAME}..."
  $AWS_CMD --endpoint-url "$R2_ENDPOINT" s3 cp "$ENCRYPTED_DUMP" "s3://${R2_BUCKET}/weekly/${BACKUP_FILENAME}"
fi

# 7. Verification: Confirm the object exists in R2 with size > 0
echo "[+] Verifying upload in R2 bucket ${R2_BUCKET}..."
REMOTE_SIZE="$($AWS_CMD --endpoint-url "$R2_ENDPOINT" s3 ls "s3://${R2_BUCKET}/daily/${BACKUP_FILENAME}" | awk '{print $3}')"

if [ -z "$REMOTE_SIZE" ] || [ "$REMOTE_SIZE" -le 0 ]; then
  echo "[-] ERROR: Upload verification failed! Object not found or zero-byte file." >&2
  exit 1
fi

echo "[+] Verification successful! Remote object size: ${REMOTE_SIZE} bytes."

# 8. Retention policy enforcement
enforce_retention() {
  local prefix="$1"
  local keep_count="$2"

  echo "[+] Checking retention for prefix: ${prefix} (retain latest ${keep_count})..."
  
  # shellcheck disable=SC2207
  local all_backups=($($AWS_CMD --endpoint-url "$R2_ENDPOINT" s3 ls "s3://${R2_BUCKET}/${prefix}/" | awk '{print $4}' | sort))
  local total_count="${#all_backups[@]}"

  if [ "$total_count" -lt 3 ]; then
    echo "[+] Found ${total_count} backups in ${prefix}/. Retention skipped (minimum safety threshold: 3)."
    return 0
  fi

  if [ "$total_count" -gt "$keep_count" ]; then
    local delete_count=$((total_count - keep_count))
    echo "[+] Pruning ${delete_count} expired backups in ${prefix}/..."
    for ((i=0; i<delete_count; i++)); do
      local file_to_delete="${all_backups[i]}"
      if [ -n "$file_to_delete" ]; then
        echo "[+] Pruning old backup: ${prefix}/${file_to_delete}"
        $AWS_CMD --endpoint-url "$R2_ENDPOINT" s3 rm "s3://${R2_BUCKET}/${prefix}/${file_to_delete}"
      fi
    done
  else
    echo "[+] Current count (${total_count}) within limit (${keep_count}). No pruning needed."
  fi
}

enforce_retention "daily" 7
enforce_retention "weekly" 4

echo "[✓] Backup cycle completed successfully at $(date -u +"%Y-%m-%dT%H:%M:%SZ")."
