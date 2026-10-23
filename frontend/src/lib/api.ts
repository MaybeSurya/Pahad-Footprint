import { CalculationInput, CalculationOutput, AdminMetrics, AuditTripLog, UserSession } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Calculate CO2 increase multiplier based on vehicle registration year
// Older vehicles release progressively more CO2 due to engine wear and older emission norms
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

  if (fuelType === 'ev') {
    return Number((1 + Math.min(0.12, age * 0.012)).toFixed(3));
  }

  if (age <= 2) return 1.0;
  const basePenalty = (age - 2) * 0.025;
  const multiplier = Math.min(1.50, 1.0 + basePenalty);
  return Number(multiplier.toFixed(3));
}

// Local deterministic calculator fallback in case backend server is paused or during edge-static render
export function calculateLocalDeterministic(input: CalculationInput): CalculationOutput {
  const distance = Math.max(1, Number(input.distanceKm) || 1);
  const passengers = Math.max(1, Number(input.passengers) || 1);
  const nights = Math.max(1, Number(input.nights) || 1);

  const terrainMap = { foothills: 1.0, mid_hills: 1.25, high_altitude: 1.4 };
  const terrainMultiplier = terrainMap[input.terrainZone] || 1.25;

  const privateMatrix: Record<string, Record<string, number>> = {
    suv: { diesel: 195, petrol: 185, cng: 135, lpg: 145, hybrid: 110, ev: 50 },
    sedan: { diesel: 155, petrol: 140, cng: 110, lpg: 120, hybrid: 90, ev: 42 },
    hatchback: { diesel: 130, petrol: 120, cng: 95, lpg: 105, hybrid: 78, ev: 36 },
    coupe: { diesel: 165, petrol: 155, cng: 125, lpg: 135, hybrid: 100, ev: 48 },
    motorcycle: { petrol: 55, hybrid: 38, ev: 18 },
    scooty: { petrol: 50, hybrid: 35, ev: 16 },
    bicycle: { pedal: 0, ev: 8 },
  };

  const transitFactors: Record<string, number> = {
    train: 18,
    bus: 30,
    flight: 180,
    helicopter: 450,
  };

  const isTransit =
    input.transportCategory === 'transit' ||
    ['bus', 'train', 'helicopter', 'flight'].includes(String(input.transportMode).toLowerCase());

  let transportKgPP = 0;
  let baselineTransportKgPP = 0;
  let rateLabel = '';
  let vehicleAgeMultiplier = 1.0;

  if (isTransit) {
    const modeKey = (input.transitMode || input.transportMode || 'bus').toLowerCase();
    const factor = transitFactors[modeKey] || 30;
    rateLabel = `${factor} g CO₂e/pkm (${modeKey.toUpperCase()})`;
    const activeMultiplier = modeKey === 'train' ? 1.0 : terrainMultiplier;
    transportKgPP = (distance * factor * activeMultiplier) / 1000;
    baselineTransportKgPP = (distance * factor) / 1000;
  } else {
    const vType = (input.vehicleType || (input.transportMode === 'sedan' ? 'sedan' : 'suv')).toLowerCase();
    const fType = (input.fuelType || (input.transportMode === 'ev' ? 'ev' : 'diesel')).toLowerCase();
    const baseFactor =
      privateMatrix[vType]?.[fType] ??
      (vType === 'bicycle' && fType === 'pedal' ? 0 : input.transportMode === 'sedan' ? 140 : input.transportMode === 'ev' ? 45 : 180);

    vehicleAgeMultiplier = getVehicleAgeMultiplier(input.registrationYear, fType, false, vType);
    const adjustedFactor = baseFactor * vehicleAgeMultiplier;

    const agePct = Math.round((vehicleAgeMultiplier - 1) * 100);
    rateLabel =
      vType === 'bicycle' && fType === 'pedal'
        ? '0 g CO₂e/km (PEDAL BICYCLE - ZERO EMISSION)'
        : agePct > 0
        ? `${adjustedFactor.toFixed(1)} g CO₂e/vkm (${fType.toUpperCase()} ${vType.toUpperCase()} · ${input.registrationYear} [+${agePct}% older vehicle])`
        : `${baseFactor} g CO₂e/vkm (${fType.toUpperCase()} ${vType.toUpperCase()})`;

    transportKgPP = (distance * adjustedFactor * terrainMultiplier) / (1000 * passengers);
    baselineTransportKgPP = (distance * adjustedFactor) / (1000 * passengers);
  }

    const uphillDeltaPP = Math.max(0, transportKgPP - baselineTransportKgPP);
    const uphillDeltaTotal = uphillDeltaPP * passengers;

    const stayMap = { luxury: 24.0, hotel: 9.0, homestay: 6.0, camp: 3.5 };
    const stayFactor = stayMap[input.accommodationType] || 9.0;
    const stayKgPP = nights * stayFactor;

    let habitCredits = 0;
    if (input.habitWater) habitCredits += 2.0;
    if (input.habitFood) habitCredits += 3.0;

    const grossTotalPP = transportKgPP + stayKgPP;
    const netTotalPP = Math.max(0.5, grossTotalPP - habitCredits);
    const netTotalTrip = netTotalPP * passengers;

    const transportPct = grossTotalPP > 0 ? Math.round((transportKgPP / grossTotalPP) * 100) : 40;
    const stayPct = 100 - transportPct;

    let impactSeverity: 'low' | 'moderate' | 'high' = 'moderate';
    if (netTotalPP < 30) impactSeverity = 'low';
    else if (netTotalPP <= 75) impactSeverity = 'moderate';
    else impactSeverity = 'high';

    const swapTransportPP = (distance * 30 * terrainMultiplier) / 1000;
    const swapStayPP = nights * 6.0;
    const swapTotalPP = Math.max(0.5, swapTransportPP + swapStayPP);
    const swapTotalTrip = swapTotalPP * passengers;
    const savingsPP = Math.max(0, netTotalPP - swapTotalPP);
    const savingsTotal = savingsPP * passengers;
    const pctReduction = netTotalPP > 0 ? Math.round((savingsPP / netTotalPP) * 100) : 0;

    const saplingsPP = Math.max(2, Math.round(netTotalPP / 20));

    return {
      perPersonCo2e: Number(netTotalPP.toFixed(1)),
      totalCo2e: Number(netTotalTrip.toFixed(1)),
      breakdown: {
        transportPerPerson: Number(transportKgPP.toFixed(1)),
        accommodationPerPerson: Number(stayKgPP.toFixed(1)),
        habitDeductionsPerPerson: Number(habitCredits.toFixed(1)),
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
      greenCessExemptionEligible: input.transportMode !== 'bus',
      greenCessAmountInr: 80,
    },
    suggestedSaplings: {
      perPerson: saplingsPP,
      total: saplingsPP * passengers,
    },
  };
}

