// client/src/services/api.ts
// Centralized API Service for EXAMVERSE communicating with the Express backend

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function fetchJSON(url: string, options?: RequestInit) {
  const currentEmail = localStorage.getItem('examverse_user_email') || 'student@examverse.in';
  const adminKey = sessionStorage.getItem('examverse_admin_key') || (sessionStorage.getItem('examverse_admin_session') === 'true' ? 'admin2026' : '');
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': currentEmail,
      ...(adminKey ? { 'X-Admin-Key': adminKey } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMsg = `API Error ${res.status}: ${res.statusText}`;
    try {
      const errData = await res.json();
      if (errData.error) errorMsg = errData.error;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Auth & Profile
  login: (email: string, password?: string) =>
    fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (payload: any) =>
    fetchJSON('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  forgotPassword: (email: string) =>
    fetchJSON('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  getProfile: (email?: string) => {
    const q = email ? `?email=${encodeURIComponent(email)}` : '';
    return fetchJSON(`/student/profile${q}`);
  },
  updateProfile: (profile: any) =>
    fetchJSON('/student/profile', { method: 'PUT', body: JSON.stringify(profile) }),

  // States
  getStates: () => fetchJSON('/states'),
  getStateByCode: (code: string) => fetchJSON(`/states/${code}`),

  // Examinations
  getExams: (params?: { category?: string; state?: string; search?: string; scope?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.state) q.append('state', params.state);
    if (params?.search) q.append('search', params.search);
    if (params?.scope) q.append('scope', params.scope);
    return fetchJSON(`/exams?${q.toString()}`);
  },

  getExamById: (id: string) => fetchJSON(`/exams/${id}`),
  getSelectedExams: () => fetchJSON('/exams/selected'),
  toggleSelectedExam: (id: string) => fetchJSON(`/exams/select/${id}`, { method: 'POST' }),

  // Eligibility Engine
  checkEligibility: (profileData?: any) =>
    fetchJSON('/eligibility/check', { method: 'POST', body: JSON.stringify(profileData) }),
  getEligibilitySummary: (profileData?: any) =>
    fetchJSON('/eligibility/summary', { method: 'POST', body: JSON.stringify(profileData || {}) }),

  // Notifications
  getNotifications: (params?: { category?: string; state?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.state) q.append('state', params.state);
    if (params?.status) q.append('status', params.status);
    return fetchJSON(`/notifications?${q.toString()}`);
  },

  getActiveNotifications: () => fetchJSON('/notifications/active'),
  markNotificationRead: (id: string) => fetchJSON(`/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () => fetchJSON('/notifications/mark-all-read', { method: 'POST' }),

  // Calendar
  getCalendar: (params?: { state?: string; category?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.state) q.append('state', params.state);
    if (params?.category) q.append('category', params.category);
    if (params?.status) q.append('status', params.status);
    return fetchJSON(`/calendar?${q.toString()}`);
  },

  // Mock Tests
  getMockTests: () => fetchJSON('/mock-tests'),
  getMockTestById: (id: string) => fetchJSON(`/mock-tests/${id}`),
  submitMockTest: (id: string, payload: { userAnswers: { [key: number]: number }; timeTakenSeconds: number }) =>
    fetchJSON(`/mock-tests/${id}/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  getAttemptHistory: () => fetchJSON('/mock-tests/attempts/history'),

  // Daily & Weekly Targets
  getDailyTargets: () => fetchJSON('/planner/daily-targets'),
  toggleDailyTarget: (id: string) => fetchJSON(`/planner/daily-targets/${id}/toggle`, { method: 'POST' }),
  addDailyTarget: (target: { text: string; subject?: string; estimatedMinutes?: number }) =>
    fetchJSON('/planner/daily-targets', { method: 'POST', body: JSON.stringify(target) }),
  getWeeklyAssignments: () => fetchJSON('/planner/weekly-assignments'),
  toggleWeeklyAssignment: (id: string) => fetchJSON(`/planner/weekly-assignments/${id}/toggle`, { method: 'POST' }),

  // Saved Materials & Bookmarks
  getSavedMaterials: () => fetchJSON('/saved-materials'),
  toggleSaveMaterial: (item: any) => fetchJSON('/saved-materials/toggle', { method: 'POST', body: JSON.stringify(item) }),

  // Performance Analytics
  getPerformanceAnalytics: () => fetchJSON('/analytics/performance'),

  // Cutoff Gap Analysis
  calculateCutoffGap: (examId: string, expectedMarks: number, category?: string) =>
    fetchJSON('/cutoffs/gap-analysis', { method: 'POST', body: JSON.stringify({ examId, expectedMarks, category }) }),

  // AI Assistant Endpoints
  askAITutor: (payload: { question: string; examCode?: string; subject?: string; topic?: string; language?: string }) =>
    fetchJSON('/ai/tutor', { method: 'POST', body: JSON.stringify(payload) }),

  generateAIStudyPlan: (payload: { examCode: string; targetDays: number; studyHoursPerDay: number; preparationLevel: string; weakSubjects: string[]; language?: string }) =>
    fetchJSON('/ai/study-plan', { method: 'POST', body: JSON.stringify(payload) }),

  analyzeAIPerformance: (payload: any) =>
    fetchJSON('/ai/performance-analysis', { method: 'POST', body: JSON.stringify(payload) }),

  // Monitoring
  getMonitoringStatus: () => fetchJSON('/monitoring/status'),
  triggerMonitoringScan: () => fetchJSON('/monitoring/scan', { method: 'POST' }),
  verifyNotification: (id: string, action: 'APPROVE' | 'REJECT', adminNotes?: string) =>
    fetchJSON('/monitoring/verify', { method: 'POST', body: JSON.stringify({ id, action, adminNotes }) }),

  // Career Pathways
  getCareerPaths: () => fetchJSON('/career-paths'),

  // Admin
  getAdminOverview: () => fetchJSON('/admin/overview'),
  createAdminExam: (examData: any) =>
    fetchJSON('/admin/exams', { method: 'POST', body: JSON.stringify(examData) }),
  createAdminNotification: (notifData: any) =>
    fetchJSON('/admin/notifications', { method: 'POST', body: JSON.stringify(notifData) }),
  createAdminMockTest: (testData: any) =>
    fetchJSON('/admin/mock-tests', { method: 'POST', body: JSON.stringify(testData) }),

  // Phase 3 National Authority, Directory, Search & Telemetry
  getAuthorities: (params?: { state?: string; type?: string }) => {
    const sp = new URLSearchParams();
    if (params?.state) sp.append('state', params.state);
    if (params?.type) sp.append('type', params.type);
    const qs = sp.toString() ? `?${sp.toString()}` : '';
    return fetchJSON(`/authorities${qs}`);
  },

  getExamDirectory: (params?: any) => {
    const sp = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') sp.append(k, String(v));
      });
    }
    const qs = sp.toString() ? `?${sp.toString()}` : '';
    return fetchJSON(`/exams/directory${qs}`);
  },

  getExamBySlug: (slug: string) => fetchJSON(`/exams/slug/${encodeURIComponent(slug)}`),

  getCoverageTelemetry: () => fetchJSON('/coverage/telemetry'),

  getAIHealth: () => fetchJSON('/ai/health'),

  // Phase 4 Flagship GATE Intelligence
  getGatePapers: (category?: string) => {
    const qs = category && category !== 'ALL' ? `?category=${encodeURIComponent(category)}` : '';
    return fetchJSON(`/gate/papers${qs}`);
  },

  getGatePaperDossier: (code: string) => fetchJSON(`/gate/papers/${encodeURIComponent(code)}`),

  getGateCombinations: () => fetchJSON('/gate/combinations'),

  validateGateCombination: (primaryPaper: string, secondaryPaper: string) =>
    fetchJSON('/gate/validate-combination', {
      method: 'POST',
      body: JSON.stringify({ primaryPaper, secondaryPaper })
    }),

  calculateGateScore: (payload: {
    marks: number;
    paperCode?: string;
    qualifyingMarks?: number;
    topMeanMarks?: number;
    isMultiSession?: boolean;
    sessionParams?: any;
  }) => fetchJSON('/gate/calculate-score', { method: 'POST', body: JSON.stringify(payload) }),

  getGateOverlap: (p1: string, p2: string) =>
    fetchJSON(`/gate/overlap?p1=${encodeURIComponent(p1)}&p2=${encodeURIComponent(p2)}`),

  getGateCutoffs: (params?: { paperCode?: string; type?: string }) => {
    const sp = new URLSearchParams();
    if (params?.paperCode) sp.append('paperCode', params.paperCode);
    if (params?.type) sp.append('type', params.type);
    const qs = sp.toString() ? `?${sp.toString()}` : '';
    return fetchJSON(`/gate/cutoffs${qs}`);
  },

  getGatePSUs: (paperCode?: string) => {
    const qs = paperCode ? `?paperCode=${encodeURIComponent(paperCode)}` : '';
    return fetchJSON(`/gate/psus${qs}`);
  },

  // Phase 5 Deterministic Three-Valued Eligibility & What-If Simulator
  evaluateEligibilityDetailed: (profile?: any, examId?: string) =>
    fetchJSON('/eligibility/evaluate', {
      method: 'POST',
      body: JSON.stringify({ studentProfile: profile, examId })
    }),

  simulateWhatIf: (baseProfile: any, simulationChanges: any) =>
    fetchJSON('/eligibility/what-if', {
      method: 'POST',
      body: JSON.stringify({ baseProfile, simulationChanges })
    }),

  getSyllabusOverlapMatrix: (examId?: string) => {
    const qs = examId ? `?examId=${encodeURIComponent(examId)}` : '';
    return fetchJSON(`/eligibility/syllabus-overlap${qs}`);
  },

  getBenchmarkPersonas: () => fetchJSON('/eligibility/personas'),

  // Phase 6 Polite Notification Pipeline & Admin Workbench
  getNotificationTimeline: (params?: { examId?: string; changeType?: string; authority?: string }) => {
    const sp = new URLSearchParams();
    if (params?.examId) sp.append('examId', params.examId);
    if (params?.changeType) sp.append('changeType', params.changeType);
    if (params?.authority) sp.append('authority', params.authority);
    const qs = sp.toString() ? `?${sp.toString()}` : '';
    return fetchJSON(`/notifications/timeline${qs}`);
  },

  getAdminSources: () => fetchJSON('/admin/sources'),

  triggerAdminSourceScan: (sourceId?: string) =>
    fetchJSON('/admin/sources/scan', {
      method: 'POST',
      body: JSON.stringify({ sourceId })
    }),

  getVerificationQueue: () => fetchJSON('/admin/verification-queue'),

  submitVerificationDecision: (id: string, payload: { decision: string; notes?: string; edits?: any }) =>
    fetchJSON(`/admin/verification-queue/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  verifyAuditChain: () => fetchJSON('/admin/audit-logs/verify'),

  getBenchmarkReport: (mode: string = 'DETERMINISTIC_ONLY') =>
    fetchJSON(`/admin/benchmark?mode=${encodeURIComponent(mode)}`),

  // Phase 7 National Learning Centre, CBT Mock Engine, Adaptive Mastery & Knapsack Planner
  submitCbtMockTest: (id: string, candidateAnswers: any) =>
    fetchJSON(`/mock-tests/${id}/submit-cbt`, {
      method: 'POST',
      body: JSON.stringify({ candidateAnswers })
    }),

  getMockTestTelemetry: (id: string) =>
    fetchJSON(`/mock-tests/${id}/telemetry`),

  getLearningTiers: () => fetchJSON('/learn/tiers'),

  getLearningSubjects: (tier?: string) => {
    const qs = tier ? `?tier=${encodeURIComponent(tier)}` : '';
    return fetchJSON(`/learn/subjects${qs}`);
  },

  getLearningSubjectById: (subjectId: string) =>
    fetchJSON(`/learn/subjects/${subjectId}`),

  getFormulas: (params?: { subjectId?: string; search?: string }) => {
    const sp = new URLSearchParams();
    if (params?.subjectId) sp.append('subjectId', params.subjectId);
    if (params?.search) sp.append('search', params.search);
    const qs = sp.toString() ? `?${sp.toString()}` : '';
    return fetchJSON(`/learn/formulas${qs}`);
  },

  submitFsrsReview: (item: any, quality: number) =>
    fetchJSON('/mastery/fsrs/review', {
      method: 'POST',
      body: JSON.stringify({ item, quality })
    }),

  getWeakTopics: () => fetchJSON('/mastery/weak-topics'),

  estimateAbility: (currentTheta: number, responses: any[]) =>
    fetchJSON('/mastery/irt/ability', {
      method: 'POST',
      body: JSON.stringify({ currentTheta, responses })
    }),

  generateStudyPlan: (options: any) =>
    fetchJSON('/planner/generate', {
      method: 'POST',
      body: JSON.stringify(options)
    }),

  rebalanceStudyPlan: (currentPlan: any, missedDates: string[], updatedHours?: any) =>
    fetchJSON('/planner/rebalance', {
      method: 'POST',
      body: JSON.stringify({ currentPlan, missedDates, updatedHours })
    }),

  // Phase 8 Citation-Grounded Academic Companion & E2EE Doubt Notebook
  askAcademicCompanion: (payload: { mode: string; prompt: string; context?: any }) =>
    fetchJSON('/academic-companion/ask', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  verifyMathEquation: (payload: { problemType: string; expression?: string; claimedAnswer?: any; parameters?: any }) =>
    fetchJSON('/academic-companion/verify-math', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getEncryptedNotes: () => fetchJSON('/notebook/notes'),

  saveEncryptedNote: (note: {
    id?: string;
    ciphertext: string;
    iv: string;
    salt: string;
    iterations: number;
    tagSnippet?: string;
  }) =>
    fetchJSON('/notebook/notes', {
      method: 'POST',
      body: JSON.stringify(note)
    }),

  deleteEncryptedNote: (id: string) =>
    fetchJSON(`/notebook/notes/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  // Phase 9 Career Pathway Graph, Interval Tree Clash, 7th CPC Salary & Analytics
  getCareerPathwayGraph: (stream?: string) => {
    const qs = stream && stream !== 'ALL' ? `?stream=${encodeURIComponent(stream)}` : '';
    return fetchJSON(`/career-pathways/graph${qs}`);
  },

  getTopologicalSort: () => fetchJSON('/career-pathways/topological-sort'),

  getOptimalPathway: (startNodeId: string, targetNodeId: string, objective: string = 'FASTEST') =>
    fetchJSON('/career-pathways/optimal-path', {
      method: 'POST',
      body: JSON.stringify({ startNodeId, targetNodeId, objective })
    }),

  rankAlternativePathways: (startNodeId: string, targetNodeId: string) =>
    fetchJSON('/career-pathways/rank-alternatives', {
      method: 'POST',
      body: JSON.stringify({ startNodeId, targetNodeId })
    }),

  detectCalendarClashes: (events?: any[]) =>
    fetchJSON('/calendar/clashes', {
      method: 'POST',
      body: JSON.stringify({ events: events || [] })
    }),

  calculate7thCpcSalary: (params: { level: number; cityClass: string; daPercent?: number; customBasic?: number }) =>
    fetchJSON('/salary/calculate-7th-cpc', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  calculatePsuIdaSalary: (params: { grade: string; cityClass: string; idaPercent?: number; customBasic?: number }) =>
    fetchJSON('/salary/calculate-psu-ida', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  getServiceBonds: (org?: string) => {
    const qs = org ? `?org=${encodeURIComponent(org)}` : '';
    return fetchJSON(`/salary/bonds${qs}`);
  },

  getPayMatrixLevels: () => fetchJSON('/salary/levels'),

  getHistoricalCutoffTrends: (examId?: string) => {
    const qs = examId ? `?examId=${encodeURIComponent(examId)}` : '';
    return fetchJSON(`/analytics/historical-trends${qs}`);
  },

  getDocumentChecklistStandards: () => fetchJSON('/checklist/standards'),

  // Phase 10: DPDP Act 2023 Privacy, Consent & Key Rotation
  getPrivacyConsent: () => fetchJSON('/privacy/consent'),

  updatePrivacyConsent: (purposeCode: string, granted: boolean) =>
    fetchJSON('/privacy/consent', {
      method: 'POST',
      body: JSON.stringify({ purposeCode, granted })
    }),

  recordParentalConsent: (details: { guardianName: string; guardianRelation: string; guardianEmail: string; guardianPhone?: string; candidateAge: number }) =>
    fetchJSON('/privacy/parental-consent', {
      method: 'POST',
      body: JSON.stringify(details)
    }),

  exportPersonalData: () => fetchJSON('/privacy/export'),

  requestDataErasure: (confirmationStatement: string) =>
    fetchJSON('/privacy/erase', {
      method: 'POST',
      body: JSON.stringify({ confirmationStatement })
    }),

  getGrievanceOfficer: () => fetchJSON('/privacy/grievance-officer'),

  rotateMasterKeys: (oldKey: string, newKey: string) =>
    fetchJSON('/admin/rotate-keys', {
      method: 'POST',
      body: JSON.stringify({ oldKey, newKey })
    }),

  // Phase 11: Universal Aptitude, Reasoning & Blink Speed Mastery
  getAptitudeTaxonomy: () => fetchJSON('/aptitude/taxonomy'),

  getAptitudePillar: (pillarId: string) => fetchJSON(`/aptitude/pillars/${encodeURIComponent(pillarId)}`),

  getAptitudeTopic: (topicId: string) => fetchJSON(`/aptitude/topics/${encodeURIComponent(topicId)}`),

  getAptitudeQuestions: (params?: { topicId?: string; pillarId?: string; examTag?: string; difficulty?: string }) => {
    const qp = new URLSearchParams();
    if (params?.topicId) qp.append('topicId', params.topicId);
    if (params?.pillarId) qp.append('pillarId', params.pillarId);
    if (params?.examTag) qp.append('examTag', params.examTag);
    if (params?.difficulty) qp.append('difficulty', params.difficulty);
    const qs = qp.toString() ? `?${qp.toString()}` : '';
    return fetchJSON(`/aptitude/questions${qs}`);
  },

  getAptitudeQuestionById: (id: string) => fetchJSON(`/aptitude/questions/${encodeURIComponent(id)}`),

  getSpeedGymDrills: () => fetchJSON('/aptitude/speed-gym/drills'),

  vedicMultiply: (a: number, b: number) =>
    fetchJSON('/aptitude/speed-gym/vedic-multiply', {
      method: 'POST',
      body: JSON.stringify({ a, b })
    }),

  estimateSquareRoot: (number: number) =>
    fetchJSON('/aptitude/speed-gym/square-root', {
      method: 'POST',
      body: JSON.stringify({ number })
    }),

  computeDigitalSum: (number: number | string) =>
    fetchJSON('/aptitude/speed-gym/digital-sum', {
      method: 'POST',
      body: JSON.stringify({ number })
    }),

  generateBlinkDrill: (examTag = 'GATE_GA', count = 5) =>
    fetchJSON(`/aptitude/blink-drill/generate?examTag=${encodeURIComponent(examTag)}&count=${count}`),

  analyzeAiTrickCoach: (payload: { questionId?: string; question?: any }) =>
    fetchJSON('/aptitude/ai-coach/analyze', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getAiTrickClones: (questionId: string) =>
    fetchJSON(`/aptitude/ai-coach/clones/${encodeURIComponent(questionId)}`),

  getAiCoachInsight: (topicId: string) =>
    fetchJSON(`/aptitude/ai-coach/insight/${encodeURIComponent(topicId)}`),

  verifyTrick: (payload: { method: string; base?: number; exponent?: number; divisor?: number; number?: number }) =>
    fetchJSON('/aptitude/verify-trick', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};
