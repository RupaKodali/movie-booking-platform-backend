const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Theater = sequelize.define('Theater', {
    theater_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    theater_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_archive:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
});

module.exports = Theater;
