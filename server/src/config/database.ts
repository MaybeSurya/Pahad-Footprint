import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const dbUrl = process.env.DATABASE_URL;

let sequelize: Sequelize;

if (dbUrl && dbUrl.startsWith('postgres')) {
  sequelize = new Sequelize(dbUrl, {
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
} else if (process.env.DB_NAME && process.env.DB_USER) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || '',
    {
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
    }
  );
} else {
  // Graceful development fallback: SQLite in-memory/file if PostgreSQL connection is absent
  console.log('ℹ️ Using SQLite database for development/testing environment.');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './pahad_footprint_dev.sqlite',
    logging: false,
  });
}

export { sequelize };
