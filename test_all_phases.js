// test_all_phases.js
// Runs all verification test suites across Phases 2 through 11

const { execSync } = require('child_process');

const testSuites = [
  'test_phase2_verification.js',
  'test_phase3_verification.js',
  'test_phase4_verification.js',
  'test_phase5_verification.js',
  'test_phase6_verification.js',
  'test_phase7_verification.js',
  'test_phase8_verification.js',
  'test_phase9_verification.js',
  'test_phase10_verification.js',
  'test_phase11_verification.js',
  'test_phase12_sweep2_edge_cases.js',
  'test_phase12_sweep3_security_auth.js',
  'test_phase12_sweep4_data_ai_contract.js',
  'test_phase12_sweep5_monitoring.js'
];

console.log("==================================================================");
console.log("🚀 RUNNING COMPREHENSIVE REGRESSION SUITE (PHASES 2 THROUGH 12)");
console.log("==================================================================\n");

let totalSuites = testSuites.length;
let passedSuites = 0;

for (const suite of testSuites) {
  process.stdout.write(`Executing ${suite}... `);
  try {
    const output = execSync(`node ${suite}`, { stdio: 'pipe' }).toString();
    console.log("✓ PASSED");
    passedSuites++;
  } catch (err) {
    console.log("✗ FAILED");
    console.error(err.stdout ? err.stdout.toString() : err.message);
    process.exit(1);
  }
}

console.log("\n==================================================================");
console.log(`🎉 ALL PHASES VERIFIED: ${passedSuites} / ${totalSuites} TEST SUITES PASSED (100%)`);
console.log("==================================================================");
