import { verifyToken } from '../utils/auth.utils.js';
import { findBlacklistedToken } from '../repositories/blacklist.repository.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            const error = new Error('Access token required');
            error.statusCode = 401;
            throw error;
        }

        // Check if token is blacklisted
        const blacklistedToken = await findBlacklistedToken(token);
        if (blacklistedToken) {
            const error = new Error('Token has been invalidated');
            error.statusCode = 401;
            throw error;
        }

        // Verify token
        const decoded = verifyToken(token);
        req.user = decoded;
        next();

    } catch (error) {
        next(error);
    }
};
