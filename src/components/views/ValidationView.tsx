import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  FileCheck,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useI18n } from '../../locales/i18n.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { ValidationTestLog, Commodity, CandidateEvaluation } from '../../types/index.ts';
import { VoiceButton } from '../VoiceButton.tsx';

interface ValidationViewProps {
  initialCommodity?: Commodity;
  initialCandidate?: CandidateEvaluation;
}

export const ValidationView: React.FC<ValidationViewProps> = ({
  initialCommodity,
  initialCandidate
}) => {
  const { t, language } = useI18n();
  const { user } = useAuth();

  // Test logs (resets fresh per session, not kept after logout)
  const [logs, setLogs] = useState<ValidationTestLog[]>([
    {
      id: 'trial-1',
      testDate: '2026-03-15',
      batchLotNumber: 'LOT-2026-03A',
      materialUsed: initialCandidate ? initialCandidate.material.code : 'BOPP/Met-BOPP',
      testCondition: '38°C / 90% RH (Accelerated)',
      durationDaysElapsed: 30,
      observedMoistureChangePercent: 0.4,
      observedCrispnessOrSensoryScore: 9,
      observedSealFailure: false,
      status: 'VALIDATED',
      notes: 'Zero delamination. Moisture gain within acceptable limit (<1.0%). Pouch seal intact under vacuum.'
    },
    {
      id: 'trial-2',
      testDate: '2026-03-22',
      batchLotNumber: 'LOT-2026-03B',
      materialUsed: 'LDPE-50',
      testCondition: '30°C / 75% RH (Ambient Tropical)',
      durationDaysElapsed: 45,
      observedMoistureChangePercent: 2.8,
      observedCrispnessOrSensoryScore: 4,
      observedSealFailure: false,
      status: 'FAILED',
      notes: 'Significant crispness loss due to high WVTR permeation. Failed shelf-life acceptance.'
    }
  ]);

  // New trial form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [batchNum, setBatchNum] = useState('');
  const [materialUsed, setMaterialUsed] = useState(
    initialCandidate ? initialCandidate.material.code : 'Met-BOPP/PE'
  );
  const [condition, setCondition] = useState('38°C / 90% RH (Accelerated)');
  const [days, setDays] = useState(30);
  const [moistureDelta, setMoistureDelta] = useState(0.5);
  const [sensoryScore, setSensoryScore] = useState(8);
  const [trialStatus, setTrialStatus] = useState<ValidationTestLog['status']>('VALIDATED');
  const [notes, setNotes] = useState('');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: ValidationTestLog = {
      id: 'trial-' + Date.now(),
      testDate: new Date().toISOString().split('T')[0],
      batchLotNumber: batchNum || `BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      materialUsed,
      testCondition: condition,
      durationDaysElapsed: Number(days),
      observedMoistureChangePercent: Number(moistureDelta),
      observedCrispnessOrSensoryScore: Number(sensoryScore),
      observedSealFailure: false,
      status: trialStatus,
      notes: notes || (language === 'hi' ? 'परीक्षण सफलतापूर्वक दर्ज हुआ।' : language === 'mr' ? 'चाचणी यशस्वीरित्या नोंदवली.' : 'Trial recorded successfully.')
    };

    setLogs([newLog, ...logs]);
    setShowAddForm(false);
    setBatchNum('');
    setNotes('');
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VALIDATED':
        return 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'PARTIALLY_VALIDATED':
        return 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'FAILED':
        return 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700';
      case 'PENDING':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  const narrationSummary =
    language === 'hi'
      ? 'सत्यापन लैब में आपका स्वागत है। भौतिक परीक्षण किए बिना नई पैकेजिंग कभी लागू न करें। यहां आप मानक परीक्षण प्रोटोकॉल देख सकते हैं और त्वरित शेल्फ-लाइफ परीक्षणों का डेटा रिकॉर्ड कर सकते हैं।'
      : language === 'mr'
      ? 'पडताळणी प्रयोगशाळेमध्ये आपले स्वागत आहे. प्रत्यक्ष चाचणी केल्याशिवाय नवीन पॅकेजिंग लागू करू नका. येथे आपण चाचणी आराखडा पाहू शकता आणि निकाल नोंदवू शकता.'
      : 'Welcome to the Validation Lab. Never adopt packaging without physical trial verification. Review the standardized testing protocol and log empirical shelf-life trial data.';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in text-slate-900 dark:text-emerald-100">
      {/* Header */}
      <div className="bg-white dark:bg-[#082a1f] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {language === 'hi' ? 'भौतिक परीक्षण एवं गुणवत्ता आश्वासन' : language === 'mr' ? 'भौतिक चाचणी आणि गुणवत्ता हमी' : 'Physical Testing & QA Suite'}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {t.validation.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
            {t.validation.subtitle}
          </p>
        </div>
        <VoiceButton textToSpeak={narrationSummary} label={t.form.listenField} />
      </div>

      {/* Suggested Validation Protocol Card */}
      <div className="bg-white dark:bg-[#082a1f] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.validation.protocolTitle}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-emerald-400/60">DOC-VAL-2026</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937] text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed">
          <strong className="text-slate-800 dark:text-white">
            {language === 'hi' ? 'महत्वपूर्ण सूचना: ' : language === 'mr' ? 'महत्त्वाची सूचना: ' : 'Notice: '}
          </strong>
          {t.validation.protocolDisclaimer}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937] space-y-2">
            <div className="font-bold uppercase tracking-wider text-[11px] text-emerald-800 dark:text-emerald-300">
              {language === 'hi' ? '1. त्वरित भंडारण परीक्षण (ASLT)' : language === 'mr' ? '1. जलद साठवणूक चाचणी (ASLT)' : '1. Accelerated Storage Test'}
            </div>
            <p className="text-slate-600 dark:text-emerald-200/80 leading-relaxed">
              {language === 'hi'
                ? 'स्थिरता कक्ष में 38°C ± 1°C और 90% ± 2% RH पर 30-60 दिनों तक 10 सीलबंद पाउच रखें।'
                : language === 'mr'
                ? '३८°C ± १°C आणि ९०% ± २% RH वर ३० ते ६० दिवस १० सीलबंद पाऊच ठेवा.'
                : 'Place 10 sealed pouches in a controlled stability chamber at 38°C ± 1°C and 90% ± 2% RH for 30–60 days.'}
            </p>
            <div className="text-[11px] font-mono text-slate-400 dark:text-emerald-400/60">Ref: ASTM F1980</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937] space-y-2">
            <div className="font-bold uppercase tracking-wider text-[11px] text-emerald-800 dark:text-emerald-300">
              {language === 'hi' ? '2. सील अखंडता एवं मजबूती' : language === 'mr' ? '2. सील इंटिग्रिटी व मजबुती' : '2. Seal Integrity & Strength'}
            </div>
            <p className="text-slate-600 dark:text-emerald-200/80 leading-relaxed">
              {language === 'hi'
                ? '15 मिमी पट्टी पर सील तनाव शक्ति मापें। स्वीकृति मानक: बिना किसी रिसाव के न्यूनतम 15 N / 15mm।'
                : language === 'mr'
                ? '१५ मिमी पट्टीवर सील ताकद मोजा. निकष: गळती नसताना किमान १५ N / १५ मिमी.'
                : 'Measure fin/lap seal tensile separation on a 15mm strip. Acceptance criterion: minimum 15 N / 15mm without channel leaks.'}
            </p>
            <div className="text-[11px] font-mono text-slate-400 dark:text-emerald-400/60">Ref: ASTM F88 / ASTM D3078</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937] space-y-2">
            <div className="font-bold uppercase tracking-wider text-[11px] text-emerald-800 dark:text-emerald-300">
              {language === 'hi' ? '3. संवेदी एवं वसा ऑक्सीकरण' : language === 'mr' ? '3. संवेदी व ऑक्सिडेशन चाचणी' : '3. Sensory & Oxidation'}
            </div>
            <p className="text-slate-600 dark:text-emerald-200/80 leading-relaxed">
              {language === 'hi'
                ? 'लिपिड पेरोक्साइड मान (PV < 10 meq O₂/kg) और प्रशिक्षित पैनल द्वारा स्वाद/गंध का मूल्यांकन करें।'
                : language === 'mr'
                ? 'लिपिड पेरॉक्साइड मूल्य (PV < १० meq O₂/kg) आणि पॅनेलद्वारे चव/वासाचे मूल्यमापन करा.'
                : 'Evaluate lipid peroxide value (PV < 10 meq O₂/kg) and conduct trained panel triangle tests for off-flavor/rancidity.'}
            </p>
            <div className="text-[11px] font-mono text-slate-400 dark:text-emerald-400/60">Ref: ISO 8586 / FSSAI Lab Manual</div>
          </div>
        </div>
      </div>

      {/* Trial Logger Section */}
      <div className="bg-white dark:bg-[#082a1f] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.validation.loggerTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70">
              {language === 'hi'
                ? 'अपने आंतरिक बैच शेल्फ-लाइफ परीक्षणों को रिकॉर्ड करें और ट्रैक करें।'
                : language === 'mr'
                ? 'आपल्या बॅच शेल्फ-लाइफ चाचण्या नोंदवा आणि ट्रॅक करा.'
                : 'Record and track your internal batch shelf-life trials.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.validation.logBatch}</span>
          </button>
        </div>

        {/* Add Trial Form Modal/Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddLog} className="p-5 rounded-xl bg-slate-50 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937] space-y-4 animate-in fade-in">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-emerald-200">
              {language === 'hi' ? 'नया बैच परीक्षण प्रविष्टि' : language === 'mr' ? 'नवीन बॅच चाचणी नोंद' : 'New Batch Trial Entry'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-emerald-200 mb-1 font-semibold">
                  {language === 'hi' ? 'बैच / लॉट संख्या' : language === 'mr' ? 'बॅच / लॉट क्र.' : 'Batch / Lot #'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. LOT-2026-04"
                  value={batchNum}
                  onChange={e => setBatchNum(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#082a1f] text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-emerald-200 mb-1 font-semibold">
                  {language === 'hi' ? 'परीक्षित सामग्री' : language === 'mr' ? 'चाचणी केलेले साहित्य' : 'Material Tested'}
                </label>
                <input
                  type="text"
                  value={materialUsed}
                  onChange={e => setMaterialUsed(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#082a1f] text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-emerald-200 mb-1 font-semibold">
                  {language === 'hi' ? 'परीक्षण स्थिति' : language === 'mr' ? 'चाचणी स्थिती' : 'Test Condition'}
                </label>
                <input
                  type="text"
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#082a1f] text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-emerald-200 mb-1 font-semibold">
                  {language === 'hi' ? 'बीते हुए दिन' : language === 'mr' ? 'उलटलेले दिवस' : 'Days Elapsed'}
                </label>
                <input
                  type="number"
                  value={days}
                  onChange={e => setDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#082a1f] text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-emerald-200 mb-1 font-semibold">
                  {language === 'hi' ? 'नमी परिवर्तन (%)' : language === 'mr' ? 'ओलावा बदल (%)' : 'Moisture Change (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={moistureDelta}
                  onChange={e => setMoistureDelta(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#082a1f] text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-emerald-200 mb-1 font-semibold">
                  {language === 'hi' ? 'परीक्षण स्थिति' : language === 'mr' ? 'चाचणी निष्कर्ष' : 'Trial Status'}
                </label>
                <select
                  value={trialStatus}
                  onChange={e => setTrialStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#082a1f] text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="VALIDATED">VALIDATED</option>
                  <option value="PARTIALLY_VALIDATED">PARTIALLY VALIDATED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-700 dark:text-emerald-200 mb-1 font-semibold">
                  {language === 'hi' ? 'टिप्पणी एवं अवलोकन' : language === 'mr' ? 'निरीक्षणे व नोंदी' : 'Observations & Notes'}
                </label>
                <input
                  type="text"
                  placeholder="Notes on crispness, seal failure, or sensory changes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#17523d] bg-white dark:bg-[#082a1f] text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-[#17523d] text-xs font-semibold text-slate-600 dark:text-emerald-300 hover:bg-slate-100 dark:hover:bg-[#0c382a] cursor-pointer"
              >
                {language === 'hi' ? 'रद्द करें' : language === 'mr' ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                {t.validation.btnRecord}
              </button>
            </div>
          </form>
        )}

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-[#134937] rounded-xl overflow-hidden">
            <thead className="bg-slate-50 dark:bg-[#061d15] text-slate-700 dark:text-emerald-200 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-[#134937]">
              <tr>
                <th className="p-3">{t.validation.colBatch}</th>
                <th className="p-3">{language === 'hi' ? 'सामग्री' : language === 'mr' ? 'साहित्य' : 'Material'}</th>
                <th className="p-3">{t.validation.colCondition}</th>
                <th className="p-3">{t.validation.colDays}</th>
                <th className="p-3">{t.validation.colStatus}</th>
                <th className="p-3">{t.validation.colNotes}</th>
                <th className="p-3 text-right">{language === 'hi' ? 'कार्रवाई' : language === 'mr' ? 'कृती' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#134937]">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-[#0a3324]/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{log.batchLotNumber}</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-emerald-200">{log.materialUsed}</td>
                  <td className="p-3 text-slate-600 dark:text-emerald-300/80">{log.testCondition}</td>
                  <td className="p-3 font-medium text-slate-800 dark:text-emerald-200">{log.durationDaysElapsed}d</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${getStatusBadge(log.status)}`}>
                      {log.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-emerald-300/80 max-w-xs truncate">{log.notes}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded cursor-pointer transition-colors"
                      title={language === 'hi' ? 'हटाएं' : language === 'mr' ? 'काढून टाका' : 'Delete log'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
