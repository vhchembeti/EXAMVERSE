// server/data/learningRegistryData.js
// National Learning Centre Registry
// Multi-Tier Educational Spaces & 20 Core Subject Domains with Provenance Licensing & High-Yield Formulas

const EDUCATION_TIERS = [
  {
    id: "SCHOOL_10TH",
    name: "Secondary School (10th Standard)",
    shortCode: "10th",
    description: "Foundational mathematics, science, social studies, and language curricula for CBSE, ICSE, and State Boards.",
    targetExams: ["CBSE Board", "ICSE Board", "NTSE", "Junior Science Olympiad", "State Secondary Cert."],
    badgeColor: "emerald"
  },
  {
    id: "INTERMEDIATE_12TH",
    name: "Higher Secondary (11th & 12th Standard)",
    shortCode: "12th",
    description: "Core preparation across Science (PCM/PCB), Commerce, and Humanities Streams.",
    targetExams: ["JEE Main/Advanced", "NEET UG", "CUET UG", "NDA", "State Board 12th"],
    badgeColor: "blue"
  },
  {
    id: "DIPLOMA_POLYTECHNIC",
    name: "Polytechnic & 3-Year Technical Diploma",
    shortCode: "Diploma",
    description: "Applied engineering skills, lateral entry curricula, and technical junior engineer foundations.",
    targetExams: ["Lateral Entry B.Tech (LEET)", "SSC JE", "RRB JE", "State Technical Boards"],
    badgeColor: "amber"
  },
  {
    id: "UNDERGRADUATE",
    name: "Undergraduate Degree (B.Tech / B.Sc / B.Com / B.A)",
    shortCode: "UG",
    description: "In-depth degree engineering, computing, sciences, commerce, and liberal arts course modules.",
    targetExams: ["GATE", "CAT", "UGC NET", "JAM", "Campus Placements"],
    badgeColor: "indigo"
  },
  {
    id: "POSTGRADUATE",
    name: "Postgraduate & Master's Degrees (M.Tech / M.Sc / MBA)",
    shortCode: "PG",
    description: "Specialized postgraduate studies, advanced research techniques, and managerial frameworks.",
    targetExams: ["UGC NET / JRF", "GATE (Specialized)", "CAT / XAT", "Doctoral Admissions"],
    badgeColor: "purple"
  },
  {
    id: "COMPETITIVE_RECRUITMENT",
    name: "Competitive Recruitment & Public Sector Jobs",
    shortCode: "Recruitment",
    description: "Central, State, Banking, Defence, and Regulatory statutory recruitment examination tracks.",
    targetExams: ["UPSC CSE", "SSC CGL", "IBPS PO", "RRB NTPC", "State PSCs", "Defence (CDS/AFCAT)"],
    badgeColor: "rose"
  },
  {
    id: "RESEARCH_FELLOWSHIP",
    name: "Doctoral Research & Junior Research Fellowships",
    shortCode: "Research",
    description: "CSIR-UGC JRF, ICMR, DST-INSPIRE, and premier doctoral fellowship programs across Indian universities.",
    targetExams: ["CSIR NET JRF", "UGC NET JRF", "DBT JRF", "ICMR JRF", "IISc/IIT PhD Entrances"],
    badgeColor: "cyan"
  },
  {
    id: "VOCATIONAL_SKILL",
    name: "Vocational & Craftsman Training (ITI / Skill India)",
    shortCode: "Vocational",
    description: "Industry-aligned vocational trades, NCVT CTS certifications, and skill apprenticeship roadmaps.",
    targetExams: ["AITT (All India Trade Test)", "Railway ALP/Technician", "Skill India Certifications"],
    badgeColor: "orange"
  }
];

