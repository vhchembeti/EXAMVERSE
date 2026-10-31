// server/services/blinkTrickEngine.js
// Deterministic Blink-Tick Calculation & Verification Engine
// Implements Digital Sum (Casting Out 9s), Unit Digit Cyclicity,
// Divisibility Rules (2 to 37, 72, 88, 99), Vedic Math Patterns & Mental Square Roots.

/**
 * Computes the Digital Root (Digital Sum) of a non-negative integer using Casting Out 9s.
 * In modular arithmetic: Digital Root(n) = n == 0 ? 0 : 1 + ((n - 1) % 9).
 */
function computeDigitalSum(num) {
  if (num === null || num === undefined) return 0;
  const str = Math.abs(Number(num)).toString().replace(/[^0-9]/g, "");
  if (!str) return 0;
  
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += parseInt(str[i], 10);
  }
  
  // Reduce recursively until single digit 1-9 (or 9)
  while (sum > 9) {
    let nextSum = 0;
    const innerStr = sum.toString();
    for (let j = 0; j < innerStr.length; j++) {
      nextSum += parseInt(innerStr[j], 10);
    }
    sum = nextSum;
  }
  return sum;
}

/**
 * Unit Digit Cyclicity Engine:
 * Returns the unit digit of (base^exponent) in O(1) time.
 */
function getUnitDigit(base, exp) {
  const b = Math.abs(parseInt(base, 10)) % 10;
  const e = parseInt(exp, 10);
  
  if (e === 0) return 1;
  if (b === 0 || b === 1 || b === 5 || b === 6) {
    return b;
  }
  
  // Power of 4 or 9 has period 2
  if (b === 4) return (e % 2 === 1) ? 4 : 6;
  if (b === 9) return (e % 2 === 1) ? 9 : 1;
  
  // Powers of 2, 3, 7, 8 have period 4
  const cycleMap = {
    2: [6, 2, 4, 8], // e % 4 === 0 is index 0 (6), 1 is 2, 2 is 4, 3 is 8
    3: [1, 3, 9, 7],
    7: [1, 7, 9, 3],
    8: [6, 8, 4, 2]
  };
  
  const remainder = e % 4;
  return cycleMap[b][remainder];
}

/**
 * Divisibility Rule Checker:
 * Handles 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 17, 19, 72, 88, 99.
 */
function checkDivisibility(number, divisor) {
  const num = BigInt(number);
  const div = BigInt(divisor);
  const isDivisible = num % div === 0n;
  
  let ruleExplanation = "";
  switch (Number(divisor)) {
    case 3:
      ruleExplanation = "Sum of digits must be divisible by 3.";
      break;
    case 7:
      ruleExplanation = "Osculator rule for 7 (Double the last digit and subtract from remaining).";
      break;
    case 8:
      ruleExplanation = "Last 3 digits must be divisible by 8.";
      break;
    case 9:
      ruleExplanation = "Sum of digits (digital root) must equal 9.";
      break;
    case 11:
      ruleExplanation = "Difference between sum of odd-position digits and even-position digits must be 0 or a multiple of 11.";
      break;
    case 13:
      ruleExplanation = "Osculator rule for 13 (Multiply last digit by 4 and add to remaining).";
      break;
    case 72:
      ruleExplanation = "Must be co-prime divisible by both 8 (last 3 digits) and 9 (digital sum).";
      break;
    case 88:
      ruleExplanation = "Must be co-prime divisible by both 8 (last 3 digits) and 11 (alternating sum).";
      break;
    case 99:
      ruleExplanation = "Must be co-prime divisible by both 9 and 11.";
      break;
    default:
      ruleExplanation = `Standard modular test: ${number} % ${divisor} == 0.`;
  }
  
  return {
    isDivisible,
    ruleExplanation,
    remainder: Number(num % div)
  };
}

/**
 * Fraction-to-Percentage standard conversion table (1/2 to 1/25).
 */
