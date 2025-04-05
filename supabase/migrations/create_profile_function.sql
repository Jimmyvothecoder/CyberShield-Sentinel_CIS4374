-- Create function to create profile with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.create_user_profile(
    p_user_id UUID,
    p_email TEXT,
    p_full_name TEXT
)
RETURNS SETOF public.user_profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO public.user_profiles (
        user_id,
        email,
        full_name
    )
    VALUES (
        p_user_id,
        p_email,
        p_full_name
    )
    RETURNING *;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, TEXT) TO authenticated;

-- Create a simple view for profile data
CREATE OR REPLACE VIEW public.user_profile_view AS
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
GRANT SELECT ON public.user_profile_view TO authenticated;
