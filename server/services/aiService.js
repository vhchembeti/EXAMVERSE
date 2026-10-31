// server/services/aiService.js
// Integrated AI Personal Study Tutor, Study Planner & Performance Analyst
// Powered by Google GenAI (Gemini 3.8 Flash via Interactions API) with multilingual support
// (English, Telugu, Hindi, Tamil) and grounded in official Indian exam syllabi.

const examinations = require('../data/examsData');
const { providerManager, maskKey } = require('./providerManager');

let genAIClient = null;

function getGenAI() {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (apiKey) {
      try {
        const { GoogleGenAI } = require('@google/genai');
        genAIClient = new GoogleGenAI({ apiKey });
      } catch (err) {
        console.warn("[AI Service] Could not initialize @google/genai client:", err.message);
      }
    }
  }
  return genAIClient;
}

// System instructions for the EXAMVERSE AI Academic Tutor
const TUTOR_SYSTEM_PROMPT = `
You are the EXAMVERSE AI Academic Study Tutor, an expert educator specializing in Indian Competitive Examinations (UPSC, SSC, RRB, State PSCs like APPSC/TGPSC/TNPSC, Banking IBPS/SBI, CUET UG/PG, JEE, NEET, GATE, CAT, CSIR NET, CTET, and CLAT).

CORE DIRECTIVES:
1. Ground explanations strictly in the official syllabus and pattern of the student's selected target examination.
2. For Mathematics / Quantitative Aptitude: Always provide step-by-step mathematical breakdown showing the formula, algebraic derivation, and fast competitive exam shortcuts.
3. For Reasoning / Mental Ability: Provide premise analysis, logic rules, and fast option elimination techniques.
4. For PYQ Analysis: Highlight past-year exam frequency, recurring traps, and official negative marking precautions.
5. Multilingual Excellence:
   - English: Clear, professional academic English.
   - Telugu (తెలుగు): Fluent Telugu with standard academic terminology (e.g. ప్రాథమిక హక్కులు, సాధారణ అవగాహన, తార్కిక ఆలోచన).
   - Hindi (हिन्दी): Fluent standard Hindi with recognized terms (e.g. मौलिक अधिकार, सामान्य बुद्धिमत्ता, मात्रात्मक योग्यता).
   - Tamil (தமிழ்): Fluent Tamil with clear competitive exam terms (e.g. அடிப்படை உரிமைகள், பகுத்தறிவு, கணித திறன்).
6. Never fabricate dates, vacancies, or syllabus rules. Format responses in clean markdown.
`;

// Helper: Call Gemini API via models.generateContent for Gemini 3.8 Flash with safety timeout
async function callGeminiWithTimeout(client, prompt, timeoutMs = 25000) {
  const apiPromise = (async () => {
    // 1. Direct call to models.generateContent with gemini-3.8-flash
    if (client.models && typeof client.models.generateContent === 'function') {
      try {
        return await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });
      } catch (err) {
        // If 503 temporary spike occurs on 3.8-flash, try fallback models
        if (err.status === 503 || err.message?.includes('503')) {
          console.warn('[AI Service] 3.8-flash high demand, attempting fallback model...');
          for (const fallbackModel of ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']) {
            try {
              return await client.models.generateContent({
                model: fallbackModel,
                contents: prompt
              });
            } catch (fbErr) {
              // continue trying
            }
          }
        }
        throw err;
      }
    }

    // 2. Interactions API fallback
    if (client.interactions && typeof client.interactions.create === 'function') {
      const interaction = await client.interactions.create({
        model: 'gemini-3.8-flash',
        input: prompt
      });
      if (interaction && (interaction.output_text || interaction.text)) {
        return { text: interaction.output_text || interaction.text };
      }
    }

    throw new Error('No compatible GenAI call method found on client');
  })();

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API timeout')), timeoutMs)
  );

  return Promise.race([apiPromise, timeoutPromise]);
}