const FRACTION_PERCENT_TABLE = [
  { fraction: "1/2", decimal: 0.50, percent: "50%", trick: "Half of 100%" },
  { fraction: "1/3", decimal: 0.3333, percent: "33.33% or 33⅓%", trick: "Recurring 3" },
  { fraction: "1/4", decimal: 0.25, percent: "25%", trick: "Half of half" },
  { fraction: "1/5", decimal: 0.20, percent: "20%", trick: "Base 10 / 5" },
  { fraction: "1/6", decimal: 0.1667, percent: "16.67% or 16⅔%", trick: "Half of 1/3" },
  { fraction: "1/7", decimal: 0.1428, percent: "14.28% or 14 2/7%", trick: "Double 7=14, double 14=28!" },
  { fraction: "1/8", decimal: 0.125, percent: "12.5% or 12½%", trick: "Half of 25%" },
  { fraction: "1/9", decimal: 0.1111, percent: "11.11% or 11 1/9%", trick: "Table of 11s" },
  { fraction: "1/10", decimal: 0.10, percent: "10%", trick: "Trivial" },
  { fraction: "1/11", decimal: 0.0909, percent: "9.09% or 9 1/11%", trick: "Table of 9s" },
  { fraction: "1/12", decimal: 0.0833, percent: "8.33% or 8⅓%", trick: "Half of 16.67%" },
  { fraction: "1/13", decimal: 0.0769, percent: "7.69%", trick: "7.7% approx" },
  { fraction: "1/14", decimal: 0.0714, percent: "7.14%", trick: "Half of 14.28%" },
  { fraction: "1/15", decimal: 0.0667, percent: "6.67% or 6⅔%", trick: "1/3 of 20%" },
  { fraction: "1/16", decimal: 0.0625, percent: "6.25% or 6¼%", trick: "Half of 12.5%" },
  { fraction: "1/20", decimal: 0.05, percent: "5%", trick: "Direct" },
  { fraction: "1/25", decimal: 0.04, percent: "4%", trick: "Direct" }
];

/**
 * Vedic Multiplication Analyzer:
 * Detects patterns and returns the mental math shortcut steps.
 */
function vedicMultiply(a, b) {
  const numA = parseInt(a, 10);
  const numB = parseInt(b, 10);
  const product = numA * numB;
  
  // Case 1: Same tens digit, units sum to 10 (e.g. 43 x 47)
  const tensA = Math.floor(numA / 10);
  const tensB = Math.floor(numB / 10);
  const unitA = numA % 10;
  const unitB = numB % 10;
  
  if (tensA === tensB && unitA + unitB === 10 && numA >= 10 && numA < 100) {
    const leftPart = tensA * (tensA + 1);
    const rightPart = unitA * unitB;
    const formattedRight = rightPart < 10 ? `0${rightPart}` : `${rightPart}`;
    return {
      pattern: "Ekadhikena Purvena (Same tens, units sum to 10)",
      result: product,
      steps: [
        `Left side: Tens digit × (Tens digit + 1) = ${tensA} × ${tensA + 1} = ${leftPart}`,
        `Right side: Unit digits product = ${unitA} × ${unitB} = ${formattedRight}`,
        `Combine: ${leftPart}${formattedRight} = ${product}`
      ]
    };
  }
  
  // Case 2: Near base 100 (e.g. 96 x 94)
  if (numA >= 85 && numA <= 115 && numB >= 85 && numB <= 115) {
    const devA = numA - 100;
    const devB = numB - 100;
    const leftPart = numA + devB; // same as numB + devA
    const rightPart = devA * devB;
    const formattedRight = rightPart < 10 ? `0${rightPart}` : `${rightPart}`;
    return {
      pattern: "Nikhilam Navatashcaramam Dashatah (Base 100)",
      result: product,
      steps: [
        `Deviations from 100: ${numA} has ${devA > 0 ? "+" + devA : devA}, ${numB} has ${devB > 0 ? "+" + devB : devB}`,
        `Cross-operation (Left side): ${numA} + (${devB}) = ${leftPart}`,
        `Product of deviations (Right side): (${devA}) × (${devB}) = ${formattedRight}`,
        `Combine: ${leftPart}${formattedRight} = ${product}`
      ]
    };
  }
  
  // Case 3: Universal 2-digit cross multiplication (Urdhva Tiryagbhyam)
  if (numA >= 10 && numA < 100 && numB >= 10 && numB < 100) {
    const step1 = unitA * unitB; // unit
    const step2 = (tensA * unitB) + (tensB * unitA); // cross
    const step3 = tensA * tensB; // tens
    return {
      pattern: "Urdhva Tiryagbhyam (Vertical & Crosswise)",
      result: product,
      steps: [
        `Step 1 (Vertical right): ${unitA} × ${unitB} = ${step1} (keep ${step1 % 10}, carry ${Math.floor(step1 / 10)})`,
        `Step 2 (Crosswise sum): (${tensA}×${unitB}) + (${tensB}×${unitA}) + carry = ${step2 + Math.floor(step1 / 10)}`,
        `Step 3 (Vertical left): ${tensA} × ${tensB} + carry = ${Math.floor(product / 100)}`,
        `Final combined product = ${product}`
      ]
    };
  }
  
  return {
    pattern: "Standard Arithmetic",
    result: product,
    steps: [`${numA} × ${numB} = ${product}`]
  };
}

