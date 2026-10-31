// client/src/views/SalaryAndBondExplorerView.tsx
// Authoritative Government & PSU Salary, Allowance, and Service Bond Explorer
// Accurately computes in-hand pay across 7th CPC Levels 1-14 & PSU IDA Scales E1-E3

import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  Building2,
  ShieldCheck,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export const SalaryAndBondExplorerView: React.FC = () => {
  const [cadreMode, setCadreMode] = useState<'CENTRAL_7TH_CPC' | 'PSU_IDA'>('CENTRAL_7TH_CPC');

  // 7th CPC Calculation State
  const [payLevel, setPayLevel] = useState<number>(10);
  const [cityClass, setCityClass] = useState<'X' | 'Y' | 'Z'>('X');
  const [daPercent, setDaPercent] = useState<number>(50);
  const [customBasic, setCustomBasic] = useState<number | undefined>(undefined);
  const [cpcResult, setCpcResult] = useState<any | null>(null);

  // PSU IDA Calculation State
  const [psuGrade, setPsuGrade] = useState<'E1' | 'E2' | 'E3'>('E2');
  const [psuResult, setPsuResult] = useState<any | null>(null);

  // Service Bonds State
  const [serviceBonds, setServiceBonds] = useState<any[]>([]);
  const [bondSearch, setBondSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Load Initial Calculations & Bonds
  useEffect(() => {
    const fetchBonds = async () => {
      try {
        const data = await api.getServiceBonds();
        setServiceBonds(data?.bonds || []);
      } catch (err) {
        console.error('Failed to load service bonds:', err);
      }
    };
    fetchBonds();
  }, []);

  // Compute 7th CPC
  useEffect(() => {
    const computeCpc = async () => {
      try {
        setLoading(true);
        const result = await api.calculate7thCpcSalary({
          level: payLevel,
          cityClass,
          daPercent,
          customBasic
        });
        setCpcResult(result);
      } catch (err) {
        console.error('7th CPC compute error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (cadreMode === 'CENTRAL_7TH_CPC') {
      computeCpc();
    }
  }, [payLevel, cityClass, daPercent, customBasic, cadreMode]);

  // Compute PSU IDA
  useEffect(() => {
    const computePsu = async () => {
      try {
        setLoading(true);
        const result = await api.calculatePsuIdaSalary({
          grade: psuGrade,
          cityClass,
          idaPercent: 43.8
        });
        setPsuResult(result);
      } catch (err) {
        console.error('PSU IDA compute error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (cadreMode === 'PSU_IDA') {
      computePsu();
    }
  }, [psuGrade, cityClass, cadreMode]);

  const filteredBonds = serviceBonds.filter(b =>
    !bondSearch ||
    b.organization.toLowerCase().includes(bondSearch.toLowerCase()) ||
    b.cadre.toLowerCase().includes(bondSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center space-x-1">
                <IndianRupee className="w-3.5 h-3.5 text-blue-900" />
                <span>Statutory Pay Matrix Engine</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">7th CPC Levels 1–14 & PSU IDA Scales</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Government & PSU Salary, Allowance & Bond Explorer
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic monthly in-hand take-home calculator, HRA city classifications, and official service bond commitments.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setCadreMode('CENTRAL_7TH_CPC')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                cadreMode === 'CENTRAL_7TH_CPC'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7th Central Pay Matrix (Levels 1–14)
            </button>
            <button
              onClick={() => setCadreMode('PSU_IDA')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                cadreMode === 'PSU_IDA'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PSU Industrial Scales (E1–E3)
            </button>
          </div>
        </div>
      </div>

      {/* Main Calculator & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Parameters (1 Column) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-900" />
              <span>Calculation Parameters</span>
            </h2>

            {cadreMode === 'CENTRAL_7TH_CPC' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  7th CPC Pay Matrix Level
                </label>
                <select
                  value={payLevel}
                  onChange={(e) => setPayLevel(parseInt(e.target.value, 10))}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-blue-900"
                >
                  <option value={10}>Level 10 (₹56,100) — IAS, IPS, IES, Scientist B</option>
                  <option value={11}>Level 11 (₹67,700) — Senior Scientist, Exec Engineer</option>
                  <option value={12}>Level 12 (₹78,800) — Superintending Engineer</option>
                  <option value={8}>Level 8 (₹47,600) — Assistant Audit Officer (CAG)</option>
                  <option value={7}>Level 7 (₹44,900) — Income Tax Inspector, ASO</option>
                  <option value={6}>Level 6 (₹35,400) — Junior Engineer (SSC/RRB), SI</option>
                  <option value={5}>Level 5 (₹29,200) — Senior Clerk, Auditor</option>
                  <option value={4}>Level 4 (₹25,500) — Postal Assistant, DEO</option>
                  <option value={2}>Level 2 (₹19,900) — Constable, Junior Clerk</option>
                  <option value={1}>Level 1 (₹18,000) — Multi-Tasking Staff (MTS)</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  PSU Industrial Grade
                </label>
                <select
                  value={psuGrade}
                  onChange={(e) => setPsuGrade(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-blue-900"
                >
                  <option value="E1">Grade E1 (₹40,000 - ₹1,40,000) — Trainee / Assistant Engineer</option>
                  <option value="E2">Grade E2 (₹50,000 - ₹1,60,000) — Engineer / Scientist SC</option>
                  <option value="E3">Grade E3 (₹60,000 - ₹1,80,000) — Senior Engineer / Deputy Manager</option>
                </select>
              </div>
            )}

            {/* City Tier Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Posting City Classification (HRA Tier)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { tier: 'X', label: 'Class X (30%)', desc: 'Metros' },
                  { tier: 'Y', label: 'Class Y (20%)', desc: 'Tier 2' },
                  { tier: 'Z', label: 'Class Z (10%)', desc: 'Rural' }
                ].map((c) => (
                  <button
                    key={c.tier}
                    onClick={() => setCityClass(c.tier as any)}
                    className={`p-2 rounded-lg text-center border transition ${
                      cityClass === c.tier
                        ? 'bg-blue-50 border-blue-900 text-blue-900 font-bold ring-1 ring-blue-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{c.tier}</div>
                    <div className="text-[10px] text-slate-400">{c.desc}</div>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Class X: Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad, Ahmedabad, Pune.
              </p>
            </div>

            {/* DA Rate */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Dearness Allowance (DA)</label>
                <span className="text-xs font-bold text-blue-900">{daPercent}%</span>
              </div>
              <input
                type="range"
                min={46}
                max={55}
                value={daPercent}
                onChange={(e) => setDaPercent(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
              />
              <span className="text-[10px] text-slate-400">Current Central DA rate is 50% (effective from Jan 2024).</span>
            </div>
          </div>
        </div>

        {/* Right Column: In-Hand Salary Breakdown (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {cadreMode === 'CENTRAL_7TH_CPC' && cpcResult ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                    {cpcResult.classification}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Pay Level {cpcResult.payLevel} — {cpcResult.cityClassification.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cpcResult.designationExamples}</p>
                </div>

                {/* Net In-Hand Highlight */}
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500">Estimated Net In-Hand Monthly</span>
                  <div className="text-2xl font-black text-emerald-600">
                    ₹{cpcResult.netMonthlyInHand.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400">Gross: ₹{cpcResult.earnings.grossMonthly.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Detailed Earnings vs Deductions Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Earnings Column */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Monthly Emoluments (Gross Earnings)</span>
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Basic Pay:</span>
                      <span className="font-bold text-slate-900">₹{cpcResult.earnings.basicPay.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dearness Allowance ({cpcResult.rates.daPercent}%):</span>
                      <span className="font-bold text-slate-900">₹{cpcResult.earnings.dearnessAllowance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">House Rent Allowance ({cpcResult.rates.hraPercent}%):</span>
                      <span className="font-bold text-slate-900">₹{cpcResult.earnings.houseRentAllowance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Transport Allowance (TA + DA):</span>
                      <span className="font-bold text-slate-900">₹{cpcResult.earnings.transportAllowance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-slate-900">
                      <span>Total Gross Pay:</span>
                      <span className="text-blue-900">₹{cpcResult.earnings.grossMonthly.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions Column */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
                    <span>Mandatory Statutory Deductions</span>
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">NPS Tier-I Employee (10% Basic+DA):</span>
                      <span className="font-bold text-slate-900">₹{cpcResult.deductions.npsEmployeeTier1.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">CGEGIS Group Insurance:</span>
                      <span className="font-bold text-slate-900">₹{cpcResult.deductions.cgegisInsurance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">CGHS Medical Contribution:</span>
                      <span className="font-bold text-slate-900">₹{cpcResult.deductions.cghsHealthScheme.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-red-600">
                      <span>Total Deductions:</span>
                      <span>-₹{cpcResult.deductions.totalDeductions.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employer Contribution & Annual CTC */}
              <div className="mt-6 p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-blue-900">Government NPS Co-Contribution (14%): </span>
                  <span className="text-slate-700">₹{cpcResult.employerBenefits.npsGovernmentCoContribution14Pct.toLocaleString('en-IN')}/month</span>
                </div>
                <div>
                  <span className="font-bold text-blue-900">Annual Equivalent CTC: </span>
                  <span className="font-extrabold text-blue-900">₹{cpcResult.employerBenefits.annualCtcEquivalent.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ) : (
            psuResult && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">PSU Industrial Grade</span>
                    <h3 className="text-lg font-extrabold text-slate-900">{psuResult.designation} ({psuResult.grade})</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Scale: {psuResult.scaleRange} • {psuResult.sampleOrganizations.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500">Estimated Net In-Hand Monthly</span>
                    <div className="text-2xl font-black text-emerald-600">
                      ₹{psuResult.netMonthlyInHand.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-slate-400">Typical Annual CTC: {psuResult.annualPerksAndPrp.typicalAnnualCtc}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex justify-between"><span>Starting Basic:</span><b>₹{psuResult.earnings.basicPay.toLocaleString('en-IN')}</b></div>
                    <div className="flex justify-between"><span>Industrial DA (43.8%):</span><b>₹{psuResult.earnings.industrialDearnessAllowance.toLocaleString('en-IN')}</b></div>
                    <div className="flex justify-between"><span>Cafeteria Perks (35%):</span><b>₹{psuResult.earnings.cafeteriaPerks35Pct.toLocaleString('en-IN')}</b></div>
                    <div className="flex justify-between"><span>HRA:</span><b>₹{psuResult.earnings.houseRentAllowance.toLocaleString('en-IN')}</b></div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex justify-between"><span>EPF Employee (12%):</span><b>₹{psuResult.deductions.epfEmployee12Pct.toLocaleString('en-IN')}</b></div>
                    <div className="flex justify-between"><span>Est. Annual PRP (Bonus):</span><b className="text-emerald-700">₹{psuResult.annualPerksAndPrp.estimatedPerformanceRelatedPayAnnual.toLocaleString('en-IN')}</b></div>
                    <div className="flex justify-between"><span>Medical & Post-Retirement:</span><b>100% Comprehensive Company Covered</b></div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Official Service Bonds & Probation Conditions Registry */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-900" />
              <span>Official Service Bonds, Lock-In Periods & Medical Standards</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified legal training bonds and minimum service commitments from official recruitment notices.
            </p>
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by PSU or Exam..."
              value={bondSearch}
              onChange={(e) => setBondSearch(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800 focus:ring-2 focus:ring-blue-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Organization & Cadre</th>
                <th className="p-3">Bond Amount</th>
                <th className="p-3">Lock-In Tenure</th>
                <th className="p-3">Probation</th>
                <th className="p-3">Medical Standards</th>
                <th className="p-3">Official Notice Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBonds.map((bond) => (
                <tr key={bond.id} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{bond.organization}</p>
                    <p className="text-[11px] text-slate-500">{bond.cadre}</p>
                  </td>
                  <td className="p-3 font-extrabold text-blue-900">
                    {bond.bondAmountINR > 0 ? `₹${bond.bondAmountINR.toLocaleString('en-IN')}` : 'No Exit Bond'}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      bond.bondPeriodYears > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {bond.bondPeriodYears > 0 ? `${bond.bondPeriodYears} Years` : 'None'}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{bond.probationTenureYears} Year(s)</td>
                  <td className="p-3 text-[11px] text-slate-600 max-w-xs">{bond.medicalStandard}</td>
                  <td className="p-3 text-[10px] text-slate-400 font-mono max-w-xs">{bond.sourcePdfNotice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
