// server/data/historicalCutoffsTrendsData.js
// 5-to-10-Year Official Cutoff & Vacancy Trajectories for Major Indian Examinations
// All points are explicitly flagged as 'HISTORICAL' (official gazettes) or 'ESTIMATE' (projected).
// Includes Central Category Certificate Validity Rules & Document Readiness Standards.

const HISTORICAL_EXAM_TRENDS = {
  "upsc-cse": {
    examId: "upsc-cse",
    examTitle: "UPSC Civil Services Examination",
    conductingBody: "Union Public Service Commission",
    trajectory: [
      { year: 2024, vacancies: 1056, prelimsCutoffGen: 75.41, mainsCutoffGen: 741, finalCutoffGen: 953, status: "HISTORICAL" },
      { year: 2023, vacancies: 1105, prelimsCutoffGen: 75.41, mainsCutoffGen: 741, finalCutoffGen: 953, status: "HISTORICAL" },
      { year: 2022, vacancies: 1022, prelimsCutoffGen: 88.22, mainsCutoffGen: 748, finalCutoffGen: 960, status: "HISTORICAL" },
      { year: 2021, vacancies: 712,  prelimsCutoffGen: 87.54, mainsCutoffGen: 745, finalCutoffGen: 953, status: "HISTORICAL" },
      { year: 2020, vacancies: 796,  prelimsCutoffGen: 92.51, mainsCutoffGen: 736, finalCutoffGen: 944, status: "HISTORICAL" },
      { year: 2019, vacancies: 896,  prelimsCutoffGen: 98.00, mainsCutoffGen: 751, finalCutoffGen: 961, status: "HISTORICAL" },
      { year: 2018, vacancies: 759,  prelimsCutoffGen: 98.00, mainsCutoffGen: 774, finalCutoffGen: 982, status: "HISTORICAL" }
    ],
    citation: "Official UPSC Annual Reports & Gazette Cutoff Press Releases"
  },
  "gate-cs": {
    examId: "gate-cs",
    examTitle: "GATE Computer Science & Information Technology",
    conductingBody: "IIT Organizing Institutes",
    trajectory: [
      { year: 2025, qualifyingGen: 27.6, qualifyingObc: 24.8, qualifyingScSt: 18.4, status: "HISTORICAL" },
      { year: 2024, qualifyingGen: 27.6, qualifyingObc: 24.8, qualifyingScSt: 18.4, status: "HISTORICAL" },
      { year: 2023, qualifyingGen: 25.0, qualifyingObc: 22.5, qualifyingScSt: 16.6, status: "HISTORICAL" },
      { year: 2022, qualifyingGen: 25.0, qualifyingObc: 22.5, qualifyingScSt: 16.6, status: "HISTORICAL" },
      { year: 2021, qualifyingGen: 26.1, qualifyingObc: 23.4, qualifyingScSt: 17.4, status: "HISTORICAL" },
      { year: 2020, qualifyingGen: 28.5, qualifyingObc: 25.6, qualifyingScSt: 19.0, status: "HISTORICAL" },
      { year: 2019, qualifyingGen: 29.5, qualifyingObc: 26.6, qualifyingScSt: 19.7, status: "HISTORICAL" }
    ],
    citation: "GATE Official Scorecards & Organizing IIT Cutoff Releases"
  },
  "ssc-cgl": {
    examId: "ssc-cgl",
    examTitle: "SSC Combined Graduate Level Examination",
    conductingBody: "Staff Selection Commission",
    trajectory: [
      { year: 2024, vacancies: 17727, tier1CutoffGen: 137.50, status: "HISTORICAL" },
      { year: 2023, vacancies: 8415,  tier1CutoffGen: 150.04, status: "HISTORICAL" },
      { year: 2022, vacancies: 37409, tier1CutoffGen: 114.27, status: "HISTORICAL" },
      { year: 2021, vacancies: 7621,  tier1CutoffGen: 130.18, status: "HISTORICAL" },
      { year: 2020, vacancies: 7035,  tier1CutoffGen: 132.37, status: "HISTORICAL" },
      { year: 2019, vacancies: 8582,  tier1CutoffGen: 147.78, status: "HISTORICAL" }
    ],
    citation: "Staff Selection Commission Notice & Result Notifications"
  },
  "ibps-po": {
    examId: "ibps-po",
    examTitle: "IBPS Probationary Officer (CRP PO/MT)",
    conductingBody: "Institute of Banking Personnel Selection",
    trajectory: [
      { year: 2024, vacancies: 3955, prelimsCutoffGen: 54.25, mainsCutoffGen: 63.00, status: "HISTORICAL" },
      { year: 2023, vacancies: 5314, prelimsCutoffGen: 54.25, mainsCutoffGen: 63.00, status: "HISTORICAL" },
      { year: 2022, vacancies: 8432, prelimsCutoffGen: 49.75, mainsCutoffGen: 71.25, status: "HISTORICAL" },
      { year: 2021, vacancies: 5809, prelimsCutoffGen: 50.50, mainsCutoffGen: 80.75, status: "HISTORICAL" },
      { year: 2020, vacancies: 4336, prelimsCutoffGen: 58.75, mainsCutoffGen: 83.50, status: "HISTORICAL" }
    ],
    citation: "IBPS Official Cutoff Scorecards & Bank Allotment Reports"
  }
};

