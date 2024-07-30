const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store connected clients
const clients = {};

io.on('connection', (socket) => {
    console.log('New client connected: ' + socket.id);

    // Store the client's socket
    clients[socket.id] = socket;

    socket.on('disconnect', () => {
        console.log('Client disconnected: ' + socket.id);
        // Remove client from clients object
        delete clients[socket.id];
    });
});

// Sample route to trigger notifications
app.get('/send-notification', (req, res) => {
    // Emit event to all connected clients
    io.emit('notification', 'New breaking news!');
    res.send('Notification sent');
});

// Route to handle requests to the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
