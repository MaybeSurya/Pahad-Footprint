"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTripSchema = exports.calculateTripSchema = exports.loginSchema = exports.registerSchema = void 0;
exports.validate = validate;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address format'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
        role: zod_1.z.enum(['tourist', 'admin']).optional().default('tourist'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address format'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
exports.calculateTripSchema = zod_1.z.object({
    body: zod_1.z.object({
        distanceKm: zod_1.z.number().min(1, 'Distance must be at least 1 km'),
        terrainZone: zod_1.z.enum(['foothills', 'mid_hills', 'high_altitude']),
        transportMode: zod_1.z.enum(['suv', 'sedan', 'ev', 'bus']),
        passengers: zod_1.z.number().int().min(1, 'Passengers must be at least 1').max(50),
        nights: zod_1.z.number().int().min(1, 'Nights must be at least 1').max(60),
        accommodationType: zod_1.z.enum(['luxury', 'hotel', 'homestay', 'camp']),
        habitWater: zod_1.z.boolean().optional().default(false),
        habitFood: zod_1.z.boolean().optional().default(false),
    }),
});
exports.logTripSchema = zod_1.z.object({
    body: zod_1.z.object({
        routeName: zod_1.z.string().min(2, 'Route name must be at least 2 characters'),
        distanceKm: zod_1.z.number().min(1),
        terrainZone: zod_1.z.enum(['foothills', 'mid_hills', 'high_altitude']),
        transportMode: zod_1.z.string(),
        passengers: zod_1.z.number().int().min(1),
        nights: zod_1.z.number().int().min(1),
        accommodationType: zod_1.z.string(),
        perPersonCo2e: zod_1.z.number(),
        totalCo2e: zod_1.z.number(),
        restorationPledged: zod_1.z.boolean().optional().default(false),
    }),
});
function validate(schema) {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors.map((err) => ({
                        field: err.path.join('.').replace(/^body\./, ''),
                        message: err.message,
                    })),
                });
                return;
            }
            res.status(400).json({ error: 'Malformed request data' });
        }
    };
}
