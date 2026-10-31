// client/src/views/MainDashboardView.tsx
// Main Student Dashboard for EXAMVERSE
// Premium human-designed dashboard displaying categorized recommendations,
// active notices, upcoming exams, interactive daily targets with missed-task recovery
// and revision scheduling, and omni-search across boards, notifications, syllabus, papers & books.

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bookmark,
  Compass,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Plus,
  Check,
  BarChart2,
  FileText,
  RotateCcw,
  Zap,
  GraduationCap,
  Building,
  Briefcase,
  Bell
} from 'lucide-react';
import { Examination, StudentProfile, DailyTarget, ExamNotification, calculateProfileCompletion, EligibilitySummary } from '../types';
import { api } from '../services/api';

interface MainDashboardViewProps {
  profile: StudentProfile;
  exams: Examination[];
  selectedExams: Examination[];
  dailyTargets: DailyTarget[];
  onToggleDailyTarget: (id: string) => void;
  onAddDailyTarget: (text: string, subject?: string) => void;
  onSelectExam: (examId: string) => void;
  onNavigateTab: (tab: string) => void;
  notifications: ExamNotification[];
  onOpenNotifications: () => void;
  selectedStateName: string;
}

type RecommendationCategory = 'GOVT_JOBS' | 'ENTRANCE' | 'POSTGRADUATE' | 'RESEARCH' | 'PROFESSIONAL';

