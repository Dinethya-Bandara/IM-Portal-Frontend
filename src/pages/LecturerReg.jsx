import React, { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import FormField from "../components/FormField";

export default function LecturerReg() {
  const [form, setForm] = useState({
    fullName: "",
    designation: "Academic Advisor",
    email: "",
    contactNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const designations = [
    "Academic Advisor",
    "Lecturer",
    "Senior Lecturer",
    "Professor",
    "Head of Department",
  ];

  return (
    <div className="min-h-screen w-full bg-[#A7D9D6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        {/* ================= HEADER ================= */}
        <div className="flex items-start px-10 pt-8 pb-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mb-5 flex mr-4 items-center gap-2 text-5xl text-b text-slate-700 hover:text-slate-900"
          >
            ‹
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="mt-1 h-11 w-11 rounded-lg bg-[#2FA9A0] grid place-items-center">
                <CapIcon className="h-6 w-6 text-white" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Lecturer Registration
                </h3>
                <p className="text-sm text-slate-500">
                  Step 1 of 3: Enter your details
                </p>
              </div>
            </div>

            <span className="mt-1 rounded-md bg-[#0F766E] ml-30 px-3 py-1 text-xs font-medium text-white">
              Lecturer
            </span>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="px-10 pb-10">
          <FormField
            label="Full Name"
            required
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          <FormField
            label="Designation"
            required
            variant="select"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            options={designations}
          />

          {/* ✅ Email section like your image */}
          <FormField
            label="Email Address"
            required
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="yourname@kln.ac.lk"
          />

          <FormField
            label="Contact Number"
            required
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            placeholder="Enter your contact number"
          />

          <PrimaryButton
            text={
              <span className="inline-flex items-center justify-center gap-2">
                Continue
              </span>
            }
            className="w-full py-3 mt-2"
            onClick={() => console.log("Lecturer details:", form)}
          />
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


function CapIcon({ className = "" }) {
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
      <path d="M22 10L12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5" />
    </svg>
  );
}
