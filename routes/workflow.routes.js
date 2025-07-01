import { Router } from "express";

import * as workflowController from '../controllers/workflow.controller.js';

const workflowRouter = Router();

workflowRouter.post('/subscription/reminder`', workflowController.sendReminders);

export default workflowRouter;