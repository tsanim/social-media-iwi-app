const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator/check');
const User = require('../models/User');

//route for signup with validation from check frome express-validator
router.post('/signup', [
    check('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 symbols!')
        .custom((value) => {
            return User.findOne({ username: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Username already exists!');
                }
            })
        }),
    check('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .custom((value) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email adress already exists!');
                }
            })
        }),
    check('firstName')
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 symbols'),
    check('lastName')
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 symbols'),
    check('password')
        .matches(/^.*(?=.{6,})(?=.*[a-zA-Z])[a-zA-Z0-9]+$/)
        .withMessage('Password must contain at least one letter and at least one digit!')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 symbols!')
], authController.signUp);

//route for signin with validation from check frome express-validator
router.post('/signin', [
    check('email')
    .isEmail()
    .withMessage('Please enter valid email!')
], authController.signIn);



module.exports = router;
