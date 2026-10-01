import { ScientificSource } from '../types/index.ts';

export const SCIENTIFIC_SOURCES: ScientificSource[] = [
  {
    id: 'ASTM-D3985',
    title: 'Standard Test Method for Oxygen Gas Transmission Rate Through Plastic Film and Sheeting Using a Coulometric Sensor',
    publisherOrOrg: 'ASTM International',
    year: 2017,
    doiOrUrl: 'https://doi.org/10.1520/D3985-17',
    sourceType: 'standard',
    verificationStatus: 'verified',
    summary: 'Standard test method measuring steady-state OTR at 23°C and 0% relative humidity using carrier gas coulometry.'
  },
  {
    id: 'ASTM-F1249',
    title: 'Standard Test Method for Water Vapor Transmission Rate Through Plastic Film and Sheeting Using a Modulated Infrared Sensor',
    publisherOrOrg: 'ASTM International',
    year: 2020,
    doiOrUrl: 'https://doi.org/10.1520/F1249-20',
    sourceType: 'standard',
    verificationStatus: 'verified',
    summary: 'Standard test method measuring steady-state WVTR at 38°C and 90% RH using modulated infrared detection.'
  },
  {
    id: 'ASTM-F88',
    title: 'Standard Test Method for Seal Strength of Flexible Barrier Materials',
    publisherOrOrg: 'ASTM International',
    year: 2021,
    doiOrUrl: 'https://doi.org/10.1520/F0088_F0088M-21',
    sourceType: 'standard',
    verificationStatus: 'verified',
    summary: 'Quantifies maximum force per unit width required to peel or separate seal interfaces of flexible pouches.'
  },
  {
    id: 'FSSAI-PKG-2018',
    title: 'Food Safety and Standards (Packaging) Regulations, 2018',
    publisherOrOrg: 'Food Safety and Standards Authority of India (FSSAI)',
    year: 2018,
    doiOrUrl: 'https://www.fssai.gov.in/upload/uploadfiles/files/Packaging_Regulations_2018.pdf',
    sourceType: 'regulation',
    verificationStatus: 'verified',
    summary: 'Mandates migration limits, overall migration testing under IS 9845, heavy metal restrictions, and virgin polymer requirements for direct food contact in India.'
  },
  {
    id: 'BIS-IS-9845',
    title: 'IS 9845: Determination of Overall Migration of Constituents of Plastics Materials and Articles Intended to Come into Contact with Foodstuffs',
    publisherOrOrg: 'Bureau of Indian Standards (BIS)',
    year: 1998,
    doiOrUrl: 'https://standardsbis.bsbedge.com',
    sourceType: 'standard',
    verificationStatus: 'verified',
    summary: 'Indian standard method for determining overall migration limit (60 mg/kg or 10 mg/dm²) across simulant food types.'
  },
  {
    id: 'PWM-RULES-2022',
    title: 'Plastic Waste Management (Amendment) Rules, 2022 — Guidelines on Extended Producer Responsibility (EPR)',
    publisherOrOrg: 'Ministry of Environment, Forest and Climate Change (MoEFCC), Govt. of India',
    year: 2022,
    doiOrUrl: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    sourceType: 'regulation',
    verificationStatus: 'verified',
    summary: 'Defines Category I (Rigid), Category II (Flexible single/multi-layer mono-material), Category III (Multi-layered plastic with other materials), and Category IV (Compostable plastics) with recycling targets.'
  },
  {
    id: 'KADER-2002',
    title: 'Postharvest Technology of Horticultural Crops (3rd Edition)',
    publisherOrOrg: 'University of California Agriculture and Natural Resources',
    year: 2002,
    doiOrUrl: 'https://doi.org/10.3733/ucanr.3311',
    sourceType: 'scientific_paper',
    verificationStatus: 'verified',
    summary: 'Comprehensive respiration rates, chilling injury limits, and modified atmosphere recommendations for fresh tropical and temperate fruits.'
  },
  {
    id: 'ROBERTSON-2013',
    title: 'Food Packaging: Principles and Practice (3rd Edition)',
    publisherOrOrg: 'CRC Press / Taylor & Francis',
    year: 2013,
    doiOrUrl: 'https://doi.org/10.1201/b13083',
    sourceType: 'scientific_paper',
    verificationStatus: 'verified',
    summary: 'Rigorous biophysical formulation of moisture uptake isotherm kinetics, lipid autoxidation dynamics, and gas permeability modeling.'
  },
  {
    id: 'CFTRI-MYSORE-2019',
    title: 'Handbook of Food Packaging and Preservation Protocols for Indian Traditional Foods',
    publisherOrOrg: 'CSIR-CFTRI Mysore',
    year: 2019,
    doiOrUrl: 'https://cftri.res.in/publications',
    sourceType: 'government_report',
    verificationStatus: 'verified',
    summary: 'Empirical packaging storage data for traditional Indian savories (bhujia, sev), spices, pulses, jaggery, and sweets under high tropical ambient humidity.'
  }
];
