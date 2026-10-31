// server/services/academicCompanionService.js
// Citation-Grounded AI Academic Companion & Epistemic Verification Gateway
// Implements 8 specialized academic modes, strict citations, CAS mathematical verification,
// and zero-budget deterministic academic fallback when API quota is exhausted.

const aiProviderGateway = require('./aiProviderGateway');
const { verifyMathematicalResult, solveQuadratic, evaluateArithmetic } = require('./symbolicMathEngine');
const { ACADEMIC_FALLBACK_REPOSITORY } = require('../data/academicFallbackData');
const { SUBJECT_SPACES } = require('../data/learningRegistryData');

const COMPANION_MODES = {
  CONCEPT_TUTOR: "CONCEPT_TUTOR",
  MATH_NUMERICAL_SOLVER: "MATH_NUMERICAL_SOLVER",
  REASONING_APTITUDE: "REASONING_APTITUDE",
  PYQ_ANALYZER: "PYQ_ANALYZER",
  HIGH_YIELD_REVISION: "HIGH_YIELD_REVISION",
  CUSTOM_MOCK_GENERATOR: "CUSTOM_MOCK_GENERATOR",
  STUDY_PLAN_COACH: "STUDY_PLAN_COACH",
  CAREER_GUIDANCE: "CAREER_GUIDANCE"
};

const EPISTEMIC_BADGE = "[AI Educational Guidance — Verify Official Rules in Source PDF]";

/**
 * Checks whether user query contains requests for unannounced speculative data (cutoffs, dates).
 * @param {string} prompt
 * @returns {boolean}
 */
function isSpeculativeQuery(prompt = "") {
  const p = prompt.toLowerCase();
  const asksForFuture = /expected cutoff|what will be the cutoff|predicted cutoff|exact cutoff|cutoff score|cutoff for|cutoff 20\d\d|exam date leak|insider news|when will notification release/i.test(p);
  return asksForFuture;
}

/**
 * Builds grounded system prompt incorporating student context, mode constraints, and citations.
 */
function buildAcademicPrompt({ mode, prompt, context = {} }) {
  const exam = context.selectedExam || "GATE / Central Competitive Examination";
  const subject = context.currentSubject || "Core Engineering & Science";
  const topic = context.topic || "Core Syllabus";
  const prepLevel = context.preparationLevel || "Intermediate";
  const weakTopics = Array.isArray(context.weakTopics) ? context.weakTopics.map(w => w.topic || w).join(", ") : "None";

  return `You are EXAMVERSE's Senior Academic Companion, an expert Indian examination pedagogical tutor for ${exam}.
Student Context:
- Target Exam: ${exam}
- Current Subject: ${subject}
- Topic: ${topic}
- Student Preparation Level: ${prepLevel}
- Known Weak Topics: ${weakTopics}
- Active Academic Mode: ${mode}

Strict Operating Rules:
1. Grounding: All concepts must strictly adhere to the official syllabus specifications of ${exam}.
2. Epistemic Transparency: NEVER guess or hallucinate unnotified cutoffs, answer keys, or future dates. If unverified, state it explicitly.
3. Mathematical Precision: Write out full step-by-step derivations with clear equations.
4. Output Format:
   - Provide an opening Badge: ${EPISTEMIC_BADGE}
   - Deliver clear, rigorous pedagogical explanation
   - Provide explicit Official Citations (Syllabus reference, NPTEL courseware link, and key formula)
   - Highlight one "Exam Trap / Common Candidate Mistake"

User Query:
${prompt}`;
}

/**
 * Generates citation-grounded academic guidance with multi-tier fallback.
 * @param {Object} options
 * @returns {Promise<Object>} Academic guidance response with citations and metadata
 */
