import * as subscriptionService from '../services/subscription.service.js';

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await subscriptionService.getAllSubscriptions();

        res.status(200).json({
            success: true,
            message: "Subscriptions retrieved successfully",
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
}

export const getSubscription = (req, res, next) => {

}

export const createSubscription = async (req, res, next) => {
    try {
        const subscriptionData = req.body;
        const userId = req.user._id;

        const newSubscription = await subscriptionService.createSubscription(subscriptionData, userId);

        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: newSubscription
        });
    } catch (error) {
        next(error);
    }
}

export const updateSubscription = (req, res, next) => {

}

export const deleteSubscription = (req, res, next) => {

}

export const getAllUserSubscriptions = (req, res, next) => {

}

export const cancelSubscription = (req, res, next) => {

}

export const getAllUpcomingRenewalSubscriptions = (req, res, next) => {

}