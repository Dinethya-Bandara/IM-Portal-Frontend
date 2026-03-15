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

    // Advisor Data
    const [selectedBatch, setSelectedBatch] = useState("22/23 Batch");

    const mockSubmissionsDB = {
        "21/22 Batch": [
            { id: 1, name: "Kasun Perera", studentId: "IM/2021/004", level: "Level 4", modules: ["IM4001", "IM4002"], gap: "1 day(s)", weekends: ["Sat"], submittedDate: "10/12/2025" },
            { id: 2, name: "Nimali Fernando", studentId: "IM/2021/012", level: "Level 4", modules: ["IM4002", "IM4001"], gap: "2 day(s)", weekends: [], submittedDate: "10/14/2025" },
        ],
        "22/23 Batch": [
            { id: 1, name: "John Doe", studentId: "IM/2022/001", level: "Level 3", modules: ["IM3001", "IM3002", "IM3003"], gap: "2 day(s)", weekends: ["Sat"], submittedDate: "10/15/2025" },
            { id: 2, name: "Jane Smith", studentId: "IM/2022/002", level: "Level 3", modules: ["IM3002", "IM3001", "IM3005"], gap: "1 day(s)", weekends: ["Sat", "Sun"], submittedDate: "10/15/2025" },
            { id: 3, name: "Mike Johnson", studentId: "IM/2022/003", level: "Level 3", modules: ["IM3001", "IM3003", "IM3002"], gap: "3 day(s)", weekends: [], submittedDate: "10/16/2025" },
        ],
        "23/24 Batch": [
            { id: 1, name: "Shehan Silva", studentId: "IM/2023/008", level: "Level 2", modules: ["IM2001", "IM2002"], gap: "3 day(s)", weekends: ["Sun"], submittedDate: "10/18/2025" },
        ],
        "24/25 Batch": []
    };

    const submissions = mockSubmissionsDB[selectedBatch] || [];

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
            try {
                // Try fetching from the DB
                const data = await getModules();
                filterAndSetModules(data, currentUser.level);
            } catch (error) {
                // Fallback to mock data if backend api/modules doesn't exist yet
                console.warn("Backend not found, using fallback modules");
                const fallbackModules = [
                    { id: 1, moduleCode: "INTE 21243", moduleName: "Operations Management" },
                    { id: 2, moduleCode: "INTE 21253", moduleName: "Supply Chain Management" },
                    { id: 3, moduleCode: "INTE 21262", moduleName: "Statistics for Management" },
                    { id: 4, moduleCode: "INTE 11243", moduleName: "Introduction to IT" },
                    { id: 5, moduleCode: "INTE 31243", moduleName: "Advanced Databases" },
                ];
                filterAndSetModules(fallbackModules, currentUser.level);
            }
        };

        const filterAndSetModules = (allModules, studentLevelStr) => {
            // E.g. "Level 2" -> "2"
            const studentLevelDigit = studentLevelStr ? studentLevelStr.replace(/\D/g, "") : "2";
            const currentSemester = "1"; // Defaulting to Semester 1 for now

            const filtered = allModules.filter(m => {
                const code = m.moduleCode || m.code || "";
                // Match prefix followed by space, then 5 digits. Groups: 1=Level, 2=Sem, 3=Credits
                // Example: INTE 21243 -> Level: 2, Sem: 1, Credits: 3
                const match = code.match(/^[A-Z]+\s*(\d)(\d)\d{2}(\d)$/i);
                if (match) {
                    const level = match[1];
                    const sem = match[2];
                    // Only show modules matching the student's level and current semester
                    return level === studentLevelDigit && sem === currentSemester;
                }
                return false;
            });

            // Standardize keys for the UI
            setModules(filtered.map(m => ({
                id: m.id || m.moduleId,
                code: m.moduleCode || m.code,
                name: m.moduleName || m.name
            })));
        };

        fetchAndFilterModules();
    }, []);

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
                                        <p className="text-sm font-semibold text-slate-400 mt-0.5">View and analyze student exam preferences</p>
                                    </div>
                                </div>

                                {/* Filters Row */}
                                <div className="flex gap-4 mb-10">
                                    <select
                                        className="w-[300px] bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InN0YXRlLTRMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] bg-[length:16px] bg-[95%_center] bg-no-repeat"
                                        value={selectedBatch}
                                        onChange={(e) => setSelectedBatch(e.target.value)}
                                    >
                                        <option>21/22 Batch</option>
                                        <option>22/23 Batch</option>
                                        <option>23/24 Batch</option>
                                        <option>24/25 Batch</option>
                                    </select>
                                    <div className="w-[300px] bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 flex items-center">
                                        {selectedBatch === "21/22 Batch" ? "Level 4" :
                                            selectedBatch === "22/23 Batch" ? "Level 3" :
                                                selectedBatch === "23/24 Batch" ? "Level 2" : "Level 1"}
                                    </div>
                                </div>

                                {/* Summary Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                    <div className="bg-white border border-slate-100 p-6 rounded-[1.2rem] shadow-sm">
                                        <h4 className="text-4xl font-bold text-slate-900 mb-1">{submissions.length}</h4>
                                        <p className="text-xs font-bold text-slate-400">Total Submissions</p>
                                    </div>
                                    <div className="bg-white border border-slate-100 p-6 rounded-[1.2rem] shadow-sm">
                                        <h4 className="text-4xl font-bold text-slate-900 mb-1">{submissions.filter(s => s.weekends.includes("Sat")).length}</h4>
                                        <p className="text-xs font-bold text-slate-400">Saturday Available</p>
                                    </div>
                                    <div className="bg-white border border-slate-100 p-6 rounded-[1.2rem] shadow-sm">
                                        <h4 className="text-4xl font-bold text-slate-900 mb-1">{submissions.filter(s => s.weekends.includes("Sun")).length}</h4>
                                        <p className="text-xs font-bold text-slate-400">Sunday Available</p>
                                    </div>
                                </div>

                                {/* Submissions Table */}
                                <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-white border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-[13px] font-bold text-slate-500">Student</th>
                                                <th className="px-6 py-4 text-[13px] font-bold text-slate-500">Level</th>
                                                <th className="px-6 py-4 text-[13px] font-bold text-slate-500">Module Order</th>
                                                <th className="px-6 py-4 text-[13px] font-bold text-slate-500">Gap</th>
                                                <th className="px-6 py-4 text-[13px] font-bold text-slate-500">Weekend</th>
                                                <th className="px-6 py-4 text-[13px] font-bold text-slate-500">Submitted</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-50">
                                            {submissions.map((sub) => (
                                                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="font-bold text-slate-800 text-[13px]">{sub.name}</div>
                                                        <div className="text-[11px] font-bold text-slate-400 mt-0.5">{sub.studentId}</div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-3 py-1.5 rounded-full border border-slate-100 text-[10px] font-bold text-slate-400 bg-white">{sub.level}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-wrap gap-2">
                                                            {sub.modules.map((m, i) => (
                                                                <span key={i} className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-700">
                                                                    <span className="text-slate-400">{i + 1}.</span> {m}
                                                                </span>
                                                            ))}
                                                            <span className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-[10px] font-bold text-slate-400 border border-transparent">+2 more</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="text-sm font-bold text-slate-700">{sub.gap}</div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex gap-1.5">
                                                            {sub.weekends.length > 0 ? sub.weekends.map((w, i) => (
                                                                <span key={i} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase">{w}</span>
                                                            )) : <span className="text-[10px] font-bold text-slate-300 uppercase">None</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-[13px] font-bold text-slate-400">
                                                        {sub.submittedDate}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
