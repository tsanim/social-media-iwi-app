const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const storage = require('../config/gridFsStorage');
const multer = require('multer');
const isAuth = require('../middlewares/isAuth');
const { check } = require('express-validator/check');

//init 'upload' to get uploaded file from client
const upload = multer({ storage });

router.get('/info/:userId', isAuth, usersController.getUserById);
router.get('/search', isAuth, usersController.searchUser);
router.put('/changePic', isAuth, upload.single('avatar'), usersController.changeProfilePicture);
router.put('/edit', isAuth, usersController.editUserInfo);
router.put('/changePassword', [
    check('newPassword')
        .matches(/^.*(?=.{6,})(?=.*[a-zA-Z])[a-zA-Z0-9]+$/)
        .withMessage('Password must contain at least one letter and at least one digit!')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 symbols!')
], isAuth, usersController.changePassword)
router.put('/follow/:followedUserId', isAuth, usersController.followUser);
router.put('/unfollow/:unfollowedUserId', isAuth, usersController.unfollowUser);
router.delete('/delete/:userId', usersController.deleteUser);

module.exports = router;