const jwt = require('jsonwebtoken');

/**
 * Middleware to check for a valid JWT and attach user data to the request.
 * If authentication fails, it sends a 401 Unauthorized response.
 */
const authenticateToken = (req, res, next) => {
    // Check for the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        // No token provided, block access
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Token is invalid, expired, or tampered with
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        
        // Token is valid! Attach the decoded user payload to the request
        req.user = user; 
        
        // Proceed to the next middleware or route handler
        next(); 
    });
};

module.exports = authenticateToken;