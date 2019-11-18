const onlineUsers = [];
const roomsUsers = [];
const User = require('../models/User');
const Notification = require('../models/Notification');

const addToOnlineUsers = async (userId, socketId) => {
    
}

const addUserToRoom = async ({ room, userId, sender }) => {
    let foundUser = await User.findById(userId).populate('notifications');

    if (!room) return { error: 'Username and room are required.' };

    const user = { ...foundUser, room };

    roomsUsers.push(user);

    if (sender) {
        foundUser.notifications = foundUser.notifications.filter(n => n.sender.toString() !== sender);
        await foundUser.save();
    }

    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addToOnlineUsers, addUserToRoom, removeUser, getUser, getUsersInRoom };