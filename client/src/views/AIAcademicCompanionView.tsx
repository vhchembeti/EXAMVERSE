// client/src/views/AIAcademicCompanionView.tsx
// Citation-Grounded AI Academic Companion & Multi-Mode Epistemic Tutor
// Features 8 specialized modes, CAS mathematical verification, official citations, and E2EE notebook sync.

import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Calculator,
  Compass,
  FileText,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  Send,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Lock,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

const COMPANION_MODES = [
  { id: 'CONCEPT_TUTOR', label: 'Concept Tutor', icon: BookOpen, desc: 'Syllabus-grounded explanations with prerequisite links' },
  { id: 'MATH_NUMERICAL_SOLVER', label: 'Symbolic Math Solver', icon: Calculator, desc: 'Step-by-step CAS verified numerical derivations' },
  { id: 'REASONING_APTITUDE', label: 'Reasoning & Aptitude', icon: Compass, desc: 'Syllogisms, series, and analytical problem drills' },
  { id: 'PYQ_ANALYZER', label: 'PYQ Analyzer', icon: FileText, desc: 'Past-year questions breakdown with trap warnings' },
  { id: 'HIGH_YIELD_REVISION', label: 'High-Yield Revision', icon: Flame, desc: 'Key formulas, constraints, and fast memory triggers' },
  { id: 'CUSTOM_MOCK_GENERATOR', label: 'Custom Mock Generator', icon: CheckCircle2, desc: 'Targeted practice items under TCS iON rules' },
  { id: 'STUDY_PLAN_COACH', label: 'Study Plan Coach', icon: Calendar, desc: 'Knapsack-guided daily study and revision advice' },
  { id: 'CAREER_GUIDANCE', label: 'Career Guidance', icon: Layers, desc: 'Cross-stream PSU & statutory career pathways' }
];

const SAMPLE_PROMPTS: Record<string, string[]> = {
  CONCEPT_TUTOR: [
    "Explain Virtual Memory Paging and how Effective Memory Access Time (EMAT) is calculated with TLB.",
    "Explain Cayley-Hamilton Theorem and how it is used to find matrix inverses.",
    "Explain CSMA/CD Minimum Frame Size constraint in Computer Networks."
  ],
  MATH_NUMERICAL_SOLVER: [
    "Solve quadratic equation: 2x^2 - 7x + 3 = 0 with step-by-step discriminant derivation.",
    "Calculate minimum frame size in bytes for a 10 Mbps CSMA/CD network with 1 km cable length.",
    "Solve linear system: 2x + 3y = 13 and x - y = 4 using Cramer's rule."
  ],
  REASONING_APTITUDE: [
    "Statements: All bags are books. Some books are pencils. Explain if 'Some bags are pencils' follows.",
    "A train 180m long crosses a pole in 9 seconds. What is the speed of the train in km/h?",
    "Find the next term in number series: 7, 11, 19, 35, 67, ?"
  ],
  PYQ_ANALYZER: [
    "Analyze GATE CS PYQ on Red-Black Trees vs AVL Trees worst-case time complexity.",
    "Analyze UPSC CSAT question on Work and Time: A and B working together.",
    "Analyze GATE EC question on Maximum Power Transfer in AC circuits."
  ],
  HIGH_YIELD_REVISION: [
    "Give me high-yield revision flash sheet for Linear Algebra eigenvalues and eigenvectors.",
    "Give me key formulas and constraints for B+ Tree order and node capacity in DBMS.",
    "Give me quick summary of Stop-and-Wait ARQ efficiency and throughput."
  ]
};

interface CompanionProps {
  initialSubject?: string;
  initialTopic?: string;
  onNavigateToNotebook?: () => void;
}

export const AIAcademicCompanionView: React.FC<CompanionProps> = ({
  initialSubject = 'Computer Science',
  initialTopic = 'Core Syllabus',
  onNavigateToNotebook
}) => {
  const [activeMode, setActiveMode] = useState<string>('CONCEPT_TUTOR');
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [responseDossier, setResponseDossier] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSubmit = async (queryText?: string) => {
    const textToSubmit = (queryText || prompt).trim();
    if (!textToSubmit) return;

    setLoading(true);
    try {
      const result = await api.askAcademicCompanion({
        mode: activeMode,
        prompt: textToSubmit,
        context: {
          selectedExam: "GATE Computer Science / Central Competitive",
          currentSubject: initialSubject,
          topic: initialTopic,
          preparationLevel: "Intermediate",
          weakTopics: ["B+ Trees", "Virtual Memory Paging"]
        }
      });
      setResponseDossier(result);
      if (!queryText) setPrompt('');
    } catch (err: any) {
      alert(`Companion error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!responseDossier?.response) return;
    navigator.clipboard.writeText(responseDossier.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Citation-Grounded Academic Companion & Epistemic Tutor
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              AI Academic Tutor & CAS Math Solver
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Context-aware academic explanations across 8 specialized modes with deterministic symbolic math verification (SymPy/CAS) and verified citations to statutory curricula.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1">
            <span className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
              Active Student Context:
            </span>
            <div className="text-emerald-400 font-semibold">• Target: GATE CS 2027</div>
            <div className="text-slate-300">• Weak Spots: B+ Trees, Paging</div>
            <div className="text-indigo-300 font-mono text-[10px]">Multi-Tier Fallback: Gemini + Cache + CAS</div>
          </div>
        </div>

        {/* 8-Mode Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COMPANION_MODES.map((m) => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-100'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                  <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                    Mode {COMPANION_MODES.indexOf(m) + 1}
                  </span>
                </div>
                <div className="font-bold text-xs truncate">{m.label}</div>
                <div className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {m.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Prompt Input & Sample Triggers */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Ask Your Academic Question ({COMPANION_MODES.find(m => m.id === activeMode)?.label})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Deterministic CAS & Epistemic Verification Active
            </span>
          </div>

          <div className="flex gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={2}
              placeholder="Enter your doubt, equation, or past question here (e.g. 2x^2 - 7x + 3 = 0, EMAT with TLB)..."
              className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium text-slate-800"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !prompt.trim()}
              className="px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-indigo-100 disabled:opacity-40"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask AI</span>
                </>
              )}
            </button>
          </div>

          {/* Sample Prompts for active mode */}
          {SAMPLE_PROMPTS[activeMode] && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Recommended Curated Prompts:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PROMPTS[activeMode].map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(sp)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-xs font-medium transition text-left truncate max-w-md"
                  >
                    • {sp}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Response Dossier Display */}
        {responseDossier && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
            {/* Header with Epistemic Badging */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{responseDossier.badge}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Provider: {responseDossier.provider}
                  {responseDossier.isDeterministicFallback && ' • [Tier-4 Deterministic Fallback Engine Active]'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:border-indigo-300 text-xs font-semibold flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                {onNavigateToNotebook && (
                  <button
                    onClick={onNavigateToNotebook}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Lock className="w-4 h-4" /> Save to E2EE Notebook
                  </button>
                )}
              </div>
            </div>

            {/* Markdown Response Text */}
            <div className="prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
              {responseDossier.response}
            </div>

            {/* Grounded Citations Section */}
            {responseDossier.citations && responseDossier.citations.length > 0 && (
              <div className="pt-5 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Official Epistemic Citations & Verified Curriculum Links:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {responseDossier.citations.map((cite: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div className="truncate mr-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          {cite.source}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {cite.title}
                        </span>
                      </div>
                      {cite.url && (
                        <a
                          href={cite.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition flex-shrink-0"
                          title="Open Citation"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
