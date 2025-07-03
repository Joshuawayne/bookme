/**
 * ===================================================================
 * SERVER ENTRY POINT
 * ===================================================================
 * This is the main entry point for the backend application.
 */

// --- 1. Import Dependencies ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // <-- CORRECT: Import Gemini SDK

// --- 2. Initialize Clients & Express App ---
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// NEW: Initialize Google Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// --- 3. Setup Middleware ---
app.use(cors());
app.use(express.json());

// --- 4. Configure Nodemailer ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ===================================================================
// --- 5. API ENDPOINTS ---
// ===================================================================

/**
 * Endpoint: GET /api/rates
 * Purpose: Acts as a proxy for the currency conversion API.
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
  console.log('Chatbot message received...');
  const { message, userId } = req.body; // userId can be used later for chat history

  if (!message) {
    return res.status(400).json({ message: 'A message is required.' });
  }

  try {
    // Start a new chat session with the Gemini model
    const chat = geminiModel.startChat({
      // We can add chat history here in the future
      // history: [ { role: "user", parts: [{ text: "..." }] }, ... ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response generated.');
    res.status(200).json({ response: text });

  } catch (error) {
    console.error('!!! ERROR in Gemini API call:', error);
    res.status(500).json({ message: 'An error occurred with the AI assistant.' });
  }
});


/**
 * Endpoint: POST /api/contact
 * Purpose: Handles submissions from the main contact form.
 */
app.post('/api/contact', async (req, res) => {
    // ... your existing, correct code for this endpoint ...
});


/**
 * Endpoint: POST /api/generate-proposal
 * Purpose: Handles submissions from the budget calculator.
 */
app.post('/api/generate-proposal', async (req, res) => {
    // ... your existing, correct code for this endpoint ...
});


// --- 6. Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running and listening on http://localhost:${PORT}`);
});