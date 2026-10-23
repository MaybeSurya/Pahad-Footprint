export type PrivateVehicleType =
  | 'suv'
  | 'sedan'
  | 'hatchback'
  | 'coupe'
  | 'motorcycle'
  | 'scooty'
  | 'bicycle';
export type FuelType = 'petrol' | 'diesel' | 'cng' | 'lpg' | 'hybrid' | 'ev' | 'pedal';
export type TransitMode = 'bus' | 'train' | 'helicopter' | 'flight';
export type TransportCategory = 'private' | 'two_wheeler' | 'transit';

export type TransportMode =
  | 'suv'
  | 'sedan'
  | 'hatchback'
  | 'coupe'
  | 'motorcycle'
  | 'scooty'
  | 'bicycle'
  | 'ev'
  | 'bus'
  | 'train'
  | 'helicopter'
  | 'flight';

export type TerrainZone = 'foothills' | 'mid_hills' | 'high_altitude';
export type AccommodationType = 'luxury' | 'hotel' | 'homestay' | 'camp';

export interface CalculationInput {
  distanceKm: number;
  terrainZone: TerrainZone;
  transportCategory?: TransportCategory;
  vehicleType?: PrivateVehicleType;
  fuelType?: FuelType;
  transitMode?: TransitMode;
  registrationYear?: number;
  transportMode: TransportMode | string;
  passengers: number;
  nights: number;
  accommodationType: AccommodationType;
  habitWater?: boolean;
  habitFood?: boolean;
}

export interface CalculationOutput {
  perPersonCo2e: number;
  totalCo2e: number;
  breakdown: {
    transportPerPerson: number;
    accommodationPerPerson: number;
    habitDeductionsPerPerson: number;
    transportPercent: number;
    accommodationPercent: number;
    transportRateLabel: string;
    vehicleAgeMultiplier?: number;
    registrationYear?: number;
  };
  terrainAdjustment: {
    multiplier: number;
    uphillDeltaPerPerson: number;
    uphillDeltaTotal: number;
  };
  impactSeverity: 'low' | 'moderate' | 'high';
  ecoSwap: {
    recommendedTransport: string;
    recommendedStay: string;
    newPerPersonCo2e: number;
    newTotalCo2e: number;
    savingsPerPerson: number;
    savingsTotal: number;
    percentageReduction: number;
    greenCessExemptionEligible: boolean;
    greenCessAmountInr: number;
  };
  suggestedSaplings: {
    perPerson: number;
    total: number;
  };
}

// Vehicle emission factors matrix (g CO2e per vehicle-km / vkm) based on ARAI/CEA baseline
export const PRIVATE_VEHICLE_MATRIX: Record<PrivateVehicleType, Record<FuelType, number>> = {
  suv: {
    diesel: 195,
    petrol: 185,
    cng: 135,
    lpg: 145,
    hybrid: 110,
    ev: 50,
    pedal: 0,
  },
  sedan: {
    diesel: 155,
    petrol: 140,
    cng: 110,
    lpg: 120,
    hybrid: 90,
    ev: 42,
    pedal: 0,
  },
  hatchback: {
    diesel: 130,
    petrol: 120,
    cng: 95,
    lpg: 105,
    hybrid: 78,
    ev: 36,
    pedal: 0,
  },
  coupe: {
    diesel: 165,
    petrol: 155,
    cng: 125,
    lpg: 135,
    hybrid: 100,
    ev: 48,
    pedal: 0,
  },
  motorcycle: {
    petrol: 55,
    hybrid: 38,
    ev: 18,
    diesel: 55,
    cng: 55,
    lpg: 55,
    pedal: 0,
  },
  scooty: {
    petrol: 50,
    hybrid: 35,
    ev: 16,
    diesel: 50,
    cng: 50,
    lpg: 50,
    pedal: 0,
  },
  bicycle: {
    pedal: 0,
    ev: 8,
    petrol: 0,
    hybrid: 0,
    diesel: 0,
    cng: 0,
    lpg: 0,
  },
};

// Public transit & aviation emission factors (g CO2e per passenger-km / pkm)
export const TRANSIT_MODE_FACTORS: Record<TransitMode, number> = {
  train: 18, // Electrified Indian Railways corridor
  bus: 30, // Shared State/UTC Bus
  flight: 180, // Regional Commercial Aviation (Jolly Grant / Pantnagar)
  helicopter: 450, // Himalayan Alpine Heli-Shuttle (Kedarnath / Char Dham)
};

