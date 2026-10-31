// client/src/views/SpeedMathGymView.tsx
// 60-Second Mental Math & Calculation Reflex Gym (Vedic, Sqrt in 3s, Digital Sum, Fraction-to-%)

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Zap,
  ArrowLeft,
  Calculator,
  Sparkles,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Search
} from 'lucide-react';
import { api } from '../services/api';

interface SpeedMathGymViewProps {
  onBack: () => void;
}

export const SpeedMathGymView: React.FC<SpeedMathGymViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'vedic' | 'sqrt' | 'dsum' | 'fractions'>('vedic');

  // Vedic Math state
  const [vedicA, setVedicA] = useState<number>(43);
  const [vedicB, setVedicB] = useState<number>(47);
  const [vedicResult, setVedicResult] = useState<any>(null);

  // Sqrt state
  const [sqrtNum, setSqrtNum] = useState<number>(67);
  const [sqrtResult, setSqrtResult] = useState<any>(null);

  // Digital Sum state
  const [dSumInput, setDSumInput] = useState<string>('785642');
  const [dSumResult, setDSumResult] = useState<any>(null);

  // Fractions table
  const [fractions, setFractions] = useState<any[]>([]);

  useEffect(() => {
    loadGymData();
    calculateVedic(43, 47);
    calculateSqrt(67);
    calculateDSum('785642');
  }, []);

  const loadGymData = async () => {
    try {
      const data = await api.getSpeedGymDrills();
      setFractions(data.fractionPercentTable || []);
    } catch (err) {
      console.error('Failed to load gym data:', err);
    }
  };

  const calculateVedic = async (a: number, b: number) => {
    try {
      const res = await api.vedicMultiply(a, b);
      setVedicResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateSqrt = async (n: number) => {
    try {
      const res = await api.estimateSquareRoot(n);
      setSqrtResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateDSum = async (num: string) => {
    try {
      const res = await api.computeDigitalSum(num);
      setDSumResult(res);
    } catch (err) {
      console.error(err);
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
        <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
          Mental Calculation Gym • 0s Latency
        </span>
      </div>

      {/* Hero Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Brain className="w-4 h-4" />
          Calculation Reflex Conditioning
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          60-Second Mental Math &amp; Calculation Reflex Gym
        </h1>
        <p className="text-sm text-slate-300">
          Train your subconscious reflexes on Vedic short-multiplications, 3-second non-perfect square roots, Digital Sum casting, and fraction-to-percentage conversions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('vedic')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'vedic'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          1. Vedic Multiplication
        </button>
        <button
          onClick={() => setActiveTab('sqrt')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'sqrt'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4 text-cyan-400" />
          2. Square Root in 3s
        </button>
        <button
          onClick={() => setActiveTab('dsum')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'dsum'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          3. Digital Sum (C9)
        </button>
        <button
          onClick={() => setActiveTab('fractions')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'fractions'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-rose-400" />
          4. Fraction-to-% Table
        </button>
      </div>

      {/* 1. VEDIC MULTIPLICATION */}
      {activeTab === 'vedic' && (
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Vedic Pattern Multiplication Engine</h2>
            <p className="text-xs text-slate-400">
              Enter any two 2-digit numbers to detect instant shortcuts (e.g. Same tens units add to 10, Near base 100, or 2x2 Crosswise).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">Number A:</label>
              <input
                type="number"
                value={vedicA}
                onChange={e => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setVedicA(val);
                  calculateVedic(val, vedicB);
                }}
                className="w-28 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-base font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
            <span className="text-xl font-bold text-slate-500 mt-5">×</span>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">Number B:</label>
              <input
                type="number"
                value={vedicB}
                onChange={e => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setVedicB(val);
                  calculateVedic(vedicA, val);
                }}
                className="w-28 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-base font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-1 ml-auto">
              <label className="text-xs text-slate-400 font-semibold">Try High-Yield Presets:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setVedicA(43); setVedicB(47); calculateVedic(43, 47); }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-slate-700 font-mono"
                >
                  43 × 47
                </button>
                <button
                  onClick={() => { setVedicA(96); setVedicB(94); calculateVedic(96, 94); }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 font-mono"
                >
                  96 × 94
                </button>
                <button
                  onClick={() => { setVedicA(65); setVedicB(65); calculateVedic(65, 65); }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 border border-slate-700 font-mono"
                >
                  65 × 65
                </button>
              </div>
            </div>
          </div>

          {vedicResult && (
            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Pattern Detected: {vedicResult.pattern}
                </span>
                <span className="text-lg font-mono font-extrabold text-emerald-400">
                  Product = {vedicResult.result}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Mental Calculation Execution Trace:
                </span>
                <div className="space-y-1.5 font-mono text-xs text-slate-200">
                  {vedicResult.steps?.map((st: string, idx: number) => (
                    <div key={idx} className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      {st}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. SQUARE ROOT IN 3 SECONDS */}
      {activeTab === 'sqrt' && (
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Square Root in 3 Seconds (Differential Formula)</h2>
            <p className="text-xs text-slate-400">
              Formula: √(x ± y) ≈ √x ± y / (2√x) where x is the nearest perfect square.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">Enter Any Number (N):</label>
              <input
                type="number"
                value={sqrtNum}
                onChange={e => {
                  const val = parseInt(e.target.value, 10) || 1;
                  setSqrtNum(val);
                  calculateSqrt(val);
                }}
                className="w-32 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-base font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1 ml-auto">
              <label className="text-xs text-slate-400 font-semibold">Exam Presets:</label>
              <div className="flex gap-2">
                {[27, 47, 67, 85, 142].map(n => (
                  <button
                    key={n}
                    onClick={() => { setSqrtNum(n); calculateSqrt(n); }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 font-mono"
                  >
                    √{n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {sqrtResult && (
            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-xl font-mono font-bold text-amber-400">
                    {sqrtResult.approximatedRoot}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">
                    Mental Approximation
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-xl font-mono font-bold text-white">
                    {sqrtResult.exactRoot}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">
                    Exact Floating Root
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-xl font-mono font-bold text-emerald-400">
                    {sqrtResult.errorPercent}%
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">
                    Approximation Error
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-xs text-slate-200">
                {sqrtResult.steps?.map((st: string, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    {st}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. DIGITAL SUM (CASTING OUT 9S) */}
      {activeTab === 'dsum' && (
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Digital Sum &amp; Casting Out Nines Simulator</h2>
            <p className="text-xs text-slate-400">
              Digital Root of n equals n mod 9. In any multiplication, addition, or power, Digital Root(LHS) must equal Digital Root(RHS).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1 flex-1 min-w-[200px]">
              <label className="text-xs text-slate-400 font-semibold">Enter Expression or Number:</label>
              <input
                type="text"
                value={dSumInput}
                onChange={e => {
                  setDSumInput(e.target.value);
                  calculateDSum(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-base font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">Try Large Numbers:</label>
              <div className="flex gap-2">
                {['785642', '999999', '12345678', '888888'].map(val => (
                  <button
                    key={val}
                    onClick={() => { setDSumInput(val); calculateDSum(val); }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 border border-slate-700 font-mono"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {dSumResult && (
            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Computed Single-Digit Digital Root:
                </span>
                <span className="text-2xl font-mono font-extrabold text-amber-400 px-4 py-1 rounded-lg bg-slate-900 border border-slate-800">
                  {dSumResult.digitalRoot}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-indigo-400">Golden Rule of Casting Out 9s:</div>
                <div>{dSumResult.castingOutNinesRule}</div>
                <div className="text-slate-400 text-[11px] mt-1">
                  If option A has digital root 3 and calculated target has digital root 7, option A is mathematically impossible in 1 second without full calculation!
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. FRACTION TO PERCENTAGE TABLE */}
      {activeTab === 'fractions' && (
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Universal Fraction-to-Percentage Memory Matrix</h2>
            <p className="text-xs text-slate-400">
              Must-know standard conversion table from 1/2 to 1/25 with associative memory tricks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {fractions.map((f: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-mono font-bold text-amber-400">{f.fraction}</span>
                  <span className="text-sm font-mono font-bold text-white">{f.percent}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Dec: {f.decimal}</span>
                  <span className="text-[11px] text-indigo-300 italic">{f.trick}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
