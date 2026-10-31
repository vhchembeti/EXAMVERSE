// client/src/views/PerformanceDashboardView.tsx
// Comprehensive Student Performance Dashboard & Analytics Suite
// Tracks cumulative CBT test attempts, accuracy metrics, weak/strong topic diagnostic clusters,
// weekly assignments, saved study materials, and cutoff gap progression.

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  BarChart2,
  RefreshCw,
  FileText,
  Target
} from 'lucide-react';
import { api } from '../services/api';
import { StudentProfile, Examination } from '../types';

interface PerformanceDashboardViewProps {
  profile: StudentProfile;
  exams: Examination[];
  onSelectExam: (examId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const PerformanceDashboardView: React.FC<PerformanceDashboardViewProps> = ({
  profile,
  exams,
  onSelectExam,
  onNavigateTab,
}) => {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [savedMaterials, setSavedMaterials] = useState<any[]>([]);
  const [weeklyAssignments, setWeeklyAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cutoff Gap Calculator State
  const [selectedExamId, setSelectedExamId] = useState<string>('upsc-cse');
  const [expectedMarks, setExpectedMarks] = useState<number>(85);
  const [gapResult, setGapResult] = useState<any | null>(null);
  const [calculatingGap, setCalculatingGap] = useState(false);

  // Phase 9: 5-to-10-Year Cutoff & Vacancy Trajectories
  const [historicalTrends, setHistoricalTrends] = useState<Record<string, any>>({});
  const [selectedTrendExam, setSelectedTrendExam] = useState<string>('upsc-cse');

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const [perfData, matsData, assignsData, trendsRes] = await Promise.all([
        api.getPerformanceAnalytics().catch(() => null),
        api.getSavedMaterials().catch(() => []),
        api.getWeeklyAssignments().catch(() => []),
        api.getHistoricalCutoffTrends().catch(() => null)
      ]);
      setAnalytics(perfData);
      setSavedMaterials(matsData || []);
      setWeeklyAssignments(assignsData || []);
      if (trendsRes && trendsRes.trends) {
        setHistoricalTrends(trendsRes.trends);
      }
    } catch (err) {
      console.error('Error loading performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const handleToggleAssignment = async (id: string) => {
    try {
      const updated = await api.toggleWeeklyAssignment(id);
      setWeeklyAssignments(updated);
    } catch (err) {
      console.error('Toggle assignment error:', err);
    }
  };

  const handleCalculateGap = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCalculatingGap(true);
      const res = await api.calculateCutoffGap(selectedExamId, expectedMarks, profile.category || 'General');
      setGapResult(res);
    } catch (err) {
      console.error('Gap calculation error:', err);
    } finally {
      setCalculatingGap(false);
    }
  };

  const metrics = analytics?.metrics || {
    totalAttempts: 1,
    avgAccuracy: 80,
    totalScoreScored: 14.68,
    totalScorePossible: 20,
    targetVelocity: 50,
    completedTargets: 2,
    totalDailyTargets: 4
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center space-x-1">
                <BarChart2 className="w-3.5 h-3.5 text-blue-900" />
                <span>Student Performance & Diagnostics</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {profile.fullName} • {profile.preferredLanguage || 'English'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Performance Analytics & Diagnostics Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Track cumulative examination test attempts, official negative penalty deductions, topic mastery diagnostics, and milestone assignments.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('mock-tests')}
              className="text-xs px-3.5 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition flex items-center space-x-1.5 shadow-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Practice CBT Mock</span>
            </button>
            <button
              onClick={fetchPerformanceData}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">CBT Tests Attempted</span>
            <strong className="text-2xl font-extrabold text-slate-900 mt-1 block">
              {metrics.totalAttempts} Tests
            </strong>
            <span className="text-[10px] text-slate-500 mt-1 block">Simulated under exam conditions</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Average Accuracy</span>
            <strong className="text-2xl font-extrabold text-blue-900 mt-1 block">
              {metrics.avgAccuracy}%
            </strong>
            <span className="text-[10px] text-emerald-700 font-medium mt-1 block">Positive net scoring ratio</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Cumulative Score Scored</span>
            <strong className="text-2xl font-extrabold text-slate-900 mt-1 block">
              {metrics.totalScoreScored} <span className="text-xs font-normal text-slate-400">/ {metrics.totalScorePossible}</span>
            </strong>
            <span className="text-[10px] text-slate-500 mt-1 block">After negative mark deductions</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Daily Target Velocity</span>
            <strong className="text-2xl font-extrabold text-emerald-700 mt-1 block">
              {metrics.targetVelocity}%
            </strong>
            <span className="text-[10px] text-slate-500 mt-1 block">{metrics.completedTargets} of {metrics.totalDailyTargets} tasks checked off</span>
          </div>
        </div>
      </div>

      {/* 2. Main Grid: Left Recent Attempts & Topics + Right Cutoff Gap & Weekly Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Attempts & Diagnostics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Test Attempts History */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-blue-900" />
                  <span>Recent Examination Test Attempts</span>
                </h2>
                <p className="text-xs text-slate-500">Record of simulated CBT tests with negative penalty deductions.</p>
              </div>
              <button
                onClick={() => onNavigateTab('mock-tests')}
                className="text-xs text-blue-900 font-semibold hover:underline"
              >
                All Mock Tests →
              </button>
            </div>

            <div className="space-y-3">
              {(analytics?.attempts || []).length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No mock test attempts recorded yet. Attempt a test from the Mock Tests tab to view your score breakdown.
                </div>
              ) : (
                (analytics?.attempts || []).map((att: any) => (
                  <div key={att.id} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-white shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{att.testTitle}</span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Submitted on {new Date(att.submittedAt).toLocaleDateString()} at {new Date(att.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 font-mono">
                          Score: {att.score} / {att.totalMarks}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          {att.accuracy}% Accuracy
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Correct:</span>
                        <strong className="text-emerald-700">{att.correctCount} Questions</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Incorrect (Penalty):</span>
                        <strong className="text-rose-700">{att.incorrectCount} Questions</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Unattempted:</span>
                        <strong className="text-slate-700">{att.unattemptedCount} Questions</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Time Taken:</span>
                        <strong className="text-slate-700">{Math.round(att.timeTakenSeconds / 60)} mins</strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Topic Mastery Diagnostics (Strong vs Priority Improvement) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Topic Mastery & Sectional Diagnostics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <h3 className="font-bold text-emerald-950 mb-2 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>High Accuracy Subject Clusters</span>
                </h3>
                <ul className="space-y-1.5 text-slate-700">
                  {(analytics?.strongTopics || ['Indian Polity', 'Geography', 'Economy', 'Algorithms']).map((t: string, i: number) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
                <h3 className="font-bold text-rose-950 mb-2 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  <span>Priority Weak Areas (Frequent Penalties)</span>
                </h3>
                <ul className="space-y-1.5 text-slate-700">
                  {(analytics?.weakTopics || ['Environment & Ecology', 'Current Affairs Chronology']).map((t: string, i: number) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-2 border-t border-rose-200/60">
                  <button
                    onClick={() => onNavigateTab('ai-tutor')}
                    className="text-xs font-semibold text-rose-900 hover:underline flex items-center space-x-1"
                  >
                    <span>Request AI Concept Revision for Weak Areas →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Official 5-to-10-Year Cutoff & Vacancy Trajectories */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                    Official Gazette Trends
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    5–10 Year Trajectory
                  </span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 mt-1">
                  Cutoff & Vacancy Historical Progression
                </h2>
              </div>

              {/* Selector */}
              <div className="flex rounded-lg border border-slate-300 p-0.5 bg-slate-50 text-xs">
                {Object.keys(historicalTrends).length > 0 ? (
                  Object.entries(historicalTrends).map(([key, val]: [string, any]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTrendExam(key)}
                      className={`px-2.5 py-1 rounded font-medium transition text-[11px] ${
                        selectedTrendExam === key
                          ? 'bg-blue-900 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {val.examId.toUpperCase()}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 p-1">Loading...</span>
                )}
              </div>
            </div>

            {/* Trajectory Table */}
            {historicalTrends[selectedTrendExam] && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold">{historicalTrends[selectedTrendExam].examTitle}</span>
                  <span className="text-[11px] text-slate-500">{historicalTrends[selectedTrendExam].conductingBody}</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <tr>
                        <th className="px-3 py-2">Year</th>
                        <th className="px-3 py-2">Vacancies</th>
                        <th className="px-3 py-2">Cutoff (General / Prelims)</th>
                        <th className="px-3 py-2">Cutoff (Mains / OBC / SC)</th>
                        <th className="px-3 py-2">Statutory Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {historicalTrends[selectedTrendExam].trajectory.map((row: any, rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-slate-50/80">
                          <td className="px-3 py-2 font-bold text-slate-900">{row.year}</td>
                          <td className="px-3 py-2 text-slate-700">{row.vacancies ? row.vacancies.toLocaleString() : '—'}</td>
                          <td className="px-3 py-2 text-indigo-700 font-bold">
                            {row.prelimsCutoffGen ?? row.qualifyingGen ?? row.tier1CutoffGen ?? '—'}
                          </td>
                          <td className="px-3 py-2 text-slate-600">
                            {row.mainsCutoffGen !== undefined
                              ? `Mains: ${row.mainsCutoffGen}`
                              : row.qualifyingObc !== undefined
                              ? `OBC: ${row.qualifyingObc} / SC: ${row.qualifyingScSt}`
                              : '—'}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                row.status === 'HISTORICAL'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[10px] text-slate-400 italic">
                  Citation Source: {historicalTrends[selectedTrendExam].citation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Cutoff Gap Calculator & Weekly Assignments */}
        <div className="space-y-6">
          {/* Smart Cutoff Gap Calculator Widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Target className="w-4 h-4 text-blue-900" />
                <span>Statutory Cutoff Gap Analyzer</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Compare your target marks against official qualifying thresholds.
              </p>
            </div>

            <form onSubmit={handleCalculateGap} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Examination</label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-xs bg-white"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.code} - {ex.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Expected Score</label>
                <input
                  type="number"
                  step="0.5"
                  value={expectedMarks}
                  onChange={(e) => setExpectedMarks(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-xs"
                  placeholder="e.g. 85"
                />
              </div>

              <button
                type="submit"
                disabled={calculatingGap}
                className="w-full py-2 rounded-lg bg-blue-900 text-white font-semibold text-xs hover:bg-blue-800 transition flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <span>{calculatingGap ? 'Calculating...' : 'Calculate Score Gap'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {gapResult && (
              <div
                className={`p-3.5 rounded-lg border text-xs animate-in fade-in ${
                  gapResult.scoreGap >= 0
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/60 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Benchmark Cutoff ({gapResult.historicalCutoffYear}):</span>
                  <span className="font-mono">{gapResult.historicalCutoff} Marks</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span>Score Delta:</span>
                  <span className={`font-mono text-sm ${gapResult.scoreGap >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {gapResult.scoreGap >= 0 ? `+${gapResult.scoreGap}` : gapResult.scoreGap} Marks
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                  {gapResult.targetRecommendation}
                </p>
              </div>
            )}
          </div>

          {/* Weekly Assignments & Milestones */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-blue-900" />
                <span>Weekly Preparation Assignments</span>
              </h2>
            </div>

            <div className="space-y-2 text-xs">
              {weeklyAssignments.map((wa) => (
                <div
                  key={wa.id}
                  onClick={() => handleToggleAssignment(wa.id)}
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
                      Deadline: {wa.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookmarked Standard Materials */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Bookmark className="w-4 h-4 text-blue-900" />
                <span>Saved Materials ({savedMaterials.length})</span>
              </h2>
            </div>

            <div className="space-y-2 text-xs">
              {savedMaterials.length === 0 ? (
                <p className="text-[11px] text-slate-400 py-2 text-center">No materials bookmarked yet.</p>
              ) : (
                savedMaterials.map((mat) => (
                  <div key={mat.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800 block text-[11px] line-clamp-1">{mat.title}</span>
                      <span className="text-[10px] text-slate-400">{mat.type || 'Study Note'} • {mat.examId}</span>
                    </div>
                    <button
                      onClick={() => onSelectExam(mat.examId)}
                      className="text-[10px] text-blue-900 font-semibold hover:underline flex-shrink-0 ml-2"
                    >
                      Open
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
