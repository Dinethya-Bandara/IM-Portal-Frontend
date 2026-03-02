// src/components/FormField.jsx
import React from "react";

export default function FormField({
  label,
  required = false,
  variant = "input", // "input" | "select" | "textarea"
  type = "text",     // only used when variant="input"
  name,
  value,
  onChange,
  placeholder = "",
  options = [],      // only used when variant="select"
  hint = "",
  disabled = false,
  className = "",
}) {
  const base =
    "w-full rounded-md bg-slate-300 px-4 py-2.5 text-sm text-slate-800 " +
    "outline-none ring-2 ring-transparent focus:ring-teal-400 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="mb-5">
      {label && (
        <label className="mb-2 block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {variant === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${base} ${className}`}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      ) : variant === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={`${base} resize-none ${className}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${base} ${className}`}
        />
      )}

      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
