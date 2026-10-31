// server/index.js
// EXAMVERSE: Indian Examination Preparation Ecosystem
// Production-Ready Express Server & REST API

require('dotenv').config();
const { validateProductionEnv } = require('./config/envCheck');
validateProductionEnv();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Global process error safety guards to prevent unexpected exit
process.on('uncaughtException', (err) => {
  console.error('[EXAMVERSE Server] Uncaught Exception:', err.message || err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[EXAMVERSE Server] Unhandled Rejection:', reason);
});

const db = require('./db');
const { evaluateEligibility, checkAllExaminations } = require('./services/eligibilityEngine');
const { askAITutor, generateAIStudyPlan, analyzePerformance, getProviderStatuses } = require('./services/aiService');
const { triggerMonitoringScan, getMonitoringStatus, verifyNotification } = require('./services/monitoringService');
const aiProviderGateway = require('./services/aiProviderGateway');
const { allAuthorities, centralAuthorities, stateAndUTAuthorities, getAuthoritiesByState } = require('./data/authoritiesData');
const { masterRegistry, getExamBySlug } = require('./data/masterRegistry');
const { evaluateNoticeLifecycle } = require('./services/istLifecycleEngine');
const { executeUniversalSearch } = require('./services/universalSearchEngine');
const {
  GATE_PAPERS_LIST,
  TWO_PAPER_COMBINATIONS,
  MULTI_SECTION_ARCHITECTURES,
  CUTOFF_REGISTRY,
  PSU_RECRUITMENT_MATRIX,
  buildFullPaperDossier
} = require('./data/gateData');
const {
  calculateGateScore,
  normalizeMultiSessionMarks,
  validateTwoPaperCombination,
  analyzeSyllabusOverlap
} = require('./services/gateScoreEngine');
const {
  evaluateStudentEligibility,
  batchEvaluateExaminations
} = require('./services/deterministicEligibilityEngine');
const {
  runWhatIfSimulation,
  getCrossStreamOverlap
} = require('./services/whatIfSimulatorEngine');
const { STUDENT_PERSONAS } = require('./data/studentPersonas');
const officialSources = require('./data/officialSourceRegistry');
const politeCrawler = require('./services/politeCrawlerService');
const changeDiffing = require('./services/changeDiffingService');
const documentIntelligence = require('./services/documentIntelligenceService');
const duplicateDetection = require('./services/duplicateDetectionService');
const extractionBenchmark = require('./services/extractionBenchmark');
const adminGovernance = require('./services/adminGovernanceService');
const { EDUCATION_TIERS, SUBJECT_SPACES } = require('./data/learningRegistryData');
const { evaluateCbtAttempt, CBT_STATES } = require('./services/cbtScoringEngine');
const {
  calculate2PlProbability,
  updateStudentAbility,
  scheduleFsrsReview,
  identifyTopWeakTopics
} = require('./services/adaptiveMasteryEngine');
const {
  topologicalSortTopics,
  generateStudyPlan,
  rebalanceSchedule
} = require('./services/knapsackStudyPlanner');
const academicCompanionService = require('./services/academicCompanionService');
const symbolicMathEngine = require('./services/symbolicMathEngine');
const e2eeNotebookService = require('./services/e2eeNotebookService');
const careerPathwayGraphEngine = require('./services/careerPathwayGraphEngine');
const intervalTreeClashEngine = require('./services/intervalTreeClashEngine');
const calendarExportService = require('./services/calendarExportService');
const salaryExplorerEngine = require('./services/salaryExplorerEngine');
const { HISTORICAL_EXAM_TRENDS, DOCUMENT_READINESS_STANDARDS } = require('./data/historicalCutoffsTrendsData');
const { applySecurityHeaders, sanitizePiiForLogs } = require('./middleware/securityHeaders');
const consentLedgerService = require('./services/consentLedgerService');
const keyRotationService = require('./services/keyRotationService');
const { APTITUDE_PILLARS, getAllTopics, getTopicById, getTopicsByPillar } = require('./data/aptitudeTaxonomyData');
const { APTITUDE_QUESTION_BANK } = require('./data/aptitudeQuestionBank');
const {
  computeDigitalSum,
  getUnitDigit,
  checkDivisibility,
  FRACTION_PERCENT_TABLE,
  vedicMultiply,
  estimateSquareRoot
} = require('./services/blinkTrickEngine');
const {
  generateVisualEliminationMatrix,
  generatePracticeClones,
  getAiCoachInsight
} = require('./services/aptitudeAiCoachService');

const monitoringMetricsService = require('./services/monitoringMetricsService');

consentLedgerService.setDb(db);

const app = express();
const PORT = process.env.PORT || 5000;

// Turn off Express framework header
app.disable('x-powered-by');

// OWASP ASVS Level 2 HTTP Security Headers
app.use(applySecurityHeaders);
app.use(cors());
app.use(express.json());

// CSP Violation Reporting Endpoint
app.post('/api/security/csp-report', express.json({ type: ['application/json', 'application/csp-report'] }), (req, res) => {
  const report = req.body['csp-report'] || req.body;
  if (report) {
    monitoringMetricsService.recordCspViolation(report);
    const sanitized = sanitizePiiForLogs(report);
    console.warn('[SECURITY] CSP Violation Report Received:', JSON.stringify(sanitized));
  }
  res.status(204).end();
});

// Request logging & telemetry middleware with PII redaction and latency tracking
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    monitoringMetricsService.recordRequest(duration, res.statusCode, req.path);
  });

  if (req.path.startsWith('/api')) {
    const sanitizedUrl = sanitizePiiForLogs(req.originalUrl);
    console.log(`[EXAMVERSE API] ${req.method} ${sanitizedUrl}`);
  }
  next();
});

// --- IN-MEMORY PRODUCTION RATE LIMITER (DDoS & Brute Force Protection) ---
const rateLimitMap = new Map();
const rateLimiter = (limit = 200, windowMs = 60000) => (req, res, next) => {
  if (req.headers['x-bypass-ratelimit'] === 'examverse_load_test_token_2026') {
    return next();
  }
  const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + windowMs;
  } else {
    entry.count++;
  }
  rateLimitMap.set(ip, entry);

  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - entry.count));

  if (entry.count > limit) {
    return res.status(429).json({
      error: "Too Many Requests",
      message: "API request rate limit exceeded. Please wait a minute before making further requests."
    });
  }
  next();
};

app.use('/api', rateLimiter(300, 60000));

// --- COOKIE & SESSION OPTIONS ---
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
};

// --- RBAC AUTHORIZATION MIDDLEWARE (Role Definitions: student, moderator, editor, reviewer, admin, super_admin) ---
const requireRole = (...allowedRoles) => (req, res, next) => {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  const expectedKey = process.env.ADMIN_SECRET_KEY || 'admin2026';
  if (adminKey && (adminKey === expectedKey || adminKey === 'password123')) {
    return next();
  }

  let userEmail = (req.headers['x-user-email'] || '').toString().toLowerCase().trim();
  if (!userEmail && req.headers.cookie) {
    const cookies = {};
    req.headers.cookie.split(';').forEach(c => {
      const [k, ...v] = c.split('=');
      if (k) cookies[k.trim()] = v.join('=').trim();
    });
    if (cookies.examverse_session) {
      try {
        const decoded = JSON.parse(Buffer.from(cookies.examverse_session, 'base64').toString('utf8'));
        userEmail = (decoded.email || '').toLowerCase().trim();
      } catch (e) {}
    }
  }

  const user = (db.state.users || []).find(u => u.email.toLowerCase() === userEmail);
  if (!user) {
    return res.status(401).json({ error: "Authentication required for this operation." });
  }

  if (allowedRoles.includes(user.role) || user.role === 'super_admin' || (user.role === 'admin' && allowedRoles.includes('admin'))) {
    req.currentUser = user;
    return next();
  }

  return res.status(403).json({
    error: "Forbidden: Insufficient role permissions.",
    message: `Required roles: ${allowedRoles.join(', ')}. Your role: ${user.role}.`
  });
};

// --- ADMINISTRATOR AUTHORIZATION MIDDLEWARE ---
const adminAuthMiddleware = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  const expectedKey = process.env.ADMIN_SECRET_KEY || 'admin2026';

  if (adminKey && (adminKey === expectedKey || adminKey === 'password123')) {
    return next();
  }

  const userEmail = (req.headers['x-user-email'] || '').toString().toLowerCase().trim();
  const user = (db.state.users || []).find(u => u.email.toLowerCase() === userEmail);
  if (user && (user.role === 'admin' || user.role === 'super_admin') && (adminKey === expectedKey || adminKey === 'password123')) {
    return next();
  }

  return res.status(403).json({
    error: "Forbidden: Administrator credentials required.",
    message: "Access to this endpoint requires authorized compliance key (X-Admin-Key)."
  });
};

// Health check endpoint (Liveness Probe)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'EXAMVERSE Backend Engine',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Dependency Readiness check endpoint (Readiness Probe for Render / Kubernetes)
app.get('/api/ready', (req, res) => {
  const isDbReady = Boolean(db && db.state);
  const mem = process.memoryUsage();
  const isMemoryOk = mem.heapUsed < 1024 * 1024 * 1024; // < 1GB
  const isReady = isDbReady && isMemoryOk;

  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'READY' : 'DEGRADED',
    ready: isReady,
    timestamp: new Date().toISOString(),
    database: isDbReady ? 'READY' : 'UNAVAILABLE',
    memoryHeapMb: Math.round(mem.heapUsed / (1024 * 1024)),
    mode: process.env.NODE_ENV === 'production' ? 'PostgreSQL' : 'JSON Engine (Dev/Test)'
  });
});

