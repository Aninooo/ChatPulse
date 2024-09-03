const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,  // Safely remove if using MongoDB driver v4.0.0 or later
    useUnifiedTopology: true // Safely remove if using MongoDB driver v4.0.0 or later
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const messageSchema = new mongoose.Schema({
  username: String,
  text: String,
  room: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

let users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', async ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    // Load message history for the room
    const messages = await Message.find({ room }).sort({ timestamp: 1 });
    socket.emit('messageHistory', messages);

    socket.to(room).emit('message', { text: `${username} has joined the room.`, username: 'System', timestamp: new Date() });
  });

  socket.on('message', async (data) => {
    const user = users[socket.id];
    if (user) {
      const message = { ...data, username: user.username, timestamp: new Date() };
      console.log('Sending message:', message);
      io.to(user.room).emit('message', message);
  
      // Save message to the database
      await Message.create({ ...message, room: user.room });
    }
  });
  
  socket.on('typing', () => {
    const user = users[socket.id];
    if (user) {
      socket.to(user.room).emit('typing', { username: user.username });
    }
  });

  socket.on('stopTyping', () => {
    const user = users[socket.id];
    if (user) {
      socket.to(user.room).emit('stopTyping', { username: user.username });
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      socket.to(user.room).emit('message', { text: `${user.username} has left the room.`, username: 'System', timestamp: new Date() });
      delete users[socket.id];
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
