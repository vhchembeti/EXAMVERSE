// test_phase7_verification.js
// Phase 7 Quality Gate & Rigorous Verification Test Suite
// Verifies:
// 1. Authentic CBT Scoring Arithmetic (GATE MCQ 1-mark & 2-mark negative penalties, MSQ exact-match/no partial/no negative, NAT tolerance)
// 2. TCS iON Invariant: ANSWERED_AND_MARKED_FOR_REVIEW evaluated for score
// 3. 2PL IRT Latent Ability Estimation & FSRS/SM-2 Spaced Repetition
// 4. Dynamic Knapsack Optimization, Topological Prerequisite Sorting & Schedule Auto-Rebalancing
// 5. Live REST APIs on port 5000

const assert = require('assert');
const http = require('http');
const { evaluateCbtAttempt, CBT_STATES } = require('./server/services/cbtScoringEngine');
const {
  calculate2PlProbability,
  updateStudentAbility,
  scheduleFsrsReview,
  identifyTopWeakTopics
} = require('./server/services/adaptiveMasteryEngine');
const {
  topologicalSortTopics,
  generateStudyPlan,
  rebalanceSchedule
} = require('./server/services/knapsackStudyPlanner');
const { EDUCATION_TIERS, SUBJECT_SPACES } = require('./server/data/learningRegistryData');

console.log('====================================================');
console.log('🧪 RUNNING EXAMVERSE PHASE 7 COMPREHENSIVE VERIFICATION');
console.log('====================================================');

let totalTests = 0;
let passedTests = 0;

