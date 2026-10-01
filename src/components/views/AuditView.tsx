import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sliders,
  FileCheck
} from 'lucide-react';
import { useI18n } from '../../locales/i18n.tsx';
import { COMMODITIES } from '../../data/commodities.ts';
import { PACKAGING_MATERIALS } from '../../data/materials.ts';
import { auditCurrentPackaging } from '../../engine/audit.ts';
import { StorageCondition } from '../../types/index.ts';
import { VoiceButton } from '../VoiceButton.tsx';

interface AuditViewProps {
  onStartAnalysisWithCommodity?: (commodityId: string) => void;
  onGoToValidation?: () => void;
}

export const AuditView: React.FC<AuditViewProps> = ({
  onStartAnalysisWithCommodity,
  onGoToValidation
}) => {
  const { t, language } = useI18n();

  const [commodityId, setCommodityId] = useState<string>('potato_chips');
  const [materialId, setMaterialId] = useState<string>('ldpe_plain_50');
  const [thicknessUm, setThicknessUm] = useState<number>(50);
  const [observedShelfLifeDays, setObservedShelfLifeDays] = useState<number>(45);
  const [tempC, setTempC] = useState<number>(28);
  const [rhPercent, setRhPercent] = useState<number>(70);

  const selectedCommodity =
    COMMODITIES.find(c => c.id === commodityId) || COMMODITIES[0];
  const selectedMaterial =
    PACKAGING_MATERIALS.find(m => m.id === materialId) || PACKAGING_MATERIALS[0];

  const storage: StorageCondition = {
    temperatureC: tempC,
    relativeHumidity: rhPercent,
    storageMode: tempC <= 8 ? 'chilled' : 'ambient',
    sunlightExposure: 'indirect',
    handlingStress: 'standard',
    targetShelfLifeDays: selectedCommodity.targetShelfLifeDays
  };

  const auditResult = auditCurrentPackaging(
    selectedCommodity,
    selectedMaterial,
    thicknessUm,
    observedShelfLifeDays,
    storage
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case 'KEEP':
        return 'bg-emerald-50 dark:bg-[#0d3b2b] border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200';
      case 'MODIFY':
        return 'bg-amber-50 dark:bg-[#2b260d] border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200';
      case 'REPLACE':
        return 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200';
      case 'VALIDATE':
      default:
        return 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200';
    }
  };

  const getPillarIcon = (status: string) => {
    if (status === 'meets') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    } else if (status === 'concern') {
      return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    } else {
      return <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    }
  };

  const getPillarLabel = (status: string) => {
    if (status === 'meets') return t.audit.statusMeets;
    if (status === 'concern') return t.audit.statusConcern;
    return t.audit.statusFails;
  };

  const narrationSummary = `${t.audit.diagnosis}: ${auditResult.overallAction}. ${auditResult.diagnosis[language]}.`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-[#09271d] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#061e16] text-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-[#134937]">
            Packaging Diagnostic Tool
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.audit.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
            {t.audit.subtitle}
          </p>
        </div>
        <VoiceButton textToSpeak={narrationSummary} label={t.form.listenField} />
      </div>

      {/* Input Parameters Card */}
      <div className="bg-white dark:bg-[#09271d] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs space-y-5 transition-colors">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-200">
          Current Specification Inputs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
              Target Food Commodity
            </label>
            <select
              value={commodityId}
              onChange={e => setCommodityId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
            >
              {COMMODITIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name[language]} ({c.fssaiCategory})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
              {t.audit.currentMaterialLabel}
            </label>
            <select
              value={materialId}
              onChange={e => {
                setMaterialId(e.target.value);
                const m = PACKAGING_MATERIALS.find(item => item.id === e.target.value);
                if (m) setThicknessUm(m.nominalThicknessUm);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
            >
              {PACKAGING_MATERIALS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name[language]} ({m.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-emerald-200 mb-1.5">
              <span>{t.audit.thicknessLabel}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{thicknessUm} µm</span>
            </div>
            <input
              type="range"
              min="15"
              max="150"
              value={thicknessUm}
              onChange={e => setThicknessUm(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
                {t.audit.currentShelfLifeLabel}
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="5"
                  max="730"
                  value={observedShelfLifeDays}
                  onChange={e => setObservedShelfLifeDays(Number(e.target.value))}
                  className="w-full pl-3.5 pr-14 py-2 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="absolute right-3 text-xs text-slate-500 dark:text-emerald-300/70 font-medium">Days</span>
              </div>
            </div>
        </div>
      </div>

      {/* Audit Verdict Banner */}
      <div className={`p-6 rounded-2xl border-2 ${getActionColor(auditResult.overallAction)} shadow-xs transition-colors`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">
            Audit Verdict
          </span>
          <span className="text-xs font-mono font-bold">
            Target Life: {selectedCommodity.targetShelfLifeDays} Days
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight">
          {auditResult.overallAction === 'KEEP' && t.audit.actionKeep}
          {auditResult.overallAction === 'MODIFY' && t.audit.actionModify}
          {auditResult.overallAction === 'REPLACE' && t.audit.actionReplace}
          {auditResult.overallAction === 'VALIDATE' && t.audit.actionValidate}
        </div>

        <p className="text-xs sm:text-sm mt-3 leading-relaxed opacity-90">
          {auditResult.diagnosis[language]}
        </p>
      </div>

      {/* 4-Pillar Gap Analysis Cards */}
      <div className="bg-white dark:bg-[#09271d] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs space-y-4 transition-colors">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-200">
          {t.audit.gapAnalysis}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#061e16] border border-slate-200 dark:border-[#134937]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-600 dark:text-emerald-300">Moisture Barrier</span>
              {getPillarIcon(auditResult.moistureStatus)}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-white">
              {getPillarLabel(auditResult.moistureStatus)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-emerald-400/70 mt-1 font-mono">
              WVTR: {selectedMaterial.wvtr} g/m²·day
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#061e16] border border-slate-200 dark:border-[#134937]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-600 dark:text-emerald-300">Oxygen Barrier</span>
              {getPillarIcon(auditResult.oxygenStatus)}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-white">
              {getPillarLabel(auditResult.oxygenStatus)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-emerald-400/70 mt-1 font-mono">
              OTR: {selectedMaterial.otr} cc/m²·day
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#061e16] border border-slate-200 dark:border-[#134937]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-600 dark:text-emerald-300">Light Protection</span>
              {getPillarIcon(auditResult.lightStatus)}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-white">
              {getPillarLabel(auditResult.lightStatus)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-emerald-400/70 mt-1 font-mono">
              Opacity: {selectedMaterial.lightBarrierPercent}%
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#061e16] border border-slate-200 dark:border-[#134937]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-600 dark:text-emerald-300">Food Contact</span>
              {getPillarIcon(auditResult.foodContactStatus)}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-white">
              {getPillarLabel(auditResult.foodContactStatus)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-emerald-400/70 mt-1 font-mono">
              Status: {selectedMaterial.foodContactStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Action Steps */}
      <div className="bg-white dark:bg-[#09271d] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs space-y-4 transition-colors">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-200">
          {t.audit.actionItems}
        </h3>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-emerald-100">
          {auditResult.recommendedActions[language].map((act, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#061e16] flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-emerald-300 shrink-0 mt-0.5 border border-slate-200 dark:border-[#134937]">
                {i + 1}
              </span>
              <span className="leading-relaxed">{act}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-slate-100 dark:border-[#134937] flex flex-wrap gap-3">
          {onStartAnalysisWithCommodity && (
            <button
              type="button"
              onClick={() => onStartAnalysisWithCommodity(commodityId)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Explore Ideal Materials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onGoToValidation && (
            <button
              type="button"
              onClick={onGoToValidation}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#0c382a] hover:bg-slate-50 dark:hover:bg-[#124936] text-slate-700 dark:text-emerald-200 font-semibold text-xs border border-slate-300 dark:border-[#144735] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Go to Validation Lab</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
