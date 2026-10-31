// client/src/views/AptitudeTopicDetailView.tsx
// Topic Deep-Dive: Foundational Theory, Bilingual Curated YouTube Hub & Signature 3-Way Solutions

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Zap,
  BookOpen,
  Video,
  Clock,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Play,
  RotateCcw,
  HelpCircle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

interface AptitudeTopicDetailViewProps {
  topicId: string;
  onBack: () => void;
  onNavigateAiCoach: (questionId?: string) => void;
}

export const AptitudeTopicDetailView: React.FC<AptitudeTopicDetailViewProps> = ({
  topicId,
  onBack,
  onNavigateAiCoach
}) => {
  const [topic, setTopic] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [activeSolutionTab, setActiveSolutionTab] = useState<'concept' | 'shortcut' | 'blink'>('blink');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTopic();
  }, [topicId]);

  const loadTopic = async () => {
    try {
      setLoading(true);
      const data = await api.getAptitudeTopic(topicId);
      setTopic(data);
      setSelectedOption(null);
      setShowSolution(false);
      setActiveSolutionTab('blink');
    } catch (err) {
      console.error('Failed to load topic details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading topic syllabus, 3-Way Solutions, and verified video lectures...
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-rose-400">Topic not found.</p>
        <button onClick={onBack} className="px-4 py-2 bg-slate-800 rounded-lg text-white">
          Back to Aptitude Hub
        </button>
      </div>
    );
  }

  const currentQuestion = topic.questions?.[selectedQuestionIndex];
  const videoLectures = topic.videoLectures || [];
  const filteredVideos = videoLectures.filter((v: any) => {
    if (selectedLanguage === 'All') return true;
    return v.language.toLowerCase().includes(selectedLanguage.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Universal Aptitude Directory
        </button>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
            {topic.pillarTitle}
          </span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-300 font-medium">{topic.sectionTitle}</span>
        </div>
      </div>

      {/* Topic Title Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/70 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Level {topic.level}: {topic.level === 0 ? 'Foundation' : topic.level === 1 ? 'Standard' : topic.level === 2 ? 'Govt / GATE' : 'Advanced PO/CAT'}
          </span>
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            GATE Weightage: {topic.gateWeightage || 'Normal'}
          </span>
          <span className="text-xs px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
            SSC Weightage: {topic.sscWeightage || 'Normal'}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            Estimated Mastery: {topic.estimatedLearningMins} Mins
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          {topic.title}
        </h1>

        {/* Signature Trick Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Signature Blink-Tick Shortcut
            </div>
            <div className="text-sm font-medium text-amber-200 mt-0.5">
              {topic.blinkTrickSummary}
            </div>
          </div>
        </div>
      </div>

      {/* Curated YouTube Video Learning Hub */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-white">Curated Bilingual YouTube Lectures</h2>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {['All', 'English', 'Hindi', 'Telugu', 'Tamil'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedLanguage === lang
                    ? 'bg-rose-500 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVideos.map((vid: any) => (
              <div
                key={vid.id}
                className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      {vid.language}
                    </span>
                    <h3 className="text-sm font-bold text-white">{vid.title}</h3>
                    <p className="text-xs text-slate-400">Faculty: {vid.instructor} • {vid.duration}</p>
                  </div>
                  <a
                    href={vid.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all shrink-0"
                    title="Watch Lecture on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Timestamps Milestones */}
                {vid.timestamps && vid.timestamps.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Timestamp Milestones:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {vid.timestamps.map((ts: any, idx: number) => (
                        <a
                          key={idx}
                          href={vid.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/60 transition-colors flex items-center gap-1"
                        >
                          <Play className="w-2.5 h-2.5 text-rose-400 fill-current" />
                          <strong className="text-rose-300">{ts.time}</strong> {ts.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-400">
            No lectures available for language filter '{selectedLanguage}'. Select 'All' to view all available resources.
          </div>
        )}
      </div>

      {/* Signature 3-Way Solution Practice Studio */}
      {currentQuestion ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Signature 3-Way Solution Interactive Question</h2>
            </div>
            <button
              onClick={() => onNavigateAiCoach(currentQuestion.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Open in AI Option Elimination Coach
            </button>
          </div>

          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            {/* Question Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {currentQuestion.difficulty}
                </span>
                <span className="text-xs text-amber-400 font-semibold">
                  Target Blink Time: &lt; {currentQuestion.targetBlinkTimeSeconds || 15}s
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {currentQuestion.examTags?.map((tag: string) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base md:text-lg font-medium text-white whitespace-pre-line leading-relaxed">
              {currentQuestion.questionText}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((opt: any) => {
                const isSelected = selectedOption === opt.id;
                const isCorrect = opt.id === currentQuestion.correctOptionId;
                let btnStyle = 'bg-slate-800/60 border-slate-700 text-slate-200 hover:border-slate-600';
                if (showSolution) {
                  if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                  else if (isSelected && !isCorrect) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                } else if (isSelected) {
                  btnStyle = 'bg-indigo-600/30 border-indigo-500 text-white font-bold';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedOption(opt.id);
                      setShowSolution(true);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {opt.id}
                      </span>
                      <span className="text-sm">{opt.text}</span>
                    </div>
                    {showSolution && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Solution Trigger */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {showSolution ? 'Hide Solution Steps' : 'Reveal 3-Way Solutions & Shortcut Analysis'}
              </button>
              {showSolution && (
                <button
                  onClick={() => {
                    setSelectedOption(null);
                    setShowSolution(false);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* 3-Way Solutions Accordion / Tabs */}
            {showSolution && currentQuestion.threeWaySolution && (
              <div className="space-y-4 pt-4 border-t border-slate-800 animate-fadeIn">
                <div className="flex flex-wrap gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveSolutionTab('blink')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeSolutionTab === 'blink'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-amber-400 hover:bg-slate-900'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Tab 3: &lt;15s Blink-Tick Trick
                  </button>
                  <button
                    onClick={() => setActiveSolutionTab('shortcut')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeSolutionTab === 'shortcut'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-indigo-300 hover:bg-slate-900'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Tab 2: 45s Exam Shortcut
                  </button>
                  <button
                    onClick={() => setActiveSolutionTab('concept')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeSolutionTab === 'concept'
                        ? 'bg-slate-700 text-white shadow-md'
                        : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Tab 1: Scratch / Concept Method
                  </button>
                </div>

                {/* Tab 3: Blink-Tick Trick */}
                {activeSolutionTab === 'blink' && (
                  <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        {currentQuestion.threeWaySolution.blinkTickTrick.heading}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                        Time: {currentQuestion.threeWaySolution.blinkTickTrick.timeTakenEstimate}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-300">
                      Trick Mechanism: <strong>{currentQuestion.threeWaySolution.blinkTickTrick.trickType}</strong>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                      {currentQuestion.threeWaySolution.blinkTickTrick.steps?.map((st: string, idx: number) => (
                        <li key={idx}>{st}</li>
                      ))}
                    </ul>
                    {currentQuestion.threeWaySolution.blinkTickTrick.eliminationRationale && (
                      <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                        <strong className="text-amber-400">Option Elimination Rationale: </strong>
                        {currentQuestion.threeWaySolution.blinkTickTrick.eliminationRationale}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: 45s Exam Shortcut */}
                {activeSolutionTab === 'shortcut' && (
                  <div className="p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                        {currentQuestion.threeWaySolution.shortcutMethod.heading}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                        Time: {currentQuestion.threeWaySolution.shortcutMethod.timeTakenEstimate}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-300">
                      Technique: <strong>{currentQuestion.threeWaySolution.shortcutMethod.technique}</strong>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                      {currentQuestion.threeWaySolution.shortcutMethod.steps?.map((st: string, idx: number) => (
                        <li key={idx}>{st}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tab 1: Scratch / Concept Method */}
                {activeSolutionTab === 'concept' && (
                  <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        {currentQuestion.threeWaySolution.conceptMethod.heading}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono font-bold">
                        Time: {currentQuestion.threeWaySolution.conceptMethod.timeTakenEstimate}
                      </span>
                    </div>
                    {currentQuestion.threeWaySolution.conceptMethod.formulaUsed && (
                      <div className="p-2.5 rounded bg-slate-900 text-xs font-mono text-cyan-300 border border-slate-800">
                        Formula: {currentQuestion.threeWaySolution.conceptMethod.formulaUsed}
                      </div>
                    )}
                    <ul className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
                      {currentQuestion.threeWaySolution.conceptMethod.steps?.map((st: string, idx: number) => (
                        <li key={idx}>{st}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Trap Alert Box */}
                {currentQuestion.threeWaySolution.trapAlert && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
                        Exam Trap Alert (Negative Marking Warning)
                      </div>
                      <div className="text-xs text-rose-200">
                        <strong>The Trap: </strong>{currentQuestion.threeWaySolution.trapAlert.danger}
                      </div>
                      <div className="text-xs text-emerald-300">
                        <strong>Workaround: </strong>{currentQuestion.threeWaySolution.trapAlert.workaround}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-sm text-slate-400">
          Model questions for this specific subtopic are loading from the question bank.
        </div>
      )}
    </div>
  );
};
