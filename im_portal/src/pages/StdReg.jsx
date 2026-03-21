import React, { useState } from "react";
import logo from "../assets/logo.png";
import PrimaryButton from "../components/PrimaryButton";
import FormField from "../components/FormField";

export default function StdReg() {
  const positions = [
    "Undergraduate",
    "IMSSA President",
    "IMSSA Vice President",
    "Secretary",
    "Event Coordinator",
    "Batch Representative",
  ];

  const [form, setForm] = useState({
    studentNumber: "",
    fullName: "",
    level: "",
    batch: "",
    position: "Undergraduate",
    contactNumber: "",
  });

  const showContact = form.position !== "Undergraduate";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <div className="min-h-screen w-full bg-[#A7D9D6] flex items-center justify-center px-4 py-10">
      <div className="relative bg-white rounded-lg shadow-lg w-[700px] max-w-full pt-10 px-8 pb-8">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-5xl text-slate-700 hover:text-slate-900 mt-1"
            >
              ‹
            </button>

            <img src={logo} alt="Logo" className="h-10 w-10 shrink-0" />

            <div>
              <h3 className="text-2xl font-semibold text-slate-800 leading-tight">
                Student Registration
              </h3>
              <p className="text-sm text-slate-500">
                Step 1 of 3: Enter your details
              </p>
            </div>
          </div>

          <span className="rounded-md bg-[#0F766E] px-3 py-1 text-xs font-medium text-white">
            Undergraduate
          </span>
        </div>

        {/* FORM */}
        <div className="pt-2">
          <FormField
            label="Student Number"
            required
            name="studentNumber"
            value={form.studentNumber}
            onChange={handleChange}
            placeholder="IM/2022/117"
            hint="Format: IM/20XX/XXX (e.g., IM/2022/001, IM/2023/156)"
          />

          <FormField
            label="Full Name"
            required
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          <FormField
            label="Student Email"
            required
            name="Student Email"
            value={form.email}
            onChange={handleChange}
            placeholder="youremail@stu.kln.ac.lk"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Level"
              required
              variant="select"
              name="level"
              value={form.level}
              onChange={handleChange}
              placeholder="Select level"
              options={["Level 1", "Level 2", "Level 3", "Level 4"]}
            />

            <FormField
              label="Batch"
              required
              variant="select"
              name="batch"
              value={form.batch}
              onChange={handleChange}
              placeholder="Select batch"
              options={["21/22 Batch", "22/23 Batch", "23/24 Batch", "24/25 Batch"]}
            />
          </div>

          <FormField
            label="Position"
            required
            variant="select"
            name="position"
            value={form.position}
            onChange={(e) => {
              handleChange(e);
              if (e.target.value === "Undergraduate") {
                setForm((p) => ({ ...p, contactNumber: "" }));
              }
            }}
            options={positions}
          />

          {showContact && (
            <FormField
              label="Contact Number"
              required
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="+94 7X XXX XXXX"
              hint="Required for students with special positions"
            />
          )}
        </div>

        {/* BUTTON */}
        <div className="mt-2">
          <PrimaryButton text="Continue" className="w-full py-3" />
        </div>
      </div>
    </div>
  );
}
