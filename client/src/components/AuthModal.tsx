// client/src/components/AuthModal.tsx
// Professional Student Authentication & Smart Onboarding Wizard for EXAMVERSE
// Phase 1: Modern Login Page with Welcome Back {student_name}, Remember Me, Password Toggle, Forgot Password
// Phase 2: 4-Step Student Registration Wizard (Personal, Education, Eligibility, Career Interests)
// Human UI: White surfaces, Navy blue accents (#0B192C, #1E3A8A), clean slate borders (#E2E8F0)

import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  Phone,
  Calendar,
  MapPin,
  Building,
  BookOpen,
  Briefcase,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { StudentProfile, IndianState, SupportedLanguage, calculateProfileCompletion } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: StudentProfile) => void;
  allStates: IndianState[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  allStates,
}) => {
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password Visibility Toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Remember Me state
  const [rememberMe, setRememberMe] = useState(true);
  const [rememberedStudentName, setRememberedStudentName] = useState<string>('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Multi-Step Registration Wizard State
  const [regStep, setRegStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Personal Details
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDob, setRegDob] = useState('2002-05-15');
  const [regMobile, setRegMobile] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer Not to Say'>('Male');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Step 2: Education Details
  const [regQualification, setRegQualification] = useState('Undergraduate');
  const [regDegree, setRegDegree] = useState('B.Tech');
  const [regSpecialization, setRegSpecialization] = useState('Computer Science');
  const [regUniversity, setRegUniversity] = useState('');
  const [regGraduationStatus, setRegGraduationStatus] = useState<'Completed' | 'Final Year' | 'Pursuing'>('Completed');
  const [regPassingYear, setRegPassingYear] = useState<string>('2024');

  // Step 3: Eligibility Details
  const [regState, setRegState] = useState('AP');
  const [regDomicileState, setRegDomicileState] = useState('AP');
  const [regNationality, setRegNationality] = useState('Indian');
  const [regCategory, setRegCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [regLanguage, setRegLanguage] = useState<SupportedLanguage>('English');
  const [regIsPwD, setRegIsPwD] = useState(false);
  const [regIsExServiceman, setRegIsExServiceman] = useState(false);

  // Step 4: Career Interests
  const allCareerInterestOptions = [
    'Central Government Jobs',
    'State Government Jobs',
    'Banking & Financial Sector',
    'Railways',
    'Defence & Police',
    'Teaching & Academia',
    'Entrance Exams',
    'Higher Studies & PG Admissions',
    'Research & JRF Opportunities',
    'Professional & Technical Exams'
  ];
  const [regCareerInterests, setRegCareerInterests] = useState<string[]>([
    'Central Government Jobs',
    'Higher Studies & PG Admissions'
  ]);

  // Load remembered user name and email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('examverse_user_email') || '';
    const savedName = localStorage.getItem('examverse_remembered_name') || '';
    if (savedEmail) {
      setLoginEmail(savedEmail);
      setForgotEmail(savedEmail);
    }
    if (savedName) {
      setRememberedStudentName(savedName);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCareerInterest = (interest: string) => {
    setRegCareerInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.login(loginEmail.trim(), loginPassword);

      const resolvedProfile: StudentProfile = res.profile || {
        fullName: res.user?.fullName || 'Student',
        email: res.user?.email || loginEmail.trim(),
        state: 'AP',
        educationalQualification: 'Graduate',
        preferredLanguage: 'English',
        preparationLevel: 'Intermediate',
        careerInterests: ['Government Jobs', 'Higher Studies']
      };

      if (rememberMe) {
        localStorage.setItem('examverse_user_email', resolvedProfile.email);
        localStorage.setItem('examverse_remembered_name', resolvedProfile.fullName);
      } else {
        localStorage.removeItem('examverse_user_email');
        localStorage.removeItem('examverse_remembered_name');
      }

      setSuccessMsg(`Welcome back, ${resolvedProfile.fullName}! Loading your personal opportunity portal...`);
      onAuthSuccess(resolvedProfile);

      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.forgotPassword(forgotEmail.trim());
      setForgotSent(true);
      setSuccessMsg(res.message || 'Password reset instructions have been sent to your email.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch reset instructions. Please check email address.');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    setErrorMsg('');
    if (stepNumber === 1) {
      if (!regFullName.trim()) {
        setErrorMsg('Please provide your Full Name.');
        return false;
      }
      if (!regEmail.trim() || !regEmail.includes('@')) {
        setErrorMsg('Please provide a valid Email Address.');
        return false;
      }
      if (!regDob) {
        setErrorMsg('Please provide your Date of Birth.');
        return false;
      }
      if (regPassword && regPassword.length < 6) {
        setErrorMsg('Password should be at least 6 characters.');
        return false;
      }
      if (regPassword && regPassword !== regConfirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return false;
      }
    } else if (stepNumber === 2) {
      if (!regQualification) {
        setErrorMsg('Please select your Highest Educational Qualification.');
        return false;
      }
      if (!regDegree.trim()) {
        setErrorMsg('Please specify your Degree (e.g. B.Tech, B.Sc, B.Com, BA).');
        return false;
      }
      if (!regSpecialization.trim()) {
        setErrorMsg('Please specify your Specialization or Branch.');
        return false;
      }
    } else if (stepNumber === 3) {
      if (!regState) {
        setErrorMsg('Please select your Home State.');
        return false;
      }
      if (!regCategory) {
        setErrorMsg('Please select your Reservation Category.');
        return false;
      }
    } else if (stepNumber === 4) {
      if (regCareerInterests.length === 0) {
        setErrorMsg('Please select at least one Career Interest.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(regStep)) {
      setRegStep((prev) => Math.min(4, prev + 1) as any);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setRegStep((prev) => Math.max(1, prev - 1) as any);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    try {
      setLoading(true);
      setErrorMsg('');

      const stateObj = allStates.find((s) => s.code === regState);
      const birthYear = new Date(regDob).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = Math.max(18, currentYear - birthYear);

      const payload = {
        fullName: regFullName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword || 'student123',
        dateOfBirth: regDob,
        age,
        gender: regGender,
        mobileNumber: regMobile.trim(),
        state: regState,
        stateName: stateObj?.name || 'Andhra Pradesh',
        domicileState: regDomicileState || regState,
        nationality: regNationality,
        category: regCategory,
        educationalQualification: regQualification,
        degree: regDegree.trim(),
        specialization: regSpecialization.trim(),
        university: regUniversity.trim(),
        graduationStatus: regGraduationStatus,
        passingYear: regPassingYear,
        preferredLanguage: regLanguage,
        preparationLevel: 'Intermediate',
        isPwD: regIsPwD,
        isExServiceman: regIsExServiceman,
        careerInterests: regCareerInterests
      };

      const res = await api.register(payload);
      const createdProfile: StudentProfile = res.profile || payload;

      localStorage.setItem('examverse_user_email', createdProfile.email);
      localStorage.setItem('examverse_remembered_name', createdProfile.fullName);

      setSuccessMsg(`Account created successfully! Welcome to EXAMVERSE, ${createdProfile.fullName}.`);
      onAuthSuccess(createdProfile);

      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration could not be completed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSwitch = async (email: string, name: string, state: string, degree: string, spec: string, qual: string) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const stateObj = allStates.find((s) => s.code === state);
      const demoProfile: StudentProfile = {
        fullName: name,
        email,
        state,
        stateName: stateObj?.name || state,
        domicileState: state,
        nationality: 'Indian',
        educationalQualification: qual,
        degree,
        specialization: spec,
        graduationStatus: 'Completed',
        category: 'General',
        preferredLanguage: 'English',
        preparationLevel: 'Intermediate',
        dateOfBirth: '2001-08-15',
        age: 24,
        careerInterests: ['Central Government Jobs', 'Higher Studies & PG Admissions'],
      };

      const updated = await api.updateProfile(demoProfile);
      localStorage.setItem('examverse_user_email', email);
      localStorage.setItem('examverse_remembered_name', name);
      onAuthSuccess(updated.profile || demoProfile);
      setSuccessMsg(`Switched to authenticated profile: ${name}`);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to switch profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Logo & Tagline */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-900 border border-blue-700/60 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-white">EXAMVERSE</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-800 text-blue-200 font-semibold uppercase">
                  Verified Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Every Exam. Every Opportunity. One Platform.
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

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-slate-200 text-xs font-semibold bg-slate-50/50">
          <button
            onClick={() => { setTab('LOGIN'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              tab === 'LOGIN'
                ? 'border-blue-900 text-blue-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('REGISTER'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              tab === 'REGISTER'
                ? 'border-blue-900 text-blue-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            New Student Registration
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center space-x-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: PROFESSIONAL LOGIN PAGE */}
        {/* ========================================================================= */}
        {tab === 'LOGIN' && (
          <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs text-slate-700">
            {/* Returning Student Personalized Greeting */}
            {rememberedStudentName ? (
              <div className="p-3.5 bg-blue-50/80 rounded-lg border border-blue-200 text-blue-950 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {rememberedStudentName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-blue-950">Welcome back, {rememberedStudentName}!</h3>
                  <p className="text-[11px] text-blue-800">
                    Sign in to resume tracking your daily study targets, mock diagnostics, and active notifications.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-base font-bold text-slate-900">Welcome Back</h2>
                <p className="text-[11px] text-slate-500">
                  Sign in with your registered student credentials to access your personalized portal.
                </p>
              </div>
            )}

            <div>
              <label className="block font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@examverse.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => { setTab('FORGOT_PASSWORD'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-blue-900 hover:underline font-medium text-[11px]"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition flex items-center justify-center space-x-1.5 shadow-xs disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Create Account Link */}
            <div className="text-center pt-2 text-[11px] text-slate-500">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setTab('REGISTER'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-blue-900 font-bold hover:underline"
              >
                Create New Account
              </button>
            </div>

            {/* Instant Demo Aspirant Switcher */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                ⚡ Quick Demo Aspirants (One-Click Test Switch)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickDemoSwitch('dinesh@examverse.in', 'Dinesh Baswa', 'AP', 'B.Tech', 'Computer Science', 'Graduate')}
                  className="p-2 rounded border border-slate-200 hover:border-blue-900 text-left bg-slate-50 transition hover:bg-white"
                >
                  <p className="font-bold text-slate-800">Dinesh Baswa</p>
                  <p className="text-slate-500 text-[10px]">B.Tech CS • Andhra Pradesh</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSwitch('ananya.sharma@examverse.in', 'Ananya Sharma', 'DL', 'B.Sc', 'Forensic Science', 'Graduate')}
                  className="p-2 rounded border border-slate-200 hover:border-blue-900 text-left bg-slate-50 transition hover:bg-white"
                >
                  <p className="font-bold text-slate-800">Ananya Sharma</p>
                  <p className="text-slate-500 text-[10px]">B.Sc Forensic • Delhi</p>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FORGOT PASSWORD */}
        {/* ========================================================================= */}
        {tab === 'FORGOT_PASSWORD' && (
          <form onSubmit={handleForgotPassword} className="p-6 space-y-4 text-xs text-slate-700">
            <div>
              <h2 className="text-base font-bold text-slate-900">Reset Your Password</h2>
              <p className="text-[11px] text-slate-500">
                Enter your registered student email address. We'll send instructions to securely reset your credentials.
              </p>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@examverse.in"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition flex items-center justify-center space-x-1.5 shadow-xs disabled:opacity-50"
            >
              <span>{loading ? 'Sending Instructions...' : 'Send Password Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setTab('LOGIN'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-xs text-blue-900 font-semibold hover:underline flex items-center justify-center space-x-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 4-STEP STUDENT REGISTRATION WIZARD */}
        {/* ========================================================================= */}
        {tab === 'REGISTER' && (
          <form onSubmit={handleRegister} className="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
            {/* Step Wizard Progress Bar */}
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2 text-[11px] font-semibold text-slate-500">
                <span className={regStep >= 1 ? 'text-blue-900 font-bold' : ''}>1. Personal</span>
                <span className={regStep >= 2 ? 'text-blue-900 font-bold' : ''}>2. Education</span>
                <span className={regStep >= 3 ? 'text-blue-900 font-bold' : ''}>3. Eligibility</span>
                <span className={regStep >= 4 ? 'text-blue-900 font-bold' : ''}>4. Interests</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-900 h-full transition-all duration-300"
                  style={{ width: `${(regStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1: PERSONAL DETAILS */}
            {regStep === 1 && (
              <div className="space-y-3 animate-fade-in">
                <div className="pb-1">
                  <h3 className="text-sm font-bold text-slate-900">Step 1: Personal Details</h3>
                  <p className="text-[11px] text-slate-500">Provide your basic identity for examination registration.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mobile Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Gender</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer Not to Say">Prefer Not to Say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        placeholder="Create password (min 6 chars)"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3 pr-9 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full px-3 pr-9 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: EDUCATION DETAILS */}
            {regStep === 2 && (
              <div className="space-y-3 animate-fade-in">
                <div className="pb-1">
                  <h3 className="text-sm font-bold text-slate-900">Step 2: Educational Details</h3>
                  <p className="text-[11px] text-slate-500">
                    Statutory eligibility requires degree and specialization verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Highest Qualification *</label>
                    <select
                      value={regQualification}
                      onChange={(e) => setRegQualification(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                    >
                      <option value="10th Pass">10th Pass</option>
                      <option value="12th Pass">12th Pass / Intermediate</option>
                      <option value="Diploma">Diploma / Polytechnic</option>
                      <option value="Undergraduate">Undergraduate (Bachelor's)</option>
                      <option value="Postgraduate">Postgraduate (Master's)</option>
                      <option value="Doctorate">Doctorate / Ph.D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Degree Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.Tech, B.Sc, B.Com, BA, MBBS, LLB"
                      value={regDegree}
                      onChange={(e) => setRegDegree(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Specialization / Branch *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science, Mechanical, Physics, Economics"
                      value={regSpecialization}
                      onChange={(e) => setRegSpecialization(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">University / Institute (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Osmania University / Andhra University"
                      value={regUniversity}
                      onChange={(e) => setRegUniversity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Graduation Status *</label>
                    <select
                      value={regGraduationStatus}
                      onChange={(e) => setRegGraduationStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Final Year">Final Year (Appearing)</option>
                      <option value="Pursuing">Pursuing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Year of Passing</label>
                    <input
                      type="number"
                      placeholder="e.g. 2024"
                      value={regPassingYear}
                      onChange={(e) => setRegPassingYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ELIGIBILITY & DOMICILE DETAILS */}
            {regStep === 3 && (
              <div className="space-y-3 animate-fade-in">
                <div className="pb-1">
                  <h3 className="text-sm font-bold text-slate-900">Step 3: Statutory Eligibility Details</h3>
                  <p className="text-[11px] text-slate-500">
                    State domicile and reservation categories determine quotas and age relaxations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Current State *</label>
                    <select
                      value={regState}
                      onChange={(e) => {
                        setRegState(e.target.value);
                        if (!regDomicileState) setRegDomicileState(e.target.value);
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
                      value={regDomicileState}
                      onChange={(e) => setRegDomicileState(e.target.value)}
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
                    <label className="block font-medium text-slate-700 mb-1">Reservation Category *</label>
                    <select
                      value={regCategory}
                      onChange={(e) => setRegCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white text-xs"
                    >
                      <option value="General">General (Unreserved)</option>
                      <option value="OBC">OBC (Non-Creamy Layer) [+3 yrs relaxation]</option>
                      <option value="SC">SC (Scheduled Caste) [+5 yrs relaxation]</option>
                      <option value="ST">ST (Scheduled Tribe) [+5 yrs relaxation]</option>
                      <option value="EWS">EWS (Economically Weaker Section)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={regNationality}
                      onChange={(e) => setRegNationality(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-900 text-xs bg-slate-50"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block font-medium text-slate-700 mb-1">Preferred Language for AI Study Tutor</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['English', 'Telugu', 'Hindi', 'Tamil'] as SupportedLanguage[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setRegLanguage(l)}
                        className={`py-1.5 rounded-lg border text-xs font-semibold transition ${
                          regLanguage === l
                            ? 'border-blue-900 bg-blue-900 text-white'
                            : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Statutory Relaxations */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-700 block">
                    Special Category Age Relaxations:
                  </span>
                  <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regIsPwD}
                      onChange={(e) => setRegIsPwD(e.target.checked)}
                      className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                    />
                    <span>Person with Benchmark Disability (PwD) [+10 years statutory age relaxation]</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regIsExServiceman}
                      onChange={(e) => setRegIsExServiceman(e.target.checked)}
                      className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                    />
                    <span>Ex-Servicemen (Defence Personnel) [Statutory service + 3 years relaxation]</span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4: CAREER INTERESTS */}
            {regStep === 4 && (
              <div className="space-y-3 animate-fade-in">
                <div className="pb-1">
                  <h3 className="text-sm font-bold text-slate-900">Step 4: Career & Examination Interests</h3>
                  <p className="text-[11px] text-slate-500">
                    Select sectors you want recommended on your dashboard. You can modify these anytime.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allCareerInterestOptions.map((interest) => {
                    const isSelected = regCareerInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleCareerInterest(interest)}
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium flex items-center justify-between transition ${
                          isSelected
                            ? 'border-blue-900 bg-blue-50/80 text-blue-950 font-semibold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <span>{interest}</span>
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
              </div>
            )}

            {/* Wizard Navigation Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {regStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {regStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition flex items-center space-x-1 shadow-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-600 transition flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
                >
                  <span>{loading ? 'Creating Profile...' : 'Complete Registration & Start Preparing'}</span>
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
