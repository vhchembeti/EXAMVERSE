// client/src/views/MockTestsView.tsx
// Smart Mock Test Practice Engine
// Features timed test simulator, question palette, negative marking penalty calculator,
// and post-test analytics with topic accuracy breakdown and detailed step-by-step solutions.

import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  BarChart2,
  ChevronRight,
  ChevronLeft,
  Check,
  Flag,
  Filter,
  Sparkles
} from 'lucide-react';
import { MockTest, TestAttemptResult } from '../types';
import { api } from '../services/api';

interface MockTestsViewProps {
  initialTestId?: string;
  onNavigateTab: (tab: string) => void;
  onLaunchCbt?: (testId: string) => void;
}

export const MockTestsView: React.FC<MockTestsViewProps> = ({
  initialTestId,
  onNavigateTab,
  onLaunchCbt,
}) => {
  const [testsList, setTestsList] = useState<MockTest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(initialTestId || null);
  const [activeTest, setActiveTest] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'FULL' | 'SECTIONAL'>('ALL');

  // Active Test State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [key: number]: boolean }>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [testInProgress, setTestInProgress] = useState(false);
  const [attemptResult, setAttemptResult] = useState<TestAttemptResult | null>(null);

  // Load available tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const list = await api.getMockTests();
        setTestsList(list);
        if (initialTestId) {
          loadTest(initialTestId);
        }
      } catch (err) {
        console.error('Failed to load mock tests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [initialTestId]);

  const loadTest = async (testId: string) => {
    try {
      setLoading(true);
      const data = await api.getMockTestById(testId);
      setActiveTest(data);
      setSelectedTestId(testId);
      setUserAnswers({});
      setMarkedForReview({});
      setCurrentQuestionIndex(0);
      setAttemptResult(null);
      setTimeLeftSeconds(data.timeLimitMinutes * 60);
      setTestInProgress(false);
    } catch (err) {
      console.error('Failed to load test details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReview = (qId: number) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Timer countdown
  useEffect(() => {
    let timer: any = null;
    if (testInProgress && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testInProgress, timeLeftSeconds]);

  const handleStartTest = () => {
    setTestInProgress(true);
    setAttemptResult(null);
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    try {
      setLoading(true);
      setTestInProgress(false);
      const totalSeconds = activeTest.timeLimitMinutes * 60;
      const timeTaken = totalSeconds - timeLeftSeconds;
      const result = await api.submitMockTest(activeTest.id, {
        userAnswers,
        timeTakenSeconds: timeTaken,
      });
      setAttemptResult(result);
    } catch (err) {
      console.error('Error submitting test:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Test Engine Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-blue-900" />
                <span>Simulated CBT Engine</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Official Exam Marking & Negative Penalties</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Smart Mock Test Examination System
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Real examination practice adhering to official negative marking, timed question pallets, and post-test diagnostic analytics.
            </p>
          </div>

          {/* Test Selector Tabs & Category Filters */}
          {!testInProgress && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCategoryFilter('ALL')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    categoryFilter === 'ALL'
                      ? 'bg-white text-blue-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Tests ({testsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('FULL')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    categoryFilter === 'FULL'
                      ? 'bg-white text-blue-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Full Mocks ({testsList.filter((t: any) => !t.subject && !t.topic).length})
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('SECTIONAL')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    categoryFilter === 'SECTIONAL'
                      ? 'bg-white text-blue-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Subject Drills ({testsList.filter((t: any) => t.subject || t.topic).length})
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Paper:</label>
                <select
                  value={selectedTestId || ''}
                  onChange={(e) => loadTest(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
                >
                  {testsList
                    .filter((t: any) => {
                      if (categoryFilter === 'FULL') return !t.subject && !t.topic;
                      if (categoryFilter === 'SECTIONAL') return t.subject || t.topic;
                      return true;
                    })
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test In Progress CBT Environment */}
      {activeTest && testInProgress && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Question Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">
                    Question {currentQuestionIndex + 1} of {activeTest.questions.length}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                    {activeTest.questions[currentQuestionIndex].subject}
                  </span>
                  <span className="text-slate-500 font-medium">
                    ({activeTest.questions[currentQuestionIndex].topic})
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-emerald-700 font-bold">+{activeTest.positiveMarks}</span>
                  <span className="text-rose-700 font-bold">-{activeTest.negativeMarks}</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="py-6">
                <p className="text-sm font-semibold text-slate-900 leading-relaxed whitespace-pre-wrap">
                  {activeTest.questions[currentQuestionIndex].question}
                </p>

                {/* Multiple Choice Options */}
                <div className="mt-6 space-y-3">
                  {activeTest.questions[currentQuestionIndex].options.map((option: string, optIdx: number) => {
                    const qId = activeTest.questions[currentQuestionIndex].id;
                    const isSelected = userAnswers[qId] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(qId, optIdx)}
                        className={`p-3.5 rounded-lg border text-xs cursor-pointer transition flex items-center space-x-3 ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-900 font-semibold text-blue-950 ring-1 ring-blue-900'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isSelected ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{option}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Question Navigation Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition disabled:opacity-40 flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const qId = activeTest.questions[currentQuestionIndex].id;
                    handleToggleReview(qId);
                  }}
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition ${
                    markedForReview[activeTest.questions[currentQuestionIndex].id]
                      ? 'bg-purple-100 border-purple-400 text-purple-900'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${markedForReview[activeTest.questions[currentQuestionIndex].id] ? 'text-purple-700 fill-purple-700' : 'text-slate-400'}`} />
                  <span>{markedForReview[activeTest.questions[currentQuestionIndex].id] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>

                <button
                  onClick={() => {
                    const qId = activeTest.questions[currentQuestionIndex].id;
                    const copy = { ...userAnswers };
                    delete copy[qId];
                    setUserAnswers(copy);
                  }}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition"
                >
                  Clear Selection
                </button>

                {currentQuestionIndex < activeTest.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition flex items-center space-x-1"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition"
                  >
                    Submit Test Paper
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Question Palette & Timer (1 Col) */}
          <div className="space-y-4">
            {/* Countdown Timer Widget */}
            <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-300" />
                <span className="text-xs font-semibold text-slate-300">Time Remaining:</span>
              </div>
              <span className="font-mono text-lg font-bold text-amber-400">
                {formatTime(timeLeftSeconds)}
              </span>
            </div>

            {/* Question Status Palette */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
                Question Palette
              </h3>
              <div className="grid grid-cols-5 gap-2 text-xs">
                {activeTest.questions.map((q: any, idx: number) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isMarked = !!markedForReview[q.id];
                  const isCurrent = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-8 rounded font-semibold text-xs transition relative flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-blue-900 font-extrabold'
                          : ''
                      } ${
                        isMarked
                          ? 'bg-purple-600 text-white'
                          : isAnswered
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                      {isMarked && isAnswered && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-300 ring-1 ring-white" title="Answered & Marked for Review" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span>
                  <span>Answered ({Object.keys(userAnswers).length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-purple-600 relative flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                  </span>
                  <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300"></span>
                  <span>Unanswered ({activeTest.questions.length - Object.keys(userAnswers).length})</span>
                </div>
              </div>

              <button
                onClick={handleSubmitTest}
                className="w-full mt-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
              >
                Submit Exam Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Launch Screen (Pre-Test) */}
      {activeTest && !testInProgress && !attemptResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs max-w-2xl mx-auto text-xs space-y-5">
          <div className="text-center pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">{activeTest.title}</h2>
            <p className="text-slate-500 mt-1">Standard Simulated CBT Examination</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Questions</span>
              <strong className="text-slate-800 text-sm">{activeTest.questions.length}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Time Limit</span>
              <strong className="text-slate-800 text-sm">{activeTest.timeLimitMinutes} Mins</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Marks</span>
              <strong className="text-slate-800 text-sm">{activeTest.totalMarks}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Marking</span>
              <strong className="text-slate-800 text-sm">+{activeTest.positiveMarks} / -{activeTest.negativeMarks}</strong>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900">Official Instructions:</h3>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li>The clock in the top right corner will display the remaining time.</li>
              <li>Each incorrect answer carries a negative penalty of {activeTest.negativeMarks} marks.</li>
              <li>Do not refresh or navigate away from the browser during the test.</li>
              <li>Detailed solutions and step-by-step explanations will be generated instantly after submission.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onLaunchCbt ? onLaunchCbt(activeTest.id) : handleStartTest()}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-700 to-indigo-900 text-white font-bold hover:from-indigo-600 hover:to-indigo-800 transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Full CBT Simulation (TCS iON)</span>
            </button>
            <button
              onClick={handleStartTest}
              className="py-3 px-4 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
            >
              <Play className="w-4 h-4" />
              <span>Quick Practice Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* Post-Test Comprehensive Diagnostic Report */}
      {attemptResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Diagnostic Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Attempt Evaluated
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{attemptResult.testTitle}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Completed in {Math.round(attemptResult.timeTakenSeconds / 60)} minutes
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => loadTest(attemptResult.testId)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50 transition flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Test</span>
                </button>
              </div>
            </div>

            {/* Scorecard Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-400 font-semibold block">Total Score</span>
                <span className="text-2xl font-extrabold text-blue-900 font-mono mt-1 block">
                  {attemptResult.score} / {attemptResult.totalMarks}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-400 font-semibold block">Accuracy Rate</span>
                <span className="text-2xl font-extrabold text-emerald-700 font-mono mt-1 block">
                  {attemptResult.accuracy}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-400 font-semibold block">Correct Responses</span>
                <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
                  {attemptResult.correctCount}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-400 font-semibold block">Negative Deductions</span>
                <span className="text-2xl font-extrabold text-rose-600 font-mono mt-1 block">
                  {attemptResult.incorrectCount}
                </span>
              </div>
            </div>

            {/* Strengths & Weaknesses Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-xs">
              <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-1 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Strong Topics</span>
                </h4>
                <ul className="space-y-1 text-slate-700 mt-2">
                  {attemptResult.strongTopics && attemptResult.strongTopics.length > 0 ? (
                    attemptResult.strongTopics.map((t, idx) => <li key={idx}>• {t}</li>)
                  ) : (
                    <li>Keep practicing to establish high accuracy clusters.</li>
                  )}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-200">
                <h4 className="font-bold text-rose-900 mb-1 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  <span>Priority Improvement Areas</span>
                </h4>
                <ul className="space-y-1 text-slate-700 mt-2">
                  {attemptResult.weakTopics && attemptResult.weakTopics.length > 0 ? (
                    attemptResult.weakTopics.map((t, idx) => <li key={idx}>• {t}</li>)
                  ) : (
                    <li>Great job! Zero incorrect answers.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Full Question-by-Question Detailed Solutions Review */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Detailed Question Solutions & Conceptual Explanations
            </h3>

            <div className="space-y-4">
              {attemptResult.detailedResults?.map((q, idx) => (
                <div
                  key={q.questionId}
                  className={`p-4 rounded-lg border text-xs ${
                    q.isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-2 font-semibold">
                    <span className="text-slate-800">Question {idx + 1} ({q.subject} • {q.topic})</span>
                    {q.isCorrect ? (
                      <span className="text-emerald-700 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>CORRECT</span>
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold flex items-center space-x-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>INCORRECT</span>
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-slate-900 mb-3 whitespace-pre-wrap">{q.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, oIdx) => {
                      const isUserChoice = q.selectedOptionIndex === oIdx;
                      const isCorrectChoice = q.correctOptionIndex === oIdx;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2 rounded border text-[11px] flex items-center space-x-2 ${
                            isCorrectChoice
                              ? 'bg-emerald-100 border-emerald-300 font-bold text-emerald-950'
                              : isUserChoice
                              ? 'bg-rose-100 border-rose-300 font-bold text-rose-950'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Step-by-Step Explanation Box */}
                  <div className="p-3 bg-white rounded-md border border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                    <strong className="text-blue-900 block mb-0.5">Step-by-Step Solution & Rationale:</strong>
                    <p>{q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
