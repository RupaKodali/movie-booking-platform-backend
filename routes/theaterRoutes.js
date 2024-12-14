const express = require('express');
const router = express.Router();
const theaterService = require('../services/theaterService');
const {verifyToken,verifyAdminToken} = require('../middleware/auth');

// Get all theaters
router.get('/',  theaterService.getAllTheaters);

// Get all theaters with screen details
router.get('/admin/list',verifyAdminToken,  theaterService.getAllTheaterWithScreenCount);

// Get theater and screen info by ID
router.get('/:id/screens', theaterService.getTheaterWithScreens);

// Get theaters by movieiD
router.get('/movies/search', theaterService.getSearchResults);

// Get theaters by movieiD OR movies by theaterD
router.get('/movies/:id', theaterService.getTheatersbyMovie);

// Get theater by ID
router.get('/:id',  theaterService.getTheaterById);

// Create new theater
router.post('/', verifyAdminToken, theaterService.createTheater);

// Update theater by ID
router.put('/:id', verifyAdminToken, theaterService.updateTheater);


module.exports = router;
