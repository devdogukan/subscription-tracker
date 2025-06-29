import { createNewUser, authenticateUser } from '../services/user.service.js';

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

export const signOut = async (req, res, next) => { };