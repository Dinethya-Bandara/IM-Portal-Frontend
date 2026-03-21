import React from "react";

export default function PrimaryButton({
  text,
  type,
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-gradient-to-r from-teal-500 to-emerald-700
        cursor-pointer text-white px-4 py-2 rounded-md
        hover:from-teal-600 hover:to-emerald-800
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {text}
    </button>
  );
}
