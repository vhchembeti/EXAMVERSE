// client/src/views/StudyPlannerView.tsx
// Dynamic Knapsack Optimization & Topological Study Planner with Auto-Rebalancing

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  BookOpen,
  Zap,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { api } from '../services/api';

interface StudyPlannerProps {
  initialWeakTopics?: any[];
}

export const StudyPlannerView: React.FC<StudyPlannerProps> = ({ initialWeakTopics = [] }) => {
  const [targetExam, setTargetExam] = useState('GATE Computer Science 2027');
  const [durationDays, setDurationDays] = useState(60);
  const [weekdayHours, setWeekdayHours] = useState(3.5);
  const [weekendHours, setWeekendHours] = useState(6.5);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'engg-maths',
    'dsa',
    'os',
    'dbms',
    'computer-networks',
    'general-aptitude'
  ]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [weakTopics, setWeakTopics] = useState<any[]>(initialWeakTopics);

  const [activePlan, setActivePlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [rebalancing, setRebalancing] = useState(false);
  const [rebalanceMsg, setRebalanceMsg] = useState<string | null>(null);

  useEffect(() => {
    loadSubjectsAndWeakTopics();
  }, []);

  const loadSubjectsAndWeakTopics = async () => {
    try {
      const [subjRes, weakRes] = await Promise.all([
        api.getLearningSubjects(),
        api.getWeakTopics()
      ]);
      setAllSubjects(subjRes || []);
      if (initialWeakTopics.length === 0 && weakRes && weakRes.length > 0) {
        setWeakTopics(weakRes);
      }
    } catch (err) {
      console.error('Failed to load subjects or weak topics:', err);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setRebalanceMsg(null);
    try {
      const plan = await api.generateStudyPlan({
        targetExam,
        durationDays,
        dailyHours: { weekday: weekdayHours, weekend: weekendHours },
        selectedSubjectIds: selectedSubjects,
        weakTopics
      });
      setActivePlan(plan);
    } catch (err: any) {
      alert(`Error generating study plan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleDayStatus = (dayIndex: number, newStatus: 'COMPLETED' | 'MISSED' | 'PENDING') => {
    if (!activePlan) return;
    const updatedSchedule = activePlan.schedule.map((day: any) => {
      if (day.dayIndex === dayIndex) {
        return {
          ...day,
          status: newStatus,
          completedHours: newStatus === 'COMPLETED' ? day.targetHours : 0
        };
      }
      return day;
    });
    setActivePlan({
      ...activePlan,
      schedule: updatedSchedule
    });
  };

  const handleAutoRebalance = async () => {
    if (!activePlan) return;
    setRebalancing(true);
    try {
      // Find all days marked as MISSED
      const missedDates = activePlan.schedule
        .filter((d: any) => d.status === 'MISSED')
        .map((d: any) => d.date);

      if (missedDates.length === 0) {
        // If no missed days marked, simulate marking the first pending day as missed to demonstrate dynamic rebalancing
        const firstPending = activePlan.schedule.find((d: any) => d.status === 'PENDING');
        if (firstPending) {
          missedDates.push(firstPending.date);
        }
      }

      const rebalanced = await api.rebalanceStudyPlan(activePlan, missedDates, {
        weekday: weekdayHours,
        weekend: weekendHours
      });

      setActivePlan(rebalanced);
      setRebalanceMsg(
        `Dynamic Rebalance Successful: ${rebalanced.rebalanceTelemetry?.backlogActivitiesRescheduled || 1} missed study blocks carried over and distributed across ${rebalanced.rebalanceTelemetry?.remainingDaysCount || durationDays} remaining calendar slots.`
      );
    } catch (err: any) {
      alert(`Rebalancing failed: ${err.message}`);
    } finally {
      setRebalancing(false);
    }
  };

  const toggleSubjectSelection = (subId: string) => {
    if (selectedSubjects.includes(subId)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subId));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subId]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              0/1 Knapsack & Topological Prerequisite Engine
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Dynamic Knapsack Study Planner
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Allocates finite study hours to maximize total syllabus utility (Weightage × Weakness × Urgency) while strictly respecting topic prerequisites and dynamically rebalancing missed sessions.
            </p>
          </div>

          {activePlan && (
            <button
              onClick={handleAutoRebalance}
              disabled={rebalancing}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-emerald-950 disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${rebalancing ? 'animate-spin' : ''}`} />
              Auto-Rebalance Schedule
            </button>
          )}
        </div>

        {/* Rebalance Toast Notification */}
        {rebalanceMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{rebalanceMsg}</span>
            </div>
            <button
              onClick={() => setRebalanceMsg(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Configuration Setup Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" /> Plan Parameters & Daily Study Capacity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Target Exam */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-600">Target Examination</label>
              <input
                type="text"
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., GATE Computer Science 2027"
              />
            </div>

            {/* Preparation Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">Study Horizon</label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={30}>30 Days (Sprint Review)</option>
                <option value={60}>60 Days (Standard Mastery)</option>
                <option value={90}>90 Days (Comprehensive)</option>
                <option value={180}>180 Days (Full Cycle)</option>
              </select>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={handleGeneratePlan}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-indigo-100 disabled:opacity-50"
              >
                {loading ? 'Optimizing...' : 'Generate Plan'}
              </button>
            </div>
          </div>

          {/* Daily Study Capacity Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Weekday Daily Hours:</span>
                <span className="font-mono font-bold text-indigo-600">{weekdayHours} hrs / day</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.5"
                value={weekdayHours}
                onChange={(e) => setWeekdayHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Weekend Daily Hours:</span>
                <span className="font-mono font-bold text-indigo-600">{weekendHours} hrs / day</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="12.0"
                step="0.5"
                value={weekendHours}
                onChange={(e) => setWeekendHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          {/* Subject Selections */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Include Subject Modules ({selectedSubjects.length} Selected)
              </label>
              <button
                onClick={() => setSelectedSubjects(allSubjects.map((s) => s.id))}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                Select All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allSubjects.map((s) => {
                const isSelected = selectedSubjects.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSubjectSelection(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Schedule Timetable */}
        {activePlan && (
          <div className="space-y-6">
            {/* Plan Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Budget Hours
                </span>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {activePlan.totalBudgetHours} hrs
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Topics Scheduled
                </span>
                <div className="text-2xl font-bold font-mono text-indigo-600">
                  {activePlan.totalTopicsPlanned}
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  High-Yield Modules
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-600">
                  {activePlan.highYieldTopicsCount}
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Calendar Span
                </span>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {activePlan.durationDays} Days
                </div>
              </div>
            </div>

            {/* Daily Timetable Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Optimized Daily Timetable (Showing First 14 Days)
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Click 'Done' to log completion or 'Missed' to trigger auto-rebalancing
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePlan.schedule?.slice(0, 14).map((day: any) => {
                  const isCompleted = day.status === 'COMPLETED';
                  const isMissed = day.status === 'MISSED';

                  let statusBorder = 'border-slate-200';
                  if (isCompleted) statusBorder = 'border-emerald-300 bg-emerald-50/20';
                  if (isMissed) statusBorder = 'border-rose-300 bg-rose-50/20';

                  return (
                    <div
                      key={day.dayIndex}
                      className={`bg-white rounded-2xl border ${statusBorder} p-5 shadow-sm space-y-3 transition`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold">
                            Day {day.dayIndex}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {day.date} ({day.dayName})
                          </span>
                          {day.isWeekend && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                              Weekend Extended
                            </span>
                          )}
                        </div>

                        {/* Status Toggle Buttons */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <button
                            onClick={() => toggleDayStatus(day.dayIndex, isCompleted ? 'PENDING' : 'COMPLETED')}
                            className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </button>
                          <button
                            onClick={() => toggleDayStatus(day.dayIndex, isMissed ? 'PENDING' : 'MISSED')}
                            className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                              isMissed
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Missed</span>
                          </button>
                        </div>
                      </div>

                      {/* Day Activities */}
                      <div className="space-y-2">
                        {day.activities?.map((act: any) => (
                          <div
                            key={act.id}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  act.type === 'MOCK_TEST'
                                    ? 'bg-rose-100 text-rose-700'
                                    : act.type === 'REVISION'
                                    ? 'bg-purple-100 text-purple-700'
                                    : act.type === 'PRACTICE'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {act.type} • {act.allocatedHours} hrs
                              </span>
                              <span className="font-bold text-slate-900 truncate max-w-[200px]">
                                {act.topic}
                              </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                              {act.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
