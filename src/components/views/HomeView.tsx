import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  Sliders,
  ChevronRight,
  Search,
  FileCheck2,
  Cpu,
  FlaskConical
} from 'lucide-react';
import { useI18n } from '../../locales/i18n.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { VoiceButton } from '../VoiceButton.tsx';
import { FoodTrackMode } from '../../types/index.ts';

interface HomeViewProps {
  onStartAnalysis: (commodityId?: string) => void;
  onStartAudit: () => void;
  onExploreProduce: () => void;
  onNavigateToBenchmarks?: () => void;
  onNavigateToCompare?: () => void;
  onNavigateToValidation?: () => void;
  onOpenRoleModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartAnalysis,
  onStartAudit,
  onExploreProduce,
  onNavigateToBenchmarks,
  onNavigateToCompare,
  onNavigateToValidation
}) => {
  const { t, language } = useI18n();
  const { user } = useAuth();

  const activeTrack: FoodTrackMode = user?.selectedTrack || 'packaged';

  const narratedOverview =
    language === 'hi'
      ? 'बायोपैक एआई में आपका स्वागत है। क्रमबद्ध तरीके से पहले खाद्य डेटाबेस देखें, वर्तमान पैकेजिंग का ऑडिट करें, फिर अपने भोजन का सटीक विश्लेषण करें और सत्यापन प्रोटोकॉल प्राप्त करें।'
      : language === 'mr'
      ? 'बायोपॅक एआय मध्ये आपले स्वागत आहे. योग्य क्रमाने प्रथम अन्न डेटाबेस तपासा, सध्याच्या पॅकिंगचे ऑडिट करा, नंतर आपल्या अन्नाचे सविस्तर विश्लेषण करून लॅब चाचणी आराखडा मिळवा.'
      : 'Welcome to BioPack AI. In logical sequence: explore food benchmarks, audit your current packaging, run the deep Analyze MyFood biophysical calculation engine, compare materials, and generate certified laboratory validation plans.';

  return (
    <div className="space-y-12 py-6 bg-white dark:bg-[#061d15] text-slate-900 dark:text-emerald-100 transition-colors">
      {/* 1. HERO SECTION - Crisp pure white in light mode, no green wash */}
      <section className="relative max-w-4xl mx-auto text-center px-4 pt-4 pb-2">
        {/* Anti-Guessing Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#0d3b2b] border border-slate-200 dark:border-[#17523d] text-slate-800 dark:text-emerald-300 text-xs font-semibold mb-5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t.hero.pillNoGuess}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t.hero.title}
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>

        {/* Voice Narration */}
        <div className="mt-4 flex justify-center">
          <VoiceButton textToSpeak={narratedOverview} label={t.form.listenField} />
        </div>

        {/* User Identity Chip: Shows login setup clearly without redundant toggles */}
        {user && (
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 dark:bg-[#09271d] border border-slate-200 dark:border-[#134937] text-xs text-slate-600 dark:text-emerald-300/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Workspace: <strong>{user.name}</strong> • {user.organization} • <strong>{activeTrack === 'fresh' ? t.track.fresh : t.track.packaged}</strong>
            </span>
          </div>
        )}
      </section>

      {/* 2. THE SENSIBLE WORKFLOW SEQUENCE (Logical order of important options) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400">
            {language === 'hi' ? 'तार्किक कार्यप्रवाह' : language === 'mr' ? 'तार्किक कार्यपद्धती' : 'Recommended Workflow Sequence'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {language === 'hi'
              ? 'चरणबद्ध पैकेजिंग निर्णय प्रवाह'
              : language === 'mr'
              ? 'टप्प्याटप्प्याने पॅकेजिंग निर्णय प्रक्रिया'
              : 'Sequential Decision Framework'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1.5 max-w-2xl mx-auto">
            {language === 'hi'
              ? 'पहले डेटाबेस और मानकों को समझें, फिर वर्तमान पैकेजिंग का ऑडिट करें, इसके बाद अपने खाद्य का विस्तृत विश्लेषण करें।'
              : language === 'mr'
              ? 'आधी डेटाबेस व निकष समजून घ्या, मग सध्याच्या पॅकेजिंगचे ऑडिट करा आणि त्यानंतर आपल्या अन्नाचे सविस्तर विश्लेषण करा.'
              : 'Follow the natural packaging engineering sequence: explore standard benchmarks first, audit your existing package, then run the deep biophysical engine for custom foods.'}
          </p>
        </div>

        {/* Sequential Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* STEP 1: EXPLORE FOOD DATABASE & BENCHMARKS */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#09271d] border border-slate-200 dark:border-[#134937] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#0d3b2b] text-slate-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-[#17523d]">
                  1
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-emerald-400/80 uppercase tracking-wider">
                  {language === 'hi' ? 'चरण 1: अन्वेषण' : language === 'mr' ? 'टप्पा १: माहिती' : 'Phase 1: Explore'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-slate-700 dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {language === 'hi' ? '1. खाद्य डेटाबेस व मानक' : language === 'mr' ? '1. अन्न डेटाबेस व निकष' : '1. Food Database & Benchmarks'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                {language === 'hi'
                  ? '50+ खाद्य पदार्थों के नमी स्तर, जल सक्रियता (aw), वसा ऑक्सीकरण और FSSAI/ASTM शेल्फ-लाइफ मानकों का अध्ययन करें।'
                  : language === 'mr'
                  ? '50+ अन्न पदार्थांचे ओलावा प्रमाण, वॉटर ॲक्टिव्हिटी (aw) आणि FSSAI/ASTM शेल्फ-लाइफ निकष पहा.'
                  : 'Start by browsing 50+ verified commodities, critical moisture & water activity (aw), fat rancidity kinetics, and regulatory benchmarks.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => (onNavigateToBenchmarks ? onNavigateToBenchmarks() : onStartAnalysis())}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0a2f22] dark:hover:bg-[#0d3b2b] text-slate-900 dark:text-emerald-200 text-xs font-bold border border-slate-200 dark:border-[#144735] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'hi' ? 'डेटाबेस देखें' : language === 'mr' ? 'डेटाबेस उघडा' : 'Explore Database'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* STEP 2: AUDIT CURRENT PACKAGING */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#09271d] border border-slate-200 dark:border-[#134937] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#0d3b2b] text-slate-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-[#17523d]">
                  2
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-emerald-400/80 uppercase tracking-wider">
                  {language === 'hi' ? 'चरण 2: ऑडिट' : language === 'mr' ? 'टप्पा २: ऑडिट' : 'Phase 2: Baseline'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FileCheck2 className="w-5 h-5 text-slate-700 dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {language === 'hi' ? '2. वर्तमान पैकेजिंग ऑडिट' : language === 'mr' ? '2. सध्याच्या पॅकेजिंगचे ऑडिट' : '2. Audit Current Packaging'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                {language === 'hi'
                  ? 'अपने मौजूदा प्लास्टिक पाउच या फॉयल लैमिनेट का ऑडिट करें। जांचें कि क्या यह अधिक लागत वाला या असुरक्षित है।'
                  : language === 'mr'
                  ? 'आपल्या सध्याच्या प्लास्टिक पाऊच किंवा फॉइलचे ऑडिट करा. ते जास्त खर्चाचे किंवा निकृष्ट दर्जाचे तर नाही ना ते तपासा.'
                  : 'Audit your existing pouch, tray, or foil before reformulating. Identify over-packaging cost waste or barrier vulnerability.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onStartAudit}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0a2f22] dark:hover:bg-[#0d3b2b] text-slate-900 dark:text-emerald-200 text-xs font-bold border border-slate-200 dark:border-[#144735] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'hi' ? 'पैकेजिंग ऑडिट करें' : language === 'mr' ? 'ऑडिट सुरू करा' : 'Audit Packaging'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* STEP 3: ANALYZE MYFOOD (THE CORE CALCULATION ENGINE) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#09271d] border-2 border-emerald-600 dark:border-emerald-500 shadow-md flex flex-col justify-between relative group">
            <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              {language === 'hi' ? 'मुख्य विश्लेषण इंजन' : language === 'mr' ? 'मुख्य विश्लेषण इंजिन' : 'Primary Engine'}
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  3
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  {language === 'hi' ? 'चरण 3: गहन गणना' : language === 'mr' ? 'टप्पा ३: सविस्तर गणना' : 'Phase 3: Deep Calculation'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {language === 'hi' ? '3. माय-फूड का गहन विश्लेषण' : language === 'mr' ? '3. माय-फूड सविस्तर विश्लेषण' : '3. Analyze MyFood Packaging'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                {language === 'hi'
                  ? 'अपने भोजन के सटीक नमी, वसा, pH और भंडारण तापमान के लिए ASTM OTR/WVTR गणना करें और TOPSIS रैंक प्राप्त करें।'
                  : language === 'mr'
                  ? 'आपल्या पदार्थाच्या अचूक ओलावा, फॅट आणि साठवण तापमानासाठी ASTM OTR/WVTR बॅरियर मर्यादा व TOPSIS रँकिंग काढा.'
                  : 'Now perform the deep 5-stage calculation for your specific recipe: derive exact OTR/WVTR thresholds and rank optimal bio-polymers.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onStartAnalysis()}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'hi' ? 'माय-फूड विश्लेषण शुरू करें' : language === 'mr' ? 'माय-फूड विश्लेषण करा' : 'Run Analyze MyFood Engine'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* STEP 4: COMPARE MATERIALS */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#09271d] border border-slate-200 dark:border-[#134937] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#0d3b2b] text-slate-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-[#17523d]">
                  4
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-emerald-400/80 uppercase tracking-wider">
                  {language === 'hi' ? 'चरण 4: तुलना' : language === 'mr' ? 'टप्पा ४: पडताळणी' : 'Phase 4: Evaluation'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="w-5 h-5 text-slate-700 dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {language === 'hi' ? '4. सामग्री तुलना' : language === 'mr' ? '4. सामग्री तांत्रिक तुलना' : '4. Compare Materials Side-by-Side'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                {language === 'hi'
                  ? 'PLA, PHA, बायो-PE और पारंपरिक फिल्मों की लागत, अवरोध क्षमता, तन्यता और कंपोस्टेबिलिटी की तुलना करें।'
                  : language === 'mr'
                  ? 'PLA, PHA, बायो-PE आणि पारंपारिक फिल्म्सचा खर्च, बॅरियर क्षमता आणि कंपोस्टिंग वैशिष्ट्यांची तुलना करा.'
                  : 'Examine head-to-head trade-offs between shortlisted bio-based polymers (PLA, PHA, Cellophane) and conventional barrier films.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => (onNavigateToCompare ? onNavigateToCompare() : onStartAudit())}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0a2f22] dark:hover:bg-[#0d3b2b] text-slate-900 dark:text-emerald-200 text-xs font-bold border border-slate-200 dark:border-[#144735] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'hi' ? 'सामग्री तुलना करें' : language === 'mr' ? 'तुलना करा' : 'Compare Materials'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* STEP 5: VALIDATION LAB & ASLT PROTOCOLS */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#09271d] border border-slate-200 dark:border-[#134937] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#0d3b2b] text-slate-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-[#17523d]">
                  5
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-emerald-400/80 uppercase tracking-wider">
                  {language === 'hi' ? 'चरण 5: प्रयोगशाला' : language === 'mr' ? 'टप्पा ५: लॅब चाचणी' : 'Phase 5: Laboratory'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="w-5 h-5 text-slate-700 dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {language === 'hi' ? '5. सत्यापन लैब व ASLT' : language === 'mr' ? '5. लॅब चाचणी व ASLT' : '5. Validation Lab & Testing'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                {language === 'hi'
                  ? 'त्वरित शेल्फ-लाइफ परीक्षण (ASLT), Q10 काइनेटिक्स, सील अखंडता और ASTM मानक परीक्षण प्रोटोकॉल बनाएं।'
                  : language === 'mr'
                  ? 'ॲक्सिलरेटेड शेल्फ-लाइफ टेस्टिंग (ASLT), Q10 काइनेटिक्स, सील इंटिग्रिटी आणि ASTM चाचणी आराखडा तयार करा.'
                  : 'Design accelerated shelf-life testing (ASLT) test plans, critical Q10 kinetics, seal integrity, and ASTM certified protocols.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => (onNavigateToValidation ? onNavigateToValidation() : onStartAnalysis())}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0a2f22] dark:hover:bg-[#0d3b2b] text-slate-900 dark:text-emerald-200 text-xs font-bold border border-slate-200 dark:border-[#144735] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'hi' ? 'लैब प्रोटोकॉल बनाएं' : language === 'mr' ? 'लॅब प्रोटोकॉल उघडा' : 'Open Validation Lab'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* STEP 6: LIVING HORTICULTURAL PRODUCE / MAP */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#09271d] border border-slate-200 dark:border-[#134937] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#0d3b2b] text-slate-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-[#17523d]">
                  6
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-emerald-400/80 uppercase tracking-wider">
                  {language === 'hi' ? 'विशेषीकृत' : language === 'mr' ? 'विशेष विभाग' : 'Specialized'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-slate-700 dark:text-lime-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {language === 'hi' ? '6. ताजा उपज व MAP' : language === 'mr' ? '6. ताजी फळे/भाज्या व MAP' : '6. Fresh Produce & MAP'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                {language === 'hi'
                  ? 'जीवित फसलों के लिए श्वसन दर, एथिलीन संवेदनशीलता, शीत-क्षति गार्ड और सूक्ष्म-छिद्रित संशोधित वातावरण बैग।'
                  : language === 'mr'
                  ? 'जिवंत फळे/भाज्यांचे श्वसन दर, इथिलिन संवेदनशीलता, शीत-हानी नियंत्रण आणि मायक्रो-परफोरेटेड MAP पाऊच.'
                  : 'Dedicated biological respiration modeling (R_O2, R_CO2), chilling injury safeguards, and micro-perforated equilibrium MAP bags.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onExploreProduce}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0a2f22] dark:hover:bg-[#0d3b2b] text-slate-900 dark:text-emerald-200 text-xs font-bold border border-slate-200 dark:border-[#144735] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'hi' ? 'ताजा उपज देखें' : language === 'mr' ? 'ताजी फळे/भाज्या पहा' : 'Explore Fresh Produce'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SCIENTIFIC HONESTY CALLOUT */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-slate-900 dark:bg-[#051c14] rounded-3xl p-8 sm:p-10 text-white shadow-lg border border-slate-800 dark:border-[#144735]">
          <div className="max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-300 border border-emerald-400/30">
              {language === 'hi' ? 'वैज्ञानिक ईमानदारी व निष्पक्षता' : language === 'mr' ? 'वैज्ञानिक पारदर्शकता' : 'Scientific Honesty'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-4 leading-tight">
              {language === 'hi'
                ? 'हम कभी भी कृत्रिम विश्वास या प्रमाणित संख्याओं का मनगढ़ंत दावा नहीं करते।'
                : language === 'mr'
                ? 'आम्ही कृत्रिम आत्मविश्वास किंवा खोटे आकडे कधीही सादर करत नाही.'
                : 'We never fabricate AI confidence or invent certified numbers.'}
            </h2>
            <p className="text-slate-300 dark:text-emerald-200/80 text-sm sm:text-base mt-3 leading-relaxed">
              {language === 'hi'
                ? 'प्रत्येक पैकेजिंग सिफारिश प्रकाशित साहित्य, प्रमाणित ASTM परीक्षण विधियों और FSSAI दिशा-निर्देशों पर आधारित है। यदि डेटा असत्यापित है, तो हम इसे स्पष्ट बताते हैं।'
                : language === 'mr'
                ? 'प्रत्येक पॅकेजिंग शिफारस प्रकाशित संशोधन, प्रमाणित ASTM चाचणी पद्धती आणि FSSAI नियमांवर आधारित आहे. डेटा अनव्हेरिफाइड असल्यास आम्ही स्पष्ट नमूद करतो.'
                : 'Every packaging recommendation is grounded in published literature, certified ASTM test methods, and FSSAI packaging guidelines. If data is unverified or uncertain, we state it transparently and tell you what laboratory test to run.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-800 dark:border-[#17543f]">
            <div className="space-y-1">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'निश्चयात्मक वैज्ञानिक नियम' : language === 'mr' ? 'निश्चित वैज्ञानिक नियम' : 'Deterministic Rules'}</span>
              </div>
              <p className="text-xs text-slate-400 dark:text-emerald-300/70 leading-normal">
                {language === 'hi'
                  ? 'कठोर बायोफिजिकल सीमाएं सुनिश्चित करती हैं कि विफलता के जोखिम (ऑक्सीकरण, सीलन, सड़न) कभी न छिपें।'
                  : language === 'mr'
                  ? 'कडक बायोफिजिकल मर्यादा हे सुनिश्चित करतात की अन्नातील बिघाड (ऑक्सिडेशन, मऊपणा, कुजणे) कधीही लपवले जात नाहीत.'
                  : 'Hard biophysical boundaries guarantee that failure modes (rancidity, sogginess, rotting) are never masked.'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'कोई ब्लैक-बॉक्स भ्रम नहीं' : language === 'mr' ? 'अस्पष्ट गृहीतके नाहीत' : 'No Black-Box Hallucinations'}</span>
              </div>
              <p className="text-xs text-slate-400 dark:text-emerald-300/70 leading-normal">
                {language === 'hi'
                  ? 'पारदर्शी वेक्टर TOPSIS बहु-मानदंड रैंकिंग करता है, बिना किसी मनगढ़ंत संख्या के।'
                  : language === 'mr'
                  ? 'पारदर्शक वेक्टर TOPSIS कोणतीही खोटी माहिती न देता बहु-निकष क्रमवारी लावते.'
                  : 'Transparent vector TOPSIS handles multi-criteria ranking without fabricated figures.'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'प्रमाणित व पारदर्शी साक्ष्य' : language === 'mr' ? 'तपासण्यायोग्य पुरावे' : 'Traceable Evidence'}</span>
              </div>
              <p className="text-xs text-slate-400 dark:text-emerald-300/70 leading-normal">
                {language === 'hi'
                  ? 'अपनी सिफारिश के पीछे प्रत्येक नियम और ASTM मानक संदर्भ को एक क्लिक में जांचें।'
                  : language === 'mr'
                  ? 'शिफारसीमागील प्रत्येक नियम आणि ASTM संदर्भ एका क्लिकवर तपासा.'
                  : 'Inspect every rule and ASTM standard citation behind your recommendation with one click.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
