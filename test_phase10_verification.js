// test_phase10_verification.js
// Phase 10 Automated Verification Suite for EXAMVERSE
// Verifies DPDP Act 2023 Consent Ledger, Data Portability, Cryptographic Erasure,
// Key Rotation, Security Headers, PII Log Scrubber, Backup/Restore Drill, and PWA Manifest.

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const consentLedger = require('./server/services/consentLedgerService');
const keyRotation = require('./server/services/keyRotationService');
const { sanitizePiiForLogs } = require('./server/middleware/securityHeaders');
const { runBackup } = require('./scripts/backup-db');
const { runRestore } = require('./scripts/restore-db');
const cryptoService = require('./server/services/cryptoService');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('===============================================================');
console.log('  EXAMVERSE PHASE 10 MASTER PRODUCTION VERIFICATION SUITE');
console.log('===============================================================\n');

// -------------------------------------------------------------
// GROUP 1: DPDP Act 2023 Consent Ledger & Purpose Limitation
// -------------------------------------------------------------
console.log('Group 1: DPDP Act 2023 Consent Ledger & Purpose Limitation');

runTest('Consent catalog defines statutory purposes with legal basis', () => {
  const catalog = consentLedger.CONSENT_PURPOSES;
  assert(catalog.EXAM_NOTIFICATIONS, 'EXAM_NOTIFICATIONS purpose missing');
  assert(catalog.ACADEMIC_ANALYTICS, 'ACADEMIC_ANALYTICS purpose missing');
  assert(catalog.AI_COMPANION_STUDY, 'AI_COMPANION_STUDY purpose missing');
  assert(catalog.DATA_BACKUP_SYNC, 'DATA_BACKUP_SYNC purpose missing');
  assert.strictEqual(catalog.DATA_BACKUP_SYNC.isMandatory, true, 'Data sync should be mandatory service');
  assert.strictEqual(catalog.EXAM_NOTIFICATIONS.isMandatory, false, 'Notifications should be optional opt-in');
});

runTest('recordConsent generates immutable log entry with hashed IP', () => {
  const entry = consentLedger.recordConsent('user-test-101', 'EXAM_NOTIFICATIONS', true, '192.168.1.50', 'TestAgent/1.0');
  assert(entry.id.startsWith('cons-'));
  assert.strictEqual(entry.userId, 'user-test-101');
  assert.strictEqual(entry.purposeCode, 'EXAM_NOTIFICATIONS');
  assert.strictEqual(entry.granted, true);
  assert(entry.ipHash && entry.ipHash.length === 16, 'IP should be hashed, not raw');
  assert(!entry.ipHash.includes('192.168.1.50'), 'Raw IP must never be stored in ledger');
});

runTest('getUserConsentState accurately returns active consent vector', () => {
  consentLedger.recordConsent('user-test-101', 'ACADEMIC_ANALYTICS', true);
  consentLedger.recordConsent('user-test-101', 'AI_COMPANION_STUDY', false);

  const state = consentLedger.getUserConsentState('user-test-101');
  assert.strictEqual(state.activeConsent.EXAM_NOTIFICATIONS, true);
  assert.strictEqual(state.activeConsent.ACADEMIC_ANALYTICS, true);
  assert.strictEqual(state.activeConsent.AI_COMPANION_STUDY, false);
  assert.strictEqual(state.activeConsent.DATA_BACKUP_SYNC, true); // Mandatory
});

runTest('Section 9 Minor Protection: Parental consent registration stores verified guardian', () => {
  const parental = consentLedger.recordParentalConsent('minor-student-01', {
    guardianName: 'Ramesh Chandra Baswa',
    guardianRelation: 'Father',
    guardianEmail: 'parent@examverse.in',
    guardianPhone: '9876543210',
    candidateAge: 16
  });

  assert.strictEqual(parental.guardianName, 'Ramesh Chandra Baswa');
  assert.strictEqual(parental.status, 'VERIFIED');
  assert.strictEqual(parental.candidateAge, 16);

  const fetched = consentLedger.getParentalConsent('minor-student-01');
  assert.strictEqual(fetched.guardianEmail, 'parent@examverse.in');
});

runTest('Statutory Grievance Redressal Officer meets DPDP Rule 11 standards', () => {
  const dpo = consentLedger.getGrievanceOfficer();
  assert(dpo.name, 'DPO name missing');
  assert(dpo.email && dpo.email.includes('@'), 'DPO email missing');
  assert(dpo.redressalTimeframe.includes('7 business days'), '7 days SLA missing');
  assert.strictEqual(dpo.complianceJurisdiction, 'Data Protection Board of India (DPBI)');
});

