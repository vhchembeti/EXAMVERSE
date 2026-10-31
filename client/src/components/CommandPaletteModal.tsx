// client/src/components/CommandPaletteModal.tsx
// Global Cmd/Ctrl + K Quick Command Palette (Omnibar)
// Allows instantaneous 1-keystroke navigation to any Exam, Recruitment Board,
// GATE Paper, Aptitude Topic, or Platform Tool across EXAMVERSE.

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Zap,
  BookOpen,
  Building2,
  Scale,
  Compass,
  GraduationCap,
  Award,
  Calendar,
  Shield,
  Sparkles,
  ArrowRight,
  X,
  Clock,
  Layers
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'EXAM' | 'GATE_PAPER' | 'BOARD' | 'APTITUDE' | 'TOOL';
  subtitle: string;
  icon: any;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
  onSelectExam?: (examId: string) => void;
  onSelectGatePaper?: (paperCode: string) => void;
  onSelectAptitudeTopic?: (topicId: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectExam,
  onSelectGatePaper,
  onSelectAptitudeTopic
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown listener for Cmd/Ctrl + K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open handled by parent or state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Command items catalog
  const commands: CommandItem[] = [
    // Core Tools
    {
      id: 'tool-dashboard',
      title: 'Student Dashboard',
      category: 'TOOL',
      subtitle: 'Central hub with saved exams, daily targets, and eligibility overview',
      icon: Layers,
      action: () => { onNavigateTab('dashboard'); onClose(); },
      keywords: ['home', 'main', 'summary', 'overview']
    },
    {
      id: 'tool-aptitude-hub',
      title: 'Universal Aptitude & Blink Speed Mastery',
      category: 'TOOL',
      subtitle: '8-pillar curriculum from scratch to <15s Blink-Ticks & Reflex Gym',
      icon: Zap,
      action: () => { onNavigateTab('aptitude'); onClose(); },
      keywords: ['quant', 'reasoning', 'math', 'tricks', 'blink', 'speed', 'drills']
    },
    {
      id: 'tool-ai-companion',
      title: 'AI Academic Companion',
      category: 'TOOL',
      subtitle: 'Citation-grounded tutor, symbolic numerical solver & revision assistant',
      icon: Sparkles,
      action: () => { onNavigateTab('ai-companion'); onClose(); },
      keywords: ['tutor', 'doubt', 'solver', 'sympy', 'math']
    },
    {
      id: 'tool-cbt-mocks',
      title: 'CBT Mock Exam Center',
      category: 'TOOL',
      subtitle: 'TCS iON / GATE realistic test environment with authentic marking schemes',
      icon: Award,
      action: () => { onNavigateTab('mock-tests'); onClose(); },
      keywords: ['test', 'practice', 'quiz', 'ion', 'simulation']
    },
    {
      id: 'tool-career-dag',
      title: 'Career Pathway Graph (DAG)',
      category: 'TOOL',
      subtitle: 'Dijkstra shortest path & topological sort prerequisite pathway explorer',
      icon: Compass,
      action: () => { onNavigateTab('career-pathways'); onClose(); },
      keywords: ['dijkstra', 'graph', 'prerequisites', 'roadmap']
    },
    {
      id: 'tool-salary-explorer',
      title: '7th CPC & PSU Salary Explorer',
      category: 'TOOL',
      subtitle: 'Central Pay Matrix levels 1-14, city classifications X/Y/Z, DA/HRA & bonds',
      icon: Scale,
      action: () => { onNavigateTab('salary-explorer'); onClose(); },
      keywords: ['pay', 'salary', 'bond', 'allowance', 'nps', 'hra']
    },
    {
      id: 'tool-gate-hub',
      title: 'GATE Intelligence Hub',
      category: 'TOOL',
      subtitle: 'All 30 papers, 2-paper matrix, multi-session normalization & cutoffs',
      icon: Scale,
      action: () => { onNavigateTab('gate-hub'); onClose(); },
      keywords: ['gate', 'iit', 'psu', 'two paper', 'normalization']
    },
    {
      id: 'tool-e2ee-notebook',
      title: 'E2EE Doubt Notebook',
      category: 'TOOL',
      subtitle: 'Client-side AES-256-GCM zero-knowledge encrypted student vault',
      icon: Shield,
      action: () => { onNavigateTab('notebook'); onClose(); },
      keywords: ['privacy', 'encrypted', 'notes', 'e2ee', 'vault']
    },
    {
      id: 'tool-calendar-clash',
      title: 'Exam Calendar & Clash Detector',
      category: 'TOOL',
      subtitle: 'Interval tree collision engine with multi-exam iCal export',
      icon: Calendar,
      action: () => { onNavigateTab('calendar'); onClose(); },
      keywords: ['dates', 'clash', 'schedule', 'ical', 'timeline']
    },

    // Statutory Exams
    {
      id: 'exam-upsc-cse',
      title: 'UPSC Civil Services Examination (CSE)',
      category: 'EXAM',
      subtitle: 'IAS / IPS / IFS • Prelims, Mains, Interview • Group A Gazetted',
      icon: BookOpen,
      action: () => {
        onNavigateTab('explore');
        onSelectExam?.('upsc-cse');
        onClose();
      },
      keywords: ['upsc', 'ias', 'ips', 'civil services', 'prelims']
    },
    {
      id: 'exam-gate-2026',
      title: 'GATE 2026 (Graduate Aptitude Test in Engineering)',
      category: 'EXAM',
      subtitle: 'IISc / IITs • PSU Executive Trainees & M.Tech / PhD Admissions',
      icon: Scale,
      action: () => {
        onNavigateTab('gate-hub');
        onClose();
      },
      keywords: ['gate', 'iit', 'iisc', 'psu', 'engineering']
    },
    {
      id: 'exam-ssc-cgl',
      title: 'SSC Combined Graduate Level (CGL)',
      category: 'EXAM',
      subtitle: 'Staff Selection Commission • Income Tax, ASO, Excise Inspector',
      icon: BookOpen,
      action: () => {
        onNavigateTab('explore');
        onSelectExam?.('ssc-cgl');
        onClose();
      },
      keywords: ['ssc', 'cgl', 'income tax', 'inspector', 'tier 1']
    },
    {
      id: 'exam-ibps-po',
      title: 'IBPS Probationary Officer (PO / MT)',
      category: 'EXAM',
      subtitle: '11 Public Sector Banks • Scale I Officer Recruitment',
      icon: BookOpen,
      action: () => {
        onNavigateTab('explore');
        onSelectExam?.('ibps-po');
        onClose();
      },
      keywords: ['bank', 'ibps', 'po', 'scale 1', 'probationary']
    },
    {
      id: 'exam-rrb-ntpc',
      title: 'Railway RRB NTPC (Non-Technical Popular Categories)',
      category: 'EXAM',
      subtitle: 'Indian Railways • Station Master, Goods Guard, Commercial Apprentice',
      icon: BookOpen,
      action: () => {
        onNavigateTab('explore');
        onSelectExam?.('rrb-ntpc');
        onClose();
      },
      keywords: ['railway', 'rrb', 'ntpc', 'station master', 'goods guard']
    },

    // GATE Paper Codes
    {
      id: 'gate-ec',
      title: 'GATE EC — Electronics & Communication Engineering',
      category: 'GATE_PAPER',
      subtitle: 'Signals, Analog, Digital, ED, Communications, Electromagnetics',
      icon: Zap,
      action: () => {
        onNavigateTab('gate-hub');
        onSelectGatePaper?.('EC');
        onClose();
      },
      keywords: ['ec', 'electronics', 'vlsi', 'dsp', 'semiconductor']
    },
    {
      id: 'gate-cs',
      title: 'GATE CS — Computer Science & Information Technology',
      category: 'GATE_PAPER',
      subtitle: 'DSA, Algorithms, OS, DBMS, Computer Networks, Theory of Computation',
      icon: Zap,
      action: () => {
        onNavigateTab('gate-hub');
        onSelectGatePaper?.('CS');
        onClose();
      },
      keywords: ['cs', 'cse', 'computer science', 'programming', 'dsa']
    },
    {
      id: 'gate-da',
      title: 'GATE DA — Data Science & Artificial Intelligence',
      category: 'GATE_PAPER',
      subtitle: 'Linear Algebra, Probability, Machine Learning, AI, Python & SQL',
      icon: Zap,
      action: () => {
        onNavigateTab('gate-hub');
        onSelectGatePaper?.('DA');
        onClose();
      },
      keywords: ['da', 'data science', 'ai', 'machine learning', 'python']
    },
    {
      id: 'gate-ee',
      title: 'GATE EE — Electrical Engineering',
      category: 'GATE_PAPER',
      subtitle: 'Power Systems, Electrical Machines, Power Electronics, Control Systems',
      icon: Zap,
      action: () => {
        onNavigateTab('gate-hub');
        onSelectGatePaper?.('EE');
        onClose();
      },
      keywords: ['ee', 'electrical', 'power systems', 'machines']
    },
    {
      id: 'gate-me',
      title: 'GATE ME — Mechanical Engineering',
      category: 'GATE_PAPER',
      subtitle: 'Thermodynamics, Fluid Mechanics, TOM, Machine Design, Manufacturing',
      icon: Zap,
      action: () => {
        onNavigateTab('gate-hub');
        onSelectGatePaper?.('ME');
        onClose();
      },
      keywords: ['me', 'mechanical', 'thermal', 'fluids', 'manufacturing']
    },
    {
      id: 'gate-ce',
      title: 'GATE CE — Civil Engineering',
      category: 'GATE_PAPER',
      subtitle: 'Structural Analysis, Geotechnical, Environmental, Transportation',
      icon: Zap,
      action: () => {
        onNavigateTab('gate-hub');
        onSelectGatePaper?.('CE');
        onClose();
      },
      keywords: ['ce', 'civil', 'structures', 'geotech', 'hydrology']
    },

    // Aptitude & Speed Tricks
    {
      id: 'apt-divisibility',
      title: 'Divisibility Rules (2 to 37) & 72 / 88 / 99 Co-Prime Splits',
      category: 'APTITUDE',
      subtitle: 'Sub-15s composite factor cancellation and missing digit solvers',
      icon: Zap,
      action: () => {
        onNavigateTab('aptitude');
        onSelectAptitudeTopic?.('classification-divisibility');
        onClose();
      },
      keywords: ['divisibility', '72', '88', '99', 'factors', 'remainder']
    },
    {
      id: 'apt-syllogism',
      title: 'Syllogisms 100-50 Income/Expense Method',
      category: 'APTITUDE',
      subtitle: 'Solve any syllogism without drawing Venn diagrams in 10 seconds',
      icon: Zap,
      action: () => {
        onNavigateTab('aptitude');
        onSelectAptitudeTopic?.('syllogisms-deductive');
        onClose();
      },
      keywords: ['syllogism', '100 50', 'deductive', 'venn', 'reasoning']
    },
    {
      id: 'apt-vedic-math',
      title: 'Vedic Math & Calculation Reflex Gym',
      category: 'APTITUDE',
      subtitle: 'Ekadhikena Purvena, Nikhilam Base-100 & 3-second non-perfect square roots',
      icon: Zap,
      action: () => {
        onNavigateTab('aptitude');
        onClose();
      },
      keywords: ['vedic', 'speed math', 'multiplication', 'square root', 'digital sum']
    },

    // Statutory Recruitment Boards
    {
      id: 'board-upsc',
      title: 'Union Public Service Commission (UPSC)',
      category: 'BOARD',
      subtitle: 'Dholpur House, New Delhi • Official Portal: upsc.gov.in',
      icon: Building2,
      action: () => { onNavigateTab('recruitment-boards'); onClose(); },
      keywords: ['upsc', 'central', 'dholpur house', 'commission']
    },
    {
      id: 'board-ssc',
      title: 'Staff Selection Commission (SSC)',
      category: 'BOARD',
      subtitle: 'CGO Complex, New Delhi • Official Portal: ssc.gov.in',
      icon: Building2,
      action: () => { onNavigateTab('recruitment-boards'); onClose(); },
      keywords: ['ssc', 'cgo complex', 'selection post']
    },
    {
      id: 'board-rrb',
      title: 'Railway Recruitment Control Board (RRB / RRC)',
      category: 'BOARD',
      subtitle: 'Ministry of Railways • Official Portal: rrbapply.gov.in',
      icon: Building2,
      action: () => { onNavigateTab('recruitment-boards'); onClose(); },
      keywords: ['rrb', 'rrc', 'railways', 'central']
    }
  ];

  const filteredCommands = commands.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    const inTitle = item.title.toLowerCase().includes(q);
    const inSubtitle = item.subtitle.toLowerCase().includes(q);
    const inCategory = item.category.toLowerCase().includes(q);
    const inKeywords = item.keywords?.some(k => k.toLowerCase().includes(q));
    return inTitle || inSubtitle || inCategory || inKeywords;
  });

  const handleKeyDownNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-16 md:pt-24 px-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDownNav}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type an exam, GATE paper (EC/CS/DA), topic, or tool..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm md:text-base focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700">
              ESC to exit
            </span>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills Header */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>{filteredCommands.length} results available</span>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300">Tool</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">Exam</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">GATE</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300">Aptitude</span>
          </div>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((item, index) => {
              const isSelected = selectedIndex === index;
              const Icon = item.icon;

              let badgeColor = 'bg-slate-800 text-slate-300';
              if (item.category === 'TOOL') badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
              if (item.category === 'EXAM') badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
              if (item.category === 'GATE_PAPER') badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
              if (item.category === 'APTITUDE') badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
              if (item.category === 'BOARD') badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/50 shadow-md text-white'
                      : 'hover:bg-slate-800/40 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs md:text-sm text-white truncate">
                          {item.title}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${badgeColor}`}>
                          {item.category.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-600'
                  }`} />
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 space-y-1">
              <p className="text-white font-medium">No results found for "{query}"</p>
              <p>Try searching for 'GATE', 'UPSC', '7th CPC', 'Syllogism', 'Vedic', or 'Calculator'.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>EXAMVERSE Universal Command Bar</span>
        </div>
      </div>
    </div>
  );
};
