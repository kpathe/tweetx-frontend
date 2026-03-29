import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", error, ...props },
  ref,
) {
  const id = useId();
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="inline-block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={id}>
          {label}
        </label>
      )}

      <input
        type={type}
        className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-500 focus:border-transparent transition duration-200 ${
          error ? "border-red-500 dark:border-red-500 focus:ring-red-500" : ""
        } ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

export default Input;
