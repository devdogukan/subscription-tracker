import { verifyToken } from '../utils/auth.utils.js';
import { isTokenBlacklisted } from '../services/blacklist.service.js';
import * as userService from '../services/user.service.js';

const authenticateTokenMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            const error = new Error('Unauthorized');
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

        // Check if user exists
        const user = await userService.getUserById(decoded.userId);

        if (!user) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        req.user = user;
        next();

    } catch (error) {
        next(error);
    }
};

export default authenticateTokenMiddleware;
