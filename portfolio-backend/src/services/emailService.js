/**
 * @module emailService
 * @description Encapsulates all email sending functionality for the application.
 * This service acts as a dedicated "Post Office" for our server.
 */
const nodemailer = require('nodemailer');

// --- Transporter Configuration ---
// This is the "courier" that will deliver our emails. It's configured once
// using credentials from our .env file and reused for all email tasks.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // This should be your 16-character App Password
  },
});

/**
 * Sends a notification to you when a user submits the main contact form.
 * @param {object} formData - The data from the contact form { name, email, subject, message }.
 * @returns {Promise<void>}
 */
const sendContactNotification = async (formData) => {
  const { name, email, subject, message } = formData;
  
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.YOUR_PERSONAL_EMAIL,
    subject: `New Contact Message: ${subject || 'No Subject'}`,
    replyTo: email, // Allows you to directly reply to the user from your inbox.
    html: `<h3>New message from your portfolio contact form:</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><p><strong>Subject:</strong> ${subject || 'N/A'}</p><hr><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent successfully.');
  } catch (error) {
    console.error('Failed to send contact notification email:', error);
    // Re-throw the error so the calling function in routes.js can handle it
    throw new Error('Email sending failed.');
  }
};

/**
 * Sends the generated proposal PDF to the potential client.
 * @param {string} clientEmail - The email address of the potential client.
 * @param {Buffer} pdfData - The generated PDF file as a buffer.
 * @returns {Promise<void>}
 */
const sendProposalToClient = async (clientEmail, pdfData) => {
  const mailOptions = {
    from: `"Joshua Mercy" <${process.env.EMAIL_USER}>`, // Use your name for a professional touch
    to: clientEmail,
    subject: `Your Project Estimate | Joshua Mercy`,
    html: `<p>Hello,</p><p>Thank you for your interest in collaborating. Please find a summary of your project estimate attached to this email.</p><p>I will review your request and be in touch within 24 hours to discuss the next steps.</p><p>Best regards,<br/>Joshua Mercy</p>`,
    attachments: [{
      filename: 'Project-Estimate.pdf',
      content: pdfData,
      contentType: 'application/pdf',
    }],
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Proposal email sent successfully to client.');
  } catch (error) {
    console.error('Failed to send proposal to client:', error);
    throw new Error('Email sending failed.');
  }
};

/**
 * Sends a new lead notification with the proposal PDF to yourself.
 * @param {object} proposalData - The complete proposal data { clientEmail, projectType, features, budget }.
 * @param {Buffer} pdfData - The generated PDF file as a buffer.
 * @returns {Promise<void>}
 */
const sendProposalNotificationToSelf = async (proposalData, pdfData) => {
  const { clientEmail, projectType, features, budget } = proposalData;
  
  const mailOptions = {
    from: `"Portfolio Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.YOUR_PERSONAL_EMAIL,
    subject: `New Project Lead: ${clientEmail}`,
    html: `
      <h3>New project lead generated from your portfolio.</h3>
      <p><strong>Client Email:</strong> ${clientEmail}</p>
      <p><strong>Project Type:</strong> ${projectType.label}</p>
      <p><strong>Selected Features:</strong> ${features.map(f => f.label).join(', ')}</p>
      <p><strong>Estimated Budget:</strong> ${budget.min} - ${budget.max} KES</p>
    `,
    attachments: [{
      filename: `Proposal-${clientEmail}.pdf`,
      content: pdfData,
      contentType: 'application/pdf',
    }],
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Proposal notification email sent successfully to self.');
  } catch (error) {
    console.error('Failed to send proposal notification to self:', error);
    throw new Error('Email sending failed.');
  }
};


// =======================================================
// == THE FIX IS HERE ==
// We export an object containing all the functions defined above.
// =======================================================
module.exports = {
  sendContactNotification,
  sendProposalToClient,
  sendProposalNotificationToSelf,
};