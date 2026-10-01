import React from 'react';
import { X, ArrowRight, ShieldCheck, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { CandidateEvaluation, Commodity, FoodRequirements } from '../types/index.ts';
import { useI18n } from '../locales/i18n.tsx';
import { SCIENTIFIC_SOURCES } from '../data/sources.ts';

interface EvidenceGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodity: Commodity;
  requirements: FoodRequirements;
  candidate: CandidateEvaluation;
}

export const EvidenceGraphModal: React.FC<EvidenceGraphModalProps> = ({
  isOpen,
  onClose,
  commodity,
  requirements,
  candidate
}) => {
  const { language } = useI18n();

  if (!isOpen) return null;

  const relevantSources = SCIENTIFIC_SOURCES.filter(s =>
    candidate.material.sources.includes(s.id) || requirements.evidenceIds.includes(s.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-[#09271d] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-[#134937]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-[#134937] flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#09271d]/95 backdrop-blur-xs z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-emerald-950 text-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800">
                Traceable Evidence Graph
              </span>
              <span className="text-xs text-slate-500 dark:text-emerald-400 font-mono">
                {candidate.material.code}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Biophysical Decision Trace: {commodity.name[language]} → {candidate.material.name[language]}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-emerald-200 hover:bg-slate-100 dark:hover:bg-[#0c382a] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1: Food Matrix */}
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-[#2b260d] border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-100 text-[10px]">1</span>
                  Food Biophysics
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{commodity.name[language]}</h4>
                <ul className="text-xs text-slate-600 dark:text-emerald-100/90 mt-2 space-y-1">
                  <li>• Moisture: {commodity.moistureContent}%</li>
                  <li>• Fat / Lipids: {commodity.fatContent}%</li>
                  <li>• Water Activity: {commodity.waterActivity != null ? commodity.waterActivity : '—'}</li>
                  <li>• Respiration: {commodity.isRespirating ? 'Active' : 'Dormant'}</li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200/60 dark:border-amber-900/60 text-[11px] font-medium text-amber-800 dark:text-amber-300">
                Triggered sensitivity extraction
              </div>
            </div>

            {/* Step 2: Critical Sensitivities */}
            <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider mb-2">
                  <span className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-800 flex items-center justify-center text-rose-800 dark:text-rose-100 text-[10px]">2</span>
                  Degradation Risks
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Pathways</h4>
                <ul className="text-xs text-slate-600 dark:text-emerald-100/90 mt-2 space-y-1">
                  <li>• O₂ Sensitivity: <span className="font-semibold uppercase text-rose-700 dark:text-rose-300">{commodity.oxygenSensitivity}</span></li>
                  <li>• Moisture Risk: <span className="font-semibold uppercase text-rose-700 dark:text-rose-300">{commodity.moistureSensitivity}</span></li>
                  <li>• Light Risk: <span className="font-semibold uppercase text-rose-700 dark:text-rose-300">{commodity.lightSensitivity}</span></li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-rose-200/60 dark:border-rose-900/60 text-[11px] font-medium text-rose-800 dark:text-rose-300">
                Maps to barrier thresholds
              </div>
            </div>

            {/* Step 3: Engineering Requirement */}
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-blue-800 dark:text-blue-100 text-[10px]">3</span>
                  Target Barrier
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Pass Thresholds</h4>
                <ul className="text-xs text-slate-600 dark:text-emerald-100/90 mt-2 space-y-1">
                  <li>• Max OTR: ≤ <span className="font-semibold">{requirements.requiredOtrMax}</span> cc/m²·day</li>
                  <li>• Max WVTR: ≤ <span className="font-semibold">{requirements.requiredWvtrMax}</span> g/m²·day</li>
                  <li>• Light Opacity: {requirements.lightProtectionRequired ? 'Required (>70%)' : 'Optional'}</li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-200/60 dark:border-blue-900/60 text-[11px] font-medium text-blue-800 dark:text-blue-300">
                Screens hard constraints
              </div>
            </div>

            {/* Step 4: Material Matching */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#0c382a] border border-slate-200 dark:border-[#17523d] flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-emerald-300 uppercase tracking-wider mb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-emerald-800 flex items-center justify-center text-slate-800 dark:text-emerald-100 text-[10px] font-bold border border-slate-200 dark:border-emerald-700">4</span>
                  Candidate Fit
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{candidate.material.code}</h4>
                <ul className="text-xs text-slate-600 dark:text-emerald-100/90 mt-2 space-y-1">
                  <li>• ASTM D3985 OTR: <span className="font-semibold text-emerald-700 dark:text-emerald-300">{candidate.material.otr}</span> cc</li>
                  <li>• ASTM F1249 WVTR: <span className="font-semibold text-emerald-700 dark:text-emerald-300">{candidate.material.wvtr}</span> g</li>
                  <li>• Light Block: {candidate.material.lightBarrierPercent}%</li>
                  <li>• TOPSIS Rank: <span className="font-bold text-emerald-800 dark:text-emerald-300">#{candidate.rank}</span></li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-200/60 dark:border-[#17523d] text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Hard constraints passed
              </div>
            </div>
          </div>

          {/* Rationale Breakdown */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#061e16] border border-slate-200 dark:border-[#134937]">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Scientific Rationale & Traceability
            </h4>
            <div className="text-xs text-slate-700 dark:text-emerald-200 space-y-2">
              <p>{candidate.fitAssessment[language]}</p>
              <p className="text-slate-600 dark:text-emerald-300/80 font-medium">{candidate.mainTradeoff[language]}</p>
            </div>
          </div>

          {/* Source Citations */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-700 dark:text-emerald-400" />
              Verified Standard & Literature Citations ({relevantSources.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relevantSources.map(source => (
                <div key={source.id} className="p-3 rounded-lg border border-slate-200 dark:border-[#17523d] bg-white dark:bg-[#0c382a] hover:border-slate-300 dark:hover:border-[#1b5e46]">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-emerald-400 mb-1">
                    <span className="font-mono font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                      {source.id}
                    </span>
                    <span className="capitalize">{source.sourceType.replace('_', ' ')} • {source.year}</span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">{source.title}</h5>
                  <p className="text-[11px] text-slate-600 dark:text-emerald-200/70 mt-1 line-clamp-2">{source.summary}</p>
                  <div className="mt-2 text-[10px] text-slate-400 dark:text-emerald-400/60 truncate">
                    Publisher: {source.publisherOrOrg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-[#134937] bg-slate-50 dark:bg-[#061e16] rounded-b-2xl flex items-center justify-between text-xs text-slate-500 dark:text-emerald-400">
          <span>Evidence Coverage: <strong className="text-slate-800 dark:text-white">{candidate.evidenceCoveragePercent}%</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Close Evidence Graph
          </button>
        </div>
      </div>
    </div>
  );
};
