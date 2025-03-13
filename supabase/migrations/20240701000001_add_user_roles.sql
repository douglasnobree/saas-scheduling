-- Add role column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create enum type for roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'business_admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update existing users to have the default role
UPDATE public.users SET role = 'user' WHERE role IS NULL;

-- Create RLS policies for role-based access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access" ON public.users;
CREATE POLICY "Admins have full access"
    ON public.users
    USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Business admins can view users" ON public.users;
CREATE POLICY "Business admins can view users"
    ON public.users FOR SELECT
    USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'business_admin');

-- Enable realtime for users table
alter publication supabase_realtime add table public.users;
