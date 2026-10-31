// client/src/views/AITutorView.tsx
// Integrated AI Academic Study Assistant
// Multilingual Personal Tutor, AI Study Planner & Performance Diagnostic Analyst
// Supports English, Telugu, Hindi, Tamil with syllabus-grounded RAG answers.
// Connects to live backend and database performance metrics.

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Calendar,
  BarChart2,
  BookOpen,
  HelpCircle,
  Globe,
  RotateCcw,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Calculator,
  FileSearch
} from 'lucide-react';
import { SupportedLanguage, Examination, StudentProfile } from '../types';
import { api } from '../services/api';

interface AITutorViewProps {
  initialExamCode?: string;
  allExams: Examination[];
  profile: StudentProfile;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  initialExamCode = 'UPSC CSE',
  allExams,
  profile,
}) => {
  const [activeTab, setActiveTab] = useState<'TUTOR' | 'PLANNER' | 'ANALYST'>('TUTOR');
  const [selectedExamCode, setSelectedExamCode] = useState<string>(initialExamCode);
  const [language, setLanguage] = useState<SupportedLanguage>(profile.preferredLanguage || 'English');

  // AI Tutor State
  const [userQuestion, setUserQuestion] = useState('');
  const [subjectTopic, setSubjectTopic] = useState('Polity / Governance');
  const [queryType, setQueryType] = useState<'CONCEPT' | 'MATH_SOLUTION' | 'QUESTION_ANALYSIS'>('CONCEPT');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; timestamp: string; model?: string; provider?: string; isLiveAPI?: boolean }[]
  >([
    {
      sender: 'ai',
      text: `Hello ${profile.fullName}! I am your EXAMVERSE AI Academic Study Tutor. Ask any doubt from your syllabus, request a step-by-step mathematical derivation, or explore competitive exam shortcuts in ${language}.`,
      timestamp: new Date().toLocaleTimeString(),
      isLiveAPI: false,
      provider: 'academic-fallback'
    },
  ]);
  const [asking, setAsking] = useState(false);

  // AI Planner State
  const [targetDays, setTargetDays] = useState(30);
  const [dailyHours, setDailyHours] = useState(4);
  const [prepLevel, setPrepLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [weakSubjectsInput, setWeakSubjectsInput] = useState('Quantitative Speed, Data Interpretation');
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // AI Performance Analyst State
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [analyzingPerformance, setAnalyzingPerformance] = useState(false);

  // Load real performance metrics when switching to ANALYST
  useEffect(() => {
    if (activeTab === 'ANALYST') {
      api.getPerformanceAnalytics()
        .then((data) => setAnalyticsData(data))
        .catch((err) => console.error('Failed to load analytics:', err));
    }
  }, [activeTab]);

  // Send question to AI Tutor
  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const qText = userQuestion.trim();
    setUserQuestion('');
    const userMsg = {
      sender: 'user' as const,
      text: qText,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      setAsking(true);
      const res = await api.askAITutor({
        question: qText,
        examCode: selectedExamCode,
        subject: subjectTopic,
        language,
      });

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.answer,
          timestamp: new Date().toLocaleTimeString(),
          model: res.model || (res.isLiveAPI ? 'gemini-3.8-flash' : 'Syllabus Engine'),
          provider: res.provider,
          isLiveAPI: res.isLiveAPI,
        },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `⚠️ Error fetching AI response: ${err.message || 'Please try again'}.`,
          timestamp: new Date().toLocaleTimeString(),
          isLiveAPI: false,
          provider: 'error-fallback'
        },
      ]);
    } finally {
      setAsking(false);
    }
  };

  // Generate Study Plan
  const handleGeneratePlan = async () => {
    try {
      setGeneratingPlan(true);
      const res = await api.generateAIStudyPlan({
        examCode: selectedExamCode,
        targetDays,
        studyHoursPerDay: dailyHours,
        preparationLevel: prepLevel,
        weakSubjects: weakSubjectsInput.split(',').map((s) => s.trim()),
        language,
      });
      setGeneratedPlan(res.studyPlanMarkdown);
    } catch (err: any) {
      console.error('Study plan generation failed:', err);
    } finally {
      setGeneratingPlan(false);
    }
  };

  // Run AI Performance Analysis on Real Test Data
  const handleRunAIAnalysis = async () => {
    if (!analyticsData) return;
    try {
      setAnalyzingPerformance(true);
      const res = await api.analyzeAIPerformance({
        targetExam: selectedExamCode,
        attempts: analyticsData.attempts || [],
        weakTopics: analyticsData.weakTopics || [],
        strongTopics: analyticsData.strongTopics || [],
        metrics: analyticsData.metrics || {},
        language
      });
      setAiAnalysisResult(res);
    } catch (err: any) {
      console.error('AI Performance Analysis failed:', err);
    } finally {
      setAnalyzingPerformance(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-900" />
                <span>Backend AI Academic Engine</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Powered by Gemini 3.8 Flash</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              AI Academic Study Assistant
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Syllabus-grounded tutoring, step-by-step mathematical derivations, question analysis, and adaptive study schedules in 4 Indian languages.
            </p>
          </div>

          {/* Target Exam & Language Controls */}
          <div className="flex items-center space-x-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Target Exam</label>
              <select
                value={selectedExamCode}
                onChange={(e) => setSelectedExamCode(e.target.value)}
                className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-white font-medium text-slate-800"
              >
                {allExams.map((e) => (
                  <option key={e.id} value={e.code}>
                    {e.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-white font-medium text-slate-800"
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-5 pt-4 border-t border-slate-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('TUTOR')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
              activeTab === 'TUTOR'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Tutor & Doubt Solver</span>
          </button>

          <button
            onClick={() => setActiveTab('PLANNER')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
              activeTab === 'PLANNER'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>AI Study Schedule Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('ANALYST')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
              activeTab === 'ANALYST'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Diagnostic Performance Analyst</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ACADEMIC TUTOR */}
      {activeTab === 'TUTOR' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
          {/* Tutor Mode Selector */}
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Tutor Mode:</span>
              <button
                type="button"
                onClick={() => {
                  setQueryType('CONCEPT');
                  setSubjectTopic('Polity / Governance');
                }}
                className={`px-2.5 py-1 rounded font-semibold text-[11px] transition flex items-center space-x-1 ${
                  queryType === 'CONCEPT' ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <Brain className="w-3 h-3" />
                <span>Subject Concept</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setQueryType('MATH_SOLUTION');
                  setSubjectTopic('Quantitative Aptitude');
                }}
                className={`px-2.5 py-1 rounded font-semibold text-[11px] transition flex items-center space-x-1 ${
                  queryType === 'MATH_SOLUTION' ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <Calculator className="w-3 h-3" />
                <span>Step-by-Step Math</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setQueryType('QUESTION_ANALYSIS');
                  setSubjectTopic('PYQ Analysis');
                }}
                className={`px-2.5 py-1 rounded font-semibold text-[11px] transition flex items-center space-x-1 ${
                  queryType === 'QUESTION_ANALYSIS' ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <FileSearch className="w-3 h-3" />
                <span>PYQ Analysis</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500">
              Target: <strong className="text-slate-800">{selectedExamCode}</strong> • Lang: <strong className="text-blue-900">{language}</strong>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-2 mb-1 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-600">
                    {msg.sender === 'user' ? 'You' : 'EXAMVERSE AI Tutor'}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    msg.isLiveAPI ? (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Live AI • {msg.provider || msg.model || 'Gemini 3.8'}</span>
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>Syllabus Verified Engine (Offline Guaranteed)</span>
                      </span>
                    )
                  )}
                </div>
                <div
                  className={`p-4 rounded-xl max-w-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-blue-900 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {asking && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
                <div className="w-2 h-2 rounded-full bg-blue-900 animate-ping"></div>
                <span>Formulating pedagogical solution in {language}...</span>
              </div>
            )}
          </div>

          {/* Quick Syllabus Prompts */}
          <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto text-[11px] scrollbar-none">
            <span className="font-bold text-slate-400 uppercase text-[10px] flex-shrink-0">Suggested:</span>
            {[
              'Explain Kesavananda Bharati Basic Structure doctrine',
              'Fast shortcut for Compound Interest vs Simple Interest',
              'Explain B+ Tree indexing vs B Tree in GATE CS',
              'Key differences between Fundamental Rights and DPSPs'
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => setUserQuestion(p)}
                className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded whitespace-nowrap text-slate-700"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleAskTutor} className="p-4 border-t border-slate-200 bg-white flex gap-2">
            <input
              type="text"
              placeholder={`Ask any doubt for ${selectedExamCode} in ${language}...`}
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900"
            />
            <button
              type="submit"
              disabled={asking || !userQuestion.trim()}
              className="px-4 py-2.5 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition disabled:opacity-50 flex items-center space-x-1.5 shadow-xs"
            >
              <span>Ask Tutor</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: AI STUDY PLANNER */}
      {activeTab === 'PLANNER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-4">
            <h2 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Study Schedule Parameters
            </h2>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Duration (Days)</label>
              <div className="grid grid-cols-5 gap-1.5">
                {[7, 15, 30, 60, 90].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setTargetDays(d)}
                    className={`py-1.5 rounded font-bold border transition ${
                      targetDays === d ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Daily Study Hours</label>
              <input
                type="number"
                min="2"
                max="12"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseInt(e.target.value) || 4)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Preparation Level</label>
              <select
                value={prepLevel}
                onChange={(e) => setPrepLevel(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Beginner">Beginner (Starting syllabus)</option>
                <option value="Intermediate">Intermediate (Theory covered)</option>
                <option value="Advanced">Advanced (Revision & Mock speed)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Weak Areas / Focus Topics</label>
              <input
                type="text"
                value={weakSubjectsInput}
                onChange={(e) => setWeakSubjectsInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
              />
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={generatingPlan}
              className="w-full py-2.5 rounded-lg bg-blue-900 text-white font-bold hover:bg-blue-800 transition disabled:opacity-50 shadow-xs"
            >
              {generatingPlan ? 'Generating Schedule...' : `Generate ${targetDays}-Day Plan`}
            </button>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs overflow-y-auto max-h-[600px] text-xs">
            {generatedPlan ? (
              <div className="prose prose-xs max-w-none whitespace-pre-wrap leading-relaxed text-slate-800">
                {generatedPlan}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400">
                <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700 text-sm">No custom plan generated yet</p>
                <p className="text-xs text-slate-400 mt-1">Configure your parameters on the left, then click Generate.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DIAGNOSTIC PERFORMANCE ANALYST */}
      {activeTab === 'ANALYST' && (
        <div className="space-y-6">
          {/* Live Performance Analytics Metrics */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <BarChart2 className="w-4 h-4 text-blue-900" />
                  <span>Real Database Preparation Diagnostics</span>
                </h2>
                <p className="text-slate-500 text-[11px]">
                  Aggregated from CBT mock tests and study target completion velocity
                </p>
              </div>

              <button
                onClick={handleRunAIAnalysis}
                disabled={analyzingPerformance}
                className="text-xs px-3.5 py-1.5 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition disabled:opacity-50 flex items-center space-x-1 shadow-xs self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>{analyzingPerformance ? 'Analyzing...' : 'Generate AI Diagnostics'}</span>
              </button>
            </div>

            {/* Metrics Row */}
            {analyticsData && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Tests Attempted</span>
                  <span className="text-xl font-extrabold text-blue-900 font-mono mt-0.5 block">
                    {analyticsData.metrics?.totalAttempts || 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Average Accuracy</span>
                  <span className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5 block">
                    {analyticsData.metrics?.avgAccuracy || 0}%
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Marks Scored</span>
                  <span className="text-xl font-extrabold text-slate-800 font-mono mt-0.5 block">
                    {analyticsData.metrics?.totalScoreScored || 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Velocity</span>
                  <span className="text-xl font-extrabold text-blue-900 font-mono mt-0.5 block">
                    {analyticsData.metrics?.targetVelocity || 0}%
                  </span>
                </div>
              </div>
            )}

            {/* Diagnostics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-center space-x-1.5 text-emerald-900 font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Strong Topics Identified</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(analyticsData?.strongTopics || []).length > 0 ? (
                    analyticsData.strongTopics.map((t: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-emerald-200 text-emerald-800 rounded text-[11px] font-medium">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs">Complete a mock test to analyze strong areas.</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-200">
                <div className="flex items-center space-x-1.5 text-rose-900 font-bold mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  <span>Priority Weak Areas (Losing Marks)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(analyticsData?.weakTopics || []).length > 0 ? (
                    analyticsData.weakTopics.map((t: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-rose-200 text-rose-800 rounded text-[11px] font-medium">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs">No negative penalty areas recorded.</span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Generated Diagnostics Section */}
            {aiAnalysisResult && (
              <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-200 animate-fade-in text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                  <span className="font-bold text-blue-950 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-900" />
                    <span>Personalized AI Diagnostic Feedback</span>
                  </span>
                  <span className="text-[10px] text-blue-800 bg-blue-100 px-2 py-0.5 rounded font-bold">
                    Readiness: {aiAnalysisResult.readinessScore || '78%'}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {aiAnalysisResult.analysis || aiAnalysisResult.advice || JSON.stringify(aiAnalysisResult)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
