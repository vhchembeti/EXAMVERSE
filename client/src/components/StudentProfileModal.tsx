// client/src/components/StudentProfileModal.tsx
// Comprehensive Student Profile Editor & Onboarding Form

import React, { useState } from 'react';
import { X, User, Check, Shield, AlertCircle } from 'lucide-react';
import { StudentProfile, SupportedLanguage } from '../types';
import { api } from '../services/api';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onProfileUpdated: (updated: StudentProfile) => void;
  allStates: { code: string; name: string; type: string }[];
  onOpenAuth?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
  allStates,
  onOpenAuth,
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleInterestToggle = (interest: string) => {
    const current = formData.careerInterests || [];
    if (current.includes(interest)) {
      setFormData({ ...formData, careerInterests: current.filter((i) => i !== interest) });
    } else {
      setFormData({ ...formData, careerInterests: [...current, interest] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      const res = await api.updateProfile(formData);
      onProfileUpdated(res.profile);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const careerOptions = [
    'Government Recruitment',
    'Civil Services (IAS/IPS/State PSC)',
    'Engineering & PSU',
    'Medical & Healthcare',
    'Higher Studies & Research',
    'Management (MBA)',
    'Banking & Financial Services',
    'Law & Judiciary',
    'Teaching & Education',
    'Defence & Paramilitary',
    'Forensic Sciences & Criminology'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Student Profile & Eligibility Parameters</h2>
              <p className="text-xs text-slate-300">
                Accurate educational details power the intelligent examination discovery engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Profile successfully updated! Eligibility rules recalculated.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-700">
          {/* Personal Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-200">
              1. Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  disabled
                  value={formData.email}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => {
                    const dob = e.target.value;
                    const birthYear = new Date(dob).getFullYear();
                    const age = new Date().getFullYear() - birthYear;
                    setFormData({ ...formData, dateOfBirth: dob, age });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Gender</label>
                <select
                  value={formData.gender || 'Male'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Reservation Category</label>
                <select
                  value={formData.category || 'General'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                >
                  <option value="General">General / Unreserved (UR)</option>
                  <option value="OBC">Other Backward Classes (OBC-NCL)</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="EWS">Economically Weaker Section (EWS)</option>
                  <option value="PwD">Persons with Benchmark Disabilities (PwD)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Preferred Language</label>
                <select
                  value={formData.preferredLanguage || 'English'}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as SupportedLanguage })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white font-medium"
                >
                  <option value="English">English</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Domicile and Geography */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-200">
              2. Domicile & Region
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Home State / Union Territory</label>
                <select
                  value={formData.state}
                  onChange={(e) => {
                    const selected = allStates.find((s) => s.code === e.target.value);
                    setFormData({
                      ...formData,
                      state: e.target.value,
                      stateName: selected ? selected.name : '',
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                >
                  {allStates.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">District (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. NTR District / Hyderabad / Chennai"
                  value={formData.district || ''}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Educational Qualifications */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-200">
              3. Educational Qualifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Highest Qualification</label>
                <select
                  value={formData.educationalQualification}
                  onChange={(e) => setFormData({ ...formData, educationalQualification: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                >
                  <option value="10th">10th / Secondary</option>
                  <option value="12th / Intermediate">12th / Intermediate (10+2)</option>
                  <option value="Diploma">Diploma (Polytechnic / Technical)</option>
                  <option value="Graduate">Graduate (Bachelor's Degree)</option>
                  <option value="Post Graduate">Post Graduate (Master's Degree)</option>
                  <option value="Ph.D">Ph.D / Doctorate</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Degree Title</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech, B.Sc, B.Com, MBBS, LLB"
                  value={formData.degree || ''}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Specialization / Stream</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Forensic Science, Mech"
                  value={formData.specialization || ''}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Graduation Status</label>
                <select
                  value={formData.graduationStatus || 'Completed'}
                  onChange={(e) => setFormData({ ...formData, graduationStatus: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                >
                  <option value="Completed">Graduated / Degree Completed</option>
                  <option value="Final Year">Final Year / Appearing in 2026</option>
                  <option value="Pursuing">Pursuing (1st / 2nd / 3rd Year)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Aggregate Percentage / CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="100"
                  placeholder="e.g. 78.5"
                  value={formData.percentage || ''}
                  onChange={(e) => setFormData({ ...formData, percentage: parseFloat(e.target.value) || undefined })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Preparation Level</label>
                <select
                  value={formData.preparationLevel || 'Intermediate'}
                  onChange={(e) => setFormData({ ...formData, preparationLevel: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
                >
                  <option value="Beginner">Beginner (Starting from basics)</option>
                  <option value="Intermediate">Intermediate (Covering syllabus)</option>
                  <option value="Advanced">Advanced (Revision & Mock tests)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Career Interests */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 pb-1 border-b border-slate-200">
              4. Career Interests & Aspirations
            </h3>
            <p className="text-[11px] text-slate-400 mb-2">Select the sectors you want the discovery engine to highlight:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {careerOptions.map((opt) => {
                const selected = (formData.careerInterests || []).includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => handleInterestToggle(opt)}
                    className={`text-left p-2 rounded-lg border text-xs transition flex items-center justify-between ${
                      selected
                        ? 'border-blue-900 bg-blue-50 text-blue-950 font-medium'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                    }`}
                  >
                    <span>{opt}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-blue-900 flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 text-[11px] flex items-center space-x-2">
            <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>Your personal data is encrypted and strictly used to verify examination eligibility. Never shared.</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <div>
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="text-xs text-rose-700 hover:text-rose-800 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition"
                >
                  Log Out / Switch Account
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 font-medium text-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save & Recalculate Eligibility'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
