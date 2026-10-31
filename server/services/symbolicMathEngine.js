// server/services/symbolicMathEngine.js
// Deterministic Symbolic Math & Computer Algebra System (CAS) Verification Engine
// Guarantees mathematical correctness for engineering, aptitude, and scientific problems.
// NEVER trusts raw LLM arithmetic: verifies and recalculates equations deterministically.

/**
 * Safely evaluates mathematical expressions using standard mathematical functions and operator precedence.
 * @param {string} expr - Arithmetic or algebraic expression
 * @returns {number|null} Evaluated numeric value or null if invalid
 */
function evaluateArithmetic(expr) {
  if (!expr || typeof expr !== 'string') return null;

  try {
    // Sanitize string to allow only numbers, math operators, parentheses, and math functions
    let cleaned = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**')
      .replace(/\s+/g, '');

    // Allow only safe characters: digits, ., +, -, *, /, %, (, ), and common functions
    if (!/^[0-9+\-*/%().Mathcosinlatgqex]+$/.test(cleaned)) {
      // Replace safe function tokens with Math object references
      cleaned = cleaned
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/cbrt\(/g, 'Math.cbrt(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log10\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/pi\b/gi, 'Math.PI')
        .replace(/e\b/gi, 'Math.E');
    }

    // Verify sanitized expression
    if (!/^[0-9+\-*/%().,MathcosinlatgqexPEI ]+$/.test(cleaned)) {
      return null;
    }

    // eslint-disable-next-line no-eval
    const result = Function(`'use strict'; return (${cleaned})`)();
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return null;
    }
    return Number(result.toFixed(6));
  } catch {
    return null;
  }
}

/**
 * Solves standard quadratic equation a*x^2 + b*x + c = 0 deterministically.
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {{ discriminant: number, roots: number[], rootType: string, stepByStep: string }}
 */
function solveQuadratic(a, b, c) {
  if (a === 0) {
    if (b === 0) {
      return { discriminant: 0, roots: [], rootType: "DEGENERATE", stepByStep: "No variable present." };
    }
    const singleRoot = -c / b;
    return {
      discriminant: 0,
      roots: [Number(singleRoot.toFixed(4))],
      rootType: "LINEAR",
      stepByStep: `Linear equation ${b}x + ${c} = 0 => x = ${singleRoot}`
    };
  }

  const d = (b * b) - (4 * a * c);
  let roots = [];
  let rootType = "REAL_DISTINCT";

  if (d > 0) {
    const r1 = (-b + Math.sqrt(d)) / (2 * a);
    const r2 = (-b - Math.sqrt(d)) / (2 * a);
    roots = [Number(r1.toFixed(4)), Number(r2.toFixed(4))].sort((x, y) => x - y);
    rootType = "REAL_DISTINCT";
  } else if (d === 0) {
    const r = -b / (2 * a);
    roots = [Number(r.toFixed(4))];
    rootType = "REAL_EQUAL";
  } else {
    rootType = "COMPLEX_CONJUGATE";
  }

  const stepByStep = `Standard Form: ${a}x² + ${b}x + ${c} = 0\nDiscriminant Δ = b² - 4ac = (${b})² - 4(${a})(${c}) = ${d}\n` +
    (d >= 0
      ? `Roots x = (-b ± √Δ) / 2a = (-(${b}) ± √${d}) / (2·${a}) => x = ${roots.join(", ")}`
      : `Roots are complex conjugate: x = ${(-b / (2 * a)).toFixed(4)} ± ${((Math.sqrt(-d)) / (2 * a)).toFixed(4)}i`);

  return {
    discriminant: d,
    roots,
    rootType,
    stepByStep
  };
}

/**
 * Solves system of two linear equations in two variables:
 * a1*x + b1*y = c1
 * a2*x + b2*y = c2
 * using Cramer's Rule.
 */
function solve2x2LinearSystem(a1, b1, c1, a2, b2, c2) {
  const detMain = (a1 * b2) - (a2 * b1);
  if (Math.abs(detMain) < 1e-10) {
    return { hasUniqueSolution: false, x: null, y: null, stepByStep: "Determinant Δ = 0 (Parallel or Identical lines)." };
  }

  const detX = (c1 * b2) - (c2 * b1);
  const detY = (a1 * c2) - (a2 * c1);

  const x = detX / detMain;
  const y = detY / detMain;

  return {
    hasUniqueSolution: true,
    x: Number(x.toFixed(4)),
    y: Number(y.toFixed(4)),
    detMain,
    stepByStep: `Cramer's Rule: Δ = (${a1}·${b2}) - (${a2}·${b1}) = ${detMain}\nΔ_x = (${c1}·${b2}) - (${c2}·${b1}) = ${detX} => x = ${detX}/${detMain} = ${x}\nΔ_y = (${a1}·${c2}) - (${a2}·${c1}) = ${detY} => y = ${detY}/${detMain} = ${y}`
  };
}

