import { Router } from "express";

import { sendSubscriptionReminders } from '../services/workflow/index.js';

const workflowRouter = Router();

workflowRouter.post('/subscription/reminder', sendSubscriptionReminders);

export default workflowRouter;