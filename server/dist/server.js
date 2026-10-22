"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_js_1 = require("./config/database.js");
const index_js_1 = require("./models/index.js");
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const tripRoutes_js_1 = __importDefault(require("./routes/tripRoutes.js"));
const adminRoutes_js_1 = __importDefault(require("./routes/adminRoutes.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security Middleware: Helmet
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Allows cross-origin API integration
    crossOriginEmbedderPolicy: false,
}));
// CORS configuration with whitelist
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL,
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        }
        else {
            callback(null, true); // Dev-friendly fallback
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Global Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api/', limiter);
// Stricter limiter for authentication attempts
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20, // 20 login/register attempts per IP per 15m
    message: { error: 'Too many authentication attempts. Please try again later.' },
});
app.use('/api/auth/', authLimiter);
// Body Parser
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
// Health Check
app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Pahad Footprint Backend Engine',
        version: '1.2-2026',
    });
});
// API Routes
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/trips', tripRoutes_js_1.default);
app.use('/api/admin', adminRoutes_js_1.default);
// 404 Route Handler
app.use((_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
});
// Database Synchronization & Initial Demo Seeding
async function startServer() {
    try {
        await database_js_1.sequelize.authenticate();
        console.log('✅ Connected to database successfully.');
        await database_js_1.sequelize.sync({ alter: false });
        console.log('✅ Sequelize models synchronized.');
        // Seed default admin and tourist users if empty
        const adminCount = await index_js_1.User.count({ where: { role: 'admin' } });
        if (adminCount === 0) {
            const adminPass = await bcryptjs_1.default.hash('PahadAdmin2026!', 10);
            await index_js_1.User.create({
                email: 'admin@pahadfootprint.gov.in',
                passwordHash: adminPass,
                role: 'admin',
            });
            console.log('🌱 Seeded default Regional Auditor: admin@pahadfootprint.gov.in / PahadAdmin2026!');
        }
        const touristCount = await index_js_1.User.count({ where: { role: 'tourist' } });
        if (touristCount === 0) {
            const touristPass = await bcryptjs_1.default.hash('PahadTourist2026!', 10);
            await index_js_1.User.create({
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
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
exports.default = app;
