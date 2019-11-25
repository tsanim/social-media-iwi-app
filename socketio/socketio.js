module.exports = (express, socketio, http, socketPORT) => {
    //init socket io and socket server
    const socketServer = http.createServer(express());
    const io = socketio(socketServer);

    // Models
    const User = require('../models/User');
    const Notification = require('../models/Notification');
    const Message = require('../models/Message');
    const Room = require('../models/Room');

    let UserService = require('./UsersService');

    //init UserService
    UserService = new UserService();

    io.on('connection', (socket) => {
        console.log('User is connected!');

        //join to online users (general socket)
        socket.on('join', async ({ userId }) => {
            let onlineUsers = await UserService.addOnlineUser(userId);

            socket.emit('onlineUsers', { onlineUsers });
        });

        socket.on('onlineUsers', () => {
            // send online user to client
            socket.emit('onlineUsers', { onlineUsers: UserService.getOnlineUsers() })
        });

        socket.on('sendNotification', async ({ notificatedUserId, senderId }) => {
            const user = await User.findById(notificatedUserId).populate('notifications');
            const sender = await User.findById(senderId);
            let room = await Room.findOne({ pairUsers: { $all: [notificatedUserId, senderId] } });

            // if notificated user hasnt notifications from sender, send new notification to him
            if (!user.notifications.find(n => n.message.includes(sender.username))) {
                const notification = await Notification.create({
                    message: `${sender.username} wants to text you!`,
                    sender,
                    roomId: room._id,
                });

                user.notifications.push(notification);
                await user.save();
            }
        });

        socket.on('getMessages', async ({ curUserId, onlineUserId }) => {
            let room = await Room.findOne({ pairUsers: { $all: [curUserId, onlineUserId] } }).populate({
                path: 'messages',
                populate: {
                    path: 'creator',
                }
            });

            socket.emit('messages', { messages: room ? room.messages : [] })
        })

        //join room socket, when client send it from notification
        socket.on('joinSenderRoom', async ({ userId, senderId }) => {
            const user = await User.findById(userId).populate('notifications');
            const senderUser = await User.findById(senderId).populate('notifications');

            let room = await Room.findOne({ pairUsers: { $all: [userId, senderId] } });
            let roomId = room._doc ? room._doc._id : room._id;

            socket.join(roomId);

            const senderObject = senderUser._doc ? senderUser._doc : senderUser;
            const receiverObject = user._doc ? user._doc : user;

            socket.broadcast.to(roomId).emit('infoMessage', { text: `${receiverObject.username} has joind the chat!` });
            socket.emit('joinSenderRoom', { user: { ...senderObject, roomId } });

            user.notifications = user.notifications.filter(n => n.sender.toString() !== senderId);
            await user.save();
        });

        socket.on('joinRoom', async ({ userId, senderId }) => {
            const user = await User.findById(userId).populate('notifications');
            const senderUser = await User.findById(senderId).populate('notifications');

            let room = await Room.findOne({ pairUsers: { $all: [userId, senderId] } });
            let roomId = room._doc ? room._doc._id : room._id;

            // If does not have a room with this two users - create one
            if (!room) {
                room = await Room.create({
                    pairUsers: [userId, senderId],
                    messages: []
                });
            }

            socket.join(roomId);
            user.notifications = user.notifications.filter(n => n.sender.toString() !== senderId);
            await user.save();

            let receiverObject = user._doc ? user._doc : user;
            let senderObject = senderUser._doc ? senderUser._doc : senderUser;

            socket.broadcast.to(roomId).emit('infoMessage', { text: `${senderObject.username} has joind the chat!` });
            socket.emit('joinRoom', { user: { ...receiverObject, roomId } });
        });

        socket.on('typing', ({ username, roomId }) => {
            socket.broadcast.to(roomId).emit('typing', { username });
        });

        socket.on('stopTyping', ({ roomId }) => {
            socket.broadcast.to(roomId).emit('stopTyping');
        });

        socket.on('sendMessage', async ({ roomId, text, userId }) => {
            let message = await Message
                .create({
                    creator: userId,
                    roomId,
                    text
                });

            message = await message.populate('creator').execPopulate()

            let room = await Room.findById(roomId);
            room.messages.push(message);
            await room.save();

            io.to(roomId).emit('message', { message });
        });

        socket.on('leaveRoom', ({ roomId, username }) => {
            socket.leave(roomId);
            socket.broadcast.to(roomId).emit('infoMessage', { text: `${username} left room!` })
        })

        socket.on('disconnect', async ({ userId }) => {
            UserService.removeOnlineUser(userId);

            console.log('User is disconnected!');
        })
    });

    socketServer.listen(socketPORT, () => console.log(`Socket server is listening at port: ${socketPORT}`));
}