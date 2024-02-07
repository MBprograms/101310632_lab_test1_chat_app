const express = require('express');
const router = express.Router();
const Message = require('../models/message');

router.post('/join-room', (req, res) => {
    const { room } = req.body;

    io.emit('joinRoom', room);
    res.status(200).json({ message: `Joined room ${room} successfully` });
});

router.post('/send-message', async (req, res) => {
    try {
        const { from_user, room, message } = req.body;
        const newMessage = new Message({ from_user, room, message });

        await newMessage.save();
        io.emit('sendMessage', newMessage);
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.post('/leave-room', (req, res) => {
    const { room } = req.body;

    io.emit('leaveRoom', room);
    res.status(200).json({ message: `Left room ${room} successfully` });
});

router.post('/logout', (req, res) => {
    //
});

module.exports = router;