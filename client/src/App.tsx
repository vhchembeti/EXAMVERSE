// client/src/App.tsx
// EXAMVERSE: Indian Student Career Discovery & Examination Preparation Ecosystem
// "Every Exam. Every Opportunity. One Platform."

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GlobalNotificationPopup } from './components/GlobalNotificationPopup';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AuthModal } from './components/AuthModal';
import { LandingPageView } from './views/LandingPageView';

// Dynamic lazy-loading for heavy views to minimize initial bundle size and boost Core Web Vitals
const GuidedOnboardingView = React.lazy(() => import('./views/GuidedOnboardingView').then(m => ({ default: m.GuidedOnboardingView })));
const OpportunityDiscoveryView = React.lazy(() => import('./views/OpportunityDiscoveryView').then(m => ({ default: m.OpportunityDiscoveryView })));
const WhatIfSimulatorView = React.lazy(() => import('./views/WhatIfSimulatorView').then(m => ({ default: m.WhatIfSimulatorView })));
const HigherStudiesView = React.lazy(() => import('./views/HigherStudiesView').then(m => ({ default: m.HigherStudiesView })));
const MainDashboardView = React.lazy(() => import('./views/MainDashboardView').then(m => ({ default: m.MainDashboardView })));
const ExploreExamsView = React.lazy(() => import('./views/ExploreExamsView').then(m => ({ default: m.ExploreExamsView })));
const SmartExamFinderView = React.lazy(() => import('./views/SmartExamFinderView').then(m => ({ default: m.SmartExamFinderView })));
const UniversalExamPrepView = React.lazy(() => import('./views/UniversalExamPrepView').then(m => ({ default: m.UniversalExamPrepView })));
const ExamCalendarView = React.lazy(() => import('./views/ExamCalendarView').then(m => ({ default: m.ExamCalendarView })));
const MockTestsView = React.lazy(() => import('./views/MockTestsView').then(m => ({ default: m.MockTestsView })));
const PerformanceDashboardView = React.lazy(() => import('./views/PerformanceDashboardView').then(m => ({ default: m.PerformanceDashboardView })));
const CareerPathsView = React.lazy(() => import('./views/CareerPathsView').then(m => ({ default: m.CareerPathsView })));
const AITutorView = React.lazy(() => import('./views/AITutorView').then(m => ({ default: m.AITutorView })));
const AdminDashboardView = React.lazy(() => import('./views/AdminDashboardView').then(m => ({ default: m.AdminDashboardView })));
const RecruitmentBoardsView = React.lazy(() => import('./views/RecruitmentBoardsView').then(m => ({ default: m.RecruitmentBoardsView })));
const UniversalExamCatalogView = React.lazy(() => import('./views/UniversalExamCatalogView').then(m => ({ default: m.UniversalExamCatalogView })));
const CoverageTelemetryView = React.lazy(() => import('./views/CoverageTelemetryView').then(m => ({ default: m.CoverageTelemetryView })));
const GateHubView = React.lazy(() => import('./views/GateHubView').then(m => ({ default: m.GateHubView })));
const NotificationsCenterView = React.lazy(() => import('./views/NotificationsCenterView').then(m => ({ default: m.NotificationsCenterView })));
const NationalLearningCentreView = React.lazy(() => import('./views/NationalLearningCentreView').then(m => ({ default: m.NationalLearningCentreView })));
const CbtMockPlayerView = React.lazy(() => import('./views/CbtMockPlayerView').then(m => ({ default: m.CbtMockPlayerView })));
const CbtMockAnalysisView = React.lazy(() => import('./views/CbtMockAnalysisView').then(m => ({ default: m.CbtMockAnalysisView })));
const StudyPlannerView = React.lazy(() => import('./views/StudyPlannerView').then(m => ({ default: m.StudyPlannerView })));
const FormulaLibraryView = React.lazy(() => import('./views/FormulaLibraryView').then(m => ({ default: m.FormulaLibraryView })));
const AIAcademicCompanionView = React.lazy(() => import('./views/AIAcademicCompanionView').then(m => ({ default: m.AIAcademicCompanionView })));
const E2EENotebookView = React.lazy(() => import('./views/E2EENotebookView').then(m => ({ default: m.E2EENotebookView })));
const CareerPathwaysGraphView = React.lazy(() => import('./views/CareerPathwaysGraphView').then(m => ({ default: m.CareerPathwaysGraphView })));
const SalaryAndBondExplorerView = React.lazy(() => import('./views/SalaryAndBondExplorerView').then(m => ({ default: m.SalaryAndBondExplorerView })));
const DocumentReadinessChecklistView = React.lazy(() => import('./views/DocumentReadinessChecklistView').then(m => ({ default: m.DocumentReadinessChecklistView })));
const PrivacySettingsView = React.lazy(() => import('./views/PrivacySettingsView').then(m => ({ default: m.PrivacySettingsView })));
const AptitudeHubView = React.lazy(() => import('./views/AptitudeHubView').then(m => ({ default: m.AptitudeHubView })));
const AptitudeTopicDetailView = React.lazy(() => import('./views/AptitudeTopicDetailView').then(m => ({ default: m.AptitudeTopicDetailView })));
const BlinkDrillPlayerView = React.lazy(() => import('./views/BlinkDrillPlayerView').then(m => ({ default: m.BlinkDrillPlayerView })));
const SpeedMathGymView = React.lazy(() => import('./views/SpeedMathGymView').then(m => ({ default: m.SpeedMathGymView })));
const AiTrickCoachView = React.lazy(() => import('./views/AiTrickCoachView').then(m => ({ default: m.AiTrickCoachView })));
import { ExamDetailModal } from './components/ExamDetailModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { Examination, StudentProfile, IndianState, ExamNotification, DailyTarget, SupportedLanguage } from './types';
import { api } from './services/api';
import { applyLanguageDirection, SUPPORTED_LANGUAGES, LanguageCode } from './services/i18n';
import { GraduationCap, Shield, Zap } from 'lucide-react';

