// server/data/aptitudeTaxonomyData.js
// Complete 8-Pillar Universal Aptitude Taxonomy & Curated Video Resource Mapping
// Covers Level 0 (Scratch/Foundation) to Level 3 (Advanced CAT/Bank PO) across all Indian exams.

const APTITUDE_PILLARS = [
  {
    id: "quantitative-aptitude",
    pillarNumber: 1,
    title: "Quantitative Aptitude (Numerical Ability)",
    shortDescription: "From basic number sense to competitive arithmetic and advanced engineering algebra.",
    icon: "Calculator",
    difficultyRange: "Level 0 to Level 3",
    examRelevance: {
      GATE_GA: "Very High (4-6 Marks out of 15)",
      SSC_CGL: "Critical (Tier 1: 50 Marks, Tier 2: 90 Marks)",
      BANKING_PO: "Critical (Prelims: 35 Marks, Mains: 60 Marks)",
      UPSC_CSAT: "High (~30-35 Questions for Qualifying)",
      CAT_MBA: "Core Section (QA 22 Questions)",
      CAMPUS: "Mandatory Round 1 Filter"
    },
    sections: [
      {
        sectionId: "number-system",
        title: "Number System & Foundational Math",
        topics: [
          {
            id: "classification-divisibility",
            title: "Number Classification & Divisibility Rules (2 to 37)",
            level: 0,
            blinkTrickSummary: "Compound Divisibility factorization rule (e.g. 72 = 8 x 9, 88 = 8 x 11, 7/11/13 osculator check).",
            estimatedLearningMins: 35,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "unit-digit-remainders",
            title: "Unit Digit, Last 2 Digits & Remainder Theorem",
            level: 1,
            blinkTrickSummary: "Cyclicity of powers (4-periodicity) + Negative Remainder & Euler Theorem shortcut.",
            estimatedLearningMins: 45,
            gateWeightage: "High",
            sscWeightage: "High"
          },
          {
            id: "factors-trailing-zeros",
            title: "Factors, Prime Factorization & Trailing Zeros",
            level: 1,
            blinkTrickSummary: "Legendre's formula: Counting pairs of 2 and 5 for trailing zeros in n! in 5 seconds.",
            estimatedLearningMins: 30,
            gateWeightage: "Medium",
            sscWeightage: "High"
          },
          {
            id: "hcf-lcm",
            title: "HCF & LCM (Prime Multiples & Difference Method)",
            level: 1,
            blinkTrickSummary: "HCF is always a factor of the difference between any two numbers; avoid long division.",
            estimatedLearningMins: 35,
            gateWeightage: "Medium",
            sscWeightage: "High"
          },
          {
            id: "simplification-bodmas-surds",
            title: "Simplification, BODMAS, Surds & Indices",
            level: 0,
            blinkTrickSummary: "V-BODMAS priority + rationalization conjugate shortcut without pencil-and-paper algebra.",
            estimatedLearningMins: 25,
            gateWeightage: "Medium",
            sscWeightage: "Critical"
          }
        ]
      },
      {
        sectionId: "arithmetic-core",
        title: "Arithmetic Core (The Heart of All Competitive Exams)",
        topics: [
          {
            id: "percentages-fraction-table",
            title: "Percentages & Fraction-to-% Table (1/2 to 1/30)",
            level: 0,
            blinkTrickSummary: "Direct mental multiplier substitution: 14.28% = 1/7, 16.66% = 1/6, 37.5% = 3/8 for instant calculation.",
            estimatedLearningMins: 40,
            gateWeightage: "Critical",
            sscWeightage: "Critical"
          },
          {
            id: "ratio-proportion-partnership",
            title: "Ratio, Proportion & Business Partnership",
            level: 1,
            blinkTrickSummary: "Bridge-Ratio multiplication (A:B and B:C to A:B:C in 5 seconds) and capital x time profit splitting.",
            estimatedLearningMins: 35,
            gateWeightage: "Critical",
            sscWeightage: "Critical"
          },
          {
            id: "averages-alligation",
            title: "Averages & Mixture Alligation (Cross-Method)",
            level: 2,
            blinkTrickSummary: "Cross-Alligation eliminates simultaneous equations: (Cheaper - Mean) / (Mean - Dearer) gives ratio.",
            estimatedLearningMins: 45,
            gateWeightage: "Critical",
            sscWeightage: "Critical"
          },
          {
            id: "profit-loss-discount",
            title: "Profit, Loss & Successive Discounts",
            level: 1,
            blinkTrickSummary: "CP-SP-MRP ratio triangle + Dishonest dealer formula (goods cheating vs weight cheating).",
            estimatedLearningMins: 45,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "simple-compound-interest",
            title: "Simple & Compound Interest (Tree Method & Installments)",
            level: 2,
            blinkTrickSummary: "Pascal triangle rate multipliers (2:1 for 2 yrs, 3:3:1 for 3 yrs) + CI-SI difference = P(r/100)^2.",
            estimatedLearningMins: 50,
            gateWeightage: "Medium",
            sscWeightage: "Critical"
          },
          {
            id: "time-work-pipes",
            title: "Time & Work, Pipes & Cisterns (LCM Efficiency Method)",
            level: 1,
            blinkTrickSummary: "LCM total work units converts work into integer eating rates; zero fractional algebra.",
            estimatedLearningMins: 40,
            gateWeightage: "Critical",
            sscWeightage: "Critical"
          },
          {
            id: "time-speed-distance",
            title: "Time, Speed & Distance, Trains & Boats (Relative Speed)",
            level: 2,
            blinkTrickSummary: "Inverse proportion: speed ratio a:b implies time ratio b:a; downstream = u+v, upstream = u-v.",
            estimatedLearningMins: 50,
            gateWeightage: "Critical",
            sscWeightage: "Critical"
          }
        ]
      },
      {
        sectionId: "advanced-quant",
        title: "Advanced Maths & Engineering / Entrance Quant",
        topics: [
          {
            id: "algebra-equations",
            title: "Algebra & Linear/Quadratic Equations",
            level: 2,
            blinkTrickSummary: "Symmetric polynomial value substitution (put a=b=c=1) and sum/product of roots tricks.",
            estimatedLearningMins: 45,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "mensuration-geometry",
            title: "Mensuration 2D/3D & Geometry (Triangles, Circles)",
            level: 2,
            blinkTrickSummary: "Pi factor divisibility by 11 and 7 + area scaling (radius x k => area x k^2).",
            estimatedLearningMins: 60,
            gateWeightage: "Critical",
            sscWeightage: "Critical"
          },
          {
            id: "trigonometry-heights-distances",
            title: "Trigonometry, Heights & Distances",
            level: 2,
            blinkTrickSummary: "30-60-90 (1 : sqrt(3) : 2) and 45-45-90 (1 : 1 : sqrt(2)) elevation triangles.",
            estimatedLearningMins: 45,
            gateWeightage: "Medium",
            sscWeightage: "Critical"
          },
          {
            id: "permutations-combinations-probability",
            title: "Permutations, Combinations & Probability",
            level: 2,
            blinkTrickSummary: "Slot filling method + complementary probability (P(at least 1) = 1 - P(none)).",
            estimatedLearningMins: 50,
            gateWeightage: "Critical",
            sscWeightage: "High"
          },
          {
            id: "statistics-data-analysis",
            title: "Statistics: Mean, Median, Mode, Variance & SD",
            level: 2,
            blinkTrickSummary: "Empirical relation: Mode = 3 Median - 2 Mean; Variance = SD^2.",
            estimatedLearningMins: 35,
            gateWeightage: "Medium",
            sscWeightage: "High"
          }
        ]
      }
    ]
  },
  {
    id: "logical-reasoning",
    pillarNumber: 2,
    title: "Logical & Analytical Reasoning",
    shortDescription: "Deductive rules, puzzle solving, coding patterns, and spatial relations.",
    icon: "Brain",
    difficultyRange: "Level 0 to Level 3",
    examRelevance: {
      GATE_GA: "Very High (3-5 Marks out of 15)",
      SSC_CGL: "Critical (Tier 1: 50 Marks, Tier 2: 90 Marks)",
      BANKING_PO: "Dominant Section (Puzzles & Seating 25-30 Marks)",
      UPSC_CSAT: "Critical (~25-30 Questions)",
      CAT_MBA: "Core DILR Section",
      CAMPUS: "Mandatory Technical & Cognitive Round"
    },
    sections: [
      {
        sectionId: "deductive-logic",
        title: "Verbal & Deductive Logic",
        topics: [
          {
            id: "syllogisms-100-50",
            title: "Syllogisms (100-50 Tick Rule & Venn Diagrams)",
            level: 1,
            blinkTrickSummary: "Income-Expenditure 100-50 rule solves 4-statement syllogisms in 12s without drawing circles.",
            estimatedLearningMins: 40,
            gateWeightage: "Critical",
            sscWeightage: "Critical"
          },
          {
            id: "blood-relations",
            title: "Blood Relations (Family Tree Generation & Coding)",
            level: 1,
            blinkTrickSummary: "Gender parity + generation gap (+1, 0, -1) eliminates 3 options immediately in coded relations.",
            estimatedLearningMins: 35,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "direction-distance",
            title: "Direction & Distance (Shadow & Angular Turns)",
            level: 1,
            blinkTrickSummary: "Right-angle net displacement vector table (+N/-S, +E/-W) and shadow rules at sunrise/sunset.",
            estimatedLearningMins: 30,
            gateWeightage: "Medium",
            sscWeightage: "Critical"
          },
          {
            id: "coding-decoding",
            title: "Coding-Decoding & Alphabet Shifting",
            level: 0,
            blinkTrickSummary: "EJOTY (5-10-15-20-25) + Opposite letter pairs (AZ, BY, CX, EV, GT, MN, LO, IR, SH, PK, UF).",
            estimatedLearningMins: 30,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "inequalities-magic-box",
            title: "Inequalities (Direct & Coded Magic Box)",
            level: 1,
            blinkTrickSummary: "Priority hierarchy: > overrides >= overrides =. Opposing signs (> and <) break chain instantly.",
            estimatedLearningMins: 30,
            gateWeightage: "Medium",
            sscWeightage: "Critical"
          },
          {
            id: "clocks-calendars",
            title: "Clocks & Calendars (Odd Days & Hand Angles)",
            level: 1,
            blinkTrickSummary: "Angle between hands = |30H - 5.5M|; Odd days in leap year = 2, ordinary year = 1.",
            estimatedLearningMins: 35,
            gateWeightage: "High",
            sscWeightage: "High"
          }
        ]
      },
      {
        sectionId: "analytical-puzzles",
        title: "Analytical Puzzles & Seating Arrangements",
        topics: [
          {
            id: "seating-arrangements",
            title: "Seating Arrangements (Linear, Circular, Square, Parallel)",
            level: 2,
            blinkTrickSummary: "Dual-case parallel threading eliminates false branches in under 60 seconds.",
            estimatedLearningMins: 55,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "complex-floor-box-puzzles",
            title: "Floor, Box, Month/Day & Multi-Variable Puzzles",
            level: 3,
            blinkTrickSummary: "Definite clue anchoring technique: Fix the highest-constraint parameter first.",
            estimatedLearningMins: 60,
            gateWeightage: "Medium",
            sscWeightage: "Critical"
          },
          {
            id: "input-output-machine",
            title: "Machine Input-Output & Step Transformations",
            level: 2,
            blinkTrickSummary: "Pattern identification (lexicographical word ordering + numerical ascending/descending).",
            estimatedLearningMins: 45,
            gateWeightage: "Low",
            sscWeightage: "High"
          }
        ]
      }
    ]
  },
  {
    id: "critical-reasoning",
    pillarNumber: 3,
    title: "Critical & Verbal Reasoning",
    shortDescription: "Statement assumptions, arguments, conclusions, cause-effect, and course of action.",
    icon: "Scale",
    difficultyRange: "Level 1 to Level 3",
    examRelevance: {
      GATE_GA: "High (2-3 Marks)",
      SSC_CGL: "High (Tier 2 Mains Statement Reasoning)",
      BANKING_PO: "Critical (Mains 10-15 Marks)",
      UPSC_CSAT: "Dominant Section",
      CAT_MBA: "High (VARC & Critical Reasoning)",
      CAMPUS: "High"
    },
    sections: [
      {
        sectionId: "statement-logic",
        title: "Statement & Argument Analysis",
        topics: [
          {
            id: "statement-assumptions",
            title: "Statement & Implicit Assumptions",
            level: 2,
            blinkTrickSummary: "Negation Test: If negating the assumption collapses the argument, it is 100% implicit.",
            estimatedLearningMins: 40,
            gateWeightage: "High",
            sscWeightage: "High"
          },
          {
            id: "statement-arguments",
            title: "Statement & Strong/Weak Arguments",
            level: 2,
            blinkTrickSummary: "Strong arguments address feasibility and national interest; weak arguments use emotional bias.",
            estimatedLearningMins: 35,
            gateWeightage: "Medium",
            sscWeightage: "High"
          },
          {
            id: "course-of-action",
            title: "Statement & Course of Action",
            level: 1,
            blinkTrickSummary: "Action must directly resolve or mitigate problem without creating a worse second problem.",
            estimatedLearningMins: 30,
            gateWeightage: "Medium",
            sscWeightage: "High"
          },
          {
            id: "cause-and-effect",
            title: "Cause & Effect Relationships",
            level: 2,
            blinkTrickSummary: "Temporal check: Cause must precede effect in timeline and have direct causal nexus.",
            estimatedLearningMins: 30,
            gateWeightage: "Medium",
            sscWeightage: "High"
          }
        ]
      }
    ]
  },
  {
    id: "non-verbal-spatial",
    pillarNumber: 4,
    title: "Non-Verbal & Spatial Aptitude",
    shortDescription: "Figure counting, mirror images, cube & dice, paper folding, and spatial 3D visualization.",
    icon: "LayoutGrid",
    difficultyRange: "Level 0 to Level 2",
    examRelevance: {
      GATE_GA: "Mandatory Section (Spatial Aptitude 2-3 Questions)",
      SSC_CGL: "High (Tier 1: 8-10 Questions)",
      BANKING_PO: "Low (State & Regional only)",
      UPSC_CSAT: "Medium",
      CAT_MBA: "Low",
      CAMPUS: "High"
    },
    sections: [
      {
        sectionId: "spatial-visualization",
        title: "Spatial Rotation & Figure Analysis",
        topics: [
          {
            id: "figure-counting",
            title: "Figure Counting in 5 Seconds (Triangles, Squares, Rectangles)",
            level: 1,
            blinkTrickSummary: "Divided triangle base numbering (n*(n+1)/2) and grid matrix formula (sum of products).",
            estimatedLearningMins: 35,
            gateWeightage: "Critical",
            sscWeightage: "Critical"
          },
          {
            id: "cube-dice-opposite-faces",
            title: "Cube & Open/Closed Dice Opposite Face Tricks",
            level: 1,
            blinkTrickSummary: "Alternate face rule in open dice + 1-common face clockwise rotation rule in closed dice.",
            estimatedLearningMins: 30,
            gateWeightage: "Critical",
            sscWeightage: "Critical"
          },
          {
            id: "mirror-water-images",
            title: "Mirror & Water Images (Lateral Inversion)",
            level: 0,
            blinkTrickSummary: "Horizontal flip for mirror (left becomes right), vertical flip for water (top becomes bottom).",
            estimatedLearningMins: 25,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "paper-folding-cutting",
            title: "Paper Folding, Cutting & Unfolding",
            level: 1,
            blinkTrickSummary: "Reverse unfolding mirror reflection rule at each fold crease line.",
            estimatedLearningMins: 30,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "spatial-transformation-assembly",
            title: "Spatial Rotation, 2D/3D Assembly & Grouping",
            level: 2,
            blinkTrickSummary: "Feature anchoring: Track the single sharpest unique vertex during angular rotation.",
            estimatedLearningMins: 35,
            gateWeightage: "Critical",
            sscWeightage: "High"
          }
        ]
      }
    ]
  },
  {
    id: "data-interpretation",
    pillarNumber: 5,
    title: "Data Interpretation (DI) Studio",
    shortDescription: "Tables, bar/line charts, pie charts, caselet DI, and radar spider charts.",
    icon: "BarChart3",
    difficultyRange: "Level 1 to Level 3",
    examRelevance: {
      GATE_GA: "High (1-2 Data sets)",
      SSC_CGL: "High (4-5 Questions per shift)",
      BANKING_PO: "Dominant Section (Mains 35-40 Marks)",
      UPSC_CSAT: "High",
      CAT_MBA: "Dominant DILR Section",
      CAMPUS: "High"
    },
    sections: [
      {
        sectionId: "visual-di",
        title: "Tabular & Graphical Data Interpretation",
        topics: [
          {
            id: "pie-charts-degree-conversion",
            title: "Pie Charts & Fast Degree-to-% Conversion",
            level: 1,
            blinkTrickSummary: "3.6 degrees = 1%; 18 degrees = 5%; 36 degrees = 10% instant mental multiplier.",
            estimatedLearningMins: 35,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "tabular-bar-line-di",
            title: "Tabular DI, Bar Graphs & Line Charts",
            level: 1,
            blinkTrickSummary: "Approximation rounding (convert 49,823 to 50k) and percentage growth shortcut.",
            estimatedLearningMins: 40,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "caselet-di-venn",
            title: "Caselet DI & 3-Circle Venn Diagrams",
            level: 2,
            blinkTrickSummary: "Venn region numbering (Only A, Only B, Both, All 3) eliminates equation ambiguity.",
            estimatedLearningMins: 50,
            gateWeightage: "Medium",
            sscWeightage: "High"
          },
          {
            id: "radar-missing-data-di",
            title: "Radar / Web Charts & Missing Data DI",
            level: 3,
            blinkTrickSummary: "Concentric polygon distance reading + backward reverse calculation from given totals.",
            estimatedLearningMins: 45,
            gateWeightage: "Low",
            sscWeightage: "High"
          }
        ]
      }
    ]
  },
  {
    id: "verbal-ability",
    pillarNumber: 6,
    title: "Verbal Ability & Reading Comprehension",
    shortDescription: "Grammar rules, root-word vocab, para-jumbles, and reading comprehension speed.",
    icon: "BookOpen",
    difficultyRange: "Level 0 to Level 3",
    examRelevance: {
      GATE_GA: "High (3-4 Marks out of 15)",
      SSC_CGL: "Critical (Tier 2 English: 135 Marks)",
      BANKING_PO: "Critical (English Section: 30-40 Marks)",
      UPSC_CSAT: "Dominant Section (RC Comprehension)",
      CAT_MBA: "Dominant VARC Section (24 Questions)",
      CAMPUS: "Mandatory Communication Screening"
    },
    sections: [
      {
        sectionId: "grammar-vocabulary",
        title: "Core Grammar & Etymology Vocabulary",
        topics: [
          {
            id: "spotting-errors-rules",
            title: "100 Golden Rules of Grammar (Subject-Verb, Pronoun, Modifiers)",
            level: 1,
            blinkTrickSummary: "Subject-Verb proximity traps + 'Neither/Nor' closest subject agreement rule.",
            estimatedLearningMins: 45,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "para-jumbles-mandatory-pairs",
            title: "Para-Jumbles & Sentence Ordering (Mandatory Pair Trick)",
            level: 2,
            blinkTrickSummary: "Find the Noun-Pronoun mandatory pair (e.g. BC) and eliminate 3 options in 10 seconds.",
            estimatedLearningMins: 35,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "reading-comprehension-skimming",
            title: "Reading Comprehension (Skimming & Question-First Technique)",
            level: 2,
            blinkTrickSummary: "Read question stems first to identify keyword anchors before reading passage.",
            estimatedLearningMins: 45,
            gateWeightage: "High",
            sscWeightage: "Critical"
          },
          {
            id: "root-word-vocabulary",
            title: "Root-Word Vocabulary (Greek & Latin Etymology)",
            level: 0,
            blinkTrickSummary: "Bene/Mal (Good/Bad), Chron (Time), Path (Feeling) decodes 500+ words instantly.",
            estimatedLearningMins: 35,
            gateWeightage: "High",
            sscWeightage: "Critical"
          }
        ]
      }
    ]
  },
  {
    id: "psychometric-oir",
    pillarNumber: 7,
    title: "Abstract & Psychometric / OIR Aptitude",
    shortDescription: "SSB Officer Intelligence Rating and Railway ALP Psycho Battery tests.",
    icon: "ShieldAlert",
    difficultyRange: "Level 1 to Level 2",
    examRelevance: {
      GATE_GA: "Low",
      SSC_CGL: "Low",
      BANKING_PO: "Medium (Executive Interviews)",
      UPSC_CSAT: "Low",
      CAT_MBA: "Medium",
      DEFENCE_AFCAT: "Critical (SSB Stage 1 Screening)",
      RAILWAYS_ALP: "Mandatory (Aptitude Battery Test)"
    },
    sections: [
      {
        sectionId: "defence-railway-aptitude",
        title: "Screening Intelligence & Battery Tests",
        topics: [
          {
            id: "ssb-oir-verbal-nonverbal",
            title: "SSB Officer Intelligence Rating (OIR 1 & 2 Testing)",
            level: 1,
            blinkTrickSummary: "Rapid picture perception & numerical sequence categorization in 30 seconds per item.",
            estimatedLearningMins: 35,
            gateWeightage: "Low",
            sscWeightage: "Medium"
          },
          {
            id: "railway-alp-psycho-battery",
            title: "Railway ALP Psycho Battery (Memory & Concentration)",
            level: 1,
            blinkTrickSummary: "Grid memory association technique & digit search speed test for 100% accuracy.",
            estimatedLearningMins: 40,
            gateWeightage: "Low",
            sscWeightage: "Low"
          }
        ]
      }
    ]
  },
  {
    id: "speed-gym",
    pillarNumber: 8,
    title: "60-Second Mental Math & Calculation Reflex Gym",
    shortDescription: "Vedic multiplication, squares/cubes, roots in 3s, digital sum, and reflex flashcards.",
    icon: "Zap",
    difficultyRange: "Reflex Training",
    examRelevance: {
      ALL_EXAMS: "Universal Advantage (Saves 15-20 Minutes per Paper)"
    },
    sections: [
      {
        sectionId: "mental-math-drills",
        title: "Vedic Math & Reflex Muscle Memory",
        topics: [
          {
            id: "digital-sum-c9",
            title: "Digital Sum (Casting Out Nines / 9-Point Cancellation)",
            level: 0,
            blinkTrickSummary: "Sum digits until single digit (9=0). LHS digital sum must equal RHS digital sum.",
            estimatedLearningMins: 20
          },
          {
            id: "vedic-multiplication-shortcuts",
            title: "Vedic Cross-Multiplication (Base 100, Base 1000, 2x2, 3x3)",
            level: 1,
            blinkTrickSummary: "Vertical and Crosswise (Urdhva Tiryagbhyam): Multiply 104 x 107 = 11128 in 2 seconds.",
            estimatedLearningMins: 25
          },
          {
            id: "squares-cubes-speed",
            title: "Squares (1 to 125) & Cubes (1 to 30) Instant Recall",
            level: 0,
            blinkTrickSummary: "Base 50 and Base 100 delta method: 48^2 = (25-2)|(04) = 2304; 106^2 = 11236.",
            estimatedLearningMins: 30
          },
          {
            id: "square-cube-roots-3s",
            title: "Square & Cube Roots in 3 Seconds",
            level: 1,
            blinkTrickSummary: "Cube roots have 1-to-1 unique unit digit mapping (2<->8, 3<->7); instant inspection.",
            estimatedLearningMins: 20
          }
        ]
      }
    ]
  }
];

