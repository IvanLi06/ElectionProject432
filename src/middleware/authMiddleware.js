const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
 
    // Ensure the token follows the 'Bearer <token>' format
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = decoded;  // Store decoded user info in req.user
        next();
    });
};

// Middleware to check if the user has an allowed role
exports.checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.userTypeID)) {
            return res.status(403).json({ error: 'Access forbidden: Insufficient permissions' });
        }
        next();
    };
};