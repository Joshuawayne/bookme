/**
 * @module routes
 * @description Defines all API endpoints for the application. This is the "front door" for our backend.
 * It follows the controller pattern, orchestrating calls to various services.
 */
const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const supabase = require('../services/supabaseService');
const emailService = require('../services/emailService');
const geminiService = require('../services/geminiService');
const { createProposalPDF } = require('../services/pdfService');
const chatLogService = require('../services/chatLogService');

/**
 * CORS configuration
 */
const corsOptions = {
  origin: ['http://localhost:5173'], // Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

/**
 * Rate limiting middleware
 */
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

// Apply CORS to all routes
router.use(cors(corsOptions));

// Apply rate limiting to all routes
router.use(apiLimiter);

/**
 * Error handling middleware
 */
const errorHandler = (error, req, res, next) => {
  console.error(`Error in ${req.path}:`, error);
  res.status(500).json({
    success: false,
    error: 'An internal server error occurred.',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Apply CORS to all routes
router.use(cors({
    origin: ['http://localhost:5173'], // Allow requests from Vite dev server
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Apply rate limiting to chatbot endpoint
router.use('/chatbot', apiLimiter);

/**
 * Endpoint: GET /api/rates
 * Acts as a secure proxy to fetch currency rates, avoiding browser CORS issues.
 */
router.get('/rates', async (req, res, next) => {
  try {
    console.log('Request for currency rates received...');
    const response = await axios.get('https://api.frankfurter.app/latest?from=USD');
    console.log('Successfully fetched rates from Frankfurter.');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in /api/rates:', error.message);
    next(error);
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
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Save to database
    const { data: savedData, error: dbError } = await supabase
      .from('contact_messages')
      .insert([{
        name: formData.name,
        email: formData.email,
        message: formData.message,
        status: 'new'
      }])
      .select();

    if (dbError) throw new Error(`Database Error: ${dbError.message}`);

    // Send email notification
    await emailService.sendContactNotification(formData);

    res.status(200).json({
      success: true,
      message: 'Message received successfully'
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
    
    // Validate required fields
    if (!proposalData.clientEmail || !proposalData.projectType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required proposal data.'
      });
    }

    // Save proposal data to database
    const { data: savedData, error: dbError } = await supabase
      .from('proposals')
      .insert([{
        client_email: proposalData.clientEmail,
        project_type: proposalData.projectType,
        selected_features: proposalData.features,
        estimated_budget: proposalData.budget,
        status: 'new'
      }])
      .select();

    if (dbError) throw new Error(`Database Error: ${dbError.message}`);

    // Generate PDF
    const pdfData = await createProposalPDF(proposalData);

    // Send emails
    await emailService.sendProposalToClient(proposalData.clientEmail, pdfData);
    await emailService.sendProposalNotificationToSelf(proposalData, pdfData);

    res.status(200).json({
      success: true,
      message: 'Proposal generated and sent successfully.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Endpoint: POST /api/chatbot/message
 * Handles chatbot messages and generates AI responses.
 */
// In routes.js
// Update the chatbot message endpoint
router.post('/chatbot/message', async (req, res, next) => {
    try {
        const { message, userId } = req.body;
        
        // Validate input
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Log user message
        const userMessage = await chatLogService.logMessage(userId, message);

        // Format the prompt for Gemini
        const prompt = `
        You are the virtual assistant for a professional portfolio website.
        The user asked: "${message}"
        
        Please respond in a professional manner, maintaining the portfolio owner's brand voice.
        If the inquiry requires personal attention, suggest scheduling a consultation.
        `;

        // Get AI response
        const aiResponse = await geminiService.generateResponse(prompt);

        // Log AI response
        const aiMessage = await chatLogService.logAIResponse(userId, aiResponse, userMessage.id);

        // Send email notification
        await emailService.sendChatNotification({
            userId,
            message,
            aiResponse,
            subject: 'New Portfolio Chat Message'
        });

        res.json({
            success: true,
            response: aiResponse,
            conversationId: userMessage.id
        });

    } catch (error) {
        next(error);
    }
});

//  added  a new endpoint to get conversation history:
router.get('/chatbot/history/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const history = await chatLogService.getConversationHistory(userId);
        res.json({
            success: true,
            history
        });
    } catch (error) {
        next(error);
    }
});

// Apply error handler
router.use(errorHandler);

module.exports = router;