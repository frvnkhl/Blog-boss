const express = require('express');
const UserController = require('../controllers/userController');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../authentication/authStrategies');

const router = express.Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/logout', UserController.logoutUser);
router.get('/profile', UserController.getMyProfile);
router.get('/profile/:id', UserController.getProfile);
router.patch('/newPassword', UserController.changePassword);
router.patch('/newAvatar', UserController.changeAvatar);

//Google login/registration routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/blog-boss', passport.authenticate('google', { session: false, failureRedirect: process.env.CLIENT_URL }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60,
        });
        res.status(200).redirect(`${process.env.CLIENT_URL}?token=${token}`);
    });

//facebook login/registration routes
router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60,
        });
        res.status(200).redirect(`${process.env.CLIENT_URL}?token=${token}`);
    }
);

module.exports = router;