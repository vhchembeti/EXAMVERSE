// server/data/careerPathsData.js
// Career Guidance Engine: Dual and Multi Pathway Mapping for Indian Qualifications

const careerPathways = [
  {
    qualificationId: "btech-cs-it",
    degreeName: "B.Tech / B.E in Computer Science / Information Technology",
    streamCategory: "Engineering & Technology",
    summary: "As an engineering graduate in Computer Science, you possess high-demand analytical and computational capabilities. You are eligible for premier central technical posts, PSU scientific appointments, administrative services, and advanced national & global higher studies.",
    pathways: {
      jobOpportunities: [
        {
          name: "GATE PSU Scientific Recruitment",
          exams: ["GATE CS"],
          organizations: ["IOCL", "NTPC", "BHEL", "BARC", "ISRO", "DRDO", "HPCL"],
          role: "Scientist 'B' / Executive Engineer (Scale A)",
          salaryRange: "₹80,000 - ₹1,60,000 / month",
          details: "Recruitment based on direct GATE score plus personal interview. Outstanding job security, housing, research perks."
        },
        {
          name: "Central Engineering & Technical Recruitment",
          exams: ["RRB JE (IT/CS)", "SSC JE", "NIC Scientist B", "STQC Scientific Officer", "IB ACIO Technical"],
          organizations: ["Indian Railways", "National Informatics Centre", "Ministry of Electronics & IT"],
          role: "Junior Engineer / Scientific Officer",
          salaryRange: "₹45,000 - ₹95,000 / month",
          details: "Direct entry technical cadres with rapid promotional hierarchy in national technological infrastructure."
        },
        {
          name: "All-India Administrative & Civil Services",
          exams: ["UPSC CSE", "State PSC Group 1 (APPSC / TGPSC / TNPSC / KPSC)"],
          organizations: ["Central & State Governments"],
          role: "IAS / IPS / Deputy Collector / DSP",
          salaryRange: "₹56,100 - ₹2,50,000 / month",
          details: "Any graduate is eligible. Engineering analytical skills offer a distinct advantage in CSAT and Optional papers."
        },
        {
          name: "Banking & Financial Technology Specialist",
          exams: ["IBPS SO (IT Officer)", "SBI Specialist Cadre Officer (SCO)", "RBI Grade B IT"],
          organizations: ["Public Sector Banks", "Reserve Bank of India"],
          role: "IT Specialist Officer / Cyber Security Analyst",
          salaryRange: "₹65,000 - ₹1,20,000 / month",
          details: "Managing digital banking infrastructure, core banking systems, and payments technology."
        }
      ],
      higherStudies: [
        {
          name: "M.Tech / MS (Research) at IISc, IITs, NITs",
          exams: ["GATE CS"],
          institutions: ["IISc Bengaluru", "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur"],
          specializations: ["Artificial Intelligence & Machine Learning", "Data Engineering", "Cybersecurity", "Systems & Distributed Computing"],
          stipend: "₹12,400 / month MHRD Teaching Assistantship",
          details: "Premier research pathway leading to top tier R&D roles and direct Ph.D transitions."
        },
        {
          name: "MBA from Top Indian Business Schools",
          exams: ["CAT", "XAT", "GMAT"],
          institutions: ["IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "FMS Delhi", "XLRI Jamshedpur"],
          specializations: ["Product Management", "Technology Strategy", "Finance & Consulting"],
          details: "Highest average placement packages (₹28L - ₹35L per annum)."
        },
        {
          name: "International Master's & Ph.D (USA, Europe, Singapore)",
          exams: ["GRE", "TOEFL", "IELTS"],
          institutions: ["CMU", "Stanford", "NUS Singapore", "TU Munich", "ETH Zurich"],
          specializations: ["Computer Science", "Robotics", "Quantum Computing"],
          details: "Global research and industry leadership opportunities."
        }
      ]
    }
  },

  {
    qualificationId: "bsc-forensic-science",
    degreeName: "B.Sc in Forensic Science",
    streamCategory: "Applied Sciences & Criminalistics",
    summary: "Forensic science graduates bridge science and the judicial system. Your specialized training in crime scene investigation, toxicology, ballistics, DNA profiling, and questioned documents qualifies you for specialized forensic laboratories, investigative agencies, and advanced postgraduate research.",
    pathways: {
      jobOpportunities: [
        {
          name: "Central & State Forensic Science Laboratories (CFSL / SFSL / RFSL)",
          exams: ["UPSC Scientific Assistant", "State PSC Forensic Scientific Officer", "SSSC Scientific Assistant"],
          organizations: ["Directorate of Forensic Science Services (DFSS)", "CBI Forensic Division", "State SFSLs"],
          role: "Senior Scientific Assistant / Junior Scientific Officer (Forensic)",
          salaryRange: "₹44,900 - ₹1,42,400 / month (Level 7)",
          details: "Analysis of evidentiary materials, expert court testimony, laboratory instrumentation."
        },
        {
          name: "Law Enforcement & Intelligence Agencies",
          exams: ["IB ACIO", "CBI Sub-Inspector (via SSC CGL)", "State Police Sub-Inspector / Crime Scene Officer"],
          organizations: ["Intelligence Bureau", "Central Bureau of Investigation", "State Police CID Units"],
          role: "Intelligence Officer / Investigating Officer / Mobile Forensic Unit Head",
          salaryRange: "₹44,900 - ₹95,000 / month",
          details: "Direct on-field crime scene evidence preservation and technological interrogation."
        },
        {
          name: "General Government Administrative Services",
          exams: ["UPSC CSE", "SSC CGL", "State PSC Group 1 & 2"],
          organizations: ["Central & State Governments"],
          role: "Executive Officer / Revenue Inspector / Deputy Collector",
          salaryRange: "₹40,000 - ₹1,20,000 / month",
          details: "Open to all graduates with comprehensive syllabus coverage."
        }
      ],
      higherStudies: [
        {
          name: "M.Sc in Forensic Science / Cyber Forensics",
          exams: ["CUET PG (SCQP13)", "NFSU Entrance Exam (NFAT)"],
          institutions: ["National Forensic Sciences University (NFSU Gandhinagar/Delhi)", "Delhi University", "Banaras Hindu University", "Amity University"],
          specializations: ["Forensic Biology & Serology", "Forensic Chemistry & Toxicology", "Cyber Forensics & Digital Investigation", "Fingerprint & Questioned Documents"],
          details: "Crucial credential for gazetted Assistant Director and Scientist B posts in CFSLs."
        },
        {
          name: "Research Fellowships & Ph.D in Forensic Sciences",
          exams: ["UGC NET (Forensic Science - Subject Code 82)", "CSIR NET"],
          institutions: ["NFSU", "AIIMS Department of Forensic Medicine", "Central Universities"],
          fellowshipAmount: "₹37,000/month JRF + HRA",
          details: "Path to University Professorship and National Research Scientist cadres."
        }
      ]
    }
  },

  {
    qualificationId: "bsc-general-life-sciences",
    degreeName: "B.Sc in Life Sciences / Biotechnology / Chemistry / Botany / Zoology",
    streamCategory: "Basic & Applied Biological Sciences",
    summary: "As a science graduate, you hold foundational mastery across laboratory methodologies and biological principles, qualifying you for national research fellowships, public health laboratories, food safety administration, and postgraduate studies.",
    pathways: {
      jobOpportunities: [
        {
          name: "Food & Drug Regulatory Authority",
          exams: ["FSSAI Food Safety Officer (FSO)", "State Food Safety Officer", "Drug Inspector (State PSC)"],
          organizations: ["Food Safety and Standards Authority of India", "State Drug Control Administrations"],
          role: "Food Safety Officer / Technical Officer",
          salaryRange: "₹44,900 - ₹90,000 / month",
          details: "Monitoring food hygiene standards, manufacturing compliance, sampling and laboratory coordination."
        },
        {
          name: "Public Sector Banking & Insurance",
          exams: ["IBPS PO", "SBI PO", "RBI Assistant", "LIC AAO"],
          organizations: ["Nationalized Banks", "Life Insurance Corporation"],
          role: "Probationary Officer / Administrative Officer",
          salaryRange: "₹55,000 - ₹85,000 / month",
          details: "Open to any graduate with structured syllabus and clear promotional roadmap."
        },
        {
          name: "State & Central Civil Services",
          exams: ["UPSC CSE", "State PSC Group 1 & 2", "SSC CGL"],
          organizations: ["Central Ministries", "State Secretariats"],
          role: "Administrative & Revenue Officers",
          salaryRange: "₹50,000 - ₹1,50,000 / month",
          details: "Wide eligibility with options to select Zoology, Botany or Chemistry as optional subjects."
        }
      ],
      higherStudies: [
        {
          name: "M.Sc at IITs & IISc via IIT JAM",
          exams: ["IIT JAM (Biotechnology / Chemistry / Physics / Math)"],
          institutions: ["IIT Bombay", "IIT Roorkee", "IIT Kharagpur", "IISc Bengaluru"],
          specializations: ["Biotechnology", "Bio-Engineering", "Chemical Sciences"],
          details: "Prestigious master's programs with direct industrial placement and global research exposure."
        },
        {
          name: "M.Sc in Central Universities via CUET PG",
          exams: ["CUET PG"],
          institutions: ["JNU", "Delhi University", "University of Hyderabad", "BHU"],
          specializations: ["Molecular Medicine", "Genomics", "Biochemistry", "Microbiology"],
          details: "Affordable top-tier master's programs with state-of-the-art laboratory facilities."
        },
        {
          name: "Junior Research Fellowship & Ph.D",
          exams: ["CSIR UGC NET (Life Sciences)", "DBT BET", "ICMR JRF"],
          institutions: ["NCBS Bengaluru", "CCMB Hyderabad", "IGIB Delhi", "IISERs"],
          fellowshipAmount: "₹37,000/month JRF fellowship",
          details: "Direct entry to biomedical research, vaccines, genomics, and academic professorship."
        }
      ]
    }
  },

  {
    qualificationId: "bcom-commerce",
    degreeName: "B.Com / B.B.A (Commerce & Business)",
    streamCategory: "Commerce & Finance",
    summary: "Commerce graduates possess core literacy in accounting, taxation, economics and corporate governance, matching the prerequisites for public financial management, corporate accounting, banking leadership, and administrative services.",
    pathways: {
      jobOpportunities: [
        {
          name: "Audit & Accounts Executive Cadres",
          exams: ["SSC CGL (Assistant Audit Officer / Assistant Accounts Officer)", "CAG Audit Officer"],
          organizations: ["Comptroller and Auditor General of India (CAG)", "CGA", "Ministry of Finance"],
          role: "Assistant Audit Officer (AAO - Group B Gazetted)",
          salaryRange: "₹65,000 - ₹1,25,000 / month",
          details: "Only gazetted post recruited directly through SSC CGL with commerce-oriented Paper 2."
        },
        {
          name: "Banking & Financial Regulatory Services",
          exams: ["RBI Grade B", "SEBI Grade A (General/Finance)", "NABARD Grade A", "SBI PO", "IBPS PO"],
          organizations: ["Reserve Bank of India", "Securities and Exchange Board of India", "NABARD"],
          role: "Assistant Manager (Grade A/B)",
          salaryRange: "₹85,000 - ₹1,40,000 / month",
          details: "Prestigious financial policymaking careers with competitive compensation."
        }
      ],
      higherStudies: [
        {
          name: "Professional Financial Certifications",
          exams: ["CA Intermediate (Direct Entry for Graduates with 55%)", "CMA Intermediate", "CS Executive"],
          institutions: ["ICAI", "ICMAI", "ICSI"],
          details: "High-prestige corporate auditor and statutory compliance professional designation."
        },
        {
          name: "Master of Business Administration (MBA)",
          exams: ["CAT", "XAT", "SNAP", "NMAT"],
          institutions: ["IIM Ahmedabad", "IIM Bangalore", "FMS Delhi", "SPJIMR"],
          specializations: ["Investment Banking", "Corporate Finance", "Private Equity"],
          details: "Leading route to global financial management."
        }
      ]
    }
  }
];

module.exports = careerPathways;
