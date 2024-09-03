const express = require('express');
const User = require('../models/User');
// ... other imports ...

const router = express.Router();

// Use the User model in your route handlers
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

// ... other route handlers ...

module.exports = router;
