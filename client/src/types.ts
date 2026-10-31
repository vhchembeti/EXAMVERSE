// client/src/types.ts
// Core TypeScript interfaces for EXAMVERSE

export type SupportedLanguage =
  | 'English'
  | 'Telugu'
  | 'Hindi'
  | 'Tamil'
  | 'Kannada'
  | 'Malayalam'
  | 'Bengali'
  | 'Marathi'
  | 'Gujarati'
  | 'Punjabi'
  | 'Odia'
  | 'Assamese'
  | 'Urdu';

export type UserRole = 'student' | 'moderator' | 'editor' | 'reviewer' | 'admin' | 'super_admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface StudentProfile {
  userId?: string;
  fullName: string;
  email: string;
  dateOfBirth?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer Not to Say';
  mobileNumber?: string;
  state: string; // state code e.g. "AP", "TG", "TN", "ALL"
  stateName?: string;
  district?: string;
  domicileState?: string;
  nationality?: string;
  educationalQualification: string; // "10th", "12th / Intermediate", "Diploma", "Graduate", "Post Graduate", "Doctorate"
  degree?: string; // "B.Tech", "B.Sc", "B.Com", "B.A", "MBBS", "LLB", "M.Tech", "M.Sc", "MBA"
  specialization?: string; // "Computer Science", "Forensic Science", "Civil", "Mechanical", etc.
  university?: string;
  graduationStatus?: 'Completed' | 'Final Year' | 'Pursuing' | 'Pre-Final Year' | string;
  passingYear?: number | string;
  category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'PwD';
  isPwD?: boolean;
  isExServiceman?: boolean;
  preferredLanguage: SupportedLanguage;
  preparationLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  careerInterests: string[];
  percentage?: number;
  aggregatePercentage?: number;
  heightCm?: number;
  profileCompletedPercent?: number;
}

export interface IndianState {
  code: string;
  name: string;
  type: 'State' | 'Union Territory';
  capital: string;
  officialLanguage: string;
  recruitmentBoards: { name: string; fullName: string; url: string }[];
  entranceExams: { code: string; name: string; conductingBody: string }[];
  majorUniversities: string[];
  domicileRules: string;
}

export interface ExamEligibility {
  minAge?: number | null;
  maxAge?: number | null;
  ageRelaxation?: { [key: string]: number };
  minQualification: string;
  allowedDegrees?: string[];
  specializations?: string[];
  minPercentage?: number | string | null;
  finalYearEligible?: boolean;
  domicileRule?: string;
  nationality?: string;
}

export interface EligibilityEvaluation {
  examId: string;
  examTitle: string;
  examCode: string;
  category: string;
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'VERIFICATION_REQUIRED';
  reasons: string[];
  officialWebsite?: string;
  notificationUrl?: string;
}

export interface Examination {
  id: string;
  code: string;
  title: string;
  conductingBody: string;
  category: string;
  subCategory?: string;
  scope: 'All India' | 'State' | 'International';
  stateCode?: string | null;
  frequency: string;
  mode: string;
  shortDescription: string;
  officialWebsite: string;
  officialNotificationUrl: string;
  eligibility: ExamEligibility;
  selectionProcess: { stage: number; name: string; type: string; marks?: number; qualifying?: boolean }[];
  examPattern?: any;
  syllabus: { subject: string; topics: string[] }[];
  cutoffs?: { year: string; [key: string]: any }[];
  recommendedBooks?: { title: string; author: string; subject: string; edition: string; link: string }[];
  youtubeLessons?: { title: string; channel: string; topic: string; duration: string; url: string }[];
  previousPapers?: { year: number; tier: string; subject: string; shift: string; language: string; pdfUrl: string; practiceAvailable: boolean }[];
  calendar?: {
    notificationDate?: string;
    applicationStart?: string;
    applicationLastDate?: string;
    admitCardDate?: string;
    examDate?: string;
    resultDate?: string;
    status: 'CONFIRMED' | 'TENTATIVE' | 'NOT_ANNOUNCED';
  };
  importantDates?: {
    applicationStart?: string;
    applicationEnd?: string;
    examDate?: string;
  };
  status?: string;
  studentEligibility?: EligibilityEvaluation;
}