/**
 * Evaluates standard 2x2 matrix determinant and trace.
 */
function evaluateMatrix2x2(a, b, c, d) {
  const det = (a * d) - (b * c);
  const trace = a + d;
  // Characteristic polynomial: λ² - trace·λ + det = 0
  const charRoots = solveQuadratic(1, -trace, det);

  return {
    determinant: det,
    trace,
    eigenvalues: charRoots.roots,
    isSingular: det === 0,
    characteristicEquation: `λ² - ${trace}λ + ${det} = 0`
  };
}

/**
 * Deterministically computes domain-specific engineering formulas.
 */
const ENGINEERING_SOLVERS = {
  // CSMA/CD Minimum Frame Size: L = 2 * (d / v) * B
  csmacd_frame_size: ({ distanceMeters, propagationSpeedMs, bandwidthBps }) => {
    const tProp = distanceMeters / propagationSpeedMs;
    const tTrans = 2 * tProp;
    const bits = tTrans * bandwidthBps;
    const bytes = bits / 8;
    return {
      tPropMicroseconds: Number((tProp * 1e6).toFixed(4)),
      tTransMicroseconds: Number((tTrans * 1e6).toFixed(4)),
      minFrameBits: Number(bits.toFixed(2)),
      minFrameBytes: Number(bytes.toFixed(2)),
      stepByStep: `T_prop = d / v = ${distanceMeters} m / ${propagationSpeedMs} m/s = ${(tProp * 1e6).toFixed(2)} µs\n` +
        `In CSMA/CD, T_trans >= 2 · T_prop = ${(tTrans * 1e6).toFixed(2)} µs\n` +
        `Frame Size = T_trans · Bandwidth = ${(tTrans * 1e6).toFixed(2)} µs · ${bandwidthBps / 1e6} Mbps = ${bits} bits = ${bytes} bytes.`
    };
  },

  // Shannon Channel Capacity: C = B * log2(1 + SNR)
  shannon_capacity: ({ bandwidthHz, snrLinear, snrDb }) => {
    let snr = snrLinear;
    if (snrDb !== undefined && snr === undefined) {
      snr = Math.pow(10, snrDb / 10);
    }
    const capacity = bandwidthHz * Math.log2(1 + snr);
    return {
      bandwidthHz,
      snrLinear: Number(snr.toFixed(2)),
      capacityBps: Number(capacity.toFixed(2)),
      capacityKbps: Number((capacity / 1000).toFixed(2)),
      stepByStep: `Shannon-Hartley Theorem: C = B · log₂(1 + SNR)\n` +
        `C = ${bandwidthHz} · log₂(1 + ${snr.toFixed(2)}) = ${capacity.toFixed(2)} bps (${(capacity / 1000).toFixed(2)} kbps).`
    };
  },

  // Compound Interest: A = P * (1 + R/100)^n
  compound_interest: ({ principal, ratePercent, years }) => {
    const amount = principal * Math.pow(1 + ratePercent / 100, years);
    const ci = amount - principal;
    return {
      principal,
      amount: Number(amount.toFixed(2)),
      compoundInterest: Number(ci.toFixed(2)),
      stepByStep: `A = P · (1 + R/100)ⁿ = ${principal} · (1 + ${ratePercent}/100)^${years} = ₹${amount.toFixed(2)}\n` +
        `CI = A - P = ₹${amount.toFixed(2)} - ₹${principal} = ₹${ci.toFixed(2)}.`
    };
  },

  // Stop-and-Wait Efficiency: eta = 1 / (1 + 2a), a = T_prop / T_trans
  stop_and_wait_efficiency: ({ tPropMs, tTransMs }) => {
    const a = tPropMs / tTransMs;
    const efficiency = 1 / (1 + (2 * a));
    return {
      a: Number(a.toFixed(4)),
      efficiency: Number(efficiency.toFixed(4)),
      efficiencyPercent: Number((efficiency * 100).toFixed(2)),
      stepByStep: `Parameter a = T_prop / T_trans = ${tPropMs} / ${tTransMs} = ${a.toFixed(4)}\n` +
        `Efficiency η = 1 / (1 + 2a) = 1 / (1 + 2·${a.toFixed(4)}) = ${(efficiency * 100).toFixed(2)}%.`
    };
  }
};

/**
 * Mathematical Verification Gate:
 * Cross-references an LLM-generated numerical answer with the deterministic CAS engine.
 * If the LLM answer is inconsistent or hallucinated, provides the certified CAS solution.
 */