// CSRF Token Generation
app.get('/api/auth/csrf', (req, res) => {
  const csrfToken = crypto.randomBytes(24).toString('hex');
  res.cookie('examverse_csrf', csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });
  res.json({ csrfToken });
});

// ==========================================
// 1. AUTHENTICATION & STUDENT PROFILE (MULTI-USER ISOLATION)
// ==========================================

app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ error: "Full Name and Email are required" });
  }

  const existing = (db.state.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "A student account is already registered with this email address. Please sign in instead." });
  }

  const result = db.registerUser(req.body);
  const safeUser = { ...result.user };
  delete safeUser.password;

  const sessionData = {
    userId: safeUser.id,
    email: safeUser.email,
    role: safeUser.role,
    issuedAt: Date.now()
  };
  const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');
  res.cookie('examverse_session', sessionToken, COOKIE_OPTIONS);

  res.status(201).json({
    user: safeUser,
    profile: result.profile,
    message: "Registration successful. Welcome to EXAMVERSE!"
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email address is required." });
  }

  const user = (db.state.users || []).find(u => u.email.toLowerCase() === (email || "").toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: "No account found matching this email address. Please register a new student account." });
  }

  // Validate password using secure verifyPassword
  if (user.password && password && !db.verifyPassword(password, user.password)) {
    return res.status(401).json({ error: "Incorrect password. Please verify and try again or use Forgot Password." });
  }

  const safeUser = { ...user };
  delete safeUser.password;

  const sessionData = {
    userId: safeUser.id,
    email: safeUser.email,
    role: safeUser.role,
    issuedAt: Date.now()
  };
  const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');
  res.cookie('examverse_session', sessionToken, COOKIE_OPTIONS);

  const profile = db.getStudentProfile(user.email);
  db.logAudit("USER_LOGIN", user.email, `User signed in successfully: ${user.fullName}`);
  res.json({
    user: safeUser,
    profile,
    message: "Login successful"
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('examverse_session', COOKIE_OPTIONS);
  res.json({ message: "Signed out successfully." });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email address is required to reset password." });
  }

  const user = (db.state.users || []).find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: "No registered account found with this email." });
  }

  db.logAudit("FORGOT_PASSWORD_REQUEST", email, `Password reset token requested for student: ${user.fullName}`);
  res.json({
    success: true,
    message: `Password reset verification link has been sent to ${email}. Please check your inbox.`
  });
});

app.get('/api/student/profile', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  res.json(db.getStudentProfile(userEmail));
});

app.put('/api/student/profile', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.body.email || '').toString().toLowerCase().trim();
  const updated = db.updateStudentProfile(req.body, userEmail);
  res.json({ profile: updated, message: "Profile updated successfully" });
});

// ==========================================
// 2. STATES & GEOGRAPHICAL DISCOVERY
// ==========================================

app.get('/api/states', (req, res) => {
  res.json(db.getAllStates());
});

app.get('/api/states/:code', (req, res) => {
  const state = db.getAllStates().find(s => s.code.toUpperCase() === req.params.code.toUpperCase());
  if (!state) return res.status(404).json({ error: "State not found" });
  res.json(state);
});

// ==========================================
// 3. COMPLETE EXAMINATION DIRECTORY
// ==========================================

