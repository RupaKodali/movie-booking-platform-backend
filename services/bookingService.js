const Booking = require('../models/booking');
const Show = require('../models/show');
const Theater = require('../models/theater');
const User = require('../models/user');
const { verifyPayPalPayment } = require('../middleware/verify-payment');
const { processPayment } = require('./paymentService');
const Movie = require('../models/movie');

// Create a booking service
const createBooking = async (req, res) => {
    const { user_id, show_id, order_id, num_tickets } = req.body;

    try {
        // Step 1: Validate show
        const show = await Show.findByPk(show_id);
        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }

        // Step 2: Validate user
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 3: Calculate total amount
        const payment_amount = num_tickets * show.price;

        // Step 4: Verify PayPal payment
        const isPaymentVerified = await verifyPayPalPayment(order_id);
        if (!isPaymentVerified) {

            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Step 5: Create booking
        const booking = await Booking.create({
            user_id,
            show_id,
            num_tickets,
            booking_date: new Date()
        });

        if (!booking) {
            console.log("Error in creating booking in DB")
            res.status(500).json({ error: 'Error in creating booking  in DB' });
        }
        // Step 6: Log payment details
        let payment = await processPayment({
            booking_id: booking.booking_id,
            payment_amount,
            payment_status: 'Completed',
            payment_method: 'Credit Card',
            order_id: order_id
        })

        if (!payment) {
            console.log("Error in creating  payment in DB")
            res.status(500).json({ error: 'Error in creating  payment in DB' });
        }
        res.status(201).json(booking);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });

    }
};

// Get bookings by user service
const getUserBookings = async (req, res) => {
    const userId = req.params.userId;
    console.log("userId", userId)
        ;
    try {
        const bookings = await Booking.findAll({
            where: { user_id: userId, is_archive: false },
            include: [
                {
                    model: Show,
                    include: [
                        {
                            model: Theater,
                            attributes: ['theater_id', 'theater_name', 'location'],
                        },
                    ],
                },
            ],
        });
        console.log(bookings)
        res.status(200).json(bookings);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { is_archive: false },
            include: [{
                model: Show,
                include: [
                    {
                        model: Theater,
                        attributes: ['theater_id', 'theater_name', 'location'],
                    },
                    {
                        model: Movie,
                        attributes: ['movie_id', 'title'],
                    },
                ],
            }, {
                model: User,
                attributes: ['user_id', 'name','email','phone_number'],

            }],
        });
        res.status(200).json(bookings);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getBookingById = async (req, res) => {
    try {
        const userId = req.params.id;
        const bookings = await Booking.findOne({
            where: { user_id: userId, is_archive: false }
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching shows', error });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getBookingById,
    getAllBookings
};
