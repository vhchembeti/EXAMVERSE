// server/data/payMatrix7thCpcData.js
// Authoritative 7th Central Pay Commission (CPC) Pay Matrix & PSU IDA Compensation Data
// Sourced from Ministry of Finance Gazette, Department of Public Enterprises (DPE), and PSU Service Rules.

const CENTRAL_PAY_MATRIX_LEVELS = [
  {
    level: 1,
    gradePayOld: 1800,
    startingBasic: 18000,
    maxBasic: 56900,
    designationExamples: "Multi-Tasking Staff (MTS), Railway Track Maintainer, Peon",
    classification: "Group 'C' Non-Gazetted",
    tptaCategory: "LEVEL_1_2"
  },
  {
    level: 2,
    gradePayOld: 1900,
    startingBasic: 19900,
    maxBasic: 63200,
    designationExamples: "Lower Division Clerk (LDC), Police Constable, Junior Assistant",
    classification: "Group 'C' Non-Gazetted",
    tptaCategory: "LEVEL_1_2"
  },
  {
    level: 3,
    gradePayOld: 2000,
    startingBasic: 21700,
    maxBasic: 69100,
    designationExamples: "Head Constable, Railway Assistant Loco Pilot (ALP), Commercial Clerk",
    classification: "Group 'C' Non-Gazetted",
    tptaCategory: "LEVEL_3_8"
  },
  {
    level: 4,
    gradePayOld: 2400,
    startingBasic: 25500,
    maxBasic: 81100,
    designationExamples: "Postal Assistant, Sorting Assistant, Data Entry Operator (DEO Grade A)",
    classification: "Group 'C' Non-Gazetted",
    tptaCategory: "LEVEL_3_8"
  },
  {
    level: 5,
    gradePayOld: 2800,
    startingBasic: 29200,
    maxBasic: 92300,
    designationExamples: "Senior Clerk cum Typist, Auditor (CAG/CGDA Entry Level), Accountant",
    classification: "Group 'C' Non-Gazetted",
    tptaCategory: "LEVEL_3_8"
  },
  {
    level: 6,
    gradePayOld: 4200,
    startingBasic: 35400,
    maxBasic: 112400,
    designationExamples: "Junior Engineer (SSC JE / RRB JE), Sub-Inspector (Delhi Police / CAPF)",
    classification: "Group 'B' Non-Gazetted",
    tptaCategory: "LEVEL_3_8"
  },
  {
    level: 7,
    gradePayOld: 4600,
    startingBasic: 44900,
    maxBasic: 142400,
    designationExamples: "Inspector of Income Tax, Central Excise Inspector, Assistant Section Officer (ASO)",
    classification: "Group 'B' Non-Gazetted",
    tptaCategory: "LEVEL_3_8"
  },
  {
    level: 8,
    gradePayOld: 4800,
    startingBasic: 47600,
    maxBasic: 151100,
    designationExamples: "Assistant Audit Officer (AAO CAG), Assistant Accounts Officer, Senior Section Officer",
    classification: "Group 'B' Gazetted",
    tptaCategory: "LEVEL_3_8"
  },
  {
    level: 9,
    gradePayOld: 5400,
    startingBasic: 53100,
    maxBasic: 167800,
    designationExamples: "Section Officer (DoPT), Senior Superintendent, Assistant Director (Technical)",
    classification: "Group 'B' Gazetted (PB-2)",
    tptaCategory: "LEVEL_9_PLUS"
  },
  {
    level: 10,
    gradePayOld: 5400,
    startingBasic: 56100,
    maxBasic: 177500,
    designationExamples: "IAS / IPS / IFS Probationer, Assistant Executive Engineer (IES/ESE), Scientist 'B' (ISRO/DRDO/NIC), Medical Officer",
    classification: "Group 'A' Central Gazetted",
    tptaCategory: "LEVEL_9_PLUS"
  },
  {
    level: 11,
    gradePayOld: 6600,
    startingBasic: 67700,
    maxBasic: 208700,
    designationExamples: "Executive Engineer, Under Secretary, Senior Scientist, Deputy Superintendent of Police (Senior Scale)",
    classification: "Group 'A' Central Gazetted",
    tptaCategory: "LEVEL_9_PLUS"
  },
  {
    level: 12,
    gradePayOld: 7600,
    startingBasic: 78800,
    maxBasic: 209200,
    designationExamples: "Superintending Engineer, Deputy Secretary (Central Staffing), Scientist 'E'",
    classification: "Group 'A' Central Gazetted",
    tptaCategory: "LEVEL_9_PLUS"
  },
  {
    level: 13,
    gradePayOld: 8700,
    startingBasic: 123100,
    maxBasic: 215900,
    designationExamples: "Director (Government of India), Deputy Inspector General of Police (DIG), Chief Engineer",
    classification: "Group 'A' Central Gazetted",
    tptaCategory: "LEVEL_9_PLUS"
  },
  {
    level: 14,
    gradePayOld: 10000,
    startingBasic: 144200,
    maxBasic: 218200,
    designationExamples: "Joint Secretary (Government of India), Inspector General of Police (IGP), Principal Scientist",
    classification: "Group 'A' Senior Apex Cadre",
    tptaCategory: "LEVEL_9_PLUS"
  }
];