// Legacy fallback vehicle factors
export const VEHICLE_FACTORS: Record<string, number> = {
  suv: 180,
  sedan: 140,
  ev: 45,
};

// Terrain multipliers (IPCC mountain grade fuel penalty)
export const TERRAIN_MULTIPLIERS: Record<TerrainZone, number> = {
  foothills: 1.0,
  mid_hills: 1.25,
  high_altitude: 1.4,
};

// Accommodation emission intensities (kg CO2e per guest-night)
export const ACCOMMODATION_FACTORS: Record<AccommodationType, number> = {
  luxury: 24.0,
  hotel: 9.0,
  homestay: 6.0,
  camp: 3.5,
};

// Eco-habit deductions (kg CO2e per person)
export const ECO_HABIT_CREDITS = {
  water: 2.0,
  food: 3.0,
};

// Calculate CO2 increase multiplier based on vehicle registration year
// Older vehicles have higher wear and tear and older emission standards, releasing more CO2 per km
export function getVehicleAgeMultiplier(
  year?: number,
  fuelType?: string,
  isTransit?: boolean,
  vehicleType?: string
): number {
  if (isTransit || vehicleType === 'bicycle' || fuelType === 'pedal' || !year) {
    return 1.0;
  }
  const currentYear = 2026;
  const age = Math.max(0, currentYear - year);

  // EVs degrade mildly over years due to battery cell aging
  if (fuelType === 'ev') {
    return Number((1 + Math.min(0.12, age * 0.012)).toFixed(3));
  }

  // Brand new (< 2 years old): 1.00x baseline
  // Older vehicles release more CO2: each additional year adds ~2.5% emission factor (capped at +50% for 20+ years old)
  if (age <= 2) return 1.0;
  const basePenalty = (age - 2) * 0.025;
  const multiplier = Math.min(1.50, 1.0 + basePenalty);
  return Number(multiplier.toFixed(3));
}

