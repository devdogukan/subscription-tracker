import mongoose from 'mongoose';
import { findUserByEmail, createUser } from '../repositories/user.repository.js';
import { hashPassword, generateToken } from '../utils/auth.utils.js';

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
