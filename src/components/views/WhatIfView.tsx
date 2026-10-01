import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useI18n } from '../../locales/i18n.tsx';
import { COMMODITIES } from '../../data/commodities.ts';
import { Commodity, StorageCondition, TopsisPriority } from '../../types/index.ts';
import { generatePackagingRecommendation } from '../../engine/recommend.ts';
import { VoiceButton } from '../VoiceButton.tsx';

interface WhatIfViewProps {
  initialCommodity?: Commodity;
  initialStorage?: StorageCondition;
}

export const WhatIfView: React.FC<WhatIfViewProps> = ({
  initialCommodity,
  initialStorage
}) => {
  const { t, language } = useI18n();

  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(
    initialCommodity?.id || 'potato_chips'
  );
  const [tempC, setTempC] = useState<number>(initialStorage?.temperatureC || 25);
  const [rhPercent, setRhPercent] = useState<number>(initialStorage?.relativeHumidity || 65);
  const [targetDays, setTargetDays] = useState<number>(initialStorage?.targetShelfLifeDays || 180);
  const [thicknessDeltaPercent, setThicknessDeltaPercent] = useState<number>(0);
  const [priority, setPriority] = useState<TopsisPriority>('balanced');

  const selectedCommodity =
    COMMODITIES.find(c => c.id === selectedCommodityId) || COMMODITIES[0];

  // Baseline standard recommendation
  const baselineStorage: StorageCondition = {
    temperatureC: 25,
    relativeHumidity: 60,
    storageMode: 'ambient',
    sunlightExposure: 'indirect',
    handlingStress: 'standard',
    targetShelfLifeDays: selectedCommodity.targetShelfLifeDays
  };
  const baselineResult = generatePackagingRecommendation(selectedCommodity, baselineStorage, priority);

  // Scenario recommendation with current slider inputs
  const scenarioStorage: StorageCondition = {
    temperatureC: tempC,
    relativeHumidity: rhPercent,
    storageMode: tempC <= 8 ? 'chilled' : 'ambient',
    sunlightExposure: 'indirect',
    handlingStress: 'standard',
    targetShelfLifeDays: targetDays
  };
  const scenarioResult = generatePackagingRecommendation(selectedCommodity, scenarioStorage, priority);

  const narrationSummary =
    language === 'hi'
      ? `परिदृश्य विश्लेषण: ${tempC} डिग्री सेल्सियस और ${rhPercent} प्रतिशत आर्द्रता में, आवश्यक OTR ${scenarioResult.requirements.requiredOtrMax} और WVTR ${scenarioResult.requirements.requiredWvtrMax} है। मुख्य अनुशंसित सामग्री ${scenarioResult.primaryCandidate ? scenarioResult.primaryCandidate.material.name.hi : 'उपलब्ध नहीं'} है।`
      : language === 'mr'
      ? `पर्यायी परिस्थिती विश्लेषण: ${tempC} अंश सेल्सिअस आणि ${rhPercent} टक्के आर्द्रतेत, मुख्य शिफारस ${scenarioResult.primaryCandidate ? scenarioResult.primaryCandidate.material.name.mr : 'उपलब्ध नाही'} आहे.`
      : `Scenario analysis at ${tempC}°C and ${rhPercent}% RH: Derived OTR limit is ${scenarioResult.requirements.requiredOtrMax} cc and WVTR limit is ${scenarioResult.requirements.requiredWvtrMax} g. Primary recommendation is ${scenarioResult.primaryCandidate ? scenarioResult.primaryCandidate.material.name.en : 'None'}.`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in text-slate-900 dark:text-emerald-100">
      {/* Header */}
      <div className="bg-white dark:bg-[#082a1f] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {language === 'hi' ? 'वास्तविक समय जलवायु सिमुलेटर' : language === 'mr' ? 'हवामान ताण सिम्युलेटर' : 'Real-Time Stress Simulator'}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.whatIf.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
            {t.whatIf.subtitle}
          </p>
        </div>
        <VoiceButton textToSpeak={narrationSummary} label={t.form.listenField} />
      </div>

      {/* Control Sliders Grid */}
      <div className="bg-white dark:bg-[#082a1f] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300">
            {language === 'hi' ? 'जलवायु एवं शेल्फ-लाइफ चर बदलें' : language === 'mr' ? 'हवामान व टिकण्याची मुदत बदला' : 'Simulate Climate & Life Variables'}
          </h2>
          <button
            type="button"
            onClick={() => {
              setTempC(25);
              setRhPercent(65);
              setTargetDays(selectedCommodity.targetShelfLifeDays);
              setThicknessDeltaPercent(0);
            }}
            className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'मानक पर रीसेट करें' : language === 'mr' ? 'मूळ स्थितीत रीसेट करा' : 'Reset to Standard'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Commodity Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
              {language === 'hi' ? 'खाद्य पदार्थ चुनें' : language === 'mr' ? 'अन्न पदार्थ निवडा' : 'Select Food Matrix'}
            </label>
            <select
              value={selectedCommodityId}
              onChange={e => setSelectedCommodityId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#061d15] text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {COMMODITIES.map(c => (
                <option key={c.id} value={c.id} className="dark:bg-[#082a1f]">
                  {c.name[language]} ({c.fssaiCategory})
                </option>
              ))}
            </select>
          </div>

          {/* Ranking Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
              {language === 'hi' ? 'रैंकिंग प्राथमिकता' : language === 'mr' ? 'प्राधान्यक्रम' : 'TOPSIS Priority'}
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as TopsisPriority)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#061d15] text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="balanced">{t.form.priorityBalanced}</option>
              <option value="barrier">{t.form.priorityBarrier}</option>
              <option value="budget">{t.form.priorityBudget}</option>
              <option value="sustainability">{t.form.priorityEco}</option>
            </select>
          </div>

          {/* Temperature Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-emerald-200 mb-1.5">
              <span>{t.whatIf.adjustTemp}</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{tempC}°C</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={tempC}
              onChange={e => setTempC(Number(e.target.value))}
              className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Humidity Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-emerald-200 mb-1.5">
              <span>{t.whatIf.adjustRH}</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{rhPercent}% RH</span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              value={rhPercent}
              onChange={e => setRhPercent(Number(e.target.value))}
              className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Target Shelf Life Days Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-emerald-200 mb-1.5">
              <span>{t.whatIf.adjustDays}</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{targetDays} Days</span>
            </div>
            <input
              type="range"
              min="15"
              max="365"
              step="15"
              value={targetDays}
              onChange={e => setTargetDays(Number(e.target.value))}
              className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Film Thickness Delta Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-emerald-200 mb-1.5">
              <span>{t.whatIf.thicknessDelta}</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {thicknessDeltaPercent > 0 ? `+${thicknessDeltaPercent}%` : `${thicknessDeltaPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="60"
              step="10"
              value={thicknessDeltaPercent}
              onChange={e => setThicknessDeltaPercent(Number(e.target.value))}
              className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Delta Comparison: Baseline vs Simulated Scenario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#082a1f] border border-slate-200 dark:border-[#134937] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/80">
              Standard Baseline (25°C / 60% RH)
            </span>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-emerald-300">
              {baselineStorage.targetShelfLifeDays} Days
            </span>
          </div>

          <div className="border-t border-slate-100 dark:border-[#134937] pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-emerald-300/70">Max Permissible OTR:</span>
              <span className="font-bold text-slate-800 dark:text-white font-mono">{baselineResult.requirements.requiredOtrMax} cc</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-emerald-300/70">Max Permissible WVTR:</span>
              <span className="font-bold text-slate-800 dark:text-white font-mono">{baselineResult.requirements.requiredWvtrMax} g</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
            <div className="text-[11px] text-slate-500 dark:text-emerald-400/80 uppercase font-bold">Standard Primary:</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {baselineResult.primaryCandidate ? baselineResult.primaryCandidate.material.name[language] : 'None'}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-emerald-300/70 mt-1">
              Passing Options: {baselineResult.passingCandidates.length} materials
            </div>
          </div>
        </div>

        {/* Simulated Scenario Card */}
        <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-[#0c3829]/50 border-2 border-emerald-600 dark:border-emerald-500 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Simulated Scenario ({tempC}°C / {rhPercent}% RH)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
              {targetDays} Days
            </span>
          </div>

          <div className="border-t border-emerald-200/60 dark:border-[#17523d] pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-emerald-200/80">Max Permissible OTR:</span>
              <span className="font-bold text-emerald-950 dark:text-white font-mono">{scenarioResult.requirements.requiredOtrMax} cc</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-emerald-200/80">Max Permissible WVTR:</span>
              <span className="font-bold text-emerald-950 dark:text-white font-mono">{scenarioResult.requirements.requiredWvtrMax} g</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#061d15] border border-emerald-300 dark:border-emerald-700/60">
            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 uppercase font-bold">Scenario Primary:</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {scenarioResult.primaryCandidate ? scenarioResult.primaryCandidate.material.name[language] : 'None'}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-emerald-300/70 mt-1">
              Passing Options: {scenarioResult.passingCandidates.length} materials
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
