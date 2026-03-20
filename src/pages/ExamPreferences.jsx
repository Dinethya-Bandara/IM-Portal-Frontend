import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import PrimaryButton from "../components/PrimaryButton";
import FormField from "../components/FormField";
import { useNavigate } from "react-router-dom";
import { can, getPortal } from "../auth/permissions";
import { getModules } from "../api/moduleApi";

export default function ExamPreferences() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "Dinethya Samuduni",
        role: "Undergraduate",
        position: "Undergraduate",
        batch: "2022/2023",
        username: "bandara-im22117",
        level: "Level 2"
    });

    // Removed static dbModules array; replaced with dynamic fetch

    // Student Form State
    const [modules, setModules] = useState([]);
    const [gap, setGap] = useState("3 days");
    const [weekends, setWeekends] = useState({ saturday: false, sunday: false });

    // Advisor Data & Filters
    const [levelFilter, setLevelFilter] = useState("Level 2"); 
    const [semesterFilter, setSemesterFilter] = useState("1");
    const [allDbModules, setAllDbModules] = useState([]);
    const [selectedAnalysisModule, setSelectedAnalysisModule] = useState("");
    const [analysisMode, setAnalysisMode] = useState("byPlace"); // 'byModule' or 'byPlace'
    const [selectedAnalysisPlace, setSelectedAnalysisPlace] = useState("1");

    const mockAdvisorSubmissions = [
        { id: 101, name: "Student A", studentId: "IM/2022/010", level: "Level 2", semester: "1", modules: ["INTE 21243", "INTE 21253", "INTE 21262"], gap: "1 day", weekends: ["Sat"], submittedDate: "10/12/2025" },
        { id: 102, name: "Student B", studentId: "IM/2022/011", level: "Level 2", semester: "1", modules: ["INTE 21253", "INTE 21243", "INTE 21262"], gap: "2 days", weekends: [], submittedDate: "10/14/2025" },
        { id: 103, name: "Student C", studentId: "IM/2022/012", level: "Level 2", semester: "1", modules: ["INTE 21243", "INTE 21253", "INTE 21262"], gap: "3 days", weekends: ["Sun"], submittedDate: "10/15/2025" },
        { id: 104, name: "Student D", studentId: "IM/2022/013", level: "Level 2", semester: "1", modules: ["INTE 21262", "INTE 21253", "INTE 21243"], gap: "2 days", weekends: ["Sat", "Sun"], submittedDate: "10/15/2025" },
        { id: 105, name: "Student E", studentId: "IM/2022/014", level: "Level 2", semester: "1", modules: ["INTE 21243", "INTE 21262", "INTE 21253"], gap: "1 day", weekends: [], submittedDate: "10/16/2025" },
        { id: 106, name: "Student F", studentId: "IM/2023/001", level: "Level 1", semester: "1", modules: ["INTE 11243"], gap: "1 day", weekends: [], submittedDate: "10/10/2025" },
    ];

    useEffect(() => {
        let currentUser = user;
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(prev => ({ ...prev, ...parsed }));
                currentUser = { ...user, ...parsed };
            } catch (e) { }
        }

        const fetchAndFilterModules = async () => {
            let loadedModules = [];
            try {
                loadedModules = await getModules();
            } catch (error) {
                console.warn("Backend not found, using fallback modules");
                loadedModules = [
                    { id: 1, moduleCode: "INTE 21243", moduleName: "Operations Management" },
                    { id: 2, moduleCode: "INTE 21253", moduleName: "Supply Chain Management" },
                    { id: 3, moduleCode: "INTE 21262", moduleName: "Statistics for Management" },
                    { id: 4, moduleCode: "INTE 11243", moduleName: "Introduction to IT" },
                    { id: 5, moduleCode: "INTE 31243", moduleName: "Advanced Databases" },
                ];
            }
            
            const standardized = loadedModules.map(m => ({
                id: m.id || m.moduleId,
                code: m.moduleCode || m.code,
                name: m.moduleName || m.name
            }));
            setAllDbModules(standardized);
            filterAndSetStudentModules(standardized, currentUser.level);
        };

        const filterAndSetStudentModules = (allModules, studentLevelStr) => {
            const studentLevelDigit = studentLevelStr ? studentLevelStr.replace(/\D/g, "") : "2";
            const currentSemester = "1"; 
            const filtered = allModules.filter(m => {
                const code = m.code || "";
                const match = code.match(/^[A-Z]+\s*(\d)(\d)\d{2}(\d)$/i);
                return match && match[1] === studentLevelDigit && match[2] === currentSemester;
            });
            setModules(filtered);
        };

        fetchAndFilterModules();
    }, []);

    // Logic for Advisor View Data
    const advisorLevelDigit = levelFilter.replace(/\D/g, "");
    const advisorModules = allDbModules.filter(m => {
        const match = m.code.match(/^[A-Z]+\s*(\d)(\d)\d{2}(\d)$/i);
        return match && match[1] === advisorLevelDigit && match[2] === semesterFilter;
    });

    useEffect(() => {
        if (advisorModules.length > 0 && !advisorModules.find(m => m.code === selectedAnalysisModule)) {
            setSelectedAnalysisModule(advisorModules[0].code);
        } else if (advisorModules.length === 0 && selectedAnalysisModule !== "") {
            setSelectedAnalysisModule("");
        }

        if (advisorModules.length > 0 && parseInt(selectedAnalysisPlace) > advisorModules.length) {
            setSelectedAnalysisPlace("1");
        }
    }, [advisorModules, selectedAnalysisModule, selectedAnalysisPlace]);

    const mappedSubmissions = mockAdvisorSubmissions.filter(s => s.level === levelFilter && s.semester === semesterFilter);

    // Build the Preference Matrix
    const calculatePreferenceMatrix = () => {
        const matrix = {};
        advisorModules.forEach(m => {
            matrix[m.code] = {};
            for (let i = 1; i <= advisorModules.length; i++) matrix[m.code][i] = 0;
        });

        mappedSubmissions.forEach(sub => {
            sub.modules.forEach((modCode, idx) => {
                if (matrix[modCode] && matrix[modCode][idx + 1] !== undefined) {
                    matrix[modCode][idx + 1]++;
                }
            });
        });
        return matrix;
    };

    const preferenceMatrix = calculatePreferenceMatrix();

    // Greedy Order Algorithm
    const calculateSuggestedOrder = () => {
        if (!advisorModules.length) return [];
        const availableModules = new Set(advisorModules.map(m => m.code));
        const availablePlaces = new Set(advisorModules.map((_, i) => i + 1));
        const assignments = []; 

        while (availableModules.size > 0 && availablePlaces.size > 0) {
            let maxVotes = -1;
            let bestModule = null;
            let bestPlace = null;

            for (const mod of availableModules) {
                for (const place of availablePlaces) {
                    const votes = preferenceMatrix[mod][place];
                    // Also tiebreaker could be applied here if needed, but simple strict > is fine
                    if (votes > maxVotes) {
                        maxVotes = votes;
                        bestModule = mod;
                        bestPlace = place;
                    }
                }
            }

            if (bestModule && bestPlace) {
                const modData = advisorModules.find(m => m.code === bestModule);
                assignments.push({ place: bestPlace, moduleCode: bestModule, moduleName: modData?.name || "", votes: maxVotes });
                availableModules.delete(bestModule);
                availablePlaces.delete(bestPlace);
            } else {
                break;
            }
        }
        return assignments.sort((a,b) => a.place - b.place);
    };

    const suggestedOrder = calculateSuggestedOrder();

    const portal = getPortal(user.role || user.position);
    const isAdvisor = can(user.position || user.role, "lecturer.viewExamPreferences");
    const isStudent = portal === "STUDENT";

    const moveModule = (index, direction) => {
        const newModules = [...modules];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newModules.length) return;
        [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
        setModules(newModules);
    };

    const handleStudentSubmit = () => {
        alert("Preferences submitted successfully!");
        navigate("/student-dashboard");
    };

    if (!isAdvisor && !isStudent) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
                    <p className="text-slate-500 mb-6">You do not have permission to view this page.</p>
                    <button onClick={() => navigate(-1)} className="px-6 py-2 bg-teal-600 text-white rounded-lg font-bold">Go Back</button>
                </div>
            </div>
        );
    }

    const portalName = isStudent ? "Student Portal" : "Lecturer Portal";

    return (
        <div className="flex min-h-screen bg-[#b9d9d7] overflow-hidden">
            <Sidebar
                userName={user.name}
                role={user.role}
                position={user.position}
                portalName={portalName}
                onLogout={() => { localStorage.clear(); navigate("/"); }}
            />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <TopHeader
                    title="Exam Preferences"
                    username={user.name}
                    subtitle={portalName}
                />

                <main className="p-10 flex-1 overflow-y-auto no-scrollbar">
                    <div className="bg-white rounded-[2rem] shadow-sm p-12 max-w-[1400px] mx-auto border border-white/20">

                        {isStudent ? (
                            // STUDENT VIEW: SUBMISSION FORM
                            <div>
                                <div className="flex items-start gap-4 mb-10">
                                    <div className="mt-1 flex items-center justify-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-slate-800">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Submit Exam Preferences</h2>
                                        <p className="text-sm font-semibold text-slate-400 mt-0.5">Help us schedule your exams by ordering modules and setting preferences</p>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    {/* Level */}
                                    <div className="max-w-md">
                                        <FormField
                                            label="Current Level"
                                            value={user.level || "Level 2"}
                                            disabled={true}
                                            className="bg-slate-50 border border-slate-100 rounded-xl px-5 text-slate-600 font-bold"
                                        />
                                    </div>

                                    {/* Module Ordering */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Preferred Exam Order</label>
                                        <p className="text-xs text-slate-400 font-bold mb-4 italic">Arrange modules in the order you wish to take exams (Top = First)</p>
                                        <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50 bg-white">
                                            {modules.map((m, idx) => (
                                                <div key={m.id} className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">{idx + 1}</span>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-800">{m.code}</div>
                                                            <div className="text-[11px] font-bold text-slate-400">{m.name}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => moveModule(idx, -1)} disabled={idx === 0} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-800 transition-colors disabled:opacity-20">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                                        </button>
                                                        <button onClick={() => moveModule(idx, 1)} disabled={idx === modules.length - 1} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-800 transition-colors disabled:opacity-20">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Gap */}
                                    <div className="max-w-md text-black">
                                        <FormField
                                            variant="select"
                                            label="Preferred Gap Between Exams"
                                            value={gap}
                                            onChange={(e) => setGap(e.target.value)}
                                            options={["1 day", "2 days", "3 days"]}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Weekends */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3">Weekend Availability</label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" checked={weekends.saturday} onChange={e => setWeekends({ ...weekends, saturday: e.target.checked })} className="w-5 h-5 rounded-md border-slate-200 text-teal-600 focus:ring-teal-500" />
                                                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Available on Saturdays</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" checked={weekends.sunday} onChange={e => setWeekends({ ...weekends, sunday: e.target.checked })} className="w-5 h-5 rounded-md border-slate-200 text-teal-600 focus:ring-teal-500" />
                                                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Available on Sundays</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-50">
                                        <PrimaryButton text="Submit Preferences" className="px-10 py-3 rounded-xl shadow-lg shadow-teal-600/20" onClick={handleStudentSubmit} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // ADVISOR VIEW: DASHBOARD (KEEP PREVIOUS)
                            <div>
                                {/* Header Box */}
                                <div className="flex items-start gap-4 mb-10">
                                    <div className="mt-1 flex items-center justify-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-slate-800">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Exam Preferences Dashboard</h2>
                                        <p className="text-sm font-semibold text-slate-400 mt-0.5">Filter, analyze, and automatically generate optimal exam orders.</p>
                                    </div>
                                </div>

                                {/* Filters Row */}
                                <div className="flex flex-wrap gap-4 mb-10">
                                    <select
                                        className="w-[200px] bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InN0YXRlLTRMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] bg-[length:16px] bg-[95%_center] bg-no-repeat"
                                        value={levelFilter}
                                        onChange={(e) => setLevelFilter(e.target.value)}
                                    >
                                        <option value="Level 1">Level 1</option>
                                        <option value="Level 2">Level 2</option>
                                        <option value="Level 3">Level 3</option>
                                        <option value="Level 4">Level 4</option>
                                    </select>
                                    <select
                                        className="w-[200px] bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InN0YXRlLTRMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] bg-[length:16px] bg-[95%_center] bg-no-repeat"
                                        value={semesterFilter}
                                        onChange={(e) => setSemesterFilter(e.target.value)}
                                    >
                                        <option value="1">Semester 1</option>
                                        <option value="2">Semester 2</option>
                                    </select>
                                </div>

                                {/* Module Analysis & Matrix */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                                    {/* Selected Module Stats */}
                                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[1.5rem] shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold text-slate-800">Priority Analysis</h3>
                                            <div className="flex bg-slate-200 p-1 rounded-lg">
                                                <button 
                                                    onClick={() => setAnalysisMode("byModule")} 
                                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${analysisMode === "byModule" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                                >
                                                    By Module
                                                </button>
                                                <button 
                                                    onClick={() => setAnalysisMode("byPlace")} 
                                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${analysisMode === "byPlace" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                                >
                                                    By Place
                                                </button>
                                            </div>
                                        </div>

                                        {analysisMode === "byModule" ? (
                                            <>
                                                <select
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                                                    value={selectedAnalysisModule}
                                                    onChange={(e) => setSelectedAnalysisModule(e.target.value)}
                                                >
                                                    <option value="" disabled>Select a module to analyze</option>
                                                    {advisorModules.map(m => (
                                                        <option key={m.code} value={m.code}>{m.code} - {m.name}</option>
                                                    ))}
                                                </select>

                                                {selectedAnalysisModule && preferenceMatrix[selectedAnalysisModule] ? (
                                                    <div className="space-y-3">
                                                        {Object.entries(preferenceMatrix[selectedAnalysisModule]).map(([place, count]) => (
                                                            <div key={place} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100">
                                                                <span className="text-sm font-bold text-slate-500">{place}{place==='1'?'st':place==='2'?'nd':place==='3'?'rd':'th'} Priority</span>
                                                                <span className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-md">{count} student{count !== 1 ? 's' : ''}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm font-bold text-slate-400">No data available for this selection.</p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <select
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                                                    value={selectedAnalysisPlace}
                                                    onChange={(e) => setSelectedAnalysisPlace(e.target.value)}
                                                >
                                                    {advisorModules.map((_, i) => {
                                                        const p = i + 1;
                                                        return <option key={p} value={p}>{p}{p===1?'st':p===2?'nd':p===3?'rd':'th'} Priority Place</option>
                                                    })}
                                                </select>

                                                <div className="space-y-3">
                                                    {[...advisorModules].sort((a, b) => {
                                                        const countA = preferenceMatrix[a.code]?.[selectedAnalysisPlace] || 0;
                                                        const countB = preferenceMatrix[b.code]?.[selectedAnalysisPlace] || 0;
                                                        return countB - countA;
                                                    }).map(m => {
                                                        const count = preferenceMatrix[m.code] ? preferenceMatrix[m.code][selectedAnalysisPlace] || 0 : 0;
                                                        return (
                                                            <div key={m.code} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100">
                                                                <span className="text-sm font-bold text-slate-700">{m.code}</span>
                                                                <span className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-md">{count} student{count !== 1 ? 's' : ''}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Final Suggested Order */}
                                    <div className="bg-teal-50/50 border border-teal-100 p-8 rounded-[1.5rem] shadow-sm flex flex-col">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                            </span>
                                            <h3 className="text-lg font-bold text-slate-800">Suggested Exam Order</h3>
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 mb-6 leading-relaxed">
                                            Mathematically optimal order automatically generated from highest student priority consensus.
                                        </p>
                                        <div className="flex-1 space-y-3">
                                            {suggestedOrder.length > 0 ? suggestedOrder.map(item => (
                                                <div key={item.moduleCode} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-teal-100 shadow-[0_2px_10px_-3px_rgba(20,184,166,0.1)]">
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-teal-600/30">
                                                        {item.place}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-bold text-slate-800 truncate">{item.moduleCode}</div>
                                                        <div className="text-[11px] font-bold text-slate-400 truncate">{item.moduleName}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Winning Votes</span>
                                                        <span className="text-sm font-bold text-teal-600">{item.votes}</span>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-teal-200 rounded-xl">
                                                    <p className="text-sm font-bold text-teal-600/60">No modules found.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
