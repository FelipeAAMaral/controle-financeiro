-- Add indexes for transactions table
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- Add indexes for recurring_expenses table
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_user_id ON recurring_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_type ON recurring_expenses(type);
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_category ON recurring_expenses(category);

-- Add indexes for goals table
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_deadline ON goals(deadline);

-- Add indexes for trips table
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON trips(start_date);
CREATE INDEX IF NOT EXISTS idx_trips_end_date ON trips(end_date);

-- Add indexes for destinations table
CREATE INDEX IF NOT EXISTS idx_destinations_trip_id ON destinations(trip_id);
CREATE INDEX IF NOT EXISTS idx_destinations_user_id ON destinations(user_id);
CREATE INDEX IF NOT EXISTS idx_destinations_arrival_date ON destinations(arrival_date);

-- Add indexes for investments table
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_data_compra ON investments("dataCompra");
CREATE INDEX IF NOT EXISTS idx_investments_tipo ON investments(tipo);
CREATE INDEX IF NOT EXISTS idx_investments_categoria ON investments(categoria);

-- Add indexes for trip_expense_plans table
CREATE INDEX IF NOT EXISTS idx_trip_expense_plans_trip_id ON trip_expense_plans(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_expense_plans_user_id ON trip_expense_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_expense_plans_categoria ON trip_expense_plans(categoria); 