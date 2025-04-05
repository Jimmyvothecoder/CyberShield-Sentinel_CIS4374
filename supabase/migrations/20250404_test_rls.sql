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
