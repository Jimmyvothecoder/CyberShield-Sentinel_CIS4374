export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">CyberShield Sentinel</h1>
        
        <div className="space-y-4">
          <a 
            href="/auth/login" 
            className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-center rounded transition-colors"
          >
            Sign In
          </a>
          
          <a 
            href="/auth/signup" 
            className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-center rounded transition-colors"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  )
}
