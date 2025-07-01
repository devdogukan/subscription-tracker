import * as workflowServices from '../services/workflow.service.js';

export const sendReminders = async (req, res, next) => {
    try {
        return await workflowServices.sendReminders();
    } catch (error) {
        next(error);
    }
};