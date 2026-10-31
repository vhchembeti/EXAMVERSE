// client/src/views/AiTrickCoachView.tsx
// Interactive AI "Blink-Trick" Visual Coach (Visual Elimination Matrix, Logic Tree & Practice Clones)

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  ArrowLeft,
  CheckCircle,
  XCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

interface AiTrickCoachViewProps {
  initialQuestionId?: string;
  onBack: () => void;
  onNavigateTopic: (topicId: string) => void;
}

export const AiTrickCoachView: React.FC<AiTrickCoachViewProps> = ({
  initialQuestionId = 'q-quant-percent-successive',
  onBack,
  onNavigateTopic
}) => {
  const [questionId, setQuestionId] = useState<string>(initialQuestionId);
  const [analysis, setAnalysis] = useState<any>(null);
  const [clones, setClones] = useState<any[]>([]);
  const [coachInsight, setCoachInsight] = useState<any>(null);
  const [selectedCloneAnswers, setSelectedCloneAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const sampleQuestions = [
    { id: 'q-quant-percent-successive', label: 'Successive % (Rectangle Area)' },
    { id: 'q-num-div-72', label: 'Divisibility by 72 (C9 + Last 3)' },
    { id: 'q-quant-dishonest-dealer', label: 'False Weight (Dishonest Dealer)' },
    { id: 'q-quant-pipes-cisterns', label: 'Pipes & Cisterns (LCM Efficiency)' },
    { id: 'q-quant-mensuration-cylinder', label: 'Cylinder CSA (Pi = 11 Multiple)' },
    { id: 'q-logic-syllogism-100-50', label: 'Syllogisms (100-50 Rule)' },
    { id: 'q-logic-clocks-angle', label: 'Clock Angle at 3:40' },
    { id: 'q-spatial-triangles-grid', label: 'Figure Counting (Triangles in 5s)' }
  ];

  useEffect(() => {
    loadAnalysis(questionId);
  }, [questionId]);

  const loadAnalysis = async (qid: string) => {
    try {
      setLoading(true);
      const [matrixData, cloneData, insightData] = await Promise.all([
        api.analyzeAiTrickCoach({ questionId: qid }),
        api.getAiTrickClones(qid),
        api.getAiCoachInsight('percentages-fractions')
      ]);
      setAnalysis(matrixData);
      setClones(cloneData.clones || []);
      setCoachInsight(insightData.insight || null);
      setSelectedCloneAnswers({});
    } catch (err) {
      console.error('Failed to load AI coach data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Aptitude Directory
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
            Visual Elimination Engine
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
          <Sparkles className="w-4 h-4" />
          AI "Blink-Trick" Visual Coach
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Visual Option Elimination Matrix &amp; Logic Tree
        </h1>
        <p className="text-sm text-slate-300">
          See exactly how top-percentile scorers eliminate incorrect choices in under 10 seconds using mathematical invariants before ever solving.
        </p>
      </div>

      {/* Question Selector Bar */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400">Select Model Problem to Analyze:</label>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map(sq => (
            <button
              key={sq.id}
              onClick={() => setQuestionId(sq.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                questionId === sq.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sq.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          Generating visual elimination matrix and practice clones...
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          {/* 1. Visual Option Elimination Matrix Table */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">{analysis.questionTitle}</h2>
                <p className="text-xs text-amber-400">
                  Target Elimination Velocity: &lt; {analysis.targetBlinkTimeSeconds}s
                </p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                Correct Option: {analysis.correctOptionId}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 uppercase font-semibold text-slate-400 text-[11px]">
                  <tr>
                    <th className="p-3">Option</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">Digital Root</th>
                    <th className="p-3">Unit Digit</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Elimination Filter / Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {analysis.matrix?.map((row: any) => {
                    const isSurvivor = row.eliminationStatus === 'CORRECT';
                    return (
                      <tr
                        key={row.optionId}
                        className={isSurvivor ? 'bg-emerald-500/10 font-medium' : 'hover:bg-slate-800/30'}
                      >
                        <td className="p-3">
                          <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                            isSurvivor ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {row.optionId}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-white">{row.text}</td>
                        <td className="p-3 font-mono text-cyan-300">{row.digitalSum}</td>
                        <td className="p-3 font-mono text-amber-300">{row.unitDigit}</td>
                        <td className="p-3">
                          {isSurvivor ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1 w-max">
                              <CheckCircle className="w-3.5 h-3.5" /> SURVIVOR
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold flex items-center gap-1 w-max">
                              <XCircle className="w-3.5 h-3.5" /> ELIMINATED
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-400">
                          {isSurvivor ? (
                            <strong className="text-emerald-300">Matches invariant exactly</strong>
                          ) : (
                            row.rationale
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Trap Warning Box */}
            {analysis.trapWarning && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Trap Alert: </strong>
                  <span className="text-slate-300">{analysis.trapWarning}</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Step-by-Step Logic Flowchart Tree */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Sub-15s Elimination Flowchart Tree
            </h3>

            <div className="space-y-3">
              {analysis.eliminationTree?.map((node: any) => (
                <div
                  key={node.stepNumber}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-4 text-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold flex items-center justify-center shrink-0">
                    {node.stepNumber}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="font-bold text-white">{node.title}</div>
                    <div className="text-slate-300">{node.action}</div>
                    <div className="flex items-center gap-3 pt-1 text-[11px]">
                      <span className="text-emerald-400 font-semibold">
                        Surviving: [{node.survivingOptions?.join(', ')}]
                      </span>
                      {node.eliminatedAtThisStep?.length > 0 && (
                        <span className="text-rose-400">
                          Eliminated: [{node.eliminatedAtThisStep?.join(', ')}]
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Parameterized Practice Clones */}
          {clones.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    3 Speed Practice Clones (Reinforce the Trick)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Identical mathematical invariant structure with randomized parameter sets.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {clones.map((cl: any) => {
                  const userAns = selectedCloneAnswers[cl.cloneId];
                  const hasAnswered = !!userAns;

                  return (
                    <div
                      key={cl.cloneId}
                      className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 space-y-3"
                    >
                      <div className="font-semibold text-white text-xs">{cl.title}</div>
                      <div className="text-xs text-slate-200">{cl.questionText}</div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {cl.options.map((opt: any) => {
                          const isSelected = userAns === opt.id;
                          const isCorrect = opt.id === cl.correctOptionId;
                          let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                          if (hasAnswered) {
                            if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                            else if (isSelected) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => setSelectedCloneAnswers(prev => ({ ...prev, [cl.cloneId]: opt.id }))}
                              className={`p-2.5 rounded-lg border text-xs text-left transition-all ${btnStyle}`}
                            >
                              <strong>{opt.id}.</strong> {opt.text}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong>Blink Solution: </strong>{cl.blinkTrickTip}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Pedagogical Coaching Insight Box */}
          {coachInsight && (
            <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-indigo-300 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Coach's Exam Room Mantra
              </div>
              <div className="text-sm font-semibold text-white italic">
                "{coachInsight.mantra}"
              </div>
              <p className="text-slate-300 leading-relaxed">
                {coachInsight.guideline}
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
