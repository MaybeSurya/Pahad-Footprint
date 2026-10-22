import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface TripAttributes {
  id: string;
  userId?: string | null;
  routeName: string;
  distanceKm: number;
  terrainZone: 'foothills' | 'mid_hills' | 'high_altitude';
  transportMode: string;
  passengers: number;
  nights: number;
  accommodationType: string;
  perPersonCo2e: number;
  totalCo2e: number;
  restorationPledged: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TripCreationAttributes extends Optional<TripAttributes, 'id' | 'userId' | 'restorationPledged'> {}

export class Trip extends Model<TripAttributes, TripCreationAttributes> implements TripAttributes {
  declare id: string;
  declare userId: string | null;
  declare routeName: string;
  declare distanceKm: number;
  declare terrainZone: 'foothills' | 'mid_hills' | 'high_altitude';
  declare transportMode: string;
  declare passengers: number;
  declare nights: number;
  declare accommodationType: string;
  declare perPersonCo2e: number;
  declare totalCo2e: number;
  declare restorationPledged: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Trip.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    routeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distanceKm: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    terrainZone: {
      type: DataTypes.ENUM('foothills', 'mid_hills', 'high_altitude'),
      allowNull: false,
    },
    transportMode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passengers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    nights: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    accommodationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perPersonCo2e: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalCo2e: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    restorationPledged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'trips',
    timestamps: true,
  }
);