// 1. AI TUTOR CHAT / DOUBT SOLVING
async function askAITutor({ question, examCode, subject, topic, language = "English", conversationHistory = [] }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  const client = getGenAI();

  // Find exact exam context from verified syllabus database
  let examObj = null;
  let examContext = "";
  if (examCode) {
    examObj = examinations.find(e =>
      e.code?.toLowerCase() === examCode.toLowerCase() ||
      e.id?.toLowerCase() === examCode.toLowerCase() ||
      e.title?.toLowerCase().includes(examCode.toLowerCase())
    );

    if (examObj) {
      examContext = `
TARGET EXAMINATION: ${examObj.title} (${examObj.code})
CONDUCTING BODY: ${examObj.conductingBody}
SELECTION STAGES: ${JSON.stringify(examObj.selectionProcess || [])}
EXAMINATION PATTERN: ${JSON.stringify(examObj.examPattern || {})}
SYLLABUS MODULES: ${JSON.stringify(examObj.syllabus || [])}
ELIGIBILITY NORMS: ${JSON.stringify(examObj.eligibility || {})}
`;
    }
  }

  // If API Key is missing: return clear configuration instructions
  if (!apiKey) {
    const fallback = generateFallbackTutorResponse(question, examObj, examCode, subject, topic, language);
    return {
      answer: `> ⚠️ **Google Gemini API Key Not Configured in Backend**\n> Set \`GEMINI_API_KEY=your_key\` in the backend \`.env\` file to activate real-time Gemini 3.8 Flash live generative responses.\n\n---\n\n${fallback.answer}`,
      model: 'examverse-academic-engine (API Key Required)',
      apiKeyConfigured: false,
      isLiveAPI: false,
      language,
      examContext: examObj ? `${examObj.title} (${examObj.code})` : 'All India Competitive Examinations',
      timestamp: new Date().toISOString()
    };
  }

  const prompt = `
${TUTOR_SYSTEM_PROMPT}

EXAMINATION CONTEXT:
${examContext || "All-India Competitive Examination Framework"}

SUBJECT: ${subject || "General / Interdisciplinary"}
TOPIC: ${topic || "Core Concept / Doubt"}
RESPONSE LANGUAGE: ${language}

STUDENT'S INQUIRY:
"${question}"

Provide a pedagogical, step-by-step educational response in ${language}. Include:
1. Direct Core Answer & Conceptual Principle
2. Step-by-Step Breakdown / Mathematical Solution / Logic Framework
3. Target Examination Context (${examObj ? examObj.code : 'Competitive Exams'} pattern & negative marking alert)
4. Key Takeaways & Memory Trick / Formula Box
`;

  try {
    const response = await providerManager.generateWithFailover(prompt, {
      model: 'gemini-3.8-flash',
      timeoutMs: 25000
    });
    if (response && response.text) {
      return {
        answer: response.text,
        model: response.model,
        provider: response.provider,
        isLiveAPI: true,
        apiKeyConfigured: true,
        language,
        examContext: examObj ? `${examObj.title} (${examObj.code})` : examCode,
        timestamp: new Date().toISOString()
      };
    }
  } catch (apiErr) {
    console.warn(`[AI Service] Live providers bypassed (${apiErr.message}), activating syllabus-grounded academic engine.`);
  }

  // Resilient Fallback grounded in official exam syllabus
  const fallback = generateFallbackTutorResponse(question, examObj, examCode, subject, topic, language);
  return {
    ...fallback,
    provider: 'academic-fallback',
    apiKeyConfigured: true,
    isLiveAPI: false,
    examContext: examObj ? `${examObj.title} (${examObj.code})` : examCode
  };
}

