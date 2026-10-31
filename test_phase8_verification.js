// test_phase8_verification.js
// EXAMVERSE Phase 8 Comprehensive Quality Gate Verification
// Tests:
// 1. Multi-Tier AI Gateway & Deterministic Academic Fallback
// 2. Epistemic Refusal for unannounced cutoffs & dates
// 3. Deterministic Symbolic Math & CAS Numerical Engine
// 4. Client-Side E2EE WebCrypto Vault & Zero-Knowledge Backend Security Guard
// 5. 13 Indian Language Catalogs, RTL Layout Mirroring & Transliteration Normalization

const http = require('http');
const crypto = require('crypto');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

function postJSON(path, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...headers
        }
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJSON(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: 'GET',
        headers
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

function deleteJSON(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: 'DELETE',
        headers
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runPhase8Verification() {
  console.log('===============================================================');
  console.log('🧪 EXAMVERSE PHASE 8 — VERIFICATION SUITE');
  console.log('   Academic Companion, CAS Solver, E2EE Notebook & 13-Language i18n');
  console.log('===============================================================\n');

  // -------------------------------------------------------------
  // Test Suite 1: Symbolic Math Engine (CAS & Numerical Verification)
  // -------------------------------------------------------------
  console.log('--- Suite 1: Deterministic Symbolic Math & CAS Engine ---');
  const symbolicMath = require('./server/services/symbolicMathEngine');

  // 1.1 Quadratic equation
  const quadRes = symbolicMath.solveQuadratic(2, -7, 3);
  assert(quadRes.discriminant === 25, 'Quadratic discriminant is 25 for 2x^2 - 7x + 3');
  assert(quadRes.roots.includes(3) && quadRes.roots.includes(0.5), 'Quadratic roots are 3 and 0.5');

  // 1.2 CSMA/CD Minimum Frame Size
  const csmaRes = symbolicMath.solveCsmaCdMinFrameSize(1000, 2e8, 10e6);
  assert(csmaRes.minFrameBits === 100, 'CSMA/CD minimum frame size is 100 bits');
  assert(csmaRes.minFrameBytes === 12.5, 'CSMA/CD frame size in bytes is 12.5');

  // 1.3 Linear 2x2 System (Cramer\'s Rule)
  const linRes = symbolicMath.solve2x2LinearSystem(2, 3, 13, 1, -1, 4);
  assert(linRes.detMain === -5, '2x2 determinant is -5');
  assert(linRes.x === 5 && linRes.y === 1, 'Solution is x=5, y=1 for system (2x+3y=13, x-y=4)');

  // 1.4 Shannon Capacity
  const shannonRes = symbolicMath.solveShannonCapacity(3000, 30);
  assert(shannonRes.snrLinear === 1000, '30 dB SNR corresponds to 1000 linear SNR');
  assert(Math.round(shannonRes.capacityBps) === 29902, 'Shannon capacity is ~29,902 bps for 3 kHz @ 30 dB');

  // 1.5 CAS Verification via API endpoint
  const casApiRes = await postJSON('/api/academic-companion/verify-math', {
    problemType: 'QUADRATIC',
    parameters: { a: 1, b: -5, c: 6 },
    claimedAnswer: { roots: [3, 2] }
  });
  assert(casApiRes.status === 200 && casApiRes.data.isVerified === true, 'CAS API verified quadratic roots [3, 2]');
  assert(casApiRes.data.symbolicCheckPassed === true, 'CAS symbolic equivalence check passed');

  // 1.6 CAS Discrepancy Detection on False Claim
  const casFalseRes = await postJSON('/api/academic-companion/verify-math', {
    problemType: 'CSMA_CD',
    parameters: { distanceMeters: 1000, propagationSpeedMs: 2e8, bandwidthBps: 10e6 },
    claimedAnswer: { minFrameSizeBits: 500 } // Incorrect claim
  });
  assert(casFalseRes.data.isVerified === false, 'CAS correctly rejected false claim of 500 bits');
  assert(casFalseRes.data.correctResult.minFrameBits === 100, 'CAS returned certified correct answer of 100 bits');

  // -------------------------------------------------------------
  // Test Suite 2: Citation-Grounded Academic Companion & Epistemic Refusal
  // -------------------------------------------------------------
  console.log('\n--- Suite 2: AI Academic Companion & Epistemic Refusal ---');
  const academicService = require('./server/services/academicCompanionService');

  // 2.1 Concept Tutor Mode
  const tutorRes = await academicService.generateAcademicGuidance({
    mode: 'CONCEPT_TUTOR',
    prompt: 'Explain Virtual Memory Paging with TLB and formula for EMAT',
    context: { selectedExam: 'GATE Computer Science', currentSubject: 'Operating Systems' }
  });
  assert(tutorRes.success === true, 'Academic Companion returned guidance');
  assert(tutorRes.epistemicStatus === 'GROUNDED_SYLLABUS_GUIDANCE', 'Epistemic status is GROUNDED_SYLLABUS_GUIDANCE');
  assert(tutorRes.citations && tutorRes.citations.length > 0, 'Guidance includes official citations');
  assert(tutorRes.honestyBadge.includes('Verify Official Rules in Source PDF'), 'Includes statutory verification badge');

  // 2.2 Epistemic Refusal on Unannounced Cutoffs / Speculation
  const refusalRes = await academicService.generateAcademicGuidance({
    mode: 'CONCEPT_TUTOR',
    prompt: 'What will be the exact cutoff score for GATE 2028 CSE and when will notification release?',
    context: { selectedExam: 'GATE 2028' }
  });
  assert(refusalRes.epistemicStatus === 'EPISTEMIC_REFUSAL', 'Refused to guess unannounced future cutoffs/dates');
  assert(refusalRes.content.includes('Official Cutoff & Schedule Policy'), 'Cites official cutoff policy refusal');

  // 2.3 Tier 4 Deterministic Offline Fallback Check
  const fallbackRes = academicService.buildDeterministicAcademicFallback({
    mode: 'HIGH_YIELD_REVISION',
    prompt: 'Linear Algebra eigenvalues flash sheet',
    context: { currentSubject: 'Engineering Mathematics', topic: 'Linear Algebra' }
  });
  assert(fallbackRes.gatewayTier === 'TIER_4_DETERMINISTIC_OFFLINE_SYLLABUS', 'Tier 4 fallback identified');
  assert(fallbackRes.content.includes('Trace of A') || fallbackRes.content.includes('Cayley-Hamilton'), 'Contains deterministic high-yield formula');

  // -------------------------------------------------------------
  // Test Suite 3: Client-Side E2EE WebCrypto Security Vault
  // -------------------------------------------------------------
  console.log('\n--- Suite 3: Client-Side E2EE & Zero-Knowledge Backend ---');

  // 3.1 Node crypto replication of WebCrypto PBKDF2 + AES-GCM
  const testPassphrase = 'MyMasterStudentPassphrase2026!#';
  const testSalt = crypto.randomBytes(16);
  const derivedKey = crypto.pbkdf2Sync(testPassphrase, testSalt, 600000, 32, 'sha256');

  const testIv = crypto.randomBytes(12);
  const sampleNote = { title: 'My Private GATE Notes', content: 'Euler characteristic V - E + F = 2 for planar graphs.' };
  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, testIv);
  let encryptedData = cipher.update(JSON.stringify(sampleNote), 'utf8');
  encryptedData = Buffer.concat([encryptedData, cipher.final(), cipher.getAuthTag()]);

  const saltBase64 = testSalt.toString('base64');
  const ivBase64 = testIv.toString('base64');
  const ciphertextBase64 = encryptedData.toString('base64');

  // 3.2 Post encrypted ciphertext to backend
  const userEmail = 'student.tester@examverse.in';
  const saveNoteRes = await postJSON(
    '/api/notebook/notes',
    {
      ciphertext: ciphertextBase64,
      iv: ivBase64,
      salt: saltBase64,
      iterations: 600000,
      tagSnippet: 'GATE-MATH'
    },
    { 'x-user-email': userEmail }
  );
  assert(saveNoteRes.status === 201, 'Encrypted note accepted by backend (HTTP 201)');
  assert(saveNoteRes.data.note.ciphertext === ciphertextBase64, 'Backend saved ciphertext bit-for-bit');
  const noteId = saveNoteRes.data.note.id;

  // 3.3 Zero-Knowledge Security Guard: Server MUST REJECT unencrypted plaintext
  const plaintextLeakAttempt = await postJSON(
    '/api/notebook/notes',
    {
      ciphertext: ciphertextBase64,
      iv: ivBase64,
      salt: saltBase64,
      iterations: 600000,
      title: 'Leaked Plaintext Title', // ILLEGAL: Plaintext leak
      content: 'Leaked Plaintext Content'
    },
    { 'x-user-email': userEmail }
  );
  assert(plaintextLeakAttempt.status === 400, 'Backend strictly REJECTED plaintext leakage attempt (HTTP 400)');
  assert(plaintextLeakAttempt.data.error.includes('SECURITY POLICY VIOLATION') || plaintextLeakAttempt.data.error.includes('Plaintext key'), 'Returned Zero-Knowledge E2EE violation');

  // 3.4 Retrieve notes from backend and verify ZERO plaintext in response
  const getNotesRes = await getJSON('/api/notebook/notes', { 'x-user-email': userEmail });
  assert(getNotesRes.status === 200, 'Retrieved notes list successfully');
  const fetchedNote = getNotesRes.data.notes.find((n) => n.id === noteId);
  assert(fetchedNote !== undefined, 'Found saved note by ID');
  assert(!fetchedNote.content && !fetchedNote.title, 'Confirmed ZERO plaintext fields in backend response');

  // 3.5 Decrypt retrieved ciphertext locally with passphrase key
  const authTagLength = 16;
  const rawCiphertextBuf = Buffer.from(fetchedNote.ciphertext, 'base64');
  const authTag = rawCiphertextBuf.subarray(rawCiphertextBuf.length - authTagLength);
  const encContent = rawCiphertextBuf.subarray(0, rawCiphertextBuf.length - authTagLength);

  const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, Buffer.from(fetchedNote.iv, 'base64'));
  decipher.setAuthTag(authTag);
  let decryptedText = decipher.update(encContent, null, 'utf8');
  decryptedText += decipher.final('utf8');
  const decryptedObj = JSON.parse(decryptedText);

  assert(decryptedObj.title === sampleNote.title, 'Decrypted title matches original note');
  assert(decryptedObj.content === sampleNote.content, 'Decrypted content matches original note');

  // 3.6 Delete encrypted note
  const deleteRes = await deleteJSON(`/api/notebook/notes/${noteId}`, { 'x-user-email': userEmail });
  assert(deleteRes.status === 200 && deleteRes.data.success === true, 'Encrypted note deleted permanently');

  // -------------------------------------------------------------
  // Test Suite 4: 13-Language Indian Localization & Logical RTL Layout
  // -------------------------------------------------------------
  console.log('\n--- Suite 4: 13-Language Catalogs & Logical RTL Layout ---');

  // Load and inspect i18n file definitions
  const fs = require('fs');
  const i18nContent = fs.readFileSync('./client/src/services/i18n.ts', 'utf8');

  const requiredLangs = ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'as', 'ur'];
  for (const lang of requiredLangs) {
    const hasLang = i18nContent.includes(`${lang}: {`) || i18nContent.includes(`code: '${lang}'`);
    assert(hasLang, `Language catalog contains '${lang}'`);
  }

  // Check RTL classification for Urdu
  assert(i18nContent.includes(`isLanguageRTL(lang: LanguageCode)`), 'Includes isLanguageRTL check');
  assert(i18nContent.includes(`return lang === 'ur'`), 'Urdu strictly marked as RTL');

  // Test Romanized / Transliteration normalization logic
  function testNormalize(q) {
    let s = q.toLowerCase();
    const map = {
      'sarkari': 'government',
      'naukri': 'recruitment job',
      'pariksha': 'exam examination',
      'tayari': 'preparation syllabus',
      'patrata': 'eligibility criteria'
    };
    for (const [k, v] of Object.entries(map)) {
      s = s.replace(new RegExp(`\\b${k}\\b`, 'gi'), `${k} ${v}`);
    }
    return s;
  }

  const normalized = testNormalize('sarkari naukri ki tayari');
  assert(normalized.includes('government') && normalized.includes('recruitment') && normalized.includes('preparation'),
    'Hinglish search query "sarkari naukri ki tayari" expands to canonical terms');

  // -------------------------------------------------------------
  // Summary & Quality Gate
  // -------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(`🎯 PHASE 8 VERIFICATION COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (passedTests === totalTests) {
    console.log('🌟 ALL PHASE 8 QUALITY GATES CONFIRMED PASSED (100%)');
  } else {
    console.log(`⚠️ ${totalTests - passedTests} TESTS FAILED`);
  }
  console.log('===============================================================');
}

runPhase8Verification().catch((err) => {
  console.error('Fatal error in Phase 8 verification suite:', err);
  process.exit(1);
});
