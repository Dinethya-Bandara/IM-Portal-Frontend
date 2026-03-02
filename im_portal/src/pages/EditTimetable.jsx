import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";
import { can } from "../auth/permissions";

export default function EditTimetable() {
    const navigate = useNavigate();

    // User State
    const [user, setUser] = useState({
        name: "",
        role: "Lecturer",
        position: "Academic Advisor",
        username: ""
    });

    const [selectedBatch, setSelectedBatch] = useState("2022/2023");
    const [academicData, setAcademicData] = useState({}); // { "Monday-08": [ { moduleCode... } ] }

    // Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editCellKey, setEditCellKey] = useState(null); // e.g., "Monday-08"
    const [cellForm, setCellForm] = useState({
        moduleCode: "",
        moduleName: "",
        lecturer: "",
        type: "Lecture",
        venue: "",
        credits: "",
        color: "bg-teal-50 border-teal-500 text-teal-900"
    });

    // --- LOAD DATA ---
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try { setUser(prev => ({ ...prev, ...JSON.parse(savedUser) })); } catch (e) { }
        }

        loadTimetableData(selectedBatch);
    }, [selectedBatch]);

    const loadTimetableData = (batch) => {
        const batchKeyStr = batch.replace(/[\/\s]/g, '_');
        const savedAcademic = localStorage.getItem(`timetable_academic_${batchKeyStr}`);
        if (savedAcademic) {
            setAcademicData(JSON.parse(savedAcademic));
        } else {
            // Default mock data if empty (same as viewer for consistency)
            if (batch === "2022/2023") {
                setAcademicData({
                    "Monday-08": [{ moduleCode: "INTE 22303", moduleName: "Artificial Intelligence", lecturer: "Dr. Chathura Rajapakse", type: "All", color: "bg-[#1a6b64] text-white border-transparent" }],
                    "Tuesday-08": [{ moduleCode: "INTE 22293", moduleName: "Software Architecture", lecturer: "Dr. Dilani Wickramaarachchi", type: "IT", color: "bg-[#1a6b64] text-white border-transparent" }],
                    "Wednesday-08": [{ moduleCode: "INTE 22253", moduleName: "Distributed Systems", lecturer: "Prof. Janaka Wijayanayake", type: "IT", color: "bg-[#1a6b64] text-white border-transparent" }],
                    "Thursday-08": [{ moduleCode: "MGTE 22263", moduleName: "Supply Chain Management", lecturer: "Dr. Chathumi Kavirathne", type: "MIT", color: "bg-[#1a6b64] text-white border-transparent" }],
                });
            } else {
                setAcademicData({});
            }
        }
    };

    // --- ACTIONS ---
    const handleSaveTimetable = () => {
        const batchKeyStr = selectedBatch.replace(/[\/\s]/g, '_');
        localStorage.setItem(`timetable_academic_${batchKeyStr}`, JSON.stringify(academicData));
        alert("Timetable saved successfully!");
    };

    const handleCellClick = (day, time) => {
        const key = `${day}-${time.split(':')[0]}`;
        setEditCellKey(key);
        setCellForm({ moduleCode: "", moduleName: "", lecturer: "", type: "Lecture", venue: "", credits: "", color: "bg-[#1a6b64] text-white border-transparent" });
        setShowEditModal(true);
    };

    const saveEntry = () => {
        if (!cellForm.moduleCode) return;
        const currentEntries = academicData[editCellKey] || [];
        const newEntries = [...currentEntries, { ...cellForm }];
        const updatedData = { ...academicData, [editCellKey]: newEntries };
        setAcademicData(updatedData);
        // Auto-save to local state, persistent save is via "Save Timetable" or auto if preferred. 
        // Let's do auto-sync with LS to keep viewer updated, button can be confirmation.
        const batchKeyStr = selectedBatch.replace(/[\/\s]/g, '_');
        localStorage.setItem(`timetable_academic_${batchKeyStr}`, JSON.stringify(updatedData));

        setShowEditModal(false);
    };

    const deleteEntry = (idx) => {
        const currentEntries = academicData[editCellKey] || [];
        const newEntries = currentEntries.filter((_, i) => i !== idx);
        const updatedData = { ...academicData, [editCellKey]: newEntries };
        setAcademicData(updatedData);
        const batchKeyStr = selectedBatch.replace(/[\/\s]/g, '_');
        localStorage.setItem(`timetable_academic_${batchKeyStr}`, JSON.stringify(updatedData));
    };

    // --- HELPERS ---
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = [
        "08:00", "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00"
    ];

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
                    title="Timetable Editor"
                    username={user.name}
                    subtitle={portalName}
                />

                <main className="p-8 flex-1 overflow-y-auto no-scrollbar">
                    <div className="bg-white rounded-[2rem] shadow-sm p-8 min-h-full flex flex-col border border-white/20">
                        {/* Control Bar */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Timetable Editor - {selectedBatch} Batch
                                </h2>
                                <p className="text-sm font-semibold text-slate-400 ml-9 mt-1">Click on any cell to assign or edit a module</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <select
                                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-[#1a6b64]"
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                >
                                    <option value="2021/2022">2021/2022 Batch</option>
                                    <option value="2022/2023">2022/2023 Batch</option>
                                    <option value="2023/2024">2023/2024 Batch</option>
                                </select>
                                <button
                                    onClick={handleSaveTimetable}
                                    className="px-6 py-2.5 bg-[#1a6b64] text-white text-sm font-bold rounded-xl hover:bg-[#14524d] shadow-md transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                                    Save Timetable
                                </button>
                            </div>
                        </div>

                        {/* Editor Grid */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                            {/* Header Row */}
                            <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-slate-50 border-b border-slate-200">
                                <div className="p-4 text-sm font-bold text-slate-700 text-center border-r border-slate-200 flex items-center justify-center bg-slate-100">Time</div>
                                {days.map(d => (
                                    <div key={d} className="p-4 text-sm font-bold text-slate-800 text-center border-r border-slate-200 last:border-r-0">{d}</div>
                                ))}
                            </div>

                            {/* Time Slots */}
                            {timeSlots.map((time, idx) => {
                                const isLunch = time === "12:00";
                                const nextTime = timeSlots[idx + 1] || "17:00";

                                if (isLunch) {
                                    return (
                                        <div key={time} className="grid grid-cols-[100px_1fr] bg-[#fff9c4]/40 border-b border-slate-200 h-[80px]">
                                            <div className="p-2 text-xs font-bold text-slate-600 border-r border-slate-200 flex items-center justify-center text-center bg-slate-50/50">
                                                {time} - {nextTime}
                                            </div>
                                            <div className="flex items-center justify-center gap-12 text-sm font-bold text-slate-400 uppercase tracking-widest">
                                                <span>Lunch Break</span>
                                                <span>Lunch Break</span>
                                                <span>Lunch Break</span>
                                                <span>Lunch Break</span>
                                                <span>Lunch Break</span>
                                            </div>
                                        </div>
                                    )
                                }

                                return (
                                    <div key={time} className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-slate-200 last:border-b-0 min-h-[100px]">
                                        <div className="p-4 text-xs font-bold text-slate-600 border-r border-slate-200 flex items-center justify-center bg-slate-50/30">
                                            {time} - {nextTime}
                                        </div>
                                        {days.map(day => {
                                            const key = `${day}-${time.split(':')[0]}`;
                                            const entries = academicData[key] || [];
                                            const hasEntries = entries.length > 0;

                                            return (
                                                <div
                                                    key={key}
                                                    onClick={() => handleCellClick(day, time)}
                                                    className={`border-r border-slate-100 last:border-r-0 relative transition-all cursor-pointer group hover:bg-slate-50 ${!hasEntries ? 'flex items-center justify-center' : 'p-3'}`}
                                                >
                                                    {!hasEntries ? (
                                                        <span className="text-xs font-semibold text-slate-300 group-hover:text-slate-400">Click to add</span>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {entries.map((entry, i) => (
                                                                <div key={i} className={`p-3 rounded-lg text-xs border-l-4 shadow-sm ${entry.moduleCode.startsWith("INTE") ? "bg-slate-50 border-[#1a6b64]" : "bg-slate-50 border-slate-600"}`}>
                                                                    <div className="flex justify-between items-start">
                                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white mb-1 inline-block ${entry.moduleCode.startsWith("INTE") ? "bg-[#1a6b64]" : "bg-slate-600"}`}>
                                                                            {entry.moduleCode}
                                                                        </span>
                                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                                        </div>
                                                                    </div>
                                                                    <div className="font-bold text-slate-800 leading-tight mb-1">{entry.moduleName}</div>
                                                                    <div className="text-[10px] text-slate-500 font-medium">{entry.lecturer}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-slate-100">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Manage Slot</h3>
                                <p className="text-sm font-semibold text-slate-400 capitalize">{editCellKey?.replace("-", " ")}:00</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Existing Entries List */}
                        <div className="space-y-3 mb-8">
                            {(academicData[editCellKey] || []).length > 0 ? (
                                (academicData[editCellKey] || []).map((entry, idx) => (
                                    <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex justify-between items-center group">
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{entry.moduleCode} - {entry.moduleName}</div>
                                            <div className="text-xs font-semibold text-slate-500">{entry.lecturer} ({entry.type})</div>
                                        </div>
                                        <button
                                            onClick={() => deleteEntry(idx)}
                                            className="p-2 bg-white border border-slate-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100"
                                            title="Remove module"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-sm font-semibold text-slate-400">No modules assigned to this slot yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Add New Form */}
                        <div className="border-t border-slate-100 pt-6">
                            <h4 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs">+</span>
                                Add New Module
                            </h4>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <input className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500" placeholder="Module Code" value={cellForm.moduleCode} onChange={e => setCellForm({ ...cellForm, moduleCode: e.target.value })} />
                                <input className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500" placeholder="Module Name" value={cellForm.moduleName} onChange={e => setCellForm({ ...cellForm, moduleName: e.target.value })} />
                                <input className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 col-span-2" placeholder="Lecturer Name" value={cellForm.lecturer} onChange={e => setCellForm({ ...cellForm, lecturer: e.target.value })} />
                                <select className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500" value={cellForm.type} onChange={e => setCellForm({ ...cellForm, type: e.target.value })}>
                                    <option>Lecture</option>
                                    <option>Lab</option>
                                    <option>Tutorial</option>
                                </select>
                                <input className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500" placeholder="Venue (Optional)" value={cellForm.venue} onChange={e => setCellForm({ ...cellForm, venue: e.target.value })} />
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setShowEditModal(false)} className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">Cancel</button>
                                <button onClick={saveEntry} className="flex-1 px-6 py-3 bg-[#1a6b64] text-white font-bold rounded-xl hover:bg-[#155e57] shadow-lg shadow-teal-700/20">Save & Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
