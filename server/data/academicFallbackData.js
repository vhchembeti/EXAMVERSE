// server/data/academicFallbackData.js
// Curated High-Fidelity Pedagogical Knowledge Base for Offline & Zero-Quota Fallback
// Covers core subjects, official syllabus specifications, standard PYQ templates, and derivations

const ACADEMIC_FALLBACK_REPOSITORY = {
  "linear-algebra": {
    topic: "Linear Algebra & Matrices",
    subject: "Engineering Mathematics",
    subjectCode: "EM",
    syllabusSection: "Section 1: Linear Algebra (GATE / ESE Official Syllabus)",
    nptelLink: "https://nptel.ac.in/courses/111106051",
    formulaRef: "Cayley-Hamilton Theorem & Matrix Inverses",
    conceptExplanation:
      "A matrix A of size n x n represents a linear transformation on an n-dimensional vector space. " +
      "The rank of A is the maximum number of linearly independent row or column vectors. " +
      "Full row/column rank implies non-singularity (det(A) != 0). " +
      "Eigenvalues lambda satisfy the characteristic equation det(A - lambda*I) = 0. " +
      "Key Properties:\n" +
      "1. Sum of eigenvalues = Trace of A (sum of main diagonal entries).\n" +
      "2. Product of eigenvalues = Determinant of A.\n" +
      "3. Cayley-Hamilton Theorem: A square matrix satisfies its own characteristic equation: p(A) = 0.\n" +
      "4. If A is symmetric real, all eigenvalues are strictly real and eigenvectors corresponding to distinct eigenvalues are mutually orthogonal.",
    commonTrap:
      "Watch out for defective matrices where geometric multiplicity is less than algebraic multiplicity (these cannot be diagonalized).",
    samplePYQ: {
      question: "If A is a 3x3 matrix with eigenvalues 1, -1, and 2, what is the determinant of (A^3 - 2A)?",
      stepByStep:
        "1. By spectral mapping theorem, if lambda is an eigenvalue of A, then f(lambda) is an eigenvalue of f(A).\n" +
        "2. Let f(x) = x^3 - 2x.\n" +
        "   For lambda_1 = 1: f(1) = 1^3 - 2(1) = -1.\n" +
        "   For lambda_2 = -1: f(-1) = (-1)^3 - 2(-1) = -1 + 2 = 1.\n" +
        "   For lambda_3 = 2: f(2) = 2^3 - 2(2) = 8 - 4 = 4.\n" +
        "3. Determinant is product of eigenvalues: det(f(A)) = (-1) * (1) * (4) = -4."
    }
  },

  "operating-systems": {
    topic: "Virtual Memory & CPU Scheduling",
    subject: "Computer Science & Engineering",
    subjectCode: "OS",
    syllabusSection: "Section 5: Operating Systems (Processes, Paging, Virtual Memory)",
    nptelLink: "https://nptel.ac.in/courses/106106144",
    formulaRef: "Effective Memory Access Time (EMAT) with TLB",
    conceptExplanation:
      "Virtual memory decouples the programmer's logical address space from physical RAM pages using address translation hardware (MMU). " +
      "A virtual address is partitioned into Page Number (p) and Page Offset (d). " +
      "With Translation Lookaside Buffer (TLB), Effective Memory Access Time is given by:\n" +
      "EMAT = h * (t_tlb + t_m) + (1 - h) * (t_tlb + (k + 1) * t_m)\n" +
      "where h is TLB hit ratio, t_tlb is TLB access latency, t_m is main memory access latency, and k is the number of page table levels (k=1 for single-level, k=2 for two-level).",
    commonTrap:
      "For a TLB miss, do not forget that accessing the page table in memory requires k memory accesses, plus 1 additional memory access to fetch the actual target data.",
    samplePYQ: {
      question: "In a single-level paged system, TLB access time is 20 ns, memory cycle time is 100 ns. What is minimum TLB hit ratio required to keep EMAT <= 140 ns?",
      stepByStep:
        "1. EMAT formula for single-level paging (k=1):\n" +
        "   EMAT = h*(t_tlb + t_m) + (1 - h)*(t_tlb + 2*t_m)\n" +
        "2. Substitute values: EMAT = h*(20 + 100) + (1 - h)*(20 + 200) = 120h + 220*(1 - h) = 220 - 100h\n" +
        "3. Set 220 - 100h <= 140 => 100h >= 80 => h >= 0.80 (80%)."
    }
  },

  "computer-networks": {
    topic: "Data Link Layer & CSMA/CD Protocol",
    subject: "Computer Networks",
    subjectCode: "CN",
    syllabusSection: "Section 6: Computer Networks (Medium Access Control & Framing)",
    nptelLink: "https://nptel.ac.in/courses/106105080",
    formulaRef: "CSMA/CD Minimum Frame Size: L >= 2 * (d/v) * B",
    conceptExplanation:
      "Carrier Sense Multiple Access with Collision Detection (CSMA/CD) is the MAC protocol used in classic IEEE 802.3 Ethernet. " +
      "To ensure a transmitting host detects any collision before its transmission completes, the transmission time must be at least twice the one-way propagation delay: T_trans >= 2 * T_prop. " +
      "Therefore, the minimum frame size in bits is L_min = 2 * (d / v) * Bandwidth, where d is the maximum distance between stations and v is the propagation velocity.",
    commonTrap:
      "Always verify whether the question asks for the frame size in BITS or BYTES (divide bits by 8).",
    samplePYQ: {
      question: "A 1 Gbps CSMA/CD network has distance 1 km and signal velocity 2 x 10^8 m/s. What is the minimum frame size in bytes?",
      stepByStep:
        "1. T_prop = d / v = 1000 / (2 x 10^8) = 5 x 10^(-6) seconds = 5 microseconds.\n" +
        "2. T_trans >= 2 * T_prop = 10 microseconds.\n" +
        "3. Frame size in bits = 10 x 10^(-6) s * 10^9 bps = 10,000 bits.\n" +
        "4. Frame size in bytes = 10,000 / 8 = 1,250 bytes."
    }
  },

  "reasoning-aptitude": {
    topic: "Syllogisms & Categorical Logic",
    subject: "General Aptitude",
    subjectCode: "GA",
    syllabusSection: "Section 1: Verbal Ability & Deductive Reasoning",
    nptelLink: "https://swayam.gov.in",
    formulaRef: "Venn Diagram Set Intersection Rules & Complementary Pairs",
    conceptExplanation:
      "Syllogisms test formal deductive logic based purely on stated premises. " +
      "The four standard categorical propositions are:\n" +
      "- A (Universal Affirmative): 'All S are P' (S subset of P)\n" +
      "- E (Universal Negative): 'No S is P' (S and P are disjoint)\n" +
      "- I (Particular Affirmative): 'Some S are P' (Non-empty intersection)\n" +
      "- O (Particular Negative): 'Some S are not P'\n" +
      "Complementary Pairs (Either-Or condition):\n" +
      "When both terms are identical and one conclusion is positive while the other is negative (e.g. 'Some A are B' and 'No A is B'), if both are individually false/doubtful, the answer is 'Either I or II follows'.",
    commonTrap:
      "Do NOT use real-world factual common sense; follow strictly what the premises state, even if they assert 'All cars are elephants'.",
    samplePYQ: {
      question: "Statements: All pens are books. Some books are rulers. Conclusions: (I) Some pens are rulers. (II) No pen is a ruler.",
      stepByStep:
        "1. Venn analysis: The circle for 'pens' is inside 'books'. The circle for 'rulers' overlaps 'books'.\n" +
        "2. Rulers may or may not touch 'pens'. Neither Conclusion I nor II follows with certainty.\n" +
        "3. However, they share the identical subject ('pen') and predicate ('ruler'), and form an I-E pair ('Some' vs 'No').\n" +
        "4. Therefore, exactly one of them must be true => Conclusion: Either I or II follows."
    }
  }
};

module.exports = {
  ACADEMIC_FALLBACK_REPOSITORY
};