/**
 * Mental Square Root Approximation for non-perfect squares in 3 seconds:
 * sqrt(x ± y) ≈ sqrt(x) ± y / (2 * sqrt(x))
 */
function estimateSquareRoot(n) {
  const num = Number(n);
  if (num <= 0) return { root: 0, formula: "N/A" };
  
  // Find nearest perfect square x
  const base = Math.round(Math.sqrt(num));
  const x = base * base;
  const y = num - x;
  
  const approx = base + (y / (2 * base));
  const exact = Math.sqrt(num);
  const errorPercent = (Math.abs(exact - approx) / exact) * 100;
  
  return {
    nearestSquare: x,
    base,
    difference: y,
    approximatedRoot: Number(approx.toFixed(3)),
    exactRoot: Number(exact.toFixed(4)),
    errorPercent: Number(errorPercent.toFixed(2)),
    steps: [
      `1. Nearest perfect square to ${num} is ${x} (√${x} = ${base}).`,
      `2. Difference y = ${num} - ${x} = ${y >= 0 ? "+" + y : y}.`,
      `3. Linear formula: √${num} ≈ ${base} + (${y} / (2 × ${base})) = ${base} + (${y} / ${2 * base}) = ${approx.toFixed(3)}.`,
      `Exact is ${exact.toFixed(4)} (Accuracy: ${(100 - errorPercent).toFixed(1)}%).`
    ]
  };
}

/**
 * Greatest Common Divisor (Euclidean algorithm) & Least Common Multiple
 */
function computeGcd(a, b) {
  let x = Math.abs(parseInt(a, 10)) || 0;
  let y = Math.abs(parseInt(b, 10)) || 0;
  while (y) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

function computeLcm(a, b) {
  const x = Math.abs(parseInt(a, 10)) || 0;
  const y = Math.abs(parseInt(b, 10)) || 0;
  if (x === 0 || y === 0) return 0;
  const gcd = computeGcd(x, y);
  return Math.abs((x * y) / gcd);
}

/**
 * Alligation & Mixture Cross Rule
 * Ratio of Cheaper Quantity to Dearer Quantity = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price)
 */
function computeAlligationRatio({ meanPrice, cheaperPrice, dearerPrice }) {
  const m = Number(meanPrice);
  const c = Number(cheaperPrice);
  const d = Number(dearerPrice);

  if (isNaN(m) || isNaN(c) || isNaN(d)) {
    return { error: 'Non-numeric input values provided', ratio: null };
  }
  if (c >= d) {
    return { error: 'Cheaper price must be strictly less than dearer price', ratio: null };
  }
  if (m < c || m > d) {
    return { error: 'Mean price must be between cheaper price and dearer price', ratio: null };
  }

  const cheaperParts = d - m;
  const dearerParts = m - c;
  const gcd = computeGcd(Math.round(cheaperParts * 100), Math.round(dearerParts * 100));
  const simCheaper = (Math.round(cheaperParts * 100) / (gcd || 1));
  const simDearer = (Math.round(dearerParts * 100) / (gcd || 1));

  return {
    success: true,
    meanPrice: m,
    cheaperPrice: c,
    dearerPrice: d,
    cheaperParts: Number(cheaperParts.toFixed(2)),
    dearerParts: Number(dearerParts.toFixed(2)),
    ratioFormatted: `${simCheaper} : ${simDearer}`,
    cheaperToDearerRatio: dearerParts === 0 ? 0 : Number((cheaperParts / dearerParts).toFixed(4))
  };
}

module.exports = {
  computeDigitalSum,
  getUnitDigit,
  checkDivisibility,
  FRACTION_PERCENT_TABLE,
  vedicMultiply,
  estimateSquareRoot,
  computeGcd,
  computeLcm,
  computeAlligationRatio
};
