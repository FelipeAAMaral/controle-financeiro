
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

-- Configurar políticas de segurança (RLS)
-- Permite que usuários vejam somente seus próprios dados

-- Ativar RLS para todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Perfis - política de leitura
CREATE POLICY "Usuários podem ler seus próprios perfis" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Perfis - política de inserção
CREATE POLICY "Usuários podem inserir seus próprios perfis" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Perfis - política de atualização
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

-- Configurar triggers para atualizar automaticamente o timestamp 'updated_at'

-- Função para atualizar o timestamp
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
