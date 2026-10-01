import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { useI18n } from '../../locales/i18n.tsx';
import { Commodity, CandidateEvaluation } from '../../types/index.ts';
import { COMMODITIES } from '../../data/commodities.ts';
import { PACKAGING_MATERIALS } from '../../data/materials.ts';
import { generatePackagingRecommendation } from '../../engine/recommend.ts';

interface SpecGeneratorViewProps {
  initialCommodity?: Commodity;
  initialCandidate?: CandidateEvaluation;
}

export const SpecGeneratorView: React.FC<SpecGeneratorViewProps> = ({
  initialCommodity,
  initialCandidate
}) => {
  const { t, language } = useI18n();

  const [commodityId, setCommodityId] = useState<string>(
    initialCommodity?.id || 'potato_chips'
  );
  const [materialId, setMaterialId] = useState<string>(
    initialCandidate ? initialCandidate.material.id : 'met_bopp_laminate_35'
  );
  const [copied, setCopied] = useState(false);

  const selectedCommodity =
    COMMODITIES.find(c => c.id === commodityId) || COMMODITIES[0];
  const selectedMaterial =
    PACKAGING_MATERIALS.find(m => m.id === materialId) || PACKAGING_MATERIALS[0];

  const defaultStorage = {
    temperatureC: selectedCommodity.typicalStorageTempC,
    relativeHumidity: selectedCommodity.typicalStorageRH,
    storageMode: 'ambient' as const,
    sunlightExposure: 'indirect' as const,
    handlingStress: 'standard' as const,
    targetShelfLifeDays: selectedCommodity.targetShelfLifeDays
  };

  const rec = generatePackagingRecommendation(selectedCommodity, defaultStorage);

  const specId = `SPEC-${selectedCommodity.id.toUpperCase().substring(0, 4)}-${selectedMaterial.code.replace(/[^a-zA-Z0-9]/g, '')}`;

  const specText = `===============================================================
BIOPACK AI — SUPPLIER-READY PACKAGING SPECIFICATION
Specification ID: ${specId}
Date Generated: ${new Date().toISOString().split('T')[0]}
Product: ${selectedCommodity.name.en} (${selectedCommodity.fssaiCategory})
Target Shelf Life: ${selectedCommodity.targetShelfLifeDays} Days

1. CRITICAL BARRIER THRESHOLDS (MAXIMUM PERMISSIBLE TRANSMISSION)
- Oxygen Transmission Rate (OTR): <= ${rec.requirements.requiredOtrMax} cc / m2 / 24hr / 1 atm @ 23C, 0% RH (ASTM D3985)
- Water Vapor Transmission Rate (WVTR): <= ${rec.requirements.requiredWvtrMax} g / m2 / 24hr @ 38C, 90% RH (ASTM F1249)
- Light Protection: ${rec.requirements.lightProtectionRequired ? 'Required (>80% optical opacity)' : 'Standard'}
- Hermetic Seal: ${rec.requirements.hermeticSealRequired ? 'Required (zero pinhole leakage)' : 'Standard'}

2. RECOMMENDED SPECIFICATION STRUCTURE
- Material Description: ${selectedMaterial.name.en}
- Industry Code: ${selectedMaterial.code}
- Nominal Thickness: ${selectedMaterial.nominalThicknessUm} um (+/-5%)
- Structure Description: ${selectedMaterial.structureDescription.en}
- Certified OTR: ${selectedMaterial.otr} cc / m2 / 24hr
- Certified WVTR: ${selectedMaterial.wvtr} g / m2 / 24hr
- Tensile Strength: >= ${selectedMaterial.tensileStrengthMpa} MPa
- Recyclability Category: ${selectedMaterial.recyclability}

3. SEALING & PROCESSING WINDOW
- Seal Profile: Fin seal / Lap seal (10mm width minimum)
- Target Seal Temperature: 120C - 145C (dwell time 0.8s, pressure 4.0 bar)
- Seal Strength Acceptance: >= 15 N / 15mm (ASTM F88 / F88M)

4. MANDATORY REGULATORY COMPLIANCE CERTIFICATION REQUIRED
- Direct Food Contact: FSSAI Packaging Regulations 2018 (Section 3 & 4)
- Overall Migration Limit: <= 60 mg/kg or 10 mg/dm2 as per IS 9845 / BIS
- Heavy Metals & Phthalates: Negative test certificate (RoHS / REACH compliant)
- Ink / Solvent Retention: Reverse-printed inks only; zero food-contact transfer
===============================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(specText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in text-slate-900 dark:text-emerald-100">
      {/* Header */}
      <div className="bg-white dark:bg-[#082a1f] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Converter & Extruder Export Sheet
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.spec.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
            {t.spec.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#061d15] dark:hover:bg-[#0c382a] text-slate-700 dark:text-emerald-300 border border-slate-200 dark:border-[#134937] font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : t.spec.copySpec}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{t.spec.printSpec}</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar (no-print) */}
      <div className="bg-white dark:bg-[#082a1f] p-4 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 no-print">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 mb-1">
            {language === 'hi' ? 'लक्षित खाद्य पदार्थ' : language === 'mr' ? 'लक्षित अन्न पदार्थ' : 'Target Commodity'}
          </label>
          <select
            value={commodityId}
            onChange={e => setCommodityId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#061d15] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {COMMODITIES.map(c => (
              <option key={c.id} value={c.id} className="dark:bg-[#082a1f]">
                {c.name[language]} ({c.fssaiCategory})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 mb-1">
            {language === 'hi' ? 'पैकेजिंग सामग्री संरचना' : language === 'mr' ? 'पॅकेजिंग रचना' : 'Packaging Structure'}
          </label>
          <select
            value={materialId}
            onChange={e => setMaterialId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#061d15] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {PACKAGING_MATERIALS.map(m => (
              <option key={m.id} value={m.id} className="dark:bg-[#082a1f]">
                {m.name[language]} ({m.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Specification Document Body (Printable) */}
      <div className="bg-white dark:bg-[#082a1f] p-8 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-sm space-y-6 text-slate-900 dark:text-emerald-100">
        {/* Document Header */}
        <div className="border-b border-slate-200 dark:border-[#134937] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 dark:text-emerald-400">
              BioPack AI Technical Data Sheet
            </div>
            <h2 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
              Packaging Specification Sheet
            </h2>
            <div className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
              Target Food: <strong className="text-slate-800 dark:text-white">{selectedCommodity.name[language]}</strong> | Shelf Life: <strong className="text-slate-800 dark:text-white">{selectedCommodity.targetShelfLifeDays} Days</strong>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-[#061d15] text-slate-700 dark:text-emerald-300 border border-slate-200 dark:border-[#134937]">
              {specId}
            </span>
            <div className="text-[11px] text-slate-400 dark:text-emerald-400/60 mt-1 font-mono">
              Date: {new Date().toISOString().split('T')[0]}
            </div>
          </div>
        </div>

        {/* Section 1: Target Requirements */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 flex items-center gap-1.5 border-b border-slate-100 dark:border-[#134937] pb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>{t.spec.targetSection}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
              <span className="text-slate-500 dark:text-emerald-400/70">Max Permissible OTR (ASTM D3985):</span>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                ≤ {rec.requirements.requiredOtrMax} cc / m² · 24hr · 1 atm @ 23°C
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
              <span className="text-slate-500 dark:text-emerald-400/70">Max Permissible WVTR (ASTM F1249):</span>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                ≤ {rec.requirements.requiredWvtrMax} g / m² · 24hr @ 38°C, 90% RH
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
              <span className="text-slate-500 dark:text-emerald-400/70">Optical Light Barrier:</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                {rec.requirements.lightProtectionRequired ? 'Required (>80% optical opacity)' : 'Commercial Standard'}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
              <span className="text-slate-500 dark:text-emerald-400/70">Hermetic Seal Requirement:</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                {rec.requirements.hermeticSealRequired ? 'Zero micro-channels (Pinhole-free)' : 'Breathable film specification'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Specified Structure */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 flex items-center gap-1.5 border-b border-slate-100 dark:border-[#134937] pb-1.5">
            <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>{t.spec.certifiedSection}</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937] space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 dark:text-emerald-400/70">Material Name:</span>
                <div className="font-bold text-slate-900 dark:text-white">{selectedMaterial.name[language]}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-emerald-400/70">Industry Code:</span>
                <div className="font-mono font-bold text-emerald-800 dark:text-emerald-300">{selectedMaterial.code}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-emerald-400/70">Nominal Thickness:</span>
                <div className="font-mono font-bold text-slate-900 dark:text-white">{selectedMaterial.nominalThicknessUm} µm (±5%)</div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-[#134937] pt-2 text-slate-600 dark:text-emerald-200/80">
              <strong className="text-slate-800 dark:text-white">Layer Construction: </strong>
              {selectedMaterial.structureDescription[language]}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-[#134937] text-[11px]">
              <div>
                <span className="text-slate-400 dark:text-emerald-400/60">Tensile Strength:</span>
                <div className="font-mono font-bold text-slate-800 dark:text-emerald-100">≥ {selectedMaterial.tensileStrengthMpa} MPa</div>
              </div>
              <div>
                <span className="text-slate-400 dark:text-emerald-400/60">Light Blocking:</span>
                <div className="font-mono font-bold text-slate-800 dark:text-emerald-100">{selectedMaterial.lightBarrierPercent}%</div>
              </div>
              <div>
                <span className="text-slate-400 dark:text-emerald-400/60">Thermal Service:</span>
                <div className="font-mono font-bold text-slate-800 dark:text-emerald-100">{selectedMaterial.minTempC}°C to {selectedMaterial.maxTempC}°C</div>
              </div>
              <div>
                <span className="text-slate-400 dark:text-emerald-400/60">Recyclability:</span>
                <div className="font-mono font-bold text-emerald-800 dark:text-emerald-300">{selectedMaterial.recyclability}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Sealing & Geometry */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 border-b border-slate-100 dark:border-[#134937] pb-1.5">
            {t.spec.sealSection}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
              <span className="text-slate-500 dark:text-emerald-400/70">Seal Width:</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">10 mm continuous bead</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
              <span className="text-slate-500 dark:text-emerald-400/70">Heat-Seal Window:</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">120°C - 145°C @ 4.0 bar</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937]">
              <span className="text-slate-500 dark:text-emerald-400/70">ASTM F88 Seal Strength:</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">≥ 15 N / 15mm width</div>
            </div>
          </div>
        </div>

        {/* Section 4: Mandatory Regulatory Compliance */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-300 border-b border-slate-100 dark:border-[#134937] pb-1.5">
            {t.spec.regulatorySection}
          </h3>
          <ul className="text-xs text-slate-700 dark:text-emerald-200/90 space-y-1.5 list-disc list-inside">
            <li><strong className="text-slate-900 dark:text-white">FSSAI Packaging Regulations, 2018:</strong> Must be manufactured from virgin, food-grade polymer resins.</li>
            <li><strong className="text-slate-900 dark:text-white">Overall Migration Limit (IS 9845):</strong> Total migration into aqueous and fatty food simulants must not exceed 60 mg/kg or 10 mg/dm².</li>
            <li><strong className="text-slate-900 dark:text-white">Printing Inks:</strong> All inks must be reverse printed on the outer substrate; zero migration into internal food contact face.</li>
            <li><strong className="text-slate-900 dark:text-white">Plastic Waste Management Rules, 2022:</strong> Certified under Category {selectedMaterial.recyclability} with Extended Producer Responsibility (EPR) registration.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
