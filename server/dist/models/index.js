"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trip = exports.User = void 0;
const User_js_1 = require("./User.js");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_js_1.User; } });
const Trip_js_1 = require("./Trip.js");
Object.defineProperty(exports, "Trip", { enumerable: true, get: function () { return Trip_js_1.Trip; } });
User_js_1.User.hasMany(Trip_js_1.Trip, { foreignKey: 'userId', as: 'trips' });
Trip_js_1.Trip.belongsTo(User_js_1.User, { foreignKey: 'userId', as: 'user' });
