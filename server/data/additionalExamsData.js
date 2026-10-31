// server/data/additionalExamsData.js
// Comprehensive Statutory Examination Catalog Extension
// Covers Central Govt (Banking, Railway, Posts, Regulators), Defence, Paramilitary,
// State PSCs, Common Entrance, PG Higher Studies, Research, and Professional Boards.

const additionalExaminations = [
  // ==========================================
  // CENTRAL GOVERNMENT & REGULATORY BODIES
  // ==========================================
  {
    id: "sbi-po",
    code: "SBI PO",
    title: "State Bank of India Probationary Officer Recruitment",
    conductingBody: "State Bank of India (Central Recruitment & Promotion Dept)",
    category: "Government Recruitment",
    subCategory: "Banking",
    scope: "All India",
    frequency: "Annual",
    mode: "Online (CBT)",
    shortDescription: "India's premier public sector commercial banking appointment for Junior Management Grade Scale-I (JMGS-I) officers.",
    officialWebsite: "https://sbi.co.in/careers",
    officialNotificationUrl: "https://bank.sbi/careers/current-openings",
    eligibility: {
      minAge: 21,
      maxAge: 30,
      ageRelaxation: { OBC: 3, SC_ST: 5, PwD: 10 },
      minQualification: "Graduate",
      allowedDegrees: ["Any Graduation Degree (BA, B.Com, B.Sc, B.Tech, etc.)"],
      finalYearEligible: true,
      minPercentage: null,
      domicileRule: "Citizen of India. Open national merit across all states.",
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Phase I: Preliminary Examination", type: "Objective (100 Marks)", qualifying: true },
      { stage: 2, name: "Phase II: Main Exam (Objective 200 + Descriptive 50)", type: "CBT + Typing", qualifying: false, marks: 250 },
      { stage: 3, name: "Phase III: Psychometric Test, GD & Interview", type: "Group Discussion (20) & Interview (30)", qualifying: false, marks: 50 }
    ],
    examPattern: {
      prelims: [
        { section: "English Language", questions: 30, marks: 30, durationMinutes: 20 },
        { section: "Quantitative Aptitude", questions: 35, marks: 35, durationMinutes: 20 },
        { section: "Reasoning Ability", questions: 35, marks: 35, durationMinutes: 20 }
      ],
      negativeMarking: "0.25 (1/4th mark deduction per wrong answer)"
    },
    syllabus: [
      { subject: "Quantitative Aptitude", topics: ["Data Interpretation (Tabular, Pie, Radar)", "Quadratic Equations", "Arithmetic Word Problems (Profit/Loss, SI/CI, Time & Work)", "Number Series"] },
      { subject: "Reasoning & Computer", topics: ["High-level Seating Arrangements & Puzzles", "Syllogisms & Critical Reasoning", "Input-Output & Coded Inequalities"] },
      { subject: "General & Banking Awareness", topics: ["RBI Regulations & Monetary Policy", "Economic Survey & Union Budget", "Financial Inclusions & Schemes", "Current Affairs (Last 6 Months)"] }
    ],
    cutoffs: [
      { year: "2024", prelims: { General: 59.5, EWS: 59.5, OBC: 58.25, SC: 52.0, ST: 47.5 }, mains: { General: 84.75, EWS: 81.25, OBC: 78.5 } }
    ],
    recommendedBooks: [
      { title: "Quantitative Aptitude for Competitive Examinations", author: "R.S. Aggarwal", subject: "Maths", edition: "S. Chand", link: "https://amazon.in" },
      { title: "Banking Awareness", author: "Arihant Experts", subject: "Banking & Finance", edition: "Latest", link: "https://amazon.in" }
    ],
    youtubeLessons: [
      { title: "SBI PO Complete Quant & DI Crash Course", channel: "Bankers Adda", topic: "High Level Puzzles & DI", duration: "6 Hours", url: "https://youtube.com/watch?v=mock_sbi" }
    ],
    calendar: {
      notificationDate: "2026-09-10",
      applicationStart: "2026-09-12",
      applicationLastDate: "2026-10-03",
      admitCardDate: "2026-10-25",
      examDate: "2026-11-15",
      resultDate: "2026-12-10",
      status: "TENTATIVE"
    }
  },

  {
    id: "rbi-grade-b",
    code: "RBI Grade B",
    title: "Reserve Bank of India Officers in Grade 'B' (General)",
    conductingBody: "Reserve Bank of India Services Board",
    category: "Government Recruitment",
    subCategory: "Regulatory & Banking",
    scope: "All India",
    frequency: "Annual",
    mode: "Online (CBT)",
    shortDescription: "Direct recruitment of managerial leadership officers in the Central Bank of India overseeing monetary policy, currency management, and banking supervision.",
    officialWebsite: "https://rbi.org.in",
    officialNotificationUrl: "https://opportunities.rbi.org.in",
    eligibility: {
      minAge: 21,
      maxAge: 30,
      ageRelaxation: { OBC: 3, SC_ST: 5, PwD: 10 },
      minQualification: "Graduate with minimum 60% marks (50% for SC/ST/PwD)",
      allowedDegrees: ["Any Graduation or Post Graduation"],
      finalYearEligible: false,
      minPercentage: 60,
      domicileRule: "Citizen of India",
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Phase I Examination (Objective)", type: "CBT (200 Marks)", durationMinutes: 120, qualifying: true },
      { stage: 2, name: "Phase II Examination (Objective + Descriptive)", type: "Paper I, II, III (300 Marks)", qualifying: false },
      { stage: 3, name: "Interview", type: "Oral Personality Assessment (75 Marks)", qualifying: false }
    ],
    examPattern: {
      phase1: [
        { section: "General Awareness", questions: 80, marks: 80, durationMinutes: 25 },
        { section: "Reasoning", questions: 60, marks: 60, durationMinutes: 45 },
        { section: "English Language", questions: 30, marks: 30, durationMinutes: 25 },
        { section: "Quantitative Aptitude", questions: 30, marks: 30, durationMinutes: 25 }
      ],
      phase2: [
        { paper: "Paper I: Economic & Social Issues (ESI)", marks: 100, format: "50% Obj + 50% Desc" },
        { paper: "Paper II: English (Writing Skills)", marks: 100, format: "Descriptive (Essay, Precis, Comprehension)" },
        { paper: "Paper III: General Finance & Management (FM)", marks: 100, format: "50% Obj + 50% Desc" }
      ]
    },
    syllabus: [
      { subject: "Economic & Social Issues (ESI)", topics: ["Growth & Development in India", "Monetary and Fiscal Policy", "Balance of Payments & IMF/World Bank", "Sustainable Development & Climate Change", "Poverty Alleviation Schemes"] },
      { subject: "Finance & Management (FM)", topics: ["Financial System & Financial Markets", "Corporate Governance & Ethics", "Leadership, Motivation & Human Resource Development", "Risk Management & Derivatives"] }
    ],
    cutoffs: [
      { year: "2024", phase1: { General: 66.75, EWS: 66.75, OBC: 66.75, SC: 58.5, ST: 51.25 } }
    ],
    recommendedBooks: [
      { title: "Indian Economy", author: "Mishra & Puri", subject: "ESI", edition: "Himalaya Publishing", link: "https://amazon.in" },
      { title: "Principles of Management", author: "Harold Koontz", subject: "Management", edition: "McGraw Hill", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-07-15",
      applicationStart: "2026-07-20",
      applicationLastDate: "2026-08-14",
      admitCardDate: "2026-08-28",
      examDate: "2026-09-12",
      resultDate: "2026-10-15",
      status: "TENTATIVE"
    }
  },

  {
    id: "epfo-eo-ao",
    code: "EPFO EO/AO",
    title: "Employees' Provident Fund Organisation Enforcement / Accounts Officer",
    conductingBody: "Union Public Service Commission (UPSC)",
    category: "Government Recruitment",
    subCategory: "Central Government",
    scope: "All India",
    frequency: "Biennial",
    mode: "Offline (Pen & Paper Recruitment Test)",
    shortDescription: "Specialized statutory enforcement appointments under the Ministry of Labour & Employment for inspecting corporate compliance with labour welfare laws.",
    officialWebsite: "https://upsc.gov.in",
    officialNotificationUrl: "https://upsc.gov.in/examinations/active-examinations",
    eligibility: {
      minAge: 21,
      maxAge: 30,
      ageRelaxation: { OBC: 3, SC_ST: 5, PwD: 10 },
      minQualification: "Graduate",
      allowedDegrees: ["Any Bachelor's Degree. Degree in Law, Management, or CA preferred."],
      finalYearEligible: true,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Recruitment Test (RT)", type: "Objective MCQ (300 Marks)", weightage: "75%" },
      { stage: 2, name: "Interview", type: "Oral Personality Assessment (100 Marks)", weightage: "25%" }
    ],
    examPattern: {
      testDurationHours: 2,
      totalQuestions: 120,
      totalMarks: 300,
      negativeMarking: "1/3rd (0.83 marks deducted per incorrect answer)",
      medium: "Bilingual (English and Hindi)"
    },
    syllabus: [
      { subject: "Labour Laws & Industrial Relations", topics: ["Trade Unions Act", "Industrial Disputes Act", "Factories Act", "Social Security Code 2020", "Code on Wages 2019"] },
      { subject: "General Accounting Principles", topics: ["Journal & Ledger Entries", "Depreciation Accounting", "Trial Balance & Financial Statements", "Auditing Fundamentals"] },
      { subject: "Indian Freedom Struggle & Polity", topics: ["Constitutional Provisions for Labour", "Modern Indian Freedom Movement (1857-1947)", "DPSP and Fundamental Rights"] },
      { subject: "General Science & Computer Applications", topics: ["Elementary Physics, Chemistry, Biology", "Basics of Cybersecurity, Databases & Internet Networking"] }
    ],
    cutoffs: [
      { year: "2023", rtCutoff: { General: 187.5, EWS: 171.25, OBC: 173.0, SC: 160.5, ST: 156.0 } }
    ],
    recommendedBooks: [
      { title: "Industrial Relations and Labour Laws", author: "P.C. Tripathi", subject: "Labour Laws", edition: "Sultan Chand", link: "https://amazon.in" },
      { title: "Double Entry Book Keeping", author: "T.S. Grewal", subject: "Accounting", edition: "Sultan Chand", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-05-10",
      applicationStart: "2026-05-15",
      applicationLastDate: "2026-06-05",
      admitCardDate: "2026-06-25",
      examDate: "2026-07-19",
      resultDate: "2026-09-01",
      status: "TENTATIVE"
    }
  },

  {
    id: "rrb-je",
    code: "RRB JE",
    title: "Railway Recruitment Board Junior Engineer (Technical / Works / IT)",
    conductingBody: "Ministry of Railways (Railway Recruitment Control Board)",
    category: "Government Recruitment",
    subCategory: "Engineering & Technical",
    scope: "All India",
    frequency: "Annual / Periodic",
    mode: "Online (CBT)",
    shortDescription: "Central railway engineering recruitment for Civil, Mechanical, Electrical, Signal & Telecom, and Information Technology cadres across all 21 RRB zones.",
    officialWebsite: "https://rrbapply.gov.in",
    officialNotificationUrl: "https://rrbapply.gov.in",
    eligibility: {
      minAge: 18,
      maxAge: 33,
      ageRelaxation: { OBC: 3, SC_ST: 5, PwD: 10 },
      minQualification: "Diploma / Degree in Engineering",
      allowedDegrees: ["3-Year Polytechnic Diploma or B.Tech/B.E in Civil, Mech, Elec, ECE, CS/IT"],
      finalYearEligible: false,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "CBT Stage I (Screening)", type: "Objective (100 Marks)", qualifying: true },
      { stage: 2, name: "CBT Stage II (Technical Specialization)", type: "Objective (150 Marks)", qualifying: false },
      { stage: 3, name: "Document Verification & Medical Fitness Test", type: "Aye-One / Aye-Two Medical Standard", qualifying: true }
    ],
    examPattern: {
      cbt1: { questions: 100, durationMinutes: 90, subjects: "Maths (30), Reasoning (25), General Science (30), General Awareness (15)" },
      cbt2: { questions: 150, durationMinutes: 120, subjects: "Technical Abilities (100), General Awareness (15), Physics & Chem (15), Computer Basics (10), Environment (10)" },
      negativeMarking: "1/3rd mark deduction per wrong answer"
    },
    syllabus: [
      { subject: "Technical Abilities (Civil/Mech/Elec/CS)", topics: ["Branch-specific core engineering concepts, Building materials, Thermodynamics, Circuit theory, DBMS & OOPs"] },
      { subject: "General Science (Class 10 CBSE)", topics: ["Mechanics, Optics, Chemical reactions, Life processes, Periodic table"] }
    ],
    cutoffs: [
      { year: "2024", cbt1Cutoff: { General: 68.5, OBC: 64.2, SC: 58.0, ST: 51.5 } }
    ],
    recommendedBooks: [
      { title: "RRB Junior Engineer CBT-1 & 2 Technical Guide", author: "Made Easy Publications", subject: "Engineering", edition: "Latest", link: "https://madeeasy.in" }
    ],
    calendar: {
      notificationDate: "2026-07-25",
      applicationStart: "2026-07-30",
      applicationLastDate: "2026-08-29",
      admitCardDate: "2026-10-10",
      examDate: "2026-11-05",
      resultDate: "2026-12-15",
      status: "TENTATIVE"
    }
  },

  {
    id: "ssc-chsl",
    code: "SSC CHSL",
    title: "Staff Selection Commission Combined Higher Secondary Level (10+2)",
    conductingBody: "Staff Selection Commission (SSC)",
    category: "Government Recruitment",
    subCategory: "Central Government",
    scope: "All India",
    frequency: "Annual",
    mode: "Online (CBT)",
    shortDescription: "National recruitment for Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO) across Central Government Ministries.",
    officialWebsite: "https://ssc.gov.in",
    officialNotificationUrl: "https://ssc.gov.in/notice-board",
    eligibility: {
      minAge: 18,
      maxAge: 27,
      ageRelaxation: { OBC: 3, SC_ST: 5, PwD: 10 },
      minQualification: "12th Standard Pass",
      allowedDegrees: ["10+2 / Intermediate / Higher Secondary from any recognized board"],
      finalYearEligible: false,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Tier I (CBT)", type: "Objective (100 Questions / 200 Marks)", qualifying: true },
      { stage: 2, name: "Tier II (CBT & Skill Test)", type: "Section I, II & Typing Test (15 Mins)", qualifying: false }
    ],
    examPattern: {
      tier1: [
        { section: "English Language (Basic Knowledge)", questions: 25, marks: 50 },
        { section: "General Intelligence", questions: 25, marks: 50 },
        { section: "Quantitative Aptitude (Basic Arithmetic)", questions: 25, marks: 50 },
        { section: "General Awareness", questions: 25, marks: 50 }
      ],
      negativeMarking: "0.50 marks per wrong response in Tier I"
    },
    syllabus: [
      { subject: "Quantitative Aptitude", topics: ["Number Systems, Percentages, Ratio, Profit & Loss, Simple Mensuration, Trigonometric Ratios"] },
      { subject: "English Language", topics: ["Spotting Errors, Fill in the Blanks, Synonyms/Antonyms, One Word Substitution, Active/Passive Voice"] }
    ],
    cutoffs: [
      { year: "2024", tier1: { General: 153.25, EWS: 147.5, OBC: 152.0, SC: 136.4, ST: 125.8 } }
    ],
    recommendedBooks: [
      { title: "Kiran SSC CHSL Tier 1 Solved Papers", author: "Kiran Experts", subject: "PYQs", edition: "Latest", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-04-02",
      applicationStart: "2026-04-05",
      applicationLastDate: "2026-05-07",
      admitCardDate: "2026-06-15",
      examDate: "2026-07-01",
      resultDate: "2026-08-20",
      status: "TENTATIVE"
    }
  },

  // ==========================================
  // DEFENCE & ARMED FORCES
  // ==========================================
  {
    id: "nda-na",
    code: "NDA & NA",
    title: "National Defence Academy & Naval Academy Examination",
    conductingBody: "Union Public Service Commission (UPSC)",
    category: "Government Recruitment",
    subCategory: "Defence",
    scope: "All India",
    frequency: "Twice a Year (NDA I & II)",
    mode: "Offline (Pen & Paper)",
    shortDescription: "Premier joint services academy entrance examination training young cadets for commissioned officer appointments in the Indian Army, Navy, and Air Force.",
    officialWebsite: "https://upsc.gov.in",
    officialNotificationUrl: "https://upsc.gov.in/examinations/active-examinations",
    eligibility: {
      minAge: 16.5,
      maxAge: 19.5,
      ageRelaxation: null, // Strictly age-bracketed
      minQualification: "12th Standard Pass",
      allowedDegrees: ["10+2 Pass. Physics & Mathematics mandatory for Air Force and Naval wings."],
      finalYearEligible: true,
      maritalStatus: "Unmarried Male and Female Candidates",
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Written Examination", type: "Maths (300) + GAT (600) = 900 Marks", qualifying: true },
      { stage: 2, name: "Services Selection Board (SSB Interview)", type: "5-Day Psychological & Group Obstacle Assessment (900 Marks)", qualifying: false },
      { stage: 3, name: "Special Medical Examination", type: "Military Medical Standards Board", qualifying: true }
    ],
    examPattern: {
      mathematics: { questions: 120, marks: 300, durationHours: 2.5, negativeMarking: "0.83 marks" },
      gat: { questions: 150, marks: 600, durationHours: 2.5, negativeMarking: "1.33 marks", split: "English (200), General Knowledge (400)" }
    },
    syllabus: [
      { subject: "Mathematics (Class 11 & 12)", topics: ["Algebra, Matrices & Determinants, Trigonometry, Analytical Geometry (2D/3D), Differential & Integral Calculus, Vector Algebra, Statistics & Probability"] },
      { subject: "General Ability Test (GAT)", topics: ["English Grammar & Comprehension", "General Science (Physics, Chemistry, Biology)", "History, Freedom Movement & Geography", "Current Events & International Affairs"] }
    ],
    cutoffs: [
      { year: "2024", writtenCutoff: 301, finalCutoff: 664 },
      { year: "2023", writtenCutoff: 315, finalCutoff: 680 }
    ],
    recommendedBooks: [
      { title: "Pathfinder for NDA & NA Examination", author: "Arihant Experts", subject: "All Subjects", edition: "Latest", link: "https://amazon.in" },
      { title: "SSB Interview: The Complete Guide", author: "Dr. N.K. Natarajan", subject: "SSB", edition: "Jaico", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-05-15",
      applicationStart: "2026-05-15",
      applicationLastDate: "2026-06-04",
      admitCardDate: "2026-08-15",
      examDate: "2026-09-06",
      resultDate: "2026-10-20",
      status: "CONFIRMED"
    }
  },

  {
    id: "cds-exam",
    code: "CDS",
    title: "Combined Defence Services Examination",
    conductingBody: "Union Public Service Commission (UPSC)",
    category: "Government Recruitment",
    subCategory: "Defence",
    scope: "All India",
    frequency: "Twice a Year (CDS I & II)",
    mode: "Offline (Pen & Paper)",
    shortDescription: "Graduate entry examination for training at Indian Military Academy (IMA Dehradun), Officers Training Academy (OTA Chennai), Indian Naval Academy (INA Ezhimala), and Air Force Academy (AFA Hyderabad).",
    officialWebsite: "https://upsc.gov.in",
    officialNotificationUrl: "https://upsc.gov.in/examinations/active-examinations",
    eligibility: {
      minAge: 19,
      maxAge: 24, // 25 for OTA
      minQualification: "Graduate",
      allowedDegrees: ["Any Degree for IMA/OTA. Engineering Degree for INA. Degree with Physics/Maths for AFA."],
      finalYearEligible: true,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Written Examination", type: "English (100), GK (100), Elementary Maths (100) [Maths exempted for OTA]", qualifying: true },
      { stage: 2, name: "SSB Interview (5 Days)", type: "Psychological testing, Group tasks & Personal Interview", qualifying: false },
      { stage: 3, name: "Medical Fitness Board", type: "Defence Medical Review", qualifying: true }
    ],
    examPattern: {
      ima_ina_afa: "3 Papers (English, GK, Maths) • 100 Marks each • 2 Hours per paper • 1/3rd Negative Marking",
      ota: "2 Papers (English, GK) • 100 Marks each • 2 Hours per paper"
    },
    syllabus: [
      { subject: "English", topics: ["Antonyms/Synonyms, Sentence Ordering, Reading Comprehension, Idioms & Phrases"] },
      { subject: "General Knowledge", topics: ["Current Affairs, Indian Defence Technology, Modern History, Physical Geography, Basic Sciences"] },
      { subject: "Elementary Mathematics", topics: ["Arithmetic, Algebra, Trigonometry, Geometry, Mensuration, Statistics"] }
    ],
    cutoffs: [
      { year: "2024", ima: 132, ina: 122, afa: 148, ota: 104 }
    ],
    recommendedBooks: [
      { title: "Pathfinder for CDS Examination", author: "Arihant Experts", subject: "Comprehensive Guide", edition: "Latest", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-05-20",
      applicationStart: "2026-05-20",
      applicationLastDate: "2026-06-09",
      admitCardDate: "2026-08-10",
      examDate: "2026-09-06",
      resultDate: "2026-10-30",
      status: "CONFIRMED"
    }
  },

  {
    id: "afcat-exam",
    code: "AFCAT",
    title: "Air Force Common Admission Test",
    conductingBody: "Indian Air Force (IAF)",
    category: "Government Recruitment",
    subCategory: "Defence",
    scope: "All India",
    frequency: "Twice a Year (AFCAT 1 & 2)",
    mode: "Online (CBT)",
    shortDescription: "Officer recruitment for Flying Branch, Ground Duty (Technical: Aeronautical Engineering), and Ground Duty (Non-Technical: Administration, Logistics, Accounts, Education).",
    officialWebsite: "https://afcat.cdac.in",
    officialNotificationUrl: "https://afcat.cdac.in/AFCAT/",
    eligibility: {
      minAge: 20,
      maxAge: 24, // up to 26 for ground duty
      minQualification: "Graduate (minimum 60% marks in degree and 50% in Maths & Physics at 10+2)",
      allowedDegrees: ["B.Tech / B.E. / Any Graduation with 60%+"],
      finalYearEligible: true,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "AFCAT Online CBT", type: "100 Questions / 300 Marks (2 Hours)", qualifying: true },
      { stage: 2, name: "Air Force Selection Board (AFSB Interview)", type: "Stage 1 (OIR/PPDT) & Stage 2 (Psychological, GTO, Interview)", qualifying: false },
      { stage: 3, name: "CPSS (Computerised Pilot Selection System)", type: "Once-in-a-lifetime test for Flying Branch", qualifying: true }
    ],
    examPattern: {
      questions: 100,
      marks: 300,
      durationMinutes: 120,
      marking: "+3 marks for correct answer, -1 mark deduction per incorrect answer"
    },
    syllabus: [
      { subject: "General Awareness", topics: ["Defence, History, Geography, Sports, Environment, Basic Sciences, Current National Events"] },
      { subject: "Verbal Ability in English", topics: ["Comprehension, Error Detection, Sentence Completion, Synonyms/Antonyms, Idioms"] },
      { subject: "Numerical Ability", topics: ["Decimal Fraction, Time & Work, Average, Profit & Loss, Ratio, Simple Interest, Speed Time & Distance"] },
      { subject: "Reasoning and Military Aptitude Test", topics: ["Verbal & Non-Verbal Skills, Spatial Ability, Embedded Figures, Pattern Completion"] }
    ],
    cutoffs: [
      { year: "2024", afcatCutoff: 141 },
      { year: "2023", afcatCutoff: 155 }
    ],
    recommendedBooks: [
      { title: "AFCAT (Flying & Ground Duty) Guide", author: "Disha Experts", subject: "All Sections", edition: "Latest", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-05-30",
      applicationStart: "2026-06-01",
      applicationLastDate: "2026-06-30",
      admitCardDate: "2026-08-08",
      examDate: "2026-08-22",
      resultDate: "2026-09-28",
      status: "CONFIRMED"
    }
  },

  // ==========================================
  // PARAMILITARY SERVICES
  // ==========================================
  {
    id: "capf-ac",
    code: "CAPF (AC)",
    title: "Central Armed Police Forces (Assistant Commandants) Examination",
    conductingBody: "Union Public Service Commission (UPSC)",
    category: "Government Recruitment",
    subCategory: "Paramilitary",
    scope: "All India",
    frequency: "Annual",
    mode: "Offline (Pen & Paper)",
    shortDescription: "Recruitment of Gazetted Group 'A' Executive Field Commanders for BSF, CRPF, CISF, ITBP, and SSB under the Ministry of Home Affairs.",
    officialWebsite: "https://upsc.gov.in",
    officialNotificationUrl: "https://upsc.gov.in/examinations/active-examinations",
    eligibility: {
      minAge: 20,
      maxAge: 25,
      ageRelaxation: { OBC: 3, SC_ST: 5 },
      minQualification: "Graduate",
      allowedDegrees: ["Any Bachelor's Degree from a recognized university"],
      finalYearEligible: true,
      physicalStandards: "Height: 165 cm (Male), 157 cm (Female); Chest: 81 cm (+5 cm expansion)",
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Written Exam", type: "Paper I (General Ability 250 Marks) & Paper II (General Studies, Essay & Comprehension 200 Marks)", qualifying: true },
      { stage: 2, name: "Physical Efficiency Test (PET) & Medical Standard Test", type: "100m sprint, 800m run, Long jump, Shot put", qualifying: true },
      { stage: 3, name: "Personality Test / Interview", type: "Board Interview (150 Marks)", qualifying: false }
    ],
    examPattern: {
      paper1: { questions: 125, marks: 250, durationHours: 2, negativeMarking: "1/3rd (0.66 marks)" },
      paper2: { marks: 200, durationHours: 3, format: "Descriptive (Essay in English/Hindi, Precis, Arguments, Report writing in English)" }
    },
    syllabus: [
      { subject: "General Ability and Intelligence", topics: ["General Science, Current Events, Indian Polity & Economy, History of India, World Geography"] },
      { subject: "General Studies, Essay & Comprehension", topics: ["Modern Security Challenges, Border Management, Human Rights, Precis Writing, Counter-Argument Drafting"] }
    ],
    cutoffs: [
      { year: "2024", paper1Cutoff: { General: 135.5, OBC: 134.2, SC: 119.8, ST: 118.0 } }
    ],
    recommendedBooks: [
      { title: "CAPF Assistant Commandant Guide", author: "Arihant Experts", subject: "Papers I & II", edition: "Latest", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-04-22",
      applicationStart: "2026-04-22",
      applicationLastDate: "2026-05-12",
      admitCardDate: "2026-07-15",
      examDate: "2026-08-02",
      resultDate: "2026-09-30",
      status: "CONFIRMED"
    }
  },

  {
    id: "ib-acio",
    code: "IB ACIO",
    title: "Intelligence Bureau Assistant Central Intelligence Officer Grade-II / Executive",
    conductingBody: "Ministry of Home Affairs (MHA / IB)",
    category: "Government Recruitment",
    subCategory: "Paramilitary & Intelligence",
    scope: "All India",
    frequency: "Annual / Biennial",
    mode: "Online (Tier 1 CBT) + Offline (Tier 2 Descriptive)",
    shortDescription: "Premier national internal security and field intelligence officer appointment responsible for tactical espionage, counter-terrorism, and VIP security.",
    officialWebsite: "https://mha.gov.in",
    officialNotificationUrl: "https://ncs.gov.in",
    eligibility: {
      minAge: 18,
      maxAge: 27,
      ageRelaxation: { OBC: 3, SC_ST: 5 },
      minQualification: "Graduate",
      allowedDegrees: ["Any Graduation Degree with basic knowledge of computers"],
      finalYearEligible: false,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Tier I Exam (CBT)", type: "Objective (100 Questions / 100 Marks)", qualifying: true },
      { stage: 2, name: "Tier II Exam (Descriptive Paper)", type: "Essay (30) + English Comprehension & Precis (20) = 50 Marks", qualifying: false },
      { stage: 3, name: "Tier III (Interview)", type: "Oral Board Interview & Psychometric Evaluation (100 Marks)", qualifying: false }
    ],
    examPattern: {
      tier1: "5 Sections (Current Affairs, General Studies, Numerical Aptitude, Reasoning, English) • 20 Questions each • 60 Minutes • 1/4th Negative Marking"
    },
    syllabus: [
      { subject: "Intelligence & Security Studies", topics: ["Border Security, Internal Insurgency, Cybersecurity & Crypto, Geopolitics, Nuclear & Space Programmes"] }
    ],
    cutoffs: [
      { year: "2024", tier1Cutoff: { General: 65, OBC: 60, SC: 52, ST: 48 } }
    ],
    recommendedBooks: [
      { title: "Intelligence Bureau ACIO Guide", author: "R. Gupta's", subject: "Tiers 1 & 2", edition: "Latest", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-11-10",
      applicationStart: "2026-11-15",
      applicationLastDate: "2026-12-10",
      admitCardDate: "2026-12-28",
      examDate: "2027-01-18",
      resultDate: "2027-03-01",
      status: "TENTATIVE"
    }
  },

  // ==========================================
  // STATE PUBLIC SERVICE COMMISSIONS
  // ==========================================
  {
    id: "tgpsc-group1",
    code: "TGPSC Group 1",
    title: "Telangana Public Service Commission Group-I Services",
    conductingBody: "Telangana Public Service Commission (TGPSC)",
    category: "Government Recruitment",
    subCategory: "State Government",
    scope: "State",
    stateCode: "TG",
    frequency: "Periodic",
    mode: "Offline (Pen & Paper)",
    shortDescription: "Telangana state civil services for Deputy Collector, DSP, Commercial Tax Officer, RDO, and District Registrar posts.",
    officialWebsite: "https://websitenew.tspsc.gov.in",
    officialNotificationUrl: "https://websitenew.tspsc.gov.in",
    eligibility: {
      minAge: 18,
      maxAge: 46, // Extended age ceiling in Telangana
      ageRelaxation: { OBC: 5, SC_ST: 5, PwD: 10 },
      minQualification: "Graduate",
      allowedDegrees: ["Any Bachelor's Degree"],
      finalYearEligible: true,
      domicileRule: "95% local reservation for Telangana domiciled candidates under Presidential Order. 5% open merit for all Indian citizens.",
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Preliminary Screening Test", type: "150 Questions (General Studies & Mental Ability) • 150 Marks", qualifying: true },
      { stage: 2, name: "Written Examination (Mains)", type: "General English (Qualifying) + 6 Descriptive Papers (900 Marks)", qualifying: false }
    ],
    examPattern: {
      prelims: "150 Questions • 150 Minutes • 150 Marks • 1/3rd Negative Marking",
      mains: "Paper I: General Essay, Paper II: History & Culture, Paper III: Indian Society, Constitution & Governance, Paper IV: Economy & Development, Paper V: Science & Technology, Paper VI: Telangana Movement & State Formation"
    },
    syllabus: [
      { subject: "Telangana Movement & State Formation", topics: ["Idea of Telangana (1948-1970)", "Mobilisational Phase (1971-1990)", "Towards Formation of Telangana State (1991-2014)"] },
      { subject: "General Studies & Governance", topics: ["Policies of Telangana State, Heritage & Arts of Telangana, Environmental Issues, Indian Constitution"] }
    ],
    cutoffs: [
      { year: "2024", prelims: { General: 78.5, EWS: 74.0, BC: 76.2, SC: 69.5, ST: 66.0 } }
    ],
    recommendedBooks: [
      { title: "Telangana History & Movement", author: "V. Prakash", subject: "State History", edition: "Telugu Academy", link: "https://teluguacademy.net" }
    ],
    calendar: {
      notificationDate: "2026-02-19",
      applicationStart: "2026-02-23",
      applicationLastDate: "2026-03-16",
      admitCardDate: "2026-05-25",
      examDate: "2026-06-09",
      resultDate: "2026-07-28",
      status: "CONFIRMED"
    }
  },

  {
    id: "tnpsc-group1",
    code: "TNPSC Group 1",
    title: "Tamil Nadu Combined Civil Services Examination - I (Group I Services)",
    conductingBody: "Tamil Nadu Public Service Commission (TNPSC)",
    category: "Government Recruitment",
    subCategory: "State Government",
    scope: "State",
    stateCode: "TN",
    frequency: "Annual",
    mode: "Offline (Pen & Paper)",
    shortDescription: "Tamil Nadu state civil services for Deputy Collector, Deputy Superintendent of Police (DSP), Assistant Commissioner (Commercial Taxes), and Deputy Registrar of Co-operative Societies.",
    officialWebsite: "https://tnpsc.gov.in",
    officialNotificationUrl: "https://tnpsc.gov.in",
    eligibility: {
      minAge: 21,
      maxAge: 34, // 39 for SC/ST/MBC/BC
      ageRelaxation: { OBC: 5, SC_ST: 5 },
      minQualification: "Graduate",
      allowedDegrees: ["Any Bachelor's Degree"],
      finalYearEligible: true,
      languageRule: "Compulsory Tamil Language Eligibility Test in Mains (qualifying standard).",
      domicileRule: "Open to all Indian citizens. Reservation benefits applicable to residents with Tamil Nadu community certificates.",
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Preliminary Examination", type: "Single Paper (200 Questions / 300 Marks)", qualifying: true },
      { stage: 2, name: "Main Written Examination", type: "Paper I (Tamil Eligibility) + Papers II, III, IV (750 Marks)", qualifying: false },
      { stage: 3, name: "Oral Test (Interview)", type: "100 Marks", qualifying: false }
    ],
    examPattern: {
      prelims: "175 GS Questions + 25 Aptitude (SSLC Standard) • 300 Marks • 3 Hours • No Negative Marking",
      mains: "Paper II: Modern History & Social Issues, Paper III: Polity & Ecology, Paper IV: Geography & Tamil Society"
    },
    syllabus: [
      { subject: "History, Culture, Heritage & Socio-Political Movements in TN", topics: ["History of Tamil Society, Thirukkural, Role of Tamil Nadu in Freedom Struggle, Evolution of 19th and 20th Century Socio-Political Movements (Justice Party, Self-Respect Movement)"] },
      { subject: "Development Administration in Tamil Nadu", topics: ["Human Development Indicators, Social Welfare Schemes, Economic Trends of TN, Reservation Policy"] }
    ],
    cutoffs: [
      { year: "2024", prelims: { General: 138, BC: 135, MBC: 133, SC: 126, ST: 118 } }
    ],
    recommendedBooks: [
      { title: "Tamil Society, Culture and Heritage", author: "Dr. K.K. Pillay", subject: "Tamil Heritage", edition: "Tamil Nadu Text Book Corporation", link: "https://textbooksonline.tn.nic.in" }
    ],
    calendar: {
      notificationDate: "2026-03-28",
      applicationStart: "2026-03-28",
      applicationLastDate: "2026-04-27",
      admitCardDate: "2026-07-01",
      examDate: "2026-07-13",
      resultDate: "2026-09-15",
      status: "CONFIRMED"
    }
  },

  {
    id: "kpsc-kas",
    code: "KPSC KAS",
    title: "Karnataka Public Service Commission Gazetted Probationers (KAS)",
    conductingBody: "Karnataka Public Service Commission (KPSC)",
    category: "Government Recruitment",
    subCategory: "State Government",
    scope: "State",
    stateCode: "KA",
    frequency: "Periodic",
    mode: "Offline (Pen & Paper)",
    shortDescription: "Karnataka Administrative Services for Assistant Commissioner, DSP, Commercial Tax Officer, and Treasury Officer appointments.",
    officialWebsite: "https://kpsc.kar.nic.in",
    officialNotificationUrl: "https://kpsc.kar.nic.in",
    eligibility: {
      minAge: 21,
      maxAge: 38, // 41 for Cat 2A/2B/3A/3B, 43 for SC/ST
      minQualification: "Graduate",
      allowedDegrees: ["Any Graduation Degree"],
      finalYearEligible: true,
      languageRule: "Compulsory Kannada Language exam in Mains",
      domicileRule: "Hyderabad-Karnataka (Kalyana Karnataka) Article 371J local reservations applicable.",
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Preliminary Examination", type: "Paper 1 (GS & Humanities) & Paper 2 (GS, Science & Aptitude)", qualifying: true },
      { stage: 2, name: "Main Written Examination", type: "Compulsory Kannada & English + 4 GS Papers (1250 Marks)", qualifying: false },
      { stage: 3, name: "Personality Test", type: "Interview (50 Marks)", qualifying: false }
    ],
    examPattern: {
      prelims: "2 Papers • 100 Questions / 200 Marks each • 2 Hours • 1/4th Negative Marking"
    },
    syllabus: [
      { subject: "Karnataka History & Geography", topics: ["Kadambas, Chalukyas, Hoysalas, Vijayanagara Empire, Unification of Karnataka, Rivers of Karnataka, Western Ghats Ecology"] }
    ],
    cutoffs: [
      { year: "2024", prelims: { GM: 112.5, Cat2A: 108.0, SC: 98.5, ST: 94.0 } }
    ],
    recommendedBooks: [
      { title: "A Concise History of Karnataka", author: "Dr. S.U. Kamath", subject: "State History", edition: "MCC Publications", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-03-01",
      applicationStart: "2026-03-05",
      applicationLastDate: "2026-04-04",
      admitCardDate: "2026-08-10",
      examDate: "2026-08-27",
      resultDate: "2026-10-15",
      status: "CONFIRMED"
    }
  },

  {
    id: "uppsc-pcs",
    code: "UPPSC PCS",
    title: "Uttar Pradesh Combined State / Upper Subordinate Services Examination",
    conductingBody: "Uttar Pradesh Public Service Commission (UPPSC)",
    category: "Government Recruitment",
    subCategory: "State Government",
    scope: "State",
    stateCode: "UP",
    frequency: "Annual",
    mode: "Offline (Pen & Paper)",
    shortDescription: "Uttar Pradesh administrative leadership posts: Sub-Divisional Magistrate (SDM), Deputy SP, Block Development Officer (BDO), and ARTO.",
    officialWebsite: "https://uppsc.up.nic.in",
    officialNotificationUrl: "https://uppsc.up.nic.in",
    eligibility: {
      minAge: 21,
      maxAge: 40,
      ageRelaxation: { OBC: 5, SC_ST: 5, PwD: 15 },
      minQualification: "Graduate",
      allowedDegrees: ["Any Bachelor's Degree"],
      finalYearEligible: true,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Preliminary Examination", type: "Paper 1 (GS 200 Marks) & Paper 2 (CSAT 200 Marks - Qualifying 33%)", qualifying: true },
      { stage: 2, name: "Main Written Examination", type: "8 Papers (General Hindi, Essay, GS Papers 1 to 6) = 1500 Marks", qualifying: false },
      { stage: 3, name: "Interview", type: "Oral Board Assessment (100 Marks)", qualifying: false }
    ],
    examPattern: {
      prelims: "Paper 1 (150 Questions / 200 Marks) • Paper 2 CSAT (100 Questions / 200 Marks) • 1/3rd Negative Marking",
      mains: "Optional papers replaced with dedicated UP Specific Papers V and VI"
    },
    syllabus: [
      { subject: "Uttar Pradesh Special (Mains Papers 5 & 6)", topics: ["History, Architecture & Folk Culture of UP, Political System & Administration of UP, Economy, Agriculture & Industry in UP, Geography, Minerals & Forests in UP"] }
    ],
    cutoffs: [
      { year: "2024", prelims: { General: 125, OBC: 124, SC: 112, ST: 102 } }
    ],
    recommendedBooks: [
      { title: "Uttar Pradesh Samanya Gyan", author: "Rakesh Saraswat", subject: "UP GK", edition: "McGraw Hill", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-01-01",
      applicationStart: "2026-01-01",
      applicationLastDate: "2026-02-02",
      admitCardDate: "2026-06-20",
      examDate: "2026-07-07",
      resultDate: "2026-08-30",
      status: "CONFIRMED"
    }
  },

  {
    id: "bpsc-cce",
    code: "BPSC CCE",
    title: "Bihar Public Service Commission Combined Competitive Examination",
    conductingBody: "Bihar Public Service Commission (BPSC)",
    category: "Government Recruitment",
    subCategory: "State Government",
    scope: "State",
    stateCode: "BR",
    frequency: "Annual",
    mode: "Offline (Pen & Paper)",
    shortDescription: "Bihar state administrative services: Sub-Divisional Officer (SDO), Deputy SP, Commercial Tax Officer, and Revenue Officer.",
    officialWebsite: "https://bpsc.bih.nic.in",
    officialNotificationUrl: "https://bpsc.bih.nic.in",
    eligibility: {
      minAge: 20, // 21/22 depending on service
      maxAge: 37, // 40 for BC/EBC, 42 for SC/ST
      minQualification: "Graduate",
      allowedDegrees: ["Any Graduation Degree"],
      finalYearEligible: true,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Preliminary Examination", type: "Single Paper (150 Questions / 150 Marks)", qualifying: true },
      { stage: 2, name: "Main Written Examination", type: "General Hindi (Qualifying 30) + GS 1 (300) + GS 2 (300) + Essay (300) = 900 Marks", qualifying: false },
      { stage: 3, name: "Interview", type: "Oral Personality Assessment (120 Marks)", qualifying: false }
    ],
    examPattern: {
      prelims: "150 Questions • 120 Minutes • 150 Marks • 1/3rd Negative Marking (-0.33 marks per wrong answer)"
    },
    syllabus: [
      { subject: "Bihar Specific History & Culture", topics: ["Ancient Bihar (Magadha, Buddhism, Jainism), Champaran Satyagraha, Quit India Movement in Bihar, Folk Art (Madhubani, Manjusha)"] },
      { subject: "Bihar Geography & Economy", topics: ["Ganges River System, Flood Management, Agriculture & Agro-based industries, Bihar Industrial Investment Policy"] }
    ],
    cutoffs: [
      { year: "2024", prelims: { General: 91.67, EWS: 86.33, BC: 88.0, EBC: 84.67, SC: 75.0, ST: 79.33 } }
    ],
    recommendedBooks: [
      { title: "Bihar Samagra", author: "KBC Nano Publications", subject: "Complete Bihar Review", edition: "Latest", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-06-15",
      applicationStart: "2026-06-20",
      applicationLastDate: "2026-07-20",
      admitCardDate: "2026-09-10",
      examDate: "2026-09-30",
      resultDate: "2026-11-15",
      status: "TENTATIVE"
    }
  },

  // ==========================================
  // COMMON ENTRANCE & UNIVERSITY HIGHER STUDIES
  // ==========================================
  {
    id: "cuet-pg",
    code: "CUET PG",
    title: "Common University Entrance Test for Postgraduates",
    conductingBody: "National Testing Agency (NTA)",
    category: "University and Higher Studies",
    subCategory: "National PG Entrance",
    scope: "All India",
    frequency: "Annual",
    mode: "Online (CBT)",
    shortDescription: "Mandatory centralized admission test for Master's degrees (M.Sc, M.A, M.Com, M.Tech, MCA, M.Ed, M.Sc Forensic Science) across 190+ Central, State, and Deemed Universities.",
    officialWebsite: "https://exams.nta.ac.in/CUET-PG/",
    officialNotificationUrl: "https://pgcuet.samarth.ac.in",
    eligibility: {
      minAge: null, // No upper age limit
      maxAge: null,
      minQualification: "Bachelor's Degree in relevant discipline",
      allowedDegrees: ["B.Sc, B.A, B.Com, B.Tech, BCA, B.Ed, etc. depending on chosen test paper code"],
      finalYearEligible: true,
      minPercentage: 50,
      nationality: "Indian and International"
    },
    selectionProcess: [
      { stage: 1, name: "Computer Based Test (CBT)", type: "Single Domain Paper of 75 Questions (300 Marks)", qualifying: false },
      { stage: 2, name: "Central / State University Counselling", type: "Merit-based admission allotment", qualifying: false }
    ],
    examPattern: {
      questions: 75,
      marks: 300,
      durationMinutes: 105,
      markingScheme: "+4 marks for correct answer, -1 mark deduction per incorrect answer",
      paperCodes: "SCQP (Science: SCQP13 Forensic Science, SCQP08 Computer Science), COQP (Commerce/Management: COQP11 General/MBA), LAQP (Languages), HUQP (Humanities)"
    },
    syllabus: [
      { subject: "SCQP13 (M.Sc Forensic Science)", topics: ["Introduction to Forensic Science & Crime Scene Investigation", "Forensic Toxicology & Chemistry", "Forensic Biology, Serology & DNA Profiling", "Physical Evidence, Ballistics & Fingerprints", "Questioned Documents & Cyber Forensics", "Indian Evidence Act & CrPC Sections"] },
      { subject: "SCQP08 (Computer Science / MCA)", topics: ["Data Structures, Algorithms, Theory of Computation, Operating Systems, Database Management Systems, Computer Networks, Discrete Mathematics"] }
    ],
    cutoffs: [
      { year: "2024", scqp13_du_bhu: { General: 215, OBC: 198, SC: 165, ST: 140 }, scqp08_jnu_bhu: { General: 242, OBC: 226, SC: 195 } }
    ],
    recommendedBooks: [
      { title: "Forensic Science: An Introduction to Scientific and Investigative Techniques", author: "Stuart H. James", subject: "Forensic Core", edition: "CRC Press", link: "https://amazon.in" },
      { title: "NTA CUET PG Computer Science Guide", author: "Arihant Experts", subject: "MCA / M.Sc CS", edition: "Latest", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2025-12-26",
      applicationStart: "2025-12-26",
      applicationLastDate: "2026-02-10",
      admitCardDate: "2026-03-07",
      examDate: "2026-03-11 to 2026-03-28",
      resultDate: "2026-04-12",
      status: "CONFIRMED"
    }
  },

  {
    id: "jee-advanced",
    code: "JEE Advanced",
    title: "Joint Entrance Examination (Advanced) for IIT Admissions",
    conductingBody: "Organizing IIT (under the guidance of JAB - Joint Admission Board)",
    category: "Engineering Entrance",
    subCategory: "Premier National Entrance",
    scope: "All India",
    frequency: "Annual",
    mode: "Online (CBT)",
    shortDescription: "The sole entrance gateway for undergraduate B.Tech, BS, and Dual Degree engineering admissions across all 23 Indian Institutes of Technology (IITs).",
    officialWebsite: "https://jeeadv.ac.in",
    officialNotificationUrl: "https://jeeadv.ac.in",
    eligibility: {
      topPercentile: "Must be in top 2,50,000 successful candidates in B.E./B.Tech Paper of JEE (Main)",
      attemptsLimit: "Maximum 2 attempts in consecutive years",
      ageCutoffDate: "Born on or after October 1, 2001 (5 years relaxation for SC/ST/PwD)",
      minQualification: "Class 12th Pass with Physics, Chemistry, and Mathematics",
      class12Benchmark: "Minimum 75% aggregate marks in Class 12 (65% for SC/ST/PwD) OR top 20 percentile in board",
      nationality: "Indian / OCI / Foreign"
    },
    selectionProcess: [
      { stage: 1, name: "Paper 1 (Morning Session)", type: "Physics, Chemistry, Mathematics (180 Marks)", durationHours: 3 },
      { stage: 2, name: "Paper 2 (Afternoon Session)", type: "Physics, Chemistry, Mathematics (180 Marks)", durationHours: 3 },
      { stage: 3, name: "JoSAA Centralized Seat Allocation", type: "Merit-based branch allotment across IITs", qualifying: false }
    ],
    examPattern: {
      structure: "Both Paper 1 and Paper 2 are compulsory. Questions include Single Correct, Multiple Correct, Numerical Value, and Matrix Match. Negative marking applies based on question type."
    },
    syllabus: [
      { subject: "Physics", topics: ["General Physics & Mechanics, Thermal Physics, Electricity & Magnetism, Optics, Modern Physics"] },
      { subject: "Chemistry", topics: ["Physical Chemistry (Thermodynamics, Chemical Kinetics, Electrochemistry), Inorganic Chemistry (Coordination compounds, p/d/f-block), Organic Chemistry (Reaction mechanisms, Biomolecules)"] },
      { subject: "Mathematics", topics: ["Algebra, Matrices, Probability, Trigonometry, Analytical Geometry, Differential & Integral Calculus, Vectors"] }
    ],
    cutoffs: [
      { year: "2024", aggregateCutoff: { General: 109, EWS: 98, OBC: 98, SC: 54, ST: 54 } }
    ],
    recommendedBooks: [
      { title: "Concepts of Physics (Vols 1 & 2)", author: "H.C. Verma", subject: "Physics", edition: "Bharati Bhawan", link: "https://amazon.in" },
      { title: "Problems in General Physics", author: "I.E. Irodov", subject: "Advanced Physics", edition: "Mir Publishers", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-04-15",
      applicationStart: "2026-04-21",
      applicationLastDate: "2026-04-30",
      admitCardDate: "2026-05-15",
      examDate: "2026-05-24",
      resultDate: "2026-06-08",
      status: "CONFIRMED"
    }
  },

  {
    id: "neet-pg",
    code: "NEET PG",
    title: "National Eligibility cum Entrance Test for Postgraduates (MD / MS / DNB)",
    conductingBody: "National Board of Examinations in Medical Sciences (NBEMS)",
    category: "Medical and Healthcare",
    subCategory: "Medical Postgraduate",
    scope: "All India",
    frequency: "Annual",
    mode: "Online (CBT)",
    shortDescription: "Single eligibility-cum-entrance examination for admission to MD/MS and PG Diploma Courses in all medical colleges across India under the NMC Act.",
    officialWebsite: "https://nbe.edu.in",
    officialNotificationUrl: "https://natboard.edu.in",
    eligibility: {
      minQualification: "MBBS Degree recognized by National Medical Commission (NMC)",
      internshipCompletion: "Must complete 12-month compulsory rotatory internship on or before cutoff date",
      registration: "Provisional or Permanent Registration Certificate issued by NMC or State Medical Council",
      nationality: "Indian / OCI"
    },
    selectionProcess: [
      { stage: 1, name: "Computer Based Test (CBT)", type: "200 Multiple Choice Questions (800 Marks)", durationMinutes: 210 },
      { stage: 2, name: "MCC All-India Quota (50%) & State Quota (50%) Counselling", type: "Specialty Seat Allocation", qualifying: false }
    ],
    examPattern: {
      totalQuestions: 200,
      totalMarks: 800,
      durationMinutes: 210,
      markingScheme: "+4 marks for correct response, -1 mark deduction per incorrect response"
    },
    syllabus: [
      { subject: "Pre-Clinical Subjects", topics: ["Anatomy, Physiology, Biochemistry"] },
      { subject: "Para-Clinical Subjects", topics: ["Pathology, Pharmacology, Microbiology, Forensic Medicine & Toxicology, Social & Preventive Medicine"] },
      { subject: "Clinical Subjects", topics: ["General Medicine, General Surgery, Obstetrics & Gynaecology, Paediatrics, ENT, Ophthalmology, Orthopaedics, Dermatology, Psychiatry, Radiology"] }
    ],
    cutoffs: [
      { year: "2024", qualifyingPercentile: { General: "50th Percentile (291/800)", SC_ST_OBC: "40th Percentile (257/800)", General_PwD: "45th Percentile (274/800)" } }
    ],
    recommendedBooks: [
      { title: "Self Assessment & Review of Medicine", author: "Mudit Khanna", subject: "Clinical Review", edition: "Jaypee", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-04-10",
      applicationStart: "2026-04-16",
      applicationLastDate: "2026-05-06",
      admitCardDate: "2026-06-18",
      examDate: "2026-06-23",
      resultDate: "2026-07-15",
      status: "CONFIRMED"
    }
  },

  {
    id: "nata-architecture",
    code: "NATA",
    title: "National Aptitude Test in Architecture",
    conductingBody: "Council of Architecture (CoA)",
    category: "Common Entrance Exams",
    subCategory: "Architecture Entrance",
    scope: "All India",
    frequency: "Multiple Windows (Every Weekend April-July)",
    mode: "Hybrid (Part A: Drawing on paper, Part B: Online MCQ)",
    shortDescription: "Statutory national aptitude assessment for 5-Year Bachelor of Architecture (B.Arch) admissions in all approved architecture institutions across India.",
    officialWebsite: "https://nata.in",
    officialNotificationUrl: "https://nata.in",
    eligibility: {
      minQualification: "10+2 Pass with Physics, Chemistry, and Mathematics OR 10+3 Diploma with Mathematics",
      minPercentage: 50,
      finalYearEligible: true,
      nationality: "Indian / NRI"
    },
    selectionProcess: [
      { stage: 1, name: "NATA Test", type: "Part A (Drawing and Visual Composition 80 Marks) + Part B (Online MCQ 120 Marks) = 200 Marks", durationMinutes: 180 },
      { stage: 2, name: "State / Institutional Architecture Counselling", type: "50% 10+2 marks + 50% NATA score", qualifying: false }
    ],
    examPattern: {
      totalMarks: 200,
      partA: "Drawing Test (3 Questions on Paper): Composition, Memory Drawing, 2D/3D visualization (80 Marks)",
      partB: "Computer Test: Visual reasoning, Architectural awareness, Logical deduction (120 Marks)"
    },
    syllabus: [
      { subject: "Architectural & Visual Aptitude", topics: ["Spatial intelligence, Light and Shadow effects, Scale and Proportions, Famous architectural monuments and architects"] },
      { subject: "Mathematics & Physics", topics: ["Coordinate geometry, Trigonometry, Basic vectors, Surface tension, Heat transfer"] }
    ],
    cutoffs: [
      { year: "2024", qualifyingMarks: 70 }
    ],
    recommendedBooks: [
      { title: "A Complete Self Study Guide for B.Arch Entrance Examination", author: "P.K. Mishra", subject: "Drawing & Aptitude", edition: "Arihant", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-02-15",
      applicationStart: "2026-03-01",
      applicationLastDate: "2026-06-30",
      examDate: "Every Weekend (April to July)",
      resultDate: "Declared within 7 days of test session",
      status: "CONFIRMED"
    }
  },

  {
    id: "iit-jam",
    code: "IIT JAM",
    title: "Joint Admission Test for Master's at IITs (M.Sc / M.Sc-Ph.D Dual Degree)",
    conductingBody: "Organizing Indian Institute of Technology (JAM Committee)",
    category: "University and Higher Studies",
    subCategory: "Science Postgraduate",
    scope: "All India",
    frequency: "Annual (February)",
    mode: "Online (CBT)",
    shortDescription: "Premier national entrance examination for direct admission to M.Sc (2 Years), Joint M.Sc-Ph.D, and Integrated Ph.D programs at all IITs, IISc Bengaluru, and NITs.",
    officialWebsite: "https://jam.iitd.ac.in",
    officialNotificationUrl: "https://jam.iitd.ac.in",
    eligibility: {
      minQualification: "Bachelor's Degree in Science (B.Sc / BS)",
      allowedDegrees: ["B.Sc with relevant subject specialization"],
      finalYearEligible: true,
      minPercentage: "Pass grade in degree (no minimum percentage restriction)",
      nationality: "Indian and Foreign"
    },
    selectionProcess: [
      { stage: 1, name: "Online CBT Examination", type: "Section A (30 MCQ), Section B (10 MSQ), Section C (20 NAT) = 100 Marks", durationHours: 3 },
      { stage: 2, name: "JOAPS Centralized Counselling", type: "Merit-based admission allotment", qualifying: false }
    ],
    examPattern: {
      sections: "Section A (30 MCQs - Negative marking applies) • Section B (10 MSQs - Multiple Select, No negative) • Section C (20 NAT - Numerical Answer Type, No negative) • Total 60 Questions • 100 Marks"
    },
    syllabus: [
      { subject: "Biotechnology (BT)", topics: ["General Biology, Biochemistry and Physiology, Basic Biotechnology, Molecular Biology, Cell Biology, Microbiology"] },
      { subject: "Chemistry (CY)", topics: ["Physical Chemistry (Thermodynamics, Quantum Mechanics), Organic Chemistry (Stereochemistry, Named Reactions), Inorganic Chemistry (Periodic Table, Coordination Chemistry)"] },
      { subject: "Mathematical Statistics (MS)", topics: ["Probability, Random Variables, Standard Distributions, Joint Distributions, Limit Theorems, Estimation, Testing of Hypotheses"] }
    ],
    cutoffs: [
      { year: "2024", btCutoff: { General: 35.89, OBC: 32.3, SC_ST: 17.94 }, cyCutoff: { General: 25.38, OBC: 22.84, SC_ST: 12.69 } }
    ],
    recommendedBooks: [
      { title: "IIT JAM Biotechnology Chapterwise Solved Papers", author: "Career Endeavour", subject: "Biotechnology", edition: "Latest", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2025-08-20",
      applicationStart: "2025-09-03",
      applicationLastDate: "2025-10-25",
      admitCardDate: "2026-01-08",
      examDate: "2026-02-11",
      resultDate: "2026-03-20",
      status: "CONFIRMED"
    }
  },

  {
    id: "ugc-net",
    code: "UGC NET",
    title: "University Grants Commission National Eligibility Test (JRF & Assistant Professor)",
    conductingBody: "National Testing Agency (NTA)",
    category: "Research and Fellowship",
    subCategory: "Higher Education Eligibility",
    scope: "All India",
    frequency: "Twice a Year (June & December)",
    mode: "Online (CBT)",
    shortDescription: "National statutory test determining eligibility of Indian nationals for 'Award of Junior Research Fellowship (JRF) and appointment as Assistant Professor' across 83 Humanities and Social Science subjects.",
    officialWebsite: "https://ugcnet.nta.ac.in",
    officialNotificationUrl: "https://ugcnet.nta.ac.in",
    eligibility: {
      minAge: "No age limit for Assistant Professor. Maximum 30 years for JRF (+5 years relaxation for OBC/SC/ST/Women/Transgender).",
      minQualification: "Master's Degree with minimum 55% marks (50% for OBC/SC/ST/PwD)",
      allowedDegrees: ["M.A, M.Com, M.Sc, MBA, MCA, LLM, M.Ed"],
      finalYearEligible: true,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Paper I: Teaching & Research Aptitude", type: "50 Questions / 100 Marks (Common to all)", durationHours: 1 },
      { stage: 2, name: "Paper II: Subject Specialization", type: "100 Questions / 200 Marks (Chosen discipline)", durationHours: 2 }
    ],
    examPattern: {
      structure: "Total 150 Questions • 300 Marks • Single 3-Hour Session without break • No Negative Marking • +2 marks per correct answer"
    },
    syllabus: [
      { subject: "Paper I: General Paper on Teaching and Research Aptitude", topics: ["Teaching Aptitude, Research Aptitude, Reading Comprehension, Communication, Mathematical Reasoning & Aptitude, Logical Reasoning, Data Interpretation, Information and Communication Technology (ICT), People, Development and Environment, Higher Education System"] }
    ],
    cutoffs: [
      { year: "2024", commerceJrf: { General: 99.4, OBC: 97.2 }, economicsJrf: { General: 99.6, OBC: 98.1 } }
    ],
    recommendedBooks: [
      { title: "NTA UGC NET/SET/JRF Paper 1", author: "K.V.S. Madaan", subject: "Paper 1 Aptitude", edition: "Pearson 8th Edition", link: "https://pearson.com" }
    ],
    calendar: {
      notificationDate: "2026-04-18",
      applicationStart: "2026-04-20",
      applicationLastDate: "2026-05-19",
      admitCardDate: "2026-06-12",
      examDate: "2026-06-18 to 2026-06-25",
      resultDate: "2026-07-25",
      status: "CONFIRMED"
    }
  },

  {
    id: "dbt-bet",
    code: "DBT BET",
    title: "Biotechnology Eligibility Test (DBT Junior Research Fellowship)",
    conductingBody: "National Testing Agency (NTA) on behalf of Department of Biotechnology",
    category: "Research and Fellowship",
    subCategory: "Life Sciences & Biotech",
    scope: "All India",
    frequency: "Annual",
    mode: "Online (CBT)",
    shortDescription: "National fellowship entrance for Category-I (Tenured JRF with monthly stipend of ₹37,000 + HRA at any research institute) and Category-II (Eligible for ICMR/DBT sponsored projects).",
    officialWebsite: "https://dbt.nta.ac.in",
    officialNotificationUrl: "https://dbt.nta.ac.in",
    eligibility: {
      minAge: 28,
      ageRelaxation: { OBC: 3, SC_ST: 5, Women: 5 },
      minQualification: "M.Sc / M.Tech / M.V.Sc in Biotechnology / Bioinformatics / Life Sciences",
      minPercentage: 60,
      finalYearEligible: true,
      nationality: "Indian"
    },
    selectionProcess: [
      { stage: 1, name: "Section A: General Aptitude & General Biotechnology", type: "50 Compulsory Questions (150 Marks)", durationHours: 1.5 },
      { stage: 2, name: "Section B: Specialized Biotechnology Streams", type: "Answer 50 out of 150 Questions (150 Marks)", durationHours: 1.5 }
    ],
    examPattern: {
      totalQuestions: "100 to attempt out of 200 • Total 300 Marks • 180 Minutes • +3 marks for correct, -1 mark deduction per incorrect answer"
    },
    syllabus: [
      { subject: "Biotechnology Core", topics: ["Recombinant DNA Technology, Genomics & Proteomics, Bioprocess Engineering, Bioinformatics, Molecular Diagnostics, Animal & Plant Tissue Culture"] }
    ],
    cutoffs: [
      { year: "2024", category1Jrf: { General: 194, OBC: 172, SC: 154, ST: 142 } }
    ],
    recommendedBooks: [
      { title: "Principles of Gene Manipulation and Genomics", author: "Primrose and Twyman", subject: "Genomics", edition: "Blackwell", link: "https://amazon.in" }
    ],
    calendar: {
      notificationDate: "2026-02-05",
      applicationStart: "2026-02-08",
      applicationLastDate: "2026-03-06",
      admitCardDate: "2026-04-12",
      examDate: "2026-04-20",
      resultDate: "2026-05-25",
      status: "CONFIRMED"
    }
  },

  {
    id: "icai-ca",
    code: "CA Intermediate",
    title: "Chartered Accountants Intermediate Examination",
    conductingBody: "The Institute of Chartered Accountants of India (ICAI)",
    category: "Professional Certification",
    subCategory: "Finance & Accounting",
    scope: "All India",
    frequency: "Thrice a Year (January, May, September)",
    mode: "Offline (Pen & Paper)",
    shortDescription: "Statutory credentialing examination required to become a certified Chartered Accountant under the Chartered Accountants Act, 1949.",
    officialWebsite: "https://icai.org",
    officialNotificationUrl: "https://eservices.icai.org",
    eligibility: {
      minQualification: "Passed CA Foundation Examination OR Direct Entry for Commerce Graduates (55%+) or other Graduates (60%+)",
      finalYearEligible: false,
      nationality: "Indian and Overseas"
    },
    selectionProcess: [
      { stage: 1, name: "Group 1 (3 Papers)", type: "Advanced Accounting, Corporate & Other Laws, Taxation (300 Marks)", qualifying: true },
      { stage: 2, name: "Group 2 (3 Papers)", type: "Cost & Management Accounting, Auditing & Ethics, Financial Management & Strategic Management (300 Marks)", qualifying: true }
    ],
    examPattern: {
      passingCriteria: "Minimum 40% marks in each individual paper and minimum 50% marks in aggregate of each group. 30% case-based objective MCQs with zero negative marking."
    },
    syllabus: [
      { subject: "Corporate Laws", topics: ["Companies Act 2013, Limited Liability Partnership Act, Foreign Exchange Management Act (FEMA)"] },
      { subject: "Taxation", topics: ["Income Tax Act 1961, Goods and Services Tax (GST) Act, Customs Law"] }
    ],
    cutoffs: [
      { year: "2024", passPercentage: "Group 1: 27.15%, Group 2: 18.28%, Both Groups: 11.69%" }
    ],
    recommendedBooks: [
      { title: "ICAI Official Study Modules", author: "ICAI Board of Studies", subject: "All Subjects", edition: "New Scheme 2024", link: "https://boslive.icai.org" }
    ],
    calendar: {
      notificationDate: "2026-01-10",
      applicationStart: "2026-02-01",
      applicationLastDate: "2026-02-23",
      admitCardDate: "2026-04-18",
      examDate: "2026-05-03 to 2026-05-13",
      resultDate: "2026-07-11",
      status: "CONFIRMED"
    }
  },

  {
    id: "gmat-focus",
    code: "GMAT Focus",
    title: "Graduate Management Admission Test (GMAT Focus Edition)",
    conductingBody: "Graduate Management Admission Council (GMAC)",
    category: "International Admissions",
    subCategory: "Global Business School Admissions",
    scope: "International",
    frequency: "On-Demand (Year-Round)",
    mode: "Online at Test Center or At-Home",
    shortDescription: "The premier global business school admission test accepted by top MBA and Master's in Management institutions worldwide (Harvard, Stanford, INSEAD, ISB, IIM 1-Year Executive MBAs).",
    officialWebsite: "https://mba.com",
    officialNotificationUrl: "https://mba.com/exams/gmat-focus-edition",
    eligibility: {
      minAge: 18,
      minQualification: "Undergraduate Degree",
      attemptsLimit: "Maximum 5 attempts in a rolling 12-month period; 8 attempts lifetime",
      nationality: "All Nationalities"
    },
    selectionProcess: [
      { stage: 1, name: "GMAT Focus Test (2 Hours 15 Minutes)", type: "Computer Adaptive Test (Total Score 205 to 805)", qualifying: true }
    ],
    examPattern: {
      durationMinutes: 135,
      sections: [
        { section: "Quantitative Reasoning", questions: 21, durationMinutes: 45, scoreScale: "60 to 90" },
        { section: "Verbal Reasoning", questions: 23, durationMinutes: 45, scoreScale: "60 to 90" },
        { section: "Data Insights", questions: 20, durationMinutes: 45, scoreScale: "60 to 90" }
      ]
    },
    syllabus: [
      { subject: "Data Insights", topics: ["Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation, Two-Part Analysis"] },
      { subject: "Quantitative Reasoning", topics: ["Arithmetic, Elementary Algebra, Permutations, Probability, Work & Rate, Sets"] },
      { subject: "Verbal Reasoning", topics: ["Critical Reasoning (Assumptions, Strengths/Weaknesses), Reading Comprehension"] }
    ],
    cutoffs: [
      { year: "2024", benchmark: "ISB Hyderabad: 665-695 (Equivalent to old 710-740); Wharton/Stanford: 695-735" }
    ],
    recommendedBooks: [
      { title: "GMAT Official Guide Focus Edition", author: "GMAC", subject: "Official Review", edition: "Wiley", link: "https://mba.com" }
    ],
    calendar: {
      notificationDate: "2026-01-01",
      applicationStart: "Continuous Booking",
      applicationLastDate: "24 hours prior to appointment",
      examDate: "Year-Round Flexible Slots",
      resultDate: "Unofficial scores immediately; Official in 3-5 business days",
      status: "CONFIRMED"
    }
  }
];

module.exports = additionalExaminations;
