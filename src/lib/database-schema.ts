
/**
 * Database Schema Documentation
 * 
 * This file contains the database schema definitions used by the application.
 * Use this as a reference for table structures and relationships.
 * 
 * To implement these tables in Supabase:
 * 1. Go to the Supabase Dashboard
 * 2. Navigate to SQL Editor
 * 3. Create a New Query
 * 4. Copy and paste these SQL commands
 * 5. Run the query to create the tables
 */

/**
 * SQL for creating database tables:
 * 
 * -- Create a table for user profiles
 * CREATE TABLE IF NOT EXISTS profiles (
 *   id UUID REFERENCES auth.users(id) PRIMARY KEY,
 *   name TEXT,
 *   avatar_url TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable Row Level Security
 * ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policies for profiles table
 * CREATE POLICY "Users can view their own profile" 
 * ON profiles FOR SELECT 
 * USING (auth.uid() = id);
 * 
 * CREATE POLICY "Users can update their own profile" 
 * ON profiles FOR UPDATE 
 * USING (auth.uid() = id);
 * 
 * -- Create a table for transactions
 * CREATE TABLE IF NOT EXISTS transactions (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES auth.users(id) NOT NULL,
 *   description TEXT NOT NULL,
 *   date TIMESTAMP WITH TIME ZONE NOT NULL,
 *   amount DECIMAL(12,2) NOT NULL,
 *   type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
 *   category TEXT NOT NULL,
 *   account TEXT,
 *   benefit_type TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable RLS for transactions
 * ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policies for transactions
 * CREATE POLICY "Users can view own transactions" 
 * ON transactions FOR SELECT 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can insert own transactions" 
 * ON transactions FOR INSERT 
 * WITH CHECK (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can update own transactions" 
 * ON transactions FOR UPDATE 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can delete own transactions" 
 * ON transactions FOR DELETE 
 * USING (auth.uid() = user_id);
 * 
 * -- Create a table for recurring expenses
 * CREATE TABLE IF NOT EXISTS recurring_expenses (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES auth.users(id) NOT NULL,
 *   description TEXT NOT NULL,
 *   amount DECIMAL(12,2) NOT NULL,
 *   day INT NOT NULL,
 *   category TEXT NOT NULL,
 *   type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
 *   benefit_type TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable RLS for recurring_expenses
 * ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policies for recurring_expenses
 * CREATE POLICY "Users can view own recurring expenses" 
 * ON recurring_expenses FOR SELECT 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can insert own recurring expenses" 
 * ON recurring_expenses FOR INSERT 
 * WITH CHECK (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can update own recurring expenses" 
 * ON recurring_expenses FOR UPDATE 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can delete own recurring expenses" 
 * ON recurring_expenses FOR DELETE 
 * USING (auth.uid() = user_id);
 * 
 * -- Create a table for financial goals
 * CREATE TABLE IF NOT EXISTS goals (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES auth.users(id) NOT NULL,
 *   title TEXT NOT NULL,
 *   current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
 *   target_amount DECIMAL(12,2) NOT NULL,
 *   deadline TIMESTAMP WITH TIME ZONE,
 *   icon TEXT,
 *   color TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable RLS for goals
 * ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policies for goals
 * CREATE POLICY "Users can view own goals" 
 * ON goals FOR SELECT 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can insert own goals" 
 * ON goals FOR INSERT 
 * WITH CHECK (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can update own goals" 
 * ON goals FOR UPDATE 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can delete own goals" 
 * ON goals FOR DELETE 
 * USING (auth.uid() = user_id);
 * 
 * -- Create a table for trips
 * CREATE TABLE IF NOT EXISTS trips (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES auth.users(id) NOT NULL,
 *   name TEXT NOT NULL,
 *   start_date TIMESTAMP WITH TIME ZONE NOT NULL,
 *   end_date TIMESTAMP WITH TIME ZONE NOT NULL,
 *   objective_id UUID REFERENCES goals(id),
 *   budget DECIMAL(12,2) NOT NULL DEFAULT 0,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable RLS for trips
 * ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policies for trips
 * CREATE POLICY "Users can view own trips" 
 * ON trips FOR SELECT 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can insert own trips" 
 * ON trips FOR INSERT 
 * WITH CHECK (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can update own trips" 
 * ON trips FOR UPDATE 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can delete own trips" 
 * ON trips FOR DELETE 
 * USING (auth.uid() = user_id);
 * 
 * -- Create a table for destinations
 * CREATE TABLE IF NOT EXISTS destinations (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   trip_id UUID REFERENCES trips(id) NOT NULL,
 *   user_id UUID REFERENCES auth.users(id) NOT NULL,
 *   city TEXT NOT NULL,
 *   country TEXT NOT NULL,
 *   arrival_date TIMESTAMP WITH TIME ZONE NOT NULL,
 *   departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
 *   accommodation TEXT,
 *   notes TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable RLS for destinations
 * ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policies for destinations
 * CREATE POLICY "Users can view own destinations" 
 * ON destinations FOR SELECT 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can insert own destinations" 
 * ON destinations FOR INSERT 
 * WITH CHECK (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can update own destinations" 
 * ON destinations FOR UPDATE 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can delete own destinations" 
 * ON destinations FOR DELETE 
 * USING (auth.uid() = user_id);
 * 
 * -- Create a table for investments
 * CREATE TABLE IF NOT EXISTS investments (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES auth.users(id) NOT NULL,
 *   name TEXT NOT NULL,
 *   type TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   code TEXT,
 *   initial_value DECIMAL(12,2) NOT NULL,
 *   purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
 *   quantity DECIMAL(12,6),
 *   unit_price DECIMAL(12,6),
 *   yield_rate DECIMAL(7,4),
 *   maturity_date TIMESTAMP WITH TIME ZONE,
 *   broker TEXT,
 *   currency TEXT NOT NULL DEFAULT 'BRL',
 *   notes TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable RLS for investments
 * ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policies for investments
 * CREATE POLICY "Users can view own investments" 
 * ON investments FOR SELECT 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can insert own investments" 
 * ON investments FOR INSERT 
 * WITH CHECK (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can update own investments" 
 * ON investments FOR UPDATE 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can delete own investments" 
 * ON investments FOR DELETE 
 * USING (auth.uid() = user_id);
 * 
 * -- Create a table for trip expense planning
 * CREATE TABLE IF NOT EXISTS trip_expense_plans (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   trip_id UUID REFERENCES trips(id) NOT NULL,
 *   user_id UUID REFERENCES auth.users(id) NOT NULL,
 *   category TEXT NOT NULL,
 *   description TEXT NOT NULL,
 *   amount DECIMAL(12,2) NOT NULL,
 *   original_currency TEXT NOT NULL,
 *   target_currency TEXT NOT NULL,
 *   converted_amount DECIMAL(12,2) NOT NULL,
 *   exchange_rate DECIMAL(12,6) NOT NULL,
 *   iof_tax DECIMAL(5,2),
 *   bank_fee DECIMAL(5,2),
 *   date TIMESTAMP WITH TIME ZONE,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable RLS for trip_expense_plans
 * ALTER TABLE trip_expense_plans ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policies for trip_expense_plans
 * CREATE POLICY "Users can view own trip expense plans" 
 * ON trip_expense_plans FOR SELECT 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can insert own trip expense plans" 
 * ON trip_expense_plans FOR INSERT 
 * WITH CHECK (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can update own trip expense plans" 
 * ON trip_expense_plans FOR UPDATE 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can delete own trip expense plans" 
 * ON trip_expense_plans FOR DELETE 
 * USING (auth.uid() = user_id);
 * 
 * -- Create a trigger to automatically update updated_at timestamp
 * CREATE OR REPLACE FUNCTION update_timestamp()
 * RETURNS TRIGGER AS $$
 * BEGIN
 *   NEW.updated_at = NOW();
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql;
 * 
 * -- Apply the trigger to all tables
 * CREATE TRIGGER update_profiles_timestamp
 *   BEFORE UPDATE ON profiles
 *   FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
 * 
 * CREATE TRIGGER update_transactions_timestamp
 *   BEFORE UPDATE ON transactions
 *   FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
 * 
 * CREATE TRIGGER update_recurring_expenses_timestamp
 *   BEFORE UPDATE ON recurring_expenses
 *   FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
 * 
 * CREATE TRIGGER update_goals_timestamp
 *   BEFORE UPDATE ON goals
 *   FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
 * 
 * CREATE TRIGGER update_trips_timestamp
 *   BEFORE UPDATE ON trips
 *   FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
 * 
 * CREATE TRIGGER update_destinations_timestamp
 *   BEFORE UPDATE ON destinations
 *   FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
 * 
 * CREATE TRIGGER update_investments_timestamp
 *   BEFORE UPDATE ON investments
 *   FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
 * 
 * CREATE TRIGGER update_trip_expense_plans_timestamp
 *   BEFORE UPDATE ON trip_expense_plans
 *   FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
 */

