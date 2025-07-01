import { NODE_ENV } from "../config/env.js";

const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };

        error.statusCode = err.statusCode || 500;
        error.message = err.message || 'Internal Server Error';

        // Mongose bad ObjectId
        if (err.name === 'CastError') {
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key error
        if (err.code === 11000) {
            const message = `Duplicate field value entered: ${err.keyValue.name}`;
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            error = new Error(message);
            error.statusCode = 400;
        }

        res.status(error.statusCode).json({
            success: false,
            error: error.message,
            stack: NODE_ENV === 'development' ? err.stack : undefined
        });

    } catch (error) {
        next(error);
    }  
};

export default errorMiddleware;