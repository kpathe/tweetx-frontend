import React from "react";
import { Signup as SignupComponent } from "../components";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-violet-600 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500">Step into the TX universe</p>
        </div>

        <SignupComponent />

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-violet-600 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
