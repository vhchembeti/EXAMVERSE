// client/src/components/Header.tsx
// Professional Human-Designed Header for EXAMVERSE
// Features clean typography, navy primary color, global notification popup trigger,
// state/all-india discovery switcher, language selector, and navigation bar.

import React, { useState } from 'react';
import {
  Bell,
  Search,
  Compass,
  BookOpen,
  Calendar,
  Award,
  Layers,
  GraduationCap,
  Sparkles,
  Shield,
  User,
  Globe,
  MapPin,
  ChevronDown,
  Menu,
  X,
  BarChart2,
  LogOut,
  Settings,
  Moon,
  Sun,
  Zap,
  Building2,
  Activity,
  Scale,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { StudentProfile, SupportedLanguage, IndianState, calculateProfileCompletion } from '../types';
import { SUPPORTED_LANGUAGES, LanguageCode, isLanguageRTL } from '../services/i18n';
import { AntiScamBanner } from './AntiScamBanner';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: StudentProfile;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onLogout?: () => void;
  allStates: IndianState[];
  selectedStateFilter: string; // "ALL" or state code
  onChangeStateFilter: (code: string) => void;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  isLowBandwidth?: boolean;
  onToggleLowBandwidth?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  profile,
  unreadNotificationCount,
  onOpenNotifications,
  onOpenProfile,
  onOpenAuth,
  onLogout,
  allStates,
  selectedStateFilter,
  onChangeStateFilter,
  language,
  onChangeLanguage,
  isDarkMode = false,
  onToggleDarkMode,
  isLowBandwidth = false,
  onToggleLowBandwidth,
  onOpenCommandPalette,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const profileCompletionPercent = calculateProfileCompletion(profile);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'aptitude', label: 'Universal Aptitude & Blink Gym', icon: Zap },
    { id: 'ai-companion', label: 'AI Companion', icon: Sparkles },
    { id: 'notebook', label: 'E2EE Notebook', icon: Shield },
    { id: 'learn', label: 'Learning Centre', icon: GraduationCap },
    { id: 'mock-tests', label: 'CBT Mocks', icon: Award },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'formulas', label: 'Formula Vault', icon: BookOpen },
    { id: 'opportunity-discovery', label: 'Opportunity Discovery', icon: Sparkles },
    { id: 'career-pathways', label: 'Career Pathways (DAG)', icon: Compass },
    { id: 'salary-explorer', label: '7th CPC & PSU Salary', icon: Scale },
    { id: 'checklist', label: 'Document Checklist', icon: CheckCircle2 },
    { id: 'simulator', label: 'Career Simulator', icon: Compass },
    { id: 'gate-hub', label: 'GATE Hub', icon: Scale },
    { id: 'explore', label: 'Exam Directory', icon: BookOpen },
    { id: 'recruitment-boards', label: 'Recruitment Boards', icon: Building2 },
    { id: 'higher-studies', label: 'Higher Studies & PG', icon: GraduationCap },
    { id: 'finder', label: 'Exam Finder', icon: Compass },
    { id: 'universal-prep', label: 'Universal Prep', icon: BookOpen },
    { id: 'calendar', label: 'Exam Calendar', icon: Calendar },
    { id: 'notifications', label: 'Corrigenda & Notices', icon: Bell },
    { id: 'performance', label: 'Performance', icon: BarChart2 },
    { id: 'coverage-telemetry', label: 'Coverage Telemetry', icon: Activity },
    { id: 'privacy', label: 'Privacy & DPDP Ledger', icon: Lock },
    { id: 'ai-tutor', label: 'AI Study Assistant', icon: Sparkles },
    { id: 'admin', label: 'Admin', icon: Shield },
  ];

  const currentStateObj = allStates.find((s) => s.code === selectedStateFilter);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Statutory Anti-Scam Official Domain Verification Banner */}
      <AntiScamBanner />

      {/* Top Utility & Identity Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                  EXAM<span className="text-blue-900">VERSE</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  INDIA
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block tracking-tight">
                Every Exam. Every Opportunity. One Platform.
              </p>
            </div>
          </div>

          {/* Right Controls: Quick Command Bar, State Filter, Bell, Language, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Command Omnibar Trigger Button (Cmd/Ctrl + K) */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-700 transition shadow-2xs"
              title="Open Command Bar (Cmd/Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-blue-900 shrink-0" />
              <span className="hidden md:inline text-slate-700">Jump to Exam / Tool...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white text-[10px] font-mono text-slate-500 border border-slate-300">
                ⌘K
              </kbd>
            </button>

            {/* Geographical Discovery Dropdown (ALL INDIA vs MY STATE) */}
            <div className="relative">
              <button
                onClick={() => {
                  setStateDropdownOpen(!stateDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className={`flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition ${
                  selectedStateFilter === 'ALL'
                    ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                    : 'bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100'
                }`}
                title="Geographical Exam Discovery Filter"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-900" />
                <span className="max-w-[110px] sm:max-w-none truncate">
                  {selectedStateFilter === 'ALL' ? '🇮🇳 All India' : `🏛️ ${currentStateObj?.name || selectedStateFilter}`}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {stateDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Geographical Scope
                  </div>
                  <button
                    onClick={() => {
                      onChangeStateFilter('ALL');
                      setStateDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                      selectedStateFilter === 'ALL' ? 'text-blue-900 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>🇮🇳 ALL INDIA (National & Interstate)</span>
                    {selectedStateFilter === 'ALL' && <span className="text-[10px] text-blue-900 font-bold">ACTIVE</span>}
                  </button>

                  <div className="px-3 py-1.5 border-t border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                    My State & UTs (28 States + 8 UTs)
                  </div>

                  {allStates.map((st) => (
                    <button
                      key={st.code}
                      onClick={() => {
                        onChangeStateFilter(st.code);
                        setStateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        selectedStateFilter === st.code ? 'text-blue-900 font-bold bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{st.name}</span>
                      <span className="text-[10px] text-slate-400">{st.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher with 13 Indian Languages */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setStateDropdownOpen(false);
                }}
                className="flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 animate-fade-in text-xs max-h-72 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    13 Indian Languages
                  </div>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onChangeLanguage(l.name as SupportedLanguage);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium flex items-center justify-between ${
                        language === l.name ? 'text-blue-900 font-bold bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.nativeName} ({l.name})</span>
                      {l.isRTL && <span className="text-[9px] px-1 rounded bg-slate-100 text-slate-500 font-bold">RTL</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            )}

            {/* Low-Bandwidth Mode Toggle */}
            {onToggleLowBandwidth && (
              <button
                onClick={onToggleLowBandwidth}
                className={`flex items-center space-x-1 text-xs px-2 py-1.5 rounded-lg border transition ${
                  isLowBandwidth
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title={isLowBandwidth ? 'Low-Bandwidth Mode: Active (Low-Data / 2G/3G optimized)' : 'Enable Low-Bandwidth Mode'}
              >
                <Zap className={`w-3.5 h-3.5 ${isLowBandwidth ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'}`} />
                <span className="hidden xl:inline text-[11px]">{isLowBandwidth ? 'Low-Data ON' : 'Low-Data'}</span>
              </button>
            )}

            {/* Global Notification Bell with Unread Badge (Accessible from EVERY page!) */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              aria-label="Active Notifications"
              title="Active Notifications (UPSC, NTA, State PSCs)"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-900 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Student Profile Avatar & Settings */}
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-800 transition"
              title="Student Profile & Eligibility Settings"
            >
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {profile.fullName ? profile.fullName.charAt(0) : 'S'}
              </div>
              <div className="text-left hidden md:block">
                <div className="flex items-center space-x-1.5">
                  <p className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[120px]">{profile.fullName || 'Student'}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                    profileCompletionPercent === 100
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-blue-50 text-blue-900 border-blue-200'
                  }`}>
                    {profileCompletionPercent}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5 truncate max-w-[130px]">{profile.degree || profile.educationalQualification || 'Profile'}</p>
              </div>
            </button>

            {/* Sign In / Switch Account Button */}
            <button
              onClick={onOpenAuth}
              className="hidden sm:inline-flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg border border-blue-900/20 bg-blue-50/50 hover:bg-blue-100/70 text-blue-900 font-semibold transition"
              title="Sign In, Register or Switch Account"
            >
              <User className="w-3.5 h-3.5" />
              <span>Switch</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                if (onLogout) {
                  onLogout();
                } else {
                  localStorage.removeItem('examverse_user_email');
                  localStorage.removeItem('examverse_remembered_name');
                  onOpenAuth();
                }
              }}
              className="hidden lg:inline-flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 font-medium transition"
              title="Sign Out of Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Ribbon (Desktop) */}
      <nav className="hidden md:block bg-slate-900 text-slate-200 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 lg:space-x-2 py-1.5 overflow-x-auto text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition ${
                    isActive
                      ? 'bg-blue-800 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-slate-200 px-4 py-3 space-y-1 border-t border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left ${
                  isActive ? 'bg-blue-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-300" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
