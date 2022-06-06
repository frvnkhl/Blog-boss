const express = require('express');
const UserController = require('../controllers/userController');
require('../authentication/authStrategies');

const router = express.Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/logout', UserController.logoutUser);
router.get('/profile', UserController.getMyProfile);
router.get('/profile/:id', UserController.getProfile);
router.patch('/newPassword', UserController.changePassword);
router.patch('/newAvatar', UserController.changeAvatar);

module.exports = router;