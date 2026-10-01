import { Commodity, PackagingMaterial, PackageAuditResult, StorageCondition } from '../types/index.ts';
import { extractPackagingRequirements } from './requirements.ts';

export function auditCurrentPackaging(
  commodity: Commodity,
  currentMaterial: PackagingMaterial,
  thicknessUm: number,
  observedDays: number,
  storage: StorageCondition
): PackageAuditResult {
  const reqs = extractPackagingRequirements(commodity, storage);

  // Thickness scaling for barrier (OTR and WVTR are roughly inversely proportional to thickness)
  const nominal = currentMaterial.nominalThicknessUm;
  const ratio = nominal / Math.max(10, thicknessUm);
  const effectiveOtr = currentMaterial.otr * ratio;
  const effectiveWvtr = currentMaterial.wvtr * ratio;

  // 1. Moisture evaluation
  let moistureStatus: 'meets' | 'concern' | 'fails' = 'meets';
  if (effectiveWvtr > reqs.requiredWvtrMax * 2.0) {
    moistureStatus = 'fails';
  } else if (effectiveWvtr > reqs.requiredWvtrMax) {
    moistureStatus = 'concern';
  }

  // 2. Oxygen evaluation
  let oxygenStatus: 'meets' | 'concern' | 'fails' = 'meets';
  if (commodity.oxygenSensitivity === 'critical' || commodity.oxygenSensitivity === 'high') {
    if (effectiveOtr > reqs.requiredOtrMax * 2.5) {
      oxygenStatus = 'fails';
    } else if (effectiveOtr > reqs.requiredOtrMax) {
      oxygenStatus = 'concern';
    }
  }

  // 3. Light evaluation
  let lightStatus: 'meets' | 'concern' | 'fails' = 'meets';
  if (reqs.lightProtectionRequired && currentMaterial.lightBarrierPercent < 70) {
    lightStatus = commodity.lightSensitivity === 'critical' ? 'fails' : 'concern';
  }

  // 4. Food Contact evaluation
  let foodContactStatus: 'meets' | 'concern' | 'fails' = 'meets';
  if (currentMaterial.foodContactStatus === 'requires_verification') {
    foodContactStatus = 'concern';
  }

  // 5. Determine Overall Action
  let overallAction: 'KEEP' | 'MODIFY' | 'REPLACE' | 'VALIDATE' = 'KEEP';
  const recActionsEn: string[] = [];
  const recActionsHi: string[] = [];
  const recActionsMr: string[] = [];

  if (moistureStatus === 'fails' || oxygenStatus === 'fails') {
    overallAction = 'REPLACE';
    recActionsEn.push(
      `Your current package barrier is fundamentally inadequate for ${commodity.name.en}.`,
      `Upgrade to a high-barrier metallized structure (Met-BOPP or Met-PET) to reach target shelf life (${storage.targetShelfLifeDays} days).`,
      `Conduct an accelerated storage study under 38°C / 90% RH to confirm migration and seal strength.`
    );
    recActionsHi.push(
      `आपकी वर्तमान पैकेजिंग ${commodity.name.hi} के लिए बैरियर आवश्यकताओं में पूरी तरह विफल है।`,
      `अपेक्षित शेल्फ-लाइफ (${storage.targetShelfLifeDays} दिन) पाने के लिए उच्च-बैरियर मेटलाइज्ड फिल्म (Met-BOPP / Met-PET) अपनाएं।`,
      `38°C / 90% RH पर त्वरित भंडारण परीक्षण करवाएं।`
    );
    recActionsMr.push(
      `सध्याचे पॅकेजिंग ${commodity.name.mr} साठी अपुरे आहे.`,
      `अपेक्षित मुदत (${storage.targetShelfLifeDays} दिवस) मिळवण्यासाठी मेटलाईझ्ड फिल्म वापरा.`,
      `३८°C / ९०% आर्द्रतेत प्रत्यक्ष चाचणी करून घ्या.`
    );
  } else if (moistureStatus === 'concern' || oxygenStatus === 'concern' || lightStatus === 'concern') {
    overallAction = 'MODIFY';
    recActionsEn.push(
      `Current material structure is borderline. Increasing film thickness from ${thicknessUm}µm to ${Math.round(thicknessUm * 1.4)}µm may satisfy moisture barrier without full material overhaul.`,
      `Consider switching to an opaque/metallized inner layer if photodegradation is observed.`,
      `Verify pouch seal integrity (ASTM F88); seal micro-channels often cause more leakage than film permeation.`
    );
    recActionsHi.push(
      `वर्तमान सामग्री सीमा पर है। फिल्म की मोटाई ${thicknessUm}µm से बढ़ाकर ${Math.round(thicknessUm * 1.4)}µm करने से सुरक्षा बेहतर हो सकती है।`,
      `प्रकाश से बचाव के लिए अपारदर्शी इनर लेयर जोड़ें।`,
      `पाउच की सील मजबूती (ASTM F88) अवश्य जांचें; अक्सर सील के सूक्ष्म छिद्रों से हवा अंदर आती है।`
    );
    recActionsMr.push(
      `सध्याचे साहित्य सीमेवर आहे. फिल्मची जाडी ${thicknessUm}µm वरून ${Math.round(thicknessUm * 1.4)}µm केल्यास सुधारणा होईल.`,
      `पाऊचची सील मजबुती (ASTM F88) तपासा; अनेकदा सीलमधून हवा आत शिरते.`
    );
  } else if (foodContactStatus === 'concern') {
    overallAction = 'VALIDATE';
    recActionsEn.push(
      `Barrier properties are acceptable, but food-grade overall migration certification (IS 9845 / FSSAI) is unverified.`,
      `Request certificate of analysis (CoA) with overall migration testing from your flexible converter.`
    );
    recActionsHi.push(
      `बैरियर गुण पर्याप्त हैं, लेकिन FSSAI / IS 9845 खाद्य संपर्क प्रमाणपत्र असत्यापित है।`,
      `अपने सप्लायर से समग्र प्रवासन (Overall Migration) जांच रिपोर्ट मांगें।`
    );
    recActionsMr.push(
      `बॅरियर क्षमता चांगली आहे, पण FSSAI खाद्य संपर्क प्रमाणपत्र तपासणे बाकी आहे.`,
      `सप्लायरकडून मायग्रेशन चाचणी अहवाल मागवून घ्या.`
    );
  } else {
    overallAction = 'KEEP';
    recActionsEn.push(
      `Current package satisfies required biophysical barrier constraints for ${storage.targetShelfLifeDays} days storage.`,
      `Packaging is neither under-protecting nor excessively over-engineered.`,
      `Ensure routine quality control on heat-seal temperature and packaging line relative humidity.`
    );
    recActionsHi.push(
      `वर्तमान पैकेजिंग ${storage.targetShelfLifeDays} दिनों के भंडारण के लिए सभी वैज्ञानिक आवश्यकताओं को पूरा करती है।`,
      `पैकेजिंग न तो कमजोर है और न ही बेवजह महंगी। इसे जारी रखा जा सकता है।`,
      `सील तापमान और पैकेजिंग प्रक्रिया का नियमित निरीक्षण बनाए रखें।`
    );
    recActionsMr.push(
      `सध्याचे पॅकेजिंग ${storage.targetShelfLifeDays} दिवसांसाठी सर्व निकष पूर्ण करते.`,
      `पॅकेजिंग योग्य असून बदलण्याची गरज नाही.`,
      `सीलिंग तापमान व प्रक्रियेवर नियमित नियंत्रण ठेवा.`
    );
  }

  const diagnosisEn = `Audited ${currentMaterial.name.en} (${thicknessUm} µm) against ${commodity.name.en}: Effective OTR ~${Math.round(effectiveOtr)} cc, Effective WVTR ~${effectiveWvtr.toFixed(1)} g. Target requirements: OTR ≤ ${reqs.requiredOtrMax} cc, WVTR ≤ ${reqs.requiredWvtrMax} g. Diagnosis: ${overallAction}.`;
  const diagnosisHi = `${commodity.name.hi} के लिए ${currentMaterial.name.hi} (${thicknessUm} µm) का ऑडिट: प्रभावी OTR ~${Math.round(effectiveOtr)} cc, प्रभावी WVTR ~${effectiveWvtr.toFixed(1)} g। आवश्यक: OTR ≤ ${reqs.requiredOtrMax}, WVTR ≤ ${reqs.requiredWvtrMax}। निष्कर्ष: ${overallAction}।`;
  const diagnosisMr = `${commodity.name.mr} साठी ${currentMaterial.name.mr} (${thicknessUm} µm) चे ऑडिट: प्रभावी OTR ~${Math.round(effectiveOtr)} cc, प्रभावी WVTR ~${effectiveWvtr.toFixed(1)} g. निष्कर्ष: ${overallAction}.`;

  return {
    currentMaterial: currentMaterial.name.en,
    currentThicknessUm: thicknessUm,
    currentShelfLifeObservedDays: observedDays,
    moistureStatus,
    oxygenStatus,
    lightStatus,
    foodContactStatus,
    overallAction,
    diagnosis: {
      en: diagnosisEn,
      hi: diagnosisHi,
      mr: diagnosisMr
    },
    recommendedActions: {
      en: recActionsEn,
      hi: recActionsHi,
      mr: recActionsMr
    }
  };
}