// -------------------------------------------------------------
// GROUP 2: Data Portability & Cryptographic Erasure
// -------------------------------------------------------------
console.log('\nGroup 2: Data Portability & Cryptographic Erasure');

runTest('exportUserData compiles comprehensive statutory JSON bundle', async () => {
  const bundle = await consentLedger.exportUserData('usr-student-01', 'student@examverse.in');
  assert(bundle.metadata.exportId.startsWith('exp-'));
  assert.strictEqual(bundle.metadata.statutoryStandard, 'DPDP Act 2023 Section 12 Right to Data Portability');
  assert(bundle.dataCategories.consentLedger);
  assert(bundle.dataCategories.academicInterests);
  assert(bundle.grievanceOfficerContact);
});

runTest('eraseUserData rejects incorrect confirmation phrase', async () => {
  let threw = false;
  try {
    await consentLedger.eraseUserData('usr-student-01', 'student@examverse.in', 'DELETE');
  } catch (err) {
    threw = true;
    assert(err.message.includes('Phrase mismatch'));
  }
  assert.strictEqual(threw, true, 'Should reject non-matching confirmation');
});

runTest('eraseUserData with matching phrase permanently destroys PII and consent records', async () => {
  const result = await consentLedger.eraseUserData('user-test-101', 'temp@examverse.in', 'PERMANENTLY_DELETE_MY_EXAMVERSE_DATA');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.tombstone.status, 'CRYPTOGRAPHICALLY_ERASED');

  // Verify ledger is emptied
  const postState = consentLedger.getUserConsentState('user-test-101');
  assert.strictEqual(postState.consentHistory.length, 0);
});

// -------------------------------------------------------------
// GROUP 3: OWASP ASVS Envelope Key Rotation (Zero-Exposure)
// -------------------------------------------------------------
console.log('\nGroup 3: Envelope Key Rotation Utility (OWASP ASVS Level 2)');

runTest('keyRotationService generates 16-character SHA-256 fingerprints', () => {
  const fp1 = keyRotation.getFingerprint('key_alpha');
  const fp2 = keyRotation.getFingerprint('key_beta');
  assert.strictEqual(fp1.length, 16);
  assert.strictEqual(fp2.length, 16);
  assert.notStrictEqual(fp1, fp2);
});

runTest('rewrapEnvelope re-encrypts DEK under new KEK while preserving ciphertext', () => {
  const originalKek = 'examverse_master_kek_32bytes_sec_2026!';
  const newKek = 'examverse_rotated_kek_32bytes_sec_2027!';
  const plaintext = 'Secret Candidate PII: DOB=2000-05-15';

  // 1. Encrypt with original KEK using cryptoService
  const envelope = cryptoService.encryptField(plaintext);
  assert(envelope.ciphertext && envelope.wrappedDek);

  const originalCiphertext = envelope.ciphertext;
  const originalIv = envelope.iv;
  const originalWrappedDek = envelope.wrappedDek;

  // 2. Rotate envelope to new KEK
  const rotatedEnvelope = keyRotation.rewrapEnvelope(envelope, originalKek, newKek);

  // Ciphertext and IV must be completely unchanged (zero plaintext exposure!)
  assert.strictEqual(rotatedEnvelope.ciphertext, originalCiphertext);
  assert.strictEqual(rotatedEnvelope.iv, originalIv);
  // Wrapped DEK must be newly encrypted
  assert.notStrictEqual(rotatedEnvelope.wrappedDek, originalWrappedDek);
  assert.strictEqual(rotatedEnvelope.version, 2);

  // 3. Verify decryption succeeds with new KEK
  const normNewKek = keyRotation.normalizeKek(newKek);
  const kekIv = Buffer.from(rotatedEnvelope.kekIv, 'hex');
  const kekTag = Buffer.from(rotatedEnvelope.kekTag, 'hex');
  const decipherKek = crypto.createDecipheriv('aes-256-gcm', normNewKek, kekIv);
  decipherKek.setAuthTag(kekTag);
  let unwrappedDekHex = decipherKek.update(rotatedEnvelope.wrappedDek, 'hex', 'utf8');
  unwrappedDekHex += decipherKek.final('utf8');
  const unwrappedDek = Buffer.from(unwrappedDekHex, 'hex');

  const cipherDecipher = crypto.createDecipheriv('aes-256-gcm', unwrappedDek, Buffer.from(rotatedEnvelope.iv, 'hex'));
  cipherDecipher.setAuthTag(Buffer.from(rotatedEnvelope.authTag, 'hex'));
  let decryptedText = cipherDecipher.update(rotatedEnvelope.ciphertext, 'hex', 'utf8');
  decryptedText += cipherDecipher.final('utf8');

  assert.strictEqual(decryptedText, plaintext);
});

