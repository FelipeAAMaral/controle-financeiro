
# Database Migrations Guide

Este guia explica como executar as migrações do banco de dados para configurar todas as tabelas necessárias para o aplicativo de finanças.

## Opção 1: Utilizando a interface do aplicativo

O método mais simples é usar a interface do aplicativo que já possui um assistente de configuração:

1. Acesse a aplicação e faça login
2. Navegue até `/database-setup`
3. Clique no botão "Configurar Banco de Dados"
4. Aguarde a conclusão do processo

## Opção 2: Usando o SQL Editor do Supabase

Para executar manualmente o script através do painel de controle do Supabase:

1. Faça login no [dashboard do Supabase](https://app.supabase.com/)
2. Selecione seu projeto
3. Navegue até "SQL Editor" no menu lateral
4. Clique em "New Query"
5. Copie todo o conteúdo do arquivo `supabase-setup.sql` da raiz do projeto
6. Cole no editor SQL
7. Clique em "Run" para executar o script
8. Aguarde a conclusão (pode levar alguns segundos)
9. Verifique se todas as tabelas foram criadas em "Table Editor"

## Opção 3: Usando a CLI do Supabase

Se você preferir usar a linha de comando:

1. Instale a CLI do Supabase (se ainda não tiver instalado):
   ```bash
   npm install -g supabase
   ```

2. Faça login na sua conta Supabase:
   ```bash
   supabase login
   ```

3. Execute o script SQL:
   ```bash
   supabase db execute --project-ref SEU_REFERENCE_ID --file ./supabase-setup.sql
   ```
   Substitua `SEU_REFERENCE_ID` pelo ID do seu projeto Supabase, que pode ser encontrado nas configurações do projeto.

## Opção 4: Usando utilitários de banco de dados PostgreSQL

Se você tem acesso direto ao banco de dados PostgreSQL:

1. Obtenha a string de conexão do seu banco de dados Supabase nas configurações do projeto
2. Use o utilitário psql para executar o script:
   ```bash
   psql "sua_string_de_conexao" -f supabase-setup.sql
   ```

## Verificando a instalação

Para verificar se as tabelas foram criadas corretamente:

1. No dashboard do Supabase, navegue até "Table Editor"
2. Verifique se todas estas tabelas estão presentes:
   - profiles
   - transactions
   - recurring_expenses
   - goals
   - trips
   - destinations
   - investments
   - market_data
   - currency_rates
   - trip_expense_plans

3. Opcionalmente, execute a seguinte consulta SQL para verificar:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

## Estrutura do Banco de Dados

O script cria as seguintes tabelas:

- `profiles`: Perfis de usuários
- `transactions`: Transações financeiras
- `recurring_expenses`: Gastos Recorrentes
- `goals`: Objetivos Financeiros
- `trips`: Viagens
- `destinations`: Destinos (para viagens com múltiplos destinos)
- `investments`: Investimentos
- `market_data`: Dados de mercado
- `currency_rates`: Cotações de moedas
- `trip_expense_plans`: Planejamento de gastos em viagens

Além disso, o script configura:
- Row Level Security (RLS) para todas as tabelas
- Políticas de acesso para garantir que usuários só vejam seus próprios dados
- Triggers para atualização automática de timestamps
- Inserção de dados iniciais para mercado e cotações

## Resolução de Problemas

**Erro: Tabela já existe**
- As tabelas são criadas com `CREATE TABLE IF NOT EXISTS`, portanto não deve haver problemas ao executar o script múltiplas vezes.

**Erro: Permissão negada**
- Certifique-se de estar usando credenciais com privilégios suficientes (geralmente o service_role key do Supabase tem todos os privilégios necessários).

**Erro: RLS já está habilitado**
- Pode ser ignorado, significa que a segurança já está configurada corretamente.

