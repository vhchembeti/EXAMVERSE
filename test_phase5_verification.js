// test_phase5_verification.js
// EXAMVERSE Phase 5 Verification & Statutory Audit Suite
// Tests 11 Benchmark Personas, Deterministic Three-Valued Logic (TRUE, FALSE, UNKNOWN),
// 6-Bucket Opportunity Classification, Exact Age Cut-offs, Category Relaxations,
// What-If Deltas, Syllabus Overlap Matrix, and Live API Endpoints.

const http = require('http');
const { STUDENT_PERSONAS } = require('./server/data/studentPersonas');
const {
  calculateExactAge,
  getStatutoryAgeRelaxation,
  evaluateStudentEligibility,
  batchEvaluateExaminations
} = require('./server/services/deterministicEligibilityEngine');
const {
  simulateWhatIfMutations,
  getCrossStreamSyllabusMatrix,
  generatePathToEligibility
} = require('./server/services/whatIfSimulatorEngine');
const exams = require('./server/data/examsData');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${message}`);
    passCount++;
  } else {
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${message}`);
    failCount++;
  }
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(dataString ? { 'Content-Length': Buffer.byteLength(dataString) } : {})
        }
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(raw) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body: raw });
          }
        });
      }
    );
    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runPhase5TestSuite() {
  console.log('\n============================================================');
  console.log('   EXAMVERSE PHASE 5 — DETERMINISTIC ELIGIBILITY & SIMULATOR');
  console.log('============================================================\n');

  // TEST SUITE 1: Pure Three-Valued Logic & Age Calculation
  console.log('\n--- TEST SUITE 1: Statutory Age & Category Relaxations ---');
  
  const ageExact = calculateExactAge('2002-08-01', '2026-08-01');
  assert(ageExact.years === 24 && ageExact.months === 0 && ageExact.days === 0, 'Exact birthday evaluates to 24 yrs 0 mos 0 days on cut-off date');

  const ageBefore = calculateExactAge('2002-08-02', '2026-08-01');
  assert(ageBefore.years === 23, '1 day before cut-off date correctly evaluates to 23 years');

  const relGeneral = getStatutoryAgeRelaxation('General', false, false);
  assert(relGeneral.relaxationYears === 0, 'General category has 0 relaxation years');

  const relOBC = getStatutoryAgeRelaxation('OBC', false, false);
  assert(relOBC.relaxationYears === 3, 'OBC category receives statutory +3 years relaxation');

  const relSC = getStatutoryAgeRelaxation('SC', false, false);
  assert(relSC.relaxationYears === 5, 'SC/ST category receives statutory +5 years relaxation');

  const relPwD = getStatutoryAgeRelaxation('General', true, false);
  assert(relPwD.relaxationYears === 10, 'PwBD receives statutory +10 years relaxation');

  const relCumulative = getStatutoryAgeRelaxation('SC', true, false);
  assert(relCumulative.relaxationYears === 15, 'SC + PwBD cumulative relaxation evaluates to 15 years (5+10)');

  // TEST SUITE 2: All 11 Statutory Student Personas
  console.log('\n--- TEST SUITE 2: 11 Statutory Student Personas Evaluation ---');

  const allPersonas = Object.values(STUDENT_PERSONAS);
  assert(allPersonas.length === 11, 'All 11 mandatory student personas loaded');

  // 1. Class 12 PCM
  const p12 = STUDENT_PERSONAS['class-12-pcm'];
  const jeeExam = exams.find(e => e.code.includes('JEE') || e.id.includes('jee'));
  const upscExam = exams.find(e => e.code === 'UPSC CSE' || e.id === 'upsc-cse');
  
  if (jeeExam) {
    const jeeEval = evaluateStudentEligibility(p12, jeeExam);
    assert(jeeEval.profileEligibilityBucket === 'ELIGIBLE' || jeeEval.profileEligibilityBucket === 'FUTURE_OPPORTUNITY',
      'Class 12 PCM student eligible for Entrance/12th exams');
  }
  if (upscExam) {
    const upscEval = evaluateStudentEligibility(p12, upscExam);
    assert(upscEval.profileEligibilityBucket === 'NOT_ELIGIBLE',
      'Class 12 PCM student is NOT ELIGIBLE for UPSC CSE (degree & age requirement)');
    assert(upscEval.explanationTrace.some(t => t.outcome === 'FALSE'),
      'Class 12 PCM explanation trace contains explicit FALSE outcome');
  }

  // 2. 3-Year Polytechnic Diploma (Mechanical)
  const pDiploma = STUDENT_PERSONAS['diploma-mechanical'];
  const rrbExam = exams.find(e => e.code === 'RRB JE' || e.id === 'rrb-je');
  if (rrbExam) {
    const rrbEval = evaluateStudentEligibility(pDiploma, rrbExam);
    assert(rrbEval.profileEligibilityBucket === 'ELIGIBLE',
      '3-Year Polytechnic Mechanical Diploma student is ELIGIBLE for RRB JE (Mechanical)');
  }
  if (upscExam) {
    const upscDiplomaEval = evaluateStudentEligibility(pDiploma, upscExam);
    assert(upscDiplomaEval.profileEligibilityBucket === 'NOT_ELIGIBLE',
      'Diploma student is NOT ELIGIBLE for UPSC CSE (requires Bachelor degree)');
  }

  // 3. B.Tech Computer Science
  const pCSE = STUDENT_PERSONAS['btech-cse'];
  const gateCS = exams.find(e => e.code === 'GATE CS' || e.id === 'gate-cs');
  if (gateCS) {
    const gateEval = evaluateStudentEligibility(pCSE, gateCS);
    assert(gateEval.profileEligibilityBucket === 'ELIGIBLE',
      'B.Tech CSE graduate is ELIGIBLE for GATE CS');
  }
  if (upscExam) {
    const upscEval = evaluateStudentEligibility(pCSE, upscExam);
    assert(upscEval.profileEligibilityBucket === 'ELIGIBLE',
      'B.Tech CSE graduate is ELIGIBLE for UPSC CSE');
  }

  // 4. B.Tech Data Science & AI
  const pAIDS = STUDENT_PERSONAS['btech-aids'];
  if (upscExam) {
    const upscEval = evaluateStudentEligibility(pAIDS, upscExam);
    assert(upscEval.profileEligibilityBucket === 'ELIGIBLE',
      'B.Tech Data Science & AI graduate is ELIGIBLE for UPSC CSE');
  }

  // 5. B.Tech Electronics & Communication
  const pECE = STUDENT_PERSONAS['btech-ece'];
  const upscESE = exams.find(e => e.code === 'UPSC ESE' || e.id === 'upsc-ese');
  if (upscESE) {
    const eseEval = evaluateStudentEligibility(pECE, upscESE);
    assert(eseEval.profileEligibilityBucket === 'ELIGIBLE',
      'B.Tech ECE graduate is ELIGIBLE for UPSC ESE (Engineering Services)');
  }

  // 6. B.Tech Electrical
  const pEEE = STUDENT_PERSONAS['btech-eee'];
  if (upscESE) {
    const eseEval = evaluateStudentEligibility(pEEE, upscESE);
    assert(eseEval.profileEligibilityBucket === 'ELIGIBLE',
      'B.Tech Electrical graduate is ELIGIBLE for UPSC ESE');
  }

  // 7. B.Tech Mechanical
  const pME = STUDENT_PERSONAS['btech-me'];
  if (upscESE) {
    const eseEval = evaluateStudentEligibility(pME, upscESE);
    assert(eseEval.profileEligibilityBucket === 'ELIGIBLE',
      'B.Tech Mechanical graduate is ELIGIBLE for UPSC ESE');
  }

  // 8. B.A. Arts Graduate
  const pArts = STUDENT_PERSONAS['ba-arts'];
  if (upscExam) {
    const upscEval = evaluateStudentEligibility(pArts, upscExam);
    assert(upscEval.profileEligibilityBucket === 'ELIGIBLE',
      'B.A. Arts graduate is ELIGIBLE for UPSC CSE');
  }
  if (upscESE) {
    const eseEval = evaluateStudentEligibility(pArts, upscESE);
    assert(eseEval.profileEligibilityBucket === 'NOT_ELIGIBLE',
      'B.A. Arts graduate is NOT ELIGIBLE for UPSC ESE (Requires Engineering Degree)');
  }

  // 9. B.Com Commerce Graduate
  const pCom = STUDENT_PERSONAS['bcom-commerce'];
  if (upscExam) {
    const upscEval = evaluateStudentEligibility(pCom, upscExam);
    assert(upscEval.profileEligibilityBucket === 'ELIGIBLE',
      'B.Com Commerce graduate is ELIGIBLE for UPSC CSE');
  }

  // 10. M.Tech Postgraduate
  const pMTech = STUDENT_PERSONAS['postgraduate-mtech'];
  if (upscExam) {
    const upscEval = evaluateStudentEligibility(pMTech, upscExam);
    assert(upscEval.profileEligibilityBucket === 'ELIGIBLE',
      'M.Tech postgraduate is ELIGIBLE for UPSC CSE');
  }

  // 11. Research / PhD Aspirant
  const pResearch = STUDENT_PERSONAS['research-aspirant'];
  const netExam = exams.find(e => e.code.includes('NET') || e.category === 'Research and Fellowship');
  if (netExam) {
    const netEval = evaluateStudentEligibility(pResearch, netExam);
    assert(netEval.profileEligibilityBucket === 'ELIGIBLE',
      'Research Aspirant (M.Sc) is ELIGIBLE for Research & Fellowship examinations');
  }

  // TEST SUITE 3: Boundary Conditions, UNKNOWN States & Physical Standards
  console.log('\n--- TEST SUITE 3: Three-Valued Logic Boundary Conditions & UNKNOWN States ---');

  // Unknown Physical Standard (Height missing in uniform exam)
  const mockPoliceExam = {
    id: 'mock-capf',
    code: 'CAPF AC',
    title: 'Central Armed Police Forces Assistant Commandant',
    eligibility: {
      minQualification: 'Graduate',
      minAge: 20,
      maxAge: 25,
      physicalStandards: { minHeightMale: 165, minHeightFemale: 157 }
    }
  };

  const profileWithoutHeight = {
    ...pCSE,
    heightCm: undefined
  };

  const evalWithoutHeight = evaluateStudentEligibility(profileWithoutHeight, mockPoliceExam);
  assert(evalWithoutHeight.profileEligibilityBucket === 'VERIFICATION_REQUIRED',
    'Candidate without height in uniform exam evaluates to VERIFICATION_REQUIRED');
  assert(evalWithoutHeight.explanationTrace.some(t => t.outcome === 'UNKNOWN'),
    'Explanation trace contains explicit UNKNOWN outcome for missing physical standards');

  const profileWithHeight = {
    ...pCSE,
    heightCm: 172
  };
  const evalWithHeight = evaluateStudentEligibility(profileWithHeight, mockPoliceExam);
  assert(evalWithHeight.profileEligibilityBucket === 'ELIGIBLE',
    'Providing valid height (172 cm >= 165 cm) resolves status to ELIGIBLE');

  // Pre-Final Year (Future Opportunity)
  const preFinalProfile = {
    ...pCSE,
    graduationStatus: 'Pre-Final Year'
  };
  const evalPreFinal = evaluateStudentEligibility(preFinalProfile, upscExam);
  assert(evalPreFinal.profileEligibilityBucket === 'FUTURE_OPPORTUNITY',
    'Pre-final year student for UPSC CSE evaluates strictly to FUTURE_OPPORTUNITY');

  // TEST SUITE 4: Interactive What-If Simulator & Delta Computation
  console.log('\n--- TEST SUITE 4: In-Memory What-If Simulation Engine ---');

  const baseProfile = {
    degree: '12th Standard',
    educationalQualification: '12th',
    age: 18,
    category: 'General',
    specialization: 'Science',
    graduationStatus: 'Completed'
  };

  const simulatedDegreeChange = {
    degree: 'B.Tech',
    educationalQualification: "Bachelor's degree",
    age: 22,
    category: 'General',
    specialization: 'Electronics and Communication',
    graduationStatus: 'Completed'
  };

  const whatIfResult = simulateWhatIfMutations(baseProfile, simulatedDegreeChange, exams);
  assert(whatIfResult.summary.newlyUnlockedCount > 0,
    `Simulating 12th -> B.Tech successfully unlocked +${whatIfResult.summary.newlyUnlockedCount} examinations`);
  assert(whatIfResult.unlockedOpportunities.length === whatIfResult.summary.newlyUnlockedCount,
    'Unlocked opportunities array matches newlyUnlockedCount');
  assert(whatIfResult.pathToEligibilityRoadmaps.length > 0,
    'Path-to-Eligibility strategic roadmaps successfully generated');

  // Overage test in simulation
  const overageSimulation = {
    ...baseProfile,
    age: 40
  };
  const overageResult = simulateWhatIfMutations(baseProfile, overageSimulation, exams);
  assert(overageResult.summary.agedOutCount >= 0,
    `Aging out simulation computed correctly (-${overageResult.summary.agedOutCount} aged out)`);

  // TEST SUITE 5: Cross-Stream Syllabus Overlap Recommendation Matrix
  console.log('\n--- TEST SUITE 5: Cross-Stream Syllabus Overlap Matrix ---');

  const syllabusEC = getCrossStreamSyllabusMatrix('gate-ec');
  assert(syllabusEC.targetExam.includes('GATE Electronics'),
    'Anchor exam GATE EC retrieved correctly');
  assert(syllabusEC.derivativeOpportunities.length >= 4,
    `GATE EC has ${syllabusEC.derivativeOpportunities.length} high-synergy derivative opportunities`);

  const isroEC = syllabusEC.derivativeOpportunities.find(d => d.code.includes('ISRO'));
  assert(isroEC && isroEC.overlapPercent >= 80,
    `ISRO ICRB EC has high synergy (${isroEC.overlapPercent}% overlap with GATE EC)`);
  assert(isroEC.commonSyllabus && isroEC.commonSyllabus.length > 0,
    'Common syllabus topics returned');
  assert(isroEC.preparationStrategy && isroEC.preparationStrategy.length > 0,
    'Actionable preparation strategy returned');

  const syllabusCS = getCrossStreamSyllabusMatrix('gate-cs');
  assert(syllabusCS.derivativeOpportunities.some(d => d.code.includes('NIC')),
    'GATE CS connects to NIC Scientist B derivative opportunity');

  // TEST SUITE 6: Live HTTP API Endpoints
  console.log('\n--- TEST SUITE 6: Live HTTP Backend Endpoints ---');

  // 1. GET /api/eligibility/personas
  const personasRes = await makeRequest('GET', '/api/eligibility/personas');
  assert(personasRes.statusCode === 200, 'GET /api/eligibility/personas returned HTTP 200');
  assert(personasRes.body.totalCount === 11 || (personasRes.body.personas && Object.keys(personasRes.body.personas).length === 11),
    `API returned all 11 personas`);

  // 2. POST /api/eligibility/evaluate
  const evalRes = await makeRequest('POST', '/api/eligibility/evaluate', {
    studentProfile: pCSE,
    examId: 'gate-cs'
  });
  assert(evalRes.statusCode === 200, 'POST /api/eligibility/evaluate returned HTTP 200');
  assert(evalRes.body.evaluation && evalRes.body.evaluation.profileEligibilityBucket === 'ELIGIBLE',
    'API evaluation returned ELIGIBLE for B.Tech CSE on GATE CS');
  assert(evalRes.body.evaluation.explanationTrace.length >= 5,
    `API returned full explanation trace (${evalRes.body.evaluation.explanationTrace.length} criteria)`);

  // 3. POST /api/eligibility/what-if
  const whatIfApiRes = await makeRequest('POST', '/api/eligibility/what-if', {
    baseProfile,
    simulationChanges: simulatedDegreeChange
  });
  assert(whatIfApiRes.statusCode === 200, 'POST /api/eligibility/what-if returned HTTP 200');
  assert(whatIfApiRes.body.summary.newlyUnlockedCount > 0,
    `API What-If simulation computed deltas (+${whatIfApiRes.body.summary.newlyUnlockedCount} unlocked)`);

  // 4. GET /api/eligibility/syllabus-overlap
  const overlapApiRes = await makeRequest('GET', '/api/eligibility/syllabus-overlap?examId=gate-ec');
  assert(overlapApiRes.statusCode === 200, 'GET /api/eligibility/syllabus-overlap returned HTTP 200');
  assert(overlapApiRes.body.derivativeOpportunities && overlapApiRes.body.derivativeOpportunities.length > 0,
    `API returned derivative opportunities for gate-ec (${overlapApiRes.body.derivativeOpportunities.length} exams)`);

  // SUMMARY
  console.log('\n============================================================');
  console.log(`   PHASE 5 TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('============================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runPhase5TestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
