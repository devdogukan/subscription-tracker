import { addTokenToBlacklist, findBlacklistedToken, cleanupExpiredTokens } from '../repositories/blacklist.repository.js';

export const blacklistToken = async (token, expiresAt) => {
    try {
        return await addTokenToBlacklist(token, expiresAt);
    } catch (error) {
        throw error;
    }
};

export const isTokenBlacklisted = async (token) => {
    try {
        const blacklistedToken = await findBlacklistedToken(token);
        return blacklistedToken !== null;
    } catch (error) {
        throw error;
    }
};

export const cleanupExpiredBlacklistedTokens = async () => {
    try {
        return await cleanupExpiredTokens();
    } catch (error) {
        throw error;
    }
};
