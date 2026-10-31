// server/services/whatIfSimulatorEngine.js
// Interactive "What-If" & Path-to-Eligibility Simulator Engine
// Cross-Stream Syllabus Overlap Recommendation Matrix
// Evaluates hypothetical mutations in-memory without mutating saved student records.

const { evaluateStudentEligibility, batchEvaluateExaminations } = require('./deterministicEligibilityEngine');

// Precomputed High-Synergy Examination Clusters
const CROSS_STREAM_SYLLABUS_MATRIX = {
  'gate-ec': {
    targetExam: 'GATE Electronics & Communication (EC)',
    coreDiscipline: 'Electronics Engineering',
    derivativeOpportunities: [
      {
        examId: 'isro-icrb-ec',
        code: 'ISRO ICRB (Scientist/Engineer SC)',
        conductingBody: 'Indian Space Research Organisation',
        overlapPercent: 88,
        commonSyllabus: ['Digital Circuits', 'Analog Circuits', 'Signals & Systems', 'Electromagnetics & Antennas', 'Communications', 'Engineering Mathematics'],
        divergentSyllabus: ['Spacecraft Telemetry basics'],
        preparationStrategy: 'Appearing for GATE EC provides near-complete preparation for ISRO Scientist/Engineer written exam.'
      },
      {
        examId: 'barc-oces-ec',
        code: 'BARC OCES / DGFS (Scientific Officer)',
        conductingBody: 'Bhabha Atomic Research Centre',
        overlapPercent: 92,
        commonSyllabus: ['Complete GATE EC Syllabus (Written exam follows identical GATE pattern)'],
        divergentSyllabus: ['Nuclear Instrumentation interview concepts'],
        preparationStrategy: 'BARC directly shortlists via GATE score or holds an identical CBT screen.'
      },
      {
        examId: 'drdo-rac-ec',
        code: 'DRDO Scientist B (RAC)',
        conductingBody: 'Defence Research & Development Organisation',
        overlapPercent: 95,
        commonSyllabus: ['Complete GATE EC Syllabus (Direct shortlisting via GATE Score)'],
        divergentSyllabus: ['Specialized interview viva in radar/avionics'],
        preparationStrategy: 'Purely GATE score based shortlisting for Stage 1.'
      },
      {
        examId: 'upsc-ese-et',
        code: 'UPSC ESE (Electronics & Telecom)',
        conductingBody: 'Union Public Service Commission',
        overlapPercent: 78,
        commonSyllabus: ['Network Theory', 'Analog & Digital', 'Signals', 'Control Systems', 'Communications', 'EDC'],
        divergentSyllabus: ['General Studies Paper 1 (Ethics, Environment, Project Management)', 'Conventional Descriptive Papers'],
        preparationStrategy: 'Strong overlap in technical paper. Requires additional preparation in GS and written speed.'
      },
      {
        examId: 'bel-pe-ec',
        code: 'BEL Probationary Engineer',
        conductingBody: 'Bharat Electronics Limited',
        overlapPercent: 85,
        commonSyllabus: ['Electronic Devices', 'Microprocessors & Microcontrollers', 'Digital Electronics', 'Radar & Microwave'],
        divergentSyllabus: ['Basic General Aptitude section'],
        preparationStrategy: 'Written test is fully aligned with standard GATE EC curriculum.'
      }
    ]
  },

  'gate-cs': {
    targetExam: 'GATE Computer Science (CS)',
    coreDiscipline: 'Computer Science & Engineering',
    derivativeOpportunities: [
      {
        examId: 'nic-scientist-b',
        code: 'NIC Scientist B / Scientific Officer',
        conductingBody: 'National Informatics Centre (NIELIT)',
        overlapPercent: 90,
        commonSyllabus: ['Algorithms', 'Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Theory of Computation', 'Digital Logic'],
        divergentSyllabus: ['Cyber Laws / IT Act', 'Web Technologies basics'],
        preparationStrategy: 'Over 90% technical match with GATE CS syllabus.'
      },
      {
        examId: 'isro-icrb-cs',
        code: 'ISRO ICRB (Scientist SC - CS)',
        conductingBody: 'Indian Space Research Organisation',
        overlapPercent: 88,
        commonSyllabus: ['Algorithms', 'Compiler Design', 'COA', 'OS', 'Networks', 'Engg Mathematics'],
        divergentSyllabus: ['Real-time embedded software questions'],
        preparationStrategy: 'Practicing past GATE CS questions covers standard ISRO written format.'
      },
      {
        examId: 'gate-da',
        code: 'GATE Data Science & AI (DA)',
        conductingBody: 'GATE Organizing Institute',
        overlapPercent: 65,
        commonSyllabus: ['Linear Algebra', 'Probability & Statistics', 'Python Programming & DSA', 'DBMS'],
        divergentSyllabus: ['Machine Learning', 'Artificial Intelligence', 'Data Warehousing'],
        preparationStrategy: 'Natural secondary paper choice. 65% common foundation.'
      }
    ]
  },

  'upsc-cse': {
    targetExam: 'UPSC Civil Services Examination (CSE)',
    coreDiscipline: 'Administrative & General Studies',
    derivativeOpportunities: [
      {
        examId: 'appsc-group-1',
        code: 'APPSC Group 1 / State Civil Services',
        conductingBody: 'State Public Service Commission',
        overlapPercent: 82,
        commonSyllabus: ['Indian Polity', 'Modern History', 'Economy', 'Geography', 'Environment', 'CSAT/Aptitude'],
        divergentSyllabus: ['State History, Culture & Regional Economy'],
        preparationStrategy: 'Prepping for UPSC CSE provides 80%+ base for State Public Service Commission Group 1 cadres.'
      },
      {
        examId: 'epfo-eo-ao',
        code: 'UPSC EPFO (Enforcement Officer / AO)',
        conductingBody: 'Union Public Service Commission',
        overlapPercent: 75,
        commonSyllabus: ['Indian Freedom Movement', 'Indian Polity & Economy', 'General Accounting Principles', 'General Mental Ability'],
        divergentSyllabus: ['Industrial Relations & Labour Laws', 'Social Security in India'],
        preparationStrategy: 'Strong overlap in general studies; requires targeted study of labour codes.'
      },
      {
        examId: 'capf-ac',
        code: 'UPSC CAPF (Assistant Commandants)',
        conductingBody: 'Union Public Service Commission',
        overlapPercent: 80,
        commonSyllabus: ['General Studies Paper 1 (Polity, History, Science, Geography)', 'Essay & Comprehension'],
        divergentSyllabus: ['Physical Efficiency Test (PET)'],
        preparationStrategy: 'Academic written syllabus is largely a subset of UPSC CSE Prelims and Mains Paper 2.'
      }
    ]
  }
};

