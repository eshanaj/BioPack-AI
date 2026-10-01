import React from 'react';
import { Lock } from 'lucide-react';
import { useI18n } from '../../locales/i18n.tsx';
import { CURRENT_DATASET_MANIFEST } from '../../engine/mlGate.ts';

export const SystemStatusView: React.FC = () => {
  const { t } = useI18n();

  const engines = [
    { name: 'Water Activity (aw) & Moisture Isotherm Solver', status: 'Active (Deterministic)', desc: 'Calculates critical delta moisture gain based on packaging area, thickness, and Henry-Fick transport kinetics.' },
    { name: 'ASTM D3985 OTR Derivation Engine', status: 'Active (Deterministic)', desc: 'Enforces hard ceiling on oxygen transmission rates for lipid oxidation-prone and vacuum dairy commodities.' },
    { name: 'ASTM F1249 WVTR Derivation Engine', status: 'Active (Deterministic)', desc: 'Computes maximum allowable water vapor ingress to avoid sogginess, microbial proliferation, and caking.' },
    { name: 'Vegetable / Produce Respiration & MAP Model', status: 'Active (Deterministic)', desc: 'Solves equilibrium micro-perforation gas balances (R_O2, R_CO2) and chilling injury thresholds.' },
    { name: 'Vector TOPSIS Multi-Criteria Ranking', status: 'Active (Mathematical)', desc: 'Normalizes and weights barrier, shelf-life, cost, machinability, and circularity without black-box bias.' },
    { name: 'ASTM F88 / ASTM F1929 Seal Integrity Engine', status: 'Active (Deterministic)', desc: 'Generates qualification criteria and inspection protocols for hot tack and seal integrity.' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-[#09271d] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-emerald-950 text-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800">
            Operational Readiness & Integrity
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.status.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
            {t.status.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#0c3829] text-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All Core Systems Healthy</span>
        </div>
      </div>

      {/* Engine Status Grid */}
      <div className="bg-white dark:bg-[#09271d] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-100">
          Calculation & Inference Subsystems
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {engines.map(eng => (
            <div key={eng.name} className="p-3.5 rounded-xl border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#07251c] flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{eng.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-emerald-300/70 mt-0.5">{eng.desc}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-emerald-950 text-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800 shrink-0">
                {eng.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ML Data Sufficiency Gate Box */}
      <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-[#0d2238] border-2 border-indigo-200 dark:border-indigo-800 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
            <h3 className="font-bold text-indigo-950 dark:text-indigo-200 text-sm">
              ML Data Sufficiency Gate: ACTIVE
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-200/80 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 font-mono font-bold text-[10px]">
            DATA_GATED
          </span>
        </div>

        <p className="text-indigo-900 dark:text-indigo-200/90 leading-relaxed">
          {CURRENT_DATASET_MANIFEST.gateRationale}
        </p>

        <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60 space-y-1 text-[11px] text-indigo-950 dark:text-indigo-200">
          <div className="font-semibold">Active Leakage Prevention Rules:</div>
          <ul className="list-disc list-inside space-y-0.5 text-indigo-900/90 dark:text-indigo-300/80">
            {CURRENT_DATASET_MANIFEST.leakagePreventionRules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dataset Manifest & Provenance */}
      <div className="bg-white dark:bg-[#09271d] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-100">
            {t.status.datasetManifest}
          </h3>
          <span className="font-mono text-[11px] text-slate-400 dark:text-emerald-400/60">
            {CURRENT_DATASET_MANIFEST.manifestId}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#07251c]">
            <span className="text-slate-500 dark:text-emerald-300/70 text-[11px]">Dataset Version</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">v{CURRENT_DATASET_MANIFEST.version}</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#07251c]">
            <span className="text-slate-500 dark:text-emerald-300/70 text-[11px]">Verified Commodities</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{CURRENT_DATASET_MANIFEST.commoditiesCount}</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#07251c]">
            <span className="text-slate-500 dark:text-emerald-300/70 text-[11px]">Materials & Structures</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{CURRENT_DATASET_MANIFEST.materialsCount}</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#07251c]">
            <span className="text-slate-500 dark:text-emerald-300/70 text-[11px]">Certified Sources</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{CURRENT_DATASET_MANIFEST.sourcesCount}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#07251c] space-y-1">
          <span className="text-slate-500 dark:text-emerald-300/70 text-[11px] font-semibold">{t.status.hashLabel}:</span>
          <div className="font-mono text-[11px] text-slate-800 dark:text-emerald-100 break-all select-all font-semibold">
            {CURRENT_DATASET_MANIFEST.sha256Checksum}
          </div>
        </div>
      </div>
    </div>
  );
};
