// server/services/deterministicEligibilityEngine.js
// Pure Deterministic Three-Valued Logic Eligibility Engine
// Logic Outcomes: TRUE, FALSE, UNKNOWN (Never uses an LLM to guess)
// Generates granular Step-by-Step Explanation Traces and assigns 6-Bucket Opportunity Classification.

const { evaluateNoticeLifecycle } = require('./istLifecycleEngine');

// Education Hierarchy Weights
const EDUCATION_LEVEL_WEIGHTS = {
  '10th': 1,
  '10th standard': 1,
  'matriculation': 1,
  '12th': 2,
  '12th standard': 2,
  'intermediate': 2,
  '10+2': 2,
  'diploma': 3,
  'polytechnic': 3,
  '3-year diploma': 3,
  "bachelor's degree": 4,
  'bachelor degree': 4,
  'bachelors': 4,
  'graduate': 4,
  'graduation': 4,
  'b.tech': 4,
  'b.e': 4,
  'b.sc': 4,
  'b.com': 4,
  'b.a': 4,
  'bba': 4,
  'bca': 4,
  'llb': 4,
  'mbbs': 4,
  "master's degree": 5,
  'post graduate': 5,
  'postgraduation': 5,
  'm.tech': 5,
  'm.e': 5,
  'm.sc': 5,
  'm.com': 5,
  'm.a': 5,
  'mca': 5,
  'llm': 5,
  'mba': 5,
  'doctorate': 6,
  'phd': 6
};

// Canonical Branch Equivalency Groups
const BRANCH_EQUIVALENCY = {
  ECE: [
    'electronics', 'electronics and communication', 'electronics & communication',
    'electronics & telecommunication', 'electronics and telecommunication',
    'telecommunication', 'ece', 'electronics & instrumentation', 'applied electronics'
  ],
  CSE: [
    'computer science', 'computer science and engineering', 'computer science & engineering',
    'information technology', 'software engineering', 'cse', 'it', 'computer applications', 'mca'
  ],
  DA: [
    'data science', 'artificial intelligence', 'ai & ds', 'machine learning',
    'data analytics', 'computer science', 'statistics', 'mathematics', 'cse'
  ],
  EEE: [
    'electrical', 'electrical engineering', 'electrical and electronics',
    'electrical & electronics', 'eee', 'power engineering', 'power systems'
  ],
  ME: [
    'mechanical', 'mechanical engineering', 'production engineering',
    'industrial engineering', 'automobile engineering', 'me', 'manufacturing'
  ],
  CE: [
    'civil', 'civil engineering', 'structural engineering', 'construction technology', 'ce'
  ],
  COMMERCE: [
    'b.com', 'commerce', 'finance', 'accounting', 'bba finance', 'chartered accountancy', 'cost accounting'
  ],
  ARTS: [
    'b.a', 'arts', 'humanities', 'political science', 'history', 'sociology',
    'economics', 'public administration', 'psychology', 'geography'
  ],
  SCIENCE: [
    'b.sc', 'm.sc', 'physics', 'chemistry', 'mathematics', 'biology',
    'biotechnology', 'zoology', 'botany', 'microbiology', 'biochemistry'
  ]
};

/**
 * Normalizes input string for comparison
 */
function normalizeString(str) {
  return (str || '').toString().toLowerCase().trim();
}

/**
 * Calculates exact age in years, months, and days as on a reference date
 */
