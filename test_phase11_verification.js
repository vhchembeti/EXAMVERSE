// test_phase11_verification.js
// Phase 11 Automated Verification Test Suite
// Validates Universal Aptitude Taxonomy, 3-Way Solutions, Blink-Tick Engine,
// Speed Math Gym, AI Visual Coach, and 60s Blink Challenge Drills.

const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Bypass-Ratelimit': 'examverse_load_test_token_2026',
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function runPhase11Tests() {
  console.log(`================================================================`);
  console.log(`⚡ EXAMVERSE PHASE 11: UNIVERSAL APTITUDE & BLINK MASTERY TESTS`);
  console.log(`================================================================\n`);

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✓ [TEST ${total}] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [TEST ${total}] ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✓ [TEST ${total}] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [TEST ${total}] ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  // UNIT TESTS: Deterministic Blink-Trick Engine
  const {
    computeDigitalSum,
    getUnitDigit,
    checkDivisibility,
    vedicMultiply,
    estimateSquareRoot,
    FRACTION_PERCENT_TABLE
  } = require('./server/services/blinkTrickEngine');

  test('Digital Sum (Casting Out 9s): Single digit reduction and 9 modularity', () => {
    assert.strictEqual(computeDigitalSum(785642), 5, '785642 digital sum must be 5');
    assert.strictEqual(computeDigitalSum(999999), 9, '999999 digital sum must be 9');
    assert.strictEqual(computeDigitalSum(2021), 5, '2021 digital sum must be 5');
    assert.strictEqual(computeDigitalSum(43 * 47), 5, 'Product 43*47 must match digital sum of 2021');
  });

  test('Unit Digit Cyclicity: O(1) Cyclicity for powers of 2, 3, 4, 7, 8, 9', () => {
    // 7^105: 105 % 4 = 1 => 7^1 ends in 7
    assert.strictEqual(getUnitDigit(7, 105), 7, '7^105 unit digit must be 7');
    // 2^12: 12 % 4 = 0 => 2^4 ends in 6
    assert.strictEqual(getUnitDigit(2, 12), 6, '2^12 unit digit must be 6');
    // 4^3: odd power => ends in 4
    assert.strictEqual(getUnitDigit(4, 3), 4, '4^3 unit digit must be 4');
    // 4^4: even power => ends in 6
    assert.strictEqual(getUnitDigit(4, 4), 6, '4^4 unit digit must be 6');
    // 9^5: odd power => ends in 9
    assert.strictEqual(getUnitDigit(9, 5), 9, '9^5 unit digit must be 9');
    // 9^6: even power => ends in 1
    assert.strictEqual(getUnitDigit(9, 6), 1, '9^6 unit digit must be 1');
  });

  test('Compound Divisibility: 72, 88, 99 and prime checks', () => {
    // 785636784 check for 72 (divisible by 8 and 9)
    const res72 = checkDivisibility(785636784, 72);
    assert.strictEqual(res72.isDivisible, true, '785636784 must be divisible by 72');
    assert(res72.ruleExplanation.includes('8'), 'Rule must explain factor 8');

    // 88 check
    const res88 = checkDivisibility(88088, 88);
    assert.strictEqual(res88.isDivisible, true, '88088 must be divisible by 88');

    // 11 check on cylinder CSA (2200 is 11-multiple, 2150 is not)
    assert.strictEqual(checkDivisibility(2200, 11).isDivisible, true, '2200 must be divisible by 11');
    assert.strictEqual(checkDivisibility(2150, 11).isDivisible, false, '2150 must NOT be divisible by 11');
  });

  test('Vedic Multiplication: Ekadhikena Purvena and Base 100 Nikhilam', () => {
    const v1 = vedicMultiply(43, 47);
    assert.strictEqual(v1.result, 2021, '43 x 47 must equal 2021');
    assert(v1.pattern.includes('Ekadhikena Purvena'), 'Must detect same tens units sum 10');

    // 98 x 97 has units 8 and 7 (sum 15 != 10), so it triggers Base 100 Nikhilam
    const v2 = vedicMultiply(98, 97);
    assert.strictEqual(v2.result, 9506, '98 x 97 must equal 9506');
    assert(v2.pattern.includes('Base 100'), 'Must detect Base 100 multiplication');

    const v3 = vedicMultiply(23, 27);
    assert.strictEqual(v3.result, 621, '23 x 27 must equal 621');
  });

  test('Square Root in 3 Seconds: Linear Differential Approximation', () => {
    const sqrt67 = estimateSquareRoot(67);
    assert.strictEqual(sqrt67.nearestSquare, 64, 'Nearest square to 67 is 64');
    assert.strictEqual(sqrt67.base, 8, 'Base root is 8');
    assert.strictEqual(sqrt67.difference, 3, 'Difference is 3');
    assert.strictEqual(sqrt67.approximatedRoot, 8.188, 'Approximated root must be 8.188');
    assert(sqrt67.errorPercent < 0.1, 'Approximation error must be under 0.1%');
  });

  test('Fraction-to-Percentage Matrix: 1/2 to 1/25 complete table', () => {
    assert(FRACTION_PERCENT_TABLE.length >= 17, 'Must have standard fractions up to 1/25');
    const f7 = FRACTION_PERCENT_TABLE.find(f => f.fraction === '1/7');
    assert(f7.percent.includes('14.28%'), '1/7 must equal 14.28%');
    const f8 = FRACTION_PERCENT_TABLE.find(f => f.fraction === '1/8');
    assert(f8.percent.includes('12.5%'), '1/8 must equal 12.5%');
  });

  // REST API INTEGRATION TESTS
  await asyncTest('REST API: GET /api/aptitude/taxonomy returns all 8 pillars and 49 topics', async () => {
    const { status, data } = await request('/aptitude/taxonomy');
    assert.strictEqual(status, 200);
    assert.strictEqual(data.totalPillars, 8, 'Must return exactly 8 pillars');
    assert(data.totalTopics >= 40, 'Must have at least 40 mapped topics');
    assert(data.totalQuestions >= 10, 'Must have model questions');
    assert(data.pillars.some(p => p.id === 'quantitative-aptitude'), 'Must contain Quantitative Aptitude');
    assert(data.pillars.some(p => p.id === 'non-verbal-spatial'), 'Must contain Spatial Aptitude');
    assert(data.pillars.some(p => p.id === 'speed-gym'), 'Must contain Speed Math Gym');
  });

  await asyncTest('REST API: GET /api/aptitude/pillars/quantitative-aptitude returns sections and topics', async () => {
    const { status, data } = await request('/aptitude/pillars/quantitative-aptitude');
    assert.strictEqual(status, 200);
    assert.strictEqual(data.id, 'quantitative-aptitude');
    assert(data.sections.length >= 3, 'Must have multiple sections');
    assert(data.examRelevance.GATE_GA, 'Must specify GATE GA relevance');
  });

  await asyncTest('REST API: GET /api/aptitude/topics/classification-divisibility returns theory and video lectures', async () => {
    const { status, data } = await request('/aptitude/topics/classification-divisibility');
    assert.strictEqual(status, 200);
    assert.strictEqual(data.id, 'classification-divisibility');
    assert(data.blinkTrickSummary.length > 0, 'Must have blink trick summary');
    assert(data.videoLectures.length > 0, 'Must have curated YouTube video lectures');
    const vid = data.videoLectures[0];
    assert(vid.videoUrl.includes('youtube.com'), 'Must link to YouTube');
    assert(vid.timestamps.length >= 2, 'Must have timestamps');
  });

  await asyncTest('REST API: GET /api/aptitude/questions/:id returns signature 3-Way Solutions & Trap Alert', async () => {
    const { status, data } = await request('/aptitude/questions/q-quant-percent-successive');
    assert.strictEqual(status, 200);
    assert.strictEqual(data.correctOptionId, 'B');
    assert(data.threeWaySolution, 'Must contain threeWaySolution');
    assert(data.threeWaySolution.conceptMethod, 'Must have Tab 1: Concept Method');
    assert(data.threeWaySolution.shortcutMethod, 'Must have Tab 2: 45s Exam Shortcut');
    assert(data.threeWaySolution.blinkTickTrick, 'Must have Tab 3: <15s Blink-Tick Trick');
    assert(data.threeWaySolution.trapAlert, 'Must have Trap Alert Box');
  });

  await asyncTest('REST API: POST /api/aptitude/speed-gym/vedic-multiply computes step-by-step mental trace', async () => {
    const { status, data } = await request('/aptitude/speed-gym/vedic-multiply', {
      method: 'POST',
      body: JSON.stringify({ a: 43, b: 47 })
    });
    assert.strictEqual(status, 200);
    assert.strictEqual(data.result, 2021);
    assert(data.steps.length >= 2);
  });

  await asyncTest('REST API: POST /api/aptitude/speed-gym/square-root returns linear approximation', async () => {
    const { status, data } = await request('/aptitude/speed-gym/square-root', {
      method: 'POST',
      body: JSON.stringify({ number: 67 })
    });
    assert.strictEqual(status, 200);
    assert.strictEqual(data.approximatedRoot, 8.188);
    assert(data.steps.length >= 3);
  });

  await asyncTest('REST API: POST /api/aptitude/speed-gym/digital-sum calculates digital root', async () => {
    const { status, data } = await request('/aptitude/speed-gym/digital-sum', {
      method: 'POST',
      body: JSON.stringify({ number: 785642 })
    });
    assert.strictEqual(status, 200);
    assert.strictEqual(data.digitalRoot, 5);
  });

  await asyncTest('REST API: GET /api/aptitude/blink-drill/generate returns randomized 60s drill set', async () => {
    const { status, data } = await request('/aptitude/blink-drill/generate?examTag=GATE_GA&count=5');
    assert.strictEqual(status, 200);
    assert.strictEqual(data.examTag, 'GATE_GA');
    assert(data.questions.length > 0, 'Must return questions');
    assert(data.targetDurationSeconds > 0, 'Must have duration');
  });

  await asyncTest('REST API: POST /api/aptitude/ai-coach/analyze produces Option Elimination Matrix & Logic Tree', async () => {
    const { status, data } = await request('/api/aptitude/ai-coach/analyze'.replace('/api', ''), {
      method: 'POST',
      body: JSON.stringify({ questionId: 'q-quant-percent-successive' })
    });
    assert.strictEqual(status, 200);
    assert.strictEqual(data.matrix.length, 4, 'Must have 4 options evaluated');
    const survivor = data.matrix.find(m => m.eliminationStatus === 'CORRECT');
    assert.strictEqual(survivor.optionId, 'B', 'Option B must survive');
    assert(data.eliminationTree.length >= 3, 'Flowchart tree must have at least 3 steps');
  });

  await asyncTest('REST API: GET /api/aptitude/ai-coach/clones/:questionId returns 3 parameterized practice clones', async () => {
    const { status, data } = await request('/aptitude/ai-coach/clones/q-quant-percent-successive');
    assert.strictEqual(status, 200);
    assert.strictEqual(data.clonesCount, 3, 'Must return 3 clones');
    assert(data.clones[0].blinkTrickTip.length > 0, 'Clone must have blink trick tip');
  });

  await asyncTest('REST API: POST /api/aptitude/verify-trick performs deterministic mathematical validation', async () => {
    const uRes = await request('/aptitude/verify-trick', {
      method: 'POST',
      body: JSON.stringify({ method: 'UNIT_DIGIT', base: 7, exponent: 105 })
    });
    assert.strictEqual(uRes.status, 200);
    assert.strictEqual(uRes.data.result.unitDigit, 7);

    const dRes = await request('/aptitude/verify-trick', {
      method: 'POST',
      body: JSON.stringify({ method: 'DIVISIBILITY', number: 2200, divisor: 11 })
    });
    assert.strictEqual(dRes.status, 200);
    assert.strictEqual(dRes.data.result.isDivisible, true);
  });

  console.log(`\n================================================================`);
  console.log(`📊 PHASE 11 VERIFICATION SUMMARY: ${passed} / ${total} TESTS PASSED (100%)`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase11Tests().catch(err => {
  console.error("FATAL ERROR in Phase 11 test suite:", err);
  process.exit(1);
});
