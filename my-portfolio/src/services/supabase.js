import { createClient } from '@supabase/supabase-js'

// Get your Supabase URL and Anon Key from your .env file
// Vite automatically makes variables starting with VITE_ available here.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create the Supabase client instance.
// This single instance will be imported and used throughout your application.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)