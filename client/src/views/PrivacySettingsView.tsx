// client/src/views/PrivacySettingsView.tsx
// Digital Personal Data Protection (DPDP) Act 2023 Privacy & Consent Governance View
// Provides Granular Consent Controls, 1-Click Data Portability, Erasure, and Grievance Redressal

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Shield, Download, Trash2, UserCheck, AlertTriangle, CheckCircle2, Lock, Scale, Mail, MapPin } from 'lucide-react';

export const PrivacySettingsView: React.FC = () => {
  const [consentState, setConsentState] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [erasureInput, setErasureInput] = useState<string>('');
  const [erasureModalOpen, setErasureModalOpen] = useState<boolean>(false);
  const [erasureLoading, setErasureLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Parental Consent State
  const [guardianName, setGuardianName] = useState<string>('');
  const [guardianEmail, setGuardianEmail] = useState<string>('');
  const [guardianPhone, setGuardianPhone] = useState<string>('');
  const [candidateAge, setCandidateAge] = useState<number>(17);
  const [parentalVerified, setParentalVerified] = useState<boolean>(false);

  useEffect(() => {
    fetchConsentData();
  }, []);

  const fetchConsentData = async () => {
    try {
      setLoading(true);
      const res = await api.getPrivacyConsent();
      setConsentState(res);
    } catch (err) {
      console.error('Failed to load consent data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleConsent = async (purposeCode: string, currentValue: boolean) => {
    try {
      await api.updatePrivacyConsent(purposeCode, !currentValue);
      setConsentState((prev: any) => ({
        ...prev,
        activeConsent: {
          ...prev.activeConsent,
          [purposeCode]: !currentValue
        }
      }));
      showToast(`Updated consent for ${purposeCode}: ${!currentValue ? 'Granted' : 'Withdrawn'}`);
    } catch (err: any) {
      alert(`Error updating consent: ${err.message}`);
    }
  };

  const handleExportData = async () => {
    try {
      setExportLoading(true);
      const data = await api.exportPersonalData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `examverse_personal_data_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('1-Click Personal Data Export downloaded successfully!');
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  const handleParentalConsentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.recordParentalConsent({
        guardianName,
        guardianRelation: 'Parent / Legal Guardian',
        guardianEmail,
        guardianPhone,
        candidateAge
      });
      setParentalVerified(true);
      showToast('Parental consent recorded under Section 9 of DPDP Act 2023!');
    } catch (err: any) {
      alert(`Parental consent error: ${err.message}`);
    }
  };

  const handleErasureConfirm = async () => {
    if (erasureInput !== 'PERMANENTLY_DELETE_MY_EXAMVERSE_DATA') {
      alert("Phrase mismatch. Please enter 'PERMANENTLY_DELETE_MY_EXAMVERSE_DATA'.");
      return;
    }

    try {
      setErasureLoading(true);
      const res = await api.requestDataErasure(erasureInput);
      alert(res.message);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch (err: any) {
      alert(`Erasure failed: ${err.message}`);
    } finally {
      setErasureLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2.5 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>DPDP Act 2023 Compliance & Data Governance</span>
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Ministry of Electronics & IT (MeitY) Aligned
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Controls, Consent Ledger & Data Rights
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
          Exercise statutory rights under the Digital Personal Data Protection Act, 2023. Manage purpose-limited processing consent, export your complete academic record, or initiate cryptographic data erasure.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading statutory privacy ledger...</div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Granular Purpose-Limited Consent Ledger */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-900 dark:text-blue-400" />
                  <span>Granular Processing Consent Ledger</span>
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  Section 6(1) Notice
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You maintain complete control. Toggle individual processing purposes on or off at any time.
              </p>
            </div>

            <div className="space-y-3">
              {consentState?.purposesCatalog && Object.entries(consentState.purposesCatalog).map(([code, p]: [string, any]) => {
                const isGranted = consentState.activeConsent?.[code] || false;
                const isMandatory = p.isMandatory;

                return (
                  <div
                    key={code}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/30"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">{p.title}</span>
                        {isMandatory ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            Essential Service
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            Optional Consent
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                        {p.description}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Statutory Basis: {p.statutoryBasis}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        disabled={isMandatory}
                        onClick={() => handleToggleConsent(code, isGranted)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          isMandatory
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'
                            : isGranted
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {isMandatory ? 'Required' : isGranted ? '✓ Consent Active' : 'Opted Out'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: 1-Click Personal Data Portability */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Right to Data Portability (1-Click Complete Export)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Download a machine-readable JSON bundle containing your profile data, bookmarked examinations, preparation schedules, CBT telemetry, and encrypted notebook ciphertext.
                </p>
              </div>

              <button
                onClick={handleExportData}
                disabled={exportLoading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{exportLoading ? 'Compiling Archive...' : 'Download My Data (JSON)'}</span>
              </button>
            </div>
          </div>

          {/* Section 3: Minor Protection & Parental Consent (<18) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Section 9 DPDP Act: Minor (Under 18 Years) Guardian Affirmation</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                If the student is under 18 years of age (e.g. 10th or 12th standard candidates), parental/guardian authorization is statutorily mandated.
              </p>
            </div>

            {parentalVerified ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs text-emerald-800 dark:text-emerald-200">
                  <span className="font-bold">Parental Consent Active:</span> Registered and verified under statutory DPDP minor compliance standards.
                </div>
              </div>
            ) : (
              <form onSubmit={handleParentalConsentSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Guardian Full Name</label>
                  <input
                    type="text"
                    required
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Baswa"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Guardian Email</label>
                  <input
                    type="email"
                    required
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    placeholder="e.g. parent@examverse.in"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Guardian Mobile Phone</label>
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Candidate Age</label>
                  <input
                    type="number"
                    min="14"
                    max="17"
                    value={candidateAge}
                    onChange={(e) => setCandidateAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition"
                  >
                    Submit Statutory Guardian Consent
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Section 4: Cryptographic Right to be Forgotten */}
          <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-6 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-bold text-rose-900 dark:text-rose-200">
                  Right to Erasure & Account Destruction ("Right to be Forgotten")
                </h2>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 max-w-2xl leading-relaxed">
                  Under Section 12(3) of the DPDP Act 2023, you can permanently erase all personal identifiable information (PII), diagnostic scores, and encryption keys from the system. This operation is cryptographically irreversible.
                </p>
              </div>
            </div>

            <div>
              <button
                onClick={() => setErasureModalOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Initiate Irreversible Data Erasure</span>
              </button>
            </div>
          </div>

          {/* Erasure Confirmation Modal */}
          {erasureModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl border border-rose-300 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Confirm Permanent Cryptographic Erasure</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  This action will destroy your profile, mock test analytics, and envelope encryption keys. To confirm, type:
                </p>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[11px] text-center text-rose-700 dark:text-rose-400 font-bold select-all">
                  PERMANENTLY_DELETE_MY_EXAMVERSE_DATA
                </div>
                <input
                  type="text"
                  value={erasureInput}
                  onChange={(e) => setErasureInput(e.target.value)}
                  placeholder="Type the confirmation phrase"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => { setErasureModalOpen(false); setErasureInput(''); }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={erasureInput !== 'PERMANENTLY_DELETE_MY_EXAMVERSE_DATA' || erasureLoading}
                    onClick={handleErasureConfirm}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold transition"
                  >
                    {erasureLoading ? 'Purging DEKs...' : 'Destroy My Data'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Statutory Grievance Redressal Officer */}
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
            <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-900 dark:text-blue-400" />
              <span>Statutory Data Protection & Grievance Redressal Officer</span>
            </h2>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">
                {consentState?.grievanceOfficer?.name} ({consentState?.grievanceOfficer?.designation})
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{consentState?.grievanceOfficer?.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{consentState?.grievanceOfficer?.address}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Statutory Redressal Period: {consentState?.grievanceOfficer?.redressalTimeframe}. Escalation authority: {consentState?.grievanceOfficer?.complianceJurisdiction}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySettingsView;
