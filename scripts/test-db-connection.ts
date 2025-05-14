const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing Supabase credentials in .env file');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Authentication error: ${sessionError.message}`);
    }

    // Test database access
    const { data: tables, error: tablesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (tablesError) {
      throw new Error(`Database access error: ${tablesError.message}`);
    }

    console.log('✅ Connection successful!');
    console.log('Available tables:');
    console.log('- profiles');
    console.log('- transactions');
    console.log('- recurring_expenses');
    console.log('- goals');
    console.log('- trips');
    console.log('- destinations');
    console.log('- investments');

  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

testConnection(); 