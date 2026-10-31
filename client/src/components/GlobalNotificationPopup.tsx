// client/src/components/GlobalNotificationPopup.tsx
// Functional Global Notification Center for EXAMVERSE
// Displays verified notifications across Central Govt, State Govt, Banking, Railways,
// Defence, Entrance Exams, Higher Studies, and Research Exams.
// Displays examination name, application deadline, official source, publication date and direct official link.

import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  ExternalLink,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Check,
  ShieldCheck,
  Building,
  GraduationCap
} from 'lucide-react';
import { ExamNotification } from '../types';
import { api } from '../services/api';

interface GlobalNotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExam?: (examId: string) => void;
}

export const GlobalNotificationPopup: React.FC<GlobalNotificationPopupProps> = ({
  isOpen,
  onClose,
  onSelectExam,
}) => {
  const [notifications, setNotifications] = useState<ExamNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'CLOSING_SOON' | 'UPCOMING' | 'CLOSED' | 'EXAMINATION_COMPLETED' | 'RESULT_DECLARED' | 'DATE_NOT_VERIFIED'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const notificationCategories = [
    { id: 'ALL', label: 'All Sectors' },
    { id: 'Central Government', label: 'Central Govt' },
    { id: 'State Government', label: 'State Govt' },
    { id: 'Banking & Finance', label: 'Banking' },
    { id: 'Railways', label: 'Railways' },
    { id: 'Defence', label: 'Defence' },
    { id: 'Entrance Exams', label: 'Entrance Exams' },
    { id: 'Higher Studies', label: 'Higher Studies' },
    { id: 'Research & Fellowships', label: 'Research / JRF' },
  ];

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications({
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        status: activeTab !== 'ALL' ? activeTab : undefined,
      });
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, activeTab, selectedCategory]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
      );
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (n.examTitle && n.examTitle.toLowerCase().includes(q)) ||
      (n.organization && n.organization.toLowerCase().includes(q)) ||
      (n.organizationFullName && n.organizationFullName.toLowerCase().includes(q)) ||
      (n.category && n.category.toLowerCase().includes(q)) ||
      (n.summary && n.summary.toLowerCase().includes(q))
    );
  });

  const unreadCount = filtered.filter((n) => n.unread).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-3 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Bell className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold tracking-tight">GLOBAL NOTIFICATION CENTER</h2>
                {unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-[11px] px-2 py-0.5 rounded-full font-semibold">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                Official announcements, application windows, dates & gazette notifications across India
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-slate-300 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs: Urgency / Status */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {[
              { id: 'ALL', label: 'All Updates' },
              { id: 'ACTIVE', label: 'Active Windows' },
              { id: 'CLOSING_SOON', label: 'Closing Soon' },
              { id: 'UPCOMING', label: 'Upcoming' },
              { id: 'CLOSED', label: 'Closed' },
              { id: 'EXAMINATION_COMPLETED', label: 'Exam Completed' },
              { id: 'RESULT_DECLARED', label: 'Results Declared' },
              { id: 'DATE_NOT_VERIFIED', label: 'Date Not Verified' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap transition text-[11px] ${
                  activeTab === tab.id
                    ? 'bg-blue-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[180px] max-w-full sm:max-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search exam, board, sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-800 text-slate-800"
            />
          </div>
        </div>

        {/* Category Pills Ribbon */}
        <div className="px-5 py-2 bg-white border-b border-slate-100 flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex-shrink-0">
            Sector:
          </span>
          {notificationCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Notification Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-900 border-t-transparent rounded-full mb-2"></div>
              <p>Fetching official notifications from conducting boards...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No official notifications found matching your selection</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the sector filter or clearing your search term.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`pt-3.5 first:pt-0 transition rounded-xl p-4 border ${
                  item.unread
                    ? 'bg-blue-50/40 border-blue-200/70 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    {/* Top Tag Badges */}
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-extrabold text-[11px] uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                        {item.organization}
                      </span>

                      {/* Status Badges */}
                      {item.status === 'ACTIVE' && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          <span>ACTIVE APPLICATION</span>
                        </span>
                      )}
                      {item.status === 'CLOSING_SOON' && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>CLOSING SOON {item.daysRemaining ? `(${item.daysRemaining}d left)` : ''}</span>
                        </span>
                      )}
                      {item.status === 'UPCOMING' && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          UPCOMING NOTICE
                        </span>
                      )}
                      {item.status === 'CLOSED' && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 border border-slate-300">
                          APPLICATION CLOSED
                        </span>
                      )}
                      {item.status === 'EXAMINATION_COMPLETED' && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                          EXAM COMPLETED
                        </span>
                      )}
                      {item.status === 'RESULT_DECLARED' && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>RESULT DECLARED</span>
                        </span>
                      )}
                      {item.status === 'DATE_NOT_VERIFIED' && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3 text-amber-700" />
                          <span>DATE NOT VERIFIED</span>
                        </span>
                      )}

                      <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                        {item.category}
                      </span>

                      {item.scope && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          • {item.scope} {item.stateCode ? `(${item.stateCode})` : ''}
                        </span>
                      )}
                    </div>

                    {/* Examination Title */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {item.examTitle}
                    </h3>

                    {/* Official Source & Conducting Authority */}
                    <p className="text-xs text-slate-600 flex items-center space-x-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>Official Source: <strong>{item.organizationFullName || item.organization}</strong></span>
                    </p>

                    {/* Summary Description */}
                    {item.summary && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                        {item.summary}
                      </p>
                    )}

                    {/* Key Dates & Official Metrics Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Publication Date</span>
                        <strong className="text-slate-800 text-[11px]">{item.releaseDate}</strong>
                      </div>

                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Application Deadline</span>
                        <strong className="text-rose-700 text-[11px]">
                          {item.lastDate || 'Check Official Portal'}
                        </strong>
                      </div>

                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Exam Date</span>
                        <strong className="text-blue-900 text-[11px]">{item.examDate || 'Announced Soon'}</strong>
                      </div>

                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Vacancies / Intake</span>
                        <strong className="text-slate-800 text-[11px]">
                          {item.totalVacancies ? item.totalVacancies.toLocaleString() : 'Per Ordinance'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions Column */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between sm:justify-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex-shrink-0">
                    {/* Apply Direct Link */}
                    <a
                      href={item.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs px-3.5 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition font-semibold shadow-xs"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Download PDF Circular */}
                    {item.pdfLink && (
                      <a
                        href={item.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition font-medium"
                        title="Download Official Notification PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Gazette PDF</span>
                      </a>
                    )}

                    {/* Direct Preparation Hub Button */}
                    {item.examId && onSelectExam && (
                      <button
                        onClick={() => {
                          onSelectExam(item.examId!);
                          onClose();
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-blue-900 hover:bg-blue-50 transition font-semibold flex items-center space-x-1"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Prep Suite</span>
                      </button>
                    )}

                    {item.unread && (
                      <button
                        onClick={(e) => handleMarkAsRead(item.id, e)}
                        className="text-[10px] text-slate-400 hover:text-slate-700 underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
            <span>Statutory Verification: Grounded in official central & state gazette portals (.gov.in, .nic.in, .ac.in)</span>
          </div>
          <span>Showing {filtered.length} Official Notifications</span>
        </div>
      </div>
    </div>
  );
};
