const express = require('express');
const router = express.Router();
const bookingService = require('../services/bookingService');
const {verifyToken,verifyAdminToken} = require('../middleware/auth');

// Create a booking
router.post('/create', verifyToken, bookingService.createBooking);

// Get bookings by user
router.get('/user/:userId', verifyToken, bookingService.getUserBookings);

// Get all bookings
router.get('/', verifyAdminToken, bookingService.getAllBookings);
module.exports = router;
