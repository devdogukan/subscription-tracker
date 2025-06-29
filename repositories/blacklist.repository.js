import BlacklistedToken from '../models/blacklistedToken.model.js';

export const addTokenToBlacklist = async (token, expiresAt) => {
    const blacklistedToken = new BlacklistedToken({
        token,
        expiresAt: new Date(expiresAt * 1000)
    });

    return await blacklistedToken.save();
};

export const findBlacklistedToken = async (token) => {
    return await BlacklistedToken.findOne({ token });
};

export const cleanupExpiredTokens = async () => {
    return await BlacklistedToken.deleteMany({
        expiresAt: { $lt: new Date() }
    });
};
