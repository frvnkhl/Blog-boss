const express = require('express');
const UserController = require('../controllers/userController');
require('../authentication/authStrategies');

const router = express.Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/logout', UserController.logoutUser);
router.get('/profile', UserController.getProfile);

module.exports = router;