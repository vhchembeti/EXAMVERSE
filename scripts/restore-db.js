// scripts/restore-db.js
// Automated Database Restoration & Disaster Recovery Drill Runner
// Verifies SHA-256 integrity, creates pre-restore safety copy, and records RTO/RPO metrics.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const TARGET_DB = path.join(ROOT_DIR, 'server', 'data', 'examverse_state.json');
const BACKUP_DIR = path.join(ROOT_DIR, 'backups');

function runRestore(backupFilePath = null) {
  const startTime = Date.now();

  // 1. Locate backup file
  let backupToRestore = backupFilePath;
  if (!backupToRestore) {
    const manifestPath = path.join(BACKUP_DIR, 'latest_backup_manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      backupToRestore = manifest.backupFile;
    }
  }

  if (!backupToRestore || !fs.existsSync(backupToRestore)) {
    throw new Error(`Backup file not found for restoration: ${backupToRestore}`);
  }

  // 2. Read backup and verify SHA-256 checksum
  const backupContent = fs.readFileSync(backupToRestore);
  const actualSha256 = crypto.createHash('sha256').update(backupContent).digest('hex');

  const checksumFile = `${backupToRestore}.sha256`;
  if (fs.existsSync(checksumFile)) {
    const expectedSha256 = fs.readFileSync(checksumFile, 'utf8').trim().split(/\s+/)[0];
    if (actualSha256 !== expectedSha256) {
      throw new Error(`CRITICAL: Checksum verification failed! Expected ${expectedSha256}, got ${actualSha256}`);
    }
  }

  // 3. Create safety archive of existing state before overwrite
  if (fs.existsSync(TARGET_DB)) {
    const preRestoreSafetyPath = path.join(BACKUP_DIR, `pre_restore_safety_${Date.now()}.json`);
    fs.copyFileSync(TARGET_DB, preRestoreSafetyPath);
  }

  // 4. Atomically restore database file
  const tempRestorePath = `${TARGET_DB}.tmp-${Date.now()}`;
  fs.writeFileSync(tempRestorePath, backupContent);
  fs.renameSync(tempRestorePath, TARGET_DB);

  const durationMs = Date.now() - startTime;
  const backupStats = fs.statSync(backupToRestore);
  const rpoSeconds = Math.round((Date.now() - backupStats.mtimeMs) / 1000);

  const report = {
    status: 'RESTORE_SUCCESSFUL',
    restoredFrom: backupToRestore,
    targetFile: TARGET_DB,
    verifiedChecksum: actualSha256,
    recoveryTimeObjectiveMs: durationMs, // RTO
    recoveryPointObjectiveSeconds: rpoSeconds, // RPO
    timestamp: new Date().toISOString()
  };

  console.log('===============================================================');
  console.log('  EXAMVERSE DATABASE RESTORE COMPLETED');
  console.log('===============================================================');
  console.log(`  Source:            ${path.basename(backupToRestore)}`);
  console.log(`  Target:            ${TARGET_DB}`);
  console.log(`  Verified SHA-256:  ${actualSha256}`);
  console.log(`  RTO (Recovery Time): ${durationMs} ms`);
  console.log(`  RPO (Data Age):      ${rpoSeconds} seconds`);
  console.log('===============================================================\n');

  return report;
}

if (require.main === module) {
  const customFile = process.argv[2] || null;
  runRestore(customFile);
}

module.exports = { runRestore };
