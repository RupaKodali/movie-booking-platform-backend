const jwt = require('jsonwebtoken');

// Middleware for token verification
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.email != 'admin@gmail.com') {
            req.userId = decoded.id; // Store user ID in the request for future use
            next(); // Proceed to the next middleware or route handler
        }
        
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized, invalid token' });
    }
};

const verifyAdminToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.email == 'admin@gmail.com') {
            req.userId = decoded.id; // Store user ID in the request for future use
            next(); // Proceed to the next middleware or route handler
        }
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized, invalid token' });
    }
};


module.exports = { verifyToken, verifyAdminToken }