function calculateExactAge(dobInput, referenceDateInput) {
  if (!dobInput) return null;
  const dob = new Date(dobInput);
  if (isNaN(dob.getTime())) return null;

  const refDate = referenceDateInput ? new Date(referenceDateInput) : new Date('2026-08-01');

  let years = refDate.getFullYear() - dob.getFullYear();
  let months = refDate.getMonth() - dob.getMonth();
  let days = refDate.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(refDate.getFullYear(), refDate.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const decimalAge = parseFloat((years + months / 12 + days / 365.25).toFixed(2));
  return {
    years,
    months,
    days,
    decimalAge,
    formatted: `${years} yrs, ${months} mos, ${days} days`
  };
}

/**
 * Get statutory age relaxation for a candidate category
 */
function getStatutoryAgeRelaxation(category, isPwD = false, isExServicemen = false) {
  const cat = (category || 'General').toUpperCase().replace(/[^A-Z]/g, '');

  let relaxation = 0;
  let categoryLabel = 'General (UR) - No statutory age relaxation';

  if (cat.includes('OBC')) {
    relaxation = 3;
    categoryLabel = 'OBC-NCL: +3 Years relaxation under DoPT OM No. 43013/2/95';
  } else if (cat.includes('SC') || cat.includes('ST')) {
    relaxation = 5;
    categoryLabel = 'SC/ST: +5 Years relaxation under statutory reservation provisions';
  } else if (cat.includes('EWS')) {
    relaxation = 0;
    categoryLabel = 'EWS: Economic reservation applies to cutoffs; standard age limit applies';
  }

  // Cumulative PwBD relaxation
  if (isPwD) {
    if (cat.includes('SC') || cat.includes('ST')) {
      relaxation = Math.max(relaxation, 15);
      categoryLabel += ' + PwBD (Total +15 Years)';
    } else if (cat.includes('OBC')) {
      relaxation = Math.max(relaxation, 13);
      categoryLabel += ' + PwBD (Total +13 Years)';
    } else {
      relaxation = Math.max(relaxation, 10);
      categoryLabel += ' + PwBD (Total +10 Years)';
    }
  }

  if (isExServicemen) {
    relaxation += 5;
    categoryLabel += ' + Ex-Servicemen (+5 Years)';
  }

  return { relaxationYears: relaxation, label: categoryLabel };
}

function containsKeyword(text, keyword) {
  if (!text || !keyword) return false;
  const kw = keyword.toLowerCase().trim();
  const tx = text.toLowerCase();
  if (kw.length <= 3) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
    return regex.test(tx);
  }
  return tx.includes(kw);
}

function getRequiredEducationWeight(inputStr) {
  if (!inputStr) return 4;
  const s = normalizeString(inputStr);
  if (s.includes('10th') || s.includes('matric') || s.includes('secondary')) return 1;
  if (s.includes('12th') || s.includes('intermediate') || s.includes('10+2') || s.includes('higher secondary') || s.includes('hsc')) return 2;
  if (s.includes('diploma') || s.includes('polytechnic')) return 3;
  if (s.includes('bachelor') || s.includes('degree') || s.includes('graduate') || s.includes('graduation') || s.includes('b.tech') || s.includes('b.e') || s.includes('b.sc') || s.includes('b.com') || s.includes('b.a') || s.includes('llb') || s.includes('mbbs')) return 4;
  if (s.includes('master') || s.includes('postgraduate') || s.includes('post graduate') || s.includes('m.tech') || s.includes('m.sc') || s.includes('mca') || s.includes('mba') || s.includes('m.com') || s.includes('m.a')) return 5;
  if (s.includes('phd') || s.includes('doctor')) return 6;
  return 4;
}

function getCandidateEducationWeight(qualStr, degreeStr) {
  const combined = `${normalizeString(qualStr)} ${normalizeString(degreeStr)}`;
  if (combined.includes('phd') || combined.includes('doctor')) return 6;
  if (combined.includes('master') || combined.includes('postgraduate') || combined.includes('post graduate') || combined.includes('m.tech') || combined.includes('m.sc') || combined.includes('mca') || combined.includes('mba') || combined.includes('m.com') || combined.includes('m.a')) return 5;
  if (combined.includes('bachelor') || combined.includes('graduate') || combined.includes('graduation') || combined.includes('degree') || combined.includes('b.tech') || combined.includes('b.e') || combined.includes('b.sc') || combined.includes('b.com') || combined.includes('b.a') || combined.includes('bba') || combined.includes('bca') || combined.includes('llb') || combined.includes('mbbs')) return 4;
  if (combined.includes('diploma') || combined.includes('polytechnic')) return 3;
  if (combined.includes('12') || combined.includes('intermediate') || combined.includes('10+2') || combined.includes('higher secondary') || combined.includes('hsc')) return 2;
  if (combined.includes('10') || combined.includes('matric') || combined.includes('secondary')) return 1;
  return 4;
}

