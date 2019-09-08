const env = process.env.NODE_ENV || 'development';

const User = require('../models/User');
const encryption = require('../utils/encryption');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const cleanUserObj = require('../utils/cleanUserObj');

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

module.exports = {
    signIn: (req, res, next) => {
        if (validateUser(req, res)) {
            const { email, password } = req.body;

            User.findOne({ email: email })
                .populate('followers')
                .populate('subscriptions')
                .then(user => {
                    if (!user) {
                        const error = new Error('A user with this email can not be found!');
                        error.statusCode = 401;

                        throw error;
                    }

                    if (!user.authenticate(password)) {
                        const error = new Error('Invalid password');
                        error.statusCode = 401;

                        throw error;
                    }

                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    },
                        'sUpeRsEcReTkeY');

                    res.status(200).json({
                        message: 'User succesfully logged in!',
                        user: cleanUserObj(user._doc),
                        token
                    });
                }).catch(error => {
                    if (!error.statusCode) {
                        error.statusCode = 500;
                    }

                    next(error);
                })
        }
    },
    signUp: (req, res, next) => {
        if (validateUser(req, res)) {
            const { username, email, firstName, lastName, password } = req.body;
            const salt = encryption.generateSalt();
            const hashedPassword = encryption.generateHashedPassword(salt, password);

            User.create({
                username,
                email,
                firstName,
                lastName,
                salt,
                hashedPassword,
                roles: ['User']
            })
            .then((user) => {
                res.status(201).json({ message: 'User succesfully logged in!' });
            }).catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }

                next(err);
            })
        }
    },

}