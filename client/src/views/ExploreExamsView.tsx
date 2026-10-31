// client/src/views/ExploreExamsView.tsx
// Comprehensive Examination Directory across all 12 major Indian Exam Categories

import React, { useState } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  Calendar,
  ChevronRight,
  ExternalLink,
  Shield,
  GraduationCap,
  Award,
  Layers,
  MapPin,
  Bookmark
} from 'lucide-react';
import { Examination } from '../types';

interface ExploreExamsViewProps {
  exams: Examination[];
  onSelectExam: (examId: string) => void;
  selectedStateFilter: string;
}

export const ExploreExamsView: React.FC<ExploreExamsViewProps> = ({
  exams,
  onSelectExam,
  selectedStateFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'All India' | 'State' | 'International'>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'Government Recruitment', label: 'Govt Recruitment (Central & State)' },
    { id: 'Common Entrance Exams', label: 'Common Entrance (CUET/JEE/NEET/CET)' },
    { id: 'University and Higher Studies', label: 'University & PG (CUET PG/IIT JAM)' },
    { id: 'Engineering Entrance', label: 'Engineering & PSUs (GATE/JEE)' },
    { id: 'Management Entrance', label: 'Management (CAT/XAT/CMAT)' },
    { id: 'Medical and Healthcare', label: 'Medical (NEET UG/PG/INI-CET)' },
    { id: 'Research and Fellowship', label: 'Research (CSIR/UGC NET/JRF)' },
    { id: 'Teaching Eligibility', label: 'Teaching (CTET/State TET)' },
    { id: 'Law Entrance', label: 'Law (CLAT/AILET)' },
    { id: 'Professional Certification', label: 'Professional (CA/CMA/CS)' },
    { id: 'International Admissions', label: 'International (GRE/GMAT)' }
  ];

  const [geoFilter, setGeoFilter] = useState<'ALL' | 'MY_STATE' | 'ALL_INDIA'>('ALL');

  const filteredExams = exams.filter((e) => {
    // Geo filter
    if (geoFilter === 'MY_STATE' && selectedStateFilter !== 'ALL') {
      if (e.stateCode !== selectedStateFilter) return false;
    } else if (geoFilter === 'ALL_INDIA') {
      if (e.scope !== 'All India') return false;
    }

    // Category match
    if (selectedCategory !== 'ALL' && !e.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }

    // Scope match
    if (scopeFilter !== 'ALL' && e.scope !== scopeFilter) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        e.title.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.conductingBody.toLowerCase().includes(q) ||
        (e.shortDescription && e.shortDescription.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                Directory Hub
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {filteredExams.length} Examinations Catalogued
              </span>
              {selectedStateFilter !== 'ALL' && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  State Focus: {selectedStateFilter}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Complete Examination Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Discover official notifications, statutory eligibility prerequisites, exam patterns, and complete preparation modules across all Central Boards, State PSCs, and Entrance Authorities.
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by exam code, title or board..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-slate-50/50 hover:bg-white transition"
            />
          </div>
        </div>

        {/* Geographical Scope Controls (ALL INDIA vs MY STATE) */}
        {selectedStateFilter !== 'ALL' && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
            <span className="font-semibold text-slate-500 mr-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-blue-900" />
              <span>Geographical Filter:</span>
            </span>
            <button
              onClick={() => setGeoFilter('ALL')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                geoFilter === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All India + Interstate
            </button>
            <button
              onClick={() => setGeoFilter('MY_STATE')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                geoFilter === 'MY_STATE' ? 'bg-blue-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🏛️ {selectedStateFilter} State Specific
            </button>
            <button
              onClick={() => setGeoFilter('ALL_INDIA')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                geoFilter === 'ALL_INDIA' ? 'bg-blue-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🇮🇳 National All-India Only
            </button>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-slate-100 mt-4 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-800 text-sm">No examinations found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or searching with different keywords.</p>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-900/40 hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              {/* Card Top */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <span className="text-sm font-extrabold text-blue-950 font-sans tracking-tight">
                      {exam.code}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {exam.conductingBody}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {exam.scope === 'State' && exam.stateCode ? `🏛️ ${exam.stateCode} State` : `🇮🇳 ${exam.scope}`}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                  {exam.title}
                </h2>

                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {exam.shortDescription}
                </p>

                {/* Key Tags */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 text-[11px]">
                  <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    🎓 Min: {exam.eligibility.minQualification}
                  </span>
                  <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    ⏱️ {exam.frequency}
                  </span>
                  <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    💻 {exam.mode}
                  </span>
                </div>
              </div>

              {/* Card Bottom CTA */}
              <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <a
                  href={exam.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                  title="Official Website"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => onSelectExam(exam.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition flex items-center space-x-1 shadow-xs"
                >
                  <span>Prep Suite</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
