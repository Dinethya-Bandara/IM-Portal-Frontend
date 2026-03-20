import React, { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("Please enter a valid personal email ending with @gmail.com");
      return;
    }
    setError("");
    console.log("Send verification code to:", email);
    navigate("/verify-email");
  };

  return (
    <div className="min-h-screen w-full bg-[#A7D9D6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        {/* Top back */}
        <div className="px-10 pt-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Login
          </button>
        </div>

        {/* Body */}
        <div className="px-10 pb-10 pt-8 text-center" onKeyDown={(e) => e.key === 'Enter' && email.trim() && handleSubmit()}>
          {/* Icon */}
          <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-[#2FA9A0] grid place-items-center shadow">
            <MailIcon className="h-7 w-7 text-white" />
          </div>

          <h3 className="text-2xl font-semibold text-slate-800">
            Reset Password
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Step 1 of 3: Enter your personal email address
          </p>

          {/* Form */}
          <div className="mt-8 text-left">
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Personal Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter your personal email (example@gmail.com)"
              className={`w-full rounded-md bg-slate-100 px-4 py-2.5 text-sm text-slate-800 outline-none ring-2 transition-all ${error ? 'ring-red-400' : 'ring-transparent focus:ring-teal-400'}`}
            />
            {error && (
              <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1 animate-pulse">
                {error}
              </p>
            )}
          </div>

          {/* Button */}
          <div className="mt-10">
            <PrimaryButton
              text="Send Verification Code"
              className="w-full py-3"
              onClick={handleSubmit}
              disabled={!email.trim()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Icons ---------------- */

function ArrowLeftIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function MailIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16v16H4z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}
