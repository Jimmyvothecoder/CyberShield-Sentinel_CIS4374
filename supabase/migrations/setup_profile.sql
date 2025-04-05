-- Enable RLS on the profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert profiles"
    ON public.user_profiles
    FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create a trigger function to create profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Check if profile already exists
    IF EXISTS (
        SELECT 1 
        FROM public.user_profiles 
        WHERE user_id = NEW.id
    ) THEN
        RETURN NEW;
    END IF;

    -- Insert profile with error handling
    BEGIN
        INSERT INTO public.user_profiles (
            user_id,
            email,
            full_name
        ) VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
        );
        RETURN NEW;
    EXCEPTION WHEN unique_violation THEN
        -- If we hit a unique violation, the profile was created by another process
        RETURN NEW;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create a view for authenticated users to see their own profile
CREATE OR REPLACE VIEW public.my_profile AS
SELECT 
    id,
    user_id,
    email,
    full_name,
    created_at,
    updated_at
FROM public.user_profiles
WHERE user_id = auth.uid();

-- Grant SELECT on the view to authenticated users
GRANT SELECT ON public.my_profile TO authenticated;
