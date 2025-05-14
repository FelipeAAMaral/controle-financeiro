-- Criar um super usuário no Supabase
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- ID fixo para o super usuário
  'admin@example.com',
  crypt('admin123', gen_salt('bf')), -- Senha: admin123
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Super Admin"}',
  true,
  'authenticated'
);

-- Criar o perfil do super usuário
INSERT INTO public.profiles (
  id,
  name,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Super Admin',
  now(),
  now()
);

-- Configurar políticas de segurança
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para o super admin
CREATE POLICY "Super admin can do everything"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = '00000000-0000-0000-0000-000000000000')
  WITH CHECK (auth.uid() = '00000000-0000-0000-0000-000000000000');

-- Política para permitir que usuários vejam seus próprios perfis
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política para permitir que usuários atualizem seus próprios perfis
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Política para permitir que usuários criem seus próprios perfis
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id); 