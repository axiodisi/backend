const express = require('express');
const Database = require("@replit/database");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = new Database();

// JWT Secret (in a real app, store this in an environment variable)
const JWT_SECRET = 'your_jwt_secret';

// Helper function to generate JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await db.get(`user_${username}`);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user in Replit DB
        await db.set(`user_${username}`, { username, password: hashedPassword });

        // Generate JWT
        const token = generateToken(username);

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Retrieve user from Replit DB
        const user = await db.get(`user_${username}`);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = generateToken(username);

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error: error.message });
    }
});

// ... other route handlers ...

module.exports = router;