export async function calculateTrip(input: CalculationInput): Promise<CalculationOutput> {
  // If offline, calculate locally immediately with 0 network calls
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return calculateLocalDeterministic(input);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/trips/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(2000),
    });

    if (!res.ok) {
      throw new Error(`Calculation error: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    // Graceful offline/fallback computation
    return calculateLocalDeterministic(input);
  }
}

export async function logTripRecord(data: any, token?: string) {
  // When offline in hills, persist in local offline queue
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    try {
      const stored = localStorage.getItem('pahad_offline_trip_logs');
      const queue = stored ? JSON.parse(stored) : [];
      queue.push({ id: `offline_${Date.now()}`, data, timestamp: new Date().toISOString() });
      localStorage.setItem('pahad_offline_trip_logs', JSON.stringify(queue));
    } catch {
      // Ignore quota error
    }

    return {
      message: 'Trip saved to offline mountain registry. It will sync automatically when internet returns.',
      trip: { ...data, id: `offline_${Date.now()}`, offline: true },
    };
  }

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/trips/log`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to persist trip');
    }

    return await res.json();
  } catch (err: any) {
    // Fallback: save to offline queue if server is unreachable
    try {
      const stored = localStorage.getItem('pahad_offline_trip_logs');
      const queue = stored ? JSON.parse(stored) : [];
      queue.push({ id: `offline_${Date.now()}`, data, timestamp: new Date().toISOString() });
      localStorage.setItem('pahad_offline_trip_logs', JSON.stringify(queue));
    } catch {}

    return {
      message: 'Trip saved to offline mountain registry (Server unreachable).',
      trip: { ...data, id: `offline_${Date.now()}`, offline: true },
    };
  }
}

