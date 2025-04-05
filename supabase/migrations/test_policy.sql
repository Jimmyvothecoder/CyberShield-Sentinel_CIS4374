-- Drop existing policies
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow service role to insert profiles" ON public.user_profiles;

-- Create more permissive policies for testing
CREATE POLICY "Allow all operations on profiles"
    ON public.user_profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant full access to authenticated users
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;

-- Disable RLS temporarily for testing
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
