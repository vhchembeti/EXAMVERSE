// test_phase4_verification.js
// Automated verification suite for EXAMVERSE Phase 4: Flagship GATE Intelligence Hub
// Tests: 30 Paper Registry, Multi-Section XE/XH/XL, Two-Paper Combinations,
// Tri-Split Cutoff Isolation, Score Calculator Boundaries, and Overlap Analyzer.

const assert = require('assert');
const http = require('http');

const {
  GATE_PAPERS_LIST,
  TWO_PAPER_COMBINATIONS,
  MULTI_SECTION_ARCHITECTURES,
  CUTOFF_REGISTRY,
  buildFullPaperDossier
} = require('./server/data/gateData');

const {
  calculateGateScore,
  validateTwoPaperCombination,
  analyzeSyllabusOverlap
} = require('./server/services/gateScoreEngine');

function fetchJson(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:5000${path}`);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING EXAMVERSE PHASE 4 GATE VERIFICATION SUITE');
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
  // MODULE 1: 30 OFFICIAL GATE PAPERS REGISTRY
  // ==========================================
  console.log('--- Module 1: Official GATE Paper Registry (All 30 Papers) ---');

  const EXPECTED_30_PAPERS = [
    'AE', 'AG', 'AR', 'BM', 'BT', 'CE', 'CH', 'CS', 'CY', 'DA',
    'EC', 'EE', 'ES', 'EY', 'GE', 'GG', 'IN', 'MA', 'ME', 'MN',
    'MT', 'NM', 'PE', 'PH', 'PI', 'RA', 'ST', 'XE', 'XH', 'XL'
  ];

  test('Registry contains all 30 official paper codes (GATE 2027 with RA and folded TF)', () => {
    assert.strictEqual(GATE_PAPERS_LIST.length, 30, 'Must have exactly 30 official papers');
    const codes = GATE_PAPERS_LIST.map(p => p.code).sort();
    assert.deepStrictEqual(codes, EXPECTED_30_PAPERS.sort(), 'All 30 codes must match');
  });

  await testAsync('API: GET /api/gate/papers returns all 30 papers', async () => {
    const res = await fetchJson('/api/gate/papers');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.totalCount, 30);
    assert.strictEqual(res.body.papers.length, 30);
  });

  test('Multi-Section Architecture: XE, XH, and XL specifications', () => {
    // XE
    const xe = MULTI_SECTION_ARCHITECTURES.XE;
    assert.ok(xe, 'XE architecture must exist');
    assert.strictEqual(xe.compulsorySection.code, 'XE-A');
    assert.strictEqual(xe.compulsorySection.marks, 15);
    assert.strictEqual(xe.optionalSectionRules.selectCount, 2);
    assert.strictEqual(xe.optionalSections.length, 8); // B to I (including XE-I Textile)

    // XH
    const xh = MULTI_SECTION_ARCHITECTURES.XH;
    assert.ok(xh, 'XH architecture must exist');
    assert.strictEqual(xh.compulsorySection.code, 'XH-B1');
    assert.strictEqual(xh.compulsorySection.marks, 25);
    assert.strictEqual(xh.optionalSectionRules.selectCount, 1);
    assert.strictEqual(xh.optionalSections.length, 6); // C1 to C6

    // XL
    const xl = MULTI_SECTION_ARCHITECTURES.XL;
    assert.ok(xl, 'XL architecture must exist');
    assert.strictEqual(xl.compulsorySection.code, 'XL-P');
    assert.strictEqual(xl.compulsorySection.marks, 25);
    assert.strictEqual(xl.optionalSectionRules.selectCount, 2);
    assert.strictEqual(xl.optionalSections.length, 5); // Q to U
  });

  await testAsync('API: GET /api/gate/papers/EC returns 23-point dossier', async () => {
    const res = await fetchJson('/api/gate/papers/EC');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.paperCode, 'EC');
    const d = res.body.dossier;
    assert.ok(d.point1_paperOverview, 'Point 1: Overview');
    assert.ok(d.point2_sectionStructure, 'Point 2: Structure');
    assert.ok(d.point3_eligibilityMapper, 'Point 3: Eligibility');
    assert.ok(d.point4_completeOfficialSyllabus, 'Point 4: Syllabus');
    assert.ok(d.point8_strictlySeparatedCutoffs, 'Point 8: Cutoffs');
    assert.ok(d.point9_examPatternAndMarkingScheme, 'Point 9: Marking scheme');
    assert.ok(d.point15_latexFormulaSheets, 'Point 15: Formulas');
    assert.ok(d.point22_psuRecruitmentMatrix, 'Point 22: PSUs');
  });

  // ==========================================
  // MODULE 2: TWO-PAPER COMBINATION VALIDATOR
  // ==========================================
  console.log('\n--- Module 2: Official Two-Paper Combination Validator ---');

  test('Two-Paper Validator: Valid pairs approved by GATE organizing institute', () => {
    const ec_ee = validateTwoPaperCombination('EC', 'EE');
    assert.strictEqual(ec_ee.isValid, true, 'EC + EE must be valid');

    const ec_in = validateTwoPaperCombination('EC', 'IN');
    assert.strictEqual(ec_in.isValid, true, 'EC + IN must be valid');

    const cs_da = validateTwoPaperCombination('CS', 'DA');
    assert.strictEqual(cs_da.isValid, true, 'CS + DA must be valid');

    const me_xe = validateTwoPaperCombination('ME', 'XE');
    assert.strictEqual(me_xe.isValid, true, 'ME + XE must be valid');
  });

  test('Two-Paper Validator: Disallowed and invalid pairs properly rejected', () => {
    const ec_ce = validateTwoPaperCombination('EC', 'CE');
    assert.strictEqual(ec_ce.isValid, false, 'EC + CE is not allowed');

    const cs_me = validateTwoPaperCombination('CS', 'ME');
    assert.strictEqual(cs_me.isValid, false, 'CS + ME is not allowed');

    const same_paper = validateTwoPaperCombination('EC', 'EC');
    assert.strictEqual(same_paper.isValid, false, 'Same paper cannot be combined');

    const invalid_code = validateTwoPaperCombination('INVALID', 'EC');
    assert.strictEqual(invalid_code.isValid, false, 'Invalid code must be rejected');
  });

  await testAsync('API: POST /api/gate/validate-combination', async () => {
    const validRes = await fetchJson('/api/gate/validate-combination', {
      method: 'POST',
      body: { primaryPaper: 'EC', secondaryPaper: 'EE' }
    });
    assert.strictEqual(validRes.status, 200);
    assert.strictEqual(validRes.body.isValid, true);

    const invalidRes = await fetchJson('/api/gate/validate-combination', {
      method: 'POST',
      body: { primaryPaper: 'EC', secondaryPaper: 'CE' }
    });
    assert.strictEqual(invalidRes.status, 200);
    assert.strictEqual(invalidRes.body.isValid, false);
  });

  // ==========================================
  // MODULE 3: CUTOFF SEPARATION & EPISTEMIC INTEGRITY
  // ==========================================
  console.log('\n--- Module 3: Strict Cutoff Isolation (Qualifying vs Admission vs PSU) ---');

  test('Cutoff datasets are segregated into distinct types with epistemic labels', () => {
    assert.strictEqual(CUTOFF_REGISTRY.qualifyingCutoffs.type, 'QUALIFYING');
    assert.strictEqual(CUTOFF_REGISTRY.admissionCutoffs.type, 'ADMISSION_COAP_CCMT');
    assert.strictEqual(CUTOFF_REGISTRY.psuCutoffs.type, 'PSU_SHORTLISTING');
  });

  await testAsync('API: GET /api/gate/cutoffs returns strictly separated registries', async () => {
    const res = await fetchJson('/api/gate/cutoffs?paperCode=EC');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.qualifyingCutoffs), 'Qualifying cutoffs must be an array');
    assert.ok(Array.isArray(res.body.admissionCutoffs), 'Admission cutoffs must be an array');
    assert.ok(Array.isArray(res.body.psuShortlistingCutoffs), 'PSU cutoffs must be an array');
    // Verify qualifying cutoffs contain 2024 General
    const q24 = res.body.qualifyingCutoffs.find(r => r.year === 2024);
    assert.strictEqual(q24.General, 25.0);
  });

  // ==========================================
  // MODULE 4: OFFICIAL GATE SCORE CALCULATOR & BOUNDARY TESTS
  // ==========================================
  console.log('\n--- Module 4: Official GATE Score & Normalization Calculator ---');

  test('Score Calculator: Boundary M = 100/100 yields max score 1000', () => {
    const res = calculateGateScore(100, { qualifyingMarks: 25.0, topMeanMarks: 90.0 });
    assert.strictEqual(res.gateScore, 1000);
    assert.strictEqual(res.qualifyingStatus, 'QUALIFIED');
    assert.strictEqual(res.label, 'ESTIMATE');
  });

  test('Score Calculator: Boundary M = Mq yields exactly Sq = 350', () => {
    const res = calculateGateScore(25.0, { qualifyingMarks: 25.0, topMeanMarks: 90.0 });
    assert.strictEqual(res.gateScore, 350);
    assert.strictEqual(res.qualifyingStatus, 'QUALIFIED');
  });

  test('Score Calculator: Boundary M = 0 marks yields score 0', () => {
    const res = calculateGateScore(0, { qualifyingMarks: 25.0, topMeanMarks: 90.0 });
    assert.strictEqual(res.gateScore, 0);
    assert.strictEqual(res.qualifyingStatus, 'NOT_QUALIFIED');
  });

  test('Score Calculator: Boundary M < 0 (Negative Marks) gracefully clamped to 0 without NaN', () => {
    const res = calculateGateScore(-4.5, { qualifyingMarks: 25.0, topMeanMarks: 90.0 });
    assert.strictEqual(res.gateScore, 0);
    assert.strictEqual(res.qualifyingStatus, 'NOT_QUALIFIED');
    assert.strictEqual(isNaN(res.gateScore), false);
  });

  test('Score Calculator: Standard Marks 65/100 calculates expected score in 680-720 range', () => {
    const res = calculateGateScore(65.0, { qualifyingMarks: 25.0, topMeanMarks: 90.0 });
    // Formula: 350 + (900 - 350) * (65 - 25) / (90 - 25) = 350 + 550 * 40 / 65 = 350 + 338.46 = 688
    assert.strictEqual(res.gateScore, 688);
    assert.strictEqual(res.qualifyingStatus, 'QUALIFIED');
    assert.ok(res.estimatedRankBand.includes('ESTIMATE') || res.label === 'ESTIMATE');
  });

  // ==========================================
  // MODULE 5: CROSS-PAPER OVERLAP & PSU TRACKER
  // ==========================================
  console.log('\n--- Module 5: Cross-Paper Overlap & PSU Tracker ---');

  test('Syllabus Overlap: EC and EE indicates > 50% synergy', () => {
    const overlap = analyzeSyllabusOverlap('EC', 'EE');
    assert.ok(overlap.sharedPercentage >= 50, 'EC-EE overlap should be >= 50%');
    assert.ok(overlap.commonSubjects.length >= 4, 'Should list major common subjects');
  });

  await testAsync('API: GET /api/gate/overlap returns synergy report', async () => {
    const res = await fetchJson('/api/gate/overlap?p1=CS&p2=DA');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.overlap.sharedPercentage >= 50);
  });

  await testAsync('API: GET /api/gate/psus returns active PSUs for EC', async () => {
    const res = await fetchJson('/api/gate/psus?paperCode=EC');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.psus.length >= 5);
    const psuNames = res.body.psus.map(p => p.psuName);
    assert.ok(psuNames.includes('IOCL') && psuNames.includes('ONGC') && psuNames.includes('PGCIL'));
  });

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log('\n====================================================');
  console.log(`🏁 PHASE 4 VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test run crashed:', err);
  process.exit(1);
});
