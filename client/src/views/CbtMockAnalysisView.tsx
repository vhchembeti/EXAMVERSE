// client/src/views/CbtMockAnalysisView.tsx
// Comprehensive Post-Test CBT Telemetry & Performance Diagnostic View
// Accuracy breakdown, negative-marking penalty loss, time wasted on errors, and weak topic remediation

import React, { useState } from 'react';
import {
  Trophy,
  AlertCircle,
  Clock,
  TrendingDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  BookOpen,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface CbtAnalysisProps {
  telemetry: any;
  onRetake: () => void;
  onGoToPlanner: (weakTopics: any[]) => void;
  onExit: () => void;
}

export const CbtMockAnalysisView: React.FC<CbtAnalysisProps> = ({
  telemetry,
  onRetake,
  onGoToPlanner,
  onExit
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'CORRECT' | 'INCORRECT' | 'UNATTEMPTED'>('ALL');

  if (!telemetry || !telemetry.summary) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Telemetry Available</h2>
        <p className="text-xs text-slate-500 mb-6">Complete a CBT mock test to view detailed performance telemetry.</p>
        <button
          onClick={onExit}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs transition"
        >
          Return to Mock Test Hub
        </button>
      </div>
    );
  }

  const { summary, questionEvaluations = [], subjectBreakdown = [] } = telemetry;

  const filteredQuestions = questionEvaluations.filter((q: any) => {
    if (filterType === 'CORRECT') return q.isCorrect;
    if (filterType === 'INCORRECT') return q.isAttempted && !q.isCorrect;
    if (filterType === 'UNATTEMPTED') return !q.isAttempted;
    return true;
  });

  const allWeakTopics = subjectBreakdown.flatMap((s: any) => s.weakTopics || []);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}m ${remaining}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Examination Completed & Evaluated
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {telemetry.title || 'CBT Mock Performance Diagnostic'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated under strict TCS iON / GATE marking parameters on {new Date(telemetry.evaluatedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRetake}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-4 h-4 text-indigo-600" /> Retake Test
            </button>
            <button
              onClick={() => onGoToPlanner(allWeakTopics)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-100 transition"
            >
              <Calendar className="w-4 h-4" /> Knapsack Study Planner
            </button>
          </div>
        </div>

        {/* Primary Metric Scorecards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Raw Score */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Score</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              {summary.rawScore} <span className="text-sm font-normal text-slate-400">/ {summary.maxScore}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Percentage: <strong className="text-slate-800">{summary.percentage}%</strong>
            </div>
          </div>

          {/* 2. Accuracy */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accuracy Rate</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-indigo-600 font-mono">
              {summary.accuracyRate}%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {summary.correctCount} Correct of {summary.attemptedCount} Attempted
            </div>
          </div>

          {/* 3. Negative Marking Loss */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Negative Penalty Loss</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-rose-600 font-mono">
              -{summary.negativePenaltyTotal} <span className="text-sm font-normal text-slate-400">Marks</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Potential score without penalty: <strong className="text-slate-800">{(summary.rawScore + summary.negativePenaltyTotal).toFixed(2)}</strong>
            </div>
          </div>

          {/* 4. Time Wasted on Errors */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time on Incorrect</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-600 font-mono">
              {formatSeconds(summary.timeWastedOnIncorrectSeconds)}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Total exam time: {formatSeconds(summary.totalTimeSpentSeconds)}
            </div>
          </div>
        </div>

        {/* Weak Topics Callout Card */}
        {allWeakTopics.length > 0 && (
          <div className="bg-amber-50/80 rounded-3xl p-6 border border-amber-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>Identified Priority Weak Topics ({allWeakTopics.length})</span>
              </div>
              <button
                onClick={() => onGoToPlanner(allWeakTopics)}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 transition shadow-sm"
              >
                Auto-Schedule Revision <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allWeakTopics.map((wt: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-slate-800 truncate mr-2">{wt.topic}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[11px] font-bold font-mono">
                    {wt.accuracy}% Acc
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subject Breakdown Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" /> Section & Domain Accuracy Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Subject / Domain</th>
                  <th className="pb-3 text-center">Questions</th>
                  <th className="pb-3 text-center">Attempted</th>
                  <th className="pb-3 text-center">Correct</th>
                  <th className="pb-3 text-center">Incorrect</th>
                  <th className="pb-3 text-center">Accuracy</th>
                  <th className="pb-3 text-right">Score Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjectBreakdown.map((subj: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 font-semibold text-slate-900">{subj.subject}</td>
                    <td className="py-3 text-center font-mono text-slate-600">{subj.totalQuestions}</td>
                    <td className="py-3 text-center font-mono text-slate-600">{subj.attempted}</td>
                    <td className="py-3 text-center font-mono text-emerald-600 font-bold">{subj.correct}</td>
                    <td className="py-3 text-center font-mono text-rose-600 font-bold">{subj.incorrect}</td>
                    <td className="py-3 text-center font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          subj.accuracy >= 70
                            ? 'bg-emerald-50 text-emerald-700'
                            : subj.accuracy >= 50
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {subj.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900">
                      {subj.scoreEarned} / {subj.maxScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Question Review & Filter */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Question-by-Question Solution Dossier
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review official answer keys, candidate selections, marking deductions, and detailed explanations
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {(['ALL', 'CORRECT', 'INCORRECT', 'UNATTEMPTED'] as const).map((ft) => (
                <button
                  key={ft}
                  onClick={() => setFilterType(ft)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterType === ft
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {ft}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q: any) => (
              <div
                key={q.questionId}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono">Q{q.questionId}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold font-mono uppercase">
                      {q.qType}
                    </span>
                    <span className="text-slate-500">{q.subject} • {q.topic}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.isCorrect ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> +{q.marksAwarded} Marks
                      </span>
                    ) : q.isAttempted ? (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> {q.marksAwarded} Marks
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-600 font-semibold">
                        Unattempted (0 Marks)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                  {q.explanation ? (
                    <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
                      <span className="text-[11px] font-bold text-indigo-600 block uppercase tracking-wider">
                        Official Pedagogical Solution & Analysis:
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">{q.explanation}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
