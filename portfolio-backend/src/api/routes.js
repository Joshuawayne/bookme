/**
 * @module routes
 * @description Defines all API endpoints for the application. This is the "front door" for our backend.
 * It follows the controller pattern, orchestrating calls to various services.
 */
const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // Import before usage
const supabase = require('../services/supabaseService');
const emailService = require('../services/emailService');
const geminiService = require('../services/geminiService');
const { createProposalPDF } = require('../services/pdfService');
const chatLogService = require('../services/chatLogService');

/**
 * CORS configuration
 */
const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      origin === 'http://localhost:5173' ||
      origin === 'https://kikoi.vercel.app' ||
      origin === 'https://joshua-portfolio-backend.onrender.com'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

/**
 * Rate limiting middleware
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Middleware
 */
router.use(cors(corsOptions));
router.use(apiLimiter);

/**
 * Routes
 */

/**
 * Endpoint: GET /api/rates
 * Acts as a secure proxy to fetch currency rates, avoiding browser CORS issues.
 */
router.get('/rates', async (req, res, next) => {
  try {
    // Get the rates from your data source (e.g., an external API or database)
    const rates = {
      amount: 1,
      base: 'USD',
      date: new Date().toISOString().split('T')[0],
      rates: {
        KES: 150.00, // Kenya Shilling
        USD: 1.00,   // US Dollar
        EUR: 0.85,   // Euro
        GBP: 0.75    // British Pound
      }
    };

    res.json(rates);
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ error: 'Failed to fetch currency rates' });
  }
});

/**
 * Endpoint: POST /api/contact
 * Handles submissions from the main contact form.
 */
router.post('/contact', async (req, res, next) => {
  try {
    console.log('Contact form submission received...');
    const formData = req.body;

    if (!formData.name || !formData.email || !formData.message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const { data: savedData, error: dbError } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          status: 'new',
        },
      ])
      .select();

    if (dbError) throw new Error(`Database Error: ${dbError.message}`);

    await emailService.sendContactNotification(formData);

    res.status(200).json({
      success: true,
      message: 'Message received successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Endpoint: POST /api/generate-proposal
 * Handles proposal generation requests.
 */
router.post('/generate-proposal', async (req, res, next) => {
  try {
    const proposalData = req.body;

    if (!proposalData.clientEmail || !proposalData.projectType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required proposal data.',
      });
    }

    const { data: savedData, error: dbError } = await supabase
      .from('proposals')
      .insert([
        {
          client_email: proposalData.clientEmail,
          project_type: proposalData.projectType,
          selected_features: proposalData.features,
          estimated_budget: proposalData.budget,
          status: 'new',
        },
      ])
      .select();

    if (dbError) throw new Error(`Database Error: ${dbError.message}`);

    const pdfData = await createProposalPDF(proposalData);

    await emailService.sendProposalToClient(proposalData.clientEmail, pdfData);
    await emailService.sendProposalNotificationToSelf(proposalData, pdfData);

    res.status(200).json({
      success: true,
      message: 'Proposal generated and sent successfully.',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Endpoint: POST /api/chatbot/message
 * Handles chatbot messages and generates AI responses.
 */
router.post('/chatbot/message', async (req, res, next) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    const userMessage = await chatLogService.logMessage(userId, message);

    const prompt = `
      You are the virtual assistant for a professional portfolio website.
      The user asked: "${message}"
      
      Please respond in a professional manner, maintaining the portfolio owner's brand voice.
      If the inquiry requires personal attention, suggest scheduling a consultation.
    `;

    const aiResponse = await geminiService.generateResponse(prompt);

    const aiMessage = await chatLogService.logAIResponse(userId, aiResponse, userMessage.id);

    await emailService.sendChatNotification({
      userId,
      message,
      aiResponse,
      subject: 'New Portfolio Chat Message',
    });

    res.json({
      success: true,
      response: aiResponse,
      conversationId: userMessage.id,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Endpoint: GET /api/chatbot/history/:userId
 * Retrieves conversation history for a user.
 */
router.get('/chatbot/history/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const history = await chatLogService.getConversationHistory(userId);
    res.json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Error handling
 */
const errorHandler = (error, req, res, next) => {
  console.error(`Error in ${req.path}:`, error);
  res.status(500).json({
    success: false,
    error: 'An internal server error occurred.',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
};

module.exports = { router, errorHandler, corsOptions, apiLimiter };
