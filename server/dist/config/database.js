"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isProduction = process.env.NODE_ENV === 'production';
const dbUrl = process.env.DATABASE_URL;
let sequelize;
if (dbUrl && dbUrl.startsWith('postgres')) {
    exports.sequelize = sequelize = new sequelize_1.Sequelize(dbUrl, {
        dialect: 'postgres',
        logging: isProduction ? false : console.log,
        pool: {
            max: 15,
            min: 2,
            acquire: 30000,
            idle: 10000,
        },
        dialectOptions: isProduction
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            }
            : {},
    });
}
else if (process.env.DB_NAME && process.env.DB_USER) {
    exports.sequelize = sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD || '', {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });
}
else {
    // Graceful development fallback: SQLite in-memory/file if PostgreSQL connection is absent
    console.log('ℹ️ Using SQLite database for development/testing environment.');
    exports.sequelize = sequelize = new sequelize_1.Sequelize({
        dialect: 'sqlite',
        storage: './pahad_footprint_dev.sqlite',
        logging: false,
    });
}
