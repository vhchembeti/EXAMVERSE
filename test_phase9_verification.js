// test_phase9_verification.js
// Phase 9 Automated Verification Suite for EXAMVERSE
// Verifies Kahn's Topo Sort, Dijkstra Shortest Path, Interval-Tree Clashes,
// RFC 5545 .ICS generation, 7th CPC / PSU IDA Salary Calculator, and Document Readiness.

const assert = require('assert');
const {
  PATHWAY_NODES,
  PATHWAY_EDGES
} = require('./server/data/careerPathwayGraphData');
const pathwayEngine = require('./server/services/careerPathwayGraphEngine');
const { CareerPathwayGraphEngine } = pathwayEngine;
const {
  IntervalTree,
  detectClashes
} = require('./server/services/intervalTreeClashEngine');
const {
  generateIcsCalendar
} = require('./server/services/calendarExportService');
const salaryEngine = require('./server/services/salaryExplorerEngine');
const {
  HISTORICAL_EXAM_TRENDS,
  DOCUMENT_READINESS_STANDARDS
} = require('./server/data/historicalCutoffsTrendsData');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('===============================================================');
console.log('  EXAMVERSE PHASE 9 AUTOMATED VERIFICATION SUITE');
console.log('===============================================================\n');

// -------------------------------------------------------------
// GROUP 1: Career Pathway Graph & Kahn's Topological Sort
// -------------------------------------------------------------
console.log('Group 1: Career Pathway Graph & Kahn\'s Topological Sort');

runTest('Graph dataset has at least 30 nodes and 30 edges across 5 streams', () => {
  assert(PATHWAY_NODES.length >= 30, `Expected >=30 nodes, got ${PATHWAY_NODES.length}`);
  assert(PATHWAY_EDGES.length >= 30, `Expected >=30 edges, got ${PATHWAY_EDGES.length}`);
});

runTest('Kahn\'s algorithm detects official DAG has 0 cycles and valid topological order', () => {
  const result = pathwayEngine.kahnTopologicalSort();
  assert.strictEqual(result.hasCycle, false, 'Expected DAG with no cycles');
  assert.strictEqual(result.isDAG, true);
  assert.strictEqual(result.sortedNodeIds.length, PATHWAY_NODES.length, 'All nodes should be topologically ordered');

  // Prerequisite order: 12th science must appear before btech engineering
  const idx12th = result.sortedNodeIds.indexOf('node-12th-science-pcm');
  const idxBtech = result.sortedNodeIds.indexOf('node-btech-engineering');
  const idxGate = result.sortedNodeIds.indexOf('node-gate-exam');
  const idxPsu = result.sortedNodeIds.indexOf('node-psu-executive-trainee');

  assert(idx12th !== -1 && idxBtech !== -1 && idxGate !== -1 && idxPsu !== -1, 'Core engineering pathway nodes missing');
  assert(idx12th < idxBtech, '12th Science must precede B.Tech Engineering');
  assert(idxBtech < idxGate, 'B.Tech Engineering must precede GATE Exam');
  assert(idxGate < idxPsu, 'GATE Exam must precede PSU Executive Trainee');
});

runTest('Kahn\'s algorithm accurately flags injected cyclic dependency', () => {
  const cyclicNodes = [
    { id: 'node_a', label: 'Node A', type: 'QUALIFICATION', stream: 'TEST' },
    { id: 'node_b', label: 'Node B', type: 'DEGREE', stream: 'TEST' },
    { id: 'node_c', label: 'Node C', type: 'ENTRANCE_EXAM', stream: 'TEST' }
  ];
  const cyclicEdges = [
    { from: 'node_a', to: 'node_b', type: 'LEADS_TO', weightYears: 1 },
    { from: 'node_b', to: 'node_c', type: 'LEADS_TO', weightYears: 1 },
    { from: 'node_c', to: 'node_a', type: 'LEADS_TO', weightYears: 1 } // Injected Cycle!
  ];

  const testEngine = new CareerPathwayGraphEngine(cyclicNodes, cyclicEdges);
  const cycleResult = testEngine.kahnTopologicalSort();
  assert.strictEqual(cycleResult.hasCycle, true, 'Cyclic dependency must be detected');
  assert.strictEqual(cycleResult.isDAG, false);
  assert(cycleResult.cycleNodes.length > 0, 'Should return participating cyclic nodes');
});

// -------------------------------------------------------------
// GROUP 2: Dijkstra's Multi-Criteria Shortest Path Algorithm
// -------------------------------------------------------------
console.log('\nGroup 2: Dijkstra Multi-Objective Shortest Path Engine');

