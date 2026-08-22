import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect middleware:
 * Verifies JWT from the Authorization header (Bearer token), decodes it,
 * fetches the user from the database, and attaches it to req.user.
 * If token is missing, invalid, or expired, returns 401.
 */
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Decode token using JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from DB (assuming payload contains { id: userId })
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Not authorized: User not found' });
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            return res.status(401).json({ success: false, message: 'Not authorized: Invalid or expired token' });
        }
    } else {
        return res.status(401).json({ success: false, message: 'Not authorized: No token provided' });
    }
};

/**
 * Authorize middleware:
 * A higher-order function that takes allowed roles (e.g. 'admin') and 
 * checks req.user.role against them. 
 * Must run after the protect middleware.
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ success: false, message: 'Forbidden: No role found on user' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource`,
            });
        }
        
        next();
    };
};
