import { Commodity } from '../types/index.ts';

export const COMMODITIES: Commodity[] = [
  {
    id: 'potato_chips',
    name: {
      en: 'Potato Chips / Crisps',
      hi: 'आलू के चिप्स',
      mr: 'बटाटा वेफर्स'
    },
    category: 'high_fat_snack',
    moistureContent: 2.1,
    fatContent: 34.0,
    waterActivity: 0.18,
    pH: 6.2,
    oxygenSensitivity: 'critical',
    moistureSensitivity: 'critical',
    lightSensitivity: 'high',
    aromaSensitivity: 'moderate',
    isRespirating: false,
    typicalStorageTempC: 25,
    typicalStorageRH: 65,
    targetShelfLifeDays: 180,
    typicalPackWeightG: 50,
    fssaiCategory: 'Snack Foods (Fried)',
    isVerified: true,
    citations: ['ROBERTSON-2013', 'CFTRI-MYSORE-2019']
  },
  {
    id: 'roasted_peanuts',
    name: {
      en: 'Roasted Salted Peanuts',
      hi: 'भुने हुए नमकीन मूंगफली दाने',
      mr: 'भाजलेले शेंगदाणे'
    },
    category: 'high_fat_snack',
    moistureContent: 2.8,
    fatContent: 49.2,
    waterActivity: 0.28,
    pH: 6.4,
    oxygenSensitivity: 'critical',
    moistureSensitivity: 'high',
    lightSensitivity: 'high',
    aromaSensitivity: 'high',
    isRespirating: false,
    typicalStorageTempC: 25,
    typicalStorageRH: 60,
    targetShelfLifeDays: 120,
    typicalPackWeightG: 200,
    fssaiCategory: 'Nuts and Dry Fruits',
    isVerified: true,
    citations: ['CFTRI-MYSORE-2019', 'ROBERTSON-2013']
  },
  {
    id: 'bhujia_sev',
    name: {
      en: 'Bikaneri Bhujia / Besan Sev',
      hi: 'बीकानेरी भुजिया / बेसन सेव',
      mr: 'बीकानेरी भुजिया / बेसन शेव'
    },
    category: 'high_fat_snack',
    moistureContent: 2.4,
    fatContent: 38.5,
    waterActivity: 0.22,
    pH: 6.1,
    oxygenSensitivity: 'critical',
    moistureSensitivity: 'critical',
    lightSensitivity: 'moderate',
    aromaSensitivity: 'high',
    isRespirating: false,
    typicalStorageTempC: 28,
    typicalStorageRH: 70,
    targetShelfLifeDays: 180,
    typicalPackWeightG: 400,
    fssaiCategory: 'Traditional Indian Savoury Snacks',
    isVerified: true,
    citations: ['CFTRI-MYSORE-2019']
  },
  {
    id: 'turmeric_powder',
    name: {
      en: 'Turmeric Powder (Ground Spices)',
      hi: 'हल्दी पाउडर (पिसे मसाले)',
      mr: 'हळद पावडर (मसाला)'
    },
    category: 'spice_condiment',
    moistureContent: 8.5,
    fatContent: 5.1,
    waterActivity: 0.45,
    pH: 6.0,
    oxygenSensitivity: 'moderate',
    moistureSensitivity: 'high',
    lightSensitivity: 'critical', // Curcumin photodegrades rapidly in light
    aromaSensitivity: 'critical',
    isRespirating: false,
    typicalStorageTempC: 25,
    typicalStorageRH: 60,
    targetShelfLifeDays: 365,
    typicalPackWeightG: 500,
    fssaiCategory: 'Spices and Condiments',
    isVerified: true,
    citations: ['CFTRI-MYSORE-2019', 'FSSAI-PKG-2018']
  },
  {
    id: 'wheat_flour_atta',
    name: {
      en: 'Whole Wheat Atta (Flour)',
      hi: 'गेहूं का आटा',
      mr: 'गव्हाचे पीठ'
    },
    category: 'dry_grain_flour',
    moistureContent: 11.8,
    fatContent: 1.8,
    waterActivity: 0.58,
    pH: 6.3,
    oxygenSensitivity: 'low',
    moistureSensitivity: 'high',
    lightSensitivity: 'low',
    aromaSensitivity: 'moderate',
    isRespirating: false,
    typicalStorageTempC: 25,
    typicalStorageRH: 65,
    targetShelfLifeDays: 90,
    typicalPackWeightG: 5000,
    fssaiCategory: 'Cereal and Cereal Products',
    isVerified: true,
    citations: ['ROBERTSON-2013']
  },
  {
    id: 'basmati_rice',
    name: {
      en: 'Basmati Milled Rice',
      hi: 'बासमती चावल',
      mr: 'बासमती तांदूळ'
    },
    category: 'dry_grain_flour',
    moistureContent: 12.0,
    fatContent: 0.8,
    waterActivity: 0.55,
    pH: 6.5,
    oxygenSensitivity: 'low',
    moistureSensitivity: 'high',
    lightSensitivity: 'low',
    aromaSensitivity: 'critical', // 2-acetyl-1-pyrroline volatile aroma loss
    isRespirating: false,
    typicalStorageTempC: 25,
    typicalStorageRH: 65,
    targetShelfLifeDays: 365,
    typicalPackWeightG: 5000,
    fssaiCategory: 'Cereal and Cereal Products',
    isVerified: true,
    citations: ['CFTRI-MYSORE-2019']
  },
  {
    id: 'moong_dal',
    name: {
      en: 'Split Moong Dal (Pulses)',
      hi: 'मूंग दाल',
      mr: 'मूग डाळ'
    },
    category: 'pulse_legume',
    moistureContent: 10.2,
    fatContent: 1.2,
    waterActivity: 0.52,
    pH: 6.4,
    oxygenSensitivity: 'low',
    moistureSensitivity: 'moderate',
    lightSensitivity: 'low',
    aromaSensitivity: 'low',
    isRespirating: false,
    typicalStorageTempC: 25,
    typicalStorageRH: 65,
    targetShelfLifeDays: 270,
    typicalPackWeightG: 1000,
    fssaiCategory: 'Pulses and Legumes',
    isVerified: true,
    citations: ['CFTRI-MYSORE-2019']
  },
  {
    id: 'fresh_alphonso_mango',
    name: {
      en: 'Alphonso Mango (Fresh Mature Green/Ripe)',
      hi: 'ताजा हापुस आम',
      mr: 'ताजा हापूस आंबा'
    },
    category: 'fresh_fruit',
    moistureContent: 83.0,
    fatContent: 0.4,
    waterActivity: 0.98,
    pH: 4.2,
    oxygenSensitivity: 'high',
    moistureSensitivity: 'high',
    lightSensitivity: 'moderate',
    aromaSensitivity: 'low',
    isRespirating: true,
    respirationRateO2_5C: 15.0, // ml O2 / kg·hr at 12C
    respirationRateO2_20C: 48.0, // ml O2 / kg·hr at 20C
    respirationQuotient: 1.15,
    recommendedAtmosphere: {
      optimumO2Min: 3.0,
      optimumO2Max: 5.0,
      optimumCO2Min: 5.0,
      optimumCO2Max: 10.0
    },
    chillingInjuryThresholdC: 12.0, // Chilling injury occurs below 12°C!
    typicalStorageTempC: 13,
    typicalStorageRH: 90,
    targetShelfLifeDays: 21,
    typicalPackWeightG: 1500,
    fssaiCategory: 'Fresh Fruits and Vegetables',
    isVerified: true,
    citations: ['KADER-2002']
  },
  {
    id: 'fresh_spinach',
    name: {
      en: 'Fresh Spinach / Palak Leaves',
      hi: 'ताजा पालक',
      mr: 'ताजी पालक'
    },
    category: 'fresh_vegetable',
    moistureContent: 91.5,
    fatContent: 0.3,
    waterActivity: 0.99,
    pH: 6.8,
    oxygenSensitivity: 'critical',
    moistureSensitivity: 'critical',
    lightSensitivity: 'moderate',
    aromaSensitivity: 'low',
    isRespirating: true,
    respirationRateO2_5C: 40.0, // Very high respiration!
    respirationRateO2_20C: 190.0,
    respirationQuotient: 1.05,
    recommendedAtmosphere: {
      optimumO2Min: 7.0,
      optimumO2Max: 10.0,
      optimumCO2Min: 5.0,
      optimumCO2Max: 10.0
    },
    chillingInjuryThresholdC: 0.0, // tolerant to near 0°C
    typicalStorageTempC: 4,
    typicalStorageRH: 95,
    targetShelfLifeDays: 10,
    typicalPackWeightG: 250,
    fssaiCategory: 'Fresh Fruits and Vegetables',
    isVerified: true,
    citations: ['KADER-2002']
  },
  {
    id: 'fresh_paneer',
    name: {
      en: 'Fresh Paneer (Cottage Cheese)',
      hi: 'ताजा पनीर',
      mr: 'ताजे पनीर'
    },
    category: 'dairy_product',
    moistureContent: 54.0,
    fatContent: 22.0,
    waterActivity: 0.97,
    pH: 5.8,
    oxygenSensitivity: 'critical',
    moistureSensitivity: 'high',
    lightSensitivity: 'high',
    aromaSensitivity: 'moderate',
    isRespirating: false,
    typicalStorageTempC: 4,
    typicalStorageRH: 85,
    targetShelfLifeDays: 21,
    typicalPackWeightG: 200,
    fssaiCategory: 'Dairy Products and Analogues',
    isVerified: true,
    citations: ['FSSAI-PKG-2018', 'CFTRI-MYSORE-2019']
  },
  {
    id: 'gulab_jamun_syrup',
    name: {
      en: 'Gulab Jamun (in Sugar Syrup)',
      hi: 'गुलाब जामुन (चाशनी में)',
      mr: 'गुलाबजाम (पाकात)'
    },
    category: 'sweet_confectionery',
    moistureContent: 31.0,
    fatContent: 11.5,
    waterActivity: 0.82,
    pH: 6.2,
    oxygenSensitivity: 'high',
    moistureSensitivity: 'moderate',
    lightSensitivity: 'low',
    aromaSensitivity: 'moderate',
    isRespirating: false,
    typicalStorageTempC: 25,
    typicalStorageRH: 65,
    targetShelfLifeDays: 180,
    typicalPackWeightG: 1000,
    fssaiCategory: 'Traditional Indian Sweets',
    isVerified: true,
    citations: ['CFTRI-MYSORE-2019']
  },
  {
    id: 'khakhra',
    name: {
      en: 'Gujarati Khakhra (Crisp Flatbread)',
      hi: 'गुजराती खाखरा',
      mr: 'गुजराती खाकरा'
    },
    category: 'high_fat_snack',
    moistureContent: 3.5,
    fatContent: 14.5,
    waterActivity: 0.25,
    pH: 6.2,
    oxygenSensitivity: 'high',
    moistureSensitivity: 'critical',
    lightSensitivity: 'moderate',
    aromaSensitivity: 'high',
    isRespirating: false,
    typicalStorageTempC: 25,
    typicalStorageRH: 65,
    targetShelfLifeDays: 90,
    typicalPackWeightG: 200,
    fssaiCategory: 'Bakery and Cereal Snacks',
    isVerified: true,
    citations: ['CFTRI-MYSORE-2019']
  },
  {
    id: 'tea_leaves',
    name: {
      en: 'CTC & Orthodox Tea Leaves',
      hi: 'चाय की पत्ती',
      mr: 'चहा पावडर'
    },
    category: 'beverage_dry',
    moistureContent: 6.0,
    fatContent: 0.5,
    waterActivity: 0.35,
    pH: 5.5,
    oxygenSensitivity: 'high',
    moistureSensitivity: 'critical',
    lightSensitivity: 'high',
    aromaSensitivity: 'critical',
    isRespirating: false,
    typicalStorageTempC: 25,
    typicalStorageRH: 60,
    targetShelfLifeDays: 365,
    typicalPackWeightG: 500,
    fssaiCategory: 'Beverages (Dry)',
    isVerified: true,
    citations: ['ROBERTSON-2013']
  },
  {
    id: 'coffee_roasted_beans',
    name: {
      en: 'Roasted Whole Coffee Beans / Ground',
      hi: 'भुनी हुई कॉफी बीन्स / पाउडर',
      mr: 'भाजलेली कॉफी बिया / पूड'
    },
    category: 'beverage_dry',
    moistureContent: 2.5,
    fatContent: 15.0,
    waterActivity: 0.20,
    pH: 5.0,
    oxygenSensitivity: 'critical',
    moistureSensitivity: 'critical',
    lightSensitivity: 'critical',
    aromaSensitivity: 'critical',
    isRespirating: false,
    typicalStorageTempC: 22,
    typicalStorageRH: 55,
    targetShelfLifeDays: 180,
    typicalPackWeightG: 250,
    fssaiCategory: 'Beverages (Dry)',
    isVerified: true,
    citations: ['ROBERTSON-2013']
  },
  {
    id: 'jaggery_gur',
    name: {
      en: 'Solid Sugarcane Jaggery (Gur)',
      hi: 'देसी गुड़',
      mr: 'गूळ'
    },
    category: 'sweet_confectionery',
    moistureContent: 8.5,
    fatContent: 0.1,
    waterActivity: 0.62,
    pH: 5.8,
    oxygenSensitivity: 'low',
    moistureSensitivity: 'critical', // Deliquescence and softening under humidity
    lightSensitivity: 'moderate',
    aromaSensitivity: 'low',
    isRespirating: false,
    typicalStorageTempC: 25,
    typicalStorageRH: 50,
    targetShelfLifeDays: 180,
    typicalPackWeightG: 1000,
    fssaiCategory: 'Sweeteners and Jaggery',
    isVerified: true,
    citations: ['CFTRI-MYSORE-2019']
  },
  {
    id: 'fresh_tomato',
    name: {
      en: 'Fresh Table Tomatoes',
      hi: 'ताजा टमाटर',
      mr: 'ताजे टोमॅटो'
    },
    category: 'fresh_vegetable',
    moistureContent: 94.0,
    fatContent: 0.2,
    waterActivity: 0.99,
    pH: 4.4,
    oxygenSensitivity: 'high',
    moistureSensitivity: 'high',
    lightSensitivity: 'low',
    aromaSensitivity: 'low',
    isRespirating: true,
    respirationRateO2_5C: 8.0, // at 12°C
    respirationRateO2_20C: 28.0,
    respirationQuotient: 1.10,
    recommendedAtmosphere: {
      optimumO2Min: 3.0,
      optimumO2Max: 5.0,
      optimumCO2Min: 2.0,
      optimumCO2Max: 5.0
    },
    chillingInjuryThresholdC: 10.0, // Chilling injury occurs below 10°C!
    typicalStorageTempC: 12,
    typicalStorageRH: 90,
    targetShelfLifeDays: 14,
    typicalPackWeightG: 1000,
    fssaiCategory: 'Fresh Fruits and Vegetables',
    isVerified: true,
    citations: ['KADER-2002']
  },
  {
    id: 'fresh_banana',
    name: {
      en: 'Fresh Cavendish Bananas',
      hi: 'ताजा केला (कैवेंडिश)',
      mr: 'ताजी केळी'
    },
    category: 'fresh_fruit',
    moistureContent: 75.0,
    fatContent: 0.3,
    waterActivity: 0.98,
    pH: 5.0,
    oxygenSensitivity: 'critical',
    moistureSensitivity: 'high',
    lightSensitivity: 'low',
    aromaSensitivity: 'moderate',
    isRespirating: true,
    respirationRateO2_5C: 10.0,
    respirationRateO2_20C: 45.0,
    respirationQuotient: 1.05,
    recommendedAtmosphere: {
      optimumO2Min: 2.0,
      optimumO2Max: 5.0,
      optimumCO2Min: 2.0,
      optimumCO2Max: 5.0
    },
    chillingInjuryThresholdC: 13.0, // Chilling injury occurs below 13°C!
    typicalStorageTempC: 14,
    typicalStorageRH: 90,
    targetShelfLifeDays: 10,
    typicalPackWeightG: 1200,
    fssaiCategory: 'Fresh Fruits and Vegetables',
    isVerified: true,
    citations: ['KADER-2002']
  },
  {
    id: 'fresh_grapes',
    name: {
      en: 'Fresh Table Grapes (Thompson)',
      hi: 'ताजा अंगूर (थॉम्पसन)',
      mr: 'ताजी द्राक्षे (थॉमसन)'
    },
    category: 'fresh_fruit',
    moistureContent: 81.0,
    fatContent: 0.2,
    waterActivity: 0.97,
    pH: 3.8,
    oxygenSensitivity: 'moderate',
    moistureSensitivity: 'critical', // Botrytis mold risk
    lightSensitivity: 'low',
    aromaSensitivity: 'low',
    isRespirating: true,
    respirationRateO2_5C: 4.0,
    respirationRateO2_20C: 15.0,
    respirationQuotient: 1.0,
    recommendedAtmosphere: {
      optimumO2Min: 2.0,
      optimumO2Max: 5.0,
      optimumCO2Min: 1.0,
      optimumCO2Max: 3.0
    },
    chillingInjuryThresholdC: 0.0, // Non-chilling sensitive
    typicalStorageTempC: 2,
    typicalStorageRH: 95,
    targetShelfLifeDays: 28,
    typicalPackWeightG: 500,
    fssaiCategory: 'Fresh Fruits and Vegetables',
    isVerified: true,
    citations: ['KADER-2002']
  },
  {
    id: 'fresh_bell_pepper',
    name: {
      en: 'Fresh Green Bell Pepper (Capsicum)',
      hi: 'ताजा शिमला मिर्च (कैप्सिकम)',
      mr: 'ताजी ढोबळी मिरची'
    },
    category: 'fresh_vegetable',
    moistureContent: 92.5,
    fatContent: 0.2,
    waterActivity: 0.99,
    pH: 5.2,
    oxygenSensitivity: 'high',
    moistureSensitivity: 'high',
    lightSensitivity: 'low',
    aromaSensitivity: 'low',
    isRespirating: true,
    respirationRateO2_5C: 6.0,
    respirationRateO2_20C: 22.0,
    respirationQuotient: 1.05,
    recommendedAtmosphere: {
      optimumO2Min: 3.0,
      optimumO2Max: 5.0,
      optimumCO2Min: 2.0,
      optimumCO2Max: 5.0
    },
    chillingInjuryThresholdC: 7.0, // Chilling injury below 7°C
    typicalStorageTempC: 8,
    typicalStorageRH: 95,
    targetShelfLifeDays: 18,
    typicalPackWeightG: 500,
    fssaiCategory: 'Fresh Fruits and Vegetables',
    isVerified: true,
    citations: ['KADER-2002']
  }
];
