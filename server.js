const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');

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

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

// mongoose connect
mongoose.connect('mongodb://localhost:27017/test_chat_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});