const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    // For development, you can use ethereal email or configure with real SMTP
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
        console.log('⚠️  Email service not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env');
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send welcome email
exports.sendWelcomeEmail = async (userEmail, userName) => {
    const transporter = createTransport();
    if (!transporter) return;

    try {
        const mailOptions = {
            from: `"Job Tracker" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Welcome to Job Tracker!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">Welcome to Job Tracker, ${userName}! 🎉</h2>
                    <p>Thank you for joining Job Tracker. We're excited to help you organize and track your job applications.</p>
                    <p>Here's what you can do:</p>
                    <ul>
                        <li>Track all your job applications in one place</li>
                        <li>Set reminders for follow-ups</li>
                        <li>Analyze your application trends</li>
                        <li>Stay organized throughout your job search</li>
                    </ul>
                    <p>Get started by adding your first job application!</p>
                    <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                        Best regards,<br>
                        The Job Tracker Team
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${userEmail}`);
    } catch (error) {
        console.error('❌ Error sending welcome email:', error.message);
    }
};

// Send reminder notification email
exports.sendReminderEmail = async (userEmail, userName, reminder) => {
    const transporter = createTransport();
    if (!transporter) return;

    try {
        const jobInfo = reminder.job
            ? `for <strong>${reminder.job.title}</strong> at <strong>${reminder.job.company}</strong>`
            : '';

        const mailOptions = {
            from: `"Job Tracker Reminders" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Reminder: ${reminder.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">🔔 Reminder Alert</h2>
                    <p>Hi ${userName},</p>
                    <p>This is a reminder ${jobInfo}:</p>
                    <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #1F2937;">${reminder.title}</h3>
                        ${reminder.description ? `<p style="color: #4B5563;">${reminder.description}</p>` : ''}
                        <p style="color: #6B7280; font-size: 14px;">
                            <strong>Due:</strong> ${new Date(reminder.reminderDate).toLocaleString()}
                        </p>
                        <p style="color: #6B7280; font-size: 14px;">
                            <strong>Priority:</strong> <span style="color: ${reminder.priority === 'High' ? '#EF4444' :
                    reminder.priority === 'Medium' ? '#F59E0B' : '#10B981'
                };">${reminder.priority}</span>
                        </p>
                    </div>
                    <p>Don't forget to take action on this reminder!</p>
                    <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                        Best regards,<br>
                        Job Tracker
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Reminder email sent to ${userEmail}`);
    } catch (error) {
        console.error('❌ Error sending reminder email:', error.message);
    }
};

// Send follow-up notification for job
exports.sendFollowUpEmail = async (userEmail, userName, job) => {
    const transporter = createTransport();
    if (!transporter) return;

    try {
        const mailOptions = {
            from: `"Job Tracker" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Follow-up Reminder: ${job.title} at ${job.company}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">📅 Follow-up Reminder</h2>
                    <p>Hi ${userName},</p>
                    <p>It's time to follow up on your application:</p>
                    <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #1F2937;">${job.title}</h3>
                        <p style="color: #4B5563;"><strong>Company:</strong> ${job.company}</p>
                        <p style="color: #4B5563;"><strong>Status:</strong> ${job.status}</p>
                        <p style="color: #4B5563;"><strong>Applied:</strong> ${new Date(job.applicationDate).toLocaleDateString()}</p>
                        ${job.jobLink ? `<p><a href="${job.jobLink}" style="color: #4F46E5;">View Job Posting</a></p>` : ''}
                    </div>
                    <p>Consider reaching out to the recruiter or checking your application status.</p>
                    <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                        Best regards,<br>
                        Job Tracker
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Follow-up email sent to ${userEmail}`);
    } catch (error) {
        console.error('❌ Error sending follow-up email:', error.message);
    }
};

// Test email configuration
exports.testEmailConfig = async () => {
    const transporter = createTransport();
    if (!transporter) {
        return { success: false, message: 'Email not configured' };
    }

    try {
        await transporter.verify();
        return { success: true, message: 'Email configuration is valid' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