/**
 * Execute What-If Simulation
 * 
 * Compares student baseline eligibility against simulated hypothetical parameters.
 */
function runWhatIfSimulation(baselineProfile, simulationChanges = {}, allExaminations = []) {
  const profile = baselineProfile || {};

  // Construct simulated hypothetical profile
  const simulatedProfile = {
    ...profile,
    ...simulationChanges
  };

  // If a simulated future reference date is given, apply age projection
  if (simulationChanges.simulatedReferenceDate) {
    simulatedProfile.customReferenceDate = simulationChanges.simulatedReferenceDate;
  }

  // Evaluate baseline
  const baselineResults = batchEvaluateExaminations(profile, allExaminations);
  // Evaluate simulated
  const simulatedResults = batchEvaluateExaminations(simulatedProfile, allExaminations);

  const baselineMap = new Map(baselineResults.map(r => [r.examId, r]));
  const simulatedMap = new Map(simulatedResults.map(r => [r.examId, r]));

  const newlyUnlockedExams = [];
  const agedOutExams = [];
  const retainedEligibleExams = [];

  allExaminations.forEach(exam => {
    const base = baselineMap.get(exam.id);
    const sim = simulatedMap.get(exam.id);

    const wasEligible = base && base.profileEligibilityBucket === 'ELIGIBLE';
    const isNowEligible = sim && sim.profileEligibilityBucket === 'ELIGIBLE';

    if (!wasEligible && isNowEligible) {
      newlyUnlockedExams.push({
        examId: exam.id,
        code: exam.code,
        title: exam.title,
        conductingBody: exam.conductingBody,
        category: exam.category,
        unlockReason: sim.overallReason,
        explanationTrace: sim.explanationTrace
      });
    } else if (wasEligible && !isNowEligible) {
      agedOutExams.push({
        examId: exam.id,
        code: exam.code,
        title: exam.title,
        conductingBody: exam.conductingBody,
        disqualificationReason: sim.overallReason,
        explanationTrace: sim.explanationTrace
      });
    } else if (wasEligible && isNowEligible) {
      retainedEligibleExams.push({
        examId: exam.id,
        code: exam.code,
        title: exam.title
      });
    }
  });

  // Synthesize customized Path-to-Eligibility roadmap
  const pathRoadmap = generatePathToEligibility(profile, simulatedProfile, newlyUnlockedExams);

  return {
    baselineSummary: {
      totalEvaluated: allExaminations.length,
      eligibleCount: baselineResults.filter(r => r.profileEligibilityBucket === 'ELIGIBLE').length,
      verificationRequiredCount: baselineResults.filter(r => r.profileEligibilityBucket === 'VERIFICATION_REQUIRED').length,
      futureOpportunityCount: baselineResults.filter(r => r.profileEligibilityBucket === 'FUTURE_OPPORTUNITY').length,
      notEligibleCount: baselineResults.filter(r => r.profileEligibilityBucket === 'NOT_ELIGIBLE').length
    },
    simulatedSummary: {
      totalEvaluated: allExaminations.length,
      eligibleCount: simulatedResults.filter(r => r.profileEligibilityBucket === 'ELIGIBLE').length,
      verificationRequiredCount: simulatedResults.filter(r => r.profileEligibilityBucket === 'VERIFICATION_REQUIRED').length,
      futureOpportunityCount: simulatedResults.filter(r => r.profileEligibilityBucket === 'FUTURE_OPPORTUNITY').length,
      notEligibleCount: simulatedResults.filter(r => r.profileEligibilityBucket === 'NOT_ELIGIBLE').length
    },
    delta: {
      unlockedCount: newlyUnlockedExams.length,
      agedOutCount: agedOutExams.length,
      netChange: newlyUnlockedExams.length - agedOutExams.length
    },
    summary: {
      newlyUnlockedCount: newlyUnlockedExams.length,
      agedOutCount: agedOutExams.length,
      simulatedEligibleCount: simulatedResults.filter(r => r.profileEligibilityBucket === 'ELIGIBLE').length
    },
    unlockedOpportunities: newlyUnlockedExams,
    agedOutOpportunities: agedOutExams,
    pathToEligibilityRoadmaps: pathRoadmap,
    newlyUnlockedExams,
    agedOutExams,
    pathRoadmap,
    appliedSimulationParameters: simulationChanges
  };
}

