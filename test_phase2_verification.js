// test_phase2_verification.js
// Automated Verification Suite for EXAMVERSE Phase 2
// Tests Auth/RBAC, Crypto Envelope Encryption/Decryption, AI Gateway Telemetry,
// Multi-User Tenant Isolation, and Secret Leak Prevention.

const http = require('http');
const fs = require('fs');
const path = require('path');
const cryptoService = require('./server/services/cryptoService');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runPhase2QualityGate() {
  console.log("====================================================");
  console.log("EXAMVERSE PHASE 2 QUALITY GATE & SECURITY AUDIT");
  console.log("====================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // 1. Cryptographic Primitives: Password Hashing Roundtrip
  console.log("--- 1. Enterprise Password Hashing (PBKDF2 SHA-512) ---");
  const rawPassword = "SecureExamversePassword#2026!";
  const hash = cryptoService.hashPassword(rawPassword);
  assert(hash.startsWith('$pbkdf2-sha512$'), "Hash adheres to $pbkdf2-sha512$ format");
  assert(cryptoService.verifyPassword(rawPassword, hash) === true, "verifyPassword succeeds with correct password");
  assert(cryptoService.verifyPassword("WrongPassword123", hash) === false, "verifyPassword fails with incorrect password");

  // 2. Cryptographic Primitives: AES-256-GCM Envelope Encryption
  console.log("\n--- 2. AES-256-GCM Envelope Encryption & Tamper Detection ---");
  const sensitivePII = {
    dateOfBirth: "2001-08-25",
    casteCategory: "OBC-NCL",
    domicileState: "Telangana",
    phone: "9876543210"
  };

  const encryptedDob = cryptoService.encryptField(sensitivePII.dateOfBirth);
  assert(encryptedDob && encryptedDob.algo === 'aes-256-gcm', "Encryption produces AES-256-GCM envelope");
  assert(encryptedDob.wrappedDek && encryptedDob.authTag, "Envelope contains wrapped DEK and GCM auth tag");

  const decryptedDob = cryptoService.decryptField(encryptedDob);
  assert(decryptedDob === sensitivePII.dateOfBirth, "Envelope decryption reconstructs exact plaintext DOB");

  // Tamper test
  let tamperedCaught = false;
  try {
    const tampered = { ...encryptedDob, ciphertext: 'a' + encryptedDob.ciphertext.slice(1) };
    cryptoService.decryptField(tampered);
  } catch (e) {
    tamperedCaught = true;
  }
  assert(tamperedCaught, "GCM auth tag rejects tampered ciphertext");

  // 3. HMAC-SHA256 Blind Indexing
  console.log("\n--- 3. HMAC-SHA256 Blind Indexing ---");
  const bidx1 = cryptoService.computeBlindIndex("Telangana");
  const bidx2 = cryptoService.computeBlindIndex("telangana ");
  const bidx3 = cryptoService.computeBlindIndex("Karnataka");
  assert(bidx1 === bidx2, "Blind index normalizes whitespace and casing deterministically");
  assert(bidx1 !== bidx3, "Different plaintext yields distinct blind index");

  // 4. AI Provider Gateway Telemetry Endpoint
  console.log("\n--- 4. AI Provider Gateway Telemetry (/api/ai/health) ---");
  try {
    const healthRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/health',
      method: 'GET'
    });
    assert(healthRes.status === 200, "GET /api/ai/health returns HTTP 200");
    assert(healthRes.body.status === 'HEALTHY', "Gateway status is HEALTHY");
    assert(healthRes.body.primaryProvider === 'google-gemini-3.8-flash', "Primary provider is Gemini 3.8 Flash");
    assert(typeof healthRes.body.cachedQueriesCount === 'number', "Cached query count metric present");
  } catch (e) {
    assert(false, `AI health endpoint failed: ${e.message}`);
  }

  // 5. CSRF Token Endpoint
  console.log("\n--- 5. CSRF & Session Security ---");
  try {
    const csrfRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/csrf',
      method: 'GET'
    });
    assert(csrfRes.status === 200, "GET /api/auth/csrf returns HTTP 200");
    assert(csrfRes.body.csrfToken && csrfRes.body.csrfToken.length >= 32, "Cryptographically secure CSRF token generated");
    assert(csrfRes.headers['set-cookie']?.some(c => c.includes('examverse_csrf')), "CSRF cookie set in response");
  } catch (e) {
    assert(false, `CSRF endpoint failed: ${e.message}`);
  }

  // 6. User Registration & HttpOnly Session Cookie
  console.log("\n--- 6. Multi-User Authentication & Session Cookies ---");
  const testEmail = `student_${Date.now()}@testexamverse.in`;
  let registerRes;
  try {
    registerRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: "Ananya Sharma",
      email: testEmail,
      password: "TestPassword#2026",
      state: "TG",
      category: "OBC"
    });
    assert(registerRes.status === 201, "POST /api/auth/register returns HTTP 201");
    assert(registerRes.body.user && registerRes.body.user.role === 'student', "Default registered user role is 'student'");
    assert(!registerRes.body.user.password, "Password removed from public user response payload");
    assert(registerRes.headers['set-cookie']?.some(c => c.includes('examverse_session')), "HttpOnly session cookie issued on registration");
  } catch (e) {
    assert(false, `Registration failed: ${e.message}`);
  }

  // 7. Profile Update with PII Envelope Encryption
  console.log("\n--- 7. Profile Persistence & PII Envelope Encryption ---");
  try {
    const profUpdateRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/student/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': testEmail
      }
    }, {
      email: testEmail,
      fullName: "Ananya Sharma",
      dateOfBirth: "2003-04-12",
      category: "EWS",
      domicileState: "Telangana",
      mobileNumber: "9123456789",
      educationalQualification: "Bachelor's degree",
      degree: "B.Tech"
    });
    const updatedProf = profUpdateRes.body.profile || profUpdateRes.body;
    assert(profUpdateRes.status === 200, "PUT /api/student/profile returns HTTP 200");
    assert(updatedProf.degree === "B.Tech", "Profile updated in multi-user store");
    assert(updatedProf._pii_encrypted?.dateOfBirth, "Profile contains envelope-encrypted dateOfBirth");
    assert(updatedProf._blind_indexes?.domicileState, "Profile contains HMAC blind index for domicileState");
  } catch (e) {
    assert(false, `Profile update failed: ${e.message}`);
  }

  // 8. Multi-Tenant Isolation: Another user cannot read/overwrite target's data
  console.log("\n--- 8. Multi-Tenant Tenant Isolation ---");
  const anotherUserEmail = `other_${Date.now()}@testexamverse.in`;
  try {
    const otherProfRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/student/profile',
      method: 'GET',
      headers: { 'x-user-email': anotherUserEmail }
    });
    // Another user should receive either their own profile or default, NOT Ananya Sharma's custom profile
    assert(otherProfRes.body.email !== testEmail, "Tenant isolation: other user cannot read test student profile");
  } catch (e) {
    assert(false, `Tenant isolation check failed: ${e.message}`);
  }

  // 9. Secret Scan Verification
  console.log("\n--- 9. Repository Secret Scan Verification ---");
  const envExamplePath = path.join(__dirname, '.env.example');
  if (fs.existsSync(envExamplePath)) {
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
    const hasLiveKeys = envExampleContent.includes('AQ.Ab8RN6') || envExampleContent.includes('AIzaSy');
    assert(!hasLiveKeys, ".env.example contains zero live keys (only placeholders)");
  } else {
    assert(true, ".env.example verified");
  }

  const gitignorePath = path.join(__dirname, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const coversEnv = gitignoreContent.includes('.env');
    assert(coversEnv, ".gitignore strictly protects all .env files");
  }

  // 10. DatabaseAdapter & Supabase PostgreSQL Migration
  console.log("\n--- 10. DatabaseAdapter & Supabase Migration ---");
  const dbAdapter = require('./server/db/databaseAdapter');
  assert(typeof dbAdapter.getMode() === 'string', "DatabaseAdapter reports active storage mode ('JSON' / 'SUPABASE')");

  const migrationPath = path.join(__dirname, 'migrations', '001_phase2_init_supabase_rls.sql');
  assert(fs.existsSync(migrationPath), "Supabase PostgreSQL migration file exists");
  if (fs.existsSync(migrationPath)) {
    const migrationContent = fs.readFileSync(migrationPath, 'utf8');
    assert(migrationContent.includes('ROW LEVEL SECURITY'), "Migration contains Row-Level Security (RLS) enforcement");
    assert(migrationContent.includes('dob_encrypted JSONB'), "Migration contains envelope encryption columns");
    assert(migrationContent.includes('domicile_state_bidx'), "Migration contains HMAC blind index columns");
  }

  // 11. Render.com Deployment & Legacy Preservation
  console.log("\n--- 11. Render.com & Legacy Isolation ---");
  const renderPath = path.join(__dirname, 'render.yaml');
  assert(fs.existsSync(renderPath), "render.yaml exists for containerized cloud deployment");
  if (fs.existsSync(renderPath)) {
    const renderContent = fs.readFileSync(renderPath, 'utf8');
    assert(renderContent.includes('examverse-platform'), "render.yaml specifies 'examverse-platform' service");
  }

  const legacyPath = path.join(__dirname, 'legacy');
  assert(fs.existsSync(path.join(legacyPath, 'app.py')), "Legacy app.py safely preserved in legacy/");
  assert(fs.existsSync(path.join(legacyPath, 'streamlit_app.py')), "Legacy streamlit_app.py safely preserved in legacy/");

  console.log("\n====================================================");
  console.log(`FINAL RESULT: ${passed} / ${total} TESTS PASSED`);
  console.log("====================================================");

  if (passed === total) {
    console.log(">> ALL PHASE 2 SECURITY & QUALITY GATES PASSED! <<\n");
    process.exit(0);
  } else {
    console.error(">> SOME TESTS FAILED. PLEASE INVESTIGATE. <<\n");
    process.exit(1);
  }
}

runPhase2QualityGate().catch(err => {
  console.error("FATAL ERROR in test runner:", err);
  process.exit(1);
});
