// client/src/components/ExamDetailModal.tsx
// 7-Layer Master Relational Examination Detail Modal for EXAMVERSE
// Model: Authority -> ExamFamily -> Exam -> ExamCycle -> Notice -> ExamStage -> SourceDocument

import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Calendar,
  Layers,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { AntiScamBanner } from './AntiScamBanner';

interface ExamDetailModalProps {
  slug: string | null;
  onClose: () => void;
  onSelectForPrep: (examId: string) => void;
}

export const ExamDetailModal: React.FC<ExamDetailModalProps> = ({
  slug,
  onClose,
  onSelectForPrep
}) => {
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STAGES' | 'CYCLES' | 'SOURCES'>('OVERVIEW');

  useEffect(() => {
    if (!slug) return;
    const fetchExam = async () => {
      try {
        setLoading(true);
        const data = await api.getExamBySlug(slug);
        setExam(data);
      } catch (err) {
        console.error('Failed to fetch exam detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [slug]);

  if (!slug) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Anti-Scam Banner at Top of Modal */}
        <AntiScamBanner officialDomain={exam?.officialWebsite ? new URL(exam.officialWebsite).hostname : undefined} />

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold px-2 py-0.5 rounded bg-blue-900 text-white font-mono">
                {exam?.code || 'EXAM'}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                {exam?.conductingBody || 'National Authority'}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Statutory Verified</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{exam?.title || 'Examination Detail'}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-5 text-xs font-bold text-slate-600 bg-white overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: '1. Overview & Eligibility' },
            { id: 'STAGES', label: '2. Selection Funnel & Stages' },
            { id: 'CYCLES', label: '3. Cycles & IST Timeline' },
            { id: 'SOURCES', label: '4. Official Gazette & Sources' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-900 text-blue-900 font-bold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="inline-block animate-spin w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full mb-3"></div>
              <p className="text-sm font-semibold text-slate-700">Loading Relational Examination Schema...</p>
            </div>
          ) : !exam ? (
            <p className="text-center py-10 text-slate-500">Record not found in Master Registry.</p>
          ) : (
            <>
              {/* TAB 1: OVERVIEW & ELIGIBILITY */}
              {activeTab === 'OVERVIEW' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                    <p className="font-bold text-slate-800 text-sm">Official Description & Scope</p>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      {exam.description || exam.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                      <span><strong>Jurisdiction:</strong> {exam.scope || 'All India'}</span>
                      <span>•</span>
                      <span><strong>Category:</strong> {exam.category}</span>
                      <span>•</span>
                      <span><strong>Frequency:</strong> {exam.frequency || 'Annual'}</span>
                    </div>
                  </div>

                  {/* Student Eligibility Live Evaluation */}
                  {exam.studentEligibility && (
                    <div className={`p-4 rounded-xl border ${
                      exam.studentEligibility.status === 'ELIGIBLE'
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : exam.studentEligibility.status === 'VERIFICATION_REQUIRED'
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : 'bg-rose-50/80 border-rose-200 text-rose-950'
                    }`}>
                      <div className="flex items-center space-x-2 font-bold text-sm">
                        {exam.studentEligibility.status === 'ELIGIBLE' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                        )}
                        <span>Your Eligibility Status: {exam.studentEligibility.status}</span>
                      </div>
                      <ul className="mt-2 space-y-1 list-disc list-inside text-xs font-medium">
                        {exam.studentEligibility.reasons.map((r: string, idx: number) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Statutory Eligibility Benchmarks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Prescribed Educational Qualification</span>
                      <p className="text-xs font-bold text-slate-800">{exam.eligibility?.minQualification || 'Graduate'}</p>
                      {exam.eligibility?.allowedDegrees && (
                        <p className="text-[11px] text-slate-500">
                          Degrees: {exam.eligibility.allowedDegrees.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Age Limits (General Category)</span>
                      <p className="text-xs font-bold text-slate-800">
                        {exam.eligibility?.minAge || 18} to {exam.eligibility?.maxAge || 32} Years
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Statutory age relaxations applied: SC/ST (+5 yrs), OBC (+3 yrs), PwBD (+10 yrs).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SELECTION FUNNEL & STAGES */}
              {activeTab === 'STAGES' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-medium">
                    Statutory Multi-Stage Examination Funnel prescribed by official gazette notification:
                  </p>
                  {(exam.stages || []).map((stage: any, idx: number) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold">
                            {stage.stageNumber}
                          </span>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{stage.name}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {stage.type}
                        </span>
                      </div>

                      {stage.papers && (
                        <div className="pl-8 space-y-1 text-slate-600">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Papers & Marks:</span>
                          <ul className="list-disc list-inside space-y-0.5">
                            {stage.papers.map((p: string, pIdx: number) => (
                              <li key={pIdx}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {stage.qualifyingCutoff && (
                        <p className="pl-8 text-[11px] text-blue-900 font-medium">
                          <strong>Benchmark:</strong> {stage.qualifyingCutoff}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: CYCLES & IST TIMELINE */}
              {activeTab === 'CYCLES' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-medium">
                    Deterministic Indian Standard Time (IST) cycle tracking for upcoming and completed cycles:
                  </p>
                  {(exam.cycles || []).map((cycle: any, idx: number) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-slate-900">Cycle {cycle.cycleYear}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {cycle.reportedVacancies} Vacancies
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          cycle.lifecycleEvaluation?.badgeColor === 'emerald'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {cycle.lifecycleEvaluation?.badgeText || cycle.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Application Window</span>
                          <span className="font-semibold text-slate-800">
                            {cycle.applicationOpenDate || 'N/A'} to {cycle.applicationCloseDate || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Examination Date</span>
                          <span className="font-semibold text-slate-800">{cycle.examinationDate || 'Announced in Gazette'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Timezone</span>
                          <span className="font-semibold text-slate-800">Asia/Kolkata (IST)</span>
                        </div>
                      </div>

                      {cycle.lifecycleEvaluation?.explanation && (
                        <p className="text-[11px] text-slate-500 italic">
                          {cycle.lifecycleEvaluation.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: OFFICIAL GAZETTE & SOURCES */}
              {activeTab === 'SOURCES' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-medium">
                    Verified official source documents with cryptographic provenance tags:
                  </p>
                  {(exam.sourceDocuments || []).map((doc: any, idx: number) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{doc.documentTitle}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {doc.verificationBadge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Issuing Authority: <strong>{doc.issuingAuthority}</strong> • Published: {doc.publishedDate}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 bg-slate-50 p-1.5 rounded">
                        Integrity Signature: {doc.integrityHash}
                      </p>
                      <div className="pt-2">
                        <a
                          href={doc.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-200" />
                          <span>View Official Gazette PDF Portal</span>
                          <ExternalLink className="w-3 h-3 text-white/70" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <a
            href={exam?.officialWebsite || 'https://upsc.gov.in'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-900"
          >
            <span>Official Commission Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onSelectForPrep(exam.id || slug);
                onClose();
              }}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white transition shadow-xs flex items-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-200" />
              <span>Prepare for this Exam</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
