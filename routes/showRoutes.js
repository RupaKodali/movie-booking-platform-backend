const express = require('express');
const router = express.Router();
const showService = require('../services/showService');
const {verifyToken,verifyAdminToken} = require('../middleware/auth');

// Get all shows for a screen
router.get('/movies/:movieId/theaters/:theaterId', showService.getMovieShowsInTheater);

// Get show by ID
router.get('/:id', showService.getShowById);

// Create a new show
router.post('/', verifyAdminToken, showService.createShow);

// Update a show by ID
router.put('/:id', verifyAdminToken, showService.updateShow);


module.exports = router;
