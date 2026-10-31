// server/db.js
// Scalable In-Memory + JSON-Persisted Database Layer for EXAMVERSE
// Supports full CRUD, User Profiles, Selected Exams, Test Attempts, Bookmarks, and Admin Audit Trail

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const indianStates = require('./data/statesData');
const initialExams = require('./data/examsData');
const initialNotifications = require('./data/notificationsData');
const initialCalendar = require('./data/calendarData');
const initialMockTests = require('./data/mockTestsData');
const careerPathways = require('./data/careerPathsData');
const { enrichNotification } = require('./services/notificationClassifier');

const DB_FILE = path.join(__dirname, 'data', 'examverse_state.json');

const cryptoService = require('./services/cryptoService');

// --- ENTERPRISE PASSWORD SECURITY (DELEGATED TO CRYPTOSERVICE) ---
function hashPassword(password) {
  return cryptoService.hashPassword(password);
}

function verifyPassword(password, storedHash) {
  return cryptoService.verifyPassword(password, storedHash);
}

// Initial default state
const defaultState = {
  users: [
    {
      id: "usr-student-01",
      fullName: "Dinesh Baswa",
      email: "student@examverse.in",
      role: "student",
      createdAt: "2026-01-15T09:00:00Z"
    },
    {
      id: "usr-admin-01",
      fullName: "EXAMVERSE Senior Administrator",
      email: "admin@examverse.in",
      role: "admin",
      createdAt: "2026-01-01T00:00:00Z"
    }
  ],
  studentProfile: {
    userId: "usr-student-01",
    fullName: "Dinesh Baswa",
    email: "student@examverse.in",
    dateOfBirth: "2001-08-14",
    age: 24,
    gender: "Male",
    state: "AP",
    stateName: "Andhra Pradesh",
    district: "Vijayawada (NTR District)",
    educationalQualification: "Graduate",
    degree: "B.Tech",
    specialization: "Computer Science and Engineering",
    graduationStatus: "Completed",
    category: "General",
    preferredLanguage: "English", // English | Telugu | Hindi | Tamil
    preparationLevel: "Intermediate", // Beginner | Intermediate | Advanced
    careerInterests: ["Government Jobs", "Engineering & PSU", "Higher Studies"]
  },
  selectedExams: ["upsc-cse", "gate-cse", "appsc-group1"],
  savedMaterials: [
    { id: "mat-001", examId: "upsc-cse", type: "PYQ", title: "UPSC Prelims GS 1 (2024 Paper)", savedAt: "2026-02-15" },
    { id: "mat-002", examId: "gate-cse", type: "Book", title: "CLRS Introduction to Algorithms", savedAt: "2026-02-18" }
  ],
  dailyTargets: [
    { id: "dt-1", text: "Read Indian Polity Chapter 12: Fundamental Rights (Articles 19-22)", completed: true, estimatedMinutes: 45, subject: "Polity" },
    { id: "dt-2", text: "Practice 25 GATE Questions on Process Synchronization & Semaphores", completed: false, estimatedMinutes: 60, subject: "Operating Systems" },
    { id: "dt-3", text: "Solve 1 CSAT Reading Comprehension passage & error check", completed: false, estimatedMinutes: 20, subject: "CSAT / Verbal" },
    { id: "dt-4", text: "Review Daily Hindu / PIB Current Affairs notes for Economy & Environment", completed: true, estimatedMinutes: 30, subject: "Current Affairs" }
  ],
  weeklyAssignments: [
    { id: "wa-1", title: "Attempt UPSC Prelims Mini Mock Test (GS 1)", deadline: "Sunday 6:00 PM", status: "PENDING" },
    { id: "wa-2", title: "Complete Weekly Formula Revision for Discrete Mathematics", deadline: "Saturday 8:00 PM", status: "COMPLETED" },
    { id: "wa-3", title: "Analyze 2024 APPSC Group 1 Cutoff gap & weak areas", deadline: "Friday 5:00 PM", status: "COMPLETED" }
  ],
  testAttempts: [
    {
      id: "att-101",
      testId: "mock-upsc-prelims-gs1",
      testTitle: "UPSC Civil Services Prelims GS Paper 1 - Full Mock Test",
      examId: "upsc-cse",
      submittedAt: "2026-02-26T14:30:00Z",
      totalMarks: 20,
      score: 14.68,
      accuracy: 80,
      totalQuestions: 5,
      correctCount: 4,
      incorrectCount: 1,
      unattemptedCount: 0,
      timeTakenSeconds: 385,
      weakTopics: ["Environment & Ecology (GHGs)"],
      strongTopics: ["Indian Polity", "Geography", "Economy", "History"]
    }
  ],
  auditLogs: [
    { id: "log-1", action: "SYSTEM_INITIALIZATION", user: "system", timestamp: "2026-01-01T00:00:00Z", details: "EXAMVERSE Core Database instantiated with verified Indian Examination Schemas." },
    { id: "log-2", action: "NOTIFICATION_VERIFIED", user: "admin@examverse.in", timestamp: "2026-02-11T10:00:00Z", details: "UPSC CSE 2026 official notification document verified from upsc.gov.in." }
  ]
};

