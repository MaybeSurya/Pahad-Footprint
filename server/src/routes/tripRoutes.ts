import { Router, Request, Response } from 'express';
import { Trip } from '../models/Trip.js';
import { optionalToken, verifyToken } from '../middleware/auth.js';
import { validate, calculateTripSchema, logTripSchema } from '../middleware/validate.js';
import { calculateCarbonFootprint } from '../utils/carbonCalculator.js';

const router = Router();

// Dynamic footprint calculation (Public/Auth, no persistence)
router.post('/calculate', validate(calculateTripSchema), (req: Request, res: Response) => {
  try {
    const result = calculateCarbonFootprint(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'Failed to compute carbon metrics' });
  }
});

// Persist calculated trip into database (Authenticated or guest)
router.post('/log', optionalToken, validate(logTripSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      routeName,
      distanceKm,
      terrainZone,
      transportMode,
      passengers,
      nights,
      accommodationType,
      perPersonCo2e,
      totalCo2e,
      restorationPledged,
    } = req.body;

    const trip = await Trip.create({
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
  } catch (error: any) {
    console.error('Log trip error:', error);
    res.status(500).json({ error: 'Failed to persist trip log record' });
  }
});

// Get trips for authenticated user
router.get('/my-trips', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const trips = await Trip.findAll({
      where: { userId: req.user!.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({ count: trips.length, trips });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve user trips' });
  }
});

export default router;