export interface ExamNotification {
  id: string;
  organization: string;
  organizationFullName?: string;
  examId?: string;
  examTitle: string;
  releaseDate: string;
  status: 'ACTIVE' | 'CLOSING_SOON' | 'UPCOMING' | 'CLOSED' | 'EXAMINATION_COMPLETED' | 'RESULT_DECLARED' | 'DATE_NOT_VERIFIED';
  isDateTentative?: boolean;
  daysRemaining?: number | null;
  sourceDomain?: string;
  sourceVerified?: boolean;
  resultDate?: string;
  applicationStartDate?: string;
  lastDate?: string;
  examDate?: string;
  officialLink: string;
  pdfLink?: string;
  category: string;
  scope: string;
  stateCode?: string | null;
  totalVacancies?: number | null;
  unread?: boolean;
  summary?: string;
}

export interface CalendarEvent {
  id: string;
  examId: string;
  code: string;
  title: string;
  organization: string;
  category: string;
  scope: string;
  stateCode?: string | null;
  status: 'CONFIRMED' | 'TENTATIVE' | 'NOT_ANNOUNCED';
  notificationDate?: string;
  applicationStart?: string;
  applicationLastDate?: string;
  admitCardDate?: string;
  examDate?: string;
  resultDate?: string;
  color?: string;
}

export interface MockTestQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex?: number;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation?: string;
}

export interface MockTest {
  id: string;
  examId: string;
  title: string;
  category: string;
  subject: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  totalMarks: number;
  positiveMarks: number;
  negativeMarks: number;
  instructions?: string;
  questions?: MockTestQuestion[];
}

export interface TestAttemptResult {
  id?: string;
  testId: string;
  testTitle: string;
  examId: string;
  totalMarks: number;
  score: number;
  accuracy: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  timeTakenSeconds: number;
  submittedAt?: string;
  subjectScores?: { [subject: string]: { total: number; scored: number; correct: number; incorrect: number } };
  weakTopics?: string[];
  strongTopics?: string[];
  detailedResults?: {
    questionId: number;
    question: string;
    options: string[];
    selectedOptionIndex?: number;
    correctOptionIndex: number;
    isCorrect: boolean;
    explanation: string;
    subject: string;
    topic: string;
  }[];
}

export interface DailyTarget {
  id: string;
  text: string;
  subject: string;
  estimatedMinutes: number;
  completed: boolean;
}

export interface CareerPathway {
  qualificationId: string;
  degreeName: string;
  streamCategory: string;
  summary: string;
  pathways: {
    jobOpportunities: {
      name: string;
      exams: string[];
      organizations: string[];
      role: string;
      salaryRange: string;
      details: string;
    }[];
    higherStudies: {
      name: string;
      exams: string[];
      institutions: string[];
      specializations: string[];
      stipend?: string;
      fellowshipAmount?: string;
      details: string;
    }[];
  };
}

export interface MonitoringQueueItem {
  id: string;
  detectedAt: string;
  organization: string;
  examTitle: string;
  category: string;
  eventType: string;
  officialSourceUrl: string;
  sourceDocumentUrl?: string;
  documentChecksum: string;
  extractedData: any;
  changesDetected: string;
  aiConfidenceScore: number;
  verificationStatus: 'PENDING_ADMIN_REVIEW' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
}

export interface MonitoringStatus {
  engineActive: boolean;
  totalMonitoredSources: number;
  sources: { org: string; name: string; url: string; active: boolean }[];
  pendingVerificationsCount: number;
  pendingQueue: MonitoringQueueItem[];
  recentScans: any[];
}

export interface EligibilitySummary {
  totalEvaluated: number;
  govtJobsEligible: number;
  entranceEligible: number;
  higherStudiesEligible: number;
  researchEligible: number;
  activeNotifications: number;
  upcomingExams: number;
  details?: any[];
}

export function calculateProfileCompletion(profile: Partial<StudentProfile> | null | undefined): number {
  if (!profile) return 0;
  let score = 0;
  if (profile.fullName && profile.fullName.trim().length > 1) score += 10;
  if (profile.email && profile.email.includes('@')) score += 10;
  if (profile.dateOfBirth || (profile.age && profile.age > 0)) score += 10;
  if (profile.gender) score += 5;
  if (profile.mobileNumber && profile.mobileNumber.trim().length >= 10) score += 5;
  if (profile.state && profile.state !== 'ALL') score += 10;
  if (profile.domicileState) score += 5;
  if (profile.category) score += 10;
  if (profile.educationalQualification) score += 10;
  if (profile.degree && profile.degree.trim()) score += 10;
  if (profile.specialization && profile.specialization.trim()) score += 10;
  if (profile.graduationStatus) score += 5;
  if (profile.careerInterests && profile.careerInterests.length > 0) score += 10;
  return Math.min(100, score);
}
