import User from '../models/user.model.js';

export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const createUser = async (userData, session = null) => {
    const options = session ? { session } : {};
    const users = await User.create([userData], options);
    return users[0];
};

export const findUserById = async (userId) => {
    return await User.findById(userId);
};
