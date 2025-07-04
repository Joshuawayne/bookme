/**
 * ===================================================================
 * SERVER ENTRY POINT
 * ===================================================================
 * This file is the main entry point for the backend application.
 * Its sole responsibilities are:
 *  - To load environment variables correctly for different environments.
 *  - To initialize the Express server.
 *  - To configure global middleware (JSON parsing).
 *  - To connect the defined API routes.
 *  - To start listening for incoming requests.
 *
 * This clean separation follows the Single Responsibility Principle.
 */

// --- 1. Load Environment Variables Conditionally ---
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  console.log('[dotenv] Loaded environment variables from .env file for local development.');
}

// --- 2. Import Dependencies ---
const express = require('express');
const { router: apiRouter, errorHandler } = require('./api/routes'); // Only import router and errorHandler

// --- 3. Pre-flight Check for Critical Variables ---
if (!process.env.SUPABASE_SERVICE_KEY || !process.env.EMAIL_USER || !process.env.GEMINI_API_KEY) {
  console.error("\n\n!!! FATAL SERVER CONFIGURATION ERROR !!!");
  console.error("One or more required environment variables are missing.");
  console.error("Please check your .env file (for local) or your Environment Variables on your hosting platform (Render, Heroku, etc.).\n\n");
  process.exit(1);
}

// --- 4. Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- 5. Configure Global Middleware ---
app.use(express.json()); // Enable JSON parsing

// --- 6. Mount API Routes ---
app.use('/api', apiRouter); // Mount routes at /api

// --- 7. Error Handling ---
app.use(errorHandler); // Apply error handler globally

// --- 8. Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running and listening on port ${PORT}`);
});