/**
 * Evaluates candidate degree against exam requirements
 */
function evaluateDegreeAndBranch(profile, exam) {
  const candQual = normalizeString(profile.educationalQualification);
  const candDegree = normalizeString(profile.degree);
  const candBranch = normalizeString(profile.specialization);

  // If candidate has not entered qualification
  if (!candQual && !candDegree) {
    return {
      outcome: 'UNKNOWN',
      criterion: 'Education Level & Degree Equivalency',
      studentValue: 'Not provided in profile',
      requiredValue: exam.eligibility?.minQualification || 'Bachelor Degree',
      statutoryReference: `${exam.code} Gazette Eligibility Clause`,
      reason: 'Educational qualification is missing from student profile. Verification required.'
    };
  }

  const reqWeight = getRequiredEducationWeight(exam.eligibility?.minQualification);
  const candWeight = getCandidateEducationWeight(profile.educationalQualification, profile.degree);

  // Level check
  if (candWeight < reqWeight) {
    return {
      outcome: 'FALSE',
      criterion: 'Education Level & Degree Equivalency',
      studentValue: profile.degree || profile.educationalQualification || 'Undergraduate',
      requiredValue: exam.eligibility?.minQualification || 'Graduate',
      statutoryReference: `${exam.code} Minimum Educational Qualification`,
      reason: `Exam requires minimum ${exam.eligibility?.minQualification || 'Graduate'}, but candidate possesses ${profile.degree || profile.educationalQualification}.`
    };
  }

  // Branch check if exam specifies allowed degrees or technical branches
  const allowed = exam.eligibility?.allowedDegrees || [];
  if (allowed.length > 0 && !allowed.some(a => normalizeString(a).includes('any') || normalizeString(a).includes('all'))) {
    const allowedText = allowed.join(' ').toLowerCase();

    // Check branch match
    let branchMatched = false;
    for (const [canonical, aliases] of Object.entries(BRANCH_EQUIVALENCY)) {
      const studentMatchesCanonical = aliases.some(al => containsKeyword(candBranch, al) || containsKeyword(candDegree, al));
      const examAcceptsCanonical = aliases.some(al => containsKeyword(allowedText, al));

      if (studentMatchesCanonical && examAcceptsCanonical) {
        branchMatched = true;
        break;
      }
    }

    if (!branchMatched && candBranch) {
      // Check direct keyword match
      const directMatch = allowed.some(a => containsKeyword(a, candBranch) || containsKeyword(candDegree, a));
      if (!directMatch) {
        return {
          outcome: 'FALSE',
          criterion: 'Discipline / Branch Specialization',
          studentValue: `${profile.degree} in ${profile.specialization}`,
          requiredValue: allowed.slice(0, 3).join(', '),
          statutoryReference: `${exam.code} Educational Branch Regulations`,
          reason: `Exam discipline requires [${allowed.slice(0, 2).join(', ')}]. Candidate has specialization in ${profile.specialization}.`
        };
      }
    }
  }

  return {
    outcome: 'TRUE',
    criterion: 'Education Level & Degree Equivalency',
    studentValue: `${profile.degree || profile.educationalQualification || 'Graduate'}${profile.specialization ? ' (' + profile.specialization + ')' : ''}`,
    requiredValue: exam.eligibility?.minQualification || 'Graduate',
    statutoryReference: `${exam.code} Educational Regulations`,
    reason: `Candidate's educational background satisfies or exceeds statutory requirement.`
  };
}

/**
 * Evaluates graduation status & final-year appearing allowance
 */
