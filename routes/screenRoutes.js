const express = require('express');
const router = express.Router();
const screenService = require('../services/screenService');
const {verifyToken,verifyAdminToken} = require('../middleware/auth');

// Get all screens for a specific theater
router.get('/theater/:theaterId', screenService.getScreensByTheater);

// Get screen by ID
router.get('/:id', screenService.getScreenById);

// Create a new screen
router.post('/', verifyAdminToken, screenService.createScreen);

// Update screen by ID
router.put('/:id', verifyAdminToken, screenService.updateScreen);

module.exports = router;
