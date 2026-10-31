// client/src/views/HigherStudiesView.tsx
// Dedicated National Higher Studies & Educational Opportunities Portal for EXAMVERSE
// Focuses on: CUET PG, GATE, IIT JAM, CAT, MAT, CMAT, UGC NET, CSIR NET, and JRF
// Transparently segments into: Eligible, Potentially Eligible / Verification Required, Not Eligible, More Info Required
// Never assumes all graduates qualify for technical or science exams.

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Calendar,
  Filter,
  ShieldCheck,
  Building,
  Award,
  ChevronRight
} from 'lucide-react';
import { Examination, StudentProfile } from '../types';

interface HigherStudiesViewProps {
  profile: StudentProfile;
  allExams: Examination[];
  onSelectExam: (examId: string) => void;
  onNavigateTab: (tab: string) => void;
}

type EligibilityTab = 'ALL' | 'ELIGIBLE' | 'VERIFICATION_REQUIRED' | 'NOT_ELIGIBLE' | 'MORE_INFO';

export const HigherStudiesView: React.FC<HigherStudiesViewProps> = ({
  profile,
  allExams,
  onSelectExam,
  onNavigateTab
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<EligibilityTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Target Higher Studies Exam Codes
  const targetCodes = ['CUET PG', 'GATE CS', 'IIT JAM', 'CAT', 'MAT', 'CMAT', 'UGC NET', 'CSIR NET', 'DBT BET'];

  // Categorize Higher Studies Exams
  const categorizedExams = useMemo(() => {
    // Collect all higher studies & research exams
    const higherExams = allExams.filter((e) => {
      const isTarget = targetCodes.includes(e.code);
      const isCategory =
        e.category === 'University and Higher Studies' ||
        e.category === 'Research and Fellowship' ||
        e.category === 'Management Entrance' ||
        (e.subCategory && e.subCategory.toLowerCase().includes('postgraduate'));
      return isTarget || isCategory;
    });

    const studentDegree = (profile.degree || '').toLowerCase();
    const studentSpec = (profile.specialization || '').toLowerCase();
    const studentQual = (profile.educationalQualification || '').toLowerCase();
    const studentAge = profile.age || 24;
    const category = profile.category || 'General';

    return higherExams.map((exam) => {
      let status: 'ELIGIBLE' | 'VERIFICATION_REQUIRED' | 'NOT_ELIGIBLE' | 'MORE_INFO' = 'MORE_INFO';
      const reasons: string[] = [];
      const rules = exam.eligibility || {};

      // 1. Qualification Level Check
      const isUndergradOrHigher =
        studentQual.includes('graduate') ||
        studentQual.includes('undergraduate') ||
        studentQual.includes('post') ||
        studentQual.includes('doctor');

      if (!profile.educationalQualification) {
        status = 'MORE_INFO';
        reasons.push('Educational qualification not provided. Please complete profile to verify.');
      } else if (!isUndergradOrHigher) {
        status = 'NOT_ELIGIBLE';
        reasons.push(`Minimum qualification required is Bachelor's Degree. Your profile indicates '${profile.educationalQualification}'.`);
      } else {
        // 2. Degree and Discipline Matching
        if (exam.code === 'GATE CS') {
          const isTech =
            studentDegree.includes('b.tech') ||
            studentDegree.includes('b.e') ||
            studentDegree.includes('mca') ||
            studentDegree.includes('m.sc');
          const isCS =
            studentSpec.includes('computer') ||
            studentSpec.includes('information') ||
            studentSpec.includes('it') ||
            studentSpec.includes('data');

          if (!profile.degree) {
            status = 'MORE_INFO';
            reasons.push('Specific engineering degree details required to confirm GATE eligibility.');
          } else if (!isTech) {
            status = 'NOT_ELIGIBLE';
            reasons.push(`GATE Computer Science requires B.E/B.Tech/MCA/M.Sc in relevant technical disciplines. You have '${profile.degree}'.`);
          } else if (!isCS && studentSpec.length > 0) {
            status = 'VERIFICATION_REQUIRED';
            reasons.push(`You hold ${profile.degree} in ${profile.specialization}. Any engineering graduate may appear for GATE CS, but computer science fundamentals are essential.`);
          } else {
            status = 'ELIGIBLE';
            reasons.push(`Eligible: ${profile.degree} in ${profile.specialization || 'Engineering'} fully recognized for GATE Computer Science.`);
          }
        } else if (exam.code === 'IIT JAM') {
          const isScience =
            studentDegree.includes('b.sc') ||
            studentDegree.includes('bs') ||
            studentDegree.includes('b.stat') ||
            studentDegree.includes('b.math');

          if (!profile.degree) {
            status = 'MORE_INFO';
            reasons.push('Undergraduate science degree details required for IIT JAM M.Sc admissions.');
          } else if (!isScience && !studentDegree.includes('tech')) {
            status = 'NOT_ELIGIBLE';
            reasons.push(`IIT JAM requires a Bachelor's Degree in Science (B.Sc) or equivalent with subject-specific prerequisites.`);
          } else {
            status = 'VERIFICATION_REQUIRED';
            reasons.push(`Holds ${profile.degree}. Eligible for M.Sc test papers subject to minimum graduation aggregate percentage (55% Gen/OBC, 50% SC/ST).`);
          }
        } else if (exam.code === 'CSIR NET') {
          const isSciencePG =
            studentQual.includes('post') ||
            studentDegree.includes('m.sc') ||
            studentDegree.includes('m.tech') ||
            studentDegree.includes('bs-ms') ||
            studentDegree.includes('mbbs') ||
            studentDegree.includes('b.pharma') ||
            studentDegree.includes('b.tech');

          if (!isSciencePG) {
            status = 'NOT_ELIGIBLE';
            reasons.push(`CSIR NET is strictly for Science & Technology disciplines (Chemical, Earth, Life, Mathematical, Physical Sciences). Humanities & Arts degrees are ineligible.`);
          } else {
            // JRF Age condition
            let maxAgeJRF = 30;
            if (category === 'OBC') maxAgeJRF = 33;
            if (category === 'SC' || category === 'ST' || profile.gender === 'Female') maxAgeJRF = 35;

            if (studentAge <= maxAgeJRF) {
              status = 'ELIGIBLE';
              reasons.push(`Eligible for both JRF (Age ${studentAge} <= ${maxAgeJRF} yrs) and Assistant Professorship (No upper age limit).`);
            } else {
              status = 'VERIFICATION_REQUIRED';
              reasons.push(`Eligible for Lectureship / Assistant Professor only. Overage for JRF (${studentAge} yrs exceeds max ${maxAgeJRF} yrs for ${category}).`);
            }
          }
        } else if (exam.code === 'UGC NET') {
          const isPG =
            studentQual.includes('post') ||
            studentDegree.includes('m.') ||
            studentDegree.includes('master');

          if (!isPG && profile.graduationStatus !== 'Final Year') {
            status = 'NOT_ELIGIBLE';
            reasons.push(`UGC NET requires a Master's Degree (or pursuing final year) in Humanities, Social Sciences, Commerce, Management, or Computer Science with min 55% marks.`);
          } else {
            let maxAgeJRF = 30;
            if (category === 'OBC') maxAgeJRF = 33;
            if (category === 'SC' || category === 'ST' || profile.gender === 'Female') maxAgeJRF = 35;

            if (studentAge <= maxAgeJRF) {
              status = 'ELIGIBLE';
              reasons.push(`Eligible for UGC NET JRF (Fellowship) and Assistant Professorship across 83 statutory subjects.`);
            } else {
              status = 'VERIFICATION_REQUIRED';
              reasons.push(`Eligible for Assistant Professor / Ph.D Admission (No age limit). Age ${studentAge} exceeds JRF cutoff of ${maxAgeJRF} yrs.`);
            }
          }
        } else if (['CAT', 'MAT', 'CMAT'].includes(exam.code)) {
          if (!profile.degree && !profile.educationalQualification) {
            status = 'MORE_INFO';
            reasons.push('Graduation status required to verify MBA entrance eligibility.');
          } else {
            status = 'ELIGIBLE';
            reasons.push(`Universal Eligibility: Accepts any recognized Bachelor's Degree (${profile.degree || 'Any Graduate'}) with 50% aggregate (45% for reserved categories). Final year appearing candidates eligible.`);
          }
        } else if (exam.code === 'CUET PG') {
          if (!profile.educationalQualification) {
            status = 'MORE_INFO';
            reasons.push('Graduation details required for CUET PG course mapping.');
          } else {
            status = 'ELIGIBLE';
            reasons.push(`Eligible to appear for CUET PG test papers mapped to ${profile.degree || 'Bachelor degree'} for admission to Central and State Universities.`);
          }
        } else {
          // General fallback
          status = 'VERIFICATION_REQUIRED';
          reasons.push(`Postgraduate / Research entrance requiring verified university credentials.`);
        }
      }

      return {
        ...exam,
        higherStudiesStatus: status,
        evaluationReasons: reasons
      };
    });
  }, [allExams, profile]);

  // Filter based on selected status tab and search
  const filteredExams = useMemo(() => {
    return categorizedExams.filter((exam) => {
      const matchesTab =
        selectedStatusTab === 'ALL' ||
        (selectedStatusTab === 'ELIGIBLE' && exam.higherStudiesStatus === 'ELIGIBLE') ||
        (selectedStatusTab === 'VERIFICATION_REQUIRED' && exam.higherStudiesStatus === 'VERIFICATION_REQUIRED') ||
        (selectedStatusTab === 'NOT_ELIGIBLE' && exam.higherStudiesStatus === 'NOT_ELIGIBLE') ||
        (selectedStatusTab === 'MORE_INFO' && exam.higherStudiesStatus === 'MORE_INFO');

      const matchesSearch =
        searchQuery === '' ||
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.conductingBody.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [categorizedExams, selectedStatusTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      ALL: categorizedExams.length,
      ELIGIBLE: categorizedExams.filter((e) => e.higherStudiesStatus === 'ELIGIBLE').length,
      VERIFICATION_REQUIRED: categorizedExams.filter((e) => e.higherStudiesStatus === 'VERIFICATION_REQUIRED').length,
      NOT_ELIGIBLE: categorizedExams.filter((e) => e.higherStudiesStatus === 'NOT_ELIGIBLE').length,
      MORE_INFO: categorizedExams.filter((e) => e.higherStudiesStatus === 'MORE_INFO').length
    };
  }, [categorizedExams]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Statutory Postgraduate & Research Directory</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {profile.degree || 'Degree'} ({profile.specialization || 'Branch'}) • {profile.category || 'General'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Higher Studies & Educational Opportunities
            </h1>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              Personalized eligibility evaluation across national Master's, Doctoral, and Fellowship examinations: CUET PG, GATE, IIT JAM, CAT, MAT, CMAT, UGC NET, CSIR NET, and JRF. Technical, science, and management admissions are strictly matched against statutory gazette ordinances.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* 4 Eligibility Status Counter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={() => setSelectedStatusTab('ELIGIBLE')}
            className={`p-3 rounded-lg border text-left transition ${
              selectedStatusTab === 'ELIGIBLE'
                ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                : 'border-slate-200 bg-slate-50/50 hover:bg-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">Eligible</span>
            </div>
            <p className="text-xl font-extrabold text-emerald-700 mt-1">{counts.ELIGIBLE}</p>
            <p className="text-[10px] text-slate-500">Degree & branch matched</p>
          </button>

          <button
            onClick={() => setSelectedStatusTab('VERIFICATION_REQUIRED')}
            className={`p-3 rounded-lg border text-left transition ${
              selectedStatusTab === 'VERIFICATION_REQUIRED'
                ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600'
                : 'border-slate-200 bg-slate-50/50 hover:bg-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-slate-700">Potentially Eligible</span>
            </div>
            <p className="text-xl font-extrabold text-amber-700 mt-1">{counts.VERIFICATION_REQUIRED}</p>
            <p className="text-[10px] text-slate-500">Age / marks condition applies</p>
          </button>

          <button
            onClick={() => setSelectedStatusTab('NOT_ELIGIBLE')}
            className={`p-3 rounded-lg border text-left transition ${
              selectedStatusTab === 'NOT_ELIGIBLE'
                ? 'border-rose-600 bg-rose-50/70 ring-1 ring-rose-600'
                : 'border-slate-200 bg-slate-50/50 hover:bg-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-semibold text-slate-700">Not Eligible</span>
            </div>
            <p className="text-xl font-extrabold text-rose-700 mt-1">{counts.NOT_ELIGIBLE}</p>
            <p className="text-[10px] text-slate-500">Discipline mismatch</p>
          </button>

          <button
            onClick={() => setSelectedStatusTab('MORE_INFO')}
            className={`p-3 rounded-lg border text-left transition ${
              selectedStatusTab === 'MORE_INFO'
                ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                : 'border-slate-200 bg-slate-50/50 hover:bg-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-700">More Info Needed</span>
            </div>
            <p className="text-xl font-extrabold text-blue-700 mt-1">{counts.MORE_INFO}</p>
            <p className="text-[10px] text-slate-500">Complete profile details</p>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'ELIGIBLE', 'VERIFICATION_REQUIRED', 'NOT_ELIGIBLE', 'MORE_INFO'] as EligibilityTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatusTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                selectedStatusTab === tab
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'ALL' && `All Higher Studies (${counts.ALL})`}
              {tab === 'ELIGIBLE' && `Eligible (${counts.ELIGIBLE})`}
              {tab === 'VERIFICATION_REQUIRED' && `Potentially Eligible (${counts.VERIFICATION_REQUIRED})`}
              {tab === 'NOT_ELIGIBLE' && `Not Eligible (${counts.NOT_ELIGIBLE})`}
              {tab === 'MORE_INFO' && `More Info (${counts.MORE_INFO})`}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter exams (e.g. GATE, CAT, UGC NET)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs w-full sm:w-64"
        />
      </div>

      {/* Examination Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExams.map((exam) => {
          const isEligible = exam.higherStudiesStatus === 'ELIGIBLE';
          const isVerification = exam.higherStudiesStatus === 'VERIFICATION_REQUIRED';
          const isNotEligible = exam.higherStudiesStatus === 'NOT_ELIGIBLE';

          return (
            <div
              key={exam.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between ${
                isEligible
                  ? 'border-emerald-200 hover:border-emerald-300'
                  : isVerification
                  ? 'border-amber-200 hover:border-amber-300'
                  : isNotEligible
                  ? 'border-rose-200 bg-slate-50/40 opacity-80'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-blue-900 text-white font-extrabold text-[11px] tracking-wide">
                      {exam.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {exam.conductingBody}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {isEligible && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>ELIGIBLE</span>
                    </span>
                  )}
                  {isVerification && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>POTENTIALLY ELIGIBLE</span>
                    </span>
                  )}
                  {isNotEligible && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold flex items-center space-x-1">
                      <XCircle className="w-3 h-3 text-rose-600" />
                      <span>NOT ELIGIBLE</span>
                    </span>
                  )}
                  {exam.higherStudiesStatus === 'MORE_INFO' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold flex items-center space-x-1">
                      <HelpCircle className="w-3 h-3 text-blue-600" />
                      <span>MORE INFO NEEDED</span>
                    </span>
                  )}
                </div>

                {/* Exam Title & Scope */}
                <h3 className="text-sm font-bold text-slate-900 mt-3 leading-snug">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {exam.shortDescription}
                </p>

                {/* Statutory Reason Breakdown */}
                <div className="mt-3.5 p-3 rounded-lg text-xs bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Statutory Eligibility Analysis
                  </span>
                  {exam.evaluationReasons.map((reason, idx) => (
                    <p key={idx} className="text-slate-700 leading-relaxed text-[11px]">
                      • {reason}
                    </p>
                  ))}
                </div>

                {/* Key Metrics / Attributes */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Min Qualification</span>
                    <strong className="text-slate-800 font-semibold">{exam.eligibility?.minQualification || 'Graduate'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Age Limit</span>
                    <strong className="text-slate-800 font-semibold">
                      {exam.eligibility?.maxAge ? `Max ${exam.eligibility.maxAge} yrs` : 'No Upper Age Limit'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Frequency / Mode</span>
                    <strong className="text-slate-800 font-semibold">{exam.frequency} • {exam.mode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Final Year Eligible</span>
                    <strong className="text-slate-800 font-semibold">
                      {exam.eligibility?.finalYearEligible !== false ? 'Yes (Permitted)' : 'No'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={exam.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-slate-500 hover:text-blue-900 font-medium flex items-center space-x-1"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => onSelectExam(exam.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1 transition shadow-xs ${
                    isNotEligible
                      ? 'border border-slate-300 text-slate-600 hover:bg-slate-100'
                      : 'bg-blue-900 text-white hover:bg-blue-800'
                  }`}
                >
                  <span>{isNotEligible ? 'View Syllabus' : 'Start Preparing'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExams.length === 0 && (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
          <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-semibold text-slate-700">No examinations found under this filter</p>
          <p className="text-xs text-slate-400 mt-1">Try switching to the 'All Higher Studies' tab or clearing your search.</p>
        </div>
      )}
    </div>
  );
};
