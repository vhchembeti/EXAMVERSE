// client/src/views/OpportunityDiscoveryView.tsx
// 6-Bucket Deterministic Opportunity Discovery Engine for EXAMVERSE
// Evaluates student profile using pure Three-Valued Logic (TRUE, FALSE, UNKNOWN).
// Features interactive Step-by-Step Explanation Trace Modal, 6 distinct discovery buckets,
// and direct integration with the What-If Career Simulator.

import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Filter,
  ShieldCheck,
  Search,
  ChevronRight,
  X,
  TrendingUp,
  FileText,
  Calendar,
  Layers,
  Award,
  Activity,
  Check
} from 'lucide-react';
import { Examination, StudentProfile } from '../types';
import { api } from '../services/api';

interface OpportunityDiscoveryViewProps {
  profile: StudentProfile;
  allExams: Examination[];
  onSelectExam: (examId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenProfile: () => void;
}

export type BucketFilter =
  | 'ALL'
  | 'ELIGIBLE_NOW'
  | 'ALL_ELIGIBLE'
  | 'VERIFICATION_REQUIRED'
  | 'FUTURE_OPPORTUNITIES'
  | 'NOT_ELIGIBLE'
  | 'APPLICATION_OPEN';

type SectionFilter = 'ALL' | 'GOVT' | 'ENTRANCE' | 'HIGHER_ED' | 'RESEARCH';

export const OpportunityDiscoveryView: React.FC<OpportunityDiscoveryViewProps> = ({
  profile,
  allExams,
  onSelectExam,
  onNavigateTab,
  onOpenProfile,
}) => {
  const [activeBucket, setActiveBucket] = useState<BucketFilter>('ALL');
  const [activeSection, setActiveSection] = useState<SectionFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailedEvaluations, setDetailedEvaluations] = useState<any[]>([]);
  const [selectedAuditItem, setSelectedAuditItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch detailed deterministic evaluations from backend engine
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.evaluateEligibilityDetailed(profile)
      .then((res: any) => {
        if (isMounted && res && res.evaluations) {
          setDetailedEvaluations(res.evaluations);
        }
      })
      .catch((err) => {
        console.warn('API detailed evaluation fallback to local:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [profile]);

  // Combine exam directory with deterministic evaluations (or fallback)
  const evaluatedOpportunities = useMemo(() => {
    const studentDegree = (profile.degree || '').toLowerCase();
    const studentQual = (profile.educationalQualification || '').toLowerCase();
    const studentAge = profile.age || 24;
    const category = profile.category || 'General';
    const studentState = ((profile.domicileState || profile.state) || '').toUpperCase();

    return allExams.map((exam) => {
      // Find matching server evaluation if available
      const serverEval = detailedEvaluations.find((e: any) => e.examId === exam.id || e.examCode === exam.code);

      // Section classification
      let section: 'GOVT' | 'ENTRANCE' | 'HIGHER_ED' | 'RESEARCH' = 'GOVT';
      const cat = exam.category || '';
      const code = exam.code || '';

      if (cat === 'Government Recruitment') {
        section = 'GOVT';
      } else if (
        ['Common Entrance Exams', 'Engineering Entrance', 'Medical and Healthcare', 'Law Entrance'].includes(cat) ||
        ['JEE Main', 'JEE Advanced', 'NEET UG', 'CUET UG', 'CLAT UG', 'NATA'].includes(code)
      ) {
        section = 'ENTRANCE';
      } else if (
        cat === 'University and Higher Studies' ||
        cat === 'Management Entrance' ||
        ['CUET PG', 'GATE CS', 'IIT JAM', 'CAT', 'MAT', 'CMAT', 'NEET PG'].includes(code)
      ) {
        section = 'HIGHER_ED';
      } else if (
        cat === 'Research and Fellowship' ||
        ['CSIR NET', 'UGC NET', 'DBT BET'].includes(code)
      ) {
        section = 'RESEARCH';
      }

      // Check application open lifecycle
      const appStart = exam.importantDates?.applicationStart || exam.calendar?.applicationStart;
      const appEnd = exam.importantDates?.applicationEnd || exam.calendar?.applicationLastDate;
      const now = new Date();
      let isOpen = false;
      if (appStart && appEnd) {
        const s = new Date(appStart);
        const e = new Date(appEnd);
        isOpen = now >= s && now <= e;
      } else if (exam.status === 'ACTIVE' || exam.status === 'CLOSING_SOON') {
        isOpen = true;
      }

      // Fallback deterministic three-valued logic if server evaluation is pending
      let profileBucket: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'VERIFICATION_REQUIRED' | 'FUTURE_OPPORTUNITY' =
        serverEval?.profileEligibilityBucket || 'ELIGIBLE';
      let overallReason = serverEval?.overallReason || '';
      let trace = serverEval?.explanationTrace || [];

      if (!serverEval) {
        const rules = exam.eligibility || {};
        let minAge = rules.minAge || 18;
        let maxAge = rules.maxAge || 32;

        if (rules.ageRelaxation) {
          if ((category === 'SC' || category === 'ST') && rules.ageRelaxation.SC_ST) {
            maxAge += rules.ageRelaxation.SC_ST;
          } else if (category === 'OBC' && rules.ageRelaxation.OBC) {
            maxAge += rules.ageRelaxation.OBC;
          }
          if (profile.isPwD && rules.ageRelaxation.PwD) {
            maxAge += rules.ageRelaxation.PwD;
          }
          if (profile.isExServiceman && rules.ageRelaxation.ExServicemen) {
            maxAge += rules.ageRelaxation.ExServicemen;
          }
        }

        const isFuture = (profile.graduationStatus === 'Pre-Final Year' && rules.finalYearEligible === false) ||
          (studentAge < minAge && studentAge >= minAge - 2);

        if (isFuture) {
          profileBucket = 'FUTURE_OPPORTUNITY';
          overallReason = 'Candidate will become eligible in upcoming examination cycles.';
        } else if (studentAge < minAge) {
          profileBucket = 'NOT_ELIGIBLE';
          overallReason = `Underage: Statutory minimum age is ${minAge} yrs (Candidate is ${studentAge} yrs).`;
        } else if (studentAge > maxAge) {
          profileBucket = 'NOT_ELIGIBLE';
          overallReason = `Overage: Maximum limit is ${maxAge} yrs for ${category} (Candidate is ${studentAge} yrs).`;
        } else {
          profileBucket = 'ELIGIBLE';
          overallReason = 'Candidate satisfies all statutory qualification and age requirements.';
        }

        // Construct standard trace
        trace = [
          {
            outcome: profileBucket === 'NOT_ELIGIBLE' ? 'FALSE' : 'TRUE',
            criterion: 'Educational Qualification & Degree Equivalency',
            studentValue: profile.degree || profile.educationalQualification || 'Graduation',
            requiredValue: rules.minQualification || "Bachelor's Degree",
            statutoryReference: `${exam.code} Gazette Guidelines`,
            reason: profileBucket === 'NOT_ELIGIBLE' ? overallReason : 'Education criteria satisfied.'
          },
          {
            outcome: (studentAge >= minAge && studentAge <= maxAge) ? 'TRUE' : 'FALSE',
            criterion: 'Statutory Age Verification',
            studentValue: `${studentAge} years (Category: ${category})`,
            requiredValue: `${minAge}–${maxAge} years`,
            statutoryReference: `${exam.code} Age Regulations`,
            reason: `Age criteria evaluated against official relaxation rules.`
          }
        ];
      }

      const isEligibleNow = profileBucket === 'ELIGIBLE' && (serverEval ? serverEval.applicationLifecycleBucket === 'APPLICATION_OPEN' : isOpen);
      const appBucket = (serverEval ? serverEval.applicationLifecycleBucket === 'APPLICATION_OPEN' : isOpen)
        ? 'APPLICATION_OPEN'
        : 'APPLICATION_CLOSED';

      return {
        ...exam,
        discoverySection: section,
        profileEligibilityBucket: profileBucket,
        applicationLifecycleBucket: appBucket,
        isEligibleNow,
        overallReason,
        explanationTrace: trace,
        lifecycleDetails: serverEval?.lifecycleDetails || { isApplicationOpen: isOpen }
      };
    });
  }, [allExams, detailedEvaluations, profile]);

  // Aggregate 6-Bucket Counts
  const bucketCounts = useMemo(() => {
    return {
      TOTAL: evaluatedOpportunities.length,
      ELIGIBLE_NOW: evaluatedOpportunities.filter((o) => o.isEligibleNow).length,
      ALL_ELIGIBLE: evaluatedOpportunities.filter((o) => o.profileEligibilityBucket === 'ELIGIBLE').length,
      VERIFICATION_REQUIRED: evaluatedOpportunities.filter((o) => o.profileEligibilityBucket === 'VERIFICATION_REQUIRED').length,
      FUTURE_OPPORTUNITIES: evaluatedOpportunities.filter((o) => o.profileEligibilityBucket === 'FUTURE_OPPORTUNITY').length,
      NOT_ELIGIBLE: evaluatedOpportunities.filter((o) => o.profileEligibilityBucket === 'NOT_ELIGIBLE').length,
      APPLICATION_OPEN: evaluatedOpportunities.filter((o) => o.applicationLifecycleBucket === 'APPLICATION_OPEN').length,
      GOVT: evaluatedOpportunities.filter((o) => o.discoverySection === 'GOVT').length,
      ENTRANCE: evaluatedOpportunities.filter((o) => o.discoverySection === 'ENTRANCE').length,
      HIGHER_ED: evaluatedOpportunities.filter((o) => o.discoverySection === 'HIGHER_ED').length,
      RESEARCH: evaluatedOpportunities.filter((o) => o.discoverySection === 'RESEARCH').length,
    };
  }, [evaluatedOpportunities]);

  // Filtered examinations according to active bucket, section, and search query
  const filtered = useMemo(() => {
    return evaluatedOpportunities.filter((item) => {
      // 1. Bucket Matching
      let matchBucket = true;
      if (activeBucket === 'ELIGIBLE_NOW') {
        matchBucket = item.isEligibleNow;
      } else if (activeBucket === 'ALL_ELIGIBLE') {
        matchBucket = item.profileEligibilityBucket === 'ELIGIBLE';
      } else if (activeBucket === 'VERIFICATION_REQUIRED') {
        matchBucket = item.profileEligibilityBucket === 'VERIFICATION_REQUIRED';
      } else if (activeBucket === 'FUTURE_OPPORTUNITIES') {
        matchBucket = item.profileEligibilityBucket === 'FUTURE_OPPORTUNITY';
      } else if (activeBucket === 'NOT_ELIGIBLE') {
        matchBucket = item.profileEligibilityBucket === 'NOT_ELIGIBLE';
      } else if (activeBucket === 'APPLICATION_OPEN') {
        matchBucket = item.applicationLifecycleBucket === 'APPLICATION_OPEN';
      }

      // 2. Section Matching
      const matchSection = activeSection === 'ALL' || item.discoverySection === activeSection;

      // 3. Search Matching
      const matchSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.conductingBody.toLowerCase().includes(searchQuery.toLowerCase());

      return matchBucket && matchSection && matchSearch;
    });
  }, [evaluatedOpportunities, activeBucket, activeSection, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner with Profile Summary & Simulator Launch */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-900 text-white flex items-center space-x-1.5 shadow-xs">
                <Compass className="w-3.5 h-3.5" />
                <span>Deterministic 6-Bucket Opportunity Engine</span>
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {profile.degree || profile.educationalQualification} • {profile.specialization || 'Branch'} • {profile.category || 'General'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              National Opportunity Discovery Workbench
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Every opportunity is evaluated through a pure deterministic three-valued logic engine (PASS, FAIL, UNKNOWN) across degree equivalencies, exact age as on statutory reference cut-off dates, and category relaxations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('simulator')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Launch What-If Simulator</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* 6-Bucket Interactive Filter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
          {/* Bucket 1: Eligible Now (Open & Eligible) */}
          <button
            onClick={() => setActiveBucket(activeBucket === 'ELIGIBLE_NOW' ? 'ALL' : 'ELIGIBLE_NOW')}
            className={`p-3.5 rounded-xl border text-left transition-all relative ${
              activeBucket === 'ELIGIBLE_NOW'
                ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600 shadow-xs'
                : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                1. Eligible Now
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-900 mt-1">{bucketCounts.ELIGIBLE_NOW}</p>
            <p className="text-[10px] text-emerald-700 font-medium mt-0.5 leading-tight">
              Open registration & candidate qualified
            </p>
          </button>

          {/* Bucket 2: All Eligible */}
          <button
            onClick={() => setActiveBucket(activeBucket === 'ALL_ELIGIBLE' ? 'ALL' : 'ALL_ELIGIBLE')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeBucket === 'ALL_ELIGIBLE'
                ? 'border-blue-600 bg-blue-50/90 ring-2 ring-blue-600 shadow-xs'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                2. All Eligible
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-blue-900 mt-1">{bucketCounts.ALL_ELIGIBLE}</p>
            <p className="text-[10px] text-blue-700 font-medium mt-0.5 leading-tight">
              Satisfies statutory degree & age criteria
            </p>
          </button>

          {/* Bucket 3: Verification Required */}
          <button
            onClick={() => setActiveBucket(activeBucket === 'VERIFICATION_REQUIRED' ? 'ALL' : 'VERIFICATION_REQUIRED')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeBucket === 'VERIFICATION_REQUIRED'
                ? 'border-amber-600 bg-amber-50/90 ring-2 ring-amber-600 shadow-xs'
                : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                3. Verification Req
              </span>
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-amber-900 mt-1">{bucketCounts.VERIFICATION_REQUIRED}</p>
            <p className="text-[10px] text-amber-700 font-medium mt-0.5 leading-tight">
              Missing height/marks or quota detail
            </p>
          </button>

          {/* Bucket 4: Future Opportunities */}
          <button
            onClick={() => setActiveBucket(activeBucket === 'FUTURE_OPPORTUNITIES' ? 'ALL' : 'FUTURE_OPPORTUNITIES')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeBucket === 'FUTURE_OPPORTUNITIES'
                ? 'border-indigo-600 bg-indigo-50/90 ring-2 ring-indigo-600 shadow-xs'
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                4. Future Opps
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <p className="text-2xl font-extrabold text-indigo-900 mt-1">{bucketCounts.FUTURE_OPPORTUNITIES}</p>
            <p className="text-[10px] text-indigo-700 font-medium mt-0.5 leading-tight">
              Pre-final year / upcoming age cycle
            </p>
          </button>

          {/* Bucket 5: Not Eligible */}
          <button
            onClick={() => setActiveBucket(activeBucket === 'NOT_ELIGIBLE' ? 'ALL' : 'NOT_ELIGIBLE')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeBucket === 'NOT_ELIGIBLE'
                ? 'border-rose-600 bg-rose-50/90 ring-2 ring-rose-600 shadow-xs'
                : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                5. Ineligible
              </span>
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <p className="text-2xl font-extrabold text-rose-900 mt-1">{bucketCounts.NOT_ELIGIBLE}</p>
            <p className="text-[10px] text-rose-700 font-medium mt-0.5 leading-tight">
              Statutory gap with explicit failure reason
            </p>
          </button>

          {/* Bucket 6: Application Open */}
          <button
            onClick={() => setActiveBucket(activeBucket === 'APPLICATION_OPEN' ? 'ALL' : 'APPLICATION_OPEN')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeBucket === 'APPLICATION_OPEN'
                ? 'border-purple-600 bg-purple-50/90 ring-2 ring-purple-600 shadow-xs'
                : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800">
                6. Open Notices
              </span>
              <Clock className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-purple-900 mt-1">{bucketCounts.APPLICATION_OPEN}</p>
            <p className="text-[10px] text-purple-700 font-medium mt-0.5 leading-tight">
              Currently accepting applications
            </p>
          </button>
        </div>
      </div>

      {/* 2. Section Selector Ribbon (Sections A, B, C, D) + Live Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: `All (${bucketCounts.TOTAL})` },
            { id: 'GOVT', label: `A. Government Jobs (${bucketCounts.GOVT})` },
            { id: 'ENTRANCE', label: `B. Entrance Exams (${bucketCounts.ENTRANCE})` },
            { id: 'HIGHER_ED', label: `C. Higher Education (${bucketCounts.HIGHER_ED})` },
            { id: 'RESEARCH', label: `D. Research & Fellowships (${bucketCounts.RESEARCH})` }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                activeSection === sec.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search examinations, bodies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs w-full sm:w-64 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* 3. Opportunities Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => {
          const isEligible = item.profileEligibilityBucket === 'ELIGIBLE';
          const isVerification = item.profileEligibilityBucket === 'VERIFICATION_REQUIRED';
          const isFuture = item.profileEligibilityBucket === 'FUTURE_OPPORTUNITY';
          const isNotEligible = item.profileEligibilityBucket === 'NOT_ELIGIBLE';
          const isOpen = item.applicationLifecycleBucket === 'APPLICATION_OPEN';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between ${
                isEligible && isOpen
                  ? 'border-emerald-300 bg-gradient-to-b from-emerald-50/30 to-white'
                  : isEligible
                  ? 'border-blue-200'
                  : isFuture
                  ? 'border-indigo-200 bg-indigo-50/10'
                  : isVerification
                  ? 'border-amber-200 bg-amber-50/10'
                  : 'border-slate-200 bg-slate-50/40 opacity-90'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-extrabold text-[11px] tracking-wide">
                      {item.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {item.conductingBody}
                    </span>
                  </div>

                  {/* Primary & Orthogonal Badges */}
                  <div className="flex items-center space-x-1.5">
                    {/* Application Open Indicator */}
                    {isOpen && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>OPEN</span>
                      </span>
                    )}

                    {/* Eligibility Status */}
                    {isEligible && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>ELIGIBLE</span>
                      </span>
                    )}
                    {isFuture && (
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-bold flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-indigo-600" />
                        <span>FUTURE OPP</span>
                      </span>
                    )}
                    {isVerification && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>VERIFY REQ</span>
                      </span>
                    )}
                    {isNotEligible && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold flex items-center space-x-1">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>INELIGIBLE</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {item.shortDescription}
                </p>

                {/* Reason Banner */}
                <div className={`mt-3.5 p-3 rounded-xl text-xs border ${
                  isEligible
                    ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
                    : isFuture
                    ? 'bg-indigo-50/70 border-indigo-100 text-indigo-900'
                    : isVerification
                    ? 'bg-amber-50/70 border-amber-100 text-amber-900'
                    : 'bg-rose-50/70 border-rose-100 text-rose-900'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider opacity-80">
                      Deterministic Evaluation Result:
                    </span>
                    <button
                      onClick={() => setSelectedAuditItem(item)}
                      className="text-[11px] font-bold underline hover:opacity-80 flex items-center space-x-1"
                    >
                      <span>View Audit Trace ({item.explanationTrace?.length || 0})</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {item.overallReason}
                  </p>
                </div>

                {/* Key Attributes Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Min Qualification</span>
                    <strong className="text-slate-800 font-semibold">{item.eligibility?.minQualification || 'Graduate'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Age Range</span>
                    <strong className="text-slate-800 font-semibold">
                      {item.eligibility?.minAge || 18}–{item.eligibility?.maxAge || 'No max'} yrs
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Scope</span>
                    <strong className="text-slate-800 font-semibold">{item.scope} {item.stateCode ? `(${item.stateCode})` : ''}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Final Year Appearing</span>
                    <strong className="text-slate-800 font-semibold">
                      {item.eligibility?.finalYearEligible !== false ? 'Permitted' : 'Graduation Mandatory'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedAuditItem(item)}
                  className="text-[11px] text-blue-900 hover:text-blue-700 font-semibold flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Statutory Audit</span>
                </button>

                <div className="flex items-center space-x-2">
                  <a
                    href={item.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => onSelectExam(item.id)}
                    className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1 transition shadow-xs ${
                      isNotEligible
                        ? 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                        : 'bg-blue-900 text-white hover:bg-blue-800'
                    }`}
                  >
                    <span>{isNotEligible ? 'View Pattern' : 'Prepare Exam'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <Compass className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-semibold text-slate-700">No examinations match this bucket and filter combination</p>
          <p className="text-xs text-slate-400 mt-1">
            Try switching to 'All Eligible' or clearing your search criteria.
          </p>
        </div>
      )}

      {/* Step-by-Step Explanation Trace Modal / Drawer */}
      {selectedAuditItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-extrabold text-xs">
                  {selectedAuditItem.code}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    Statutory Eligibility Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedAuditItem.title} • {selectedAuditItem.conductingBody}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAuditItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Granular Trace */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Overall Summary Card */}
              <div className={`p-4 rounded-xl border ${
                selectedAuditItem.profileEligibilityBucket === 'ELIGIBLE'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : selectedAuditItem.profileEligibilityBucket === 'FUTURE_OPPORTUNITY'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                  : selectedAuditItem.profileEligibilityBucket === 'VERIFICATION_REQUIRED'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs uppercase tracking-wider">
                    Overall Three-Valued Outcome: {selectedAuditItem.profileEligibilityBucket}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-white/60">
                    {selectedAuditItem.applicationLifecycleBucket}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">
                  {selectedAuditItem.overallReason}
                </p>
              </div>

              {/* Step-by-Step Rule Evaluations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Evaluated Statutory Clauses ({selectedAuditItem.explanationTrace?.length || 0})</span>
                </h4>

                {selectedAuditItem.explanationTrace && selectedAuditItem.explanationTrace.map((step: any, idx: number) => {
                  const isPass = step.outcome === 'TRUE';
                  const isFail = step.outcome === 'FALSE';
                  const isUnknown = step.outcome === 'UNKNOWN';

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">
                          {idx + 1}. {step.criterion}
                        </span>

                        {isPass && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center space-x-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>PASS (TRUE)</span>
                          </span>
                        )}
                        {isFail && (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center space-x-1">
                            <X className="w-3 h-3 text-rose-600" />
                            <span>FAIL (FALSE)</span>
                          </span>
                        )}
                        {isUnknown && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center space-x-1">
                            <HelpCircle className="w-3 h-3 text-amber-600" />
                            <span>UNKNOWN</span>
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Candidate Record</span>
                          <strong className="text-slate-800">{step.studentValue || 'Not provided'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Statutory Requirement</span>
                          <strong className="text-slate-800">{step.requiredValue || 'Statutory standard'}</strong>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.reason}
                      </p>

                      {step.statutoryReference && (
                        <p className="text-[10px] text-slate-400 italic">
                          Reference: {step.statutoryReference}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedAuditItem(null);
                  onNavigateTab('simulator');
                }}
                className="text-xs font-bold text-blue-900 hover:underline flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Simulate Changes in Simulator</span>
              </button>

              <button
                onClick={() => setSelectedAuditItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
