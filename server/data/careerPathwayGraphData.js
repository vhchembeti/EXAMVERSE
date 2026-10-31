// server/data/careerPathwayGraphData.js
// Authoritative Career Pathway Directed Graph Data for EXAMVERSE
// Models 5 core academic streams, educational milestones, statutory entrance tests, and career destinations.
// All pathways are explicitly tagged with epistemic educational guidance indicators.

const EPISTEMIC_BADGE = "[Educational Guidance & Statistical Possibility — Not an Appointment Guarantee]";

const PATHWAY_NODES = [
  // ==========================================
  // STREAM 1: SCIENCE & ENGINEERING
  // ==========================================
  {
    id: "node-12th-science-pcm",
    label: "Class 12th (Physics, Chemistry, Maths)",
    type: "QUALIFICATION",
    stream: "ENGINEERING_SCIENCE",
    durationYears: 2,
    typicalCost: 15000,
    description: "Higher secondary qualification in science stream providing foundational eligibility for engineering and technology degrees.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-jee-main-adv",
    label: "JEE Main / JEE Advanced / State CET",
    type: "ENTRANCE_EXAM",
    stream: "ENGINEERING_SCIENCE",
    durationYears: 1,
    typicalCost: 3500,
    description: "National and state entrance examinations for admissions into premier engineering institutes (IITs, NITs, IIITs, State Universities).",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-btech-engineering",
    label: "B.Tech / B.E. (CSE, ECE, EE, ME, CE, DA)",
    type: "DEGREE",
    stream: "ENGINEERING_SCIENCE",
    durationYears: 4,
    typicalCost: 400000,
    description: "Four-year undergraduate degree in engineering establishing deep technical fundamentals and multi-sector eligibility.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-gate-exam",
    label: "GATE (Graduate Aptitude Test in Engineering)",
    type: "ENTRANCE_EXAM",
    stream: "ENGINEERING_SCIENCE",
    durationYears: 1,
    typicalCost: 2000,
    description: "Premier national examination for postgraduate admissions with MHRD stipend and direct PSU/Scientist recruitment.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-iit-mtech",
    label: "M.Tech / MS by Research (IITs / IISc / NITs)",
    type: "DEGREE",
    stream: "ENGINEERING_SCIENCE",
    durationYears: 2,
    typicalCost: 120000,
    description: "Postgraduate master of technology offering ₹12,400/month MHRD teaching assistantship and advanced R&D placement opportunities.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-direct-phd",
    label: "Direct PhD / PMRF Research Fellowship",
    type: "FELLOWSHIP",
    stream: "ENGINEERING_SCIENCE",
    durationYears: 5,
    typicalCost: 50000,
    description: "Prime Minister's Research Fellowship (PMRF) with ₹70,000–₹80,000/month fellowship and ₹2,00,000 annual research grant.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-psu-executive-trainee",
    label: "PSU Executive Trainee (ONGC, IOCL, NTPC, BHEL)",
    type: "PSU_CAREER",
    stream: "ENGINEERING_SCIENCE",
    durationYears: 1,
    typicalCost: 1000,
    description: "Class A Executive Trainee post (E2 grade) in Maharatna/Navratna PSUs via GATE score with starting CTC ₹16L–₹24L.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-drdo-isro-barc-scientist",
    label: "Scientist / Engineer 'SC' (ISRO, DRDO, BARC)",
    type: "RESEARCH_CAREER",
    stream: "ENGINEERING_SCIENCE",
    durationYears: 1,
    typicalCost: 1000,
    description: "Level 10 Central Government scientific gazetted officer appointment in premier Indian aerospace and defense research organizations.",
    epistemicBadge: EPISTEMIC_BADGE
  },

  // ==========================================
  // STREAM 2: DIPLOMA & POLYTECHNIC
  // ==========================================
  {
    id: "node-10th-standard",
    label: "Class 10th / Secondary School Certificate (SSC)",
    type: "QUALIFICATION",
    stream: "DIPLOMA_POLYTECHNIC",
    durationYears: 1,
    typicalCost: 5000,
    description: "Foundational secondary qualification qualifying candidates for 3-year polytechnic engineering diplomas and Group C posts.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-polytechnic-diploma",
    label: "3-Year Polytechnic Diploma (Civil, Mech, Elec, CS)",
    type: "DEGREE",
    stream: "DIPLOMA_POLYTECHNIC",
    durationYears: 3,
    typicalCost: 60000,
    description: "Three-year applied technical diploma granting direct eligibility for junior engineering posts and lateral entry engineering.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-lateral-entry-cet",
    label: "Lateral Entry Engineering Entrance (LEET / ECET)",
    type: "ENTRANCE_EXAM",
    stream: "DIPLOMA_POLYTECHNIC",
    durationYears: 1,
    typicalCost: 1500,
    description: "State-level entrance examination allowing direct admission into the 2nd year (3rd semester) of 4-year B.Tech programs.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-ssc-rrb-je-exam",
    label: "SSC JE / RRB JE / State Sub-Engineer Examination",
    type: "ENTRANCE_EXAM",
    stream: "DIPLOMA_POLYTECHNIC",
    durationYears: 1,
    typicalCost: 500,
    description: "Competitive recruitment examination for Junior Engineer positions across Indian Railways, CPWD, MES, and State Irrigation.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-junior-engineer-post",
    label: "Junior Engineer (Pay Level 6: ₹35,400 Basic)",
    type: "GOVERNMENT_POST",
    stream: "DIPLOMA_POLYTECHNIC",
    durationYears: 1,
    typicalCost: 0,
    description: "Permanent Central/State Government technical supervisor appointment with defined promotion track to Assistant Executive Engineer.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-departmental-promotion-aee",
    label: "Assistant Executive Engineer (AEE / EE Promotion)",
    type: "GOVERNMENT_POST",
    stream: "DIPLOMA_POLYTECHNIC",
    durationYears: 8,
    typicalCost: 0,
    description: "Gazetted Level 10 promotional cadre achieved via Limited Departmental Competitive Examination (LDCE) and residency seniority.",
    epistemicBadge: EPISTEMIC_BADGE
  },

  // ==========================================
  // STREAM 3: ARTS & HUMANITIES
  // ==========================================
  {
    id: "node-12th-arts",
    label: "Class 12th (Humanities, History, Pol Science)",
    type: "QUALIFICATION",
    stream: "ARTS_HUMANITIES",
    durationYears: 2,
    typicalCost: 12000,
    description: "Higher secondary education in humanities focusing on society, constitutional frameworks, languages, and economics.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-cuet-ug",
    label: "CUET UG (Central University Entrance Test)",
    type: "ENTRANCE_EXAM",
    stream: "ARTS_HUMANITIES",
    durationYears: 1,
    typicalCost: 1500,
    description: "All-India entrance test for admissions into central universities (DU, JNU, BHU, HCUC, Jamia Millia).",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-ba-degree",
    label: "Bachelor of Arts (B.A. / B.A. Honours)",
    type: "DEGREE",
    stream: "ARTS_HUMANITIES",
    durationYears: 3,
    typicalCost: 45000,
    description: "Three/four-year undergraduate degree in liberal arts and social sciences providing comprehensive general studies mastery.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-upsc-cse-exam",
    label: "UPSC Civil Services Examination (CSE)",
    type: "ENTRANCE_EXAM",
    stream: "ARTS_HUMANITIES",
    durationYears: 1,
    typicalCost: 100,
    description: "India's premier three-tier competitive examination (Prelims, Mains, Interview) for civil services and police administration.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-ias-ips-career",
    label: "IAS / IPS / IFS / Central Services Group 'A'",
    type: "GOVERNMENT_POST",
    stream: "ARTS_HUMANITIES",
    durationYears: 1,
    typicalCost: 0,
    description: "India's highest administrative and policy leadership cadre (Pay Level 10 entry, escalating to Level 17 Cabinet Secretary).",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-ugc-net-jrf",
    label: "UGC NET / Junior Research Fellowship (JRF)",
    type: "FELLOWSHIP",
    stream: "ARTS_HUMANITIES",
    durationYears: 1,
    typicalCost: 1150,
    description: "National eligibility test granting Assistant Professor certification and ₹37,000/month research fellowship for PhD scholars.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-university-professor",
    label: "Assistant Professor / Academic Researcher",
    type: "RESEARCH_CAREER",
    stream: "ARTS_HUMANITIES",
    durationYears: 5,
    typicalCost: 0,
    description: "Tenured academic appointment in central and state universities under 7th CPC academic pay matrix (Academic Level 10).",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-clat-llb",
    label: "CLAT PG / 3-Year LL.B. Law Degree",
    type: "DEGREE",
    stream: "ARTS_HUMANITIES",
    durationYears: 3,
    typicalCost: 250000,
    description: "Professional law qualification qualifying candidates for judicial services exams and statutory corporate legal practice.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-judicial-magistrate",
    label: "Civil Judge / Judicial Magistrate (PCS-J)",
    type: "GOVERNMENT_POST",
    stream: "ARTS_HUMANITIES",
    durationYears: 1,
    typicalCost: 1000,
    description: "Judicial officer appointment in state subordinate judiciary delivering justice under constitutional statutory authority.",
    epistemicBadge: EPISTEMIC_BADGE
  },

  // ==========================================
  // STREAM 4: COMMERCE & FINANCE
  // ==========================================
  {
    id: "node-12th-commerce",
    label: "Class 12th (Commerce, Accountancy, Economics)",
    type: "QUALIFICATION",
    stream: "COMMERCE_FINANCE",
    durationYears: 2,
    typicalCost: 12000,
    description: "Higher secondary qualification in commerce covering financial accounting, mercantile law, and business economics.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-bcom-degree",
    label: "Bachelor of Commerce (B.Com / B.Com Honours)",
    type: "DEGREE",
    stream: "COMMERCE_FINANCE",
    durationYears: 3,
    typicalCost: 60000,
    description: "Undergraduate degree in commercial sciences offering strong foundations for banking, regulatory bodies, and auditing.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-professional-ca-cma",
    label: "Professional Accounting (CA / CMA / CS)",
    type: "DEGREE",
    stream: "COMMERCE_FINANCE",
    durationYears: 4,
    typicalCost: 150000,
    description: "Chartered Accountancy qualification by ICAI granting statutory audit authority and chief financial officer opportunities.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-banking-ibps-sbi-po",
    label: "IBPS PO / SBI PO / Specialist Officer Examination",
    type: "ENTRANCE_EXAM",
    stream: "COMMERCE_FINANCE",
    durationYears: 1,
    typicalCost: 850,
    description: "National recruitment examination for Probationary Officers and Financial Specialists in Public Sector Commercial Banks.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-bank-probationary-officer",
    label: "Bank Probationary Officer (JMGS Scale I: ₹65k In-Hand)",
    type: "GOVERNMENT_POST",
    stream: "COMMERCE_FINANCE",
    durationYears: 1,
    typicalCost: 0,
    description: "Junior Management Grade Scale I officer managing commercial credit, retail banking operations, and financial transactions.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-rbi-sebi-officer-exam",
    label: "RBI Grade B / SEBI Grade A / NABARD Examination",
    type: "ENTRANCE_EXAM",
    stream: "COMMERCE_FINANCE",
    durationYears: 1,
    typicalCost: 1000,
    description: "Premier regulatory cadre examination managing India's monetary policy, banking supervision, and capital market governance.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-rbi-grade-b-manager",
    label: "RBI Grade B Manager / SEBI Assistant Manager",
    type: "GOVERNMENT_POST",
    stream: "COMMERCE_FINANCE",
    durationYears: 1,
    typicalCost: 0,
    description: "High-prestige financial regulatory appointment with starting gross pay ~₹1,25,000/month and diplomatic-level accommodations.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-cat-mba",
    label: "Common Admission Test (CAT) / Top IIM MBA",
    type: "DEGREE",
    stream: "COMMERCE_FINANCE",
    durationYears: 2,
    typicalCost: 2500000,
    description: "Postgraduate diploma in management from Indian Institutes of Management with institutional placement packages up to ₹35 LPA.",
    epistemicBadge: EPISTEMIC_BADGE
  },

  // ==========================================
  // STREAM 5: BIOLOGY & LIFE SCIENCES
  // ==========================================
  {
    id: "node-12th-biology",
    label: "Class 12th (Physics, Chemistry, Biology - PCB)",
    type: "QUALIFICATION",
    stream: "BIOLOGY_LIFE_SCIENCES",
    durationYears: 2,
    typicalCost: 15000,
    description: "Higher secondary education in biological sciences establishing eligibility for clinical healthcare and biotech research.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-neet-ug-exam",
    label: "NEET UG (National Eligibility cum Entrance Test)",
    type: "ENTRANCE_EXAM",
    stream: "BIOLOGY_LIFE_SCIENCES",
    durationYears: 1,
    typicalCost: 1700,
    description: "Single-window national entrance exam for admissions to MBBS, BDS, BAMS, BHMS, and Veterinary degrees across India.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-mbbs-degree",
    label: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
    type: "DEGREE",
    stream: "BIOLOGY_LIFE_SCIENCES",
    durationYears: 5.5,
    typicalCost: 350000,
    description: "Professional clinical medical degree including 1-year mandatory rotating internship qualifying for medical practice.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-medical-officer-upsc-cms",
    label: "Medical Officer / UPSC Combined Medical Services (CMS)",
    type: "GOVERNMENT_POST",
    stream: "BIOLOGY_LIFE_SCIENCES",
    durationYears: 1,
    typicalCost: 200,
    description: "Central Health Service Grade A gazetted Medical Officer post in Indian Railways, Municipal Health, and CGHS dispensaries.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-bsc-btech-biotech",
    label: "B.Sc. Life Sciences / B.Tech Biotechnology",
    type: "DEGREE",
    stream: "BIOLOGY_LIFE_SCIENCES",
    durationYears: 4,
    typicalCost: 250000,
    description: "Undergraduate degree in biological technology, molecular genetics, bioinformatics, and bioprocess engineering.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-gate-bt-csir-net",
    label: "GATE (BT/XL) / CSIR NET Life Sciences / DBT-BET",
    type: "ENTRANCE_EXAM",
    stream: "BIOLOGY_LIFE_SCIENCES",
    durationYears: 1,
    typicalCost: 1500,
    description: "Competitive national research fellowship exams qualifying scholars for JRF stipends and clinical research scientist positions.",
    epistemicBadge: EPISTEMIC_BADGE
  },
  {
    id: "node-icmr-csir-research-scientist",
    label: "Research Scientist / Fellow (ICMR, CSIR, DBT)",
    type: "RESEARCH_CAREER",
    stream: "BIOLOGY_LIFE_SCIENCES",
    durationYears: 5,
    typicalCost: 0,
    description: "Doctoral research scientist post in national biopharma, vaccine development, genomic sequencing, and infectious disease labs.",
    epistemicBadge: EPISTEMIC_BADGE
  }
];

