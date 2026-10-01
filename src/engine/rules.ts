import { Commodity, PackagingMaterial, FoodRequirements, StorageCondition } from '../types/index.ts';

export interface HardConstraintCheck {
  passed: boolean;
  ruleId: string;
  ruleName: string;
  reason: {
    en: string;
    hi: string;
    mr: string;
  };
}

export function evaluateHardConstraints(
  material: PackagingMaterial,
  commodity: Commodity,
  reqs: FoodRequirements,
  storage: StorageCondition
): HardConstraintCheck[] {
  const checks: HardConstraintCheck[] = [];

  // RULE 1: Respiration compatibility (CRITICAL FOR FRESH PRODUCE)
  if (commodity.isRespirating) {
    // Fresh produce must NOT be sealed in an impermeable or low OTR pouch
    if (material.otr < 1000) {
      checks.push({
        passed: false,
        ruleId: 'RULE-RESPIRATION-ASPHYXIATION',
        ruleName: 'Fresh Produce Respiration Asphyxiation',
        reason: {
          en: `Material OTR (${material.otr} cc) is too low for respiring produce. Traps CO2 and depletes O2 (<1%), causing anaerobic rot and off-odors.`,
          hi: `यह सामग्री (${material.otr} cc OTR) ताजे फल-सब्जियों के लिए अत्यधिक अवरोधक है। ऑक्सीजन खत्म होने से सड़न और दुर्गंध पैदा होगी।`,
          mr: `या साहित्याचा OTR (${material.otr} cc) सजीव अन्नपदार्थांसाठी अत्यंत कमी आहे. ऑक्सिजन संपल्याने नासाडी होईल.`
        }
      });
    }
  } else {
    // Non-respiring foods (e.g. dry snacks, powders) CANNOT use micro-perforated breathable film
    if (material.id === 'microperforated_ldpe_30') {
      checks.push({
        passed: false,
        ruleId: 'RULE-BREATHABLE-MISMATCH',
        ruleName: 'Breathable Film Mismatch for Shelf-Stable Food',
        reason: {
          en: `Laser micro-perforated film allows atmospheric moisture and oxygen freely, causing immediate loss of shelf life.`,
          hi: `माइक्रो-छिद्रित फिल्म नमी और हवा को सीधे अंदर आने देती है, जिससे सूखा भोजन तुरंत सील और खराब हो जाएगा।`,
          mr: `मायक्रो-छिद्रित फिल्ममुळे बाहेरील हवा व ओलावा सहज आत येतो, ज्यामुळे कोरडे अन्न तत्काळ खराब होईल.`
        }
      });
    }
  }

  // RULE 2: Critical Oxygen Barrier Failure
  if (!commodity.isRespirating && commodity.oxygenSensitivity === 'critical') {
    if (material.otr > reqs.requiredOtrMax * 3) {
      checks.push({
        passed: false,
        ruleId: 'RULE-O2-RANCIDITY-HARD',
        ruleName: 'Critical Oxygen Barrier Breach',
        reason: {
          en: `Material OTR (${material.otr} cc/m²·day) vastly exceeds max permissible (${reqs.requiredOtrMax} cc). Severe lipid oxidation and rancidity guaranteed.`,
          hi: `सामग्री की ऑक्सीजन पारगम्यता (${material.otr} cc) सुरक्षित सीमा (${reqs.requiredOtrMax} cc) से बहुत अधिक है। वसा का बासीपन निश्चित है।`,
          mr: `ऑक्सिजन पारगम्यता (${material.otr} cc) सुरक्षित मर्यादेपेक्षा (${reqs.requiredOtrMax} cc) खूप जास्त आहे. अन्नास खवट वास येईल.`
        }
      });
    }
  }

  // RULE 3: Critical Moisture Barrier Failure
  if (commodity.moistureSensitivity === 'critical' && !commodity.isRespirating) {
    if (material.wvtr > reqs.requiredWvtrMax * 2.5) {
      checks.push({
        passed: false,
        ruleId: 'RULE-WVTR-CRITICAL-MOISTURE',
        ruleName: 'Critical Moisture Ingress Failure',
        reason: {
          en: `Material WVTR (${material.wvtr} g/m²·day) exceeds required barrier (${reqs.requiredWvtrMax} g). Will cause rapid sogginess, deliquescence or mold.`,
          hi: `नमी पारगम्यता (${material.wvtr} g) आवश्यकता (${reqs.requiredWvtrMax} g) से अधिक है। उत्पाद शीघ्र सील जाएगा।`,
          mr: `ओलावा पारगम्यता (${material.wvtr} g) आवश्यकतेपेक्षा (${reqs.requiredWvtrMax} g) जास्त असल्याने अन्न मऊ पडेल.`
        }
      });
    }
  }

  // RULE 4: Thermal Compatibility
  if (storage.temperatureC < material.minTempC || storage.temperatureC > material.maxTempC) {
    checks.push({
      passed: false,
      ruleId: 'RULE-THERMAL-RANGE-FAILURE',
      ruleName: 'Thermal Operation Limit Exceeded',
      reason: {
        en: `Storage temperature (${storage.temperatureC}°C) is outside polymer service range (${material.minTempC}°C to ${material.maxTempC}°C). Polymer embrittlement or softening will occur.`,
        hi: `भंडारण तापमान (${storage.temperatureC}°C) सामग्री की सहनीय सीमा (${material.minTempC}°C से ${material.maxTempC}°C) से बाहर है।`,
        mr: `साठवणूक तापमान (${storage.temperatureC}°C) साहित्याच्या मर्यादेबाहेर (${material.minTempC}°C ते ${material.maxTempC}°C) आहे.`
      }
    });
  }

  // RULE 5: Critical Light Sensitivity (e.g. Curcumin in Turmeric or photo-sensitive fats)
  if (commodity.lightSensitivity === 'critical' && material.lightBarrierPercent < 70) {
    checks.push({
      passed: false,
      ruleId: 'RULE-LIGHT-CURCUMIN',
      ruleName: 'Photodegradation Barrier Failure',
      reason: {
        en: `Transparent material (light blocking ${material.lightBarrierPercent}%) fails critical photodegradation requirement (>70% optical barrier required for active pigment/curcumin preservation).`,
        hi: `पारदर्शी सामग्री (प्रकाश अवरोध ${material.lightBarrierPercent}%) प्रकाश-संवेदनशील घटकों (जैसे हल्दी का करक्यूमिन) की सुरक्षा में विफल है।`,
        mr: `पारदर्शक साहित्य (${material.lightBarrierPercent}% अडथळा) प्रकाश-संवेदनशील घटकांसाठी पुरेसे नाही.`
      }
    });
  }

  return checks;
}