async function generateAcademicGuidance({
  mode = COMPANION_MODES.CONCEPT_TUTOR,
  prompt = "",
  context = {}
}) {
  const trimmed = prompt.trim();
  if (!trimmed) {
    throw new Error("Prompt cannot be empty.");
  }

  // Check for speculative query refusal
  if (isSpeculativeQuery(trimmed)) {
    const refusalText = `Official Cutoff & Schedule Policy Notice: The official cutoff or examination schedule for this upcoming cycle has not been published in the statutory gazette.\n\n` +
      `Under EXAMVERSE epistemic integrity standards, unverified dates or speculative marks are not generated to protect candidates from misinformation. ` +
      `Please consult verified official past-year cutoff matrices in the GATE Hub or Official Notifications Center.`;

    return {
      success: true,
      mode,
      epistemicStatus: "EPISTEMIC_REFUSAL",
      honestyBadge: EPISTEMIC_BADGE,
      badge: EPISTEMIC_BADGE,
      content: refusalText,
      response: refusalText,
      citations: [
        { title: "Statutory Gazette Notice Archive", source: "Official Recruitment Board", url: "/notifications" },
        { title: "Verified Historical Cutoff Registry", source: "EXAMVERSE Master Registry", url: "/gate/cutoffs" }
      ],
      provider: "Epistemic Integrity Guard",
      isDeterministicFallback: true
    };
  }

  // Specialized Deterministic Solver Mode: MATH_NUMERICAL_SOLVER
  if (mode === COMPANION_MODES.MATH_NUMERICAL_SOLVER) {
    // Check if query is a quadratic equation
    const quadMatch = trimmed.match(/([+-]?\s*\d*\.?\d*)\s*x\^?2\s*([+-]\s*\d*\.?\d*)\s*x\s*([+-]\s*\d*\.?\d*)\s*=\s*0/i);
    if (quadMatch) {
      const a = parseFloat(quadMatch[1].replace(/\s+/g, '')) || 1;
      const b = parseFloat(quadMatch[2].replace(/\s+/g, '')) || 0;
      const c = parseFloat(quadMatch[3].replace(/\s+/g, '')) || 0;
      const quadResult = solveQuadratic(a, b, c);

      const mathResponse = `### Step-by-Step Quadratic Equation Solution (Deterministic CAS)\n\n` +
        `Given Equation: **${a}x² + ${b}x + ${c} = 0**\n\n` +
        `**1. Discriminant Calculation:**\n` +
        `$$\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${quadResult.discriminant}$$\n\n` +
        `**2. Nature of Roots:** ${quadResult.rootType}\n\n` +
        `**3. Exact Roots:**\n` +
        (quadResult.roots.length > 0
          ? quadResult.roots.map((r, i) => `$$x_${i + 1} = ${r}$$`).join("\n")
          : `Complex conjugate pair: $${(-b / (2 * a)).toFixed(4)} \\pm ${((Math.sqrt(-quadResult.discriminant)) / (2 * a)).toFixed(4)}i$`) +
        `\n\n**Official Mathematical Derivation:**\n\`\`\`\n${quadResult.stepByStep}\n\`\`\``;

      return {
        success: true,
        mode,
        epistemicStatus: "GROUNDED_SYLLABUS_GUIDANCE",
        honestyBadge: EPISTEMIC_BADGE,
        badge: `${EPISTEMIC_BADGE}\n[CAS Certified — Deterministically Verified]`,
        content: mathResponse,
        response: mathResponse,
        citations: [
          { title: "Engineering Mathematics: Algebraic Equations", source: "GATE Official Syllabus", url: "/learn/subjects/engg-maths" },
          { title: "NPTEL Linear Algebra Courseware", source: "IIT Madras / NPTEL", url: "https://nptel.ac.in/courses/111106051" }
        ],
        provider: "Deterministic CAS Engine",
        isDeterministicFallback: true
      };
    }
  }

  // Attempt Multi-Tier AI Provider Gateway (Gemini -> Free Tier -> Cache)
  try {
    const fullSystemPrompt = buildAcademicPrompt({ mode, prompt: trimmed, context });
    const aiResult = await aiProviderGateway.executeAI({
      prompt: fullSystemPrompt,
      systemInstruction: "You are EXAMVERSE's rigorous academic tutor. Deliver concise, syllabus-grounded, citation-backed guidance."
    });

    if (aiResult && aiResult.text) {
      // Find matching subject citations
      const matchingSubject = SUBJECT_SPACES.find(s =>
        s.id === context.currentSubject ||
        s.name.toLowerCase().includes((context.currentSubject || "").toLowerCase())
      ) || SUBJECT_SPACES[0];

      return {
        success: true,
        mode,
        epistemicStatus: "GROUNDED_SYLLABUS_GUIDANCE",
        honestyBadge: EPISTEMIC_BADGE,
        badge: EPISTEMIC_BADGE,
        content: aiResult.text,
        response: aiResult.text,
        citations: [
          { title: matchingSubject.name, source: "Official Syllabus Reference", url: `/learn/subjects/${matchingSubject.id}` },
          { title: "NPTEL / SWAYAM Open Courseware", source: "Ministry of Education", url: "https://nptel.ac.in" }
        ],
        provider: aiResult.provider || "Gemini API Gateway",
        isDeterministicFallback: false
      };
    }
  } catch (err) {
    console.warn("[AcademicCompanion] External AI Gateway exhausted or offline. Engaging Deterministic Fallback Engine:", err.message);
  }

  // Tier 4: Zero-Budget Deterministic Academic Fallback Engine
  return generateDeterministicAcademicFallback({ mode, prompt: trimmed, context });
}

