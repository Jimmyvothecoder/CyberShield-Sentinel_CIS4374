-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create scan_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.scan_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    scan_status TEXT NOT NULL DEFAULT 'pending' CHECK (scan_status IN ('pending', 'scanning', 'completed', 'failed')),
    threats_found TEXT[] DEFAULT '{}' NOT NULL,
    scan_time FLOAT DEFAULT 0 NOT NULL,
    is_clean BOOLEAN DEFAULT true NOT NULL
);

-- Add basic permissions
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.scan_results TO service_role;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.scan_results TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;
GRANT SELECT ON public.scan_results TO anon;