// Export types to match the database schema
export interface DbProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbTransaction {
  id: string;
  user_id: string;
  description: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  account: string | null;
  benefit_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbRecurringExpense {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  day: number;
  category: string;
  type: 'income' | 'expense';
  benefit_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbGoal {
  id: string;
  user_id: string;
  title: string;
  current_amount: number;
  target_amount: number;
  deadline: string | null;
  icon: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbTrip {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string;
  objective_id: string | null;
  budget: number;
  created_at: string;
  updated_at: string;
}

export interface DbDestination {
  id: string;
  trip_id: string;
  user_id: string;
  city: string;
  country: string;
  arrival_date: string;
  departure_date: string;
  accommodation: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbInvestment {
  id: string;
  user_id: string;
  name: string;
  type: string;
  category: string;
  code: string | null;
  initial_value: number;
  purchase_date: string;
  quantity: number | null;
  unit_price: number | null;
  yield_rate: number | null;
  maturity_date: string | null;
  broker: string | null;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbTripExpensePlan {
  id: string;
  trip_id: string;
  user_id: string;
  category: string;
  description: string;
  amount: number;
  original_currency: string;
  target_currency: string;
  converted_amount: number;
  exchange_rate: number;
  iof_tax: number | null;
  bank_fee: number | null;
  date: string | null;
  created_at: string;
  updated_at: string;
}
