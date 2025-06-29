import mongoose from 'mongoose';
import { findUserByEmail, createUser } from '../repositories/user.repository.js';
import { hashPassword, generateToken, comparePassword, verifyToken } from '../utils/auth.utils.js';
import { addTokenToBlacklist } from '../repositories/blacklist.repository.js';

export const createNewUser = async (userData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = userData;

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = await createUser(
            { name, email, password: hashedPassword },
            session
        );

        // Generate token
        const token = generateToken(newUser._id);

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

    const user = await findUserByEmail(email);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        const error = new Error('Invalid password');
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(user._id);

    return {
        token,
        user
    }
};

export const signOutUser = async (token) => {
    try {
        // Verify token is valid
        const decoded = verifyToken(token);
        
        // Add token to blacklist
        await addTokenToBlacklist(token, decoded.exp);

        return { success: true };

    } catch (error) {
        throw error;
    }
};
