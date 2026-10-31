// client/src/views/CareerPathsView.tsx
// Career Path Finder: Dual and Multi Pathway Mapping for Indian Qualifications
// Connects academic degrees to Direct Job Opportunities vs Higher Studies & Research

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Briefcase,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
  Award
} from 'lucide-react';
import { CareerPathway } from '../types';
import { api } from '../services/api';

interface CareerPathsViewProps {
  onSelectExam: (examCode: string) => void;
}

export const CareerPathsView: React.FC<CareerPathsViewProps> = ({ onSelectExam }) => {
  const [pathways, setPathways] = useState<CareerPathway[]>([]);
  const [selectedQualificationId, setSelectedQualificationId] = useState<string>('btech-cs-it');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPathways = async () => {
      try {
        setLoading(true);
        const data = await api.getCareerPaths();
        setPathways(data);
      } catch (err) {
        console.error('Failed to load career paths:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPathways();
  }, []);

  const activePathway = pathways.find((p) => p.qualificationId === selectedQualificationId) || pathways[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-blue-900" />
                <span>Dual Pathway Architecture</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Job Opportunities vs Higher Studies</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Career Path Finder
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Map your academic qualifications to statutory government recruitments, public sector scientific appointments, or premier postgraduate research opportunities.
            </p>
          </div>

          {/* Qualification Selector */}
          <div className="flex items-center space-x-2 text-xs">
            <label className="font-semibold text-slate-500 whitespace-nowrap">Your Degree:</label>
            <select
              value={selectedQualificationId}
              onChange={(e) => setSelectedQualificationId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800"
            >
              {pathways.map((p) => (
                <option key={p.qualificationId} value={p.qualificationId}>
                  {p.degreeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activePathway && (
        <div className="space-y-6">
          {/* Degree Overview Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
              {activePathway.streamCategory}
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">{activePathway.degreeName}</h2>
            <p className="text-slate-600 mt-1 leading-relaxed">{activePathway.summary}</p>
          </div>

          {/* Dual Columns: PATH A (Direct Jobs) vs PATH B (Higher Studies) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PATHWAY A: DIRECT EMPLOYMENT */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-200" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Pathway A: Direct Job Opportunities</h3>
                  <p className="text-[11px] text-slate-500">Government Recruitments, PSUs, Banking & Scientific Cadres</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                {activePathway.pathways.jobOpportunities.map((job, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-xs">{job.name}</h4>
                      <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {job.salaryRange}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium mt-1">Designation: {job.role}</p>
                    <p className="text-slate-500 text-[11px] mt-1">{job.details}</p>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Relevant Exams: <strong>{job.exams.join(', ')}</strong>
                      </span>
                      <button
                        onClick={() => onSelectExam(job.exams[0])}
                        className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center space-x-0.5"
                      >
                        <span>View Exam</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PATHWAY B: HIGHER STUDIES & RESEARCH */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-blue-200" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Pathway B: Higher Studies & Research</h3>
                  <p className="text-[11px] text-slate-500">Master's Degrees, Fellowships, PhD & International Programs</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                {activePathway.pathways.higherStudies.map((study, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-xs">{study.name}</h4>
                      {study.stipend || study.fellowshipAmount ? (
                        <span className="text-[10px] font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {study.stipend || study.fellowshipAmount}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium mt-1">
                      Premier Institutes: {study.institutions.join(', ')}
                    </p>
                    <p className="text-slate-500 text-[11px] mt-1">{study.details}</p>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Gateways: <strong>{study.exams.join(', ')}</strong>
                      </span>
                      <button
                        onClick={() => onSelectExam(study.exams[0])}
                        className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center space-x-0.5"
                      >
                        <span>View Exam</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
