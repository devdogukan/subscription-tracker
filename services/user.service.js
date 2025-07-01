import mongoose from 'mongoose';
import * as userRepository from '../repositories/user.repository.js';
import * as authUtils from '../utils/auth.utils.js';
import * as blacklistService from './blacklist.service.js';

export const createNewUser = async (userData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = userData;

        // Check if user already exists
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const hashedPassword = await authUtils.hashPassword(password);

        // Create user
        const newUser = await userRepository.createUser(
            { name, email, password: hashedPassword },
            session
        );

        // Generate token
        const token = authUtils.generateToken(newUser._id);

        await session.commitTransaction();
        session.endSession();

        return {
            token,
            user: newUser
        };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const authenticateUser = async (userData) => {
    const { email, password } = userData;

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const isPasswordValid = await authUtils.comparePassword(password, user.password);

    if (!isPasswordValid) {
        const error = new Error('Invalid password');
        error.statusCode = 401;
        throw error;
    }

    const token = authUtils.generateToken(user._id);

    const resultUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }

    return {
        token,
        resultUser
    }
};

export const signOutUser = async (token) => {
    try {
        // Verify token is valid
        const decoded = authUtils.verifyToken(token);
        
        // Add token to blacklist
        await blacklistService.blacklistToken(token, decoded.exp);

        return { success: true };

    } catch (error) {
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const users = await userRepository.findAllUsers();
        return users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
    } catch (error) {
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const user = await userRepository.findUserById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    } catch (error) {
        throw error;
    }
};

export const updateUserById = async (userId, updateData) => {
    try {
        const { password, ...otherData } = updateData;
        
        let finalUpdateData = otherData;
        
        if (password) {
            finalUpdateData.password = await authUtils.hashPassword(password);
        }
        
        const updatedUser = await userRepository.updateUser(userId, finalUpdateData);
        if (!updatedUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        
        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            updatedAt: updatedUser.updatedAt
        };
    } catch (error) {
        throw error;
    }
};

export const deleteUserById = async (userId) => {
    try {
        const deletedUser = await userRepository.deleteUser(userId);
        if (!deletedUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        
        return { success: true };
    } catch (error) {
        throw error;
    }
};
