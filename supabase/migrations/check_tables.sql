-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'scan_results');

-- Check permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
ORDER BY grantee, privilege_type;
