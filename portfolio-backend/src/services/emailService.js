const sendChatNotification = async (data) => {
    const mailOptions = {
        from: `"Portfolio Chatbot" <${EMAIL_USER}>`,
        to: YOUR_PERSONAL_EMAIL,
        subject: `New Chat Message: ${data.subject}`,
        html: EmailTemplateBuilder.createStandardTemplate(
            'New Chat Message from Portfolio Visitor',
            `
                <div style="background: white; padding: 15px; border-left: 4px solid #ddd; margin: 10px 0;">
                    ${data.message.replace(/\n/g, '<br>')}
                </div>
                <div style="margin-top: 20px;">
                    <strong style="color: #666;">AI Response:</strong>
                    <div style="background: white; padding: 15px; border-left: 4px solid #ddd; margin: 10px 0;">
                        ${data.aiResponse.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `,
            {
                'User ID': data.userId
            }
        ),
        text: `
        New Chat Message from Portfolio Visitor

        User ID: ${data.userId}
        Message:
        ${data.message}

        AI Response:
        ${data.aiResponse}
    `
};

await EmailSender.sendWithRetry(mailOptions);
};

/**
* Sends a proposal notification to the client
* @param {string} clientEmail - The email address of the client
* @param {Buffer} pdfData - The PDF proposal data
* @returns {Promise<void>}
*/
const sendProposalToClient = async (clientEmail, pdfData) => {
const mailOptions = {
    from: `"Portfolio Proposal" <${EMAIL_USER}>`,
    to: clientEmail,
    subject: 'Your Project Proposal',
    attachments: [
        {
            filename: 'project-proposal.pdf',
            content: pdfData,
        }
    ],
    html: EmailTemplateBuilder.createStandardTemplate(
        'Your Project Proposal',
        `
            <p style="margin-bottom: 20px;">
                Thank you for your interest! Please find attached your project proposal.
            </p>
        `,
        {
            'Proposal Status': 'Generated',
            'Date Sent': new Date().toLocaleDateString()
        }
    ),
    text: `
        Your Project Proposal

        Thank you for your interest! Please find attached your project proposal.
    `
};

await EmailSender.sendWithRetry(mailOptions);
};

/**
* Sends a notification to yourself about a new proposal
* @param {Object} proposalData - The proposal data
* @param {Buffer} pdfData - The PDF proposal data
* @returns {Promise<void>}
*/
const sendProposalNotificationToSelf = async (proposalData, pdfData) => {
const mailOptions = {
    from: `"Portfolio Proposal" <${EMAIL_USER}>`,
    to: YOUR_PERSONAL_EMAIL,
    subject: `New Project Proposal: ${proposalData.projectType}`,
    attachments: [
        {
            filename: 'project-proposal.pdf',
            content: pdfData,
        }
    ],
    html: EmailTemplateBuilder.createStandardTemplate(
        'New Project Proposal',
        `
            <div style="margin-bottom: 20px;">
                <p>New proposal received from: ${proposalData.clientEmail}</p>
            </div>
        `,
        {
            'Project Type': proposalData.projectType,
            'Selected Features': proposalData.features.join(', '),
            'Estimated Budget': proposalData.budget
        }
    ),
    text: `
        New Project Proposal

        New proposal received from: ${proposalData.clientEmail}
        Project Type: ${proposalData.projectType}
        Selected Features: ${proposalData.features.join(', ')}
        Estimated Budget: ${proposalData.budget}
    `
};

await EmailSender.sendWithRetry(mailOptions);
};

// === Export Public API ===
module.exports = {
sendContactNotification,
sendChatNotification,
sendProposalToClient,
sendProposalNotificationToSelf,
logger: logger // Export logger for external use if needed
};

// === Error Handling ===
// Add global error handler for email sending
process.on('unhandledRejection', (error) => {
logger.error('Unhandled rejection in email service:', error);
});

// === Rate Limiting ===
// Add rate limiter middleware for email endpoints
router.use('/api/email', emailLimiter);

// === Testing ===
// Add test helpers if needed
class EmailServiceTestHelper {
static getTestMailOptions() {
    return {
        from: `"Test" <${EMAIL_USER}>`,
        to: YOUR_PERSONAL_EMAIL,
        subject: 'Test Email',
        text: 'This is a test email',
        html: '<p>This is a test email</p>'
    };
}
}

module.exports.testHelper = EmailServiceTestHelper;