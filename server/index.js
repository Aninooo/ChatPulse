const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

mongoose.connect('mongodb://localhost/chat', { useNewUrlParser: true, useUnifiedTopology: true });

const message = { ...data, username: user.username, timestamp: new Date() };
await Message.create({ ...message, room: user.room });


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

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
