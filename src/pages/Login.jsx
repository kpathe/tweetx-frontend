import React from 'react'
import { Login as LoginComponent } from '../components'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className='flex min-h-screen bg-white dark:bg-slate-950'>
      {/* Left side - Branding (hidden on mobile) */}
      <div className='hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-violet-600 to-violet-800 px-8 py-12'>
        <div className='text-center'>
          <h1 className='text-6xl font-bold text-white mb-6'>𝕏</h1>
          <ul className='space-y-6 text-2xl text-white font-light'>
            <li className='flex items-center gap-3'>
              <span className='text-3xl'>💬</span>
              <span>Follow conversations</span>
            </li>
            <li className='flex items-center gap-3'>
              <span className='text-3xl'>❤️</span>
              <span>Share your thoughts</span>
            </li>
            <li className='flex items-center gap-3'>
              <span className='text-3xl'>💫</span>
              <span>Connect with others</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className='w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-8 py-8 sm:py-12 lg:px-16'>
        <div className='w-full max-w-md'>
          {/* Mobile Header */}
          <div className='lg:hidden mb-8 text-center'>
            <h1 className='text-4xl font-bold text-violet-600 dark:text-violet-400 mb-3'>𝕏</h1>
          </div>

          <div className='mb-8'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3'>
              Log In Now
            </h2>
            <p className='text-gray-600 dark:text-gray-400 text-base'>
              Welcome back to TweetX. See what's happening in your world.
            </p>
          </div>

          <LoginComponent />

          <p className='mt-8 text-center text-gray-600 dark:text-gray-400 text-base'>
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className='text-violet-600 dark:text-violet-400 font-bold hover:underline transition'
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login