import cron from 'node-cron';
import { cleanupExpiredTokens } from '../repositories/blacklist.repository.js';

export const startTokenCleanupJob = () => {
    // Run cleanup every hour
    cron.schedule('0 * * * *', async () => {
        try {
            const result = await cleanupExpiredTokens();
            console.log(`Cleaned up ${result.deletedCount} expired tokens`);
        } catch (error) {
            console.error('Error during token cleanup:', error);
        }
    });
};

export const manualTokenCleanup = async () => {
    try {
        const result = await cleanupExpiredTokens();
        return {
            success: true,
            deletedCount: result.deletedCount
        };
    } catch (error) {
        throw error;
    }
};
