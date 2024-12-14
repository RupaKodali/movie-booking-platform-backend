const Movie = require('../models/movie');
const Screen = require('../models/screen');
const Show = require('../models/show');
const moment = require('moment');
const { Op } = require('sequelize');
const Theater = require('../models/theater');

// Get all shows for a specific screen
exports.getMovieShowsInTheater = async (req, res) => {
    try {
        const { movieId, theaterId } = req.params; // Assume you pass movieId and theaterId in the request params

        // Validate inputs
        if (!movieId || !theaterId) {
            return res.status(400).json({
                success: false,
                message: 'Both movie ID and theater ID are required'
            });
        }

        // Get current date
        const searchDate = moment(); // Use the current date; you can also accept a date as a query param

        // Fetch shows for the specified movie in the specified theater
        const shows = await Show.findAll({
            where: {
                movie_id: movieId,
                theater_id: theaterId,
                // show_time: {
                //     [Op.between]: [
                //         searchDate.startOf('day').toDate(),
                //         searchDate.endOf('day').toDate()
                //     ]
                // },
                is_archive: false
            },
            include: [
                {
                    model: Movie,
                    where: {
                        movie_id: movieId,
                        is_archive: false
                    }
                },
                {
                    model: Screen,
                    where: {
                        theater_id: theaterId,
                        is_archive: false
                    }
                }
            ]
        });

        // Return the shows
        return res.status(200).json({
            success: true,
            data: shows
        });

    } catch (error) {
        console.error('Error fetching shows:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get show by ID
exports.getShowById = async (req, res) => {
    try {
        const show = await Show.findOne({
            where: {
                show_id: req.params.id,
                is_archive: false
            },
            include: [
                {
                    model: Movie
                },
                {
                    model: Theater
                }
            ]
        });
        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }
        res.status(200).json(show);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching show', error });
    }
};

// Create a new show
exports.createShow = async (req, res) => {
    const { movie_id, theater_id, screen_id ,show_time,price} = req.body;

    try {
        const screen = await Screen.findOne({screen_id:screen_id})


        const newShow = await Show.create({
            movie_id: movie_id,
            screen_id: screen_id,
            theater_id:theater_id ,
            show_time: show_time,
            seating_capacity: screen.seating_capacity,
            price: price,
        });

        res.status(201).json(newShow);
    } catch (error) {
        res.status(500).json({ error: 'Error creating show', error });
    }
};

// Update a show
// exports.updateShow = async (req, res) => {
//     try {
//         const show = await Show.findByPk(req.params.id);
//         if (!show) {
//             return res.status(404).json({ message: 'Show not found' });
//         }
//         await show.update(req.body);
//         res.status(200).json(show);
//     } catch (error) {
//         res.status(500).json({ error: 'Error updating show', error });
//     }
// };

exports.updateShow = async (req, res) => {
    try {
        const showId = req.params.id;
        const { show_time, price } = req.body;

        // Find the Show by ID
        const show = await Show.findByPk(showId, {
            include: {
                model: Screen,
                attributes: ['screen_id', 'seating_capacity'],
            },
        });

        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }

        // Update the show fields
        await show.update({
            show_time: show_time || show.show_time,
            price: price || show.price
        });

        res.status(200).json({ message: 'Show updated successfully', show });
    } catch (error) {
        console.error('Error updating show:', error);
        res.status(500).json({ message: 'Error updating show', error: error.message });
    }
};