function evaluateGraduationStatus(profile, exam) {
  const status = (profile.graduationStatus || '').toLowerCase();
  const allowsFinalYear = exam.eligibility?.finalYearEligible !== false;

  if (!status) {
    return {
      outcome: 'UNKNOWN',
      criterion: 'Graduation Status & Appearing Clause',
      studentValue: 'Not specified',
      requiredValue: 'Completed or Final-Year appearing',
      statutoryReference: `${exam.code} Candidature Clause`,
      reason: 'Graduation status is not declared in student profile.'
    };
  }

  if (status === 'completed') {
    return {
      outcome: 'TRUE',
      criterion: 'Graduation Status & Appearing Clause',
      studentValue: 'Degree Completed',
      requiredValue: 'Completed / Appearing',
      statutoryReference: `${exam.code} Candidature Clause`,
      reason: 'Candidate has completed the requisite qualifying degree.'
    };
  }

  // Pre-final year students (e.g. 2nd or 3rd year in 4-year degree)
  if (status.includes('pre-final') || status.includes('pre final') || status.includes('2nd year') || status.includes('3rd year')) {
    // GATE allows pre-final year (3rd year)
    if (exam.code && exam.code.includes('GATE')) {
      return {
        outcome: 'TRUE',
        criterion: 'Graduation Status (Pre-Final Year)',
        studentValue: '3rd Year / Pre-Final Year',
        requiredValue: '3rd year or higher permitted',
        statutoryReference: 'GATE Information Brochure Clause 4.1',
        reason: 'GATE explicitly permits pre-final year (3rd year B.Tech) students to sit for the exam.'
      };
    }

    return {
      outcome: 'FALSE',
      isFutureOpportunity: true,
      criterion: 'Graduation Status (Pre-Final Year)',
      studentValue: 'Pre-final Year',
      requiredValue: 'Completed or Final-year appearing',
      statutoryReference: `${exam.code} Academic Progression Clause`,
      reason: 'Candidate will become eligible upon entering final year or completing degree.'
    };
  }

  if (status.includes('final') || status.includes('appearing') || status.includes('pursuing')) {
    if (allowsFinalYear) {
      return {
        outcome: 'TRUE',
        criterion: 'Graduation Status & Appearing Clause',
        studentValue: 'Final Year / Appearing Candidate',
        requiredValue: 'Final year students permitted to appear',
        statutoryReference: `${exam.code} Gazette Appearing Clause`,
        reason: 'Statutory rules permit final-year appearing candidates subject to producing degree at verification.'
      };
    }
    return {
      outcome: 'FALSE',
      criterion: 'Graduation Status & Appearing Clause',
      studentValue: 'Appearing / Not Completed',
      requiredValue: 'Degree must be completed prior to application close',
      statutoryReference: `${exam.code} Mandatory Degree Submission`,
      reason: 'Candidate must have completed degree before application cut-off date.'
    };
  }

  return {
    outcome: 'TRUE',
    criterion: 'Graduation Status',
    studentValue: profile.graduationStatus,
    requiredValue: 'Graduate',
    statutoryReference: `${exam.code} Candidature Regulations`,
    reason: 'Graduation status verified.'
  };
}

/**
 * Evaluates Exact Age as on crucial cut-off date with official category relaxations
 */
