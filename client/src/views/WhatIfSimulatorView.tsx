// client/src/views/WhatIfSimulatorView.tsx
// Interactive "What-If" & Path-to-Eligibility Simulator Engine
// Cross-Stream Syllabus Overlap Recommendation Matrix
// Enables real-time simulated mutations without overwriting student profile records.

import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  GraduationCap,
  Shield,
  Layers,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Zap,
  Target,
  BarChart2,
  Users,
  Award,
  AlertTriangle,
  Info,
  Scale
} from 'lucide-react';
import { Examination, StudentProfile } from '../types';
import { api } from '../services/api';

interface WhatIfSimulatorViewProps {
  profile: StudentProfile;
  allExams: Examination[];
  onSelectExam: (examId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  profile,
  allExams,
  onSelectExam,
  onNavigateTab,
}) => {
  // Preset Personas state
  const [personas, setPersonas] = useState<any[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('custom');

  // Simulation parameters
  const [simDegree, setSimDegree] = useState<string>(profile.degree || 'B.Tech');
  const [simGradStatus, setSimGradStatus] = useState<string>(profile.graduationStatus || 'Completed');
  const [simPassingYear, setSimPassingYear] = useState<number>(Number(profile.passingYear) || 2025);
  const [simCategory, setSimCategory] = useState<string>(profile.category || 'General');
  const [simBranch, setSimBranch] = useState<string>(profile.specialization || 'Electronics and Communication');
  const [simPercentage, setSimPercentage] = useState<number>(profile.aggregatePercentage || profile.percentage || 68);
  const [simAge, setSimAge] = useState<number>(profile.age || 24);
  const [simDob, setSimDob] = useState<string>(profile.dateOfBirth || '2001-08-15');
  const [simHeightCm, setSimHeightCm] = useState<number>(profile.heightCm || 170);
  const [simGender, setSimGender] = useState<string>(profile.gender || 'Male');
  const [simPwD, setSimPwD] = useState<boolean>(profile.isPwD || false);
  const [simExServiceman, setSimExServiceman] = useState<boolean>(profile.isExServiceman || false);

  // Results state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  // Syllabus Overlap Matrix state
  const [targetClusterExam, setTargetClusterExam] = useState<string>('gate-ec');
  const [syllabusMatrixData, setSyllabusMatrixData] = useState<any | null>(null);

  // Load benchmark personas & initial syllabus overlap
  useEffect(() => {
    api.getBenchmarkPersonas()
      .then((res: any) => {
        if (res && res.personas) {
          setPersonas(res.personas);
        }
      })
      .catch((err) => console.error('Failed to load personas:', err));

    api.getSyllabusOverlapMatrix('gate-ec')
      .then((res: any) => {
        if (res) setSyllabusMatrixData(res);
      })
      .catch((err) => console.error('Failed to load syllabus overlap:', err));
  }, []);

  // Update syllabus matrix when target exam changes
  useEffect(() => {
    if (targetClusterExam) {
      api.getSyllabusOverlapMatrix(targetClusterExam)
        .then((res: any) => {
          if (res) setSyllabusMatrixData(res);
        })
        .catch((err) => console.error('Failed to load syllabus overlap:', err));
    }
  }, [targetClusterExam]);

  // Handle Preset Persona Selection
  const handleSelectPersona = (id: string) => {
    setSelectedPersonaId(id);
    if (id === 'custom') {
      resetToStudentProfile();
      return;
    }
    const found = personas.find((p) => p.id === id);
    if (found) {
      setSimDegree(found.degree || "Bachelor's degree");
      setSimGradStatus(found.graduationStatus || 'Completed');
      setSimPassingYear(Number(found.passingYear) || 2025);
      setSimCategory(found.category || 'General');
      setSimBranch(found.specialization || '');
      setSimPercentage(Number(found.aggregatePercentage || found.percentage) || 65);
      setSimAge(Number(found.age) || 23);
      setSimDob(found.dateOfBirth || '2002-05-10');
      setSimHeightCm(Number(found.heightCm) || 170);
      setSimGender(found.gender || 'Male');
      setSimPwD(found.isPwD || false);
      setSimExServiceman(found.isExServiceman || false);
    }
  };

  const resetToStudentProfile = () => {
    setSelectedPersonaId('custom');
    setSimDegree(profile.degree || 'B.Tech');
    setSimGradStatus(profile.graduationStatus || 'Completed');
    setSimPassingYear(Number(profile.passingYear) || 2025);
    setSimCategory(profile.category || 'General');
    setSimBranch(profile.specialization || 'Electronics and Communication');
    setSimPercentage(profile.aggregatePercentage || profile.percentage || 68);
    setSimAge(profile.age || 24);
    setSimDob(profile.dateOfBirth || '2001-08-15');
    setSimHeightCm(profile.heightCm || 170);
    setSimGender(profile.gender || 'Male');
    setSimPwD(profile.isPwD || false);
    setSimExServiceman(profile.isExServiceman || false);
  };

  // Run simulation trigger
  useEffect(() => {
    const triggerSimulation = async () => {
      setIsSimulating(true);
      const simulatedProfile = {
        ...profile,
        degree: simDegree,
        graduationStatus: simGradStatus,
        passingYear: simPassingYear,
        category: simCategory,
        specialization: simBranch,
        aggregatePercentage: simPercentage,
        age: simAge,
        dateOfBirth: simDob,
        heightCm: simHeightCm,
        gender: simGender,
        isPwD: simPwD,
        isExServiceman: simExServiceman
      };

      try {
        const res = await api.simulateWhatIf(profile, simulatedProfile);
        setSimulationResult(res);
      } catch (err) {
        console.error('Simulation error:', err);
      } finally {
        setIsSimulating(false);
      }
    };

    const timer = setTimeout(triggerSimulation, 250);
    return () => clearTimeout(timer);
  }, [
    profile,
    simDegree,
    simGradStatus,
    simPassingYear,
    simCategory,
    simBranch,
    simPercentage,
    simAge,
    simDob,
    simHeightCm,
    simGender,
    simPwD,
    simExServiceman
  ]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Deterministic What-If & Strategic Synergy Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Career Simulator & Path-to-Eligibility
              </h1>
              <p className="mt-2 text-blue-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
                Simulate degrees, age cut-offs, graduation milestones and category rules without altering your profile. 
                Discover unlocked opportunities and cross-stream syllabus overlap.
              </p>
            </div>

            <button
              onClick={resetToStudentProfile}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all border border-white/20 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to My Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Persona Quick Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center space-x-2 mb-3 text-slate-800 font-bold text-sm">
          <Users className="w-4 h-4 text-blue-600" />
          <span>Statutory Benchmark Personas (Select to simulate immediate scenarios):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSelectPersona('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedPersonaId === 'custom'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            My Current Profile
          </button>
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPersona(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPersonaId === p.id
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Grid: Left Controls, Right Impact Deltas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Mutation Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Simulated Parameters</span>
              </h3>
              <span className="text-xs text-slate-400">Pure in-memory test</span>
            </div>

            {/* Degree Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree / Qualification Level
              </label>
              <select
                value={simDegree}
                onChange={(e) => {
                  setSelectedPersonaId('custom');
                  setSimDegree(e.target.value);
                }}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="10th Standard">10th Standard (Matriculation)</option>
                <option value="12th Standard">12th Standard (Higher Secondary / PCM)</option>
                <option value="3-Year Diploma">3-Year Polytechnic Diploma (Engg)</option>
                <option value="B.Tech">B.Tech / B.E. (Bachelor of Engineering)</option>
                <option value="B.Sc">B.Sc (Bachelor of Science)</option>
                <option value="B.A">B.A (Bachelor of Arts / Humanities)</option>
                <option value="B.Com">B.Com (Bachelor of Commerce / Finance)</option>
                <option value="M.Tech">M.Tech / M.E. (Master of Engineering)</option>
                <option value="M.Sc">M.Sc (Master of Science)</option>
                <option value="PhD">Doctorate / PhD (Research)</option>
              </select>
            </div>

            {/* Branch / Specialization */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Discipline / Branch Specialization
              </label>
              <input
                type="text"
                value={simBranch}
                onChange={(e) => {
                  setSelectedPersonaId('custom');
                  setSimBranch(e.target.value);
                }}
                placeholder="e.g. Electronics and Communication, Computer Science"
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Graduation Status & Passing Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={simGradStatus}
                  onChange={(e) => {
                    setSelectedPersonaId('custom');
                    setSimGradStatus(e.target.value);
                  }}
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Completed">Completed / Passed</option>
                  <option value="Final Year Appearing">Final Year Appearing</option>
                  <option value="Pre-Final Year">Pre-Final Year (Year 2/3)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Passing / Target Year
                </label>
                <input
                  type="number"
                  value={simPassingYear}
                  onChange={(e) => {
                    setSelectedPersonaId('custom');
                    setSimPassingYear(parseInt(e.target.value) || 2025);
                  }}
                  min="2015"
                  max="2032"
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category & Aggregate % */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reservation Category
                </label>
                <select
                  value={simCategory}
                  onChange={(e) => {
                    setSelectedPersonaId('custom');
                    setSimCategory(e.target.value);
                  }}
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General">General / UR</option>
                  <option value="EWS">EWS</option>
                  <option value="OBC">OBC-NCL (+3y)</option>
                  <option value="SC">SC (+5y)</option>
                  <option value="ST">ST (+5y)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Aggregate Score: <span className="text-blue-600 font-bold">{simPercentage}%</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={simPercentage}
                  onChange={(e) => {
                    setSelectedPersonaId('custom');
                    setSimPercentage(parseInt(e.target.value));
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Age & Date of Birth */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Simulated Age: <span className="text-blue-600 font-bold">{simAge} yrs</span>
                </label>
                <input
                  type="range"
                  min="16"
                  max="45"
                  value={simAge}
                  onChange={(e) => {
                    setSelectedPersonaId('custom');
                    const newAge = parseInt(e.target.value);
                    setSimAge(newAge);
                    const birthYear = new Date().getFullYear() - newAge;
                    setSimDob(`${birthYear}-07-01`);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={simDob}
                  onChange={(e) => {
                    setSelectedPersonaId('custom');
                    setSimDob(e.target.value);
                    if (e.target.value) {
                      const dob = new Date(e.target.value);
                      const diffYears = Math.floor((new Date().getTime() - dob.getTime()) / (365.25 * 24 * 3600 * 1000));
                      if (diffYears > 10 && diffYears < 60) setSimAge(diffYears);
                    }
                  }}
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Physical Standards (Height & Gender) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Height: <span className="text-blue-600 font-bold">{simHeightCm} cm</span>
                </label>
                <input
                  type="range"
                  min="145"
                  max="195"
                  value={simHeightCm}
                  onChange={(e) => {
                    setSelectedPersonaId('custom');
                    setSimHeightCm(parseInt(e.target.value));
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={simGender}
                  onChange={(e) => {
                    setSelectedPersonaId('custom');
                    setSimGender(e.target.value);
                  }}
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Special Categories checkboxes */}
            <div className="pt-2 flex items-center space-x-6 border-t border-slate-100">
              <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simPwD}
                  onChange={(e) => {
                    setSelectedPersonaId('custom');
                    setSimPwD(e.target.checked);
                  }}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>PwBD (+10y relaxation)</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simExServiceman}
                  onChange={(e) => {
                    setSelectedPersonaId('custom');
                    setSimExServiceman(e.target.checked);
                  }}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Ex-Servicemen (ESM)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Simulation Deltas & Unlocked Exams (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Delta Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Newly Unlocked
                </span>
                <div className="w-8 h-8 rounded-full bg-emerald-200/60 flex items-center justify-center text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-emerald-900">
                  +{simulationResult?.summary?.newlyUnlockedCount || 0}
                </span>
                <span className="text-xs text-emerald-700 font-medium">examinations</span>
              </div>
              <p className="mt-1 text-xs text-emerald-600">
                Unlocked by simulated degree or age milestones
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Aged Out / Lost
                </span>
                <div className="w-8 h-8 rounded-full bg-rose-200/60 flex items-center justify-center text-rose-800">
                  <XCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-rose-900">
                  -{simulationResult?.summary?.agedOutCount || 0}
                </span>
                <span className="text-xs text-rose-700 font-medium">examinations</span>
              </div>
              <p className="mt-1 text-xs text-rose-600">
                Exceeded statutory age or branch cap
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Total Simulated Eligible
                </span>
                <div className="w-8 h-8 rounded-full bg-blue-200/60 flex items-center justify-center text-blue-800">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-blue-900">
                  {simulationResult?.summary?.simulatedEligibleCount || 0}
                </span>
                <span className="text-xs text-blue-700 font-medium">statutory match</span>
              </div>
              <p className="mt-1 text-xs text-blue-600">
                Across Central and State boards
              </p>
            </div>
          </div>

          {/* Newly Unlocked List */}
          {simulationResult?.unlockedOpportunities && simulationResult.unlockedOpportunities.length > 0 && (
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Newly Unlocked by this Simulation ({simulationResult.unlockedOpportunities.length})</span>
                </h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                  Opportunity Expansion
                </span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {simulationResult.unlockedOpportunities.map((op: any) => (
                  <div
                    key={op.examId}
                    className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">{op.examCode}</span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-slate-600 text-xs">{op.conductingBody}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium mt-0.5">{op.examTitle}</p>
                    </div>

                    <button
                      onClick={() => onSelectExam(op.examId)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all shadow-sm"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Path-to-Eligibility Strategic Roadmaps */}
          {simulationResult?.pathToEligibilityRoadmaps && simulationResult.pathToEligibilityRoadmaps.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Actionable Path-to-Eligibility Roadmaps</span>
                </h3>
                <span className="text-xs text-slate-500">Statutory Milestones</span>
              </div>

              <div className="space-y-4">
                {simulationResult.pathToEligibilityRoadmaps.slice(0, 3).map((rm: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{rm.examCode} — {rm.examTitle}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                        Target Roadmap
                      </span>
                    </div>

                    <div className="space-y-2">
                      {rm.milestones && rm.milestones.map((m: any, mIdx: number) => (
                        <div key={mIdx} className="flex items-start space-x-2.5 text-xs text-slate-700">
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {mIdx + 1}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900">{m.title}: </span>
                            <span>{m.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cross-Stream Syllabus Overlap Recommendation Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Scale className="w-4 h-4" />
              <span>Cross-Stream Syllabus Synergy & Multi-Exam Preparation</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Syllabus Overlap Recommendation Matrix
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Preparing for one high-rigor examination automatically covers up to 95% of multiple PSU, State, and Research exams.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700">Anchor Exam:</span>
            <select
              value={targetClusterExam}
              onChange={(e) => setTargetClusterExam(e.target.value)}
              className="text-xs font-semibold rounded-xl border border-slate-300 p-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="gate-ec">GATE Electronics & Communication (EC)</option>
              <option value="gate-cs">GATE Computer Science (CS)</option>
              <option value="upsc-cse">UPSC Civil Services Examination (CSE)</option>
              <option value="ssc-cgl">SSC Combined Graduate Level (CGL)</option>
              <option value="rrb-je">RRB Junior Engineer (Technical)</option>
            </select>
          </div>
        </div>

        {/* Synergistic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {syllabusMatrixData?.derivativeOpportunities &&
            syllabusMatrixData.derivativeOpportunities.map((deriv: any, idx: number) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 p-5 bg-gradient-to-b from-slate-50/50 to-white hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {deriv.code}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-base font-extrabold text-emerald-700">
                        {deriv.overlapPercent}%
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold uppercase">Overlap</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 font-medium">{deriv.conductingBody}</p>

                  {/* Overlap Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        deriv.overlapPercent >= 90
                          ? 'bg-emerald-500'
                          : deriv.overlapPercent >= 75
                          ? 'bg-blue-600'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${deriv.overlapPercent}%` }}
                    />
                  </div>

                  {/* Common Topics */}
                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                      Common Core Syllabus ({deriv.commonSyllabus?.length || 0} Areas):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {deriv.commonSyllabus?.slice(0, 4).map((topic: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                      {deriv.commonSyllabus?.length > 4 && (
                        <span className="text-[10px] text-slate-500 font-medium self-center">
                          +{deriv.commonSyllabus.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Divergent Topics */}
                  {deriv.divergentSyllabus && deriv.divergentSyllabus.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                        Extra Topics to Cover:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {deriv.divergentSyllabus.map((div: string, dIdx: number) => (
                          <span
                            key={dIdx}
                            className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded"
                          >
                            {div}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strategic Guidance */}
                  <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 italic">
                    "{deriv.preparationStrategy}"
                  </p>
                </div>

                <button
                  onClick={() => onSelectExam(deriv.examId || targetClusterExam)}
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-blue-900 text-white text-xs font-semibold transition-all shadow-sm"
                >
                  <span>Explore Syllabus Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