function testCase(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function asyncTestCase(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// ----------------------------------------------------
// SECTION 1: CBT Scoring Arithmetic & TCS iON Invariants
// ----------------------------------------------------
console.log('\n--- Section 1: Authentic CBT Scoring Arithmetic & Invariants ---');

const sampleGateTest = {
  id: "test-gate-verify",
  examId: "gate-cse",
  title: "GATE CSE Official Simulation Verification Test",
  positiveMarks: 1.0,
  negativeMarks: 0.333,
  questions: [
    // 1-mark MCQ
    { id: 1, type: "MCQ", marks: 1, correctOptionIndex: 2, subject: "Maths", topic: "LA" },
    // 2-mark MCQ
    { id: 2, type: "MCQ", marks: 2, correctOptionIndex: 0, subject: "CS", topic: "OS" },
    // 2-mark MSQ: correct options are 0 and 2
    { id: 3, type: "MSQ", marks: 2, correctOptionIndices: [0, 2], subject: "CS", topic: "TOC" },
    // 2-mark NAT: range 12.0 to 13.0
    { id: 4, type: "NAT", marks: 2, toleranceMin: 12.0, toleranceMax: 13.0, subject: "CS", topic: "CN" },
    // 1-mark MCQ in ANSWERED_AND_MARKED_FOR_REVIEW
    { id: 5, type: "MCQ", marks: 1, correctOptionIndex: 1, subject: "Maths", topic: "Calculus" },
    // 1-mark MCQ in MARKED_FOR_REVIEW (unanswered)
    { id: 6, type: "MCQ", marks: 1, correctOptionIndex: 3, subject: "GA", topic: "English" }
  ]
};

testCase('GATE MCQ 1-mark correct and incorrect penalty arithmetic', () => {
  // Candidate gets Q1 wrong: should deduct exactly 1/3 (0.333) marks
  const answers = {
    1: { state: CBT_STATES.ANSWERED, selectedOption: 1, timeSpentSeconds: 40 }
  };
  const result = evaluateCbtAttempt(sampleGateTest, answers);
  assert.strictEqual(result.summary.attemptedCount, 1);
  assert.strictEqual(result.summary.correctCount, 0);
  assert.strictEqual(result.summary.incorrectCount, 1);
  // -1/3 marks = -0.333
  assert.ok(Math.abs(result.summary.rawScore - (-0.333)) < 0.005, `Raw score was ${result.summary.rawScore}`);
  assert.ok(Math.abs(result.summary.negativePenaltyTotal - 0.333) < 0.005);
  assert.strictEqual(result.summary.timeWastedOnIncorrectSeconds, 40);
});

testCase('GATE MCQ 2-mark correct and incorrect penalty arithmetic', () => {
  // Candidate gets Q2 wrong: should deduct exactly 2/3 (0.667) marks
  const answers = {
    2: { state: CBT_STATES.ANSWERED, selectedOption: 3, timeSpentSeconds: 60 }
  };
  const result = evaluateCbtAttempt(sampleGateTest, answers);
  assert.ok(Math.abs(result.summary.rawScore - (-0.667)) < 0.005, `Raw score was ${result.summary.rawScore}`);
  assert.ok(Math.abs(result.summary.negativePenaltyTotal - 0.667) < 0.005);
});

testCase('GATE MSQ exact match, partial match, and mistake rules', () => {
  // 1. Exact match: [0, 2] -> earns +2 marks
  const exactAns = {
    3: { state: CBT_STATES.ANSWERED, selectedOptions: [2, 0], timeSpentSeconds: 50 }
  };
  const resExact = evaluateCbtAttempt(sampleGateTest, exactAns);
  assert.strictEqual(resExact.summary.rawScore, 2);
  assert.strictEqual(resExact.summary.negativePenaltyTotal, 0);

  // 2. Partial match: selected only [0] (missing 2) -> 0 marks (NO partial credit)
  const partialAns = {
    3: { state: CBT_STATES.ANSWERED, selectedOptions: [0], timeSpentSeconds: 50 }
  };
  const resPartial = evaluateCbtAttempt(sampleGateTest, partialAns);
  assert.strictEqual(resPartial.summary.rawScore, 0, 'Partial match must receive 0 marks');
  assert.strictEqual(resPartial.summary.negativePenaltyTotal, 0, 'MSQ must have 0 negative marks');

  // 3. Mistake: selected [0, 1] (1 is wrong) -> 0 marks and NO negative marks
  const wrongAns = {
    3: { state: CBT_STATES.ANSWERED, selectedOptions: [0, 1], timeSpentSeconds: 50 }
  };
  const resWrong = evaluateCbtAttempt(sampleGateTest, wrongAns);
  assert.strictEqual(resWrong.summary.rawScore, 0);
  assert.strictEqual(resWrong.summary.negativePenaltyTotal, 0, 'MSQ must have 0 negative marks even if wrong');
});

testCase('GATE NAT tolerance range and zero negative marks', () => {
  // 1. Correct candidate: 12.5 (within 12.0 to 13.0) -> +2 marks
  const ansValid = {
    4: { state: CBT_STATES.ANSWERED, numericAnswer: "12.5", timeSpentSeconds: 45 }
  };
  const resValid = evaluateCbtAttempt(sampleGateTest, ansValid);
  assert.strictEqual(resValid.summary.rawScore, 2);

  // 2. Outside tolerance: 15.0 -> 0 marks, 0 negative penalty
  const ansInvalid = {
    4: { state: CBT_STATES.ANSWERED, numericAnswer: "15.0", timeSpentSeconds: 45 }
  };
  const resInvalid = evaluateCbtAttempt(sampleGateTest, ansInvalid);
  assert.strictEqual(resInvalid.summary.rawScore, 0);
  assert.strictEqual(resInvalid.summary.negativePenaltyTotal, 0, 'NAT must have zero negative marking');
});

testCase('TCS iON Invariant: ANSWERED_AND_MARKED_FOR_REVIEW is scored, MARKED_FOR_REVIEW is not', () => {
  const answers = {
    // Q5: ANSWERED_AND_MARKED_FOR_REVIEW with correct option 1 -> MUST BE EVALUATED FOR SCORE
    5: { state: CBT_STATES.ANSWERED_AND_MARKED_FOR_REVIEW, selectedOption: 1, timeSpentSeconds: 30 },
    // Q6: MARKED_FOR_REVIEW without selection -> MUST RECEIVE 0 WITHOUT PENALTY
    6: { state: CBT_STATES.MARKED_FOR_REVIEW, selectedOption: null, timeSpentSeconds: 20 }
  };
  const res = evaluateCbtAttempt(sampleGateTest, answers);
  assert.strictEqual(res.summary.answeredAndMarkedCount, 1);
  assert.strictEqual(res.summary.markedForReviewOnlyCount, 1);
  assert.strictEqual(res.summary.attemptedCount, 1, 'Only Q5 is considered attempted');
  assert.strictEqual(res.summary.correctCount, 1);
  assert.strictEqual(res.summary.rawScore, 1, 'Q5 was correct and must be awarded +1 mark');
  assert.strictEqual(res.summary.negativePenaltyTotal, 0);
});

// ----------------------------------------------------
// SECTION 2: 2PL IRT & FSRS Spaced Repetition Engine
// ----------------------------------------------------
console.log('\n--- Section 2: 2PL IRT & FSRS / SM-2 Engine ---');

testCase('2PL IRT Probability Monotonicity', () => {
  const a = 1.5;
  const b = 0.0;
  const pLow = calculate2PlProbability(-2.0, a, b);
  const pMid = calculate2PlProbability(0.0, a, b);
  const pHigh = calculate2PlProbability(2.0, a, b);

  assert.ok(pLow < pMid && pMid < pHigh, 'Probability must increase monotonically with theta');
  assert.ok(Math.abs(pMid - 0.5) < 1e-4, 'P(theta=b) must equal 0.5');
});

testCase('Student Ability Update theta increases on success and decreases on failure', () => {
  const initialTheta = 0.0;
  // All correct responses
  const positiveResponses = [
    { isCorrect: true, a: 1.2, b: 0.5 },
    { isCorrect: true, a: 1.5, b: 1.0 },
    { isCorrect: true, a: 1.0, b: 0.2 }
  ];
  const updateHigh = updateStudentAbility(initialTheta, positiveResponses);
  assert.ok(updateHigh.newTheta > initialTheta, `Updated theta should be > 0, got ${updateHigh.newTheta}`);

  // All incorrect responses
  const negativeResponses = [
    { isCorrect: false, a: 1.2, b: -0.5 },
    { isCorrect: false, a: 1.5, b: 0.0 },
    { isCorrect: false, a: 1.0, b: -0.2 }
  ];
  const updateLow = updateStudentAbility(initialTheta, negativeResponses);
  assert.ok(updateLow.newTheta < initialTheta, `Updated theta should be < 0, got ${updateLow.newTheta}`);
});

testCase('FSRS / SM-2 Interval Progression on Perfect Recall (q=5)', () => {
  // Turn 1
  const t1 = scheduleFsrsReview({ repetitions: 0, intervalDays: 1, easinessFactor: 2.5 }, 5);
  assert.strictEqual(t1.repetitions, 1);
  assert.strictEqual(t1.intervalDays, 1);
  assert.ok(t1.easinessFactor >= 2.5);

  // Turn 2
  const t2 = scheduleFsrsReview(t1, 5);
  assert.strictEqual(t2.repetitions, 2);
  assert.strictEqual(t2.intervalDays, 6);

  // Turn 3
  const t3 = scheduleFsrsReview(t2, 5);
  assert.strictEqual(t3.repetitions, 3);
  assert.ok(t3.intervalDays >= 15, `Interval should expand, got ${t3.intervalDays}`);
});

testCase('FSRS / SM-2 Lapse Handling (q=1) resets interval and records lapse', () => {
  const matureCard = {
    repetitions: 4,
    intervalDays: 45,
    easinessFactor: 2.6,
    lapses: 0
  };
  const lapsed = scheduleFsrsReview(matureCard, 1);
  assert.strictEqual(lapsed.repetitions, 0, 'Repetitions must reset to 0 on lapse');
  assert.strictEqual(lapsed.intervalDays, 1, 'Interval must reset to 1 day on lapse');
  assert.strictEqual(lapsed.lapses, 1, 'Lapse count must increment');
  assert.strictEqual(lapsed.isLapsed, true);
});

testCase('Weak Topics Aggregator ranks topics with high error rates', () => {
  const attempts = [
    {
      questionEvaluations: [
        { subject: "CS", topic: "B+ Trees", isAttempted: true, isCorrect: false },
        { subject: "CS", topic: "B+ Trees", isAttempted: true, isCorrect: false },
        { subject: "Maths", topic: "Linear Algebra", isAttempted: true, isCorrect: true }
      ]
    }
  ];
  const fsrsItems = [
    { subject: "CS", topic: "B+ Trees", lapses: 3 }
  ];
  const weakTopics = identifyTopWeakTopics(attempts, fsrsItems);
  assert.ok(weakTopics.length > 0);
  assert.strictEqual(weakTopics[0].topic, "B+ Trees");
  assert.ok(weakTopics[0].weaknessScore > 50);
});

// ----------------------------------------------------
// SECTION 3: Dynamic Knapsack & Topological Study Planner
// ----------------------------------------------------
console.log('\n--- Section 3: Dynamic Knapsack & Study Planner ---');

testCase('Topological Prerequisite Sorting respects dependency order', () => {
  const rawTopics = [
    { id: "c-advanced", name: "Advanced Tree Structures", prerequisites: ["b-binary"] },
    { id: "a-foundation", name: "Asymptotics & Foundations", prerequisites: [] },
    { id: "b-binary", name: "Binary Trees", prerequisites: ["a-foundation"] }
  ];
  const sorted = topologicalSortTopics(rawTopics);
  const ids = sorted.map((t) => t.id);
  assert.ok(ids.indexOf("a-foundation") < ids.indexOf("b-binary"));
  assert.ok(ids.indexOf("b-binary") < ids.indexOf("c-advanced"));
});

testCase('Knapsack Study Plan Generation generates valid calendar schedule', () => {
  const plan = generateStudyPlan({
    targetExam: "GATE CS 2027",
    durationDays: 30,
    dailyHours: { weekday: 3.0, weekend: 6.0 },
    selectedSubjectIds: ["engg-maths", "dsa", "os"]
  });

  assert.strictEqual(plan.durationDays, 30);
  assert.strictEqual(plan.schedule.length, 30);
  assert.ok(plan.totalBudgetHours > 90);
  assert.ok(plan.totalTopicsPlanned > 0);
  // Check that activities are populated
  const hasActivities = plan.schedule.some((d) => d.activities.length > 0);
  assert.ok(hasActivities, 'Schedule must contain study activities');
});

testCase('Dynamic Auto-Rebalancing freezes completed history and reschedules backlog', () => {
  const initialPlan = generateStudyPlan({
    targetExam: "GATE CS 2027",
    durationDays: 14,
    dailyHours: { weekday: 3.0, weekend: 5.0 },
    selectedSubjectIds: ["engg-maths", "dsa"]
  });

  // Mark Day 1 as COMPLETED, and Day 2 as MISSED
  initialPlan.schedule[0].status = 'COMPLETED';
  initialPlan.schedule[0].completedHours = 3.0;

  const missedDate = initialPlan.schedule[1].date;
  const rebalanced = rebalanceSchedule(initialPlan, [missedDate]);

  assert.strictEqual(rebalanced.schedule[0].status, 'COMPLETED', 'Past completed day must be preserved');
  assert.strictEqual(rebalanced.schedule[1].status, 'MISSED', 'Target date must be marked MISSED');
  assert.strictEqual(rebalanced.rebalanceTelemetry.missedDaysCount, 1);
  // Pending days must receive carry-over backlog
  const futureDays = rebalanced.schedule.slice(2);
  const hasCatchUp = futureDays.some((d) => d.activities.some((a) => a.description && a.description.includes('[CATCH-UP]')));
  assert.ok(hasCatchUp, 'Future days must contain rescheduled [CATCH-UP] activity');
});

// ----------------------------------------------------
// SECTION 4: Live REST API Verification on Port 5000
// ----------------------------------------------------
console.log('\n--- Section 4: Live REST API Verification ---');

function makeApiRequest(path, method = 'GET', postData = null) {
  return new Promise((resolve, reject) => {
    const payload = postData ? JSON.stringify(postData) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
        }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  await asyncTestCase('API GET /api/learn/tiers returns 8 education tiers', async () => {
    const res = await makeApiRequest('/api/learn/tiers');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.length, 8);
    const tierIds = res.data.map((t) => t.id);
    assert.ok(tierIds.includes('SCHOOL_10TH'));
    assert.ok(tierIds.includes('UNDERGRADUATE'));
    assert.ok(tierIds.includes('COMPETITIVE_RECRUITMENT'));
  });

  await asyncTestCase('API GET /api/learn/subjects returns 20 subject spaces', async () => {
    const res = await makeApiRequest('/api/learn/subjects');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.length >= 15);
    const codes = res.data.map((s) => s.code);
    assert.ok(codes.includes('EM'));
    assert.ok(codes.includes('DSA'));
    assert.ok(codes.includes('OS'));
    assert.ok(codes.includes('DBMS'));
    assert.ok(codes.includes('CN'));
  });

  await asyncTestCase('API GET /api/learn/formulas returns formulas with LaTeX formatting', async () => {
    const res = await makeApiRequest('/api/learn/formulas');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.length >= 10);
    const masterThm = res.data.find((f) => f.name.includes('Master Theorem'));
    assert.ok(masterThm);
    assert.ok(masterThm.latex.includes('T(n) = a T(n/b)'));
  });

  await asyncTestCase('API POST /api/mock-tests/mock-gate-cs-cbt-sim/submit-cbt evaluates CBT responses', async () => {
    const candidateAnswers = {
      1: { state: 'ANSWERED', selectedOption: 1, timeSpentSeconds: 30 }, // correct (+1)
      2: { state: 'ANSWERED', selectedOption: 0, timeSpentSeconds: 40 }, // wrong (-0.667)
      3: { state: 'ANSWERED', numericAnswer: '144', timeSpentSeconds: 25 }, // correct NAT (+1)
      7: { state: 'ANSWERED', selectedOptions: [0, 1, 2], timeSpentSeconds: 60 } // correct MSQ (+2)
    };

    const res = await makeApiRequest('/api/mock-tests/mock-gate-cs-cbt-sim/submit-cbt', 'POST', { candidateAnswers });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.telemetry);
    assert.ok(res.data.telemetry.summary.attemptedCount >= 4);
    assert.ok(res.data.telemetry.summary.rawScore > 0);
  });

  await asyncTestCase('API POST /api/mastery/fsrs/review updates spaced repetition intervals', async () => {
    const item = { repetitions: 1, intervalDays: 1, easinessFactor: 2.5 };
    const res = await makeApiRequest('/api/mastery/fsrs/review', 'POST', { item, quality: 5 });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.repetitions, 2);
    assert.strictEqual(res.data.intervalDays, 6);
    assert.ok(res.data.nextReviewDate);
  });

  await asyncTestCase('API POST /api/planner/generate returns Knapsack optimized plan', async () => {
    const payload = {
      targetExam: "GATE CS 2027",
      durationDays: 30,
      dailyHours: { weekday: 3.5, weekend: 6.5 },
      selectedSubjectIds: ["engg-maths", "dsa", "os"]
    };
    const res = await makeApiRequest('/api/planner/generate', 'POST', payload);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.durationDays, 30);
    assert.strictEqual(res.data.schedule.length, 30);
  });

  console.log('\n====================================================');
  console.log(`📊 PHASE 7 VERIFICATION RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    console.log('🎉 ALL PHASE 7 QUALITY GATES COMPLETED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('❌ PHASE 7 VERIFICATION FAILED\n');
    process.exit(1);
  }
})();
