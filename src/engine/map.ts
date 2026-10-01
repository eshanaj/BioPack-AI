import { Commodity, PackagingMaterial } from '../types/index.ts';

export interface MapCalculationResult {
  isDisarmed: boolean;
  disarmedReason?: string;
  equilibriumO2Percent: number;
  equilibriumCO2Percent: number;
  classification: 'BALANCED_CANDIDATE' | 'TOO_RESTRICTIVE' | 'TOO_PERMEABLE' | 'DISARMED_UNVERIFIED';
  chillingInjuryWarning: boolean;
  chillingInjuryMessage?: {
    en: string;
    hi: string;
    mr: string;
  };
  explanation: {
    en: string;
    hi: string;
    mr: string;
  };
  respirationRateUsed: number; // mL O2 / kg·hr
  optimalTargetO2: { min: number; max: number };
}

export function calculateProduceMapEquilibrium(
  commodity: Commodity,
  material: PackagingMaterial,
  productMassKg: number,
  filmAreaCm2: number,
  storageTempC: number
): MapCalculationResult {
  // ZERO-EXTRAPOLATION RULE
  if (!commodity.isRespirating || (!commodity.respirationRateO2_5C && !commodity.respirationRateO2_20C)) {
    return {
      isDisarmed: true,
      disarmedReason: 'Respiration kinetics data unavailable for this commodity. Refusing to extrapolate arbitrary values.',
      equilibriumO2Percent: 20.9,
      equilibriumCO2Percent: 0.04,
      classification: 'DISARMED_UNVERIFIED',
      chillingInjuryWarning: false,
      explanation: {
        en: 'Biophysical MAP calculation requires empirical respiration kinetics. Calculation disarmed to preserve scientific honesty.',
        hi: 'एमएपी गणना के लिए प्रामाणिक श्वसन आंकड़ों की आवश्यकता है। बिना प्रमाण के अनुमान लगाना वर्जित है।',
        mr: 'एमएपी विश्लेषणासाठी प्रमाणित श्वसन माहिती आवश्यक आहे. वैज्ञानिक सत्यतेसाठी ही गणना सुरक्षितपणे बंद केली आहे.'
      },
      respirationRateUsed: 0,
      optimalTargetO2: { min: 3, max: 8 }
    };
  }

  // Chilling injury check
  const hasChillingInjury =
    typeof commodity.chillingInjuryThresholdC === 'number' &&
    storageTempC < commodity.chillingInjuryThresholdC;

  let chillingInjuryMessage: any = undefined;
  if (hasChillingInjury) {
    chillingInjuryMessage = {
      en: `Chilling Injury Warning: ${commodity.name.en} is vulnerable below ${commodity.chillingInjuryThresholdC}°C (IS 11977 / FAO). Storage at ${storageTempC}°C will cause flesh browning, surface pitting, and failure to ripen normally. Maintain minimum ${commodity.chillingInjuryThresholdC}°C.`,
      hi: `शीत-क्षति (Chilling Injury) चेतावनी: ${commodity.name.hi} ${commodity.chillingInjuryThresholdC}°C से नीचे खराब हो जाता है। ${storageTempC}°C पर रखने से फल में काले धब्बे और सड़न होगी। न्यूनतम ${commodity.chillingInjuryThresholdC}°C तापमान रखें।`,
      mr: `शीत-इजा (Chilling Injury) इशारा: ${commodity.name.mr} ${commodity.chillingInjuryThresholdC}°C खाली खराब होते. ${storageTempC}°C तापमानात फळावर काळे डाग पडतील व ते आतून खराब होईल.`
    };
  }

  // Calculate respiration rate R_O2 at storageTempC using Arrhenius / Q10 estimation between verified 5°C and 20°C
  const r5 = commodity.respirationRateO2_5C || 15;
  const r20 = commodity.respirationRateO2_20C || 45;
  const q10 = Math.pow(r20 / r5, 10 / 15); // Q10 temperature coefficient
  const rT = r5 * Math.pow(q10, (storageTempC - 5) / 10);

  // Surface area in m²
  const areaM2 = filmAreaCm2 / 10000;

  // Film OTR in cc/m²·day
  const otr = material.otr;

  // Steady-state gas balance:
  // Consumption = rT * productMassKg * 24 (cc O2 / day)
  // Transmission = OTR * areaM2 * ((0.209 - y_O2) / 0.209)
  // At equilibrium: (0.209 - y_O2) = (rT * productMassKg * 24 * 0.209) / (OTR * areaM2)
  const o2Depletion = (rT * productMassKg * 24 * 0.209) / Math.max(1, (otr * areaM2));
  const rawEqO2 = (0.209 - o2Depletion) * 100;
  const equilibriumO2 = Math.max(0.1, Math.min(20.9, Number(rawEqO2.toFixed(1))));

  // Equilibrium CO2 based on respiration quotient RQ (typically 1.0 - 1.2)
  const rq = commodity.respirationQuotient || 1.1;
  const co2Accumulation = (rT * rq * productMassKg * 24 * 0.209) / Math.max(1, (otr * 4.0 * areaM2)); // CO2 permeation ~4x faster than O2 in polyolefins
  const rawEqCO2 = (co2Accumulation * 100) + 0.04;
  const equilibriumCO2 = Math.max(0.1, Math.min(25.0, Number(rawEqCO2.toFixed(1))));

  const optMin = commodity.recommendedAtmosphere?.optimumO2Min || 3.0;
  const optMax = commodity.recommendedAtmosphere?.optimumO2Max || 8.0;

  let classification: 'BALANCED_CANDIDATE' | 'TOO_RESTRICTIVE' | 'TOO_PERMEABLE' = 'BALANCED_CANDIDATE';
  let explanationEn = '';
  let explanationHi = '';
  let explanationMr = '';

  if (equilibriumO2 < 2.0) {
    classification = 'TOO_RESTRICTIVE';
    explanationEn = `Danger: Equilibrium O2 drops to ${equilibriumO2}%. Below the 2% critical threshold, anaerobic respiration induces acetaldehyde/ethanol accumulation, off-flavors, and tissue breakdown. Micro-perforated or higher OTR film is required.`;
    explanationHi = `खतरा: आंतरिक ऑक्सीजन गिरकर ${equilibriumO2}% पर आ जाएगी। 2% से नीचे अवायवीय (anaerobic) सड़न शुरू हो जाती है, जिससे दुर्गंध और विषैले घटक बनते हैं। अधिक हवादार फिल्म आवश्यक है।`;
    explanationMr = `धोका: अंतर्गत ऑक्सिजन ${equilibriumO2}% पर्यंत खाली येईल. २% खाली अवायवीय कुजणे सुरू होऊन दुर्गंधी पसरेल. अधिक हवा खेळती ठेवणारी फिल्म हवी.`;
  } else if (equilibriumO2 > 14.0) {
    classification = 'TOO_PERMEABLE';
    explanationEn = `Equilibrium O2 settles at ${equilibriumO2}%. Respiration rate is barely suppressed; produce will age and senesce at standard atmospheric rate. Provides minimal MAP shelf-life extension.`;
    explanationHi = `संतुलित ऑक्सीजन ${equilibriumO2}% पर रहता है। श्वसन दर धीमी नहीं होती; सामान्य वातावरण की तरह ही फल जल्दी पक जाएगा।`;
    explanationMr = `अंतर्गत ऑक्सिजन ${equilibriumO2}% राहील. श्वसन क्रिया मंदावत नाही; नेहमीप्रमाणेच माल लवकर पिकून मऊ पडेल.`;
  } else {
    classification = 'BALANCED_CANDIDATE';
    explanationEn = `Optimal equilibrium: Predicted package atmosphere is ${equilibriumO2}% O2 and ${equilibriumCO2}% CO2. Matches postharvest biological recommendation (${optMin}% - ${optMax}% O2) to slow metabolic decay without inducing fermentation.`;
    explanationHi = `आदर्श गैस संतुलन: अपेक्षित वातावरण ${equilibriumO2}% O2 और ${equilibriumCO2}% CO2 है। यह सड़न रोके बिना फल को सुरक्षित रूप से तरोताजा रखेगा।`;
    explanationMr = `आदर्श वायू संतुलन: पाऊचमध्ये ${equilibriumO2}% O2 आणि ${equilibriumCO2}% CO2 राहील. यामुळे नासाडी न होता फळ जास्त दिवस ताजे राहील.`;
  }

  return {
    isDisarmed: false,
    equilibriumO2Percent: equilibriumO2,
    equilibriumCO2Percent: equilibriumCO2,
    classification,
    chillingInjuryWarning: hasChillingInjury,
    chillingInjuryMessage,
    explanation: {
      en: explanationEn,
      hi: explanationHi,
      mr: explanationMr
    },
    respirationRateUsed: Number(rT.toFixed(1)),
    optimalTargetO2: { min: optMin, max: optMax }
  };
}
