const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const Theater = require('./theater');

const Screen = sequelize.define('Screen', {
    screen_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    screen_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    seating_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    theater_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Theater,  
            key: 'theater_id'
        }
    },
    is_archive:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
});

module.exports = Screen;
