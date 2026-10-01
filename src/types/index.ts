export type SupportedLanguage = 'en' | 'hi' | 'mr';

export type UserRole = 'industry' | 'farmer' | 'startup' | 'researcher';

export type FoodTrackMode = 'packaged' | 'fresh';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  selectedTrack: FoodTrackMode;
}

export type FoodCategory =
  | 'dry_grain_flour'
  | 'pulse_legume'
  | 'high_fat_snack'
  | 'spice_condiment'
  | 'fresh_fruit'
  | 'fresh_vegetable'
  | 'dairy_product'
  | 'sweet_confectionery'
  | 'beverage_dry'
  | 'custom';

export type SensitivityLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface Commodity {
  id: string;
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  category: FoodCategory;
  moistureContent: number; // % w/w
  fatContent: number; // % w/w
  waterActivity?: number | null; // aw 0.0 - 1.0 or null
  pH?: number | null;
  oxygenSensitivity: SensitivityLevel;
  moistureSensitivity: SensitivityLevel;
  lightSensitivity: SensitivityLevel;
  aromaSensitivity: SensitivityLevel;
  isRespirating: boolean;
  respirationRateO2_5C?: number; // mL O2 / kg·hr at 5°C
  respirationRateO2_20C?: number; // mL O2 / kg·hr at 20°C
  respirationQuotient?: number; // RQ = CO2 / O2
  recommendedAtmosphere?: {
    optimumO2Min: number; // %
    optimumO2Max: number; // %
    optimumCO2Min: number; // %
    optimumCO2Max: number; // %
  };
  chillingInjuryThresholdC?: number; // threshold below which chilling injury occurs
  typicalStorageTempC: number;
  typicalStorageRH: number; // %
  targetShelfLifeDays: number;
  typicalPackWeightG: number;
  fssaiCategory: string;
  isVerified: boolean;
  citations: string[]; // Source IDs
}

export type RecyclabilityCategory = 'EPR-Cat-1' | 'EPR-Cat-2' | 'EPR-Cat-3' | 'Compostable' | 'Non-recyclable';

export interface PackagingMaterial {
  id: string;
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  code: string;
  category: 'rigid' | 'flexible_film' | 'laminate' | 'paper_based' | 'biodegradable';
  structureDescription: {
    en: string;
    hi: string;
    mr: string;
  };
  nominalThicknessUm: number; // micrometers
  // ASTM D3985 Oxygen Transmission Rate (cc / m² · 24hr · 1 atm @ 23°C, 0% RH)
  otr: number;
  // ASTM F1249 Water Vapor Transmission Rate (g / m² · 24hr @ 38°C, 90% RH)
  wvtr: number;
  // ASTM D882 Tensile Strength (MPa)
  tensileStrengthMpa: number;
  // Light barrier capability 0-100%
  lightBarrierPercent: number;
  // Aroma barrier score 1-10
  aromaBarrierScore: number;
  // Grease & fat resistance score 1-10
  fatResistanceScore: number;
  // Temperature limits
  minTempC: number;
  maxTempC: number;
  // Food contact compliance status
  foodContactStatus: 'fssai_compliant' | 'fda_cfr_compliant' | 'requires_verification';
  // Sustainability & Recyclability
  recyclability: RecyclabilityCategory;
  sustainabilityScore: number; // 1-10 (10 being most circular / mono-material / biodegradable)
  carbonFootprintKgCO2PerKg: number;
  // Cost index (normalized 1-10, 1 being most economical)
  costIndex: number;
  typicalApplications: {
    en: string;
    hi: string;
    mr: string;
  };
  sources: string[];
  isMonoMaterial: boolean;
}

export interface StorageCondition {
  temperatureC: number;
  relativeHumidity: number; // 0-100%
  storageMode: 'ambient' | 'chilled' | 'frozen';
  sunlightExposure: 'protected' | 'indirect' | 'direct';
  handlingStress: 'standard' | 'high_vibration_rough';
  targetShelfLifeDays: number;
}

export interface FoodRequirements {
  requiredOtrMax: number; // maximum acceptable OTR
  requiredWvtrMax: number; // maximum acceptable WVTR
  lightProtectionRequired: boolean;
  fatResistanceRequired: boolean;
  punctureResistanceMinMpa: number;
  hermeticSealRequired: boolean;
  respirationCompatible: boolean;
  tempToleranceMinC: number;
  tempToleranceMaxC: number;
  rationale: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  evidenceIds: string[];
}

export interface CandidateEvaluation {
  material: PackagingMaterial;
  passedHardConstraints: boolean;
  hardConstraintFailures: {
    ruleId: string;
    reason: {
      en: string;
      hi: string;
      mr: string;
    };
  }[];
  topsisScore: number; // 0.0 - 1.0 (relative closeness Ci*)
  rank: number;
  fitAssessment: {
    en: string;
    hi: string;
    mr: string;
  };
  mainTradeoff: {
    en: string;
    hi: string;
    mr: string;
  };
  evidenceCoveragePercent: number;
  riskAssessment: {
    moistureRisk: 'low' | 'medium' | 'high' | 'unknown';
    oxidationRisk: 'low' | 'medium' | 'high' | 'unknown';
    temperatureRisk: 'low' | 'medium' | 'high' | 'unknown';
    regulatoryRisk: 'low' | 'medium' | 'high' | 'unknown';
    overallRisk: 'low' | 'medium' | 'high' | 'unknown';
  };
  validationNeeds: {
    en: string[];
    hi: string[];
    mr: string[];
  };
}

export type TopsisPriority = 'balanced' | 'barrier' | 'budget' | 'sustainability';

export interface ScientificSource {
  id: string;
  title: string;
  publisherOrOrg: string;
  year: number;
  doiOrUrl: string;
  sourceType: 'standard' | 'scientific_paper' | 'regulation' | 'government_report' | 'supplier_datasheet';
  verificationStatus: 'verified' | 'reference_value' | 'derived';
  summary: string;
}

export interface PackageAuditResult {
  currentMaterial: string;
  currentThicknessUm: number;
  currentShelfLifeObservedDays: number;
  moistureStatus: 'meets' | 'concern' | 'fails' | 'insufficient_evidence';
  oxygenStatus: 'meets' | 'concern' | 'fails' | 'insufficient_evidence';
  lightStatus: 'meets' | 'concern' | 'fails' | 'insufficient_evidence';
  foodContactStatus: 'meets' | 'concern' | 'fails' | 'insufficient_evidence';
  overallAction: 'KEEP' | 'MODIFY' | 'REPLACE' | 'VALIDATE';
  diagnosis: {
    en: string;
    hi: string;
    mr: string;
  };
  recommendedActions: {
    en: string[];
    hi: string[];
    mr: string[];
  };
}

export interface ValidationTestLog {
  id: string;
  testDate: string;
  batchLotNumber: string;
  materialUsed: string;
  testCondition: string; // e.g. 38C / 90% RH (accelerated)
  durationDaysElapsed: number;
  observedMoistureChangePercent?: number;
  observedCrispnessOrSensoryScore?: number; // 1-10
  observedSealFailure?: boolean;
  status: 'VALIDATED' | 'PARTIALLY_VALIDATED' | 'PENDING' | 'FAILED' | 'INSUFFICIENT_DATA';
  notes: string;
}
