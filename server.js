const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['https://titusz1118.github.io', 'https://nanochats.online'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // 註冊
    socket.on('register', (data) => {
        if (users[data.username]) {
            socket.emit('registerResponse', { success: false, message: '用戶名已存在' });
        } else {
            userCount += 1; // 增加用戶序號
            users[data.username] = { password: data.password, id: userCount };
            socket.emit('registerResponse', { success: true, message: '註冊成功，請登入' });
        }
    });

    // 登入
    socket.on('login', (data) => {
        if (users[data.username] && users[data.username].password === data.password) {
            socket.username = data.username;
            socket.userId = users[data.username].id; // 儲存用戶序號
            socket.emit('loginResponse', { 
                success: true, 
                username: data.username, 
                userId: socket.userId 
            });
        } else {
            socket.emit('loginResponse', { success: false, message: '用戶名或密碼錯誤' });
        }
    });

    // 聊天訊息
    socket.on('chatMessage', (data) => {
        if (socket.username) {
            io.emit('chatMessage', { 
                username: data.username, 
                userId: socket.userId, 
                message: data.message 
            });
        }
    });

    socket.on('offer', (data) => {
        if (socket.username) {
            socket.broadcast.emit('offer', { 
                username: data.username, 
                userId: socket.userId, 
                offer: data.offer 
            });
        }
    });

    socket.on('answer', (data) => {
        if (socket.username) {
            socket.broadcast.emit('answer', { 
                username: data.username, 
                userId: socket.userId, 
                answer: data.answer 
            });
        }
    });

    socket.on('iceCandidate', (data) => {
        if (socket.username) {
            socket.broadcast.emit('iceCandidate', { 
                username: data.username, 
                userId: socket.userId, 
                candidate: data.candidate 
            });
        }
    });

    socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(3000, () => console.log('Server running on port 3000'));