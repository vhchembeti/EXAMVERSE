// client/src/views/BlinkDrillPlayerView.tsx
// 60-Second "Blink Challenge" Speed Drill Player & Reflex Timer

import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Play
} from 'lucide-react';
import { api } from '../services/api';

interface BlinkDrillPlayerViewProps {
  initialExamTag?: string;
  onBack: () => void;
  onNavigateTopic: (topicId: string) => void;
}

export const BlinkDrillPlayerView: React.FC<BlinkDrillPlayerViewProps> = ({
  initialExamTag = 'GATE_GA',
  onBack,
  onNavigateTopic
}) => {
  const [examTag, setExamTag] = useState<string>(initialExamTag);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [drillStarted, setDrillStarted] = useState<boolean>(false);
  const [drillCompleted, setDrillCompleted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const timerRef = useRef<any>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    loadDrill();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examTag]);

  const loadDrill = async () => {
    try {
      setLoading(true);
      const data = await api.generateBlinkDrill(examTag, 5);
      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setQuestionTimes({});
      setDrillStarted(false);
      setDrillCompleted(false);
      setTimeLeft(60);
    } catch (err) {
      console.error('Failed to generate blink drill:', err);
    } finally {
      setLoading(false);
    }
  };

  const startDrill = () => {
    setDrillStarted(true);
    setDrillCompleted(false);
    setTimeLeft(60);
    questionStartTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          finishDrill();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const recordAnswer = (optionId: string) => {
    const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionId }));
    setQuestionTimes(prev => ({ ...prev, [currentIndex]: elapsed }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      questionStartTimeRef.current = Date.now();
    } else {
      finishDrill();
    }
  };

  const finishDrill = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDrillCompleted(true);
  };

  const examOptions = [
    { id: 'GATE_GA', label: 'GATE General Aptitude (15M)' },
    { id: 'SSC_CGL', label: 'SSC CGL / CHSL' },
    { id: 'BANKING_PO', label: 'Banking IBPS / SBI PO' },
    { id: 'UPSC_CSAT', label: 'UPSC CSAT' },
    { id: 'CAT_MBA', label: 'CAT / XAT' },
    { id: 'DEFENCE_AFCAT', label: 'Defence AFCAT / CDS' }
  ];

  const currentQ = questions[currentIndex];

  // Calculate results
  let totalScore = 0;
  let totalTime = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctOptionId) {
      totalScore++;
    }
    totalTime += questionTimes[idx] || 0;
  });
  const avgTime = questions.length > 0 ? (totalTime / questions.length).toFixed(1) : '0';

  let masteryTitle = 'Developing Reflex (>25s)';
  let masteryColor = 'text-amber-400';
  if (parseFloat(avgTime) <= 12 && totalScore >= 4) {
    masteryTitle = 'Blink Grandmaster (<12s)';
    masteryColor = 'text-emerald-400';
  } else if (parseFloat(avgTime) <= 20 && totalScore >= 3) {
    masteryTitle = 'Competitive Ace (12-20s)';
    masteryColor = 'text-cyan-400';
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Aptitude Directory
        </button>
        <div className="flex items-center gap-2">
          {examOptions.map(e => (
            <button
              key={e.id}
              onClick={() => {
                if (!drillStarted || drillCompleted) setExamTag(e.id);
              }}
              disabled={drillStarted && !drillCompleted}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                examTag === e.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white disabled:opacity-50'
              }`}
            >
              {e.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Drill Start Screen */}
      {!drillStarted && !drillCompleted && (
        <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-amber-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Zap className="w-8 h-8 fill-current" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h1 className="text-3xl font-extrabold text-white">60-Second "Blink Challenge" Speed Drill</h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Target: Solve 5 high-yield exam questions under 15 seconds each using Digital Sum, Unit Digit cyclicity, and shortcut invariants.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <Clock className="w-4 h-4 text-amber-400" />
              60 Seconds Total Timer
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <Award className="w-4 h-4 text-emerald-400" />
              Target: &lt; 15s Per Question
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <Zap className="w-4 h-4 text-cyan-400" />
              Exam Focus: {examTag}
            </span>
          </div>

          <div>
            <button
              onClick={startDrill}
              disabled={loading || questions.length === 0}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 text-base"
            >
              Start 60s Blink Challenge Now
            </button>
          </div>
        </div>
      )}

      {/* Drill Active Screen */}
      {drillStarted && !drillCompleted && currentQ && (
        <div className="space-y-4">
          {/* Timer & Progress Header */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                {currentQ.difficulty}
              </span>
            </div>

            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono font-bold text-sm border ${
              timeLeft <= 10
                ? 'bg-rose-500/20 text-rose-400 border-rose-500 animate-pulse'
                : 'bg-slate-800 text-amber-400 border-slate-700'
            }`}>
              <Clock className="w-4 h-4" />
              {timeLeft}s
            </div>
          </div>

          {/* Question Box */}
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            <h2 className="text-lg md:text-xl font-bold text-white whitespace-pre-line leading-relaxed">
              {currentQ.questionText}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => recordAnswer(opt.id)}
                  className="p-4 rounded-xl bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500 text-left transition-all flex items-center gap-3 group"
                >
                  <span className="w-7 h-7 rounded-full bg-slate-700 group-hover:bg-indigo-500 text-xs font-bold flex items-center justify-center shrink-0 text-white transition-colors">
                    {opt.id}
                  </span>
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Target Blink Reminder */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
              <span>Target Blink: &lt; {currentQ.targetBlinkTimeSeconds || 15}s</span>
              <button
                onClick={() => recordAnswer('SKIPPED')}
                className="text-slate-400 hover:text-white underline text-xs"
              >
                Skip Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drill Completed Scorecard */}
      {drillCompleted && (
        <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white">Blink Drill Complete!</h2>
            <div className={`text-base font-bold ${masteryColor}`}>{masteryTitle}</div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-2xl font-extrabold text-white">{totalScore} / {questions.length}</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold mt-1">Accuracy</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-2xl font-extrabold text-amber-400">{avgTime}s</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold mt-1">Avg Time / Q</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-2xl font-extrabold text-cyan-400">15s</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold mt-1">Target Pace</div>
            </div>
          </div>

          {/* Question Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Question Performance &amp; Shortcut Review
            </h3>
            <div className="space-y-2">
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctOptionId;
                const timeTaken = questionTimes[idx] || 0;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-white">{q.title}</div>
                        <div className="text-slate-400 line-clamp-1 mt-0.5">{q.questionText}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-mono text-slate-300">
                        {timeTaken}s (Target: {q.targetBlinkTimeSeconds || 15}s)
                      </span>
                      <button
                        onClick={() => onNavigateTopic(q.topicId)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold"
                      >
                        Inspect 3-Way Solution
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={startDrill}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Retake This Drill
            </button>
            <button
              onClick={loadDrill}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-all"
            >
              Generate New Drill Set
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
