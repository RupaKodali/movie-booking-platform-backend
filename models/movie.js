const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Movie = sequelize.define('Movie', {
    movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.ENUM,
        values: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Science Fiction', 'Documentary'],
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    is_archive:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
});

module.exports = Movie;
