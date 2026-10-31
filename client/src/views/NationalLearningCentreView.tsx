// client/src/views/NationalLearningCentreView.tsx
// National Learning Centre: Multi-Tier Educational Spaces & 20 Core Subject Domains

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Calculator,
  Cpu,
  Database,
  Server,
  Zap,
  Activity,
  Radio,
  Layers,
  Atom,
  FlaskConical,
  TrendingUp,
  Compass,
  Landmark,
  Binary,
  Brain,
  ExternalLink,
  Search,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { api } from '../services/api';

const ICON_MAP: Record<string, React.ReactNode> = {
  Calculator: <Calculator className="w-5 h-5" />,
  Network: <Binary className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Binary: <Binary className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Radio: <Radio className="w-5 h-5" />,
  Sliders: <Activity className="w-5 h-5" />,
  Atom: <Atom className="w-5 h-5" />,
  FlaskConical: <FlaskConical className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />
};

export const NationalLearningCentreView: React.FC = () => {
  const [tiers, setTiers] = useState<any[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedTier]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tiersRes, subjectsRes] = await Promise.all([
        api.getLearningTiers(),
        api.getLearningSubjects(selectedTier === 'ALL' ? undefined : selectedTier)
      ]);
      setTiers(tiersRes);
      setSubjects(subjectsRes);
    } catch (err) {
      console.error('Failed to load learning repository:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubject = async (subjectId: string) => {
    try {
      const fullSubject = await api.getLearningSubjectById(subjectId);
      setActiveSubject(fullSubject);
    } catch (err) {
      console.error('Failed to load subject details:', err);
    }
  };

  const filteredSubjects = subjects.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <GraduationCap className="w-96 h-96" />
          </div>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              National Learning Centre & Provenance Repository
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Verified Open Curriculum across 8 Education Levels & 20 Subjects
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Curated syllabus architectures, NPTEL courseware links, standard NCERT resources, and high-yield formula sheets with strict open-access licensing provenance.
            </p>
          </div>
        </div>

        {/* Education Tier Navigation */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Educational Tier
          </h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedTier('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTier === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
              }`}
            >
              All Levels (20 Domains)
            </button>
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTier === tier.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {tier.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, codes, or concepts (e.g., Linear Algebra, Operating Systems, KCL, BCNF)..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
        </div>

        {/* Subject Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">Loading verified subject spaces...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subj) => (
              <div
                key={subj.id}
                onClick={() => handleOpenSubject(subj.id)}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-300 transition cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      {ICON_MAP[subj.icon] || <BookOpen className="w-5 h-5" />}
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-bold">
                      {subj.code}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {subj.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {subj.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-3">
                    <span>{subj.totalTopics} Topics</span>
                    <span>•</span>
                    <span>{subj.totalFormulas} Formulas</span>
                  </div>
                  <span className="text-indigo-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                    Explore <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subject Detail Drawer / Modal */}
        {activeSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
              {/* Drawer Header */}
              <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    {ICON_MAP[activeSubject.icon] || <BookOpen className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      {activeSubject.name}
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-xs font-mono">
                        {activeSubject.code}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Standard syllabus specifications and verified public courseware
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubject(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Syllabus Topics */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Curriculum Modules & Exam Weightages
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeSubject.syllabusTopics?.map((t: any) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-800">{t.name}</h4>
                          <p className="text-[11px] text-slate-500">
                            Est. {t.estHours} study hours
                            {t.prerequisites?.length > 0 && ` • Prerequisites: ${t.prerequisites.join(', ')}`}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-bold whitespace-nowrap">
                          {t.weightage} Marks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Resources & Provenance */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Verified Courseware & Official References
                  </h3>
                  <div className="space-y-2">
                    {activeSubject.resources?.map((res: any) => (
                      <div
                        key={res.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {res.license}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900">{res.title}</h4>
                          </div>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Provenance: {res.provenance}
                          </p>
                        </div>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition text-xs font-semibold flex items-center gap-1"
                        >
                          Access <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formulas & Theorems */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Key Mathematical Formulas & Theorems
                  </h3>
                  <div className="space-y-3">
                    {activeSubject.formulas?.map((f: any) => (
                      <div
                        key={f.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{f.name}</span>
                          <span className="text-[11px] text-slate-500">{f.topic}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-950 font-mono text-emerald-400 text-xs overflow-x-auto">
                          {f.latex}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                        {f.example && (
                          <p className="text-[11px] text-indigo-600 bg-indigo-50 p-2 rounded-md">
                            <strong>Exam Tip / Example:</strong> {f.example}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
