//init env 
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';

//init socket port
const socketPORT = 8888;

//init express, http, socketio
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

//init config object
const config = require('./config/config')[env];

const favicon = require('express-favicon');
const path = require('path');

//init db
require('./config/database')(config);

//init app
const app = express();

//init express
require('./config/express')(app);

//init routes
require('./config/routes')(app);

// General error handling
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message, error });
    next();
})

app.use(favicon('client/iwi-app/build/iwi_logo.png'));

app.use(express.static(path.join(__dirname, '/client/iwi-app/build')));

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.get('*', (request, response) => {
        response.sendFile(path.resolve('./', 'client', 'iwi-app', 'build', 'index.html'));
    });
}

//SOCKETIO
const socketServer = http.createServer(express());
const io = socketio(socketServer);
const User = require('./models/User');
const Notification = require('./models/Notification');
const Message = require('./models/Message');

const onlineUsers = [];
const rooms = [];

io.on('connection', (socket) => {
    console.log('User is connected!');

    //join to online users (general socket)
    socket.on('join', async ({ userId }) => {
        //check if exist online user, so not to add him again in online users array
        const indexOfCurUser = onlineUsers.findIndex(obj => {
            return (obj._id ? obj._id.toString() : obj.id.toString()) === userId
        });

        if (indexOfCurUser === -1) {
            const curUser = await User.findById(userId);

            curUser.notifications = [];
            await curUser.save();

            onlineUsers.push({ ...curUser._doc, socketId: socket.id, room: '' });
        }

        socket.emit('online users', { onlineUsers });
    });

    socket.on('online users', () => {
        socket.emit('online users', { onlineUsers })                    //send online user to client
    });

    socket.on('send notification', async ({ notificatedUserId, senderId }) => {
        const user = await User.findById(notificatedUserId).populate('notifications');
        const sender = await User.findById(senderId);
        let roomIndex = rooms.findIndex(room => (room === (notificatedUserId + senderId)) || (room === (senderId + notificatedUserId)));

        if (roomIndex === -1) {
            roomIndex += rooms.push(senderId + notificatedUserId);                  //if room from current users does not exist, create room from their ids
        }

        //if notificated user hasnt notifications from sender, send new notification to him
        if (!user.notifications.find(n => n.message.includes(sender.username))) {
            const notification = await Notification.create({
                message: `${sender.username} wants to text you!`,
                sender,
                room: rooms[roomIndex],
            });

            user.notifications.push(notification);
            await user.save();
        }
    });

    socket.on('get messages', async ({ curUserId, onlineUser }) => {
        let messages = await Message.find().populate('creator');

        //get messages with room tthat is with user ids concatination
        messages = messages.filter(m => (m.room === (curUserId + onlineUser)) || (m.room === (onlineUser + curUserId)));

        socket.emit('messages', { messages })
    })

    //join room socket, when client send it from notification
    socket.on('join sender room', async ({ userId, senderId }) => {
        const user = await User.findById(userId).populate('notifications');
        const senderUser = await User.findById(senderId).populate('notifications');
        const room = rooms.find(room => (room === (userId + senderId)) || (room === (senderId + userId)));

        socket.join(room);

        if (senderUser._doc) {
            socket.broadcast.to(room).emit('info message', { text: `${user._doc.username} has joind the chat!` });
            socket.emit('join sender room', { user: { ...senderUser._doc, room } });
        } else {
            socket.broadcast.to(room).emit('info message', { text: `${user.username} has joind the chat!` });
            socket.emit('join sender room', { user: { ...senderUser, room } });
        }

        user.notifications = user.notifications.filter(n => n.sender.toString() !== senderId);
        await user.save();
    });

    socket.on('join room', async ({ userId, senderId }) => {
        const user = await User.findById(userId).populate('notifications');
        const senderUser = await User.findById(senderId).populate('notifications');

        const room = rooms.find(room => (room === (userId + senderId)) || (room === (senderId + userId)));

        socket.join(room);

        if (senderUser._doc) {
            socket.broadcast.to(room).emit('info message', { text: `${senderUser._doc.username} has joind the chat!` });
            socket.emit('join room', { user: { ...senderUser._doc, room } });
        } else {
            socket.to(room).emit('info message', { text: `${senderUser.username} has joind the chat!` });
            socket.broadcast.emit('join room', { user: { ...senderUser, room } });
        }

        user.notifications = user.notifications.filter(n => n.sender.toString() !== senderId);
        await user.save();
    });

    socket.on('typing', ({ username, room }) => {
        socket.broadcast.to(room).emit('typing', { username });
    });

    socket.on('stop typing', ({ room }) => {
        socket.broadcast.to(room).emit('stop typing');
    });

    socket.on('send message', async ({ room, text, userId }) => {
        let message = await Message
            .create({
                creator: userId,
                room,
                text
            })

        message = await message.populate('creator').execPopulate()

        io.to(room).emit('message', { message });
    });

    socket.on('leave room', ({ room, username }) => {
        socket.leave(room);
        socket.broadcast.to(room).emit('info message', { text: `${username} left room!` })
    })

    socket.on('disconnect', async ({ userId }) => {
        const userIndex = onlineUsers.findIndex(u => u._id === userId);
        onlineUsers.splice(userIndex, 1);

        console.log('User is disconnected!');
    })
});

socketServer.listen(socketPORT, () => console.log(`Socket server is listening at port: ${socketPORT}`));

app.listen(config.port, () => console.log(`Server is listening to port ${config.port}`));