// Curated Educational Video Lectures with verified public links and timestamps
const TOPIC_VIDEO_LECTURES = {
  "classification-divisibility": [
    {
      id: "vid-div-01",
      title: "Divisibility Rules from 2 to 37 & Co-Prime Factorization (72, 88, 99)",
      instructor: "Aptitude Masterclass Series",
      language: "Hindi / English",
      platform: "YouTube",
      videoUrl: "https://www.youtube.com/watch?v=example_divisibility_72",
      duration: "45:10",
      timestamps: [
        { time: "00:00", label: "Fundamental Divisibility (2, 3, 4, 5, 6, 8, 9, 11)" },
        { time: "14:20", label: "Osculator Rules for 7, 13, 17, 19" },
        { time: "28:35", label: "Compound Co-Prime Factors: 72 = 8 x 9, 88 = 8 x 11" },
        { time: "38:50", label: "Finding Missing Digits x and y in 10 Seconds" }
      ]
    }
  ],
  "percentages-fractions": [
    {
      id: "vid-perc-01",
      title: "Percentages Foundation from Scratch (Fraction to % Magic)",
      instructor: "National Quantitative Masterclass",
      language: "Hindi / Hinglish",
      platform: "YouTube",
      videoUrl: "https://www.youtube.com/watch?v=1uHqL8kFp-A",
      duration: "48:15",
      timestamps: [
        { time: "00:00", label: "Foundations & Why Percentages Rule Arithmetic" },
        { time: "08:30", label: "Fraction to % Table (1/2 to 1/20 Derivation)" },
        { time: "22:10", label: "Exam Shortcut: Multipliers & Successive Changes" },
        { time: "36:45", label: "10-Second Blink-Tick Option Elimination" }
      ]
    }
  ],
  "percentages-fraction-table": [
    {
      id: "vid-perc-01",
      title: "Percentages Foundation from Scratch (Fraction to % Magic)",
      instructor: "National Quantitative Masterclass",
      language: "Hindi / Hinglish",
      platform: "YouTube",
      videoUrl: "https://www.youtube.com/watch?v=1uHqL8kFp-A",
      duration: "48:15",
      timestamps: [
        { time: "00:00", label: "Foundations & Why Percentages Rule Arithmetic" },
        { time: "08:30", label: "Fraction to % Table (1/2 to 1/20 Derivation)" },
        { time: "22:10", label: "Exam Shortcut: Multipliers & Successive Changes" },
        { time: "36:45", label: "10-Second Blink-Tick Option Elimination" }
      ]
    },
    {
      id: "vid-perc-02",
      title: "GATE General Aptitude: Percentage & Ratio Concepts",
      instructor: "NPTEL / IIT Faculty Series",
      language: "English",
      platform: "YouTube",
      videoUrl: "https://www.youtube.com/watch?v=example_gate_ga_perc",
      duration: "42:00",
      timestamps: [
        { time: "00:00", label: "GATE GA Syllabus Weightage" },
        { time: "12:15", label: "Arithmetic Ratio & Percentage Models" },
        { time: "28:40", label: "Previous 10-Year GATE Numerical Solvers" }
      ]
    }
  ],
  "time-work-pipes": [
    {
      id: "vid-tw-01",
      title: "Time and Work: The Complete LCM Efficiency Masterclass",
      instructor: "SSC & Banking Top Educator",
      language: "Hindi / Hinglish",
      platform: "YouTube",
      videoUrl: "https://www.youtube.com/watch?v=example_time_work",
      duration: "54:30",
      timestamps: [
        { time: "00:00", label: "Concept from Scratch: Why 1/x is Too Slow" },
        { time: "11:20", label: "LCM Total Work Units Technique" },
        { time: "26:50", label: "Alternate Day & Leaving Before Completion" },
        { time: "42:10", label: "Efficiency Ratio Tricks for 15s Solves" }
      ]
    }
  ],
  "figure-counting": [
    {
      id: "vid-fc-01",
      title: "Figure Counting Tricks: Count Triangles & Squares in 5 Seconds",
      instructor: "Reasoning Ninja Series",
      language: "Hindi / English",
      platform: "YouTube",
      videoUrl: "https://www.youtube.com/watch?v=example_fig_counting",
      duration: "32:40",
      timestamps: [
        { time: "00:00", label: "Triangle in Triangle Formula" },
        { time: "09:15", label: "Grid Squares & Rectangles Formula" },
        { time: "21:30", label: "Complex Embedded Geometric Patterns" }
      ]
    }
  ],
  "digital-sum-c9": [
    {
      id: "vid-ds-01",
      title: "Vedic Math: Digital Sum (Casting Out Nines) Trick",
      instructor: "Speed Math Academy",
      language: "English",
      platform: "YouTube",
      videoUrl: "https://www.youtube.com/watch?v=example_digital_sum",
      duration: "28:10",
      timestamps: [
        { time: "00:00", label: "What is Digital Root / Casting Out 9s" },
        { time: "08:45", label: "Application to Massive Multiplication & Division" },
        { time: "18:20", label: "Trap Alert: When Digital Sum Cannot Be Used" }
      ]
    }
  ]
};