const SUBJECT_SPACES = [
  {
    id: "engg-maths",
    name: "Engineering Mathematics",
    code: "EM",
    icon: "Calculator",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Linear Algebra, Calculus, Differential Equations, Complex Analysis, Probability and Statistics, and Numerical Methods.",
    syllabusTopics: [
      { id: "em-la", name: "Linear Algebra (Matrices, Eigenvalues, SVD)", weightage: 3.5, estHours: 18, prerequisites: [] },
      { id: "em-calc", name: "Multivariate Calculus & Vector Calculus", weightage: 3.5, estHours: 20, prerequisites: ["em-la"] },
      { id: "em-de", name: "Differential Equations (ODEs & PDEs)", weightage: 2.5, estHours: 15, prerequisites: ["em-calc"] },
      { id: "em-prob", name: "Probability & Statistics (Distributions, Bayes)", weightage: 3.5, estHours: 18, prerequisites: [] },
      { id: "em-num", name: "Numerical Methods & Transform Theory", weightage: 2.0, estHours: 12, prerequisites: ["em-calc"] }
    ],
    resources: [
      {
        id: "res-nptel-la",
        title: "NPTEL Linear Algebra Course by Prof. K.C. Sivakumar (IIT Madras)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/111106051",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Madras Open Access Courseware"
      },
      {
        id: "res-nptel-prob",
        title: "NPTEL Probability and Statistics by Prof. Somesh Kumar (IIT Kharagpur)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/111105041",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Kharagpur Official Repository"
      },
      {
        id: "res-official-gate-maths",
        title: "Official GATE Engineering Mathematics Master Reference Notes",
        type: "STUDY_NOTES",
        url: "https://gate2026.iitk.ac.in/syllabus",
        license: "OFFICIAL_PUBLIC",
        provenance: "GATE Organizing Institute Public Syllabus"
      }
    ],
    formulas: [
      {
        id: "f-cayley-hamilton",
        name: "Cayley-Hamilton Theorem",
        topic: "Linear Algebra",
        latex: "p(A) = \\det(A - \\lambda I) = 0 \\implies A^n + c_{n-1} A^{n-1} + \\dots + c_0 I = 0",
        description: "Every square matrix satisfies its own characteristic equation. Useful for computing matrix inverses and powers efficiently.",
        example: "For A = [[1, 2], [3, 4]], characteristic polynomial is lambda^2 - 5*lambda - 2 = 0, so A^2 = 5A + 2I."
      },
      {
        id: "f-bayes-theorem",
        name: "Bayes' Theorem",
        topic: "Probability",
        latex: "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)} = \\frac{P(B|A) \\cdot P(A)}{\\sum_{i} P(B|A_i) P(A_i)}",
        description: "Calculates the posterior probability of event A occurring given prior knowledge of conditions related to the event.",
        example: "Used for diagnostic testing, spam filters, and conditional probability in competitive exams."
      },
      {
        id: "f-normal-distribution",
        name: "Gaussian / Normal Distribution PDF",
        topic: "Probability & Statistics",
        latex: "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2}",
        description: "Continuous probability distribution symmetric about the mean mu, with standard deviation sigma.",
        example: "Total area under curve is 1; 68.27% of observations lie within [mu - sigma, mu + sigma]."
      }
    ]
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    code: "DSA",
    icon: "Network",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Asymptotic Analysis, Stacks, Queues, Linked Lists, Trees, Heaps, Hashing, Graph Algorithms, Dynamic Programming, and Greedy Techniques.",
    syllabusTopics: [
      { id: "dsa-asymptotic", name: "Asymptotic Notations & Recurrence Relations", weightage: 3.0, estHours: 12, prerequisites: [] },
      { id: "dsa-trees", name: "Binary Trees, BSTs, AVL & Red-Black Trees", weightage: 4.0, estHours: 20, prerequisites: ["dsa-asymptotic"] },
      { id: "dsa-graphs", name: "Graph Traversals (BFS/DFS), Shortest Paths & MST", weightage: 4.5, estHours: 22, prerequisites: ["dsa-trees"] },
      { id: "dsa-dp", name: "Dynamic Programming & Greedy Algorithms", weightage: 4.0, estHours: 20, prerequisites: ["dsa-asymptotic"] },
      { id: "dsa-sorting", name: "Sorting, Searching & Hashing", weightage: 2.5, estHours: 14, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-nptel-dsa",
        title: "Programming, Data Structures and Algorithms in Python - Prof. Madhavan Mukund (CMI)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/106106145",
        license: "CC_BY_SA",
        provenance: "NPTEL / Chennai Mathematical Institute (CMI)"
      },
      {
        id: "res-nptel-design-algo",
        title: "Design and Analysis of Algorithms - Prof. Abhiram Ranade (IIT Bombay)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/106101060",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Bombay"
      }
    ],
    formulas: [
      {
        id: "f-master-theorem",
        name: "Master Theorem for Divide & Conquer",
        topic: "Asymptotic Analysis",
        latex: "T(n) = a T(n/b) + f(n), \\quad c = \\log_b a. \\\\ \\text{Case 1: } f(n) = O(n^{c - \\epsilon}) \\implies T(n) = \\Theta(n^c) \\\\ \\text{Case 2: } f(n) = \\Theta(n^c \\log^k n) \\implies T(n) = \\Theta(n^c \\log^{k+1} n) \\\\ \\text{Case 3: } f(n) = \\Omega(n^{c + \\epsilon}) \\text{ and regularity} \\implies T(n) = \\Theta(f(n))",
        description: "Provides closed-form asymptotic bounds for divide-and-conquer recurrences.",
        example: "For Merge Sort: T(n) = 2T(n/2) + Theta(n) -> a=2, b=2, c=1. Case 2 gives Theta(n log n)."
      },
      {
        id: "f-catalan-numbers",
        name: "Catalan Number (Number of Unlabeled Binary Trees)",
        topic: "Trees & Combinatorics",
        latex: "C_n = \\frac{1}{n+1} \\binom{2n}{n} = \\frac{(2n)!}{(n+1)! n!}",
        description: "Counts structurally unique binary trees with n nodes, balanced parentheses sequences, and full binary trees.",
        example: "For n = 3 nodes, C_3 = (1/4) * (6! / (3! 3!)) = 5 structurally distinct binary trees."
      }
    ]
  },
  {
    id: "os",
    name: "Operating Systems",
    code: "OS",
    icon: "Cpu",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Processes, Threads, CPU Scheduling, Synchronization, Deadlocks, Memory Management, Virtual Memory, and File Systems.",
    syllabusTopics: [
      { id: "os-processes", name: "Process Management & Inter-Process Communication", weightage: 3.0, estHours: 14, prerequisites: [] },
      { id: "os-sync", name: "Process Synchronization & Semaphores", weightage: 4.0, estHours: 18, prerequisites: ["os-processes"] },
      { id: "os-deadlocks", name: "Deadlock Detection, Prevention & Banker's Algorithm", weightage: 3.0, estHours: 12, prerequisites: ["os-sync"] },
      { id: "os-vm", name: "Memory Management, Paging, TLB & Virtual Memory", weightage: 4.5, estHours: 20, prerequisites: [] },
      { id: "os-disk", name: "File Systems & Disk Scheduling (SCAN, C-SCAN)", weightage: 2.0, estHours: 10, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-nptel-os",
        title: "Operating Systems Course by Prof. Chester Rebeiro (IIT Madras)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/106106144",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Madras"
      }
    ],
    formulas: [
      {
        id: "f-effective-access-time",
        name: "Effective Memory Access Time (EMAT) with TLB",
        topic: "Virtual Memory",
        latex: "EMAT = h \\cdot (t_{tlb} + t_m) + (1 - h) \\cdot (t_{tlb} + (k + 1) t_m)",
        description: "Calculates average memory access latency in paged systems with hit ratio h, TLB access time t_tlb, main memory time t_m, and k levels of page tables.",
        example: "With h = 0.9, t_tlb = 20ns, t_m = 100ns (single-level paging k=1): EMAT = 0.9*(120) + 0.1*(20 + 200) = 108 + 22 = 130 ns."
      },
      {
        id: "f-bankers-safety",
        name: "Banker's Algorithm Need Matrix",
        topic: "Deadlocks",
        latex: "\\text{Need}[i][j] = \\text{Max}[i][j] - \\text{Allocation}[i][j]",
        description: "Validates whether the current allocation state allows a safe execution sequence without entering deadlock.",
        example: "Process P_i is granted resources only if Need_i <= Available and resulting state remains safe."
      }
    ]
  },
  {
    id: "dbms",
    name: "Database Management Systems",
    code: "DBMS",
    icon: "Database",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "ER-Model, Relational Model, Relational Algebra, Tuple Calculus, SQL, Normalization (1NF to BCNF), Transactions, Concurrency Control, and Indexing.",
    syllabusTopics: [
      { id: "dbms-rel-model", name: "Relational Model & Relational Algebra", weightage: 3.0, estHours: 14, prerequisites: [] },
      { id: "dbms-sql", name: "SQL Queries, Nested Queries & Aggregations", weightage: 3.5, estHours: 16, prerequisites: ["dbms-rel-model"] },
      { id: "dbms-norm", name: "Functional Dependencies & Normal Forms (1NF, 2NF, 3NF, BCNF)", weightage: 4.5, estHours: 20, prerequisites: ["dbms-rel-model"] },
      { id: "dbms-tx", name: "Transactions, ACID Properties & Serializability", weightage: 4.0, estHours: 18, prerequisites: [] },
      { id: "dbms-index", name: "B and B+ Trees Indexing & Hashing", weightage: 3.0, estHours: 12, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-nptel-dbms",
        title: "Database Management System - Prof. Partha Pratim Das (IIT Kharagpur)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/106105175",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Kharagpur"
      }
    ],
    formulas: [
      {
        id: "f-bplus-order",
        name: "B+ Tree Node Capacity & Order Constraint",
        topic: "Storage & Indexing",
        latex: "p \\cdot R + (p - 1) \\cdot K \\le B",
        description: "Determines maximum order p of an internal node with block size B, record/block pointer size R, and key size K.",
        example: "If B = 512 bytes, R = 6 bytes, K = 8 bytes: 6p + 8(p - 1) <= 512 => 14p <= 520 => p = 37."
      },
      {
        id: "f-bcnf-condition",
        name: "Boyce-Codd Normal Form (BCNF) Condition",
        topic: "Normalization",
        latex: "\\forall (X \\to Y) \\in F^+ : \\quad Y \\subseteq X \\;\\text{(Trivial)} \\quad\\lor\\quad X \\text{ is a Super Key of } R",
        description: "A relation schema is in BCNF if for every non-trivial functional dependency X -> Y, X is a superkey.",
        example: "BCNF strictly eliminates all redundancy arising from functional dependencies."
      }
    ]
  },
  {
    id: "computer-networks",
    name: "Computer Networks",
    code: "CN",
    icon: "Server",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "OSI & TCP/IP Model, Flow & Error Control, Framing, Ethernet, IP Addressing, Routing Protocols, TCP/UDP, and Application Layer Protocols.",
    syllabusTopics: [
      { id: "cn-physical-data", name: "Data Link Layer (Framing, Flow & Error Control, CSMA/CD)", weightage: 4.0, estHours: 18, prerequisites: [] },
      { id: "cn-network", name: "Network Layer (IPv4/IPv6, CIDR Subnetting, Routing)", weightage: 4.5, estHours: 22, prerequisites: ["cn-physical-data"] },
      { id: "cn-transport", name: "Transport Layer (TCP, UDP, Congestion Control)", weightage: 4.0, estHours: 18, prerequisites: ["cn-network"] },
      { id: "cn-app", name: "Application Protocols (DNS, HTTP, SMTP, FTP)", weightage: 2.5, estHours: 12, prerequisites: ["cn-transport"] }
    ],
    resources: [
      {
        id: "res-nptel-cn",
        title: "Computer Networks Course by Prof. Sujoy Ghosh (IIT Kharagpur)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/106105080",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Kharagpur"
      }
    ],
    formulas: [
      {
        id: "f-stop-and-wait-eff",
        name: "Stop-and-Wait ARQ Efficiency",
        topic: "Data Link Layer",
        latex: "\\eta = \\frac{1}{1 + 2a}, \\quad a = \\frac{T_{prop}}{T_{trans}} = \\frac{d / v}{L / B}",
        description: "Efficiency of stop-and-wait protocol where a is the ratio of propagation delay to transmission delay.",
        example: "For Go-Back-N with window size N, efficiency is eta = N / (1 + 2a)."
      },
      {
        id: "f-csmacd-frame",
        name: "CSMA/CD Minimum Frame Size",
        topic: "Ethernet & Medium Access",
        latex: "L_{min} \\ge 2 \\cdot T_{prop} \\cdot B = 2 \\cdot \\left(\\frac{d}{v}\\right) \\cdot B",
        description: "To ensure collisions are detected before packet transmission completes, frame transmission time must be at least twice propagation time.",
        example: "With distance 1 km, velocity 2x10^8 m/s, bandwidth 10 Mbps: L_min = 2 * (1000 / 2e8) * 10e6 = 100 bits."
      }
    ]
  },
  {
    id: "digital-logic",
    name: "Digital Logic & Computer Organization",
    code: "DLCO",
    icon: "Binary",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Boolean Algebra, Minimization (K-Maps), Combinational Circuits, Sequential Circuits, Pipelining, Cache Memory, and Machine Instructions.",
    syllabusTopics: [
      { id: "dl-boolean", name: "Boolean Algebra & K-Map Minimization", weightage: 3.0, estHours: 12, prerequisites: [] },
      { id: "dl-comb", name: "Combinational Circuits (Multiplexers, Decoders, Adders)", weightage: 3.5, estHours: 15, prerequisites: ["dl-boolean"] },
      { id: "dl-seq", name: "Sequential Circuits (Flip-Flops, Counters, FSMs)", weightage: 4.0, estHours: 18, prerequisites: ["dl-comb"] },
      { id: "co-pipeline", name: "Instruction Pipelining & Hazards", weightage: 4.0, estHours: 18, prerequisites: [] },
      { id: "co-cache", name: "Cache Memory Hierarchies & Mapping", weightage: 3.5, estHours: 15, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-nptel-digital",
        title: "Digital Electronic Circuits - Prof. Goutam Saha (IIT Kharagpur)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/108105132",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Kharagpur"
      }
    ],
    formulas: [
      {
        id: "f-pipelining-speedup",
        name: "Pipelining Ideal Speedup",
        topic: "Computer Organization",
        latex: "S_k = \\frac{n \\cdot k}{k + n - 1} \\xrightarrow{n \\to \\infty} k",
        description: "Speedup of a k-stage pipeline executing n independent instructions compared to non-pipelined execution.",
        example: "For a 5-stage pipeline executing 1000 instructions: S = 5000 / 1004 approx 4.98."
      },
      {
        id: "f-cache-amats",
        name: "Average Memory Access Time (AMAT) with Multi-Level Cache",
        topic: "Memory Hierarchy",
        latex: "\\text{AMAT} = t_{L1} + m_{L1} \\cdot (t_{L2} + m_{L2} \\cdot t_{mem})",
        description: "Average latency to fetch an instruction or data word in a 2-level hierarchical memory subsystem.",
        example: "With L1 hit time 1ns, L1 miss rate 5%, L2 hit time 10ns, L2 miss rate 20%, memory latency 100ns: AMAT = 1 + 0.05*(10 + 0.2*100) = 2.5 ns."
      }
    ]
  },
  {
    id: "ai-ds",
    name: "Artificial Intelligence & Data Science",
    code: "AIDS",
    icon: "Brain",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE", "RESEARCH_FELLOWSHIP"],
    description: "Search Algorithms, Supervised & Unsupervised Learning, Neural Networks, Deep Learning, Regression, Classification, and Feature Engineering.",
    syllabusTopics: [
      { id: "ai-search", name: "Uninformed & Informed Search (A*, Minimax, Alpha-Beta)", weightage: 3.5, estHours: 16, prerequisites: [] },
      { id: "ml-supervised", name: "Linear Regression, Logistic Regression & SVMs", weightage: 4.5, estHours: 20, prerequisites: [] },
      { id: "ml-trees", name: "Decision Trees, Random Forests & Ensemble Methods", weightage: 4.0, estHours: 18, prerequisites: ["ml-supervised"] },
      { id: "ml-neural", name: "Multi-Layer Perceptrons & Backpropagation", weightage: 4.5, estHours: 22, prerequisites: ["ml-supervised"] },
      { id: "ml-unsupervised", name: "Clustering (K-Means), PCA & Dimensionality Reduction", weightage: 3.5, estHours: 16, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-nptel-ai",
        title: "Artificial Intelligence: Search Methods for Problem Solving - Prof. Deepak Khemani (IIT Madras)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/106106126",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Madras"
      }
    ],
    formulas: [
      {
        id: "f-cross-entropy",
        name: "Binary Cross-Entropy Loss",
        topic: "Machine Learning",
        latex: "L(y, \\hat{y}) = -\\frac{1}{N} \\sum_{i=1}^{N} \\left[ y_i \\log(\\hat{y}_i) + (1 - y_i) \\log(1 - \\hat{y}_i) \\right]",
        description: "Objective function penalized when predicted probability departs from ground truth binary label.",
        example: "If true label y=1 and model predicts 0.99, loss is -ln(0.99) approx 0.01; if model predicts 0.01, loss is approx 4.60."
      },
      {
        id: "f-pca-variance",
        name: "PCA Covariance Eigen-Decomposition",
        topic: "Unsupervised Learning",
        latex: "\\Sigma = \\frac{1}{m} X^T X = V \\Lambda V^T, \\quad \\lambda_1 \\ge \\lambda_2 \\ge \\dots \\ge \\lambda_d",
        description: "Projects data onto orthogonal eigenvectors of maximum variance, reducing dimensionality while preserving signal.",
        example: "The fraction of variance retained by k principal components is sum(lambda_1..k) / sum(lambda_all)."
      }
    ]
  },
  {
    id: "quantitative-aptitude",
    name: "Quantitative Aptitude",
    code: "QA",
    icon: "TrendingUp",
    tierIds: ["SCHOOL_10TH", "INTERMEDIATE_12TH", "UNDERGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Number Systems, Percentages, Profit & Loss, Simple & Compound Interest, Time & Work, Speed Distance Time, Permutations & Combinations, and Data Interpretation.",
    syllabusTopics: [
      { id: "qa-num", name: "Number Systems, HCF/LCM & Divisibility", weightage: 3.0, estHours: 10, prerequisites: [] },
      { id: "qa-arithmetic", name: "Percentages, Profit & Loss, Ratio & Proportion", weightage: 4.5, estHours: 16, prerequisites: [] },
      { id: "qa-interest", name: "Simple & Compound Interest", weightage: 3.0, estHours: 10, prerequisites: ["qa-arithmetic"] },
      { id: "qa-work-time", name: "Time and Work, Pipes & Cisterns", weightage: 3.5, estHours: 12, prerequisites: [] },
      { id: "qa-speed", name: "Speed, Time & Distance, Trains & Boats", weightage: 3.5, estHours: 12, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-swayam-aptitude",
        title: "SWAYAM Quantitative Aptitude Master Modules",
        type: "STUDY_NOTES",
        url: "https://swayam.gov.in",
        license: "OFFICIAL_PUBLIC",
        provenance: "Ministry of Education / SWAYAM Portal"
      }
    ],
    formulas: [
      {
        id: "f-ci-annual",
        name: "Compound Interest Formula",
        topic: "Arithmetic",
        latex: "A = P \\left(1 + \\frac{R}{100}\\right)^n, \\quad CI = A - P",
        description: "Accumulated amount A from principal P at annual rate R% compounded for n years.",
        example: "Rs 10,000 at 10% for 2 years gives A = 10000 * 1.21 = Rs 12,100, CI = Rs 2,100."
      },
      {
        id: "f-relative-speed",
        name: "Relative Speed of Two Moving Objects",
        topic: "Speed & Distance",
        latex: "S_{rel} = \\begin{cases} S_1 + S_2 & \\text{if moving in opposite directions} \\\\ |S_1 - S_2| & \\text{if moving in same direction} \\end{cases}",
        description: "Applies to trains crossing each other or overtaking on parallel tracks.",
        example: "Two trains moving towards each other at 60 km/h and 40 km/h have relative approach speed of 100 km/h."
      }
    ]
  },
  {
    id: "logical-reasoning",
    name: "Logical & Analytical Reasoning",
    code: "LR",
    icon: "Compass",
    tierIds: ["SCHOOL_10TH", "INTERMEDIATE_12TH", "UNDERGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Syllogisms, Blood Relations, Direction Sense, Seating Arrangements, Coding-Decoding, Clocks & Calendars, and Critical Reasoning.",
    syllabusTopics: [
      { id: "lr-syllogisms", name: "Syllogisms & Deductive Logic", weightage: 3.5, estHours: 12, prerequisites: [] },
      { id: "lr-seating", name: "Linear & Circular Seating Arrangements", weightage: 4.5, estHours: 16, prerequisites: [] },
      { id: "lr-blood-dir", name: "Blood Relations & Direction Sense Tests", weightage: 3.0, estHours: 10, prerequisites: [] },
      { id: "lr-coding", name: "Coding-Decoding & Series Completion", weightage: 3.0, estHours: 10, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-examverse-reasoning",
        title: "Standard Analytical Reasoning Patterns & Venn Diagrams",
        type: "STUDY_NOTES",
        url: "/learn/subjects/logical-reasoning",
        license: "ORIGINAL_EDUCATIONAL_GUIDANCE",
        provenance: "EXAMVERSE Curriculum Team"
      }
    ],
    formulas: [
      {
        id: "f-clock-angle",
        name: "Angle Between Clock Hands",
        topic: "Clocks",
        latex: "\\theta = \\left| 30 H - \\frac{11}{2} M \\right|",
        description: "Calculates angle theta in degrees between hour hand and minute hand at H hours and M minutes.",
        example: "At 3:30, theta = |30(3) - (11/2)(30)| = |90 - 165| = 75 degrees."
      }
    ]
  },
  {
    id: "general-studies",
    name: "General Studies & Indian Polity",
    code: "GS",
    icon: "Landmark",
    tierIds: ["UNDERGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Constitution of India, Fundamental Rights, Directive Principles, Union & State Executive, Judiciary, Indian Economy, Geography, and Modern Indian History.",
    syllabusTopics: [
      { id: "gs-constitution", name: "Preamble, Fundamental Rights (Articles 12-35) & DPSPs", weightage: 4.0, estHours: 18, prerequisites: [] },
      { id: "gs-executive", name: "President, Prime Minister, Parliament & Judiciary", weightage: 4.5, estHours: 20, prerequisites: ["gs-constitution"] },
      { id: "gs-economy", name: "Fiscal Policy, Monetary Policy, Inflation & Banking", weightage: 3.5, estHours: 16, prerequisites: [] },
      { id: "gs-geography", name: "Drainage Systems, Monsoons & Physical Geography", weightage: 3.5, estHours: 15, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-india-code",
        title: "Constitution of India (Official Legislative Department Text)",
        type: "OFFICIAL_STATUTE",
        url: "https://legislative.gov.in/constitution-of-india",
        license: "OFFICIAL_PUBLIC",
        provenance: "Ministry of Law and Justice, Government of India"
      }
    ],
    formulas: [
      {
        id: "f-article-32-writs",
        name: "Article 32 Constitutional Remedies (The 5 Writs)",
        topic: "Polity",
        latex: "\\text{Writs} = \\{ \\text{Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto} \\}",
        description: "Right to move Supreme Court by appropriate proceedings for the enforcement of the Fundamental Rights.",
        example: "Referred to by Dr. B.R. Ambedkar as the 'heart and soul of the Constitution'."
      }
    ]
  },
  {
    id: "signals-systems",
    name: "Signals and Systems",
    code: "SS",
    icon: "Activity",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Continuous and Discrete-time signals, LTI systems, Fourier Series, Continuous-Time Fourier Transform (CTFT), Laplace Transform, DTFT, and Z-Transform.",
    syllabusTopics: [
      { id: "ss-lti", name: "Linear Time-Invariant (LTI) Systems & Convolution", weightage: 3.5, estHours: 15, prerequisites: [] },
      { id: "ss-fourier", name: "Continuous-Time & Discrete-Time Fourier Transforms", weightage: 4.0, estHours: 18, prerequisites: ["ss-lti"] },
      { id: "ss-laplace-z", name: "Laplace Transform, Z-Transform & Region of Convergence (ROC)", weightage: 4.5, estHours: 20, prerequisites: ["ss-fourier"] }
    ],
    resources: [
      {
        id: "res-nptel-ss",
        title: "NPTEL Signals and Systems - Prof. V.M. Gadre (IIT Bombay)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/117101055",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Bombay"
      }
    ],
    formulas: [
      {
        id: "f-convolution-integral",
        name: "LTI Convolution Integral",
        topic: "LTI Systems",
        latex: "y(t) = x(t) * h(t) = \\int_{-\\infty}^{\\infty} x(\\tau) h(t - \\tau) d\\tau",
        description: "Output response of a continuous-time LTI system to arbitrary input x(t) with impulse response h(t).",
        example: "Convolution in time domain maps to multiplication in frequency domain: Y(s) = X(s) H(s)."
      }
    ]
  },
  {
    id: "networks",
    name: "Network Theory & Circuit Analysis",
    code: "NT",
    icon: "Zap",
    tierIds: ["DIPLOMA_POLYTECHNIC", "UNDERGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "KCL, KVL, Node and Mesh Analysis, Network Theorems (Thevenin, Norton, Superposition, Maximum Power Transfer), Transient Analysis, Two-Port Networks.",
    syllabusTopics: [
      { id: "nt-theorems", name: "Network Theorems (Thevenin, Norton, Max Power)", weightage: 4.0, estHours: 16, prerequisites: [] },
      { id: "nt-transients", name: "Transient Analysis of RL, RC and RLC Circuits", weightage: 4.0, estHours: 18, prerequisites: ["nt-theorems"] },
      { id: "nt-two-port", name: "Two-Port Network Parameters (Z, Y, ABCD, h)", weightage: 3.0, estHours: 12, prerequisites: ["nt-theorems"] }
    ],
    resources: [
      {
        id: "res-nptel-networks",
        title: "NPTEL Basic Electrical Circuits - Prof. Nagendra Krishnapura (IIT Madras)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/108106075",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Madras"
      }
    ],
    formulas: [
      {
        id: "f-thevenin-max-power",
        name: "Maximum Power Transfer Theorem (DC & AC)",
        topic: "Network Theorems",
        latex: "R_L = R_{th} \\implies P_{max} = \\frac{V_{th}^2}{4 R_{th}}, \\quad Z_L = Z_{th}^* \\implies P_{max} = \\frac{|V_{th}|^2}{4 R_{th}}",
        description: "Maximum average power delivered to load occurs when load impedance equals complex conjugate of source Thevenin impedance.",
        example: "Efficiency under maximum power transfer condition is strictly 50%."
      }
    ]
  },
  {
    id: "electronic-devices",
    name: "Electronic Devices & Semiconductor Physics",
    code: "EDC",
    icon: "Layers",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Energy bands in semiconductors, carrier transport (drift and diffusion), P-N junction diode, Zener diode, BJT, and MOSFET physics.",
    syllabusTopics: [
      { id: "edc-carrier", name: "Carrier Transport, Generation & Recombination", weightage: 3.5, estHours: 16, prerequisites: [] },
      { id: "edc-pn", name: "P-N Junctions & Depletion Width", weightage: 3.5, estHours: 16, prerequisites: ["edc-carrier"] },
      { id: "edc-mosfet", name: "MOSFET Physics, Threshold Voltage & C-V Characteristics", weightage: 4.5, estHours: 20, prerequisites: ["edc-pn"] }
    ],
    resources: [
      {
        id: "res-nptel-edc",
        title: "NPTEL Semiconductor Devices - Prof. S. Karmalkar (IIT Madras)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/117106091",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Madras"
      }
    ],
    formulas: [
      {
        id: "f-einstein-relation",
        name: "Einstein Relation for Semiconductors",
        topic: "Semiconductor Physics",
        latex: "\\frac{D_n}{\\mu_n} = \\frac{D_p}{\\mu_p} = \\frac{k T}{q} = V_t",
        description: "Relates carrier diffusion coefficient D to carrier mobility mu through thermal voltage V_t approx 26 mV at 300K.",
        example: "Vital for calculating minority carrier diffusion lengths and diode reverse saturation currents."
      }
    ]
  },
  {
    id: "analog-circuits",
    name: "Analog Circuits & Op-Amps",
    code: "AC",
    icon: "Radio",
    tierIds: ["UNDERGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Diode circuits, BJT/MOSFET amplifiers, Frequency response, Feedback amplifiers, Operational Amplifiers (Op-Amps) and Active Filters.",
    syllabusTopics: [
      { id: "ac-opamps", name: "Ideal & Practical Op-Amps (Inverting, Non-inverting, Integrators)", weightage: 4.5, estHours: 20, prerequisites: [] },
      { id: "ac-amps", name: "Small-Signal BJT & MOSFET Amplifiers", weightage: 4.0, estHours: 18, prerequisites: [] },
      { id: "ac-feedback", name: "Feedback Amplifiers & Oscillators", weightage: 3.5, estHours: 15, prerequisites: ["ac-amps"] }
    ],
    resources: [
      {
        id: "res-nptel-analog",
        title: "Analog Electronic Circuits - Prof. Pradip Mandal (IIT Kharagpur)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/108105057",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Kharagpur"
      }
    ],
    formulas: [
      {
        id: "f-opamp-virtual-ground",
        name: "Op-Amp Golden Rules",
        topic: "Operational Amplifiers",
        latex: "V_+ = V_- \\quad \\text{(Virtual Short)}, \\quad I_+ = I_- = 0 \\quad \\text{(Infinite Input Impedance)}",
        description: "Fundamental ideal op-amp rules in negative feedback configuration.",
        example: "For inverting amplifier: V_out / V_in = - R_f / R_1."
      }
    ]
  },
  {
    id: "control-systems",
    name: "Control Systems",
    code: "CSYS",
    icon: "Sliders",
    tierIds: ["UNDERGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Transfer functions, Block diagram reduction, Mason's gain formula, Time domain analysis, Routh-Hurwitz criterion, Root Locus, Bode plots, and State space analysis.",
    syllabusTopics: [
      { id: "cs-time-response", name: "Time Domain Specifications & Routh-Hurwitz", weightage: 4.0, estHours: 16, prerequisites: [] },
      { id: "cs-root-locus", name: "Root Locus Technique", weightage: 3.5, estHours: 15, prerequisites: ["cs-time-response"] },
      { id: "cs-bode-nyquist", name: "Frequency Response (Bode Plot, Nyquist Stability)", weightage: 4.5, estHours: 20, prerequisites: ["cs-root-locus"] },
      { id: "cs-state-space", name: "State Space Analysis & Controllability / Observability", weightage: 3.5, estHours: 15, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-nptel-control",
        title: "Control Engineering - Prof. Ramkrishna Pasumarthy (IIT Madras)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/108106098",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Madras"
      }
    ],
    formulas: [
      {
        id: "f-second-order-damping",
        name: "Second-Order System Step Response Peak Overshoot",
        topic: "Time Domain",
        latex: "\\% M_p = e^{-\\frac{\\pi \\zeta}{\\sqrt{1 - \\zeta^2}}} \\times 100\\%, \\quad t_s = \\frac{4}{\\zeta \\omega_n} \\; (2\\% \\text{ criterion})",
        description: "Expresses maximum percentage overshoot and settling time in terms of damping ratio zeta and natural frequency omega_n.",
        example: "For zeta = 0.707, peak overshoot is approx 4.3%."
      }
    ]
  },
  {
    id: "communications",
    name: "Communications Systems",
    code: "COMM",
    icon: "Radio",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE"],
    description: "Amplitude & Angle Modulation, Noise in Analog Systems, PCM, DPCM, Digital Modulation Schemes (ASK, PSK, FSK, QAM), Information Theory & Shannon Capacity.",
    syllabusTopics: [
      { id: "comm-analog", name: "AM, FM & PM Modulations & Superheterodyne Receivers", weightage: 3.5, estHours: 16, prerequisites: [] },
      { id: "comm-digital", name: "PCM, Quantization Noise & Match Filter Receivers", weightage: 4.0, estHours: 18, prerequisites: [] },
      { id: "comm-info", name: "Information Theory, Entropy & Shannon-Hartley Theorem", weightage: 3.5, estHours: 14, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-nptel-comm",
        title: "Principles of Communication Systems - Prof. Aditya K. Jagannatham (IIT Kanpur)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/108104091",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Kanpur"
      }
    ],
    formulas: [
      {
        id: "f-shannon-capacity",
        name: "Shannon-Hartley Channel Capacity Theorem",
        topic: "Information Theory",
        latex: "C = B \\log_2 \\left(1 + \\frac{S}{N}\\right) \\quad \\text{bits/second}",
        description: "Theoretical upper bound on information rate that can be transmitted over a bandwidth-limited AWGN channel.",
        example: "For B = 3000 Hz and SNR = 1000 (30 dB): C = 3000 * log2(1001) approx 3000 * 9.97 = 29,901 bps."
      }
    ]
  },
  {
    id: "electromagnetics",
    name: "Electromagnetics & Waveguides",
    code: "EMFT",
    icon: "Radio",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE"],
    description: "Maxwell's Equations, Plane Waves, Skin Depth, Transmission Lines, Smith Chart, Waveguides, and Antennas.",
    syllabusTopics: [
      { id: "emft-maxwell", name: "Maxwell's Equations & Boundary Conditions", weightage: 3.5, estHours: 16, prerequisites: [] },
      { id: "emft-tlines", name: "Transmission Lines, Reflection Coefficient & VSWR", weightage: 4.5, estHours: 20, prerequisites: ["emft-maxwell"] },
      { id: "emft-waveguides", name: "Rectangular Waveguides & Cutoff Frequencies", weightage: 3.0, estHours: 14, prerequisites: ["emft-tlines"] }
    ],
    resources: [
      {
        id: "res-nptel-emft",
        title: "Electromagnetic Fields - Prof. Harishankar Ramachandran (IIT Madras)",
        type: "VIDEO_COURSE",
        url: "https://nptel.ac.in/courses/108106073",
        license: "CC_BY_SA",
        provenance: "NPTEL / IIT Madras"
      }
    ],
    formulas: [
      {
        id: "f-vswr-gamma",
        name: "Voltage Standing Wave Ratio (VSWR)",
        topic: "Transmission Lines",
        latex: "\\text{VSWR} = \\frac{1 + |\\Gamma|}{1 - |\\Gamma|}, \\quad \\Gamma = \\frac{Z_L - Z_0}{Z_L + Z_0}",
        description: "Measure of impedance matching along transmission line with load impedance Z_L and characteristic impedance Z_0.",
        example: "If Z_L = Z_0 (matched), Gamma = 0 and VSWR = 1 (ideal, no reflected wave)."
      }
    ]
  },
  {
    id: "physics",
    name: "Applied Physics & Modern Physics",
    code: "PHY",
    icon: "Atom",
    tierIds: ["INTERMEDIATE_12TH", "UNDERGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Electrostatics, Magnetism, Optics, Thermodynamics, Quantum Mechanics, Nuclear Physics, and Semiconductor Physics.",
    syllabusTopics: [
      { id: "phy-mechanics", name: "Newton's Laws, Work-Energy & Rotational Dynamics", weightage: 4.0, estHours: 18, prerequisites: [] },
      { id: "phy-electrodynamics", name: "Coulomb's Law, Gauss's Law & Electromagnetic Induction", weightage: 4.5, estHours: 20, prerequisites: [] },
      { id: "phy-modern", name: "Photoelectric Effect, Bohr's Atom & De Broglie Waves", weightage: 3.5, estHours: 14, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-ncert-physics",
        title: "NCERT Class 11 & 12 Physics Official Textbooks",
        type: "STUDY_NOTES",
        url: "https://ncert.nic.in/textbook.php",
        license: "OFFICIAL_PUBLIC",
        provenance: "National Council of Educational Research and Training (NCERT)"
      }
    ],
    formulas: [
      {
        id: "f-photoelectric",
        name: "Einstein's Photoelectric Equation",
        topic: "Modern Physics",
        latex: "K_{max} = h \\nu - \\Phi = h \\nu - h \\nu_0 = e V_0",
        description: "Kinetic energy of emitted photoelectron given incident photon energy h*nu and threshold work function Phi.",
        example: "Stopping potential V_0 depends directly on frequency of incident light and work function of metal."
      }
    ]
  },
  {
    id: "chemistry",
    name: "Physical & Organic Chemistry",
    code: "CHEM",
    icon: "FlaskConical",
    tierIds: ["INTERMEDIATE_12TH", "UNDERGRADUATE"],
    description: "Chemical Kinetics, Thermodynamics, Electrochemistry, Periodic Trends, Coordination Compounds, Reaction Mechanisms, and Biomolecules.",
    syllabusTopics: [
      { id: "chem-kinetics", name: "Chemical Kinetics & Rate Laws", weightage: 3.5, estHours: 14, prerequisites: [] },
      { id: "chem-electro", name: "Electrochemistry & Nernst Equation", weightage: 4.0, estHours: 16, prerequisites: [] },
      { id: "chem-organic", name: "Hydrocarbons, Aldehydes, Ketones & Amines", weightage: 4.5, estHours: 22, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-ncert-chemistry",
        title: "NCERT Chemistry Class 11 & 12 Official Portal",
        type: "STUDY_NOTES",
        url: "https://ncert.nic.in/textbook.php",
        license: "OFFICIAL_PUBLIC",
        provenance: "NCERT Official Open Repository"
      }
    ],
    formulas: [
      {
        id: "f-nernst-equation",
        name: "Nernst Equation for Electrode Potential",
        topic: "Electrochemistry",
        latex: "E_{cell} = E^\\circ_{cell} - \\frac{R T}{n F} \\ln Q = E^\\circ_{cell} - \\frac{0.0591}{n} \\log_{10} Q \\; (at 298K)",
        description: "Calculates non-standard reduction potential of an electrochemical cell in terms of standard potential and reaction quotient Q.",
        example: "At equilibrium, E_cell = 0 and standard potential E0 = (0.0591/n) log(K_eq)."
      }
    ]
  },
  {
    id: "general-aptitude",
    name: "General Aptitude & English Proficiency",
    code: "GA",
    icon: "BookOpen",
    tierIds: ["UNDERGRADUATE", "POSTGRADUATE", "COMPETITIVE_RECRUITMENT"],
    description: "Grammar, Reading Comprehension, Sentence Completion, Vocabulary, Spatial Reasoning, and Verbal Deductions.",
    syllabusTopics: [
      { id: "ga-grammar", name: "English Grammar, Idioms & Prepositions", weightage: 3.0, estHours: 10, prerequisites: [] },
      { id: "ga-rc", name: "Reading Comprehension & Critical Inferences", weightage: 3.5, estHours: 12, prerequisites: [] },
      { id: "ga-spatial", name: "Spatial Aptitude (Mirror Images, Paper Folding, Rotations)", weightage: 3.5, estHours: 12, prerequisites: [] }
    ],
    resources: [
      {
        id: "res-examverse-aptitude",
        title: "EXAMVERSE Master Guide to Competitive Verbal & Spatial Aptitude",
        type: "STUDY_NOTES",
        url: "/learn/subjects/general-aptitude",
        license: "ORIGINAL_EDUCATIONAL_GUIDANCE",
        provenance: "EXAMVERSE Learning & Pedagogy Team"
      }
    ],
    formulas: [
      {
        id: "f-syllogism-rules",
        name: "Categorical Proposition Conversion Rules",
        topic: "Verbal Logic",
        latex: "\\text{All A are B} \\implies \\text{Some B are A (Valid Conversion)} \\\\ \\text{No A is B} \\iff \\text{No B is A (Symmetric)}",
        description: "Formal logic conversion constraints used in competitive verbal reasoning.",
        example: "Universal affirmative (A) converts by limitation to particular affirmative (I)."
      }
    ]
  }
];

module.exports = {
  EDUCATION_TIERS,
  SUBJECT_SPACES
};
