import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useI18n } from '../../locales/i18n.tsx';
import { PACKAGING_MATERIALS } from '../../data/materials.ts';
import { COMMODITIES } from '../../data/commodities.ts';
import { SCIENTIFIC_SOURCES } from '../../data/sources.ts';

export const KnowledgeView: React.FC = () => {
  const { t, language } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'materials' | 'commodities' | 'standards'>('materials');

  const filteredMaterials = PACKAGING_MATERIALS.filter(m =>
    m.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommodities = COMMODITIES.filter(c =>
    c.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSources = SCIENTIFIC_SOURCES.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-[#09271d] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-emerald-950 text-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800">
            Open FoodTech Repository
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.nav.knowledge}
          </h1>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
            Searchable verified scientific properties, ASTM test methods, and regulatory references.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder={language === 'hi' ? 'खोजें...' : language === 'mr' ? 'शोधा...' : 'Search repository...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#061d15] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#134937] text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('materials')}
          className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'materials'
              ? 'border-emerald-600 dark:border-emerald-400 text-slate-900 dark:text-emerald-300'
              : 'border-transparent text-slate-500 dark:text-emerald-400/60 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Packaging Materials ({filteredMaterials.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('commodities')}
          className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'commodities'
              ? 'border-emerald-600 dark:border-emerald-400 text-slate-900 dark:text-emerald-300'
              : 'border-transparent text-slate-500 dark:text-emerald-400/60 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Food Commodities ({filteredCommodities.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('standards')}
          className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'standards'
              ? 'border-emerald-600 dark:border-emerald-400 text-slate-900 dark:text-emerald-300'
              : 'border-transparent text-slate-500 dark:text-emerald-400/60 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Standards & Citations ({filteredSources.length})
        </button>
      </div>

      {/* Tab 1: Materials */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map(m => (
            <div key={m.id} className="p-5 rounded-2xl bg-white dark:bg-[#09271d] border border-slate-200 dark:border-[#134937] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-emerald-300 bg-slate-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-slate-200 dark:border-emerald-800">
                  {m.code}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-emerald-300/70">{m.recyclability}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{m.name[language]}</h3>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80">{m.structureDescription[language]}</p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-[#134937] text-[11px]">
                <div className="p-2 rounded bg-slate-50 dark:bg-[#07251c]">
                  <span className="text-slate-400 dark:text-emerald-400/60">OTR (ASTM D3985):</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{m.otr} cc</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-[#07251c]">
                  <span className="text-slate-400 dark:text-emerald-400/60">WVTR (ASTM F1249):</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{m.wvtr} g</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-[#07251c]">
                  <span className="text-slate-400 dark:text-emerald-400/60">Thickness:</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{m.nominalThicknessUm} µm</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Commodities */}
      {activeTab === 'commodities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommodities.map(c => (
            <div key={c.id} className="p-5 rounded-2xl bg-white dark:bg-[#09271d] border border-slate-200 dark:border-[#134937] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-emerald-300/70">{c.fssaiCategory}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-emerald-950 text-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800">
                  Verified Matrix
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{c.name[language]}</h3>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-[#134937] text-[11px]">
                <div className="p-1.5 rounded bg-slate-50 dark:bg-[#07251c]">
                  <span className="text-slate-400 dark:text-emerald-400/60">Moisture:</span>
                  <div className="font-bold text-slate-900 dark:text-white">{c.moistureContent}%</div>
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-[#07251c]">
                  <span className="text-slate-400 dark:text-emerald-400/60">Fat:</span>
                  <div className="font-bold text-slate-900 dark:text-white">{c.fatContent}%</div>
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-[#07251c]">
                  <span className="text-slate-400 dark:text-emerald-400/60">aw:</span>
                  <div className="font-bold text-slate-900 dark:text-white">{c.waterActivity || '-'}</div>
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-[#07251c]">
                  <span className="text-slate-400 dark:text-emerald-400/60">Target Life:</span>
                  <div className="font-bold text-slate-900 dark:text-white">{c.targetShelfLifeDays}d</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Standards */}
      {activeTab === 'standards' && (
        <div className="space-y-3">
          {filteredSources.map(s => (
            <div key={s.id} className="p-5 rounded-2xl bg-white dark:bg-[#09271d] border border-slate-200 dark:border-[#134937] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-emerald-300 bg-slate-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-slate-200 dark:border-emerald-800">
                  {s.id}
                </span>
                <span className="text-xs text-slate-400 dark:text-emerald-400/60 capitalize">{s.sourceType.replace('_', ' ')} • {s.year}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed">{s.summary}</p>
              <div className="text-[11px] text-slate-500 dark:text-emerald-300/70 pt-1 font-medium">
                Publisher: {s.publisherOrOrg}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