function evaluateAgeCriteria(profile, exam) {
  const minAge = exam.eligibility?.minAge;
  const maxAge = exam.eligibility?.maxAge;

  // If exam has no age restriction (e.g., GATE)
  if (!minAge && !maxAge) {
    return {
      outcome: 'TRUE',
      criterion: 'Age Requirement',
      studentValue: profile.dateOfBirth ? `${profile.dateOfBirth}` : 'Any Age',
      requiredValue: 'No Age Limit',
      statutoryReference: `${exam.code} Information Brochure`,
      reason: 'There is no statutory minimum or upper age restriction for this examination.'
    };
  }

  if (!profile.dateOfBirth) {
    return {
      outcome: 'UNKNOWN',
      criterion: 'Exact Age as on Crucial Cut-Off Date',
      studentValue: 'Date of Birth Missing',
      requiredValue: `${minAge || 18} to ${maxAge || 'No limit'} years`,
      statutoryReference: `${exam.code} Age Notification Rule`,
      reason: 'Candidate Date of Birth is missing from profile. Verification required.'
    };
  }

  const refDate = exam.calendar?.applicationStart || exam.importantDates?.applicationStart || '2026-08-01';
  const ageObj = calculateExactAge(profile.dateOfBirth, refDate);
  if (!ageObj) {
    return {
      outcome: 'UNKNOWN',
      criterion: 'Exact Age as on Crucial Cut-Off Date',
      studentValue: 'Invalid Date of Birth format',
      requiredValue: `${minAge || 18} to ${maxAge || 'No limit'} years`,
      statutoryReference: `${exam.code} Age Notification Rule`,
      reason: 'Invalid Date of Birth format in profile.'
    };
  }

  const { relaxationYears, label: relaxationLabel } = getStatutoryAgeRelaxation(
    profile.category,
    profile.isPwD,
    profile.isExServicemen
  );

  const effectiveMaxAge = maxAge ? maxAge + relaxationYears : 99;
  const effectiveMinAge = minAge || 18;

  // Below minimum age check
  if (ageObj.decimalAge < effectiveMinAge) {
    return {
      outcome: 'FALSE',
      isFutureOpportunity: true,
      criterion: 'Minimum Age Requirement',
      studentValue: `${ageObj.formatted} (${ageObj.decimalAge} yrs)`,
      requiredValue: `Minimum ${effectiveMinAge} years on ${refDate}`,
      statutoryReference: `${exam.code} Age Regulations`,
      reason: `Candidate is currently ${ageObj.formatted}. Will become eligible upon attaining ${effectiveMinAge} years.`
    };
  }

  // Above maximum age check
  if (ageObj.decimalAge > effectiveMaxAge) {
    return {
      outcome: 'FALSE',
      criterion: 'Upper Age Limit & Statutory Relaxation',
      studentValue: `${ageObj.formatted} (Category: ${profile.category || 'General'})`,
      requiredValue: `Maximum ${effectiveMaxAge} years (Base: ${maxAge} + ${relaxationYears}y relax)`,
      statutoryReference: `${exam.code} Upper Age Limit & DoPT Relaxation Rules`,
      reason: `Candidate's age (${ageObj.decimalAge} yrs) exceeds the maximum relaxed upper age limit of ${effectiveMaxAge} years. Reason: ${relaxationLabel}.`
    };
  }

  return {
    outcome: 'TRUE',
    criterion: 'Age Requirement with Statutory Relaxations',
    studentValue: `${ageObj.formatted} (Category: ${profile.category || 'General'})`,
    requiredValue: `${effectiveMinAge} to ${effectiveMaxAge} years (Base: ${maxAge || 'N/A'}, Relaxed: +${relaxationYears}y)`,
    statutoryReference: `${exam.code} Statutory Age Eligibility Clause`,
    reason: `Candidate's age of ${ageObj.formatted} complies fully with the statutory age bracket.`
  };
}

/**
 * Evaluates Minimum Percentage or CGPA
 */
function evaluatePercentage(profile, exam) {
  const minPercent = exam.eligibility?.minPercentage;
  if (!minPercent) {
    return {
      outcome: 'TRUE',
      criterion: 'Minimum Percentage / CGPA',
      studentValue: profile.percentage ? `${profile.percentage}%` : 'Passing Grade',
      requiredValue: 'Just Pass / No Minimum Percentage',
      statutoryReference: `${exam.code} Academic Score Clause`,
      reason: 'Candidate just needs a passing degree from a recognized institution.'
    };
  }

  const candPercent = profile.percentage || (profile.cgpa ? profile.cgpa * 9.5 : null);

  if (candPercent === null || candPercent === undefined) {
    return {
      outcome: 'UNKNOWN',
      criterion: 'Minimum Percentage / CGPA',
      studentValue: 'Not provided in profile',
      requiredValue: `Minimum ${minPercent}%`,
      statutoryReference: `${exam.code} Academic Score Clause`,
      reason: `Exam mandates minimum ${minPercent}%. Student score is missing from profile.`
    };
  }

  // Check category relaxation (often 5% relaxation for SC/ST/PwD)
  const isReserved = ['SC', 'ST', 'PWD'].some(c => (profile.category || '').toUpperCase().includes(c));
  const effectiveMin = isReserved ? Math.max(45, minPercent - 5) : minPercent;

  if (candPercent < effectiveMin) {
    return {
      outcome: 'FALSE',
      criterion: 'Minimum Percentage / CGPA',
      studentValue: `${candPercent.toFixed(1)}%`,
      requiredValue: `${effectiveMin}% (${isReserved ? 'Relaxed for SC/ST/PwD' : 'General'})`,
      statutoryReference: `${exam.code} Minimum Percentage Regulations`,
      reason: `Score of ${candPercent.toFixed(1)}% falls below the required threshold of ${effectiveMin}%.`
    };
  }

  return {
    outcome: 'TRUE',
    criterion: 'Minimum Percentage / CGPA',
    studentValue: `${candPercent.toFixed(1)}%`,
    requiredValue: `Minimum ${effectiveMin}%`,
    statutoryReference: `${exam.code} Minimum Percentage Regulations`,
    reason: `Score meets or exceeds the required threshold.`
  };
}

