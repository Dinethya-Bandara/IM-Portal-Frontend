import React, { useEffect, useRef, useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ForgotPasswordOtp() {
  const navigate = useNavigate(); 
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const otpValue = otp.join("");

  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    inputsRef.current?.[0]?.focus?.();
  }, []);

  const handleChange = (i, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const copy = [...prev];
      copy[i] = digit;
      return copy;
    });
    if (digit && i < 5) inputsRef.current[i + 1]?.focus?.();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus?.();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const arr = text.split("");
    setOtp((prev) => prev.map((_, idx) => arr[idx] || ""));
    inputsRef.current[Math.min(arr.length, 6) - 1]?.focus?.();
    e.preventDefault();
  };

  const onResend = () => console.log("Resend OTP");
  const onVerify = () => console.log("Verify code:", otpValue);

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/users/useOtp", {email: email, otp: otpValue});

      const message = response.data;

      if (message === "OTP Accepted!") {
        navigate("/reset-password", { state: { email } });
      } else {
        alert(message);
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

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

        {/* Center content */}
        <div className="px-10 pb-10 pt-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-[#2FA9A0] grid place-items-center shadow">
            <CheckIcon className="h-7 w-7 text-white" />
          </div>

          <h3 className="text-2xl font-semibold text-slate-800">Verify Email</h3>
          <p className="mt-1 text-sm text-slate-500">
            Step 2 of 3: Enter the OTP sent to your email
          </p>

          {/* Info box (like screenshot) */}
          <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-900">
            <span className="font-semibold">OTP Sent!</span>{" "}
            We&apos;ve sent a 6-digit verification code to{" "}
            <span className="font-semibold">your email</span>
          </div>

          {/* OTP */}
          <div className="mt-7">
            <p className="text-xs font-medium text-slate-700">
              Enter 6-Digit OTP
            </p>

            <div className="mt-3 flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  value={v}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
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

          {/* Button */}
          <div className="mt-6">
            <PrimaryButton
              text="Verify Code"
              className="w-full py-3"
              onClick={handleVerifyOtp}
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
