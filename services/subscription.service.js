import mongoose from "mongoose";
import * as subscriptionRepository from '../repositories/subscription.repository.js';

const createSubscription = async (subscriptionData, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const subscriptionWithUser = {
            ...subscriptionData,
            user: userId
        };

        const newSubscription = await subscriptionRepository.createSubscription(subscriptionWithUser, session);

        await session.commitTransaction();
        session.endSession();

        return newSubscription;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export { createSubscription };