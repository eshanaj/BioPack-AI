import { COMMODITIES } from '../data/commodities.ts';
import { PACKAGING_MATERIALS } from '../data/materials.ts';
import { SCIENTIFIC_SOURCES } from '../data/sources.ts';
import { extractPackagingRequirements } from '../engine/requirements.ts';
import { evaluateHardConstraints } from '../engine/rules.ts';
import { rankMaterialsTopsis } from '../engine/topsis.ts';
import { calculateProduceMapEquilibrium } from '../engine/map.ts';
import { auditCurrentPackaging } from '../engine/audit.ts';
import { generatePackagingRecommendation } from '../engine/recommend.ts';
import { CURRENT_DATASET_MANIFEST } from '../engine/mlGate.ts';
import { en } from '../locales/en.ts';
import { hi } from '../locales/hi.ts';
import { mr } from '../locales/mr.ts';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('--- RUNNING BIOPACK AI AUTOMATED TEST SUITE ---');

// Test 1: Data Integrity
console.log('Test 1: Data Integrity & Manifest Checks...');
assert(COMMODITIES.length >= 15, `Expected at least 15 commodities, got ${COMMODITIES.length}`);
assert(PACKAGING_MATERIALS.length >= 10, `Expected at least 10 packaging materials, got ${PACKAGING_MATERIALS.length}`);
assert(SCIENTIFIC_SOURCES.length >= 7, `Expected at least 7 sources, got ${SCIENTIFIC_SOURCES.length}`);
assert(CURRENT_DATASET_MANIFEST.dataSufficiencyGateStatus === 'DATA_GATED', 'ML gate should be active and DATA_GATED');
console.log('✓ Data integrity passed.');

// Test 2: Requirement Extraction
console.log('Test 2: Food Requirement Extraction...');
const chips = COMMODITIES.find(c => c.id === 'potato_chips')!;
const reqs = extractPackagingRequirements(chips, {
  temperatureC: 30,
  relativeHumidity: 75,
  storageMode: 'ambient',
  sunlightExposure: 'indirect',
  handlingStress: 'standard',
  targetShelfLifeDays: 180
});
assert(reqs.requiredOtrMax <= 50, `Chips should require low OTR, got ${reqs.requiredOtrMax}`);
assert(reqs.requiredWvtrMax <= 2.0, `Chips should require low WVTR, got ${reqs.requiredWvtrMax}`);
assert(reqs.lightProtectionRequired === true, 'Chips should require light protection');
console.log('✓ Requirement extraction passed.');

// Test 3: Hard Constraints on High-Fat Snack
console.log('Test 3: Hard Constraints Screening...');
const plainLdpe = PACKAGING_MATERIALS.find(m => m.id === 'ldpe_plain_50')!;
const checksChips = evaluateHardConstraints(plainLdpe, chips, reqs, {
  temperatureC: 30,
  relativeHumidity: 75,
  storageMode: 'ambient',
  sunlightExposure: 'indirect',
  handlingStress: 'standard',
  targetShelfLifeDays: 180
});
const failedChips = checksChips.filter(c => !c.passed);
assert(failedChips.length > 0, 'Plain LDPE should be rejected for high-fat chips');
assert(failedChips.some(f => f.ruleId === 'RULE-O2-RANCIDITY-HARD'), 'Should trigger RULE-O2-RANCIDITY-HARD');
console.log('✓ High-fat snack hard constraints passed.');

// Test 4: Respiration Asphyxiation Hard Constraint
console.log('Test 4: Fresh Produce Respiration Asphyxiation...');
const spinach = COMMODITIES.find(c => c.id === 'fresh_spinach')!;
const foilPouch = PACKAGING_MATERIALS.find(m => m.id === 'alu_foil_laminate_80')!;
const spinachReqs = extractPackagingRequirements(spinach, {
  temperatureC: 4,
  relativeHumidity: 95,
  storageMode: 'chilled',
  sunlightExposure: 'indirect',
  handlingStress: 'standard',
  targetShelfLifeDays: 10
});
const checksSpinach = evaluateHardConstraints(foilPouch, spinach, spinachReqs, {
  temperatureC: 4,
  relativeHumidity: 95,
  storageMode: 'chilled',
  sunlightExposure: 'indirect',
  handlingStress: 'standard',
  targetShelfLifeDays: 10
});
const failedSpinach = checksSpinach.filter(c => !c.passed);
assert(failedSpinach.length > 0, 'Alu foil should be rejected for respiring spinach');
assert(failedSpinach.some(f => f.ruleId === 'RULE-RESPIRATION-ASPHYXIATION'), 'Should trigger RULE-RESPIRATION-ASPHYXIATION');
console.log('✓ Respiration asphyxiation constraints passed.');