const PSU_IDA_PAY_SCALES = [
  {
    grade: "E1",
    scaleRange: "₹40,000 - ₹1,40,000",
    minBasic: 40000,
    maxBasic: 140000,
    designation: "Executive Trainee / Management Trainee / Assistant Engineer",
    typicalAnnualCTC: "₹12.5 - ₹16.0 LPA",
    sampleOrganizations: ["NTPC", "BHEL", "BEL", "SAIL", "HAL"]
  },
  {
    grade: "E2",
    scaleRange: "₹50,000 - ₹1,60,000",
    minBasic: 50000,
    maxBasic: 160000,
    designation: "Assistant Manager / Executive Engineer / Scientist-Engineer 'SC'",
    typicalAnnualCTC: "₹16.0 - ₹21.0 LPA",
    sampleOrganizations: ["ONGC", "IOCL", "PowerGrid", "GAIL", "HPCL", "ISRO", "BARC"]
  },
  {
    grade: "E3",
    scaleRange: "₹60,000 - ₹1,80,000",
    minBasic: 60000,
    maxBasic: 180000,
    designation: "Deputy Manager / Senior Engineer",
    typicalAnnualCTC: "₹21.0 - ₹27.0 LPA",
    sampleOrganizations: ["ONGC", "IOCL", "NTPC", "PowerGrid", "NPCIL"]
  }
];