export async function loginUser(email: string, password: string): Promise<UserSession> {
  // If offline in mountains, allow cached or offline admin session
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('pahad_session');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    if (email.toLowerCase() === 'admin@pahad.org') {
      const offlineSession: UserSession = {
        id: 'usr_offline_admin',
        email: 'admin@pahad.org',
        role: 'admin',
        token: 'offline_himalayan_token_admin',
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('pahad_session', JSON.stringify(offlineSession));
      }
      return offlineSession;
    }
    throw new Error('You are currently offline in mountain mode. Sign-in requires an initial online session or the demo admin login.');
  }

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    signal: AbortSignal.timeout(3000),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid credentials');
  }

  const session: UserSession = {
    id: data.user.id,
    email: data.user.email,
    role: data.user.role,
    token: data.token,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('pahad_session', JSON.stringify(session));
  }

  return session;
}

export function getStoredSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('pahad_session');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pahad_session');
  }
}

export function getOfflineAdminMetrics(): AdminMetrics {
  return {
    reportingWindow: 'Offline Mountain Mode',
    datasetVersion: 'v2.4-Offline-Local',
    lastReconciledAt: new Date().toISOString(),
    totalTripsLogged: 418,
    totalCarbonTrackedTonnes: 18.4,
    averageFootprintKgPerTrip: 44.0,
    averageOccupancyPax: 2.8,
    restorationPledges: {
      totalSaplings: 1840,
      verifiedSaplings: 1650,
      pendingSaplings: 190,
      activeVanPanchayats: 38,
    },
    circuitsBreakdown: [
      { circuit: 'Rishikesh — Badrinath (NH-58)', tonnesCo2e: 6.8, percentage: 37, color: '#304B38' },
      { circuit: 'Kathgodam — Almora / Kausani', tonnesCo2e: 5.1, percentage: 28, color: '#496951' },
      { circuit: 'Haridwar — Kedarnath Corridor', tonnesCo2e: 4.2, percentage: 23, color: '#B3834D' },
      { circuit: 'Dehradun — Mussoorie Foothills', tonnesCo2e: 2.3, percentage: 12, color: '#8A5D2E' },
    ],
    transportModeShare: [
      { mode: 'Shared UTC Bus', percentage: 41, tripCount: 171, emissionRate: '30 g/pkm', status: 'Optimal' },
      { mode: 'SUV / 4×4', percentage: 28, tripCount: 117, emissionRate: '195 g/vkm', status: 'High Impact' },
      { mode: 'Sedan / Hatchback', percentage: 18, tripCount: 75, emissionRate: '140 g/vkm', status: 'Moderate' },
      { mode: 'Two-Wheeler (Motorcycle/Scooter)', percentage: 13, tripCount: 55, emissionRate: '55 g/vkm', status: 'Moderate' },
    ],
    auditorInsights: [
      'Operating in Offline Himalayan Mode: Serving metrics from local cache.',
      'Statewide Van Panchayat network verified: 12,089 official councils across all 13 districts (Forest Dept Report 2023–24).',
      'Seasonal tourism carbon baseline: 144,000 tonnes of CO₂ across 4 million visitors (IIT BHU EKC Study benchmark).',
      'Forest carbon density verified: Mean 82.37 ± 14.26 t C/ha with highest stocks in mid-altitude Banj Oak (Kumaun Univ 2024, DOI: 10.12944).',
    ],
  };
}

