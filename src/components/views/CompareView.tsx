import React, { useState } from 'react';
import { PACKAGING_MATERIALS } from '../../data/materials.ts';
import { PackagingMaterial } from '../../types/index.ts';
import { useI18n } from '../../locales/i18n.tsx';
import { VoiceButton } from '../VoiceButton.tsx';
import { Check, X, ShieldCheck, Scale, ArrowRight } from 'lucide-react';

export const CompareView: React.FC = () => {
  const { t, language } = useI18n();

  const [selectedIds, setSelectedIds] = useState<string[]>([
    'met_bopp_laminate_35',
    'mono_mdo_pe_barrier_60',
    'alu_foil_laminate_80'
  ]);

  const toggleMaterial = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        // replace first
        setSelectedIds([selectedIds[1], selectedIds[2], id]);
      }
    }
  };

  const selectedMaterials = selectedIds
    .map(id => PACKAGING_MATERIALS.find(m => m.id === id))
    .filter(Boolean) as PackagingMaterial[];

  const narrationText =
    language === 'hi'
      ? `पैकेजिंग सामग्रियों की तुलना: मेटलाइज्ड बीओपीपी नमी और वसा के लिए उत्कृष्ट है। मोनो-मटीरियल एमडीओ-पीई पुनर्चक्रण में सबसे आगे है। एल्युमिनियम फॉयल 100% प्रकाश और गैस अवरोध देता है लेकिन पुनर्चक्रण में कठिन है।`
      : language === 'mr'
      ? `साहित्याची तुलना: मेटलाईझ्ड बीओपीपी ओलावा व तेलासाठी उत्तम आहे. मोनो-मटेरियल एमडीओ-पीई १००% पुनर्वापरयोग्य आहे. ॲल्युमिनियम फॉइल सर्वोत्तम संरक्षण देते पण पुनर्वापरात गुंतागुंतीचे आहे.`
      : `Comparing materials: Metallized BOPP offers high moisture and grease barrier for snacks. Recyclable Mono-material MDO-PE provides sustainable barrier in a 100% PE stream. Aluminum foil laminate offers zero transmission but carries higher carbon footprint.`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-[#09271d] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Multi-Material Benchmarking
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.compare.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
            {t.compare.subtitle}
          </p>
        </div>
        <VoiceButton textToSpeak={narrationText} label={t.form.listenField} />
      </div>

      {/* Material Selector Pills */}
      <div className="bg-white dark:bg-[#09271d] p-5 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs space-y-3 transition-colors">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-200">
          {t.compare.selectUpToThree} ({selectedIds.length}/3 selected):
        </div>
        <div className="flex flex-wrap gap-2">
          {PACKAGING_MATERIALS.map(m => {
            const isSelected = selectedIds.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMaterial(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white font-semibold shadow-2xs ring-2 ring-emerald-500/30'
                    : 'bg-slate-100 dark:bg-[#061e16] hover:bg-slate-200 dark:hover:bg-[#0c3829] text-slate-700 dark:text-emerald-200 border border-slate-200 dark:border-[#134937]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{m.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-[#09271d] rounded-2xl border border-slate-200 dark:border-[#134937] overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#061e16] border-b border-slate-200 dark:border-[#134937] text-slate-700 dark:text-emerald-200 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 w-1/4">{t.compare.tableHeaderMetric}</th>
                {selectedMaterials.map(m => (
                  <th key={m.id} className="p-4 w-1/4 font-extrabold text-slate-900 dark:text-white">
                    <div className="font-mono text-emerald-700 dark:text-emerald-400 text-xs font-semibold">{m.code}</div>
                    <div className="text-sm mt-0.5">{m.name[language]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#134937]">
              {/* Category & Structure */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#0d3b2b]/40 transition-colors">
                <td className="p-4 font-semibold text-slate-600 dark:text-emerald-300">Material Category</td>
                {selectedMaterials.map(m => (
                  <td key={m.id} className="p-4 capitalize text-slate-800 dark:text-emerald-100 font-medium">
                    {m.category.replace('_', ' ')}
                  </td>
                ))}
              </tr>

              {/* Nominal Thickness */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#0d3b2b]/40 transition-colors">
                <td className="p-4 font-semibold text-slate-600 dark:text-emerald-300">Nominal Thickness</td>
                {selectedMaterials.map(m => (
                  <td key={m.id} className="p-4 font-mono font-medium text-slate-800 dark:text-emerald-100">
                    {m.nominalThicknessUm} µm
                  </td>
                ))}
              </tr>

              {/* OTR (ASTM D3985) */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#0d3b2b]/40 transition-colors">
                <td className="p-4 font-semibold text-slate-600 dark:text-emerald-300">
                  <div>{t.compare.otrLabel}</div>
                  <div className="text-[10px] text-slate-400 dark:text-emerald-400/60 font-normal">cc / m² · day @ 23°C (lower is better)</div>
                </td>
                {selectedMaterials.map(m => (
                  <td key={m.id} className="p-4">
                    <span className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs ${
                      m.otr <= 5
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : m.otr <= 50
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-slate-100 dark:bg-[#061e16] text-slate-800 dark:text-emerald-200 border border-slate-200 dark:border-[#134937]'
                    }`}>
                      {m.otr} cc
                    </span>
                  </td>
                ))}
              </tr>

              {/* WVTR (ASTM F1249) */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#0d3b2b]/40 transition-colors">
                <td className="p-4 font-semibold text-slate-600 dark:text-emerald-300">
                  <div>{t.compare.wvtrLabel}</div>
                  <div className="text-[10px] text-slate-400 dark:text-emerald-400/60 font-normal">g / m² · day @ 38°C, 90% RH (lower is better)</div>
                </td>
                {selectedMaterials.map(m => (
                  <td key={m.id} className="p-4">
                    <span className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs ${
                      m.wvtr <= 1.0
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : m.wvtr <= 5.0
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-slate-100 dark:bg-[#061e16] text-slate-800 dark:text-emerald-200 border border-slate-200 dark:border-[#134937]'
                    }`}>
                      {m.wvtr} g
                    </span>
                  </td>
                ))}
              </tr>

              {/* Tensile Strength */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#0d3b2b]/40 transition-colors">
                <td className="p-4 font-semibold text-slate-600 dark:text-emerald-300">
                  <div>{t.compare.tensileLabel}</div>
                  <div className="text-[10px] text-slate-400 dark:text-emerald-400/60 font-normal">Puncture & mechanical resistance</div>
                </td>
                {selectedMaterials.map(m => (
                  <td key={m.id} className="p-4 font-mono font-medium text-slate-800 dark:text-emerald-100">
                    {m.tensileStrengthMpa} MPa
                  </td>
                ))}
              </tr>

              {/* Light Barrier */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#0d3b2b]/40 transition-colors">
                <td className="p-4 font-semibold text-slate-600 dark:text-emerald-300">{t.compare.lightLabel}</td>
                {selectedMaterials.map(m => (
                  <td key={m.id} className="p-4 font-medium text-slate-800 dark:text-emerald-100">
                    {m.lightBarrierPercent}% optical opacity
                  </td>
                ))}
              </tr>

              {/* Recyclability & Sustainability */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#0d3b2b]/40 transition-colors">
                <td className="p-4 font-semibold text-slate-600 dark:text-emerald-300">
                  <div>{t.compare.ecoScore}</div>
                  <div className="text-[10px] text-slate-400 dark:text-emerald-400/60 font-normal">Plastic Waste Management EPR Rules</div>
                </td>
                {selectedMaterials.map(m => (
                  <td key={m.id} className="p-4">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">{m.sustainabilityScore}/10</span>
                    <div className="text-[10px] text-slate-500 dark:text-emerald-400/70 font-mono mt-0.5">{m.recyclability}</div>
                  </td>
                ))}
              </tr>

              {/* Relative Cost */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#0d3b2b]/40 transition-colors">
                <td className="p-4 font-semibold text-slate-600 dark:text-emerald-300">
                  <div>{t.compare.costLabel}</div>
                  <div className="text-[10px] text-slate-400 dark:text-emerald-400/60 font-normal">1 = economical, 10 = premium barrier</div>
                </td>
                {selectedMaterials.map(m => (
                  <td key={m.id} className="p-4 font-bold text-slate-800 dark:text-emerald-100">
                    {m.costIndex} / 10
                  </td>
                ))}
              </tr>

              {/* Food Contact Status */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#0d3b2b]/40 transition-colors">
                <td className="p-4 font-semibold text-slate-600 dark:text-emerald-300">{t.compare.fssaiLabel}</td>
                {selectedMaterials.map(m => (
                  <td key={m.id} className="p-4 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Compliant (IS 9845)</span>
                  </td>
                ))}
              </tr>

              {/* Typical Applications */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-[#0d3b2b]/40 transition-colors">
                <td className="p-4 font-semibold text-slate-600 dark:text-emerald-300">Primary Applications</td>
                {selectedMaterials.map(m => (
                  <td key={m.id} className="p-4 text-slate-600 dark:text-emerald-200/80 text-[11px] leading-relaxed">
                    {m.typicalApplications[language]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
