/**
 * ===================================================================
 * SERVER ENTRY POINT
 * ===================================================================
 * This file is the main entry point for the backend application.
 * Its sole responsibilities are:
 *  - To load environment variables correctly for different environments.
 *  - To initialize the Express server.
 *  - To configure global middleware (CORS, JSON parsing).
 *  - To connect the defined API routes.
 *  - To start listening for incoming requests.
 *
 * This clean separation follows the Single Responsibility Principle.
 */

// --- 1. Load Environment Variables Conditionally ---
// THE FIX: This is the most important change for a professional deployment.
// It tells our server to ONLY use the .env file when we are NOT in a
// production environment (like the one on Render). Render provides its
// own environment variables directly to the process.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  console.log('[dotenv] Loaded environment variables from .env file for local development.');
}


// --- 2. Import Dependencies ---
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api/routes'); // Import our separated routes


// --- 3. Pre-flight Check for Critical Variables ---
// This is a safety check. If the server starts without its necessary secrets,
// it will immediately log an error and exit, rather than crashing later.
if (!process.env.SUPABASE_SERVICE_KEY || !process.env.EMAIL_USER || !process.env.GEMINI_API_KEY) {
  console.error("\n\n!!! FATAL SERVER CONFIGURATION ERROR !!!");
  console.error("One or more required environment variables are missing.");
  console.error("Please check your .env file (for local) or your Environment Variables on your hosting platform (Render, Heroku, etc.).\n\n");
  process.exit(1); // Stop the server from starting if configuration is invalid.
}


// --- 4. Initialize Express App ---
const app = express();
// Render provides the PORT environment variable automatically.
const PORT = process.env.PORT || 3000;


// --- 5. Configure Global Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());


// --- 6. Mount API Routes ---
// Tell the Express app to use our defined routes for any request starting with '/api'
app.use('/api', apiRoutes);


// --- 7. Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running and listening on port ${PORT}`);
});
