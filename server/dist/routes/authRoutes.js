"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_js_1 = require("../models/User.js");
const auth_js_1 = require("../middleware/auth.js");
const validate_js_1 = require("../middleware/validate.js");
const router = (0, express_1.Router)();
// Register a new user
router.post('/register', (0, validate_js_1.validate)(validate_js_1.registerSchema), async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const existing = await User_js_1.User.findOne({ where: { email: email.toLowerCase() } });
        if (existing) {
            res.status(409).json({ error: 'User with this email already exists' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const user = await User_js_1.User.create({
            email: email.toLowerCase(),
            passwordHash,
            role: role || 'tourist',
        });
        const token = (0, auth_js_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error during registration' });
    }
});
// Login
router.post('/login', (0, validate_js_1.validate)(validate_js_1.loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_js_1.User.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const token = (0, auth_js_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during login' });
    }
});
// Current user profile
router.get('/me', auth_js_1.verifyToken, async (req, res) => {
    try {
        const user = await User_js_1.User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'role', 'createdAt'],
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
});
exports.default = router;
