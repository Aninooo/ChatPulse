const io = require('socket.io');
const Message = require('../models/message'); 

const setupSocketIO = (server) => {
  const socketIO = io(server, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'],
    },
  });

  let users = {};

  socketIO.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', async ({ username, room }) => {
      try {
        socket.join(room);
        users[socket.id] = { username, room };

        const messages = await Message.find({ room }).sort({ timestamp: 1 });
        socket.emit('messageHistory', messages);

        socket.to(room).emit('message', {
          text: `${username} has joined the room.`,
          username: 'Anino Bot ',
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    socket.on('message', async (data) => {
      const user = users[socket.id];
      if (user) {
        const message = { ...data, username: user.username, timestamp: new Date() };
        console.log('Sending message:', message);

        socketIO.to(user.room).emit('message', message);

        try {

          await Message.create({ ...message, room: user.room });
        } catch (error) {
          console.error('Error saving message:', error);
        }
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
        socket.to(user.room).emit('message', {
          text: `${user.username} has left the room.`,
          username: 'Anino Bot',
          timestamp: new Date(),
        });
        delete users[socket.id];
      }
      console.log('User disconnected:', socket.id);
    });
  });

  return socketIO;
};

module.exports = setupSocketIO;
