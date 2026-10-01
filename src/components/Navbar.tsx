import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Globe,
  Sliders,
  FileText,
  Activity,
  Award,
  Layers,
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
  LogOut
} from 'lucide-react';
import { useI18n } from '../locales/i18n.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { SupportedLanguage } from '../types/index.ts';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenRoleModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab
}) => {
  const { language, setLanguage, t } = useI18n();
  const { theme, themeMode, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sensible, logical workflow sequence:
  // 1. Home (Overview & Workspace)
  // 2. Food Database & Benchmarks (Explore baseline foods, water activity, shelf-life, and standard materials)
  // 3. Audit Packaging (Audit current packaging against baseline criteria)
  // 4. Analyze MyFood (Deep 5-step scientific barrier & material calculation for custom food/formulation)
  // 5. Compare Materials (Side-by-side material technical trade-offs)
  // 6. Fresh Produce / MAP (Specialized living crop respiration & equilibrium packaging)
  const mainNavItems = [
    { id: 'home', label: t.nav.home },
    { id: 'benchmarks', label: t.nav.benchmarks },
    { id: 'audit', label: t.nav.audit },
    { id: 'analyze', label: t.nav.analyze },
    { id: 'compare', label: t.nav.compare },
    { id: 'fresh_produce', label: t.nav.freshProduce }
  ];

  // Secondary & advanced scientific tools in More dropdown
  const moreNavItems = [
    { id: 'validation', label: t.nav.validation, icon: Award },
    { id: 'what_if', label: t.nav.whatIf, icon: Sliders },
    { id: 'spec', label: t.nav.spec, icon: FileText },
    { id: 'reports', label: t.nav.reports, icon: FileText },
    { id: 'status', label: t.nav.status, icon: Activity },
    { id: 'knowledge', label: t.nav.knowledge, icon: Layers }
  ];

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMoreOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#07241a]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-[#103e2e] transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => handleSelectTab('home')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-emerald-100">
                  BioPack <span className="text-emerald-700 dark:text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-emerald-950/80 text-slate-700 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800 hidden sm:inline-block">
                  FoodTech
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-emerald-300/70 leading-none hidden md:block">
                {t.app.positioning}
              </p>
            </div>
          </div>

          {/* Primary Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 dark:bg-emerald-950/80 text-slate-900 dark:text-emerald-300 border border-slate-300 dark:border-emerald-700 font-bold'
                      : 'text-slate-600 dark:text-emerald-200/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c3527]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* "More Tools" Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  moreNavItems.some(i => i.id === currentTab)
                    ? 'bg-slate-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-slate-300 dark:border-emerald-700 font-bold'
                    : 'text-slate-600 dark:text-emerald-200/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c3527]'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#082a1f] rounded-2xl shadow-xl border border-slate-200 dark:border-[#134937] py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsMoreOpen(false)}
                >
                  {moreNavItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-slate-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold'
                            : 'text-slate-700 dark:text-emerald-100/90 hover:bg-slate-50 dark:hover:bg-[#0d3b2b]'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-slate-400 dark:text-emerald-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls: Dark/Light Mode Segmented + Language Selector + Logout */}
          <div className="flex items-center gap-2">
            {/* Segmented Light / Dark / System Mode Switcher */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-[#134937] bg-slate-100 dark:bg-[#061e16] p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-emerald-400/60 dark:hover:text-emerald-200'
                }`}
                title="Light Mode (Crisp Pure White)"
                aria-label="Set Light Mode"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-[#0d3b2b] text-emerald-300 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-emerald-400/60 dark:hover:text-emerald-200'
                }`}
                title="Dark Mode (Greenish Bio-Tech Theme)"
                aria-label="Set Dark Mode"
              >
                <Moon className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline">Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  themeMode === 'system'
                    ? 'bg-white dark:bg-[#0d3b2b] text-slate-900 dark:text-emerald-300 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-emerald-400/60 dark:hover:text-emerald-200'
                }`}
                title="System Default (Follow OS Theme)"
                aria-label="Follow System Theme"
              >
                <Laptop className="w-3.5 h-3.5 text-slate-400 dark:text-emerald-400" />
                <span className="hidden sm:inline">Auto</span>
              </button>
            </div>

            {/* Trilingual Language Selector */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-[#134937] bg-slate-100 dark:bg-[#082a1f] p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-[#114b37] text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-emerald-300/70 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-white dark:bg-[#114b37] text-slate-900 dark:text-emerald-200 shadow-xs font-bold'
                    : 'text-slate-500 dark:text-emerald-300/70 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('mr')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'mr'
                    ? 'bg-white dark:bg-[#114b37] text-slate-900 dark:text-emerald-200 shadow-xs font-bold'
                    : 'text-slate-500 dark:text-emerald-300/70 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Sign Out Button (No industry toggle in upper dashboard) */}
            {user && (
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#134937] bg-white dark:bg-[#082a1f] text-slate-500 dark:text-emerald-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-[#0c3829] transition-colors cursor-pointer shadow-2xs"
                title={`Sign out (${user.name})`}
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-emerald-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0c3527] cursor-pointer"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 dark:border-[#103e2e] space-y-1">
            <div className="grid grid-cols-2 gap-1 mb-2">
              {mainNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    currentTab === item.id
                      ? 'bg-slate-100 dark:bg-emerald-950 text-slate-900 dark:text-emerald-300 border border-slate-300 dark:border-emerald-700 font-bold'
                      : 'text-slate-700 dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-[#0c3527]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-[#103e2e]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400/80 px-3">
                More Tools & Analysis
              </span>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {moreNavItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                      currentTab === item.id
                        ? 'bg-slate-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold'
                        : 'text-slate-600 dark:text-emerald-200/80 hover:bg-slate-50 dark:hover:bg-[#0c3527]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