// 2. AI STUDY PLANNER GENERATION
async function generateAIStudyPlan({ examCode, targetDays = 30, studyHoursPerDay = 4, preparationLevel = "Intermediate", weakSubjects = [], language = "English" }) {
  const client = getGenAI();
  const exam = examinations.find(e =>
    e.code?.toLowerCase() === examCode?.toLowerCase() ||
    e.id?.toLowerCase() === examCode?.toLowerCase() ||
    e.title?.toLowerCase().includes((examCode || "").toLowerCase())
  ) || examinations[0];

  const prompt = `
You are an expert Indian Examination Strategy Architect.
Generate a structured, realistic, day-by-day and week-by-week preparation plan for:
Examination: ${exam.title} (${exam.code})
Conducting Authority: ${exam.conductingBody}
Exam Pattern: ${JSON.stringify(exam.examPattern || {})}
Timeframe: ${targetDays} Days
Daily Study Commitment: ${studyHoursPerDay} Hours/Day
Current Level: ${preparationLevel}
Weak Areas Identified: ${weakSubjects.join(", ") || "General quantitative & speed accuracy"}
Language: ${language}

Structure the plan with:
1. Strategy Summary & Time Allocation (Concept Revision 50%, Practice 30%, Mock Tests & Analysis 20%)
2. Phase-wise Milestone Breakdown (Foundation Phase, Deep-Dive & PYQ Phase, Intensive Mock & Revision Phase)
3. Weekly Milestones (Weeks 1 to ${Math.ceil(targetDays / 7)})
4. Daily Routine Template (Slots for Morning Concepts, Afternoon Practice, Evening Revision)
5. Actionable tips to avoid negative marking and burnout.
Return in markdown with clear headings.
`;

  try {
    const response = await providerManager.generateWithFailover(prompt, {
      model: 'gemini-3.8-flash',
      timeoutMs: 25000
    });
    if (response && response.text) {
      return {
        examCode: exam.code,
        targetDays,
        studyPlanMarkdown: response.text,
        model: response.model,
        provider: response.provider,
        isLiveAPI: true,
        generatedAt: new Date().toISOString()
      };
    }
  } catch (apiErr) {
    console.warn("[AI Service] Study plan API bypassed, using structured template:", apiErr.message);
  }

  // Structured Fallback Planner
  const fallback = generateStructuredFallbackPlan(exam, targetDays, studyHoursPerDay, preparationLevel, weakSubjects);
  return {
    ...fallback,
    provider: 'academic-fallback',
    model: 'examverse-academic-engine-planner',
    isLiveAPI: false
  };
}

// 3. AI PERFORMANCE ANALYST
async function analyzePerformance({ testTitle, totalScore, maxMarks, accuracy, subjectScores, weakTopics = [], strongTopics = [], language = "English" }) {
  const prompt = `
You are an expert examination performance diagnostician.
Analyze the following test attempt by a student:
Test: ${testTitle}
Score: ${totalScore} / ${maxMarks} (${Math.round((totalScore / maxMarks) * 100)}%)
Accuracy Rate: ${accuracy}%
Subject Breakdown: ${JSON.stringify(subjectScores || {})}
Weak Topics Identified: ${weakTopics.join(", ")}
Strong Topics: ${strongTopics.join(", ")}
Language: ${language}

Provide a diagnostic assessment report in ${language}:
1. Performance Diagnosis (Assessment of speed vs accuracy balance)
2. Root-Cause Analysis for Repeated Errors in Weak Topics
3. Immediate 3-Day Corrective Action Plan (Specific drills and question counts)
4. Target Score Benchmark needed for clearing historical cutoffs.
`;

  try {
    const response = await providerManager.generateWithFailover(prompt, {
      model: 'gemini-3.8-flash',
      timeoutMs: 25000
    });
    if (response && response.text) {
      return {
        diagnosticReport: response.text,
        model: response.model,
        provider: response.provider,
        isLiveAPI: true,
        analyzedAt: new Date().toISOString()
      };
    }
  } catch (apiErr) {
    console.warn("[AI Service] Performance Analyst API error:", apiErr.message);
  }

  // Structured diagnostic report
  return {
    diagnosticReport: `### 🎯 Diagnostic Performance Summary\n\n- **Overall Score:** ${totalScore}/${maxMarks} (${Math.round((totalScore/maxMarks)*100)}%)\n- **Accuracy Rate:** ${accuracy}%\n\n#### Key Diagnostic Findings:\n1. **High-Proficiency Topics:** ${strongTopics.join(", ") || "Foundational concepts"}. You have solid accuracy here; maintain this with periodic 15-minute formula drills.\n2. **Critical Focus Areas:** ${weakTopics.join(", ") || "Advanced problem sets"}. Your error distribution shows marks loss due to conceptual hesitation and negative marking penalties.\n\n#### 📌 3-Day Targeted Remediation Plan:\n- **Day 1 (Theory Re-grounding):** Review standard reference notes for **${weakTopics[0] || "your lowest scoring area"}**.\n- **Day 2 (Untimed Accuracy Drill):** Solve 25 untimed questions targeting 100% precision.\n- **Day 3 (Timed Sectional Sprint):** Take a 15-minute timed sectional test with strict negative marking discipline.\n\n*Statutory Strategy Tip: Leaving an unsure question unattempted avoids the penalty deduction (e.g. -0.50 / -0.66 marks) that degrades net percentile!*`,
    provider: 'academic-fallback',
    model: 'examverse-academic-engine-analyst',
    isLiveAPI: false,
    analyzedAt: new Date().toISOString()
  };
}