export const MainDashboardView: React.FC<MainDashboardViewProps> = ({
  profile,
  exams,
  selectedExams,
  dailyTargets,
  onToggleDailyTarget,
  onAddDailyTarget,
  onSelectExam,
  onNavigateTab,
  notifications,
  onOpenNotifications,
  selectedStateName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newTargetText, setNewTargetText] = useState('');
  const [newTargetSubject, setNewTargetSubject] = useState('Polity');
  const [recCategory, setRecCategory] = useState<RecommendationCategory>('GOVT_JOBS');
  const [weeklyAssignments, setWeeklyAssignments] = useState<any[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [savedMaterials, setSavedMaterials] = useState<any[]>([]);
  const [showRevisionOptions, setShowRevisionOptions] = useState(false);
  const [eligibilitySummary, setEligibilitySummary] = useState<EligibilitySummary | null>(null);

  useEffect(() => {
    Promise.all([
      api.getWeeklyAssignments().catch(() => []),
      api.getAttemptHistory().catch(() => []),
      api.getSavedMaterials().catch(() => []),
      api.getEligibilitySummary(profile).catch(() => null)
    ]).then(([wa, att, mats, summary]) => {
      setWeeklyAssignments(wa || []);
      setRecentAttempts(att || []);
      setSavedMaterials(mats || []);
      if (summary) setEligibilitySummary(summary);
    });
  }, [profile]);

  const handleToggleWeeklyAssignment = async (id: string) => {
    try {
      const updated = await api.toggleWeeklyAssignment(id);
      setWeeklyAssignments(updated);
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Comprehensive Omni-Search across Boards, Exams, Notifications, Syllabus, Papers, Books
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    // Matching examinations
    const matchedExams = exams.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.conductingBody.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.shortDescription && e.shortDescription.toLowerCase().includes(q))
    );

    // Matching notifications
    const matchedNotifs = notifications.filter(
      (n) =>
        (n.examTitle && n.examTitle.toLowerCase().includes(q)) ||
        (n.organization && n.organization.toLowerCase().includes(q)) ||
        (n.summary && n.summary.toLowerCase().includes(q))
    );

    // Matching syllabus topics across exams
    const matchedSyllabus: { examId: string; examCode: string; topic: string; subject: string }[] = [];
    exams.forEach((ex) => {
      (ex.syllabus || []).forEach((s) => {
        (s.topics || []).forEach((t) => {
          if (t.toLowerCase().includes(q) && matchedSyllabus.length < 5) {
            matchedSyllabus.push({
              examId: ex.id,
              examCode: ex.code,
              topic: t,
              subject: s.subject
            });
          }
        });
      });
    });

    // Matching previous year papers across exams
    const matchedPapers: { examId: string; examCode: string; paperTitle: string; year: number }[] = [];
    exams.forEach((ex) => {
      (ex.previousPapers || []).forEach((p: any) => {
        const title = p.title || `${ex.code} ${p.tier || ''} ${p.subject || ''}`;
        if (
          (title.toLowerCase().includes(q) || String(p.year).includes(q) || ex.code.toLowerCase().includes(q)) &&
          matchedPapers.length < 4
        ) {
          matchedPapers.push({
            examId: ex.id,
            examCode: ex.code,
            paperTitle: title,
            year: p.year
          });
        }
      });
    });

    // Matching books & resources
    const matchedBooks: { examId: string; examCode: string; bookTitle: string; author: string }[] = [];
    exams.forEach((ex) => {
      (ex.recommendedBooks || []).forEach((b: any) => {
        if (
          (b.title.toLowerCase().includes(q) || (b.author && b.author.toLowerCase().includes(q)) || (b.subject && b.subject.toLowerCase().includes(q))) &&
          matchedBooks.length < 4
        ) {
          matchedBooks.push({
            examId: ex.id,
            examCode: ex.code,
            bookTitle: b.title,
            author: b.author || 'Standard Publication'
          });
        }
      });
    });

    return {
      exams: matchedExams,
      notifications: matchedNotifs,
      syllabus: matchedSyllabus,
      papers: matchedPapers,
      books: matchedBooks,
      totalCount:
        matchedExams.length + matchedNotifs.length + matchedSyllabus.length + matchedPapers.length + matchedBooks.length
    };
  }, [searchQuery, exams, notifications]);

  // 2. Categorized Recommendations based on Student Profile
  const recommendedByCategory = useMemo(() => {
    const isGraduate = profile.educationalQualification === 'Graduate' || profile.educationalQualification === 'Post Graduate';
    const isTech = (profile.degree || '').toLowerCase().includes('b.tech') || (profile.specialization || '').toLowerCase().includes('computer');

    const govtExams = exams.filter((e) => {
      if (e.category === 'Government Recruitment' || e.category === 'State Public Service Commission') {
        if (isGraduate) {
          return e.code === 'UPSC CSE' || e.code === 'SSC CGL' || e.code === 'IBPS PO' || e.code.includes('Group 1') || e.code === 'RRB NTPC';
        }
        return e.code === 'SSC CHSL' || e.code === 'NDA' || e.code === 'RRB Group D';
      }
      return false;
    });

    const entranceExams = exams.filter((e) =>
      e.code === 'CUET UG' || e.code === 'JEE Main' || e.code === 'NEET UG' || e.code === 'CLAT UG' || e.code === 'NATA'
    );

    const postgradExams = exams.filter((e) =>
      e.code === 'GATE CS' || e.code === 'CAT' || e.code === 'CUET PG' || e.code === 'IIT JAM' || e.code === 'GPAT'
    );

    const researchExams = exams.filter((e) =>
      e.code === 'CSIR NET JRF' || e.code === 'UGC NET' || e.code === 'DBT BET' || e.code === 'ICMR JRF'
    );

    const professionalExams = exams.filter((e) =>
      e.code === 'CTET' || e.code === 'CA Intermediate' || e.code === 'CS Executive' || e.category.includes('Certification')
    );

    return {
      GOVT_JOBS: govtExams.length > 0 ? govtExams : exams.filter(e => e.category === 'Government Recruitment').slice(0, 5),
      ENTRANCE: entranceExams,
      POSTGRADUATE: postgradExams,
      RESEARCH: researchExams,
      PROFESSIONAL: professionalExams.length > 0 ? professionalExams : exams.slice(0, 4)
    };
  }, [exams, profile]);

  const kpiData = useMemo(() => {
    if (eligibilitySummary) {
      return eligibilitySummary;
    }
    const isGraduate = profile.educationalQualification === 'Graduate' || profile.educationalQualification === 'Post Graduate';
    const govtCount = exams.filter(e => e.category === 'Government Recruitment' || e.category === 'State Public Service Commission').length;
    const entranceCount = exams.filter(e => e.category === 'Entrance' || e.category === 'Engineering Entrance' || e.category === 'Medical Entrance').length;
    const higherCount = exams.filter(e => ['GATE CS', 'CAT', 'CUET PG', 'IIT JAM', 'MAT', 'CMAT'].includes(e.code)).length || 6;
    const researchCount = exams.filter(e => ['CSIR NET JRF', 'UGC NET', 'DBT BET', 'ICMR JRF'].includes(e.code)).length || 4;
    const activeCount = notifications.filter(n => n.status === 'ACTIVE' || n.status === 'CLOSING_SOON').length;
    const upcomingCount = exams.filter(e => e.calendar?.examDate).length || 12;

    return {
      totalEvaluated: exams.length,
      govtJobsEligible: isGraduate ? Math.min(govtCount, 8) : Math.min(govtCount, 4),
      entranceEligible: entranceCount > 0 ? entranceCount : 4,
      higherStudiesEligible: isGraduate ? higherCount : 2,
      researchEligible: profile.educationalQualification === 'Post Graduate' ? researchCount : Math.min(researchCount, 2),
      activeNotifications: activeCount,
      upcomingExams: upcomingCount,
    };
  }, [eligibilitySummary, exams, notifications, profile]);

  const closingSoonList = useMemo(() => {
    const list = notifications.filter((n) => n.status === 'CLOSING_SOON' || (n.status === 'ACTIVE' && n.lastDate));
    return list.length > 0 ? list : notifications.slice(0, 3);
  }, [notifications]);

  const activeNotifs = notifications.filter((n) => n.status === 'ACTIVE' || n.status === 'CLOSING_SOON');
  const completedTargetsCount = dailyTargets.filter((t) => t.completed).length;
  const progressPercent = dailyTargets.length > 0 ? Math.round((completedTargetsCount / dailyTargets.length) * 100) : 0;

  // Missed-task recovery detection
  const missedTasks = dailyTargets.filter((t) => !t.completed && t.estimatedMinutes && t.estimatedMinutes > 40);

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetText.trim()) return;
    onAddDailyTarget(newTargetText.trim(), newTargetSubject);
    setNewTargetText('');
  };

  const handleScheduleRevision = (topic: string, subject: string) => {
    onAddDailyTarget(`Spaced Revision: ${topic}`, subject);
    setShowRevisionOptions(false);
  };

  const handleRecoverMissedTask = (taskId: string) => {
    onToggleDailyTarget(taskId); // toggles / activates
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Omni-Search Hero Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                Student Profile Active
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {profile.degree || profile.educationalQualification} • {profile.stateName || profile.state}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Welcome back, {profile.fullName}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Centralized preparation dashboard. Track daily targets, explore categorized statutory opportunities, and access authenticated syllabi and official notifications.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('finder')}
              className="text-xs px-3.5 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition flex items-center space-x-1.5 shadow-xs"
            >
              <span>Smart Exam Finder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Exam Calendar
            </button>
          </div>
        </div>

        {/* Global Omni-Search Bar (Boards, Exams, Notifications, Syllabus, Papers, Books) */}
        <div className="mt-5 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Omni-Search: Search boards (UPSC, NTA), exams (GATE, CUET), notifications, syllabus topics (Polity, Calculus), papers, or textbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 bg-slate-50/50 hover:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Categorized Omni-Search Dropdown */}
          {searchResults && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-30 max-h-96 overflow-y-auto divide-y divide-slate-100 text-xs">
              {searchResults.totalCount === 0 ? (
                <div className="py-6 text-center text-slate-500">
                  <p className="font-semibold">No results found matching "{searchQuery}"</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try searching by exam code (e.g. UPSC, GATE), subject (Polity), or book (Laxmikanth).</p>
                </div>
              ) : (
                <>
                  {/* Category A: Examinations */}
                  {searchResults.exams.length > 0 && (
                    <div className="pb-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Examinations & Boards ({searchResults.exams.length})
                      </span>
                      <div className="space-y-1">
                        {searchResults.exams.slice(0, 4).map((ex) => (
                          <div
                            key={ex.id}
                            onClick={() => {
                              onSelectExam(ex.id);
                              setSearchQuery('');
                            }}
                            className="p-2 hover:bg-blue-50/50 rounded-md cursor-pointer flex items-center justify-between transition"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-blue-900">{ex.code}</span>
                              <span className="text-slate-700">{ex.title}</span>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {ex.conductingBody}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category B: Active Notifications */}
                  {searchResults.notifications.length > 0 && (
                    <div className="py-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Official Gazette Notifications ({searchResults.notifications.length})
                      </span>
                      <div className="space-y-1">
                        {searchResults.notifications.slice(0, 3).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              if (notif.examId) onSelectExam(notif.examId);
                              else onOpenNotifications();
                              setSearchQuery('');
                            }}
                            className="p-2 hover:bg-amber-50/50 rounded-md cursor-pointer flex items-center justify-between transition"
                          >
                            <div>
                              <span className="font-semibold text-slate-900 block">{notif.examTitle}</span>
                              <span className="text-[10px] text-slate-500">
                                {notif.organization} • Deadline: {notif.lastDate || 'See notification'}
                              </span>
                            </div>
                            <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                              {notif.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category C: Syllabus Topics */}
                  {searchResults.syllabus.length > 0 && (
                    <div className="py-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Syllabus Topics ({searchResults.syllabus.length})
                      </span>
                      <div className="space-y-1">
                        {searchResults.syllabus.map((syl, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              onSelectExam(syl.examId);
                              setSearchQuery('');
                            }}
                            className="p-2 hover:bg-slate-50 rounded-md cursor-pointer flex items-center justify-between transition"
                          >
                            <div className="flex items-center space-x-2">
                              <BookOpen className="w-3.5 h-3.5 text-blue-900" />
                              <span className="font-medium text-slate-800">{syl.topic}</span>
                              <span className="text-[10px] text-slate-400">({syl.subject})</span>
                            </div>
                            <span className="text-[10px] text-blue-900 font-bold">{syl.examCode} Syllabus →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category D: Previous Year Papers */}
                  {searchResults.papers.length > 0 && (
                    <div className="py-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Previous Year Question Papers ({searchResults.papers.length})
                      </span>
                      <div className="space-y-1">
                        {searchResults.papers.map((p, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              onSelectExam(p.examId);
                              setSearchQuery('');
                            }}
                            className="p-2 hover:bg-slate-50 rounded-md cursor-pointer flex items-center justify-between transition"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                              <span className="font-medium text-slate-800">{p.paperTitle}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">{p.examCode} ({p.year})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category E: Standard Books & Textbooks */}
                  {searchResults.books.length > 0 && (
                    <div className="pt-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Standard Curriculum Textbooks ({searchResults.books.length})
                      </span>
                      <div className="space-y-1">
                        {searchResults.books.map((b, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              onSelectExam(b.examId);
                              setSearchQuery('');
                            }}
                            className="p-2 hover:bg-slate-50 rounded-md cursor-pointer flex items-center justify-between transition"
                          >
                            <div className="flex items-center space-x-2">
                              <Bookmark className="w-3.5 h-3.5 text-emerald-700" />
                              <span className="font-medium text-slate-800">{b.bookTitle}</span>
                              <span className="text-[10px] text-slate-400">by {b.author}</span>
                            </div>
                            <span className="text-[10px] text-blue-900 font-bold">{b.examCode} Materials →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Real Backend KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Eligible Government Jobs */}
        <div 
          onClick={() => onNavigateTab('opportunity-discovery')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-900 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Govt Recruitment</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-900 group-hover:text-white text-blue-900 flex items-center justify-center transition">
              <Building className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{kpiData.govtJobsEligible}</span>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">Eligible Govt Jobs</p>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center group-hover:text-blue-900">
              <span>View Openings</span>
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </p>
          </div>
        </div>

        {/* Card 2: Eligible Entrance Examinations */}
        <div 
          onClick={() => onNavigateTab('opportunity-discovery')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Entrance Exams</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 group-hover:bg-emerald-700 group-hover:text-white text-emerald-800 flex items-center justify-center transition">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{kpiData.entranceEligible}</span>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">Eligible Entrance</p>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center group-hover:text-emerald-700">
              <span>National Portals</span>
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </p>
          </div>
        </div>

        {/* Card 3: Higher Studies Opportunities */}
        <div 
          onClick={() => onNavigateTab('higher-studies')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Postgraduate</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 group-hover:bg-indigo-700 group-hover:text-white text-indigo-800 flex items-center justify-center transition">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{kpiData.higherStudiesEligible}</span>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">Higher Studies & PG</p>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center group-hover:text-indigo-700">
              <span>IIT, IIM, CUET PG</span>
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </p>
          </div>
        </div>

        {/* Card 4: Research & JRF Opportunities */}
        <div 
          onClick={() => onNavigateTab('higher-studies')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-purple-600 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fellowships</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 group-hover:bg-purple-700 group-hover:text-white text-purple-800 flex items-center justify-center transition">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{kpiData.researchEligible}</span>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">Research & JRF</p>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center group-hover:text-purple-700">
              <span>UGC, CSIR NET</span>
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </p>
          </div>
        </div>

        {/* Card 5: Active Application Notifications */}
        <div 
          onClick={onOpenNotifications}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Gazette Live</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 group-hover:bg-amber-600 group-hover:text-white text-amber-700 flex items-center justify-center transition">
              <Bell className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-amber-600">{kpiData.activeNotifications}</span>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">Active Notices</p>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center group-hover:text-amber-600">
              <span>Open Gazette</span>
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </p>
          </div>
        </div>

        {/* Card 6: Upcoming Examinations */}
        <div 
          onClick={() => onNavigateTab('calendar')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-sky-600 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Schedules</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 group-hover:bg-sky-700 group-hover:text-white text-sky-800 flex items-center justify-center transition">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{kpiData.upcomingExams}</span>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">Upcoming Exams</p>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center group-hover:text-sky-700">
              <span>Exam Calendar</span>
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </p>
          </div>
        </div>
      </div>

      {/* 3. Intelligent Opportunity Discovery Engine Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white p-6 shadow-md border border-blue-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-800/80 text-blue-200 text-[10px] font-bold uppercase tracking-wider border border-blue-700/50">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Intelligent Discovery Engine</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Uncover Every Opportunity Your Degree Qualifies You For
            </h2>
            <p className="text-xs text-blue-200/90 leading-relaxed">
              Every degree unlocks dozens of statutory career pathways across Central Government, State PSCs, Premier Institutes (IITs, IIMs, IISc), and Research Fellowships. Our engine analyzes your age cutoffs, category relaxations, domicile rules, and degree requirements to give you a transparent, zero-guesswork roadmap.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-blue-200">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Statutory Age Verification</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reservation Relaxations (OBC/SC/ST/PwD)</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>State Domicile Rules</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              onClick={() => onNavigateTab('opportunity-discovery')}
              className="px-5 py-3 rounded-lg bg-white text-blue-950 hover:bg-blue-50 font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Launch Opportunity Discovery</span>
              <ArrowRight className="w-4 h-4 text-blue-900" />
            </button>
            <button
              onClick={() => onNavigateTab('simulator')}
              className="px-4 py-2.5 rounded-lg bg-blue-700/80 hover:bg-blue-700 text-white font-semibold text-xs border border-blue-500/50 transition text-center flex items-center justify-center space-x-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-blue-200" />
              <span>Career & What-If Simulator</span>
            </button>
            <button
              onClick={() => onNavigateTab('higher-studies')}
              className="px-4 py-2 rounded-lg bg-blue-800/60 hover:bg-blue-800 text-blue-100 font-semibold text-xs border border-blue-700 transition text-center"
            >
              Explore Higher Studies & PG
            </button>
          </div>
        </div>
      </div>

      {/* 4. Applications Closing Soon (15–30 Days Alert) */}
      {closingSoonList.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/80">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-950">Applications Closing Soon (Action Required)</h2>
                <p className="text-[11px] text-amber-800">Direct official registration portals for statutory deadlines closing in 15–30 days</p>
              </div>
            </div>
            <button
              onClick={onOpenNotifications}
              className="text-xs font-semibold text-amber-900 hover:underline flex items-center space-x-1"
            >
              <span>All Deadlines</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3.5">
            {closingSoonList.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-lg border border-amber-200 hover:border-amber-400 shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                      CLOSING SOON
                    </span>
                    <span className="text-slate-500 font-medium">{item.organization}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{item.examTitle}</h3>
                  <div className="mt-2 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Deadline:</span>
                      <strong className="text-rose-700 font-mono">{item.lastDate || 'Check Official Portal'}</strong>
                    </div>
                    {item.totalVacancies && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Total Vacancies:</span>
                        <span className="font-semibold text-slate-800">{item.totalVacancies.toLocaleString()} posts</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={item.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center space-x-1"
                  >
                    <span>Apply on Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => {
                      if (item.examId) onSelectExam(item.examId);
                      else onOpenNotifications();
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Active Notifications Marquee */}
      {activeNotifs.length > 0 && (
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-blue-950">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <span className="font-bold px-2 py-0.5 rounded bg-blue-900 text-white text-[10px] tracking-wide uppercase flex-shrink-0">
              Active Gazette Notices
            </span>
            <div className="truncate">
              <strong>{activeNotifs[0].organization}:</strong> {activeNotifs[0].examTitle} — Application Deadline: {activeNotifs[0].lastDate || 'See portal'}
            </div>
          </div>
          <button
            onClick={onOpenNotifications}
            className="text-xs font-semibold text-blue-900 hover:text-blue-950 whitespace-nowrap flex items-center space-x-1 flex-shrink-0 underline decoration-blue-300 underline-offset-2"
          >
            <span>View All ({activeNotifs.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Main Dashboard Grid: Left Prep Targets + Right Categorized Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Daily Study Targets & Preparation Suite */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Study Targets Card with Missed-Task Recovery & Spaced Revision */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                  {completedTargetsCount}/{dailyTargets.length}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Daily Study Targets & Checklist</h2>
                  <p className="text-[11px] text-slate-500">Interactive preparation targets with progress tracking</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRevisionOptions(!showRevisionOptions)}
                  className="text-xs px-2.5 py-1 rounded bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 font-semibold flex items-center space-x-1 transition"
                >
                  <RotateCcw className="w-3 h-3 text-purple-700" />
                  <span>+ Schedule Revision</span>
                </button>
                <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded">
                  {progressPercent}% Done
                </span>
              </div>
            </div>

            {/* Quick Revision Scheduler Panel */}
            {showRevisionOptions && (
              <div className="mt-3 p-3 bg-purple-50/70 rounded-lg border border-purple-200 text-xs animate-fade-in">
                <span className="font-bold text-purple-950 block mb-2">Spaced Repetition & Revision Scheduler:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleScheduleRevision('Constitutional Articles & Amendments', 'Polity')}
                    className="p-2 bg-white rounded border border-purple-200 hover:border-purple-400 text-left text-slate-800"
                  >
                    <strong className="block text-[11px] text-purple-900">Polity Articles</strong>
                    <span className="text-[10px] text-slate-500">25 min quick recall drill</span>
                  </button>
                  <button
                    onClick={() => handleScheduleRevision('Quantitative Shortcuts & Tables', 'Quantitative')}
                    className="p-2 bg-white rounded border border-purple-200 hover:border-purple-400 text-left text-slate-800"
                  >
                    <strong className="block text-[11px] text-purple-900">Quant Speed Drills</strong>
                    <span className="text-[10px] text-slate-500">30 min formula practice</span>
                  </button>
                  <button
                    onClick={() => handleScheduleRevision('Mock Test Error Diagnostics Analysis', 'Diagnostics')}
                    className="p-2 bg-white rounded border border-purple-200 hover:border-purple-400 text-left text-slate-800"
                  >
                    <strong className="block text-[11px] text-purple-900">Error Analysis</strong>
                    <span className="text-[10px] text-slate-500">Review weak topics</span>
                  </button>
                </div>
              </div>
            )}

            {/* Missed-Task Recovery Banner */}
            {missedTasks.length > 0 && (
              <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between text-xs text-amber-950">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>Missed-Task Recovery:</strong> "{missedTasks[0].text}" is pending from earlier session.
                  </span>
                </div>
                <button
                  onClick={() => handleRecoverMissedTask(missedTasks[0].id)}
                  className="text-[11px] font-bold px-2 py-1 bg-amber-200 hover:bg-amber-300 rounded text-amber-900 whitespace-nowrap"
                >
                  Mark Caught Up ✓
                </button>
              </div>
            )}

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 my-3">
              <div
                className="bg-blue-900 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Target Checklist */}
            <div className="space-y-2 mt-3">
              {dailyTargets.map((target) => (
                <div
                  key={target.id}
                  onClick={() => onToggleDailyTarget(target.id)}
                  className={`flex items-start space-x-3 p-3 rounded-lg border text-xs cursor-pointer transition ${
                    target.completed
                      ? 'bg-slate-50/70 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="pt-0.5 flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        target.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {target.completed && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium leading-relaxed">{target.text}</p>
                    <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400 no-underline">
                      <span className="font-semibold text-slate-600">{target.subject}</span>
                      <span>•</span>
                      <span>~{target.estimatedMinutes || 30} mins</span>
                      {target.text.includes('Revision') && (
                        <span className="text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-bold">
                          Revision
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Target Form */}
            <form onSubmit={handleCreateTarget} className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Add new study target for today..."
                value={newTargetText}
                onChange={(e) => setNewTargetText(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <select
                value={newTargetSubject}
                onChange={(e) => setNewTargetSubject(e.target.value)}
                className="text-xs px-2 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700"
              >
                <option value="Polity">Polity</option>
                <option value="Quantitative">Quant</option>
                <option value="Reasoning">Reasoning</option>
                <option value="CS / Tech">CS/Tech</option>
                <option value="History">History</option>
                <option value="Current Affairs">Current Affairs</option>
              </select>
              <button
                type="submit"
                className="text-xs px-3.5 py-1.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* My Target Examinations Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">My Selected Target Examinations</h2>
                <p className="text-[11px] text-slate-500">Fast access to your customized universal preparation suites</p>
              </div>
              <button
                onClick={() => onNavigateTab('explore')}
                className="text-xs text-blue-900 font-semibold hover:underline"
              >
                Explore More →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {selectedExams.map((ex) => (
                <div
                  key={ex.id}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-900 hover:shadow-xs transition bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-extrabold text-blue-900">{ex.code}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {ex.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{ex.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{ex.shortDescription}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{ex.calendar?.examDate ? `Exam: ${ex.calendar.examDate}` : 'Date Announced'}</span>
                    </div>
                    <button
                      onClick={() => onSelectExam(ex.id)}
                      className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center space-x-1"
                    >
                      <span>Open Prep</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Assignments Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-blue-900" />
                  <span>Weekly Preparation Assignments</span>
                </h2>
                <p className="text-[11px] text-slate-500">Structured study milestones for active cycle</p>
              </div>
              <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                {weeklyAssignments.filter((a) => a.status === 'COMPLETED').length} / {weeklyAssignments.length} Done
              </span>
            </div>

            <div className="space-y-2 mt-3 text-xs">
              {weeklyAssignments.map((wa) => (
                <div
                  key={wa.id}
                  onClick={() => handleToggleWeeklyAssignment(wa.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition flex items-start space-x-2.5 ${
                    wa.status === 'COMPLETED'
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="pt-0.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        wa.status === 'COMPLETED' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {wa.status === 'COMPLETED' && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium block leading-snug">{wa.title}</span>
                    <span className="text-[10px] text-slate-400 no-underline mt-0.5 block">
                      Target: {wa.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Test Results Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-blue-900" />
                  <span>Recent CBT Examination Results</span>
                </h2>
                <p className="text-[11px] text-slate-500">Live score & accuracy diagnostics</p>
              </div>
              <button
                onClick={() => onNavigateTab('performance')}
                className="text-xs text-blue-900 font-semibold hover:underline"
              >
                Full Analytics →
              </button>
            </div>

            <div className="space-y-3 mt-3 text-xs">
              {recentAttempts.length === 0 ? (
                <p className="text-slate-400 text-center py-3">No test attempts recorded yet.</p>
              ) : (
                recentAttempts.slice(0, 2).map((att) => (
                  <div key={att.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">{att.testTitle}</span>
                      <span className="text-[11px] text-slate-500">
                        Accuracy: <strong className="text-emerald-700">{att.accuracy}%</strong> • Score: <strong className="text-blue-900 font-mono">{att.score}/{att.totalMarks}</strong>
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigateTab('mock-tests')}
                      className="text-xs px-2.5 py-1 rounded bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                    >
                      Re-take
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Categorized Recommended Exams & Cutoff Benchmarks */}
        <div className="space-y-6">
          {/* Categorized Recommended Examinations Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-blue-900" />
                  <span>Recommended Examinations</span>
                </h2>
                <span className="text-[10px] font-semibold text-slate-500">Curated by Profile</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Eligible opportunities based on {profile.degree || profile.educationalQualification}
              </p>
            </div>

            {/* 5 Recommendation Category Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pt-3 text-[11px] font-semibold">
              {[
                { id: 'GOVT_JOBS', label: 'Govt Jobs' },
                { id: 'ENTRANCE', label: 'Entrance' },
                { id: 'POSTGRADUATE', label: 'PG Studies' },
                { id: 'RESEARCH', label: 'Research' },
                { id: 'PROFESSIONAL', label: 'Professional' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRecCategory(tab.id as RecommendationCategory)}
                  className={`py-1 px-2 rounded-md transition text-center truncate ${
                    recCategory === tab.id
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Recommended Exams List */}
            <div className="space-y-2.5 mt-3.5">
              {recommendedByCategory[recCategory].map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => onSelectExam(ex.id)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-blue-900 cursor-pointer transition hover:bg-slate-50 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{ex.code}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      ELIGIBLE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 line-clamp-1">{ex.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>{ex.conductingBody}</span>
                    <span className="text-blue-900 font-semibold flex items-center space-x-0.5">
                      <span>Prep Hub</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Cutoff Benchmarks Widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-blue-900" />
                <span>Cutoff Benchmarks (2024–2025)</span>
              </h2>
            </div>
            <div className="divide-y divide-slate-100 text-xs mt-2">
              <div className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">UPSC CSE Prelims</p>
                  <p className="text-[10px] text-slate-400">GS Paper 1 (General)</p>
                </div>
                <span className="font-mono font-bold text-slate-900">75.41 / 200</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">SSC CGL Tier 1</p>
                  <p className="text-[10px] text-slate-400">Normalised (General)</p>
                </div>
                <span className="font-mono font-bold text-slate-900">153.28 / 200</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">GATE Computer Science</p>
                  <p className="text-[10px] text-slate-400">Qualifying Marks (General)</p>
                </div>
                <span className="font-mono font-bold text-slate-900">27.6 / 100</span>
              </div>
            </div>
            <div className="mt-3 pt-2 text-center">
              <button
                onClick={() => onNavigateTab('performance')}
                className="text-xs font-semibold text-blue-900 hover:underline"
              >
                Analyze Your Expected Score Gap →
              </button>
            </div>
          </div>

          {/* Saved Materials Widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Bookmark className="w-4 h-4 text-blue-900" />
                <span>Saved Materials ({savedMaterials.length})</span>
              </h2>
            </div>
            <div className="space-y-2 mt-2.5 text-xs">
              {savedMaterials.length === 0 ? (
                <p className="text-slate-400 text-center py-2 text-[11px]">No materials bookmarked yet.</p>
              ) : (
                savedMaterials.slice(0, 3).map((mat) => (
                  <div key={mat.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                    <span className="font-medium text-slate-800 text-[11px] truncate max-w-[180px]">{mat.title}</span>
                    <button
                      onClick={() => onSelectExam(mat.examId || 'upsc-cse')}
                      className="text-[10px] text-blue-900 font-bold hover:underline"
                    >
                      Open →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
