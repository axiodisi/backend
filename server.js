const express = require('express');
const cors = require('cors');
const { Client } = require('@replit/database');

const app = express();
const db = new Client();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Backend server is running');
});

// Example route using Replit DB
app.post('/user', async (req, res) => {
    try {
        const { username, password } = req.body;
        await db.set(`user_${username}`, { username, password });
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error creating user' });
    }
});

app.get('/user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await db.get(`user_${username}`);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Error fetching user' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
