import React, { useState } from 'react';
import {
  Factory,
  Tractor,
  Rocket,
  FlaskConical,
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Package,
  Leaf,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useI18n } from '../../locales/i18n.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { UserRole, FoodTrackMode, SupportedLanguage } from '../../types/index.ts';

interface RoleLoginViewProps {
  onLoginSuccess?: () => void;
}

export const RoleLoginView: React.FC<RoleLoginViewProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const { theme, setTheme } = useTheme();

  const [selectedRole, setSelectedRole] = useState<UserRole>('industry');
  const [selectedTrack, setSelectedTrack] = useState<FoodTrackMode>('packaged');
  const [userName, setUserName] = useState('');
  const [userOrg, setUserOrg] = useState('');

  const roles = [
    {
      id: 'industry' as UserRole,
      title: language === 'hi' ? 'खाद्य उद्योग (Industries)' : language === 'mr' ? 'अन्न उद्योग (Industries)' : 'Food Industries & FMCG',
      subtitle: language === 'hi' ? 'बड़े व मध्यम प्रसंस्करणकर्ता, शेल्फ-लाइफ व FSSAI अनुपालन' : language === 'mr' ? 'मोठे व मध्यम प्रक्रिया उद्योग, शेल्फ-लाइफ व FSSAI नियम' : 'High-volume processors, FSSAI compliance, cost & barrier optimization',
      defaultName: 'Vikramaditya Singhania',
      defaultOrg: 'Apex FMCG Food Processing Ltd.',
      icon: Factory,
      defaultTrack: 'packaged' as FoodTrackMode,
      badge: 'High-Volume & Retort',
      accent: 'border-emerald-600 bg-white dark:bg-[#0a3324] text-slate-900 dark:text-emerald-100 shadow-md ring-2 ring-emerald-500/20'
    },
    {
      id: 'farmer' as UserRole,
      title: language === 'hi' ? 'किसान व FPO (Farmers)' : language === 'mr' ? 'शेतकरी व FPO (Farmers)' : 'Farmers & FPO Co-ops',
      subtitle: language === 'hi' ? 'बागवानी, ताजा उपज, शीत-श्रृंखला व श्वसन सुरक्षा' : language === 'mr' ? 'ताजी फळे व भाज्या, शीत-साखळी व हवा खेळती राहणारे पॅकिंग' : 'Fresh produce growers, cold-chain storage, breathable MAP produce bags',
      defaultName: 'Balasaheb Shinde',
      defaultOrg: 'Sahyadri Farmers Producer Co-op (FPO)',
      icon: Tractor,
      defaultTrack: 'fresh' as FoodTrackMode,
      badge: 'Post-Harvest & Cold-Chain',
      accent: 'border-lime-600 bg-white dark:bg-[#0d3b2b] text-slate-900 dark:text-lime-100 shadow-md ring-2 ring-lime-500/20'
    },
    {
      id: 'startup' as UserRole,
      title: language === 'hi' ? 'फूड स्टार्टअप्स (Startups)' : language === 'mr' ? 'फूड स्टार्टअप्स (Startups)' : 'Food Startups & D2C',
      subtitle: language === 'hi' ? 'उभरते डी2सी ब्रांड्स, सस्टेनेबल मोनो-पीई, लंबी शेल्फ-लाइफ' : language === 'mr' ? 'नवीन डी२सी ब्रँड्स, पर्यावरणस्नेही पॅकिंग, जादा टिकण्याची मुदत' : 'D2C snack brands, recyclable mono-materials (MDO-PE), lab trials',
      defaultName: 'Ananya Mehta',
      defaultOrg: 'Krunchy D2C Health Foods',
      icon: Rocket,
      defaultTrack: 'packaged' as FoodTrackMode,
      badge: 'D2C & Eco-Innovation',
      accent: 'border-amber-600 bg-white dark:bg-[#2b260d] text-slate-900 dark:text-amber-100 shadow-md ring-2 ring-amber-500/20'
    },
    {
      id: 'researcher' as UserRole,
      title: language === 'hi' ? 'शोधकर्ता व लैब्स (Researchers)' : language === 'mr' ? 'संशोधक व लॅब (Researchers)' : 'Researchers & Labs',
      subtitle: language === 'hi' ? 'ASTM D3985 OTR / F1249 WVTR, TOPSIS मैट्रिक्स व सत्यापन' : language === 'mr' ? 'ASTM चाचण्या, TOPSIS निकष व प्रयोगशाळा तपासणी' : 'Packaging scientists, ASTM barrier test methods, TOPSIS math & migration',
      defaultName: 'Dr. Priya Raghavan',
      defaultOrg: 'CSIR Packaging Technology Research Division',
      icon: FlaskConical,
      defaultTrack: 'packaged' as FoodTrackMode,
      badge: 'ASTM & Biophysics',
      accent: 'border-teal-600 bg-white dark:bg-[#093530] text-slate-900 dark:text-teal-100 shadow-md ring-2 ring-teal-500/20'
    }
  ];

  const handleRoleSelect = (role: UserRole, defTrack: FoodTrackMode) => {
    setSelectedRole(role);
    setSelectedTrack(defTrack);
  };

  const handleQuickLogin = (role: UserRole) => {
    const r = roles.find(item => item.id === role)!;
    login(role, r.defaultName, undefined, r.defaultOrg, r.defaultTrack);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const r = roles.find(item => item.id === selectedRole)!;
    login(
      selectedRole,
      userName.trim() || r.defaultName,
      undefined,
      userOrg.trim() || r.defaultOrg,
      selectedTrack
    );
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center bg-white dark:bg-[#061d15] text-slate-900 dark:text-emerald-50 transition-colors">
      {/* Top Header Utilities: Dark/Light Mode & Language */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
              BioPack <span className="text-emerald-600 dark:text-emerald-400">AI</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-emerald-300/70">
              Evidence-Grounded Food Packaging Intelligence
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Dark / Light Mode Switcher: 100% Foolproof and Clear */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-[#134937] bg-slate-100 dark:bg-[#061e16] p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-emerald-400/60 dark:hover:text-emerald-200'
              }`}
              title="Light Mode (Crisp Pure White Background)"
              aria-label="Set Light Mode"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#0d3b2b] text-emerald-300 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-emerald-400/60 dark:hover:text-emerald-200'
              }`}
              title="Dark Mode (Greenish Slate Theme)"
              aria-label="Set Dark Mode"
            >
              <Moon className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#082a1f] p-0.5 text-xs font-semibold">
            {(['en', 'hi', 'mr'] as SupportedLanguage[]).map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-white dark:bg-[#114b37] text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-emerald-300/70 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Login Box */}
      <div className="w-full max-w-4xl bg-white dark:bg-[#09271d] rounded-3xl border-2 border-slate-200 dark:border-[#134937] shadow-xl p-6 sm:p-10 space-y-8">
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0c3829] border border-slate-200 dark:border-[#1b5e46] text-slate-800 dark:text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Role-Based Food Packaging Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {language === 'hi'
              ? 'खाद्य पारिस्थितिकी तंत्र में अपनी भूमिका चुनें'
              : language === 'mr'
              ? 'अन्न परिसंस्थेत आपली भूमिका निवडा'
              : 'Select Your Role in the Food Ecosystem'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-200/80">
            {language === 'hi'
              ? 'बायोपैक एआई आपकी भूमिका के आधार पर पैकेजिंग नियम, बाधा गणना और सत्यापन योजनाएं अनुकूलित करता है।'
              : language === 'mr'
              ? 'बायोपॅक एआय आपल्या भूमिकेनुसार पॅकेजिंग नियम, बॅरियर आवश्यकता आणि चाचणी आराखडा ठरवते.'
              : 'BioPack AI tailors biophysical barrier constraints, deterministic checks, and shelf-life predictions to your operational role.'}
          </p>
        </div>

        {/* Step 1: Select Role */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-emerald-300">
              {language === 'hi' ? '1. अपनी कार्य प्रणाली (भूमिका) चुनें' : language === 'mr' ? '१. आपली कामाची भूमिका निवडा' : '1. Choose Your Operational Role'}
            </label>
            <span className="text-xs text-slate-400 dark:text-emerald-400/80">
              {language === 'hi' ? 'चयन के लिए कार्ड पर क्लिक करें' : language === 'mr' ? 'निवडीसाठी कार्डवर क्लिक करा' : 'Click a card to select'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map(r => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id, r.defaultTrack)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? r.accent
                      : 'border-slate-200 dark:border-[#134937] hover:border-slate-300 dark:hover:border-[#1b5e46] bg-white dark:bg-[#072218] opacity-85 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0a2f22] shadow-2xs">
                          <Icon className="w-5 h-5 text-slate-800 dark:text-emerald-200" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                            {r.title}
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-emerald-950 text-slate-700 dark:text-emerald-300">
                            {r.badge}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-emerald-200/80 mt-3 leading-relaxed">
                      {r.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-[#134937] flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-emerald-300/70">
                      {language === 'hi' ? 'डिफ़ॉल्ट:' : language === 'mr' ? 'डिफॉल्ट:' : 'Default:'} <strong className="text-slate-800 dark:text-emerald-200">{r.defaultName.split(' ')[0]}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickLogin(r.id);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <span>{language === 'hi' ? '1-क्लिक प्रवेश' : language === 'mr' ? '१-क्लिक प्रवेश' : '1-Click Login'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Operational Track (Packaged vs Fresh) */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#061e16] border border-slate-200 dark:border-[#134937] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300">
              {language === 'hi' ? '2. प्रारंभिक कार्यप्रणाली मोड' : language === 'mr' ? '२. प्राथमिक कार्यपद्धती मोड' : '2. Initial Operational Mode'}
            </label>
            <span className="text-xs text-slate-500 dark:text-emerald-400/80">
              {language === 'hi' ? 'होम पेज पर कभी भी बदला जा सकता है' : language === 'mr' ? 'होम पेजवर कधीही बदलता येतो' : 'Can also be switched on Home Page anytime'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Packaged Food */}
            <div
              onClick={() => setSelectedTrack('packaged')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                selectedTrack === 'packaged'
                  ? 'border-emerald-600 bg-white dark:bg-[#0a2f22] text-emerald-950 dark:text-white shadow-xs ring-1 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-[#134937] bg-white/70 dark:bg-[#072218] text-slate-600 dark:text-emerald-200/70 hover:bg-white dark:hover:bg-[#0a2f22]'
              }`}
            >
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t.track.packaged}</span>
                  {selectedTrack === 'packaged' && (
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                      {language === 'hi' ? 'चयनित' : language === 'mr' ? 'निवडलेले' : 'Selected'}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-emerald-300/80 mt-1">
                  {language === 'hi'
                    ? 'सूखे खाद्य, नमकीन, मसाले, अनाज, दालें, पनीर व मिठाइयाँ। सख्त OTR / WVTR बैरियर अनुकूलन।'
                    : language === 'mr'
                    ? 'सुका खाऊ, मसाले, धान्ये, डाळी, पनीर व मिठाई. कडक OTR / WVTR बॅरियर निकष.'
                    : 'Dry foods, fried snacks, spices, grains, pulses, dairy paneer & sweets. Strict OTR/WVTR barrier optimization.'}
                </div>
              </div>
            </div>

            {/* Fresh Food */}
            <div
              onClick={() => setSelectedTrack('fresh')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                selectedTrack === 'fresh'
                  ? 'border-lime-600 bg-white dark:bg-[#0a2f22] text-lime-950 dark:text-white shadow-xs ring-1 ring-lime-500/30'
                  : 'border-slate-200 dark:border-[#134937] bg-white/70 dark:bg-[#072218] text-slate-600 dark:text-emerald-200/70 hover:bg-white dark:hover:bg-[#0a2f22]'
              }`}
            >
              <div className="p-2 rounded-lg bg-lime-100 dark:bg-lime-950 text-lime-700 dark:text-lime-300 shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t.track.fresh}</span>
                  {selectedTrack === 'fresh' && (
                    <span className="text-[10px] bg-lime-600 text-white px-1.5 py-0.2 rounded font-bold">
                      {language === 'hi' ? 'चयनित' : language === 'mr' ? 'निवडलेले' : 'Selected'}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-emerald-300/80 mt-1">
                  {language === 'hi'
                    ? 'ताजे फल, जीवित सब्जियां व हरी पत्तियां। संतुलित MAP श्वसन, गैस संतुलन एवं शीत-क्षति चेतावनियां।'
                    : language === 'mr'
                    ? 'ताजी फळे व भाज्या. संतुलित MAP श्वसन, वायू संतुलन व शीत-हानी चेतावणी.'
                    : 'Fresh fruits, living vegetables & leafy crops. Equilibrium MAP respiration, gas dynamics, and chilling injury alerts.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Credentials Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4 pt-2 border-t border-slate-100 dark:border-[#134937]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-emerald-200 font-semibold mb-1">
                {language === 'hi' ? 'आपका नाम (वैकल्पिक)' : language === 'mr' ? 'आपले नाव (ऐच्छिक)' : 'Your Name (Optional — press Enter for preset)'}
              </label>
              <input
                type="text"
                placeholder={roles.find(r => r.id === selectedRole)?.defaultName}
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-emerald-200 font-semibold mb-1">
                {language === 'hi' ? 'संस्थान / कंपनी / FPO (वैकल्पिक)' : language === 'mr' ? 'संस्था / कंपनी / FPO (ऐच्छिक)' : 'Organization / Company / FPO (Optional)'}
              </label>
              <input
                type="text"
                placeholder={roles.find(r => r.id === selectedRole)?.defaultOrg}
                value={userOrg}
                onChange={e => setUserOrg(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500 dark:text-emerald-300/70">
              {language === 'hi' ? 'चयनित:' : language === 'mr' ? 'निवडलेले:' : 'Selected:'} <strong className="text-emerald-800 dark:text-emerald-300 capitalize">{selectedRole}</strong> • {language === 'hi' ? 'मोड:' : language === 'mr' ? 'मोड:' : 'Mode:'} <strong className="text-emerald-800 dark:text-emerald-300 capitalize">{selectedTrack === 'fresh' ? t.track.fresh : t.track.packaged}</strong>
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'hi' ? 'बायोपैक डैशबोर्ड में प्रवेश करें' : language === 'mr' ? 'बायोपॅक डॅशबोर्डमध्ये प्रवेश करा' : 'Enter BioPack Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
