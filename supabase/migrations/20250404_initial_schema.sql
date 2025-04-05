-- Create basic user_profiles table
CREATE TABLE public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Basic RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Allow all access to authenticated users"
    ON public.user_profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, service_role, authenticated, anon;
GRANT ALL ON public.user_profiles TO postgres, service_role, authenticated;

-- Create scan_results table
CREATE TABLE public.scan_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    scan_status TEXT NOT NULL DEFAULT 'pending' CHECK (scan_status IN ('pending', 'scanning', 'completed', 'failed')),
    threats_found TEXT[] DEFAULT '{}' NOT NULL,
    scan_time FLOAT DEFAULT 0 NOT NULL,
    is_clean BOOLEAN DEFAULT true NOT NULL
);

-- Enable RLS for scan_results
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

-- Create policies for scan_results
CREATE POLICY "Users can view own scan results"
    ON public.scan_results
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scan results"
    ON public.scan_results
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scan results"
    ON public.scan_results
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, service_role, authenticated, anon;
GRANT USAGE ON SCHEMA auth TO postgres, service_role;

GRANT ALL ON public.user_profiles TO postgres, service_role, authenticated;
GRANT ALL ON public.scan_results TO postgres, service_role, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, authenticated;

GRANT SELECT ON public.user_profiles TO anon;
GRANT SELECT ON public.scan_results TO anon;

-- Force RLS
ALTER TABLE public.user_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.scan_results FORCE ROW LEVEL SECURITY;
