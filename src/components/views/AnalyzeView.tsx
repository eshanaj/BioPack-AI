import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  FlaskConical,
  Layers,
  Sparkles,
  Info,
  Lock,
  Check,
  PlusCircle,
  Database,
  Package,
  Leaf,
  RotateCcw
} from 'lucide-react';
import { useI18n } from '../../locales/i18n.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { COMMODITIES } from '../../data/commodities.ts';
import {
  Commodity,
  StorageCondition,
  TopsisPriority,
  CandidateEvaluation,
  FoodCategory,
  SensitivityLevel,
  FoodTrackMode
} from '../../types/index.ts';
import { generatePackagingRecommendation, FullRecommendationReport } from '../../engine/recommend.ts';
import { VoiceButton } from '../VoiceButton.tsx';
import { EvidenceGraphModal } from '../EvidenceGraphModal.tsx';

interface AnalyzeViewProps {
  initialCommodityId?: string;
  onNavigateToSpec?: (commodity: Commodity, candidate: CandidateEvaluation) => void;
  onNavigateToValidation?: (commodity: Commodity, candidate: CandidateEvaluation) => void;
  onNavigateToWhatIf?: (commodity: Commodity, storage: StorageCondition) => void;
  onNavigateToReports?: () => void;
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  initialCommodityId,
  onNavigateToSpec,
  onNavigateToValidation,
  onNavigateToWhatIf,
  onNavigateToReports
}) => {
  const { t, language } = useI18n();
  const { user, setFoodTrack } = useAuth();

  // Active Mode: 'packaged' (Mode A) vs 'fresh' (Mode B)
  const activeTrack: FoodTrackMode = user?.selectedTrack || 'packaged';

  // Step 1 input source: 'database' vs 'custom'
  const [inputMode, setInputMode] = useState<'database' | 'custom'>('database');

  // Step Management with Strict Compulsion (resets fresh per session, not kept after logout)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [step1Completed, setStep1Completed] = useState<boolean>(false);
  const [step2Completed, setStep2Completed] = useState<boolean>(false);
  const [step3Completed, setStep3Completed] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form State — Database Selection
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(
    initialCommodityId || (activeTrack === 'fresh' ? 'fresh_alphonso_mango' : 'potato_chips')
  );

  // Form State — Custom Food Input (User Input Option)
  const [customName, setCustomName] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<FoodCategory>('high_fat_snack');
  const [customMoisture, setCustomMoisture] = useState<string>('5.0');
  const [customFat, setCustomFat] = useState<string>('15.0');
  const [customWaterActivity, setCustomWaterActivity] = useState<string>(''); // empty -> null
  const [customPH, setCustomPH] = useState<string>(''); // empty -> null
  const [customOxygenSens, setCustomOxygenSens] = useState<SensitivityLevel>('moderate');
  const [customMoistureSens, setCustomMoistureSens] = useState<SensitivityLevel>('high');
  const [customLightSens, setCustomLightSens] = useState<SensitivityLevel>('moderate');
  const [customAromaSens, setCustomAromaSens] = useState<SensitivityLevel>('low');
  const [customIsRespirating, setCustomIsRespirating] = useState<boolean>(activeTrack === 'fresh');

  // Step 2 State — Storage & Life
  const [storageTempC, setStorageTempC] = useState<number>(25);
  const [storageRH, setStorageRH] = useState<number>(65);
  const [storageMode, setStorageMode] = useState<'ambient' | 'chilled' | 'frozen'>('ambient');
  const [targetShelfLifeDays, setTargetShelfLifeDays] = useState<number>(180);
  const [packWeightG, setPackWeightG] = useState<number>(100);
  const [priority, setPriority] = useState<TopsisPriority>('balanced');

  // Technical details accordion
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const [modalCandidate, setModalCandidate] = useState<CandidateEvaluation | null>(null);

  // Filter verified commodities by track (Mode A vs Mode B)
  const availableCommodities = COMMODITIES.filter(c =>
    activeTrack === 'fresh' ? c.isRespirating : !c.isRespirating
  );

  // Sync if track changes or initialCommodityId provided
  useEffect(() => {
    if (activeTrack === 'fresh') {
      const freshDefault = COMMODITIES.find(c => c.isRespirating);
      if (freshDefault) {
        setSelectedCommodityId(freshDefault.id);
        setStorageTempC(freshDefault.typicalStorageTempC);
        setStorageRH(freshDefault.typicalStorageRH);
        setTargetShelfLifeDays(freshDefault.targetShelfLifeDays);
        setCustomIsRespirating(true);
      }
    } else {
      const packagedDefault = COMMODITIES.find(c => !c.isRespirating);
      if (packagedDefault) {
        setSelectedCommodityId(packagedDefault.id);
        setStorageTempC(packagedDefault.typicalStorageTempC);
        setStorageRH(packagedDefault.typicalStorageRH);
        setTargetShelfLifeDays(packagedDefault.targetShelfLifeDays);
        setCustomIsRespirating(false);
      }
    }
  }, [activeTrack]);

  // Construct active Commodity object
  let activeCommodity: Commodity;
  if (inputMode === 'custom') {
    const moistureNum = parseFloat(customMoisture) || 0;
    const fatNum = parseFloat(customFat) || 0;
    const awNum = customWaterActivity.trim() !== '' ? parseFloat(customWaterActivity) : null;
    const phNum = customPH.trim() !== '' ? parseFloat(customPH) : null;

    activeCommodity = {
      id: 'custom_user_food',
      name: {
        en: customName.trim() || 'Custom Food',
        hi: customName.trim() || 'कस्टम खाद्य',
        mr: customName.trim() || 'कस्टम अन्न'
      },
      category: customCategory,
      moistureContent: moistureNum,
      fatContent: fatNum,
      waterActivity: awNum,
      pH: phNum,
      oxygenSensitivity: customOxygenSens,
      moistureSensitivity: customMoistureSens,
      lightSensitivity: customLightSens,
      aromaSensitivity: customAromaSens,
      isRespirating: customIsRespirating,
      typicalStorageTempC: storageTempC,
      typicalStorageRH: storageRH,
      targetShelfLifeDays: targetShelfLifeDays,
      typicalPackWeightG: packWeightG,
      fssaiCategory: 'Custom User Specification',
      isVerified: false,
      citations: []
    };
  } else {
    activeCommodity =
      COMMODITIES.find(c => c.id === selectedCommodityId) ||
      availableCommodities[0] ||
      COMMODITIES[0];
  }

  const currentStorage: StorageCondition = {
    temperatureC: storageTempC,
    relativeHumidity: storageRH,
    storageMode,
    sunlightExposure: 'indirect',
    handlingStress: 'standard',
    targetShelfLifeDays
  };

  // Run Recommendation Engine
  const recommendation: FullRecommendationReport = generatePackagingRecommendation(
    activeCommodity,
    currentStorage,
    priority
  );

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    if (inputMode === 'custom') {
      if (!customName.trim()) {
        setValidationError('Food Name is required for custom food.');
        return false;
      }
      const moisture = parseFloat(customMoisture);
      if (isNaN(moisture) || moisture < 0 || moisture > 100) {
        setValidationError('Please enter a valid Moisture Content (0 to 100%).');
        return false;
      }
      const fat = parseFloat(customFat);
      if (isNaN(fat) || fat < 0 || fat > 100) {
        setValidationError('Please enter a valid Fat / Oil Content (0 to 100%).');
        return false;
      }
      if (customWaterActivity.trim() !== '') {
        const aw = parseFloat(customWaterActivity);
        if (isNaN(aw) || aw < 0 || aw > 1.0) {
          setValidationError('Water Activity (aw) must be between 0.0 and 1.0 or left blank.');
          return false;
        }
      }
      if (customPH.trim() !== '') {
        const ph = parseFloat(customPH);
        if (isNaN(ph) || ph < 1 || ph > 14) {
          setValidationError('pH must be between 1.0 and 14.0 or left blank.');
          return false;
        }
      }
    } else {
      if (!selectedCommodityId) {
        setValidationError('Please select a food commodity from the database.');
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    if (isNaN(storageTempC) || storageTempC < -40 || storageTempC > 60) {
      setValidationError('Please enter a realistic storage temperature (-40°C to 60°C).');
      return false;
    }
    if (isNaN(storageRH) || storageRH <= 0 || storageRH > 100) {
      setValidationError('Relative Humidity must be between 1% and 100%.');
      return false;
    }
    if (isNaN(targetShelfLifeDays) || targetShelfLifeDays <= 0) {
      setValidationError('Target Shelf Life must be at least 1 day.');
      return false;
    }
    if (isNaN(packWeightG) || packWeightG <= 0) {
      setValidationError('Pack Net Weight must be greater than 0 grams.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Step Navigation with compulsory lock enforcement
  const handleGoToStep = (targetStep: number) => {
    setValidationError(null);
    if (targetStep === 1) {
      setCurrentStep(1);
      return;
    }
    if (targetStep === 2) {
      if (!validateStep1()) {
        setValidationError('Please select or enter food product details in Step 1 before proceeding.');
        return;
      }
      setStep1Completed(true);
      setCurrentStep(2);
      return;
    }
    if (targetStep === 3) {
      if (!validateStep1()) {
        setValidationError('Please complete Step 1: Food Details first.');
        setCurrentStep(1);
        return;
      }
      if (!validateStep2()) {
        setValidationError('Please specify Storage & Shelf Life in Step 2 first.');
        setCurrentStep(2);
        return;
      }
      setStep1Completed(true);
      setStep2Completed(true);
      setCurrentStep(3);
      return;
    }
    if (targetStep >= 4) {
      if (!validateStep1()) {
        setValidationError('Please complete Step 1: Food Details first.');
        setCurrentStep(1);
        return;
      }
      if (!validateStep2()) {
        setValidationError('Please specify Storage & Shelf Life in Step 2 first.');
        setCurrentStep(2);
        return;
      }
      if (!step3Completed) {
        setValidationError('Please review Derived Requirements (Step 3) before viewing candidates.');
        setCurrentStep(3);
        return;
      }
      setCurrentStep(targetStep);
      return;
    }
  };

  const handleNextStep = () => {
    setValidationError(null);
    if (currentStep === 1) {
      if (validateStep1()) {
        setStep1Completed(true);
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setStep2Completed(true);
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setStep3Completed(true);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  // Check if step is accessible
  const isStepAccessible = (step: number) => {
    if (step === 1) return true;
    if (step === 2) return step1Completed;
    if (step === 3) return step1Completed && step2Completed;
    if (step >= 4) return step1Completed && step2Completed && step3Completed;
    return false;
  };

  // Conversational text for audio narration
  const buildNarrationText = (): string => {
    if (!recommendation.primaryCandidate) {
      return language === 'hi'
        ? 'कोई भी सामग्री सभी अनिवार्य शर्तों को पूरा नहीं करती। कृपया नीचे अस्वीकृति का विवरण देखें।'
        : language === 'mr'
        ? 'कोणतेही साहित्य सर्व आवश्यक अटी पूर्ण करत नाही. कृपया खालील त्रुटी तपासा.'
        : 'No packaging candidate satisfied all critical biophysical constraints. Review the rejection log below.';
    }

    const primary = recommendation.primaryCandidate;
    const name = primary.material.name[language];
    const foodName = activeCommodity.name[language];

    if (language === 'hi') {
      return `${foodName} के लिए मुख्य अनुशंसित विकल्प ${name} है। यह नमी और ऑक्सीजन सुरक्षा को संतुलित करता है। ${primary.mainTradeoff.hi}।`;
    } else if (language === 'mr') {
      return `${foodName} साठी मुख्य शिफारस ${name} आहे. हे आवश्यक बॅरियर निकष पूर्ण करते. ${primary.mainTradeoff.mr}.`;
    }
    return `For ${foodName}, the primary recommended packaging is ${name}. It satisfies critical barrier thresholds with a TOPSIS score of ${primary.topsisScore}.`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Step Progress Header (Compulsory Locking Enforced) */}
      <div className="bg-white dark:bg-[#082a1f] p-4 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-2xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-emerald-300/70 mb-3 px-1">
          <span className="text-emerald-800 dark:text-emerald-300 font-bold">
            {t.workflow[`step${currentStep}` as keyof typeof t.workflow] || `Step ${currentStep}`}
          </span>
          <span className="font-mono">{currentStep} / 5</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-[#051c14] h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Step Buttons (Locked until previous steps are valid) */}
        <div className="grid grid-cols-5 gap-1.5 mt-3">
          {[1, 2, 3, 4, 5].map(step => {
            const accessible = isStepAccessible(step);
            const isCurrent = currentStep === step;
            const isCompleted =
              (step === 1 && step1Completed) ||
              (step === 2 && step2Completed) ||
              (step === 3 && step3Completed) ||
              (step === 4 && currentStep === 5);

            const getStepLabel = (s: number) => {
              if (language === 'hi') {
                return s === 1 ? '1. खाद्य' : s === 2 ? '2. भंडारण' : s === 3 ? '3. बैरियर' : s === 4 ? '4. सामग्री' : '5. विनिर्देश';
              }
              if (language === 'mr') {
                return s === 1 ? '1. अन्न' : s === 2 ? '2. साठवणूक' : s === 3 ? '3. निकष' : s === 4 ? '4. पर्याय' : '5. तपशील';
              }
              return s === 1 ? '1. Food' : s === 2 ? '2. Storage' : s === 3 ? '3. Barrier' : s === 4 ? '4. Options' : '5. Validate';
            };

            return (
              <button
                key={step}
                type="button"
                disabled={!accessible}
                onClick={() => handleGoToStep(step)}
                className={`py-2 px-2 text-center text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white font-bold shadow-xs ring-2 ring-emerald-500/30'
                    : isCompleted
                    ? 'bg-emerald-50 dark:bg-[#0c382a] text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-[#104735] cursor-pointer'
                    : accessible
                    ? 'bg-slate-100 dark:bg-[#0d3b2b] text-slate-800 dark:text-emerald-300 hover:bg-slate-200 dark:hover:bg-[#124936] cursor-pointer'
                    : 'bg-slate-100 dark:bg-[#061e16] text-slate-400 dark:text-emerald-800/60 cursor-not-allowed opacity-50 select-none'
                }`}
                title={
                  isCompleted
                    ? `${getStepLabel(step)} (${language === 'hi' ? 'पूर्ण' : language === 'mr' ? 'पूर्ण' : 'Completed'})`
                    : accessible
                    ? `${language === 'hi' ? 'चरण ' : language === 'mr' ? 'टप्पा ' : 'Go to Step '}${step}`
                    : `${language === 'hi' ? 'अनलॉक करने के लिए पहले के चरण पूर्ण करें' : language === 'mr' ? 'अनलॉक करण्यासाठी आधीचे टप्पे पूर्ण करा' : `Complete previous steps to unlock Step ${step}`}`
                }
              >
                {!accessible && <Lock className="w-3 h-3 shrink-0 opacity-70" />}
                {isCompleted && !isCurrent && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 font-bold" />}
                <span className="hidden sm:inline">{getStepLabel(step)}</span>
                <span className="sm:hidden">{step}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation Error Alert Banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: FOOD PROFILE (Database vs User Input Custom Food) */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-[#09271d] rounded-2xl border border-slate-200 dark:border-[#134937] p-6 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#134937] pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.workflow.step1}</h2>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
                {t.workflow.stepDesc1}
              </p>
            </div>

            {/* Configured Operational Track (set at login) */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#061d15] border border-slate-200 dark:border-[#134937] text-xs font-semibold text-slate-700 dark:text-emerald-300">
              {activeTrack === 'fresh' ? (
                <>
                  <Leaf className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>{t.track.fresh}</span>
                </>
              ) : (
                <>
                  <Package className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.track.packaged}</span>
                </>
              )}
            </div>
          </div>

          {/* TWO PROMINENT SELECTION CARDS: DATABASE VS USER INPUT */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-emerald-300 mb-2.5">
              {t.workflow.selectMethodLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Card 1: Verified Database */}
              <div
                onClick={() => {
                  setInputMode('database');
                  setValidationError(null);
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                  inputMode === 'database'
                    ? 'border-emerald-600 bg-white dark:bg-[#0c382a] text-slate-900 dark:text-white shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-[#134937] bg-white dark:bg-[#072218] text-slate-700 dark:text-emerald-200/80 hover:bg-slate-50 dark:hover:bg-[#0a2f22]'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#061d15] text-slate-800 dark:text-emerald-300 shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {t.workflow.selectFromDatabase}
                    </h3>
                    {inputMode === 'database' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        {t.workflow.activeBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">
                    {language === 'hi'
                      ? `${availableCommodities.length} प्रयोगशाला-प्रमाणित मानक खाद्य पदार्थों में से चुनें (${activeTrack === 'fresh' ? t.track.fresh : t.track.packaged})।`
                      : language === 'mr'
                      ? `${availableCommodities.length} प्रमाणित प्रमाणित अन्नपदार्थांमधून निवडा (${activeTrack === 'fresh' ? t.track.fresh : t.track.packaged}).`
                      : `Choose from ${availableCommodities.length} laboratory-verified standard foods (${activeTrack === 'fresh' ? 'Fresh Living Produce' : 'Packaged Shelf-Stable Goods'}).`}
                  </p>
                </div>
              </div>

              {/* Card 2: Custom Food (User Input Option) */}
              <div
                onClick={() => {
                  setInputMode('custom');
                  setValidationError(null);
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                  inputMode === 'custom'
                    ? 'border-emerald-600 bg-white dark:bg-[#0c382a] text-slate-900 dark:text-white shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-[#134937] bg-white dark:bg-[#072218] text-slate-700 dark:text-emerald-200/80 hover:bg-slate-50 dark:hover:bg-[#0a2f22]'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#061d15] text-slate-800 dark:text-emerald-300 shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {t.workflow.enterCustom}
                    </h3>
                    {inputMode === 'custom' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        {t.workflow.activeBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">
                    {t.workflow.customFoodDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 1A. Database Selection Mode */}
          {inputMode === 'database' && (
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
                  {t.form.selectCommodity} ({activeTrack === 'fresh' ? t.track.fresh : t.track.packaged}) *
                </label>
                <select
                  value={selectedCommodityId}
                  onChange={e => {
                    const newId = e.target.value;
                    setSelectedCommodityId(newId);
                    const c = COMMODITIES.find(item => item.id === newId);
                    if (c) {
                      setStorageTempC(c.typicalStorageTempC);
                      setStorageRH(c.typicalStorageRH);
                      setTargetShelfLifeDays(c.targetShelfLifeDays);
                      setPackWeightG(c.typicalPackWeightG);
                      setStorageMode(c.typicalStorageTempC <= 8 ? 'chilled' : 'ambient');
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-[#134937] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {availableCommodities.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name[language]} ({c.fssaiCategory})
                    </option>
                  ))}
                </select>
              </div>

              {/* Database Commodity Matrix Display (Unknown fields explicitly show '—') */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#061e16] border border-slate-200 dark:border-[#134937] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-white">
                    {language === 'hi' ? 'प्रमाणित मैट्रिक्स प्रोफाइल' : language === 'mr' ? 'प्रमाणित मॅट्रिक्स प्रोफाईल' : 'Verified Matrix Profile'}: {activeCommodity.name[language]}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                    {t.workflow.verifiedData}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#082a1f] border border-slate-200 dark:border-[#134937]">
                    <div className="text-slate-500 dark:text-emerald-300/70 text-[11px]">{t.form.moisturePercent}</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeCommodity.moistureContent}%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#082a1f] border border-slate-200 dark:border-[#134937]">
                    <div className="text-slate-500 dark:text-emerald-300/70 text-[11px]">{t.form.fatPercent}</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeCommodity.fatContent}%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#082a1f] border border-slate-200 dark:border-[#134937]">
                    <div className="text-slate-500 dark:text-emerald-300/70 text-[11px]">{t.form.waterActivity} (aw)</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {activeCommodity.waterActivity != null ? activeCommodity.waterActivity : '—'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#082a1f] border border-slate-200 dark:border-[#134937]">
                    <div className="text-slate-500 dark:text-emerald-300/70 text-[11px]">{t.form.pH}</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {activeCommodity.pH != null ? activeCommodity.pH : '—'}
                    </div>
                  </div>
                </div>

                {/* Living produce respiration info (or dash) */}
                {activeTrack === 'fresh' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#082a1f] border border-slate-200 dark:border-[#134937]">
                      <div className="text-slate-500 dark:text-emerald-300/70 text-[11px]">{language === 'hi' ? 'श्वसन दर (20°C)' : language === 'mr' ? 'श्वसन दर (20°C)' : 'Respiration Rate (20°C)'}</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                        {activeCommodity.respirationRateO2_20C != null ? `${activeCommodity.respirationRateO2_20C} mL/kg·hr` : '—'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#082a1f] border border-slate-200 dark:border-[#134937]">
                      <div className="text-slate-500 dark:text-emerald-300/70 text-[11px]">{language === 'hi' ? 'शीत-क्षति सीमा' : language === 'mr' ? 'शीत-हानी मर्यादा' : 'Chilling Threshold'}</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                        {activeCommodity.chillingInjuryThresholdC != null ? `${activeCommodity.chillingInjuryThresholdC}°C` : '—'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#082a1f] border border-slate-200 dark:border-[#134937]">
                      <div className="text-slate-500 dark:text-emerald-300/70 text-[11px]">{language === 'hi' ? 'श्वसन भागफल (RQ)' : language === 'mr' ? 'श्वसन गुणांक (RQ)' : 'Respiration Quotient (RQ)'}</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                        {activeCommodity.respirationQuotient != null ? activeCommodity.respirationQuotient : '—'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sensitivities */}
                <div className="pt-2 border-t border-slate-200 dark:border-[#134937]">
                  <div className="text-xs font-semibold text-slate-700 dark:text-emerald-300 mb-2">{t.form.sensitivities}:</div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md font-semibold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                      O₂: {activeCommodity.oxygenSensitivity.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-1 rounded-md font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                      Moisture: {activeCommodity.moistureSensitivity.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-1 rounded-md font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      Light: {activeCommodity.lightSensitivity.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-1 rounded-md font-medium bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-emerald-200">
                      Aroma: {activeCommodity.aromaSensitivity.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1B. Custom Food (User Input Mode) */}
          {inputMode === 'custom' && (
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-[#061e16] border border-slate-200 dark:border-[#134937]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {t.workflow.customFoodTitle}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-emerald-400/80">
                  {t.workflow.missingParamNotice}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Food Name */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-emerald-200 font-semibold mb-1">
                    {t.workflow.foodNameLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.workflow.foodNamePlaceholder}
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Food Category */}
                <div>
                  <label className="block text-slate-700 dark:text-emerald-200 font-semibold mb-1">
                    Food Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value as FoodCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="high_fat_snack">High-Fat Fried / Baked Snack</option>
                    <option value="spice_condiment">Spices, Condiments & Seasonings</option>
                    <option value="dry_grain_flour">Grains, Cereals & Flours</option>
                    <option value="pulse_legume">Pulses, Lentils & Dals</option>
                    <option value="fresh_fruit">Fresh Fruits</option>
                    <option value="fresh_vegetable">Fresh Vegetables & Greens</option>
                    <option value="dairy_product">Dairy & Milk Analogues</option>
                    <option value="sweet_confectionery">Sweets & Confectionery</option>
                    <option value="beverage_dry">Beverages (Tea/Coffee/Dry)</option>
                    <option value="custom">Other Custom Matrix</option>
                  </select>
                </div>

                {/* Respiration Behavior */}
                <div>
                  <label className="block text-slate-700 dark:text-emerald-200 font-semibold mb-1">
                    Product Respiration State
                  </label>
                  <select
                    value={customIsRespirating ? 'respiring' : 'non_respiring'}
                    onChange={e => setCustomIsRespirating(e.target.value === 'respiring')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="non_respiring">Non-Respiring (Shelf-stable, dry, processed, dairy)</option>
                    <option value="respiring">Living & Respiring (Fresh produce, needs breathable film)</option>
                  </select>
                </div>

                {/* Moisture % */}
                <div>
                  <label className="block text-slate-700 dark:text-emerald-200 font-semibold mb-1">
                    Moisture Content (% w/w) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="e.g. 4.5"
                    value={customMoisture}
                    onChange={e => setCustomMoisture(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Fat % */}
                <div>
                  <label className="block text-slate-700 dark:text-emerald-200 font-semibold mb-1">
                    Fat / Lipid Content (% w/w) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="e.g. 18.0"
                    value={customFat}
                    onChange={e => setCustomFat(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Water Activity aw (Optional: keep empty for null / —) */}
                <div>
                  <label className="block text-slate-700 dark:text-emerald-200 font-semibold mb-1">
                    Water Activity (aw) (Leave empty for &ldquo;—&rdquo;)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1.0"
                    placeholder="e.g. 0.35 (or leave blank)"
                    value={customWaterActivity}
                    onChange={e => setCustomWaterActivity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* pH (Optional: keep empty for null / —) */}
                <div>
                  <label className="block text-slate-700 dark:text-emerald-200 font-semibold mb-1">
                    Product pH (Leave empty for &ldquo;—&rdquo;)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="14"
                    placeholder="e.g. 5.5 (or leave blank)"
                    value={customPH}
                    onChange={e => setCustomPH(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Sensitivities */}
                <div>
                  <label className="block text-slate-700 dark:text-emerald-200 font-semibold mb-1">
                    Oxygen Sensitivity (Rancidity Risk)
                  </label>
                  <select
                    value={customOxygenSens}
                    onChange={e => setCustomOxygenSens(e.target.value as SensitivityLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="low">Low (Low fat/stable)</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="critical">Critical (Rapid oil oxidation / fried)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-emerald-200 font-semibold mb-1">
                    Moisture Sensitivity (Sogginess Risk)
                  </label>
                  <select
                    value={customMoistureSens}
                    onChange={e => setCustomMoistureSens(e.target.value as SensitivityLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="critical">Critical (Crispy/dry snack, wafers, biscuits)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Summary Card of Custom Food */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#134937] p-3 rounded-xl bg-white dark:bg-[#082a1f] border border-slate-200 dark:border-[#144735]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400 mb-2">
                  Live Custom Input Summary:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Name:</span>{' '}
                    <strong className="text-slate-800 dark:text-white">{customName.trim() || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Moisture:</span>{' '}
                    <strong className="text-slate-800 dark:text-white">{customMoisture ? `${customMoisture}%` : '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Fat:</span>{' '}
                    <strong className="text-slate-800 dark:text-white">{customFat ? `${customFat}%` : '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">aw:</span>{' '}
                    <strong className="text-slate-800 dark:text-white">{customWaterActivity.trim() !== '' ? customWaterActivity : '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">pH:</span>{' '}
                    <strong className="text-slate-800 dark:text-white">{customPH.trim() !== '' ? customPH : '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">O₂ Risk:</span>{' '}
                    <strong className="text-rose-600 dark:text-rose-400 uppercase">{customOxygenSens}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">H₂O Risk:</span>{' '}
                    <strong className="text-blue-600 dark:text-blue-400 uppercase">{customMoistureSens}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Respiration:</span>{' '}
                    <strong className="text-slate-800 dark:text-white">{customIsRespirating ? 'Living' : 'None'}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-[#134937]">
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <span>{t.workflow.nextStorage}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: STORAGE & SHELF LIFE (Compulsory Validations) */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="bg-white dark:bg-[#09271d] rounded-2xl border border-slate-200 dark:border-[#134937] p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.workflow.step2}</h2>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">
              {t.workflow.stepDesc2}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Storage Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
                {t.form.storageMode}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['ambient', 'chilled', 'frozen'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setStorageMode(mode);
                      if (mode === 'chilled') setStorageTempC(4);
                      else if (mode === 'frozen') setStorageTempC(-18);
                      else setStorageTempC(25);
                    }}
                    className={`py-2 px-3 rounded-xl border text-center font-medium capitalize transition-all cursor-pointer ${
                      storageMode === mode
                        ? 'bg-slate-100 dark:bg-[#0c382a] border-slate-900 dark:border-emerald-600 text-slate-900 dark:text-emerald-300 font-bold shadow-2xs'
                        : 'border-slate-200 dark:border-[#17523d] text-slate-600 dark:text-emerald-300/70 hover:bg-slate-50 dark:hover:bg-[#0a2f22]'
                    }`}
                  >
                    {mode === 'ambient' ? t.form.modeAmbient.split(' ')[0] : mode === 'chilled' ? t.form.modeChilled.split(' ')[0] : t.form.modeFrozen.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Shelf Life Days */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
                {t.form.targetShelfLife} *
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="730"
                    value={targetShelfLifeDays}
                    onChange={e => setTargetShelfLifeDays(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-emerald-300/70 shrink-0 font-medium">Days</span>
              </div>
            </div>

            {/* Storage Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-emerald-200 mb-1.5">
                <span>{t.form.tempC} *</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">{storageTempC}°C</span>
              </div>
              <input
                type="range"
                min="-20"
                max="45"
                value={storageTempC}
                onChange={e => setStorageTempC(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-emerald-400/70 mt-1 font-mono">
                <span>-20°C (Frozen)</span>
                <span>4°C (Chilled)</span>
                <span>25°C (Ambient)</span>
                <span>45°C (Hot)</span>
              </div>
            </div>

            {/* Relative Humidity Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-emerald-200 mb-1.5">
                <span>{t.form.rhPercent} *</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">{storageRH}% RH</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={storageRH}
                onChange={e => setStorageRH(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-emerald-400/70 mt-1 font-mono">
                <span>20% (Dry)</span>
                <span>65% (Standard)</span>
                <span>95% (Tropical)</span>
              </div>
            </div>

            {/* Pack Net Weight */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
                {t.form.packWeight} *
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="10"
                  max="25000"
                  value={packWeightG}
                  onChange={e => setPackWeightG(Number(e.target.value))}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-3.5 text-xs text-slate-500 dark:text-emerald-300/70 font-medium">g</span>
              </div>
            </div>

            {/* Priority Weighting */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 uppercase tracking-wider mb-1.5">
                {t.form.priority}
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TopsisPriority)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-[#144735] bg-white dark:bg-[#08281e] text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="balanced">{t.form.priorityBalanced}</option>
                <option value="barrier">{t.form.priorityBarrier}</option>
                <option value="budget">{t.form.priorityBudget}</option>
                <option value="sustainability">{t.form.priorityEco}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#134937]">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-[#144735] text-slate-700 dark:text-emerald-200 hover:bg-slate-50 dark:hover:bg-[#0c382a] font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.workflow.previous}</span>
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <span>{t.workflow.nextRequirements}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: DERIVED PACKAGING REQUIREMENTS */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-[#09271d] rounded-2xl border border-slate-200 dark:border-[#134937] p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.workflow.step3}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                {t.workflow.ruleExtractionActive}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">
              {language === 'hi'
                ? `सटीक नियम निष्कर्षण ${activeCommodity.name[language]} के गुणों तथा ${storageTempC}°C / ${storageRH}% RH को अधिकतम बैरियर सीमाओं में बदलता है।`
                : language === 'mr'
                ? `अचूक नियम निष्कर्षण ${activeCommodity.name[language]} चे गुणधर्म आणि ${storageTempC}°C / ${storageRH}% RH ला कमाल मर्यादांमध्ये रूपांतरित करतो.`
                : `Deterministic extraction converts ${activeCommodity.name[language]} properties and ${storageTempC}°C / ${storageRH}% RH into maximum barrier thresholds.`}
            </p>
          </div>

          {/* Barrier Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <div className="text-xs font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                {t.workflow.maxOtr}
              </div>
              <div className="text-2xl font-extrabold text-blue-950 dark:text-blue-100 mt-1 font-mono">
                ≤ {recommendation.requirements.requiredOtrMax}{' '}
                <span className="text-xs font-normal text-blue-700 dark:text-blue-300">cc/m²·day</span>
              </div>
              <div className="text-[11px] text-blue-800 dark:text-blue-400 mt-2 font-mono">
                ASTM D3985 reference
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800">
              <div className="text-xs font-semibold text-cyan-900 dark:text-cyan-300 uppercase tracking-wider">
                {t.workflow.maxWvtr}
              </div>
              <div className="text-2xl font-extrabold text-cyan-950 dark:text-cyan-100 mt-1 font-mono">
                ≤ {recommendation.requirements.requiredWvtrMax}{' '}
                <span className="text-xs font-normal text-cyan-700 dark:text-cyan-300">g/m²·day</span>
              </div>
              <div className="text-[11px] text-cyan-800 dark:text-cyan-400 mt-2 font-mono">
                ASTM F1249 reference
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <div className="text-xs font-semibold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                {t.workflow.lightProtection}
              </div>
              <div className="text-2xl font-extrabold text-amber-950 dark:text-amber-100 mt-1 font-mono">
                {recommendation.requirements.lightProtectionRequired
                  ? (language === 'hi' ? 'आवश्यक (>70%)' : language === 'mr' ? 'आवश्यक (>70%)' : 'Required (>70%)')
                  : t.workflow.standard}
              </div>
              <div className="text-[11px] text-amber-800 dark:text-amber-400 mt-2 font-mono">
                Curcumin & lipid photo-stabilization
              </div>
            </div>
          </div>

          {/* Rationale Bullet Points */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#061e16] border border-slate-200 dark:border-[#134937] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-200">
              {t.workflow.extractionRationales}
            </h4>
            <ul className="text-xs text-slate-700 dark:text-emerald-200/90 space-y-1.5 list-disc list-inside">
              {recommendation.requirements.rationale[language].map((r, idx) => (
                <li key={idx} className="leading-relaxed">{r}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#134937]">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-[#144735] text-slate-700 dark:text-emerald-200 hover:bg-slate-50 dark:hover:bg-[#0c382a] font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.workflow.previous}</span>
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <span>{t.workflow.nextCandidates}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4 & 5: PACKAGING CANDIDATES (RESULTS) */}
      {/* ========================================================================= */}
      {currentStep >= 4 && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header & Voice Playback */}
          <div className="bg-white dark:bg-[#09271d] p-6 rounded-2xl border border-slate-200 dark:border-[#134937] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {t.workflow.screeningComplete}
                </span>
                <span className="text-xs text-slate-400 dark:text-emerald-400/80 font-mono">
                  Audit Hash: {recommendation.auditTrailHash}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {t.results.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
                Screened against {activeCommodity.name[language]} ({activeTrack === 'fresh' ? 'Fresh Produce MAP' : 'Packaged Goods'})
              </p>
            </div>

            <VoiceButton textToSpeak={buildNarrationText()} label={t.form.listenField} />
          </div>

          {/* Edge Case: No Passing Candidates */}
          {recommendation.passingCandidates.length === 0 ? (
            <div className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-rose-600 dark:text-rose-400 mx-auto" />
              <h3 className="text-lg font-bold text-rose-950 dark:text-rose-100">
                {t.results.noCandidatesTitle}
              </h3>
              <p className="text-xs text-rose-800 dark:text-rose-300 max-w-xl mx-auto leading-relaxed">
                {t.results.noCandidatesDesc}
              </p>
            </div>
          ) : (
            /* PRIMARY CANDIDATE CARD */
            recommendation.primaryCandidate && (
              <div className="bg-white dark:bg-[#09271d] rounded-3xl border-2 border-emerald-600 p-6 sm:p-8 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-600 text-white px-4 py-1.5 rounded-bl-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.results.primaryChoice}</span>
                </div>

                <div className="max-w-2xl">
                  <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    {recommendation.primaryCandidate.material.code}
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {recommendation.primaryCandidate.material.name[language]}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-emerald-200/80 mt-1.5">
                    {recommendation.primaryCandidate.material.structureDescription[language]}
                  </p>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c382a] border border-slate-200 dark:border-[#17523d]">
                    <span className="text-[11px] text-slate-500 dark:text-emerald-300/70 font-medium">ASTM D3985 OTR</span>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                      {recommendation.primaryCandidate.material.otr}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-emerald-400">cc/m²·day</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c382a] border border-slate-200 dark:border-[#17523d]">
                    <span className="text-[11px] text-slate-500 dark:text-emerald-300/70 font-medium">ASTM F1249 WVTR</span>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                      {recommendation.primaryCandidate.material.wvtr}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-emerald-400">g/m²·day</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c382a] border border-slate-200 dark:border-[#17523d]">
                    <span className="text-[11px] text-slate-500 dark:text-emerald-300/70 font-medium">Recyclability Stream</span>
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                      {recommendation.primaryCandidate.material.recyclability}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c382a] border border-slate-200 dark:border-[#17523d]">
                    <span className="text-[11px] text-slate-500 dark:text-emerald-300/70 font-medium">Evidence Coverage</span>
                    <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 font-mono">
                      {recommendation.primaryCandidate.evidenceCoveragePercent}%
                    </div>
                  </div>
                </div>

                {/* Why This Option Fits */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-[#134937]">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-200 mb-1">
                      {t.results.whyThisOption}:
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-emerald-200/90 leading-relaxed">
                      {recommendation.primaryCandidate.fitAssessment[language]}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-200 mb-1">
                      {t.results.tradeoffs}:
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-emerald-300/70 leading-relaxed">
                      {recommendation.primaryCandidate.mainTradeoff[language]}
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#134937] flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalCandidate(recommendation.primaryCandidate)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0c382a] dark:hover:bg-[#124936] text-slate-800 dark:text-emerald-300 font-semibold text-xs border border-slate-300 dark:border-[#17523d] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t.results.viewEvidenceGraph}</span>
                  </button>

                  {onNavigateToSpec && (
                    <button
                      type="button"
                      onClick={() => onNavigateToSpec(activeCommodity, recommendation.primaryCandidate!)}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t.results.downloadSpec}</span>
                    </button>
                  )}

                  {onNavigateToValidation && (
                    <button
                      type="button"
                      onClick={() => onNavigateToValidation(activeCommodity, recommendation.primaryCandidate!)}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-[#0c382a] hover:bg-slate-50 dark:hover:bg-[#124936] text-slate-700 dark:text-emerald-200 font-semibold text-xs border border-slate-300 dark:border-[#17523d] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-slate-500 dark:text-emerald-400" />
                      <span>{t.results.createValidationPlan}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setStep1Completed(false);
                      setStep2Completed(false);
                      setStep3Completed(false);
                      setCurrentStep(1);
                      setCustomName('');
                      setCustomMoisture('');
                      setCustomFat('');
                      setCustomWaterActivity('');
                      setCustomPH('');
                      setValidationError(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0c382a] dark:hover:bg-[#124936] text-slate-700 dark:text-emerald-200 font-semibold text-xs border border-slate-300 dark:border-[#17523d] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title={t.workflow.reset}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-emerald-400" />
                    <span>{t.workflow.reset}</span>
                  </button>
                </div>
              </div>
            )
          )}

          {/* ALTERNATIVE CANDIDATES */}
          {recommendation.alternatives.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-emerald-200 px-1">
                {t.results.alternatives} ({recommendation.alternatives.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendation.alternatives.map(alt => (
                  <div
                    key={alt.material.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#09271d] border border-slate-200 dark:border-[#134937] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#1b5e46] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono text-slate-400 dark:text-emerald-400/70 font-semibold">{alt.material.code}</span>
                        <span className="font-bold text-slate-700 dark:text-emerald-200">Rank #{alt.rank}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {alt.material.name[language]}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1 line-clamp-2">
                        {alt.material.structureDescription[language]}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
                        <div className="p-2 rounded bg-slate-50 dark:bg-[#0c382a] border border-slate-100 dark:border-[#17523d]">
                          <span className="text-slate-400">OTR:</span>
                          <span className="font-bold text-slate-800 dark:text-emerald-200 ml-1">{alt.material.otr} cc</span>
                        </div>
                        <div className="p-2 rounded bg-slate-50 dark:bg-[#0c382a] border border-slate-100 dark:border-[#17523d]">
                          <span className="text-slate-400">WVTR:</span>
                          <span className="font-bold text-slate-800 dark:text-emerald-200 ml-1">{alt.material.wvtr} g</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#134937] flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-emerald-400/80 font-mono">
                        TOPSIS: {alt.topsisScore.toFixed(3)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setModalCandidate(alt)}
                        className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 cursor-pointer"
                      >
                        {t.workflow.evidenceLink}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collapsible Technical Details (Replacing the global toggle) */}
          <div className="bg-white dark:bg-[#09271d] rounded-2xl border border-slate-200 dark:border-[#134937] overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full p-4 text-left font-semibold text-xs text-slate-800 dark:text-emerald-200 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#0c382a] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-500 dark:text-emerald-400" />
                <span>
                  {showTechnicalDetails ? t.results.hideTechnicalDetails : t.results.viewTechnicalDetails} (ASTM Standards & Constraint Logs)
                </span>
              </div>
              {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTechnicalDetails && (
              <div className="p-6 border-t border-slate-100 dark:border-[#134937] space-y-6 text-xs text-slate-700 dark:text-emerald-200 bg-slate-50/50 dark:bg-[#061e16]">
                {/* Rejection Logs (Hard Constraints) */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>{t.workflow.hardConstraintsLog} ({recommendation.rejectedCandidates.length} {t.workflow.materialsFiltered})</span>
                  </h4>
                  <div className="space-y-2">
                    {recommendation.rejectedCandidates.map(rej => (
                      <div key={rej.material.id} className="p-3 rounded-xl bg-white dark:bg-[#0c382a] border border-slate-200 dark:border-[#17523d]">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-white">
                          <span>{rej.material.name[language]} ({rej.material.code})</span>
                          <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                            {t.workflow.disqualified}
                          </span>
                        </div>
                        <ul className="mt-1.5 space-y-1 text-[11px] text-rose-800 dark:text-rose-300">
                          {rej.hardConstraintFailures.map((f, i) => (
                            <li key={i}>• {f.reason[language]}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TOPSIS Vector Matrix */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">
                    {t.workflow.topsisMatrixTitle}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] border border-slate-200 dark:border-[#17523d] rounded-lg bg-white dark:bg-[#082a1f]">
                      <thead className="bg-slate-100 dark:bg-[#0c382a] text-slate-600 dark:text-emerald-300 uppercase font-semibold">
                        <tr>
                          <th className="p-2.5">{t.workflow.candidateCol}</th>
                          <th className="p-2.5">ASTM OTR</th>
                          <th className="p-2.5">ASTM WVTR</th>
                          <th className="p-2.5">{t.workflow.costCol}</th>
                          <th className="p-2.5">{t.workflow.ecoCol}</th>
                          <th className="p-2.5">Ci* Score</th>
                          <th className="p-2.5">{t.workflow.rankCol}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-[#17523d]">
                        {recommendation.passingCandidates.map(c => (
                          <tr key={c.material.id} className="hover:bg-slate-50 dark:hover:bg-[#0c382a]/50">
                            <td className="p-2.5 font-medium text-slate-900 dark:text-white">{c.material.code}</td>
                            <td className="p-2.5 font-mono">{c.material.otr} cc</td>
                            <td className="p-2.5 font-mono">{c.material.wvtr} g</td>
                            <td className="p-2.5">{c.material.costIndex}/10</td>
                            <td className="p-2.5">{c.material.sustainabilityScore}/10</td>
                            <td className="p-2.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">{c.topsisScore.toFixed(4)}</td>
                            <td className="p-2.5 font-bold">#{c.rank}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Evidence Graph Modal */}
      {modalCandidate && (
        <EvidenceGraphModal
          isOpen={!!modalCandidate}
          onClose={() => setModalCandidate(null)}
          commodity={activeCommodity}
          requirements={recommendation.requirements}
          candidate={modalCandidate}
        />
      )}
    </div>
  );
};
