"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trip = void 0;
const sequelize_1 = require("sequelize");
const database_js_1 = require("../config/database.js");
class Trip extends sequelize_1.Model {
}
exports.Trip = Trip;
Trip.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    routeName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    distanceKm: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    terrainZone: {
        type: sequelize_1.DataTypes.ENUM('foothills', 'mid_hills', 'high_altitude'),
        allowNull: false,
    },
    transportMode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    passengers: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
        },
    },
    nights: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
        },
    },
    accommodationType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    perPersonCo2e: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    totalCo2e: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    restorationPledged: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: database_js_1.sequelize,
    tableName: 'trips',
    timestamps: true,
});
