require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('redis');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  transports: ['websocket'],
});

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379'
});
redisClient.connect().catch(console.error);

const users = new Map();

io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);

  socket.on('set username', (username) => {
    users.set(username, socket.id);
    socket.username = username;
    console.log(`Kullanıcı adı ayarlandı: ${username} -> ${socket.id}`);
  });

  socket.on('private message', ({ to, message }) => {
    const targetSocketId = users.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('private message', {
        from: socket.username,
        message,
      });
      console.log(`Mesaj ${socket.username} tarafından ${to}'ya gönderildi: ${message}`);
    } else {
      socket.emit('error', `Kullanıcı ${to} bulunamadı.`);
    }
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      users.delete(socket.username);
      console.log(`Kullanıcı ayrıldı: ${socket.username} (${socket.id})`);
    } else {
      console.log(`Tanımsız kullanıcı ayrıldı: ${socket.id}`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