// Test 5: Vector-Normalized TOPSIS Multi-Criteria Ranking
console.log('Test 5: TOPSIS Ranking Algorithm...');
const passingCandidates = PACKAGING_MATERIALS.filter(m => m.id !== 'ldpe_plain_50' && m.id !== 'microperforated_ldpe_30');
const ranked = rankMaterialsTopsis(passingCandidates, 'balanced');
assert(ranked.length === passingCandidates.length, 'All passing candidates should be ranked');
assert(ranked[0].closenessScore >= ranked[ranked.length - 1].closenessScore, 'Rankings should be sorted descending by closeness score');
assert(ranked[0].closenessScore <= 1.0 && ranked[0].closenessScore >= 0.0, 'Ci* score should be bounded in [0, 1]');
console.log('✓ TOPSIS ranking passed.');

// Test 6: Fresh Produce MAP Equilibrium & Chilling Injury
console.log('Test 6: MAP Equilibrium & Chilling Injury...');
const mango = COMMODITIES.find(c => c.id === 'fresh_alphonso_mango')!;
const microPerf = PACKAGING_MATERIALS.find(m => m.id === 'microperforated_ldpe_30')!;

// Storing mango at 4°C should trigger chilling injury alarm (< 12°C threshold)
const mapChilling = calculateProduceMapEquilibrium(mango, microPerf, 1.0, 1000, 4);
assert(mapChilling.chillingInjuryWarning === true, 'Mango at 4°C must trigger chilling injury alarm');

// Storing mango at 13°C should be chilling safe
const mapSafe = calculateProduceMapEquilibrium(mango, microPerf, 1.0, 1000, 13);
assert(mapSafe.chillingInjuryWarning === false, 'Mango at 13°C should be within safe postharvest limits');
console.log('✓ MAP equilibrium and chilling injury checks passed.');

// Test 7: Packaging Audit Engine
console.log('Test 7: Packaging Audit Diagnostic...');
const audit = auditCurrentPackaging(chips, plainLdpe, 50, 30, {
  temperatureC: 30,
  relativeHumidity: 75,
  storageMode: 'ambient',
  sunlightExposure: 'indirect',
  handlingStress: 'standard',
  targetShelfLifeDays: 180
});
assert(audit.overallAction === 'REPLACE', `Expected audit verdict REPLACE for plain LDPE on chips, got ${audit.overallAction}`);
assert(audit.oxygenStatus === 'fails', 'Oxygen status should fail');
assert(audit.moistureStatus === 'fails', 'Moisture status should fail');
console.log('✓ Packaging audit passed.');

// Test 8: Multilingual Dictionary Parity
console.log('Test 8: Multilingual Localization Integrity...');
function checkKeys(baseObj: any, compareObj: any, path = '') {
  for (const key of Object.keys(baseObj)) {
    const currentPath = path ? `${path}.${key}` : key;
    assert(key in compareObj, `Missing key in translation: ${currentPath}`);
    if (typeof baseObj[key] === 'object' && baseObj[key] !== null) {
      checkKeys(baseObj[key], compareObj[key], currentPath);
    } else {
      assert(typeof compareObj[key] === 'string' && compareObj[key].length > 0, `Empty string at ${currentPath}`);
    }
  }
}
checkKeys(en, hi, 'hi');
checkKeys(en, mr, 'mr');
console.log('✓ Trilingual parity verified (100% keys match in EN, HI, MR).');

// Test 9: Custom User Input Food with Null/Dash attributes
console.log('Test 9: Custom User Input with Null Attributes...');
const customFood = {
  id: 'custom_makhana',
  name: { en: 'Roasted Makhana (Fox Nuts)', hi: 'भुना मखाना', mr: 'भाजलेले मखाने' },
  category: 'high_fat_snack' as const,
  moistureContent: 3.2,
  fatContent: 12.0,
  waterActivity: null, // unknown/null
  pH: null, // unknown/null
  oxygenSensitivity: 'critical' as const,
  moistureSensitivity: 'critical' as const,
  lightSensitivity: 'moderate' as const,
  aromaSensitivity: 'low' as const,
  isRespirating: false,
  typicalStorageTempC: 25,
  typicalStorageRH: 60,
  targetShelfLifeDays: 120,
  typicalPackWeightG: 100,
  fssaiCategory: 'Custom User Specification',
  isVerified: false,
  citations: []
};
const customReqs = extractPackagingRequirements(customFood, {
  temperatureC: 25,
  relativeHumidity: 60,
  storageMode: 'ambient',
  sunlightExposure: 'indirect',
  handlingStress: 'standard',
  targetShelfLifeDays: 120
});
const customRec = generatePackagingRecommendation(customFood, {
  temperatureC: 25,
  relativeHumidity: 60,
  storageMode: 'ambient',
  sunlightExposure: 'indirect',
  handlingStress: 'standard',
  targetShelfLifeDays: 120
});
assert(customReqs.requiredOtrMax <= 50, 'Custom high-fat snack should require low OTR');
assert(customRec.primaryCandidate !== null, 'Custom food should receive valid deterministic recommendation');
assert(customRec.isDisarmed === true, 'Custom unverified food should be marked isDisarmed: true');
console.log('✓ Custom food with null attributes passed.');

console.log('====================================================');
console.log('ALL 9 TEST SUITES COMPLETED WITH 100% PASS RATE.');
console.log('====================================================');
