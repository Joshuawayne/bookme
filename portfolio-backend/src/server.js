/**
 * ===================================================================
 * SERVER ENTRY POINT
 * ===================================================================
 * This is the main entry point for the portfolio's backend application.
 * Its responsibilities include handling API requests for dynamic features like
 * currency conversion, contact form submissions, proposal generation, and AI chatbot interaction.
 */

// --- 1. Import Dependencies ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- 2. Initialize Clients & Express App ---
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase Client
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Initialize Google Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- 3. Setup Middleware ---
app.use(cors());
app.use(express.json());

// --- 4. Configure Nodemailer Transporter ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ===================================================================
// --- 5. API ENDPOINTS ---
// ===================================================================

/**
 * Endpoint: GET /api/rates
 * Purpose: Acts as a proxy for the currency conversion API to avoid browser CORS issues.
 */
app.get('/api/rates', async (req, res) => {
  try {
    const response = await axios.get('https://api.frankfurter.app/latest?from=USD');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in /api/rates:', error.message);
    res.status(500).json({ message: 'Failed to retrieve currency rates.' });
  }
});

/**
 * Endpoint: POST /api/chatbot/message
 * Purpose: Handles messages from the frontend chatbot, sends them to Gemini, and returns the response.
 */
app.post('/api/chatbot/message', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'A message is required.' });
  }

  try {
    const chat = geminiModel.startChat();
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    res.status(200).json({ response: text });
  } catch (error) {
    console.error('ERROR in Gemini API call:', error);
    res.status(500).json({ message: 'An error occurred with the AI assistant.' });
  }
});

/**
 * Endpoint: POST /api/contact
 * Purpose: Handles submissions from the main contact form, saves them to the DB, and sends an email notification.
 */
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  try {
    const { error: dbError } = await supabase
      .from('messages')
      .insert([{ name, email, subject, message, status: 'unread' }]);
    if (dbError) throw new Error(`Database Error: ${dbError.message}`);

    const mailToSelf = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.YOUR_PERSONAL_EMAIL,
      subject: `New Contact Message: ${subject || 'No Subject'}`,
      replyTo: email,
      html: `<h3>New message from portfolio:</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject || 'N/A'}</p><hr><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`
    };
    await transporter.sendMail(mailToSelf);
    
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Critical error in /api/contact:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

/**
 * Endpoint: POST /api/generate-proposal
 * Purpose: Handles submissions from the budget calculator, saves to DB, generates a PDF, and sends emails.
 */
app.post('/api/generate-proposal', async (req, res) => {
  const proposalData = req.body;
  if (!proposalData.projectType || !proposalData.budget || !proposalData.clientEmail) {
    return res.status(400).json({ message: 'Missing required proposal data.' });
  }

  try {
    // 1. Save proposal to Supabase
    const { data: savedData, error: dbError } = await supabase
      .from('proposals')
      .insert([{ client_email: proposalData.clientEmail, project_type: proposalData.projectType, selected_features: proposalData.features, estimated_budget: proposalData.budget, status: 'new' }])
      .select();
    if (dbError) throw new Error(`Database Error: ${dbError.message}`);
    console.log('Proposal saved to Supabase with ID:', savedData[0].id);

    // 2. Generate PDF in memory
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    const pdfPromise = new Promise(resolve => doc.on('end', () => resolve(Buffer.concat(buffers))));

    // Add content to PDF...
    doc.fontSize(20).font('Helvetica-Bold').text('Project Budget Estimate', { align: 'center' }).moveDown(2);
    doc.fontSize(12).font('Helvetica').text(`Prepared for: ${proposalData.clientEmail}`).text(`Date: ${new Date().toLocaleDateString()}`).moveDown();
    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(2);
    doc.font('Helvetica-Bold').text('Project Type:', { continued: true }).font('Helvetica').text(` ${proposalData.projectType.label}`).moveDown();
    if (proposalData.features.length) {
      doc.font('Helvetica-Bold').text('Selected Features:').moveDown(0.5);
      doc.font('Helvetica').list(proposalData.features.map(f => f.label), { bulletRadius: 2 }).moveDown();
    }
    doc.font('Helvetica-Bold').text('Estimated Budget Range:').font('Helvetica').text(`${proposalData.budget.min} - ${proposalData.budget.max} KES`).moveDown(3);
    doc.fontSize(10).font('Helvetica-Oblique').text('This is a preliminary estimate. A formal proposal will be provided after a detailed consultation.', { align: 'center' });
    doc.end();

    const pdfData = await pdfPromise;

    // 3. Send emails with PDF attachment
    const mailToClient = {
      from: `"Joshua Mercy" <${process.env.EMAIL_USER}>`,
      to: proposalData.clientEmail,
      subject: `Your Project Estimate | Joshua Mercy`,
      html: `<p>Hello,</p><p>Thank you for your interest. Please find a summary of your project estimate attached.</p><p>I will be in touch within 24 hours.</p><p>Best regards,<br/>Joshua Mercy</p>`,
      attachments: [{ filename: 'Project-Estimate.pdf', content: pdfData, contentType: 'application/pdf' }],
    };
    const mailToSelf = {
      from: `"Portfolio Bot" <${process.env.EMAIL_USER}>`,
      to: process.env.YOUR_PERSONAL_EMAIL,
      subject: `New Project Lead: ${proposalData.clientEmail}`,
      html: `<h3>New project lead generated.</h3><p>See attached PDF for details.</p>`,
      attachments: [{ filename: `Proposal-${proposalData.clientEmail}.pdf`, content: pdfData, contentType: 'application/pdf' }],
    };

    await transporter.sendMail(mailToClient);
    await transporter.sendMail(mailToSelf);

    res.status(200).json({ message: 'Proposal generated and sent successfully.' });
  } catch (error) {
    console.error('Critical error in /api/generate-proposal:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// --- 6. Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running and listening on http://localhost:${PORT}`);
});