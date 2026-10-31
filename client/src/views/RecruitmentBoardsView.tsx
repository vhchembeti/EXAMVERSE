// client/src/views/RecruitmentBoardsView.tsx
// National Recruitment Boards & Statutory Examination Authorities Directory
// Central Boards + All 28 Indian States & 8 Union Territories
// Grounded strictly in official domains (.gov.in, .nic.in, .ac.in) with Zero Fabrication

import React, { useState, useEffect } from 'react';
import {
  Building2,
  ExternalLink,
  ShieldCheck,
  Search,
  MapPin,
  CheckCircle2,
  Landmark,
  Globe,
  Filter,
  Sparkles,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { IndianState } from '../types';

interface Authority {
  id: string;
  code: string;
  name: string;
  hindiName?: string;
  type: 'CENTRAL' | 'STATE' | 'UT' | 'REGULATORY';
  category: string;
  jurisdiction: string;
  stateCode: string;
  stateName?: string;
  officialWebsite: string;
  recruitmentPortalUrl: string;
  epistemicStatus: string;
  trustScore: number;
  establishedUnder: string;
  headquarters: string;
  keyExams?: string[];
  lastVerifiedAt: string;
}

interface RecruitmentBoardsViewProps {
  allStates: IndianState[];
  selectedStateFilter: string;
  onSelectStateFilter: (code: string) => void;
  onSelectExam?: (examCode: string) => void;
}

export const RecruitmentBoardsView: React.FC<RecruitmentBoardsViewProps> = ({
  allStates,
  selectedStateFilter,
  onSelectStateFilter,
  onSelectExam
}) => {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeTab, setActiveTypeTab] = useState<'ALL' | 'CENTRAL' | 'STATE' | 'UT'>('ALL');

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        setLoading(true);
        const res = await api.getAuthorities({
          state: selectedStateFilter,
          type: activeTypeTab !== 'ALL' ? activeTypeTab : undefined
        });
        setAuthorities(res.authorities || []);
      } catch (err) {
        console.error('Failed to fetch authorities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorities();
  }, [selectedStateFilter, activeTypeTab]);

  const filteredAuthorities = authorities.filter(a => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      (a.hindiName || '').toLowerCase().includes(q) ||
      a.jurisdiction.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-700/60 text-xs font-semibold text-blue-200">
            <Building2 className="w-3.5 h-3.5 text-blue-300" />
            <span>National Statutory Registry</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>All 28 States + 8 UTs + Central</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            National Authorities & Recruitment Boards Directory
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Direct statutory registry of Union commissions, state public service commissions, police recruitment boards, and regulatory bodies with verified <code className="bg-blue-800/60 px-1.5 py-0.5 rounded text-xs font-mono">.gov.in</code> and <code className="bg-blue-800/60 px-1.5 py-0.5 rounded text-xs font-mono">.nic.in</code> portals. Zero unofficial third-party coaching websites.
          </p>
        </div>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by board name (UPSC, APPSC, SSC, TGPSC)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {(['ALL', 'CENTRAL', 'STATE', 'UT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTypeTab(t)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                  activeTypeTab === t
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t === 'ALL' ? 'All Authorities' : t === 'CENTRAL' ? '🏛️ Central (National)' : t === 'STATE' ? '🇮🇳 28 States' : 'Union Territories'}
              </button>
            ))}
          </div>
        </div>

        {/* State Quick Selector */}
        <div className="pt-3 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto text-xs pb-1">
          <span className="font-bold text-slate-400 flex items-center space-x-1 flex-shrink-0">
            <MapPin className="w-3.5 h-3.5" />
            <span>State Scope:</span>
          </span>
          <button
            onClick={() => onSelectStateFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-semibold transition whitespace-nowrap ${
              selectedStateFilter === 'ALL'
                ? 'bg-blue-50 text-blue-900 border border-blue-300 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All India
          </button>
          {allStates.map((st) => (
            <button
              key={st.code}
              onClick={() => onSelectStateFilter(st.code)}
              className={`px-2 py-1 rounded-md transition whitespace-nowrap text-[11px] font-medium ${
                selectedStateFilter === st.code
                  ? 'bg-blue-50 text-blue-900 border border-blue-300 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st.name} ({st.code})
            </button>
          ))}
        </div>
      </div>

      {/* Authorities Directory Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="inline-block animate-spin w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-semibold text-slate-700">Loading Authoritative National Registry...</p>
        </div>
      ) : filteredAuthorities.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <Landmark className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No recruitment authorities found matching criteria.</p>
          <p className="text-xs text-slate-400">Try clearing your search query or selecting "All India" state scope.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAuthorities.map((auth) => (
            <div
              key={auth.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Top Badge & Code */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold px-2 py-1 rounded bg-slate-900 text-white font-mono">
                      {auth.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 uppercase">
                      {auth.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified {auth.trustScore}%</span>
                  </div>
                </div>

                {/* Name & Framework */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{auth.name}</h3>
                  {auth.hindiName && (
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{auth.hindiName}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{auth.headquarters} • {auth.jurisdiction}</span>
                  </p>
                </div>

                {/* Category & Statutory Note */}
                <div className="bg-slate-50 rounded-lg p-2.5 text-[11px] text-slate-600 border border-slate-100 space-y-1">
                  <p className="font-semibold text-slate-800">{auth.category}</p>
                  <p className="text-slate-500 text-[10px] leading-relaxed">
                    Mandate: {auth.establishedUnder}
                  </p>
                </div>

                {/* Key Examinations */}
                {auth.keyExams && auth.keyExams.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Portals & Examinations</p>
                    <div className="flex flex-wrap gap-1">
                      {auth.keyExams.map((ex, i) => (
                        <span
                          key={i}
                          onClick={() => onSelectExam && onSelectExam(ex)}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 hover:bg-blue-100 cursor-pointer border border-blue-200 transition"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={auth.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Official Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href={auth.recruitmentPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white transition shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
                  <span>Apply Portal</span>
                  <ExternalLink className="w-3 h-3 text-white/70" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
