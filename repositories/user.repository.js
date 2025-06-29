import User from '../models/user.model.js';

export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const createUser = async (userData, session = null) => {
    const options = session ? { session } : {};
    const users = await User.create([userData], options);
    return users[0];
};

export const findAllUsers = async () => {
    return await User.find({}).select('-password');
};

export const findUserById = async (userId) => {
    return await User.findById(userId).select('-password');
};

export const updateUser = async (userId, updateData) => {
    return await User.findByIdAndUpdate(
        userId, 
        updateData, 
        { new: true, runValidators: true }
    ).select('-password');
};

export const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};
