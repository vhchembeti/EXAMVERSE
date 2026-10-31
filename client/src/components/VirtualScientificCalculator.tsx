// client/src/components/VirtualScientificCalculator.tsx
// Authentic GATE / TCS iON Virtual Scientific Calculator
// Non-programmable scientific calculator adhering to official examination standards

import React, { useState } from 'react';
import { X, RotateCcw, Delete } from 'lucide-react';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualScientificCalculator: React.FC<CalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isRad, setIsRad] = useState(true);
  const [memory, setMemory] = useState(0);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleOperator = (op: string) => {
    setExpression(`${display} ${op} `);
    setDisplay('0');
  };

  const handleEvaluate = () => {
    try {
      const fullExpr = (expression + display)
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      // Safe evaluation using basic math parsing
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${fullExpr})`)();
      if (!isFinite(result) || isNaN(result)) {
        setDisplay('Error');
      } else {
        const rounded = Number(parseFloat(result.toFixed(8)).toString());
        setDisplay(String(rounded));
        setExpression('');
      }
    } catch {
      setDisplay('Error');
    }
  };

  const handleUnaryFunc = (funcName: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const toAngle = (x: number) => (isRad ? x : (x * Math.PI) / 180);
    const fromAngle = (x: number) => (isRad ? x : (x * 180) / Math.PI);

    switch (funcName) {
      case 'sin':
        res = Math.sin(toAngle(val));
        break;
      case 'cos':
        res = Math.cos(toAngle(val));
        break;
      case 'tan':
        res = Math.tan(toAngle(val));
        break;
      case 'asin':
        res = fromAngle(Math.asin(val));
        break;
      case 'acos':
        res = fromAngle(Math.acos(val));
        break;
      case 'atan':
        res = fromAngle(Math.atan(val));
        break;
      case 'ln':
        res = Math.log(val);
        break;
      case 'log10':
        res = Math.log10(val);
        break;
      case 'sqrt':
        res = Math.sqrt(val);
        break;
      case 'sqr':
        res = val * val;
        break;
      case 'cube':
        res = val * val * val;
        break;
      case 'inv':
        res = val !== 0 ? 1 / val : NaN;
        break;
      case 'exp':
        res = Math.exp(val);
        break;
      case 'pow10':
        res = Math.pow(10, val);
        break;
      case 'fact':
        res = factorial(Math.round(val));
        break;
      case 'neg':
        res = -val;
        break;
      default:
        return;
    }

    if (isNaN(res) || !isFinite(res)) {
      setDisplay('Error');
    } else {
      setDisplay(String(Number(parseFloat(res.toFixed(8)).toString())));
    }
  };

  const factorial = (n: number): number => {
    if (n < 0 || n > 170) return NaN;
    if (n === 0 || n === 1) return 1;
    let acc = 1;
    for (let i = 2; i <= n; i++) acc *= i;
    return acc;
  };

  const handleConstant = (c: 'pi' | 'e') => {
    if (c === 'pi') setDisplay(String(Math.PI));
    if (c === 'e') setDisplay(String(Math.E));
  };

  // Memory functions
  const handleMemory = (mAction: string) => {
    const val = parseFloat(display) || 0;
    switch (mAction) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        break;
      case 'MS':
        setMemory(val);
        break;
      case 'M+':
        setMemory((prev) => prev + val);
        break;
      case 'M-':
        setMemory((prev) => prev - val);
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Official GATE Virtual Scientific Calculator (Non-Programmable)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-4 bg-slate-950 border-b border-slate-800">
          <div className="h-6 text-xs font-mono text-slate-400 text-right overflow-hidden truncate">
            {expression || '\u00A0'}
          </div>
          <div className="text-3xl font-mono font-bold text-emerald-400 text-right tracking-wider overflow-x-auto select-all">
            {display}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/50 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRad(!isRad)}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  isRad ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isRad ? 'RAD' : 'DEG'}
              </button>
              {memory !== 0 && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  M = {memory}
                </span>
              )}
            </div>
            <span>Standard IEEE 754 Floating-Point</span>
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="p-4 grid grid-cols-6 gap-1.5 text-xs font-medium">
          {/* Memory Row */}
          <button onClick={() => handleMemory('MC')} className="calc-btn-meta">MC</button>
          <button onClick={() => handleMemory('MR')} className="calc-btn-meta">MR</button>
          <button onClick={() => handleMemory('MS')} className="calc-btn-meta">MS</button>
          <button onClick={() => handleMemory('M+')} className="calc-btn-meta">M+</button>
          <button onClick={() => handleMemory('M-')} className="calc-btn-meta">M-</button>
          <button onClick={handleBackspace} className="calc-btn-meta flex items-center justify-center">
            <Delete className="w-4 h-4 text-rose-400" />
          </button>

          {/* Scientific Row 1 */}
          <button onClick={() => handleUnaryFunc('sin')} className="calc-btn-fn">sin</button>
          <button onClick={() => handleUnaryFunc('cos')} className="calc-btn-fn">cos</button>
          <button onClick={() => handleUnaryFunc('tan')} className="calc-btn-fn">tan</button>
          <button onClick={() => handleUnaryFunc('ln')} className="calc-btn-fn">ln</button>
          <button onClick={() => handleUnaryFunc('log10')} className="calc-btn-fn">log</button>
          <button onClick={handleClear} className="calc-btn-clear flex items-center justify-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> C
          </button>

          {/* Scientific Row 2 */}
          <button onClick={() => handleUnaryFunc('asin')} className="calc-btn-fn">sin⁻¹</button>
          <button onClick={() => handleUnaryFunc('acos')} className="calc-btn-fn">cos⁻¹</button>
          <button onClick={() => handleUnaryFunc('atan')} className="calc-btn-fn">tan⁻¹</button>
          <button onClick={() => handleUnaryFunc('sqrt')} className="calc-btn-fn">√x</button>
          <button onClick={() => handleUnaryFunc('sqr')} className="calc-btn-fn">x²</button>
          <button onClick={() => handleOperator('/')} className="calc-btn-op">÷</button>

          {/* Scientific Row 3 & Digits 7,8,9 */}
          <button onClick={() => handleUnaryFunc('exp')} className="calc-btn-fn">eˣ</button>
          <button onClick={() => handleUnaryFunc('pow10')} className="calc-btn-fn">10ˣ</button>
          <button onClick={() => handleDigit('7')} className="calc-btn-num">7</button>
          <button onClick={() => handleDigit('8')} className="calc-btn-num">8</button>
          <button onClick={() => handleDigit('9')} className="calc-btn-num">9</button>
          <button onClick={() => handleOperator('*')} className="calc-btn-op">×</button>

          {/* Scientific Row 4 & Digits 4,5,6 */}
          <button onClick={() => handleUnaryFunc('inv')} className="calc-btn-fn">1/x</button>
          <button onClick={() => handleUnaryFunc('fact')} className="calc-btn-fn">n!</button>
          <button onClick={() => handleDigit('4')} className="calc-btn-num">4</button>
          <button onClick={() => handleDigit('5')} className="calc-btn-num">5</button>
          <button onClick={() => handleDigit('6')} className="calc-btn-num">6</button>
          <button onClick={() => handleOperator('-')} className="calc-btn-op">−</button>

          {/* Scientific Row 5 & Digits 1,2,3 */}
          <button onClick={() => handleConstant('pi')} className="calc-btn-fn">π</button>
          <button onClick={() => handleConstant('e')} className="calc-btn-fn">e</button>
          <button onClick={() => handleDigit('1')} className="calc-btn-num">1</button>
          <button onClick={() => handleDigit('2')} className="calc-btn-num">2</button>
          <button onClick={() => handleDigit('3')} className="calc-btn-num">3</button>
          <button onClick={() => handleOperator('+')} className="calc-btn-op">+</button>

          {/* Scientific Row 6 & 0, Decimal, Equals */}
          <button onClick={() => handleUnaryFunc('neg')} className="calc-btn-fn">±</button>
          <button onClick={() => handleOperator('%')} className="calc-btn-fn">%</button>
          <button onClick={() => handleDigit('0')} className="calc-btn-num col-span-2">0</button>
          <button onClick={handleDecimal} className="calc-btn-num">.</button>
          <button onClick={handleEvaluate} className="calc-btn-eq">=</button>
        </div>
      </div>
    </div>
  );
};
