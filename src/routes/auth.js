const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/signup', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(404).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;