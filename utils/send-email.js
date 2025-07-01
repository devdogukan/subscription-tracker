import dayjs from "dayjs";
import transporter, { accountEmail } from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if (!to || !type) throw new Error('Missing required parameters');

    const template = emailTemplates.find((t) => t.label === type);

    if (!template) throw new Error('Invalid email type');

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod
    };

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error, 'Error sending email');

        console.log(`Email sent ${info.response}`);
    });
}

export const emailTemplates = [
    {
        label: '7 days before reminder',
        generateSubject: (mailInfo) => `⏰ Your ${mailInfo.subscriptionName} subscription renews in 7 days`,
        generateBody: (mailInfo) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; text-align: center; margin-bottom: 30px;">📅 Subscription Renewal Reminder</h2>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">Hi ${mailInfo.userName},</p>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        This is a friendly reminder that your <strong>${mailInfo.subscriptionName}</strong> subscription will renew in <strong>7 days</strong>.
                    </p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">Subscription Details:</h3>
                        <p style="margin: 5px 0; color: #555;"><strong>Service:</strong> ${mailInfo.subscriptionName}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Plan:</strong> ${mailInfo.planName}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Price:</strong> ${mailInfo.price}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Renewal Date:</strong> ${mailInfo.renewalDate}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Payment Method:</strong> ${mailInfo.paymentMethod}</p>
                    </div>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        Please ensure your payment method is up to date to avoid any service interruption.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #888; font-size: 14px;">
                            This is an automated reminder from your Subscription Tracker.
                        </p>
                    </div>
                </div>
            </div>
        `
    },
    {
        label: '5 days before reminder',
        generateSubject: (mailInfo) => `🔔 ${mailInfo.subscriptionName} renews in 5 days - Action Required`,
        generateBody: (mailInfo) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #ff6b35; text-align: center; margin-bottom: 30px;">🔔 Subscription Renewal Alert</h2>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">Hi ${mailInfo.userName},</p>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        Your <strong>${mailInfo.subscriptionName}</strong> subscription will renew in just <strong style="color: #ff6b35;">5 days</strong>.
                    </p>
                    
                    <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
                        <h3 style="color: #333; margin-top: 0;">Subscription Details:</h3>
                        <p style="margin: 5px 0; color: #555;"><strong>Service:</strong> ${mailInfo.subscriptionName}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Plan:</strong> ${mailInfo.planName}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Price:</strong> ${mailInfo.price}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Renewal Date:</strong> ${mailInfo.renewalDate}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Payment Method:</strong> ${mailInfo.paymentMethod}</p>
                    </div>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        <strong>Action Required:</strong> Please verify your payment method and billing information to ensure a smooth renewal process.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #888; font-size: 14px;">
                            This is an automated reminder from your Subscription Tracker.
                        </p>
                    </div>
                </div>
            </div>
        `
    },
    {
        label: '2 days before reminder',
        generateSubject: (mailInfo) => `🚨 URGENT: ${mailInfo.subscriptionName} renews in 2 days`,
        generateBody: (mailInfo) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #dc3545; text-align: center; margin-bottom: 30px;">🚨 URGENT: Subscription Renewal</h2>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">Hi ${mailInfo.userName},</p>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        <strong style="color: #dc3545;">URGENT NOTICE:</strong> Your <strong>${mailInfo.subscriptionName}</strong> subscription will renew in just <strong style="color: #dc3545;">2 days</strong>.
                    </p>
                    
                    <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
                        <h3 style="color: #333; margin-top: 0;">Subscription Details:</h3>
                        <p style="margin: 5px 0; color: #555;"><strong>Service:</strong> ${mailInfo.subscriptionName}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Plan:</strong> ${mailInfo.planName}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Price:</strong> ${mailInfo.price}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Renewal Date:</strong> ${mailInfo.renewalDate}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Payment Method:</strong> ${mailInfo.paymentMethod}</p>
                    </div>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        <strong>Immediate Action Required:</strong> If you wish to cancel or modify this subscription, please do so immediately to avoid being charged.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #888; font-size: 14px;">
                            This is an automated reminder from your Subscription Tracker.
                        </p>
                    </div>
                </div>
            </div>
        `
    },
    {
        label: '1 days before reminder',
        generateSubject: (mailInfo) => `⚠️ FINAL NOTICE: ${mailInfo.subscriptionName} renews TOMORROW`,
        generateBody: (mailInfo) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #dc3545; text-align: center; margin-bottom: 30px;">⚠️ FINAL NOTICE</h2>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">Hi ${mailInfo.userName},</p>
                    
                    <p style="color: #555; font-size: 18px; line-height: 1.6;">
                        <strong style="color: #dc3545;">FINAL NOTICE:</strong> Your <strong>${mailInfo.subscriptionName}</strong> subscription will renew <strong style="color: #dc3545;">TOMORROW</strong> (${mailInfo.renewalDate}).
                    </p>
                    
                    <div style="background-color: #f8d7da; padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid #dc3545;">
                        <h3 style="color: #dc3545; margin-top: 0; text-align: center;">⏰ RENEWING TOMORROW</h3>
                        <p style="margin: 8px 0; color: #555; font-size: 16px;"><strong>Service:</strong> ${mailInfo.subscriptionName}</p>
                        <p style="margin: 8px 0; color: #555; font-size: 16px;"><strong>Plan:</strong> ${mailInfo.planName}</p>
                        <p style="margin: 8px 0; color: #555; font-size: 16px;"><strong>Amount to be charged:</strong> <span style="color: #dc3545; font-size: 18px; font-weight: bold;">${mailInfo.price}</span></p>
                        <p style="margin: 8px 0; color: #555; font-size: 16px;"><strong>Payment Method:</strong> ${mailInfo.paymentMethod}</p>
                    </div>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        <strong>Last Chance:</strong> This is your final opportunity to cancel or modify this subscription before the automatic renewal.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #888; font-size: 14px;">
                            This is an automated reminder from your Subscription Tracker.
                        </p>
                    </div>
                </div>
            </div>
        `
    }
];
