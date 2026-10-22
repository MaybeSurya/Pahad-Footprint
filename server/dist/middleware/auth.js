"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.optionalToken = optionalToken;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'pahad-footprint-secret-key-2026-uttarakhand';
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
        return;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({ error: 'Unauthorized: Malformed Bearer token' });
        return;
    }
    const token = parts[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(403).json({ error: 'Forbidden: Access token has expired' });
            return;
        }
        res.status(403).json({ error: 'Forbidden: Invalid authorization token' });
    }
}
function optionalToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next();
    }
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
        try {
            const decoded = jsonwebtoken_1.default.verify(parts[1], JWT_SECRET);
            req.user = decoded;
        }
        catch {
            // Ignore invalid optional token
        }
    }
    next();
}
function requireAdmin(req, res, next) {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized: Authentication required' });
        return;
    }
    if (req.user.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Administrative privileges required' });
        return;
    }
    next();
}
