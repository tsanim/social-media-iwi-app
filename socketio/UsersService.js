const User = require('../models/User');
const onlineUsers = [];

class UsersService {
    addOnlineUser = async (userId) => {
        if (!this.isUserOnline(onlineUsers, userId)) {
            const currentUser = await this.getUserById(userId);

            onlineUsers.push({ ...currentUser, room: '' });
        }

        return onlineUsers;
    }

    removeOnlineUser = (userId) => {
        const userIndex = onlineUsers.findIndex(u => u._id === userId);
        onlineUsers.splice(userIndex, 1);
    }

    getOnlineUsers = () => {
        return onlineUsers;
    }

    isUserOnline = (onlineUsers, userId) => {
        return onlineUsers.findIndex(obj => {
            return (obj._id ? obj._id.toString() : obj.id.toString()) === userId
        }) > -1;
    }

    getUserById = async (userId) => {
        let user = await User.findById(userId);

        return user._doc ? user._doc : user;
    }
}

module.exports = UsersService;