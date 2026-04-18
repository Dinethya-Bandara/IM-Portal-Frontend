import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { getModules } from "../api/moduleApi";

export default function ExamPreferences() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        role: "",
        position: "",
        batch: "",
        username: "",
        level: ""
    });

    const [allDbModules, setAllDbModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [gap, setGap] = useState("3 days");
    const [weekends, setWeekends] = useState({ saturday: false, sunday: false });
    const [submitStatus, setSubmitStatus] = useState(null); // null | "success" | "error"
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);

    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    // Load user from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setUser(prev => ({ ...prev, ...parsed }));

                checkSubmission(parsed.email);

            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    // Load all modules from API
    useEffect(() => {
        getModules().then(data => setAllDbModules(data)).catch(console.error);
    }, []);

    useEffect(() => {
        const submitted = localStorage.getItem("examSubmitted");
        if (submitted === "true") {
            setAlreadySubmitted(true);
        }
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handle = (e) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                searchRef.current && !searchRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, []);

    // Already-added module codes
    const selectedCodes = new Set(selectedModules.map(m => m.courseCode));

    // Filter modules by search query, excluding already-added ones
    const filteredModules = allDbModules.filter(m => {
        if (selectedCodes.has(m.courseCode)) return false;

        const q = searchQuery.toLowerCase();

        return (
            m.courseCode?.toLowerCase().includes(q) ||
            m.moduleName?.toLowerCase().includes(q)
        );
    });

    const addModule = (module) => {
        const alreadyExists = selectedModules.some(
            m => m.courseCode === module.courseCode
        );

        if (alreadyExists) return; //stop duplicate

        setSelectedModules(prev => [...prev, module]);
        setSearchQuery("");
        setShowDropdown(false);
    };

    const removeModule = (courseCode) => {
        setSelectedModules(prev =>
            prev.filter(m => m.courseCode !== courseCode)
        );
    };

    const moveModule = (index, direction) => {
        const newModules = [...selectedModules];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newModules.length) return;
        [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
        setSelectedModules(newModules);
    };

    const handleStudentSubmit = async () => {

        if (alreadySubmitted || isSubmitting) return;
        
        if (selectedModules.length === 0) {
            setSubmitStatus("error");
            return;
        }
        setIsSubmitting(true);
        setSubmitStatus(null);
        const payload = {
            studentEmail: user.email,
            batch: user.batch,
            level: user.level ? parseInt(user.level.replace(/\D/g, "")) : 0,
            gap,
            satAvailable: weekends.saturday,
            sunAvailable: weekends.sunday,
            modules: selectedModules.map((m, index) => ({
                courseCode: m.courseCode,
                priority: index + 1
            }))
        };

        try {
            const res = await fetch("http://localhost:8080/api/exam-preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Server error");
            
            //SUCCESS → lock submission
            setSubmitStatus("success");
            setAlreadySubmitted(true);

            //persist even after refresh
            localStorage.setItem("examSubmitted", "true");

        } catch (err) {
            console.error(err);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const ordinalLabel = (n) => {
        if (n === 1) return "1st";
        if (n === 2) return "2nd";
        if (n === 3) return "3rd";
        return `${n}th`;
    };

    const checkSubmission = async (email) => {
        try {
            const res = await fetch(`http://localhost:8080/api/exam-preferences/check?email=${email}`);
            const data = await res.json();
            setAlreadySubmitted(data.submitted);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#b9d9d7] overflow-hidden">
            <Sidebar
                userName={user.name}
                role={user.role}
                position={user.position}
                portalName="Student Portal"
                onLogout={() => { localStorage.clear(); navigate("/"); }}
            />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <TopHeader
                    title="Exam Preferences"
                    username={user.name}
                    subtitle="Student Portal"
                />

                <main className="p-10 flex-1 overflow-y-auto no-scrollbar">
                    <div className="bg-white rounded-[2rem] shadow-sm p-12 max-w-[1400px] mx-auto border border-white/20">

                        {/* Page Header */}
                        <div className="flex items-start gap-4 mb-10">
                            <div className="mt-1 flex items-center justify-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-slate-800">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Submit Exam Preferences</h2>
                                <p className="text-sm font-semibold text-slate-400 mt-0.5">Search and add modules, then arrange them in your preferred exam order</p>
                            </div>
                        </div>

                        <div className="space-y-10">

                            {/* ── Module Search & Add ── */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Search & Add Modules</label>
                                <p className="text-xs text-slate-400 font-bold mb-4 italic">Type a module code or name to search, then click to add it to your list</p>

                                <div className="relative max-w-xl">
                                    {/* Search Input */}
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </span>
                                        <input
                                            ref={searchRef}
                                            type="text"
                                            placeholder="Search by module code or name…"
                                            value={searchQuery}
                                            onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                                            onFocus={() => setShowDropdown(true)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all placeholder:text-slate-400 placeholder:font-normal"
                                        />
                                    </div>

                                    {/* Dropdown Results */}
                                    {showDropdown && searchQuery.length > 0 && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden z-50 max-h-64 overflow-y-auto"
                                        >
                                            {filteredModules.length === 0 ? (
                                                <div className="p-4 text-center text-sm text-slate-400 font-semibold">
                                                    No modules found matching "{searchQuery}"
                                                </div>
                                            ) : (
                                                filteredModules.map(m => (
                                                    <button
                                                        key={m.id}
                                                        onClick={() => addModule(m)}
                                                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-teal-50 transition-colors text-left group border-b border-slate-50 last:border-0"
                                                    >
                                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                                                            <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </span>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{m.moduleName}</div>
                                                            <div className="text-xs text-slate-400 font-semibold truncate">{m.courseCode}</div>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Module Ordering List ── */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-bold text-slate-700">Preferred Exam Order</label>
                                    {selectedModules.length > 0 && (
                                        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                                            {selectedModules.length} module{selectedModules.length !== 1 ? "s" : ""} added
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 font-bold mb-4 italic">Arrange modules in your preferred exam order using the arrows — top = first priority</p>

                                {selectedModules.length === 0 ? (
                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                                        <div className="mx-auto w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-bold text-slate-400">No modules added yet</p>
                                        <p className="text-xs text-slate-300 font-semibold mt-1">Use the search bar above to find and add modules</p>
                                    </div>
                                ) : (
                                    <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50 bg-white shadow-sm">
                                        {selectedModules.map((m, idx) => (
                                            <div
                                                key={m.id}
                                                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/60 transition-colors group"
                                            >
                                                {/* Priority Badge + Info */}
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-[11px] font-extrabold text-white shadow-md shadow-teal-500/25">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-slate-300 mt-0.5 uppercase tracking-wider">
                                                            {ordinalLabel(idx + 1)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">{m.courseCode}</div>
                                                        <div className="text-[11px] font-semibold text-slate-400">{m.moduleName}</div>
                                                    </div>
                                                </div>

                                                {/* Controls */}
                                                <div className="flex items-center gap-2">
                                                    {/* Move Up */}
                                                    <button
                                                        onClick={() => moveModule(idx, -1)}
                                                        disabled={idx === 0}
                                                        title="Move up"
                                                        className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                                                        </svg>
                                                    </button>

                                                    {/* Move Down */}
                                                    <button
                                                        onClick={() => moveModule(idx, 1)}
                                                        disabled={idx === selectedModules.length - 1}
                                                        title="Move down"
                                                        className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>

                                                    {/* Divider */}
                                                    <div className="w-px h-6 bg-slate-100 mx-1" />

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => removeModule(m.courseCode)}
                                                        title="Remove module"
                                                        className="p-2 rounded-lg bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ── Gap Preference ── */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Preferred Gap Between Exams</label>
                                <div className="flex gap-3 flex-wrap">
                                    {["1 day", "2 days", "3 days"].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setGap(opt)}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                                                gap === opt
                                                    ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/25"
                                                    : "bg-slate-50 text-slate-500 border-slate-100 hover:border-teal-300 hover:text-teal-600"
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ── Weekend Availability ── */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Weekend Availability</label>
                                <div className="flex gap-6 flex-wrap">
                                    {[
                                        { key: "saturday", label: "Available on Saturdays" },
                                        { key: "sunday",   label: "Available on Sundays"   }
                                    ].map(({ key, label }) => (
                                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                            <div
                                                onClick={() => setWeekends(prev => ({ ...prev, [key]: !prev[key] }))}
                                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                                                    weekends[key]
                                                        ? "bg-teal-600 border-teal-600"
                                                        : "border-slate-200 bg-white group-hover:border-teal-300"
                                                }`}
                                            >
                                                {weekends[key] && (
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors select-none">
                                                {label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* ── Status Messages ── */}
                            {submitStatus === "success" && (
                                <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 rounded-xl px-5 py-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-teal-700">Preferences Submitted Successfully!</p>
                                        <p className="text-xs text-teal-500 font-semibold mt-0.5">Your exam order has been saved and will be considered during scheduling.</p>
                                    </div>
                                </div>
                            )}

                            {submitStatus === "error" && selectedModules.length === 0 && (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-bold text-red-600">Please add at least one module before submitting.</p>
                                </div>
                            )}

                            {submitStatus === "error" && selectedModules.length > 0 && (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-bold text-red-600">Failed to submit. Please check your connection and try again.</p>
                                </div>
                            )}

                            {/* ── Submit ── */}
                            <div className="pt-6 border-t border-slate-50 flex items-center gap-4">
                                <PrimaryButton
                                    text={alreadySubmitted ? "Already Submitted" : (isSubmitting ? "Submitting…" : "Submit Preferences")}
                                    onClick={handleStudentSubmit}
                                    disabled={isSubmitting || alreadySubmitted}
                                />
                                {selectedModules.length > 0 && (
                                    <span className="text-xs font-bold text-slate-400">
                                        Submitting {selectedModules.length} module{selectedModules.length !== 1 ? "s" : ""} in your preferred order
                                    </span>
                                )}
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
