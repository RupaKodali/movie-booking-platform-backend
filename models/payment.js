const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const Booking = require('./booking');

const Payment = sequelize.define('Payment', {
    payment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    "3p_order_id" :{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Booking,
            key: 'booking_id'
        }
    },
    payment_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Pending', 'Completed', 'Failed']]
        }
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Credit Card', 'Debit Card', 'PayPal', 'Net Banking']]
        }
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    is_archive:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
});

module.exports = Payment;
