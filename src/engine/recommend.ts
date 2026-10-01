import {
  Commodity,
  StorageCondition,
  TopsisPriority,
  CandidateEvaluation,
  FoodRequirements
} from '../types/index.ts';
import { PACKAGING_MATERIALS } from '../data/materials.ts';
import { extractPackagingRequirements } from './requirements.ts';
import { evaluateHardConstraints } from './rules.ts';
import { rankMaterialsTopsis } from './topsis.ts';

export interface FullRecommendationReport {
  commodity: Commodity;
  storage: StorageCondition;
  requirements: FoodRequirements;
  priority: TopsisPriority;
  passingCandidates: CandidateEvaluation[];
  rejectedCandidates: CandidateEvaluation[];
  primaryCandidate: CandidateEvaluation | null;
  alternatives: CandidateEvaluation[];
  isDisarmed: boolean;
  disarmedMessage?: string;
  auditTrailHash: string;
  generatedTimestamp: string;
}

export function generatePackagingRecommendation(
  commodity: Commodity,
  storage: StorageCondition,
  priority: TopsisPriority = 'balanced'
): FullRecommendationReport {
  const reqs = extractPackagingRequirements(commodity, storage);

  const passingCandidates: CandidateEvaluation[] = [];
  const rejectedCandidates: CandidateEvaluation[] = [];

  // 1. Evaluate hard constraints for all materials
  const evaluatedMaterials = PACKAGING_MATERIALS.map(material => {
    const checks = evaluateHardConstraints(material, commodity, reqs, storage);
    const failures = checks.filter(c => !c.passed);
    const passed = failures.length === 0;

    return {
      material,
      passed,
      failures
    };
  });

  const passingMaterials = evaluatedMaterials
    .filter(e => e.passed)
    .map(e => e.material);

  // 2. Multi-criteria ranking via TOPSIS for passing materials
  const topsisResults = rankMaterialsTopsis(passingMaterials, priority);
  const topsisScoreMap = new Map<string, number>();
  topsisResults.forEach((r, idx) => {
    topsisScoreMap.set(r.material.id, r.closenessScore);
  });

  // 3. Construct detailed CandidateEvaluation objects
  for (const item of evaluatedMaterials) {
    const mat = item.material;
    const passed = item.passed;
    const topsisScore = topsisScoreMap.get(mat.id) ?? 0;

    // Calculate Evidence Coverage
    // Verified food factors (aw, pH, fat, moisture) + Certified ASTM OTR + Certified ASTM WVTR + Food Contact
    let verifiedCount = 3; // OTR, WVTR, ASTM methods certified
    let totalFactors = 5;
    if (commodity.isVerified) verifiedCount += 2;
    const evidenceCoverage = Math.round((verifiedCount / totalFactors) * 100);

    // Assess risks
    const moistureRisk =
      mat.wvtr > reqs.requiredWvtrMax ? 'high' : mat.wvtr > reqs.requiredWvtrMax * 0.7 ? 'medium' : 'low';
    const oxidationRisk =
      commodity.oxygenSensitivity === 'critical' && mat.otr > 50
        ? 'high'
        : mat.otr > reqs.requiredOtrMax
        ? 'medium'
        : 'low';
    const temperatureRisk =
      storage.temperatureC > mat.maxTempC - 10 || storage.temperatureC < mat.minTempC + 5
        ? 'medium'
        : 'low';
    const regulatoryRisk =
      mat.foodContactStatus === 'requires_verification' ? 'medium' : 'low';

    const overallRisk =
      moistureRisk === 'high' || oxidationRisk === 'high'
        ? 'high'
        : moistureRisk === 'medium' || oxidationRisk === 'medium' || temperatureRisk === 'medium'
        ? 'medium'
        : 'low';

    // Rationale generation in EN, HI, MR
    const fitEn = passed
      ? `Satisfies biophysical barrier thresholds (OTR: ${mat.otr} cc vs max ${reqs.requiredOtrMax} cc; WVTR: ${mat.wvtr} g vs max ${reqs.requiredWvtrMax} g). TOPSIS Closeness: ${topsisScore.toFixed(3)}.`
      : `Failed critical hard constraint screening. See rejection logs.`;

    const fitHi = passed
      ? `सभी अनिवार्य बैरियर शर्तों को पूरा करता है (OTR: ${mat.otr} cc, WVTR: ${mat.wvtr} g)। TOPSIS स्कोर: ${topsisScore.toFixed(3)}।`
      : `अनिवार्य वैज्ञानिक सुरक्षा जांच में खारिज।`;

    const fitMr = passed
      ? `सर्व आवश्यक बॅरियर निकष पूर्ण करतो (OTR: ${mat.otr} cc, WVTR: ${mat.wvtr} g). TOPSIS गुण: ${topsisScore.toFixed(3)}.`
      : `अनिवार्य वैज्ञानिक निकषांमध्ये बाद.`;

    const tradeoffEn = mat.isMonoMaterial
      ? `Mono-material polyolefin (${mat.recyclability}) enhances circular recyclability, with slightly higher barrier burden compared to multi-layer foil.`
      : `Multi-layer laminate delivers near-absolute hermetic barrier, but is classified under ${mat.recyclability} requiring specialized mechanical recycling.`;

    const tradeoffHi = mat.isMonoMaterial
      ? `मोनो-मटेरियल संरचना (${mat.recyclability}) पुनर्चक्रण में आसान है, हालांकि फॉयल की तुलना में बैरियर थोड़ा सीमित हो सकता है।`
      : `बहु-परतीय लैमिनेट सर्वोत्तम सुरक्षा देता है, लेकिन पुनर्चक्रण (${mat.recyclability}) में जटिल है।`;

    const tradeoffMr = mat.isMonoMaterial
      ? `मोनो-मटेरियल रचना (${mat.recyclability}) पुनर्वापरास सोपी आहे.`
      : `अनेक पदरी लॅमिनेट उत्कृष्ट संरक्षण देते, परंतु पुनर्वापरात (${mat.recyclability}) गुंतागुंतीचे आहे.`;

    const validationEn = [
      `Perform ASTM F88 seal strength testing on actual packaging line`,
      `Conduct 60-day accelerated storage trial at ${storage.temperatureC + 10}°C / ${Math.min(90, storage.relativeHumidity + 15)}% RH`,
      `Verify FSSAI overall migration limit compliance (IS 9845) with converter certificate`
    ];

    const validationHi = [
      `पैकेजिंग मशीन पर ASTM F88 सील मजबूती परीक्षण करें`,
      `${storage.temperatureC + 10}°C तापमान पर 60 दिवसीय त्वरित शेल्फ-लाइफ परीक्षण कराएं`,
      `सप्लायर से IS 9845 समग्र प्रवासन (Overall Migration) प्रमाणपत्र सत्यापित करें`
    ];

    const validationMr = [
      `पॅकिंग मशीनवर ASTM F88 सील मजबुती चाचणी करा`,
      `६० दिवसांची प्रत्यक्ष साठवणूक चाचणी करून पहा`,
      `सप्लायरकडून IS 9845 मायग्रेशन प्रमाणपत्र तपासा`
    ];

    const evalObj: CandidateEvaluation = {
      material: mat,
      passedHardConstraints: passed,
      hardConstraintFailures: item.failures.map(f => ({
        ruleId: f.ruleId,
        reason: f.reason
      })),
      topsisScore,
      rank: 0,
      fitAssessment: { en: fitEn, hi: fitHi, mr: fitMr },
      mainTradeoff: { en: tradeoffEn, hi: tradeoffHi, mr: tradeoffMr },
      evidenceCoveragePercent: evidenceCoverage,
      riskAssessment: {
        moistureRisk,
        oxidationRisk,
        temperatureRisk,
        regulatoryRisk,
        overallRisk
      },
      validationNeeds: { en: validationEn, hi: validationHi, mr: validationMr }
    };

    if (passed) {
      passingCandidates.push(evalObj);
    } else {
      rejectedCandidates.push(evalObj);
    }
  }

  // Sort passing candidates by TOPSIS score descending and assign rank
  passingCandidates.sort((a, b) => b.topsisScore - a.topsisScore);
  passingCandidates.forEach((c, idx) => {
    c.rank = idx + 1;
  });

  const primaryCandidate = passingCandidates.length > 0 ? passingCandidates[0] : null;
  const alternatives = passingCandidates.slice(1, 4);

  // Simple deterministic hash for audit trail
  const trailInput = `${commodity.id}-${storage.temperatureC}-${storage.relativeHumidity}-${storage.targetShelfLifeDays}-${priority}`;
  let hashVal = 0;
  for (let i = 0; i < trailInput.length; i++) {
    hashVal = (hashVal << 5) - hashVal + trailInput.charCodeAt(i);
    hashVal |= 0;
  }
  const auditTrailHash = 'BP-' + Math.abs(hashVal).toString(16).toUpperCase().padStart(8, '0');

  return {
    commodity,
    storage,
    requirements: reqs,
    priority,
    passingCandidates,
    rejectedCandidates,
    primaryCandidate,
    alternatives,
    isDisarmed: !commodity.isVerified,
    disarmedMessage: !commodity.isVerified
      ? 'Unverified Commodity: Respiration and barrier kinetics disarmed to avoid unsupported extrapolation.'
      : undefined,
    auditTrailHash,
    generatedTimestamp: new Date().toISOString()
  };
}
