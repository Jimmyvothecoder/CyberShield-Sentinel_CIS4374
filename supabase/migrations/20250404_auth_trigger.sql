-- Drop everything first to start fresh
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a function to handle new user signups
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
