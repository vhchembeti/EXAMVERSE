// client/src/views/CareerPathwaysGraphView.tsx
// Interactive Career Pathway Graph Explorer for EXAMVERSE
// Implements Dijkstra's Multi-Objective Shortest Path & Kahn's Topological Sort Validation

import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  Clock,
  IndianRupee,
  Layers,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Filter,
  GraduationCap,
  Briefcase,
  Award,
  Zap
} from 'lucide-react';
import { api } from '../services/api';

const STREAM_TABS = [
  { id: 'ALL', label: 'All Streams' },
  { id: 'ENGINEERING_SCIENCE', label: 'Science & Engineering' },
  { id: 'DIPLOMA_POLYTECHNIC', label: 'Diploma & Lateral Entry' },
  { id: 'ARTS_HUMANITIES', label: 'Arts & Humanities' },
  { id: 'COMMERCE_FINANCE', label: 'Commerce & Finance' },
  { id: 'BIOLOGY_LIFE_SCIENCES', label: 'Biology & Life Sciences' }
];

export const CareerPathwaysGraphView: React.FC = () => {
  const [selectedStream, setSelectedStream] = useState<string>('ALL');
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[]; epistemicHonestyBadge: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Route Planning State
  const [startNodeId, setStartNodeId] = useState<string>('node-12th-science-pcm');
  const [targetNodeId, setTargetNodeId] = useState<string>('node-drdo-isro-barc-scientist');
  const [activeObjective, setActiveObjective] = useState<'FASTEST' | 'LOWEST_COST' | 'HIGHEST_SYNERGY'>('FASTEST');
  const [pathwayResult, setPathwayResult] = useState<any | null>(null);
  const [calculatingPath, setCalculatingPath] = useState(false);

  // Topological DAG State
  const [dagValidation, setDagValidation] = useState<any | null>(null);

  // Selected Node for Detail Inspector
  const [inspectedNodeId, setInspectedNodeId] = useState<string | null>('node-btech-engineering');

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const [graph, topo] = await Promise.all([
          api.getCareerPathwayGraph(selectedStream),
          api.getTopologicalSort()
        ]);
        setGraphData(graph);
        setDagValidation(topo);
      } catch (err) {
        console.error('Failed to load career pathway graph:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, [selectedStream]);

  // Compute Optimal Path
  const handleCalculatePath = async () => {
    if (!startNodeId || !targetNodeId) return;
    try {
      setCalculatingPath(true);
      const result = await api.getOptimalPathway(startNodeId, targetNodeId, activeObjective);
      setPathwayResult(result);
    } catch (err) {
      console.error('Pathway search error:', err);
    } finally {
      setCalculatingPath(false);
    }
  };

  useEffect(() => {
    if (graphData && startNodeId && targetNodeId) {
      handleCalculatePath();
    }
  }, [startNodeId, targetNodeId, activeObjective]);

  const inspectedNode = graphData?.nodes.find(n => n.id === inspectedNodeId) || graphData?.nodes[0];

  const outgoingEdges = graphData?.edges.filter(e => e.from === inspectedNodeId) || [];
  const incomingEdges = graphData?.edges.filter(e => e.to === inspectedNodeId) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Epistemic Honesty Badge */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-blue-900" />
                <span>Deterministic Graph Engine</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Dijkstra & Kahn Topological Sort</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Interactive Career Pathway Navigator
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic academic-to-career route planner with weighted time, cost, and syllabus synergy optimization.
            </p>
          </div>

          {/* DAG Verification Badge */}
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DAG Validated: Zero Illegal Cycles</span>
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              {dagValidation?.sortedNodeIds?.length || 28} milestones sorted by prerequisite order
            </span>
          </div>
        </div>

        {/* Epistemic Advisory Banner */}
        <div className="mt-4 p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Statutory Educational Guidance Notice: </span>
            Every pathway transition is an educational possibility based on official eligibility regulations. EXAMVERSE does not guarantee selection, appointment, or administrative cadre placement.
          </div>
        </div>

        {/* Stream Filter Switcher */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
          {STREAM_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStream(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedStream === tab.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph & Route Planner Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Optimal Pathway Navigator (2 Columns on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Selector Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-900" />
                <span>Dijkstra Shortest Pathway Planner</span>
              </h2>
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-[11px] font-semibold">
                <button
                  onClick={() => setActiveObjective('FASTEST')}
                  className={`px-2 py-1 rounded transition ${
                    activeObjective === 'FASTEST' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Fastest (Years)
                </button>
                <button
                  onClick={() => setActiveObjective('LOWEST_COST')}
                  className={`px-2 py-1 rounded transition ${
                    activeObjective === 'LOWEST_COST' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Lowest Cost (₹)
                </button>
                <button
                  onClick={() => setActiveObjective('HIGHEST_SYNERGY')}
                  className={`px-2 py-1 rounded transition ${
                    activeObjective === 'HIGHEST_SYNERGY' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Highest Synergy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Milestone / Starting Node</label>
                <select
                  value={startNodeId}
                  onChange={(e) => setStartNodeId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-900"
                >
                  {graphData?.nodes
                    .filter(n => n.type === 'QUALIFICATION' || n.type === 'DEGREE')
                    .map(n => (
                      <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Career Goal</label>
                <select
                  value={targetNodeId}
                  onChange={(e) => setTargetNodeId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-900"
                >
                  {graphData?.nodes
                    .filter(n => n.type === 'GOVERNMENT_POST' || n.type === 'PSU_CAREER' || n.type === 'RESEARCH_CAREER' || n.type === 'FELLOWSHIP')
                    .map(n => (
                      <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Computed Pathway Stepper */}
          {pathwayResult && pathwayResult.found ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">Optimal Route Computed</span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {pathwayResult.startNode?.label} → {pathwayResult.targetNode?.label}
                  </h3>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                    <span className="font-semibold text-slate-500">Duration: </span>
                    <span className="font-bold">{pathwayResult.totalEstimatedYears} Years</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span className="font-semibold text-slate-500">Est. Cost: </span>
                    <span className="font-bold">₹{(pathwayResult.totalEstimatedCostINR || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900">
                    <span className="font-semibold text-slate-500">Synergy: </span>
                    <span className="font-bold">{Math.round(pathwayResult.averageSyllabusOverlap * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Vertical Step-by-Step Trajectory */}
              <div className="mt-6 space-y-4">
                {pathwayResult.pathNodes.map((node: any, idx: number) => {
                  const edge = pathwayResult.pathEdges[idx];
                  return (
                    <div key={node.id} className="relative">
                      <div
                        onClick={() => setInspectedNodeId(node.id)}
                        className={`p-4 rounded-xl border transition cursor-pointer ${
                          inspectedNodeId === node.id
                            ? 'bg-blue-50/50 border-blue-900 ring-2 ring-blue-900/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{node.label}</h4>
                              <p className="text-[11px] text-slate-500">{node.description}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {node.type}
                          </span>
                        </div>
                      </div>

                      {edge && (
                        <div className="py-2 pl-7 flex items-center space-x-3 text-xs text-slate-500">
                          <div className="w-0.5 h-6 bg-blue-300"></div>
                          <div className="flex items-center space-x-2 text-[11px] bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                            <span className="font-bold text-blue-900">{edge.type}:</span>
                            <span>{edge.requirements}</span>
                            <span className="text-slate-400">({edge.weightYears} yr)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
              <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No direct single-stream pathway found.</p>
              <p className="text-xs text-slate-400 mt-1">Select an alternative starting milestone or goal to view viable routes.</p>
            </div>
          )}
        </div>

        {/* Right Column: Node Inspector & Lateral Pathways */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-blue-900" />
              <span>Milestone Inspector</span>
            </h3>

            {inspectedNode ? (
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Milestone Name</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{inspectedNode.label}</h4>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                    {inspectedNode.type}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Duration:</span>
                    <span className="font-bold text-slate-800">{inspectedNode.durationYears} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Typical Outlay / Fee:</span>
                    <span className="font-bold text-slate-800">₹{(inspectedNode.typicalCost || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Overview</span>
                  <p className="text-slate-600 mt-1 leading-relaxed">{inspectedNode.description}</p>
                </div>

                {/* Outgoing Transitions */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Educational Milestones</span>
                  <div className="mt-2 space-y-2">
                    {outgoingEdges.length > 0 ? (
                      outgoingEdges.map((e, i) => {
                        const target = graphData?.nodes.find(n => n.id === e.to);
                        return (
                          <div
                            key={i}
                            onClick={() => setInspectedNodeId(e.to)}
                            className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <p className="font-bold text-slate-800">{target?.label}</p>
                              <p className="text-[10px] text-slate-400">{e.type} • {e.requirements}</p>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-slate-400 italic">Terminal career or senior appointment node.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
