const Screen = require('../models/screen');

// Get all screens for a specific theater
exports.getScreensByTheater = async (req, res) => {
    try {
        const screens = await Screen.findAll({
            where: { theater_id: req.params.theaterId, is_archive:false }
        });
        res.status(200).json(screens);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching screens', error });
    }
};

// Get screen by ID
exports.getScreenById = async (req, res) => {
    try {
        const screen = await Screen.findOne({
            where: {
                screen_id: req.params.id,  
                is_archive: false
            }
        });        
        if (!screen) {
            return res.status(404).json({ message: 'Screen not found' });
        }
        res.status(200).json(screen);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching screen', error });
    }
};

// Create a new screen
exports.createScreen = async (req, res) => {
    try {
        const newScreen = await Screen.create(req.body);
        res.status(201).json(newScreen);
    } catch (error) {
        res.status(500).json({ error: 'Error creating screen', error });
    }
};

// Update a screen
exports.updateScreen = async (req, res) => {
    try {
        const screen = await Screen.findByPk(req.params.id);
        if (!screen) {
            return res.status(404).json({ message: 'Screen not found' });
        }
        await screen.update(req.body);
        res.status(200).json(screen);
    } catch (error) {
        res.status(500).json({ error: 'Error updating screen', error });
    }
};

