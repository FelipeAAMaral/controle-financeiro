
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.error(
      'Missing Supabase environment variables! Check .env.development or .env.local file.'
    );
  } else {
    console.error(
      'Missing Supabase environment variables! Check .env.production file.'
    );
  }
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
