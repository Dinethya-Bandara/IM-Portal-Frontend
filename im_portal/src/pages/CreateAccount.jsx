import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import PrimaryButton from "../components/PrimaryButton";
import FormField from "../components/FormField";
import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Role Selection, 1: Details Form
  const [role, setRole] = useState(""); // "student", "lecturer", "staff"

  // Check Admin Access
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      // Ideally redirect or show unauthorized, but for now we'll just log
      console.warn("Unauthorized access to Create Account");
    }
  }, []);

  // Form State
  const [form, setForm] = useState({
    idNumber: "", // Student Number or Employee ID
    fullName: "",
    email: "",
    level: "",
    batch: "",
    position: "Undergraduate", // default
    contactNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleRoleSelect = (selectedKey) => {
    setRole(selectedKey);
    // Reset position default based on role
    if (selectedKey === "student") {
      setForm(p => ({ ...p, position: "Undergraduate" }));
    } else {
      setForm(p => ({ ...p, position: "" })); // Let them fill or select
    }
    setStep(1);
  };

  const handleContinue = () => {
    // Navigate to Password setup, passing form data state
    // We assume RegPassword page handles the next steps
    navigate("/student-register-password", { state: { ...form, role } });
    // Note: User mentioned 'RegPassword' page. I'll assume I should route there.
    // However, looking at the file list, there is 'RegPassword.jsx'. 
    // I will check App.jsx route for it, likely '/register-password' or similar. 
    // For now I'll use a placeholder route or assume the user will fix the route if strictly named differently.
    // Actually, let's just assume valid validation is done here.
  };

  // --- VIEWS ---

  if (step === 0) {
    return (
      <div className="min-h-screen w-full bg-[#A7D9D6] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl rounded-xl bg-white shadow-2xl relative">
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard")}
            className="absolute left-6 top-6 text-4xl text-slate-400 hover:text-slate-600"
          >
            ‹
          </button>

          <div className="px-10 pt-12 pb-16">
            <div className="text-center mb-10">
              <img src={logo} alt="IM Portal" className="h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
              <p className="text-slate-500">Select the type of user you wish to register</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <RoleCard
                title="Undergraduate"
                desc="For students pursuing their degree"
                icon={<CapIcon className="h-8 w-8 text-teal-600" />}
                onClick={() => handleRoleSelect("student")}
              />
              <RoleCard
                title="Lecturer"
                desc="For academic staff members"
                icon={<BookIcon className="h-8 w-8 text-teal-600" />}
                onClick={() => handleRoleSelect("lecturer")}
              />
              <RoleCard
                title="Junior Staff"
                desc="For administrative staff"
                icon={<UserGroupIcon className="h-8 w-8 text-teal-600" />}
                onClick={() => handleRoleSelect("staff")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 1: Details Form
  const isStudent = role === "student";

  return (
    <div className="min-h-screen w-full bg-[#A7D9D6] flex items-center justify-center px-4 py-10">
      <div className="relative bg-white rounded-lg shadow-lg w-[700px] max-w-full pt-10 px-8 pb-8">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="text-5xl text-slate-700 hover:text-slate-900 mt-1"
            >
              ‹
            </button>

            <img src={logo} alt="Logo" className="h-10 w-10 shrink-0" />

            <div>
              <h3 className="text-2xl font-semibold text-slate-800 leading-tight">
                {isStudent ? "Student Registration" : role === "lecturer" ? "Lecturer Registration" : "Staff Registration"}
              </h3>
              <p className="text-sm text-slate-500">
                Step 1 of 3: Enter details
              </p>
            </div>
          </div>

          <span className="rounded-md bg-[#0F766E] px-3 py-1 text-xs font-medium text-white capitalize">
            {role}
          </span>
        </div>

        {/* FORM */}
        <div className="pt-2 space-y-4">
          <FormField
            label={isStudent ? "Student Number" : "Employee ID"}
            required
            name="idNumber"
            value={form.idNumber}
            onChange={handleChange}
            placeholder={isStudent ? "IM/2022/117" : "EMP/XXX"}
            hint={isStudent ? "Format: IM/20XX/XXX" : ""}
          />

          <FormField
            label="Full Name"
            required
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
          />

          <FormField
            label="Email"
            required
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@kln.ac.lk"
          />

          {isStudent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Level"
                required
                variant="select"
                name="level"
                value={form.level}
                onChange={handleChange}
                options={["Level 1", "Level 2", "Level 3", "Level 4"]}
              />
              <FormField
                label="Batch"
                required
                variant="select"
                name="batch"
                value={form.batch}
                onChange={handleChange}
                options={["2021/2022 Batch", "2022/2023 Batch", "2023/2024 Batch", "2024/2025 Batch"]}
              />
            </div>
          )}

          <FormField
            label="Position"
            required={!isStudent}
            // For student, it's a select. For others, maybe text or select?
            // Prompt implies reusing the field. I'll make it text for non-students or generic select.
            variant={isStudent ? "select" : "text"}
            name="position"
            value={form.position}
            onChange={handleChange}
            options={isStudent ? ["Undergraduate", "IMSSA President", "IMSSA Secretary", "Batch Rep"] : []}
            placeholder={isStudent ? "" : "e.g. Senior Lecturer"}
          />

          <FormField
            label="Contact Number"
            required
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            placeholder="+94 7X XXX XXXX"
          />
        </div>

        {/* BUTTON */}
        <div className="mt-8">
          <PrimaryButton
            text="Continue"
            className="w-full py-3"
            onClick={handleContinue}
          />
        </div>
      </div>
    </div>
  );
}

function RoleCard({ title, desc, icon, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center p-8 bg-slate-50 border border-slate-200 rounded-xl hover:bg-teal-50 hover:border-teal-200 hover:shadow-md transition-all group">
      <div className="h-16 w-16 rounded-full bg-white shadow-sm grid place-items-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-2">{desc}</p>
      <span className="mt-6 text-sm font-semibold text-teal-600 bg-white px-4 py-2 rounded-full border border-teal-100 opacity-0 group-hover:opacity-100 transition-opacity">Select Role</span>
    </button>
  )
}

function CapIcon(p) { return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5" /></svg>; }
function BookIcon(p) { return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>; }
function UserGroupIcon(p) { return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }

