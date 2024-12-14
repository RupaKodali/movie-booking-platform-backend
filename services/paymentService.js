const Booking = require('../models/booking');
const Payment = require('../models/payment');

// Process payment service
const processPayment = async (payment) => {
    const { booking_id, payment_amount, payment_status, payment_method ,order_id} = payment;

    try {
        const booking = await Booking.findByPk(booking_id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const payment = await Payment.create({
            booking_id,
            payment_amount,
            payment_status,
            payment_method,
            "3p_order_id":order_id,
            payment_date: new Date()
        });

        if(payment){
            return true;
        }
        return false;
        // res.status(201).json(payment);
    } catch (error) {
        console.log(error)
        console.log({messgae:'Internal server error', error})
        // res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    processPayment
};
