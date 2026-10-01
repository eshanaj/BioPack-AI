import { PackagingMaterial } from '../types/index.ts';

export const PACKAGING_MATERIALS: PackagingMaterial[] = [
  {
    id: 'ldpe_plain_50',
    name: {
      en: 'LDPE Film (50 µm)',
      hi: 'एलडीपीई फिल्म (50 माइक्रोन)',
      mr: 'एलडीपीई फिल्म (50 मायक्रॉन)'
    },
    code: 'LDPE-50',
    category: 'flexible_film',
    structureDescription: {
      en: 'Monolayer Low-Density Polyethylene blown film (50 µm)',
      hi: 'सिंगल लेयर कम घनत्व पॉलीथीन फिल्म (50 माइक्रोन)',
      mr: 'एकपदरी लो-डेन्सिटी पॉलिथिलीन फिल्म (50 मायक्रॉन)'
    },
    nominalThicknessUm: 50,
    otr: 2200, // cc/m²·day @ 23°C, 0% RH (ASTM D3985)
    wvtr: 18.0, // g/m²·day @ 38°C, 90% RH (ASTM F1249)
    tensileStrengthMpa: 22,
    lightBarrierPercent: 12,
    aromaBarrierScore: 2,
    fatResistanceScore: 3,
    minTempC: -40,
    maxTempC: 75,
    foodContactStatus: 'fssai_compliant',
    recyclability: 'EPR-Cat-2',
    sustainabilityScore: 7,
    carbonFootprintKgCO2PerKg: 1.8,
    costIndex: 2, // Very economical
    typicalApplications: {
      en: 'Fresh vegetables, general utility bags, frozen foods with low oxidation risk',
      hi: 'ताजी सब्जियां, सामान्य थैले, कम ऑक्सीकरण वाले फ्रोजन खाद्य',
      mr: 'ताज्या भाज्या, सामान्य पिशव्या, कमी ऑक्सिडीकरण अन्न'
    },
    sources: ['ASTM-D3985', 'ASTM-F1249', 'FSSAI-PKG-2018'],
    isMonoMaterial: true
  },
  {
    id: 'hdpe_film_35',
    name: {
      en: 'HDPE Film (35 µm)',
      hi: 'एचडीपीई फिल्म (35 माइक्रोन)',
      mr: 'एचडीपीई फिल्म (35 मायक्रॉन)'
    },
    code: 'HDPE-35',
    category: 'flexible_film',
    structureDescription: {
      en: 'High-Density Polyethylene film (35 µm) with higher crystallinity',
      hi: 'उच्च घनत्व पॉलीथीन फिल्म (35 माइक्रोन)',
      mr: 'हाय-डेन्सिटी पॉलिथिलीन फिल्म (35 मायक्रॉन)'
    },
    nominalThicknessUm: 35,
    otr: 1200,
    wvtr: 6.5,
    tensileStrengthMpa: 38,
    lightBarrierPercent: 28,
    aromaBarrierScore: 3,
    fatResistanceScore: 5,
    minTempC: -30,
    maxTempC: 110,
    foodContactStatus: 'fssai_compliant',
    recyclability: 'EPR-Cat-2',
    sustainabilityScore: 7.5,
    carbonFootprintKgCO2PerKg: 1.9,
    costIndex: 2.5,
    typicalApplications: {
      en: 'Grain liners, flour liners, bread bags, cereal dry goods',
      hi: 'अनाज लाइनर, आटा लाइनर, ब्रेड बैग, सूखी सामग्री',
      mr: 'धान्य पिशव्या, पिठाचे लाइनर, ब्रेड पिशव्या'
    },
    sources: ['ASTM-D3985', 'ASTM-F1249', 'FSSAI-PKG-2018'],
    isMonoMaterial: true
  },
  {
    id: 'bopp_plain_25',
    name: {
      en: 'BOPP Film (25 µm)',
      hi: 'बीओपीपी पारदर्शी फिल्म (25 माइक्रोन)',
      mr: 'बीओपीपी पारदर्शक फिल्म (25 मायक्रॉन)'
    },
    code: 'BOPP-25',
    category: 'flexible_film',
    structureDescription: {
      en: 'Biaxially Oriented Polypropylene with high clarity and stiffness (25 µm)',
      hi: 'द्वि-अक्षीय ओरिएंटेड पॉलीप्रोपाइलीन उच्च चमक फिल्म',
      mr: 'बायअ‍ॅक्सिअली ओरिएंटेड पॉलीप्रॉपिलीन फिल्म'
    },
    nominalThicknessUm: 25,
    otr: 1400,
    wvtr: 4.8,
    tensileStrengthMpa: 140,
    lightBarrierPercent: 8,
    aromaBarrierScore: 4,
    fatResistanceScore: 6,
    minTempC: -10,
    maxTempC: 125,
    foodContactStatus: 'fssai_compliant',
    recyclability: 'EPR-Cat-2',
    sustainabilityScore: 7,
    carbonFootprintKgCO2PerKg: 2.1,
    costIndex: 3,
    typicalApplications: {
      en: 'Biscuits overwrap, dry pasta, confectionery display packaging',
      hi: 'बिस्कुट रैपिंग, सूखा पास्ता, कन्फेक्शनरी पैकेजिंग',
      mr: 'बिस्किटे, सुका पास्ता, मिठाई वेष्टन'
    },
    sources: ['ASTM-D3985', 'ASTM-F1249'],
    isMonoMaterial: true
  },
  {
    id: 'met_bopp_laminate_35',
    name: {
      en: 'Metallized BOPP / PE Laminate (BOPP 15µ / Met-BOPP 20µ)',
      hi: 'मेटलाइज्ड बीओपीपी लैमिनेट (35 माइक्रोन)',
      mr: 'मेटलाईझ्ड बीओपीपी लॅमिनेट (35 मायक्रॉन)'
    },
    code: 'BOPP/Met-BOPP',
    category: 'laminate',
    structureDescription: {
      en: 'BOPP print web (15 µm) laminated to Vacuum Metallized BOPP sealant web (20 µm)',
      hi: 'बीओपीपी प्रिंट लेयर + वैक्यूम मेटलाइज्ड बीओपीपी सीलेंट लेयर',
      mr: 'बीओपीपी प्रिंट लेअर + व्हॅक्यूम मेटलाईझ्ड बीओपीपी स्तर'
    },
    nominalThicknessUm: 35,
    otr: 45, // significant oxygen barrier upgrade
    wvtr: 0.8, // excellent moisture barrier
    tensileStrengthMpa: 120,
    lightBarrierPercent: 96,
    aromaBarrierScore: 7,
    fatResistanceScore: 8,
    minTempC: -10,
    maxTempC: 110,
    foodContactStatus: 'fssai_compliant',
    recyclability: 'EPR-Cat-2', // Mono-PP family stream
    sustainabilityScore: 6.5,
    carbonFootprintKgCO2PerKg: 2.6,
    costIndex: 4.5,
    typicalApplications: {
      en: 'Potato chips, fried sev/bhujia, crispy snacks, extruded snacks',
      hi: 'आलू चिप्स, तली हुई भुजिया, नमकीन, क्रिस्पी स्नैक्स',
      mr: 'बटाटा वेफर्स, शेव/भुजिया, कुरकुरीत नमकीन'
    },
    sources: ['ASTM-D3985', 'ASTM-F1249', 'CFTRI-MYSORE-2019'],
    isMonoMaterial: true // compatible PP stream
  },
  {
    id: 'met_pet_pe_laminate_60',
    name: {
      en: 'Met-PET / Poly Laminate (PET 12µ / Met-PET 12µ / PE 35µ)',
      hi: 'मेट-पीईटी / पॉली लैमिनेट (60 माइक्रोन)',
      mr: 'मेट-पीईटी / पॉली लॅमिनेट (60 मायक्रॉन)'
    },
    code: 'PET/Met-PET/PE',
    category: 'laminate',
    structureDescription: {
      en: 'Reverse printed PET (12 µm) / Metallized PET (12 µm) / Food-grade PE sealant (35 µm)',
      hi: 'रिवर्स प्रिंटेड पीईटी / मेटलाइज्ड पीईटी / फूड ग्रेड पीई सीलेंट',
      mr: 'प्रिंटेड पीईटी / मेटलाईझ्ड पीईटी / फूड ग्रेड पीई सील'
    },
    nominalThicknessUm: 60,
    otr: 1.5, // High oxygen barrier!
    wvtr: 0.9,
    tensileStrengthMpa: 95,
    lightBarrierPercent: 98,
    aromaBarrierScore: 9,
    fatResistanceScore: 9,
    minTempC: -20,
    maxTempC: 105,
    foodContactStatus: 'fssai_compliant',
    recyclability: 'EPR-Cat-3', // Multi-material laminate
    sustainabilityScore: 4.5,
    carbonFootprintKgCO2PerKg: 3.2,
    costIndex: 6,
    typicalApplications: {
      en: 'Spices, roasted nuts, ground coffee, milk powder, roasted namkeen',
      hi: 'पिसे मसाले, भुनी मूंगफली/मेवे, कॉफी पाउडर, मिल्क पाउडर',
      mr: 'मसाले, भाजलेले सुकामेवा/शेंगदाणे, कॉफी पूड, दुधाची भुकटी'
    },
    sources: ['ASTM-D3985', 'ASTM-F1249', 'FSSAI-PKG-2018'],
    isMonoMaterial: false
  },
  {
    id: 'alu_foil_laminate_80',
    name: {
      en: 'Aluminium Foil Pouch (PET 12µ / Alu Foil 9µ / PE 55µ)',
      hi: 'एल्युमिनियम फॉयल 3-लेयर लैमिनेट पाउच (80 माइक्रोन)',
      mr: 'ॲल्युमिनियम फॉइल ३-पदरी लॅमिनेट (80 मायक्रॉन)'
    },
    code: 'PET/Alu/PE',
    category: 'laminate',
    structureDescription: {
      en: 'PET outer / 9 µm Aluminium Foil pinhole-free barrier / 55 µm PE hermetic sealant',
      hi: 'पीईटी आउटर + 9 माइक्रोन एल्युमिनियम फॉयल कोर + 55 माइक्रोन पीई सीलेंट',
      mr: 'पीईटी बाहेरील + 9 मायक्रॉन ॲल्युमिनियम फॉइल + 55 मायक्रॉन पीई'
    },
    nominalThicknessUm: 80,
    otr: 0.05, // Ultra-high absolute barrier
    wvtr: 0.05, // Zero moisture transmission
    tensileStrengthMpa: 80,
    lightBarrierPercent: 100, // Absolute optical opacity
    aromaBarrierScore: 10,
    fatResistanceScore: 10,
    minTempC: -30,
    maxTempC: 120,
    foodContactStatus: 'fssai_compliant',
    recyclability: 'EPR-Cat-3',
    sustainabilityScore: 3.5,
    carbonFootprintKgCO2PerKg: 7.8, // higher aluminum embodied energy
    costIndex: 8.5,
    typicalApplications: {
      en: 'Export spice powders, pharmaceutical dry goods, instant coffee, tea leaves, MRE foods',
      hi: 'निर्यात मसाले, इंस्टेंट कॉफी, प्रीमियम चाय, आपातकालीन राशन',
      mr: 'निर्यात मसाले, कॉफी, चहा, औषधी पावडर'
    },
    sources: ['ASTM-D3985', 'ASTM-F1249', 'FSSAI-PKG-2018', 'ROBERTSON-2013'],
    isMonoMaterial: false
  },
  {
    id: 'kraft_paper_pe_70',
    name: {
      en: 'Kraft Paper / Poly Extrusion Pouch (Kraft 60 gsm / PE 20 gsm)',
      hi: 'क्राफ्ट पेपर / पीई कोटेड पाउच',
      mr: 'क्राफ्ट पेपर / पीई कोटेड पाऊच'
    },
    code: 'Paper/PE',
    category: 'paper_based',
    structureDescription: {
      en: 'Virgin unbleached Kraft paper with inner food-grade PE barrier lining',
      hi: 'वर्जिन क्राफ्ट पेपर + आंतरिक फूड-ग्रेड पीई लाइनिंग',
      mr: 'व्हर्जिन क्राफ्ट कागद + अंतर्गत फूड-ग्रेड पीई अस्तर'
    },
    nominalThicknessUm: 75,
    otr: 450,
    wvtr: 7.2,
    tensileStrengthMpa: 55,
    lightBarrierPercent: 92,
    aromaBarrierScore: 5,
    fatResistanceScore: 6,
    minTempC: -15,
    maxTempC: 90,
    foodContactStatus: 'fssai_compliant',
    recyclability: 'EPR-Cat-3',
    sustainabilityScore: 6.8,
    carbonFootprintKgCO2PerKg: 1.6,
    costIndex: 4,
    typicalApplications: {
      en: 'Flour, jaggery blocks, dry bakery products, organic grains',
      hi: 'आटा, गुड़ की भेली, बेकरी उत्पाद, जैविक अनाज',
      mr: 'पीठ, गूळ, बेकरी पदार्थ, सेंद्रिय धान्य'
    },
    sources: ['ASTM-F1249', 'FSSAI-PKG-2018'],
    isMonoMaterial: false
  },
  {
    id: 'mono_mdo_pe_barrier_60',
    name: {
      en: 'Recyclable Mono-Material MDO-PE / PE Barrier Laminate (60 µm)',
      hi: 'पुनर्चक्रण योग्य मोनो-मटेरियल एमडीओ-पीई बैरियर (60 माइक्रोन)',
      mr: 'पुनर्वापरयोग्य मोनो-मटेरियल एमडीओ-पीई लॅमिनेट (60 मायक्रॉन)'
    },
    code: 'MDO-PE/PE-Barrier',
    category: 'laminate',
    structureDescription: {
      en: 'Machine Direction Oriented PE with EVOH-nano coating laminated to low-temp sealing PE',
      hi: 'मशीन डायरेक्शन ओरिएंटेड पीई बैरियर + लो-टेम्परेचर पीई सीलेंट (100% पीई स्ट्रीम)',
      mr: 'एमडीओ-पीई + पीई सील (१००% पीई रिसायकलेबल)'
    },
    nominalThicknessUm: 60,
    otr: 2.2, // Near Met-PET barrier in 100% recyclable stream!
    wvtr: 1.2,
    tensileStrengthMpa: 110,
    lightBarrierPercent: 88,
    aromaBarrierScore: 8,
    fatResistanceScore: 8.5,
    minTempC: -25,
    maxTempC: 95,
    foodContactStatus: 'fssai_compliant',
    recyclability: 'EPR-Cat-2', // Mono-material stream highly prized for EPR compliance
    sustainabilityScore: 8.8,
    carbonFootprintKgCO2PerKg: 2.2,
    costIndex: 6.5,
    typicalApplications: {
      en: 'Sustainable roasted snacks, confectionery, flour, pulses, dried fruits',
      hi: 'सस्टेनेबल नमकीन, कन्फेक्शनरी, दालें, सूखे मेवे',
      mr: 'पर्यावरणस्नेही नमकीन, डाळी, सुकामेवा, मिठाई'
    },
    sources: ['ASTM-D3985', 'ASTM-F1249', 'PWM-RULES-2022'],
    isMonoMaterial: true
  },
  {
    id: 'bio_pla_film_30',
    name: {
      en: 'Bio-based PLA Film (Polylactic Acid 30 µm)',
      hi: 'बायो-आधारित पीएलए फिल्म (30 माइक्रोन)',
      mr: 'बायो-आधारित पीएलए फिल्म (30 मायक्रॉन)'
    },
    code: 'PLA-30',
    category: 'biodegradable',
    structureDescription: {
      en: 'Corn/cassava starch derived polylactic acid compostable film',
      hi: 'कॉर्न स्टार्च से बनी औद्योगिक कम्पोस्टेबल पीएलए फिल्म',
      mr: 'कॉर्न स्टार्चपासून बनवलेली कंपोस्टेबल पीएलए फिल्म'
    },
    nominalThicknessUm: 30,
    otr: 550, // moderate oxygen transmission
    wvtr: 180.0, // High moisture vapor transmission (requires industrial compost)
    tensileStrengthMpa: 65,
    lightBarrierPercent: 15,
    aromaBarrierScore: 6,
    fatResistanceScore: 7,
    minTempC: 0,
    maxTempC: 50, // Softens easily in tropical heat (>55°C)
    foodContactStatus: 'fssai_compliant',
    recyclability: 'Compostable',
    sustainabilityScore: 7.8,
    carbonFootprintKgCO2PerKg: 1.4,
    costIndex: 6.0,
    typicalApplications: {
      en: 'Fresh cut produce, short-shelf-life bakery, dry confectionery',
      hi: 'ताजे कटे फल, अल्प अवधि बेकरी उत्पाद',
      mr: 'ताजी कापलेली फळे, अल्प मुदतीचे बेकरी पदार्थ'
    },
    sources: ['ASTM-D3985', 'ASTM-F1249', 'PWM-RULES-2022'],
    isMonoMaterial: true
  },
  {
    id: 'natureflex_cellulose_film_25',
    name: {
      en: 'Cellulose Bio-Film (NatureFlex™ coated 25 µm)',
      hi: 'सेल्युलोज बायो-फिल्म (25 माइक्रोन)',
      mr: 'सेल्युलोज बायो-फिल्म (25 मायक्रॉन)'
    },
    code: 'Bio-Cellulose-25',
    category: 'biodegradable',
    structureDescription: {
      en: 'FSC-certified wood pulp regenerated cellulose with bio-polymer barrier coating',
      hi: 'लकड़ी के गूदे से बनी होम कम्पोस्टेबल रीजनरेटेड सेल्युलोज फिल्म',
      mr: 'होम कंपोस्टेबल सेल्युलोज बायो-फिल्म'
    },
    nominalThicknessUm: 25,
    otr: 8.0, // very good oxygen barrier for biopolymer
    wvtr: 12.0,
    tensileStrengthMpa: 85,
    lightBarrierPercent: 18,
    aromaBarrierScore: 8,
    fatResistanceScore: 8,
    minTempC: -20,
    maxTempC: 130,
    foodContactStatus: 'fssai_compliant',
    recyclability: 'Compostable',
    sustainabilityScore: 8.5,
    carbonFootprintKgCO2PerKg: 1.9,
    costIndex: 7.5,
    typicalApplications: {
      en: 'Organic tea overwrap, premium confectionery, specialty chocolates',
      hi: 'ऑर्गेनिक चाय, प्रीमियम चॉकलेट, कन्फेक्शनरी',
      mr: 'सेंद्रिय चहा, प्रीमियम चॉकलेट, मिठाई'
    },
    sources: ['ASTM-D3985', 'ASTM-F1249', 'PWM-RULES-2022'],
    isMonoMaterial: false
  },
  {
    id: 'microperforated_ldpe_30',
    name: {
      en: 'Laser Micro-perforated LDPE Breathable Film (30 µm)',
      hi: 'माइक्रो-परफोरेटेड हवादार एलडीपीई फिल्म (30 माइक्रोन)',
      mr: 'मायक्रो-परफोरेटेड हवा खेळती राहणारी फिल्म (30 मायक्रॉन)'
    },
    code: 'Micro-Perf-LDPE',
    category: 'flexible_film',
    structureDescription: {
      en: 'Precision laser-perforated (100 µm holes, 80 holes/m²) breathable produce film',
      hi: 'सटीक लेजर-छिद्रित हवादार फिल्म (ताजी उपज के लिए विशेष)',
      mr: 'अचूक लेझर छिद्रे असलेली ताज्या भाज्यांसाठी फिल्म'
    },
    nominalThicknessUm: 30,
    otr: 28000, // Engineered ultra-permeable to prevent anaerobic fermentation!
    wvtr: 45.0, // prevents moisture condensation / fogging
    tensileStrengthMpa: 24,
    lightBarrierPercent: 10,
    aromaBarrierScore: 1,
    fatResistanceScore: 2,
    minTempC: 0,
    maxTempC: 60,
    foodContactStatus: 'fssai_compliant',
    recyclability: 'EPR-Cat-2',
    sustainabilityScore: 7.2,
    carbonFootprintKgCO2PerKg: 1.8,
    costIndex: 3.5,
    typicalApplications: {
      en: 'Fresh spinach, broccoli, mushrooms, high-respiration leafy greens (prevents off-odors)',
      hi: 'ताजा पालक, मशरूम, ब्रोकली (सड़ांध और दुर्गंध रोकती है)',
      mr: 'ताजी पालक, मशरूम, ब्रोकोली (दुर्गंधी रोखते)'
    },
    sources: ['KADER-2002', 'ROBERTSON-2013'],
    isMonoMaterial: true
  },
  {
    id: 'evoh_high_barrier_multilayer_70',
    name: {
      en: 'EVOH High-Barrier Multilayer Film (PP 25µ / EVOH 5µ / PE 40µ)',
      hi: 'ईवीओएच 5-लेयर हाई-बैरियर फिल्म (70 माइक्रोन)',
      mr: 'ईव्हीओएच ५-पदरी उच्च-अडथळा फिल्म (70 मायक्रॉन)'
    },
    code: 'PP/EVOH/PE-70',
    category: 'laminate',
    structureDescription: {
      en: 'Co-extruded symmetrical structure with Ethylene Vinyl Alcohol gas barrier core',
      hi: 'ईवीओएच कोर के साथ 5-परतीय सह-एक्सट्रूडेड गैस बैरियर फिल्म',
      mr: 'ईव्हीओएच कोर असलेली ५-पदरी गॅस अडथळा फिल्म'
    },
    nominalThicknessUm: 70,
    otr: 0.8, // Outstanding oxygen barrier
    wvtr: 1.8,
    tensileStrengthMpa: 75,
    lightBarrierPercent: 35, // Clear transparent high-barrier
    aromaBarrierScore: 10,
    fatResistanceScore: 10,
    minTempC: -20,
    maxTempC: 115,
    foodContactStatus: 'fssai_compliant',
    recyclability: 'EPR-Cat-3',
    sustainabilityScore: 5.5,
    carbonFootprintKgCO2PerKg: 3.0,
    costIndex: 7.0,
    typicalApplications: {
      en: 'Vacuum packed paneer, MAP fresh meat/poultry, modified atmosphere bakery, retorted pouches',
      hi: 'वैक्यूम पैक्ड पनीर, एमएपी ताजा पनीर, लंबे समय तक चलने वाली ब्रेड',
      mr: 'व्हॅक्यूम पॅक पनीर, एमएपी ताजे दुग्धजन्य पदार्थ'
    },
    sources: ['ASTM-D3985', 'ASTM-F1249', 'FSSAI-PKG-2018'],
    isMonoMaterial: false
  },
  {
    id: 'cast_pp_barrier_50',
    name: {
      en: 'Cast PP Retort Film (CPP 50 µm)',
      hi: 'कास्ट पॉलीप्रोपाइलीन सीलेंट फिल्म (50 माइक्रोन)',
      mr: 'कास्ट पॉलीप्रॉपिलीन फिल्म (50 मायक्रॉन)'
    },
    code: 'CPP-50',
    category: 'flexible_film',
    structureDescription: {
      en: 'High puncture-resistance, high thermal tolerance cast polypropylene',
      hi: 'उच्च छिद्र प्रतिरोध और उच्च तापमान सहनशील कास्ट पीपी',
      mr: 'उच्च तापमान सहन करणारी कास्ट पीपी फिल्म'
    },
    nominalThicknessUm: 50,
    otr: 1600,
    wvtr: 5.5,
    tensileStrengthMpa: 45,
    lightBarrierPercent: 10,
    aromaBarrierScore: 5,
    fatResistanceScore: 7,
    minTempC: 0,
    maxTempC: 135, // Retort autoclave compatible!
    foodContactStatus: 'fssai_compliant',
    recyclability: 'EPR-Cat-2',
    sustainabilityScore: 7.2,
    carbonFootprintKgCO2PerKg: 2.0,
    costIndex: 3.8,
    typicalApplications: {
      en: 'Boil-in-bag, retort pouches seal layer, ready-to-eat sweets in syrup',
      hi: 'उबालने योग्य पाउच, सिरप वाली मिठाइयां, रेडी-टू-ईट',
      mr: 'रेडी-टू-ईट अन्न, उकळण्यायोग्य पाऊच, पाकातील मिठाई'
    },
    sources: ['ASTM-D3985', 'ASTM-F1249'],
    isMonoMaterial: true
  }
];
