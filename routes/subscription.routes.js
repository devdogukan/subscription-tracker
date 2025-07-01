import { Router } from 'express';
import * as subscriptionController from '../controllers/subscription.controller.js';
import authenticateTokenMiddleware from '../middlewares/auth.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.use(authenticateTokenMiddleware);

subscriptionRouter.get('/', subscriptionController.getAllSubscriptions);
subscriptionRouter.get('/:id', subscriptionController.getSubscription);
subscriptionRouter.post('/', subscriptionController.createSubscription);
subscriptionRouter.put('/:id', subscriptionController.updateSubscription);
subscriptionRouter.delete('/:id', subscriptionController.deleteSubscription);
subscriptionRouter.get('/user/:id', subscriptionController.getAllUserSubscriptions);
subscriptionRouter.put('/:id/cancel', subscriptionController.cancelSubscription);
subscriptionRouter.get('/upcoming-renewals', subscriptionController.getAllUpcomingRenewalSubscriptions);

export default subscriptionRouter;
