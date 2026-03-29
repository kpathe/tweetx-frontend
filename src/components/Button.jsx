import React from "react";
import Spinner from "./Spinner";

function Button({
  children,
  type = "button",
  bgColor = "bg-violet-600 dark:bg-violet-700 hover:bg-violet-700 dark:hover:bg-violet-600",
  textColor = "text-white",
  className = "",
  isLoading = false,
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`px-4 py-2 rounded-lg cursor-pointer transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Spinner size="sm" />
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
