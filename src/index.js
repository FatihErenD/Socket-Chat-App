require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('redis');

const app = express();
app.use(express.static('src/public'));
const server = http.createServer(app);
const io = new Server(server);

// Redis client (basit bağlantı)
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379'
});
redisClient.connect().catch(console.error);

// WebSocket bağlantısı
io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);

  socket.on('chat message', (msg) => {
    console.log('Mesaj alındı:', msg);
    io.emit('chat message', msg); // herkese gönder
  });

  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
  });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
