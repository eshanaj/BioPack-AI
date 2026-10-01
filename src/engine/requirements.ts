import { Commodity, StorageCondition, FoodRequirements } from '../types/index.ts';

export function extractPackagingRequirements(
  commodity: Commodity,
  storage: StorageCondition
): FoodRequirements {
  const isHighTemp = storage.temperatureC >= 30;
  const isHighRH = storage.relativeHumidity >= 70;
  const isLongShelfLife = storage.targetShelfLifeDays >= 120;

  // Baseline target OTR (cc/m²·day @ 23°C)
  let requiredOtrMax = 2000;
  const rationaleEn: string[] = [];
  const rationaleHi: string[] = [];
  const rationaleMr: string[] = [];
  const evidenceIds: string[] = [...commodity.citations];

  // Oxygen requirement determination
  if (commodity.oxygenSensitivity === 'critical') {
    requiredOtrMax = isLongShelfLife ? 2.0 : 45.0;
    rationaleEn.push(`Critical oxygen sensitivity (fat: ${commodity.fatContent}%, oxidation risk). Requires OTR ≤ ${requiredOtrMax} cc/m²·day.`);
    rationaleHi.push(`उच्च वसा (${commodity.fatContent}%) के कारण तेल के बासीपन को रोकने के लिए OTR ≤ ${requiredOtrMax} cc/m²·day आवश्यक है।`);
    rationaleMr.push(`अन्नातील स्निग्धतेमुळे (${commodity.fatContent}%) खवटपणा रोखण्यासाठी OTR ≤ ${requiredOtrMax} cc/m²·day आवश्यक आहे.`);
    evidenceIds.push('ASTM-D3985', 'ROBERTSON-2013');
  } else if (commodity.oxygenSensitivity === 'high') {
    requiredOtrMax = isLongShelfLife ? 15.0 : 100.0;
    rationaleEn.push(`High oxygen sensitivity for aroma/nutrient preservation. Max OTR: ${requiredOtrMax} cc/m²·day.`);
    rationaleHi.push(`सुगंध व पोषक तत्वों की सुरक्षा के लिए अधिकतम OTR ${requiredOtrMax} cc/m²·day निर्धारित है।`);
    rationaleMr.push(`सुगंध व पोषक घटकांच्या रक्षणासाठी कमाल OTR ${requiredOtrMax} cc/m²·day निश्चित केले आहे.`);
    evidenceIds.push('ASTM-D3985');
  } else if (commodity.oxygenSensitivity === 'moderate') {
    requiredOtrMax = 500;
  }

  // Moisture requirement determination (g/m²·day @ 38°C, 90% RH)
  let requiredWvtrMax = 15.0;
  if (commodity.moistureSensitivity === 'critical') {
    requiredWvtrMax = isHighRH || isLongShelfLife ? 1.0 : 2.0;
    const awText = commodity.waterActivity != null ? `aw ${commodity.waterActivity}` : 'aw: —';
    rationaleEn.push(`Low moisture food (${commodity.moistureContent}%, ${awText}) risks sogginess/caking. Target WVTR ≤ ${requiredWvtrMax} g/m²·day.`);
    rationaleHi.push(`अत्यल्प नमी (${commodity.moistureContent}%) के कारण सीलन और खुरदरापन रोकने के लिए WVTR ≤ ${requiredWvtrMax} g/m²·day आवश्यक है।`);
    rationaleMr.push(`कमी ओलावा (${commodity.moistureContent}%) असल्याने कुरकुरीतपणा टिकवण्यासाठी WVTR ≤ ${requiredWvtrMax} g/m²·day आवश्यक आहे.`);
    evidenceIds.push('ASTM-F1249');
  } else if (commodity.moistureSensitivity === 'high') {
    requiredWvtrMax = isHighRH ? 2.5 : 5.0;
    rationaleEn.push(`High moisture sensitivity under ${storage.relativeHumidity}% RH. Target WVTR ≤ ${requiredWvtrMax} g/m²·day.`);
    rationaleHi.push(`${storage.relativeHumidity}% आर्द्रता में नमी नियंत्रण के लिए WVTR ≤ ${requiredWvtrMax} g/m²·day आवश्यक है।`);
    rationaleMr.push(`${storage.relativeHumidity}% आर्द्रतेत ओलावा नियंत्रणासाठी WVTR ≤ ${requiredWvtrMax} g/m²·day आवश्यक आहे.`);
    evidenceIds.push('ASTM-F1249');
  } else if (commodity.moistureSensitivity === 'moderate') {
    requiredWvtrMax = 8.0;
  }

  // Light protection requirement
  const lightProtectionRequired =
    commodity.lightSensitivity === 'critical' ||
    commodity.lightSensitivity === 'high' ||
    storage.sunlightExposure === 'direct';

  if (lightProtectionRequired) {
    rationaleEn.push(`Light protection required to prevent pigment photo-oxidation (e.g. curcumin/chlorophyll) or lipid photo-sensitization.`);
    rationaleHi.push(`प्रकाश अवरोधक परत आवश्यक है ताकि रंगों (जैसे हल्दी का करक्यूमिन) और वसा का क्षरण न हो।`);
    rationaleMr.push(`प्रकाश अडवणारा स्तर आवश्यक आहे जेणेकरून रंग व पोषणमूल्ये खराब होणार नाहीत.`);
    evidenceIds.push('CFTRI-MYSORE-2019');
  }

  // Respiration compatibility
  const respirationCompatible = commodity.isRespirating;
  if (respirationCompatible) {
    rationaleEn.push(`Living fresh produce requires controlled gas permeation. Impermeable barrier creates hazardous anaerobic fermentation.`);
    rationaleHi.push(`जीवित फल-सब्जियों को हवादार पैकेजिंग चाहिए। पूर्ण अवरोधक पन्नी में ऑक्सीजन खत्म होने से सड़न होगी।`);
    rationaleMr.push(`ताज्या भाज्यांसाठी नियंत्रित हवा खेळती राहणे आवश्यक आहे. पूर्ण हवा बंद पाऊचमध्ये नासाडी होईल.`);
    evidenceIds.push('KADER-2002');
  }

  // Fat resistance
  const fatResistanceRequired = commodity.fatContent >= 10.0;

  // Mechanical puncture tolerance
  const punctureResistanceMinMpa =
    storage.handlingStress === 'high_vibration_rough' ? 60 : 25;

  return {
    requiredOtrMax,
    requiredWvtrMax,
    lightProtectionRequired,
    fatResistanceRequired,
    punctureResistanceMinMpa,
    hermeticSealRequired: !commodity.isRespirating,
    respirationCompatible,
    tempToleranceMinC: Math.min(storage.temperatureC, 0),
    tempToleranceMaxC: Math.max(storage.temperatureC + 15, 60),
    rationale: {
      en: rationaleEn,
      hi: rationaleHi,
      mr: rationaleMr
    },
    evidenceIds: Array.from(new Set(evidenceIds))
  };
}
