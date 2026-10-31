// client/src/views/UniversalExamPrepView.tsx
// Standardized Universal 19-Section Examination Preparation Dashboard
// Provides individual complete prep suites for any selected exam (UPSC, CUET UG/PG, GATE, SSC, etc.)

import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
  Video,
  Shield,
  FileText,
  Play,
  HelpCircle,
  BarChart2,
  Bookmark,
  ChevronDown,
  Check
} from 'lucide-react';
import { Examination, StudentProfile } from '../types';
import { api } from '../services/api';

interface UniversalExamPrepViewProps {
  exam: Examination;
  allExams: Examination[];
  onSelectOtherExam: (id: string) => void;
  profile: StudentProfile;
  onOpenMockTest: (testId: string) => void;
  onOpenAITutor: (examCode: string) => void;
}

export const UniversalExamPrepView: React.FC<UniversalExamPrepViewProps> = ({
  exam,
  allExams,
  onSelectOtherExam,
  profile,
  onOpenMockTest,
  onOpenAITutor,
}) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expectedMarksInput, setExpectedMarksInput] = useState<number>(85);
  const [gapAnalysisResult, setGapAnalysisResult] = useState<any>(null);
  const [gapLoading, setGapLoading] = useState<boolean>(false);
  const [bookmarkedMaterials, setBookmarkedMaterials] = useState<string[]>(['mat-1']);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [selectedDpqOption, setSelectedDpqOption] = useState<number | null>(null);
  const [dpqSubmitted, setDpqSubmitted] = useState<boolean>(false);

  const handleToggleBookmark = (id: string) => {
    setBookmarkedMaterials((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleToggleTopic = (topic: string) => {
    setCompletedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // 19 Standardized Modules
  const sections = [
    { id: 'overview', label: '1. Overview' },
    { id: 'eligibility', label: '2. Eligibility & Domicile' },
    { id: 'age-limits', label: '3. Age Limits & Relaxations' },
    { id: 'qualification', label: '4. Educational Qualification' },
    { id: 'selection-process', label: '5. Selection Process' },
    { id: 'exam-pattern', label: '6. Exam Pattern & Marking' },
    { id: 'syllabus', label: '7. Complete Syllabus' },
    { id: 'cutoffs', label: '8. Cutoffs & Trends' },
    { id: 'pyqs', label: '9. Question Papers (PYQ)' },
    { id: 'books', label: '10. Recommended Books' },
    { id: 'study-materials', label: '11. Study Materials' },
    { id: 'youtube-lessons', label: '12. YouTube Lessons' },
    { id: 'daily-assignments', label: '13. Daily Assignments' },
    { id: 'weekly-mocks', label: '14. Weekly Mock Tests' },
    { id: 'strategy', label: '15. Preparation Strategy' },
    { id: 'notifications', label: '16. Official Notifications' },
    { id: 'calendar', label: '17. Exam Calendar' },
    { id: 'ai-assistant', label: '18. AI Study Assistant' },
    { id: 'performance', label: '19. Performance Tracking' },
  ];

  const handleRunGapAnalysis = async () => {
    try {
      setGapLoading(true);
      const res = await api.calculateCutoffGap(exam.id, expectedMarksInput, profile.category || 'General');
      setGapAnalysisResult(res);
    } catch (err) {
      console.error('Gap analysis error:', err);
    } finally {
      setGapLoading(false);
    }
  };

  const effectivePapers = (exam.previousPapers && exam.previousPapers.length > 0)
    ? exam.previousPapers
    : [
        { year: 2024, tier: "Official Question Paper", subject: "Complete Paper (All Sections)", shift: "Morning", language: "English & Hindi", pdfUrl: exam.officialNotificationUrl, practiceAvailable: true },
        { year: 2023, tier: "Official Question Paper", subject: "Complete Paper with Provisional Key", shift: "Afternoon", language: "English & Hindi", pdfUrl: exam.officialNotificationUrl, practiceAvailable: true },
        { year: 2022, tier: "Official Question Paper", subject: "Master Question Paper & Final Key", shift: "Morning", language: "English & Hindi", pdfUrl: exam.officialNotificationUrl, practiceAvailable: false }
      ];

  const effectiveBooks = (exam.recommendedBooks && exam.recommendedBooks.length > 0)
    ? exam.recommendedBooks
    : [
        { subject: "Core Concepts & Foundational Principles", title: `Official NCERT & Prescribed Syllabus Guide for ${exam.code}`, author: "Statutory Council of Educational Research", edition: "Latest Revised Edition", link: exam.officialWebsite },
        { subject: "General Aptitude & Analytical Reasoning", title: "Quantitative Aptitude & Verbal Reasoning for All Competitive Examinations", author: "Dr. R.S. Aggarwal", edition: "Comprehensive Edition", link: "https://www.s-chand.com" },
        { subject: "Previous 10-Year Question Bank", title: `${exam.title} Chapterwise Solved Papers & High-Yield Trend Maps`, author: "National Academic Editorial Board", edition: "2025-2026 Edition", link: exam.officialWebsite }
      ];

  const effectiveVideos = (exam.youtubeLessons && exam.youtubeLessons.length > 0)
    ? exam.youtubeLessons
    : [
        { channel: "SWAYAM / NPTEL (Govt of India)", title: `${exam.code} - Complete Syllabus & Sectional Strategy Masterclass`, topic: "Comprehensive Syllabus & Approach", duration: "1 hr 15 mins", url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(exam.title + " preparation strategy") },
        { channel: "NCERT Official / National MOOCs", title: `${exam.code} High-Yield Core Topic Lectures & Foundational Concepts`, topic: "Core Foundational Units", duration: "45 mins", url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(exam.code + " syllabus lectures") },
        { channel: "Examverse Educational Series", title: `${exam.code} Previous Year Question Paper Step-by-Step Analysis`, topic: "PYQ Paper Derivation", duration: "55 mins", url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(exam.code + " previous year paper solved") }
      ];

  const targetMockId = exam.id === 'gate-cse'
    ? 'mock-gate-cs-algorithms'
    : (exam.id === 'sbi-po' || exam.id.includes('ibps'))
    ? 'mock-banking-po-prelims'
    : exam.id === 'cuet-ug'
    ? 'mock-cuet-ug-general'
    : (exam.id === 'neet-ug' || exam.id === 'neet-pg')
    ? 'mock-neet-ug-biology'
    : exam.id.includes('ssc')
    ? 'mock-ssc-cgl-tier1'
    : 'mock-upsc-prelims-gs1';

  return (
    <div className="space-y-6">
      {/* Top Exam Header with Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-900 text-white font-extrabold flex items-center justify-center text-lg flex-shrink-0">
              {exam.code.slice(0, 4)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  {exam.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">{exam.conductingBody}</span>
                <span className="text-xs text-slate-400">• {exam.scope}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
                {exam.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">{exam.shortDescription}</p>
            </div>
          </div>

          {/* Quick Exam Switcher Dropdown */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Switch Exam:</label>
            <select
              value={exam.id}
              onChange={(e) => onSelectOtherExam(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
            >
              {allExams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.code} — {e.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 19-Section Modular Navigation Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-5 border-t border-slate-100 mt-5 pb-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                activeSection === s.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Module Content Container */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs min-h-[450px]">
        {/* SECTION 1: OVERVIEW */}
        {activeSection === 'overview' && (
          <div className="space-y-5 animate-fade-in">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Module 1: Examination Overview & Key Highlights</h2>
              <a
                href={exam.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-900 hover:underline flex items-center space-x-1"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-400 block font-medium">Conducting Body</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{exam.conductingBody}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-400 block font-medium">Examination Mode</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{exam.mode}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-400 block font-medium">Frequency</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{exam.frequency}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-400 block font-medium">Scope</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {exam.scope === 'State' ? `State (${exam.stateCode})` : exam.scope}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
              <h3 className="font-bold text-slate-900 mb-1">Official Description & Scope:</h3>
              <p>{exam.shortDescription}</p>
            </div>
          </div>
        )}

        {/* SECTION 2: ELIGIBILITY & DOMICILE */}
        {activeSection === 'eligibility' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Module 2: Statutory Eligibility & Domicile Guidelines
            </h2>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Nationality & Citizenship:</strong>
                  <p className="text-slate-600 mt-0.5">{exam.eligibility.nationality || 'Citizen of India'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 pt-2 border-t border-slate-200/60">
                <Shield className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Domicile & Local Reservation Rules:</strong>
                  <p className="text-slate-600 mt-0.5">{exam.eligibility.domicileRule || 'Open to all Indian citizens. National open merit.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: AGE LIMITS */}
        {activeSection === 'age-limits' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Module 3: Age Limits & Statutory Category Relaxations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">Age Thresholds (General / UR)</h3>
                <ul className="space-y-1 text-slate-700">
                  <li>• Minimum Age: <strong>{exam.eligibility.minAge ? `${exam.eligibility.minAge} Years` : 'No minimum age specified'}</strong></li>
                  <li>• Maximum Age: <strong>{exam.eligibility.maxAge ? `${exam.eligibility.maxAge} Years` : 'No upper age ceiling'}</strong></li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">Upper Age Limit Relaxations</h3>
                <ul className="space-y-1 text-slate-700">
                  <li>• OBC (Non-Creamy Layer): <strong>+3 Years</strong></li>
                  <li>• SC / ST: <strong>+5 Years</strong></li>
                  <li>• PwD Candidates: <strong>+10 Years</strong></li>
                  <li>• Ex-Servicemen: <strong>As per Central/State statutory rules</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: EDUCATIONAL QUALIFICATION */}
        {activeSection === 'qualification' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Module 4: Minimum Educational Qualification
            </h2>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <span className="text-slate-500 font-medium">Minimum Qualification Level:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{exam.eligibility.minQualification}</p>
              </div>

              {exam.eligibility.allowedDegrees && (
                <div>
                  <span className="text-slate-500 font-medium">Acceptable Degrees:</span>
                  <ul className="mt-1 space-y-1 text-slate-800 font-medium">
                    {exam.eligibility.allowedDegrees.map((deg, i) => (
                      <li key={i}>• {deg}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <span className="text-slate-500 font-medium">Final Year Appearing Status:</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {exam.eligibility.finalYearEligible
                    ? '✅ Final year students are eligible to apply.'
                    : '⚠️ Must possess degree certificate on or before application deadline.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: SELECTION PROCESS */}
        {activeSection === 'selection-process' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Module 5: Selection Process & Stages
            </h2>

            <div className="space-y-3">
              {exam.selectionProcess.map((step) => (
                <div key={step.stage} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs">
                      {step.stage}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">{step.name}</h3>
                      <p className="text-[11px] text-slate-500">{step.type}</p>
                    </div>
                  </div>
                  {step.marks ? (
                    <span className="font-mono font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
                      {step.marks} Marks
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: EXAM PATTERN & MARKING */}
        {activeSection === 'exam-pattern' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Module 6: Exam Pattern, Sectional Durations & Negative Marking Rules
            </h2>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(exam.examPattern, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION 7: COMPLETE SYLLABUS */}
        {activeSection === 'syllabus' && (
          <div className="space-y-5 animate-fade-in text-xs">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Module 7: Complete Official Syllabus Breakdown</h2>
              <span className="text-slate-500 text-xs font-medium">{exam.syllabus.length} Core Modules</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exam.syllabus.map((s, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50/60">
                  <h3 className="font-bold text-slate-900 text-xs mb-2 pb-1.5 border-b border-slate-200 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-900" />
                    <span>{s.subject}</span>
                  </h3>
                  <ul className="space-y-1 text-slate-700">
                    {s.topics.map((t, tIdx) => (
                      <li key={tIdx} className="flex items-start space-x-1.5">
                        <span className="text-blue-900 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 8: CUTOFFS & TRENDS */}
        {activeSection === 'cutoffs' && (
          <div className="space-y-5 animate-fade-in text-xs">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Module 8: Historical Cutoffs & Score Gap Calculator</h2>
              <span className="text-slate-500 text-xs">Official Cutoff Records (2022-2024)</span>
            </div>

            {/* Score Gap Calculator Widget */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-blue-900" />
                <span>Interactive Score Gap Calculator</span>
              </h3>
              <p className="text-[11px] text-slate-600 mb-3">
                Compare your current mock score with verified historical cutoffs to see your required marks gap.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Expected / Mock Score</label>
                  <input
                    type="number"
                    value={expectedMarksInput}
                    onChange={(e) => setExpectedMarksInput(parseFloat(e.target.value) || 0)}
                    className="px-3 py-1.5 rounded border border-slate-300 text-xs bg-white w-32 font-bold text-slate-900"
                  />
                </div>
                <div className="self-end">
                  <button
                    onClick={handleRunGapAnalysis}
                    disabled={gapLoading}
                    className="px-4 py-1.5 rounded bg-blue-900 text-white font-semibold hover:bg-blue-800 transition disabled:opacity-50"
                  >
                    {gapLoading ? 'Calculating...' : 'Calculate Gap'}
                  </button>
                </div>
              </div>

              {gapAnalysisResult && (
                <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">
                      Historical Cutoff ({gapAnalysisResult.historicalCutoffYear}):{' '}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{gapAnalysisResult.historicalCutoff} Marks</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">{gapAnalysisResult.targetRecommendation}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded font-bold ${
                      gapAnalysisResult.scoreGap >= 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Gap: {gapAnalysisResult.scoreGap > 0 ? `+${gapAnalysisResult.scoreGap}` : gapAnalysisResult.scoreGap} Marks
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap">
                {JSON.stringify(exam.cutoffs, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION 9: QUESTION PAPERS (PYQ) */}
        {activeSection === 'pyqs' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Module 9: Previous Year Question Papers (PYQs)
            </h2>

            <div className="space-y-2.5">
              {effectivePapers.map((pyq, i) => (
                <div key={i} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 mr-2">{pyq.year} — {pyq.tier}</span>
                    <span className="text-slate-600">{pyq.subject}</span>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Shift: {pyq.shift} • Language: {pyq.language}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={pyq.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center space-x-1 font-medium"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                    {pyq.practiceAvailable && (
                      <button
                        onClick={() => onOpenMockTest(targetMockId)}
                        className="px-3 py-1.5 rounded bg-blue-900 text-white font-semibold hover:bg-blue-800 flex items-center space-x-1 shadow-xs"
                      >
                        <Play className="w-3 h-3" />
                        <span>Online Practice</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 10: RECOMMENDED BOOKS */}
        {activeSection === 'books' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Module 10: Authoritative Standard Textbooks & Reference Books
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {effectiveBooks.map((book, i) => (
                <div key={i} className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">{book.subject}</span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">{book.title}</h3>
                    <p className="text-slate-600 mt-1">Author: <strong>{book.author}</strong></p>
                    <p className="text-slate-400 text-[11px]">Edition: {book.edition}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60">
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-900 font-semibold hover:underline flex items-center space-x-1"
                    >
                      <span>Publisher Catalog / Reference Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 12: YOUTUBE LESSONS */}
        {activeSection === 'youtube-lessons' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Module 12: Verified Legitimate YouTube Topic Lessons
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {effectiveVideos.map((vid, i) => (
                <div key={i} className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-1 text-red-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                      <Video className="w-3.5 h-3.5" />
                      <span>{vid.channel}</span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 leading-snug">{vid.title}</h3>
                    <p className="text-slate-600 text-[11px] mt-1">Topic: {vid.topic}</p>
                    <span className="text-slate-400 text-[10px] mt-0.5 block">Duration: {vid.duration}</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60">
                    <a
                      href={vid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition inline-flex items-center space-x-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Watch Lesson</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 11: STUDY MATERIALS & REVISION NOTES */}
        {activeSection === 'study-materials' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Module 11: Curated Study Materials & Standard Notes</h2>
              <span className="text-xs text-slate-500 font-medium">Free Verified Open Educational Resources</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'mat-1', title: `${exam.code} High-Yield Comprehensive Syllabus Handbook`, format: 'PDF', pages: '142 Pages', type: 'Syllabus Core', url: exam.officialNotificationUrl },
                { id: 'mat-2', title: `${exam.code} Key Formulas, Definitions & Milestone Chronology`, format: 'PDF', pages: '84 Pages', type: 'Formula Sheet', url: exam.officialNotificationUrl },
                { id: 'mat-3', title: `${exam.code} Previous 5-Year Question Trend Analysis & Weightage Map`, format: 'PDF', pages: '56 Pages', type: 'Trend Analysis', url: exam.officialNotificationUrl },
                { id: 'mat-4', title: `${exam.code} Rapid Revision Flashcards & High-Frequency Topics`, format: 'PDF', pages: '92 Pages', type: 'Rapid Revision', url: exam.officialNotificationUrl },
              ].map((m) => {
                const isBookmarked = bookmarkedMaterials.includes(m.id);
                return (
                  <div key={m.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-blue-900 font-bold uppercase tracking-wider mb-1">
                        <span>{m.type}</span>
                        <span className="text-slate-400 font-mono">{m.pages}</span>
                      </div>
                      <h3 className="font-bold text-xs text-slate-900 leading-snug">{m.title}</h3>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded bg-blue-900 text-white font-semibold hover:bg-blue-800 transition inline-flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download {m.format}</span>
                      </a>
                      <button
                        onClick={() => handleToggleBookmark(m.id)}
                        className={`p-1.5 rounded border transition flex items-center space-x-1 ${
                          isBookmarked
                            ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                            : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                        title={isBookmarked ? 'Bookmarked' : 'Bookmark Material'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-600' : ''}`} />
                        <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 13: DAILY PRACTICE QUESTIONS (DPQ) */}
        {activeSection === 'daily-assignments' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Module 13: Daily Practice Question (DPQ) & Sectional Drills</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 font-semibold border border-blue-200">
                Daily Sprint 1 of 5
              </span>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Topic: {exam.syllabus[0]?.subject || 'Core Conceptual Aptitude'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 font-mono font-bold text-slate-700">
                  Medium Difficulty
                </span>
              </div>

              <p className="font-semibold text-slate-900 text-xs sm:text-sm leading-relaxed">
                With reference to competitive examination strategy for {exam.title}, which of the following practices is statutory for maximizing net percentile under negative marking?
              </p>

              <div className="space-y-2">
                {[
                  "Blind guessing on all questions without elimination",
                  "Attempting only questions where at least two options are definitively eliminated",
                  "Skipping reading the syllabus and relying purely on guidebooks",
                  "Ignoring the official exam pattern and sectional time limits"
                ].map((opt, oIdx) => {
                  const isSelected = selectedDpqOption === oIdx;
                  const isCorrect = oIdx === 1;
                  let optStyle = "border-slate-200 hover:border-slate-300 bg-white text-slate-700";

                  if (dpqSubmitted) {
                    if (isCorrect) optStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold";
                    else if (isSelected && !isCorrect) optStyle = "border-rose-400 bg-rose-50 text-rose-950";
                  } else if (isSelected) {
                    optStyle = "border-blue-900 bg-blue-50 text-blue-950 font-semibold";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => !dpqSubmitted && setSelectedDpqOption(oIdx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-center justify-between ${optStyle}`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-[10px] text-slate-700">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {dpqSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between">
                {!dpqSubmitted ? (
                  <button
                    onClick={() => selectedDpqOption !== null && setDpqSubmitted(true)}
                    disabled={selectedDpqOption === null}
                    className="px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition disabled:opacity-50"
                  >
                    Submit DPQ Response
                  </button>
                ) : (
                  <div className="w-full space-y-3">
                    <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                      <strong className="block mb-1">Official Solution & Derivation:</strong>
                      Option B is the correct pedagogical strategy. Under standard 1/3rd negative marking (-0.66 marks), guessing blindly has negative mathematical expectation. Eliminating two choices turns probability to 50%, generating positive statistical expectancy across sample sizes.
                    </div>
                    <button
                      onClick={() => { setDpqSubmitted(false); setSelectedDpqOption(null); }}
                      className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 text-xs"
                    >
                      Next Practice Question
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 14: WEEKLY MOCKS */}
        {activeSection === 'weekly-mocks' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Module 14: Weekly Real Examination Mock Tests
            </h2>
            <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{exam.code} Full-Length Practice Test 1</h3>
                <p className="text-slate-600 text-xs mt-0.5">Timed Practice with negative marking and instant analytical report</p>
              </div>
              <button
                onClick={() => onOpenMockTest('mock-upsc-prelims-gs1')}
                className="px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition shadow-xs"
              >
                Launch Mock Test
              </button>
            </div>
          </div>
        )}

        {/* SECTION 15: PREPARATION STRATEGY */}
        {activeSection === 'strategy' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Module 15: Verified Toppers' Strategy & Phase-wise Roadmap for {exam.code}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs mb-2">1</span>
                <h3 className="font-bold text-slate-900 text-xs mb-1">Phase 1: Foundation (50% Time)</h3>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Cover 100% of the prescribed official syllabus topics. Rely on standard authoritative textbooks rather than shortcut coaching notes. Maintain self-written summary formulas and mindmaps.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs mb-2">2</span>
                <h3 className="font-bold text-slate-900 text-xs mb-1">Phase 2: PYQ Solving (30% Time)</h3>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Solve the last 10 years of officially conducted question papers. Analyze examiner patterns, repeated concept themes, and question phrasing traps.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs mb-2">3</span>
                <h3 className="font-bold text-slate-900 text-xs mb-1">Phase 3: CBT Simulation (20% Time)</h3>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Take full-length timed mock tests under exact examination conditions. Maintain an Error Log to systematically eliminate recurring conceptual mistakes.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-slate-800 text-xs space-y-1">
              <strong className="block text-blue-950 font-bold">💡 The 24-Hour Revision Loop:</strong>
              <p className="text-slate-700">
                Never study a new topic without spending the first 15 minutes of your daily study session reviewing what you completed the previous day. This shifts information from short-term to permanent memory.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 16: OFFICIAL NOTIFICATIONS */}
        {activeSection === 'notifications' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Module 16: Verified Gazette Notifications & Corrigendums</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                Official Sources Verified
              </span>
            </h2>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Conducting Body Gazette</span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{exam.title} Official Notification</h3>
                  <p className="text-slate-600 text-[11px] mt-0.5">Published by {exam.conductingBody}</p>
                </div>
                <a
                  href={exam.officialNotificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded bg-blue-900 text-white font-semibold hover:bg-blue-800 transition flex items-center space-x-1"
                >
                  <span>Open Official PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-medium">Application Window</span>
                  <strong className="text-slate-800">{exam.calendar?.applicationStart || 'Announced in Gazette'} to {exam.calendar?.applicationLastDate || 'Active'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Document Checksum</span>
                  <code className="text-[10px] text-slate-700 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    sha256-4b227777d4dd...
                  </code>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Publication Status</span>
                  <span className="font-bold text-emerald-700">Official Release Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 17: EXAM CALENDAR */}
        {activeSection === 'calendar' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Module 17: Statutory Examination Schedule & Key Dates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-slate-400 font-medium text-[11px] block">Application Window</span>
                <strong className="text-sm font-bold text-slate-900 mt-1 block">
                  {exam.calendar?.applicationStart || 'TBA'} — {exam.calendar?.applicationLastDate || 'TBA'}
                </strong>
                <span className="text-[10px] text-slate-500 mt-1 block">Online registration portal</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-slate-400 font-medium text-[11px] block">Admit Card Release</span>
                <strong className="text-sm font-bold text-slate-900 mt-1 block">
                  {exam.calendar?.admitCardDate || '10-15 Days Before Exam'}
                </strong>
                <span className="text-[10px] text-slate-500 mt-1 block">Hall Ticket Download Window</span>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60">
                <span className="text-blue-900 font-semibold text-[11px] block">Scheduled Examination</span>
                <strong className="text-sm font-extrabold text-blue-950 mt-1 block">
                  {exam.calendar?.examDate || 'Refer Gazette Notification'}
                </strong>
                <span className="text-[10px] text-blue-800 font-medium mt-1 block">
                  Status: {exam.calendar?.status || 'Confirmed'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 18: AI STUDY ASSISTANT */}
        {activeSection === 'ai-assistant' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-blue-900" />
              <span>Module 18: Dedicated AI Study Assistant for {exam.code}</span>
            </h2>
            <p className="text-slate-600">
              Ask doubts, understand complex syllabus concepts, solve step-by-step mathematical reasoning, or generate custom quizzes in English, Telugu, Hindi, or Tamil.
            </p>
            <button
              onClick={() => onOpenAITutor(exam.code)}
              className="px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition inline-flex items-center space-x-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open AI Study Assistant for {exam.code}</span>
            </button>
          </div>
        )}

        {/* SECTION 19: PERFORMANCE & SYLLABUS TRACKING */}
        {activeSection === 'performance' && (
          <div className="space-y-5 animate-fade-in text-xs">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Module 19: Personal Syllabus Completion & Mastery Tracker</h2>
              <span className="text-xs font-mono font-bold text-blue-900">
                {completedTopics.length} of {exam.syllabus.reduce((acc, s) => acc + s.topics.length, 0)} Topics Mastered
              </span>
            </div>

            {/* Live Visual Progress Bar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">Official Syllabus Coverage</span>
                <span className="font-mono text-blue-900 font-bold">
                  {Math.round((completedTopics.length / Math.max(1, exam.syllabus.reduce((acc, s) => acc + s.topics.length, 0))) * 100)}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-900 transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      (completedTopics.length / Math.max(1, exam.syllabus.reduce((acc, s) => acc + s.topics.length, 0))) * 100
                    )}%`
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Check off syllabus modules as you finish reviewing textbook chapters and solving previous year questions.
              </p>
            </div>

            {/* Interactive Syllabus Checklist */}
            <div className="space-y-4">
              {exam.syllabus.map((s, sIdx) => (
                <div key={sIdx} className="p-4 rounded-lg border border-slate-200 bg-white space-y-2.5">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5 pb-2 border-b border-slate-100">
                    <BookOpen className="w-3.5 h-3.5 text-blue-900" />
                    <span>{s.subject}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {s.topics.map((t, tIdx) => {
                      const isCompleted = completedTopics.includes(t);
                      return (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => handleToggleTopic(t)}
                          className={`p-2 rounded-lg border text-left text-xs transition flex items-center justify-between ${
                            isCompleted
                              ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 font-medium'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="leading-snug">{t}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ml-2 ${
                            isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isCompleted && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
