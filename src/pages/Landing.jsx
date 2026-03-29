import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components";

function Landing() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-slate-950 font-sans">
      {/* Left Side: The Logo & Branding */}
      <div className="flex-1 hidden lg:flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-violet-600 to-violet-800">
        <div className="w-full max-w-sm">
          {/* X-style SVG Logo */}
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full fill-white opacity-90"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </div>
      </div>

      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center p-6 bg-gradient-to-r from-violet-600 to-violet-800">
        <div className="w-16 h-16">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full fill-white"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </div>
      </div>

      {/* Right Side: The Content */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="max-w-md">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white">
            What's happening?!
          </h1>

          <div className="space-y-3 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Join TweetX today.
            </h2>

            {/* Social Buttons */}
            <button className="flex w-full items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-full py-2.5 px-4 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">OR</span>
              <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
            </div>

            {/* Create Account Button */}
            <Link to="/signup" className="w-full">
              <Button
                className="w-full bg-violet-600 dark:bg-violet-700 hover:bg-violet-700 dark:hover:bg-violet-600 text-white font-bold py-3 rounded-full"
              >
                Create account
              </Button>
            </Link>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              By signing up, you agree to the{" "}
              <span className="text-violet-600 dark:text-violet-400 font-semibold">Terms of Service</span> and{" "}
              <span className="text-violet-600 dark:text-violet-400 font-semibold">Privacy Policy</span>, including{" "}
              <span className="text-violet-600 dark:text-violet-400 font-semibold">Cookie Use</span>.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
              Already have an account?
            </h3>
            <Link to="/login" className="w-full">
              <Button
                className="w-full border-2 border-violet-600 dark:border-violet-500 bg-transparent text-violet-600 dark:text-violet-400 font-bold py-3 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/20"
              >
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
