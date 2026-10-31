// server/services/gateScoreEngine.js
// Official GATE Score, Multi-Session Normalization, Two-Paper Validation,
// and Cross-Paper Syllabus Overlap Engine.
// All rank and admission projections are strictly marked as ESTIMATE.

const { TWO_PAPER_COMBINATIONS, GATE_PAPERS_LIST, buildFullPaperDossier } = require('../data/gateData');

/**
 * Official GATE Score Formula
 * 
 * S = Sq + (St - Sq) * (M - Mq) / (Mt - Mq)
 * where:
 *   S = GATE score
 *   M = Marks obtained (raw or normalized)
 *   Mq = Qualifying mark for General category (default: 25.0)
 *   Mt = Mean of marks of top 0.1% candidates (default: 90.0)
 *   Sq = 350 (Score assigned to Mq)
 *   St = 900 (Score assigned to Mt)
 * 
 * Boundary handling:
 *   - M <= 0: Score is 0
 *   - 0 < M < Mq: Scales proportionally (0 to 350)
 *   - M >= Mt: Scales up to 1000 at M = 100
 */
function calculateGateScore(marksInput, options = {}) {
  const marks = parseFloat(marksInput);
  if (isNaN(marks)) {
    throw new Error('Marks must be a valid numerical value');
  }

  const Mq = typeof options.qualifyingMarks === 'number' ? options.qualifyingMarks : 25.0;
  const Mt = typeof options.topMeanMarks === 'number' ? options.topMeanMarks : 90.0;
  const Sq = 350;
  const St = 900;

  // Boundary condition 1: Negative or Zero marks
  if (marks <= 0) {
    return {
      marks: Math.max(0, marks),
      rawMarks: marks,
      gateScore: 0,
      qualifyingStatus: 'NOT_QUALIFIED',
      qualifyingMarksGeneral: Mq,
      topMeanMarks: Mt,
      estimatedRankBand: '> 100,000 (Estimate)',
      label: 'ESTIMATE',
      explanation: 'Marks obtained are zero or negative after negative marking deductions. GATE score is 0.'
    };
  }

  // Boundary condition 2: Below Qualifying Marks (0 < M < Mq)
  if (marks < Mq) {
    // Scales linearly from 0 up to Sq (350)
    const score = Math.round((marks / Mq) * Sq);
    return {
      marks,
      rawMarks: marks,
      gateScore: score,
      qualifyingStatus: 'NOT_QUALIFIED',
      qualifyingMarksGeneral: Mq,
      topMeanMarks: Mt,
      estimatedRankBand: '35,000 - 80,000 (Estimate)',
      label: 'ESTIMATE',
      explanation: `Marks (${marks}) are below the General qualifying cutoff of ${Mq}. GATE score is scaled proportionally.`
    };
  }

  // Boundary condition 3: Between Qualifying Marks and Top 0.1% Mean (Mq <= M < Mt)
  if (marks <= Mt) {
    const rawScore = Sq + ((St - Sq) * (marks - Mq)) / (Mt - Mq);
    const score = Math.round(rawScore);
    const estRank = estimateRankFromScore(score);
    return {
      marks,
      rawMarks: marks,
      gateScore: score,
      qualifyingStatus: 'QUALIFIED',
      qualifyingMarksGeneral: Mq,
      topMeanMarks: Mt,
      estimatedRankBand: estRank,
      label: 'ESTIMATE',
      explanation: `Candidate has cleared the qualifying marks. Calculated using official GATE score formula.`
    };
  }

  // Boundary condition 4: Marks above Top Mean (Mt < M <= 100)
  // Linear extrapolation between Mt (900) and 100 marks (1000)
  const maxMarks = 100.0;
  const clampedMarks = Math.min(maxMarks, marks);
  const rawScore = St + ((1000 - St) * (clampedMarks - Mt)) / (maxMarks - Mt);
  const score = Math.min(1000, Math.round(rawScore));
  const estRank = estimateRankFromScore(score);

  return {
    marks: clampedMarks,
    rawMarks: marks,
    gateScore: score,
    qualifyingStatus: 'QUALIFIED',
    qualifyingMarksGeneral: Mq,
    topMeanMarks: Mt,
    estimatedRankBand: estRank,
    label: 'ESTIMATE',
    explanation: `Outstanding performance. Marks exceed top 0.1% mean. Score scaled to a maximum of 1000.`
  };
}

