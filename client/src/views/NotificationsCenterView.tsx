// client/src/views/NotificationsCenterView.tsx
// Phase 6: Student Live Notification & Corrigendum Centre
// Features "What Changed?" interactive diffs, timeline filters, and verified statutory badges.

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  FileText,
  Building2,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api';

interface TimelineChange {
  id: string;
  examId?: string;
  examTitle: string;
  authorityId: string;
  changeType: 'DEADLINE_EXTENDED' | 'EXAM_DATE_RESCHEDULED' | 'VACANCY_REVISED' | 'NEW_NOTIFICATION' | 'ELIGIBILITY_CHANGE' | string;
  title: string;
  summary: string;
  sourceUrl: string;
  fieldsDiff?: {
    field?: string;
    previous?: string | number;
    revised?: string | number;
    difference?: number;
  };
  verifiedBy?: string;
  detectedAt?: string;
  publishedAt?: string;
}

interface NotificationsCenterViewProps {
  onSelectExam?: (examId: string) => void;
}

export const NotificationsCenterView: React.FC<NotificationsCenterViewProps> = ({ onSelectExam }) => {
  const [timeline, setTimeline] = useState<TimelineChange[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAuthority, setSelectedAuthority] = useState<string>('ALL');

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const res = await api.getNotificationTimeline();
      if (res && res.timeline) {
        setTimeline(res.timeline);
      }
    } catch (err) {
      console.error('Failed to load notification timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  const filterTabs = [
    { id: 'ALL', label: 'All Notices & Corrigenda' },
    { id: 'DEADLINE_EXTENDED', label: 'Deadlines Extended' },
    { id: 'EXAM_DATE_RESCHEDULED', label: 'Dates Rescheduled' },
    { id: 'VACANCY_REVISED', label: 'Vacancies Revised' },
    { id: 'NEW_NOTIFICATION', label: 'Fresh Notifications' }
  ];

  const authoritiesList = ['ALL', 'UPSC', 'SSC', 'RRB', 'IIT-ROORKEE', 'APPSC', 'TGPSC', 'NTA', 'IBPS'];

  const filteredChanges = timeline.filter((item) => {
    const matchesFilter = activeFilter === 'ALL' || item.changeType === activeFilter;
    const matchesAuth = selectedAuthority === 'ALL' || item.authorityId?.toUpperCase() === selectedAuthority;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.examTitle?.toLowerCase().includes(query) ||
      item.title?.toLowerCase().includes(query) ||
      item.summary?.toLowerCase().includes(query) ||
      item.authorityId?.toLowerCase().includes(query);

    return matchesFilter && matchesAuth && matchesSearch;
  });

  const getChangeBadge = (type: string) => {
    switch (type) {
      case 'DEADLINE_EXTENDED':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Deadline Extended',
          icon: Clock
        };
      case 'EXAM_DATE_RESCHEDULED':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Exam Date Rescheduled',
          icon: AlertTriangle
        };
      case 'VACANCY_REVISED':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Vacancies Revised',
          icon: Sparkles
        };
      case 'NEW_NOTIFICATION':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
          label: 'Official Gazette Released',
          icon: FileText
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-500',
          label: 'Official Corrigendum',
          icon: Info
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-800/80 backdrop-blur-xs text-blue-200 text-xs px-3 py-1 rounded-full font-medium mb-3 border border-blue-700/60">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Statutory Verification Engine • Zero Hallucination Guarantee</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Official Notices & Corrigenda Timeline
          </h1>
          <p className="mt-2 text-blue-100/90 text-sm leading-relaxed">
            Every date extension, vacancy revision, and schedule adjustment tracked directly from official government gazettes.
            Compare exact structural changes side-by-side with verified statutory audit records.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeFilter === tab.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Authority Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exam, keyword, or authority..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Authority:</span>
              <select
                value={selectedAuthority}
                onChange={(e) => setSelectedAuthority(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white font-medium text-slate-800"
              >
                {authoritiesList.map((a) => (
                  <option key={a} value={a}>
                    {a === 'ALL' ? 'All Authorities' : a}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={loadTimeline}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Refresh timeline from server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Results List */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-800">Fetching verified statutory timeline...</p>
          <p className="text-xs text-slate-500 mt-1">Checking latest official corrigenda and gazette diffs.</p>
        </div>
      ) : filteredChanges.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No matching corrigenda found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or check back later. All government portals are monitored polite-crawled every 30 minutes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChanges.map((item) => {
            const badge = getChangeBadge(item.changeType);
            const BadgeIcon = badge.icon;
            const diff = item.fieldsDiff;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow p-5 relative overflow-hidden"
              >
                {/* Top Row: Authority & Change Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 tracking-tight">
                      {item.authorityId}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {item.examTitle}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>
                </div>

                {/* Notice Title */}
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  {item.title}
                </h3>

                {/* Summary / Document Snippet */}
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {item.summary}
                </p>

                {/* "What Changed?" Interactive Diff Card */}
                {diff && (
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 mb-3 text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-700 font-semibold mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>What Changed in Gazette?</span>
                      <span className="text-slate-400 font-normal">({diff.field || 'Key Field'})</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white rounded-md p-2.5 border border-slate-200/80">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                          Previous Gazette Value
                        </span>
                        <span className="text-xs font-bold text-rose-600 line-through mt-0.5">
                          {diff.previous || 'N/A'}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                          <span>Revised Official Value</span>
                          <span className="text-emerald-600 font-bold">✓</span>
                        </span>
                        <span className="text-xs font-bold text-emerald-700 mt-0.5">
                          {diff.revised || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Meta & Official Links */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-3 text-slate-500">
                    <div className="flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[11px] font-medium text-slate-700">
                        Verified by {item.verifiedBy || 'Statutory AI Gateway'}
                      </span>
                    </div>

                    {item.publishedAt && (
                      <div className="hidden sm:flex items-center space-x-1 text-slate-400 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.examId && onSelectExam && (
                      <button
                        onClick={() => onSelectExam(item.examId!)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <span>View Exam Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <span>Official Gazette</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
