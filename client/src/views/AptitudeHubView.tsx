// client/src/views/AptitudeHubView.tsx
// Phase 11: Universal Aptitude, Reasoning & "Blink-Tick" Speed Mastery Hub

import React, { useState, useEffect } from 'react';
import {
  Zap,
  BookOpen,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  Search,
  Filter,
  Play,
  CheckCircle,
  HelpCircle,
  Brain,
  Video,
  Target
} from 'lucide-react';
import { api } from '../services/api';

interface Pillar {
  id: string;
  pillarNumber: number;
  title: string;
  shortDescription: string;
  icon: string;
  difficultyRange: string;
  examRelevance: Record<string, string>;
  sectionCount: number;
  topicCount: number;
}

interface AptitudeTaxonomyResponse {
  totalPillars: number;
  totalTopics: number;
  totalQuestions: number;
  pillars: Pillar[];
}

interface AptitudeHubViewProps {
  onNavigateTopic: (topicId: string) => void;
  onNavigateDrill: (examTag?: string) => void;
  onNavigateGym: () => void;
  onNavigateAiCoach: (questionId?: string) => void;
}

export const AptitudeHubView: React.FC<AptitudeHubViewProps> = ({
  onNavigateTopic,
  onNavigateDrill,
  onNavigateGym,
  onNavigateAiCoach
}) => {
  const [taxonomy, setTaxonomy] = useState<AptitudeTaxonomyResponse | null>(null);
  const [selectedExam, setSelectedExam] = useState<string>('GATE_GA');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);
  const [pillarDetail, setPillarDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  useEffect(() => {
    loadTaxonomy();
  }, []);

  const loadTaxonomy = async () => {
    try {
      setLoading(true);
      const data = await api.getAptitudeTaxonomy();
      setTaxonomy(data);
      if (data?.pillars?.length > 0) {
        loadPillarDetail(data.pillars[0].id);
      }
    } catch (err) {
      console.error('Failed to load aptitude taxonomy:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPillarDetail = async (pillarId: string) => {
    try {
      setSelectedPillarId(pillarId);
      setDetailLoading(true);
      const p = await api.getAptitudePillar(pillarId);
      setPillarDetail(p);
    } catch (err) {
      console.error('Failed to load pillar detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const examPills = [
    { id: 'GATE_GA', label: 'GATE GA (15 Marks)', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { id: 'SSC_CGL', label: 'SSC CGL / CHSL', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { id: 'BANKING_PO', label: 'Banking IBPS / SBI PO', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { id: 'UPSC_CSAT', label: 'UPSC CSAT', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { id: 'CAT_MBA', label: 'CAT / XAT (MBA)', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    { id: 'DEFENCE_AFCAT', label: 'Defence AFCAT / CDS', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    { id: 'CAMPUS', label: 'Campus Placements', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Phase 11 • Universal Aptitude &amp; Blink Speed Mastery
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Universal Aptitude &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">Blink-Tick Speed Mastery Hub</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Zero-to-advanced curriculum from foundational 6th–10th grade scratch (Level 0) to top-percentile competitive shortcuts (Level 3).
            Features signature <strong>3-Way Solutions</strong>, sub-15 second elimination tricks, curated bilingual video lectures, and real-time reflex gyms.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateDrill(selectedExam)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              60s Blink Challenge Drill
            </button>
            <button
              onClick={onNavigateGym}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium transition-all"
            >
              <Brain className="w-4 h-4 text-cyan-400" />
              Mental Math &amp; Vedic Reflex Gym
            </button>
            <button
              onClick={() => onNavigateAiCoach()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 font-medium transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              AI Visual Elimination Coach
            </button>
          </div>
        </div>
      </div>

      {/* Target Exam Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filter by Target Exam Priority:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {examPills.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedExam(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedExam === p.id
                  ? `${p.color} ring-2 ring-indigo-500/50 shadow-md`
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search 49+ topics, tricks (e.g. Divisibility 72, Syllogism 100-50, Cylinders Pi 11, False Weight, Trailing Zeros)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
        />
      </div>

      {/* 8-Pillar Selector Tabs */}
      {taxonomy && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {taxonomy.pillars.map(pillar => {
            const isSelected = selectedPillarId === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => loadPillarDetail(pillar.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-28 ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/60 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Pillar {pillar.pillarNumber}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {pillar.topicCount}
                  </span>
                </div>
                <div className="font-semibold text-xs leading-tight line-clamp-2 text-white">
                  {pillar.title.split('(')[0]}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1">
                  {pillar.difficultyRange}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Pillar Content & Topic Directory */}
      {detailLoading ? (
        <div className="p-12 text-center text-slate-400">Loading pillar curriculum and video links...</div>
      ) : pillarDetail ? (
        <div className="space-y-6">
          {/* Pillar Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                  Pillar {pillarDetail.pillarNumber} of 8
                </span>
                <span className="text-xs text-slate-400">• {pillarDetail.difficultyRange}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{pillarDetail.title}</h2>
              <p className="text-sm text-slate-300">{pillarDetail.shortDescription}</p>
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
              <span className="text-xs text-slate-400">Target Exam Weightage:</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {pillarDetail.examRelevance[selectedExam] || 'High Yield'}
              </span>
            </div>
          </div>

          {/* Sections & Topics List */}
          <div className="space-y-6">
            {pillarDetail.sections.map((sec: any) => {
              const filteredTopics = sec.topics.filter((t: any) => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                return (
                  t.title.toLowerCase().includes(q) ||
                  t.blinkTrickSummary.toLowerCase().includes(q) ||
                  t.id.toLowerCase().includes(q)
                );
              });

              if (filteredTopics.length === 0) return null;

              return (
                <div key={sec.sectionId} className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {sec.title} ({filteredTopics.length} Topics)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTopics.map((topic: any) => (
                      <div
                        key={topic.id}
                        className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                              Level {topic.level}: {topic.level === 0 ? 'Foundation' : topic.level === 1 ? 'Standard' : topic.level === 2 ? 'Govt / GATE' : 'Advanced PO/CAT'}
                            </span>
                            <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mt-1.5">
                              {topic.title}
                            </h4>
                          </div>
                          <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            {topic.estimatedLearningMins}m
                          </span>
                        </div>

                        {/* Signature Trick Badge */}
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-amber-200">Blink Trick: </strong>
                            {topic.blinkTrickSummary}
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>GATE: <strong>{topic.gateWeightage || 'N/A'}</strong></span>
                            <span>•</span>
                            <span>SSC: <strong>{topic.sscWeightage || 'N/A'}</strong></span>
                          </div>

                          <button
                            onClick={() => onNavigateTopic(topic.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group-hover:translate-x-1 duration-200"
                          >
                            Explore 3-Way Solutions
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
