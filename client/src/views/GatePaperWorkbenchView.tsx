// client/src/views/GatePaperWorkbenchView.tsx
// 23-Point Data-Driven Official GATE Paper Workbench
// Rendered from a single strongly-typed data-driven template for all 30 official GATE papers.

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Award,
  Layers,
  FileText,
  Calculator,
  Compass,
  CheckCircle2,
  ExternalLink,
  Flame,
  GraduationCap,
  Briefcase,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck,
  Calendar,
  BookCheck
} from 'lucide-react';
import { api } from '../services/api';

interface GatePaperWorkbenchProps {
  paperCode: string;
  onBack: () => void;
  onSelectPaper?: (code: string) => void;
}

export const GatePaperWorkbenchView: React.FC<GatePaperWorkbenchProps> = ({
  paperCode,
  onBack,
  onSelectPaper
}) => {
  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'STRUCTURE' | 'SYLLABUS' | 'PYQ' | 'CUTOFFS' | 'RESOURCES' | 'STRATEGY' | 'OPPORTUNITIES'>('STRUCTURE');
  const [cutoffSubTab, setCutoffSubTab] = useState<'QUALIFYING' | 'ADMISSION' | 'PSU'>('QUALIFYING');

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        setLoading(true);
        const res = await api.getGatePaperDossier(paperCode);
        if (res && res.dossier) {
          setDossier(res.dossier);
        }
      } catch (err) {
        console.error('Failed to load GATE paper dossier:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDossier();
  }, [paperCode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Official 23-Point GATE Dossier for {paperCode}...</p>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Dossier Not Found</h2>
        <p className="text-sm text-slate-600 mt-1">Unable to locate canonical dataset for GATE paper {paperCode}.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Return to GATE Hub
        </button>
      </div>
    );
  }

  const {
    point1_paperOverview,
    point2_sectionStructure,
    point3_eligibilityMapper,
    point4_completeOfficialSyllabus,
    point5_granularTopicBreakdown,
    point6_pyqArchive,
    point7_officialAnswerKeys,
    point8_strictlySeparatedCutoffs,
    point9_examPatternAndMarkingScheme,
    point10_topicWeightageHeatmap,
    point11_recommendedTextbooks,
    point12_curatedNptelLinks,
    point13_practiceLauncher,
    point14_mockTestLauncher,
    point15_latexFormulaSheets,
    point16_highYieldConcepts,
    point17_quickRevisionNotes,
    point18_difficultyAndNormalizationAnalysis,
    point19_subjectPreparationStrategy,
    point20_studyPlans,
    point21_coapCcmtAdmissionExplorer,
    point22_psuRecruitmentMatrix,
    point23_officialBrochureSource,
    allowedSecondaryPapers
  } = dossier;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to GATE Intelligence Hub</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500">Allowed Secondary Papers:</span>
          {(allowedSecondaryPapers || []).map((sec: string) => (
            <button
              key={sec}
              onClick={() => onSelectPaper && onSelectPaper(sec)}
              className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
            >
              +{sec}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Paper Dossier Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-indigo-600 text-white text-base font-extrabold rounded-lg tracking-wider shadow">
                {point1_paperOverview.paperCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                {point1_paperOverview.category}
              </span>
              {point1_paperOverview.isMultiSection && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Multi-Section Structure
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {point1_paperOverview.paperName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {point1_paperOverview.streamRelevance}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
            <a
              href={point23_officialBrochureSource.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Official GATE Portal</span>
            </a>
            <span className="text-[11px] text-center text-slate-400">
              Source: {point23_officialBrochureSource.organizingInstitute}
            </span>
          </div>
        </div>

        {/* Quick Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Total Marks / Questions</span>
            <span className="font-bold text-white text-sm">100 Marks (65 Questions)</span>
          </div>
          <div>
            <span className="text-slate-400 block">Exam Duration</span>
            <span className="font-bold text-white text-sm">180 Minutes (3 Hours)</span>
          </div>
          <div>
            <span className="text-slate-400 block">General Aptitude</span>
            <span className="font-bold text-emerald-400 text-sm">15 Marks (Compulsory)</span>
          </div>
          <div>
            <span className="text-slate-400 block">Core Discipline + Math</span>
            <span className="font-bold text-indigo-300 text-sm">85 Marks</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for the 23 Dimensions */}
      <div className="flex overflow-x-auto space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
        {[
          { id: 'STRUCTURE', label: '1. Structure & Pattern', icon: Layers },
          { id: 'SYLLABUS', label: '2. Syllabus & Heatmap', icon: BookOpen },
          { id: 'PYQ', label: '3. PYQs & Answer Keys', icon: FileCheck },
          { id: 'CUTOFFS', label: '4. Strictly Isolated Cutoffs', icon: Award },
          { id: 'RESOURCES', label: '5. Formulas & Books', icon: BookCheck },
          { id: 'STRATEGY', label: '6. Strategy & Plans', icon: Compass },
          { id: 'OPPORTUNITIES', label: '7. PSUs & IITs Explorer', icon: Briefcase }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STRUCTURE & EXAM PATTERN */}
      {activeTab === 'STRUCTURE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section Architecture */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Point 2: Section Structure & Mark Weightage</span>
              </h3>

              {point1_paperOverview.isMultiSection ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
                    This paper follows a multi-section architecture. Candidates must attempt General Aptitude, the compulsory core section, plus chosen optional sections.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block">General Aptitude (GA):</span>
                    <span className="text-slate-600">15 Marks (10 Questions)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                    <span className="font-bold text-indigo-900 block">
                      Compulsory Section: {point2_sectionStructure.compulsorySection?.code} ({point2_sectionStructure.compulsorySection?.name})
                    </span>
                    <span className="text-indigo-700">{point2_sectionStructure.compulsorySection?.marks} Marks</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block">Optional Sections Rule:</span>
                    <span className="text-slate-600">
                      Choose {point2_sectionStructure.optionalSectionRules?.selectCount} section(s) from the following list (each {point2_sectionStructure.optionalSectionRules?.marksPerSection} Marks):
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {(point2_sectionStructure.optionalSections || []).map((sec: any) => (
                        <div key={sec.code} className="p-2 rounded bg-white border border-slate-200 font-semibold text-slate-700">
                          {sec.code}: {sec.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-slate-700">General Aptitude (GA)</span>
                    <span className="font-bold text-slate-900">15 Marks (10 Qs)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                    <span className="font-semibold text-indigo-900">Engineering Mathematics</span>
                    <span className="font-bold text-indigo-900">13 - 15 Marks (8 Qs)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-slate-700">Subject Core Fundamentals</span>
                    <span className="font-bold text-slate-900">70 - 72 Marks (47 Qs)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-900">Total Paper Weight</span>
                    <span className="font-extrabold text-emerald-900">100 Marks (65 Qs)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Marking Scheme & Negative Marking */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                <span>Point 9: Official Marking Scheme & Question Types</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span>1. Multiple Choice Questions (MCQ)</span>
                    <span className="text-rose-600">Negative Penalty</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    1-Mark MCQs carry <strong>-1/3 (0.33)</strong> mark deduction for wrong answers. 2-Mark MCQs carry <strong>-2/3 (0.66)</strong> mark deduction.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span>2. Multiple Select Questions (MSQ)</span>
                    <span className="text-emerald-600">Zero Negative Marking</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    May have one or more than one correct option. Full marks awarded only if <strong>ALL</strong> correct choices are selected without any wrong choice. <strong>NO PARTIAL MARKING</strong>. No negative marks.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span>3. Numerical Answer Type (NAT)</span>
                    <span className="text-emerald-600">Zero Negative Marking</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Candidates enter numeric values using virtual on-screen keypad. Evaluated within official tolerance bands (e.g., 4.2 to 4.4). No negative marks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility & Normalization Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Point 3: Degree & Eligibility Criteria</span>
              </h3>
              <div className="text-xs space-y-2 text-slate-700">
                <p><strong>Minimum Qualification:</strong> {point3_eligibilityMapper.minQualification}</p>
                <p><strong>Allowed Degrees:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  {(point3_eligibilityMapper.allowedDegrees || []).map((deg: string, i: number) => (
                    <li key={i}>{deg}</li>
                  ))}
                </ul>
                <p><strong>Age Limit:</strong> {point3_eligibilityMapper.ageLimit}</p>
                <p><strong>Nationality:</strong> {point3_eligibilityMapper.nationality}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Point 18: Normalization & Session Distribution</span>
              </h3>
              <div className="text-xs space-y-2 text-slate-700">
                <p><strong>Examination Sessions:</strong> {point18_difficultyAndNormalizationAnalysis.sessionCount} Session(s)</p>
                <p><strong>Multi-Session Normalization:</strong> {point18_difficultyAndNormalizationAnalysis.normalizationApplied ? 'APPLIED (Formula enforced)' : 'NOT APPLICABLE (Single Session Paper)'}</p>
                <p><strong>Analytical Difficulty Profile:</strong> {point18_difficultyAndNormalizationAnalysis.difficultyIndex}</p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                  For multi-session papers, raw marks are normalized using the standard statistical mean and standard deviation equation across sessions to ensure full inter-session parity.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETE SYLLABUS & TOPIC BREAKDOWN */}
      {activeTab === 'SYLLABUS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Points 4 & 5: Complete Official Syllabus & Granular Breakdown</span>
                </h3>
                <p className="text-xs text-slate-500">Official syllabus published by the GATE Organizing Institute.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {point4_completeOfficialSyllabus.totalSubjects} Core Subjects
              </span>
            </div>

            <div className="space-y-4">
              {(point5_granularTopicBreakdown || []).map((sub: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-900">{sub.subject}</h4>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-xs font-semibold">
                      Weightage: {sub.weightageEstimate}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-1">
                    {(sub.topics || []).map((t: string, tidx: number) => (
                      <li key={tidx} className="leading-relaxed">{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Topic Weightage Heatmap */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Point 10: Historical Subject Weightage Heatmap</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                LABEL: {point10_topicWeightageHeatmap.dataLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500">{point10_topicWeightageHeatmap.disclaimer}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(point10_topicWeightageHeatmap.distribution || []).map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="font-semibold text-slate-800 block truncate">{item.subject}</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: item.weightage }} />
                    </div>
                    <span className="font-bold text-indigo-700 text-[11px]">{item.weightage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PYQS & ANSWER KEYS */}
      {activeTab === 'PYQ' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Points 6 & 7: Official Previous-Year Question Papers & Answer Keys</span>
              </h3>
              <p className="text-xs text-slate-500">Official master papers with verified answer keys.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {point7_officialAnswerKeys.evaluationStatus}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {(point6_pyqArchive || []).map((pyq: any, i: number) => (
              <div key={i} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">GATE {pyq.year} — {point1_paperOverview.paperCode} Master Paper</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">Official Gazette</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Qualifying Marks: General: {pyq.qualifyingMarks?.General} | OBC: {pyq.qualifyingMarks?.OBC} | SC/ST: {pyq.qualifyingMarks?.SC_ST}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={pyq.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Download Paper (PDF)</span>
                  </a>
                  <a
                    href={pyq.answerKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Official Key</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STRICTLY ISOLATED CUTOFFS */}
      {activeTab === 'CUTOFFS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Point 8: Strictly Separated Cutoff Registries</span>
              </h3>
              <p className="text-xs text-slate-500">
                In strict accordance with the Zero-Fabrication Directive, Qualifying Cutoffs, Admission Cutoffs, and PSU Shortlisting Cutoffs are isolated into separate verifiable records.
              </p>
            </div>

            {/* Cutoff Sub-tabs */}
            <div className="flex space-x-2 border-b border-slate-200 pb-2">
              {[
                { id: 'QUALIFYING', label: '1. Qualifying Cutoffs (Scorecard)' },
                { id: 'ADMISSION', label: '2. IIT / NIT Admission Cutoffs (COAP/CCMT)' },
                { id: 'PSU', label: '3. PSU Shortlisting Cutoffs (Interviews)' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setCutoffSubTab(st.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    cutoffSubTab === st.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Sub-tab 1: Qualifying Cutoffs */}
            {cutoffSubTab === 'QUALIFYING' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                      <th className="py-2.5 px-3">Year</th>
                      <th className="py-2.5 px-3">General (UR)</th>
                      <th className="py-2.5 px-3">OBC (NCL) / EWS</th>
                      <th className="py-2.5 px-3">SC / ST / PwD</th>
                      <th className="py-2.5 px-3">Highest Mark Awarded</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(point8_strictlySeparatedCutoffs.qualifyingCutoffs || []).map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{row.year}</td>
                        <td className="py-2.5 px-3 font-semibold text-indigo-700">{row.General} Marks</td>
                        <td className="py-2.5 px-3 text-slate-700">{row.OBC_EWS || row.OBC} Marks</td>
                        <td className="py-2.5 px-3 text-slate-700">{row.SC_ST_PwD || row.SC_ST} Marks</td>
                        <td className="py-2.5 px-3 text-emerald-600 font-semibold">{row.maxMarksAwarded || '85+'} Marks</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">OFFICIAL</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-tab 2: Admission Cutoffs */}
            {cutoffSubTab === 'ADMISSION' && (
              <div className="overflow-x-auto space-y-3">
                <p className="text-xs text-slate-500">Benchmark GATE score ranges required in COAP / CCMT for admission offers.</p>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                      <th className="py-2.5 px-3">Institute</th>
                      <th className="py-2.5 px-3">M.Tech Program</th>
                      <th className="py-2.5 px-3">General Score</th>
                      <th className="py-2.5 px-3">OBC Score</th>
                      <th className="py-2.5 px-3">SC/ST Score</th>
                      <th className="py-2.5 px-3">Counselling Round</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(point8_strictlySeparatedCutoffs.admissionCutoffs || []).map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{row.instituteName}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">{row.program}</td>
                        <td className="py-2.5 px-3 font-bold text-indigo-700">{row.gateScoreCutoff?.General}</td>
                        <td className="py-2.5 px-3 text-slate-700">{row.gateScoreCutoff?.OBC}</td>
                        <td className="py-2.5 px-3 text-slate-700">{row.gateScoreCutoff?.SC}</td>
                        <td className="py-2.5 px-3 text-slate-500">{row.round}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-tab 3: PSU Shortlisting Cutoffs */}
            {cutoffSubTab === 'PSU' && (
              <div className="overflow-x-auto space-y-3">
                <p className="text-xs text-slate-500">Official shortlisting criteria for interview calls in Central Public Sector Enterprises.</p>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                      <th className="py-2.5 px-3">PSU Name</th>
                      <th className="py-2.5 px-3">Post Title</th>
                      <th className="py-2.5 px-3">Cutoff Metric</th>
                      <th className="py-2.5 px-3">General</th>
                      <th className="py-2.5 px-3">OBC</th>
                      <th className="py-2.5 px-3">SC/ST</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(point8_strictlySeparatedCutoffs.psuCutoffs || []).map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{row.psuName}</td>
                        <td className="py-2.5 px-3 text-slate-700">{row.postTitle}</td>
                        <td className="py-2.5 px-3 text-slate-500">{row.criteria}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700">{row.cutoffGeneral}</td>
                        <td className="py-2.5 px-3 text-slate-700">{row.cutoffOBC}</td>
                        <td className="py-2.5 px-3 text-slate-700">{row.cutoffSC}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: FORMULAS & TEXTBOOKS */}
      {activeTab === 'RESOURCES' && (
        <div className="space-y-6">
          {/* Formula Sheets */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>Point 15: Interactive LaTeX Formula Sheets</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(point15_latexFormulaSheets || []).map((formula: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{formula.name}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold">{formula.domain}</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 text-xs font-mono text-indigo-950 overflow-x-auto">
                    <code>{formula.latex}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Standard Textbooks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <BookCheck className="w-4 h-4 text-indigo-600" />
              <span>Point 11: Standard Recommended Textbooks</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {(point11_recommendedTextbooks || []).map((book: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{book.subject}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{book.title}</h4>
                  <p className="text-slate-600">Author: {book.author}</p>
                  <p className="text-slate-500 text-[11px]">{book.edition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Curated NPTEL Courses */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-indigo-600" />
              <span>Point 12: Curated NPTEL & SWAYAM Video Courses</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {(point12_curatedNptelLinks || []).map((course: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{course.institute}</span>
                    <h4 className="font-bold text-slate-900">{course.title}</h4>
                    <p className="text-slate-600 text-[11px]">Instructor: {course.instructor}</p>
                  </div>
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: STRATEGY & STUDY PLANS */}
      {activeTab === 'STRATEGY' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Point 19: Subject Order & Preparation Strategy</span>
            </h3>
            <div className="space-y-3">
              {(point19_subjectPreparationStrategy || []).map((st: any, i: number) => (
                <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                    {st.step || i + 1}
                  </span>
                  <p className="text-slate-700 leading-relaxed pt-0.5">{st.action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Point 20: 30 / 60 / 90 / 180-Day Study Schedules</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                <span className="font-bold text-rose-900 block">30-Day Intensive Crash Plan</span>
                <p className="text-rose-800 leading-relaxed">{point20_studyPlans.days30}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900 block">60-Day Weakness Remediation Plan</span>
                <p className="text-amber-800 leading-relaxed">{point20_studyPlans.days60}</p>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
                <span className="font-bold text-indigo-900 block">90-Day Standard Study Plan</span>
                <p className="text-indigo-800 leading-relaxed">{point20_studyPlans.days90}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 block">180-Day Foundation Master Plan</span>
                <p className="text-emerald-800 leading-relaxed">{point20_studyPlans.days180}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PSUS & M.TECH EXPLORER */}
      {activeTab === 'OPPORTUNITIES' && (
        <div className="space-y-6">
          {/* PSUs Accepting this paper code */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Point 22: PSU Recruitment Matrix for {point1_paperOverview.paperCode}</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {(point22_psuRecruitmentMatrix || []).length} Active PSUs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(point22_psuRecruitmentMatrix || []).map((psu: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-900">{psu.psuName}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {psu.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{psu.fullName}</p>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
                    <span>Notification: {psu.notificationMonth}</span>
                    <a
                      href={psu.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Portal &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COAP & CCMT Admissions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Point 21: COAP (IITs/IISc) & CCMT (NITs/IIITs) Admission Matrix</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              M.Tech, MS (Research), and Direct PhD admissions across 23 IITs and IISc Bangalore are coordinated via the Common Offer Acceptance Portal (COAP). NITs, IIITs, and CFTIs use Centralized Counselling for M.Tech/M.Arch/M.Plan (CCMT).
            </p>
            <div className="flex flex-wrap gap-3 text-xs pt-2">
              <a
                href={point21_coapCcmtAdmissionExplorer.counsellingPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition"
              >
                Access Official COAP Portal &rarr;
              </a>
              <a
                href="https://ccmt.admissions.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
              >
                Access Official CCMT Portal &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
