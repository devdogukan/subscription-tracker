import { workflowClient } from '../../config/upstash.js';
import { SERVER_URL } from '../../config/env.js';

export const triggerSubscriptionReminderWorkflow = async (subscriptionId) => {
    try {
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscriptionId,
            },
            headers: {
                "content-type": "application/json"
            },
            retries: 0
        });

        return { workflowRunId };
    } catch (error) {
        console.error('Failed to trigger subscription reminder workflow:', error);
        throw error;
    }
};

export const cancelWorkflow = async (workflowRunId) => {
    try {
        await workflowClient.cancel(workflowRunId);
        console.log(`Workflow ${workflowRunId} cancelled successfully`);
    } catch (error) {
        console.error('Failed to cancel workflow:', error);
        throw error;
    }
};

export const getWorkflowStatus = async (workflowRunId) => {
    try {
        return await workflowClient.get(workflowRunId);
    } catch (error) {
        console.error('Failed to get workflow status:', error);
        throw error;
    }
};
