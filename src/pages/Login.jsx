import React from 'react'
import { Login as LoginComponent } from '../components'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 px-4'>
        <div className='w-full max-w-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm'>
            <div className='mb-8 text-center'>
                <h1 className='text-3xl font-bold text-violet-600 mb-2'>TweetX</h1>
                <p className='text-gray-500'>Log in to see what's happening</p>
            </div>

            <LoginComponent />

            <p className='mt-6 text-center text-gray-600 dark:text-gray-400'>
                New to TweetX? {" "}
                <Link to="/signup" className='text-violet-600 font-semibold hover:underline'>
                    Sign up
                </Link>
            </p>
        </div>
    </div>
  )
}

export default Login