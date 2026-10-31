// client/src/views/SmartExamFinderView.tsx
// Smart Examination Finder: Intelligent Statutory Eligibility Evaluation Engine
// Evaluates candidate's age, category relaxations, exact degree, specialization,
// domicile, and returns ELIGIBLE, NOT ELIGIBLE, or VERIFICATION REQUIRED with clear rationale.

import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { StudentProfile, IndianState, Examination } from '../types';
import { api } from '../services/api';

interface SmartExamFinderViewProps {
  profile: StudentProfile;
  allStates: IndianState[];
  onSelectExam: (examId: string) => void;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export const SmartExamFinderView: React.FC<SmartExamFinderViewProps> = ({
  profile,
  allStates,
  onSelectExam,
  onUpdateProfile,
}) => {
  const [evalProfile, setEvalProfile] = useState<StudentProfile>({ ...profile });
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ELIGIBLE' | 'VERIFICATION_REQUIRED' | 'NOT_ELIGIBLE'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const runEligibilityCheck = async () => {
    try {
      setLoading(true);
      const res = await api.checkEligibility(evalProfile);
      setEvaluations(res.evaluations || []);
    } catch (err) {
      console.error('Eligibility evaluation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runEligibilityCheck();
  }, [evalProfile.age, evalProfile.category, evalProfile.educationalQualification, evalProfile.degree, evalProfile.specialization, evalProfile.state, evalProfile.graduationStatus]);

  const filtered = evaluations.filter((item) => {
    const res = item.eligibilityResult;
    if (statusFilter !== 'ALL' && res.status !== statusFilter) return false;
    if (selectedCategory !== 'ALL' && !item.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
    return true;
  });

  const eligibleCount = evaluations.filter((i) => i.eligibilityResult.status === 'ELIGIBLE').length;
  const verificationCount = evaluations.filter((i) => i.eligibilityResult.status === 'VERIFICATION_REQUIRED').length;
  const notEligibleCount = evaluations.filter((i) => i.eligibilityResult.status === 'NOT_ELIGIBLE').length;

  return (
    <div className="space-y-6">
      {/* Engine Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-blue-900" />
                <span>Statutory Eligibility Engine</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Evaluates Age Relaxations, Degrees & Domicile
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Smart Examination Finder
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Never guess your eligibility. Our engine evaluates statutory qualification criteria, age thresholds with category relaxations, and domicile guidelines against official gazette notifications.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={runEligibilityCheck}
              disabled={loading}
              className="px-3.5 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Recalculate Rules</span>
            </button>
          </div>
        </div>

        {/* Dynamic Parameter Sliders / Inputs */}
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Current Age</label>
            <input
              type="number"
              min="16"
              max="60"
              value={evalProfile.age || 24}
              onChange={(e) => setEvalProfile({ ...evalProfile, age: parseInt(e.target.value) || 24 })}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Reservation Category</label>
            <select
              value={evalProfile.category || 'General'}
              onChange={(e) => setEvalProfile({ ...evalProfile, category: e.target.value as any })}
              className="w-full px-2 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
            >
              <option value="General">General / UR</option>
              <option value="OBC">OBC-NCL (+3 yrs)</option>
              <option value="SC">SC (+5 yrs)</option>
              <option value="ST">ST (+5 yrs)</option>
              <option value="EWS">EWS</option>
              <option value="PwD">PwD (+10 yrs)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Qualification Level</label>
            <select
              value={evalProfile.educationalQualification}
              onChange={(e) => setEvalProfile({ ...evalProfile, educationalQualification: e.target.value })}
              className="w-full px-2 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
            >
              <option value="10th">10th / Matric</option>
              <option value="12th / Intermediate">12th / Inter</option>
              <option value="Diploma">Diploma</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Degree Title</label>
            <input
              type="text"
              placeholder="e.g. B.Tech / B.Sc"
              value={evalProfile.degree || ''}
              onChange={(e) => setEvalProfile({ ...evalProfile, degree: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Specialization</label>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              value={evalProfile.specialization || ''}
              onChange={(e) => setEvalProfile({ ...evalProfile, specialization: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Home State</label>
            <select
              value={evalProfile.state}
              onChange={(e) => setEvalProfile({ ...evalProfile, state: e.target.value })}
              className="w-full px-2 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
            >
              {allStates.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Example Presets */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-slate-500 overflow-x-auto">
          <span className="font-semibold text-slate-700 whitespace-nowrap">Quick Scenarios:</span>
          <button
            onClick={() =>
              setEvalProfile({
                ...evalProfile,
                educationalQualification: 'Graduate',
                degree: 'B.Tech',
                specialization: 'Computer Science and Engineering',
                graduationStatus: 'Completed',
                age: 24,
              })
            }
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 whitespace-nowrap"
          >
            B.Tech Computer Science
          </button>
          <button
            onClick={() =>
              setEvalProfile({
                ...evalProfile,
                educationalQualification: 'Graduate',
                degree: 'B.Sc',
                specialization: 'Forensic Science',
                graduationStatus: 'Completed',
                age: 23,
              })
            }
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 whitespace-nowrap"
          >
            B.Sc Forensic Science
          </button>
          <button
            onClick={() =>
              setEvalProfile({
                ...evalProfile,
                educationalQualification: 'Graduate',
                degree: 'B.Sc',
                specialization: 'Biotechnology / Life Sciences',
                graduationStatus: 'Completed',
                age: 22,
              })
            }
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 whitespace-nowrap"
          >
            B.Sc Life Sciences
          </button>
          <button
            onClick={() =>
              setEvalProfile({
                ...evalProfile,
                educationalQualification: '12th / Intermediate',
                degree: 'Class 12 (MPC/BiPC)',
                specialization: 'Science',
                graduationStatus: 'Completed',
                age: 18,
              })
            }
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 whitespace-nowrap"
          >
            Class 12th Intermediate
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setStatusFilter(statusFilter === 'ELIGIBLE' ? 'ALL' : 'ELIGIBLE')}
          className={`p-4 rounded-xl border text-left transition ${
            statusFilter === 'ELIGIBLE'
              ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Fully Eligible</span>
            </span>
            <span className="text-xl font-extrabold text-emerald-700">{eligibleCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Meets qualification, age, degree & statutory conditions</p>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'VERIFICATION_REQUIRED' ? 'ALL' : 'VERIFICATION_REQUIRED')}
          className={`p-4 rounded-xl border text-left transition ${
            statusFilter === 'VERIFICATION_REQUIRED'
              ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Verification Required</span>
            </span>
            <span className="text-xl font-extrabold text-amber-700">{verificationCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Subject percentage or state domicile condition requires cross-check</p>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'NOT_ELIGIBLE' ? 'ALL' : 'NOT_ELIGIBLE')}
          className={`p-4 rounded-xl border text-left transition ${
            statusFilter === 'NOT_ELIGIBLE'
              ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center space-x-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Not Eligible</span>
            </span>
            <span className="text-xl font-extrabold text-rose-700">{notEligibleCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Age ceiling exceeded or degree discipline mismatch</p>
        </button>
      </div>

      {/* Evaluated Examination Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const res = item.eligibilityResult;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-5 transition flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                res.status === 'ELIGIBLE'
                  ? 'border-emerald-200 hover:border-emerald-300'
                  : res.status === 'VERIFICATION_REQUIRED'
                  ? 'border-amber-200 hover:border-amber-300'
                  : 'border-slate-200 opacity-90'
              }`}
            >
              <div className="flex-1">
                {/* Status Badge */}
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    {item.code}
                  </span>

                  {res.status === 'ELIGIBLE' && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>ELIGIBLE</span>
                    </span>
                  )}

                  {res.status === 'VERIFICATION_REQUIRED' && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>VERIFICATION REQUIRED</span>
                    </span>
                  )}

                  {res.status === 'NOT_ELIGIBLE' && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-700" />
                      <span>NOT ELIGIBLE</span>
                    </span>
                  )}

                  <span className="text-xs text-slate-500 font-medium">
                    {item.category} • {item.conductingBody}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {item.shortDescription}
                </p>

                {/* Statutory Reason Breakdown */}
                <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600 block">
                    Eligibility Rule Verification Breakdown:
                  </span>
                  {res.reasons.map((reason: string, rIdx: number) => (
                    <div key={rIdx} className="flex items-start space-x-2 text-slate-700">
                      <span className="text-blue-900 font-bold">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <a
                  href={item.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                >
                  <span>Official Gazette</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => onSelectExam(item.id)}
                  className="px-4 py-2 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition flex items-center space-x-1 shadow-xs"
                >
                  <span>Preparation Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
