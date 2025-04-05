-- Drop everything in public schema
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Recreate user_profiles table with minimal constraints
CREATE TABLE public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Grant basic permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated, anon, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated, anon, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, authenticated, anon, service_role;
