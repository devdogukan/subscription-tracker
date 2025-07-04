import * as blacklistRepository from '../repositories/blacklist.repository.js';

export const blacklistToken = async (token, expiresAt) => {
    try {
        return await blacklistRepository.addTokenToBlacklist(token, expiresAt);
    } catch (error) {
        throw error;
    }
};

export const isTokenBlacklisted = async (token) => {
    try {
        const blacklistedToken = await blacklistRepository.findBlacklistedToken(token);
        return blacklistedToken !== null;
    } catch (error) {
        throw error;
    }
};

export const cleanupExpiredBlacklistedTokens = async () => {
    try {
        return await blacklistRepository.cleanupExpiredTokens();
    } catch (error) {
        throw error;
    }
};
