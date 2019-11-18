const { validationResult } = require('express-validator/check');

const mongoose = require('mongoose');
const conn = mongoose.connection;

const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

//function for validate post data from request
function validatePost(req, res) {
    //get errors (if there are) from validationResult func from express-validator 
    const errors = validationResult(req);

    //if errrors array not empty, then return message to user for incorect data
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

        //init fs bucket from mongo
        const bucket = new mongoose.mongo.GridFSBucket(conn.db);

        //get image id with req params from db
        let id = new mongoose.mongo.ObjectID(req.params.imageId);

        //init download stream
        let downloadStream = bucket.openDownloadStream(id);

        //when stream trigger 'data' event , write givven chunk to response
        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        });

        //when stream trigger 'error' event , return message that image is not found
        downloadStream.on('error', () => {
            res.status(404).json({ message: 'Image not found!' });
        });

        //when stream trigger 'end' event, end res
        downloadStream.on('end', () => {
            res.end();
        });
    },
    searchPosts: async (req, res, next) => {
        try {
            let { searchText } = req.query;
            let toLowerCaseSearchText = searchText.toLowerCase();

            const posts = await Post.find({})
                .populate('creator')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'creator',
                    }
                })
                .populate('likes');

            let filteredPosts = posts.filter(p => p.text.toLowerCase().startsWith(toLowerCaseSearchText) || p.text.toLowerCase().includes(toLowerCaseSearchText));

            res.status(200).json({ message: 'Posts are found!', foundPosts: filteredPosts });
        } catch (error) {
            next(error);
        }
    },
    getAllUserPosts: async (req, res, next) => {
        try {
            //find user by req user id prop from decoded token
            const user = await User.findById(req.userId);

            //find all posts that are with user id creator and populate their prop to user can get acces to their props from db
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
            //find user by req user id prop from decoded token
            const user = await User.findById(req.userId);

            //find all posts that are with creators which are user subscriptions list and populate their props
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
        //check post data
        if (validatePost(req)) {
            try {
                //init req body
                const reqBody = req.body;

                //assign req body object with object that contain post creator to new post object
                const newPost = Object.assign({}, reqBody, { creator: req.userId });

                //if there is no text or file - send message to user that he can not upload post with empty data
                if (reqBody.text && reqBody.text === '' && !req.file) {
                    let error = new Error('You can not upload post with empty text or no image!')
                    error.statusCode = 500;

                    throw error;
                }

                //if there is req file add image id prop to new post object 
                if (req.file) {
                    newPost.imageId = req.file.id.toString();
                }

                //create post
                let post = await Post.create(newPost);
                //populate creator and likes
                post = await post.populate('creator').populate('likes').execPopulate();
                //find user that are creator to push new post to his posts array
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
            //init req body obj
            const reqBody = req.body;
            //get post id from req params prop
            const { postId } = req.params;

            //update post with req body obj 
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
            //init req body obj
            const reqBody = req.body;
            //get comment id fromr req params 
            const { commentId } = req.params;

            //update comment
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
            //get post id from req params prop
            const { postId } = req.params;

            Post.findByIdAndDelete(postId, async (err, post) => {
                if (err) {
                    if (!err.statuCode) {
                        err.statuCode = 500;
                    }

                    next(err);
                }

                //find user that is creator to deleted post
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

                //delete all comments on deleted post
                await Comment.deleteMany({ post: post._id });

                //filter user posts
                const newUserPosts = user.posts.filter(userP => userP._id.toString() !== post.id);

                //update user posts
                user.posts = newUserPosts;
                user.save();

                //if post has a image - then remove it from db (for collecting more space)
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
            //get post id from req params
            const { postId } = req.params;

            //find post by id
            let post = await Post.findById(postId);

            //if post's likes array does not contain user id - then push user id to post likes
            if (post.likes.indexOf(req.userId) === -1) {
                post.likes.push(req.userId);
            }

            //populate creator, comments' creator, likes
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
    getPostLikes: async (req, res, next) => {
        try {
            const { postId } = req.params;

            const post = await Post.findById(postId).populate('likes');

            res.status(201).json({ message: 'Post likers fetched succesfully!', likes: post.likes });
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    },
    dislikePost: async (req, res, next) => {
        try {
            //get post id from req params
            const { postId } = req.params;

            //find post by id
            let post = await Post.findById(postId);

            //if post's likes array contain user id - then filter post's likes array
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
            //get comment id from req params
            const { commentId } = req.params;

            //find comment by id 
            let comment = await Comment.findById(commentId);

            //find post by comment post 
            let post = await Post.findById(comment.post).populate('creator').populate('likes').populate('comments').populate({
                path: 'comments',
                populate: {
                    path: 'creator'
                }
            });

            //if comment's likes array does not contain user id - then push user id to comment's likes array
            if (comment.likes.indexOf(req.userId) === -1) {
                comment.likes.push(req.userId);
            }

            comment = await comment.populate('creator').execPopulate();

            //get index of liked comment from the post
            const indexOfLikedCom = post.comments.findIndex((c) => c._id.toString() === comment.id)

            //update post comments as change old unliked comment with new - liked
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
            //get comment id from req params
            const { commentId } = req.params;

            //find comment by id 
            let comment = await Comment.findById(commentId);

            //find post by comment post 
            let post = await Post.findById(comment.post)
                .populate('creator')
                .populate('likes')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'creator'
                    }
                });

            //if comment's likes array contain user id - then filter comment's likes array
            if (comment.likes.indexOf(req.userId) >= 0) {
                comment.likes = comment.likes.filter(like => like.toString() !== req.userId);
            }

            comment = await comment.populate('creator').execPopulate();

            //get index of disliked comment 
            const indexOfDislikedCom = post.comments.findIndex((c) => c._id.toString() === comment.id)

            //update post comments as change old unliked comment with new - liked
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

            res.status(201).json({ message: 'Comment likers fetched succesfully!', likes: comment.likes });
        } catch (error) {
            if (!error.statuCode) {
                error.statuCode = 500;
            }

            next(error);
        }
    },
    createComment: async (req, res, next) => {
        try {
            //init comment data fromr req body
            const { text, postId } = req.body;

            //if text is empty string then return error
            if (text === '') {
                let error = new Error('You can not make comment without text!')
                error.statusCode = 500;

                throw error;
            }

            //find user by req user id prop from decoded token
            const user = await User.findById(req.userId);

            //find post by id
            let post = await Post.findById(postId);

            //create comment
            let comment = await Comment.create({ text, creator: req.userId, post: postId });
            comment = await comment.populate('creator').execPopulate();

            user.comments.push(comment._id);
            user.save();

            //update post's comments array like push new comment id
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
            //get comment id from req params
            const { commentId } = req.params;

            Comment.findByIdAndDelete(commentId, async (err, comment) => {
                if (err) {
                    if (!err.statuCode) {
                        err.statuCode = 500;
                    }

                    next(err);
                }

                //find user by comment creator
                let user = await User.findById(comment.creator)

                //find commented post by comment post
                let commentedPost = await Post.findById(comment.post);

                //filter user comments
                const newUserComments = user.comments.filter(userC => userC._id.toString() !== comment.id);
                //filter post comments
                const newPostComments = commentedPost.comments.filter(postC => postC._id.toString() !== comment.id);

                user.comments = newUserComments;
                user.save();

                //update post comments
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