const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ukmcivwwphhmgmgecwet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrbWNpdnd3cGhobWdtZ2Vjd2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNTEwMzEsImV4cCI6MjA1ODYyNzAzMX0.4Uu9mRkHHwGcjc_KFKUAop1jaJQ0Q0ZbI2USg-ZC6V8'
)

async function testAuth() {
  try {
    // Test simple signup
    const { data, error } = await supabase.auth.signUp({
      email: 'test' + Date.now() + '@example.com',
      password: 'test123456',
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    })

    console.log('Signup test result:', { data, error })
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testAuth()
