const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ukmcivwwphhmgmgecwet.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrbWNpdnd3cGhobWdtZ2Vjd2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNTEwMzEsImV4cCI6MjA1ODYyNzAzMX0.4Uu9mRkHHwGcjc_KFKUAop1jaJQ0Q0ZbI2USg-ZC6V8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test auth
    console.log('Testing auth...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    console.log('Auth test result:', { data: authData, error: authError })

    // Test database
    console.log('\nTesting database...')
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
    console.log('Database test result:', { data, error })

    // Test RLS policies
    console.log('\nTesting RLS policies...')
    const { data: rlsData, error: rlsError } = await supabase.rpc('test_rls')
    console.log('RLS test result:', { data: rlsData, error: rlsError })
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testConnection()
