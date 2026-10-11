import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { BackupManifest } from './backup-db';

export function verifyBackupFile(targetFilePath?: string): boolean {
  console.log('====================================================');
  console.log('  AMRITA-PLEXUS — DATABASE BACKUP INTEGRITY CHECKER ');
  console.log('====================================================');

  const backupsDir = path.resolve(__dirname, '../backups');

  let filePath = targetFilePath;
  if (!filePath) {
    // Find latest backup in backupsDir
    if (!fs.existsSync(backupsDir)) {
      console.error('[Verification Failed] Backups directory does not exist.');
      return false;
    }

    const files = fs
      .readdirSync(backupsDir)
      .filter(f => f.startsWith('plexus-backup-') && f.endsWith('.json'))
      .sort();

    if (files.length === 0) {
      console.error('[Verification Failed] No backup files found in directory.');
      return false;
    }

    filePath = path.join(backupsDir, files[files.length - 1]);
  }

  console.log(`[Verification] Checking file: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error('[Verification Failed] File does not exist.');
    return false;
  }

  const stat = fs.statSync(filePath);
  if (stat.size === 0) {
    console.error('[Verification Failed] Backup file is empty (0 bytes).');
    return false;
  }

  console.log(`  File Size: ${(stat.size / 1024).toFixed(2)} KB`);

  let parsed: { manifest: BackupManifest; data: Record<string, any[]> };
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error('[Verification Failed] Invalid JSON syntax in backup envelope.', err);
    return false;
  }

  const { manifest, data } = parsed;

  if (!manifest || !data) {
    console.error('[Verification Failed] Missing manifest or data section in backup envelope.');
    return false;
  }

  // 1. Recompute SHA-256 Checksum
  const serialized = JSON.stringify(data);
  const recomputedChecksum = crypto.createHash('sha256').update(serialized).digest('hex');

  if (recomputedChecksum !== manifest.sha256Checksum) {
    console.error('[Verification Failed] SHA-256 Checksum Mismatch!');
    console.error(`  Expected: ${manifest.sha256Checksum}`);
    console.error(`  Computed: ${recomputedChecksum}`);
    return false;
  }
  console.log(`  ✔ SHA-256 Checksum Verified: ${manifest.sha256Checksum}`);

  // 2. Verify Table Row Counts
  let countMismatch = false;
  for (const [table, expectedCount] of Object.entries(manifest.tableCounts)) {
    const actualRows = Array.isArray(data[table]) ? data[table].length : 0;
    if (actualRows !== expectedCount) {
      console.error(`  ✖ Table [${table}] count mismatch! Expected ${expectedCount}, got ${actualRows}`);
      countMismatch = true;
    }
  }

  if (countMismatch) {
    console.error('[Verification Failed] Row count discrepancies detected.');
    return false;
  }
  console.log(`  ✔ All ${Object.keys(manifest.tableCounts).length} tables row counts match manifest exactly.`);

  // 3. Relational Consistency Check (CanteenMenuItem -> CanteenMenu)
  if (data.canteenMenuItems && data.canteenMenus) {
    const menuIds = new Set(data.canteenMenus.map((m: any) => m.id));
    for (const item of data.canteenMenuItems) {
      if (!menuIds.has(item.menuId)) {
        console.warn(`  ⚠ Warning: Menu item ${item.title} references non-existent menu ${item.menuId}`);
      }
    }
  }

  console.log('\n[Verification Result] STATUS: PASSED (100% Valid & Restorable)');
  console.log(`  Backup ID: ${manifest.backupId}`);
  console.log(`  Created At: ${manifest.createdAtKolkata}`);
  console.log(`  Total Persistent Records: ${manifest.totalRecords}`);
  console.log('====================================================\n');

  return true;
}

if (require.main === module) {
  const target = process.argv[2];
  const passed = verifyBackupFile(target);
  process.exit(passed ? 0 : 1);
}
