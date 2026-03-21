import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";

export default function GPACalculator() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "Dinethya Samuduni",
        role: "IMSSA President",
        batch: "2022/2023",
        username: "bandara-im22117"
    });

    // Grade scale reference
    const gradeScale = [
        { grade: "A", points: 4.0 },
        { grade: "A-", points: 3.7 },
        { grade: "B+", points: 3.3 },
        { grade: "B", points: 3.0 },
        { grade: "B-", points: 2.7 },
        { grade: "C+", points: 2.3 },
        { grade: "C", points: 2.0 },
        { grade: "C-", points: 1.7 },
        { grade: "D+", points: 1.3 },
        { grade: "D", points: 1.0 },
        { grade: "F", points: 0.0 }
    ];

    // Mock module database
    const moduleDatabase = [
        { code: "IM2103", name: "Statistics for Industrial Management" },
        { code: "IM2002", name: "Quality Management" },
        { code: "IM2003", name: "Supply Chain Management" },
        { code: "IM2004", name: "Operations Management" },
        { code: "IM2005", name: "Financial Management" },
        { code: "IM1001", name: "Introduction to Management" },
        { code: "IM1002", name: "Business Mathematics" },
        { code: "INTE2303", name: "Artificial Intelligence" },
        { code: "INTE2293", name: "Software Architecture" },
    ];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedModules, setSelectedModules] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(prev => ({ ...prev, ...parsed }));
            } catch (e) { }
        }

        // Load saved modules
        const saved = localStorage.getItem(`gpa_modules_${user.username}`);
        if (saved) {
            setSelectedModules(JSON.parse(saved));
        }
    }, [user.username]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const results = moduleDatabase.filter(m =>
                m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const getCredits = (moduleCode) => {
        // Last digit is the number of credits
        const lastChar = moduleCode.charAt(moduleCode.length - 1);
        return parseInt(lastChar) || 3; // Default to 3 if not a number
    };

    const addModule = (module) => {
        if (selectedModules.find(m => m.code === module.code)) {
            alert("Module already added!");
            return;
        }

        const newModule = {
            ...module,
            credits: getCredits(module.code),
            grade: "B" // Default grade
        };

        const updated = [...selectedModules, newModule];
        setSelectedModules(updated);
        localStorage.setItem(`gpa_modules_${user.username}`, JSON.stringify(updated));
        setSearchQuery("");
        setSearchResults([]);
    };

    const updateGrade = (moduleCode, newGrade) => {
        const updated = selectedModules.map(m =>
            m.code === moduleCode ? { ...m, grade: newGrade } : m
        );
        setSelectedModules(updated);
        localStorage.setItem(`gpa_modules_${user.username}`, JSON.stringify(updated));
    };

    const removeModule = (moduleCode) => {
        const updated = selectedModules.filter(m => m.code !== moduleCode);
        setSelectedModules(updated);
        localStorage.setItem(`gpa_modules_${user.username}`, JSON.stringify(updated));
    };

    const calculateGPA = () => {
        if (selectedModules.length === 0) return 0;

        let totalPoints = 0;
        let totalCredits = 0;

        selectedModules.forEach(module => {
            const gradeInfo = gradeScale.find(g => g.grade === module.grade);
            const points = gradeInfo ? gradeInfo.points : 0;
            totalPoints += points * module.credits;
            totalCredits += module.credits;
        });

        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    };

    const gpa = calculateGPA();
    const totalCredits = selectedModules.reduce((sum, m) => sum + m.credits, 0);

    const getPortalName = (role) => {
        const r = role?.toLowerCase() || "";
        if (r.includes("lecturer") || r.includes("hod") || r.includes("advisor") || r.includes("treasurer")) return "Lecturer Portal";
        if (r.includes("staff")) return "Junior Staff Portal";
        return "Student Portal";
    };

    return (
        <div className="flex min-h-screen bg-[#E9F6F5]">
            <Sidebar
                userName={user.name}
                batch={user.batch}
                role={user.role}
                position={user.position}
                portalName={getPortalName(user.role)}
                onLogout={() => { localStorage.clear(); navigate("/"); }}
            />

            <div className="flex-1 flex flex-col min-h-screen">
                <TopHeader
                    title="GPA Calculator"
                    username={user.username}
                    subtitle={getPortalName(user.role)}
                />

                <main className="p-8 flex-1 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-sm p-8 max-w-5xl mx-auto">

                        {/* Header */}
                        <div className="flex items-start gap-4 mb-6">
                            <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">GPA Calculator</h2>
                                <p className="text-sm text-slate-500 mt-1">Calculate your GPA for IM department modules</p>
                            </div>
                        </div>

                        {/* Add Module Section */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-700 mb-3">Add Module</h3>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search module..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                                />

                                {/* Search Results Dropdown */}
                                {searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                                        {searchResults.map(module => (
                                            <button
                                                key={module.code}
                                                onClick={() => addModule(module)}
                                                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                                            >
                                                <div className="font-semibold text-slate-800 text-sm">{module.code} - {module.name}</div>
                                                <div className="text-xs text-slate-500 mt-1">{getCredits(module.code)} Credits</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected Modules */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-700 mb-3">Selected Modules</h3>
                            {selectedModules.length === 0 ? (
                                <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
                                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                    <p className="text-slate-400 text-sm">No modules added yet. Search and add modules above.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedModules.map(module => (
                                        <div key={module.code} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="flex-1">
                                                <div className="font-bold text-slate-800 text-sm">{module.code}</div>
                                                <div className="text-xs text-slate-500">{module.name}</div>
                                                <div className="text-xs text-slate-400 mt-1">{module.credits} Credits</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={module.grade}
                                                    onChange={(e) => updateGrade(module.code, e.target.value)}
                                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
                                                >
                                                    {gradeScale.map(g => (
                                                        <option key={g.grade} value={g.grade}>{g.grade}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => removeModule(module.code)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove Module"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* GPA Display */}
                        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 text-center mb-8 border border-teal-100">
                            <div className="text-sm font-semibold text-slate-600 mb-2">Current GPA</div>
                            <div className="text-6xl font-bold text-teal-700 mb-4">{gpa}</div>
                            <div className="flex justify-center gap-8 text-sm">
                                <div>
                                    <div className="text-slate-500">Modules</div>
                                    <div className="font-bold text-slate-800 text-lg">{selectedModules.length}</div>
                                </div>
                                <div className="w-px bg-slate-200"></div>
                                <div>
                                    <div className="text-slate-500">Credits</div>
                                    <div className="font-bold text-slate-800 text-lg">{totalCredits}</div>
                                </div>
                            </div>
                        </div>

                        {/* Grade Scale Reference */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-4">Grade Scale Reference</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {gradeScale.map(item => (
                                    <div key={item.grade} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="font-bold text-slate-800">{item.grade}</span>
                                        <span className="text-slate-600">{item.points.toFixed(1)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
