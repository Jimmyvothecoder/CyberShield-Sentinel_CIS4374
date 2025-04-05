-- Create the user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email text NOT NULL,
    full_name text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create the scan_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.scan_results (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name text NOT NULL,
    storage_path text NOT NULL,
    size_bytes bigint NOT NULL,
    is_clean boolean NOT NULL,
    threats jsonb DEFAULT '[]'::jsonb NOT NULL,
    scan_time numeric NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Create storage bucket for malware scans if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('malware-scans', 'malware-scans', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert profiles"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for scan_results
CREATE POLICY "Users can view their own scan results"
    ON public.scan_results
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scan results"
    ON public.scan_results
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (
        user_id,
        email,
        full_name
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
