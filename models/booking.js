const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const User = require('./user');
const Show = require('./show');

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        },
        allowNull: false
    },
    show_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Show,
            key: 'show_id'
        },
        allowNull: false
    },
    booking_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    num_tickets: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_archive:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    hooks: {
        afterCreate: async (booking, options) => {
            // Update seating capacity in the Show model
            await Show.update(
                { seating_capacity: sequelize.literal(`seating_capacity - ${booking.num_tickets}`) },
                { where: { show_id: booking.show_id } }
            );
        }
    }
});

module.exports = Booking;
