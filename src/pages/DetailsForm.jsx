import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DetailsForm() {
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        role: "",
        studentNumber: "",
        universityEmail: "",
        personalEmail: "",
        contactNumber: "",
        batch: "",
        level: "",
        studentIdImage: null,
        studentIdFileName: ""
    });

    const studentRoles = [
        "Undergraduate",
        "IMSSA President",
        "IMSSA Vice President",
        "Batch Representative",
        "Secretary",
        "Junior Treasurer",
        "Event Coordinator"
    ];

    const staffRoles = ["Lecturer", "Academic Advisor", "Admin"];
    
    const allRoles = [...studentRoles, ...staffRoles];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Enforce 10 digit limit for telephone/contact number
        if (name === "contactNumber") {
            const digits = value.replace(/\D/g, "");
            if (digits.length > 10) return;
            setFormData(prev => ({ ...prev, [name]: digits }));
            return;
        }

        // Logic for auto-filling Batch/Level
        let updatedData = { ...formData, [name]: value };

        const batchLevelMap = {
            "1": "2024/2025",
            "2": "2023/2024",
            "3": "2022/2023",
            "4": "2021/2022"
        };

        const levelBatchMap = {
            "2024/2025": "1",
            "2023/2024": "2",
            "2022/2023": "3",
            "2021/2022": "4"
        };

        if (name === "level" && batchLevelMap[value]) {
            updatedData.batch = batchLevelMap[value];
        } else if (name === "batch" && levelBatchMap[value]) {
            updatedData.level = levelBatchMap[value];
        }

        setFormData(updatedData);
        if (name === "role") setRole(value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ 
                ...prev, 
                studentIdImage: file, 
                studentIdFileName: file.name
            }));
        }
    };

    const handleFileRemove = () => {
        setFormData(prev => ({ 
            ...prev, 
            studentIdImage: null,
            studentIdFileName: ""
        }));
    };

    const isStudentRole = studentRoles.includes(role);
    const isStaffRole = staffRoles.includes(role);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("firstName", formData.firstName);
        data.append("lastName", formData.lastName);
        data.append("role", formData.role);
        data.append("studentNumber", formData.studentNumber);
        data.append("universityEmail", formData.universityEmail);
        data.append("personalEmail", formData.personalEmail);
        data.append("contactNumber", formData.contactNumber);
        data.append("batch", formData.batch);
        data.append("level", formData.level);

        if (formData.studentIdImage) {
            data.append("studentIdImage", formData.studentIdImage);
        }

        const errors = [];

        if (formData.personalEmail && !formData.personalEmail.toLowerCase().endsWith("@gmail.com")) {
            errors.push("Personal email must use @gmail.com domain.");
        }

        if (isStudentRole) {
            if (!formData.universityEmail.toLowerCase().endsWith("@stu.kln.ac.lk")) {
                errors.push("Student email must use @stu.kln.ac.lk domain.");
            }
            if (!formData.studentNumber.match(/^IM\/\d{4}\/\d{3}$/i)) {
                errors.push("Student number must follow IM/2022/123.");
            }
        } else if (isStaffRole) {
            if (!formData.universityEmail.toLowerCase().endsWith("@kln.ac.lk")) {
                errors.push("University email must use @kln.ac.lk domain.");
            }
        }

        if (formData.contactNumber && formData.contactNumber.length !== 10) {
            errors.push("Contact number must be 10 digits.");
        }

        if (isStudentRole && !formData.studentIdImage) {
            errors.push("Upload Student ID.");
        }

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        try {
            await axios.post(
                "http://localhost:8080/api/candidates/create",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Form submitted successfully!");
            navigate("/");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to submit form");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
            {/* Header Area */}
            <div className="max-w-4xl w-full flex justify-between items-center mb-10">
                <div className="flex items-center">
                    <img src={logo} alt="Logo" className="h-10 w-auto" />
                    <div className="ml-4 border-l-2 border-slate-200 pl-4">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">IM PORTAL</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">User Details Form</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-slate-600 font-bold text-xs hover:text-teal-600 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </button>
            </div>

            {/* Main Form Card */}
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="bg-teal-600 h-1.5 w-full"></div>
                <div className="p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Registration Details</h2>
                        <p className="text-xs text-slate-500 mt-1.5 font-medium">Please provide your details for system access. All fields are subject to verification.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Name Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-600 ml-1">First Name</label>
                                <input 
                                    type="text" 
                                    name="firstName"
                                    required
                                    placeholder="Enter first name"
                                    className="px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-800 text-sm font-medium"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-600 ml-1">Last Name</label>
                                <input 
                                    type="text" 
                                    name="lastName"
                                    required
                                    placeholder="Enter last name"
                                    className="px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-800 text-sm font-medium"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Section 2: Role Selection */}
                        <div className="grid grid-cols-1 gap-8">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-600 ml-1">Role</label>
                                <select 
                                    name="role"
                                    required
                                    className="px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:bg-white outline-none transition-all text-slate-800 text-sm font-medium appearance-none cursor-pointer"
                                    onChange={handleInputChange}
                                    value={role}
                                >
                                    <option value="" disabled>Select your role</option>
                                    {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Section 2: Conditional Fields (Student) */}
                        {isStudentRole && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Student Number</label>
                                    <input 
                                        type="text" 
                                        name="studentNumber"
                                        required
                                        placeholder="IM/2022/123"
                                        className="px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:bg-white outline-none transition-all text-slate-800 text-sm font-medium"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Student/University Email</label>
                                    <input 
                                        type="email" 
                                        name="universityEmail"
                                        required
                                        placeholder="student@stu.kln.ac.lk"
                                        className="px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:bg-white outline-none transition-all text-slate-800 text-sm font-medium"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Batch</label>
                                    <select 
                                        name="batch"
                                        required
                                        value={formData.batch}
                                        className="px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:bg-white outline-none transition-all text-slate-800 text-sm font-medium appearance-none cursor-pointer"
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Batch</option>
                                        <option value="2021/2022">2021/2022</option>
                                        <option value="2022/2023">2022/2023</option>
                                        <option value="2023/2024">2023/2024</option>
                                        <option value="2024/2025">2024/2025</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Level</label>
                                    <select 
                                        name="level"
                                        required
                                        value={formData.level}
                                        className="px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:bg-white outline-none transition-all text-slate-800 text-sm font-medium appearance-none cursor-pointer"
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Level</option>
                                        <option value="1">Level 1</option>
                                        <option value="2">Level 2</option>
                                        <option value="3">Level 3</option>
                                        <option value="4">Level 4</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Section 2: Conditional Fields (Staff/Admin) */}
                        {isStaffRole && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-600 ml-1">University Email</label>
                                    <input 
                                        type="email" 
                                        name="universityEmail"
                                        required
                                        placeholder="university@kln.ac.lk"
                                        className="px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:bg-white outline-none transition-all text-slate-800 text-sm font-medium"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Personal Email</label>
                                    <input 
                                        type="email" 
                                        name="personalEmail"
                                        required
                                        placeholder="personal@gmail.com"
                                        className="px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:bg-white outline-none transition-all text-slate-800 text-sm font-medium"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Standard Contact Info */}
                        {role && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                {isStudentRole && (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Personal Email</label>
                                        <input 
                                            type="email" 
                                            name="personalEmail"
                                            required
                                            placeholder="personal@gmail.com"
                                            className="px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:bg-white outline-none transition-all text-slate-800 text-sm font-medium"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Contact Number (Optional)</label>
                                    <input 
                                        type="tel" 
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        placeholder="e.g. 0712345678"
                                        maxLength={10}
                                        className="px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-teal-500 focus:bg-white outline-none transition-all text-slate-800 text-sm font-medium"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Image/Document Upload for Students */}
                        {isStudentRole && (
                            <div className="flex flex-col gap-1.5 pt-4">
                                <label className="text-xs font-bold text-slate-600 ml-1">Student ID (Image or PDF)</label>
                                <div className="mt-2 flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-teal-300 transition-all cursor-pointer relative overflow-hidden group min-h-[160px]">
                                    {formData.studentIdImage ? (
                                        <div className="flex flex-col items-center w-full h-full p-4 relative z-10">
                                            {formData.studentIdImage.type === "application/pdf" ? (
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-16 h-16 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{formData.studentIdFileName}</span>
                                                </div>
                                            ) : (
                                                <img src={URL.createObjectURL(formData.studentIdImage)} alt="ID Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                                            )}
                                            
                                            <button 
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleFileRemove(); }}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors z-20"
                                                title="Remove file"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <svg className="w-10 h-10 text-slate-300 mb-3 group-hover:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-xs font-bold text-slate-500 group-hover:text-teal-600">Click or Drag to Upload ID (JPG, PNG, PDF)</p>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*,application/pdf"
                                        onChange={handleFileChange}
                                        required={isStudentRole && !formData.studentIdImage}
                                        className={`absolute inset-0 opacity-0 cursor-pointer ${formData.studentIdImage ? 'hidden' : ''}`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button 
                                type="submit"
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base py-4 rounded-xl shadow-lg shadow-teal-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                Submit for Approval
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}