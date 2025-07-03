/**
 * @module supabaseService
 * @description Single source of truth for the Supabase client instance.
 * This ensures we use the same configured client throughout the application,
 * applying the Singleton pattern principle.
 */
const { createClient } = require('@supabase/supabase-js');

// Initialize the client using credentials from environment variables.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;