// --- INTELLIGENT RULE-BASED FALLBACK ENGINE GROUNDED IN OFFICIAL SYLLABI ---
function generateFallbackTutorResponse(question, examObj, examCode, subject, topic, language) {
  const examTitle = examObj ? `${examObj.title} (${examObj.code})` : (examCode || 'All-India Competitive Examinations');
  const conductingBody = examObj ? examObj.conductingBody : 'Statutory Examination Board';

  // Specific handling for SSC CHSL
  const isCHSL = examCode && (examCode.toLowerCase().includes('chsl') || examCode.toLowerCase().includes('ssc-chsl'));
  let examSpecificNotes = "";
  if (isCHSL) {
    examSpecificNotes = `
- **SSC CHSL Tier 1 Pattern:** 100 Objective Questions (200 Total Marks), 60 Minutes.
  - English Language: 25 Questions (50 Marks)
  - General Intelligence / Reasoning: 25 Questions (50 Marks)
  - Quantitative Aptitude (Basic Arithmetic Skills): 25 Questions (50 Marks)
  - General Awareness: 25 Questions (50 Marks)
- **Negative Marking:** **0.50 marks deducted** per incorrect answer in Tier 1.
- **Tier 2:** Mathematical Abilities, Reasoning, English, General Awareness, Computer Knowledge Module, and Skill/Typing Test.
`;
  }

  // Multilingual Support
  if (language === "Telugu") {
    return {
      answer: `### 📚 EXAMVERSE AI అధ్యయన సహాయకుడు (Telugu)

**లక్ష్య పరీక్ష:** ${examTitle} | **నిర్వహణ సంస్థ:** ${conductingBody}
**మీ ప్రశ్న:** "${question}"

---

#### 1. ప్రాథమిక భావన & సూత్రం
ఈ అంశం **${examTitle}** సిలబస్‌లో చాలా ముఖ్యమైనది. పోటీ పరీక్షలలో అధిక స్కోర్ సాధించడానికి భావనలపై స్పష్టత మరియు సూత్రాలను వేగంగా అన్వయించడం చాలా కీలకం.

${isCHSL ? `#### 📌 SSC CHSL పరీక్షా విధానం:\n${examSpecificNotes}\n` : ''}

#### 2. దశలవారీ విశ్లేషణ & పరిష్కారం
1. **ప్రశ్నను జాగ్రత్తగా చదవండి:** ఇచ్చిన నిబంధనలను (उदा: 'NOT correct', 'సరైనది కానిది') గుర్తించండి.
2. **షార్ట్‌కట్ పద్ధతి:** సమయం ఆదా చేసుకోవడానికి ఆప్షన్ ఎలిమినేషన్ పద్ధతిని పాటించండి.
3. **నెగెటివ్ మార్కింగ్ జాగ్రత్త:** ఖచ్చితంగా తెలియని ప్రశ్నలను వదిలివేయడం ద్వారా నెగెటివ్ మార్కుల నష్టాన్ని నివారించవచ్చు.

#### 3. తదుపరి సిఫార్సు
ఈ టాపిక్ పై మీ Universal Dashboard లోని **Previous Year Papers (PYQ)** నుండి కనీసం 15 ప్రశ్నలను సాధన చేయండి!`,
      model: 'examverse-academic-engine-te',
      language,
      timestamp: new Date().toISOString()
    };
  }

  if (language === "Hindi") {
    return {
      answer: `### 📚 EXAMVERSE AI अध्ययन सहायक (Hindi)

**लक्षित परीक्षा:** ${examTitle} | **आयोजक निकाय:** ${conductingBody}
**आपका प्रश्न:** "${question}"

---

#### 1. मुख्य अवधारणा एवं सैद्धांतिक नियम
यह विषय **${examTitle}** की परीक्षा योजना में अत्यधिक महत्वपूर्ण है। किसी भी प्रतियोगी परीक्षा में उच्च अंक प्राप्त करने के लिए बुनियादी स्पष्टता (Conceptual Clarity) और तीव्र गणना अनिवार्य है।

${isCHSL ? `#### 📌 SSC CHSL परीक्षा पैटर्न व अंकन योजना:\n${examSpecificNotes}\n` : ''}

#### 2. चरणबद्ध समाधान एवं रणनीति
1. **दिए गए चरों की पहचान:** पहले प्रश्न में दी गई शर्तों व सीमाओं को समझें।
2. **वैकल्पिक उन्मूलन (Option Elimination):** अत्यधिक या असंगत विकल्पों को पहले ही बाहर करें।
3. **नकारात्मक अंकन (Negative Marking) से बचाव:** गलत उत्तर पर अंक कटौती से बचने के लिए पूर्ण विश्वास होने पर ही उत्तर चुनें।

#### 3. परीक्षा उपयोगी सुझाव
इस विषय पर अपने डैशबोर्ड के **Previous Year Papers (PYQ)** टैब से 15 अभ्यास प्रश्न हल करें!`,
      model: 'examverse-academic-engine-hi',
      language,
      timestamp: new Date().toISOString()
    };
  }

  if (language === "Tamil") {
    return {
      answer: `### 📚 EXAMVERSE AI ஆசிரியர் (Tamil)

**இலக்குத் தேர்வு:** ${examTitle} | **நடத்தும் அமைப்பு:** ${conductingBody}
**உங்கள் கேள்வி:** "${question}"

---

#### 1. அடிப்படை கோட்பாடு மற்றும் விதி
இந்த தலைப்பு **${examTitle}** பாடத்திட்டத்தில் மிக முக்கிய பங்கு வகிக்கிறது. போட்டித் தேர்வுகளில் வேகமும் துல்லியமும் வெற்றியைத் தீர்மானிக்கின்றன.

${isCHSL ? `#### 📌 SSC CHSL தேர்வு முறை:\n${examSpecificNotes}\n` : ''}

#### 2. படி படியான தீர்வு முறை
1. **வினாவை கவனமாக ஆராய்தல்:** கொடுக்கப்பட்டுள்ள நிபந்தனைகளை சரியாகப் புரிந்து கொள்ளவும்.
2. **நேர மேலாண்மை:** கணித மற்றும் பகுத்தறிவு வினாக்களில் குறுக்கு வழிகளை (Shortcuts) பயன்படுத்தவும்.
3. **எதிர்மறை மதிப்பெண் எச்சரிக்கை:** தவறான பதில்களுக்கு மதிப்பெண் குறைக்கப்படும் என்பதால் கவனமாக தேர்வு செய்யவும்.

#### 3. அடுத்தகட்ட பயிற்சி
உங்கள் பாடத்திட்டத்தின் கீழ் உள்ள **முந்தைய ஆண்டு வினாத்தாள்களை (PYQs)** தொடர்ந்து பயிற்சி செய்யுங்கள்!`,
      model: 'examverse-academic-engine-ta',
      language,
      timestamp: new Date().toISOString()
    };
  }

  // Default English
  return {
    answer: `### 📚 EXAMVERSE AI Academic Study Tutor

**Target Examination:** ${examTitle} | **Conducting Body:** ${conductingBody}
**Subject:** ${subject || 'General / Quantitative / Analytical'} | **Topic:** ${topic || 'Core Examination Concept'}

---

#### 1. Core Conceptual Breakdown
Mastery in this area is regularly tested across preliminary screening and mains assessment in **${examTitle}**.

${isCHSL ? `#### 📌 Official SSC CHSL Scheme & Pattern:\n${examSpecificNotes}\n` : ''}

- **Core Rule / Formula:** Ensure definitions match standard reference textbooks (NCERT Class 11-12, RS Aggarwal, Laxmikanth, or standard university publications).
- **Exam Application:** For quantitative and reasoning problems, write the governing relationship and identify known constraints before calculating.

#### 2. Step-by-Step Problem-Solving Framework
1. **Deconstruct the Premise:** Highlight mandatory constraints (e.g., non-zero values, chronological order, 'NOT correct' flags).
2. **Apply Systematic Derivation:**
   - Step 1: Formulate the governing equation or historical/statutory timeline.
   - Step 2: Eliminate mathematically or factually impossible options.
   - Step 3: Verify boundary conditions to prevent unforced errors.
3. **Speed Shortcut / Competitive Trick:** When working under the 60-minute limit (such as in SSC Tier 1), verify the unit digit or divisibility rules before carrying out complete long division.

#### 3. Common Pitfalls & Negative Marking Avoidance
- **Negative Marking Penalty:** Rushing through 50-50 guesses degrades net aggregate percentile.
- **Units & Dimensional Consistency:** In technical sections, always verify that units match SI standards before calculating.

#### 4. Recommended Daily Action
Practice 15 chapter-wise questions on this topic from the **Previous Year Papers (PYQ)** tab in your EXAMVERSE Student Dashboard!`,
    model: 'examverse-academic-engine-en',
    language,
    timestamp: new Date().toISOString()
  };
}

function generateStructuredFallbackPlan(exam, targetDays, studyHoursPerDay, preparationLevel, weakSubjects) {
  const weeks = Math.ceil(targetDays / 7);
  let weeklyMarkdown = "";

  for (let w = 1; w <= weeks; w++) {
    weeklyMarkdown += `
#### Week ${w}: ${w === 1 ? 'Foundational Concepts & Diagnostics' : w < weeks ? 'Core Topics Mastery & Sectional Drills' : 'Intensive Mock Tests & Rapid Revision'}
- **Focus Areas:** ${w === 1 && weakSubjects.length > 0 ? weakSubjects.join(', ') : 'High-weightage Modules ' + w + ' & Previous Year Questions'}
- **Daily Target:** ${studyHoursPerDay} hours (${Math.round(studyHoursPerDay * 0.5)} hrs concepts, ${Math.round(studyHoursPerDay * 0.3)} hrs problem solving, ${Math.round(studyHoursPerDay * 0.2)} hrs revision)
- **Weekend Assignment:** 1 Full Sectional Test + In-depth Error Log Analysis
`;
  }

  return {
    examCode: exam.code,
    targetDays,
    studyPlanMarkdown: `
### 📅 Personalized ${targetDays}-Day Strategic Preparation Plan for ${exam.title}

**Official Conducting Body:** ${exam.conductingBody}

**Parameters:**
- **Daily Study Time:** ${studyHoursPerDay} Hours/Day (Total: ${targetDays * studyHoursPerDay} Hours)
- **Current Student Level:** ${preparationLevel}
- **Priority Weak Areas:** ${weakSubjects.join(", ") || "General speed and accuracy"}

---

### ⏱️ Recommended Daily Schedule Template
- **Morning Block (40%):** Core Theoretical Concepts & High-Difficulty Topics (Mind is freshest)
- **Afternoon Block (35%):** Quantitative / Analytical Problem Solving (50+ questions sprint)
- **Evening Block (25%):** Flashcards, Formula Revision, Error Log Review & Current Affairs

---

### 🗓️ Phase-by-Phase Roadmap
${weeklyMarkdown}

---

### 💡 Golden Rules for High Scoring
1. **The 24-Hour Revision Loop:** Review whatever you study today for 15 minutes tomorrow morning.
2. **Mock Test Review is Mandatory:** Spending 2 hours analyzing mistakes in a mock test is 3x more valuable than taking another test without analysis.
3. **Never Skip Weak Subjects:** Dedicate the first 90 minutes of your study day to your weakest area before anything else.
`,
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  askAITutor,
  generateAIStudyPlan,
  analyzePerformance,
  generateFallbackTutorResponse,
  generateStructuredFallbackPlan,
  getProviderStatuses: () => providerManager.getProviderStatuses()
};
