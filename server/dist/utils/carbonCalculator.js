"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECO_HABIT_CREDITS = exports.ACCOMMODATION_FACTORS = exports.TERRAIN_MULTIPLIERS = exports.TRANSIT_FACTORS = exports.VEHICLE_FACTORS = void 0;
exports.calculateCarbonFootprint = calculateCarbonFootprint;
// Vehicle emission factors (g CO2e per vehicle-km)
exports.VEHICLE_FACTORS = {
    suv: 180,
    sedan: 140,
    ev: 45,
};
// Shared transit factor (g CO2e per passenger-km)
exports.TRANSIT_FACTORS = {
    bus: 30,
};
// Terrain multipliers
exports.TERRAIN_MULTIPLIERS = {
    foothills: 1.0,
    mid_hills: 1.25,
    high_altitude: 1.4,
};
// Accommodation emission intensities (kg CO2e per guest-night)
exports.ACCOMMODATION_FACTORS = {
    luxury: 24.0,
    hotel: 9.0,
    homestay: 6.0,
    camp: 3.5,
};
// Eco-habit deductions (kg CO2e per person)
exports.ECO_HABIT_CREDITS = {
    water: 2.0,
    food: 3.0,
};
function calculateCarbonFootprint(input) {
    const distance = Math.max(1, Number(input.distanceKm) || 1);
    const passengers = Math.max(1, Number(input.passengers) || 1);
    const nights = Math.max(1, Number(input.nights) || 1);
    const terrainMultiplier = exports.TERRAIN_MULTIPLIERS[input.terrainZone] ?? 1.25;
    // 1. Transport Calculation
    let transportKgPP = 0;
    let baselineTransportKgPP = 0;
    if (input.transportMode === 'bus') {
        const factor = exports.TRANSIT_FACTORS.bus; // 30 g/pkm
        transportKgPP = (distance * factor * terrainMultiplier) / 1000;
        baselineTransportKgPP = (distance * factor) / 1000;
    }
    else {
        const factor = exports.VEHICLE_FACTORS[input.transportMode] ?? exports.VEHICLE_FACTORS.suv;
        transportKgPP = (distance * factor * terrainMultiplier) / (1000 * passengers);
        baselineTransportKgPP = (distance * factor) / (1000 * passengers);
    }
    const uphillDeltaPP = Math.max(0, transportKgPP - baselineTransportKgPP);
    const uphillDeltaTotal = uphillDeltaPP * passengers;
    // 2. Accommodation Calculation
    const stayFactor = exports.ACCOMMODATION_FACTORS[input.accommodationType] ?? exports.ACCOMMODATION_FACTORS.hotel;
    const stayKgPP = nights * stayFactor;
    // 3. Eco-Habits
    let habitCreditsPP = 0;
    if (input.habitWater)
        habitCreditsPP += exports.ECO_HABIT_CREDITS.water;
    if (input.habitFood)
        habitCreditsPP += exports.ECO_HABIT_CREDITS.food;
    const grossTotalPP = transportKgPP + stayKgPP;
    const netTotalPP = Math.max(0.5, grossTotalPP - habitCreditsPP);
    const netTotalTrip = netTotalPP * passengers;
    // 4. Distribution percentages
    const transportPct = grossTotalPP > 0 ? Math.round((transportKgPP / grossTotalPP) * 100) : 50;
    const stayPct = 100 - transportPct;
    // 5. Impact Severity
    let impactSeverity = 'moderate';
    if (netTotalPP < 30) {
        impactSeverity = 'low';
    }
    else if (netTotalPP <= 75) {
        impactSeverity = 'moderate';
    }
    else {
        impactSeverity = 'high';
    }
    // 6. Eco-Swap alternative: Shared UTC Bus + Pahadi Homestay
    const swapTransportPP = (distance * exports.TRANSIT_FACTORS.bus * terrainMultiplier) / 1000;
    const swapStayPP = nights * exports.ACCOMMODATION_FACTORS.homestay;
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
