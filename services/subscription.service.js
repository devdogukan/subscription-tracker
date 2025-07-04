import mongoose from 'mongoose';
import { triggerSubscriptionReminderWorkflow } from './workflow/workflow-client.service.js';
import * as subscriptionRepository from '../repositories/subscription.repository.js';

export const createSubscription = async (subscriptionData, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const subscriptionWithUser = {
            ...subscriptionData,
            user: userId
        };

        const newSubscription = await subscriptionRepository.createSubscription(subscriptionWithUser, session);

        const { workflowRunId } = await triggerSubscriptionReminderWorkflow(newSubscription.id);

        await session.commitTransaction();
        session.endSession();

        return {
            subscription: newSubscription,
            workflowRunId
        };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const getAllSubscriptions = async () => {
    try {
        const subscriptions = await subscriptionRepository.findAllSubscriptions();
        return subscriptions.map(subscription => ({
            _id: subscription._id,
            name: subscription.name,
            price: subscription.price,
            currency: subscription.currency,
            frequency: subscription.frequency,
            category: subscription.category,
            paymentMethod: subscription.paymentMethod,
            status: subscription.status,
            startDate: subscription.startDate,
            user: {
                _id: subscription.user._id,
                name: subscription.user.name,
                email: subscription.user.email
            },
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
            renewalDate: subscription.renewalDate
        }));
    } catch (error) {
        throw error;
    }
}

export const getAllUserSubscriptions = async (userId, requestingUserId) => {
    try {
        if (requestingUserId.toString() !== userId.toString()) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 403;
            throw error;
        }

        const userSubscriptions = await subscriptionRepository.findSubscriptionsByUserId(requestingUserId);
        return userSubscriptions.map(subscription => ({
            _id: subscription._id,
            name: subscription.name,
            price: subscription.price,
            currency: subscription.currency,
            frequency: subscription.frequency,
            category: subscription.category,
            paymentMethod: subscription.paymentMethod,
            status: subscription.status,
            startDate: subscription.startDate,
            user: {
                _id: subscription.user._id,
                name: subscription.user.name,
                email: subscription.user.email
            },
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
            renewalDate: subscription.renewalDate
        }));
    } catch (error) {
        throw error;
    }
}

export const getSubscriptionById = async (subscriptionId) => {
    try {
        const subscription = await subscriptionRepository.findSubscriptionById(subscriptionId);

        if (!subscription) {
            const error = new Error('Subscription not found!');
            error.status = 404;
            throw error;
        }

        return {
             _id: subscription._id,
            name: subscription.name,
            price: subscription.price,
            currency: subscription.currency,
            frequency: subscription.frequency,
            category: subscription.category,
            paymentMethod: subscription.paymentMethod,
            status: subscription.status,
            startDate: subscription.startDate,
            user: {
                _id: subscription.user._id,
                name: subscription.user.name,
                email: subscription.user.email
            },
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
            renewalDate: subscription.renewalDate
        }
    } catch (error) {
        throw error;
    }
}