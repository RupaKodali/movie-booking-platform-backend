const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const Screen = require('./screen');
const Movie = require('./movie');
const Theater = require('./theater');

const Show = sequelize.define('Show', {
    show_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Movie,  
            key: 'movie_id'
        }
    },
    screen_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Screen,  
            key: 'screen_id'
        }
    },
    theater_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Theater,  
            key: 'theater_id'
        }
    },
    show_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    seating_capacity:{
        type: DataTypes.INTEGER
    },
    is_archive:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
    price:{
        type: DataTypes.FLOAT,
        allowNull: false
    }
},
{
    hooks: {
        beforeCreate: async (show, options) => {
            // Fetch the seating capacity from the associated Screen
            const screen = await Screen.findOne({ where: { screen_id: show.screen_id } });
            if (!screen) {
                throw new Error('Screen not found');
            }

            // Set the seating capacity for the Show
            show.seating_capacity = screen.seating_capacity;
        }
    }
});

module.exports = Show;
