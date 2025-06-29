import { createNewUser, authenticateUser, signOutUser } from '../services/user.service.js';

export const signUp = async (req, res, next) => {
    try {
        const result = await createNewUser(req.body);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const result = await authenticateUser(req.body);

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            const error = new Error('No token provided');
            error.statusCode = 401;
            throw error;
        }

        await signOutUser(token);

        res.status(200).json({
            success: true,
            message: 'User signed out successfully'
        });

    } catch (error) {
        next(error);
    }
};