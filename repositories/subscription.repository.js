import Subscription from '../models/subscription.model.js';

export const createSubscription = async (subscriptionData, session = null) => {
    const options = session ? { session } : {};
    const subscriptions = await Subscription.create([subscriptionData], options);
    return subscriptions[0];
};

export const findAllSubscriptions = async () => {
    return await Subscription.find({}).populate('user', 'name email');
};

export const findSubscriptionById = async (subscriptionId) => {
    return await Subscription.findById(subscriptionId).populate('user', 'name email');
};

export const findSubscriptionsByUserId = async (userId) => {
    return await Subscription.find({ user: userId }).populate('user', 'name email');
};

export const updateSubscription = async (subscriptionId, updateData) => {
    return await Subscription.findByIdAndUpdate(
        subscriptionId,
        updateData,
        { new: true, runValidators: true }
    ).populate('user', 'name email');
};

export const deleteSubscription = async (subscriptionId) => {
    return await Subscription.findByIdAndDelete(subscriptionId);
};

export const findUpcomingRenewals = async (days = 7) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await Subscription.find({
        renewalDate: { $lte: futureDate },
        status: 'active'
    }).populate('user', 'name email');
};

