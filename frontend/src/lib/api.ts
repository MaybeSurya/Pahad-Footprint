import { CalculationInput, CalculationOutput, AdminMetrics, AuditTripLog, UserSession } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Local deterministic calculator fallback in case backend server is paused or during edge-static render
export function calculateLocalDeterministic(input: CalculationInput): CalculationOutput {
  const distance = Math.max(1, Number(input.distanceKm) || 1);
  const passengers = Math.max(1, Number(input.passengers) || 1);
  const nights = Math.max(1, Number(input.nights) || 1);

  const terrainMap = { foothills: 1.0, mid_hills: 1.25, high_altitude: 1.4 };
  const terrainMultiplier = terrainMap[input.terrainZone] || 1.25;

  let transportKgPP = 0;
  let baselineTransportKgPP = 0;

  if (input.transportMode === 'bus') {
    transportKgPP = (distance * 30 * terrainMultiplier) / 1000;
    baselineTransportKgPP = (distance * 30) / 1000;
  } else {
    const factorMap = { suv: 180, sedan: 140, ev: 45 };
    const factor = factorMap[input.transportMode] || 180;
    transportKgPP = (distance * factor * terrainMultiplier) / (1000 * passengers);
    baselineTransportKgPP = (distance * factor) / (1000 * passengers);
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
  try {
    const res = await fetch(`${API_BASE_URL}/trips/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
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
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/trips/log`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to persist trip');
  }

  return await res.json();
}

export async function loginUser(email: string, password: string): Promise<UserSession> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
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

export async function fetchAdminMetrics(token: string): Promise<AdminMetrics> {
  const res = await fetch(`${API_BASE_URL}/admin/metrics`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Unauthorized to view administrative metrics');
  }

  return await res.json();
}

export async function fetchAdminTrips(
  token: string,
  page = 1,
  limit = 5,
  filter = 'all',
  search = ''
): Promise<{ data: AuditTripLog[]; totalSubmissions: number; totalPages: number }> {
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
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch audit log submissions');
  }

  return await res.json();
}
