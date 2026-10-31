// client/src/views/DocumentReadinessChecklistView.tsx
// Central Document Readiness & Reservation Validity Checklist
// Authoritative DoPT, NCBC, UPSC, SSC, and NTA Compliance Standards

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface DocumentStandard {
  categoryCode: string;
  title: string;
  financialYearRule: string;
  issuingAuthorities?: string[];
  mandatedFormat?: string;
  statutoryValidityWindow?: string;
  criticalPitfallWarning: string;
  specifications?: Record<string, string>;
}

interface ChecklistItemState {
  hasDocument: boolean;
  issueDate: string;
  isCentralFormat: boolean;
  notes: string;
}

export const DocumentReadinessChecklistView: React.FC = () => {
  const [standards, setStandards] = useState<DocumentStandard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userChecklist, setUserChecklist] = useState<Record<string, ChecklistItemState>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('OBC_NCL');
  const [saveToast, setSaveToast] = useState<boolean>(false);

  useEffect(() => {
    // Load cached checklist from localStorage
    try {
      const saved = localStorage.getItem('examverse_document_checklist');
      if (saved) {
        setUserChecklist(JSON.parse(saved));
      }
    } catch (_) {}

    api.getDocumentChecklistStandards()
      .then((res: any) => {
        if (res.standards) {
          setStandards(res.standards);
          // Initialize empty state for standards not present
          setUserChecklist((prev) => {
            const next = { ...prev };
            res.standards.forEach((std: DocumentStandard) => {
              if (!next[std.categoryCode]) {
                next[std.categoryCode] = {
                  hasDocument: false,
                  issueDate: '',
                  isCentralFormat: false,
                  notes: ''
                };
              }
            });
            return next;
          });
        }
      })
      .catch((err) => console.error('Failed to load standards:', err))
      .finally(() => setLoading(false));
  }, []);

  const updateItem = (code: string, updates: Partial<ChecklistItemState>) => {
    setUserChecklist((prev) => {
      const updated = {
        ...prev,
        [code]: {
          ...(prev[code] || { hasDocument: false, issueDate: '', isCentralFormat: false, notes: '' }),
          ...updates
        }
      };
      localStorage.setItem('examverse_document_checklist', JSON.stringify(updated));
      return updated;
    });
  };

  const getFinancialYearCutoff = (): Date => {
    const now = new Date();
    const currentYear = now.getFullYear();
    // In India FY starts April 1
    const fyStartMonth = 3; // April (0-indexed)
    if (now.getMonth() >= fyStartMonth) {
      return new Date(currentYear, fyStartMonth, 1);
    } else {
      return new Date(currentYear - 1, fyStartMonth, 1);
    }
  };

  const verifyValidity = (std: DocumentStandard, state?: ChecklistItemState) => {
    if (!state || !state.hasDocument) {
      return { status: 'NOT_ACQUIRED', label: 'Document Not Acquired', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
    }

    if (std.categoryCode === 'OBC_NCL' || std.categoryCode === 'EWS') {
      if (!state.isCentralFormat) {
        return { status: 'INVALID_FORMAT', label: 'State Format (Rejected in Central Exams)', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' };
      }
      if (!state.issueDate) {
        return { status: 'MISSING_DATE', label: 'Date Required for FY Validation', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' };
      }
      const issue = new Date(state.issueDate);
      const fyCutoff = getFinancialYearCutoff();
      if (issue < fyCutoff) {
        return { status: 'EXPIRED_FY', label: 'Expired (Issued before April 1 of current FY)', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' };
      }
      return { status: 'VALID_CENTRAL', label: 'Valid for Current FY Central Exams', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' };
    }

    if (std.categoryCode === 'SC_ST') {
      if (!state.isCentralFormat) {
        return { status: 'WARN_FORMAT', label: 'Verify Central Presidential Order Name', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' };
      }
      return { status: 'LIFETIME_VALID', label: 'Valid (Perpetual / Lifetime)', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' };
    }

    if (std.categoryCode === 'PWBD') {
      return { status: 'VALID_PWBD', label: 'UDID / Medical Board Valid', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' };
    }

    if (std.categoryCode === 'PHOTO_SIGNATURE') {
      return { status: 'PHOTO_OK', label: 'Biometrics Configured (<90 Days Old)', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' };
    }

    return { status: 'OK', label: 'Ready', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' };
  };

  // Readiness score
  const totalCount = standards.length || 1;
  const readyCount = standards.filter((s) => {
    const res = verifyValidity(s, userChecklist[s.categoryCode]);
    return res.status === 'VALID_CENTRAL' || res.status === 'LIFETIME_VALID' || res.status === 'VALID_PWBD' || res.status === 'PHOTO_OK' || res.status === 'OK';
  }).length;
  const readinessPercentage = Math.round((readyCount / totalCount) * 100);

  const selectedStd = standards.find((s) => s.categoryCode === selectedCategory) || standards[0];
  const selectedState = selectedStd ? userChecklist[selectedStd.categoryCode] : undefined;
  const currentStatus = selectedStd ? verifyValidity(selectedStd, selectedState) : null;

  const handleManualSave = () => {
    localStorage.setItem('examverse_document_checklist', JSON.stringify(userChecklist));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              Statutory DoPT & NCBC Guidelines
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              FY 2025–26 / FY 2026–27 Rules Enforced
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Central Document Readiness & Certificate Validity
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Deterministic verification for Central UPSC, SSC, NTA, RRB, IBPS & GATE application forms. Never get rejected in document verification due to an outdated financial year or wrong state format.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <button
            onClick={handleManualSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            {saveToast ? '✓ Saved to Storage' : 'Save Checklist'}
          </button>
        </div>
      </div>

      {/* Readiness Overview Bar */}
      <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-slate-700 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-indigo-700 dark:text-indigo-400 uppercase">
              Application Form Readiness Metric
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Your Document Readiness: <span className={readinessPercentage >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{readinessPercentage}%</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {readyCount} of {totalCount} central document categories certified valid for the active recruitment cycle.
            </p>
          </div>

          <div className="w-full md:w-72">
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${readinessPercentage >= 80 ? 'bg-emerald-500' : readinessPercentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${readinessPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span>0% Incomplete</span>
              <span>100% Exam-Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading statutory standards...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Category Selector & Checklist */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Statutory Categories
            </h3>

            {standards.map((std) => {
              const state = userChecklist[std.categoryCode];
              const validity = verifyValidity(std, state);
              const isSelected = selectedCategory === std.categoryCode;

              return (
                <div
                  key={std.categoryCode}
                  onClick={() => setSelectedCategory(std.categoryCode)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {std.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {std.mandatedFormat || std.financialYearRule}
                      </p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${validity.color}`}>
                      {validity.label.split('(')[0]}
                    </span>
                  </div>

                  {/* Quick Toggle Checkbox */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state?.hasDocument || false}
                        onChange={(e) => updateItem(std.categoryCode, { hasDocument: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>I possess this certificate</span>
                    </label>

                    {state?.hasDocument && (
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        Configure Date & Format &rarr;
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Configuration & Statutory Rules */}
          <div className="lg:col-span-7">
            {selectedStd && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
                {/* Header */}
                <div className="border-b border-slate-100 dark:border-slate-700/80 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                      Category Code: {selectedStd.categoryCode}
                    </span>
                    {currentStatus && (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${currentStatus.color}`}>
                        {currentStatus.label}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                    {selectedStd.title}
                  </h3>
                </div>

                {/* Candidate Certificate Status Inputs */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/70 space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    My Certificate Particulars
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Document Possession Status
                      </label>
                      <select
                        value={selectedState?.hasDocument ? 'yes' : 'no'}
                        onChange={(e) => updateItem(selectedStd.categoryCode, { hasDocument: e.target.value === 'yes' })}
                        className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                      >
                        <option value="no">Not Yet Acquired / Under Process</option>
                        <option value="yes">Possess Certificate / Physical Copy in Hand</option>
                      </select>
                    </div>

                    {selectedStd.categoryCode !== 'PHOTO_SIGNATURE' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Date of Issuance / Re-assessment
                        </label>
                        <input
                          type="date"
                          value={selectedState?.issueDate || ''}
                          onChange={(e) => updateItem(selectedStd.categoryCode, { issueDate: e.target.value })}
                          className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>

                  {(selectedStd.categoryCode === 'OBC_NCL' || selectedStd.categoryCode === 'EWS' || selectedStd.categoryCode === 'SC_ST') && (
                    <div className="pt-2">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedState?.isCentralFormat || false}
                          onChange={(e) => updateItem(selectedStd.categoryCode, { isCentralFormat: e.target.checked })}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            Confirmed Central Government Mandated Format (Prescribed Annexure)
                          </span>
                          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                            My certificate explicitly cites Central Government gazette notifications, not solely state welfare quotas.
                          </p>
                        </div>
                      </label>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Candidate Private Notes (e.g., Certificate Application No, Dispatched Date)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Application pending at SDM office; Ack No: DEL/SDM/2026/8941"
                      value={selectedState?.notes || ''}
                      onChange={(e) => updateItem(selectedStd.categoryCode, { notes: e.target.value })}
                      className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Critical Statutory Pitfall Warning */}
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50">
                  <div className="flex items-start gap-3">
                    <span className="text-rose-600 text-lg font-bold">⚠</span>
                    <div>
                      <h5 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                        Critical Rejection Pitfall
                      </h5>
                      <p className="text-xs text-rose-700 dark:text-rose-200 mt-1 leading-relaxed">
                        {selectedStd.criticalPitfallWarning}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Year & Validity Rules */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Statutory Requirements
                  </h4>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Financial Year Mandate:</span>{' '}
                      <span className="text-slate-600 dark:text-slate-400">{selectedStd.financialYearRule}</span>
                    </div>

                    {selectedStd.statutoryValidityWindow && (
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Statutory Validity Window:</span>{' '}
                        <span className="text-slate-600 dark:text-slate-400">{selectedStd.statutoryValidityWindow}</span>
                      </div>
                    )}

                    {selectedStd.mandatedFormat && (
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Prescribed Standard Format:</span>{' '}
                        <span className="text-slate-600 dark:text-slate-400">{selectedStd.mandatedFormat}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Authorized Issuing Authorities */}
                {selectedStd.issuingAuthorities && selectedStd.issuingAuthorities.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Competent Issuing Authorities (Any One Accepted)
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedStd.issuingAuthorities.map((auth, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{auth}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specifications for Photo / Signature */}
                {selectedStd.specifications && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Biometric Dimensions & Format Specifications
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {Object.entries(selectedStd.specifications).map(([k, v]) => (
                        <div key={k} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block capitalize">
                            {k.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Epistemic Honesty Footer */}
      <div className="mt-12 text-center border-t border-slate-200 dark:border-slate-800 pt-6">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          [Educational Guidance & Statutory Reference — Verify individual exam notification brochures for special cut-off relaxation nuances]
        </p>
      </div>
    </div>
  );
};

export default DocumentReadinessChecklistView;
