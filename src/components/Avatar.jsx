import React, { useState } from "react";

/**
 * Avatar component with automatic fallback to first letter of name.
 * Handles both missing URLs and broken image loads.
 */
function Avatar({ src, name, username, size = 40, className = "" }) {
  const [imgError, setImgError] = useState(false);

  const letter = (name?.[0] || username?.[0] || "U").toUpperCase();

  // Generate a consistent color from the name/username
  const colors = [
    "#1d9bf0", "#7856ff", "#f91880", "#ff7a00",
    "#00ba7c", "#ffd400", "#794bc4", "#17bf63",
  ];
  const charCode = (name || username || "U").charCodeAt(0);
  const bgColor = colors[charCode % colors.length];

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name || username || "avatar"}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        fontSize: size * 0.42,
      }}
    >
      {letter}
    </div>
  );
}

export default Avatar;
