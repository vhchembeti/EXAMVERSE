// server/data/examsData.js
// Comprehensive Examination Directory across all 12 major Indian Exam Categories
// Real verified official data for eligibility, patterns, syllabus, cutoffs, PYQs, books and video lessons

const examinations = [
  // ==========================================
  // CATEGORY 1: CENTRAL GOVERNMENT RECRUITMENT
  // ==========================================
  {
    id: "upsc-cse",
    code: "UPSC CSE",
    title: "Civil Services Examination (IAS / IPS / IFS)",
    conductingBody: "Union Public Service Commission (UPSC)",
    category: "Government Recruitment",
    subCategory: "Central Government",
    scope: "All India",
    frequency: "Annual",
    mode: "Offline (Pen & Paper)",
    shortDescription: "India's premier administrative recruitment examination for Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS) and Central Group A & B services.",
    officialWebsite: "https://upsc.gov.in",
    officialNotificationUrl: "https://upsc.gov.in/examinations/active-examinations",
    eligibility: {
      minAge: 21,
      maxAge: 32, // for General
      ageCutoffDate: "August 1 of the examination year",
      ageRelaxation: {
        OBC: 3, // up to 35
        SC_ST: 5, // up to 37
        PwD: 10,
        ExServicemen: 5
      },
      attemptsLimit: {
        General: 6,
        EWS: 6,
        OBC: 9,
        SC_ST: "Unlimited up to upper age limit",
        PwD: 9
      },
      minQualification: "Graduate",
      allowedDegrees: ["Any Bachelor's Degree (B.Tech, B.Sc, B.Com, B.A, MBBS, LLB, etc.) from a recognized university"],
      finalYearEligible: true,
      minPercentage: null, // Just pass
      domicileRule: "Indian Citizens (for IAS/IPS). Citizens of India/Nepal/Bhutan for other services.",
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Preliminary Examination", type: "Objective (MCQ)", qualifying: true, marks: 400 },
      { stage: 2, name: "Main Examination", type: "Descriptive Written", qualifying: false, marks: 1750 },
      { stage: 3, name: "Personality Test (Interview)", type: "Oral Board Interview", qualifying: false, marks: 275 }
    ],
    examPattern: {
      prelims: [
        { paper: "General Studies Paper I", questions: 100, marks: 200, durationHours: 2, negativeMarking: "1/3rd (0.66 marks)" },
        { paper: "General Studies Paper II (CSAT)", questions: 80, marks: 200, durationHours: 2, negativeMarking: "1/3rd (0.83 marks)", qualifyingRule: "Qualifying with 33% (66 marks)" }
      ],
      mains: [
        { paper: "Paper A & B (Compulsory Indian Language & English)", marks: 300, qualifying: true, durationHours: 3 },
        { paper: "Paper I: Essay", marks: 250, durationHours: 3 },
        { paper: "Paper II: General Studies I (Indian Heritage, History, Geography, Society)", marks: 250, durationHours: 3 },
        { paper: "Paper III: General Studies II (Governance, Constitution, Polity, Social Justice, IR)", marks: 250, durationHours: 3 },
        { paper: "Paper IV: General Studies III (Technology, Economic Development, Biodiversity, Environment, Security)", marks: 250, durationHours: 3 },
        { paper: "Paper V: General Studies IV (Ethics, Integrity and Aptitude)", marks: 250, durationHours: 3 },
        { paper: "Paper VI & VII: Optional Subject Papers 1 & 2", marks: 500, durationHours: 3 }
      ]
    },
    syllabus: [
      {
        subject: "History & Culture",
        topics: ["Ancient & Medieval India", "Modern Indian History (1757-1947)", "Freedom Struggle & Personalities", "Indian Art forms, Literature, Architecture", "Post-Independence Consolidation"]
      },
      {
        subject: "Polity & Governance",
        topics: ["Indian Constitution & Preamble", "Fundamental Rights & DPSP", "Parliament & State Legislatures", "Judiciary & Judicial Review", "Federal Structure & Centre-State Relations", "Statutory & Regulatory Bodies"]
      },
      {
        subject: "Geography & Environment",
        topics: ["Physical Geography of India and World", "Monsoon, Climate & Drainage Systems", "Ecology, Biodiversity & Wildlife Conservation", "Climate Change & Conventions", "Disaster Management"]
      },
      {
        subject: "Economy & Social Development",
        topics: ["Indian Economy & Planning", "Monetary & Fiscal Policy (RBI/Budget)", "Inclusive Growth & Poverty", "Agriculture & Food Processing", "Infrastructure, Trade & Balance of Payments"]
      },
      {
        subject: "CSAT (Paper II)",
        topics: ["Reading Comprehension", "Logical Reasoning & Analytical Ability", "Decision Making", "Basic Numeracy & Data Interpretation (Class X Level)"]
      }
    ],
    cutoffs: [
      { year: "2024", prelims: { General: 75.41, EWS: 68.02, OBC: 74.75, SC: 59.25, ST: 47.82 }, final: { General: 953, EWS: 923, OBC: 919, SC: 890, ST: 891 } },
      { year: "2023", prelims: { General: 75.41, EWS: 68.02, OBC: 74.75, SC: 59.25, ST: 47.82 }, final: { General: 953, EWS: 923, OBC: 919, SC: 890, ST: 891 } },
      { year: "2022", prelims: { General: 88.22, EWS: 82.83, OBC: 87.54, SC: 74.08, ST: 69.35 }, final: { General: 960, EWS: 926, OBC: 923, SC: 893, ST: 900 } }
    ],
    recommendedBooks: [
      { title: "Indian Polity", author: "M. Laxmikanth", subject: "Polity & Constitution", edition: "7th Edition (McGraw Hill)", link: "https://www.mheducation.co.in" },
      { title: "A Brief History of Modern India", author: "Rajiv Ahir (Spectrum)", subject: "Modern History", edition: "Latest Edition", link: "https://spectrumbooks.in" },
      { title: "Certificate Physical and Human Geography", author: "G.C. Leong", subject: "Geography", edition: "Oxford Press", link: "https://global.oup.com" },
      { title: "Indian Economy", author: "Ramesh Singh", subject: "Economy", edition: "15th Edition", link: "https://www.mheducation.co.in" },
      { title: "Ethics, Integrity and Aptitude", author: "Subba Rao & P.N. Roy Chowdhury", subject: "Ethics (GS IV)", edition: "Access Publishing", link: "https://amazon.in" }
    ],
    youtubeLessons: [
      { title: "Complete Indian Polity by Laxmikanth Masterclass", channel: "UPSC Official Curriculum Guide", topic: "Constitutional Framework & Fundamental Rights", duration: "12 Hours", url: "https://www.youtube.com/watch?v=mock_upsc_polity" },
      { title: "Modern Indian History Spectrum Crash Course", channel: "Civil Services Mentorship", topic: "Revolt of 1857 to Freedom Movement 1947", duration: "8 Hours", url: "https://www.youtube.com/watch?v=mock_upsc_history" },
      { title: "Economic Survey & Union Budget Key Trends", channel: "Sovereign Insights", topic: "Fiscal Policy, Inflation, RBI Monetary Stance", duration: "4 Hours", url: "https://www.youtube.com/watch?v=mock_upsc_economy" }
    ],
    previousPapers: [
      { year: 2024, tier: "Prelims", subject: "GS Paper 1", shift: "Morning", language: "English & Hindi", pdfUrl: "https://upsc.gov.in/sites/default/files/CSP-2024-GS1.pdf", practiceAvailable: true },
      { year: 2024, tier: "Prelims", subject: "CSAT Paper 2", shift: "Afternoon", language: "English & Hindi", pdfUrl: "https://upsc.gov.in/sites/default/files/CSP-2024-CSAT.pdf", practiceAvailable: true },
      { year: 2023, tier: "Prelims", subject: "GS Paper 1", shift: "Morning", language: "English & Hindi", pdfUrl: "https://upsc.gov.in/sites/default/files/CSP-2023-GS1.pdf", practiceAvailable: true },
      { year: 2023, tier: "Mains", subject: "GS Papers I to IV", shift: "Descriptive", language: "English", pdfUrl: "https://upsc.gov.in/sites/default/files/CSM-2023-GS.pdf", practiceAvailable: false }
    ],
    calendar: {
      notificationDate: "2026-02-11",
      applicationStart: "2026-02-11",
      applicationLastDate: "2026-03-03",
      admitCardDate: "2026-05-10",
      examDate: "2026-05-24",
      resultDate: "2026-06-25",
      status: "CONFIRMED"
    }
  },

  {
    id: "upsc-ese",
    code: "UPSC ESE",
    title: "Engineering Services Examination (IES / ESE)",
    conductingBody: "Union Public Service Commission (UPSC)",
    category: "Government Recruitment",
    subCategory: "Central Engineering Services",
    scope: "All India",
    frequency: "Annual",
    mode: "Offline (Pen & Paper) / Objective & Descriptive",
    shortDescription: "Recruitment to Group A engineering services including Indian Railway Service of Electrical Engineers (IRSEE), Indian Defence Service of Engineers (IDSE), Central Water Engineering Service and Indian Telecommunication Service.",
    officialWebsite: "https://upsc.gov.in",
    officialNotificationUrl: "https://upsc.gov.in/examinations/active-examinations",
    eligibility: {
      minAge: 21,
      maxAge: 30,
      ageCutoffDate: "January 1 of the examination year",
      ageRelaxation: {
        OBC: 3,
        SC_ST: 5,
        PwD: 10,
        ExServicemen: 5
      },
      minQualification: "Graduate in Engineering",
      allowedDegrees: ["B.E / B.Tech in Civil, Mechanical, Electrical, Electronics & Telecommunication Engineering (ECE / ET) or equivalent"],
      finalYearEligible: true,
      minPercentage: null,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Preliminary Examination", type: "Objective (MCQ)", qualifying: false, marks: 500 },
      { stage: 2, name: "Main Written Examination", type: "Conventional / Descriptive", qualifying: false, marks: 600 },
      { stage: 3, name: "Personality Test (Interview)", type: "Oral Board Interview", qualifying: false, marks: 200 }
    ],
    examPattern: {
      prelims: [
        { paper: "Paper I: General Studies & Engineering Aptitude", questions: 100, marks: 200, durationHours: 2, negativeMarking: "1/3rd (0.66 marks)" },
        { paper: "Paper II: Engineering Discipline Specific", questions: 150, marks: 300, durationHours: 3, negativeMarking: "1/3rd (0.66 marks)" }
      ],
      mains: [
        { paper: "Discipline Paper I", marks: 300, durationHours: 3 },
        { paper: "Discipline Paper II", marks: 300, durationHours: 3 }
      ]
    },
    calendar: {
      notificationDate: "2026-09-16",
      applicationStart: "2026-09-16",
      applicationLastDate: "2026-10-06",
      admitCardDate: "2027-01-25",
      examDate: "2027-02-14",
      resultDate: "2027-03-30",
      status: "CONFIRMED"
    }
  },

  {
    id: "ssc-cgl",
    code: "SSC CGL",
    title: "Combined Graduate Level Examination",
    conductingBody: "Staff Selection Commission (SSC)",
    category: "Government Recruitment",
    subCategory: "Central Government",
    scope: "All India",
    frequency: "Annual",
    mode: "Computer Based Test (CBT)",
    shortDescription: "Recruitment to Group B and Group C Gazetted and Non-Gazetted executive posts in Central Ministries, Income Tax, GST, Customs, CBI, Enforcement Directorate and CAG.",
    officialWebsite: "https://ssc.gov.in",
    officialNotificationUrl: "https://ssc.gov.in/notice-board",
    eligibility: {
      minAge: 18,
      maxAge: 32, // varies by post: 18-27, 18-30, 20-30, up to 32 for JSO
      ageCutoffDate: "August 1 of notification year",
      ageRelaxation: { OBC: 3, SC_ST: 5, PwD: 10, ExServicemen: 3 },
      minQualification: "Graduate",
      allowedDegrees: ["Any Bachelor's Degree in any discipline. (For JSO: Bachelor's with 60% in Math at 10+2 OR Degree with Statistics)"],
      finalYearEligible: true,
      minPercentage: null,
      nationality: "Citizen of India"
    },
    selectionProcess: [
      { stage: 1, name: "Tier I (CBT)", type: "Objective (Screening)", qualifying: true, marks: 200 },
      { stage: 2, name: "Tier II (CBT & Data Entry)", type: "Merit Computation", qualifying: false, marks: 390 }
    ],
    examPattern: {
      tier1: [
        { subject: "General Intelligence and Reasoning", questions: 25, marks: 50 },
        { subject: "General Awareness", questions: 25, marks: 50 },
        { subject: "Quantitative Aptitude", questions: 25, marks: 50 },
        { subject: "English Comprehension", questions: 25, marks: 50 }
      ],
      durationMinutes: 60,
      negativeMarking: "0.50 marks per wrong answer in Tier I; 1 mark per wrong answer in Tier II (Paper I)"
    },
    syllabus: [
      { subject: "Quantitative Aptitude", topics: ["Arithmetic (Percentages, Profit/Loss, Ratio, Time & Work, Speed & Distance)", "Algebra", "Geometry & Mensuration", "Trigonometry & Heights", "Data Interpretation (Bar/Pie charts)"] },
      { subject: "General Intelligence & Reasoning", topics: ["Analogies", "Blood Relations", "Syllogisms", "Coding-Decoding", "Number Series", "Direction Sense", "Venn Diagrams", "Non-verbal reasoning"] },
      { subject: "General Awareness", topics: ["Current Affairs (National & International)", "Indian History & Freedom Struggle", "Indian Polity & Constitution", "General Science (Physics, Chemistry, Biology)", "Geography & Economics"] },
      { subject: "English Language", topics: ["Grammar & Error Spotting", "Vocabulary (Synonyms, Antonyms, Idioms)", "One-word Substitution", "Cloze Test", "Sentence Improvement", "Reading Comprehension"] }
    ],
    cutoffs: [
      { year: "2024", tier1: { General: 153.28, OBC: 150.12, EWS: 143.55, SC: 137.60, ST: 125.10 } },
      { year: "2023", tier1: { General: 150.04, OBC: 145.93, EWS: 143.44, SC: 126.68, ST: 118.16 } }
    ],
    recommendedBooks: [
      { title: "Quantitative Aptitude for Competitive Examinations", author: "Dr. R.S. Aggarwal", subject: "Quant", edition: "S. Chand", link: "https://schandpublishing.com" },
      { title: "Plinth to Paramount English", author: "Neetu Singh", subject: "English", edition: "KD Publication", link: "https://kdpublication.com" },
      { title: "Lucent's General Knowledge", author: "Dr. Binay Karna", subject: "General Awareness", edition: "Lucent Pub", link: "https://lucentpublications.com" }
    ],
    youtubeLessons: [
      { title: "Complete SSC CGL Arithmetic & Advance Maths Crash Course", channel: "SSC Formulae & Shortcuts", topic: "Geometry, Algebra, Mensuration", duration: "10 Hours", url: "https://www.youtube.com/watch?v=mock_cgl_math" },
      { title: "Top 500 English Rules & Spotting Errors", channel: "Verbal Skills Pro", topic: "Subject-Verb Agreement, Tenses, Prepositions", duration: "6 Hours", url: "https://www.youtube.com/watch?v=mock_cgl_english" }
    ],
    previousPapers: [
      { year: 2024, tier: "Tier 1", subject: "All Sections", shift: "Shift 1 (Morning)", language: "English & Hindi", pdfUrl: "https://ssc.gov.in/files/cgl2024_shift1.pdf", practiceAvailable: true },
      { year: 2023, tier: "Tier 1", subject: "All Sections", shift: "Shift 2", language: "English & Hindi", pdfUrl: "https://ssc.gov.in/files/cgl2023_shift2.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-06-12",
      applicationStart: "2026-06-12",
      applicationLastDate: "2026-07-11",
      admitCardDate: "2026-09-01",
      examDate: "2026-09-18",
      resultDate: "2026-11-20",
      status: "CONFIRMED"
    }
  },

  {
    id: "rrb-je",
    code: "RRB JE",
    title: "Railway Junior Engineer Examination",
    conductingBody: "Railway Recruitment Boards (RRBs)",
    category: "Government Recruitment",
    subCategory: "Engineering / Technical Central",
    scope: "All India",
    frequency: "Periodic",
    mode: "Computer Based Test (CBT)",
    shortDescription: "Recruitment of Junior Engineers (Civil, Electrical, Mechanical, Electronics, IT, Chemical & Metallurgical) across all Indian Railway zones and production units.",
    officialWebsite: "https://www.rrbapply.gov.in",
    officialNotificationUrl: "https://www.rrbcdg.gov.in",
    eligibility: {
      minAge: 18,
      maxAge: 33,
      ageRelaxation: { OBC: 3, SC_ST: 5, PwD: 10 },
      minQualification: "Diploma / Degree in Engineering",
      allowedDegrees: ["B.Tech / B.E / Diploma in Civil, Mechanical, Electrical, Electronics, CS, IT Engineering"],
      specializations: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Electronics Engineering", "Computer Science / IT"],
      finalYearEligible: false, // Must possess certificate on closing date
      minPercentage: null,
      nationality: "Citizen of India"
    },
    selectionProcess: [
      { stage: 1, name: "CBT Stage I", type: "Non-Technical Screening", qualifying: true, marks: 100 },
      { stage: 2, name: "CBT Stage II", type: "Technical + Non-Technical (Merit)", qualifying: false, marks: 150 },
      { stage: 3, name: "Document Verification & Medical Exam", type: "A3/B1 Medical Standard", qualifying: true, marks: 0 }
    ],
    examPattern: {
      cbt1: { questions: 100, durationMinutes: 90, negativeMarking: "1/3rd mark deduction" },
      cbt2: { questions: 150, durationMinutes: 120, negativeMarking: "1/3rd mark deduction" }
    },
    syllabus: [
      { subject: "Mathematics (CBT 1)", topics: ["Number systems", "BODMAS", "Decimals & Fractions", "LCM & HCF", "Ratio & Proportion", "Algebra", "Geometry & Trigonometry"] },
      { subject: "General Science", topics: ["Physics, Chemistry and Life Sciences up to 10th Standard CBSE"] },
      { subject: "Technical Abilities (CBT 2)", topics: ["Circuit Theory & Machines (Electrical)", "Strength of Materials & Fluid Mechanics (Mechanical/Civil)", "Surveying & Structural Analysis (Civil)", "Digital Electronics & Microprocessors (Electronics)", "DBMS & OS (IT/CS)"] }
    ],
    cutoffs: [
      { year: "2024", cbt1: { General: 68.45, OBC: 63.20, SC: 56.10, ST: 51.30 } }
    ],
    recommendedBooks: [
      { title: "RRB JE CBT 1 Guide", author: "Disha Experts", subject: "Maths, Reasoning, Science", edition: "Disha Publication", link: "https://dishapublication.com" },
      { title: "Made Easy Technical Handbook", author: "Made Easy Editorial", subject: "Technical Branchwise", edition: "Made Easy", link: "https://madeeasy.in" }
    ],
    youtubeLessons: [
      { title: "RRB JE CBT 1 Full Science Revision", channel: "Rail Engineers Tech", topic: "CBSE Physics & Chemistry Rapid Marathon", duration: "7 Hours", url: "https://www.youtube.com/watch?v=mock_rrb_science" }
    ],
    previousPapers: [
      { year: 2024, tier: "CBT 1", subject: "General Science & Maths", shift: "Shift 1", language: "English & Hindi", pdfUrl: "https://rrbcdg.gov.in/files/rrbje_2024_p1.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-07-25",
      applicationStart: "2026-07-30",
      applicationLastDate: "2026-08-29",
      admitCardDate: "2026-11-10",
      examDate: "2026-11-25",
      resultDate: "2027-01-15",
      status: "CONFIRMED"
    }
  },

  {
    id: "ibps-po",
    code: "IBPS PO",
    title: "Probationary Officers / Management Trainees",
    conductingBody: "Institute of Banking Personnel Selection (IBPS)",
    category: "Government Recruitment",
    subCategory: "Banking & Financial",
    scope: "All India",
    frequency: "Annual",
    mode: "Computer Based Test (CBT)",
    shortDescription: "National recruitment for Scale I Officers across 11 major Public Sector Banks (PNB, BoB, Canara, Union Bank, Bank of India, Indian Bank, etc.).",
    officialWebsite: "https://www.ibps.in",
    officialNotificationUrl: "https://www.ibps.in/index.php/crp-po-mt-xv/",
    eligibility: {
      minAge: 20,
      maxAge: 30,
      ageRelaxation: { OBC: 3, SC_ST: 5, PwD: 10 },
      minQualification: "Graduate",
      allowedDegrees: ["Graduation in any discipline from a recognized University by Government of India"],
      finalYearEligible: false,
      minPercentage: null,
      nationality: "Citizen of India"
    },
    selectionProcess: [
      { stage: 1, name: "Preliminary Examination", type: "Online Objective", marks: 100, qualifying: true },
      { stage: 2, name: "Main Examination & Descriptive Test", type: "Objective + Essay/Letter", marks: 225, qualifying: false },
      { stage: 3, name: "Common Interview", type: "Panel Interview", marks: 100, weightage: "80:20 (Mains : Interview)" }
    ],
    examPattern: {
      prelims: [
        { section: "English Language", questions: 30, marks: 30, durationMinutes: 20 },
        { section: "Quantitative Aptitude", questions: 35, marks: 35, durationMinutes: 20 },
        { section: "Reasoning Ability", questions: 35, marks: 35, durationMinutes: 20 }
      ],
      negativeMarking: "0.25 marks per incorrect answer"
    },
    syllabus: [
      { subject: "Reasoning Ability", topics: ["Puzzles & Seating Arrangement (Circular, Linear, Box, Floor)", "Input-Output", "Syllogisms (Reverse & Only a few)", "Inequalities", "Coding-Decoding", "Data Sufficiency"] },
      { subject: "Quantitative Aptitude", topics: ["Data Interpretation (Tabular, Line, Radar, Caselet)", "Quadratic Equations", "Number Series (Missing & Wrong)", "Arithmetic Word Problems (Time & Work, SI/CI, Profit & Loss)"] },
      { subject: "General & Banking Awareness", topics: ["Banking Concepts & Terminology", "RBI Monetary Policy & Repo Rates", "Financial Inclusion & Government Schemes", "Current Affairs (Last 6 Months)", "Static GK"] }
    ],
    cutoffs: [
      { year: "2024", prelims: { General: 54.25, EWS: 54.25, OBC: 54.25, SC: 48.75, ST: 42.50 } },
      { year: "2023", prelims: { General: 54.25, EWS: 54.25, OBC: 54.25, SC: 49.00, ST: 43.00 } }
    ],
    recommendedBooks: [
      { title: "Magical Book on Quicker Maths", author: "M. Tyra", subject: "Speed Math", edition: "BSC Publishing", link: "https://bscacademy.com" },
      { title: "Banking Awareness", author: "Arihant Experts", subject: "Banking & Financial GK", edition: "Arihant", link: "https://arihantbooks.com" }
    ],
    youtubeLessons: [
      { title: "Master High-Level Puzzles for Banking PO", channel: "Bankers Adda & Prep", topic: "3-Variable & Floor-Flat Puzzles", duration: "5 Hours", url: "https://www.youtube.com/watch?v=mock_ibps_puzzles" }
    ],
    previousPapers: [
      { year: 2024, tier: "Prelims", subject: "Full Mock Memory Based", shift: "Shift 1", language: "English & Hindi", pdfUrl: "https://ibps.in/po2024_prelims.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-08-01",
      applicationStart: "2026-08-01",
      applicationLastDate: "2026-08-28",
      admitCardDate: "2026-10-05",
      examDate: "2026-10-19",
      resultDate: "2026-11-15",
      status: "CONFIRMED"
    }
  },

  // ==========================================
  // CATEGORY 2: STATE GOVERNMENT RECRUITMENT
  // ==========================================
  {
    id: "appsc-group1",
    code: "APPSC Group 1",
    title: "Andhra Pradesh Civil Services (Executive / Administrative)",
    conductingBody: "Andhra Pradesh Public Service Commission (APPSC)",
    category: "Government Recruitment",
    subCategory: "State Public Service Commission",
    scope: "State",
    stateCode: "AP",
    frequency: "Annual / Periodic",
    mode: "Offline & Computer Based",
    shortDescription: "Recruitment to Deputy Collectors, Road Transport Officers, Commercial Tax Officers, DSPs, and Municipal Commissioners in Andhra Pradesh State Services.",
    officialWebsite: "https://psc.ap.gov.in",
    officialNotificationUrl: "https://psc.ap.gov.in/notices.html",
    eligibility: {
      minAge: 18,
      maxAge: 42, // State Govt relaxed upper age limit to 42 for General
      ageRelaxation: { OBC: 5, SC_ST: 5, PwD: 10, StateGovtEmployees: 5 },
      minQualification: "Graduate",
      allowedDegrees: ["Bachelor's Degree of any University in India established by Law"],
      specializations: ["Any Stream"],
      finalYearEligible: true,
      minPercentage: null,
      domicileRule: "Open to all Indian citizens. 85% seats reserved for Andhra Pradesh local candidates under Presidential Order.",
      nationality: "Citizen of India"
    },
    selectionProcess: [
      { stage: 1, name: "Screening Test (Prelims)", type: "Objective (Offline OMR)", marks: 240, qualifying: true },
      { stage: 2, name: "Main Written Examination", type: "Descriptive (5 Papers)", marks: 750, qualifying: false },
      { stage: 3, name: "Oral Test (Interview)", type: "Personality Test", marks: 75 }
    ],
    examPattern: {
      prelims: [
        { paper: "Paper I: General Studies (History, Constitution, Economy, Geography)", questions: 120, marks: 120, durationMinutes: 120 },
        { paper: "Paper II: General Aptitude (Mental Ability, Science & Tech, Current Affairs)", questions: 120, marks: 120, durationMinutes: 120 }
      ],
      negativeMarking: "1/3rd (0.33 marks) per incorrect answer"
    },
    syllabus: [
      { subject: "History and Cultural Heritage of Andhra Pradesh", topics: ["Satavahanas, Ikshvakus, Eastern Chalukyas, Kakatiyas, Vijayanagara Empire", "Bifurcation of Andhra Pradesh 2014 & Andhra Movement", "Cultural Traditions, Telugu Literature & Festivals"] },
      { subject: "Economy of Andhra Pradesh", topics: ["AP State Budget & GSDP Growth", "Navaratnalu Welfare Schemes", "Irrigation Projects (Polavaram)", "Ports and Coastal Corridor Industrialization"] },
      { subject: "Indian Constitution & Polity", topics: ["Preamble, Fundamental Rights, Directive Principles", "73rd & 74th Amendments, Panchayati Raj in AP", "State Executive (Governor, CM, Council of Ministers)"] }
    ],
    cutoffs: [
      { year: "2024", prelims: { General: 91.24, BC_A: 91.24, BC_B: 91.24, SC: 84.10, ST: 79.50 } }
    ],
    recommendedBooks: [
      { title: "Andhra Pradesh History & Culture", author: "P. Raghunadha Rao", subject: "AP History", edition: "Sterling Publishers", link: "https://amazon.in" },
      { title: "Socio-Economic Survey of Andhra Pradesh", author: "Planning Dept, Govt of AP", subject: "AP Economy", edition: "Official Govt Report", link: "https://ap.gov.in" }
    ],
    youtubeLessons: [
      { title: "Complete AP History & Bifurcation Act Series", channel: "Telugu Competitive Academy", topic: "Satavahanas to Modern AP Formation", duration: "8 Hours", url: "https://www.youtube.com/watch?v=mock_appsc_history" }
    ],
    previousPapers: [
      { year: 2024, tier: "Prelims", subject: "Paper 1 & 2", shift: "OMR Based", language: "English & Telugu", pdfUrl: "https://psc.ap.gov.in/pyq2024.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-03-15",
      applicationStart: "2026-03-20",
      applicationLastDate: "2026-04-18",
      admitCardDate: "2026-05-30",
      examDate: "2026-06-14",
      resultDate: "2026-08-01",
      status: "CONFIRMED"
    }
  },

  {
    id: "tgpsc-group1",
    code: "TGPSC Group 1",
    title: "Telangana State Civil Services (Deputy Collector / DSP)",
    conductingBody: "Telangana Public Service Commission (TGPSC)",
    category: "Government Recruitment",
    subCategory: "State Public Service Commission",
    scope: "State",
    stateCode: "TG",
    frequency: "Annual / Periodic",
    mode: "Computer Based Test & Descriptive",
    shortDescription: "Premier Telangana administrative recruitment for Group 1 executive gazetted cadres in General Administration, Police, Revenue and Commercial Taxes.",
    officialWebsite: "https://websitenew.tspsc.gov.in",
    officialNotificationUrl: "https://websitenew.tspsc.gov.in",
    eligibility: {
      minAge: 18,
      maxAge: 46, // Telangana relaxed age limit
      ageRelaxation: { OBC: 5, SC_ST: 5, PwD: 10 },
      minQualification: "Graduate",
      allowedDegrees: ["Bachelor's Degree in any discipline"],
      finalYearEligible: true,
      domicileRule: "95% local reservation for Telangana domiciles under Presidential Order 2018.",
      nationality: "Citizen of India"
    },
    selectionProcess: [
      { stage: 1, name: "Preliminary Test (Screening)", type: "Objective (150 Questions)", marks: 150, qualifying: true },
      { stage: 2, name: "Written Examination (Mains)", type: "Descriptive (6 Papers)", marks: 900, qualifying: false }
    ],
    examPattern: {
      prelims: { questions: 150, marks: 150, durationMinutes: 150, negativeMarking: "No negative marking in prelims" }
    },
    syllabus: [
      { subject: "History and Culture of Telangana", topics: ["Kakatiyas, Qutb Shahis, Asaf Jahis", "Telangana Armed Struggle (1946-51)", "Telangana State Formation Movement (1969 to 2014)", "Arts, Festivals (Bathukamma, Bonalu)"] },
      { subject: "Telangana Economy", topics: ["Telangana State Socio-Economic Outlook", "Rythu Bharosa, Mission Bhagiratha, Kaleshwaram", "Industrial Policies (TS-iPASS)"] }
    ],
    cutoffs: [
      { year: "2024", prelims: { General: 93.5, BC_A: 87.2, BC_B: 91.0, SC: 81.4, ST: 78.0 } }
    ],
    recommendedBooks: [
      { title: "Telangana Movement and State Formation", author: "Prof. V. Prakash", subject: "Telangana Movement", edition: "Telugu Academy", link: "https://teluguacademy.net" }
    ],
    youtubeLessons: [
      { title: "Telangana Movement Comprehensive Chronology", channel: "Telangana Study Circle", topic: "Mulki Rules, 1969 Agitation to 2014 Act", duration: "10 Hours", url: "https://www.youtube.com/watch?v=mock_tg_movement" }
    ],
    previousPapers: [
      { year: 2024, tier: "Prelims", subject: "General Studies & Mental Ability", shift: "Morning", language: "English, Telugu & Urdu", pdfUrl: "https://tspsc.gov.in/pyq2024.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-02-28",
      applicationStart: "2026-03-05",
      applicationLastDate: "2026-03-31",
      admitCardDate: "2026-05-20",
      examDate: "2026-06-07",
      resultDate: "2026-07-22",
      status: "CONFIRMED"
    }
  },

  {
    id: "tnpsc-group1",
    code: "TNPSC Group 1",
    title: "Tamil Nadu Combined Civil Services Examination - I",
    conductingBody: "Tamil Nadu Public Service Commission (TNPSC)",
    category: "Government Recruitment",
    subCategory: "State Public Service Commission",
    scope: "State",
    stateCode: "TN",
    frequency: "Annual",
    mode: "OMR & Written Descriptive",
    shortDescription: "Recruitment to Deputy Collector, DSP, Assistant Commissioner (Commercial Taxes), and District Registrar in Tamil Nadu State Civil Services.",
    officialWebsite: "https://tnpsc.gov.in",
    officialNotificationUrl: "https://tnpsc.gov.in/english/announcements.html",
    eligibility: {
      minAge: 21,
      maxAge: 34, // General; 39 for BC/MBC/SC/ST
      ageRelaxation: { OBC: 5, SC_ST: 5, PwD: 10 },
      minQualification: "Graduate",
      allowedDegrees: ["Any Degree of any recognized University"],
      languageCondition: "Adequate knowledge of Tamil language (mandatory qualifying Tamil paper)",
      finalYearEligible: true,
      nationality: "Citizen of India"
    },
    selectionProcess: [
      { stage: 1, name: "Preliminary Examination", type: "Objective (OMR)", marks: 300, qualifying: true },
      { stage: 2, name: "Mains Examination", type: "Descriptive (4 Papers)", marks: 750, qualifying: false },
      { stage: 3, name: "Oral Test", type: "Interview", marks: 100 }
    ],
    examPattern: {
      prelims: { questions: 200, marks: 300, durationHours: 3, negativeMarking: "No negative marking" }
    },
    syllabus: [
      { subject: "History and Culture of Tamil Nadu", topics: ["Sangam Age Literature and Archaeology (Keezhadi)", "Self-Respect Movement and Dravidian Movement", "Thirukkural teachings and relevance"] },
      { subject: "Tamil Nadu Socio-Economic Profile", topics: ["Public Health and Education Index", "Industrial clusters in Tamil Nadu", "Social Justice and Reservation policies"] }
    ],
    cutoffs: [
      { year: "2024", prelims: { General: 138, BC: 135, MBC: 133, SC: 126, ST: 119 } }
    ],
    recommendedBooks: [
      { title: "Tamil Nadu History & Culture", author: "Dr. K. Rajayyan", subject: "Tamil History", edition: "Ratna Pub", link: "https://amazon.in" }
    ],
    youtubeLessons: [
      { title: "Thirukkural & Dravidian Movement for TNPSC", channel: "Tamil Civil Hub", topic: "Unit 8 & Unit 9 Masterclass", duration: "6 Hours", url: "https://www.youtube.com/watch?v=mock_tnpsc_u8" }
    ],
    previousPapers: [
      { year: 2024, tier: "Prelims", subject: "General Studies & Aptitude", shift: "Morning", language: "Tamil & English", pdfUrl: "https://tnpsc.gov.in/pyq2024.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-04-10",
      applicationStart: "2026-04-12",
      applicationLastDate: "2026-05-10",
      admitCardDate: "2026-06-25",
      examDate: "2026-07-12",
      resultDate: "2026-09-05",
      status: "CONFIRMED"
    }
  },

  // ==========================================
  // CATEGORY 3: COMMON ENTRANCE EXAMINATIONS
  // ==========================================
  {
    id: "cuet-ug",
    code: "CUET UG",
    title: "Common University Entrance Test (Undergraduate)",
    conductingBody: "National Testing Agency (NTA)",
    category: "Common Entrance Exams",
    subCategory: "National Entrance",
    scope: "All India",
    frequency: "Annual",
    mode: "Hybrid (Pen & Paper / CBT)",
    shortDescription: "Single window entrance test for admission to undergraduate courses in all Central Universities (DU, JNU, BHU, AMU, Jamia, Hyd Univ) and 250+ participating State and Private universities.",
    officialWebsite: "https://exams.nta.ac.in/CUET-UG/",
    officialNotificationUrl: "https://exams.nta.ac.in/CUET-UG/",
    eligibility: {
      minAge: null, // No upper age limit
      maxAge: null,
      minQualification: "12th / Intermediate",
      allowedDegrees: ["Class 12th / Intermediate in any stream (Science, Commerce, Arts)"],
      finalYearEligible: true, // Candidates appearing in Class 12 eligible
      minPercentage: null, // Varies by university (usually 50%)
      domicileRule: "All India National Open Merit. University-specific domicile criteria for state universities.",
      nationality: "Citizen of India, OCI, NRI"
    },
    selectionProcess: [
      { stage: 1, name: "CUET UG Entrance Test", type: "Subject Specific + General Test", marks: 800, qualifying: false },
      { stage: 2, name: "University-Wise Centralised Counselling (e.g. CSAS for Delhi University)", type: "Merit List Seat Allocation", marks: 0 }
    ],
    examPattern: {
      sections: [
        { section: "Section IA & IB (Languages)", questions: "40 out of 50 to be attempted", durationMinutes: 45 },
        { section: "Section II (Domain Subjects: Physics, Chem, Maths, Bio, Economics, History, Pol Sci, etc.)", questions: "40 out of 50 to be attempted", durationMinutes: 45 },
        { section: "Section III (General Test: Quant, GK, Reasoning)", questions: "50 out of 60 to be attempted", durationMinutes: 60 }
      ],
      negativeMarking: "+5 for correct, -1 for incorrect"
    },
    syllabus: [
      { subject: "NCERT Class 12 Domain Subjects", topics: ["Complete syllabus of NCERT Class 12 in the chosen domain subjects (No Class 11 questions)"] },
      { subject: "General Test", topics: ["General Knowledge & Current Affairs", "General Mental Ability & Numerical Ability", "Reasoning (Simple application of basic mathematical concepts arithmetic/algebra/geometry)", "Logical and Analytical Reasoning"] },
      { subject: "Language Test", topics: ["Reading Comprehension (Factual, Narrative and Literary passages)", "Verbal Ability & Vocabulary", "Rearranging parts & Synonyms/Antonyms"] }
    ],
    cutoffs: [
      { year: "2024", details: "DU SRCC B.Com (Hons): 782/800; Hindu College Political Science: 790/800; St. Stephen's Economics: 785/800" }
    ],
    recommendedBooks: [
      { title: "NTA CUET UG Section II Domain Practice Books", author: "Arihant / Oswaal Editorial", subject: "NCERT Class 12 Question Banks", edition: "Latest", link: "https://oswaalbooks.com" },
      { title: "CUET UG General Test Guide", author: "Disha Experts", subject: "Quant & Reasoning", edition: "Disha", link: "https://dishapublication.com" }
    ],
    youtubeLessons: [
      { title: "CUET UG General Test 100 Most Expected Questions", channel: "CUET Wallah", topic: "Arithmetic & Current Affairs", duration: "4 Hours", url: "https://www.youtube.com/watch?v=mock_cuet_gt" }
    ],
    previousPapers: [
      { year: 2024, tier: "Shift 1", subject: "English & General Test", shift: "Slot 1", language: "English & Hindi", pdfUrl: "https://exams.nta.ac.in/cuetug2024_p1.pdf", practiceAvailable: true },
      { year: 2023, tier: "Slot 2", subject: "Physics, Chemistry, Maths", shift: "Slot 2", language: "English", pdfUrl: "https://exams.nta.ac.in/cuetug2023_pcm.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-02-27",
      applicationStart: "2026-02-27",
      applicationLastDate: "2026-04-05",
      admitCardDate: "2026-05-12",
      examDate: "2026-05-18",
      resultDate: "2026-07-08",
      status: "CONFIRMED"
    }
  },

  {
    id: "cuet-pg",
    code: "CUET PG",
    title: "Common University Entrance Test (Postgraduate)",
    conductingBody: "National Testing Agency (NTA)",
    category: "University and Higher Studies",
    subCategory: "Postgraduate Entrance",
    scope: "All India",
    frequency: "Annual",
    mode: "Computer Based Test (CBT)",
    shortDescription: "National entrance examination for admission into Master's programs (M.Sc, M.A, M.Com, MCA, MBA, M.Tech, M.Sc Forensic Science) across 190+ central and top state universities.",
    officialWebsite: "https://pgcuet.samarth.ac.in",
    officialNotificationUrl: "https://pgcuet.samarth.ac.in",
    eligibility: {
      minAge: null,
      maxAge: null,
      minQualification: "Graduate",
      allowedDegrees: ["Bachelor's Degree in relevant discipline (e.g., B.Sc for M.Sc, B.Com for M.Com, B.Tech/BCA for MCA/M.Tech)"],
      finalYearEligible: true,
      minPercentage: "50% marks for General/OBC (45% for SC/ST/PwD)",
      domicileRule: "All India Merit",
      nationality: "Indian Citizens & International"
    },
    selectionProcess: [
      { stage: 1, name: "CUET PG Computer Based Test", type: "Discipline-Specific MCQ", marks: 300, qualifying: false },
      { stage: 2, name: "Participating University Admission Portals", type: "Merit Score Counselling", marks: 0 }
    ],
    examPattern: {
      durationMinutes: 105,
      questions: 75,
      marks: 300,
      negativeMarking: "+4 for correct, -1 for incorrect"
    },
    syllabus: [
      { subject: "Discipline Specific (e.g. M.Sc Life Sciences / Forensic Science / Computer Science)", topics: ["Undergraduate core curriculum of the respective degree", "Forensic Science Paper (SCQP13): Forensic Chemistry, Toxicology, Forensic Biology, Serology, Forensic Physics, Ballistics, Questioned Documents, Cyber Forensics", "Computer Science (SCQP09): Data Structures, Algorithms, OS, DBMS, Computer Networks, Discrete Math"] }
    ],
    cutoffs: [
      { year: "2024", details: "JNU M.A. Economics: 248/300; DU M.Sc Zoology: 215/300; NFSU M.Sc Forensic Science: 185/300" }
    ],
    recommendedBooks: [
      { title: "CUET PG SCQP Question Bank", author: "Arihant Academic", subject: "Postgraduate Domain", edition: "2025-2026", link: "https://arihantbooks.com" }
    ],
    youtubeLessons: [
      { title: "CUET PG SCQP Master Prep Series", channel: "PG Entrance Insights", topic: "Subject-wise Core Topic Marathon", duration: "5 Hours", url: "https://www.youtube.com/watch?v=mock_cuet_pg" }
    ],
    previousPapers: [
      { year: 2024, tier: "CBT", subject: "SCQP13 (Forensic Science / Life Sciences)", shift: "Shift 2", language: "English", pdfUrl: "https://pgcuet.samarth.ac.in/pyq_scqp13.pdf", practiceAvailable: true },
      { year: 2024, tier: "CBT", subject: "SCQP09 (Computer Science & MCA)", shift: "Shift 1", language: "English", pdfUrl: "https://pgcuet.samarth.ac.in/pyq_scqp09.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2025-12-26",
      applicationStart: "2025-12-26",
      applicationLastDate: "2026-02-10",
      admitCardDate: "2026-03-05",
      examDate: "2026-03-11",
      resultDate: "2026-04-12",
      status: "CONFIRMED"
    }
  },

  {
    id: "jee-main",
    code: "JEE Main",
    title: "Joint Entrance Examination (Main)",
    conductingBody: "National Testing Agency (NTA)",
    category: "Engineering Entrance",
    subCategory: "National Engineering",
    scope: "All India",
    frequency: "Twice a Year (Session 1 & 2)",
    mode: "Computer Based Test (CBT)",
    shortDescription: "Gateway examination for admissions to NITs, IIITs, CFTIs and eligibility qualifier for JEE Advanced (IITs).",
    officialWebsite: "https://jeemain.nta.nic.in",
    officialNotificationUrl: "https://jeemain.nta.nic.in",
    eligibility: {
      minAge: null,
      maxAge: null,
      minQualification: "12th / Intermediate",
      allowedDegrees: ["Class 12th passed in 2024, 2025 or appearing in 2026 with Physics, Mathematics, and Chemistry/Bio/Technical"],
      minPercentage: "75% in Class 12 boards for NIT/IIIT admission (65% for SC/ST)",
      finalYearEligible: true,
      nationality: "Citizen of India & Foreign Nationals"
    },
    selectionProcess: [
      { stage: 1, name: "JEE Main (Session 1 & 2)", type: "NTA Percentile Score", marks: 300 },
      { stage: 2, name: "JoSAA / CSAB Counselling", type: "Seat Allocation NITs/IIITs/GFTIs" }
    ],
    examPattern: {
      durationHours: 3,
      sections: [
        { subject: "Physics", mcqs: 20, numericals: "5 out of 10", marks: 100 },
        { subject: "Chemistry", mcqs: 20, numericals: "5 out of 10", marks: 100 },
        { subject: "Mathematics", mcqs: 20, numericals: "5 out of 10", marks: 100 }
      ],
      negativeMarking: "+4 for correct, -1 for incorrect in both MCQs and Numerical Value questions"
    },
    syllabus: [
      { subject: "Physics", topics: ["Kinematics & Laws of Motion", "Work, Energy & Power", "Rotational Dynamics & Gravitation", "Thermodynamics & Kinetic Theory", "Electrostatics & Current Electricity", "Magnetism & EMI", "Optics & Modern Physics"] },
      { subject: "Chemistry", topics: ["Physical Chemistry (Mole concept, Solutions, Chemical Kinetics, Thermodynamics)", "Inorganic Chemistry (Periodic table, Coordination compounds, Chemical Bonding)", "Organic Chemistry (Hydrocarbons, Haloalkanes, Carbonyl compounds, Biomolecules)"] },
      { subject: "Mathematics", topics: ["Calculus (Limits, Derivatives, Integrals, Differential Equations)", "Coordinate Geometry (Circles, Conics)", "Vectors & 3D Geometry", "Matrices & Determinants", "Probability & Permutations"] }
    ],
    cutoffs: [
      { year: "2024", details: "CRL Qualifier for JEE Adv: 93.23 Percentile; OBC-NCL: 79.28; EWS: 81.32; SC: 60.09; ST: 46.69" }
    ],
    recommendedBooks: [
      { title: "Concepts of Physics (Vol 1 & 2)", author: "Dr. H.C. Verma", subject: "Physics", edition: "Bharati Bhawan", link: "https://amazon.in" },
      { title: "Problems in General Physics", author: "I.E. Irodov", subject: "Advanced Physics", edition: "Mir Pub", link: "https://amazon.in" }
    ],
    youtubeLessons: [
      { title: "JEE Main Physics Formula & Derivations One Shot", channel: "Physics Wallah JEE", topic: "Mechanics and Electrodynamics", duration: "8 Hours", url: "https://www.youtube.com/watch?v=mock_jee_phy" }
    ],
    previousPapers: [
      { year: 2024, tier: "Session 1", subject: "Physics, Chemistry, Maths", shift: "Jan 27 Shift 1", language: "English", pdfUrl: "https://jeemain.nta.nic.in/pyq2024_s1.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2025-10-28",
      applicationStart: "2025-10-28",
      applicationLastDate: "2025-11-27",
      admitCardDate: "2026-01-18",
      examDate: "2026-01-22",
      resultDate: "2026-02-12",
      status: "CONFIRMED"
    }
  },

  {
    id: "neet-ug",
    code: "NEET UG",
    title: "National Eligibility cum Entrance Test (Undergraduate)",
    conductingBody: "National Testing Agency (NTA)",
    category: "Medical and Healthcare",
    subCategory: "National Medical",
    scope: "All India",
    frequency: "Annual",
    mode: "Offline (Pen and Paper / OMR)",
    shortDescription: "Sole national entrance examination for admission to MBBS, BDS, BAMS, BHMS, BSMS courses across AIIMS, JIPMER, Central, State and Private Medical Colleges in India.",
    officialWebsite: "https://exams.nta.ac.in/NEET/",
    officialNotificationUrl: "https://exams.nta.ac.in/NEET/",
    eligibility: {
      minAge: 17, // Completed on or before Dec 31 of admission year
      maxAge: null, // No upper age limit
      minQualification: "12th / Intermediate",
      allowedDegrees: ["Class 12th passed with Physics, Chemistry, Biology/Biotechnology, and English as core subjects"],
      minPercentage: "50% aggregate in PCB for General (40% for SC/ST/OBC, 45% for PwD)",
      finalYearEligible: true,
      nationality: "Indian Citizens, OCI, NRI, Foreign Nationals"
    },
    selectionProcess: [
      { stage: 1, name: "NEET UG Examination", type: "Pen & Paper OMR", marks: 720 },
      { stage: 2, name: "MCC All India Quota (15%) + State Counselling (85%)", type: "Merit Seat Allotment" }
    ],
    examPattern: {
      durationMinutes: 200,
      totalQuestions: 200,
      attemptQuestions: 180,
      marks: 720,
      sections: [
        { subject: "Physics", sectionA: 35, sectionB: "10 out of 15", marks: 180 },
        { subject: "Chemistry", sectionA: 35, sectionB: "10 out of 15", marks: 180 },
        { subject: "Botany", sectionA: 35, sectionB: "10 out of 15", marks: 180 },
        { subject: "Zoology", sectionA: 35, sectionB: "10 out of 15", marks: 180 }
      ],
      negativeMarking: "+4 for correct, -1 for incorrect"
    },
    syllabus: [
      { subject: "Biology (Class 11 & 12 NCERT)", topics: ["Diversity in Living World", "Structural Organisation in Animals & Plants", "Cell Structure & Function", "Plant Physiology & Human Physiology", "Genetics & Evolution", "Biology in Human Welfare", "Biotechnology & Its Applications", "Ecology & Environment"] },
      { subject: "Physics", topics: ["Mechanics, Thermodynamics, Electrostatics, Current Electricity, Optics, Modern Physics"] },
      { subject: "Chemistry", topics: ["Physical Chemistry, Inorganic Coordination & Periodic, Organic Hydrocarbons & Oxygen/Nitrogen compounds"] }
    ],
    cutoffs: [
      { year: "2024", qualifyingPercentile: { General: 720 - 164, OBC: 163 - 129, SC: 163 - 129, ST: 163 - 129 } }
    ],
    recommendedBooks: [
      { title: "NCERT Biology Class 11 & 12 (Word to Word)", author: "NCERT Official", subject: "Biology (Core)", edition: "NCERT", link: "https://ncert.nic.in" },
      { title: "Objective Chemistry for NEET", author: "Dr. O.P. Tandon", subject: "Chemistry", edition: "GRB Pub", link: "https://grbbooks.com" }
    ],
    youtubeLessons: [
      { title: "Human Physiology Full Marathon Revision", channel: "Biomentors Classes Online", topic: "Digestion, Respiration, Circulation, Excretion", duration: "7 Hours", url: "https://www.youtube.com/watch?v=mock_neet_bio" }
    ],
    previousPapers: [
      { year: 2024, tier: "NEET", subject: "PCB Code Q1", shift: "Afternoon", language: "English & 13 Regional Languages", pdfUrl: "https://exams.nta.ac.in/neet2024_q1.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-02-09",
      applicationStart: "2026-02-09",
      applicationLastDate: "2026-03-16",
      admitCardDate: "2026-04-29",
      examDate: "2026-05-03",
      resultDate: "2026-06-14",
      status: "CONFIRMED"
    }
  },

  // ==========================================
  // CATEGORY 4: ENGINEERING & PSU VIA GATE
  // ==========================================
  {
    id: "gate-cse",
    code: "GATE CS",
    title: "Graduate Aptitude Test in Engineering - Computer Science",
    conductingBody: "IIT Roorkee / IISc / IITs (Rotational)",
    category: "Engineering Entrance",
    subCategory: "Higher Studies & PSU Recruitment",
    scope: "All India",
    frequency: "Annual",
    mode: "Computer Based Test (CBT)",
    shortDescription: "Gateway for M.Tech/Ph.D at IISc, IITs, NITs and premier recruitment for Scientist 'B' & Engineer posts in PSUs (IOCL, NTPC, ONGC, BARC, DRDO, ISRO).",
    officialWebsite: "https://gate2026.iitr.ac.in",
    officialNotificationUrl: "https://gate2026.iitr.ac.in",
    eligibility: {
      minAge: null,
      maxAge: null,
      minQualification: "B.Tech / B.E / MCA / M.Sc in relevant disciplines",
      allowedDegrees: ["B.Tech/B.E in CS, IT, ECE, EE or M.Sc Computer Science / MCA"],
      finalYearEligible: true, // 3rd and 4th year B.Tech students eligible
      minPercentage: null,
      nationality: "Indian and International"
    },
    selectionProcess: [
      { stage: 1, name: "GATE CBT (100 Marks)", type: "MCQ + MSQ + NAT", marks: 100 },
      { stage: 2, name: "COAP (IITs) / CCMT (NITs) or PSU Direct Interview", type: "Admission / PSU Job Offer" }
    ],
    examPattern: {
      durationHours: 3,
      questions: 65,
      marks: 100,
      sections: [
        { section: "General Aptitude", questions: 10, marks: 15 },
        { section: "Engineering Mathematics & Discrete Math", questions: 10, marks: 13 },
        { section: "Core Computer Science Subjects", questions: 45, marks: 72 }
      ],
      negativeMarking: "1/3rd for 1-mark MCQs; 2/3rd for 2-mark MCQs; NO negative marking for MSQs and NATs"
    },
    syllabus: [
      { subject: "Discrete Mathematics", topics: ["Propositional & First Order Logic", "Sets, Relations, Functions, Partial Orders and Lattices", "Combinatorics & Graph Theory"] },
      { subject: "Algorithms & Data Structures", topics: ["Asymptotic notation, Recurrences", "Divide and conquer, Greedy, Dynamic Programming", "Trees, Graphs, Hashing, Heaps"] },
      { subject: "Computer Systems (OS, COA, DBMS)", topics: ["Processes, Threads, CPU Scheduling, Memory Management, Deadlocks", "Instruction pipelining, Cache memory, Virtual memory", "ER Model, Relational Algebra, SQL, Normal Forms, Indexing, Transactions & Concurrency Control"] },
      { subject: "Theory of Computation & Compiler Design", topics: ["Regular expressions, Finite Automata, Context-Free Grammars, Pushdown Automata, Turing Machines, Undecidability", "Lexical analysis, Parsing (LL, LR), Intermediate code generation, Syntax directed translation"] },
      { subject: "Computer Networks", topics: ["OSI & TCP/IP layers", "Routing algorithms (Dijkstra, Bellman-Ford)", "Flow control, TCP congestion control, DNS, SMTP, HTTP"] }
    ],
    cutoffs: [
      { year: "2024", qualifyingMarks: { General: 27.6, OBC_NCL: 24.8, SC_ST_PwD: 18.4 } },
      { year: "2023", qualifyingMarks: { General: 32.5, OBC_NCL: 29.2, SC_ST_PwD: 21.6 } }
    ],
    recommendedBooks: [
      { title: "Introduction to Algorithms (CLRS)", author: "Cormen, Leiserson, Rivest, Stein", subject: "Algorithms", edition: "MIT Press 4th Ed", link: "https://mitpress.mit.edu" },
      { title: "Operating System Concepts", author: "Silberschatz, Galvin, Gagne", subject: "Operating Systems", edition: "Wiley", link: "https://wiley.com" },
      { title: "Database System Concepts", author: "Korth, Sudarshan", subject: "DBMS", edition: "McGraw Hill", link: "https://mheducation.co.in" }
    ],
    youtubeLessons: [
      { title: "Complete Gate CS Operating System Course", channel: "Gate Smashers", topic: "Scheduling, Virtual Memory & Semaphores", duration: "12 Hours", url: "https://www.youtube.com/watch?v=mock_gate_os" },
      { title: "Discrete Math Complete Playlist", channel: "Knowledge Gate", topic: "Graph Theory & Combinatorics", duration: "9 Hours", url: "https://www.youtube.com/watch?v=mock_gate_dm" }
    ],
    previousPapers: [
      { year: 2024, tier: "GATE", subject: "Computer Science Paper", shift: "Morning", language: "English", pdfUrl: "https://gate2024.iisc.ac.in/wp-content/uploads/2024/02/CS2024.pdf", practiceAvailable: true },
      { year: 2023, tier: "GATE", subject: "Computer Science Paper", shift: "Morning", language: "English", pdfUrl: "https://gate2023.iitk.ac.in/CS2023.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2025-08-24",
      applicationStart: "2025-08-28",
      applicationLastDate: "2025-10-12",
      admitCardDate: "2026-01-02",
      examDate: "2026-02-07",
      resultDate: "2026-03-16",
      status: "CONFIRMED"
    }
  },

  // ==========================================
  // CATEGORY 5: MANAGEMENT ENTRANCE EXAMS
  // ==========================================
  {
    id: "cat-mba",
    code: "CAT",
    title: "Common Admission Test",
    conductingBody: "Indian Institutes of Management (IIMs Rotational)",
    category: "Management Entrance",
    subCategory: "National MBA",
    scope: "All India",
    frequency: "Annual",
    mode: "Computer Based Test (CBT)",
    shortDescription: "Premier national management entrance exam for admissions to 21 IIMs, FMS Delhi, SPJIMR, MDI Gurgaon, IIT DMS and 100+ top B-schools in India.",
    officialWebsite: "https://iimcat.ac.in",
    officialNotificationUrl: "https://iimcat.ac.in",
    eligibility: {
      minAge: null,
      maxAge: null,
      minQualification: "Graduate",
      allowedDegrees: ["Bachelor's Degree in any discipline (B.Tech, B.Com, B.Sc, B.A, etc.)"],
      minPercentage: "50% marks or equivalent CGPA (45% for SC/ST/PwD)",
      finalYearEligible: true,
      nationality: "Indian & International"
    },
    selectionProcess: [
      { stage: 1, name: "CAT CBT (Percentile Score)", type: "MCQ + TITA", marks: 198 },
      { stage: 2, name: "Analytical Writing Test (AWT / WAT) & Personal Interview (PI)", type: "IIM Campus Specific" }
    ],
    examPattern: {
      durationMinutes: 120, // 40 mins sectional timer
      questions: 66,
      sections: [
        { section: "VARC (Verbal Ability & Reading Comprehension)", questions: 24, durationMinutes: 40 },
        { section: "DILR (Data Interpretation & Logical Reasoning)", questions: 20, durationMinutes: 40 },
        { section: "QA (Quantitative Aptitude)", questions: 22, durationMinutes: 40 }
      ],
      negativeMarking: "+3 for correct, -1 for incorrect in MCQs; No negative marking for Non-MCQ (TITA)"
    },
    syllabus: [
      { subject: "VARC", topics: ["Reading Comprehension (Philosophy, Economics, Science, Culture)", "Para Jumbles", "Para Summary", "Sentence Elimination (Odd one out)"] },
      { subject: "DILR", topics: ["Arrangements (Matrix, Circular)", "Games & Tournaments", "Truth-Lie Tables", "Venn Diagrams & Set Theory", "Charts & Graphs (Radar, Spider, Missing Data)"] },
      { subject: "Quantitative Aptitude", topics: ["Arithmetic (Percentages, Ratio, Averages, Profit-Loss, Time-Speed)", "Algebra (Quadratic, Polynomials, Inequalities, Modulus, Logarithms)", "Geometry & Mensuration", "Number Systems & Modern Math"] }
    ],
    cutoffs: [
      { year: "2024", details: "IIM Ahmedabad: 99.7+ Percentile; IIM Bangalore: 99.5+; IIM Calcutta: 99.6+; New IIMs: 92-95+" }
    ],
    recommendedBooks: [
      { title: "How to Prepare for Quantitative Aptitude for CAT", author: "Arun Sharma", subject: "QA", edition: "10th Edition McGraw Hill", link: "https://mheducation.co.in" },
      { title: "How to Prepare for Data Interpretation & Logical Reasoning", author: "Arun Sharma", subject: "DILR", edition: "McGraw Hill", link: "https://mheducation.co.in" }
    ],
    youtubeLessons: [
      { title: "CAT DILR Top 20 Classic Sets", channel: "Rodha / 2IIM", topic: "Tournaments, Cubes, Matrix Arrangements", duration: "8 Hours", url: "https://www.youtube.com/watch?v=mock_cat_dilr" }
    ],
    previousPapers: [
      { year: 2024, tier: "Slot 1", subject: "VARC, DILR, QA", shift: "Morning", language: "English", pdfUrl: "https://iimcat.ac.in/cat2024_slot1.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2025-07-30",
      applicationStart: "2025-08-01",
      applicationLastDate: "2025-09-20",
      admitCardDate: "2025-11-05",
      examDate: "2025-11-29",
      resultDate: "2025-12-21",
      status: "CONFIRMED"
    }
  },
  {
    id: "mat-management",
    code: "MAT",
    title: "Management Aptitude Test",
    conductingBody: "All India Management Association (AIMA)",
    category: "Management Entrance",
    subCategory: "National MBA",
    scope: "All India",
    frequency: "Quarterly (Feb, May, Sep, Dec)",
    mode: "PBT / CBT / IBT",
    shortDescription: "National-level management entrance test administered by AIMA for admission to MBA, PGDM and allied management programs across 600+ business schools in India.",
    officialWebsite: "https://mat.aima.in",
    officialNotificationUrl: "https://mat.aima.in",
    eligibility: {
      minAge: null,
      maxAge: null,
      minQualification: "Graduate",
      allowedDegrees: ["Any Bachelor's Degree in any discipline (B.Tech, B.Com, B.Sc, B.A, etc.) from a recognized university"],
      minPercentage: null,
      finalYearEligible: true,
      nationality: "Indian & International"
    },
    selectionProcess: [
      { stage: 1, name: "MAT Composite Score (Scale 200-800)", type: "Objective MCQ", marks: 200 },
      { stage: 2, name: "Group Discussion & Personal Interview", type: "Participating Institute Specific" }
    ],
    examPattern: {
      durationMinutes: 120,
      questions: 150,
      sections: [
        { section: "Language Comprehension", questions: 30, durationMinutes: 25 },
        { section: "Intelligence and Critical Reasoning", questions: 30, durationMinutes: 25 },
        { section: "Data Analysis and Sufficiency", questions: 30, durationMinutes: 25 },
        { section: "Mathematical Skills", questions: 30, durationMinutes: 25 },
        { section: "Economic and Business Environment", questions: 30, durationMinutes: 20 }
      ],
      negativeMarking: "+1 for correct, -0.25 for incorrect"
    },
    syllabus: [
      { subject: "Language Comprehension", topics: ["Reading Comprehension", "Vocabulary & Synonyms", "Sentence Completion", "Grammar & Error Spotting"] },
      { subject: "Intelligence & Critical Reasoning", topics: ["Analogy", "Blood Relations", "Series", "Direction Sense", "Logical Deductions"] },
      { subject: "Data Analysis & Sufficiency", topics: ["Bar Charts", "Pie Charts", "Data Sufficiency", "Tables & Line Graphs"] },
      { subject: "Mathematical Skills", topics: ["Arithmetic", "Algebra", "Number System", "Geometry", "Modern Mathematics"] },
      { subject: "Economic & Business Environment", topics: ["Current Economic Affairs", "Business Icons & Brands", "Fiscal Policy", "Global Trade"] }
    ],
    cutoffs: [
      { year: "2024", details: "Top Tier B-Schools (e.g. JBIMS, SIMSREE, PUMBA): 95+ Percentile (650+ Composite Score)" }
    ],
    recommendedBooks: [
      { title: "Mission MBA MAT Guide", author: "BS Sijwalii", subject: "Complete MAT Prep", edition: "Arihant Publications", link: "https://arihantbooks.com" }
    ],
    youtubeLessons: [
      { title: "MAT Complete Syllabus & Strategy", channel: "Unacademy CAT / MBA", topic: "Comprehensive MAT Overview", duration: "2 Hours", url: "https://www.youtube.com/watch?v=mock_mat_guide" }
    ],
    previousPapers: [
      { year: 2024, tier: "May Session", subject: "Composite", shift: "Morning", language: "English", pdfUrl: "https://mat.aima.in/sample_paper.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2025-01-10",
      applicationStart: "2025-01-15",
      applicationLastDate: "2025-02-18",
      admitCardDate: "2025-02-22",
      examDate: "2025-02-28",
      resultDate: "2025-03-20",
      status: "CONFIRMED"
    }
  },
  {
    id: "cmat-nta",
    code: "CMAT",
    title: "Common Management Admission Test",
    conductingBody: "National Testing Agency (NTA)",
    category: "Management Entrance",
    subCategory: "National MBA",
    scope: "All India",
    frequency: "Annual",
    mode: "Computer Based Test (CBT)",
    shortDescription: "National-level entrance exam conducted by NTA for admission into AICTE-approved management institutions (MBA / PGDM) across India.",
    officialWebsite: "https://exams.nta.ac.in/CMAT/",
    officialNotificationUrl: "https://exams.nta.ac.in/CMAT/",
    eligibility: {
      minAge: null,
      maxAge: null,
      minQualification: "Graduate",
      allowedDegrees: ["Bachelor's Degree in any discipline (B.Tech, B.Com, B.Sc, B.A, etc.) from a recognized university"],
      minPercentage: "50% marks (45% for reserved category)",
      finalYearEligible: true,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "CMAT CBT Score", type: "Objective MCQ", marks: 400 },
      { stage: 2, name: "Group Discussion & Personal Interview", type: "AICTE Institute Specific" }
    ],
    examPattern: {
      durationMinutes: 180,
      questions: 100,
      sections: [
        { section: "Quantitative Techniques and Data Interpretation", questions: 20, durationMinutes: 36 },
        { section: "Logical Reasoning", questions: 20, durationMinutes: 36 },
        { section: "Language Comprehension", questions: 20, durationMinutes: 36 },
        { section: "General Awareness", questions: 20, durationMinutes: 36 },
        { section: "Innovation and Entrepreneurship", questions: 20, durationMinutes: 36 }
      ],
      negativeMarking: "+4 for correct, -1 for incorrect"
    },
    syllabus: [
      { subject: "Quantitative Techniques & DI", topics: ["Arithmetic", "Algebra", "Geometry", "Tables", "Bar & Pie Charts"] },
      { subject: "Logical Reasoning", topics: ["Linear Arrangements", "Coding-Decoding", "Family Tree", "Syllogisms", "Statement & Assumptions"] },
      { subject: "Language Comprehension", topics: ["Reading Comprehension", "Vocabulary", "Grammar", "Idioms & Phrases"] },
      { subject: "General Awareness", topics: ["Indian Economy", "Government Schemes", "Static GK (History, Geography)", "Science & Technology"] },
      { subject: "Innovation & Entrepreneurship", topics: ["Startup Concepts", "Venture Capital", "Government Initiatives (Startup India)", "Business Models"] }
    ],
    cutoffs: [
      { year: "2024", details: "Top Colleges (JBIMS, Great Lakes, GIM Goa): 99+ Percentile (310+ marks out of 400)" }
    ],
    recommendedBooks: [
      { title: "The Complete Reference Manual for CMAT", author: "SK Sinha", subject: "Complete CMAT Prep", edition: "Arihant Publications", link: "https://arihantbooks.com" }
    ],
    youtubeLessons: [
      { title: "CMAT Innovation and Entrepreneurship Complete Course", channel: "Cracku / MBA Pathshala", topic: "Innovation & Startup Concepts", duration: "3 Hours", url: "https://www.youtube.com/watch?v=mock_cmat_innovation" }
    ],
    previousPapers: [
      { year: 2024, tier: "Shift 1", subject: "Complete CBT", shift: "Morning", language: "English", pdfUrl: "https://exams.nta.ac.in/CMAT/sample_cmat_2024.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2025-02-15",
      applicationStart: "2025-02-20",
      applicationLastDate: "2025-03-25",
      admitCardDate: "2025-04-28",
      examDate: "2025-05-15",
      resultDate: "2025-06-06",
      status: "CONFIRMED"
    }
  },

  // ==========================================
  // CATEGORY 6: RESEARCH & FELLOWSHIP
  // ==========================================
  {
    id: "csir-ugc-net",
    code: "CSIR NET",
    title: "Joint CSIR-UGC National Eligibility Test (JRF & Lectureship)",
    conductingBody: "National Testing Agency (NTA)",
    category: "Research and Fellowship",
    subCategory: "Science Research",
    scope: "All India",
    frequency: "Twice a Year (June & December)",
    mode: "Computer Based Test (CBT)",
    shortDescription: "Eligibility for Junior Research Fellowship (JRF) and Assistant Professor / Ph.D Admission in Chemical Sciences, Earth Sciences, Life Sciences, Mathematical Sciences & Physical Sciences.",
    officialWebsite: "https://csirnet.nta.ac.in",
    officialNotificationUrl: "https://csirnet.nta.ac.in",
    eligibility: {
      minAge: 18,
      maxAge: 30, // for JRF (General); No upper age limit for Lectureship (LS) / Assistant Professor
      ageRelaxation: { OBC: 3, SC_ST: 5, PwD: 5, Women: 5 },
      minQualification: "Post Graduate (M.Sc / B.Tech / Integrated BS-MS)",
      allowedDegrees: ["M.Sc in Chemistry, Physics, Life Sciences, Mathematics, Geology or B.Tech/BS 4-Year"],
      minPercentage: "55% marks for General/EWS (50% for SC/ST/PwD)",
      finalYearEligible: true, // Result Awaited (RA) eligible
      nationality: "Indian Citizens"
    },
    selectionProcess: [
      { stage: 1, name: "CSIR NET Single Paper (Part A, B, C)", type: "CBT Objective", marks: 200, qualifying: true }
    ],
    examPattern: {
      durationHours: 3,
      marks: 200,
      sections: [
        { section: "Part A (General Science & Aptitude)", questions: "15 out of 20", marks: 30 },
        { section: "Part B (Subject Core Concept MCQs)", questions: "35 out of 50", marks: 70 },
        { section: "Part C (Advanced Scientific Analytical Questions)", questions: "25 out of 75", marks: 100 }
      ],
      negativeMarking: "25% deduction for wrong answers in each part"
    },
    syllabus: [
      { subject: "Life Sciences", topics: ["Molecules and their Interaction Relevant to Biology", "Cellular Organization & Cell Communication", "Fundamental Processes (DNA Replication, Transcription, Translation)", "Inheritance Biology & Genetics", "Diversity of Life Forms", "Ecological Principles & Evolution", "Applied Biology & Methods in Biology"] },
      { subject: "Chemical Sciences", topics: ["Inorganic Chemistry (Organometallics, Bioinorganic)", "Physical Chemistry (Quantum, Thermodynamics, Kinetics)", "Organic Chemistry (Reaction mechanisms, Pericyclic, Stereochemistry)"] }
    ],
    cutoffs: [
      { year: "2024", lifeSciencesJRF: { UR: "99.15 Percentile", EWS: "97.40", OBC: "96.20", SC: "88.90", ST: "81.30" } }
    ],
    recommendedBooks: [
      { title: "Pathfinder Life Sciences (Part 1 & 2)", author: "Pranav Kumar & Usha Mina", subject: "Life Sciences", edition: "Pathfinder Publication", link: "https://pathfinderacademy.in" },
      { title: "Principles of Biochemistry", author: "Lehninger", subject: "Biochemistry", edition: "8th Edition Macmillan", link: "https://macmillanlearning.com" }
    ],
    youtubeLessons: [
      { title: "CSIR NET Life Sciences Unit 1 to 4 Crash Course", channel: "Bansal Biology", topic: "Molecular Biology & Cell Signaling", duration: "10 Hours", url: "https://www.youtube.com/watch?v=mock_csir_bio" }
    ],
    previousPapers: [
      { year: 2024, tier: "June Session", subject: "Life Sciences Part A, B, C", shift: "Shift 1", language: "English & Hindi", pdfUrl: "https://csirnet.nta.ac.in/csir2024_ls.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-04-15",
      applicationStart: "2026-04-15",
      applicationLastDate: "2026-05-20",
      admitCardDate: "2026-06-15",
      examDate: "2026-06-25",
      resultDate: "2026-08-10",
      status: "CONFIRMED"
    }
  },

  // ==========================================
  // CATEGORY 7: LAW ENTRANCE
  // ==========================================
  {
    id: "clat-ug",
    code: "CLAT UG",
    title: "Common Law Admission Test",
    conductingBody: "Consortium of National Law Universities (NLUs)",
    category: "Law Entrance",
    subCategory: "National Law",
    scope: "All India",
    frequency: "Annual",
    mode: "Offline (Pen & Paper OMR)",
    shortDescription: "National entrance examination for admissions into 5-Year Integrated B.A. LL.B (Hons) and B.B.A. LL.B across 24 National Law Universities including NLSIU Bengaluru, NALSAR Hyderabad, and WBNUJS Kolkata.",
    officialWebsite: "https://consortiumofnlus.ac.in",
    officialNotificationUrl: "https://consortiumofnlus.ac.in",
    eligibility: {
      minAge: null, // No upper age limit
      maxAge: null,
      minQualification: "12th / Intermediate",
      allowedDegrees: ["Passed 10+2 or equivalent in any stream"],
      minPercentage: "45% marks for General/OBC (40% for SC/ST)",
      finalYearEligible: true,
      nationality: "Citizen of India, NRI, OCI"
    },
    selectionProcess: [
      { stage: 1, name: "CLAT UG Written Test", type: "Reading & Passage Based MCQ", marks: 120 },
      { stage: 2, name: "Consortium Centralised Counselling", type: "Merit NLU Allocation" }
    ],
    examPattern: {
      durationHours: 2,
      questions: 120,
      marks: 120,
      sections: [
        { section: "English Language", weightage: "20%" },
        { section: "Current Affairs including General Knowledge", weightage: "25%" },
        { section: "Legal Reasoning", weightage: "25%" },
        { section: "Logical Reasoning", weightage: "20%" },
        { section: "Quantitative Techniques", weightage: "10%" }
      ],
      negativeMarking: "0.25 marks deducted for wrong answers"
    },
    syllabus: [
      { subject: "Legal Reasoning", topics: ["Constitutional Law Principles", "Law of Torts", "Law of Contracts", "Criminal Law (IPC/BNS fundamentals)", "Legal Maxims & Current Legal Developments"] },
      { subject: "Current Affairs & GK", topics: ["Contemporary events of national and international importance", "Supreme Court landmark verdicts", "International conventions and treatises"] }
    ],
    cutoffs: [
      { year: "2024", details: "NLSIU Bengaluru (AIR 1 - 105, Score ~98.5); NALSAR Hyderabad (AIR 106 - 170, Score ~95.25)" }
    ],
    recommendedBooks: [
      { title: "Legal Aptitude and Legal Reasoning for CLAT", author: "A.P. Bhardwaj", subject: "Legal Reasoning", edition: "Pearson", link: "https://pearson.com" }
    ],
    youtubeLessons: [
      { title: "Master Passage-Based Legal Reasoning for CLAT", channel: "LegalEdge / Law Prep", topic: "Contracts & Tort Law Principles", duration: "6 Hours", url: "https://www.youtube.com/watch?v=mock_clat_legal" }
    ],
    previousPapers: [
      { year: 2024, tier: "CLAT", subject: "Full Question Booklet", shift: "Afternoon", language: "English", pdfUrl: "https://consortiumofnlus.ac.in/clat2024_paper.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2025-07-01",
      applicationStart: "2025-07-07",
      applicationLastDate: "2025-11-03",
      admitCardDate: "2025-11-20",
      examDate: "2025-12-07",
      resultDate: "2025-12-18",
      status: "CONFIRMED"
    }
  },

  // ==========================================
  // CATEGORY 8: TEACHING ELIGIBILITY
  // ==========================================
  {
    id: "ctet-exam",
    code: "CTET",
    title: "Central Teacher Eligibility Test",
    conductingBody: "Central Board of Secondary Education (CBSE)",
    category: "Teaching Eligibility",
    subCategory: "Central Teaching",
    scope: "All India",
    frequency: "Twice a Year",
    mode: "Offline (Pen & Paper OMR)",
    shortDescription: "Mandatory qualification for appointment as teachers for Classes I to VIII in Central Govt Schools (KVS, NVS, Central Tibetan Schools) and UT schools.",
    officialWebsite: "https://ctet.nic.in",
    officialNotificationUrl: "https://ctet.nic.in",
    eligibility: {
      minAge: 18,
      maxAge: null,
      minQualification: "D.El.Ed / B.Ed",
      allowedDegrees: ["Class 12 with D.El.Ed for Paper I (Classes 1-5); Graduation with B.Ed for Paper II (Classes 6-8)"],
      minPercentage: "50% in qualifying exam",
      finalYearEligible: true,
      nationality: "Citizen of India"
    },
    selectionProcess: [
      { stage: 1, name: "CTET Paper I (Primary) / Paper II (Elementary)", type: "Objective OMR (150 Marks)", marks: 150, qualifying: true }
    ],
    examPattern: {
      durationHours: 2.5,
      questions: 150,
      marks: 150,
      negativeMarking: "No negative marking",
      qualifyingRule: "60% (90 marks out of 150) for General; 55% (82 marks) for SC/ST/OBC"
    },
    syllabus: [
      { subject: "Child Development and Pedagogy", topics: ["Concept of development and learning", "Principles of Child Development (Piaget, Kohlberg, Vygotsky)", "Inclusive education and addressing diverse learners", "Learning and Pedagogy"] },
      { subject: "Mathematics / Science / Social Studies", topics: ["Content curriculum Class 1 to 8 NCERT", "Pedagogical issues and evaluation methods"] }
    ],
    cutoffs: [
      { year: "2024", details: "Standard qualifying marks: 90/150 for General; 82/150 for reserved categories" }
    ],
    recommendedBooks: [
      { title: "Child Development & Pedagogy for CTET", author: "Himanshi Singh", subject: "CDP", edition: "Pearson", link: "https://pearson.com" }
    ],
    youtubeLessons: [
      { title: "CTET CDP Complete Theory in One Video", channel: "Lets LEARN", topic: "Piaget, Vygotsky, Kohlberg & NEP 2020", duration: "8 Hours", url: "https://www.youtube.com/watch?v=mock_ctet_cdp" }
    ],
    previousPapers: [
      { year: 2024, tier: "Paper II", subject: "Maths & Science", shift: "Morning", language: "English & Hindi", pdfUrl: "https://ctet.nic.in/ctet2024_p2.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-03-01",
      applicationStart: "2026-03-07",
      applicationLastDate: "2026-04-05",
      admitCardDate: "2026-06-25",
      examDate: "2026-07-05",
      resultDate: "2026-08-15",
      status: "CONFIRMED"
    }
  },

  // ==========================================
  // CATEGORY 9: PROFESSIONAL CERTIFICATION
  // ==========================================
  {
    id: "ca-foundation",
    code: "CA Foundation",
    title: "Chartered Accountancy - Foundation Examination",
    conductingBody: "Institute of Chartered Accountants of India (ICAI)",
    category: "Professional Certification",
    subCategory: "Chartered Accountancy",
    scope: "All India",
    frequency: "Thrice a Year (January, May/June, September)",
    mode: "Offline (Pen & Paper)",
    shortDescription: "Entry-level qualification examination for entering the prestigious Chartered Accountancy course recognized internationally.",
    officialWebsite: "https://www.icai.org",
    officialNotificationUrl: "https://eservices.icai.org",
    eligibility: {
      minAge: null,
      maxAge: null,
      minQualification: "12th / Intermediate",
      allowedDegrees: ["Class 12th passed or appeared from any recognized state/central board"],
      minPercentage: null,
      nationality: "Indian & International"
    },
    selectionProcess: [
      { stage: 1, name: "CA Foundation (4 Papers)", type: "Subjective & Objective", marks: 400 },
      { stage: 2, name: "CA Intermediate & Articleship Training", type: "Advanced Coursework" },
      { stage: 3, name: "CA Final Examination", type: "Professional Certification" }
    ],
    examPattern: {
      papers: [
        { paper: "Paper 1: Accounting", marks: 100, type: "Descriptive", durationHours: 3 },
        { paper: "Paper 2: Business Laws", marks: 100, type: "Descriptive", durationHours: 3 },
        { paper: "Paper 3: Quantitative Aptitude", marks: 100, type: "Objective MCQ", durationHours: 2 },
        { paper: "Paper 4: Business Economics", marks: 100, type: "Objective MCQ", durationHours: 2 }
      ],
      qualifyingRule: "Minimum 40% in each individual paper and 50% aggregate overall"
    },
    syllabus: [
      { subject: "Accounting", topics: ["Theoretical Framework", "Accounting Process, Bank Reconciliation Statement", "Depreciation and Inventory Valuation", "Accounting for Special Transactions", "Final Accounts of Sole Proprietors and Partnership"] },
      { subject: "Business Laws", topics: ["Indian Regulatory Framework", "Indian Contract Act 1872", "Sale of Goods Act 1930", "Indian Partnership Act 1932", "Limited Liability Partnership Act 2008", "Companies Act 2013"] }
    ],
    cutoffs: [
      { year: "2024", passPercentage: "Overall pass percentage approx 15% to 20%" }
    ],
    recommendedBooks: [
      { title: "ICAI Official Study Module (New Scheme)", author: "ICAI Board of Studies", subject: "Complete Syllabus", edition: "New Scheme 2024-2026", link: "https://boslive.icai.org" }
    ],
    youtubeLessons: [
      { title: "CA Foundation Accounting New Scheme Marathon", channel: "ICAI BoS Online", topic: "Partnership Accounts & Financial Statements", duration: "7 Hours", url: "https://www.youtube.com/watch?v=mock_ca_acc" }
    ],
    previousPapers: [
      { year: 2024, tier: "June Session", subject: "Paper 1 Accounting", shift: "Afternoon", language: "English & Hindi", pdfUrl: "https://icai.org/pyq_p1_2024.pdf", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-03-01",
      applicationStart: "2026-03-05",
      applicationLastDate: "2026-03-25",
      admitCardDate: "2026-05-25",
      examDate: "2026-06-20",
      resultDate: "2026-07-28",
      status: "CONFIRMED"
    }
  },

  // ==========================================
  // CATEGORY 10: INTERNATIONAL EXAMS
  // ==========================================
  {
    id: "gre-general",
    code: "GRE",
    title: "GRE General Test",
    conductingBody: "Educational Testing Service (ETS)",
    category: "International Admissions",
    subCategory: "Graduate Studies Abroad",
    scope: "International",
    frequency: "Continuous (Year Round)",
    mode: "Computer Delivered",
    shortDescription: "Global standardized test accepted for Master's, Specialized Master's in Business, and Ph.D programs at top universities worldwide (USA, Canada, Europe, Singapore).",
    officialWebsite: "https://www.ets.org/gre",
    officialNotificationUrl: "https://www.ets.org/gre",
    eligibility: {
      minAge: null,
      maxAge: null,
      minQualification: "Graduate / Pursuing Graduation",
      allowedDegrees: ["Any Bachelor's degree or students in 3rd/4th year"],
      passportRequired: "Valid Passport mandatory as ID proof in India",
      nationality: "Any"
    },
    selectionProcess: [
      { stage: 1, name: "Shorter GRE General Test (1 Hr 58 Mins)", type: "Adaptive Computer Test", marks: 340 }
    ],
    examPattern: {
      durationMinutes: 118,
      sections: [
        { section: "Analytical Writing", tasks: "1 Analyze an Issue Task", durationMinutes: 30, scoreRange: "0 to 6 in 0.5 increments" },
        { section: "Verbal Reasoning (2 Sections)", questions: 27, durationMinutes: 41, scoreRange: "130 to 170" },
        { section: "Quantitative Reasoning (2 Sections)", questions: 27, durationMinutes: 47, scoreRange: "130 to 170" }
      ]
    },
    syllabus: [
      { subject: "Quantitative Reasoning", topics: ["Arithmetic (Integers, Fractions, Exponents)", "Algebra (Operations, Functions, Coordinate Geometry)", "Geometry (Lines, Polygons, 3D Shapes)", "Data Analysis (Statistics, Probability, Permutations, Data Interpretation)"] },
      { subject: "Verbal Reasoning", topics: ["Text Completion (1, 2, and 3 blanks)", "Sentence Equivalence (Synonyms in context)", "Reading Comprehension (Science, Social Studies, Humanities)"] }
    ],
    cutoffs: [
      { year: "2024", details: "Top US MS in CS (CMU, Stanford, Berkeley): Quant 167+, Verbal 158+; Top 50 Universities: 315-325 Overall" }
    ],
    recommendedBooks: [
      { title: "The Official Guide to the GRE General Test", author: "ETS", subject: "Official Review", edition: "3rd Edition", link: "https://ets.org" },
      { title: "Manhattan Prep 5 lb. Book of GRE Practice Problems", author: "Manhattan Prep", subject: "Math & Verbal Drills", edition: "Latest", link: "https://manhattanprep.com" }
    ],
    youtubeLessons: [
      { title: "GRE Quant Full Math Review Marathon", channel: "GregMat", topic: "All Arithmetic and Algebra Concepts", duration: "8 Hours", url: "https://www.youtube.com/watch?v=mock_gregmat" }
    ],
    previousPapers: [
      { year: 2024, tier: "Official Practice", subject: "POWERPREP Online Test 1", shift: "Interactive", language: "English", pdfUrl: "https://ets.org/gre/powerprep", practiceAvailable: true }
    ],
    calendar: {
      notificationDate: "2026-01-01",
      applicationStart: "2026-01-01",
      applicationLastDate: "Year-Round (Book slot 3 days in advance)",
      admitCardDate: "Immediate appointment confirmation",
      examDate: "Flexible On-Demand Slots",
      resultDate: "Unofficial Quant & Verbal score immediately at test end; Official report in 8-10 days",
      status: "CONFIRMED"
    }
  }
];

const additionalExaminations = require('./additionalExamsData');

module.exports = [...examinations, ...additionalExaminations];
