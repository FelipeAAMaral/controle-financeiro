
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const initializeDatabase = async (): Promise<boolean> => {
  try {
    // The SQL script will be executed directly on the Supabase instance
    // First check if tables already exist to avoid errors
    const { data: existingTables, error: checkError } = await supabase
      .from('investments')
      .select('id')
      .limit(1);
    
    if (!checkError) {
      console.log('Tables already exist, skipping initialization');
      toast.info('Database already initialized');
      return true;
    }

    // Get the SQL script from the public folder
    const response = await fetch('/supabase-setup.sql');
    if (!response.ok) {
      throw new Error('Failed to load SQL script');
    }
    
    const sqlScript = await response.text();
    
    // Execute the SQL script (Note: this would normally require admin rights,
    // but we're assuming the user has admin access to their Supabase project)
    const { error } = await supabase.rpc('exec_sql', { sql: sqlScript });
    
    if (error) {
      console.error('Error initializing database:', error);
      toast.error('Failed to initialize database: ' + error.message);
      return false;
    }

    console.log('Database initialized successfully');
    toast.success('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error during database initialization:', error);
    toast.error('Failed to initialize database: ' + (error instanceof Error ? error.message : String(error)));
    return false;
  }
};
