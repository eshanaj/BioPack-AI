import React, { useState } from 'react';
import {
  Factory,
  Tractor,
  Rocket,
  FlaskConical,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Package,
  Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useI18n } from '../locales/i18n.tsx';
import { UserRole, FoodTrackMode } from '../types/index.ts';

interface RoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({ isOpen, onClose }) => {
  const { user, login } = useAuth();
  const { language } = useI18n();

  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'industry');
  const [selectedTrack, setSelectedTrack] = useState<FoodTrackMode>(user?.selectedTrack || 'packaged');
  const [userName, setUserName] = useState('');
  const [userOrg, setUserOrg] = useState('');

  if (!isOpen) return null;

  const roles = [
    {
      id: 'industry' as UserRole,
      title: language === 'hi' ? 'खाद्य उद्योग (Industries)' : language === 'mr' ? 'अन्न उद्योग (Industries)' : 'Food Industries & FMCG',
      subtitle: language === 'hi' ? 'बड़े व मध्यम खाद्य प्रसंस्करणकर्ता, कॉन्ट्रैक्ट पैकर्स' : language === 'mr' ? 'मोठे व मध्यम अन्न प्रक्रिया उद्योग, कंत्राटी पॅकर्स' : 'Large & Medium Processors, FMCG Brands',
      icon: Factory,
      defaultTrack: 'packaged' as FoodTrackMode,
      color: 'border-blue-500 bg-white dark:bg-blue-950/30 text-slate-900 dark:text-blue-300 shadow-sm ring-2 ring-blue-500/20'
    },
    {
      id: 'farmer' as UserRole,
      title: language === 'hi' ? 'किसान व FPO (Farmers)' : language === 'mr' ? 'शेतकरी व FPO (Farmers)' : 'Farmers & FPO Groups',
      subtitle: language === 'hi' ? 'कृषि उत्पादक समूह, बागवानी, ताजा उपज किसान' : language === 'mr' ? 'शेतकरी उत्पादक संस्था, ताजी फळे व भाजीपाला उत्पादक' : 'Farmer Producer Orgs, Fresh Produce Growers',
      icon: Tractor,
      defaultTrack: 'fresh' as FoodTrackMode,
      color: 'border-emerald-500 bg-white dark:bg-emerald-950/30 text-slate-900 dark:text-emerald-300 shadow-sm ring-2 ring-emerald-500/20'
    },
    {
      id: 'startup' as UserRole,
      title: language === 'hi' ? 'फूड स्टार्टअप्स (Startups)' : language === 'mr' ? 'फूड स्टार्टअप्स (Startups)' : 'Food Startups & D2C',
      subtitle: language === 'hi' ? 'उभरते डी2सी ब्रांड्स, हस्तनिर्मित स्नैक निर्माता' : language === 'mr' ? 'नवीन डी२सी ब्रँड्स, नाविन्यपूर्ण खाद्य उत्पादक' : 'Emerging D2C Brands, Artisanal Snack Makers',
      icon: Rocket,
      defaultTrack: 'packaged' as FoodTrackMode,
      color: 'border-amber-500 bg-white dark:bg-amber-950/30 text-slate-900 dark:text-amber-300 shadow-sm ring-2 ring-amber-500/20'
    },
    {
      id: 'researcher' as UserRole,
      title: language === 'hi' ? 'शोधकर्ता व लैब्स (Researchers)' : language === 'mr' ? 'संशोधक व लॅब (Researchers)' : 'Researchers & Technologists',
      subtitle: language === 'hi' ? 'फूड टेक्नोलॉजिस्ट्स, पैकेजिंग वैज्ञानिक, परीक्षण लैब्स' : language === 'mr' ? 'अन्न तंत्रज्ञान तज्ज्ञ, पॅकेजिंग शास्त्रज्ञ, चाचणी प्रयोगशाळा' : 'Food Technologists, QA Scientists, Academic Labs',
      icon: FlaskConical,
      defaultTrack: 'packaged' as FoodTrackMode,
      color: 'border-purple-500 bg-white dark:bg-purple-950/30 text-slate-900 dark:text-purple-300 shadow-sm ring-2 ring-purple-500/20'
    }
  ];

  const handleRoleSelect = (role: UserRole, defTrack: FoodTrackMode) => {
    setSelectedRole(role);
    setSelectedTrack(defTrack);
  };

  const handleConfirmLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole, userName, undefined, userOrg, selectedTrack);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-emerald-950 text-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800">
                User Access Profile
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Select Your Role in the Food Ecosystem
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleConfirmLogin} className="p-6 space-y-6">
          {/* Step 1: Role Selection Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              1. Choose Profile Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map(r => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id, r.defaultTrack)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? `${r.color} shadow-sm ring-2 ring-emerald-500/20`
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-2xs">
                        <Icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {r.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {r.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Operational Mode (Mode A: Packaged vs Mode B: Fresh) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Operational Track
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Determines active commodities & rules
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Mode A: Packaged Food */}
              <div
                onClick={() => setSelectedTrack('packaged')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  selectedTrack === 'packaged'
                    ? 'border-emerald-600 bg-white dark:bg-slate-800 text-emerald-950 dark:text-emerald-100 shadow-xs ring-1 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-emerald-950/50 text-slate-700 dark:text-emerald-400 shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    Mode A: Packaged Food
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Dry foods, high-fat snacks, spices, grains, sweets, retort & dairy
                  </div>
                </div>
              </div>

              {/* Mode B: Fresh Food */}
              <div
                onClick={() => setSelectedTrack('fresh')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  selectedTrack === 'fresh'
                    ? 'border-emerald-600 bg-white dark:bg-slate-800 text-emerald-950 dark:text-emerald-100 shadow-xs ring-1 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-lime-50 dark:bg-lime-950/50 text-lime-700 dark:text-lime-400 shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    Mode B: Fresh Food
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Fresh fruits, vegetables, living produce, MAP breathability & chilling guard
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                Your Name / User (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Vikramaditya / Ananya"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                Organization / Company / FPO (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sahyadri FPO / Apex Foods"
                value={userOrg}
                onChange={e => setUserOrg(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Role switches dashboard & commodity priority
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
