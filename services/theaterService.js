const sequelize = require('../config');
const Movie = require('../models/movie');
const Screen = require('../models/screen');
const Show = require('../models/show');
const Theater = require('../models/theater');
const moment = require('moment');
const { Op } = require('sequelize');

// Get all theaters
const getAllTheaters = async (req, res) => {
    try {
        const theaters = await Theater.findAll({ 
            where: {
            is_archive: false
        }
    });
    res.status(200).json(theaters);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching theaters', error });
    }
};

async function getAllTheaterWithScreenCount(req,res) {

    try {
        const theaters = await Theater.findAll({
            where: {
                is_archive: false
            },
            attributes: [
                'theater_id',
                'theater_name',
                'location',
                [sequelize.fn('COUNT', sequelize.col('Screens.screen_id')), 'screen_count']
            ],
            include: [{
                model: Screen,
                where: {
                    is_archive: false
                },
                attributes: [],
                required: false  // LEFT JOIN to include theaters with no screens
            }],
            group: [
                'Theater.theater_id',
                'Theater.theater_name',
                'Theater.location'
            ]
        });

        // Format the response
        const formattedTheaters = theaters.map(theater => {
            const theaterData = theater.get({ plain: true });
            return {
                theater_id: theaterData.theater_id,
                theater_name: theaterData.theater_name,
                location: theaterData.location,
                screen_count: parseInt(theaterData.screen_count),
            };
        });

        return res.json(formattedTheaters);
    } catch (error) {
        console.error('Error fetching theater and screen info:', error);
        throw error;
    }
}

async function getTheaterWithScreens(req,res) {

    try {
        let theater = await Theater.findOne({
            where: {
                theater_id:req.params.id,
                is_archive: false
            },
            attributes: [
                'theater_id',
                'theater_name',
                'location'
            ],
            include: [{
                model: Screen,
                where: {
                    is_archive: false
                },
                attributes: [
                    'screen_id',
                    'screen_number',
                    'seating_capacity'
                ],
                required: false  // LEFT JOIN to include theaters with no screens
            }],
            group: [
                'Theater.theater_id',
                'Theater.theater_name',
                'Theater.location',
                'Screens.screen_id',
                'Screens.screen_number',
                'Screens.seating_capacity'
            ]
        });

        const screenCount = await Screen.count({
            where: {
                theater_id: req.params.id,
                is_archive: false
            }
        });
        theater = JSON.parse(JSON.stringify(theater))
        theater.screen_count = screenCount
        return res.json(theater);
    } catch (error) {
        console.error('Error fetching theater and screen info:', error);
        throw error;
    }
}

// Get theater by ID
const getTheaterById = async (req, res) => {
    try {
        const theater = await Theater.findOne({
            where: {
                theater_id: req.params.id,  
                is_archive: false
            }
        });        
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        res.status(200).json(theater);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching theater', error });
    }
};

// Create a new theater
const createTheater = async (req, res) => {
    try {
        const newTheater = await Theater.create(req.body);
        res.status(201).json(newTheater);
    } catch (error) {
        res.status(500).json({ error: 'Error creating theater', error });
    }
};

// Update a theater
const updateTheater = async (req, res) => {
    try {
        const theater = await Theater.findByPk(req.params.id);
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        await theater.update(req.body);
        res.status(200).json(theater);
    } catch (error) {
        res.status(500).json({ error: 'Error updating theater', error });
    }
};

const getTheatersbyMovie = async (req, res) => {
    try {
        const {  id } = req.params;
        const { date } = req.query;
        
        // Validate movieId is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'movieId must be provided'
            });
        }

        // Validate and parse date
        const searchDate = date ? moment(date) : moment();
        if (!searchDate.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        // Query object for show time
        const showTimeQuery = {
            show_time: {
                [Op.between]: [
                    searchDate.startOf('day').toDate(),
                    searchDate.endOf('day').toDate()
                ]
            },
            is_archive: false
        };

        // Determine the query based on whether theaterId or movieId is provided
        let queryOptions = {
            where: { movie_id: id },
            include: [
                {
                    model: Theater,
                    through: { attributes: [] }, // Exclude junction table attributes
                    include: [
                        {
                            model: Show,
                            where:{
                                ...showTimeQuery, 
                            },
                            include: [
                                {
                                    model: Screen,
                                    attributes: ['screen_id','screen_number', 'seating_capacity'], // Include screen details
                                }
                            ]
                        }
                    ]
                }
            ],
            attributes: ['movie_id', 'title', 'genre', 'duration', 'rating'] // Select specific attributes from Movie
        };

        // Execute the query and return results
        const result = await Movie.findOne(queryOptions);

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error in getTheatersbyMovie:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


const getSearchResults = async (req, res) => {
    try {
        const { searchTerm, type } = req.query; // Extract searchTerm and type from query params

        // Validate that searchTerm is provided
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'searchTerm is required'
            });
        }

        // Initialize query options
        let queryOptions = {
                where: { is_archive: false }
        }

        // Determine if searching for movies or theaters
        if (type === 'movies') {
            // If searching for movies
            queryOptions.where.title = {
                [Op.like]: `%${searchTerm}%` // Case-insensitive search
            };
            // queryOptions.attributes = ['movie_id', 'title']; // Return relevant movie attributes
        } else if (type === 'theaters') {
            // If searching for theaters
            queryOptions.where.theater_name = {
                [Op.like]: `%${searchTerm}%` // Case-insensitive search
            };
            // queryOptions.attributes = ['theater_id', 'theater_name', 'location']; // Return relevant theater attributes
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid search type. Use "movies" or "theaters".'
            });
        }

        // Execute the query
        const result = await (type === 'movies' ? Movie.findAll(queryOptions) : Theater.findAll(queryOptions));

        // Return results
        return res.status(200).json(result);

    } catch (error) {
        console.error('Error in getSearchResults:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getTheatersbyMovie,
    updateTheater,
    getTheaterById,
    createTheater,
    getAllTheaters,
    getSearchResults,
    getTheaterWithScreens,
    getAllTheaterWithScreenCount
};