// -------------------------------------------------------------
// GROUP 4: Structured Log PII Redaction & Secret Leak Auditing
// -------------------------------------------------------------
console.log('\nGroup 4: Log PII Redaction & Secret Leak Auditing');

runTest('sanitizePiiForLogs masks 12-digit Aadhaar, 10-char PAN, phone numbers, and Bearer tokens', () => {
  const sensitiveLog = 'User 9876543210 updated profile. Aadhaar: 1234 5678 9012. PAN: ABCDE1234F. Auth: Bearer eyJhbGciOiJIUzI1NiJ9';
  const sanitized = sanitizePiiForLogs(sensitiveLog);

  assert(!sanitized.includes('9876543210'), 'Phone number was not redacted');
  assert(!sanitized.includes('1234 5678 9012'), 'Aadhaar was not redacted');
  assert(!sanitized.includes('ABCDE1234F'), 'PAN was not redacted');
  assert(!sanitized.includes('eyJhbGciOiJIUzI1NiJ9'), 'Bearer token was not redacted');

  assert(sanitized.includes('PHONE-REDACTED'));
  assert(sanitized.includes('XXXX-XXXX-REDACTED'));
  assert(sanitized.includes('PAN-REDACTED'));
  assert(sanitized.includes('Bearer REDACTED_TOKEN'));
});

runTest('sanitizePiiForLogs redacts sensitive JSON dictionary fields', () => {
  const sensitiveObj = {
    user: 'candidate',
    password: 'superSecretPassword123!',
    mobileNumber: '9876543210',
    dateOfBirth: '2001-08-20',
    publicParam: 'GATE-CS'
  };

  const cleanObj = sanitizePiiForLogs(sensitiveObj);
  assert.strictEqual(cleanObj.password, '[REDACTED]');
  assert.strictEqual(cleanObj.mobileNumber, '[REDACTED]');
  assert.strictEqual(cleanObj.dateOfBirth, '[REDACTED]');
  assert.strictEqual(cleanObj.publicParam, 'GATE-CS');
});

runTest('.env.example contains zero real credentials and only safe placeholders', () => {
  const envExample = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
  assert(!envExample.includes('AIzaSy'), 'Live Gemini API key found in .env.example');
  assert(!envExample.includes('gsk_'), 'Live Groq API key found in .env.example');
  assert(envExample.includes('your_google_gemini_api_key_here'));
  assert(envExample.includes('your_groq_free_tier_api_key_here'));
});

// -------------------------------------------------------------
// GROUP 5: Automated Backup & Restore Drill
// -------------------------------------------------------------
console.log('\nGroup 5: Automated Database Backup & Disaster Recovery');

runTest('runBackup generates atomic snapshot, gzip archive, and verified SHA-256 checksum', () => {
  const manifest = runBackup();
  assert.strictEqual(manifest.status, 'SUCCESS');
  assert(fs.existsSync(manifest.backupFile));
  assert(fs.existsSync(manifest.compressedFile));
  assert(manifest.sha256Checksum && manifest.sha256Checksum.length === 64);
});

runTest('runRestore validates SHA-256 and records RTO < 1000ms', () => {
  const restoreReport = runRestore();
  assert.strictEqual(restoreReport.status, 'RESTORE_SUCCESSFUL');
  assert(restoreReport.recoveryTimeObjectiveMs < 1000, `RTO ${restoreReport.recoveryTimeObjectiveMs}ms exceeded threshold`);
  assert(restoreReport.recoveryPointObjectiveSeconds >= 0);
});

// -------------------------------------------------------------
// GROUP 6: PWA Offline Manifest & Service Worker
// -------------------------------------------------------------
console.log('\nGroup 6: PWA Offline Manifest & Service Worker');

runTest('manifest.json has valid PWA standalone parameters', () => {
  const manifestPath = path.join(__dirname, 'client', 'public', 'manifest.json');
  assert(fs.existsSync(manifestPath), 'manifest.json missing');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.strictEqual(manifest.short_name, 'EXAMVERSE');
  assert.strictEqual(manifest.display, 'standalone');
  assert.strictEqual(manifest.theme_color, '#1e3a8a');
  assert(manifest.icons.length > 0);
});

runTest('sw.js exists and implements offline caching logic', () => {
  const swPath = path.join(__dirname, 'client', 'public', 'sw.js');
  assert(fs.existsSync(swPath), 'sw.js missing');
  const swCode = fs.readFileSync(swPath, 'utf8');
  assert(swCode.includes('examverse-pwa-v1'));
  assert(swCode.includes('caches.open'));
  assert(swCode.includes('offline'));
});

console.log('\n===============================================================');
console.log(`  PHASE 10 VERIFICATION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('===============================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  process.exit(0);
}
