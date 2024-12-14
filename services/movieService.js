const Movie = require('../models/movie');
const Screen = require('../models/screen');
const Show = require('../models/show');
const Theater = require('../models/theater');
const moment = require('moment');
const { Op } = require('sequelize');

// Get all movies service
const getAllMovies = async (req, res) => {
    const query = req.query
    try {
        const movies = await Movie.findAll({
            where: {
                is_archive: false,
                ...query
            }
        });
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

//get all movies in a theater by theatre_id
const getMoviesByTheater = async (req, res) => {
    const { id } = req.params;
    const { date } = req.query;
    // Validate the theater ID
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Theater ID must be provided'
        });
    }

    // Parse the search date
    const searchDate = date ? moment(date) : moment();
    if (!searchDate.isValid()) {
        return res.status(400).json({
            success: false,
            message: 'Invalid date format, please provide a valid date'
        });
    }


    // Define show time filter
    const showTimeQuery = {
        show_time: {
            [Op.between]: [
                searchDate.startOf('day').toDate(),
                searchDate.endOf('day').toDate()
            ]
        },
        is_archive: false
    };

    try {
        // Fetch the theater along with its movies and their shows
        const result = await Theater.findOne({
            where: { theater_id: id },
            include: []
        });

        const movies = await Movie.findAll({
            where: { is_archive: false },
            attributes: ["movie_id", "title", "genre", "duration", "rating"],
            include: [{
                model: Show,
                where: {...showTimeQuery,theater_id:id},
                include: [
                    {
                        model: Screen,
                        attributes: ['screen_id', 'screen_number', 'seating_capacity'],
                        where: { is_archive: false }
                    }
                ]
            }]
        });

        // Check if the theater was found
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Theater not found or no movies available'
            });
        }

        // Transform the result to the desired format
        const response = {
            theater_id: result.theater_id,
            theater_name: result.theater_name,
            location: result.location,
            is_archive: result.is_archive,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            Movies: movies
        };
        return res.status(200).json(response);

    } catch (error) {
        console.log(error)

        console.error('Error in getMoviesByTheater:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};




// Get movies by Id
const getMovieById = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movies = await Movie.findOne({
            where: {
                movie_id: movieId,
                is_archive: false
            }
        });
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new movie service (admin only)
const createMovie = async (req, res) => {
    const { title, genre, duration, rating } = req.body;

    try {
        const movie = await Movie.create({
            title,
            genre,
            duration,
            rating
        });
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a new movie service (admin only)
const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        await movie.update(req.body);
        res.status(200).json(movie);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
};
// get all genres
const getGenres = (req, res) => {
    try {
        // Extract the enum values for genre
        const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Science Fiction', 'Documentary']

        // Send the list of genres in response
        res.status(200).json({
            success: true,
            genres
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch genres',
            error: error.message
        });
    }
};


module.exports = {
    getAllMovies,
    createMovie,
    updateMovie,
    getMovieById,
    getGenres,
    getMoviesByTheater
};
