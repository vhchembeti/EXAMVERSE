// client/src/views/GuidedOnboardingView.tsx
// Guided Multi-Step Student Onboarding Journey for EXAMVERSE
// Step 1: About You | Step 2: Education | Step 3: Location | Step 4: Eligibility | Step 5: Ambitions | Step 6: Review & Completion
// Clearly explains WHY each attribute is needed for statutory examination eligibility.

import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  BookOpen,
  MapPin,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Compass,
  Building,
  Award
} from 'lucide-react';
import { StudentProfile, IndianState, SupportedLanguage } from '../types';
import { api } from '../services/api';

interface GuidedOnboardingViewProps {
  onComplete: (profile: StudentProfile) => void;
  onCancel: () => void;
  allStates: IndianState[];
}

export const GuidedOnboardingView: React.FC<GuidedOnboardingViewProps> = ({
  onComplete,
  onCancel,
  allStates,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // STEP 1: ABOUT YOU
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('2002-06-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer Not to Say'>('Male');
  const [mobileNumber, setMobileNumber] = useState('');
  const [nationality, setNationality] = useState('Indian');
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>('English');
  const [password, setPassword] = useState('');

  // STEP 2: YOUR EDUCATION
  const [qualification, setQualification] = useState("Bachelor's degree");
  const [degree, setDegree] = useState('B.Tech');
  const [specialization, setSpecialization] = useState('Computer Science');
  const [university, setUniversity] = useState('');
  const [graduationStatus, setGraduationStatus] = useState<'Completed' | 'Final Year' | 'Pursuing'>('Completed');
  const [passingYear, setPassingYear] = useState('2024');
  const [percentage, setPercentage] = useState('75');

  // STEP 3: YOUR LOCATION
  const [homeState, setHomeState] = useState('AP');
  const [domicileState, setDomicileState] = useState('AP');
  const [district, setDistrict] = useState('');
  const [preferredExamCities, setPreferredExamCities] = useState('Vijayawada, Hyderabad');

  // STEP 4: ELIGIBILITY INFORMATION
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [hasCertificate, setHasCertificate] = useState(true);
  const [isPwD, setIsPwD] = useState(false);
  const [isExServiceman, setIsExServiceman] = useState(false);

  // STEP 5: YOUR AMBITIONS
  const ambitionOptions = [
    'Government Recruitment',
    'Civil Services (IAS/IPS)',
    'Banking & Finance',
    'Railway Recruitment',
    'Defence & Police',
    'Engineering & PSU (GATE)',
    'Medical & Healthcare',
    'Higher Studies & Research',
    'Management / MBA (CAT/MAT)',
    'Law & Judiciary',
    'Teaching & Education',
    'Professional Careers'
  ];
  const [selectedAmbitions, setSelectedAmbitions] = useState<string[]>([
    'Government Recruitment',
    'Engineering & PSU (GATE)',
    'Higher Studies & Research'
  ]);

  const priorityOptions = [
    'Find a job quickly.',
    'Prepare for government examinations.',
    'Pursue postgraduate studies.',
    'Prepare for competitive entrance exams.',
    'Explore research and fellowships.',
    'I am not sure yet. Help me discover my options.'
  ];
  const [currentPriority, setCurrentPriority] = useState<string>(
    'Prepare for government examinations.'
  );

  const toggleAmbition = (ambition: string) => {
    setSelectedAmbitions((prev) =>
      prev.includes(ambition) ? prev.filter((a) => a !== ambition) : [...prev, ambition]
    );
  };

  const validateStep = (currentStep: number): boolean => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return false;
      }
      if (!dob) {
        setErrorMsg('Please provide your date of birth for age cutoff calculations.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!degree.trim()) {
        setErrorMsg('Please provide your degree or course title.');
        return false;
      }
      if (!specialization.trim()) {
        setErrorMsg('Please provide your branch or subject specialization.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!homeState) {
        setErrorMsg('Please select your home state.');
        return false;
      }
    } else if (currentStep === 4) {
      if (!category) {
        setErrorMsg('Please select your reservation category.');
        return false;
      }
    } else if (currentStep === 5) {
      if (selectedAmbitions.length === 0) {
        setErrorMsg('Please select at least one career path you are exploring.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(7, prev + 1) as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(1, prev - 1) as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitProfile = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const stateObj = allStates.find((s) => s.code === homeState);
      const birthYear = new Date(dob).getFullYear();
      const age = new Date().getFullYear() - birthYear;

      const profilePayload: StudentProfile = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        dateOfBirth: dob,
        age: Math.max(18, age),
        gender,
        mobileNumber: mobileNumber.trim(),
        nationality,
        preferredLanguage,
        state: homeState,
        stateName: stateObj?.name || 'Andhra Pradesh',
        domicileState: domicileState || homeState,
        district: district.trim(),
        educationalQualification: qualification,
        degree: degree.trim(),
        specialization: specialization.trim(),
        university: university.trim(),
        graduationStatus,
        passingYear,
        percentage: parseFloat(percentage) || 70,
        category,
        isPwD,
        isExServiceman,
        preparationLevel: 'Intermediate',
        careerInterests: selectedAmbitions,
      };

      const res = await api.register({
        ...profilePayload,
        password: password || 'student123'
      });

      const finalProfile = res.profile || profilePayload;
      localStorage.setItem('examverse_user_email', finalProfile.email);
      localStorage.setItem('examverse_remembered_name', finalProfile.fullName);

      // Move to Step 7 (Completion Screen)
      setStep(7);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchDashboard = () => {
    const stateObj = allStates.find((s) => s.code === homeState);
    const birthYear = new Date(dob).getFullYear();
    const age = new Date().getFullYear() - birthYear;

    const finalProfile: StudentProfile = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      dateOfBirth: dob,
      age: Math.max(18, age),
      gender,
      mobileNumber: mobileNumber.trim(),
      nationality,
      preferredLanguage,
      state: homeState,
      stateName: stateObj?.name || 'Andhra Pradesh',
      domicileState: domicileState || homeState,
      district: district.trim(),
      educationalQualification: qualification,
      degree: degree.trim(),
      specialization: specialization.trim(),
      university: university.trim(),
      graduationStatus,
      passingYear,
      percentage: parseFloat(percentage) || 70,
      category,
      isPwD,
      isExServiceman,
      preparationLevel: 'Intermediate',
      careerInterests: selectedAmbitions,
    };
    onComplete(finalProfile);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
        {/* Onboarding Top Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 border border-blue-700/60 flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-white block">EXAMVERSE</span>
                <span className="text-xs text-slate-400">Intelligent Student Onboarding Journey</span>
              </div>
            </div>

            {step < 7 && (
              <button
                onClick={onCancel}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded border border-slate-700 hover:bg-slate-800 transition"
              >
                Exit
              </button>
            )}
          </div>

          {/* Step Progress Bar */}
          {step < 7 && (
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Step {step} of 6</span>
                <span>
                  {step === 1 && 'About You'}
                  {step === 2 && 'Your Education'}
                  {step === 3 && 'Your Location'}
                  {step === 4 && 'Eligibility Information'}
                  {step === 5 && 'Your Ambitions'}
                  {step === 6 && 'Review Profile'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${(step / 6) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Feedback Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 flex-1">
          {/* ========================================================================= */}
          {/* STEP 1: ABOUT YOU */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 1: Tell Us About Yourself</h2>
                <p className="text-slate-500 mt-1">
                  Why we need this: Date of birth is required by statutory conducting bodies (UPSC, NTA, SSC) to calculate age cutoffs as of official gazette dates.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Gender (Optional)</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer Not to Say">Prefer Not to Say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mobile Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs bg-slate-50"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block font-medium text-slate-700 mb-1">Preferred Language</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['English', 'Telugu', 'Hindi', 'Tamil'] as SupportedLanguage[]).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setPreferredLanguage(lang)}
                        className={`py-1.5 rounded-lg border font-semibold transition text-xs ${
                          preferredLanguage === lang
                            ? 'bg-blue-900 text-white border-blue-900'
                            : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Set Account Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create secure password (min 6 chars)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 pr-9 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: YOUR EDUCATION */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 2: Educational Background</h2>
                <p className="text-slate-500 mt-1">
                  Why we need this: We never assume all graduates qualify for specialized exams. Technical exams (GATE, RRB JE) require engineering degrees; research (CSIR NET) mandates science disciplines.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Highest Qualification *</label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                  >
                    <option value="10th">10th Standard / Matriculation</option>
                    <option value="Intermediate / 12th">Intermediate / 12th Standard</option>
                    <option value="Diploma">Diploma / Polytechnic</option>
                    <option value="Bachelor's degree">Bachelor's Degree (Undergraduate)</option>
                    <option value="Master's degree">Master's Degree (Postgraduate)</option>
                    <option value="Doctorate">Doctorate / Ph.D</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Degree Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.Tech, B.Sc, B.Com, BA, MBBS, LLB"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Branch / Specialization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science, Mechanical, Physics, Economics"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">University / Institute (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Osmania University / Andhra University"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Graduation Status *</label>
                    <select
                      value={graduationStatus}
                      onChange={(e) => setGraduationStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Final Year">Final Year (Appearing)</option>
                      <option value="Pursuing">Pursuing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Passing Year</label>
                    <input
                      type="number"
                      placeholder="2024"
                      value={passingYear}
                      onChange={(e) => setPassingYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Aggregate Score (%)</label>
                    <input
                      type="number"
                      placeholder="e.g. 75"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: YOUR LOCATION */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 3: Location & State Domicile</h2>
                <p className="text-slate-500 mt-1">
                  Why we need this: State Public Service Commissions (e.g. APPSC, TGPSC, TNPSC) grant local reservation cadres and fee concessions based on domicile status.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Home State / Union Territory *</label>
                    <select
                      value={homeState}
                      onChange={(e) => {
                        setHomeState(e.target.value);
                        setDomicileState(e.target.value);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                    >
                      {allStates.map((st) => (
                        <option key={st.code} value={st.code}>
                          {st.name} ({st.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Domicile State *</label>
                    <select
                      value={domicileState}
                      onChange={(e) => setDomicileState(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                    >
                      {allStates.map((st) => (
                        <option key={st.code} value={st.code}>
                          {st.name} ({st.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">District (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Vijayawada / Guntur / Hyderabad"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Preferred Examination Test Cities</label>
                  <input
                    type="text"
                    placeholder="e.g. Vijayawada, Visakhapatnam, Hyderabad"
                    value={preferredExamCities}
                    onChange={(e) => setPreferredExamCities(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: ELIGIBILITY INFORMATION */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 4: Statutory Reservation & Relaxations</h2>
                <p className="text-slate-500 mt-1">
                  Why we need this: Indian examination ordinances grant statutory age relaxations (+3 yrs OBC, +5 yrs SC/ST, +10 yrs PwD) and qualifying cutoff concessions.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Reservation Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs font-semibold"
                  >
                    <option value="General">General (Unreserved)</option>
                    <option value="OBC">OBC (Non-Creamy Layer) [+3 Years Age Relaxation]</option>
                    <option value="SC">SC (Scheduled Caste) [+5 Years Age Relaxation]</option>
                    <option value="ST">ST (Scheduled Tribe) [+5 Years Age Relaxation]</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-800 block">
                    Special Category Statutory Relaxations:
                  </span>
                  <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPwD}
                      onChange={(e) => setIsPwD(e.target.checked)}
                      className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                    />
                    <span>Person with Benchmark Disability (PwD) [+10 years statutory age relaxation]</span>
                  </label>

                  <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isExServiceman}
                      onChange={(e) => setIsExServiceman(e.target.checked)}
                      className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                    />
                    <span>Ex-Servicemen (Defence Personnel) [Service duration + 3 years relaxation]</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: YOUR AMBITIONS & PRIORITIES */}
          {/* ========================================================================= */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 5: Your Ambitions & Priorities</h2>
                <p className="text-slate-500 mt-1">
                  What kind of future are you exploring? Select all that interest you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {ambitionOptions.map((ambition) => {
                  const isSelected = selectedAmbitions.includes(ambition);
                  return (
                    <button
                      key={ambition}
                      type="button"
                      onClick={() => toggleAmbition(ambition)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition ${
                        isSelected
                          ? 'border-blue-900 bg-blue-50/80 text-blue-950 font-semibold'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-xs">{ambition}</span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-blue-900 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="block font-bold text-slate-800 mb-2">
                  What is your primary current priority?
                </label>
                <div className="space-y-1.5">
                  {priorityOptions.map((pri) => (
                    <label
                      key={pri}
                      className={`flex items-center space-x-2.5 p-2 rounded-lg border cursor-pointer transition ${
                        currentPriority === pri
                          ? 'border-blue-900 bg-blue-50 text-blue-950 font-medium'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        checked={currentPriority === pri}
                        onChange={() => setCurrentPriority(pri)}
                        className="text-blue-900 focus:ring-blue-900"
                      />
                      <span>{pri}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: REVIEW YOUR PROFILE */}
          {/* ========================================================================= */}
          {step === 6 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 6: Review Your Academic Footprint</h2>
                <p className="text-slate-500 mt-1">
                  Verify your profile details before we match you with statutory examinations and opportunities.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 divide-y divide-slate-200">
                <div className="pb-2 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate</span>
                    <strong className="text-slate-900 text-sm">{fullName}</strong> ({gender})
                    <p className="text-slate-500">{email} • DOB: {dob}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-blue-900 text-xs font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="py-2 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Education</span>
                    <strong className="text-slate-900">{degree} in {specialization}</strong>
                    <p className="text-slate-500">{qualification} • {graduationStatus} ({passingYear}) • {percentage}%</p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-blue-900 text-xs font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="py-2 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Location & Category</span>
                    <strong className="text-slate-900">{homeState} Domicile • {category} Category</strong>
                    <p className="text-slate-500">
                      Relaxations: {isPwD ? 'PwD (+10y)' : 'Standard'} {isExServiceman ? '• Ex-Servicemen' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="text-blue-900 text-xs font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Ambitions</span>
                    <p className="text-slate-800 font-semibold">{selectedAmbitions.join(', ')}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Priority: {currentPriority}</p>
                  </div>
                  <button
                    onClick={() => setStep(5)}
                    className="text-blue-900 text-xs font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-950 text-xs flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-blue-900 flex-shrink-0" />
                <span>
                  Your profile will be matched immediately against 40+ statutory Indian examinations using official gazette cutoff rules.
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 7: COMPLETION & CELEBRATION */}
          {/* ========================================================================= */}
          {step === 7 && (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Your journey starts here, {fullName}!
              </h2>

              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your academic footprint has been created. Let's discover the government jobs, entrance examinations, higher studies, and fellowships waiting for you.
              </p>

              <div className="pt-4">
                <button
                  onClick={handleLaunchDashboard}
                  className="px-8 py-3.5 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800 transition flex items-center space-x-2 mx-auto shadow-lg text-sm"
                >
                  <span>Discover My Opportunities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Bottom Buttons (Steps 1 to 6) */}
        {step < 7 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white transition text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition text-xs flex items-center space-x-1 shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitProfile}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-600 transition text-xs flex items-center space-x-1.5 shadow-md disabled:opacity-50"
              >
                <span>{loading ? 'Submitting...' : 'Submit Profile & Unlock Opportunities'}</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