/**
 * Empirical Rank Estimation from GATE Score (Labelled ESTIMATE)
 */
function estimateRankFromScore(score) {
  if (score >= 950) return 'AIR 1 - 25 (Top Tier - PSU & IIT Direct Call)';
  if (score >= 900) return 'AIR 26 - 100 (Top IITs VLSI / CSE / Thermal)';
  if (score >= 800) return 'AIR 101 - 500 (Old IITs & Premier PSUs)';
  if (score >= 700) return 'AIR 501 - 1,500 (IITs / Top NITs)';
  if (score >= 600) return 'AIR 1,501 - 4,000 (NITs / IIITs / State Engg)';
  if (score >= 500) return 'AIR 4,001 - 9,000 (Newer NITs / Central Univ)';
  if (score >= 350) return 'AIR 9,001 - 25,000 (Qualified Category Band)';
  return '> 25,000';
}

/**
 * Official Multi-Session Normalization Formula
 * 
 * Mij_hat = ((Mtg - Mqg) / (Mti - Miq)) * (Mij - Miq) + Mqg
 */
function normalizeMultiSessionMarks(candidateMarks, sessionParams) {
  const {
    sessionTopMean,    // Mti
    sessionCutoffMean, // Miq
    globalTopMean,     // Mtg
    globalCutoffMean   // Mqg
  } = sessionParams;

  const numerator = globalTopMean - globalCutoffMean;
  const denominator = sessionTopMean - sessionCutoffMean;

  if (denominator === 0) {
    return candidateMarks;
  }

  const normalized = (numerator / denominator) * (candidateMarks - sessionCutoffMean) + globalCutoffMean;
  return parseFloat(normalized.toFixed(2));
}

/**
 * Two-Paper Combination Validator
 */
function validateTwoPaperCombination(primaryPaperCode, secondaryPaperCode) {
  const primary = (primaryPaperCode || '').toUpperCase().trim();
  const secondary = (secondaryPaperCode || '').toUpperCase().trim();

  const primaryObj = GATE_PAPERS_LIST.find(p => p.code === primary);
  const secondaryObj = GATE_PAPERS_LIST.find(p => p.code === secondary);

  if (!primaryObj) {
    return {
      isValid: false,
      reason: `Primary paper code "${primary}" is not an official GATE examination paper.`
    };
  }

  if (!secondaryObj) {
    return {
      isValid: false,
      reason: `Secondary paper code "${secondary}" is not an official GATE examination paper.`
    };
  }

  if (primary === secondary) {
    return {
      isValid: false,
      reason: 'Primary and secondary paper cannot be the same examination code.'
    };
  }

  const allowedSecondaries = TWO_PAPER_COMBINATIONS[primary] || [];
  const isValidCombination = allowedSecondaries.includes(secondary);

  return {
    isValid: isValidCombination,
    primaryPaper: primaryObj,
    secondaryPaper: secondaryObj,
    allowedSecondaries,
    reason: isValidCombination
      ? `Valid combination approved by the GATE Organizing Institute.`
      : `Disallowed combination: The GATE Organizing Committee does not permit ${secondary} as a secondary paper with ${primary}. Allowed secondaries: ${allowedSecondaries.join(', ')}.`
  };
}

/**
 * Cross-Paper Syllabus Overlap Analyzer
 */
