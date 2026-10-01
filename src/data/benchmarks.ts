export interface BenchmarkCase {
  id: string;
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  commodityId: string;
  storageTempC: number;
  storageRH: number;
  targetDays: number;
  expectedPrimaryCode: string;
  expectedRejectCodes: string[];
  expectedCriticalConstraint: string;
  verifiedSourceCitation: string;
  description: {
    en: string;
    hi: string;
    mr: string;
  };
}

export const BENCHMARK_CASES: BenchmarkCase[] = [
  {
    id: 'case_high_fat_crisp_snack',
    name: {
      en: 'High-Fat Crispy Snack (Bhujia / Chips)',
      hi: 'उच्च वसा क्रिस्पी नमकीन (भुजिया / चिप्स)',
      mr: 'कुरकुरीत तळलेले नमकीन (भुजिया / वेफर्स)'
    },
    commodityId: 'potato_chips',
    storageTempC: 30,
    storageRH: 75,
    targetDays: 180,
    expectedPrimaryCode: 'BOPP/Met-BOPP',
    expectedRejectCodes: ['LDPE-50', 'PLA-30'],
    expectedCriticalConstraint: 'RULE-O2-RANCIDITY-HARD: Oxygen barrier OTR > 50 cc causes rancidity in high-fat fried foods',
    verifiedSourceCitation: 'CFTRI-MYSORE-2019',
    description: {
      en: 'Requires WVTR < 1.0 to prevent sogginess and OTR < 50 cc to prevent lipid oxidation rancidity.',
      hi: 'सीलन रोकने के लिए WVTR < 1.0 और दुर्गंध/ऑक्सीकरण रोकने के लिए OTR < 50 cc आवश्यक है।',
      mr: 'मऊपणा रोखण्यासाठी WVTR < 1.0 आणि खवटपणा रोखण्यासाठी OTR < 50 आवश्यक आहे.'
    }
  },
  {
    id: 'case_light_sensitive_spice',
    name: {
      en: 'Curcumin Photodegradable Spice (Turmeric Powder)',
      hi: 'प्रकाश-संवेदनशील मसाला (हल्दी पाउडर)',
      mr: 'प्रकाश-संवेदनशील हळद पावडर'
    },
    commodityId: 'turmeric_powder',
    storageTempC: 28,
    storageRH: 65,
    targetDays: 365,
    expectedPrimaryCode: 'PET/Met-PET/PE',
    expectedRejectCodes: ['LDPE-50', 'BOPP-25'],
    expectedCriticalConstraint: 'RULE-LIGHT-CURCUMIN: Optical light barrier < 85% causes curcumin photobleaching within 30 days',
    verifiedSourceCitation: 'FSSAI-PKG-2018',
    description: {
      en: 'Curcumin actively degrades under UV/visible light; opaque metallized barrier is strictly required.',
      hi: 'हल्दी का करक्यूमिन प्रकाश में खराब हो जाता है; अपारदर्शी धातुयुक्त परत आवश्यक है।',
      mr: 'हळदीतील करक्युमिन प्रकाशात फिकट पडते; अपारदर्शक मेटलाईझ्ड लेयर अत्यावश्यक आहे.'
    }
  },
  {
    id: 'case_high_respiration_produce',
    name: {
      en: 'High Respiration Leafy Greens (Fresh Spinach)',
      hi: 'उच्च श्वसन दर वाली ताजी हरी पत्ती (पालक)',
      mr: 'जास्त श्वासोच्छ्वास असलेली ताजी पालक'
    },
    commodityId: 'fresh_spinach',
    storageTempC: 4,
    storageRH: 95,
    targetDays: 10,
    expectedPrimaryCode: 'Micro-Perf-LDPE',
    expectedRejectCodes: ['PET/Alu/PE', 'BOPP/Met-BOPP', 'PP/EVOH/PE-70'],
    expectedCriticalConstraint: 'RULE-RESPIRATION-ASPHYXIATION: Impermeable film causes anaerobic fermentation (O2 < 1%) and ethanol off-odors',
    verifiedSourceCitation: 'KADER-2002',
    description: {
      en: 'Impervious foil or high barrier causes dangerous anaerobic rotting and off-flavors. Requires engineered breathability.',
      hi: 'हवा बंद पन्नी फल-सब्जियों को सड़ा देती है; सांस लेने योग्य माइक्रो-छिद्रित फिल्म चाहिए।',
      mr: 'पूर्ण हवा बंद पाऊचमध्ये भाज्या सडतात; हवा खेळती ठेवणारी मायक्रो-छिद्रित फिल्म हवी.'
    }
  },
  {
    id: 'case_vacuum_dairy_paneer',
    name: {
      en: 'Perishable Dairy / Vacuum Paneer',
      hi: 'शीघ्र खराब होने वाला डेयरी उत्पाद (पनीर)',
      mr: 'नाशवंत दुग्धजन्य पनीर'
    },
    commodityId: 'fresh_paneer',
    storageTempC: 4,
    storageRH: 85,
    targetDays: 21,
    expectedPrimaryCode: 'PP/EVOH/PE-70',
    expectedRejectCodes: ['LDPE-50', 'Paper/PE'],
    expectedCriticalConstraint: 'RULE-PERISHABLE-HERMETIC: OTR > 5 cc permits mold growth and rapid aerobic spoilage',
    verifiedSourceCitation: 'CFTRI-MYSORE-2019',
    description: {
      en: 'Requires EVOH-grade hermetic oxygen barrier and vacuum seal integrity under refrigeration.',
      hi: 'फफूंद रोकने के लिए ईवीओएच स्तर का गैस बैरियर और वैक्यूम सील आवश्यक है।',
      mr: 'बुरशी रोखण्यासाठी ईव्हीओएच दर्जाचा गॅस अडथळा व व्हॅक्यूम सील आवश्यक आहे.'
    }
  }
];
