// client/src/views/FormulaLibraryView.tsx
// High-Yield Formula Library & Spaced Repetition (FSRS) Flashcard Engine

import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Search,
  RotateCw,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  Award
} from 'lucide-react';
import { api } from '../services/api';

export const FormulaLibraryView: React.FC = () => {
  const [formulas, setFormulas] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Flashcard / Spaced Repetition Mode
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardRevealed, setIsCardRevealed] = useState(false);
  const [reviewResult, setReviewResult] = useState<any | null>(null);

  useEffect(() => {
    loadFormulas();
  }, [selectedSubjectId]);

  const loadFormulas = async () => {
    setLoading(true);
    try {
      const data = await api.getFormulas({
        subjectId: selectedSubjectId === 'ALL' ? undefined : selectedSubjectId
      });
      setFormulas(data || []);
    } catch (err) {
      console.error('Failed to load formulas:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFormulas = formulas.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.topic.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.subjectName.toLowerCase().includes(q)
    );
  });

  const handleRateFlashcard = async (quality: number) => {
    const currentFormula = filteredFormulas[activeCardIndex];
    if (!currentFormula) return;

    try {
      const schedule = await api.submitFsrsReview(
        {
          id: currentFormula.id,
          topic: currentFormula.topic,
          subject: currentFormula.subjectName,
          repetitions: currentFormula.repetitions || 0,
          intervalDays: currentFormula.intervalDays || 1,
          easinessFactor: currentFormula.easinessFactor || 2.5
        },
        quality
      );

      setReviewResult(schedule);
      setTimeout(() => {
        setReviewResult(null);
        setIsCardRevealed(false);
        if (activeCardIndex < filteredFormulas.length - 1) {
          setActiveCardIndex(activeCardIndex + 1);
        } else {
          setActiveCardIndex(0);
        }
      }, 1500);
    } catch (err) {
      console.error('Failed to submit FSRS review:', err);
    }
  };

  const activeCard = filteredFormulas[activeCardIndex];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              High-Yield Formula Library & FSRS Spaced Repetition
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Formula Vault & Active Recall Hub
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Master essential mathematical relations, asymptotic bounds, circuit theorems, and physical constants with automated SM-2 / FSRS memory retention scheduling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsFlashcardMode(!isFlashcardMode);
                setIsCardRevealed(false);
              }}
              className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg ${
                isFlashcardMode
                  ? 'bg-emerald-600 text-white shadow-emerald-950'
                  : 'bg-white text-slate-900 hover:bg-slate-100 shadow-slate-950'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              {isFlashcardMode ? 'View Full Formula Sheet' : 'Start Active Recall Flashcards'}
            </button>
          </div>
        </div>

        {/* Flashcard Active Recall Mode */}
        {isFlashcardMode && activeCard && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 pb-3">
              <span>
                Flashcard {activeCardIndex + 1} of {filteredFormulas.length}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[11px]">
                {activeCard.subjectName} • {activeCard.topic}
              </span>
            </div>

            <div className="space-y-2 py-4">
              <h2 className="text-2xl font-extrabold text-slate-900">{activeCard.name}</h2>
              <p className="text-xs text-slate-500">
                Can you state the equation and core constraints from memory?
              </p>
            </div>

            {/* Revealed Equation & Explanation */}
            {isCardRevealed ? (
              <div className="space-y-4 pt-4 border-t border-slate-100 text-left animate-in fade-in">
                <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-sm overflow-x-auto shadow-inner">
                  {activeCard.latex}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {activeCard.description}
                </p>
                {activeCard.example && (
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-800 text-[11px] leading-relaxed border border-indigo-100">
                    <strong>Exam Application / Example:</strong> {activeCard.example}
                  </div>
                )}

                {/* Rating Buttons */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Rate Your Recall Quality (FSRS / SM-2):
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { q: 1, label: 'Forgot (1d)', color: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
                      { q: 2, label: 'Hard (2d)', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                      { q: 3, label: 'Good (6d)', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                      { q: 4, label: 'Easy (14d)', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
                      { q: 5, label: 'Perfect (30d)', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' }
                    ].map((btn) => (
                      <button
                        key={btn.q}
                        onClick={() => handleRateFlashcard(btn.q)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border border-slate-200 ${btn.color}`}
                      >
                        <span className="text-base">{btn.q}</span>
                        <span className="text-[10px] font-normal">{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-4">
                <button
                  onClick={() => setIsCardRevealed(true)}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 mx-auto transition shadow-lg shadow-indigo-100"
                >
                  <Eye className="w-4 h-4" /> Reveal Formula & Explanation
                </button>
              </div>
            )}

            {/* FSRS Toast Feedback */}
            {reviewResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Scheduled for next review on <strong>{reviewResult.nextReviewDate}</strong> (Interval: {reviewResult.intervalDays} days, EF: {reviewResult.easinessFactor})
                </span>
              </div>
            )}
          </div>
        )}

        {/* Search & Filters */}
        {!isFlashcardMode && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulas by name, topic, or keyword (e.g., Master Theorem, Cayley-Hamilton, Shannon, Thevenin)..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            {/* Formula Cards Grid */}
            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-500 font-medium">Loading formula registry...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFormulas.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold font-mono">
                          {f.subjectName} • {f.topic}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {f.subjectCode}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{f.name}</h3>

                      {/* Monospace Formula Display */}
                      <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                        {f.latex}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {f.description}
                      </p>
                    </div>

                    {f.example && (
                      <div className="pt-3 border-t border-slate-100">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 leading-relaxed">
                          <strong className="text-indigo-600">Exam Note / Example:</strong> {f.example}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