const PATHWAY_EDGES = [
  // --- STREAM 1: Engineering & Technology ---
  {
    from: "node-12th-science-pcm",
    to: "node-jee-main-adv",
    type: "PREREQUISITE",
    weightYears: 1,
    applicationCost: 3500,
    syllabusOverlapRatio: 0.95,
    competitiveRatio: 12.0,
    requirements: "Minimum 75% in Class 12 PCM (65% for SC/ST)"
  },
  {
    from: "node-jee-main-adv",
    to: "node-btech-engineering",
    type: "LEADS_TO",
    weightYears: 4,
    applicationCost: 400000,
    syllabusOverlapRatio: 0.70,
    competitiveRatio: 5.0,
    requirements: "Valid All-India Rank in JEE Main / JEE Advanced"
  },
  {
    from: "node-btech-engineering",
    to: "node-gate-exam",
    type: "PREREQUISITE",
    weightYears: 1,
    applicationCost: 2000,
    syllabusOverlapRatio: 0.90,
    competitiveRatio: 6.0,
    requirements: "Final year B.Tech student or completed engineering graduate"
  },
  {
    from: "node-gate-exam",
    to: "node-iit-mtech",
    type: "LEADS_TO",
    weightYears: 2,
    applicationCost: 120000,
    syllabusOverlapRatio: 0.85,
    competitiveRatio: 3.5,
    requirements: "GATE score meeting COAP / CCMT qualifying cutoff"
  },
  {
    from: "node-gate-exam",
    to: "node-psu-executive-trainee",
    type: "LEADS_TO",
    weightYears: 1,
    applicationCost: 1000,
    syllabusOverlapRatio: 0.95,
    competitiveRatio: 25.0,
    requirements: "Top 200 GATE All India Rank + Interview Selection"
  },
  {
    from: "node-gate-exam",
    to: "node-drdo-isro-barc-scientist",
    type: "LEADS_TO",
    weightYears: 1,
    applicationCost: 1000,
    syllabusOverlapRatio: 0.92,
    competitiveRatio: 30.0,
    requirements: "Valid GATE score + Technical Subject Interview"
  },
  {
    from: "node-iit-mtech",
    to: "node-direct-phd",
    type: "LEADS_TO",
    weightYears: 4,
    applicationCost: 50000,
    syllabusOverlapRatio: 0.80,
    competitiveRatio: 2.0,
    requirements: "Minimum CGPA 8.0 + Research proposal approval"
  },
  {
    from: "node-btech-engineering",
    to: "node-direct-phd",
    type: "LEADS_TO",
    weightYears: 5,
    applicationCost: 50000,
    syllabusOverlapRatio: 0.75,
    competitiveRatio: 8.0,
    requirements: "Direct admission for IIT graduates with CGPA >= 8.0 or PMRF qualification"
  },
  {
    from: "node-btech-engineering",
    to: "node-upsc-cse-exam",
    type: "LEADS_TO",
    weightYears: 1,
    applicationCost: 100,
    syllabusOverlapRatio: 0.45,
    competitiveRatio: 100.0,
    requirements: "Recognized Bachelor's degree + Age 21 to 32"
  },

  // --- STREAM 2: Diploma & Polytechnic ---
  {
    from: "node-10th-standard",
    to: "node-polytechnic-diploma",
    type: "PREREQUISITE",
    weightYears: 3,
    applicationCost: 60000,
    syllabusOverlapRatio: 0.60,
    competitiveRatio: 3.0,
    requirements: "Pass in 10th standard with Science & Mathematics"
  },
  {
    from: "node-polytechnic-diploma",
    to: "node-lateral-entry-cet",
    type: "PREREQUISITE",
    weightYears: 1,
    applicationCost: 1500,
    syllabusOverlapRatio: 0.85,
    competitiveRatio: 4.0,
    requirements: "Minimum 60% aggregate in 3-year Polytechnic Diploma"
  },
  {
    from: "node-lateral-entry-cet",
    to: "node-btech-engineering",
    type: "LATERAL_ENTRY",
    weightYears: 3,
    applicationCost: 300000,
    syllabusOverlapRatio: 0.80,
    competitiveRatio: 3.0,
    requirements: "Direct admission into 2nd year B.Tech"
  },
  {
    from: "node-polytechnic-diploma",
    to: "node-ssc-rrb-je-exam",
    type: "PREREQUISITE",
    weightYears: 1,
    applicationCost: 500,
    syllabusOverlapRatio: 0.90,
    competitiveRatio: 35.0,
    requirements: "3-Year Diploma in relevant engineering discipline"
  },
  {
    from: "node-ssc-rrb-je-exam",
    to: "node-junior-engineer-post",
    type: "LEADS_TO",
    weightYears: 1,
    applicationCost: 0,
    syllabusOverlapRatio: 1.0,
    competitiveRatio: 40.0,
    requirements: "Merit in Paper 1 (CBT) & Paper 2 (Technical) + Document Verification"
  },
  {
    from: "node-junior-engineer-post",
    to: "node-departmental-promotion-aee",
    type: "LEADS_TO",
    weightYears: 8,
    applicationCost: 0,
    syllabusOverlapRatio: 0.70,
    competitiveRatio: 5.0,
    requirements: "Minimum 8 years residency service + departmental LDCE examination"
  },

  // --- STREAM 3: Arts & Humanities ---
  {
    from: "node-12th-arts",
    to: "node-cuet-ug",
    type: "PREREQUISITE",
    weightYears: 1,
    applicationCost: 1500,
    syllabusOverlapRatio: 0.90,
    competitiveRatio: 8.0,
    requirements: "Pass in Class 12 with Arts/Humanities subjects"
  },
  {
    from: "node-cuet-ug",
    to: "node-ba-degree",
    type: "LEADS_TO",
    weightYears: 3,
    applicationCost: 45000,
    syllabusOverlapRatio: 0.80,
    competitiveRatio: 4.0,
    requirements: "Central University CUET percentile cutoff"
  },
  {
    from: "node-ba-degree",
    to: "node-upsc-cse-exam",
    type: "PREREQUISITE",
    weightYears: 1,
    applicationCost: 100,
    syllabusOverlapRatio: 0.80,
    competitiveRatio: 100.0,
    requirements: "Graduation degree + age 21 to 32 years"
  },
  {
    from: "node-upsc-cse-exam",
    to: "node-ias-ips-career",
    type: "LEADS_TO",
    weightYears: 1,
    applicationCost: 0,
    syllabusOverlapRatio: 1.0,
    competitiveRatio: 150.0,
    requirements: "Rank in final UPSC civil services merit list"
  },
  {
    from: "node-ba-degree",
    to: "node-ugc-net-jrf",
    type: "PREREQUISITE",
    weightYears: 2,
    applicationCost: 1150,
    syllabusOverlapRatio: 0.85,
    competitiveRatio: 15.0,
    requirements: "Postgraduate Master degree in Arts with minimum 55% marks"
  },
  {
    from: "node-ugc-net-jrf",
    to: "node-university-professor",
    type: "LEADS_TO",
    weightYears: 4,
    applicationCost: 0,
    syllabusOverlapRatio: 0.75,
    competitiveRatio: 10.0,
    requirements: "PhD degree + UGC NET / JRF score"
  },
  {
    from: "node-ba-degree",
    to: "node-clat-llb",
    type: "LEADS_TO",
    weightYears: 3,
    applicationCost: 250000,
    syllabusOverlapRatio: 0.60,
    competitiveRatio: 6.0,
    requirements: "Graduation in any discipline + Law Entrance merit"
  },
  {
    from: "node-clat-llb",
    to: "node-judicial-magistrate",
    type: "LEADS_TO",
    weightYears: 1,
    applicationCost: 1000,
    syllabusOverlapRatio: 0.88,
    competitiveRatio: 25.0,
    requirements: "LL.B degree + State Judicial Services (PCS-J) examination"
  },

  // --- STREAM 4: Commerce & Finance ---
  {
    from: "node-12th-commerce",
    to: "node-bcom-degree",
    type: "PREREQUISITE",
    weightYears: 3,
    applicationCost: 60000,
    syllabusOverlapRatio: 0.85,
    competitiveRatio: 3.0,
    requirements: "Pass in Class 12 with Commerce & Accountancy"
  },
  {
    from: "node-12th-commerce",
    to: "node-professional-ca-cma",
    type: "PREREQUISITE",
    weightYears: 4.5,
    applicationCost: 150000,
    syllabusOverlapRatio: 0.90,
    competitiveRatio: 12.0,
    requirements: "Clear CA Foundation / Direct entry after B.Com with 55%"
  },
  {
    from: "node-bcom-degree",
    to: "node-banking-ibps-sbi-po",
    type: "PREREQUISITE",
    weightYears: 1,
    applicationCost: 850,
    syllabusOverlapRatio: 0.75,
    competitiveRatio: 45.0,
    requirements: "Graduation in any stream with general aptitude & financial awareness"
  },
  {
    from: "node-banking-ibps-sbi-po",
    to: "node-bank-probationary-officer",
    type: "LEADS_TO",
    weightYears: 1,
    applicationCost: 0,
    syllabusOverlapRatio: 1.0,
    competitiveRatio: 50.0,
    requirements: "Selection in Prelims, Mains, Group Discussion & Personal Interview"
  },
  {
    from: "node-bcom-degree",
    to: "node-rbi-sebi-officer-exam",
    type: "PREREQUISITE",
    weightYears: 1,
    applicationCost: 1000,
    syllabusOverlapRatio: 0.85,
    competitiveRatio: 80.0,
    requirements: "Minimum 60% in Bachelor's degree (Economics, Finance, Commerce preferred)"
  },
  {
    from: "node-rbi-sebi-officer-exam",
    to: "node-rbi-grade-b-manager",
    type: "LEADS_TO",
    weightYears: 1,
    applicationCost: 0,
    syllabusOverlapRatio: 1.0,
    competitiveRatio: 90.0,
    requirements: "Clear Phase 1, Phase 2 (Economic & Social Issues, Finance) and Interview"
  },
  {
    from: "node-bcom-degree",
    to: "node-cat-mba",
    type: "LEADS_TO",
    weightYears: 2,
    applicationCost: 2500000,
    syllabusOverlapRatio: 0.50,
    competitiveRatio: 20.0,
    requirements: "99+ percentile in CAT for top IIMs (Ahmedabad, Bangalore, Calcutta)"
  },

  // --- STREAM 5: Biology & Life Sciences ---
  {
    from: "node-12th-biology",
    to: "node-neet-ug-exam",
    type: "PREREQUISITE",
    weightYears: 1,
    applicationCost: 1700,
    syllabusOverlapRatio: 0.95,
    competitiveRatio: 25.0,
    requirements: "Minimum 50% in Class 12 PCB (40% for SC/ST/OBC)"
  },
  {
    from: "node-neet-ug-exam",
    to: "node-mbbs-degree",
    type: "LEADS_TO",
    weightYears: 5.5,
    applicationCost: 350000,
    syllabusOverlapRatio: 0.70,
    competitiveRatio: 25.0,
    requirements: "High national percentile score in NEET UG counseling"
  },
  {
    from: "node-mbbs-degree",
    to: "node-medical-officer-upsc-cms",
    type: "LEADS_TO",
    weightYears: 1,
    applicationCost: 200,
    syllabusOverlapRatio: 0.90,
    competitiveRatio: 10.0,
    requirements: "MBBS degree + registration with State Medical Council"
  },
  {
    from: "node-12th-biology",
    to: "node-bsc-btech-biotech",
    type: "PREREQUISITE",
    weightYears: 4,
    applicationCost: 250000,
    syllabusOverlapRatio: 0.75,
    competitiveRatio: 5.0,
    requirements: "Class 12th with Physics, Chemistry and Biology / Maths"
  },
  {
    from: "node-bsc-btech-biotech",
    to: "node-gate-bt-csir-net",
    type: "PREREQUISITE",
    weightYears: 1,
    applicationCost: 1500,
    syllabusOverlapRatio: 0.88,
    competitiveRatio: 12.0,
    requirements: "Graduation in Biotechnology / Life Sciences / Microbiology"
  },
  {
    from: "node-gate-bt-csir-net",
    to: "node-icmr-csir-research-scientist",
    type: "LEADS_TO",
    weightYears: 5,
    applicationCost: 0,
    syllabusOverlapRatio: 0.85,
    competitiveRatio: 15.0,
    requirements: "Junior Research Fellowship rank + institutional research interview"
  }
];

module.exports = {
  EPISTEMIC_BADGE,
  PATHWAY_NODES,
  PATHWAY_EDGES
};
