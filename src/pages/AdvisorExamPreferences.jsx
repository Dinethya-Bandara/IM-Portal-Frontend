import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";
import { getModules } from "../api/moduleApi";

export default function AdvisorExamPreferences() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "Lecturer",
        role: "Lecturer",
        position: "Academic Advisor",
        batch: "",
        username: "",
        level: "Level 2"
    });

    // Advisor Data & Filters
    const [levelFilter, setLevelFilter] = useState("Level 2");
    const [semesterFilter, setSemesterFilter] = useState("1");
    const [allDbModules, setAllDbModules] = useState([]);
    const [selectedAnalysisModule, setSelectedAnalysisModule] = useState("");
    const [submissions, setSubmissions] = useState([]);

    // Load user from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setUser(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    // Load modules from API
    useEffect(() => {
        getModules().then(data => setAllDbModules(data));
    }, []);

    // Fetch submissions when filters change
    useEffect(() => {
        const advisorLevelDigit = levelFilter.replace(/\D/g, "");
        fetch(`http://localhost:8080/api/exam-preferences?level=${advisorLevelDigit}&semester=${semesterFilter}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then(data => setSubmissions(data))
            .catch(err => console.error(err));
    }, [levelFilter, semesterFilter]);

    const advisorLevelDigit = levelFilter.replace(/\D/g, "");

    const advisorModules = allDbModules.filter(m => {
        const match = m.code.match(/^[A-Z]+\s*(\d)(\d)\d{2}(\d)$/i);
        return match && match[1] === advisorLevelDigit && match[2] === semesterFilter;
    });

    // Build the Preference Matrix
    const calculatePreferenceMatrix = () => {
        const matrix = {};
        advisorModules.forEach(m => {
            matrix[m.code] = {};
            for (let i = 1; i <= advisorModules.length; i++) matrix[m.code][i] = 0;
        });

        submissions.forEach(sub => {
            sub.modules.forEach((m) => {
                const modCode = m.moduleCode;
                const place = m.priority;
                if (matrix[modCode] && matrix[modCode][place] !== undefined) {
                    matrix[modCode][place]++;
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
        return assignments.sort((a, b) => a.place - b.place);
    };

    const suggestedOrder = calculateSuggestedOrder();

    const portalName = "Lecturer Portal";

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
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-slate-800">Priority Analysis</h3>
                                </div>

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
                </main>
            </div>
        </div>
    );
}
