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

export interface CircuitPressure {
  circuit: string;
  tonnesCo2e: number;
  percentage: number;
  color: string;
}

export interface TransportModeShare {
  mode: string;
  percentage: number;
  tripCount: number;
  emissionRate: string;
  status: string;
}

export interface AdminMetrics {
  reportingWindow: string;
  datasetVersion: string;
  lastReconciledAt: string;
  totalTripsLogged: number;
  totalCarbonTrackedTonnes: number;
  averageFootprintKgPerTrip: number;
  averageOccupancyPax: number;
  restorationPledges: {
    totalSaplings: number;
    verifiedSaplings: number;
    pendingSaplings: number;
    activeVanPanchayats: number;
  };
  circuitsBreakdown: CircuitPressure[];
  transportModeShare: TransportModeShare[];
  auditorInsights: string[];
}

export interface AuditTripLog {
  id: string;
  circuit: string;
  distanceKm: number;
  mode: string;
  passengers: number;
  nights: number;
  tripFootprintKg: number;
  perPersonKg: number;
  severity: 'low' | 'moderate' | 'high';
  status: 'verified' | 'pledged' | 'calculated';
  expansion: {
    terrain: string;
    stay: string;
    engine: string;
    checkpost: string;
    date: string;
  };
}

export interface UserSession {
  id: string;
  email: string;
  role: 'tourist' | 'admin';
  token: string;
}
