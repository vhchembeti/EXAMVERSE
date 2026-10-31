// client/src/views/CbtMockPlayerView.tsx
// Authentic TCS iON / GATE / NTA Computer-Based Test (CBT) Mock Player
// Full-screen simulation with 5-state question palette, non-programmable virtual calculator, and MCQ/MSQ/NAT inputs

import React, { useState, useEffect } from 'react';
import {
  Calculator as CalcIcon,
  Clock,
  HelpCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Send,
  ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';
import { VirtualScientificCalculator } from '../components/VirtualScientificCalculator';

interface CbtPlayerProps {
  testId: string;
  onExit: () => void;
  onFinish: (telemetry: any) => void;
}

type QuestionState =
  | 'NOT_VISITED'
  | 'NOT_ANSWERED'
  | 'ANSWERED'
  | 'MARKED_FOR_REVIEW'
  | 'ANSWERED_AND_MARKED_FOR_REVIEW';

export const CbtMockPlayerView: React.FC<CbtPlayerProps> = ({ testId, onExit, onFinish }) => {
  const [test, setTest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Candidate progress state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSectionId, setCurrentSectionId] = useState<string>('');
  const [candidateAnswers, setCandidateAnswers] = useState<Record<number, {
    state: QuestionState;
    selectedOption?: number | null;
    selectedOptions?: number[];
    numericAnswer?: string;
    timeSpentSeconds: number;
  }>>({});

  // Timers & Modals
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTest();
  }, [testId]);

  // Main countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0 || !test) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });

      // Track time on current question
      if (test && test.questions && test.questions[currentQuestionIndex]) {
        const qId = test.questions[currentQuestionIndex].id;
        setCandidateAnswers((prev) => {
          const currentAns = prev[qId] || { state: 'NOT_ANSWERED', timeSpentSeconds: 0 };
          return {
            ...prev,
            [qId]: {
              ...currentAns,
              timeSpentSeconds: (currentAns.timeSpentSeconds || 0) + 1
            }
          };
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, test, currentQuestionIndex]);

  const loadTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMockTestById(testId);
      setTest(data);
      setSecondsRemaining((data.timeLimitMinutes || 20) * 60);

      // Initialize default question states
      const initialMap: Record<number, any> = {};
      (data.questions || []).forEach((q: any, idx: number) => {
        initialMap[q.id] = {
          state: idx === 0 ? 'NOT_ANSWERED' : 'NOT_VISITED',
          selectedOption: null,
          selectedOptions: [],
          numericAnswer: '',
          timeSpentSeconds: 0
        };
      });
      setCandidateAnswers(initialMap);

      if (data.sections && data.sections.length > 0) {
        setCurrentSectionId(data.sections[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load CBT examination');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = () => {
    alert('Time has expired! Your responses are being submitted automatically.');
    handleSubmitExam();
  };

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium tracking-wide">Initializing Secure CBT Examination Session...</p>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold mb-2">Examination Error</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'Test not found'}</p>
        <button
          onClick={onExit}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm transition"
        >
          Return to Mock Test Hub
        </button>
      </div>
    );
  }

  const currentQ = test.questions[currentQuestionIndex];
  const currentAnswer = candidateAnswers[currentQ?.id] || {
    state: 'NOT_VISITED',
    timeSpentSeconds: 0
  };

  const hasAnswer =
    (currentQ?.type === 'MSQ' && (currentAnswer.selectedOptions || []).length > 0) ||
    (currentQ?.type === 'NAT' && (currentAnswer.numericAnswer || '').trim() !== '') ||
    (currentQ?.type === 'MCQ' && currentAnswer.selectedOption !== null && currentAnswer.selectedOption !== undefined);

  // Navigate to question and mark visited
  const goToQuestion = (index: number) => {
    if (index < 0 || index >= test.questions.length) return;
    const targetQ = test.questions[index];
    setCandidateAnswers((prev) => {
      const existing = prev[targetQ.id];
      if (existing && existing.state === 'NOT_VISITED') {
        return {
          ...prev,
          [targetQ.id]: { ...existing, state: 'NOT_ANSWERED' }
        };
      }
      return prev;
    });
    setCurrentQuestionIndex(index);
    if (targetQ.sectionId) {
      setCurrentSectionId(targetQ.sectionId);
    }
  };

  // 1. Save & Next -> state becomes ANSWERED (or stays NOT_ANSWERED if empty)
  const handleSaveAndNext = () => {
    const qId = currentQ.id;
    setCandidateAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        state: hasAnswer ? 'ANSWERED' : 'NOT_ANSWERED'
      }
    }));
    if (currentQuestionIndex < test.questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  // 2. Mark for Review & Next -> state becomes ANSWERED_AND_MARKED_FOR_REVIEW if has answer, else MARKED_FOR_REVIEW
  const handleMarkForReviewAndNext = () => {
    const qId = currentQ.id;
    setCandidateAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        state: hasAnswer ? 'ANSWERED_AND_MARKED_FOR_REVIEW' : 'MARKED_FOR_REVIEW'
      }
    }));
    if (currentQuestionIndex < test.questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  // 3. Clear Response
  const handleClearResponse = () => {
    const qId = currentQ.id;
    setCandidateAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        state: 'NOT_ANSWERED',
        selectedOption: null,
        selectedOptions: [],
        numericAnswer: ''
      }
    }));
  };

  // Update MCQ option
  const handleSelectMcq = (optIdx: number) => {
    const qId = currentQ.id;
    setCandidateAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        selectedOption: optIdx
      }
    }));
  };

  // Update MSQ option
  const handleToggleMsq = (optIdx: number) => {
    const qId = currentQ.id;
    const currentList = currentAnswer.selectedOptions || [];
    const exists = currentList.includes(optIdx);
    const updated = exists ? currentList.filter((x) => x !== optIdx) : [...currentList, optIdx];
    setCandidateAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        selectedOptions: updated
      }
    }));
  };

  // Update NAT virtual keypad input
  const handleNatKey = (char: string) => {
    const qId = currentQ.id;
    const curr = currentAnswer.numericAnswer || '';
    if (char === 'CLEAR') {
      setCandidateAnswers((prev) => ({
        ...prev,
        [qId]: { ...prev[qId], numericAnswer: '' }
      }));
    } else if (char === 'BACK') {
      setCandidateAnswers((prev) => ({
        ...prev,
        [qId]: { ...prev[qId], numericAnswer: curr.slice(0, -1) }
      }));
    } else if (char === '.') {
      if (!curr.includes('.')) {
        setCandidateAnswers((prev) => ({
          ...prev,
          [qId]: { ...prev[qId], numericAnswer: (curr || '0') + '.' }
        }));
      }
    } else if (char === '-') {
      if (curr.startsWith('-')) {
        setCandidateAnswers((prev) => ({
          ...prev,
          [qId]: { ...prev[qId], numericAnswer: curr.slice(1) }
        }));
      } else {
        setCandidateAnswers((prev) => ({
          ...prev,
          [qId]: { ...prev[qId], numericAnswer: '-' + curr }
        }));
      }
    } else {
      setCandidateAnswers((prev) => ({
        ...prev,
        [qId]: { ...prev[qId], numericAnswer: curr + char }
      }));
    }
  };

  // Final submission
  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.submitCbtMockTest(test.id, candidateAnswers);
      if (response && response.telemetry) {
        onFinish(response.telemetry);
      } else {
        onExit();
      }
    } catch (err) {
      console.error('Error submitting CBT exam:', err);
      alert('Error submitting examination. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
    }
  };

  // State tally counts
  const tally = Object.values(candidateAnswers).reduce(
    (acc, curr) => {
      acc[curr.state] = (acc[curr.state] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-100 flex flex-col select-none overflow-hidden font-sans">
      {/* Top Banner & Header */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Exit Mock"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white truncate max-w-md sm:max-w-xl">
              {test.title}
            </h1>
            <p className="text-[10px] text-slate-400">
              Official TCS iON / GATE Computer-Based Test Simulation Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Virtual Calculator Button */}
          {test.hasVirtualCalculator && (
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 text-indigo-300 border border-indigo-700/60 hover:bg-indigo-900 transition text-xs font-semibold"
            >
              <CalcIcon className="w-4 h-4 text-emerald-400" />
              <span>Scientific Calculator</span>
            </button>
          )}

          {/* Instructions */}
          <button
            onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition text-xs"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Instructions</span>
          </button>

          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-bold tracking-wider border ${
              secondsRemaining < 300
                ? 'bg-rose-950/80 text-rose-300 border-rose-700 animate-pulse'
                : 'bg-slate-800 text-emerald-400 border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>
        </div>
      </header>

      {/* Section Selector Tab (If Multi-Section) */}
      {test.sections && test.sections.length > 0 && (
        <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">
            Sections:
          </span>
          {test.sections.map((sec: any) => {
            const isActive = currentSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setCurrentSectionId(sec.id);
                  if (sec.questionIds && sec.questionIds.length > 0) {
                    const firstIdx = test.questions.findIndex((q: any) => q.id === sec.questionIds[0]);
                    if (firstIdx !== -1) goToQuestion(firstIdx);
                  }
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sec.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Examination Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Area: Question Viewer & Answer Keypad */}
        <main className="flex-1 flex flex-col border-r border-slate-800 overflow-y-auto">
          {/* Question Subheader */}
          <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-sm">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                  currentQ?.type === 'MSQ'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : currentQ?.type === 'NAT'
                    ? 'bg-purple-950 text-purple-300 border border-purple-800'
                    : 'bg-blue-950 text-blue-300 border border-blue-800'
                }`}
              >
                {currentQ?.type || 'MCQ'}
              </span>
              <span className="text-slate-400">
                {currentQ?.subject} • {currentQ?.topic}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold font-mono">
                +{currentQ?.marks || 1} Marks
              </span>
              <span className="text-rose-400 font-semibold font-mono">
                {currentQ?.type === 'MSQ' || currentQ?.type === 'NAT'
                  ? '0 Penalty'
                  : currentQ?.marks === 2
                  ? '-0.67 Penalty'
                  : '-0.33 Penalty'}
              </span>
            </div>
          </div>

          {/* Question Content Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
              {currentQ?.question}
            </div>

            {/* Answer Input Area based on Type */}
            <div className="pt-4 border-t border-slate-800/80">
              {currentQ?.type === 'MCQ' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Choose 1 Correct Option:
                  </span>
                  {currentQ.options?.map((opt: string, idx: number) => {
                    const isSelected = currentAnswer.selectedOption === idx;
                    return (
                      <label
                        key={idx}
                        onClick={() => handleSelectMcq(idx)}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQ.id}`}
                          checked={isSelected}
                          onChange={() => handleSelectMcq(idx)}
                          className="mt-0.5 accent-indigo-500"
                        />
                        <span className="text-xs font-bold font-mono text-indigo-400 w-5">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQ?.type === 'MSQ' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Select All Correct Options (MSQ - Zero Partial Credit):
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {(currentAnswer.selectedOptions || []).length} selected
                    </span>
                  </div>
                  {currentQ.options?.map((opt: string, idx: number) => {
                    const isSelected = (currentAnswer.selectedOptions || []).includes(idx);
                    return (
                      <label
                        key={idx}
                        onClick={() => handleToggleMsq(idx)}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                            : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleMsq(idx)}
                          className="mt-0.5 accent-amber-500"
                        />
                        <span className="text-xs font-bold font-mono text-amber-400 w-5">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQ?.type === 'NAT' && (
                <div className="space-y-4 max-w-sm">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                    Numerical Answer Type (Use Virtual Keypad):
                  </span>

                  <div className="p-3 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xl font-bold text-emerald-400 text-right min-h-[48px] flex items-center justify-end">
                    {currentAnswer.numericAnswer || (
                      <span className="text-slate-600 text-sm font-normal">Enter numeric value...</span>
                    )}
                  </div>

                  {/* Virtual Numeric Keypad */}
                  <div className="grid grid-cols-4 gap-2 text-sm font-bold font-mono">
                    {['7', '8', '9', 'BACK', '4', '5', '6', 'CLEAR', '1', '2', '3', '-', '0', '.'].map(
                      (key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleNatKey(key)}
                          className={`p-3 rounded-lg border transition ${
                            key === 'CLEAR'
                              ? 'bg-rose-950 text-rose-300 border-rose-800 hover:bg-rose-900 col-span-1'
                              : key === 'BACK'
                              ? 'bg-amber-950 text-amber-300 border-amber-800 hover:bg-amber-900 col-span-1'
                              : key === '0'
                              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white col-span-2'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                          }`}
                        >
                          {key === 'BACK' ? '⌫' : key}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <footer className="h-16 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-4 py-2.5 rounded-xl bg-purple-900/60 text-purple-200 border border-purple-700 hover:bg-purple-800 transition font-semibold"
              >
                Mark for Review & Next
              </button>
              <button
                onClick={handleClearResponse}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition font-semibold"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={handleSaveAndNext}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition font-semibold flex items-center gap-1 shadow-lg shadow-emerald-950"
              >
                Save & Next <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition font-bold shadow-lg shadow-indigo-950"
              >
                Submit Exam
              </button>
            </div>
          </footer>
        </main>

        {/* Right Palette: Candidate Card & 5-State TCS iON Legend */}
        <aside className="w-80 bg-slate-950 p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Candidate Header */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                ST
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white">Student Candidate</div>
                <div className="text-[10px] text-slate-400 font-mono">Roll: 2026-GATE-0914</div>
              </div>
            </div>

            {/* TCS iON 5-State Legend */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-[11px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Question Palette Legend
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-slate-700 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                    {tally['NOT_VISITED'] || 0}
                  </span>
                  <span className="text-slate-400">Not Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                    {tally['NOT_ANSWERED'] || 0}
                  </span>
                  <span className="text-slate-400">Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                    {tally['ANSWERED'] || 0}
                  </span>
                  <span className="text-slate-400">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-purple-700 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                    {tally['MARKED_FOR_REVIEW'] || 0}
                  </span>
                  <span className="text-slate-400">Marked Review</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-purple-700 text-white font-mono text-[10px] font-bold flex items-center justify-center relative">
                  {tally['ANSWERED_AND_MARKED_FOR_REVIEW'] || 0}
                  <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 border border-slate-900"></span>
                </span>
                <span className="text-emerald-400 font-semibold text-[10px]">
                  Ans & Marked (Evaluated for score)
                </span>
              </div>
            </div>

            {/* Question Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Choose a Question:</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {test.questions.length} Total
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
                {test.questions.map((q: any, idx: number) => {
                  const state = candidateAnswers[q.id]?.state || 'NOT_VISITED';
                  const isCurrent = idx === currentQuestionIndex;

                  let bgClass = 'bg-slate-800 text-slate-400 border-slate-700';
                  if (state === 'ANSWERED') bgClass = 'bg-emerald-600 text-white border-emerald-500';
                  if (state === 'NOT_ANSWERED') bgClass = 'bg-amber-600 text-white border-amber-500';
                  if (state === 'MARKED_FOR_REVIEW') bgClass = 'bg-purple-700 text-white border-purple-600';
                  if (state === 'ANSWERED_AND_MARKED_FOR_REVIEW') bgClass = 'bg-purple-700 text-white border-purple-500 relative';

                  return (
                    <button
                      key={q.id}
                      onClick={() => goToQuestion(idx)}
                      className={`h-9 rounded-lg font-mono text-xs font-bold border transition flex items-center justify-center ${bgClass} ${
                        isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 shadow-md' : ''
                      }`}
                    >
                      {idx + 1}
                      {state === 'ANSWERED_AND_MARKED_FOR_REVIEW' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 border border-slate-900"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Submit Block */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-950"
            >
              Submit Examination
            </button>
          </div>
        </aside>
      </div>

      {/* Virtual Calculator Modal */}
      <VirtualScientificCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Submit Examination?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to finalize and submit your test? You will not be able to modify your responses once submitted.
              </p>
            </div>

            {/* Submission Summary */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-400">Answered:</div>
              <div className="text-right font-bold text-emerald-400">
                {(tally['ANSWERED'] || 0) + (tally['ANSWERED_AND_MARKED_FOR_REVIEW'] || 0)}
              </div>
              <div className="text-slate-400">Not Answered:</div>
              <div className="text-right font-bold text-amber-400">
                {tally['NOT_ANSWERED'] || 0}
              </div>
              <div className="text-slate-400">Marked for Review:</div>
              <div className="text-right font-bold text-purple-400">
                {tally['MARKED_FOR_REVIEW'] || 0}
              </div>
              <div className="text-slate-400">Not Visited:</div>
              <div className="text-right font-bold text-slate-500">
                {tally['NOT_VISITED'] || 0}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Return to Exam
              </button>
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-950 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