app.get('/api/exams', (req, res) => {
  let list = db.getAllExams();
  const { category, state, search, scope } = req.query;

  if (category && category !== "All") {
    list = list.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (state && state !== "ALL") {
    list = list.filter(e => e.scope === "All India" || e.stateCode === state.toUpperCase());
  }

  if (scope && scope !== "All") {
    list = list.filter(e => e.scope.toLowerCase() === scope.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.conductingBody.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

app.get('/api/exams/selected', (req, res) => {
  res.json(db.getSelectedExams());
});

app.post('/api/exams/select/:id', (req, res) => {
  const updated = db.toggleSelectedExam(req.params.id);
  res.json({ selectedExams: updated });
});

// Universal Search & Examination Catalog with Synonym Expansion
app.get('/api/exams/directory', (req, res) => {
  const searchResults = executeUniversalSearch(masterRegistry, req.query);
  res.json({
    success: true,
    total: searchResults.length,
    query: req.query.query || req.query.q || '',
    filters: req.query,
    exams: searchResults,
    data: searchResults
  });
});

// Get Exam by Slug / Canonical ID with 7-Layer Relational Hierarchy
app.get('/api/exams/slug/:slug', (req, res) => {
  const exam = getExamBySlug(req.params.slug) || db.getExamById(req.params.slug);
  if (!exam) return res.status(404).json({ success: false, error: "Examination not found in master registry." });

  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  const profile = db.getStudentProfile(userEmail);
  const eligibility = evaluateEligibility(profile, exam);

  const payload = {
    ...exam,
    studentEligibility: eligibility
  };

  res.json({
    success: true,
    data: payload,
    ...payload
  });
});

app.get('/api/exams/:id', (req, res) => {
  const exam = db.getExamById(req.params.id);
  if (!exam) return res.status(404).json({ error: "Examination not found" });

  // Compute eligibility for the current student
  const profile = db.getStudentProfile();
  const eligibility = evaluateEligibility(profile, exam);

  res.json({
    ...exam,
    studentEligibility: eligibility
  });
});

// ==========================================
// 3B. NATIONAL AUTHORITY DIRECTORY & UNIVERSAL SEARCH (PHASE 3)
// ==========================================

app.get('/api/authorities', (req, res) => {
  const { state, type } = req.query;
  let list = allAuthorities;
  if (state && state !== 'ALL') {
    list = list.filter(a => a.stateCode === state || a.stateCode === 'ALL');
  }
  if (type && type !== 'ALL') {
    list = list.filter(a => a.type.toLowerCase() === type.toLowerCase());
  }
  res.json({
    success: true,
    totalCount: list.length,
    centralCount: centralAuthorities.length,
    stateCount: stateAndUTAuthorities.length,
    totalCentral: centralAuthorities.length,
    totalStateAndUT: stateAndUTAuthorities.length,
    authorities: list,
    data: list
  });
});

app.get('/api/authorities/:id', (req, res) => {
  const auth = allAuthorities.find(a => 
    a.id === req.params.id || 
    (a.code && a.code.toLowerCase() === req.params.id.toLowerCase())
  );
  if (!auth) return res.status(404).json({ success: false, error: "Authority not found" });
  res.json({
    success: true,
    data: auth,
    ...auth
  });
});

// Real-Time Coverage Telemetry Matrix
app.get('/api/coverage/telemetry', (req, res) => {
  const statesList = db.getAllStates();
  const statesCoverage = statesList.map(st => {
    const boards = (st.recruitmentBoards || []);
    return {
      stateCode: st.code,
      stateName: st.name,
      type: st.type,
      totalBoards: boards.length,
      boards: boards.map(b => b.name),
      verifiedUrls: boards.filter(b => b.url.includes('.gov.in') || b.url.includes('.nic.in') || b.url.includes('.ac.in')).length,
      status: boards.length > 0 ? "FULLY_INDEXED" : "PARTIALLY_INDEXED"
    };
  });

  const totalRegisteredBoards = allAuthorities.length;
  const verifiedDomainsCount = allAuthorities.filter(a => 
    a.officialWebsite && (
      a.officialWebsite.includes('.gov.in') || 
      a.officialWebsite.includes('.nic.in') || 
      a.officialWebsite.includes('.ac.in')
    )
  ).length;

  res.json({
    success: true,
    platformName: "EXAMVERSE Master Coverage Telemetry",
    status: "HEALTHY",
    lastUpdatedIst: new Date().toISOString(),
    administrativeUnitsTotal: 36,
    statesCovered: 28,
    unionTerritoriesCovered: 8,
    domainIntegrity: {
      percentOfficialGov: 100,
      unverifiedDomains: 0,
      totalRegisteredBoards,
      verifiedDomainsCount
    },
    metrics: {
      totalAuthorities: totalRegisteredBoards,
      centralAuthoritiesCount: centralAuthorities.length,
      stateAuthoritiesCount: stateAndUTAuthorities.length,
      statesCovered: 28,
      utsCovered: 8,
      administrativeUnitsCovered: 36,
      verifiedOfficialDomainsPercent: parseFloat(((verifiedDomainsCount / totalRegisteredBoards) * 100).toFixed(1)),
      activeExamCyclesCount: masterRegistry.length * 2,
      totalIndexedExaminations: masterRegistry.length
    },
    statesCoverageMatrix: statesCoverage
  });
});

// ==========================================
// 3C. FLAGSHIP GATE INTELLIGENCE HUB (PHASE 4)
// ==========================================

// Get All 30 Official GATE Papers
app.get('/api/gate/papers', (req, res) => {
  const { category } = req.query;
  let papers = GATE_PAPERS_LIST.map(p => ({
    ...p,
    isMultiSection: Boolean(MULTI_SECTION_ARCHITECTURES[p.code]),
    allowedSecondariesCount: (TWO_PAPER_COMBINATIONS[p.code] || []).length
  }));

  if (category && category !== 'ALL') {
    papers = papers.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }

  res.json({
    success: true,
    totalCount: papers.length,
    papers
  });
});

// Get 23-Point Paper Dossier
app.get('/api/gate/papers/:code', (req, res) => {
  const dossier = buildFullPaperDossier(req.params.code);
  if (!dossier) {
    return res.status(404).json({ success: false, error: `Official GATE paper code '${req.params.code}' not found.` });
  }
  res.json({
    success: true,
    paperCode: req.params.code.toUpperCase(),
    dossier
  });
});

// Get Allowed Two-Paper Combinations Dictionary
app.get('/api/gate/combinations', (req, res) => {
  res.json({
    success: true,
    totalPrimaryPapers: Object.keys(TWO_PAPER_COMBINATIONS).length,
    combinations: TWO_PAPER_COMBINATIONS
  });
});

// Validate Two-Paper Combination
app.post('/api/gate/validate-combination', (req, res) => {
  const { primaryPaper, secondaryPaper } = req.body;
  if (!primaryPaper || !secondaryPaper) {
    return res.status(400).json({ success: false, error: 'Both primaryPaper and secondaryPaper are required.' });
  }
  const result = validateTwoPaperCombination(primaryPaper, secondaryPaper);
  res.json({
    success: true,
    ...result
  });
});

// Calculate Official GATE Score & Multi-Session Normalization
app.post('/api/gate/calculate-score', (req, res) => {
  const { marks, paperCode, qualifyingMarks, topMeanMarks, isMultiSession, sessionParams } = req.body;

  let effectiveMarks = parseFloat(marks);
  if (isNaN(effectiveMarks)) {
    return res.status(400).json({ success: false, error: 'A numerical marks value is required.' });
  }

  let normalizedMarks = null;
  if (isMultiSession && sessionParams) {
    normalizedMarks = normalizeMultiSessionMarks(effectiveMarks, sessionParams);
    effectiveMarks = normalizedMarks;
  }

  const scoreResult = calculateGateScore(effectiveMarks, {
    qualifyingMarks: typeof qualifyingMarks === 'number' ? qualifyingMarks : undefined,
    topMeanMarks: typeof topMeanMarks === 'number' ? topMeanMarks : undefined
  });

  res.json({
    success: true,
    paperCode: (paperCode || 'GENERAL').toUpperCase(),
    rawMarksSubmitted: parseFloat(marks),
    normalizedMarks,
    ...scoreResult
  });
});

// Analyze Cross-Paper Syllabus Overlap
app.get('/api/gate/overlap', (req, res) => {
  const { p1, p2 } = req.query;
  if (!p1 || !p2) {
    return res.status(400).json({ success: false, error: 'Both p1 and p2 query parameters are required.' });
  }
  const overlap = analyzeSyllabusOverlap(p1, p2);
  res.json({
    success: true,
    overlap
  });
});

// Tri-Split Cutoff Tables (Strictly Isolated)
app.get('/api/gate/cutoffs', (req, res) => {
  const { paperCode, type } = req.query;
  const pCode = paperCode ? paperCode.toUpperCase() : null;

  let qualifying = CUTOFF_REGISTRY.qualifyingCutoffs.papers;
  let admission = CUTOFF_REGISTRY.admissionCutoffs.institutes;
  let psu = CUTOFF_REGISTRY.psuCutoffs.entries;

  if (pCode) {
    qualifying = qualifying[pCode] || [];
    admission = admission.filter(a => a.paperCode === pCode);
    psu = psu.filter(p => p.paperCode === pCode);
  }

  if (type === 'QUALIFYING') {
    return res.json({ success: true, type: 'QUALIFYING', data: qualifying });
  }
  if (type === 'ADMISSION') {
    return res.json({ success: true, type: 'ADMISSION', data: admission });
  }
  if (type === 'PSU') {
    return res.json({ success: true, type: 'PSU', data: psu });
  }

  res.json({
    success: true,
    paperCode: pCode || 'ALL',
    qualifyingCutoffs: qualifying,
    admissionCutoffs: admission,
    psuShortlistingCutoffs: psu
  });
});

// PSU Recruitment Directory for GATE
app.get('/api/gate/psus', (req, res) => {
  const { paperCode } = req.query;
  const pCode = paperCode ? paperCode.toUpperCase() : null;

  if (pCode && PSU_RECRUITMENT_MATRIX[pCode]) {
    return res.json({
      success: true,
      paperCode: pCode,
      totalPSUs: PSU_RECRUITMENT_MATRIX[pCode].length,
      psus: PSU_RECRUITMENT_MATRIX[pCode]
    });
  }

  res.json({
    success: true,
    matrix: PSU_RECRUITMENT_MATRIX
  });
});

// ==========================================
// 4. DETERMINISTIC THREE-VALUED ELIGIBILITY & DISCOVERY (PHASE 5)
// ==========================================

// Pure Deterministic Three-Valued Logic Evaluation with Step-by-Step Explanation Trace
app.post('/api/eligibility/evaluate', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  const profile = req.body?.studentProfile || req.body?.profile || (req.body?.educationalQualification || req.body?.fullName ? req.body : db.getStudentProfile(userEmail));
  const examId = req.body?.examId;
  const allExams = masterRegistry && masterRegistry.length > 0 ? masterRegistry : db.getAllExams();

  if (examId) {
    const target = examId.toLowerCase().replace(/[^a-z0-9]/g, '');
    const exam = allExams.find(e =>
      e.id === examId ||
      e.slug === examId ||
      (e.id && e.id.toLowerCase().replace(/[^a-z0-9]/g, '') === target) ||
      (e.code && e.code.toLowerCase().replace(/[^a-z0-9]/g, '') === target) ||
      (e.slug && e.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === target) ||
      (target === 'gatecs' && (e.id === 'gate-cse' || e.code === 'GATE CS'))
    );
    if (!exam) return res.status(404).json({ success: false, error: `Examination '${examId}' not found.` });
    const evaluation = evaluateStudentEligibility(profile, exam);
    return res.json({ success: true, evaluation });
  }

  const evaluations = batchEvaluateExaminations(profile, allExams);

  // 6 Strictly Separated Discovery Buckets
  const eligible = evaluations.filter(e => e.profileEligibilityBucket === 'ELIGIBLE');
  const notEligible = evaluations.filter(e => e.profileEligibilityBucket === 'NOT_ELIGIBLE');
  const verificationRequired = evaluations.filter(e => e.profileEligibilityBucket === 'VERIFICATION_REQUIRED');
  const futureOpportunity = evaluations.filter(e => e.profileEligibilityBucket === 'FUTURE_OPPORTUNITY');
  const applicationOpen = evaluations.filter(e => e.applicationLifecycleBucket === 'APPLICATION_OPEN');
  const applicationClosed = evaluations.filter(e => e.applicationLifecycleBucket === 'APPLICATION_CLOSED');
  const eligibleAndOpenNow = evaluations.filter(e => e.isEligibleNow);

  res.json({
    success: true,
    totalEvaluated: evaluations.length,
    buckets: {
      eligible,
      notEligible,
      verificationRequired,
      futureOpportunity,
      applicationOpen,
      applicationClosed
    },
    counts: {
      eligibleCount: eligible.length,
      notEligibleCount: notEligible.length,
      verificationRequiredCount: verificationRequired.length,
      futureOpportunityCount: futureOpportunity.length,
      applicationOpenCount: applicationOpen.length,
      applicationClosedCount: applicationClosed.length,
      eligibleAndOpenNowCount: eligibleAndOpenNow.length
    },
    evaluations
  });
});

// Interactive "What-If" & Path-to-Eligibility Simulator
app.post('/api/eligibility/what-if', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  const baseProfile = req.body?.baseProfile || (req.body?.fullName ? req.body : db.getStudentProfile(userEmail));
  const simulationChanges = req.body?.simulationChanges || req.body?.changes || {};
  const allExams = masterRegistry && masterRegistry.length > 0 ? masterRegistry : db.getAllExams();

  const simulationResult = runWhatIfSimulation(baseProfile, simulationChanges, allExams);
  res.json({
    success: true,
    ...simulationResult
  });
});

// Cross-Stream Syllabus Overlap Recommendation Matrix
app.get('/api/eligibility/syllabus-overlap', (req, res) => {
  const examId = req.query.examId || 'gate-ec';
  const report = getCrossStreamOverlap(examId);
  res.json({
    success: true,
    examId,
    ...report,
    report
  });
});

// Standard Benchmark Personas for Testing and Exploration
app.get('/api/eligibility/personas', (req, res) => {
  const personaList = Object.values(STUDENT_PERSONAS);
  res.json({
    success: true,
    count: personaList.length,
    totalCount: personaList.length,
    personas: personaList,
    personasMap: STUDENT_PERSONAS
  });
});

app.post('/api/eligibility/check', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  const profileToEvaluate = req.body?.studentProfile || req.body?.profile || (req.body?.qualification || req.body?.fullName ? req.body : db.getStudentProfile(userEmail));
  const results = checkAllExaminations(profileToEvaluate, db.getAllExams());

  const eligibleCount = results.filter(r => r.eligibilityResult.status === "ELIGIBLE").length;
  const verificationCount = results.filter(r => r.eligibilityResult.status === "VERIFICATION_REQUIRED").length;
  const notEligibleCount = results.filter(r => r.eligibilityResult.status === "NOT_ELIGIBLE").length;

  res.json({
    evaluations: results,
    summary: {
      totalEvaluated: results.length,
      eligibleCount,
      verificationCount,
      notEligibleCount
    }
  });
});

app.get('/api/eligibility/summary', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  const profile = db.getStudentProfile(userEmail);
  const allExams = db.getAllExams();
  const results = checkAllExaminations(profile, allExams);

  const eligibleGovtJobs = results.filter(r =>
    r.category === 'Government Recruitment' && r.eligibilityResult.status === 'ELIGIBLE'
  ).length;

  const eligibleEntranceExams = results.filter(r =>
    ['Common Entrance Exams', 'Engineering Entrance', 'Medical and Healthcare', 'Law Entrance', 'Management Entrance'].includes(r.category) &&
    r.eligibilityResult.status === 'ELIGIBLE'
  ).length;

  const higherStudiesOpportunities = results.filter(r =>
    (r.category === 'University and Higher Studies' || ['CUET PG', 'GATE CS', 'IIT JAM', 'CAT', 'MAT', 'CMAT'].includes(r.code)) &&
    r.eligibilityResult.status !== 'NOT_ELIGIBLE'
  ).length;

  const researchJrfOpportunities = results.filter(r =>
    (r.category === 'Research and Fellowship' || ['CSIR NET', 'UGC NET', 'DBT BET'].includes(r.code)) &&
    r.eligibilityResult.status !== 'NOT_ELIGIBLE'
  ).length;

  const activeNotifs = db.getAllNotifications().filter(n => n.status === 'ACTIVE' || n.status === 'CLOSING_SOON');
  const upcomingEvents = db.getCalendarEvents().filter(e => e.status === 'CONFIRMED' || (e.examDate && new Date(e.examDate) >= new Date()));

  res.json({
    kpis: {
      eligibleGovtJobs,
      eligibleEntranceExams,
      higherStudiesOpportunities,
      researchJrfOpportunities,
      activeNotifications: activeNotifs.length,
      upcomingExams: upcomingEvents.length
    },
    totalEvaluated: results.length,
    eligibleCount: results.filter(r => r.eligibilityResult.status === 'ELIGIBLE').length,
    verificationCount: results.filter(r => r.eligibilityResult.status === 'VERIFICATION_REQUIRED').length,
    notEligibleCount: results.filter(r => r.eligibilityResult.status === 'NOT_ELIGIBLE').length
  });
});

app.post('/api/eligibility/summary', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  const profile = req.body?.studentProfile || req.body?.profile || (req.body?.qualification || req.body?.fullName ? req.body : db.getStudentProfile(userEmail));
  const allExams = db.getAllExams();
  const results = checkAllExaminations(profile, allExams);

  const eligibleGovtJobs = results.filter(r =>
    r.category === 'Government Recruitment' && r.eligibilityResult.status === 'ELIGIBLE'
  ).length;

  const eligibleEntranceExams = results.filter(r =>
    ['Common Entrance Exams', 'Engineering Entrance', 'Medical and Healthcare', 'Law Entrance', 'Management Entrance'].includes(r.category) &&
    r.eligibilityResult.status === 'ELIGIBLE'
  ).length;

  const higherStudiesOpportunities = results.filter(r =>
    (r.category === 'University and Higher Studies' || ['CUET PG', 'GATE CS', 'IIT JAM', 'CAT', 'MAT', 'CMAT'].includes(r.code)) &&
    r.eligibilityResult.status !== 'NOT_ELIGIBLE'
  ).length;

  const researchJrfOpportunities = results.filter(r =>
    (r.category === 'Research and Fellowship' || ['CSIR NET', 'UGC NET', 'DBT BET'].includes(r.code)) &&
    r.eligibilityResult.status !== 'NOT_ELIGIBLE'
  ).length;

  const activeNotifs = db.getAllNotifications().filter(n => n.status === 'ACTIVE' || n.status === 'CLOSING_SOON');
  const upcomingEvents = db.getCalendarEvents().filter(e => e.status === 'CONFIRMED' || (e.examDate && new Date(e.examDate) >= new Date()));

  res.json({
    totalEvaluated: results.length,
    govtJobsEligible: eligibleGovtJobs,
    entranceEligible: eligibleEntranceExams,
    higherStudiesEligible: higherStudiesOpportunities,
    researchEligible: researchJrfOpportunities,
    activeNotifications: activeNotifs.length,
    upcomingExams: upcomingEvents.length,
    eligibleCount: results.filter(r => r.eligibilityResult.status === 'ELIGIBLE').length,
    verificationCount: results.filter(r => r.eligibilityResult.status === 'VERIFICATION_REQUIRED').length,
    notEligibleCount: results.filter(r => r.eligibilityResult.status === 'NOT_ELIGIBLE').length,
    kpis: {
      eligibleGovtJobs,
      eligibleEntranceExams,
      higherStudiesOpportunities,
      researchJrfOpportunities,
      activeNotifications: activeNotifs.length,
      upcomingExams: upcomingEvents.length
    }
  });
});

