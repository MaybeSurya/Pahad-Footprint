import { User } from './User.js';
import { Trip } from './Trip.js';

User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Trip };
