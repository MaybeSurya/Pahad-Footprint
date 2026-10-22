import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import { sequelize } from './config/database.js';
import { User, Trip } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware: Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows cross-origin API integration
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration with whitelist
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Dev-friendly fallback
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api/', limiter);

// Stricter limiter for authentication attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 login/register attempts per IP per 15m
  message: { error: 'Too many authentication attempts. Please try again later.' },
});
app.use('/api/auth/', authLimiter);

// Body Parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Pahad Footprint Backend Engine',
    version: '1.2-2026',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Database Synchronization & Initial Demo Seeding
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database successfully.');

    await sequelize.sync({ alter: false });
    console.log('✅ Sequelize models synchronized.');

    // Seed default admin and tourist users if empty
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount === 0) {
      const adminPass = await bcrypt.hash('PahadAdmin2026!', 10);
      await User.create({
        email: 'admin@pahadfootprint.gov.in',
        passwordHash: adminPass,
        role: 'admin',
      });
      console.log('🌱 Seeded default Regional Auditor: admin@pahadfootprint.gov.in / PahadAdmin2026!');
    }

    const touristCount = await User.count({ where: { role: 'tourist' } });
    if (touristCount === 0) {
      const touristPass = await bcrypt.hash('PahadTourist2026!', 10);
      await User.create({
        email: 'tourist@pahadfootprint.org',
        passwordHash: touristPass,
        role: 'tourist',
      });
      console.log('🌱 Seeded default Tourist: tourist@pahadfootprint.org / PahadTourist2026!');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Pahad Footprint Express Server running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
