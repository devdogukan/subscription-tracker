import { Router } from "express";

import { sendReminders } from '../services/workflow.service.js';

const workflowRouter = Router();

workflowRouter.post('/subscription/reminder', sendReminders);

export default workflowRouter;