runTest('Dijkstra finds shortest path from 12th Science to PSU Executive Trainee (FASTEST)', () => {
  const result = pathwayEngine.findOptimalPathway('node-12th-science-pcm', 'node-psu-executive-trainee', 'FASTEST');
  assert.strictEqual(result.found, true, 'Path should be found');
  assert(result.pathNodes.length >= 3, `Expected at least 3 nodes in path, got ${result.pathNodes.length}`);
  assert.strictEqual(result.pathNodes[0].id, 'node-12th-science-pcm');
  assert.strictEqual(result.pathNodes[result.pathNodes.length - 1].id, 'node-psu-executive-trainee');
  assert(result.totalEstimatedYears > 0, `Total years should be positive, got ${result.totalEstimatedYears}`);
  assert(result.totalEstimatedCostINR >= 0, `Total cost should be non-negative, got ${result.totalEstimatedCostINR}`);
});

runTest('Dijkstra handles alternative objectives (FASTEST, LOWEST_COST, HIGHEST_SYNERGY)', () => {
  const fastest = pathwayEngine.findOptimalPathway('node-12th-science-pcm', 'node-psu-executive-trainee', 'FASTEST');
  const lowestCost = pathwayEngine.findOptimalPathway('node-12th-science-pcm', 'node-psu-executive-trainee', 'LOWEST_COST');
  const synergy = pathwayEngine.findOptimalPathway('node-12th-science-pcm', 'node-psu-executive-trainee', 'HIGHEST_SYNERGY');

  assert(fastest.found && lowestCost.found && synergy.found);
  assert.strictEqual(fastest.objective, 'FASTEST');
  assert.strictEqual(lowestCost.objective, 'LOWEST_COST');
  assert.strictEqual(synergy.objective, 'HIGHEST_SYNERGY');
});

runTest('Dijkstra correctly reports unreachable destinations across disjoint streams', () => {
  const unreachable = pathwayEngine.findOptimalPathway('node-12th-arts', 'node-mbbs-degree', 'FASTEST');
  assert.strictEqual(unreachable.found, false);
});

runTest('RankAlternativePathways returns multi-criteria comparative bundle with Epistemic Badge', () => {
  const bundle = pathwayEngine.rankAlternativePathways('node-12th-science-pcm', 'node-iit-mtech');
  assert.strictEqual(bundle.targetNodeId, 'node-iit-mtech');
  assert(bundle.alternatives.fastest !== null, 'Should return fastest pathway');
  assert(bundle.epistemicHonestyBadge.includes('Not an Appointment Guarantee'));
});

// -------------------------------------------------------------
// GROUP 3: Interval-Tree Exam Clash Engine
// -------------------------------------------------------------
console.log('\nGroup 3: Interval-Tree Temporal Clash Detection Engine');

runTest('Interval Tree accurately detects HARD_CLASH on identical/overlapping shifts', () => {
  const tree = new IntervalTree();
  const event1 = {
    id: 'exam_a',
    title: 'GATE 2026 Shift 1',
    startMs: new Date('2026-02-07T09:30:00Z').getTime(),
    endMs: new Date('2026-02-07T12:30:00Z').getTime()
  };
  const event2 = {
    id: 'exam_b',
    title: 'State PSC Prelims Shift 1',
    startMs: new Date('2026-02-07T10:00:00Z').getTime(),
    endMs: new Date('2026-02-07T12:00:00Z').getTime()
  };

  tree.insert(event1.startMs, event1.endMs, event1);
  const overlaps = tree.findOverlaps(event2.startMs, event2.endMs);
  assert.strictEqual(overlaps.length, 1);
  assert.strictEqual(overlaps[0].id, 'exam_a');
});

runTest('detectClashes flags HARD_CLASH and TRAVEL_LOGISTICS_RISK (<24h buffer)', () => {
  const mockSchedule = [
    {
      id: 'exam_1',
      title: 'UPSC Civil Services Prelims GS Paper 1',
      examDate: '2026-05-24',
      shift: 'MORNING'
    },
    {
      id: 'exam_2',
      title: 'State Forest Service Prelims',
      examDate: '2026-05-24',
      shift: 'MORNING' // Direct HARD CLASH (Same date & shift)
    },
    {
      id: 'exam_3',
      title: 'Banking Specialist Officer Mains',
      examDate: '2026-05-25',
      shift: 'MORNING' // Exactly next morning (<24h gap from Exam 1 end) -> TRAVEL_LOGISTICS_RISK
    },
    {
      id: 'exam_4',
      title: 'GATE Computer Science Shift',
      examDate: '2026-02-07',
      shift: 'AFTERNOON' // Distant date -> No clash
    }
  ];

  const report = detectClashes(mockSchedule);
  assert.strictEqual(report.success, true);
  assert(report.clashSummary.totalClashes >= 2, `Expected >=2 clashes, got ${report.clashSummary.totalClashes}`);
  assert(report.hardClashes.length >= 1, `Expected >=1 hard clash, got ${report.hardClashes.length}`);
  assert(report.travelRisks.length >= 1, `Expected >=1 travel risk, got ${report.travelRisks.length}`);

  const hardClash = report.hardClashes[0];
  assert.strictEqual(hardClash.type, 'HARD_CLASH');
  assert.strictEqual(hardClash.severity, 'CRITICAL');

  const travelRisk = report.travelRisks[0];
  assert.strictEqual(travelRisk.type, 'TRAVEL_LOGISTICS_RISK');
  assert(travelRisk.separationHours > 0 && travelRisk.separationHours < 24);
});