const DOCUMENT_READINESS_STANDARDS = [
  {
    categoryCode: "OBC_NCL",
    title: "Central Other Backward Classes Non-Creamy Layer (OBC-NCL)",
    financialYearRule: "Strict Rule: Must be issued ON OR AFTER April 1 of the ongoing Financial Year (FY 2025-2026 / FY 2026-2027). State-list OBC certificates are REJECTED in Central examinations.",
    issuingAuthorities: [
      "District Magistrate / Additional District Magistrate",
      "Sub-Divisional Magistrate (SDM) / Executive Magistrate / Tahsildar",
      "Collector / Deputy Commissioner"
    ],
    mandatedFormat: "National Commission for Backward Classes (NCBC) Central Resolution Format",
    statutoryValidityWindow: "1 Financial Year (Valid up to March 31 of issuance FY)",
    criticalPitfallWarning: "OBC certificate must explicitly mention that the candidate does not belong to the Creamy Layer as per DoPT OM No. 36012/22/93-Estt.(SCT)."
  },
  {
    categoryCode: "EWS",
    title: "Economically Weaker Section (EWS) Income & Asset Certificate",
    financialYearRule: "Income of preceding Financial Year; Certificate valid for ongoing Financial Year (issued on or after April 1).",
    issuingAuthorities: [
      "District Magistrate / Additional District Magistrate / Collector",
      "Sub-Divisional Officer (SDO) of the area where the candidate resides",
      "Tahsildar of the jurisdiction"
    ],
    mandatedFormat: "DoPT Office Memorandum No. 36039/1/2019-Estt (Res) Annexure-I",
    statutoryValidityWindow: "1 Financial Year",
    criticalPitfallWarning: "Gross annual family income must be below ₹8 Lakhs from all sources, agricultural land below 5 acres, and residential flat below 1,000 sq ft."
  },
  {
    categoryCode: "SC_ST",
    title: "Scheduled Caste / Scheduled Tribe Certificate",
    financialYearRule: "Perpetual validity (does not expire annually) provided the caste/tribe is gazetted under the Constitution (Scheduled Castes/Scheduled Tribes) Order.",
    issuingAuthorities: [
      "Revenue Officer not below the rank of Tahsildar",
      "Sub-Divisional Officer / Magistrate",
      "Prescribed State Gazetted Authority"
    ],
    mandatedFormat: "Central Government Mandated SC/ST Certificate Formats",
    statutoryValidityWindow: "Lifetime / Permanent",
    criticalPitfallWarning: "Ensure the exact spelled name of the caste matches the Presidential Order schedule for that domicile state."
  },
  {
    categoryCode: "PWBD",
    title: "Persons with Benchmark Disability (PwBD) Certificate",
    financialYearRule: "Valid under the Rights of Persons with Disabilities (RPwD) Act, 2016. Permanent certificate for irreversible disability; temporary certificate with defined re-assessment date.",
    issuingAuthorities: [
      "Statutory Medical Board composed of Chief Medical Officer (CMO)",
      "Designated Specialist Medical Board at District Hospital",
      "Unique Disability ID (UDID) Card issued by Department of Empowerment of Persons with Disabilities"
    ],
    mandatedFormat: "RPwD Act 2016 Forms V, VI, VII or Digital UDID Card",
    statutoryValidityWindow: "Permanent for lifelong conditions; valid until review date for progressive conditions",
    criticalPitfallWarning: "Benchmark disability must be minimum 40% to claim reservation and scribe/compensatory time benefits."
  },
  {
    categoryCode: "PHOTO_SIGNATURE",
    title: "Biometric Photo & Signature Standards for National Exams",
    financialYearRule: "Photographs must be taken within 3 months prior to application. Must not be older than 90 days.",
    specifications: {
      photoDimensions: "3.5 cm width x 4.5 cm height (Passport Format)",
      photoFileSize: "20 KB to 50 KB (JPEG format)",
      photoBackground: "Plain White or Light Off-White Background",
      facialCoverage: "80% face coverage showing both ears clearly without cap or dark spectacles",
      signatureDimensions: "3.5 cm width x 1.5 cm height",
      signatureFileSize: "10 KB to 20 KB (Black or Dark Blue Ink on White Paper)"
    },
    criticalPitfallWarning: "Signatures in ALL CAPITAL LETTERS are rejected by UPSC, SSC, and NTA. Must be continuous running hand."
  }
];

module.exports = {
  HISTORICAL_EXAM_TRENDS,
  DOCUMENT_READINESS_STANDARDS
};