const CITY_CLASSIFICATIONS = {
  X: {
    label: "Class X (Tier 1 Metros)",
    hraRatePercent: 30, // 30% after DA crossed 50%
    minHraAmount: 5400,
    cities: ["Delhi (NCT)", "Mumbai (MMR)", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Ahmedabad", "Pune"],
    tptaHigher: true
  },
  Y: {
    label: "Class Y (Tier 2 State Capitals & Industrial Cities)",
    hraRatePercent: 20, // 20% after DA crossed 50%
    minHraAmount: 3600,
    cities: ["Jaipur", "Lucknow", "Patna", "Bhopal", "Visakhapatnam", "Vijayawada", "Kochi", "Chandigarh", "Coimbatore", "Nagpur", "Indore", "Surat", "Vadodara", "Guwahati", "Bhubaneswar", "Ranchi", "Dehradun"],
    tptaHigher: false
  },
  Z: {
    label: "Class Z (All Other Towns & Rural Postings)",
    hraRatePercent: 10, // 10% after DA crossed 50%
    minHraAmount: 1800,
    cities: ["All other statutory municipalities, district headquarters, sub-divisions, and rural project sites"],
    tptaHigher: false
  }
};

const OFFICIAL_SERVICE_BONDS = [
  {
    id: "bond-iocl",
    organization: "Indian Oil Corporation Limited (IOCL)",
    cadre: "Officers / Engineers (E2 Scale)",
    bondAmountINR: 300000,
    bondPeriodYears: 3,
    probationTenureYears: 1,
    medicalStandard: "Class 1 Medical Fitness (Normal Color Vision required for Field Postings)",
    promotionalTrack: "E2 (Engineer) -> E3 (Senior Engineer in 3 yrs) -> E4 (Manager in 6 yrs)",
    sourcePdfNotice: "IOCL Engineers Recruitment 2025/2026 Official Gazette Brochure Section 14"
  },
  {
    id: "bond-isro",
    organization: "Indian Space Research Organisation (ISRO)",
    cadre: "Scientist / Engineer 'SC' (Level 10)",
    bondAmountINR: 200000,
    bondPeriodYears: 2,
    probationTenureYears: 1,
    medicalStandard: "Central Gazetted Medical Examination (Visual Acuity 6/9, No severe color blindness)",
    promotionalTrack: "Scientist SC (L10) -> Scientist SD (L11 in 4 yrs) -> Scientist SE (L12 in 8 yrs) via Merit Promotion Scheme",
    sourcePdfNotice: "ISRO ICRB Central Scientist Recruitment Rules"
  },
  {
    id: "bond-drdo",
    organization: "Defence Research & Development Organisation (DRDO)",
    cadre: "Scientist 'B' (Level 10)",
    bondAmountINR: 300000,
    bondPeriodYears: 3,
    probationTenureYears: 2,
    medicalStandard: "Ministry of Defence Civilian Gazetted Standards",
    promotionalTrack: "Scientist B (L10) -> Scientist C (L11 in 3-4 yrs) -> Scientist D (L12 in 7-8 yrs)",
    sourcePdfNotice: "DRDO RAC Scientist 'B' Information Brochure Clause 8"
  },
  {
    id: "bond-ntpc",
    organization: "NTPC Limited (Maharatna)",
    cadre: "Executive Trainee (Engineering / Finance)",
    bondAmountINR: 500000, // ₹2,50,000 for SC/ST/PwD
    bondPeriodYears: 3,
    probationTenureYears: 1,
    medicalStandard: "NTPC Medical Guidelines (Hearing, Visual, Cardiovascular screen)",
    promotionalTrack: "ET (1 yr training) -> Assistant Manager (E2) -> Deputy Manager (E3)",
    sourcePdfNotice: "NTPC Executive Trainee Service Bond Undertaking Format"
  },
  {
    id: "bond-upsc-cse",
    organization: "Union Public Service Commission (UPSC Civil Services)",
    cadre: "IAS / IPS / IFS / IRS (Level 10 entry)",
    bondAmountINR: 0,
    bondPeriodYears: 0,
    probationTenureYears: 2,
    medicalStandard: "Central Civil Services Medical Board (Strict Height/Chest standards for IPS/RPF)",
    promotionalTrack: "Junior Scale (L10, 2 yrs) -> Senior Time Scale (L11, 4 yrs) -> Junior Administrative Grade (L12, 9 yrs) -> Selection Grade (L13, 13 yrs) -> Super Time Scale (L14 Joint Secretary, 16 yrs)",
    sourcePdfNotice: "All India Services (Conduct & Cadre) Rules, 1968 & Gazette of India"
  },
  {
    id: "bond-rrb-je",
    organization: "Ministry of Railways (RRB JE)",
    cadre: "Junior Engineer (Level 6: ₹35,400 Basic)",
    bondAmountINR: 100000,
    bondPeriodYears: 5,
    probationTenureYears: 2,
    medicalStandard: "Aye-One / Aye-Two / Aye-Three (A1/A2/A3 for Operating & Loco, B1 for Civil/Mech)",
    promotionalTrack: "Junior Engineer (L6) -> Senior Section Engineer (L7, 3-5 yrs) -> Assistant Divisional Engineer (L10 LDCE)",
    sourcePdfNotice: "Indian Railway Establishment Manual (IREM) Vol 1 Para 140"
  }
];

module.exports = {
  CENTRAL_PAY_MATRIX_LEVELS,
  PSU_IDA_PAY_SCALES,
  CITY_CLASSIFICATIONS,
  OFFICIAL_SERVICE_BONDS
};