// -------------------------------------------------------------
// GROUP 4: RFC 5545 Calendar Generation with VALARM Alarms
// -------------------------------------------------------------
console.log('\nGroup 4: RFC 5545 iCalendar (.ICS) Export with VALARM Alarms');

runTest('generateIcsCalendar produces valid RFC 5545 structure with 7d, 72h, 24h VALARM blocks', () => {
  const events = [
    {
      id: 'gate-2026',
      title: 'GATE 2026 Official Paper CS',
      code: 'GATE-CS',
      organization: 'IIT Guwahati',
      examDate: '2026-02-07',
      applicationLastDate: '2025-10-15',
      category: 'Engineering Entrance'
    }
  ];

  const ics = generateIcsCalendar(events, { calendarName: 'EXAMVERSE Test Calendar' });
  assert(ics.includes('BEGIN:VCALENDAR'), 'Missing BEGIN:VCALENDAR');
  assert(ics.includes('VERSION:2.0'), 'Missing VERSION:2.0');
  assert(ics.includes('PRODID:-//EXAMVERSE//National Examination Ecosystem RFC5545//EN'), 'Missing PRODID');
  assert(ics.includes('BEGIN:VEVENT'), 'Missing BEGIN:VEVENT');
  assert(ics.includes('SUMMARY:GATE 2026 Official Paper CS'), 'Missing SUMMARY');
  assert(ics.includes('BEGIN:VALARM'), 'Missing BEGIN:VALARM');
  assert(ics.includes('TRIGGER:-P7D'), 'Missing 7-day VALARM trigger');
  assert(ics.includes('TRIGGER:-PT72H'), 'Missing 72-hour VALARM trigger');
  assert(ics.includes('TRIGGER:-PT24H'), 'Missing 24-hour VALARM trigger');
  assert(ics.includes('END:VEVENT'), 'Missing END:VEVENT');
  assert(ics.includes('END:VCALENDAR'), 'Missing END:VCALENDAR');
});

// -------------------------------------------------------------
// GROUP 5: 7th CPC & PSU IDA Salary Calculator & Service Bonds
// -------------------------------------------------------------
console.log('\nGroup 5: Authoritative 7th CPC & PSU IDA Salary Calculator');

runTest('7th CPC Level 10 (UPSC CSE / Group A Officer, Basic ₹56,100) calculates exact allowances & deductions', () => {
  const res = salaryEngine.calculate7thCpcSalary({
    level: 10,
    cityClass: 'X',
    daPercent: 50,
    customBasic: 56100
  });

  assert.strictEqual(res.earnings.basicPay, 56100);
  assert.strictEqual(res.earnings.dearnessAllowance, 28050, 'DA at 50% should be ₹28,050');
  assert.strictEqual(res.earnings.houseRentAllowance, 16830, 'HRA at 30% for Class X should be ₹16,830');
  assert.strictEqual(res.earnings.transportAllowance, 10800, 'TPTA (7200 + 3600 DA) should be ₹10,800');

  const expectedGross = 56100 + 28050 + 16830 + 10800;
  assert.strictEqual(res.earnings.grossMonthly, expectedGross, `Expected gross ₹${expectedGross}, got ₹${res.earnings.grossMonthly}`);

  // NPS deduction = 10% of (Basic + DA) = 10% of 84150 = 8415
  assert.strictEqual(res.deductions.npsEmployeeTier1, 8415, 'NPS deduction should be ₹8,415');
  assert(res.netMonthlyInHand > 0);
  assert.strictEqual(res.netMonthlyInHand, Number((res.earnings.grossMonthly - res.deductions.totalDeductions).toFixed(2)));
  assert(res.statutoryCitation.includes('7th Central Pay Commission'));
});

