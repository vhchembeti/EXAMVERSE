// client/src/views/LandingPageView.tsx
// Public Homepage for EXAMVERSE: Indian Student Career Discovery & Examination Platform
// "Your Future Has More Possibilities Than You Think."
// Professional, trustworthy, student-first digital education ecosystem.

import React from 'react';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Compass,
  BookOpen,
  Calendar,
  Award,
  Sparkles,
  Building,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Users,
  Search,
  Lock,
  Globe,
  Bell,
  Check
} from 'lucide-react';
import { Examination, ExamNotification, IndianState } from '../types';
import { AntiScamBanner } from '../components/AntiScamBanner';

interface LandingPageViewProps {
  onStartOnboarding: () => void;
  onOpenLogin: () => void;
  onExploreExams: () => void;
  onOpenCalendar: () => void;
  onOpenNotifications: () => void;
  onQuickDemo: () => void;
  exams: Examination[];
  notifications: ExamNotification[];
  allStates: IndianState[];
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onStartOnboarding,
  onOpenLogin,
  onExploreExams,
  onOpenCalendar,
  onOpenNotifications,
  onQuickDemo,
  exams,
  notifications,
  allStates,
}) => {
  // Real active notifications
  const activeNotifs = notifications
    .filter((n) => n.status === 'ACTIVE' || n.status === 'CLOSING_SOON')
    .slice(0, 4);

  // Opportunity Categories
  const categories = [
    {
      title: 'Government Recruitment',
      subtitle: 'Central & State Public Services',
      desc: 'UPSC Civil Services, SSC CGL/CHSL, State PSCs (APPSC, TGPSC, TNPSC, UPPSC), Railway RRBs, and Police Cadres.',
      icon: Building,
      count: '15+ Boards',
      badge: 'Statutory Recruitment'
    },
    {
      title: 'Banking & Financial Sector',
      subtitle: 'Public Sector Banks & Regulators',
      desc: 'Reserve Bank of India (RBI Grade B), SBI Probationary Officers, IBPS PO, and EPFO Enforcement Officers.',
      icon: Briefcase,
      count: 'National Cadre',
      badge: 'Banking & Finance'
    },
    {
      title: 'Entrance Examinations',
      subtitle: 'National UG & PG Admissions',
      desc: 'CUET (Central Universities), JEE Main/Advanced, NEET (Medical), CLAT (National Law Universities), and NATA.',
      icon: GraduationCap,
      count: 'Central & State',
      badge: 'National Entrances'
    },
    {
      title: 'Higher Studies & PG Admissions',
      subtitle: 'Masters & Technical Specializations',
      desc: 'GATE (IIT/IISc M.Tech & PSUs), IIT JAM (M.Sc), CAT, MAT, CMAT (AICTE/IIM Management), and CUET PG.',
      icon: Award,
      count: 'IITs, IIMs, Central Univs',
      badge: 'Postgraduate'
    },
    {
      title: 'Research & Fellowships',
      subtitle: 'Junior Research Fellowship (JRF)',
      desc: 'CSIR-UGC NET (Chemical, Earth, Life, Physical, Math Sciences), UGC NET (83 Humanities & Tech Subjects), DBT BET.',
      icon: Sparkles,
      count: 'JRF & Assistant Professor',
      badge: 'Research & Ph.D'
    },
    {
      title: 'Defence & Allied Services',
      subtitle: 'Armed Forces Officer Commissions',
      desc: 'National Defence Academy (NDA), Combined Defence Services (CDS), AFCAT (Air Force), CAPF Assistant Commandants.',
      icon: ShieldCheck,
      count: 'Army, Navy, Air Force',
      badge: 'Officer Cadre'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Statutory Anti-Scam Official Domain Verification Banner */}
      <AntiScamBanner />

      {/* 1. PUBLIC NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    EXAM<span className="text-blue-900">VERSE</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-900 border border-blue-200 uppercase">
                    INDIA
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 hidden sm:block tracking-tight">
                  Every Exam. Every Opportunity. One Platform.
                </p>
              </div>
            </div>

            {/* Center Quick Navigation */}
            <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600">
              <button onClick={onExploreExams} className="hover:text-blue-900 transition">
                Explore Examinations
              </button>
              <button onClick={onOpenNotifications} className="hover:text-blue-900 transition flex items-center space-x-1">
                <span>Active Notifications</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>
              <button onClick={onOpenCalendar} className="hover:text-blue-900 transition">
                Examination Calendar
              </button>
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={onOpenLogin}
                className="text-xs px-3 py-2 rounded-lg font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-100 transition"
              >
                Sign In
              </button>
              <button
                onClick={onStartOnboarding}
                className="text-xs px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition shadow-xs flex items-center space-x-1.5"
              >
                <span>Discover Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-900" />
              <span>Statutory Indian Examination & Educational Guidance</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
              Your Future Has More Possibilities Than You Think.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover government jobs, entrance examinations, higher education, research opportunities and the right preparation path — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onStartOnboarding}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800 transition flex items-center justify-center space-x-2 shadow-md hover:shadow-lg text-sm"
              >
                <span>Discover My Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreExams}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition text-sm flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Explore All Examinations</span>
              </button>
            </div>

            {/* Quick Demo Aspirant Tour */}
            <div className="pt-4 flex items-center justify-center space-x-2 text-xs text-slate-500">
              <span>Looking for an instant preview?</span>
              <button
                onClick={onQuickDemo}
                className="text-blue-900 font-bold hover:underline flex items-center space-x-1"
              >
                <span>Take a 1-Click Aspirant Tour</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Subtle geometric background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60"></div>
      </section>

      {/* 3. OPPORTUNITY CATEGORIES SHOWCASE */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
              Opportunity Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Six Pathways. Hundreds of Recognized Examinations.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              From Central and State civil services to national IIT/IIM admissions and research fellowships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-blue-900 transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {cat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition">
                        {cat.title}
                      </h3>
                      <p className="text-xs font-semibold text-blue-900 mt-0.5">{cat.subtitle}</p>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-slate-400">{cat.count}</span>
                    <button
                      onClick={onExploreExams}
                      className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center space-x-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW EXAMVERSE WORKS (4-STEP JOURNEY) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
              Intelligent Guidance Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How EXAMVERSE Works for You
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear, transparent, and grounded in official statutory gazette rules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                desc: 'Enter your educational degree, specialization, date of birth, domicile, and career priorities in a guided wizard.',
                icon: Users
              },
              {
                step: '02',
                title: 'Discover Opportunities',
                desc: 'Our engine matches your exact branch and qualification with government jobs, higher studies, and fellowships.',
                icon: Compass
              },
              {
                step: '03',
                title: 'Verify Eligibility',
                desc: 'Statutory age cutoffs, category relaxations, and domicile quotas are calculated transparently with reason breakdowns.',
                icon: ShieldCheck
              },
              {
                step: '04',
                title: 'Prepare Intelligently',
                desc: 'Access official syllabi, standard textbooks, authentic past question papers, and your AI Study Tutor.',
                icon: BookOpen
              }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-slate-50/70 rounded-xl border border-slate-200 p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-extrabold text-blue-900 font-mono">{step.step}</span>
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-blue-900 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. LIVE NOTIFICATIONS & CALENDAR PREVIEW */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Active Gazette Notifications Feed */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-blue-900" />
                  <h3 className="text-base font-bold text-slate-900">Active Official Notifications</h3>
                </div>
                <button
                  onClick={onOpenNotifications}
                  className="text-xs font-semibold text-blue-900 hover:underline flex items-center space-x-1"
                >
                  <span>View All Notices</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs mt-3">
                {activeNotifs.map((notif) => (
                  <div key={notif.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{notif.organization}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          ACTIVE
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium">{notif.examTitle}</p>
                      <p className="text-[11px] text-slate-400">
                        Application Deadline: <strong className="text-slate-700">{notif.lastDate || 'Official Portal'}</strong>
                      </p>
                    </div>

                    <a
                      href={notif.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded border border-slate-300 hover:border-blue-900 text-slate-700 text-[11px] font-semibold flex items-center space-x-1 flex-shrink-0 transition"
                    >
                      <span>Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Examination Calendar & Timeline Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-900" />
                  <h3 className="text-base font-bold text-slate-900">National Exam Calendar Preview</h3>
                </div>
                <button
                  onClick={onOpenCalendar}
                  className="text-xs font-semibold text-blue-900 hover:underline flex items-center space-x-1"
                >
                  <span>Full Calendar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 mt-4 text-xs">
                {[
                  {
                    exam: 'UPSC Civil Services Prelims 2026',
                    date: 'May 24, 2026',
                    stage: 'Preliminary Examination (Objective)',
                    body: 'Union Public Service Commission'
                  },
                  {
                    exam: 'GATE 2026 (Computer Science & Engg)',
                    date: 'February 7–15, 2026',
                    stage: 'Computer Based Test (CBT)',
                    body: 'IIT Guwahati / Organizing IIT'
                  },
                  {
                    exam: 'CUET UG 2026 (Central Universities)',
                    date: 'May 15–31, 2026',
                    stage: 'Undergraduate CBT',
                    body: 'National Testing Agency'
                  },
                  {
                    exam: 'CAT 2026 (Management Admissions)',
                    date: 'November 29, 2026',
                    stage: 'IIM CBT Examination',
                    body: 'Indian Institutes of Management'
                  }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.exam}</h4>
                      <p className="text-[11px] text-slate-500">{item.stage} • {item.body}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-900 bg-white px-2.5 py-1 rounded border border-slate-200 flex-shrink-0">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Stop Guessing. Start Discovering Your Legitimate Opportunities.
          </h2>
          <p className="text-blue-100 text-sm max-w-2xl mx-auto leading-relaxed">
            Create your personalized academic profile in 2 minutes. Receive authenticated eligibility checks, official gazette deadlines, and targeted preparation tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartOnboarding}
              className="px-6 py-3 rounded-xl bg-white text-blue-900 font-bold hover:bg-blue-50 transition text-sm flex items-center space-x-2 shadow-lg"
            >
              <span>Discover My Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenLogin}
              className="px-6 py-3 rounded-xl border border-blue-400 text-white font-semibold hover:bg-blue-800 transition text-sm"
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </section>

      {/* 7. OFFICIAL STATUTORY FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center text-white font-bold">
                  <GraduationCap className="w-5 h-5 text-blue-200" />
                </div>
                <span className="text-base font-extrabold text-white tracking-tight">EXAMVERSE</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Centralized Indian Student Career Discovery and Statutory Examination Guidance Ecosystem. Covering all 28 States and 8 Union Territories.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Statutory Portals</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="https://upsc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">UPSC Civil Services</a></li>
                <li><a href="https://ssc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Staff Selection Commission</a></li>
                <li><a href="https://exams.nta.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">National Testing Agency</a></li>
                <li><a href="https://ibps.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">IBPS Banking Recruitment</a></li>
                <li><a href="https://rrbapply.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Railway Recruitment Boards</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">State PSC Networks</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="https://psc.ap.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">APPSC (Andhra Pradesh)</a></li>
                <li><a href="https://websitenew.tspsc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">TGPSC (Telangana)</a></li>
                <li><a href="https://tnpsc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">TNPSC (Tamil Nadu)</a></li>
                <li><a href="https://kpsc.kar.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">KPSC (Karnataka)</a></li>
                <li><a href="https://mpsc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">MPSC (Maharashtra)</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Data Integrity Notice</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All examination schedules, eligibility criteria, and vacancies are referenced from gazette notifications issued by conducting bodies. EXAMVERSE does not publish synthetic or unverified dates as facts.
              </p>
              <div className="mt-3 flex items-center space-x-1.5 text-[10px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Statutory Ordinances Verified</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
            <p>© {new Date().getFullYear()} EXAMVERSE. Every Exam. Every Opportunity. One Platform.</p>
            <div className="flex items-center space-x-4">
              <span>English</span>
              <span>తెలుగు</span>
              <span>हिन्दी</span>
              <span>தமிழ்</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
