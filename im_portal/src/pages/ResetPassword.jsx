import React, { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";


export default function ResetPassword() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const canSubmit =
    form.newPassword.length >= 8 &&
    form.confirmNewPassword.length >= 8 &&
    form.newPassword === form.confirmNewPassword;

  // const onReset = () => {
  //   console.log("Reset password:", form.newPassword);
  //   // later: call backend API then navigate to login
  // };

  return (
    <div className="min-h-screen w-full bg-[#A7D9D6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        {/* Back */}
        <div className="px-10 pt-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button>
        </div>

        {/* Content */}
        <div className="px-10 pb-10 pt-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-[#2FA9A0] grid place-items-center shadow">
            <LockIcon className="h-7 w-7 text-white" />
          </div>

          <h3 className="text-2xl font-semibold text-slate-800">
            Create New Password
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Step 3 of 3: Enter your new password
          </p>

          {/* Form */}
          <div className="mt-8 text-left">
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full rounded-md bg-slate-100 px-4 py-2.5 text-sm text-slate-800 outline-none ring-2 ring-transparent focus:ring-teal-400"
            />
            <p className="mt-2 text-xs text-slate-500">
              Must be at least 8 characters long
            </p>

            <label className="mt-5 mb-2 block text-xs font-semibold text-slate-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={form.confirmNewPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full rounded-md bg-slate-100 px-4 py-2.5 text-sm text-slate-800 outline-none ring-2 ring-transparent focus:ring-teal-400"
            />
          </div>

          {/* Button */}
          <div className="mt-6">
            <PrimaryButton
              text="Reset Password"
              className="w-full py-3"
              onClick={() => navigate("/reset-success")}
              disabled={!canSubmit}
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