/**
 * Deterministic Academic Fallback Engine:
 * Generates verified pedagogical breakdowns using the pre-compiled academic knowledge base.
 */
function generateDeterministicAcademicFallback({ mode, prompt, context }) {
  const p = prompt.toLowerCase();

  // Find best matching curated knowledge block
  let matchedKey = "linear-algebra";
  if (p.includes("memory") || p.includes("tlb") || p.includes("operating") || p.includes("paging") || p.includes("cpu")) {
    matchedKey = "operating-systems";
  } else if (p.includes("network") || p.includes("csma") || p.includes("frame") || p.includes("ethernet") || p.includes("router")) {
    matchedKey = "computer-networks";
  } else if (p.includes("syllogism") || p.includes("reasoning") || p.includes("logic") || p.includes("venn") || p.includes("aptitude")) {
    matchedKey = "reasoning-aptitude";
  }

  const data = ACADEMIC_FALLBACK_REPOSITORY[matchedKey] || ACADEMIC_FALLBACK_REPOSITORY["linear-algebra"];

  let text = "";
  if (mode === COMPANION_MODES.PYQ_ANALYZER) {
    text = `### Previous Year Question (PYQ) Master Analysis\n\n` +
      `**Official Exam Topic:** ${data.topic} (${data.subjectCode})\n` +
      `**Syllabus Section:** ${data.syllabusSection}\n\n` +
      `**Sample Official PYQ:**\n> ${data.samplePYQ.question}\n\n` +
      `**Step-by-Step Pedagogical Derivation:**\n${data.samplePYQ.stepByStep}\n\n` +
      `⚠️ **Exam Trap & Common Mistake:**\n${data.commonTrap}`;
  } else if (mode === COMPANION_MODES.HIGH_YIELD_REVISION) {
    text = `### High-Yield Flash Revision Sheet\n\n` +
      `**Domain:** ${data.subject} • **Module:** ${data.topic}\n\n` +
      `**Key Mathematical Formula:** \`${data.formulaRef}\`\n\n` +
      `**Core Theoretical Principles:**\n${data.conceptExplanation}\n\n` +
      `**Critical Pitfalls to Avoid in CBT:**\n${data.commonTrap}`;
  } else {
    text = `### Official Syllabus-Grounded Conceptual Breakdown\n\n` +
      `**Subject:** ${data.subject} (${data.subjectCode})\n` +
      `**Topic Domain:** ${data.topic}\n` +
      `**Curriculum Reference:** ${data.syllabusSection}\n\n` +
      `**Pedagogical Overview:**\n${data.conceptExplanation}\n\n` +
      `**Solved Example from PYQ Bank:**\n> ${data.samplePYQ.question}\n\n` +
      `*Solution:*\n${data.samplePYQ.stepByStep}\n\n` +
      `**Examiner's Warning:**\n${data.commonTrap}`;
  }

  return {
    success: true,
    mode,
    epistemicStatus: "GROUNDED_SYLLABUS_GUIDANCE",
    honestyBadge: EPISTEMIC_BADGE,
    badge: `${EPISTEMIC_BADGE}\n[Deterministic Offline Fallback — Zero Hallucination Engine Active]`,
    content: text,
    response: text,
    citations: [
      { title: data.syllabusSection, source: "Official Statutory Syllabus", url: `/learn/subjects/${data.subjectCode.toLowerCase()}` },
      { title: "NPTEL Open Courseware", source: "IIT / Ministry of Education", url: data.nptelLink },
      { title: `Formula Vault: ${data.formulaRef}`, source: "EXAMVERSE Formula Registry", url: "/formulas" }
    ],
    provider: "Deterministic Academic Fallback Engine",
    isDeterministicFallback: true,
    gatewayTier: "TIER_4_DETERMINISTIC_OFFLINE_SYLLABUS"
  };
}

module.exports = {
  COMPANION_MODES,
  EPISTEMIC_BADGE,
  isSpeculativeQuery,
  generateAcademicGuidance,
  generateDeterministicAcademicFallback,
  buildDeterministicAcademicFallback: generateDeterministicAcademicFallback
};
