import { verifyToken } from '../utils/auth.utils.js';
import { isTokenBlacklisted } from '../services/blacklist.service.js';

const authenticateTokenMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            const error = new Error('Access token required');
            error.statusCode = 401;
            throw error;
        }

        // Check if token is blacklisted
        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) {
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

export default authenticateTokenMiddleware;
