import React from "react";
import PrimaryButton from "../components/PrimaryButton";

export default function ResetSuccessfull() {
  const goToLogin = () => {
    // later: navigate("/login")
    console.log("Return to Login");
    window.location.href = "/login"; // remove if you use react-router navigate
  };

  return (
    <div className="min-h-screen w-full bg-[#A7D9D6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="px-10 py-10 text-center">
          {/* Top icon */}
          <div className="mx-auto mb-6 h-14 w-14 rounded-2xl bg-[#2FA9A0] grid place-items-center shadow">
            <CheckIcon className="h-7 w-7 text-white" />
          </div>

          <h3 className="text-2xl font-semibold text-slate-800">
            Password Reset Successful!
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Your password has been changed successfully
          </p>

          {/* Info box */}
          <div className="mt-7 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-white grid place-items-center border border-emerald-200">
              <SmallCheckIcon className="h-4 w-4 text-emerald-700" />
            </div>
            <span>You can now log in with your new password</span>
          </div>

          {/* Button */}
          <div className="mt-7">
            <PrimaryButton
              text="Return to Login"
              className="w-full py-3"
              onClick={goToLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Icons ---------------- */

function CheckIcon({ className = "" }) {
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
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function SmallCheckIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
