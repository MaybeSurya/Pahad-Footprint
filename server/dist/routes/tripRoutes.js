"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Trip_js_1 = require("../models/Trip.js");
const auth_js_1 = require("../middleware/auth.js");
const validate_js_1 = require("../middleware/validate.js");
const carbonCalculator_js_1 = require("../utils/carbonCalculator.js");
const router = (0, express_1.Router)();
// Dynamic footprint calculation (Public/Auth, no persistence)
router.post('/calculate', (0, validate_js_1.validate)(validate_js_1.calculateTripSchema), (req, res) => {
    try {
        const result = (0, carbonCalculator_js_1.calculateCarbonFootprint)(req.body);
        res.json(result);
    }
    catch (error) {
        console.error('Calculation error:', error);
        res.status(500).json({ error: 'Failed to compute carbon metrics' });
    }
});
// Persist calculated trip into database (Authenticated or guest)
router.post('/log', auth_js_1.optionalToken, (0, validate_js_1.validate)(validate_js_1.logTripSchema), async (req, res) => {
    try {
        const { routeName, distanceKm, terrainZone, transportMode, passengers, nights, accommodationType, perPersonCo2e, totalCo2e, restorationPledged, } = req.body;
        const trip = await Trip_js_1.Trip.create({
            userId: req.user ? req.user.id : null,
            routeName,
            distanceKm,
            terrainZone,
            transportMode,
            passengers,
            nights,
            accommodationType,
            perPersonCo2e,
            totalCo2e,
            restorationPledged: Boolean(restorationPledged),
        });
        res.status(201).json({
            message: 'Trip logged successfully to Uttarakhand Carbon Registry',
            trip,
        });
    }
    catch (error) {
        console.error('Log trip error:', error);
        res.status(500).json({ error: 'Failed to persist trip log record' });
    }
});
// Get trips for authenticated user
router.get('/my-trips', auth_js_1.verifyToken, async (req, res) => {
    try {
        const trips = await Trip_js_1.Trip.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
        });
        res.json({ count: trips.length, trips });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user trips' });
    }
});
exports.default = router;
