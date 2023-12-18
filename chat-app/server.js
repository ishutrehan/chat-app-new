// server.js
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');
const Message = require('./models/Message');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect('mongodb+srv://boffin:boffin12@cluster0.ewpjqrp.mongodb.net/test-chat');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', async (socket) => {
    console.log('User connected');

    // Listen for new messages
    socket.on('newMessage', async (data) => {
        const message = new Message({
            user: data.user,
            content: data.content,
        });

        try {
            // Save the message to MongoDB
            await message.save();

            // Broadcast the new message to all connected clients
            io.emit('newMessage', message);
        } catch (error) {
            console.error('Error saving message to MongoDB:', error);
        }
    });

    // Load previous messages from MongoDB
    try {
        const messages = await Message.find().sort({ createdAt: -1 }).limit(10);
        socket.emit('loadMessages', messages);
    } catch (error) {
        console.error('Error loading messages from MongoDB:', error);
    }

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = 3010;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