export function App() {
  const storedUserEmail = localStorage.getItem('examverse_user_email');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storedUserEmail);
  const [currentTab, setCurrentTab] = useState<string>(storedUserEmail ? 'dashboard' : 'landing');

  const [profile, setProfile] = useState<StudentProfile>({
    fullName: 'Dinesh Baswa',
    email: storedUserEmail || 'student@examverse.in',
    state: 'AP',
    stateName: 'Andhra Pradesh',
    domicileState: 'AP',
    educationalQualification: "Bachelor's degree",
    degree: 'B.Tech',
    specialization: 'Computer Science and Engineering',
    graduationStatus: 'Completed',
    category: 'General',
    preferredLanguage: 'English',
    preparationLevel: 'Intermediate',
    careerInterests: ['Government Jobs', 'Engineering & PSU', 'Higher Studies'],
    age: 24,
    mobileNumber: '9876543210',
    nationality: 'Indian',
    university: 'JNTUK',
    passingYear: 2024,
    isPwD: false,
    isExServiceman: false
  });

  const [allStates, setAllStates] = useState<IndianState[]>([]);
  const [exams, setExams] = useState<Examination[]>([]);
  const [selectedExams, setSelectedExams] = useState<Examination[]>([]);
  const [activeExamId, setActiveExamId] = useState<string>('upsc-cse');
  const [notifications, setNotifications] = useState<ExamNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [dailyTargets, setDailyTargets] = useState<DailyTarget[]>([]);

  // Navigation and Filter States
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('ALL');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('examverse_dark_mode') === 'true');
  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(() => localStorage.getItem('examverse_low_bandwidth') === 'true');
  const [activeMockTestId, setActiveMockTestId] = useState<string>('mock-upsc-prelims-gs1');
  const [activeCbtTestId, setActiveCbtTestId] = useState<string | null>(null);
  const [cbtTelemetry, setCbtTelemetry] = useState<any | null>(null);
  const [cbtWeakTopics, setCbtWeakTopics] = useState<any[]>([]);
  const [aiTutorInitialExam, setAiTutorInitialExam] = useState<string>('UPSC CSE');

  // Phase 11: Universal Aptitude, Reasoning & Speed Mastery States
  const [aptitudeSubView, setAptitudeSubView] = useState<'hub' | 'topic' | 'drill' | 'gym' | 'ai-coach'>('hub');
  const [selectedAptitudeTopicId, setSelectedAptitudeTopicId] = useState<string>('classification-divisibility');
  const [drillExamTag, setDrillExamTag] = useState<string>('GATE_GA');
  const [coachQuestionId, setCoachQuestionId] = useState<string>('q-quant-percent-successive');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleNavigateAptitudeTopic = (topicId: string) => {
    setSelectedAptitudeTopicId(topicId);
    setAptitudeSubView('topic');
    setCurrentTab('aptitude');
  };

  const handleNavigateBlinkDrill = (examTag?: string) => {
    if (examTag) setDrillExamTag(examTag);
    setAptitudeSubView('drill');
    setCurrentTab('aptitude');
  };

  const handleNavigateSpeedGym = () => {
    setAptitudeSubView('gym');
    setCurrentTab('aptitude');
  };

  const handleNavigateAiCoach = (questionId?: string) => {
    if (questionId) setCoachQuestionId(questionId);
    setAptitudeSubView('ai-coach');
    setCurrentTab('aptitude');
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('examverse_dark_mode', String(next));
      return next;
    });
  };

  const handleToggleLowBandwidth = () => {
    setIsLowBandwidth((prev) => {
      const next = !prev;
      localStorage.setItem('examverse_low_bandwidth', String(next));
      return next;
    });
  };

  const isRTL = language === 'Urdu';

  // Modals
  const [activeExamDetailSlug, setActiveExamDetailSlug] = useState<string | null>(null);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Initial Data Fetching
  useEffect(() => {
    const bootstrap = async () => {
      try {
        setInitialLoading(true);
        const [statesData, examsData, profData, selectedData, notifsData, targetsData] = await Promise.all([
          api.getStates(),
          api.getExams(),
          api.getProfile().catch(() => null),
          api.getSelectedExams().catch(() => []),
          api.getActiveNotifications().catch(() => ({ notifications: [], unreadCount: 0 })),
          api.getDailyTargets().catch(() => [])
        ]);

        setAllStates(statesData || []);
        setExams(examsData || []);
        if (profData) {
          setProfile(profData);
          if (profData.preferredLanguage) setLanguage(profData.preferredLanguage);
          setIsAuthenticated(true);
        } else if (!storedUserEmail) {
          setIsAuthenticated(false);
          setCurrentTab('landing');
        }
        setSelectedExams(selectedData || []);
        if (notifsData?.notifications) {
          setNotifications(notifsData.notifications);
          setUnreadCount(notifsData.unreadCount || 0);
        }
        setDailyTargets(targetsData || []);
      } catch (err) {
        console.error('Bootstrap error:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    const langObj = SUPPORTED_LANGUAGES.find(
      (l) => l.name.toLowerCase() === language.toLowerCase() || l.code.toLowerCase() === language.toLowerCase()
    );
    const code = (langObj?.code || 'en') as LanguageCode;
    applyLanguageDirection(code);
  }, [language]);

  const handleSelectExamForPrep = (examId: string) => {
    setActiveExamId(examId);
    setCurrentTab('universal-prep');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchMock = (testId: string) => {
    setActiveMockTestId(testId);
    setCurrentTab('mock-tests');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchAITutor = (examCode: string) => {
    setAiTutorInitialExam(examCode);
    setCurrentTab('ai-tutor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleDailyTarget = async (id: string) => {
    try {
      const updated = await api.toggleDailyTarget(id);
      setDailyTargets(updated);
    } catch (err) {
      console.error('Target toggle error:', err);
    }
  };

  const handleAddDailyTarget = async (text: string, subject?: string) => {
    try {
      const created = await api.addDailyTarget({ text, subject, estimatedMinutes: 30 });
      setDailyTargets((prev) => [...prev, created]);
    } catch (err) {
      console.error('Add target error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('examverse_user_email');
    localStorage.removeItem('examverse_remembered_name');
    setIsAuthenticated(false);
    setCurrentTab('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (newProf: StudentProfile) => {
    localStorage.setItem('examverse_user_email', newProf.email);
    localStorage.setItem('examverse_remembered_name', newProf.fullName);
    setProfile(newProf);
    setIsAuthenticated(true);
    if (newProf.preferredLanguage) setLanguage(newProf.preferredLanguage);
    setAuthModalOpen(false);
    setCurrentTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingComplete = (newProf: StudentProfile) => {
    localStorage.setItem('examverse_user_email', newProf.email);
    localStorage.setItem('examverse_remembered_name', newProf.fullName);
    setProfile(newProf);
    setIsAuthenticated(true);
    if (newProf.preferredLanguage) setLanguage(newProf.preferredLanguage);
    setCurrentTab('opportunity-discovery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickDemo = () => {
    const demoProfile: StudentProfile = {
      fullName: 'Dinesh Baswa (Aspirant)',
      email: 'student@examverse.in',
      state: 'AP',
      stateName: 'Andhra Pradesh',
      domicileState: 'AP',
      educationalQualification: "Bachelor's degree",
      degree: 'B.Tech',
      specialization: 'Computer Science and Engineering',
      graduationStatus: 'Completed',
      category: 'General',
      preferredLanguage: 'English',
      preparationLevel: 'Intermediate',
      careerInterests: ['Government Jobs', 'Engineering & PSU', 'Higher Studies'],
      age: 24,
      mobileNumber: '9876543210',
      nationality: 'Indian',
      university: 'JNTUK',
      passingYear: 2024,
      isPwD: false,
      isExServiceman: false,
    };
    localStorage.setItem('examverse_user_email', demoProfile.email);
    localStorage.setItem('examverse_remembered_name', demoProfile.fullName);
    setProfile(demoProfile);
    setIsAuthenticated(true);
    setCurrentTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeExam = exams.find((e) => e.id === activeExamId) || exams[0] || {
    id: 'upsc-cse',
    code: 'UPSC CSE',
    title: 'Civil Services Examination',
    conductingBody: 'UPSC',
    category: 'Government Recruitment',
    scope: 'All India',
    frequency: 'Annual',
    mode: 'Pen & Paper',
    shortDescription: 'IAS/IPS Examination',
    officialWebsite: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://upsc.gov.in',
    eligibility: { minQualification: 'Graduate', minAge: 21, maxAge: 32 },
    selectionProcess: [{ stage: 1, name: 'Prelims', type: 'Objective' }],
    syllabus: [{ subject: 'General Studies', topics: ['Polity', 'History'] }]
  };

  const currentStateObj = allStates.find((s) => s.code === selectedStateFilter);

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
        isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } ${isLowBandwidth ? 'low-bandwidth-mode' : ''}`}
    >
      {/* Tab: Public Landing Page */}
      {currentTab === 'landing' ? (
        <LandingPageView
          onStartOnboarding={() => {
            setCurrentTab('onboarding');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLogin={() => setAuthModalOpen(true)}
          onExploreExams={() => {
            setCurrentTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCalendar={() => {
            setCurrentTab('calendar');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenNotifications={() => setNotificationPopupOpen(true)}
          onQuickDemo={handleQuickDemo}
          exams={exams}
          notifications={notifications}
          allStates={allStates}
        />
      ) : currentTab === 'onboarding' ? (
        /* Tab: Guided 6-Step Student Onboarding Wizard */
        <GuidedOnboardingView
          onComplete={handleOnboardingComplete}
          onCancel={() => {
            setCurrentTab(isAuthenticated ? 'dashboard' : 'landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          allStates={allStates}
        />
      ) : (
        /* Authenticated & App Experience */
        <>
          {/* Global Header with Notification Bell, State Filter & Navigation */}
          <Header
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            profile={profile}
            unreadNotificationCount={unreadCount}
            onOpenNotifications={() => setNotificationPopupOpen(true)}
            onOpenProfile={() => setProfileModalOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
            onLogout={handleLogout}
            allStates={allStates}
            selectedStateFilter={selectedStateFilter}
            onChangeStateFilter={setSelectedStateFilter}
            language={language}
            onChangeLanguage={setLanguage}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            isLowBandwidth={isLowBandwidth}
            onToggleLowBandwidth={handleToggleLowBandwidth}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />

          {/* Main Content Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {initialLoading ? (
              <div className="py-24 text-center text-slate-500">
                <div className="inline-block animate-spin w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full mb-3"></div>
                <p className="text-sm font-semibold text-slate-700">Connecting to EXAMVERSE Ecosystem...</p>
                <p className="text-xs text-slate-400 mt-1">Retrieving official examination schemas and statutory eligibility rules</p>
              </div>
            ) : (
              <React.Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 space-y-4" role="status" aria-live="polite">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-500">Loading module securely...</p>
                  </div>
                }
              >
                {currentTab === 'dashboard' && (
                  <MainDashboardView
                    profile={profile}
                    exams={exams}
                    selectedExams={selectedExams}
                    dailyTargets={dailyTargets}
                    onToggleDailyTarget={handleToggleDailyTarget}
                    onAddDailyTarget={handleAddDailyTarget}
                    onSelectExam={handleSelectExamForPrep}
                    onNavigateTab={setCurrentTab}
                    notifications={notifications}
                    onOpenNotifications={() => setNotificationPopupOpen(true)}
                    selectedStateName={currentStateObj?.name || 'All India'}
                  />
                )}

                {currentTab === 'opportunity-discovery' && (
                  <OpportunityDiscoveryView
                    profile={profile}
                    allExams={exams}
                    onSelectExam={handleSelectExamForPrep}
                    onNavigateTab={setCurrentTab}
                    onOpenProfile={() => setProfileModalOpen(true)}
                  />
                )}

                {currentTab === 'simulator' && (
                  <WhatIfSimulatorView
                    profile={profile}
                    allExams={exams}
                    onSelectExam={handleSelectExamForPrep}
                    onNavigateTab={setCurrentTab}
                  />
                )}

                {currentTab === 'higher-studies' && (
                  <HigherStudiesView
                    profile={profile}
                    allExams={exams}
                    onSelectExam={handleSelectExamForPrep}
                    onNavigateTab={setCurrentTab}
                  />
                )}

                {currentTab === 'gate-hub' && (
                  <GateHubView />
                )}

                {currentTab === 'explore' && (
                  <UniversalExamCatalogView
                    allStates={allStates}
                    profile={profile}
                    onSelectExamForPrep={handleSelectExamForPrep}
                    onOpenExamDetail={(slug) => setActiveExamDetailSlug(slug)}
                  />
                )}

                {currentTab === 'recruitment-boards' && (
                  <RecruitmentBoardsView
                    allStates={allStates}
                    selectedStateFilter={selectedStateFilter}
                    onSelectStateFilter={setSelectedStateFilter}
                    onSelectExam={handleSelectExamForPrep}
                  />
                )}

                {currentTab === 'coverage-telemetry' && (
                  <CoverageTelemetryView />
                )}

                {currentTab === 'finder' && (
                  <SmartExamFinderView
                    profile={profile}
                    allStates={allStates}
                    onSelectExam={handleSelectExamForPrep}
                    onUpdateProfile={setProfile}
                  />
                )}

                {currentTab === 'universal-prep' && (
                  <UniversalExamPrepView
                    exam={activeExam as Examination}
                    allExams={exams}
                    onSelectOtherExam={setActiveExamId}
                    profile={profile}
                    onOpenMockTest={handleLaunchMock}
                    onOpenAITutor={handleLaunchAITutor}
                  />
                )}

                {currentTab === 'calendar' && (
                  <ExamCalendarView
                    allStates={allStates}
                    selectedStateFilter={selectedStateFilter}
                    onSelectExam={handleSelectExamForPrep}
                  />
                )}

                {/* Full-Screen CBT Player Overlay */}
                {activeCbtTestId && (
                  <CbtMockPlayerView
                    testId={activeCbtTestId}
                    onExit={() => setActiveCbtTestId(null)}
                    onFinish={(telemetry) => {
                      setActiveCbtTestId(null);
                      setCbtTelemetry(telemetry);
                      setCurrentTab('cbt-analysis');
                    }}
                  />
                )}

                {currentTab === 'ai-companion' && (
                  <AIAcademicCompanionView
                    initialSubject="Computer Science"
                    initialTopic="Core Engineering & Aptitude"
                    onNavigateToNotebook={() => setCurrentTab('notebook')}
                  />
                )}

                {currentTab === 'notebook' && (
                  <E2EENotebookView />
                )}

                {currentTab === 'learn' && (
                  <NationalLearningCentreView />
                )}

                {currentTab === 'planner' && (
                  <StudyPlannerView initialWeakTopics={cbtWeakTopics} />
                )}

                {currentTab === 'formulas' && (
                  <FormulaLibraryView />
                )}

                {currentTab === 'cbt-analysis' && (
                  <CbtMockAnalysisView
                    telemetry={cbtTelemetry}
                    onRetake={() => {
                      setActiveCbtTestId(cbtTelemetry?.testId || 'mock-gate-cs-cbt-sim');
                    }}
                    onGoToPlanner={(wt) => {
                      setCbtWeakTopics(wt);
                      setCurrentTab('planner');
                    }}
                    onExit={() => setCurrentTab('mock-tests')}
                  />
                )}

                {currentTab === 'mock-tests' && (
                  <MockTestsView
                    initialTestId={activeMockTestId}
                    onNavigateTab={setCurrentTab}
                    onLaunchCbt={(testId) => setActiveCbtTestId(testId)}
                  />
                )}

                {currentTab === 'performance' && (
                  <PerformanceDashboardView
                    profile={profile}
                    exams={exams}
                    onSelectExam={handleSelectExamForPrep}
                    onNavigateTab={setCurrentTab}
                  />
                )}

                {currentTab === 'career-pathways' && (
                  <CareerPathwaysGraphView />
                )}

                {currentTab === 'salary-explorer' && (
                  <SalaryAndBondExplorerView />
                )}

                {currentTab === 'checklist' && (
                  <DocumentReadinessChecklistView />
                )}

                {currentTab === 'privacy' && (
                  <PrivacySettingsView />
                )}

                {currentTab === 'aptitude' && (
                  <>
                    {aptitudeSubView === 'hub' && (
                      <AptitudeHubView
                        onNavigateTopic={handleNavigateAptitudeTopic}
                        onNavigateDrill={handleNavigateBlinkDrill}
                        onNavigateGym={handleNavigateSpeedGym}
                        onNavigateAiCoach={handleNavigateAiCoach}
                      />
                    )}
                    {aptitudeSubView === 'topic' && (
                      <AptitudeTopicDetailView
                        topicId={selectedAptitudeTopicId}
                        onBack={() => setAptitudeSubView('hub')}
                        onNavigateAiCoach={handleNavigateAiCoach}
                      />
                    )}
                    {aptitudeSubView === 'drill' && (
                      <BlinkDrillPlayerView
                        initialExamTag={drillExamTag}
                        onBack={() => setAptitudeSubView('hub')}
                        onNavigateTopic={handleNavigateAptitudeTopic}
                      />
                    )}
                    {aptitudeSubView === 'gym' && (
                      <SpeedMathGymView
                        onBack={() => setAptitudeSubView('hub')}
                      />
                    )}
                    {aptitudeSubView === 'ai-coach' && (
                      <AiTrickCoachView
                        initialQuestionId={coachQuestionId}
                        onBack={() => setAptitudeSubView('hub')}
                        onNavigateTopic={handleNavigateAptitudeTopic}
                      />
                    )}
                  </>
                )}

                {currentTab === 'career-paths' && (
                  <CareerPathsView onSelectExam={handleSelectExamForPrep} />
                )}

                {currentTab === 'ai-tutor' && (
                  <AITutorView
                    initialExamCode={aiTutorInitialExam}
                    allExams={exams}
                    profile={profile}
                  />
                )}

                {currentTab === 'notifications' && (
                  <NotificationsCenterView onSelectExam={handleSelectExamForPrep} />
                )}

                {currentTab === 'admin' && <AdminDashboardView />}
              </React.Suspense>
            )}
          </main>

          {/* Official Statutory Footer */}
          <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-10 mt-12">
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
                    Centralized Indian Examination Ecosystem. Empowering students across all 28 States and 8 Union Territories to discover, understand, and prepare for statutory examinations.
                  </p>
                </div>

                {/* Col 2 */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Examination Portals</h4>
                  <ul className="space-y-1.5 text-[11px]">
                    <li><a href="https://upsc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">UPSC Civil Services</a></li>
                    <li><a href="https://ssc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Staff Selection Commission</a></li>
                    <li><a href="https://exams.nta.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">National Testing Agency (CUET/NEET)</a></li>
                    <li><a href="https://ibps.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">IBPS Banking Recruitment</a></li>
                    <li><a href="https://rrbapply.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Railway Recruitment Boards</a></li>
                  </ul>
                </div>

                {/* Col 3 */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">State PSC Networks</h4>
                  <ul className="space-y-1.5 text-[11px]">
                    <li><a href="https://psc.ap.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Andhra Pradesh PSC (APPSC)</a></li>
                    <li><a href="https://websitenew.tspsc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Telangana PSC (TGPSC)</a></li>
                    <li><a href="https://tnpsc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Tamil Nadu PSC (TNPSC)</a></li>
                    <li><a href="https://kpsc.kar.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Karnataka PSC (KPSC)</a></li>
                    <li><a href="https://mpsc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Maharashtra PSC (MPSC)</a></li>
                  </ul>
                </div>

                {/* Col 4 */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Integrity & Disclaimers</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    All examination dates, syllabi, eligibility criteria, and cutoffs are compiled directly from official gazette notifications published by respective conducting authorities. EXAMVERSE does not publish AI-generated dates as official facts.
                  </p>
                  <div className="mt-3 flex items-center space-x-1.5 text-[10px] text-emerald-400">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Statutory Information Verified</span>
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
        </>
      )}

      {/* Global Notification Bell Popup (Accessible from ANY page!) */}
      <GlobalNotificationPopup
        isOpen={notificationPopupOpen}
        onClose={() => setNotificationPopupOpen(false)}
        onSelectExam={handleSelectExamForPrep}
      />

      {/* 7-Layer Master Relational Examination Detail Modal */}
      <ExamDetailModal
        slug={activeExamDetailSlug}
        onClose={() => setActiveExamDetailSlug(null)}
        onSelectForPrep={handleSelectExamForPrep}
      />

      {/* Student Profile & Onboarding Settings Modal */}
      <StudentProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        onProfileUpdated={setProfile}
        allStates={allStates}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Student Authentication & Account Switching Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        allStates={allStates}
      />

      {/* Global Cmd/Ctrl + K Quick Command Palette (Omnibar) */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigateTab={setCurrentTab}
        onSelectExam={handleSelectExamForPrep}
        onSelectGatePaper={() => {
          setCurrentTab('gate-hub');
        }}
        onSelectAptitudeTopic={handleNavigateAptitudeTopic}
      />
    </div>
  );
}

export default App;
