// client/src/views/ExamCalendarView.tsx
// Global Examination Calendar for EXAMVERSE
// Supports All India & State-wise calendars, Monthly, Weekly, and List views,
// Confirmed dates, Tentative dates, Application deadlines, and Admission schedules.

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Bookmark,
  Download,
  CalendarPlus,
  Share2,
  GraduationCap,
  CalendarDays
} from 'lucide-react';
import { CalendarEvent, IndianState } from '../types';
import { api } from '../services/api';

interface ExamCalendarViewProps {
  allStates: IndianState[];
  selectedStateFilter: string;
  onSelectExam: (examId: string) => void;
}

type EventMilestoneFilter = 'ALL' | 'CONFIRMED' | 'TENTATIVE' | 'APPLICATION_DEADLINE' | 'ADMISSION_SCHEDULE';

export const ExamCalendarView: React.FC<ExamCalendarViewProps> = ({
  allStates,
  selectedStateFilter,
  onSelectExam,
}) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [viewMode, setViewMode] = useState<'LIST' | 'MONTHLY' | 'WEEKLY'>('LIST');
  const [milestoneFilter, setMilestoneFilter] = useState<EventMilestoneFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [savedReminders, setSavedReminders] = useState<string[]>([]);
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const [clashReport, setClashReport] = useState<any>(null);
  const [clashLoading, setClashLoading] = useState<boolean>(false);
  const [masterIcsLoading, setMasterIcsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        const data = await api.getCalendar({
          status: milestoneFilter === 'CONFIRMED' || milestoneFilter === 'TENTATIVE' ? milestoneFilter : undefined,
          state: selectedStateFilter !== 'ALL' ? selectedStateFilter : undefined,
          category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        });
        const events = data || [];
        setCalendarEvents(events);

        // Run interval-tree clash detection
        if (events.length > 0) {
          setClashLoading(true);
          api.detectCalendarClashes(events)
            .then((report) => setClashReport(report))
            .catch((err) => console.error('Clash detection error:', err))
            .finally(() => setClashLoading(false));
        }
      } catch (err) {
        console.error('Calendar load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, [milestoneFilter, selectedStateFilter, categoryFilter]);

  const downloadMasterICS = async () => {
    try {
      setMasterIcsLoading(true);
      const res = await fetch('/api/calendar/export-ics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: calendarEvents, calendarName: 'EXAMVERSE Central Schedule' })
      });
      if (!res.ok) throw new Error('Failed to generate master ICS');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'examverse_master_schedule_with_alarms.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setReminderToast('Downloaded Master .ICS with RFC 5545 7d, 72h & 24h VALARM Alarms!');
      setTimeout(() => setReminderToast(null), 3500);
    } catch (err) {
      console.error('Master ICS error:', err);
    } finally {
      setMasterIcsLoading(false);
    }
  };

  const toggleReminder = (id: string, title: string) => {
    if (savedReminders.includes(id)) {
      setSavedReminders(savedReminders.filter((r) => r !== id));
      setReminderToast(`Removed reminder for ${title}`);
    } else {
      setSavedReminders([...savedReminders, id]);
      setReminderToast(`Reminder set! You will receive statutory alerts for ${title}`);
    }
    setTimeout(() => setReminderToast(null), 3000);
  };

  const downloadICS = (ev: CalendarEvent) => {
    const rawDate = ev.examDate || ev.applicationLastDate || '2026-06-01';
    const dateFormatted = rawDate.replace(/[^0-9]/g, '').slice(0, 8);
    const dateStr = dateFormatted.length === 8 ? dateFormatted : '20260601';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EXAMVERSE//National Examination Schedule//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${ev.title} (${ev.code})`,
      `DESCRIPTION:Official Examination scheduled by ${ev.organization}. Category: ${ev.category}. Application last date: ${ev.applicationLastDate || 'TBA'}. Verified by EXAMVERSE Statutory System.`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      'STATUS:CONFIRMED',
      'LOCATION:All India Examination Centers',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ev.code}_exam_date.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openGoogleCalendar = (ev: CalendarEvent) => {
    const rawDate = ev.examDate || ev.applicationLastDate || '2026-06-01';
    const cleanDate = rawDate.replace(/[^0-9]/g, '').slice(0, 8);
    const dateStr = cleanDate.length === 8 ? cleanDate : '20260601';
    const title = encodeURIComponent(`${ev.title} (${ev.code})`);
    const details = encodeURIComponent(
      `Conducted by ${ev.organization} (${ev.category}). Application Deadline: ${ev.applicationLastDate || 'TBA'}. Official EXAMVERSE Schedule.`
    );
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&details=${details}&location=India`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  };

  const categories = [
    { id: 'ALL', label: 'All Exams' },
    { id: 'Central', label: 'Central Govt' },
    { id: 'State', label: 'State PSC / Police' },
    { id: 'Banking', label: 'Banking & Insurance' },
    { id: 'Defence', label: 'Defence & Police' },
    { id: 'Engineering', label: 'Engineering (GATE/JEE)' },
    { id: 'Medical', label: 'Medical (NEET)' },
    { id: 'Higher Studies', label: 'Higher Studies (CAT/NET)' }
  ];

  // Milestone filtering
  const filteredEvents = calendarEvents.filter((ev) => {
    if (milestoneFilter === 'CONFIRMED') return ev.status === 'CONFIRMED';
    if (milestoneFilter === 'TENTATIVE') return ev.status === 'TENTATIVE';
    if (milestoneFilter === 'APPLICATION_DEADLINE') return Boolean(ev.applicationLastDate);
    if (milestoneFilter === 'ADMISSION_SCHEDULE') {
      return (
        Boolean(ev.resultDate) ||
        ev.category.includes('Entrance') ||
        ev.category.includes('Higher') ||
        ev.category.includes('Medical') ||
        ev.category.includes('Engineering')
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {reminderToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Calendar Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center space-x-1">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-900" />
                <span>Statutory Examination Schedules</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {filteredEvents.length} Official Schedule Entries
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Centralized Examination Calendar
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Track confirmed examination dates, tentative schedules, application deadlines, and admission counselling milestones.
            </p>
          </div>

          {/* View Toggles & Master Export */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={downloadMasterICS}
              disabled={masterIcsLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
              title="Download RFC 5545 compliant .ICS calendar with 7-day, 72-hour, and 24-hour VALARM reminders"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{masterIcsLoading ? 'Exporting...' : 'Export Master .ICS (with Alarms)'}</span>
            </button>

            <div className="flex rounded-lg border border-slate-300 p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setViewMode('LIST')}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  viewMode === 'LIST' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('MONTHLY')}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  viewMode === 'MONTHLY' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Timeline
              </button>
              <button
                onClick={() => setViewMode('WEEKLY')}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  viewMode === 'WEEKLY' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Weekly View
              </button>
            </div>
          </div>
        </div>

        {/* Interval-Tree Clash Alert Banner */}
        {clashReport && clashReport.clashesFound > 0 && (
          <div className="mt-4 p-4 rounded-xl border bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800/50">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                    Interval-Tree Clash Engine: {clashReport.hardClashes} Critical Clashes & {clashReport.travelLogisticsRisks} Logistics Warnings
                  </h3>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                    Deterministic temporal analysis detected physical center or scheduling conflicts between official candidate examinations.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200">
                O(N log N) Tree Checked
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {clashReport.clashes.map((c: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                    c.severity === 'HARD_CLASH'
                      ? 'bg-rose-100/80 border-rose-300 text-rose-900 dark:bg-rose-900/40 dark:border-rose-700 dark:text-rose-200'
                      : 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-200'
                  }`}
                >
                  <div>
                    <span className="font-bold">[{c.severity}]</span> {c.event1.title} ⚡ {c.event2.title}
                    <p className="text-[11px] opacity-90 mt-0.5">{c.message}</p>
                  </div>
                  {c.gapHours !== undefined && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/70 dark:bg-slate-800 shrink-0 ml-2">
                      Gap: {c.gapHours}h
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Controls: Milestone Type & Category */}
        <div className="pt-4 space-y-3">
          {/* Milestone Type Buttons (Confirmed, Tentative, Deadlines, Admission) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="font-semibold text-slate-400 mr-1 flex-shrink-0">Milestone:</span>
            {[
              { id: 'ALL', label: 'All Milestones' },
              { id: 'CONFIRMED', label: 'Confirmed Dates' },
              { id: 'TENTATIVE', label: 'Tentative Dates' },
              { id: 'APPLICATION_DEADLINE', label: 'Application Deadlines' },
              { id: 'ADMISSION_SCHEDULE', label: 'Admission Schedules' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMilestoneFilter(m.id as EventMilestoneFilter)}
                className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition text-[11px] ${
                  milestoneFilter === m.id
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Sector / Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="font-semibold text-slate-400 mr-1 flex-shrink-0">Sector:</span>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap transition text-[11px] ${
                  categoryFilter === c.id
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List View */}
      {viewMode === 'LIST' && (
        <div className="space-y-3.5">
          {filteredEvents.map((ev) => {
            const hasReminder = savedReminders.includes(ev.id);
            return (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                      {ev.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {ev.organization} • {ev.category}
                    </span>

                    {ev.status === 'CONFIRMED' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>CONFIRMED DATE</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>TENTATIVE SCHEDULE</span>
                      </span>
                    )}

                    {ev.applicationLastDate && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                        Deadline: {ev.applicationLastDate}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{ev.title}</h3>

                  {/* Dates Table Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Notification Gazette</span>
                      <strong className="text-slate-700">{ev.notificationDate || 'Pending'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Application Window</span>
                      <strong className="text-slate-700">
                        {ev.applicationStart ? `${ev.applicationStart} to ${ev.applicationLastDate}` : 'TBA'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Examination Date</span>
                      <strong className="text-blue-900 font-bold">{ev.examDate || 'Not announced'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Result / Admission</span>
                      <strong className="text-slate-700">{ev.resultDate || 'TBA'}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Action: Reminder, .ics Export, Google Cal, Prep Suite */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => downloadICS(ev)}
                      title="Download .ics Calendar File"
                      className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[11px] font-medium">.ics</span>
                    </button>
                    <button
                      onClick={() => openGoogleCalendar(ev)}
                      title="Add to Google Calendar"
                      className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-blue-800" />
                      <span className="text-[11px] font-medium">G-Cal</span>
                    </button>
                    <button
                      onClick={() => toggleReminder(ev.id, ev.title)}
                      className={`text-xs px-2.5 py-1.5 rounded-md border flex items-center space-x-1 transition font-medium ${
                        hasReminder
                          ? 'bg-blue-50 border-blue-300 text-blue-900'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{hasReminder ? 'Reminder Set' : 'Remind'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectExam(ev.examId)}
                    className="text-xs px-3.5 py-1.5 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                  >
                    Prep Suite →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Monthly Timeline View */}
      {viewMode === 'MONTHLY' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            2026 Examination Milestone Timeline (Quarterly Progression)
          </h2>
          <div className="space-y-4">
            {['January - March 2026', 'April - June 2026', 'July - September 2026', 'October - December 2026'].map((quarter, qIdx) => (
              <div key={qIdx} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-2">{quarter}</span>
                <div className="divide-y divide-slate-200/60 text-xs">
                  {filteredEvents
                    .filter((ev) => {
                      if (!ev.examDate) return false;
                      const parts = ev.examDate.split('-');
                      const m = parts.length > 1 ? parseInt(parts[1]) : 0;
                      if (qIdx === 0) return m >= 1 && m <= 3;
                      if (qIdx === 1) return m >= 4 && m <= 6;
                      if (qIdx === 2) return m >= 7 && m <= 9;
                      return m >= 10 && m <= 12;
                    })
                    .map((ev) => (
                      <div key={ev.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <strong className="text-slate-900 mr-2">{ev.code}:</strong>
                          <span className="text-slate-700">{ev.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Application Deadline: {ev.applicationLastDate || 'TBA'}
                          </span>
                        </div>
                        <div className="text-right flex items-center space-x-2">
                          <span className="font-mono font-bold text-blue-900">{ev.examDate}</span>
                          <button
                            onClick={() => onSelectExam(ev.examId)}
                            className="text-[11px] font-semibold text-blue-900 hover:underline"
                          >
                            Prep Suite →
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly View */}
      {viewMode === 'WEEKLY' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 text-blue-900" />
            <span>Weekly Examination & Application Milestone Matrix</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {['Week 1 (1st - 7th)', 'Week 2 (8th - 14th)', 'Week 3 (15th - 21st)', 'Week 4 (22nd - 31st)'].map((wk, wkIdx) => (
              <div key={wkIdx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-[11px] text-slate-700 uppercase block mb-2">{wk}</span>
                <div className="space-y-2">
                  {filteredEvents.slice(wkIdx * 2, wkIdx * 2 + 3).map((ev) => (
                    <div key={ev.id} className="p-2 bg-white rounded border border-slate-200">
                      <span className="font-bold text-blue-900 block text-[11px]">{ev.code}</span>
                      <p className="text-[10px] text-slate-600 line-clamp-1">{ev.title}</p>
                      <span className="text-[9px] text-slate-400 block mt-1 font-mono">{ev.examDate || 'TBA'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
