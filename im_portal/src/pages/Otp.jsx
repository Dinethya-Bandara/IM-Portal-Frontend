
import React, { useEffect, useRef, useState } from "react";
import PrimaryButton from "../components/PrimaryButton";

export default function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const otpValue = otp.join("");

  useEffect(() => {
    inputsRef.current?.[0]?.focus?.();
  }, []);

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1); // keep only last digit
    setOtp((prev) => {
      const copy = [...prev];
      copy[index] = digit;
      return copy;
    });

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus?.();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus?.();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;

    const arr = text.split("");
    setOtp((prev) => prev.map((_, i) => arr[i] || ""));
    inputsRef.current[Math.min(arr.length, 6) - 1]?.focus?.();
    e.preventDefault();
  };

  const onResend = () => {
    console.log("Resend OTP");
  };

  const onVerify = () => {
    console.log("Verify OTP:", otpValue);
  };

  return (
    <div className="min-h-screen w-full bg-[#A7D9D6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl">
        {/* ================= HEADER ================= */}
        <div className="flex items-start px-10 pt-8 pb-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mb-4 pr-4 pb-4 flex items-center gap-2 text-5xl text-b text-slate-700 hover:text-slate-900"
          >
            ‹
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {/* left icon */}
              <div className="mt-1 h-11 w-11 rounded-lg bg-[#2FA9A0] grid place-items-center">
                <CheckIcon className="h-6 w-6 text-white" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Verify Your Email
                </h3>
                <p className="text-sm text-slate-500">
                  Step 3 of 3: Enter the OTP sent to your email
                </p>
              </div>
            </div>

            <span className="mt-1 ml-40 rounded-md bg-[#0F766E] px-3 py-1 text-xs font-medium text-white">
              Undergraduate
            </span>
          </div>
        </div>

        {/* ================= OTP BODY ================= */}
        <div className="px-10 pb-10">
          <div className="mt-6 text-center">
            <p className="text-xs font-medium text-slate-700">
              Enter 6-Digit OTP
            </p>

            <div className="mt-3 flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-10 w-10 rounded-md bg-slate-100 text-center text-sm text-slate-800 outline-none ring-2 ring-transparent focus:ring-teal-400"
                />
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={onResend}
                className="font-semibold text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </div>

          {/* ================= BUTTON ================= */}
          <div className="mt-7">
            <PrimaryButton
              text={
                <span className="inline-flex items-center justify-center gap-2">
                  <CheckIcon className="h-4 w-4" />
                  Verify &amp; Create Account
                </span>
              }
              className="w-full py-3"
              onClick={onVerify}
              disabled={otpValue.length !== 6}
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
