/**
 * @module supabaseService
 * @description Single source of truth for the Supabase client instance.
 * This ensures we use the same configured client throughout the application,
 * applying the Singleton pattern principle for our backend server.
 */
const { createClient } = require('@supabase/supabase-js');

// --- Configuration ---
// These values are pulled from your .env file.
const supabaseUrl = process.env.VITE_SUPABASE_URL;

// ** THE FIX IS HERE **
// We are now using the secret SERVICE_KEY, which has admin privileges.
// This key bypasses all RLS policies and is intended for use ONLY on a secure server.
// It should NEVER be exposed on a frontend application.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// --- Initialization with Self-Correction/Warning ---
// This checks if the essential service key is missing and warns the developer.
if (!supabaseServiceKey) {
  console.error("\n\n!!! FATAL SERVER CONFIGURATION ERROR !!!");
  console.error("SUPABASE_SERVICE_KEY is not defined in your .env file.");
  console.error("The backend server cannot write to the database without it.\n\n");
}

// Create the Supabase client instance with the service role key.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- Export ---
// Export the single, configured client for other services to use.
module.exports = supabase;