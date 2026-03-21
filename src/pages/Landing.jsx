import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components'

function Landing() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-black font-sans">
      
      {/* 🐦 Left Side: The Massive Logo */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[400px] lg:max-w-[500px]">
            {/* Using a simple X-style SVG for that raw aesthetic */}
            <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-black dark:text-white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
        </div>
      </div>

      {/* 📝 Right Side: The Content */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-12 py-12">
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-12 dark:text-white">
            Happening now
        </h1>
        
        <div className="max-w-[300px] flex flex-col gap-4">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Join today.</h2>
            
            {/* Social Buttons (UI only for now) */}
            <button className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 font-medium hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
                Sign up with Google
            </button>
            
            <button className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 font-medium hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                <span className="text-xl"></span> Sign up with Apple
            </button>

            <div className="flex items-center gap-2 my-2">
                <div className="h-[1px] bg-gray-200 dark:bg-gray-800 flex-1"></div>
                <span className="text-xs text-gray-500">OR</span>
                <div className="h-[1px] bg-gray-200 dark:bg-gray-800 flex-1"></div>
            </div>

            {/* The Main Action */}
            <Link to="/signup">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-full border-none">
                    Create account
                </Button>
            </Link>

            <p className="text-[11px] text-gray-500 mt-1">
                By signing up, you agree to the <span className="text-blue-500">Terms of Service</span> and <span className="text-blue-500">Privacy Policy</span>, including <span className="text-blue-500">Cookie Use</span>.
            </p>

            <div className="mt-10">
                <h3 className="font-bold text-lg mb-4 dark:text-white">Already have an account?</h3>
                <Link to="/login">
                    <Button className="w-full border border-gray-300 dark:border-gray-600 bg-transparent text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 font-bold py-2.5 rounded-full">
                        Sign in
                    </Button>
                </Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Landing