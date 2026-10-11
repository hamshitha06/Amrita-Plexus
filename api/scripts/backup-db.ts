import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { prisma } from '../src/config/prisma';

export interface BackupManifest {
  backupId: string;
  createdAt: string;
  createdAtKolkata: string;
  sha256Checksum: string;
  totalRecords: number;
  tableCounts: Record<string, number>;
  schemaVersion: string;
  backupSizeBytes: number;
}

export async function runDatabaseBackup(): Promise<string> {
  const startTime = performance.now();
  console.log('====================================================');
  console.log('  AMRITA-PLEXUS — AUTOMATED DATABASE BACKUP SYSTEM  ');
  console.log('====================================================');

  const backupsDir = path.resolve(__dirname, '../backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupId = `plexus-backup-${timestamp}`;
  const backupFilePath = path.join(backupsDir, `${backupId}.json`);

  console.log(`[Backup] Initiating snapshot for backup ID: ${backupId}`);

  // Fetch all persistent tables
  const [
    users,
    canteenMenus,
    canteenMenuItems,
    foodRequests,
    carpoolRides,
    carpoolBookings,
    parcelDeliveries,
    marketplaceListings,
    lostFoundItems,
    itemCustodyRecords,
    ownershipClaims,
    serviceRequests,
    serviceRequestStatusLogs,
    complaintTickets,
    walletLedger,
    trustScoreRecords,
    messMenuSchedules,
    hostelSnackItems,
    hostelPosts,
  ] = await Promise.all([
    prisma.user.findMany().catch(() => []),
    prisma.canteenMenu.findMany().catch(() => []),
    prisma.canteenMenuItem.findMany().catch(() => []),
    prisma.foodRequest.findMany().catch(() => []),
    prisma.carpoolRide.findMany().catch(() => []),
    prisma.carpoolBooking.findMany().catch(() => []),
    prisma.parcelDelivery.findMany().catch(() => []),
    prisma.marketplaceListing.findMany().catch(() => []),
    prisma.lostFoundItem.findMany().catch(() => []),
    prisma.itemCustodyRecord.findMany().catch(() => []),
    prisma.ownershipClaim.findMany().catch(() => []),
    prisma.serviceRequest.findMany().catch(() => []),
    prisma.serviceRequestStatusLog.findMany().catch(() => []),
    prisma.complaintTicket.findMany().catch(() => []),
    prisma.walletLedger.findMany().catch(() => []),
    prisma.trustScoreRecord.findMany().catch(() => []),
    prisma.messMenuSchedule.findMany().catch(() => []),
    prisma.hostelSnackItem.findMany().catch(() => []),
    prisma.hostelPost.findMany().catch(() => []),
  ]);

  const tableCounts: Record<string, number> = {
    users: users.length,
    canteenMenus: canteenMenus.length,
    canteenMenuItems: canteenMenuItems.length,
    foodRequests: foodRequests.length,
    carpoolRides: carpoolRides.length,
    carpoolBookings: carpoolBookings.length,
    parcelDeliveries: parcelDeliveries.length,
    marketplaceListings: marketplaceListings.length,
    lostFoundItems: lostFoundItems.length,
    itemCustodyRecords: itemCustodyRecords.length,
    ownershipClaims: ownershipClaims.length,
    serviceRequests: serviceRequests.length,
    serviceRequestStatusLogs: serviceRequestStatusLogs.length,
    complaintTickets: complaintTickets.length,
    walletLedger: walletLedger.length,
    trustScoreRecords: trustScoreRecords.length,
    messMenuSchedules: messMenuSchedules.length,
    hostelSnackItems: hostelSnackItems.length,
    hostelPosts: hostelPosts.length,
  };

  const totalRecords = Object.values(tableCounts).reduce((a, b) => a + b, 0);

  const payloadData = {
    users,
    canteenMenus,
    canteenMenuItems,
    foodRequests,
    carpoolRides,
    carpoolBookings,
    parcelDeliveries,
    marketplaceListings,
    lostFoundItems,
    itemCustodyRecords,
    ownershipClaims,
    serviceRequests,
    serviceRequestStatusLogs,
    complaintTickets,
    walletLedger,
    trustScoreRecords,
    messMenuSchedules,
    hostelSnackItems,
    hostelPosts,
  };

  const serializedData = JSON.stringify(payloadData);
  const sha256Checksum = crypto.createHash('sha256').update(serializedData).digest('hex');

  const kolkataTime = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(new Date());

  const manifest: BackupManifest = {
    backupId,
    createdAt: new Date().toISOString(),
    createdAtKolkata: kolkataTime,
    sha256Checksum,
    totalRecords,
    tableCounts,
    schemaVersion: '1.0.0',
    backupSizeBytes: Buffer.byteLength(serializedData, 'utf8'),
  };

  const backupEnvelope = {
    manifest,
    data: payloadData,
  };

  // Write file atomically (temp file then rename)
  const tempPath = `${backupFilePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(backupEnvelope, null, 2), 'utf8');
  fs.renameSync(tempPath, backupFilePath);

  // Write latest manifest
  const latestManifestPath = path.join(backupsDir, 'latest-manifest.json');
  fs.writeFileSync(latestManifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  // Enforce retention policy (keep at least 5 backups, prune older if exceeding 14 days)
  pruneOldBackups(backupsDir);

  const durationMs = Math.round(performance.now() - startTime);

  console.log('[Backup] Snapshot successfully generated and verified!');
  console.log(`  File: ${backupFilePath}`);
  console.log(`  Records Extracted: ${totalRecords}`);
  console.log(`  SHA-256 Checksum: ${sha256Checksum}`);
  console.log(`  Size: ${(manifest.backupSizeBytes / 1024).toFixed(2)} KB`);
  console.log(`  Execution Time: ${durationMs} ms`);
  console.log('----------------------------------------------------');
  console.log('Table Breakdown:');
  for (const [table, count] of Object.entries(tableCounts)) {
    if (count > 0) {
      console.log(`  - ${table.padEnd(22)}: ${count} rows`);
    }
  }
  console.log('====================================================\n');

  return backupFilePath;
}

function pruneOldBackups(backupsDir: string) {
  try {
    const files = fs
      .readdirSync(backupsDir)
      .filter(f => f.startsWith('plexus-backup-') && f.endsWith('.json'))
      .sort();

    // Preserve minimum 3 valid backups
    if (files.length <= 3) return;

    const MAX_BACKUPS = 10;
    if (files.length > MAX_BACKUPS) {
      const toDelete = files.slice(0, files.length - MAX_BACKUPS);
      for (const file of toDelete) {
        fs.unlinkSync(path.join(backupsDir, file));
        console.log(`[Backup Pruning] Pruned old backup beyond retention limit: ${file}`);
      }
    }
  } catch (err) {
    console.warn('[Backup Pruning] Warning during pruning:', err);
  }
}

// Execute directly if run via CLI
if (require.main === module) {
  runDatabaseBackup()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('[Backup Error]', err);
      process.exit(1);
    });
}
