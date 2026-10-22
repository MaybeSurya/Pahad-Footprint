"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEED_AUDIT_LOGS = void 0;
const express_1 = require("express");
const Trip_js_1 = require("../models/Trip.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// Apply admin RBAC security to all routes in this router
router.use(auth_js_1.verifyToken, auth_js_1.requireAdmin);
// Seed baseline audit logs with row-expansion metadata
exports.SEED_AUDIT_LOGS = [
    {
        id: 'PF-4092',
        circuit: 'Kumaon Circuit (Nainital – Almora – Mukteshwar)',
        distanceKm: 320,
        mode: 'Diesel SUV',
        passengers: 3,
        nights: 4,
        tripFootprintKg: 180.0,
        perPersonKg: 60.0,
        severity: 'moderate',
        status: 'verified',
        expansion: {
            terrain: 'Mid-Hills (1.25× grade multiplier)',
            stay: 'Standard Hotel (4 nights @ 9.0 kg/night)',
            engine: 'v1.2-2026 Baseline Analytical Engine',
            checkpost: 'Almora North Gate Toll Barrier',
            date: '2026-10-22 11:42 IST',
        },
    },
    {
        id: 'PF-4091',
        circuit: 'Mussoorie – Dhanaulti Ridge Corridor',
        distanceKm: 185,
        mode: 'Shared UTC Bus',
        passengers: 2,
        nights: 3,
        tripFootprintKg: 38.2,
        perPersonKg: 19.1,
        severity: 'low',
        status: 'pledged',
        expansion: {
            terrain: 'Mid-Hills (1.25× grade multiplier)',
            stay: 'Pahadi Homestay (3 nights @ 6.0 kg/night)',
            engine: 'v1.2-2026 Baseline Analytical Engine',
            checkpost: 'Kincraig Checkpost, Mussoorie',
            date: '2026-10-22 10:15 IST',
        },
    },
    {
        id: 'PF-4090',
        circuit: 'Rishikesh – Tehri Lake Ascent',
        distanceKm: 210,
        mode: 'Petrol Sedan',
        passengers: 4,
        nights: 3,
        tripFootprintKg: 112.4,
        perPersonKg: 28.1,
        severity: 'low',
        status: 'calculated',
        expansion: {
            terrain: 'Mid-Hills (1.25×)',
            stay: 'Standard Hotel (3 nights @ 9.0 kg/night)',
            engine: 'v1.2-2026 Baseline',
            checkpost: 'Devprayag Toll Terminal',
            date: '2026-10-22 09:20 IST',
        },
    },
    {
        id: 'PF-4089',
        circuit: 'Auli – Joshimath High Alpine Corridor',
        distanceKm: 460,
        mode: 'Electric Vehicle',
        passengers: 2,
        nights: 5,
        tripFootprintKg: 64.8,
        perPersonKg: 32.4,
        severity: 'low',
        status: 'verified',
        expansion: {
            terrain: 'High Altitude (1.40× elevation multiplier)',
            stay: 'Pahadi Homestay (5 nights @ 6.0 kg/night)',
            engine: 'v1.2-2026',
            checkpost: 'Joshimath Alpine Entry Gate',
            date: '2026-10-21 16:55 IST',
        },
    },
    {
        id: 'PF-4088',
        circuit: 'Auli – Joshimath High Alpine Corridor',
        distanceKm: 460,
        mode: 'Diesel SUV',
        passengers: 2,
        nights: 6,
        tripFootprintKg: 289.8,
        perPersonKg: 144.9,
        severity: 'high',
        status: 'pledged',
        expansion: {
            terrain: 'High Altitude (1.40× elevation multiplier)',
            stay: 'Luxury Resort (6 nights @ 24.0 kg/night)',
            engine: 'v1.2-2026',
            checkpost: 'Chamoli Gate Toll Plaza',
            date: '2026-10-21 14:10 IST',
        },
    },
    {
        id: 'PF-4087',
        circuit: 'Kumaon Circuit (Nainital – Almora – Mukteshwar)',
        distanceKm: 320,
        mode: 'Shared UTC Bus',
        passengers: 1,
        nights: 2,
        tripFootprintKg: 36.0,
        perPersonKg: 36.0,
        severity: 'low',
        status: 'verified',
        expansion: {
            terrain: 'Mid-Hills (1.25×)',
            stay: 'Pahadi Homestay (2 nights @ 6.0 kg/night)',
            engine: 'v1.2-2026',
            checkpost: 'Nainital Tallital Barrier',
            date: '2026-10-21 11:30 IST',
        },
    },
    {
        id: 'PF-4086',
        circuit: 'Kedarnath / Garhwal Pilgrim Gateway',
        distanceKm: 380,
        mode: 'Diesel SUV',
        passengers: 4,
        nights: 3,
        tripFootprintKg: 213.8,
        perPersonKg: 53.4,
        severity: 'moderate',
        status: 'pledged',
        expansion: {
            terrain: 'High Altitude (1.40×)',
            stay: 'Standard Hotel (3 nights @ 9.0 kg/night)',
            engine: 'v1.2-2026',
            checkpost: 'Gaurikund Transit Camp',
            date: '2026-10-20 17:05 IST',
        },
    },
];
// GET /api/admin/metrics
router.get('/metrics', async (_req, res) => {
    try {
        const totalDbTrips = await Trip_js_1.Trip.count();
        // Reconciled aggregated system metrics per prompt specification
        const metrics = {
            reportingWindow: 'Last 30 Days (23 Sep – 22 Oct 2026)',
            datasetVersion: 'v1.2-2026 Reconciled Baseline',
            lastReconciledAt: '2026-10-22T12:00:00+05:30',
            totalTripsLogged: 1482 + totalDbTrips,
            totalCarbonTrackedTonnes: 214.8,
            averageFootprintKgPerTrip: 145.0,
            averageOccupancyPax: 2.42,
            restorationPledges: {
                totalSaplings: 9780,
                verifiedSaplings: 6420,
                pendingSaplings: 3360,
                activeVanPanchayats: 23,
            },
            circuitsBreakdown: [
                {
                    circuit: 'Kumaon Circuit (Nainital – Almora – Mukteshwar)',
                    tonnesCo2e: 68.0,
                    percentage: 31.7,
                    color: '#1B4332',
                },
                {
                    circuit: 'Mussoorie – Dhanaulti Ridge Corridor',
                    tonnesCo2e: 54.0,
                    percentage: 25.1,
                    color: '#2D6A4F',
                },
                {
                    circuit: 'Rishikesh – Tehri Lake Ascent',
                    tonnesCo2e: 42.0,
                    percentage: 19.6,
                    color: '#40916C',
                },
                {
                    circuit: 'Kedarnath / Garhwal Pilgrim Gateway',
                    tonnesCo2e: 35.0,
                    percentage: 16.3,
                    color: '#52B788',
                },
                {
                    circuit: 'Auli – Joshimath High Alpine Corridor',
                    tonnesCo2e: 15.8,
                    percentage: 7.3,
                    color: '#74C69D',
                },
            ],
            transportModeShare: [
                {
                    mode: 'Private SUV (Diesel)',
                    percentage: 46,
                    tripCount: 682,
                    emissionRate: '180 g CO₂e/vkm',
                    status: 'high_impact',
                },
                {
                    mode: 'Petrol Sedan',
                    percentage: 28,
                    tripCount: 415,
                    emissionRate: '140 g CO₂e/vkm',
                    status: 'standard',
                },
                {
                    mode: 'Shared UTC Bus',
                    percentage: 18,
                    tripCount: 267,
                    emissionRate: '30 g CO₂e/pkm',
                    status: 'eco_friendly',
                },
                {
                    mode: 'Electric Vehicle (EV)',
                    percentage: 8,
                    tripCount: 118,
                    emissionRate: '45 g CO₂e/vkm',
                    status: 'low_grid',
                },
            ],
            auditorInsights: [
                'High SUV transit share (46%) generates 68% of total transport footprint due to mountain altitude grade penalties.',
                'Target EV adoption: 20% by 2027 (Current Deficit: -12%).',
                'Pahadi Homestay adoption in Kumaon saves an estimated 3.0 kg CO2e per guest night compared to conventional hotels.',
            ],
        };
        res.json(metrics);
    }
    catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({ error: 'Failed to aggregate administrative metrics' });
    }
});
// GET /api/admin/trips - Paginated audit log with row expansion
router.get('/trips', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 5));
        const filter = req.query.filter || 'all';
        const search = (req.query.search || '').toLowerCase().trim();
        // Fetch database submissions
        const dbTrips = await Trip_js_1.Trip.findAll({
            order: [['createdAt', 'DESC']],
            limit: 50,
        });
        const mappedDbTrips = dbTrips.map((t) => ({
            id: `PF-${t.id.slice(0, 4).toUpperCase()}`,
            circuit: t.routeName,
            distanceKm: t.distanceKm,
            mode: t.transportMode.toUpperCase(),
            passengers: t.passengers,
            nights: t.nights,
            tripFootprintKg: t.totalCo2e,
            perPersonKg: t.perPersonCo2e,
            severity: t.perPersonCo2e < 30 ? 'low' : t.perPersonCo2e <= 75 ? 'moderate' : 'high',
            status: t.restorationPledged ? 'pledged' : 'verified',
            expansion: {
                terrain: t.terrainZone.replace('_', ' ').toUpperCase(),
                stay: `${t.accommodationType} (${t.nights} nights)`,
                engine: 'v1.2-2026 Production Database',
                checkpost: 'Uttarakhand State Telemetry Entry',
                date: t.createdAt ? new Date(t.createdAt).toLocaleString('en-IN') : 'Recent',
            },
        }));
        let allLogs = [...mappedDbTrips, ...exports.SEED_AUDIT_LOGS];
        // Filter
        if (filter === 'suv') {
            allLogs = allLogs.filter((t) => t.mode.toLowerCase().includes('suv'));
        }
        else if (filter === 'bus') {
            allLogs = allLogs.filter((t) => t.mode.toLowerCase().includes('bus'));
        }
        else if (filter === 'verified') {
            allLogs = allLogs.filter((t) => t.status === 'verified');
        }
        else if (filter === 'pending') {
            allLogs = allLogs.filter((t) => t.status === 'pledged');
        }
        // Search
        if (search) {
            allLogs = allLogs.filter((t) => t.id.toLowerCase().includes(search) ||
                t.circuit.toLowerCase().includes(search) ||
                t.mode.toLowerCase().includes(search));
        }
        const total = 1482; // Normalized total per specifications
        const displayedTotal = allLogs.length;
        const startIndex = (page - 1) * limit;
        const paginated = allLogs.slice(startIndex, startIndex + limit);
        res.json({
            page,
            limit,
            totalPages: Math.ceil(displayedTotal / limit),
            totalSubmissions: total,
            filteredCount: displayedTotal,
            data: paginated,
        });
    }
    catch (error) {
        console.error('Audit trips error:', error);
        res.status(500).json({ error: 'Failed to retrieve audit trip submissions' });
    }
});
exports.default = router;