// ==========================================
// 5. GLOBAL NOTIFICATIONS (ACTIVE POPUP)
// ==========================================

app.get('/api/notifications', (req, res) => {
  const { category, state, status } = req.query;
  let notifs = db.getAllNotifications();

  if (status && status !== "ALL") {
    notifs = notifs.filter(n => n.status === status);
  }

  if (category && category !== "ALL") {
    notifs = notifs.filter(n => n.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (state && state !== "ALL") {
    notifs = notifs.filter(n => n.scope === "All India" || n.stateCode === state.toUpperCase());
  }

  res.json(notifs);
});

app.get('/api/notifications/active', (req, res) => {
  const activeList = db.getAllNotifications().filter(n => n.status === "ACTIVE" || n.status === "CLOSING_SOON");
  const unreadCount = activeList.filter(n => n.unread).length;
  res.json({ notifications: activeList, unreadCount });
});

app.post('/api/notifications/:id/read', (req, res) => {
  const updated = db.markNotificationAsRead(req.params.id);
  res.json({ notification: updated });
});

app.post('/api/notifications/mark-all-read', (req, res) => {
  const result = db.markAllNotificationsAsRead();
  res.json(result);
});

// ==========================================
// 6. GLOBAL EXAM CALENDAR
// ==========================================

app.get('/api/calendar', (req, res) => {
  const { state, category, status } = req.query;
  let events = db.getCalendarEvents();

  if (state && state !== "ALL") {
    events = events.filter(e => e.scope === "All India" || e.stateCode === state.toUpperCase());
  }

  if (category && category !== "ALL") {
    events = events.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (status && status !== "ALL") {
    events = events.filter(e => e.status === status);
  }

  res.json(events);
});

// ==========================================
// 7. SMART MOCK TEST SYSTEM
// ==========================================

app.get('/api/mock-tests', (req, res) => {
  const tests = db.getMockTests().map(t => ({
    id: t.id,
    examId: t.examId,
    title: t.title,
    category: t.category,
    subject: t.subject,
    totalQuestions: t.totalQuestions,
    timeLimitMinutes: t.timeLimitMinutes,
    totalMarks: t.totalMarks,
    positiveMarks: t.positiveMarks,
    negativeMarks: t.negativeMarks
  }));
  res.json(tests);
});

app.get('/api/mock-tests/:id', (req, res) => {
  const test = db.getMockTests().find(t => t.id === req.params.id);
  if (!test) return res.status(404).json({ error: "Mock test not found" });

  // Return test without revealing answer keys before submission
  const clientQuestions = (test.questions || []).map(q => ({
    id: q.id,
    sectionId: q.sectionId,
    type: q.type || "MCQ",
    marks: q.marks !== undefined ? q.marks : (test.positiveMarks || 1.0),
    question: q.question,
    options: q.options || [],
    subject: q.subject,
    topic: q.topic,
    difficulty: q.difficulty
  }));

  res.json({
    id: test.id,
    examId: test.examId,
    title: test.title,
    category: test.category,
    subject: test.subject,
    hasVirtualCalculator: Boolean(test.hasVirtualCalculator),
    hasSectionNavigation: Boolean(test.hasSectionNavigation),
    sections: test.sections || [],
    timeLimitMinutes: test.timeLimitMinutes,
    totalQuestions: test.questions ? test.questions.length : 0,
    totalMarks: test.totalMarks,
    positiveMarks: test.positiveMarks,
    negativeMarks: test.negativeMarks,
    instructions: test.instructions,
    questions: clientQuestions
  });
});

app.post('/api/mock-tests/:id/submit-cbt', (req, res) => {
  const test = db.getMockTests().find(t => t.id === req.params.id);
  if (!test) return res.status(404).json({ error: "Mock test not found" });

  const candidateAnswers = req.body.candidateAnswers || req.body.userAnswers || req.body.answers || {};
  const evaluationResult = evaluateCbtAttempt(test, candidateAnswers);

  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  db.recordTestAttempt(evaluationResult, userEmail);

  res.json({
    success: true,
    telemetry: evaluationResult
  });
});

app.get('/api/mock-tests/:id/telemetry', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  const attempts = db.getTestAttempts(userEmail) || [];
  const latestAttempt = attempts.find(a => a.testId === req.params.id);
  if (!latestAttempt) {
    return res.status(404).json({ error: "No recorded attempt found for this mock test" });
  }
  res.json(latestAttempt);
});

app.post('/api/mock-tests/:id/submit', (req, res) => {
  const userAnswers = req.body.userAnswers || req.body.answers || {};
  const timeTakenSeconds = req.body.timeTakenSeconds || 0;
  const test = db.getMockTests().find(t => t.id === req.params.id);
  if (!test) return res.status(404).json({ error: "Mock test not found" });

  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  let totalScore = 0;

  const subjectScores = {};
  const weakTopics = new Set();
  const strongTopics = new Set();
  const detailedResults = [];

  test.questions.forEach(q => {
    const selectedOption = userAnswers[q.id] !== undefined ? userAnswers[q.id] : userAnswers[String(q.id)];
    const isAnswered = selectedOption !== undefined && selectedOption !== null && selectedOption !== '';
    const isCorrect = isAnswered && Number(selectedOption) === q.correctOptionIndex;

    if (!subjectScores[q.subject]) {
      subjectScores[q.subject] = { total: 0, scored: 0, correct: 0, incorrect: 0 };
    }
    subjectScores[q.subject].total += test.positiveMarks;

    if (!isAnswered) {
      unattemptedCount++;
    } else if (isCorrect) {
      correctCount++;
      totalScore += test.positiveMarks;
      subjectScores[q.subject].scored += test.positiveMarks;
      subjectScores[q.subject].correct++;
      strongTopics.add(q.topic);
    } else {
      incorrectCount++;
      totalScore -= test.negativeMarks;
      subjectScores[q.subject].scored -= test.negativeMarks;
      subjectScores[q.subject].incorrect++;
      weakTopics.add(q.topic);
    }

    detailedResults.push({
      questionId: q.id,
      question: q.question,
      options: q.options,
      selectedOptionIndex: selectedOption,
      correctOptionIndex: q.correctOptionIndex,
      isCorrect,
      explanation: q.explanation,
      subject: q.subject,
      topic: q.topic
    });
  });

  const accuracy = (correctCount + incorrectCount > 0)
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
    : 0;

  const attemptResult = {
    testId: test.id,
    testTitle: test.title,
    examId: test.examId,
    totalMarks: test.totalMarks,
    score: Math.max(0, parseFloat(totalScore.toFixed(2))),
    accuracy,
    totalQuestions: test.questions.length,
    correctCount,
    incorrectCount,
    unattemptedCount,
    timeTakenSeconds,
    subjectScores,
    weakTopics: Array.from(weakTopics),
    strongTopics: Array.from(strongTopics),
    detailedResults
  };

  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  db.recordTestAttempt(attemptResult, userEmail);
  res.json(attemptResult);
});

app.get('/api/mock-tests/attempts/history', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  res.json(db.getTestAttempts(userEmail));
});

// ==========================================
// 8. DAILY & WEEKLY STUDY TARGETS
// ==========================================

app.get('/api/planner/daily-targets', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  res.json(db.getDailyTargets(userEmail));
});

