import React, { useState } from 'react';
import {
  Leaf,
  Wind,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Thermometer,
  ShieldAlert,
  Info,
  Sliders,
  ArrowRight
} from 'lucide-react';
import { useI18n } from '../../locales/i18n.tsx';
import { COMMODITIES } from '../../data/commodities.ts';
import { PACKAGING_MATERIALS } from '../../data/materials.ts';
import { calculateProduceMapEquilibrium } from '../../engine/map.ts';
import { VoiceButton } from '../VoiceButton.tsx';

export const FreshProduceView: React.FC = () => {
  const { t, language } = useI18n();

  // Fresh produce items
  const produceItems = COMMODITIES.filter(c => c.isRespirating);

  const [selectedProduceId, setSelectedProduceId] = useState<string>(
    produceItems[0]?.id || 'fresh_alphonso_mango'
  );
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    'microperforated_ldpe_30'
  );
  const [productMassG, setProductMassG] = useState<number>(1000);
  const [filmAreaCm2, setFilmAreaCm2] = useState<number>(1200);
  const [storageTempC, setStorageTempC] = useState<number>(13);

  const selectedProduce =
    produceItems.find(p => p.id === selectedProduceId) || produceItems[0];
  const selectedMaterial =
    PACKAGING_MATERIALS.find(m => m.id === selectedMaterialId) || PACKAGING_MATERIALS[0];

  const mapResult = calculateProduceMapEquilibrium(
    selectedProduce,
    selectedMaterial,
    productMassG / 1000,
    filmAreaCm2,
    storageTempC
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BALANCED_CANDIDATE':
        return 'bg-emerald-50 dark:bg-[#0b3323] border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-100';
      case 'TOO_RESTRICTIVE':
        return 'bg-rose-50 dark:bg-[#341219] border-rose-400 dark:border-rose-600 text-rose-950 dark:text-rose-100';
      case 'TOO_PERMEABLE':
        return 'bg-amber-50 dark:bg-[#33220c] border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-100';
      case 'DISARMED_UNVERIFIED':
      default:
        return 'bg-slate-100 dark:bg-[#07241a] border-slate-300 dark:border-[#134937] text-slate-800 dark:text-slate-200';
    }
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case 'BALANCED_CANDIDATE':
        return t.freshProduce.statusBalanced;
      case 'TOO_RESTRICTIVE':
        return t.freshProduce.statusRestrictive;
      case 'TOO_PERMEABLE':
        return t.freshProduce.statusPermeable;
      case 'DISARMED_UNVERIFIED':
      default:
        return t.freshProduce.statusDisarmed;
    }
  };

  const narrationSummary = `${t.freshProduce.classification}: ${getStatusTitle(mapResult.classification)}. ${mapResult.explanation[language]}. ${
    mapResult.chillingInjuryWarning ? mapResult.chillingInjuryMessage?.[language] : ''
  }`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in text-slate-900 dark:text-emerald-100">
      {/* Header */}
      <div className="bg-white dark:bg-[#082a1f] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lime-100 dark:bg-lime-950/80 text-lime-900 dark:text-lime-300 border border-lime-300 dark:border-lime-800">
              {language === 'hi' ? 'जीवित फसल उत्तर-फसल लैब' : language === 'mr' ? 'जिवंत पिके काढणीपश्चात लॅब' : 'Living Crop Postharvest Lab'}
            </span>
            <span className="text-xs text-slate-400 dark:text-emerald-400/70 font-mono">
              MAP Respiration Balance
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.freshProduce.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
            {t.freshProduce.subtitle}
          </p>
        </div>
        <VoiceButton textToSpeak={narrationSummary} label={t.form.listenField} />
      </div>

      {/* Input Parameters Card */}
      <div className="bg-white dark:bg-[#082a1f] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300">
          {language === 'hi' ? 'श्वसन एवं पैकेजिंग पैरामीटर' : language === 'mr' ? 'श्वसन आणि पॅकेजिंग निकष' : 'Postharvest Respiration Parameters'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
              {t.freshProduce.commodityLabel}
            </label>
            <select
              value={selectedProduceId}
              onChange={e => {
                setSelectedProduceId(e.target.value);
                const p = produceItems.find(item => item.id === e.target.value);
                if (p) setStorageTempC(p.typicalStorageTempC);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#061d15] text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {produceItems.map(p => (
                <option key={p.id} value={p.id} className="dark:bg-[#082a1f]">
                  {p.name[language]} ({p.fssaiCategory})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
              {language === 'hi' ? 'फिल्म उम्मीदवार (Barrier Film)' : language === 'mr' ? 'फिल्म पर्याय (Barrier Film)' : 'Film Candidate'}
            </label>
            <select
              value={selectedMaterialId}
              onChange={e => setSelectedMaterialId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#061d15] text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {PACKAGING_MATERIALS.map(m => (
                <option key={m.id} value={m.id} className="dark:bg-[#082a1f]">
                  {m.name[language]} (OTR: {m.otr} cc)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
              {t.freshProduce.packMassLabel}
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="50"
                max="10000"
                value={productMassG}
                onChange={e => setProductMassG(Number(e.target.value))}
                className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#061d15] text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="absolute right-3.5 text-xs text-slate-500 dark:text-emerald-400 font-medium">g</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
              {t.freshProduce.filmAreaLabel}
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="100"
                max="10000"
                value={filmAreaCm2}
                onChange={e => setFilmAreaCm2(Number(e.target.value))}
                className="w-full pl-3.5 pr-14 py-2 rounded-xl border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#061d15] text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="absolute right-3.5 text-xs text-slate-500 dark:text-emerald-400 font-medium">cm²</span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-emerald-200 mb-1.5">
              <span>{t.freshProduce.tempLabel}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">{storageTempC}°C</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={storageTempC}
              onChange={e => setStorageTempC(Number(e.target.value))}
              className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-emerald-400/70 mt-1 font-mono">
              <span>0°C (Ice Cold)</span>
              <span>4°C (Refrigerator)</span>
              <span>12°C (Chilling Safe)</span>
              <span>25°C (Ambient)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chilling Injury Alarm (if triggered) */}
      {mapResult.chillingInjuryWarning && mapResult.chillingInjuryMessage && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-[#341d08] border-2 border-amber-300 dark:border-amber-600 text-amber-950 dark:text-amber-100 shadow-xs space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{language === 'hi' ? 'शीत-क्षति (Chilling Injury) चेतावनी!' : language === 'mr' ? 'शीत-हानी (Chilling Injury) चेतावणी!' : 'Postharvest Chilling Injury Detected!'}</span>
          </div>
          <p className="text-xs leading-relaxed">
            {mapResult.chillingInjuryMessage[language]}
          </p>
        </div>
      )}

      {/* Equilibrium Status Banner */}
      <div className={`p-6 rounded-2xl border-2 ${getStatusColor(mapResult.classification)} shadow-xs space-y-3`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">
            {t.freshProduce.classification}
          </span>
          <span className="text-xs font-mono font-bold">
            Respiration: {mapResult.respirationRateUsed} mL O₂/kg·hr
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {getStatusTitle(mapResult.classification)}
        </div>

        <p className="text-xs sm:text-sm leading-relaxed opacity-90">
          {mapResult.explanation[language]}
        </p>

        {/* Equilibrium Gas Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/60 dark:border-[#1b5e46]/60 text-xs">
          <div className="p-3 rounded-xl bg-white/90 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
            <span className="text-[11px] text-slate-500 dark:text-emerald-400 font-medium">Equilibrium O₂</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
              {mapResult.equilibriumO2Percent}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/90 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
            <span className="text-[11px] text-slate-500 dark:text-emerald-400 font-medium">Equilibrium CO₂</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
              {mapResult.equilibriumCO2Percent}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/90 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
            <span className="text-[11px] text-slate-500 dark:text-emerald-400 font-medium">Target O₂ Range</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 font-mono">
              {mapResult.optimalTargetO2.min}% - {mapResult.optimalTargetO2.max}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/90 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
            <span className="text-[11px] text-slate-500 dark:text-emerald-400 font-medium">Film OTR</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 font-mono">
              {selectedMaterial.otr} cc/m²·day
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
