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

const users = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('register', (data) => {
        console.log('Register attempt:', data); // 測試用
        if (users[data.username]) {
            socket.emit('registerResponse', { message: '用戶名已存在' });
        } else {
            users[data.username] = data.password;
            socket.emit('registerResponse', { message: '註冊成功，請登入' });
        }
    });

    socket.on('login', (data) => {
        console.log('Login attempt:', data); // 測試用
        if (users[data.username] && users[data.username] === data.password) {
            socket.emit('loginResponse', { success: true, message: '登入成功' });
        } else {
            socket.emit('loginResponse', { success: false, message: '用戶名或密碼錯誤' });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));