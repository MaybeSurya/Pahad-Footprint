// Pahad Footprint — Verified Uttarakhand Environmental & Van Panchayat Dataset
// Based on Uttarakhand Forest Department (2023-24), Census 2011, Kumaun University (2024),
// ABCF/RCF (2025), SPARC India, IIT BHU EKC Study, and IMD Dehradun.

export interface DistrictVanPanchayatData {
  no: number;
  district: string;
  division: 'Garhwal' | 'Kumaon';
  approxVanPanchayats: number;
  areaKm2: number;
  notableHimalayanTerrain: string;
}

export const UTTARAKHAND_DISTRICTS: DistrictVanPanchayatData[] = [
  {
    no: 1,
    district: 'Dehradun',
    division: 'Garhwal',
    approxVanPanchayats: 210,
    areaKm2: 3088,
    notableHimalayanTerrain: 'Doon Valley, Mussoorie Ridge, Chakrata Foothills',
  },
  {
    no: 2,
    district: 'Haridwar',
    division: 'Garhwal',
    approxVanPanchayats: 45,
    areaKm2: 2360,
    notableHimalayanTerrain: 'Shiwalik Transition, Rajaji Plains Catchment',
  },
  {
    no: 3,
    district: 'Tehri Garhwal',
    division: 'Garhwal',
    approxVanPanchayats: 540,
    areaKm2: 3642,
    notableHimalayanTerrain: 'Bhagirathi Gorge, Chamba — Dhanaulti Oak Ridge',
  },
  {
    no: 4,
    district: 'Uttarkashi',
    division: 'Garhwal',
    approxVanPanchayats: 420,
    areaKm2: 8016,
    notableHimalayanTerrain: 'Gangotri Watershed, Tons Valley, High Glacial Passes',
  },
  {
    no: 5,
    district: 'Chamoli',
    division: 'Garhwal',
    approxVanPanchayats: 650,
    areaKm2: 8030,
    notableHimalayanTerrain: 'Alaknanda Catchment, Nanda Devi Biosphere, Badrinath',
  },
  {
    no: 6,
    district: 'Rudraprayag',
    division: 'Garhwal',
    approxVanPanchayats: 320,
    areaKm2: 1984,
    notableHimalayanTerrain: 'Mandakini River Valley, Kedarnath Alpine Corridor',
  },
  {
    no: 7,
    district: 'Pauri Garhwal',
    division: 'Garhwal',
    approxVanPanchayats: 580,
    areaKm2: 5230,
    notableHimalayanTerrain: 'Lansdowne Pines, Khirsu Oak Ridge, Alaknanda Basin',
  },
  {
    no: 8,
    district: 'Almora',
    division: 'Kumaon',
    approxVanPanchayats: 1100,
    areaKm2: 3139,
    notableHimalayanTerrain: 'Kosi Watershed, Jageshwar Cedars, Binsar Sanctuary',
  },
  {
    no: 9,
    district: 'Bageshwar',
    division: 'Kumaon',
    approxVanPanchayats: 380,
    areaKm2: 2246,
    notableHimalayanTerrain: 'Pindar & Saryu Confluence, Pindari Glacier Gateway',
  },
  {
    no: 10,
    district: 'Champawat',
    division: 'Kumaon',
    approxVanPanchayats: 250,
    areaKm2: 1766,
    notableHimalayanTerrain: 'Lohaghat Mid-Hills, Sharda River Catchment',
  },
  {
    no: 11,
    district: 'Nainital',
    division: 'Kumaon',
    approxVanPanchayats: 510,
    areaKm2: 4251,
    notableHimalayanTerrain: 'Kumaon Lake District, Mukteshwar Ridge, Corbett Edge',
  },
  {
    no: 12,
    district: 'Pithoragarh',
    division: 'Kumaon',
    approxVanPanchayats: 680,
    areaKm2: 7090,
    notableHimalayanTerrain: 'Kali River Border, Johar Valley, Panchachuli Peaks',
  },
  {
    no: 13,
    district: 'Udham Singh Nagar',
    division: 'Kumaon',
    approxVanPanchayats: 30,
    areaKm2: 2542,
    notableHimalayanTerrain: 'Tarai Belt, Wetland Buffer, Foothill Agriculture',
  },
];

export const DISTRICTS_META = {
  totalDistricts: 13,
  officialVanPanchayatsTotal: 12089,
  sampleListSum: 5705,
  totalAreaKm2: 53483,
  primarySource:
    'Uttarakhand Forest Department Annual Report 2023–24, Census of India 2011 & Uttarakhand State Portal',
  citation:
    'Forest Department of Uttarakhand. (2024). Annual Progress & Van Panchayat Inventory Report 2023–2024. Government of Uttarakhand, Dehradun.',
};

