// src/pages/StdRegPassword.jsx
import React, { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";

export default function StdRegPassword() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <div className="min-h-screen w-full bg-[#A7D9D6] flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl">
        {/* ================= HEADER ================= */}
            <div className="flex items-start px-10 pt-8 pb-4 gap-4">
            {/* Back */}
            <button
                type="button"
                onClick={() => window.history.back()}
                className="mb-5 flex items-center gap-2 text-5xl text-b text-slate-700 hover:text-slate-900"
            >
                ‹
            </button>

            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                {/* Lock icon box */}
                <div className="mt-1 h-11 w-11 rounded-lg bg-[#2FA9A0] grid place-items-center">
                    <LockIcon className="h-6 w-6 text-white" />
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-slate-800">
                    Set Password
                    </h3>
                    <p className="text-sm text-slate-500">
                    Step 2 of 3: Create a secure password
                    </p>
                </div>
                </div>

                {/* Role badge */}
                <span className="mt-1 ml-60 rounded-md bg-[#0F766E] px-3 py-1 text-xs font-medium text-white">
                Undergraduate
                </span>
            </div>
            </div>

            {/* ================= FORM ================= */}
            <div className="px-10 pb-10">
            {/* Password */}
            <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                Password <span className="text-red-500">*</span>
                </label>
                <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                className="w-full rounded-md bg-slate-100 px-4 py-2.5 text-sm text-slate-800 outline-none ring-2 ring-transparent focus:ring-teal-400"
                />
                <p className="mt-2 text-xs text-slate-500">
                Must be at least 8 characters long
                </p>
            </div>

            {/* Confirm Password */}
            <div className="mb-7">
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Your Password"
                className="w-full rounded-md bg-slate-100 px-4 py-2.5 text-sm text-slate-800 outline-none ring-2 ring-transparent focus:ring-teal-400"
                />
            </div>

            {/* Button */}
            <PrimaryButton
                text={
                <span className="inline-flex items-center justify-center gap-2">
                    Continue to Verification
                </span>
                }
                className="w-full py-3"
                onClick={() => console.log("Step 2 submit", form)}
            />
            </div>
      </div>
    </div>
  );
}



function LockIcon({ className = "" }) {
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
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