/**
 * Generate Path-to-Eligibility Roadmap
 */
function generatePathToEligibility(baseProfile, simProfile, unlockedExams) {
  const steps = [];

  if (simProfile.degree && simProfile.degree !== baseProfile.degree) {
    steps.push({
      milestone: `Complete Requisite Degree: ${simProfile.degree}`,
      timeline: 'Target Degree Completion',
      impact: `Unlocks technical graduate cadres in central and state departments.`,
      actionableAdvice: `Ensure maintaining aggregate percentage >= 60% with zero standing backlogs at graduation.`
    });
  }

  if (simProfile.graduationStatus === 'Completed' && baseProfile.graduationStatus !== 'Completed') {
    steps.push({
      milestone: 'Formal Degree Award / Provisional Certificate',
      timeline: 'Final Semester',
      impact: 'Removes "Appearing" restrictions for PSUs and immediate-appointment posts.',
      actionableAdvice: 'Obtain university provisional degree certificate and consolidated mark sheet promptly.'
    });
  }

  if (unlockedExams.length > 0) {
    steps.push({
      milestone: 'Target Gateway Preparation',
      timeline: '6 - 12 Months',
      impact: `Unlocks ${unlockedExams.length} newly qualified examinations including ${unlockedExams.slice(0, 3).map(e => e.code).join(', ')}.`,
      actionableAdvice: 'Focus on common core subjects identified in the cross-stream syllabus overlap matrix.'
    });
  }

  return steps;
}

/**
 * Get Cross-Stream Syllabus Overlap Analysis
 */
function getCrossStreamOverlap(examId) {
  const normalizedId = (examId || '').toLowerCase().trim();
  const found = CROSS_STREAM_SYLLABUS_MATRIX[normalizedId];
  if (found) {
    return found;
  }

  // Fallback for generic exams
  return {
    targetExam: examId,
    coreDiscipline: 'General Examination',
    derivativeOpportunities: [
      {
        examId: 'ssc-cgl',
        code: 'SSC CGL',
        conductingBody: 'Staff Selection Commission',
        overlapPercent: 65,
        commonSyllabus: ['Quantitative Aptitude', 'Reasoning & General Intelligence', 'English Comprehension', 'General Awareness'],
        divergentSyllabus: ['Post-specific statistical and financial papers'],
        preparationStrategy: 'Practicing general aptitude covers 65% of national administrative recruitments.'
      }
    ]
  };
}

module.exports = {
  CROSS_STREAM_SYLLABUS_MATRIX,
  runWhatIfSimulation,
  getCrossStreamOverlap,
  simulateWhatIfMutations: runWhatIfSimulation,
  getCrossStreamSyllabusMatrix: getCrossStreamOverlap,
  generatePathToEligibility
};
