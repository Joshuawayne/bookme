
/**
 * ===================================================================
 * SERVER ENTRY POINT
 * ===================================================================
 * This file is the main entry point for the backend application.
 * Its sole responsibilities are:
 *  - To load environment variables.
 *  - To initialize the Express server.
 *  - To configure global middleware (CORS, JSON parsing).
 *  - To connect the defined API routes.
 *  - To start listening for incoming requests.
 *
 * This clean separation follows the Single Responsibility Principle.
 */

// --- 1. Load Environment Variables ---
require('dotenv').config();

// --- 2. Import Dependencies ---
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api/routes'); // Import our newly separated routes

// --- 3. Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- 4. Configure Global Middleware ---
app.use(cors());       // Enable Cross-Origin Resource Sharing for all routes
app.use(express.json()); // Enable the server to parse JSON in request bodies

// --- 5. Mount API Routes ---
// Tell the Express app to use our defined routes for any request starting with '/api'
app.use('/api', apiRoutes);

// --- 6. Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running and listening on http://localhost:${PORT}`);
});