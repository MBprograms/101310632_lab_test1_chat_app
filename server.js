const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');
const path = require('path'); // Import path module

const app = express();
const server = http.createServer(app);

const io = socketio(server);

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });

    socket.on('typing', () => {
        socket.broadcast.emit('userTyping');
    });

    socket.on('disconnect', () => {
        console.log('WebSocket connection disconnected');
    });
});

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

// mongoose connect
mongoose.connect('mongodb://127.0.0.1/101310632_lab_test1_chat_app', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Did not connect to MongoDB:', err.message);
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});