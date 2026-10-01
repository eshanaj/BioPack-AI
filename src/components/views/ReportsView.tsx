import React, { useState } from 'react';
import {
  Printer,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Info
} from 'lucide-react';
import { useI18n } from '../../locales/i18n.tsx';
import { COMMODITIES } from '../../data/commodities.ts';
import { generatePackagingRecommendation } from '../../engine/recommend.ts';
import { SCIENTIFIC_SOURCES } from '../../data/sources.ts';

export const ReportsView: React.FC = () => {
  const { t, language } = useI18n();

  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('potato_chips');
  const selectedCommodity =
    COMMODITIES.find(c => c.id === selectedCommodityId) || COMMODITIES[0];

  const storage = {
    temperatureC: selectedCommodity.typicalStorageTempC,
    relativeHumidity: selectedCommodity.typicalStorageRH,
    storageMode: 'ambient' as const,
    sunlightExposure: 'indirect' as const,
    handlingStress: 'standard' as const,
    targetShelfLifeDays: selectedCommodity.targetShelfLifeDays
  };

  const rec = generatePackagingRecommendation(selectedCommodity, storage);

  const reportId = `REP-${selectedCommodity.id.toUpperCase().substring(0, 4)}-${Date.now().toString().slice(-6)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in text-slate-900 dark:text-emerald-100">
      {/* Header (no-print) */}
      <div className="bg-white dark:bg-[#082a1f] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {language === 'hi' ? 'ऑडिट प्रलेखन सूट' : language === 'mr' ? 'ऑडिट अहवाल सूट' : 'Audit Documentation Suite'}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.reports.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
            {t.reports.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCommodityId}
            onChange={e => setSelectedCommodityId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#061d15] text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {COMMODITIES.map(c => (
              <option key={c.id} value={c.id} className="dark:bg-[#082a1f]">
                {c.name[language]}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{t.reports.printReport}</span>
          </button>
        </div>
      </div>

      {/* Formal Executive Report Document */}
      <div className="bg-white dark:bg-[#082a1f] p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-sm space-y-8 text-slate-900 dark:text-emerald-100">
        {/* Title Header */}
        <div className="border-b-2 border-slate-900 dark:border-emerald-500/50 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-400">
              BioPack AI Scientific Intelligence Report
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1 text-slate-900 dark:text-white">
              Food Packaging Audit & Recommendation
            </h2>
            <div className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">
              Evaluated Food: <strong className="text-slate-900 dark:text-white">{selectedCommodity.name[language]}</strong> | Category: {selectedCommodity.fssaiCategory}
            </div>
          </div>
          <div className="text-left sm:text-right font-mono text-xs text-slate-500 dark:text-emerald-400/80 space-y-0.5">
            <div>Report ID: <strong className="text-slate-900 dark:text-white">{reportId}</strong></div>
            <div>Generated: {new Date().toISOString().split('T')[0]}</div>
            <div>Audit Hash: {rec.auditTrailHash}</div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 border-b border-slate-200 dark:border-[#134937] pb-1">
            1. {t.reports.executiveSummary}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-emerald-200/90 leading-relaxed">
            This technical decision-support report was generated using deterministic biophysical barrier screening and vector-normalized TOPSIS multi-criteria ranking for <strong className="text-slate-900 dark:text-white">{selectedCommodity.name[language]}</strong> stored at <strong className="text-slate-900 dark:text-white">{storage.temperatureC}°C</strong> and <strong className="text-slate-900 dark:text-white">{storage.relativeHumidity}% RH</strong> for a target duration of <strong className="text-slate-900 dark:text-white">{storage.targetShelfLifeDays} days</strong>.
          </p>
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-[#061d15] border border-emerald-200 dark:border-[#17523d] text-xs text-emerald-950 dark:text-emerald-200">
            <strong className="text-emerald-800 dark:text-emerald-300">Key Conclusion: </strong>
            {rec.primaryCandidate ? (
              <span>
                The primary recommended structure based on current verified data is <strong>{rec.primaryCandidate.material.name[language]} ({rec.primaryCandidate.material.code})</strong> with a TOPSIS closeness score of <strong>{rec.primaryCandidate.topsisScore.toFixed(3)}</strong> and an evidence coverage index of <strong>{rec.primaryCandidate.evidenceCoveragePercent}%</strong>.
              </span>
            ) : (
              <span>No evaluated material satisfies all hard biophysical constraints. Review the rejection log below.</span>
            )}
          </div>
        </section>

        {/* 2. Commodity Biophysical Profile */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 border-b border-slate-200 dark:border-[#134937] pb-1">
            2. Food Biophysical Properties & Sensitivities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#061d15]">
              <span className="text-slate-500 dark:text-emerald-400/70 text-[11px]">Moisture (% w/w)</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCommodity.moistureContent}%</div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#061d15]">
              <span className="text-slate-500 dark:text-emerald-400/70 text-[11px]">Fat / Lipids (% w/w)</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCommodity.fatContent}%</div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#061d15]">
              <span className="text-slate-500 dark:text-emerald-400/70 text-[11px]">Water Activity (aw)</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCommodity.waterActivity}</div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#061d15]">
              <span className="text-slate-500 dark:text-emerald-400/70 text-[11px]">Oxygen Sensitivity</span>
              <div className="font-bold text-rose-800 dark:text-rose-400 uppercase mt-0.5">{selectedCommodity.oxygenSensitivity}</div>
            </div>
          </div>
        </section>

        {/* 3. Derived Barrier Constraints */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 border-b border-slate-200 dark:border-[#134937] pb-1">
            3. Derived Engineering Barrier Thresholds
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#061d15]">
              <span className="text-slate-500 dark:text-emerald-400/70">Max Permissible OTR (ASTM D3985):</span>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                ≤ {rec.requirements.requiredOtrMax} cc/m²·day
              </div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#061d15]">
              <span className="text-slate-500 dark:text-emerald-400/70">Max Permissible WVTR (ASTM F1249):</span>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                ≤ {rec.requirements.requiredWvtrMax} g/m²·day
              </div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#061d15]">
              <span className="text-slate-500 dark:text-emerald-400/70">Light Protection:</span>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {rec.requirements.lightProtectionRequired ? 'Required (>70%)' : 'Standard'}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Evaluated Candidates Table */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 border-b border-slate-200 dark:border-[#134937] pb-1">
            4. {t.reports.recommendations}
          </h3>
          <table className="w-full text-left text-xs border border-slate-200 dark:border-[#134937] rounded-xl overflow-hidden">
            <thead className="bg-slate-100 dark:bg-[#061d15] text-slate-700 dark:text-emerald-200 font-bold uppercase text-[11px] border-b border-slate-200 dark:border-[#134937]">
              <tr>
                <th className="p-2.5">Rank</th>
                <th className="p-2.5">Material</th>
                <th className="p-2.5">ASTM OTR</th>
                <th className="p-2.5">ASTM WVTR</th>
                <th className="p-2.5">TOPSIS Score</th>
                <th className="p-2.5">Recyclability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#134937]">
              {rec.passingCandidates.map(c => (
                <tr key={c.material.id} className="hover:bg-slate-50 dark:hover:bg-[#061d15]/50 transition-colors">
                  <td className="p-2.5 font-bold">#{c.rank}</td>
                  <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{c.material.name[language]} ({c.material.code})</td>
                  <td className="p-2.5 font-mono text-slate-700 dark:text-emerald-200">{c.material.otr} cc</td>
                  <td className="p-2.5 font-mono text-slate-700 dark:text-emerald-200">{c.material.wvtr} g</td>
                  <td className="p-2.5 font-mono font-bold text-emerald-800 dark:text-emerald-400">{c.topsisScore.toFixed(4)}</td>
                  <td className="p-2.5 text-slate-600 dark:text-emerald-300">{c.material.recyclability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 5. Hard Constraint Rejection Log */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 border-b border-slate-200 dark:border-[#134937] pb-1">
            5. {t.reports.hardConstraintsSummary} ({rec.rejectedCandidates.length} Materials Filtered)
          </h3>
          <div className="space-y-2 text-xs">
            {rec.rejectedCandidates.map(rej => (
              <div key={rej.material.id} className="p-3 rounded-lg border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#061d15]">
                <div className="font-bold text-slate-900 dark:text-white">
                  {rej.material.name[language]} ({rej.material.code})
                </div>
                <ul className="text-slate-600 dark:text-emerald-300/80 mt-1 space-y-0.5">
                  {rej.hardConstraintFailures.map((f, i) => (
                    <li key={i}>• {f.reason[language]}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Scientific Limitations & Boundaries */}
        <section className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 border-b border-slate-200 dark:border-[#134937] pb-1">
            6. {t.reports.limitations}
          </h3>
          <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed">
            Values presented reflect steady-state standardized ASTM laboratory measurements on virgin flat film specimens under controlled conditions (23°C 0% RH for OTR, 38°C 90% RH for WVTR). Commercial conversion processes (thermoforming, printing, flex-cracking, heat-sealing micro-channels) and distribution vibration may alter practical barrier values by ±15–25%. Mandatory physical validation trials remain essential prior to commercial release.
          </p>
        </section>

        {/* 7. References & Standards */}
        <section className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 border-b border-slate-200 dark:border-[#134937] pb-1">
            7. {t.reports.citations}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-emerald-300/80">
            {SCIENTIFIC_SOURCES.slice(0, 6).map(s => (
              <div key={s.id} className="p-2 rounded border border-slate-200 dark:border-[#134937] bg-slate-50 dark:bg-[#061d15]">
                <strong className="text-slate-800 dark:text-white">[{s.id}]</strong> {s.title} ({s.publisherOrOrg}, {s.year})
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