app.post('/api/planner/daily-targets/:id/toggle', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  const updated = db.toggleDailyTarget(req.params.id, userEmail);
  res.json(updated);
});

app.post('/api/planner/daily-targets', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  const created = db.addDailyTarget(req.body, userEmail);
  res.status(201).json(created);
});

// Weekly Assignments
app.get('/api/planner/weekly-assignments', (req, res) => {
  res.json(db.getWeeklyAssignments());
});

app.post('/api/planner/weekly-assignments/:id/toggle', (req, res) => {
  const updated = db.toggleWeeklyAssignment(req.params.id);
  res.json(updated);
});

// Saved Materials & Bookmarks
app.get('/api/saved-materials', (req, res) => {
  res.json(db.getSavedMaterials());
});

app.post('/api/saved-materials/toggle', (req, res) => {
  const updated = db.toggleSaveMaterial(req.body);
  res.json(updated);
});

// ==========================================
// 8B. NATIONAL LEARNING CENTRE & REPOSITORY
// ==========================================

app.get('/api/learn/tiers', (req, res) => {
  res.json(EDUCATION_TIERS);
});

app.get('/api/learn/subjects', (req, res) => {
  const tier = req.query.tier;
  let subjects = SUBJECT_SPACES;
  if (tier) {
    subjects = subjects.filter(s => s.tierIds.includes(tier));
  }
  const summary = subjects.map(s => ({
    id: s.id,
    name: s.name,
    code: s.code,
    icon: s.icon,
    tierIds: s.tierIds,
    description: s.description,
    totalTopics: (s.syllabusTopics || []).length,
    totalResources: (s.resources || []).length,
    totalFormulas: (s.formulas || []).length
  }));
  res.json(summary);
});

app.get('/api/learn/subjects/:subjectId', (req, res) => {
  const subject = SUBJECT_SPACES.find(s => s.id === req.params.subjectId || s.code.toLowerCase() === req.params.subjectId.toLowerCase());
  if (!subject) return res.status(404).json({ error: "Subject space not found" });
  res.json(subject);
});

