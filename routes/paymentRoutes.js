const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const {verifyToken,verifyAdminToken} = require('../middleware/auth');

// Make a payment
router.post('/pay', verifyToken, paymentService.processPayment);

module.exports = router;