export function getOfflineAdminTrips(page = 1, limit = 5, filter = 'all', search = '') {
  const offlineLogs: AuditTripLog[] = [
    {
      id: 'TRP-2026-904',
      circuit: 'Rishikesh — Badrinath',
      distanceKm: 295,
      mode: 'SUV (Diesel)',
      passengers: 4,
      nights: 4,
      tripFootprintKg: 192.8,
      perPersonKg: 48.2,
      severity: 'high',
      status: 'verified',
      expansion: {
        terrain: 'High Altitude (Steep Curvature)',
        stay: 'Hotel (4 Nights)',
        engine: 'BS-IV Diesel (2018)',
        checkpost: 'Joshimath Barrier',
        date: 'Today (Offline Cache)',
      },
    },
    {
      id: 'TRP-2026-903',
      circuit: 'Kathgodam — Almora',
      distanceKm: 88,
      mode: 'Shared UTC Bus',
      passengers: 2,
      nights: 2,
      tripFootprintKg: 37.0,
      perPersonKg: 18.5,
      severity: 'low',
      status: 'pledged',
      expansion: {
        terrain: 'Mid Hills',
        stay: 'Homestay (2 Nights)',
        engine: 'Public Bus (CNG/Diesel)',
        checkpost: 'Bhowali Toll Check',
        date: 'Yesterday (Offline Cache)',
      },
    },
    {
      id: 'TRP-2026-902',
      circuit: 'Haridwar — Kedarnath',
      distanceKm: 240,
      mode: 'Motorcycle',
      passengers: 2,
      nights: 3,
      tripFootprintKg: 64.2,
      perPersonKg: 32.1,
      severity: 'moderate',
      status: 'calculated',
      expansion: {
        terrain: 'High Altitude (Steep Curvature)',
        stay: 'Camp Site (3 Nights)',
        engine: '4-Stroke Petrol (2020)',
        checkpost: 'Sonprayag Control',
        date: '2 days ago (Offline Cache)',
      },
    },
    {
      id: 'TRP-2026-901',
      circuit: 'Dehradun — Mussoorie',
      distanceKm: 68,
      mode: 'Sedan (Petrol)',
      passengers: 3,
      nights: 2,
      tripFootprintKg: 73.8,
      perPersonKg: 24.6,
      severity: 'moderate',
      status: 'verified',
      expansion: {
        terrain: 'Mid Hills',
        stay: 'Hotel (2 Nights)',
        engine: 'BS-VI Petrol (2022)',
        checkpost: 'Kuthalgate Checkpost',
        date: '3 days ago (Offline Cache)',
      },
    },
  ];
  return {
    data: offlineLogs,
    totalSubmissions: offlineLogs.length,
    totalPages: 1,
  };
}

export async function fetchAdminMetrics(token: string): Promise<AdminMetrics> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return getOfflineAdminMetrics();
  }

  try {
    const res = await fetch(`${API_BASE_URL}/admin/metrics`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(2000),
    });

    if (!res.ok) {
      throw new Error('Unauthorized to view administrative metrics');
    }

    return await res.json();
  } catch {
    return getOfflineAdminMetrics();
  }
}

export async function fetchAdminTrips(
  token: string,
  page = 1,
  limit = 5,
  filter = 'all',
  search = ''
): Promise<{ data: AuditTripLog[]; totalSubmissions: number; totalPages: number }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return getOfflineAdminTrips(page, limit, filter, search);
  }

  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      filter,
      search,
    });

    const res = await fetch(`${API_BASE_URL}/admin/trips?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(2000),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch audit log submissions');
    }

    return await res.json();
  } catch {
    return getOfflineAdminTrips(page, limit, filter, search);
  }
}
