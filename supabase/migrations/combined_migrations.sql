-- Drop everything first to start fresh
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.test_rls() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TABLE IF EXISTS public.scan_results;
DROP TABLE IF EXISTS public.user_profiles;

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
CREATE POLICY "Allow users to read own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow service role to insert profiles"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (true);

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

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Log the trigger execution
  RAISE LOG 'Trigger function started for user: % with email: %', NEW.id, NEW.email;

  -- Check if profile already exists to avoid conflicts
  IF EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = NEW.id) THEN
    RAISE LOG 'Profile already exists for user: %', NEW.id;
    RETURN NEW;
  END IF;

  -- Insert with error handling
  BEGIN
    INSERT INTO public.user_profiles (user_id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );

    RAISE LOG 'Profile created successfully for user: %', NEW.id;
  EXCEPTION WHEN unique_violation THEN
    -- If we hit a unique violation, the profile was created by another process
    RAISE LOG 'Profile already exists (unique violation) for user: %', NEW.id;
  WHEN OTHERS THEN
    -- Log other errors but don't throw them
    RAISE LOG 'Error in trigger function: % %', SQLERRM, SQLSTATE;
  END;

  -- Always return NEW to allow the auth signup to complete
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to test RLS policies
CREATE OR REPLACE FUNCTION public.test_rls()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Test user_profiles policies
  BEGIN
    SELECT jsonb_build_object(
      'user_profiles_select', EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' 
        AND cmd = 'SELECT'
      ),
      'user_profiles_insert', EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' 
        AND cmd = 'INSERT'
      ),
      'user_profiles_rls_enabled', (
        SELECT relrowsecurity 
        FROM pg_class 
        WHERE relname = 'user_profiles'
      )
    ) INTO result;
  EXCEPTION WHEN OTHERS THEN
    result := jsonb_build_object('error', SQLERRM);
  END;
  
  RETURN result;
END;
$$;