function analyzeSyllabusOverlap(paper1, paper2) {
  const p1 = (paper1 || '').toUpperCase().trim();
  const p2 = (paper2 || '').toUpperCase().trim();

  // Curated overlap matrices for popular pairs
  const CURATED_OVERLAPS = {
    'EC-EE': {
      sharedPercentage: 62,
      commonSubjects: [
        'Engineering Mathematics (Calculus, Linear Algebra, Differential Equations)',
        'General Aptitude (Verbal & Numerical Ability)',
        'Network Theory / Circuit Analysis (KCL, KVL, Network Theorems, Transients)',
        'Signals and Systems (Fourier, Laplace, z-Transform, LTI Systems)',
        'Control Systems (Time Domain, Frequency Domain, Bode, Nyquist, State Space)',
        'Analog Electronics (Op-Amps, Diodes, BJT & MOSFET Biasing)'
      ],
      divergentSubjectsP1: ['Communications (Digital & Random Signals)', 'Electromagnetics (Waveguides, Antennas)', 'Electronic Devices (Semiconductor Physics)'],
      divergentSubjectsP2: ['Electrical Machines (Transformers, Induction, Synchronous)', 'Power Systems (Transmission, Faults, Protection)', 'Power Electronics (Converters, Inverters, Choppers)'],
      preparationStrategy: 'Excellent synergy. Completing Math, Networks, Signals, and Controls covers over 60% of both syllabi simultaneously.'
    },
    'EC-IN': {
      sharedPercentage: 70,
      commonSubjects: [
        'Engineering Mathematics & General Aptitude',
        'Network Theory',
        'Signals and Systems',
        'Analog and Digital Electronics',
        'Control Systems'
      ],
      divergentSubjectsP1: ['Communications', 'Electromagnetics & Antennas', 'Semiconductor EDC'],
      divergentSubjectsP2: ['Sensors and Industrial Instrumentation', 'Optical Instrumentation', 'Measurements & Bridges'],
      preparationStrategy: 'Highest synergy dual combination for EC students. Around 70% of subjects are directly transferable.'
    },
    'CS-DA': {
      sharedPercentage: 65,
      commonSubjects: [
        'Linear Algebra (Matrices, Eigenvalues, SVD)',
        'Probability and Statistics (Distributions, Bayes Theorem)',
        'Calculus & Optimization',
        'Programming & Data Structures (Python/C, Stacks, Queues, Trees)',
        'Algorithms (Sorting, Searching, Graphs)',
        'Database Management Systems (SQL, Relational Model, Indexing)'
      ],
      divergentSubjectsP1: ['Theory of Computation (Automata, Turing Machines)', 'Compiler Design', 'Operating Systems', 'Computer Networks', 'Computer Architecture'],
      divergentSubjectsP2: ['Machine Learning (Supervised/Unsupervised, SVM, Trees)', 'Artificial Intelligence (Search, Heuristics)', 'Data Warehousing'],
      preparationStrategy: 'Ideal combination for software and AI aspirants. Strong mathematical and algorithmic common foundation.'
    },
    'ME-XE': {
      sharedPercentage: 75,
      commonSubjects: [
        'Engineering Mathematics (XE-A)',
        'Fluid Mechanics (XE-B matches ME Fluid Mechanics)',
        'Solid Mechanics (XE-D matches ME Strength of Materials)',
        'Thermodynamics (XE-E matches ME Basic Thermodynamics)'
      ],
      divergentSubjectsP1: ['Manufacturing Engineering', 'Machine Design', 'Theory of Machines', 'Industrial Engineering'],
      divergentSubjectsP2: ['Polymer Science', 'Food Technology (if chosen)'],
      preparationStrategy: 'Selecting XE with Fluid Mechanics (XE-B) and Thermodynamics (XE-E) yields near-total syllabus overlap with Mechanical Core.'
    }
  };

  const key = `${p1}-${p2}`;
  const reverseKey = `${p2}-${p1}`;
  const match = CURATED_OVERLAPS[key] || CURATED_OVERLAPS[reverseKey];

  if (match) {
    return {
      paper1: p1,
      paper2: p2,
      ...match
    };
  }

  // Fallback heuristic estimation
  return {
    paper1: p1,
    paper2: p2,
    sharedPercentage: 25,
    commonSubjects: ['General Aptitude (15 Marks)', 'Engineering Mathematics (where applicable)'],
    divergentSubjectsP1: [`Discipline-specific subjects of ${p1}`],
    divergentSubjectsP2: [`Discipline-specific subjects of ${p2}`],
    preparationStrategy: 'Moderate overlap primarily anchored in General Aptitude and basic mathematical fundamentals.'
  };
}

module.exports = {
  calculateGateScore,
  estimateRankFromScore,
  normalizeMultiSessionMarks,
  validateTwoPaperCombination,
  analyzeSyllabusOverlap
};
