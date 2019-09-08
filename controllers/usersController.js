const env = process.env.NODE_ENV || 'development';

const { validationResult } = require('express-validator/check');

const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const encryption = require('../utils/encryption');
const mongoose = require('mongoose');
const conn = mongoose.connection;

const { defaultUserImage } = require('../config/config')[env];

module.exports = {
    getUserById: async (req, res, next) => {
        try {
            const userId = req.params.userId;

            const user = await User.findById(userId)
                .populate('followers')
                .populate('subscriptions')
                .populate('posts')
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                    }
                }).populate({
                    path: 'posts',
                    populate: {
                        path: 'creator',
                    }
                }).populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                        populate: {
                            path: 'creator'
                        }
                    }
                })
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'likes'
                    }
                });

            const userInfo = Object.assign({}, {
                username: user.username,
                posts: user.posts,
                comments: user.comments,
                subscriptions: user.subscriptions,
                followers: user.followers,
                imageId: user.imageId,
                id: user._id
            });

            res.status(200).json({ message: 'User is found!', user: userInfo })
        }
        catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        }
    },
    changeProfilePicture: async (req, res, next) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId);

            //delete the photo before upload with the aim to reduce old files in db
            if (req.file) {
                if (defaultUserImage !== user.imageId.toString()) {
                    const bucket = new mongoose.mongo.GridFSBucket(conn.db);

                    let id = new mongoose.mongo.ObjectID(user.imageId);

                    bucket.delete(id);
                }

                User.findByIdAndUpdate(userId, { imageId: req.file.id }, { new: true, useFindAndModify: false }, (error, userDoc) => {
                    if (error) {
                        error.statusCode = 500;

                        next(error);
                    }

                    const user = userDoc._doc;

                    delete user.hashedPassword;
                    delete user.salt;

                    res.status(202).json({ message: 'Succesfully info updated!', user });
                }).populate({
                    path: 'posts',
                    populate: {
                        path: 'creator',
                    }
                })
                    .populate('followers')
                    .populate('subscriptions')
                    .populate({
                        path: 'posts',
                        populate: {
                            path: 'comments',
                            populate: {
                                path: 'creator'
                            }
                        }
                    })
                    .populate({
                        path: 'posts',
                        populate: {
                            path: 'likes'
                        }
                    });
            } else {
                const error = new Error('No image files uploaded!');
                error.statusCode = 401;

                throw error;
            }
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }

            next(error);
        }
    },
    editUserInfo: async (req, res, next) => {
        if (validateUser(req)) {
            try {
                const userId = req.userId;
                const reqBody = req.body;

                User.findByIdAndUpdate(userId, reqBody, { new: true, useFindAndModify: false }, (error, userDoc) => {
                    if (error) {
                        error.statusCode = 500;

                        next(error);
                    }

                    const user = userDoc._doc;

                    delete user.hashedPassword;
                    delete user.salt;

                    res.status(202).json({ message: 'Succesfully info updated!', user });
                }).populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                    }
                }).populate({
                    path: 'posts',
                    populate: {
                        path: 'creator',
                    }
                })
                    .populate('followers')
                    .populate('subscriptions')
                    .populate({
                        path: 'posts',
                        populate: {
                            path: 'comments',
                            populate: {
                                path: 'creator'
                            }
                        }
                    }).populate({
                        path: 'posts',
                        populate: {
                            path: 'likes'
                        }
                    });
            } catch (error) {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }

                next(error);
            }
        }
    },
    deleteUser: async (req, res, next) => {
        try {
            const { userId } = req.params;

            await User.findByIdAndDelete(userId, (err, user) => {
                if (err) {
                    next(err);
                }

                if (!user) {
                    const error = new Error('User can not be found!');
                    error.statusCode = 500;

                    next(error);
                }

                Post.deleteMany({ creator: user.id }, function (err) {
                    if (err) {
                        next(err);
                    }
                });

                Comment.deleteMany({ creator: user.id }, function (err) {
                    if (err) {
                        next(err);
                    }
                });

                res.status(200).json({ message: 'User deleted succesfully!' });
            });
        } catch (error) {
            next(error);
        }
    },
    followUser: async (req, res, next) => {
        try {
            const { followedUserId } = req.params;

            const followedUser = await User.findById(followedUserId)
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                    }
                })
                .populate('followers')
                .populate('subscriptions')
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'creator',
                    }
                }).populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                        populate: {
                            path: 'creator'
                        }
                    }
                })
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'likes'
                    }
                });

            const user = await User.findById(req.userId)
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                    }
                })
                .populate('followers')
                .populate('subscriptions')
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'creator',
                    }
                }).populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                        populate: {
                            path: 'creator'
                        }
                    }
                })
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'likes'
                    }
                });

            followedUser.followers = pushInUserArray(followedUser.followers, user);
            user.subscriptions = pushInUserArray(user.subscriptions, followedUser)

            followedUser.save();
            user.save();

            res.status(200).json({ message: `User ${followedUser.username} is followed!`, user: followedUser, me: user });
        } catch (error) {
            next(error);
        }
    },
    unfollowUser: async (req, res, next) => {
        try {
            const { unfollowedUserId } = req.params;
            const unfollowedUser = await User.findById(unfollowedUserId)
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                    }
                }).populate({
                    path: 'posts',
                    populate: {
                        path: 'creator',
                    }
                }).populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                        populate: {
                            path: 'creator'
                        }
                    }
                })
                .populate('followers')
                .populate('subscriptions')
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'likes'
                    }
                });

            const user = await User.findById(req.userId)
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                    }
                }).populate({
                    path: 'posts',
                    populate: {
                        path: 'creator',
                    }
                }).populate({
                    path: 'posts',
                    populate: {
                        path: 'comments',
                        populate: {
                            path: 'creator'
                        }
                    }
                })
                .populate('followers')
                .populate('subscriptions')
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'likes'
                    }
                });

            unfollowedUser.followers = filterUserArray(unfollowedUser.followers, user._id.toString());
            user.subscriptions = filterUserArray(user.subscriptions, unfollowedUser._id.toString());

            unfollowedUser.save();
            user.save();

            res.status(200).json({ message: `User ${unfollowedUser.username} is unfollowed!`, user: unfollowedUser, me: user });
        } catch (error) {
            next(error);
        }
    },
    searchUser: async (req, res, next) => {
        try {
            const { searchText } = req.query;

            const users = await User.find({});

            let filteredUsers = users.filter(u => u.username.toLowerCase().startsWith(searchText.toLowerCase()));
            filteredUsers.forEach(u => {
                u.hashedPassword = undefined;
                u.salt = undefined;
                u.roles = undefined;
            });

            res.status(200).json({ foundUsers: filteredUsers });
        } catch (error) {
            next(error);
        }
    },
    changePassword: async (req, res, next) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.userId;

            const user = await User.findById(userId);

            //check if old password is not wrong
            if (!user.authenticate(oldPassword)) {
                const error = new Error('Invalid old password');
                error.statusCode = 401;

                throw error;
            }

            //validation for new password
            if (!newPassword.match(/^.*(?=.{6,})(?=.*[a-zA-Z])[a-zA-Z0-9]+$/)) {
                const error = new Error('Password must contain at least one letter and at least one digit!');
                error.statusCode = 401;

                throw error;
            } else if (newPassword.lenght < 8) {
                const error = new Error('Password must be at least 8 symbols!');
                error.statusCode = 401;

                throw error;
            }

            const newSalt = encryption.generateSalt();
            const newHashedPassword = encryption.generateHashedPassword(newSalt, newPassword);

            updatedUser = Object.assign({}, {
                salt: newSalt,
                hashedPassword: newHashedPassword,
            })


            User.findByIdAndUpdate(userId, updatedUser, { new: true, useFindAndModify: false }, (error, userDoc) => {
                if (error) {
                    error.statusCode = 500;

                    next(error);
                }

                const user = userDoc._doc;

                delete user.hashedPassword;
                delete user.salt;

                res.status(202).json({ message: 'Succesfully password changed!', user });
            }).populate({
                path: 'posts',
                populate: {
                    path: 'comments',
                }
            }).populate({
                path: 'posts',
                populate: {
                    path: 'creator',
                }
            }).populate({
                path: 'posts',
                populate: {
                    path: 'comments',
                    populate: {
                        path: 'creator'
                    }
                }
            })
                .populate('followers')
                .populate('subscriptions')
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'likes'
                    }
                });
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }

            next(error);
        }
    }
}

//Validation func with express-validator
function validateUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            message: 'Validation failed, entered data is incorrect',
            errors: errors.array()
        });

        return false;
    }

    return true;
}

//function to filter user's array of subs and etc
function filterUserArray(userArr, userId) {
    if (userArr.findIndex(obj => obj._id.toString() === userId) >= 0) {
        return userArr.filter(u => u._id.toString() !== userId);
    }

    return userArr;
}

//func to push in user's array of followers
function pushInUserArray(userArr, user) {
    if (userArr.findIndex(obj => obj._id.toString() === user._id.toString()) === -1) {
        delete user.hashedPassword;
        delete user.salt;

        userArr.push(user);
        return userArr;
    }

    return userArr;
}