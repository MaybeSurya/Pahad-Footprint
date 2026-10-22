export type TransportMode = 'suv' | 'sedan' | 'ev' | 'bus';
export type TerrainZone = 'foothills' | 'mid_hills' | 'high_altitude';
export type AccommodationType = 'luxury' | 'hotel' | 'homestay' | 'camp';

export interface CalculationInput {
  distanceKm: number;
  terrainZone: TerrainZone;
  transportMode: TransportMode;
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

// Vehicle emission factors (g CO2e per vehicle-km)
export const VEHICLE_FACTORS: Record<string, number> = {
  suv: 180,
  sedan: 140,
  ev: 45,
};

// Shared transit factor (g CO2e per passenger-km)
export const TRANSIT_FACTORS: Record<string, number> = {
  bus: 30,
};

// Terrain multipliers
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

export function calculateCarbonFootprint(input: CalculationInput): CalculationOutput {
  const distance = Math.max(1, Number(input.distanceKm) || 1);
  const passengers = Math.max(1, Number(input.passengers) || 1);
  const nights = Math.max(1, Number(input.nights) || 1);
  const terrainMultiplier = TERRAIN_MULTIPLIERS[input.terrainZone] ?? 1.25;

  // 1. Transport Calculation
  let transportKgPP = 0;
  let baselineTransportKgPP = 0;

  if (input.transportMode === 'bus') {
    const factor = TRANSIT_FACTORS.bus; // 30 g/pkm
    transportKgPP = (distance * factor * terrainMultiplier) / 1000;
    baselineTransportKgPP = (distance * factor) / 1000;
  } else {
    const factor = VEHICLE_FACTORS[input.transportMode] ?? VEHICLE_FACTORS.suv;
    transportKgPP = (distance * factor * terrainMultiplier) / (1000 * passengers);
    baselineTransportKgPP = (distance * factor) / (1000 * passengers);
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
  const swapTransportPP = (distance * TRANSIT_FACTORS.bus * terrainMultiplier) / 1000;
  const swapStayPP = nights * ACCOMMODATION_FACTORS.homestay;
  const swapTotalPP = Math.max(0.5, swapTransportPP + swapStayPP);
  const swapTotalTrip = swapTotalPP * passengers;
  const savingsPP = Math.max(0, netTotalPP - swapTotalPP);
  const savingsTotal = savingsPP * passengers;
  const pctReduction = netTotalPP > 0 ? Math.round((savingsPP / netTotalPP) * 100) : 0;

  // 7. Suggested Saplings (1 sapling per ~20kg net footprint, minimum 2)
  const saplingsPP = Math.max(2, Math.round(netTotalPP / 20));
  const saplingsTotal = saplingsPP * passengers;

  return {
    perPersonCo2e: Number(netTotalPP.toFixed(1)),
    totalCo2e: Number(netTotalTrip.toFixed(1)),
    breakdown: {
      transportPerPerson: Number(transportKgPP.toFixed(1)),
      accommodationPerPerson: Number(stayKgPP.toFixed(1)),
      habitDeductionsPerPerson: Number(habitCreditsPP.toFixed(1)),
      transportPercent: transportPct,
      accommodationPercent: stayPct,
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
      greenCessExemptionEligible: input.transportMode !== 'bus',
      greenCessAmountInr: 80,
    },
    suggestedSaplings: {
      perPerson: saplingsPP,
      total: saplingsTotal,
    },
  };
}
