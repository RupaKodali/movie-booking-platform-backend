// models/associations.js
const User = require('./user');
const Movie = require('./movie');
const Theater = require('./theater');
const Screen = require('./screen');
const Show = require('./show');
const Booking = require('./booking');
const Payment = require('./payment');

// Define associations in this file
const setupAssociations = () => {
     
     // Theater-Movie relationship through Shows
     Theater.belongsToMany(Movie, { 
        through: {
            model: Show,
            unique: false
        },
        foreignKey: 'theater_id'
    });
    Movie.belongsToMany(Theater, { 
        through: {
            model: Show,
            unique: false
        },
        foreignKey: 'movie_id'
    });

    // Screen relationships
    Theater.hasMany(Screen, { 
        foreignKey: 'theater_id',
        onDelete: 'CASCADE'
    });
    Screen.belongsTo(Theater, { 
        foreignKey: 'theater_id' 
    });

    // Show relationships
    Movie.hasMany(Show, {
        foreignKey: 'movie_id',
        onDelete: 'CASCADE'
    });
    Theater.hasMany(Show, {
        foreignKey: 'theater_id',
        onDelete: 'CASCADE'
    });
    Screen.hasMany(Show, {
        foreignKey: 'screen_id',
        onDelete: 'CASCADE'
    });
    Show.belongsTo(Movie, { 
        foreignKey: 'movie_id' 
    });
    Show.belongsTo(Theater, { 
        foreignKey: 'theater_id' 
    });
    Show.belongsTo(Screen, { 
        foreignKey: 'screen_id' 
    });

    // Booking relationships
    User.hasMany(Booking, { 
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
    });
    Show.hasMany(Booking, { 
        foreignKey: 'show_id',
        onDelete: 'CASCADE'
    });
    Booking.belongsTo(User, { 
        foreignKey: 'user_id'
    });
    Booking.belongsTo(Show, { 
        foreignKey: 'show_id'
    });

    // Payment relationships
    Booking.hasOne(Payment, { 
        foreignKey: 'booking_id',
        onDelete: 'CASCADE'
    });
    Payment.belongsTo(Booking, { 
        foreignKey: 'booking_id'
    });
};

module.exports = setupAssociations;
