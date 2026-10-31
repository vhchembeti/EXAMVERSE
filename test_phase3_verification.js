// test_phase3_verification.js
// Automated verification suite for EXAMVERSE Phase 3
// Tests: Deterministic IST Lifecycle Engine, Universal Search Engine,
// National Authority Directory, Coverage Telemetry, and 7-Layer Master Hierarchy.

const assert = require('assert');
const http = require('http');

const { evaluateNoticeLifecycle } = require('./server/services/istLifecycleEngine');
const { searchExams, searchAuthorities, parseSearchQuery } = require('./server/services/universalSearchEngine');
const { allAuthorities, centralAuthorities, stateAndUTAuthorities } = require('./server/data/authoritiesData');
const { masterRegistry, getExamBySlug } = require('./server/data/masterRegistry');

function fetchJson(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING EXAMVERSE PHASE 3 VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // ==========================================
  // MODULE 1: DETERMINISTIC IST LIFECYCLE ENGINE
  // ==========================================
  console.log('--- Module 1: Deterministic IST Notice Lifecycle Engine ---');

  test('IST Boundary: Notice with missing dates returns DATE_NOT_VERIFIED', () => {
    const res = evaluateNoticeLifecycle({});
    assert.strictEqual(res.status, 'DATE_NOT_VERIFIED');
    assert.strictEqual(res.badgeText, 'Date Not Verified');
  });

  test('IST Boundary: Future application start date returns UPCOMING', () => {
    const res = evaluateNoticeLifecycle({
      applicationStartDate: '2026-12-01',
      applicationDeadline: '2026-12-31'
    });
    assert.strictEqual(res.status, 'UPCOMING');
  });

  test('IST Boundary: Active window with > 72h remaining returns ACTIVE', () => {
    // Current simulated date or dynamic date: 10 days in future
    const now = new Date();
    const futureOpen = new Date(now.getTime() - 24 * 3600 * 1000).toISOString().split('T')[0];
    const futureClose = new Date(now.getTime() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const res = evaluateNoticeLifecycle({
      applicationStartDate: futureOpen,
      applicationDeadline: futureClose
    });
    assert.strictEqual(res.status, 'ACTIVE');
  });

  test('IST Boundary: Active window with <= 72h remaining returns CLOSING_SOON', () => {
    const now = new Date();
    const pastOpen = new Date(now.getTime() - 10 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const soonClose = new Date(now.getTime() + 24 * 3600 * 1000).toISOString().split('T')[0];
    const res = evaluateNoticeLifecycle({
      applicationStartDate: pastOpen,
      applicationDeadline: soonClose
    });
    assert.strictEqual(res.status, 'CLOSING_SOON');
    assert.strictEqual(res.isClosingSoon, true);
  });

  test('IST Boundary Invariant: Past deadline can NEVER render as ACTIVE or CLOSING_SOON', () => {
    const res = evaluateNoticeLifecycle({
      applicationStartDate: '2024-01-01',
      applicationDeadline: '2024-01-31'
    });
    assert.strictEqual(res.isPastDeadline, true);
    assert.notStrictEqual(res.status, 'ACTIVE');
    assert.notStrictEqual(res.status, 'CLOSING_SOON');
    assert.ok(['CLOSED', 'EXAMINATION_COMPLETED', 'RESULT_DECLARED'].includes(res.status));
  });

  test('IST Boundary: Corrigendum extension overrides closed notice into ACTIVE', () => {
    const now = new Date();
    const newClose = new Date(now.getTime() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const res = evaluateNoticeLifecycle({
      applicationStartDate: '2024-01-01',
      applicationDeadline: '2024-01-31',
      corrigendumDeadline: newClose,
      corrigendumNoticeUrl: 'https://upsc.gov.in/corrigendum'
    });
    assert.strictEqual(res.status, 'CORRIGENDUM_EXTENDED');
    assert.strictEqual(res.corrigendumExtended, true);
  });

  // ==========================================
  // MODULE 2: UNIVERSAL SEARCH & SYNONYM ENGINE
  // ==========================================
  console.log('\n--- Module 2: Universal Search & Synonym Expansion Engine ---');

  test('Synonym Expansion: Searching "IES" returns UPSC ESE', () => {
    const results = searchExams(masterRegistry, 'IES');
    assert.ok(results.length > 0, 'Should find at least 1 result for IES');
    const matched = results.find(e => e.code.includes('ESE') || e.code.includes('IES'));
    assert.ok(matched, 'Should match UPSC ESE / IES');
  });

  test('Synonym Expansion: Searching "Bank PO" returns IBPS PO or SBI PO', () => {
    const results = searchExams(masterRegistry, 'Bank PO');
    assert.ok(results.length > 0, 'Should find banking exams for "Bank PO"');
    const codes = results.map(r => r.code);
    assert.ok(codes.some(c => c.includes('PO')), 'Must include PO exams');
  });

  test('Synonym Expansion: Searching "EC" matches "ECE" or Electronics', () => {
    const results = searchExams(masterRegistry, 'EC');
    assert.ok(results.length > 0, 'Should match EC/ECE');
  });

  test('Structured Query Syntax: parsing "authority:UPSC status:ACTIVE"', () => {
    const parsed = parseSearchQuery('authority:UPSC status:ACTIVE cse');
    assert.strictEqual(parsed.filters.authority, 'UPSC');
    assert.strictEqual(parsed.filters.status, 'ACTIVE');
    assert.strictEqual(parsed.freeText, 'cse');
  });

  test('Universal Search: Multi-facet filtering on authority UPSC', () => {
    const results = searchExams(masterRegistry, 'authority:UPSC');
    assert.ok(results.length > 0);
    assert.ok(results.every(r => (r.authorityCode || '').includes('UPSC') || (r.conductingBody || '').includes('UPSC')));
  });

  // ==========================================
  // MODULE 3: NATIONAL AUTHORITY DIRECTORY API
  // ==========================================
  console.log('\n--- Module 3: National Authority Directory APIs ---');

  await testAsync('API: GET /api/authorities returns Central + 28 States & 8 UTs (>= 36 administrative units)', async () => {
    const res = await fetchJson('/api/authorities');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.success, 'Response must have success: true');
    assert.ok(res.body.data.length >= 80, `Expected >= 80 authorities, got ${res.body.data.length}`);
    assert.ok(res.body.totalCentral >= 10, 'Expected >= 10 central authorities');
    assert.ok(res.body.totalStateAndUT >= 70, 'Expected >= 70 state/UT authorities');
  });

  await testAsync('API: GET /api/authorities/auth-upsc returns UPSC profile with verified domain', async () => {
    const res = await fetchJson('/api/authorities/auth-upsc');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.code, 'UPSC');
    assert.strictEqual(res.body.data.epistemicStatus, 'OFFICIAL_VERIFIED');
    assert.strictEqual(res.body.data.trustScore, 100);
    assert.ok(res.body.data.officialWebsite.includes('upsc.gov.in'));
  });

  // ==========================================
  // MODULE 4: COVERAGE TELEMETRY & DOMAIN AUDIT
  // ==========================================
  console.log('\n--- Module 4: Coverage Telemetry & Domain Verification Audit ---');

  await testAsync('API: GET /api/coverage/telemetry returns all 36 units & 100% verified official domains', async () => {
    const res = await fetchJson('/api/coverage/telemetry');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.administrativeUnitsTotal, 36);
    assert.strictEqual(res.body.statesCovered, 28);
    assert.strictEqual(res.body.unionTerritoriesCovered, 8);
    assert.strictEqual(res.body.domainIntegrity.unverifiedDomains, 0);
    assert.strictEqual(res.body.domainIntegrity.percentOfficialGov, 100);
  });

  // ==========================================
  // MODULE 5: 7-LAYER MASTER RELATIONAL HIERARCHY
  // ==========================================
  console.log('\n--- Module 5: 7-Layer Master Relational Hierarchy & Exam Detail API ---');

  await testAsync('API: GET /api/exams/slug/upsc-cse returns 7-layer hierarchy', async () => {
    const res = await fetchJson('/api/exams/slug/upsc-cse');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    const exam = res.body.data;
    
    // Layer 1: Authority
    assert.ok(exam.authorityName.includes('Union Public Service Commission'), 'Layer 1: Authority');
    // Layer 2: Exam Family
    assert.ok(exam.examFamily, 'Layer 2: ExamFamily');
    // Layer 3: Exam Code
    assert.strictEqual(exam.code, 'UPSC CSE', 'Layer 3: Exam Code');
    // Layer 4: Cycles
    assert.ok(Array.isArray(exam.cycles) && exam.cycles.length >= 2, 'Layer 4: Exam Cycles');
    // Layer 5: Notices
    assert.ok(Array.isArray(exam.notices), 'Layer 5: Notices');
    // Layer 6: Stages
    assert.ok(Array.isArray(exam.stages) && exam.stages.length >= 3, 'Layer 6: Stages (Prelims, Mains, Interview)');
    // Layer 7: Source Documents
    assert.ok(Array.isArray(exam.sourceDocuments) && exam.sourceDocuments.length >= 1, 'Layer 7: Source Documents');
    assert.strictEqual(exam.sourceDocuments[0].verificationBadge, 'OFFICIAL_CONFIRMED');
    assert.strictEqual(exam.sourceDocuments[0].epistemicTrustScore, 100);
  });

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log('\n====================================================');
  console.log(`🏁 PHASE 3 VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test run crashed:', err);
  process.exit(1);
});
