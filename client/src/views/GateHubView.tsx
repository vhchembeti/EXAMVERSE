// client/src/views/GateHubView.tsx
// Flagship GATE Intelligence Hub
// Interactive tools: 30 Official Papers Directory, Two-Paper Combination Validator,
// Official GATE Score Simulator & Normalizer, Cross-Paper Overlap Comparator,
// Strictly Separated Cutoffs Explorer, and PSU Recruitment Tracker.

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calculator,
  Compass,
  Award,
  Briefcase,
  Search,
  Sparkles,
  Layers,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  Sliders,
  Scale
} from 'lucide-react';
import { api } from '../services/api';
import { GatePaperWorkbenchView } from './GatePaperWorkbenchView';

export const GateHubView: React.FC = () => {
  // Navigation / Selected Paper State
  const [selectedPaperCode, setSelectedPaperCode] = useState<string | null>(null);

  // Papers directory
  const [papers, setPapers] = useState<any[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Active Tool Tab
  const [activeToolTab, setActiveToolTab] = useState<'DIRECTORY' | 'VALIDATOR' | 'SIMULATOR' | 'OVERLAP' | 'CUTOFFS' | 'PSUS'>('DIRECTORY');

  // Tool 1: Two-Paper Combination Validator State
  const [primaryPaper, setPrimaryPaper] = useState('EC');
  const [secondaryPaper, setSecondaryPaper] = useState('EE');
  const [combinationResult, setCombinationResult] = useState<any>(null);
  const [validatingCombo, setValidatingCombo] = useState(false);

  // Tool 2: GATE Score Calculator State
  const [scoreInputMarks, setScoreInputMarks] = useState<number | string>(65);
  const [scorePaperCode, setScorePaperCode] = useState('EC');
  const [scoreResult, setScoreResult] = useState<any>(null);
  const [calculatingScore, setCalculatingScore] = useState(false);
  const [isMultiSession, setIsMultiSession] = useState(false);
  const [sessionTopMean, setSessionTopMean] = useState(88);
  const [sessionCutoffMean, setSessionCutoffMean] = useState(25);
  const [globalTopMean, setGlobalTopMean] = useState(90);
  const [globalCutoffMean, setGlobalCutoffMean] = useState(25);

  // Tool 3: Cross-Paper Overlap State
  const [overlapP1, setOverlapP1] = useState('EC');
  const [overlapP2, setOverlapP2] = useState('EE');
  const [overlapResult, setOverlapResult] = useState<any>(null);
  const [loadingOverlap, setLoadingOverlap] = useState(false);

  // Tool 4: Segregated Cutoffs State
  const [cutoffPaperCode, setCutoffPaperCode] = useState('ALL');
  const [cutoffType, setCutoffType] = useState<'QUALIFYING' | 'ADMISSION' | 'PSU'>('QUALIFYING');
  const [cutoffsData, setCutoffsData] = useState<any>(null);
  const [loadingCutoffs, setLoadingCutoffs] = useState(false);

  // Tool 5: PSU Recruitment Matrix State
  const [psuPaperFilter, setPsuPaperFilter] = useState('EC');
  const [psuList, setPsuList] = useState<any[]>([]);
  const [loadingPSUs, setLoadingPSUs] = useState(false);

  // Initial load
  useEffect(() => {
    loadPapers();
  }, [categoryFilter]);

  const loadPapers = async () => {
    try {
      setLoadingPapers(true);
      const res = await api.getGatePapers(categoryFilter);
      if (res && res.papers) {
        setPapers(res.papers);
      }
    } catch (err) {
      console.error('Failed to load GATE papers:', err);
    } finally {
      setLoadingPapers(false);
    }
  };

  // Run Combination Validation
  const handleValidateCombination = async (p1: string, p2: string) => {
    try {
      setValidatingCombo(true);
      const res = await api.validateGateCombination(p1, p2);
      setCombinationResult(res);
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setValidatingCombo(false);
    }
  };

  // Run Score Simulation
  const handleCalculateScore = async () => {
    try {
      setCalculatingScore(true);
      const payload: any = {
        marks: parseFloat(String(scoreInputMarks)),
        paperCode: scorePaperCode,
        isMultiSession,
        sessionParams: isMultiSession
          ? { sessionTopMean, sessionCutoffMean, globalTopMean, globalCutoffMean }
          : undefined
      };
      const res = await api.calculateGateScore(payload);
      setScoreResult(res);
    } catch (err) {
      console.error('Score calculation error:', err);
    } finally {
      setCalculatingScore(false);
    }
  };

  // Run Overlap Analysis
  const handleLoadOverlap = async (p1: string, p2: string) => {
    try {
      setLoadingOverlap(true);
      const res = await api.getGateOverlap(p1, p2);
      if (res && res.overlap) {
        setOverlapResult(res.overlap);
      }
    } catch (err) {
      console.error('Overlap error:', err);
    } finally {
      setLoadingOverlap(false);
    }
  };

  // Run Cutoffs Load
  const handleLoadCutoffs = async (type: string, code: string) => {
    try {
      setLoadingCutoffs(true);
      const res = await api.getGateCutoffs({
        paperCode: code !== 'ALL' ? code : undefined,
        type
      });
      setCutoffsData(res);
    } catch (err) {
      console.error('Cutoffs error:', err);
    } finally {
      setLoadingCutoffs(false);
    }
  };

  // Run PSU Load
  const handleLoadPSUs = async (code: string) => {
    try {
      setLoadingPSUs(true);
      const res = await api.getGatePSUs(code);
      setPsuList(res.psus || []);
    } catch (err) {
      console.error('PSU error:', err);
    } finally {
      setLoadingPSUs(false);
    }
  };

  // Trigger initial tool loads on tab selection
  useEffect(() => {
    if (activeToolTab === 'VALIDATOR') {
      handleValidateCombination(primaryPaper, secondaryPaper);
    } else if (activeToolTab === 'SIMULATOR') {
      handleCalculateScore();
    } else if (activeToolTab === 'OVERLAP') {
      handleLoadOverlap(overlapP1, overlapP2);
    } else if (activeToolTab === 'CUTOFFS') {
      handleLoadCutoffs(cutoffType, cutoffPaperCode);
    } else if (activeToolTab === 'PSUS') {
      handleLoadPSUs(psuPaperFilter);
    }
  }, [activeToolTab]);

  // If a specific paper is selected, render the 23-Point Paper Workbench
  if (selectedPaperCode) {
    return (
      <GatePaperWorkbenchView
        paperCode={selectedPaperCode}
        onBack={() => setSelectedPaperCode(null)}
        onSelectPaper={(code) => setSelectedPaperCode(code)}
      />
    );
  }

  // Filter papers for directory
  const filteredPapers = papers.filter(p => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>National GATE Intelligence Architecture</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Official GATE Intelligence Hub
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All 30 official examination papers, multi-section architecture for XE/XH/XL, the official two-paper combination validator, mathematical score simulator, cross-paper syllabus comparator, and strictly separated cutoffs.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Official Papers</span>
            <span className="font-bold text-white text-base">30 Papers</span>
            <span className="text-[10px] text-indigo-300 block">XE, XH, XL Multi-Section</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Two-Paper Matrix</span>
            <span className="font-bold text-emerald-400 text-base">Verified Rules</span>
            <span className="text-[10px] text-emerald-300 block">Organizing Institute Matrix</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">GATE Score Simulator</span>
            <span className="font-bold text-indigo-300 text-base">Official Formula</span>
            <span className="text-[10px] text-slate-400 block">Boundary-Tested Normalization</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">PSU & Admission Cutoffs</span>
            <span className="font-bold text-amber-400 text-base">Strictly Isolated</span>
            <span className="text-[10px] text-amber-300 block">COAP / CCMT / PSUs</span>
          </div>
        </div>
      </div>

      {/* Main Tool Selection Tabs */}
      <div className="flex overflow-x-auto space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
        {[
          { id: 'DIRECTORY', label: 'All 30 Papers Directory', icon: BookOpen },
          { id: 'VALIDATOR', label: 'Two-Paper Combination Validator', icon: CheckCircle2 },
          { id: 'SIMULATOR', label: 'Score & Normalization Simulator', icon: Calculator },
          { id: 'OVERLAP', label: 'Cross-Paper Overlap Comparator', icon: Scale },
          { id: 'CUTOFFS', label: 'Separated Cutoffs Registry', icon: Award },
          { id: 'PSUS', label: 'PSU Recruitment Tracker', icon: Briefcase }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeToolTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveToolTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg whitespace-nowrap transition ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: ALL 30 PAPERS DIRECTORY */}
      {activeToolTab === 'DIRECTORY' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by code (e.g., EC, CS, DA, XE) or paper title..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">Category:</span>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="ALL">All Categories (30 Papers)</option>
                <option value="Engineering">Engineering (Core)</option>
                <option value="Science">Science (CY, MA, PH, ST)</option>
                <option value="Emerging Tech">Emerging Tech (DA)</option>
                <option value="Multi-Disciplinary">Multi-Disciplinary (XE)</option>
                <option value="Humanities">Humanities (XH)</option>
                <option value="Biological">Life Sciences (XL, BT, EY)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPapers.map(paper => (
              <div
                key={paper.code}
                onClick={() => setSelectedPaperCode(paper.code)}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-black text-sm tracking-wide">
                      {paper.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      {paper.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition mt-2">
                    {paper.name}
                  </h3>

                  {paper.isMultiSection && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      Multi-Section (Compulsory + Optionals)
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 text-[11px]">
                    +{paper.allowedSecondariesCount} Allowed 2nd Papers
                  </span>
                  <span className="inline-flex items-center text-indigo-600 font-bold group-hover:translate-x-1 transition text-xs">
                    <span>23-Pt Workbench</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 2: TWO-PAPER COMBINATION VALIDATOR */}
      {activeToolTab === 'VALIDATOR' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span>Official Two-Paper Combination Validator</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The GATE Organizing Institute permits candidates to appear in a maximum of TWO papers from approved combinations. The examination schedule ensures primary and secondary papers do not clash in timing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Primary Paper Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Primary Paper Code:</label>
              <select
                value={primaryPaper}
                onChange={e => {
                  setPrimaryPaper(e.target.value);
                  handleValidateCombination(e.target.value, secondaryPaper);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {papers.map(p => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Secondary Paper Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Secondary Paper Code:</label>
              <select
                value={secondaryPaper}
                onChange={e => {
                  setSecondaryPaper(e.target.value);
                  handleValidateCombination(primaryPaper, e.target.value);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {papers.map(p => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Validation Result Box */}
          {combinationResult && (
            <div
              className={`p-5 rounded-2xl border ${
                combinationResult.isValid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              } space-y-3 animate-fadeIn`}
            >
              <div className="flex items-center space-x-3">
                {combinationResult.isValid ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
                    <XCircle className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold">
                    {combinationResult.isValid
                      ? `Combination Valid: ${primaryPaper} + ${secondaryPaper}`
                      : `Combination Disallowed: ${primaryPaper} + ${secondaryPaper}`}
                  </h4>
                  <p className="text-xs mt-0.5 opacity-90">{combinationResult.reason}</p>
                </div>
              </div>

              {combinationResult.allowedSecondaries && combinationResult.allowedSecondaries.length > 0 && (
                <div className="pt-3 border-t border-slate-200/50 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-semibold text-slate-700">All Permitted Secondaries for {primaryPaper}:</span>
                  {combinationResult.allowedSecondaries.map((sec: string) => (
                    <button
                      key={sec}
                      onClick={() => {
                        setSecondaryPaper(sec);
                        handleValidateCombination(primaryPaper, sec);
                      }}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 font-bold text-indigo-700 hover:bg-indigo-50"
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: GATE SCORE & NORMALIZATION SIMULATOR */}
      {activeToolTab === 'SIMULATOR' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>Official GATE Score & Normalization Simulator</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Implements the mathematical formula specified in the official GATE information brochure:
              <br />
              <code className="text-indigo-800 font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">
                S = Sq + (St - Sq) * (M - Mq) / (Mt - Mq)
              </code>
              <br />
              All projected rank bands are clearly designated as <strong>ESTIMATE</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            {/* Raw Marks Input */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Marks Obtained (Out of 100):</label>
              <input
                type="number"
                step="0.33"
                value={scoreInputMarks}
                onChange={e => setScoreInputMarks(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 bg-white"
              />
              <span className="text-[10px] text-slate-500">Supports negative deductions (e.g. -2.0) and boundary values</span>
            </div>

            {/* Paper Code */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Target Paper:</label>
              <select
                value={scorePaperCode}
                onChange={e => setScorePaperCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 bg-white"
              >
                {papers.map(p => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Multi-Session Toggle */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block">Paper Session Mode:</label>
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="multiSession"
                  checked={isMultiSession}
                  onChange={e => setIsMultiSession(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="multiSession" className="text-slate-700 font-medium cursor-pointer">
                  Enable Multi-Session Normalization (e.g., CS, ME, CE)
                </label>
              </div>
            </div>
          </div>

          {/* Optional Multi-Session Params */}
          {isMultiSession && (
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-600 block text-[11px]">Session Top Mean (Mti):</span>
                <input
                  type="number"
                  value={sessionTopMean}
                  onChange={e => setSessionTopMean(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-xs font-semibold"
                />
              </div>
              <div>
                <span className="text-slate-600 block text-[11px]">Session Cutoff Mean (Miq):</span>
                <input
                  type="number"
                  value={sessionCutoffMean}
                  onChange={e => setSessionCutoffMean(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-xs font-semibold"
                />
              </div>
              <div>
                <span className="text-slate-600 block text-[11px]">Global Top Mean (Mtg):</span>
                <input
                  type="number"
                  value={globalTopMean}
                  onChange={e => setGlobalTopMean(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-xs font-semibold"
                />
              </div>
              <div>
                <span className="text-slate-600 block text-[11px]">Global Cutoff Mean (Mqg):</span>
                <input
                  type="number"
                  value={globalCutoffMean}
                  onChange={e => setGlobalCutoffMean(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-xs font-semibold"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleCalculateScore}
            disabled={calculatingScore}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            {calculatingScore ? 'Calculating...' : 'Compute Official GATE Score'}
          </button>

          {/* Score Result Panel */}
          {scoreResult && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-4 shadow-lg border border-indigo-900/50 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-indigo-300 font-bold block uppercase tracking-wider">
                    Calculated GATE Score (Scale 100 - 1000)
                  </span>
                  <div className="flex items-baseline space-x-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-black text-white">{scoreResult.gateScore}</span>
                    <span className="text-sm text-slate-300">/ 1000</span>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end space-y-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                      scoreResult.qualifyingStatus === 'QUALIFIED'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {scoreResult.qualifyingStatus === 'QUALIFIED' ? 'OFFICIALLY QUALIFIED' : 'BELOW QUALIFYING CUTOFF'}
                  </span>
                  <span className="text-[11px] text-amber-300 font-semibold">
                    ESTIMATED RANK: {scoreResult.estimatedRankBand}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Marks Evaluated:</span>
                  <span className="font-bold text-white">{scoreResult.marks} / 100</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">General Qualifying Mark (Mq):</span>
                  <span className="font-bold text-white">{scoreResult.qualifyingMarksGeneral}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Top 0.1% Mean (Mt):</span>
                  <span className="font-bold text-white">{scoreResult.topMeanMarks}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Note: {scoreResult.explanation} All rank projections are empirical estimates based on multi-year distributions.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TOOL 4: CROSS-PAPER OVERLAP COMPARATOR */}
      {activeToolTab === 'OVERLAP' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Scale className="w-5 h-5 text-indigo-600" />
              <span>Cross-Paper Syllabus Overlap & Strategy Comparator</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quantify the subject-wise synergy and divergent syllabus between primary and secondary papers to maximize dual-paper score yield with minimal preparation overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Paper 1:</label>
              <select
                value={overlapP1}
                onChange={e => {
                  setOverlapP1(e.target.value);
                  handleLoadOverlap(e.target.value, overlapP2);
                }}
                className="w-full p-2 rounded-lg border border-slate-300 font-bold bg-white"
              >
                {papers.map(p => (
                  <option key={p.code} value={p.code}>{p.code} — {p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Paper 2:</label>
              <select
                value={overlapP2}
                onChange={e => {
                  setOverlapP2(e.target.value);
                  handleLoadOverlap(overlapP1, e.target.value);
                }}
                className="w-full p-2 rounded-lg border border-slate-300 font-bold bg-white"
              >
                {papers.map(p => (
                  <option key={p.code} value={p.code}>{p.code} — {p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {overlapResult && (
            <div className="space-y-6 animate-fadeIn">
              {/* Overlap Progress Bar */}
              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-indigo-950">
                    Syllabus Synergy ({overlapResult.paper1} & {overlapResult.paper2})
                  </span>
                  <span className="text-lg font-black text-indigo-700">
                    {overlapResult.sharedPercentage}% Shared
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${overlapResult.sharedPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-indigo-900 pt-1 font-medium">{overlapResult.preparationStrategy}</p>
              </div>

              {/* Shared Subjects */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-emerald-700 flex items-center space-x-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Shared & Transferable Syllabus Subjects:</span>
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 pl-1">
                  {(overlapResult.commonSubjects || []).map((sub: string, i: number) => (
                    <li key={i} className="leading-relaxed">{sub}</li>
                  ))}
                </ul>
              </div>

              {/* Divergent Subjects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Unique to {overlapResult.paper1}:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    {(overlapResult.divergentSubjectsP1 || []).map((sub: string, i: number) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Unique to {overlapResult.paper2}:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    {(overlapResult.divergentSubjectsP2 || []).map((sub: string, i: number) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 5: SEPARATED CUTOFFS REGISTRY */}
      {activeToolTab === 'CUTOFFS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>Strictly Separated Cutoff Registries</span>
              </h3>
              <p className="text-xs text-slate-500">
                Grounded in official gazette scorecards, COAP rounds, and PSU notification archives.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Filter Paper:</span>
              <select
                value={cutoffPaperCode}
                onChange={e => {
                  setCutoffPaperCode(e.target.value);
                  handleLoadCutoffs(cutoffType, e.target.value);
                }}
                className="px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white"
              >
                <option value="ALL">All Papers</option>
                <option value="EC">EC</option>
                <option value="CS">CS</option>
                <option value="DA">DA</option>
                <option value="EE">EE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
              </select>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex space-x-2 border-b border-slate-200 pb-2">
            {[
              { id: 'QUALIFYING', label: '1. Official Qualifying Cutoffs' },
              { id: 'ADMISSION', label: '2. IIT / NIT Admission Cutoffs (COAP/CCMT)' },
              { id: 'PSU', label: '3. PSU Shortlisting Cutoffs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setCutoffType(tab.id as any);
                  handleLoadCutoffs(tab.id, cutoffPaperCode);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  cutoffType === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cutoffs Content */}
          {loadingCutoffs ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading verified cutoffs...</div>
          ) : (
            <div className="overflow-x-auto">
              {cutoffType === 'QUALIFYING' && (
                <div className="space-y-4">
                  {Object.entries(cutoffsData?.data || cutoffsData?.qualifyingCutoffs || {}).map(([code, rows]: any) => (
                    <div key={code} className="space-y-2">
                      <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Paper: {code} — Qualifying Cutoffs
                      </h4>
                      <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                        <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">Year</th>
                            <th className="p-2.5">General</th>
                            <th className="p-2.5">OBC / EWS</th>
                            <th className="p-2.5">SC / ST / PwD</th>
                            <th className="p-2.5">AIR 1 Highest Marks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(rows || []).map((r: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="p-2.5 font-bold text-slate-900">{r.year}</td>
                              <td className="p-2.5 font-bold text-indigo-700">{r.General} Marks</td>
                              <td className="p-2.5 text-slate-700">{r.OBC_EWS || r.OBC} Marks</td>
                              <td className="p-2.5 text-slate-700">{r.SC_ST_PwD || r.SC_ST} Marks</td>
                              <td className="p-2.5 text-emerald-700 font-semibold">{r.maxMarksAwarded} Marks</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {cutoffType === 'ADMISSION' && (
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Institute</th>
                      <th className="p-2.5">M.Tech Program</th>
                      <th className="p-2.5">Paper</th>
                      <th className="p-2.5">General Score</th>
                      <th className="p-2.5">OBC Score</th>
                      <th className="p-2.5">SC/ST Score</th>
                      <th className="p-2.5">Round</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(cutoffsData?.data || cutoffsData?.admissionCutoffs || []).map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{row.instituteName}</td>
                        <td className="p-2.5 text-slate-700 font-medium">{row.program}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{row.paperCode}</td>
                        <td className="p-2.5 font-bold text-slate-900">{row.gateScoreCutoff?.General}</td>
                        <td className="p-2.5 text-slate-700">{row.gateScoreCutoff?.OBC}</td>
                        <td className="p-2.5 text-slate-700">{row.gateScoreCutoff?.SC}</td>
                        <td className="p-2.5 text-slate-500">{row.round}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {cutoffType === 'PSU' && (
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">PSU</th>
                      <th className="p-2.5">Post</th>
                      <th className="p-2.5">Paper</th>
                      <th className="p-2.5">Metric</th>
                      <th className="p-2.5">General</th>
                      <th className="p-2.5">OBC</th>
                      <th className="p-2.5">SC/ST</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(cutoffsData?.data || cutoffsData?.psuShortlistingCutoffs || []).map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{row.psuName}</td>
                        <td className="p-2.5 text-slate-700">{row.postTitle}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{row.paperCode}</td>
                        <td className="p-2.5 text-slate-500">{row.criteria}</td>
                        <td className="p-2.5 font-bold text-emerald-700">{row.cutoffGeneral}</td>
                        <td className="p-2.5 text-slate-700">{row.cutoffOBC}</td>
                        <td className="p-2.5 text-slate-700">{row.cutoffSC}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOOL 6: PSU RECRUITMENT TRACKER */}
      {activeToolTab === 'PSUS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>PSU Recruitment Tracker for GATE</span>
              </h3>
              <p className="text-xs text-slate-500">
                Track Central Public Sector Enterprises accepting specific GATE paper codes for Executive Trainee & Scientist B recruitments.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Select Paper:</span>
              <select
                value={psuPaperFilter}
                onChange={e => {
                  setPsuPaperFilter(e.target.value);
                  handleLoadPSUs(e.target.value);
                }}
                className="px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white"
              >
                <option value="EC">EC (Electronics)</option>
                <option value="CS">CS (Computer Science)</option>
                <option value="DA">DA (Data Science & AI)</option>
                <option value="EE">EE (Electrical)</option>
                <option value="ME">ME (Mechanical)</option>
                <option value="CE">CE (Civil)</option>
              </select>
            </div>
          </div>

          {loadingPSUs ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading PSUs...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {psuList.map((psu: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-slate-900 text-sm">{psu.psuName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {psu.status}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{psu.fullName}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Notice: {psu.notificationMonth}</span>
                    <a
                      href={psu.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <span>Careers</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
