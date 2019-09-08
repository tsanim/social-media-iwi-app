const { validationResult } = require('express-validator/check');
const qs = require('query-string');

const mongoose = require('mongoose');
const conn = mongoose.connection;

const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');


function validatePost(req, res) {
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


module.exports = {
    getImage: (req, res, next) => {
        const bucket = new mongoose.mongo.GridFSBucket(conn.db);

        let id = new mongoose.mongo.ObjectID(req.params.imageId);

        let downloadStream = bucket.openDownloadStream(id);

        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        });

        downloadStream.on('error', () => {
            res.status(404).json({ message: 'Image not found!' });
        });

        downloadStream.on('end', () => {
            res.end();
        });
    },
    getAllUserPosts: async (req, res, next) => {
        try {
            const user = await User.findById(req.userId);

            const posts = await Post.find({ creator: { "$in": user._id } })
                .populate('creator')
                .populate('comments')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'creator',
                    }
                })
                .populate('likes');

            res.status(200).json({ message: 'Posts succesfully found!', posts });
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }

            next(error);
        }
    },
    getAllUserSubsPosts: async (req, res, next) => {
        try {
            const user = await User.findById(req.userId);

            const posts = await Post.find({ creator: { "$in": user.subscriptions } })
                .populate('creator')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'creator',
                    }
                })
                .populate('likes');

            res.status(200).json({ message: 'Posts succesfully found!', posts });
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }

            next(error);
        }
    },
    getPostById: async (req, res, next) => {
        try {
            const { commentId } = req.params;

            const post = await Post.findById(postId);

            res.status(200).json({ message: 'Post is found!', post });
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }

            next(error);
        }
    },
    createPost: async (req, res, next) => {
        if (validatePost(req)) {
            try {
                const reqBody = req.body;
                const newPost = Object.assign({}, reqBody, { creator: req.userId });

                if (reqBody.text && reqBody.text === '' && !req.file) {
                    let error = new Error('You can not upload post with empty text or no image!')
                    error.statusCode = 500;

                    throw error;
                }

                if (req.file) {
                    newPost.imageId = req.file.id.toString();
                }

                let post = await Post.create(newPost);
                post = await post.populate('creator').populate('likes').execPopulate();
                const user = await User.findById(post.creator).populate('post');

                user.posts.push(post._id);
                user.save();

                res.status(201).json({ message: 'Post is created succesfully!', post });

            } catch (error) {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }

                next(error);
            }
        }
    },
    editPost: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const { postId } = req.params;

            Post.findByIdAndUpdate(postId, reqBody, { new: true, useFindAndModify: false }, (err, postDoc) => {
                if (err) {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }

                    next(err);
                }

                const post = postDoc._doc;

                res.status(202).json({ message: 'Post succesfully updated!', post });
            }).populate('creator')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'creator'
                    }
                })
                .populate('likes');
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    },
    editComment: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const { commentId } = req.params;

            Comment.findByIdAndUpdate(commentId, reqBody, { new: true, useFindAndModify: false }, (err, commDoc) => {
                if (err) {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }

                    next(err);
                }

                const comment = commDoc._doc;

                res.status(202).json({ message: 'Comment succesfully updated!', post: comment.post });
            }).populate('creator')
                .populate('post')
                .populate({
                    path: 'post',
                    populate: {
                        path: 'creator'
                    }
                }).populate({
                    path: 'post',
                    populate: {
                        path: 'comments',
                        populate: {
                            path: 'creator'
                        }
                    }
                })
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    },
    deletePost: (req, res, next) => {
        try {
            const { postId } = req.params;

            Post.findByIdAndDelete(postId, async (err, post) => {
                if (err) {
                    if (!err.statuCode) {
                        err.statuCode = 500;
                    }

                    next(err);
                }

                const user = await User.findById(post.creator).populate('posts')
                    .populate('comments')
                    .populate({
                        path: 'posts',
                        populate: {
                            path: 'creator'
                        }
                    })
                    .populate({
                        path: 'posts',
                        populate: {
                            path: 'likes'
                        }
                    }).populate({
                        path: 'posts',
                        populate: {
                            path: 'comments',
                            populate: {
                                path: 'creator'
                            }
                        }
                    });

                await Comment.deleteMany({ post: post._id });

                const newUserPosts = user.posts.filter(userP => userP._id.toString() !== post.id);


                user.posts = newUserPosts;
                user.save();

                if (post.imageId) {
                    const bucket = new mongoose.mongo.GridFSBucket(conn.db);

                    let id = new mongoose.mongo.ObjectID(post.imageId);

                    bucket.delete(id);
                }

                res.status(200).json({ message: 'Post deleted!', posts: user.posts, user });
            })
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    },
    likePost: async (req, res, next) => {
        try {
            const { postId } = req.params;

            let post = await Post.findById(postId);

            if (post.likes.indexOf(req.userId) === -1) {
                post.likes.push(req.userId);
            }

            post = await post.populate('creator').populate({
                path: 'comments',
                populate: {
                    path: 'creator'
                }
            })
                .populate('likes')
                .execPopulate();

            post.save();
            res.status(200).json({ message: 'Post liked!', post });
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    },
    dislikePost: async (req, res, next) => {
        try {
            const { postId } = req.params;

            let post = await Post.findById(postId);

            if (post.likes.indexOf(req.userId) >= 0) {
                post.likes = post.likes.filter(like => like.toString() !== req.userId);
            }

            post = await post.populate('creator').populate('comments').populate({
                path: 'comments',
                populate: {
                    path: 'creator'
                }
            })
                .populate('likes')
                .execPopulate();

            post.save();
            res.status(200).json({ message: 'Post unliked!', post });
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    },
    likeComment: async (req, res, next) => {
        try {
            const { commentId } = req.params;

            let comment = await Comment.findById(commentId);
            let post = await Post.findById(comment.post).populate('creator').populate('likes').populate('comments').populate({
                path: 'comments',
                populate: {
                    path: 'creator'
                }
            });

            if (comment.likes.indexOf(req.userId) === -1) {
                comment.likes.push(req.userId);
            }

            comment = await comment.populate('creator').execPopulate();

            const indexOfLikedCom = post.comments.findIndex((c) => c._id.toString() === comment.id)

            post.comments[indexOfLikedCom] = comment;
            comment.save();
            post.save();
           
            res.status(200).json({ message: 'Comment liked!', post });
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    },
    dislikeComment: async (req, res, next) => {
        try {
            const { commentId } = req.params;

            let comment = await Comment.findById(commentId);
            let post = await Post.findById(comment.post)
                .populate('creator')
                .populate('likes')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'creator'
                    }
                });

            if (comment.likes.indexOf(req.userId) >= 0) {
                comment.likes = comment.likes.filter(like => like.toString() !== req.userId);
            }

            comment = await comment.populate('creator').execPopulate();

            const indexOfDislikedCom = post.comments.findIndex((c) => c._id.toString() === comment.id)

            post.comments[indexOfDislikedCom] = comment;

            comment.save();
            post.save();

            res.status(200).json({ message: 'Comment disliked!', post });
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    },
    getCommentLikes: async (req, res, next) => {
        try {
            const { commentId } = req.params;

            const comment = await Comment.findById(commentId).populate('likes');

            res.status(201).json({ message: 'Comment fetched likers succesfully!', likes: comment.likes });
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    },
    createComment: async (req, res, next) => {
        try {
            const { text, postId } = req.body;

            if (text === '') {
                let error = new Error('You can not make comment without text!')
                error.statusCode = 500;

                throw error;
            }

            const user = await User.findById(req.userId);
            let post = await Post.findById(postId);

            let comment = await Comment.create({ text, creator: req.userId, post: postId });
            comment = await comment.populate('creator').execPopulate();

            user.comments.push(comment._id);
            user.save();

            post.comments.push(comment._id);
            post = await post.populate('creator').populate('comments').populate('likes').populate({
                path: 'comments',
                populate: {
                    path: 'creator',
                }
            }).execPopulate();

            post.save();

            res.status(201).json({ message: 'Comment created succesfully!', post });
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    },
    deleteComment: (req, res, next) => {
        try {
            const { commentId } = req.params;

            Comment.findByIdAndDelete(commentId, async (err, comment) => {
                if (err) {
                    if (!err.statuCode) {
                        err.statuCode = 500;
                    }

                    next(err);
                }

                let user = await User.findById(comment.creator)

                let commentedPost = await Post.findById(comment.post);

                const newUserComments = user.comments.filter(userC => userC._id.toString() !== comment.id);
                const newPostComments = commentedPost.comments.filter(postC => postC._id.toString() !== comment.id);

                user.comments = newUserComments;
                user.save();

                commentedPost.comments = newPostComments;
                commentedPost = await commentedPost
                    .populate('creator')
                    .populate({
                        path: 'comments',
                        populate: {
                            path: 'creator',
                        }
                    })
                    .populate('likes')
                    .execPopulate();

                commentedPost.save();

                res.status(200).json({ message: 'Comment deleted!', post: commentedPost });
            })
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    }
}