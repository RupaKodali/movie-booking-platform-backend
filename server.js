const express = require('express');
const sequelize = require('./config');
const setupAssociations = require('./models/associations');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const screenRoutes = require('./routes/screenRoutes');
const showRoutes = require('./routes/showRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());

// Setup model associations
setupAssociations();

// Sync models with the database
sequelize.sync({ force: false }).then(() => {
    console.log("Database synced with associations");
});

// Use the routes
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/screens', screenRoutes);
app.use('/shows', showRoutes);
app.use('/theaters', theaterRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
