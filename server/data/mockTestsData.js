// server/data/mockTestsData.js
// Interactive Real Examination Practice Tests with Questions, Timers, Negative Marking, and Explanations

const mockTests = [
  {
    id: "mock-upsc-prelims-gs1",
    examId: "upsc-cse",
    title: "UPSC Civil Services Prelims GS Paper 1 - Full Mock Test",
    category: "Full Length Mock",
    subject: "General Studies Paper I",
    totalQuestions: 10, // High quality sample for interactive practice
    timeLimitMinutes: 15,
    totalMarks: 20,
    positiveMarks: 2.0,
    negativeMarks: 0.66,
    instructions: "Each question carries 2 marks. 0.66 marks will be deducted for each incorrect response. Read each question carefully before submitting.",
    questions: [
      {
        id: 1,
        question: "With reference to the Indian Constitution, consider the following statements regarding the 'Preamble':\n1. It is a part of the Constitution as held in the Kesavananda Bharati case (1973).\n2. It can be amended under Article 368 without altering the Basic Structure.\n3. It is non-justiciable in a court of law.\nWhich of the statements given above are correct?",
        options: [
          "1 and 2 only",
          "2 and 3 only",
          "1 and 3 only",
          "1, 2 and 3"
        ],
        correctOptionIndex: 3,
        subject: "Indian Polity",
        topic: "Constitutional Framework",
        difficulty: "Medium",
        explanation: "All three statements are correct. In Kesavananda Bharati (1973), the Supreme Court ruled that the Preamble is an integral part of the Constitution. It can be amended under Article 368 (as done by the 42nd Amendment 1976 adding Socialist, Secular, Integrity), provided the Basic Structure is intact. The Preamble is non-justiciable; its provisions cannot be enforced in courts."
      },
      {
        id: 2,
        question: "Which of the following rivers flows through a rift valley between the Vindhya and Satpura mountain ranges?",
        options: [
          "Godavari",
          "Narmada",
          "Krishna",
          "Mahanadi"
        ],
        correctOptionIndex: 1,
        subject: "Geography",
        topic: "Drainage Systems of India",
        difficulty: "Easy",
        explanation: "The Narmada River originates from Amarkantak plateau and flows westward through a tectonic rift valley bounded by the Vindhya Range to the north and the Satpura Range to the south, emptying into the Arabian Sea at the Gulf of Khambhat."
      },
      {
        id: 3,
        question: "Consider the following statements regarding the 'Monetary Policy Committee' (MPC) in India:\n1. It is a 6-member committee constituted under the RBI Act, 1934.\n2. The Governor of the Reserve Bank of India acts as the ex-officio Chairperson.\n3. The MPC determines the policy repo rate required to achieve the inflation target.\nWhich of the statements given above is/are correct?",
        options: [
          "1 only",
          "2 and 3 only",
          "1, 2 and 3",
          "1 and 2 only"
        ],
        correctOptionIndex: 2,
        subject: "Economy",
        topic: "Monetary Policy & RBI",
        difficulty: "Medium",
        explanation: "All statements are correct. Section 45ZB of the amended RBI Act 1934 provides for a 6-member MPC (3 from RBI, 3 appointed by Central Govt). The RBI Governor is ex-officio Chairperson with a casting vote in case of a tie. The committee determines the repo rate to maintain 4% (+/- 2%) CPI inflation."
      },
      {
        id: 4,
        question: "In the context of Modern Indian History, the 'Ilbert Bill' controversy of 1883 was related to:",
        options: [
          "Imposition of severe restrictions on vernacular press",
          "Removal of disqualifications imposed on Indian magistrates with regard to trial of Europeans",
          "Enlistment of Indian soldiers for overseas British campaigns",
          "Introduction of separate electorates for Muslims"
        ],
        correctOptionIndex: 1,
        subject: "History",
        topic: "British Administrative Reforms",
        difficulty: "Easy",
        explanation: "The Ilbert Bill introduced during Lord Ripon's viceroyalty in 1883 sought to allow senior Indian district magistrates and sessions judges to try European British subjects in criminal cases, removing racial discrimination in judicial competence. It led to fierce opposition from the European community."
      },
      {
        id: 5,
        question: "Consider the following greenhouse gases:\n1. Carbon Dioxide (CO2)\n2. Methane (CH4)\n3. Nitrous Oxide (N2O)\n4. Sulphur Hexafluoride (SF6)\nWhich of the above has the highest Global Warming Potential (GWP) over a 100-year timescale?",
        options: [
          "Carbon Dioxide",
          "Methane",
          "Nitrous Oxide",
          "Sulphur Hexafluoride"
        ],
        correctOptionIndex: 3,
        subject: "Environment & Ecology",
        topic: "Climate Change & GHGs",
        difficulty: "Medium",
        explanation: "Sulphur Hexafluoride (SF6) has the highest Global Warming Potential of approximately 23,500 times that of CO2 over a 100-year timeframe, and an atmospheric lifetime of thousands of years. It is used as an electrical insulator in high-voltage equipment."
      }
    ]
  },

  {
    id: "mock-ssc-quant-reasoning",
    examId: "ssc-cgl",
    title: "SSC CGL Tier 1 - Quantitative Aptitude & Reasoning Sprint",
    category: "Sectional Practice",
    subject: "Quant & Reasoning",
    totalQuestions: 5,
    timeLimitMinutes: 10,
    totalMarks: 10,
    positiveMarks: 2.0,
    negativeMarks: 0.5,
    instructions: "SSC CGL marking pattern: +2 marks for correct answer, -0.5 marks for incorrect answer.",
    questions: [
      {
        id: 1,
        question: "A can do a piece of work in 12 days and B can do it in 18 days. If they work together for 4 days, what fraction of the work is left unfinished?",
        options: [
          "5/9",
          "4/9",
          "1/3",
          "2/9"
        ],
        correctOptionIndex: 1,
        subject: "Quantitative Aptitude",
        topic: "Time and Work",
        difficulty: "Easy",
        explanation: "A's 1 day work = 1/12. B's 1 day work = 1/18. Combined 1 day work = 1/12 + 1/18 = (3+2)/36 = 5/36. In 4 days, work completed = 4 * (5/36) = 20/36 = 5/9. Work remaining = 1 - 5/9 = 4/9."
      },
      {
        id: 2,
        question: "In a certain code language, 'ROBUST' is written as 'QNATRS'. How will 'ZXC' be decoded in the same pattern?",
        options: [
          "YWB",
          "AYD",
          "BZE",
          "XZB"
        ],
        correctOptionIndex: 0,
        subject: "General Intelligence",
        topic: "Coding-Decoding",
        difficulty: "Easy",
        explanation: "Each letter is shifted by -1 backward: R->Q, O->N, B->A, U->T, S->R, T->S. Similarly, Z(-1) = Y, X(-1) = W, C(-1) = B. Hence YWB."
      },
      {
        id: 3,
        question: "If x + 1/x = 4, then the value of x^2 + 1/x^2 is:",
        options: [
          "14",
          "16",
          "18",
          "12"
        ],
        correctOptionIndex: 0,
        subject: "Quantitative Aptitude",
        topic: "Algebra",
        difficulty: "Easy",
        explanation: "Squaring both sides: (x + 1/x)^2 = x^2 + 1/x^2 + 2 = 4^2 = 16. Therefore, x^2 + 1/x^2 = 16 - 2 = 14."
      },
      {
        id: 4,
        question: "Find the odd one out from the given alternatives:\n(A) 27 - 9\n(B) 64 - 16\n(C) 125 - 25\n(D) 216 - 36",
        options: [
          "27 - 9",
          "64 - 16",
          "125 - 25",
          "216 - 36"
        ],
        correctOptionIndex: 1,
        subject: "General Intelligence",
        topic: "Classification & Number Analogy",
        difficulty: "Medium",
        explanation: "In all other pairs, the ratio of first to second number is: 27/9 = 3; 125/25 = 5; 216/36 = 6. Alternatively, (3^3, 3^2), (5^3, 5^2), (6^3, 6^2). But 64 is 4^3 and 16 is 4^2 (ratio 4). Notice 64 is also 8^2 and 16 is 4^2. In 27-9, 125-25, 216-36 the base is odd/non-power of 2, whereas 64-16 is power of 2."
      },
      {
        id: 5,
        question: "The average of 5 consecutive odd numbers is 61. What is the difference between the highest and lowest numbers?",
        options: [
          "4",
          "8",
          "10",
          "12"
        ],
        correctOptionIndex: 1,
        subject: "Quantitative Aptitude",
        topic: "Averages & Number Systems",
        difficulty: "Easy",
        explanation: "Let the 5 consecutive odd numbers be (x-4), (x-2), x, (x+2), (x+4). The middle number x is the average = 61. Highest = 61 + 4 = 65. Lowest = 61 - 4 = 57. Difference = 65 - 57 = 8 (For any 5 consecutive odd numbers, the difference between highest and lowest is always (5-1)*2 = 8)."
      }
    ]
  },

  {
    id: "mock-gate-cs-algorithms",
    examId: "gate-cse",
    title: "GATE Computer Science - Data Structures & Algorithms Quiz",
    category: "Subject Test",
    subject: "Algorithms & DS",
    totalQuestions: 5,
    timeLimitMinutes: 12,
    totalMarks: 10,
    positiveMarks: 2.0,
    negativeMarks: 0.66,
    instructions: "GATE Pattern: 2 marks for correct answer, 2/3 mark deducted for incorrect answer.",
    questions: [
      {
        id: 1,
        question: "What is the worst-case time complexity of searching for an element in a Red-Black Tree with n keys?",
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n log n)"
        ],
        correctOptionIndex: 1,
        subject: "Computer Science",
        topic: "Balanced Search Trees",
        difficulty: "Medium",
        explanation: "A Red-Black tree has maximum height bounded by 2 * log2(n + 1). Hence, insertion, deletion, and searching operations run in guaranteed O(log n) worst-case time."
      },
      {
        id: 2,
        question: "Dijkstra's Single Source Shortest Path algorithm fails or may produce incorrect results when:",
        options: [
          "The graph contains directed edges",
          "The graph contains negative weight edges",
          "The graph is disconnected",
          "The graph contains cycles"
        ],
        correctOptionIndex: 1,
        subject: "Computer Science",
        topic: "Graph Algorithms",
        difficulty: "Easy",
        explanation: "Dijkstra's algorithm assumes once a vertex is extracted from the priority queue and marked visited, its shortest distance cannot be decreased. Negative weight edges violate this greedy invariant. For negative edges, Bellman-Ford algorithm must be used."
      },
      {
        id: 3,
        question: "Which of the following sorting algorithms is NOT stable in its standard textbook implementation?",
        options: [
          "Merge Sort",
          "Insertion Sort",
          "Heap Sort",
          "Bubble Sort"
        ],
        correctOptionIndex: 2,
        subject: "Computer Science",
        topic: "Sorting Algorithms",
        difficulty: "Medium",
        explanation: "Heap Sort relies on building a max-heap and swapping the root with the last element. This long-distance swap alters the relative order of identical elements, making Heap Sort inherently unstable."
      },
      {
        id: 4,
        question: "Consider the recurrence relation T(n) = 2*T(n/2) + n. By Master Theorem, what is T(n)?",
        options: [
          "O(n)",
          "O(n log n)",
          "O(n^2)",
          "O(log n)"
        ],
        correctOptionIndex: 1,
        subject: "Computer Science",
        topic: "Asymptotic Analysis & Recurrences",
        difficulty: "Easy",
        explanation: "Here a = 2, b = 2, f(n) = n. n^(log_b a) = n^(log_2 2) = n^1. Since f(n) = Theta(n^(log_b a)), by Case 2 of Master Theorem, T(n) = Theta(n * log n)."
      },
      {
        id: 5,
        question: "In Relational Database Management Systems, B+ Trees are preferred over Binary Search Trees for disk-based indexing because:",
        options: [
          "B+ Trees use less RAM",
          "B+ Trees have very high branching factor (fan-out), dramatically minimizing disk I/O operations",
          "B+ Trees do not require rebalancing",
          "Binary Search Trees cannot store duplicate keys"
        ],
        correctOptionIndex: 1,
        subject: "Computer Science",
        topic: "Database Indexing & B+ Trees",
        difficulty: "Medium",
        explanation: "Disk I/O is hundreds of times slower than main memory access. A B+ tree node matches the disk block/page size, allowing fan-out of 100-500. This keeps tree height very low (3-4 levels for millions of records), requiring minimal disk page reads."
      }
    ]
  },

  {
    id: "mock-banking-po-prelims",
    examId: "sbi-po",
    title: "SBI PO / IBPS PO Prelims - Quantitative & Reasoning Speed Test",
    category: "Full Length Mock",
    subject: "Aptitude & Reasoning",
    totalQuestions: 5,
    timeLimitMinutes: 10,
    totalMarks: 5,
    positiveMarks: 1.0,
    negativeMarks: 0.25,
    instructions: "Standard IBPS/SBI Pattern: 1 mark for correct answer, 0.25 penalty for wrong answer. Test your speed and accuracy.",
    questions: [
      {
        id: 1,
        question: "In a mixture of 60 litres, the ratio of milk and water is 2:1. If this ratio is to be made 1:2, then the quantity of water (in litres) to be further added is:",
        options: ["20", "30", "40", "60"],
        correctOptionIndex: 3,
        subject: "Quantitative Aptitude",
        topic: "Ratios & Mixtures",
        difficulty: "Medium",
        explanation: "Initial quantity = 60 litres. Milk = (2/3)*60 = 40 litres, Water = 20 litres. We want Milk : Water = 1 : 2. Since milk remains 40 litres, total water required = 40 * 2 = 80 litres. Water already present = 20 litres. Additional water to add = 80 - 20 = 60 litres."
      },
      {
        id: 2,
        question: "Statements: All bags are books. Some books are pencils. Conclusions:\nI. Some bags are pencils.\nII. No bag is a pencil.\nWhich of the conclusions logically follows?",
        options: [
          "Only conclusion I follows",
          "Only conclusion II follows",
          "Either conclusion I or II follows",
          "Neither conclusion I nor II follows"
        ],
        correctOptionIndex: 2,
        subject: "Reasoning Ability",
        topic: "Syllogisms (Complementary Pair)",
        difficulty: "Hard",
        explanation: "Since both terms 'bags' and 'pencils' are the same, and conclusion I is a Particular Affirmative ('Some') and conclusion II is a Universal Negative ('No'), they form an I-O or I-E complementary pair. Exactly one must be true. Hence, 'Either I or II follows'."
      },
      {
        id: 3,
        question: "A sum of money invested at compound interest doubles itself in 4 years. In how many years will it become 8 times itself at the same annual interest rate?",
        options: ["8 years", "12 years", "16 years", "24 years"],
        correctOptionIndex: 1,
        subject: "Quantitative Aptitude",
        topic: "Compound Interest",
        difficulty: "Easy",
        explanation: "In compound interest, if P becomes 2P in 4 years, it becomes 4P in 8 years, and 8P (2^3) in 4 * 3 = 12 years."
      },
      {
        id: 4,
        question: "What should come in place of the question mark (?) in the series:\n7, 11, 19, 35, 67, ?",
        options: ["121", "131", "135", "143"],
        correctOptionIndex: 1,
        subject: "Reasoning Ability",
        topic: "Number Series",
        difficulty: "Easy",
        explanation: "The differences between consecutive terms are: 11 - 7 = 4, 19 - 11 = 8, 35 - 19 = 16, 67 - 35 = 32. The next difference must be 32 * 2 = 64. Next term = 67 + 64 = 131."
      },
      {
        id: 5,
        question: "A train 180 metres long is running at a speed of 72 km/h. How much time (in seconds) will it take to pass an electric pole?",
        options: ["7 seconds", "8 seconds", "9 seconds", "10 seconds"],
        correctOptionIndex: 2,
        subject: "Quantitative Aptitude",
        topic: "Speed, Time & Distance",
        difficulty: "Easy",
        explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Distance to cross pole = length of train = 180 m. Time = Distance / Speed = 180 / 20 = 9 seconds."
      }
    ]
  },

  {
    id: "mock-cuet-ug-general",
    examId: "cuet-ug",
    title: "CUET UG Section III - General Test Simulation",
    category: "Entrance Mock",
    subject: "General Test (GK, Current Affairs & Logic)",
    totalQuestions: 5,
    timeLimitMinutes: 10,
    totalMarks: 25,
    positiveMarks: 5.0,
    negativeMarks: 1.0,
    instructions: "NTA CUET Pattern: +5 for each correct answer, -1 for each incorrect answer.",
    questions: [
      {
        id: 1,
        question: "Who is known as the 'Father of the Indian Space Programme'?",
        options: [
          "Dr. Homi J. Bhabha",
          "Dr. Vikram Sarabhai",
          "Dr. A.P.J. Abdul Kalam",
          "Prof. Satish Dhawan"
        ],
        correctOptionIndex: 1,
        subject: "General Awareness",
        topic: "Indian Science & Pioneers",
        difficulty: "Easy",
        explanation: "Dr. Vikram Ambalal Sarabhai is internationally celebrated as the Father of the Indian Space Programme. He initiated space research in India and helped establish INCOSPAR in 1962, which became ISRO in 1969."
      },
      {
        id: 2,
        question: "Which Indian state has the longest coastline in mainland India?",
        options: ["Tamil Nadu", "Maharashtra", "Gujarat", "Andhra Pradesh"],
        correctOptionIndex: 2,
        subject: "General Knowledge",
        topic: "Indian Geography",
        difficulty: "Easy",
        explanation: "Gujarat has the longest coastline among all Indian states, spanning approximately 1,600 km along the Kathiawar peninsula."
      },
      {
        id: 3,
        question: "Point A is 10 m north of Point B. Point C is 10 m east of Point B. In which direction is Point A with respect to Point C?",
        options: ["North-East", "North-West", "South-East", "South-West"],
        correctOptionIndex: 1,
        subject: "Logical Reasoning",
        topic: "Direction Sense",
        difficulty: "Medium",
        explanation: "From Point C, moving West takes you to Point B, and moving North from Point B takes you to Point A. Therefore, Point A is located North-West of Point C."
      },
      {
        id: 4,
        question: "The 2024 Olympic Games were held in which city?",
        options: ["Tokyo", "Paris", "Los Angeles", "Brisbane"],
        correctOptionIndex: 1,
        subject: "Current Affairs",
        topic: "Sports & Global Events",
        difficulty: "Easy",
        explanation: "The Games of the XXXIII Olympiad (2024 Summer Olympics) took place in Paris, France from 26 July to 11 August 2024."
      },
      {
        id: 5,
        question: "If 'LIGHT' is coded as 'MJHIU' in a certain code language, how will 'FRAME' be coded in the same language?",
        options: ["GSBNF", "GSCNF", "HQBNF", "ERZLD"],
        correctOptionIndex: 0,
        subject: "Mental Ability",
        topic: "Coding-Decoding",
        difficulty: "Easy",
        explanation: "Each letter is shifted forward by +1 position in the English alphabetical order: L(+1)->M, I(+1)->J, G(+1)->H, H(+1)->I, T(+1)->U. Applying to FRAME: F(+1)->G, R(+1)->S, A(+1)->B, M(+1)->N, E(+1)->F => GSBNF."
      }
    ]
  },

  {
    id: "mock-neet-ug-biology",
    examId: "neet-ug",
    title: "NEET UG Biology - Genetics & Molecular Basis of Inheritance",
    category: "Subject Mock",
    subject: "Biology (Zoology & Botany)",
    totalQuestions: 5,
    timeLimitMinutes: 8,
    totalMarks: 20,
    positiveMarks: 4.0,
    negativeMarks: 1.0,
    instructions: "NEET UG Pattern: +4 marks for correct answer, -1 mark deducted for incorrect answer.",
    questions: [
      {
        id: 1,
        question: "In a dihybrid cross, if two heterozygous individuals (AaBb x AaBb) are crossed, what is the expected phenotypic ratio in the F2 generation under complete dominance?",
        options: ["3:1", "9:3:3:1", "1:2:1", "9:7"],
        correctOptionIndex: 1,
        subject: "Biology",
        topic: "Principles of Inheritance and Variation",
        difficulty: "Easy",
        explanation: "Gregor Mendel's law of independent assortment states that pairs of alleles segregate independently during gamete formation, producing a classical 9:3:3:1 phenotypic ratio in a dihybrid cross."
      },
      {
        id: 2,
        question: "Which of the following nitrogenous bases is present in RNA but absent in DNA?",
        options: ["Adenine", "Guanine", "Thymine", "Uracil"],
        correctOptionIndex: 3,
        subject: "Biology",
        topic: "Molecular Basis of Inheritance",
        difficulty: "Easy",
        explanation: "In RNA, Uracil (U) replaces Thymine (T) as the pyrimidine base that pairs with Adenine through two hydrogen bonds."
      },
      {
        id: 3,
        question: "The synthesis of DNA from an RNA template catalyzed by the enzyme reverse transcriptase is called:",
        options: ["Transcription", "Reverse Transcription (Teminism)", "Translation", "Replication"],
        correctOptionIndex: 1,
        subject: "Biology",
        topic: "Central Dogma of Molecular Biology",
        difficulty: "Medium",
        explanation: "Discovered by Howard Temin and David Baltimore, reverse transcription allows retroviruses (like HIV) to synthesize complementary cDNA from single-stranded RNA using the enzyme reverse transcriptase."
      },
      {
        id: 4,
        question: "Which cell organelle is known as the 'powerhouse of the cell' and contains its own circular DNA and 70S ribosomes?",
        options: ["Golgi apparatus", "Endoplasmic reticulum", "Mitochondrion", "Lysosome"],
        correctOptionIndex: 2,
        subject: "Biology",
        topic: "Cell Biology",
        difficulty: "Easy",
        explanation: "Mitochondria are semiautonomous organelles that generate cellular ATP via oxidative phosphorylation, and possess their own circular double-stranded DNA and 70S ribosomes consistent with endosymbiotic theory."
      },
      {
        id: 5,
        question: "During which phase of meiosis does crossing over (genetic recombination) between non-sister chromatids of homologous chromosomes occur?",
        options: ["Leptotene", "Zygotene", "Pachytene", "Diplotene"],
        correctOptionIndex: 2,
        subject: "Biology",
        topic: "Cell Cycle and Cell Division",
        difficulty: "Medium",
        explanation: "Crossing over occurs during the Pachytene stage of Prophase I of meiosis, facilitated by the enzyme recombinase and formation of the synaptonemal complex."
      }
    ]
  },

  {
    id: "mock-gate-cs-cbt-sim",
    examId: "gate-cse",
    title: "GATE Computer Science (CS) Official CBT Simulation (MCQ, MSQ, NAT)",
    category: "Flagship CBT Simulation",
    subject: "Computer Science & Engineering",
    hasVirtualCalculator: true,
    hasSectionNavigation: true,
    timeLimitMinutes: 25,
    totalQuestions: 10,
    totalMarks: 17,
    positiveMarks: 1.0,
    negativeMarks: 0.333,
    sections: [
      { id: "sec-ga", name: "General Aptitude (GA)", questionIds: [1, 2, 3] },
      { id: "sec-cs", name: "Computer Science & IT", questionIds: [4, 5, 6, 7, 8, 9, 10] }
    ],
    instructions: "Official GATE Pattern: 1-mark MCQ carries -1/3 penalty. 2-mark MCQ carries -2/3 penalty. MSQs have NO partial credit and NO negative marks. NAT questions require numeric input on the virtual keypad and have NO negative marks. Non-programmable virtual calculator is available.",
    questions: [
      {
        id: 1,
        sectionId: "sec-ga",
        type: "MCQ",
        marks: 1,
        question: "Select the word that is opposite in meaning to 'EPHEMERAL':",
        options: ["Transient", "Perpetual", "Evanescent", "Fugacious"],
        correctOptionIndex: 1,
        subject: "General Aptitude",
        topic: "Verbal Ability (Antonyms)",
        difficulty: "Easy",
        explanation: "'Ephemeral' means lasting for a very short time. 'Perpetual' means never ending or changing, making it the exact antonym."
      },
      {
        id: 2,
        sectionId: "sec-ga",
        type: "MCQ",
        marks: 2,
        question: "A sum of money compounded annually triples itself in 3 years. In how many years will it become 27 times itself at the same compound interest rate?",
        options: ["6 years", "9 years", "12 years", "15 years"],
        correctOptionIndex: 1,
        subject: "General Aptitude",
        topic: "Quantitative Aptitude (Compound Interest)",
        difficulty: "Medium",
        explanation: "If P becomes 3P in 3 years, then (1 + r)^3 = 3. For the amount to become 27P = 3^3 P, we need ( (1 + r)^3 )^3, which takes 3 * 3 = 9 years."
      },
      {
        id: 3,
        sectionId: "sec-ga",
        type: "NAT",
        marks: 1,
        question: "The perimeter of a square is 48 cm. What is the area of this square in cm^2? (Enter numeric integer or decimal value)",
        correctValue: 144,
        toleranceMin: 143.9,
        toleranceMax: 144.1,
        subject: "General Aptitude",
        topic: "Mensuration",
        difficulty: "Easy",
        explanation: "Side length of square = 48 / 4 = 12 cm. Area = 12 * 12 = 144 cm^2."
      },
      {
        id: 4,
        sectionId: "sec-cs",
        type: "MCQ",
        marks: 1,
        question: "Let A be an n x n non-singular real matrix. Which of the following statements is ALWAYS TRUE?",
        options: [
          "det(A) = 0",
          "Rank(A) = n",
          "A must be symmetric",
          "All eigenvalues of A must be positive"
        ],
        correctOptionIndex: 1,
        subject: "Engineering Mathematics",
        topic: "Linear Algebra (Rank & Determinants)",
        difficulty: "Easy",
        explanation: "A matrix is non-singular if and only if det(A) != 0, which is equivalent to full row and column rank, i.e., Rank(A) = n."
      },
      {
        id: 5,
        sectionId: "sec-cs",
        type: "MCQ",
        marks: 2,
        question: "Consider a 4-way set-associative cache memory consisting of 64 sets with a line size of 32 bytes. The CPU generates 32-bit byte-addresses. What is the size of the TAG field in bits?",
        options: ["18 bits", "21 bits", "19 bits", "20 bits"],
        correctOptionIndex: 1,
        subject: "Computer Science",
        topic: "Computer Organization (Cache Mapping)",
        difficulty: "Medium",
        explanation: "Line/Block size = 32 bytes = 2^5 bytes => Offset = 5 bits. Number of sets = 64 = 2^6 sets => Set index = 6 bits. Tag bits = 32 - (Set index + Offset) = 32 - (6 + 5) = 32 - 11 = 21 bits."
      },
      {
        id: 6,
        sectionId: "sec-cs",
        type: "MCQ",
        marks: 2,
        question: "In an Operating System with paged virtual memory, the page size is 4 KB and page table entry (PTE) size is 4 bytes. If single-level paging is used on a 32-bit virtual address space, how many page table entries exist?",
        options: ["2^18 entries", "2^20 entries", "2^22 entries", "2^24 entries"],
        correctOptionIndex: 1,
        subject: "Computer Science",
        topic: "Operating Systems (Virtual Memory Paging)",
        difficulty: "Medium",
        explanation: "Virtual address space = 2^32 bytes. Page size = 4 KB = 2^12 bytes. Number of pages (and therefore PTEs in single-level page table) = 2^32 / 2^12 = 2^20 entries."
      },
      {
        id: 7,
        sectionId: "sec-cs",
        type: "MSQ",
        marks: 2,
        question: "Which of the following problems are known to be DECIDABLE for Regular Languages? (Select all that apply - Multiple Select Question, zero partial credit)",
        options: [
          "Emptiness problem (Is L = empty?)",
          "Finiteness problem (Is L finite?)",
          "Equivalence problem (Is L1 = L2?)",
          "Post Correspondence Problem (PCP)"
        ],
        correctOptionIndices: [0, 1, 2],
        subject: "Computer Science",
        topic: "Theory of Computation (Decidability)",
        difficulty: "Hard",
        explanation: "All non-trivial decision problems (membership, emptiness, finiteness, equivalence, universality) are decidable for Regular languages. The Post Correspondence Problem (PCP) is undecidable for general strings."
      },
      {
        id: 8,
        sectionId: "sec-cs",
        type: "MSQ",
        marks: 2,
        question: "Which of the following database isolation levels PREVENT 'Non-Repeatable Reads' according to ANSI SQL standard? (Select all that apply - Multiple Select Question)",
        options: [
          "Read Uncommitted",
          "Read Committed",
          "Repeatable Read",
          "Serializable"
        ],
        correctOptionIndices: [2, 3],
        subject: "Computer Science",
        topic: "DBMS (Transaction Isolation Levels)",
        difficulty: "Medium",
        explanation: "Non-repeatable reads occur when a transaction reads the same row twice and observes different values because another transaction modified and committed it. ANSI SQL specifies that both 'Repeatable Read' and 'Serializable' prevent Non-Repeatable Reads."
      },
      {
        id: 9,
        sectionId: "sec-cs",
        type: "NAT",
        marks: 2,
        question: "In a 10 Mbps Ethernet network using CSMA/CD, the distance between the two furthest stations is 1 km and signal propagation speed along the cable is 2 x 10^8 m/s. What is the MINIMUM frame size required in bytes to ensure collision detection?",
        correctValue: 12.5,
        toleranceMin: 12.0,
        toleranceMax: 13.0,
        subject: "Computer Science",
        topic: "Computer Networks (CSMA/CD Minimum Frame Size)",
        difficulty: "Medium",
        explanation: "Propagation time T_prop = d / v = 1000 m / (2 x 10^8 m/s) = 5 x 10^(-6) s = 5 microseconds. In CSMA/CD, transmission time T_trans >= 2 * T_prop = 10 microseconds. Frame size in bits = 10 x 10^(-6) s * 10 x 10^6 bps = 100 bits. In bytes: 100 / 8 = 12.5 bytes. (Accepting 12.0 to 13.0 bytes)."
      },
      {
        id: 10,
        sectionId: "sec-cs",
        type: "NAT",
        marks: 1,
        question: "A binary search tree has keys: 10, 5, 20, 3, 7, 15, 30. How many comparisons are required to search for key 7? (Root is counted as 1st comparison)",
        correctValue: 3,
        toleranceMin: 3,
        toleranceMax: 3,
        subject: "Computer Science",
        topic: "Data Structures (Binary Search Trees)",
        difficulty: "Easy",
        explanation: "Comparisons: (1) Compare with root 10: 7 < 10, go left to node 5. (2) Compare with 5: 7 > 5, go right to node 7. (3) Compare with 7: key found! Total comparisons = 3."
      }
    ]
  }
];

module.exports = mockTests;
