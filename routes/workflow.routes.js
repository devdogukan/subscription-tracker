import { Router } from "express";

import { sendRemindersWorkflow } from '../controllers/workflow.controller.js';

const workflowRouter = Router();

workflowRouter.post('/subscription/reminder', sendRemindersWorkflow);

export default workflowRouter;