export const VAN_PANCHAYAT_RESEARCH = {
  kumaunStudy2024: {
    institution: 'Kumaun University, Nainital',
    year: 2024,
    paper: 'Biomass and Carbon Potential of Van Panchayat Forests',
    journal: 'Current Agriculture Research Journal',
    doi: '10.12944/CARJ.12.2.08',
    doiUrl: 'https://doi.org/10.12944/CARJ.12.2.08',
    biomassRange: '120.45 – 239.68 t/ha',
    carbonStockRange: '56.91 – 113.14 t C/ha',
    meanCarbonStock: '82.37 ± 14.26 t C/ha',
    keyFinding:
      'Highest carbon stock was observed in mid-altitude forests dominated by Banj Oak (Quercus leucotrichophora), highlighting its superior carbon density compared to chir pine monocultures.',
  },
  abcfRcfStudy2025: {
    year: 2025,
    studyName: 'ABCF vs RCF Mountain Forest Structure Evaluation',
    abcf: {
      fullName: 'Altitude-Based Broadleaf Community Forest',
      treeDensity: '760 trees/ha',
      biomass: '350.76 Mg/ha',
      carbonStock: '175.77 Mg C/ha',
    },
    rcf: {
      fullName: 'Regenerated Community Forest',
      treeDensity: '380 trees/ha',
      biomass: '261.81 Mg/ha',
      carbonStock: '131.37 Mg C/ha',
    },
    insight:
      'Mature broadleaf community forests with dense oak canopies hold more than double the carbon stock (175.77 vs 131.37 Mg C/ha) of younger regenerated zones.',
  },
  sparcIndia: {
    organization: 'SPARC India',
    coverage: '750 Van Panchayats across all 13 forest divisions',
    mission:
      'Decentralized community nursery development, indigenous Banj Oak sapling nursing, slope stabilization, and participatory survival auditing.',
  },
};

export const TOURISM_CARBON_DATA = {
  touristsPerSeason: 4000000, // 4 million (40 lakh)
  touristsFormatted: '4 Million (40 Lakh) per season',
  touristsSource: 'Uttarakhand Tourism Development Board (UTDB) Annual Statistics 2023',
  averageTravelDistanceKm: 300,
  averageDistanceNote: '300 km round-trip per traveler across Himalayan circuit corridors',
  emissionFactorKgPerPkm: 0.12, // 120 g CO2 / pkm
  emissionFactorLabel: '0.12 kg CO₂ / passenger-km (Shared Mountain Jeeps / Sumo / Bolero)',
  seasonalCalculation: {
    formula: '4,000,000 tourists × 300 km × 0.12 kg CO₂/km',
    resultKg: 144000000,
    resultTonnes: 144000,
    originalDocumentCites: 12000,
    sourceCitation: 'IIT BHU Environmental Kuznets Curve (EKC) Mountain Tourism Study',
    reconciliationNote:
      'Notice on Data Reconciliation: The original reference document mentions 12,000 tonnes of CO₂ per season. However, standard arithmetic using the provided inputs (4,000,000 visitors × 300 km × 0.12 kg CO₂/km) produces 144,000,000 kg (144,000 tonnes). Both figures are shown transparently with full source citations.',
  },
};

export const CLIMATE_DISASTER_DATA = {
  sourceAuthority: 'IMD Dehradun & Uttarakhand State Disaster Management Authority (USDMA)',
  temperatureRise: '+1.5°C',
  temperatureContext:
    'Regional temperature increase recorded in Uttarakhand hill stations and valleys over long-term meteorological baselines (IMD Dehradun).',
  disasters: [
    {
      title: 'Kedarnath Tragedy (2013)',
      year: 2013,
      impact: 'Over 6,000 human fatalities',
      mechanism:
        'Catastrophic multi-day cloudbursts, intense precipitation, and the breach of the moraine-dammed Chorabari Glacial Lake (GLOF), triggering catastrophic flash floods along the Mandakini valley.',
    },
    {
      title: 'Joshimath Land Subsidence (2023)',
      year: 2023,
      impact: 'More than 700 houses developed structural fissures',
      mechanism:
        'Severe geotechnical slope displacement, high pore-water pressure, overburden of construction, and groundwater seepage in moraine terrain leading to subsidence.',
    },
    {
      title: 'Uttarakhand Forest Fires (2024)',
      year: 2024,
      impact: 'More than 1,000 fire incidents; over 2,000 hectares affected',
      mechanism:
        'Record dry spells, chir pine needle leaf litter accumulation, high summer winds, and reduced winter precipitation causing widespread fires across mid-altitude ridges.',
    },
  ],
  scientificDisclaimer:
    'Scientific Context & Correlation Note: These documented disaster figures represent critical geomorphological and ecological vulnerabilities of the Central Himalayas. However, the occurrence of any single disaster does not, by itself, establish a direct causal link to tourist vehicular emissions or short-term climate change. Complex interactions between regional tectonics, slope geology, erratic precipitation, and terrain alteration govern Himalayan disasters. Rigorous, independent peer-reviewed attribution is required before drawing direct causal conclusions.',
};
