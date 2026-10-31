// client/src/views/UniversalExamCatalogView.tsx
// Universal Examination Catalog & Instant Faceted Search for EXAMVERSE
// Features Typo-Tolerant Search, Synonym Expansion Chips, and Strict Verified Provenance

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  BookOpen,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { Examination, IndianState, StudentProfile } from '../types';

interface UniversalExamCatalogViewProps {
  allStates: IndianState[];
  profile: StudentProfile;
  onSelectExamForPrep: (examId: string) => void;
  onOpenExamDetail: (slug: string) => void;
}

export const UniversalExamCatalogView: React.FC<UniversalExamCatalogViewProps> = ({
  allStates,
  profile,
  onSelectExamForPrep,
  onOpenExamDetail
}) => {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedQual, setSelectedQual] = useState('ALL');

  const synonymChips = [
    { label: 'ECE / Electronics', query: 'ECE' },
    { label: 'IES / ESE Engineering', query: 'IES' },
    { label: 'Bank PO (IBPS/SBI)', query: 'Bank PO' },
    { label: 'SSC CGL', query: 'CGL' },
    { label: 'Civil Services (IAS/IPS)', query: 'IAS' },
    { label: 'GATE 2026', query: 'GATE' },
    { label: 'Railway RRB', query: 'RRB' }
  ];

  const sectors = [
    'ALL',
    'Government Recruitment',
    'Banking & Financial Sector',
    'Entrance Examinations',
    'Higher Studies & PG Admissions',
    'Research & Fellowships',
    'Defence & Allied Services'
  ];

  const qualifications = [
    'ALL',
    'Graduate',
    '12th / Intermediate',
    '10th / Matriculation',
    'Post Graduate',
    'B.Tech / B.E'
  ];

  const fetchDirectory = async () => {
    try {
      setLoading(true);
      const res = await api.getExamDirectory({
        query: searchQuery,
        state: selectedState,
        sector: selectedSector !== 'ALL' ? selectedSector : undefined,
        qualification: selectedQual !== 'ALL' ? selectedQual : undefined
      });
      setExams(res.exams || []);
    } catch (err) {
      console.error('Failed to query exam directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDirectory();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedState, selectedSector, selectedQual]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-900" />
            <span>Universal National Catalog</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Universal Examination & Opportunity Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant search across Central boards, state examinations, and national entrances with multi-synonym expansion and verified gazette provenance.
          </p>
        </div>

        {/* Search Bar & Instant Chips */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, acronym (e.g., ECE, IES, Bank PO, CGL), or query (e.g., authority:UPSC)..."
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium"
            />
          </div>

          {/* Quick Synonym Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-slate-400 flex items-center space-x-1 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-blue-900" />
              <span>Synonym Expansions:</span>
            </span>
            {synonymChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(chip.query)}
                className={`px-2.5 py-1 rounded-full font-semibold transition whitespace-nowrap ${
                  searchQuery.toLowerCase() === chip.query.toLowerCase()
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Facet Filter Ribbons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs font-medium">
          {/* Sector Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Examination Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-900"
            >
              {sectors.map((s, i) => (
                <option key={i} value={s}>{s === 'ALL' ? 'All Sectors' : s}</option>
              ))}
            </select>
          </div>

          {/* State Scope Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">State / Scope</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-900"
            >
              <option value="ALL">All India (National)</option>
              {allStates.map((st) => (
                <option key={st.code} value={st.code}>{st.name} ({st.code})</option>
              ))}
            </select>
          </div>

          {/* Qualification Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Minimum Qualification</label>
            <select
              value={selectedQual}
              onChange={(e) => setSelectedQual(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-900"
            >
              {qualifications.map((q, i) => (
                <option key={i} value={q}>{q === 'ALL' ? 'All Qualifications' : q}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Badges */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{exams.length}</strong> statutory opportunities
          {searchQuery && <> matching "<strong>{searchQuery}</strong>"</>}
        </span>
        <span className="text-[11px] text-emerald-800 font-semibold flex items-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Verified Official Boards</span>
        </span>
      </div>

      {/* Examinations Directory Cards */}
      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <div className="inline-block animate-spin w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-semibold text-slate-700">Executing Universal Examination Query...</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No examinations found matching filters.</p>
          <p className="text-xs text-slate-400">Try adjusting your synonym search or setting Sector to "All Sectors".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <div
              key={exam.id || exam.slug}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold px-2.5 py-1 rounded bg-blue-900 text-white font-mono">
                      {exam.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {exam.conductingBody}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                    {exam.scope || 'All India'}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{exam.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {exam.shortDescription || exam.description}
                  </p>
                </div>

                {/* Statutory Attributes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 rounded-lg p-3 text-[11px] border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">Qualification</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {exam.eligibility?.minQualification || 'Graduate'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">Age Limit</span>
                    <span className="font-bold text-slate-800 block">
                      {exam.eligibility?.minAge || 18} - {exam.eligibility?.maxAge || 32} yrs
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">Frequency</span>
                    <span className="font-bold text-slate-800 block">{exam.frequency || 'Annual'}</span>
                  </div>
                </div>

                {/* Stages Preview */}
                {exam.stages && exam.stages.length > 0 && (
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-600 font-medium">
                    <Layers className="w-3.5 h-3.5 text-blue-900 flex-shrink-0" />
                    <span>Selection Funnel:</span>
                    <div className="flex items-center space-x-1 text-slate-800 font-bold">
                      {exam.stages.map((st: any, idx: number) => (
                        <span key={idx}>
                          {st.name.split(' ')[0]}
                          {idx < exam.stages.length - 1 && <span className="text-slate-300 mx-1">→</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenExamDetail(exam.slug || exam.id)}
                  className="flex-1 inline-flex items-center justify-center space-x-1 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                >
                  <span>Official Details</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => onSelectExamForPrep(exam.id)}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white transition shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-200" />
                  <span>Start Preparation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