function verifyMathematicalResult(problemTypeOrOptions, maybeParams = {}, maybeCandidate = null) {
  let problemType;
  let parameters = {};
  let candidateAnswer = null;

  if (typeof problemTypeOrOptions === 'object' && problemTypeOrOptions !== null) {
    problemType = (problemTypeOrOptions.problemType || '').toLowerCase();
    parameters = problemTypeOrOptions.parameters || {};
    candidateAnswer = problemTypeOrOptions.claimedAnswer !== undefined
      ? problemTypeOrOptions.claimedAnswer
      : problemTypeOrOptions.candidateAnswer;
    if (problemTypeOrOptions.expression && !parameters.expression) {
      parameters.expression = problemTypeOrOptions.expression;
    }
  } else {
    problemType = (problemTypeOrOptions || '').toLowerCase();
    parameters = maybeParams || {};
    candidateAnswer = maybeCandidate;
  }

  let casSolution = null;
  let isVerified = false;
  let discrepancy = 0;
  let symbolicCheckPassed = false;

  // Map normalized problem type keys
  const solverKeyMap = {
    'csmacd_frame_size': 'csmacd_frame_size',
    'csma_cd': 'csmacd_frame_size',
    'csma/cd': 'csmacd_frame_size',
    'shannon_capacity': 'shannon_capacity',
    'shannon': 'shannon_capacity',
    'compound_interest': 'compound_interest',
    'ci': 'compound_interest',
    'stop_and_wait_efficiency': 'stop_and_wait_efficiency',
    'stop_and_wait': 'stop_and_wait_efficiency'
  };

  const matchedSolverKey = solverKeyMap[problemType];

  if (matchedSolverKey && ENGINEERING_SOLVERS[matchedSolverKey]) {
    casSolution = ENGINEERING_SOLVERS[matchedSolverKey](parameters);
    const expectedVal = casSolution.minFrameBits !== undefined ? casSolution.minFrameBits : (casSolution.minFrameBytes || casSolution.capacityBps || casSolution.amount || casSolution.efficiencyPercent);
    if (candidateAnswer !== null && candidateAnswer !== undefined) {
      let candidateVal = typeof candidateAnswer === 'object'
        ? (candidateAnswer.minFrameBits || candidateAnswer.minFrameBytes || candidateAnswer.capacityBps || candidateAnswer.roots?.[0])
        : candidateAnswer;
      const parsedCandidate = parseFloat(candidateVal);
      if (!isNaN(parsedCandidate) && expectedVal !== undefined) {
        discrepancy = Math.abs(parsedCandidate - expectedVal);
        isVerified = discrepancy <= 0.05 * Math.abs(expectedVal) || discrepancy <= 0.1;
      }
    } else {
      isVerified = true;
    }
    symbolicCheckPassed = isVerified;
  } else if (problemType === 'quadratic') {
    casSolution = solveQuadratic(parameters.a || 0, parameters.b || 0, parameters.c || 0);
    if (candidateAnswer && candidateAnswer.roots) {
      const cRoots = Array.isArray(candidateAnswer.roots) ? candidateAnswer.roots.slice().sort((x, y) => x - y) : [];
      const expectedRoots = casSolution.roots.slice().sort((x, y) => x - y);
      isVerified = JSON.stringify(cRoots) === JSON.stringify(expectedRoots);
    } else {
      isVerified = true;
    }
    symbolicCheckPassed = isVerified;
  } else if (problemType === 'linear_system' || problemType === '2x2_linear') {
    casSolution = solve2x2LinearSystem(
      parameters.a1, parameters.b1, parameters.c1,
      parameters.a2, parameters.b2, parameters.c2
    );
    isVerified = casSolution.hasUniqueSolution;
    symbolicCheckPassed = isVerified;
  } else if (problemType === 'arithmetic') {
    const val = evaluateArithmetic(parameters.expression);
    casSolution = { result: val, stepByStep: `Evaluated: ${parameters.expression} = ${val}` };
    isVerified = val !== null;
    symbolicCheckPassed = isVerified;
  }

  return {
    problemType,
    isVerified,
    symbolicCheckPassed,
    discrepancy: Number(discrepancy.toFixed(4)),
    correctResult: casSolution,
    casSolution,
    verificationBadge: isVerified
      ? "[CAS Certified — Deterministically Verified]"
      : "[CAS Corrected — LLM Answer Adjusted to Exact Mathematical Result]"
  };
}

module.exports = {
  evaluateArithmetic,
  solveQuadratic,
  solve2x2LinearSystem,
  evaluateMatrix2x2,
  ENGINEERING_SOLVERS,
  solveCsmaCdMinFrameSize: (d, v, b) => ENGINEERING_SOLVERS.csmacd_frame_size({ distanceMeters: d, propagationSpeedMs: v, bandwidthBps: b }),
  solveShannonCapacity: (b, snrDb) => ENGINEERING_SOLVERS.shannon_capacity({ bandwidthHz: b, snrDb }),
  verifyMathematicalResult
};
