import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['tourist', 'admin']).optional().default('tourist'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const calculateTripSchema = z.object({
  body: z.object({
    distanceKm: z.number().min(1, 'Distance must be at least 1 km'),
    terrainZone: z.enum(['foothills', 'mid_hills', 'high_altitude']),
    transportCategory: z.enum(['private', 'two_wheeler', 'transit']).optional(),
    vehicleType: z.enum(['suv', 'sedan', 'hatchback', 'coupe', 'motorcycle', 'scooty', 'bicycle']).optional(),
    fuelType: z.enum(['petrol', 'diesel', 'cng', 'lpg', 'hybrid', 'ev', 'pedal']).optional(),
    transitMode: z.enum(['bus', 'train', 'helicopter', 'flight']).optional(),
    registrationYear: z.number().int().min(1980).max(2030).optional(),
    transportMode: z.string(),
    passengers: z.number().int().min(1, 'Passengers must be at least 1').max(50),
    nights: z.number().int().min(1, 'Nights must be at least 1').max(60),
    accommodationType: z.enum(['luxury', 'hotel', 'homestay', 'camp']),
    habitWater: z.boolean().optional().default(false),
    habitFood: z.boolean().optional().default(false),
  }),
});

export const logTripSchema = z.object({
  body: z.object({
    routeName: z.string().min(2, 'Route name must be at least 2 characters'),
    distanceKm: z.number().min(1),
    terrainZone: z.enum(['foothills', 'mid_hills', 'high_altitude']),
    transportMode: z.string(),
    passengers: z.number().int().min(1),
    nights: z.number().int().min(1),
    accommodationType: z.string(),
    perPersonCo2e: z.number(),
    totalCo2e: z.number(),
    restorationPledged: z.boolean().optional().default(false),
  }),
});

export function validate(schema: z.ZodSchema<any>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
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
