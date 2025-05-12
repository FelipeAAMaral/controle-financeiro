
-- Tabelas iniciais para o app de finanças
-- Execute este script no console SQL do Supabase

-- Habilitar a extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Perfis de usuários
CREATE TABLE IF NOT EXISTS "profiles" (
  "id" UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  "name" TEXT,
  "avatar_url" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transações
CREATE TABLE IF NOT EXISTS "transactions" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES auth.users NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DECIMAL(15,2) NOT NULL,
  "date" DATE NOT NULL,
  "type" TEXT NOT NULL CHECK (type IN ('entrada', 'saida', 'beneficio')),
  "category" TEXT NOT NULL,
  "account" TEXT,
  "benefit_type" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gastos Recorrentes
CREATE TABLE IF NOT EXISTS "recurring_expenses" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES auth.users NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DECIMAL(15,2) NOT NULL,
  "day" INTEGER NOT NULL,
  "category" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Objetivos Financeiros
CREATE TABLE IF NOT EXISTS "goals" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES auth.users NOT NULL,
  "title" TEXT NOT NULL,
  "current_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "target_amount" DECIMAL(15,2) NOT NULL,
  "deadline" TEXT NOT NULL,
  "icon" TEXT,
  "color" TEXT,
  "thumbnail" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Viagens
CREATE TABLE IF NOT EXISTS "trips" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES auth.users NOT NULL,
  "title" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "start_date" DATE NOT NULL,
  "end_date" DATE NOT NULL,
  "budget" DECIMAL(15,2),
  "status" TEXT DEFAULT 'planejada',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Destinos (para viagens com múltiplos destinos)
CREATE TABLE IF NOT EXISTS "destinations" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "trip_id" UUID REFERENCES trips(id) ON DELETE CASCADE,
  "user_id" UUID REFERENCES auth.users NOT NULL,
  "city" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "arrival_date" DATE NOT NULL,
  "departure_date" DATE NOT NULL,
  "accommodation" TEXT,
  "notes" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investimentos
CREATE TABLE IF NOT EXISTS "investments" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES auth.users NOT NULL,
  "nome" TEXT NOT NULL,
  "tipo" TEXT NOT NULL,
  "categoria" TEXT NOT NULL,
  "codigo" TEXT,
  "valorInicial" DECIMAL(15,2) NOT NULL,
  "dataCompra" DATE NOT NULL,
  "quantidade" DECIMAL(15,6),
  "precoUnitario" DECIMAL(15,6),
  "rentabilidade" DECIMAL(7,4),
  "vencimento" DATE,
  "corretora" TEXT NOT NULL,
  "moeda" TEXT NOT NULL DEFAULT 'BRL',
  "banco" TEXT,
  "observacoes" TEXT,
  "thumbnail" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados de mercado
CREATE TABLE IF NOT EXISTS "market_data" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "index" TEXT NOT NULL,
  "value" DECIMAL(15,2) NOT NULL,
  "change" DECIMAL(5,2) NOT NULL,
  "last_update" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cotações de moedas
CREATE TABLE IF NOT EXISTS "currency_rates" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "codigo" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "valor" DECIMAL(15,6) NOT NULL,
  "data_atualizacao" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planejamento de gastos em viagens
CREATE TABLE IF NOT EXISTS "trip_expense_plans" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "trip_id" UUID REFERENCES trips(id) ON DELETE CASCADE,
  "user_id" UUID REFERENCES auth.users NOT NULL,
  "categoria" TEXT NOT NULL,
  "descricao" TEXT NOT NULL,
  "valor" DECIMAL(15,2) NOT NULL,
  "moeda_origem" TEXT NOT NULL,
  "moeda_destino" TEXT NOT NULL,
  "valor_convertido" DECIMAL(15,2) NOT NULL,
  "taxa_conversao" DECIMAL(15,6) NOT NULL,
  "taxa_iof" DECIMAL(5,2),
  "taxa_bancaria" DECIMAL(5,2),
  "data" DATE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar RLS para todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_expense_plans ENABLE ROW LEVEL SECURITY;

-- Perfis - políticas
CREATE POLICY "Usuários podem ler seus próprios perfis" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios perfis" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Transações - políticas
CREATE POLICY "Usuários podem ler suas próprias transações" 
  ON transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias transações" 
  ON transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias transações" 
  ON transactions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir suas próprias transações" 
  ON transactions FOR DELETE 
  USING (auth.uid() = user_id);

-- Gastos Recorrentes - políticas
CREATE POLICY "Usuários podem ler seus próprios gastos recorrentes" 
  ON recurring_expenses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios gastos recorrentes" 
  ON recurring_expenses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios gastos recorrentes" 
  ON recurring_expenses FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios gastos recorrentes" 
  ON recurring_expenses FOR DELETE 
  USING (auth.uid() = user_id);

-- Objetivos - políticas
CREATE POLICY "Usuários podem ler seus próprios objetivos" 
  ON goals FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios objetivos" 
  ON goals FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios objetivos" 
  ON goals FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios objetivos" 
  ON goals FOR DELETE 
  USING (auth.uid() = user_id);

-- Viagens - políticas
CREATE POLICY "Usuários podem ler suas próprias viagens" 
  ON trips FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias viagens" 
  ON trips FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias viagens" 
  ON trips FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir suas próprias viagens" 
  ON trips FOR DELETE 
  USING (auth.uid() = user_id);

-- Destinos - políticas
CREATE POLICY "Usuários podem ler seus próprios destinos" 
  ON destinations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios destinos" 
  ON destinations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios destinos" 
  ON destinations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios destinos" 
  ON destinations FOR DELETE 
  USING (auth.uid() = user_id);

-- Investimentos - políticas
CREATE POLICY "Usuários podem ler seus próprios investimentos" 
  ON investments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios investimentos" 
  ON investments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios investimentos" 
  ON investments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios investimentos" 
  ON investments FOR DELETE 
  USING (auth.uid() = user_id);

-- Market Data - políticas (somente leitura para todos usuários)
CREATE POLICY "Todos usuários podem ler dados de mercado" 
  ON market_data FOR SELECT 
  USING (true);

-- Currency Rates - políticas (somente leitura para todos usuários)
CREATE POLICY "Todos usuários podem ler cotações" 
  ON currency_rates FOR SELECT 
  USING (true);

-- Trip Expense Plans - políticas
CREATE POLICY "Usuários podem ler seus próprios planos de gastos" 
  ON trip_expense_plans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios planos de gastos" 
  ON trip_expense_plans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios planos de gastos" 
  ON trip_expense_plans FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios planos de gastos" 
  ON trip_expense_plans FOR DELETE 
  USING (auth.uid() = user_id);

-- Função para atualizar o timestamp automaticamente
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger para todas as tabelas
CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_transactions
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_recurring_expenses
BEFORE UPDATE ON recurring_expenses
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_goals
BEFORE UPDATE ON goals
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_trips
BEFORE UPDATE ON trips
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_destinations
BEFORE UPDATE ON destinations
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_investments
BEFORE UPDATE ON investments
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_market_data
BEFORE UPDATE ON market_data
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_currency_rates
BEFORE UPDATE ON currency_rates
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_trip_expense_plans
BEFORE UPDATE ON trip_expense_plans
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Inserir dados iniciais de mercado e cotações (dados atuais, pós-2025)
INSERT INTO market_data (index, value, change)
VALUES
  ('IBOVESPA', 165230.45, 0.75),
  ('S&P500', 7890.23, 0.43),
  ('NASDAQ', 21456.78, 0.86),
  ('EURO STOXX 50', 5421.67, 0.28);

INSERT INTO currency_rates (codigo, nome, valor)
VALUES
  ('USD', 'Dólar Americano', 5.12),
  ('EUR', 'Euro', 5.67),
  ('GBP', 'Libra Esterlina', 6.72),
  ('JPY', 'Iene Japonês', 0.048);

