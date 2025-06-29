import { createNewUser } from '../services/user.service.js';

export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const result = await createNewUser({ name, email, password });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => { };

export const signOut = async (req, res, next) => { };