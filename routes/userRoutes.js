const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const {verifyToken,verifyAdminToken} = require('../middleware/auth');

// User registration
router.post('/register', userService.registerUser);

// User login
router.post('/login', userService.loginUser);

router.post('/logout', verifyToken, userService.logoutUser);


router.get('/:id', verifyToken, userService.getUserById);

router.get('/', verifyAdminToken, userService.getAllUsers);


module.exports = router;