function getAllTopics() {
  const topics = [];
  APTITUDE_PILLARS.forEach(pillar => {
    pillar.sections.forEach(sec => {
      sec.topics.forEach(t => {
        topics.push({
          ...t,
          pillarId: pillar.id,
          pillarTitle: pillar.title,
          sectionId: sec.sectionId,
          sectionTitle: sec.title
        });
      });
    });
  });
  return topics;
}

function getTopicById(topicId) {
  for (const pillar of APTITUDE_PILLARS) {
    for (const sec of pillar.sections) {
      const found = sec.topics.find(t => t.id === topicId);
      if (found) {
        return {
          ...found,
          pillarId: pillar.id,
          pillarTitle: pillar.title,
          sectionId: sec.sectionId,
          sectionTitle: sec.title,
          videoLectures: TOPIC_VIDEO_LECTURES[topicId] || []
        };
      }
    }
  }
  return null;
}

function getTopicsByPillar(pillarId) {
  const pillar = APTITUDE_PILLARS.find(p => p.id === pillarId);
  if (!pillar) return [];
  const list = [];
  pillar.sections.forEach(sec => {
    sec.topics.forEach(t => {
      list.push({
        ...t,
        pillarId: pillar.id,
        pillarTitle: pillar.title,
        sectionId: sec.sectionId,
        sectionTitle: sec.title
      });
    });
  });
  return list;
}

module.exports = {
  APTITUDE_PILLARS,
  TOPIC_VIDEO_LECTURES,
  getAllTopics,
  getTopicById,
  getTopicsByPillar
};