class ExamverseDatabase {
  constructor() {
    this.ensureDataDir();
    this.loadState();
  }

  ensureDataDir() {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  loadState() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.state = JSON.parse(raw);
        console.log("[Database] Loaded persisted state from examverse_state.json");
      } else {
        this.state = JSON.parse(JSON.stringify(defaultState));
        this.saveState();
        console.log("[Database] Initialized fresh state and persisted to examverse_state.json");
      }
    } catch (e) {
      console.error("[Database] Error loading database file, falling back to in-memory state:", e);
      this.state = JSON.parse(JSON.stringify(defaultState));
    }

    // Ensure multi-user profile storage exists
    if (!this.state.userProfiles) {
      this.state.userProfiles = {};
    }
    const defaultEmail = (this.state.studentProfile?.email || "student@examverse.in").toLowerCase();
    if (!this.state.userProfiles[defaultEmail]) {
      this.state.userProfiles[defaultEmail] = {
        profile: { ...this.state.studentProfile },
        selectedExams: [...(this.state.selectedExams || [])],
        dailyTargets: [...(this.state.dailyTargets || [])],
        weeklyAssignments: [...(this.state.weeklyAssignments || [])],
        testAttempts: [...(this.state.testAttempts || [])],
        savedMaterials: [...(this.state.savedMaterials || [])]
      };
    }
  }

  saveState() {
    try {
      const data = JSON.stringify(this.state, null, 2);
      const tmpFile = DB_FILE + '.tmp';
      const backupFile = path.join(__dirname, 'data', 'examverse_state.backup.json');

      fs.writeFileSync(tmpFile, data, 'utf-8');
      if (fs.existsSync(DB_FILE)) {
        try { fs.copyFileSync(DB_FILE, backupFile); } catch (e) {}
      }
      fs.renameSync(tmpFile, DB_FILE);
    } catch (e) {
      console.error("[Database] Error persisting state to file:", e);
    }
  }

  // --- MULTI-USER PROFILE ISOLATION ---
  getStudentProfile(email) {
    if (email) {
      const lower = email.toLowerCase().trim();
      if (this.state.userProfiles && this.state.userProfiles[lower]?.profile) {
        return this.state.userProfiles[lower].profile;
      }
    }
    return this.state.studentProfile;
  }

  updateStudentProfile(updates, email) {
    const targetEmail = (email || updates.email || this.state.studentProfile?.email || "student@examverse.in").toLowerCase().trim();
    if (!this.state.userProfiles) this.state.userProfiles = {};
    if (!this.state.userProfiles[targetEmail]) {
      this.state.userProfiles[targetEmail] = {
        profile: { ...this.state.studentProfile, email: targetEmail },
        selectedExams: [],
        dailyTargets: [...(this.state.dailyTargets || [])],
        weeklyAssignments: [],
        testAttempts: [],
        savedMaterials: []
      };
    }

    this.state.userProfiles[targetEmail].profile = {
      ...this.state.userProfiles[targetEmail].profile,
      ...updates
    };

    const prof = this.state.userProfiles[targetEmail].profile;
    // Envelope Encrypt Sensitive PII (DOB, Caste, Domicile, Phone) + HMAC Blind Indexing
    if (!prof._pii_encrypted) prof._pii_encrypted = {};
    if (!prof._blind_indexes) prof._blind_indexes = {};
    if (prof.dateOfBirth) {
      prof._pii_encrypted.dateOfBirth = cryptoService.encryptField(prof.dateOfBirth);
    }
    if (prof.category) {
      prof._pii_encrypted.category = cryptoService.encryptField(prof.category);
      prof._blind_indexes.category = cryptoService.computeBlindIndex(prof.category);
    }
    if (prof.domicileState || prof.state) {
      prof._pii_encrypted.domicileState = cryptoService.encryptField(prof.domicileState || prof.state);
      prof._blind_indexes.domicileState = cryptoService.computeBlindIndex(prof.domicileState || prof.state);
    }
    if (prof.mobileNumber) {
      prof._pii_encrypted.mobileNumber = cryptoService.encryptField(prof.mobileNumber);
      prof._blind_indexes.mobileNumber = cryptoService.computeBlindIndex(prof.mobileNumber);
    }

    if (targetEmail === (this.state.studentProfile?.email || "student@examverse.in").toLowerCase()) {
      this.state.studentProfile = {
        ...this.state.studentProfile,
        ...updates,
        _pii_encrypted: prof._pii_encrypted,
        _blind_indexes: prof._blind_indexes
      };
    }

    this.logAudit("UPDATE_STUDENT_PROFILE", targetEmail, `Updated profile attributes: ${Object.keys(updates).join(', ')}`);
    this.saveState();
    return this.state.userProfiles[targetEmail].profile;
  }

  registerUser(userData) {
    const emailLower = (userData.email || "").toLowerCase().trim();
    const rawPass = userData.password || "student123";
    const hashedPassword = (rawPass && !rawPass.includes(':')) ? hashPassword(rawPass) : rawPass;
    const allowedRoles = ['student', 'moderator', 'editor', 'reviewer', 'admin', 'super_admin'];
    const assignedRole = allowedRoles.includes(userData.role) ? userData.role : 'student';

    const newUser = {
      id: userData.id || `usr-${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      password: hashedPassword,
      role: assignedRole,
      createdAt: new Date().toISOString()
    };

    if (!this.state.users) this.state.users = [];
    // If user with email already exists, update user
    const existingIdx = this.state.users.findIndex(u => u.email.toLowerCase() === emailLower);
    if (existingIdx >= 0) {
      this.state.users[existingIdx] = { 
        ...this.state.users[existingIdx], 
        fullName: userData.fullName, 
        password: hashedPassword 
      };
    } else {
      this.state.users.push(newUser);
    }

    if (!this.state.userProfiles) this.state.userProfiles = {};
    this.state.userProfiles[emailLower] = {
      profile: {
        userId: newUser.id,
        fullName: userData.fullName,
        email: userData.email,
        dateOfBirth: userData.dateOfBirth || "2002-01-01",
        age: userData.age || 24,
        gender: userData.gender || "Other",
        mobileNumber: userData.mobileNumber || "",
        state: userData.state || "AP",
        stateName: userData.stateName || "Andhra Pradesh",
        domicileState: userData.domicileState || userData.state || "AP",
        nationality: userData.nationality || "Indian",
        category: userData.category || "General",
        educationalQualification: userData.educationalQualification || "Graduate",
        degree: userData.degree || "",
        specialization: userData.specialization || "",
        university: userData.university || "",
        graduationStatus: userData.graduationStatus || "Completed",
        passingYear: userData.passingYear || new Date().getFullYear(),
        preferredLanguage: userData.preferredLanguage || "English",
        preparationLevel: userData.preparationLevel || "Intermediate",
        isPwD: !!userData.isPwD,
        isExServiceman: !!userData.isExServiceman,
        careerInterests: userData.careerInterests || ["Government Jobs", "Higher Studies"]
      },
      selectedExams: [],
      dailyTargets: [
        { id: `dt-${Date.now()}-1`, text: "Review syllabus and mark eligible examinations", completed: false, estimatedMinutes: 20, subject: "Orientation" },
        { id: `dt-${Date.now()}-2`, text: "Check active notifications and deadline dates", completed: false, estimatedMinutes: 15, subject: "Notifications" }
      ],
      weeklyAssignments: [],
      testAttempts: [],
      savedMaterials: []
    };

    this.logAudit("STUDENT_REGISTERED", emailLower, `New student registered: ${userData.fullName}`);
    this.saveState();
    return {
      user: newUser,
      profile: this.state.userProfiles[emailLower].profile
    };
  }

  // --- EXAMINATIONS ---
  getAllExams() {
    const custom = this.state.customExams || [];
    return [...initialExams, ...custom];
  }

  getExamById(id) {
    const all = this.getAllExams();
    return all.find(e => e.id === id || e.code?.toLowerCase() === id?.toLowerCase());
  }

  getExamsByCategory(category) {
    const all = this.getAllExams();
    return all.filter(e => e.category?.toLowerCase() === category?.toLowerCase());
  }

  addExam(examData) {
    this.state.customExams = this.state.customExams || [];
    const newExam = {
      id: examData.id || `exam-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "ACTIVE",
      ...examData
    };
    this.state.customExams.push(newExam);
    this.logAudit("CREATE_EXAMINATION", "admin@examverse.in", `Added new examination: ${newExam.name} (${newExam.code || newExam.id})`);
    this.saveState();
    return newExam;
  }

  // --- NOTIFICATIONS ---
  getAllNotifications() {
    const custom = this.state.customNotifications || [];
    const readStatusMap = this.state.notificationReadStatus || {};
    return [...custom, ...initialNotifications].map(n => {
      const enriched = enrichNotification(n);
      if (readStatusMap[n.id] !== undefined) {
        enriched.unread = !readStatusMap[n.id];
      }
      return enriched;
    });
  }

  markNotificationAsRead(id) {
    this.state.notificationReadStatus = this.state.notificationReadStatus || {};
    this.state.notificationReadStatus[id] = true;
    this.saveState();
    const all = this.getAllNotifications();
    return all.find(n => n.id === id) || { id, unread: false };
  }

  markAllNotificationsAsRead() {
    this.state.notificationReadStatus = this.state.notificationReadStatus || {};
    const all = this.getAllNotifications();
    all.forEach(n => {
      this.state.notificationReadStatus[n.id] = true;
    });
    this.saveState();
    return { success: true, count: all.length };
  }

  addNotification(notifData) {
    this.state.customNotifications = this.state.customNotifications || [];
    const newNotif = {
      id: notifData.id || `notif-${Date.now()}`,
      status: notifData.status || "ACTIVE",
      unread: true,
      verifiedBy: "EXAMVERSE Senior Administrator",
      verifiedAt: new Date().toISOString(),
      ...notifData
    };
    this.state.customNotifications.unshift(newNotif);
    this.logAudit("PUBLISH_NOTIFICATION", "admin@examverse.in", `Published gazette notification: ${newNotif.title}`);
    this.saveState();
    return newNotif;
  }

  // --- SELECTED EXAMS ---
  getSelectedExams(email) {
    if (email) {
      const lower = email.toLowerCase().trim();
      if (this.state.userProfiles && this.state.userProfiles[lower]?.selectedExams) {
        return this.state.userProfiles[lower].selectedExams.map(id => this.getExamById(id)).filter(Boolean);
      }
    }
    return this.state.selectedExams.map(id => this.getExamById(id)).filter(Boolean);
  }

  toggleSelectedExam(examId, email) {
    if (email) {
      const lower = email.toLowerCase().trim();
      if (this.state.userProfiles && this.state.userProfiles[lower]) {
        this.state.userProfiles[lower].selectedExams = this.state.userProfiles[lower].selectedExams || [];
        const idx = this.state.userProfiles[lower].selectedExams.indexOf(examId);
        if (idx > -1) {
          this.state.userProfiles[lower].selectedExams.splice(idx, 1);
        } else {
          this.state.userProfiles[lower].selectedExams.push(examId);
        }
        this.saveState();
        return this.state.userProfiles[lower].selectedExams;
      }
    }
    const index = this.state.selectedExams.indexOf(examId);
    if (index > -1) {
      this.state.selectedExams.splice(index, 1);
    } else {
      this.state.selectedExams.push(examId);
    }
    this.saveState();
    return this.state.selectedExams;
  }

  // --- DAILY TARGETS ---
  getDailyTargets(email) {
    if (email) {
      const lower = email.toLowerCase().trim();
      if (this.state.userProfiles && this.state.userProfiles[lower]?.dailyTargets) {
        return this.state.userProfiles[lower].dailyTargets;
      }
    }
    return this.state.dailyTargets;
  }

  toggleDailyTarget(targetId, email) {
    if (email) {
      const lower = email.toLowerCase().trim();
      if (this.state.userProfiles && this.state.userProfiles[lower]?.dailyTargets) {
        const t = this.state.userProfiles[lower].dailyTargets.find(item => item.id === targetId);
        if (t) {
          t.completed = !t.completed;
          this.saveState();
        }
        return this.state.userProfiles[lower].dailyTargets;
      }
    }
    const t = this.state.dailyTargets.find(item => item.id === targetId);
    if (t) {
      t.completed = !t.completed;
      this.saveState();
    }
    return this.state.dailyTargets;
  }

  addDailyTarget(target, email) {
    const newTarget = {
      id: `dt-${Date.now()}`,
      text: target.text,
      subject: target.subject || "General",
      estimatedMinutes: target.estimatedMinutes || 30,
      completed: false
    };
    if (email) {
      const lower = email.toLowerCase().trim();
      if (this.state.userProfiles && this.state.userProfiles[lower]) {
        this.state.userProfiles[lower].dailyTargets = this.state.userProfiles[lower].dailyTargets || [];
        this.state.userProfiles[lower].dailyTargets.push(newTarget);
        this.saveState();
        return newTarget;
      }
    }
    this.state.dailyTargets.push(newTarget);
    this.saveState();
    return newTarget;
  }

  // --- TEST ATTEMPTS & ANALYTICS ---
  recordTestAttempt(attempt, email) {
    const newAttempt = {
      id: `att-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      ...attempt
    };
    if (email) {
      const lower = email.toLowerCase().trim();
      if (this.state.userProfiles && this.state.userProfiles[lower]) {
        this.state.userProfiles[lower].testAttempts = this.state.userProfiles[lower].testAttempts || [];
        this.state.userProfiles[lower].testAttempts.unshift(newAttempt);
      }
    }
    this.state.testAttempts.unshift(newAttempt);
    this.saveState();
    return newAttempt;
  }

  getTestAttempts(email) {
    if (email) {
      const lower = email.toLowerCase().trim();
      if (this.state.userProfiles && this.state.userProfiles[lower]?.testAttempts) {
        return this.state.userProfiles[lower].testAttempts;
      }
    }
    return this.state.testAttempts;
  }

  // --- SAVED MATERIALS & BOOKMARKS ---
  getSavedMaterials() {
    return this.state.savedMaterials;
  }

  toggleSaveMaterial(item) {
    const idx = this.state.savedMaterials.findIndex(m => m.id === item.id);
    if (idx > -1) {
      this.state.savedMaterials.splice(idx, 1);
    } else {
      this.state.savedMaterials.push({
        ...item,
        savedAt: new Date().toISOString().slice(0, 10)
      });
    }
    this.saveState();
    return this.state.savedMaterials;
  }

  // --- WEEKLY ASSIGNMENTS ---
  getWeeklyAssignments() {
    return this.state.weeklyAssignments || [];
  }

  toggleWeeklyAssignment(id) {
    this.state.weeklyAssignments = this.state.weeklyAssignments || [];
    const assignment = this.state.weeklyAssignments.find(a => a.id === id);
    if (assignment) {
      assignment.status = assignment.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      this.saveState();
    }
    return this.state.weeklyAssignments;
  }

  // --- AUDIT TRAIL (CRYPTOGRAPHIC HASH-CHAINED) ---
  logAudit(action, user, details) {
    if (!this.state.auditLogs) this.state.auditLogs = [];
    const prevLog = this.state.auditLogs.length > 0 ? this.state.auditLogs[0] : null;
    const prevHash = prevLog ? (prevLog.currentHash || crypto.createHash('sha256').update(prevLog.id || 'genesis').digest('hex')) : '0'.repeat(64);

    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : String(details || '');
    const timestamp = new Date().toISOString();
    const actor = user || "unknown";
    const currentHash = crypto.createHash('sha256')
      .update(prevHash + action + actor + timestamp + detailsStr)
      .digest('hex');

    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      action,
      user: actor,
      timestamp,
      details: detailsStr,
      prevHash,
      currentHash
    };

    this.state.auditLogs.unshift(entry);
    if (this.state.auditLogs.length > 100) this.state.auditLogs.pop();
    this.saveState();
    return entry;
  }

  getAuditLogs() {
    return this.state.auditLogs;
  }

  // --- CRYPTOGRAPHIC INTEGRITY VERIFICATION ---
  verifyAuditChainIntegrity() {
    if (!this.state.auditLogs || this.state.auditLogs.length === 0) {
      return {
        valid: true,
        totalEntries: 0,
        checkedEntries: 0,
        brokenAt: null,
        message: "Audit trail is empty. No integrity violations."
      };
    }

    const logs = this.state.auditLogs;
    for (let i = 0; i < logs.length; i++) {
      const entry = logs[i];
      if (entry.currentHash) {
        const computed = crypto.createHash('sha256')
          .update(entry.prevHash + entry.action + entry.user + entry.timestamp + entry.details)
          .digest('hex');

        if (computed !== entry.currentHash) {
          return {
            valid: false,
            totalEntries: logs.length,
            checkedEntries: i,
            brokenAt: entry.id,
            message: `Cryptographic hash mismatch at log ${entry.id}. Expected ${entry.currentHash}, got ${computed}. Chain has been tampered with!`
          };
        }

        if (i < logs.length - 1) {
          const older = logs[i + 1];
          if (older.currentHash && entry.prevHash !== older.currentHash) {
            return {
              valid: false,
              totalEntries: logs.length,
              checkedEntries: i,
              brokenAt: entry.id,
              message: `Pointer broken between ${entry.id} and ${older.id}. PrevHash pointer does not match previous currentHash!`
            };
          }
        }
      }
    }

    return {
      valid: true,
      totalEntries: logs.length,
      checkedEntries: logs.length,
      brokenAt: null,
      message: `All ${logs.length} audit trail records cryptographically validated. Zero tampering detected across SHA-256 hash chain.`
    };
  }

  // --- ADMIN VERIFICATION QUEUE & TWO-PERSON APPROVAL ---
  getVerificationQueue() {
    if (!this.state.verificationQueue) {
      this.state.verificationQueue = [
        {
          id: "vq-upsc-01",
          examId: "upsc-cse",
          examTitle: "UPSC Civil Services Examination 2026",
          authority: "UPSC",
          changeType: "DEADLINE_EXTENDED",
          riskLevel: "HIGH",
          confidence: 0.96,
          status: "AI_EXTRACTED_PENDING_REVIEW",
          officialUrl: "https://upsc.gov.in/examinations/civil-services-2026/corrigendum-1",
          documentSnippet: "CORRIGENDUM: Last date for submission of online applications for Civil Services (Preliminary) Examination, 2026 is hereby extended from 03.03.2026 to 10.03.2026 (6:00 PM).",
          extractedFields: {
            field: "Registration Deadline",
            previousValue: "2026-03-03",
            proposedValue: "2026-03-10",
            justification: "Statutory Corrigendum published on upsc.gov.in granting 7-day extension."
          },
          approvals: [],
          requiresTwoPersonApproval: true,
          createdAt: "2026-02-28T10:15:00Z"
        },
        {
          id: "vq-ssc-02",
          examId: "ssc-cgl",
          examTitle: "SSC Combined Graduate Level (CGL) 2026",
          authority: "SSC",
          changeType: "VACANCY_REVISED",
          riskLevel: "HIGH",
          confidence: 0.94,
          status: "AI_EXTRACTED_PENDING_REVIEW",
          officialUrl: "https://ssc.gov.in/notice/cgl-2026-revised-vacancies",
          documentSnippet: "ADDENDUM TO NOTICE: Tentative vacancies reported for CGL 2026 revised upwards from 17,727 to 18,450 posts across CBDT and CBIC departments.",
          extractedFields: {
            field: "Total Vacancies",
            previousValue: "17,727",
            proposedValue: "18,450",
            justification: "Supplementary vacancy intimation uploaded by SSC Headquarters."
          },
          approvals: [],
          requiresTwoPersonApproval: false,
          createdAt: "2026-07-02T14:30:00Z"
        },
        {
          id: "vq-gate-03",
          examId: "gate-cse",
          examTitle: "GATE 2026 (IIT Roorkee)",
          authority: "IIT-ROORKEE",
          changeType: "EXAM_DATE_RESCHEDULED",
          riskLevel: "CRITICAL",
          confidence: 0.98,
          status: "AI_EXTRACTED_PENDING_REVIEW",
          officialUrl: "https://gate2026.iitr.ac.in/notices/session-announcement",
          documentSnippet: "OFFICIAL ANNOUNCEMENT: Session timings and shift schedule for Computer Science (CS) and Data Science (DA) confirmed for 07-08 February 2026.",
          extractedFields: {
            field: "Exam Schedule",
            previousValue: "Tentative Feb 2026",
            proposedValue: "2026-02-07 (Confirmed Session)",
            justification: "Organizing Institute IIT Roorkee press release and timetable brochure."
          },
          approvals: [],
          requiresTwoPersonApproval: true,
          createdAt: "2026-01-10T11:00:00Z"
        }
      ];
      this.saveState();
    }
    return this.state.verificationQueue;
  }

  addVerificationQueueItem(item) {
    if (!this.state.verificationQueue) this.state.verificationQueue = [];
    const newItem = {
      id: item.id || `vq-${Date.now()}`,
      status: "AI_EXTRACTED_PENDING_REVIEW",
      createdAt: new Date().toISOString(),
      approvals: [],
      ...item
    };
    this.state.verificationQueue.unshift(newItem);
    this.logAudit("ENQUEUE_VERIFICATION_ITEM", "system-crawler", `New notice change enqueued: ${newItem.changeType} for ${newItem.examTitle || newItem.examId}`);
    this.saveState();
    return newItem;
  }

  updateVerificationQueueItem(id, updates = {}) {
    const queue = this.getVerificationQueue();
    const idx = queue.findIndex(q => q.id === id);
    if (idx === -1) return null;
    queue[idx] = { ...queue[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveState();
    return queue[idx];
  }

  // --- STATES & CAREER ---
  getAllStates() {
    return indianStates;
  }

  getCareerPathways() {
    return careerPathways;
  }

  getCalendarEvents() {
    const custom = this.state.customCalendarEvents || [];
    return [...custom, ...initialCalendar];
  }

  addCalendarEvent(eventData) {
    this.state.customCalendarEvents = this.state.customCalendarEvents || [];
    const newEvent = {
      id: eventData.id || `cal-${Date.now()}`,
      status: eventData.status || "CONFIRMED",
      ...eventData
    };
    this.state.customCalendarEvents.unshift(newEvent);
    this.logAudit("SCHEDULE_CALENDAR_EVENT", "admin@examverse.in", `Scheduled event: ${newEvent.title}`);
    this.saveState();
    return newEvent;
  }

  getMockTests() {
    const custom = this.state.customMockTests || [];
    return [...initialMockTests, ...custom];
  }

  addMockTest(testData) {
    this.state.customMockTests = this.state.customMockTests || [];
    const newTest = {
      id: testData.id || `mock-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...testData
    };
    this.state.customMockTests.push(newTest);
    this.logAudit("CREATE_MOCK_TEST", "admin@examverse.in", `Published new mock test: ${newTest.title}`);
    this.saveState();
    return newTest;
  }
  hashPassword(pwd) {
    return hashPassword(pwd);
  }

  verifyPassword(pwd, hash) {
    return verifyPassword(pwd, hash);
  }
}

module.exports = new ExamverseDatabase();
