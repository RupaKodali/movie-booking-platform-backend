const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const User = require('../models/user');


// User registration service
const registerUser = async (req, res) => {
    const { name, email, phone_number, password } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name,
            email,
            phone_number,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// User login service
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// User logout service (basic token invalidation)
const logoutUser = (req, res) => {
    // Logout typically involves removing the token from the client-side
    // Here we simulate it by sending a response indicating logout success
    res.status(200).json({ message: 'Logout successful' });
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["user_id", "name", "email", "phone_number", "createdAt"],
            where: { is_archive: false }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users', error });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({
            where: { user_id: userId, is_archive: false }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user', error });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getUserById
};