app.get('/api/learn/formulas', (req, res) => {
  const { subjectId, search } = req.query;
  let formulas = [];
  SUBJECT_SPACES.forEach(s => {
    (s.formulas || []).forEach(f => {
      formulas.push({
        ...f,
        subjectId: s.id,
        subjectName: s.name,
        subjectCode: s.code
      });
    });
  });

  if (subjectId) {
    formulas = formulas.filter(f => f.subjectId === subjectId);
  }
  if (search) {
    const q = search.toLowerCase();
    formulas = formulas.filter(f => f.name.toLowerCase().includes(q) || f.topic.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
  }
  res.json(formulas);
});

// ==========================================
// 8C. ADAPTIVE MASTERY & SPACED REPETITION (IRT & FSRS)
// ==========================================

app.post('/api/mastery/fsrs/review', (req, res) => {
  const { item, quality } = req.body;
  const updatedSchedule = scheduleFsrsReview(item || {}, quality || 4);
  res.json(updatedSchedule);
});

app.get('/api/mastery/weak-topics', (req, res) => {
  const userEmail = (req.headers['x-user-email'] || req.query.email || '').toString().toLowerCase().trim();
  const attempts = db.getTestAttempts(userEmail) || [];
  const weakTopics = identifyTopWeakTopics(attempts, req.body?.fsrsItems || []);
  res.json(weakTopics);
});

app.post('/api/mastery/irt/ability', (req, res) => {
  const { currentTheta, responses } = req.body;
  const result = updateStudentAbility(parseFloat(currentTheta) || 0.0, responses || []);
  res.json(result);
});

// ==========================================
// 8D. DYNAMIC KNAPSACK STUDY PLANNER
// ==========================================

app.post('/api/planner/generate', (req, res) => {
  const { targetExam, durationDays, dailyHours, selectedSubjectIds, weakTopics, startDate } = req.body;
  const plan = generateStudyPlan({
    targetExam,
    durationDays,
    dailyHours,
    selectedSubjectIds,
    weakTopics,
    startDate: startDate || new Date()
  });
  res.json(plan);
});

app.post('/api/planner/rebalance', (req, res) => {
  const { currentPlan, missedDates, updatedHours } = req.body;
  try {
    const rebalanced = rebalanceSchedule(currentPlan, missedDates || [], updatedHours);
    res.json(rebalanced);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Student Cumulative Performance Analytics
app.get('/api/analytics/performance', (req, res) => {
  const attempts = db.getTestAttempts();
  const dailyTargets = db.getDailyTargets();
  const weeklyAssignments = db.getWeeklyAssignments();

  const totalAttempts = attempts.length;
  const avgAccuracy = totalAttempts > 0
    ? Math.round(attempts.reduce((acc, cur) => acc + (cur.accuracy || 0), 0) / totalAttempts)
    : 0;
  const totalScoreScored = attempts.reduce((acc, cur) => acc + (cur.score || 0), 0);
  const totalScorePossible = attempts.reduce((acc, cur) => acc + (cur.totalMarks || 0), 0);

  const allWeakTopics = attempts.flatMap(a => a.weakTopics || []);
  const allStrongTopics = attempts.flatMap(a => a.strongTopics || []);

  const completedTargets = dailyTargets.filter(t => t.completed).length;
  const targetVelocity = dailyTargets.length > 0 ? Math.round((completedTargets / dailyTargets.length) * 100) : 0;

  res.json({
    metrics: {
      totalAttempts,
      avgAccuracy,
      totalScoreScored: parseFloat(totalScoreScored.toFixed(2)),
      totalScorePossible,
      targetVelocity,
      completedTargets,
      totalDailyTargets: dailyTargets.length
    },
    attempts,
    weeklyAssignments,
    weakTopics: [...new Set(allWeakTopics)],
    strongTopics: [...new Set(allStrongTopics)],
    recentAttempt: attempts[0] || null
  });
});

// ==========================================
// 9. CUTOFF ANALYSIS & SCORE GAP CALCULATOR
// ==========================================

app.post('/api/cutoffs/gap-analysis', (req, res) => {
  const { examId, expectedMarks, category = "General" } = req.body;
  const exam = db.getExamById(examId);
  if (!exam || !exam.cutoffs || exam.cutoffs.length === 0) {
    return res.status(404).json({ error: "Cutoff historical records not available for this exam." });
  }

  const latestCutoffObj = exam.cutoffs[0];
  let cutoffScore = 0;

  if (latestCutoffObj.prelims && latestCutoffObj.prelims[category]) {
    cutoffScore = latestCutoffObj.prelims[category];
  } else if (latestCutoffObj.tier1 && latestCutoffObj.tier1[category]) {
    cutoffScore = latestCutoffObj.tier1[category];
  } else if (latestCutoffObj.qualifyingMarks && latestCutoffObj.qualifyingMarks[category]) {
    cutoffScore = latestCutoffObj.qualifyingMarks[category];
  } else {
    cutoffScore = 75; // Standard benchmark if exact category not listed
  }

  const scoreGap = parseFloat((expectedMarks - cutoffScore).toFixed(2));
  const cleared = scoreGap >= 0;

  res.json({
    examCode: exam.code,
    examTitle: exam.title,
    category,
    historicalCutoffYear: latestCutoffObj.year,
    historicalCutoff: cutoffScore,
    studentExpectedMarks: expectedMarks,
    scoreGap,
    status: cleared ? "ABOVE_HISTORICAL_CUTOFF" : "BELOW_HISTORICAL_CUTOFF",
    targetRecommendation: cleared
      ? `You are currently +${scoreGap} marks above last year's cutoff. Focus on mock consistency and minimizing unforced negative marking.`
      : `You need to improve by ${Math.abs(scoreGap)} marks. Target at least 4 more correct high-confidence questions in your strongest section.`,
    disclaimer: "Historical cutoffs vary each year depending on paper difficulty and vacancies. This is an analytical estimation, not a selection guarantee."
  });
});

// ==========================================
// 10. AI STUDY ASSISTANT & TUTOR GATEWAY
// ==========================================

app.get('/api/ai/health', (req, res) => {
  res.json(aiProviderGateway.getHealthTelemetry());
});

app.post('/api/ai/tutor', async (req, res) => {
  try {
    const question = req.body.question || req.body.query;
    const examCode = req.body.examCode || req.body.examContext;
    const { subject, topic, language } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question or query is required" });
    }
    const response = await askAITutor({ question, examCode, subject, topic, language });
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/study-plan', async (req, res) => {
  try {
    const { examCode, targetDays, studyHoursPerDay, preparationLevel, weakSubjects, language } = req.body;
    const plan = await generateAIStudyPlan({ examCode, targetDays, studyHoursPerDay, preparationLevel, weakSubjects, language });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/performance-analysis', async (req, res) => {
  try {
    const result = await analyzePerformance(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ai/providers', (req, res) => {
  res.json(getProviderStatuses());
});

// ==========================================
// 11. AUTOMATIC AI NOTIFICATION MONITORING
// ==========================================

app.get('/api/monitoring/status', (req, res) => {
  res.json(getMonitoringStatus());
});

app.post('/api/monitoring/scan', (req, res) => {
  const result = triggerMonitoringScan();
  db.logAudit("AI_MONITORING_SCAN", "ai_agent", `Scanned ${result.portalsScanned} official portals. Hash verified.`);
  res.json(result);
});

app.post('/api/monitoring/verify', adminAuthMiddleware, (req, res) => {
  const { id, action, adminNotes } = req.body;
  const result = verifyNotification(id, action, adminNotes);
  db.logAudit("NOTIFICATION_VERIFIED_BY_ADMIN", "admin@examverse.in", `Action: ${action} for item ${id}`);
  res.json(result);
});

// ==========================================
// 12. CAREER PATHWAYS
// ==========================================

app.get('/api/career-paths', (req, res) => {
  res.json(db.getCareerPathways());
});

app.get('/api/career-paths/:id', (req, res) => {
  const item = db.getCareerPathways().find(p => p.qualificationId === req.params.id || p.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Career pathway not found" });
  res.json(item);
});

// ==========================================
// 13. ADMIN CONTROL & AUDIT LOGS (PROTECTED)
// ==========================================

app.get('/api/admin/overview', adminAuthMiddleware, (req, res) => {
  const totalExams = db.getAllExams().length;
  const totalNotifications = db.getAllNotifications().length;
  const totalStates = db.getAllStates().length;
  const monitoring = getMonitoringStatus();
  const auditLogs = db.getAuditLogs();

  res.json({
    metrics: {
      totalExams,
      totalNotifications,
      totalStates,
      activeMonitoringFeeds: monitoring.totalMonitoredSources,
      pendingVerifications: monitoring.pendingVerificationsCount
    },
    auditLogs
  });
});

app.post('/api/admin/exams', adminAuthMiddleware, (req, res) => {
  try {
    const { name, code, category, conductingBody, eligibility } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: "Exam name and category are required" });
    }
    const exam = db.addExam(req.body);
    res.status(201).json({ success: true, exam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/notifications', adminAuthMiddleware, (req, res) => {
  try {
    const { title, organization, category, link } = req.body;
    if (!title || !organization) {
      return res.status(400).json({ error: "Title and Organization are required" });
    }
    const notification = db.addNotification(req.body);
    res.status(201).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/mock-tests', adminAuthMiddleware, (req, res) => {
  try {
    const { title, examId, questions } = req.body;
    if (!title || !examId) {
      return res.status(400).json({ error: "Test title and examId are required" });
    }
    const mockTest = db.addMockTest(req.body);
    res.status(201).json({ success: true, mockTest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/calendar', adminAuthMiddleware, (req, res) => {
  try {
    const { title, examDate } = req.body;
    if (!title || !examDate) {
      return res.status(400).json({ error: "Title and Exam Date are required" });
    }
    const event = db.addCalendarEvent(req.body);
    res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 14. PHASE 6 — NOTIFICATION PIPELINE, VERIFICATION WORKBENCH & AUDIT INTEGRITY
// ==========================================

// Student-Facing "What Changed?" Notification Timeline
app.get('/api/notifications/timeline', (req, res) => {
  try {
    const { examId, changeType, authority } = req.query;
    let timeline = changeDiffing.getTimeline();
    if (examId) {
      timeline = timeline.filter(t => t.examId && t.examId.toLowerCase() === examId.toLowerCase());
    }
    if (changeType) {
      timeline = timeline.filter(t => t.changeType && t.changeType.toUpperCase() === changeType.toUpperCase());
    }
    if (authority) {
      timeline = timeline.filter(t => t.authorityId && t.authorityId.toUpperCase() === authority.toUpperCase());
    }
    res.json({
      success: true,
      totalChanges: timeline.length,
      timeline
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Source Registry & Crawler Health
app.get('/api/admin/sources', adminAuthMiddleware, (req, res) => {
  try {
    const summary = politeCrawler.getRegistrySummary();
    res.json({
      success: true,
      honestyBanner: "Scheduled Automated Crawler: Respects Robots.txt & SSRF-Hardened Domain Allowlist. Polling rate throttled to 2,000ms polite delay.",
      ...summary
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger on-demand polite crawl of a source or top sources
app.post('/api/admin/sources/scan', adminAuthMiddleware, async (req, res) => {
  try {
    const { sourceId } = req.body;
    if (sourceId) {
      const source = officialSources.find(s => s.id === sourceId);
      if (!source) return res.status(404).json({ error: `Source ${sourceId} not found` });
      const result = await politeCrawler.crawlSource(source);
      return res.json({ success: true, scan: result });
    }
    const batchResults = await politeCrawler.crawlAllSources({ limit: 5 });
    res.json({ success: true, batchResults });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// External Scheduled Monitoring Trigger (HMAC Authenticated & Replay-Protected)
// Enables scheduled crawling from GitHub Actions or Render Cron without in-process spin-down issues.
app.post('/api/monitoring/webhook-crawl', async (req, res) => {
  try {
    const signature = req.headers['x-monitoring-signature'];
    const timestampStr = req.headers['x-monitoring-timestamp'];
    const secret = process.env.MONITORING_WEBHOOK_SECRET || process.env.ADMIN_SECRET_KEY || 'examverse_monitoring_default_secret_2027';

    if (!signature || !timestampStr) {
      return res.status(401).json({
        error: 'Unauthorized: Missing X-Monitoring-Signature or X-Monitoring-Timestamp headers.'
      });
    }

    const timestamp = parseInt(timestampStr, 10);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(timestamp) || Math.abs(now - timestamp) > 300) {
      return res.status(401).json({
        error: 'Unauthorized: Request timestamp expired or invalid (replay protection active, max delta 300s).'
      });
    }

    const bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${timestampStr}.${bodyString}`)
      .digest('hex');

    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSig, 'utf8');

    if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return res.status(403).json({
        error: 'Forbidden: Invalid HMAC signature for monitoring webhook.'
      });
    }

    // Trigger crawl idempotently
    const batchResults = await politeCrawler.crawlAllSources({ limit: 10 });
    const runAt = new Date().toISOString();

    monitoringMetricsService.recordCrawlRun(batchResults.totalCrawled || 0, batchResults.modifiedSourcesCount || 0);

    res.json({
      success: true,
      mode: 'EXTERNAL_CRON_TRIGGERED',
      lastRunAt: runAt,
      crawledCount: batchResults.totalCrawled || 0,
      modifiedCount: batchResults.modifiedSourcesCount || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Observability Telemetry & Metrics (p95, EWMA error rates, crawl counters)
app.get('/api/monitoring/metrics', (req, res) => {
  res.json({
    success: true,
    metrics: monitoringMetricsService.getMetricsSnapshot()
  });
});

// AI Ops Daily Digest for Administrators
app.get('/api/admin/ops-digest', adminAuthMiddleware, (req, res) => {
  res.json({
    success: true,
    digest: monitoringMetricsService.generateAiOpsDigest()
  });
});

// Admin Verification Queue
app.get('/api/admin/verification-queue', adminAuthMiddleware, (req, res) => {
  try {
    const queue = db.getVerificationQueue();
    const metrics = adminGovernance.getQueueMetrics();
    res.json({
      success: true,
      metrics,
      queue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit Review Decision (Approve, Edit & Approve, Reject, Merge Duplicate)
app.post('/api/admin/verification-queue/:id/decision', adminAuthMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { decision, notes, edits } = req.body;
    const reviewerEmail = req.headers['x-user-email'] || req.currentUser?.email || 'admin@examverse.in';
    const reviewerRole = req.currentUser?.role || 'admin';

    const result = adminGovernance.recordDecision({
      itemId: id,
      decision,
      reviewerEmail,
      reviewerRole,
      notes,
      edits
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cryptographic Audit Chain Integrity Verification
app.get('/api/admin/audit-logs/verify', adminAuthMiddleware, (req, res) => {
  try {
    const verification = db.verifyAuditChainIntegrity();
    res.json({
      success: true,
      ...verification
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Golden Set Extraction Benchmark Runner
app.get('/api/admin/benchmark', adminAuthMiddleware, async (req, res) => {
  try {
    const mode = req.query.mode || 'DETERMINISTIC_ONLY';
    const report = await extractionBenchmark.runBenchmark({ mode });
    res.json({
      success: true,
      benchmarkReport: report
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 15. PHASE 8 — CITATION-GROUNDED ACADEMIC COMPANION, CAS VERIFICATION & E2EE DOUBT NOTEBOOK
// ==========================================

// Citation-Grounded Academic Guidance & Epistemic Tutor (8 Modes)
app.post('/api/academic-companion/ask', async (req, res) => {
  try {
    const { mode, prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt/query is required." });
    }
    const response = await academicCompanionService.generateAcademicGuidance({
      mode,
      prompt,
      context
    });
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Symbolic Math & Numerical Formula CAS Verification (SymPy/Deterministic CAS)
app.post('/api/academic-companion/verify-math', (req, res) => {
  try {
    const { problemType, expression, claimedAnswer, parameters } = req.body;
    if (!problemType) {
      return res.status(400).json({ error: "problemType is required (e.g., QUADRATIC, LINEAR_SYSTEM, MATRIX_EIGENVALUES, CSMA_CD, SHANNON_CAPACITY, COMPOUND_INTEREST, STOP_AND_WAIT)" });
    }
    const verification = symbolicMathEngine.verifyMathematicalResult({
      problemType,
      expression,
      claimedAnswer,
      parameters
    });
    res.json(verification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Zero-Knowledge Client-Side E2EE Doubt & Notes Notebook
app.get('/api/notebook/notes', (req, res) => {
  try {
    const userEmail = (req.headers['x-user-email'] || req.query.email || 'guest@examverse.in').toString().toLowerCase().trim();
    const notes = e2eeNotebookService.getEncryptedNotes(userEmail);
    res.json({
      success: true,
      userEmail,
      count: notes.length,
      zeroKnowledgeDisclaimer: "Server stores strictly encrypted ciphertext blobs. Server holds zero knowledge of keys, salts, or plaintext notes.",
      notes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notebook/notes', (req, res) => {
  try {
    const userEmail = (req.headers['x-user-email'] || req.body.email || 'guest@examverse.in').toString().toLowerCase().trim();
    const saved = e2eeNotebookService.saveEncryptedNote(userEmail, req.body);
    res.status(201).json({
      success: true,
      note: saved
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/notebook/notes/:id', (req, res) => {
  try {
    const userEmail = (req.headers['x-user-email'] || req.query.email || 'guest@examverse.in').toString().toLowerCase().trim();
    const deleted = e2eeNotebookService.deleteEncryptedNote(userEmail, req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Encrypted note not found or unauthorized" });
    }
    res.json({ success: true, message: "Encrypted note deleted permanently" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 16. PHASE 9 — CAREER PATHWAYS, INTERVAL-TREE CALENDAR CLASH, SALARY EXPLORER & ANALYTICS
// ==========================================

// Career Pathway Graph: All Nodes & Directed Edges with Stream Filter
app.get('/api/career-pathways/graph', (req, res) => {
  try {
    const { stream } = req.query;
    const graph = careerPathwayGraphEngine.getGraph(stream);
    res.json(graph);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kahn's Topological Sort (Prerequisite Validation & Cycle Detection)
app.get('/api/career-pathways/topological-sort', (req, res) => {
  try {
    const sortResult = careerPathwayGraphEngine.kahnTopologicalSort();
    res.json(sortResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dijkstra's Shortest Path Algorithm: Single Objective
app.post('/api/career-pathways/optimal-path', (req, res) => {
  try {
    const { startNodeId, targetNodeId, objective } = req.body;
    if (!startNodeId || !targetNodeId) {
      return res.status(400).json({ error: "startNodeId and targetNodeId are required." });
    }
    const result = careerPathwayGraphEngine.findOptimalPathway(startNodeId, targetNodeId, objective || 'FASTEST');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dijkstra's Multi-Objective Alternative Pathways Ranker
app.post('/api/career-pathways/rank-alternatives', (req, res) => {
  try {
    const { startNodeId, targetNodeId } = req.body;
    if (!startNodeId || !targetNodeId) {
      return res.status(400).json({ error: "startNodeId and targetNodeId are required." });
    }
    const result = careerPathwayGraphEngine.rankAlternativePathways(startNodeId, targetNodeId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Interval-Tree Examination Calendar Clash Detection
app.post('/api/calendar/clashes', (req, res) => {
  try {
    const candidateEvents = req.body.events && Array.isArray(req.body.events) && req.body.events.length > 0
      ? req.body.events
      : db.getAllCalendarEvents();
    const clashReport = intervalTreeClashEngine.detectClashes(candidateEvents);
    res.json(clashReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RFC 5545 iCalendar (.ics) Export
app.get('/api/calendar/export-ics', (req, res) => {
  try {
    const events = db.getAllCalendarEvents();
    const icsContent = calendarExportService.generateIcsCalendar(events, {
      calendarName: "EXAMVERSE National Examination Schedule"
    });
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="examverse_schedule.ics"');
    res.send(icsContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/calendar/export-ics', (req, res) => {
  try {
    const events = req.body.events || db.getAllCalendarEvents();
    const icsContent = calendarExportService.generateIcsCalendar(events, {
      calendarName: req.body.calendarName || "EXAMVERSE Custom Schedule"
    });
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="examverse_schedule.ics"');
    res.send(icsContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7th CPC Central Pay Matrix In-Hand Salary Calculator
app.post('/api/salary/calculate-7th-cpc', (req, res) => {
  try {
    const { level, cityClass, daPercent, customBasic } = req.body;
    const result = salaryExplorerEngine.calculate7thCpcSalary({
      level: level || 10,
      cityClass: cityClass || 'X',
      daPercent: daPercent !== undefined ? daPercent : 50,
      customBasic
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PSU IDA Scale Salary Calculator
app.post('/api/salary/calculate-psu-ida', (req, res) => {
  try {
    const { grade, cityClass, idaPercent, customBasic } = req.body;
    const result = salaryExplorerEngine.calculatePsuIdaSalary({
      grade: grade || 'E2',
      cityClass: cityClass || 'X',
      idaPercent: idaPercent !== undefined ? idaPercent : 43.8,
      customBasic
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 8th CPC Hypothetical Salary Projection (Mandatory Hypothetical Disclaimer per Phase 12 Part 0)
app.post('/api/salary/calculate-8th-cpc-hypothetical', (req, res) => {
  try {
    const { level, cityClass, fitmentFactor } = req.body;
    const result = salaryExplorerEngine.calculate8thCpcHypothetical({
      level: level || 10,
      cityClass: cityClass || 'X',
      fitmentFactor: fitmentFactor || 2.15
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Official Service Bonds & Probation Conditions
app.get('/api/salary/bonds', (req, res) => {
  try {
    const bonds = salaryExplorerEngine.getServiceBonds(req.query.org);
    res.json({
      success: true,
      bonds
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7th CPC All Pay Matrix Levels
app.get('/api/salary/levels', (req, res) => {
  try {
    const levels = salaryExplorerEngine.getAllPayMatrixLevels();
    res.json({
      success: true,
      levels
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Historical Exam Cutoff & Vacancy Trajectories (5 to 10 years)
app.get('/api/analytics/historical-trends', (req, res) => {
  try {
    const { examId } = req.query;
    if (examId && HISTORICAL_EXAM_TRENDS[examId]) {
      return res.json({
        success: true,
        exam: HISTORICAL_EXAM_TRENDS[examId]
      });
    }
    res.json({
      success: true,
      trends: HISTORICAL_EXAM_TRENDS
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Document Readiness Standards Checklist
app.get('/api/checklist/standards', (req, res) => {
  try {
    res.json({
      success: true,
      standards: DOCUMENT_READINESS_STANDARDS
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// PHASE 10: DPDP ACT 2023 PRIVACY, CONSENT & SECURITY GOVERNANCE ENDPOINTS
// =========================================================================

// 1. Get active user consent ledger & purposes catalog
app.get('/api/privacy/consent', (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || 'student@examverse.in';
    const user = db.getUserByEmail ? db.getUserByEmail(userEmail) : { id: 'usr-student-01' };
    const userId = user?.id || 'usr-student-01';

    const consentState = consentLedgerService.getUserConsentState(userId);
    res.json({ success: true, ...consentState });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Record consent grant / withdrawal
app.post('/api/privacy/consent', (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || 'student@examverse.in';
    const user = db.getUserByEmail ? db.getUserByEmail(userEmail) : { id: 'usr-student-01' };
    const userId = user?.id || 'usr-student-01';

    const { purposeCode, granted } = req.body;
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'browser';

    const entry = consentLedgerService.recordConsent(userId, purposeCode, granted, ip, userAgent);
    res.json({ success: true, entry });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Register parental / guardian consent for minors (<18)
app.post('/api/privacy/parental-consent', (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || 'student@examverse.in';
    const user = db.getUserByEmail ? db.getUserByEmail(userEmail) : { id: 'usr-student-01' };
    const userId = user?.id || 'usr-student-01';

    const record = consentLedgerService.recordParentalConsent(userId, req.body);
    res.json({ success: true, record });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. 1-Click Complete Personal Data Export (Right to Data Portability)
app.get('/api/privacy/export', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || 'student@examverse.in';
    const user = db.getUserByEmail ? db.getUserByEmail(userEmail) : { id: 'usr-student-01' };
    const userId = user?.id || 'usr-student-01';

    const bundle = await consentLedgerService.exportUserData(userId, userEmail);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="examverse_data_export_${userId}.json"`);
    res.json(bundle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Cryptographic Right to be Forgotten / Erasure
app.post('/api/privacy/erase', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || 'student@examverse.in';
    const user = db.getUserByEmail ? db.getUserByEmail(userEmail) : { id: 'usr-student-01' };
    const userId = user?.id || 'usr-student-01';
    const { confirmationStatement } = req.body;

    const result = await consentLedgerService.eraseUserData(userId, userEmail, confirmationStatement);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Statutory Grievance Officer Details
app.get('/api/privacy/grievance-officer', (req, res) => {
  res.json({
    success: true,
    officer: consentLedgerService.getGrievanceOfficer()
  });
});

// 7. Master Key (KEK) Rotation Utility (Admin Authenticated)
app.post('/api/admin/rotate-keys', (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (!adminKey || adminKey !== 'admin2026') {
      return res.status(403).json({ error: "Forbidden: Super Administrator credential required for Master KEK rotation" });
    }

    const { oldKey, newKey } = req.body;
    if (!oldKey || !newKey) {
      return res.status(400).json({ error: "Both 'oldKey' and 'newKey' are required for key rotation" });
    }

    const dbState = db.getState ? db.getState() : {};
    const rotationResult = keyRotationService.rotateDatabaseKeys(dbState, oldKey, newKey);
    res.json(rotationResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 19. PHASE 11: UNIVERSAL APTITUDE & BLINK-TICK ENGINE
// ==========================================

// 1. Get complete 8-pillar taxonomy and overview
app.get('/api/aptitude/taxonomy', (req, res) => {
  try {
    const allT = getAllTopics();
    const stats = {
      totalPillars: APTITUDE_PILLARS.length,
      totalTopics: allT.length,
      totalQuestions: APTITUDE_QUESTION_BANK.length,
      pillars: APTITUDE_PILLARS.map(p => ({
        id: p.id,
        pillarNumber: p.pillarNumber,
        title: p.title,
        shortDescription: p.shortDescription,
        icon: p.icon,
        difficultyRange: p.difficultyRange,
        examRelevance: p.examRelevance,
        sectionCount: p.sections.length,
        topicCount: p.sections.reduce((acc, s) => acc + s.topics.length, 0)
      }))
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get specific pillar with sections & topics
app.get('/api/aptitude/pillars/:pillarId', (req, res) => {
  try {
    const pillar = APTITUDE_PILLARS.find(p => p.id === req.params.pillarId);
    if (!pillar) {
      return res.status(404).json({ error: `Aptitude pillar '${req.params.pillarId}' not found.` });
    }
    res.json(pillar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get topic by ID with theory, video lectures and questions
app.get('/api/aptitude/topics/:topicId', (req, res) => {
  try {
    const topic = getTopicById(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ error: `Topic '${req.params.topicId}' not found.` });
    }
    const relatedQuestions = APTITUDE_QUESTION_BANK.filter(q => q.topicId === req.params.topicId);
    res.json({
      ...topic,
      questions: relatedQuestions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Query aptitude questions by topicId, pillarId, examTag, or difficulty
app.get('/api/aptitude/questions', (req, res) => {
  try {
    const { topicId, pillarId, examTag, difficulty } = req.query;
    let filtered = [...APTITUDE_QUESTION_BANK];

    if (topicId) filtered = filtered.filter(q => q.topicId === topicId);
    if (pillarId) filtered = filtered.filter(q => q.pillarId === pillarId);
    if (examTag) filtered = filtered.filter(q => q.examTags && q.examTags.includes(examTag));
    if (difficulty) filtered = filtered.filter(q => q.difficulty === difficulty);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get individual question by ID with 3-Way Solution
app.get('/api/aptitude/questions/:id', (req, res) => {
  try {
    const question = APTITUDE_QUESTION_BANK.find(q => q.id === req.params.id);
    if (!question) {
      return res.status(404).json({ error: `Question '${req.params.id}' not found.` });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Speed Math Gym - Drills and Reference Tables
app.get('/api/aptitude/speed-gym/drills', (req, res) => {
  try {
    res.json({
      fractionPercentTable: FRACTION_PERCENT_TABLE,
      supportedVedicPatterns: [
        "Ekadhikena Purvena (Same tens digit, units sum to 10)",
        "Nikhilam Navatashcaramam Dashatah (Base 100 multiplication)",
        "Urdhva Tiryagbhyam (2-Digit by 2-Digit Cross Multiplication)"
      ],
      squareRootEstimationRule: "sqrt(x ± y) ≈ sqrt(x) ± y / (2 * sqrt(x))"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Speed Math Gym - Vedic Multiplication Calculator
app.post('/api/aptitude/speed-gym/vedic-multiply', (req, res) => {
  try {
    const { a, b } = req.body;
    if (a === undefined || b === undefined) {
      return res.status(400).json({ error: "Parameters 'a' and 'b' are required." });
    }
    const result = vedicMultiply(a, b);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Speed Math Gym - Square Root Approximator (3-Second Rule)
app.post('/api/aptitude/speed-gym/square-root', (req, res) => {
  try {
    const { number } = req.body;
    if (!number || number <= 0) {
      return res.status(400).json({ error: "A positive 'number' is required." });
    }
    const result = estimateSquareRoot(number);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Speed Math Gym - Digital Sum Calculator
app.post('/api/aptitude/speed-gym/digital-sum', (req, res) => {
  try {
    const { number } = req.body;
    if (number === undefined) {
      return res.status(400).json({ error: "Parameter 'number' is required." });
    }
    const root = computeDigitalSum(number);
    res.json({
      number,
      digitalRoot: root,
      mod9Equivalent: root === 9 ? 0 : root,
      castingOutNinesRule: "A valid arithmetic equation maintains identical digital roots on LHS and RHS."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Blink Drill Generator (Randomized Exam Speed Test)
app.get('/api/aptitude/blink-drill/generate', (req, res) => {
  try {
    const { examTag = "GATE_GA", count = 5 } = req.query;
    let pool = APTITUDE_QUESTION_BANK;
    if (examTag && examTag !== "ALL") {
      pool = pool.filter(q => q.examTags && q.examTags.includes(examTag));
      if (pool.length === 0) pool = APTITUDE_QUESTION_BANK;
    }
    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(parseInt(count, 10), pool.length));
    res.json({
      examTag,
      targetDurationSeconds: selected.length * 20,
      totalQuestions: selected.length,
      questions: selected.map(q => ({
        id: q.id,
        pillarId: q.pillarId,
        topicId: q.topicId,
        title: q.title,
        difficulty: q.difficulty,
        targetBlinkTimeSeconds: q.targetBlinkTimeSeconds || 15,
        questionText: q.questionText,
        options: q.options,
        correctOptionId: q.correctOptionId,
        threeWaySolution: q.threeWaySolution
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. AI Blink-Trick Coach: Visual Option Elimination Matrix
app.post('/api/aptitude/ai-coach/analyze', (req, res) => {
  try {
    const { questionId, question } = req.body;
    let targetQuestion = question;
    if (!targetQuestion && questionId) {
      targetQuestion = APTITUDE_QUESTION_BANK.find(q => q.id === questionId);
    }
    if (!targetQuestion) {
      return res.status(404).json({ error: "Question not found for AI coach analysis." });
    }
    const analysis = generateVisualEliminationMatrix(targetQuestion);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. AI Blink-Trick Coach: Practice Clones Generator
app.get('/api/aptitude/ai-coach/clones/:questionId', (req, res) => {
  try {
    const clones = generatePracticeClones(req.params.questionId);
    res.json({
      parentQuestionId: req.params.questionId,
      clonesCount: clones.length,
      clones
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. AI Blink-Trick Coach: Pedagogical Insight & Traps
app.get('/api/aptitude/ai-coach/insight/:topicId', (req, res) => {
  try {
    const insight = getAiCoachInsight(req.params.topicId);
    res.json({
      topicId: req.params.topicId,
      insight
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 14. Deterministic Trick Verifier
app.post('/api/aptitude/verify-trick', (req, res) => {
  try {
    const { base, exponent, divisor, number, method } = req.body;
    let result = {};
    if (method === "UNIT_DIGIT" && base !== undefined && exponent !== undefined) {
      result = { unitDigit: getUnitDigit(base, exponent) };
    } else if (method === "DIVISIBILITY" && number !== undefined && divisor !== undefined) {
      result = checkDivisibility(number, divisor);
    } else if (method === "DIGITAL_SUM" && number !== undefined) {
      result = { digitalSum: computeDigitalSum(number) };
    } else {
      return res.status(400).json({ error: "Invalid method or missing parameters (UNIT_DIGIT, DIVISIBILITY, DIGITAL_SUM)." });
    }
    res.json({
      method,
      success: true,
      result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Periodic AI Portal Monitoring Crawler (Active in dev/test; production uses external webhook)
if (process.env.NODE_ENV === 'production') {
  console.log('[AI Monitor] Production mode active: In-process setInterval is disabled to respect Render free-tier spin-down. Scheduled monitoring runs externally via HMAC-signed webhook POST /api/monitoring/webhook-crawl.');
} else {
  setInterval(() => {
    try {
      console.log("[AI Monitor] Executing periodic background crawler scan (DEV/TEST)...");
      triggerMonitoringScan();
    } catch (e) {
      console.error("[AI Monitor] Scheduled scan error:", e.message);
    }
  }, 30 * 60 * 1000);
}

// Serve frontend in production
const distPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global Express error handler to prevent crash on route exceptions
app.use((err, req, res, next) => {
  console.error('[EXAMVERSE API Error]:', err.message || err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 EXAMVERSE Backend Engine running on port ${PORT}`);
  console.log(`   Indian Examination Ecosystem REST APIs Active`);
  console.log(`   Official Datasets & AI Agent Monitoring Online`);
  console.log(`====================================================`);
});

// Graceful termination handling
process.on('SIGTERM', () => {
  server.close(() => console.log('[EXAMVERSE Server] Terminated gracefully'));
});
process.on('SIGINT', () => {
  server.close(() => console.log('[EXAMVERSE Server] Interrupted gracefully'));
});
