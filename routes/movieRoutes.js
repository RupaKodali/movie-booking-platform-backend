const express = require('express');
const router = express.Router();
const movieService = require('../services/movieService');
const {verifyToken,verifyAdminToken} = require('../middleware/auth');

// Get all movies
router.get('/', movieService.getAllMovies);

// Get movies by theaterD
router.get('/theatres/:id', movieService.getMoviesByTheater);

// Get all generes
router.get('/genres', movieService.getGenres);

// Get movie by id
router.get('/:id', movieService.getMovieById);

// Create a new movie (for admins)
router.post('/', verifyAdminToken, movieService.createMovie);

// Update a movie (for admins)
router.post('/:id', verifyAdminToken, movieService.updateMovie);

module.exports = router;