runTest('7th CPC HRA rates adjust correctly for Class X (30%), Class Y (20%), and Class Z (10%)', () => {
  const resX = salaryEngine.calculate7thCpcSalary({ level: 7, cityClass: 'X', customBasic: 44900 });
  const resY = salaryEngine.calculate7thCpcSalary({ level: 7, cityClass: 'Y', customBasic: 44900 });
  const resZ = salaryEngine.calculate7thCpcSalary({ level: 7, cityClass: 'Z', customBasic: 44900 });

  assert.strictEqual(resX.earnings.houseRentAllowance, Math.round(44900 * 0.30));
  assert.strictEqual(resY.earnings.houseRentAllowance, Math.round(44900 * 0.20));
  assert.strictEqual(resZ.earnings.houseRentAllowance, Math.round(44900 * 0.10));
});

runTest('PSU IDA E2 Grade (Executive Trainee, Basic ₹50,000) calculates IDA, Perks, and In-hand', () => {
  const res = salaryEngine.calculatePsuIdaSalary({
    grade: 'E2',
    cityClass: 'X',
    idaPercent: 43.8,
    customBasic: 50000
  });

  assert.strictEqual(res.earnings.basicPay, 50000);
  assert.strictEqual(res.earnings.industrialDearnessAllowance, Math.round(50000 * 0.438)); // 21900
  assert.strictEqual(res.earnings.cafeteriaPerks35Pct, Math.round(50000 * 0.35)); // 17500
  assert(res.earnings.grossMonthly > 50000);
  assert(res.netMonthlyInHand > 0);
  assert.strictEqual(res.scaleRange, '₹50,000 - ₹1,60,000');
});

runTest('Service Bonds registry returns official bond data for IOCL, NTPC, ISRO and UPSC CSE', () => {
  const allBonds = salaryEngine.getServiceBonds();
  assert(allBonds.length >= 6, `Expected >=6 bonds, got ${allBonds.length}`);

  const ioclBond = salaryEngine.getServiceBonds('iocl')[0];
  assert(ioclBond, 'IOCL bond missing');
  assert.strictEqual(ioclBond.bondAmountINR, 300000);
  assert.strictEqual(ioclBond.bondPeriodYears, 3);

  const upscBond = salaryEngine.getServiceBonds('upsc')[0];
  assert(upscBond, 'UPSC CSE bond entry missing');
  assert.strictEqual(upscBond.bondAmountINR, 0, 'UPSC CSE should have 0 bond amount');
});

// -------------------------------------------------------------
// GROUP 6: Document Readiness Standards & Historical Trends
// -------------------------------------------------------------
console.log('\nGroup 6: Document Readiness Standards & Historical Trends');

runTest('Document Readiness standards enforce April 1 FY rule for OBC-NCL and EWS', () => {
  assert(DOCUMENT_READINESS_STANDARDS.length >= 5, `Expected >=5 standards, got ${DOCUMENT_READINESS_STANDARDS.length}`);

  const obcNcl = DOCUMENT_READINESS_STANDARDS.find(s => s.categoryCode === 'OBC_NCL');
  assert(obcNcl, 'OBC-NCL standard missing');
  assert(obcNcl.financialYearRule.includes('April 1'));
  assert(obcNcl.criticalPitfallWarning.includes('Creamy Layer'));

  const ews = DOCUMENT_READINESS_STANDARDS.find(s => s.categoryCode === 'EWS');
  assert(ews, 'EWS standard missing');
  assert(ews.financialYearRule.includes('Financial Year'));
  assert(ews.criticalPitfallWarning.includes('₹8 Lakhs'));

  const photo = DOCUMENT_READINESS_STANDARDS.find(s => s.categoryCode === 'PHOTO_SIGNATURE');
  assert(photo, 'Photo/Signature standard missing');
  assert(photo.criticalPitfallWarning.includes('CAPITAL LETTERS'));
});

runTest('Historical Exam Trends contain 5-10 year trajectories with HISTORICAL badges', () => {
  assert(HISTORICAL_EXAM_TRENDS['upsc-cse'], 'UPSC CSE trends missing');
  assert(HISTORICAL_EXAM_TRENDS['gate-cs'], 'GATE CS trends missing');
  assert(HISTORICAL_EXAM_TRENDS['ssc-cgl'], 'SSC CGL trends missing');
  assert(HISTORICAL_EXAM_TRENDS['ibps-po'], 'IBPS PO trends missing');

  const upscTraj = HISTORICAL_EXAM_TRENDS['upsc-cse'].trajectory;
  assert(upscTraj.length >= 7, `Expected >=7 years of UPSC data, got ${upscTraj.length}`);
  upscTraj.forEach(item => {
    assert(item.year >= 2018 && item.year <= 2025);
    assert.strictEqual(item.status, 'HISTORICAL');
    assert(item.prelimsCutoffGen > 0);
  });
});

console.log('\n===============================================================');
console.log(`  PHASE 9 VERIFICATION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('===============================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  process.exit(0);
}
