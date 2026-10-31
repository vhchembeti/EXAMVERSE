// server/data/goldenNotificationSet.js
// 5 Statutory Benchmark Gazettes with Annotated Ground Truth for AI/Regex Extraction Precision & Recall Validation

const goldenNotificationSet = [
  {
    id: "golden-upsc-cse-2026",
    name: "UPSC Civil Services Examination 2026 Gazette Notification",
    authority: "UPSC",
    documentText: `
UNION PUBLIC SERVICE COMMISSION
EXAMINATION NOTICE NO. 05/2026-CSP
DATE OF NOTIFICATION: 11.02.2026
CIVIL SERVICES EXAMINATION, 2026
(LAST DATE FOR RECEIPT OF APPLICATIONS: 03.03.2026 UP TO 18:00 HOURS)

CANDIDATES TO ENSURE THEIR ELIGIBILITY FOR THE EXAMINATION:
All candidates must apply online through the website https://upsconline.nic.in.
1. Number of Vacancies: The number of vacancies to be filled through the examination is expected to be approximately 1056 including 40 vacancies reserved for Persons with Benchmark Disabilities.
2. Age Limits:
A candidate must have attained the age of 21 years and must not have attained the age of 32 years on the 1st of August, 2026 i.e., the candidate must have been born not earlier than 2nd August, 1994 and not later than 1st August, 2005.
3. Minimum Educational Qualifications:
The candidate must hold a Graduate Degree of any of the Universities incorporated by an Act of the Central or State Legislature in India.
4. Application Fee:
Candidates are required to pay a fee of Rs. 100/- (Rupees One Hundred only) either by remitting the money in any Branch of SBI or by using Visa/Master/RuPay Credit/Debit Card/UPI. Female/SC/ST/PwBD candidates are exempted from payment of fee.
5. Plan of Examination:
The Civil Services Examination will consist of two successive stages:
(i) Civil Services (Preliminary) Examination (Objective type) scheduled to be held on 24.05.2026.
(ii) Civil Services (Main) Examination (Written and Interview).
Online applications can be submitted from 11/02/2026 to 03/03/2026 till 6:00 PM.
Official portal: https://upsc.gov.in
    `,
    groundTruth: {
      advtNumber: "05/2026-CSP",
      authority: "UPSC",
      examCycle: "2026",
      registrationStartDate: "2026-02-11",
      registrationEndDate: "2026-03-03",
      examDate: "2026-05-24",
      totalVacancies: 1056,
      minAge: 21,
      maxAge: 32,
      ageCutOffDate: "2026-08-01",
      applicationFeeGeneral: 100,
      qualification: "Graduate Degree"
    }
  },

  {
    id: "golden-ssc-cgl-2026",
    name: "SSC Combined Graduate Level (CGL) 2026 Official Notice",
    authority: "SSC",
    documentText: `
STAFF SELECTION COMMISSION
(Government of India)
NOTICE
COMBINED GRADUATE LEVEL EXAMINATION, 2026
F. No. 3/1/2026-P&P-I
Dated: 24.06.2026

Dates for submission of online applications: 24.06.2026 to 24.07.2026
Last date and time for receipt of online applications: 24.07.2026 (23:00 hours)
Schedule of Computer Based Examination (Tier-I): Tentatively scheduled from 15.09.2026 to 26.09.2026.

Vacancies and Reservation:
There are approximately 17727 tentative vacancies for various Group 'B' and Group 'C' posts in ministries and departments of Government of India.
Age Limit (as on 01.08.2026):
Permissible age limit is generally 18 to 30 years (with certain Inspector posts allowing up to 32 years). A candidate must have attained minimum 18 years and maximum 30 years as on 01-08-2026.
Essential Educational Qualifications:
Bachelor's Degree from a recognized University or equivalent. Final year candidates can also apply provided they acquire the degree before the cut-off date.
Application Fee:
Fee payable: Rs 100/- (Rs one hundred only). Women candidates and candidates belonging to SC, ST, and ESM eligible for reservation are exempted.
Website: https://ssc.gov.in
    `,
    groundTruth: {
      advtNumber: "3/1/2026-P&P-I",
      authority: "SSC",
      examCycle: "2026",
      registrationStartDate: "2026-06-24",
      registrationEndDate: "2026-07-24",
      examDate: "2026-09-15",
      totalVacancies: 17727,
      minAge: 18,
      maxAge: 30,
      ageCutOffDate: "2026-08-01",
      applicationFeeGeneral: 100,
      qualification: "Bachelor's Degree"
    }
  },

  {
    id: "golden-rrb-ntpc-2026",
    name: "Railway Recruitment Boards Non-Technical Popular Categories (NTPC) Notification",
    authority: "RRB",
    documentText: `
GOVERNMENT OF INDIA, MINISTRY OF RAILWAYS
RAILWAY RECRUITMENT BOARDS
CENTRALIZED EMPLOYMENT NOTICE (CEN) No. 01/2026
RECRUITMENT OF NON-TECHNICAL POPULAR CATEGORIES (NTPC) GRADUATE POSTS

Opening date of online application: 14.09.2026
Closing date for submission of online application: 13.10.2026 (23.59 hrs)
Computer Based Test (CBT 1) Tentative Dates: December 2026 / 15.12.2026.

1. VACANCIES:
Applications are invited from eligible Indian Nationals for 11558 vacancies in Graduate and Undergraduate posts across 21 Railway Recruitment Boards.
2. AGE LIMIT (as on 01.01.2026):
For Graduate level posts, the age limit is 18 to 36 years (inclusive of 3 years Covid relaxation).
Minimum Age: 18 Years.
Maximum Age: 36 Years.
3. EDUCATIONAL QUALIFICATION:
Degree from recognized university or equivalent.
4. EXAMINATION FEE:
For all candidates except categories exempted: Rs. 500/- (Rs. 400 refundable on CBT-1 attendance). For SC/ST/Ex-Servicemen/Female/Transgender: Rs. 250/- (Fully refundable).
Official website: https://indianrailways.gov.in
    `,
    groundTruth: {
      advtNumber: "CEN 01/2026",
      authority: "RRB",
      examCycle: "2026",
      registrationStartDate: "2026-09-14",
      registrationEndDate: "2026-10-13",
      examDate: "2026-12-15",
      totalVacancies: 11558,
      minAge: 18,
      maxAge: 36,
      ageCutOffDate: "2026-01-01",
      applicationFeeGeneral: 500,
      qualification: "Degree from recognized university"
    }
  },

  {
    id: "golden-gate-2026",
    name: "GATE 2026 Official Information Brochure",
    authority: "IIT-ROORKEE",
    documentText: `
GRADUATE APTITUDE TEST IN ENGINEERING (GATE 2026)
ORGANIZING INSTITUTE: INDIAN INSTITUTE OF TECHNOLOGY ROORKEE
OFFICIAL INFORMATION BROCHURE & NOTIFICATION

Online Application Processing System (GOAPS) Website Opens: 28th August 2025 (28.08.2025)
Closing Date of Regular Online Application: 26th September 2025 (26.09.2025)
End of Extended Period with Late Fee: 07th October 2025 (07.10.2025)
GATE 2026 Examination Dates: 07, 08, 14 and 15 February 2026 (First Session: 07.02.2026).

Eligibility Criteria:
A candidate who is currently studying in the 3rd or higher years of any undergraduate degree program OR has already completed any government approved degree program in Engineering / Technology / Architecture / Science / Commerce / Arts is eligible for appearing in the GATE 2026 exam.
Age Criteria:
There is NO AGE LIMIT for appearing in the GATE 2026 examination. (Minimum Age: 18, Maximum Age: No Limit).
Application Fee:
Female/SC/ST/PwD candidates per test paper: Rs 900 (Regular period). All other candidates per test paper: Rs 1800 (Regular period).
Official URL: https://gate2026.iitr.ac.in
    `,
    groundTruth: {
      advtNumber: "GATE-2026-BROCHURE",
      authority: "IIT-ROORKEE",
      examCycle: "2026",
      registrationStartDate: "2025-08-28",
      registrationEndDate: "2025-09-26",
      examDate: "2026-02-07",
      totalVacancies: null, // Entrance exam, not recruitment
      minAge: 18,
      maxAge: null,
      ageCutOffDate: null,
      applicationFeeGeneral: 1800,
      qualification: "Engineering / Technology / Science / Arts"
    }
  },

  {
    id: "golden-appsc-group1-2026",
    name: "Andhra Pradesh PSC Group-I Services Notification",
    authority: "APPSC",
    documentText: `
ANDHRA PRADESH PUBLIC SERVICE COMMISSION: VIJAYAWADA
NOTIFICATION NO. 16/2026, DATED: 08/01/2026
DIRECT RECRUITMENT TO THE POSTS OF GROUP-I SERVICES IN A.P. GENERAL SERVICE

Applications are invited online for recruitment to 89 posts falling under Group-I Services in Andhra Pradesh.
The Commission will conduct Preliminary Examination (Screening Test) in offline mode on 17/03/2026.
Main Examination (Descriptive type) will be held from August 2026.

Important Dates:
Opening date for online submission of applications: 01/01/2026.
Last date for submission of online applications: 21/01/2026 up to 11:59 midnight.
Age Limit (as on 01/07/2026):
Minimum 18 years and Maximum 42 years as on 01/07/2026.
Educational Qualifications:
A candidate must possess a Degree from any University in India established or incorporated by or under a Central Act, Provincial Act or a State Act.
Application Fee:
Applicant must pay Rs. 250/- towards application processing fee and Rs. 120/- towards examination fee (Total Rs. 370/- for general candidates).
Website: https://psc.ap.gov.in
    `,
    groundTruth: {
      advtNumber: "16/2026",
      authority: "APPSC",
      examCycle: "2026",
      registrationStartDate: "2026-01-01",
      registrationEndDate: "2026-01-21",
      examDate: "2026-03-17",
      totalVacancies: 89,
      minAge: 18,
      maxAge: 42,
      ageCutOffDate: "2026-07-01",
      applicationFeeGeneral: 370,
      qualification: "Degree from any University"
    }
  }
];

module.exports = goldenNotificationSet;
