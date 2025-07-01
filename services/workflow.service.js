import dayjs from 'dayjs';

import { STATUS, REMINDER_DAYS_VALUES } from '../enums/index.js';

import * as subscriptionService from './subscription.service.js';
import { sendReminderEmail } from '../utils/send-email.js';

export const sendReminders = async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== STATUS.ACTIVE) return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    console.log(REMINDER_DAYS_VALUES)
    for (const daysBefore of REMINDER_DAYS_VALUES) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    }
};

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return subscriptionService.getSubscriptionById(subscriptionId);
    });
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription
        });
    });
}