/**
 * Evaluates Attempt Limits
 */
function evaluateAttemptLimits(profile, exam) {
  const limits = exam.eligibility?.attemptsLimit;
  if (!limits) {
    return {
      outcome: 'TRUE',
      criterion: 'Attempt Limit',
      studentValue: profile.attemptsCount || 0,
      requiredValue: 'No Attempt Limit',
      statutoryReference: `${exam.code} Attempt Clause`,
      reason: 'No statutory cap on maximum number of examination attempts.'
    };
  }

  const cat = (profile.category || 'General').toUpperCase();
  let maxAttempts = limits.General || 6;
  if (cat.includes('OBC')) maxAttempts = limits.OBC || 9;
  if (cat.includes('SC') || cat.includes('ST')) maxAttempts = 999; // Unlimited

  const attemptsTaken = profile.attemptsCount || 0;
  if (attemptsTaken >= maxAttempts) {
    return {
      outcome: 'FALSE',
      criterion: 'Permitted Examination Attempts',
      studentValue: `${attemptsTaken} attempts consumed`,
      requiredValue: `Max ${maxAttempts} attempts allowed for ${profile.category || 'General'}`,
      statutoryReference: `${exam.code} Attempt Cap Clause`,
      reason: `Candidate has exhausted all ${maxAttempts} statutory attempts permitted for their category.`
    };
  }

  return {
    outcome: 'TRUE',
    criterion: 'Permitted Examination Attempts',
    studentValue: `${attemptsTaken} attempts used`,
    requiredValue: `Max ${maxAttempts === 999 ? 'Unlimited' : maxAttempts} allowed`,
    statutoryReference: `${exam.code} Attempt Cap Clause`,
    reason: `Candidate has remaining attempts available (${maxAttempts === 999 ? 'Unlimited' : maxAttempts - attemptsTaken} remaining).`
  };
}

/**
 * Evaluates Physical & Medical Standards (Defence, Police, CAPF, Railways)
 */
function evaluatePhysicalStandards(profile, exam) {
  const phys = exam.eligibility?.physicalStandards;
  if (!phys) {
    return {
      outcome: 'TRUE',
      criterion: 'Physical & Medical Fitness Standards',
      studentValue: 'Standard Health',
      requiredValue: 'No Special Physical Benchmark',
      statutoryReference: `${exam.code} General Fitness Clause`,
      reason: 'General medical fitness; no rigorous height or visual acuity thresholds.'
    };
  }

  const gender = (profile.gender || 'Male').toLowerCase();
  const minHeight = gender === 'female' ? (phys.minHeightFemale || 152) : (phys.minHeightMale || 165);

  if (!profile.heightCm) {
    return {
      outcome: 'UNKNOWN',
      criterion: 'Physical Standards (Height / Fitness)',
      studentValue: 'Height not specified in profile',
      requiredValue: `Minimum ${minHeight} cm for ${gender}`,
      statutoryReference: `${exam.code} Physical Efficiency Test (PET) Rules`,
      reason: 'Candidate height is required for Defence/Police/Uniform cadres but missing in profile.'
    };
  }

  if (profile.heightCm < minHeight) {
    return {
      outcome: 'FALSE',
      criterion: 'Physical Standards (Height)',
      studentValue: `${profile.heightCm} cm`,
      requiredValue: `Minimum ${minHeight} cm for ${gender}`,
      statutoryReference: `${exam.code} Physical Efficiency Regulations`,
      reason: `Candidate height (${profile.heightCm} cm) does not meet mandatory threshold (${minHeight} cm).`
    };
  }

  return {
    outcome: 'TRUE',
    criterion: 'Physical & Medical Standards',
    studentValue: `${profile.heightCm} cm`,
    requiredValue: `Minimum ${minHeight} cm`,
    statutoryReference: `${exam.code} Physical Regulations`,
    reason: 'Candidate satisfies physical height requirements.'
  };
}

