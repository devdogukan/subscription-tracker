import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import authenticateTokenMiddleware from '../middlewares/auth.middleware.js';

const userRouter = Router();

// Apply authentication middleware to all routes
userRouter.use(authenticateTokenMiddleware);

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUser);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;