export function calculateCarbonFootprint(input: CalculationInput): CalculationOutput {
  const distance = Math.max(1, Number(input.distanceKm) || 1);
  const passengers = Math.max(1, Number(input.passengers) || 1);
  const nights = Math.max(1, Number(input.nights) || 1);
  const terrainMultiplier = TERRAIN_MULTIPLIERS[input.terrainZone] ?? 1.25;

  let transportKgPP = 0;
  let baselineTransportKgPP = 0;
  let rateLabel = '';

  const isTransit =
    input.transportCategory === 'transit' ||
    ['bus', 'train', 'helicopter', 'flight'].includes(String(input.transportMode).toLowerCase());

  let vehicleAgeMultiplier = 1.0;

  if (isTransit) {
    const modeKey = (input.transitMode || input.transportMode || 'bus').toLowerCase() as TransitMode;
    const factor = TRANSIT_MODE_FACTORS[modeKey] ?? TRANSIT_MODE_FACTORS.bus;
    rateLabel = `${factor} g CO₂e/pkm`;

    // High altitude multiplier applies to bus and helicopter (hovering at >3000m burns significant fuel)
    const activeMultiplier = modeKey === 'train' ? 1.0 : terrainMultiplier;
    transportKgPP = (distance * factor * activeMultiplier) / 1000;
    baselineTransportKgPP = (distance * factor) / 1000;
  } else {
    // Private vehicle mode
    const vType = (input.vehicleType || (input.transportMode === 'sedan' ? 'sedan' : 'suv')).toLowerCase() as PrivateVehicleType;
    const fType = (input.fuelType || (input.transportMode === 'ev' ? 'ev' : 'diesel')).toLowerCase() as FuelType;

    const baseVkmFactor =
      PRIVATE_VEHICLE_MATRIX[vType]?.[fType] ??
      (input.transportMode === 'sedan' ? 140 : input.transportMode === 'ev' ? 45 : 180);

    vehicleAgeMultiplier = getVehicleAgeMultiplier(input.registrationYear, fType, false, vType);
    const adjustedVkmFactor = baseVkmFactor * vehicleAgeMultiplier;

    const agePct = Math.round((vehicleAgeMultiplier - 1) * 100);
    rateLabel =
      vType === 'bicycle' && fType === 'pedal'
        ? '0 g CO₂e/km (PEDAL BICYCLE)'
        : agePct > 0
        ? `${adjustedVkmFactor.toFixed(1)} g CO₂e/vkm (${fType.toUpperCase()} ${vType.toUpperCase()} · ${input.registrationYear} [+${agePct}% older vehicle])`
        : `${baseVkmFactor} g CO₂e/vkm (${fType.toUpperCase()} ${vType.toUpperCase()})`;

    transportKgPP = (distance * adjustedVkmFactor * terrainMultiplier) / (1000 * passengers);
    baselineTransportKgPP = (distance * adjustedVkmFactor) / (1000 * passengers);
  }

  const uphillDeltaPP = Math.max(0, transportKgPP - baselineTransportKgPP);
  const uphillDeltaTotal = uphillDeltaPP * passengers;

  // 2. Accommodation Calculation
  const stayFactor = ACCOMMODATION_FACTORS[input.accommodationType] ?? ACCOMMODATION_FACTORS.hotel;
  const stayKgPP = nights * stayFactor;

  // 3. Eco-Habits
  let habitCreditsPP = 0;
  if (input.habitWater) habitCreditsPP += ECO_HABIT_CREDITS.water;
  if (input.habitFood) habitCreditsPP += ECO_HABIT_CREDITS.food;

  const grossTotalPP = transportKgPP + stayKgPP;
  const netTotalPP = Math.max(0.5, grossTotalPP - habitCreditsPP);
  const netTotalTrip = netTotalPP * passengers;

  // 4. Distribution percentages
  const transportPct = grossTotalPP > 0 ? Math.round((transportKgPP / grossTotalPP) * 100) : 50;
  const stayPct = 100 - transportPct;

  // 5. Impact Severity
  let impactSeverity: 'low' | 'moderate' | 'high' = 'moderate';
  if (netTotalPP < 30) {
    impactSeverity = 'low';
  } else if (netTotalPP <= 75) {
    impactSeverity = 'moderate';
  } else {
    impactSeverity = 'high';
  }

  // 6. Eco-Swap alternative: Shared UTC Bus + Pahadi Homestay
  const swapTransportPP = (distance * TRANSIT_MODE_FACTORS.bus * terrainMultiplier) / 1000;
  const swapStayPP = nights * ACCOMMODATION_FACTORS.homestay;
  const swapTotalPP = Math.max(0.5, swapTransportPP + swapStayPP);
  const swapTotalTrip = swapTotalPP * passengers;
  const savingsPP = Math.max(0, netTotalPP - swapTotalPP);
  const savingsTotal = savingsPP * passengers;
  const pctReduction = netTotalPP > 0 ? Math.round((savingsPP / netTotalPP) * 100) : 0;

  // 7. Suggested Saplings (1 sapling per ~20kg net footprint, minimum 2)
  const saplingsPP = Math.max(2, Math.round(netTotalPP / 20));
  const saplingsTotal = saplingsPP * passengers;

  const isEligibleForGreenCess = !['bus', 'train'].includes(String(input.transportMode).toLowerCase());

  return {
    perPersonCo2e: Number(netTotalPP.toFixed(1)),
    totalCo2e: Number(netTotalTrip.toFixed(1)),
    breakdown: {
      transportPerPerson: Number(transportKgPP.toFixed(1)),
      accommodationPerPerson: Number(stayKgPP.toFixed(1)),
      habitDeductionsPerPerson: Number(habitCreditsPP.toFixed(1)),
      transportPercent: transportPct,
      accommodationPercent: stayPct,
      transportRateLabel: rateLabel,
      vehicleAgeMultiplier,
      registrationYear: input.registrationYear,
    },
    terrainAdjustment: {
      multiplier: terrainMultiplier,
      uphillDeltaPerPerson: Number(uphillDeltaPP.toFixed(1)),
      uphillDeltaTotal: Number(uphillDeltaTotal.toFixed(1)),
    },
    impactSeverity,
    ecoSwap: {
      recommendedTransport: 'Shared UTC Bus (30 g CO₂e/pkm)',
      recommendedStay: 'Pahadi Homestay (6.0 kg CO₂e/night)',
      newPerPersonCo2e: Number(swapTotalPP.toFixed(1)),
      newTotalCo2e: Number(swapTotalTrip.toFixed(1)),
      savingsPerPerson: Number(savingsPP.toFixed(1)),
      savingsTotal: Number(savingsTotal.toFixed(1)),
      percentageReduction: pctReduction,
      greenCessExemptionEligible: isEligibleForGreenCess,
      greenCessAmountInr: 80,
    },
    suggestedSaplings: {
      perPerson: saplingsPP,
      total: saplingsTotal,
    },
  };
}