/**
 * Master Deterministic Three-Valued Evaluator
 * 
 * Returns granular ExplanationTrace and assigns 6-Bucket Opportunity Classification.
 */
function evaluateStudentEligibility(studentProfile = {}, exam = {}) {
  const profile = studentProfile || {};

  // Step-by-Step Explanation Trace Collection
  const trace = [
    evaluateDegreeAndBranch(profile, exam),
    evaluateGraduationStatus(profile, exam),
    evaluateAgeCriteria(profile, exam),
    evaluatePercentage(profile, exam),
    evaluateAttemptLimits(profile, exam),
    evaluatePhysicalStandards(profile, exam)
  ];

  // Aggregation via Three-Valued Logic
  const hasFalse = trace.some(t => t.outcome === 'FALSE');
  const hasUnknown = trace.some(t => t.outcome === 'UNKNOWN');
  const isFuture = trace.some(t => t.isFutureOpportunity);

  let profileEligibilityBucket = 'ELIGIBLE';
  let overallReason = 'Candidate satisfies all statutory qualification and age requirements.';

  if (hasFalse) {
    const hardFailures = trace.filter(t => t.outcome === 'FALSE' && !t.isFutureOpportunity);
    if (hardFailures.length > 0) {
      profileEligibilityBucket = 'NOT_ELIGIBLE';
      overallReason = hardFailures.map(f => f.reason).join('; ');
    } else if (isFuture) {
      profileEligibilityBucket = 'FUTURE_OPPORTUNITY';
      const futureRules = trace.filter(t => t.isFutureOpportunity);
      overallReason = `Future opportunity: ${futureRules.map(f => f.reason).join('; ')}`;
    } else {
      profileEligibilityBucket = 'NOT_ELIGIBLE';
      const failedRules = trace.filter(t => t.outcome === 'FALSE');
      overallReason = failedRules.map(f => f.reason).join('; ');
    }
  } else if (hasUnknown) {
    profileEligibilityBucket = 'VERIFICATION_REQUIRED';
    const unknownRules = trace.filter(t => t.outcome === 'UNKNOWN');
    overallReason = `Verification Required: ${unknownRules.map(u => u.reason).join('; ')}`;
  }

  // Orthogonal Application Lifecycle Evaluation
  const noticeEvaluation = evaluateNoticeLifecycle({
    applicationStartDate: exam.importantDates?.applicationStart || exam.calendar?.applicationStart,
    applicationDeadline: exam.importantDates?.applicationEnd || exam.calendar?.applicationLastDate,
    examinationDate: exam.importantDates?.examDate || exam.calendar?.examDate
  });

  const applicationLifecycleBucket = noticeEvaluation.isApplicationOpen
    ? 'APPLICATION_OPEN'
    : 'APPLICATION_CLOSED';

  return {
    examId: exam.id,
    examCode: exam.code,
    examTitle: exam.title,
    conductingBody: exam.conductingBody,
    category: exam.category,
    profileEligibilityBucket,
    applicationLifecycleBucket,
    isEligibleNow: profileEligibilityBucket === 'ELIGIBLE' && applicationLifecycleBucket === 'APPLICATION_OPEN',
    overallReason,
    explanationTrace: trace,
    lifecycleDetails: noticeEvaluation
  };
}

/**
 * Batch Evaluate All Examinations in Registry
 */
function batchEvaluateExaminations(profile, examinations = []) {
  return examinations.map(exam => evaluateStudentEligibility(profile, exam));
}

module.exports = {
  EDUCATION_LEVEL_WEIGHTS,
  BRANCH_EQUIVALENCY,
  calculateExactAge,
  getStatutoryAgeRelaxation,
  evaluateStudentEligibility,
  batchEvaluateExaminations
};
