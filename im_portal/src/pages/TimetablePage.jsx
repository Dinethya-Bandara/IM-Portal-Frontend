import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import TimetableCell from "../components/TimetableCell";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { can } from "../auth/permissions";
import { getPortalName } from "../utils/portalHelpers";
import AddModulePopup from "../components/AddModulePopup";

export default function TimetablePage() {
    const navigate = useNavigate();
    const pdfRef = useRef(); // Ref for Academic Timetable
    const examPdfRef = useRef(); // Ref for Exam Timetable

    // User State
    const [user, setUser] = useState({
        name: "Dinethya Samuduni",
        role: "IMSSA President",
        batch: "Batch 22/23",
        username: "bandara-im22117",
        position: ""
    });

    // View State
    const [activeTab, setActiveTab] = useState("academic"); // 'academic' | 'exam'
    const [selectedBatch, setSelectedBatch] = useState("2022/2023");

    // Data State
    const [academicData, setAcademicData] = useState({}); // { "Monday-08": [ { moduleCode, moduleName... } ] }
    const [examData, setExamData] = useState([]); // Array of exam entries

    // Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editCellKey, setEditCellKey] = useState(null); // e.g., "Monday-08"
    const [editingEntryIndex, setEditingEntryIndex] = useState(null); // if editing specific sub-entry

    // Exam Modal State
    const [showExamModal, setShowExamModal] = useState(false);
    const [examForm, setExamForm] = useState({
        date: "",
        day: "",
        time: "",
        moduleCode: "",
        moduleName: "",
        venue: ""
    });

    // Academic Edit Form
    const [cellForm, setCellForm] = useState({
        isLunchBreak: false,
        moduleCode: "",
        moduleName: "",
        lecturer: "",
        type: "Lecture", // Lecture/Lab/Tutorial
        stream: "All", // IT/MIT/All
        category: "Compulsory", // Compulsory/Optional
        venue: "",
        credits: "",
        color: "bg-teal-50 border-teal-500 text-teal-900"
    });

    // --- MOCK DB & LOAD ---
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try { setUser(prev => ({ ...prev, ...JSON.parse(savedUser) })); } catch (e) { }
        }

        const batchKeyStr = selectedBatch.replace(/[\/\s]/g, '_');

        // Load Academic Data for specific batch
        const savedAcademic = localStorage.getItem(`timetable_academic_${batchKeyStr}`);
        if (savedAcademic) {
            setAcademicData(JSON.parse(savedAcademic));
        } else {
            // Default mock data based on batch
            if (selectedBatch === "2022/2023") {
                setAcademicData({
                    "Monday-08": [{ moduleCode: "INTE 22303", moduleName: "Artificial Intelligence", lecturer: "Dr. Chathura Rajapakse", type: "All", color: "bg-emerald-50 border-emerald-600 text-emerald-900" }],
                    "Tuesday-08": [{ moduleCode: "INTE 22293", moduleName: "Software Architecture", lecturer: "Dr. Dilani Wickramaarachchi", type: "IT", color: "bg-emerald-50 border-emerald-600 text-emerald-900" }],
                    "Wednesday-08": [{ moduleCode: "INTE 22253", moduleName: "Distributed Systems", lecturer: "Prof. Janaka Wijayanayake", type: "IT", color: "bg-emerald-50 border-emerald-600 text-emerald-900" }],
                    "Thursday-08": [{ moduleCode: "MGTE 22263", moduleName: "Supply Chain Management", lecturer: "Dr. Chathumi Kavirathne", type: "MIT", color: "bg-emerald-50 border-emerald-600 text-emerald-900" }],
                });
            } else if (selectedBatch === "2021/2022") {
                setAcademicData({
                    "Monday-09": [{ moduleCode: "INTE 32303", moduleName: "Advanced Databases", lecturer: "Prof. S. Perera", type: "All", color: "bg-blue-50 border-blue-600 text-blue-900" }],
                    "Friday-10": [{ moduleCode: "MGTE 32263", moduleName: "Innovation Management", lecturer: "Dr. N. Gamage", type: "MIT", color: "bg-orange-50 border-orange-600 text-orange-900" }],
                });
            } else {
                setAcademicData({});
            }
        }

        // Load Exam Data for specific batch
        const savedExam = localStorage.getItem(`timetable_exam_${batchKeyStr}`);
        if (savedExam) {
            setExamData(JSON.parse(savedExam));
        } else {
            if (selectedBatch === "2022/2023") {
                setExamData([
                    { id: 1, date: "2025-12-01", day: "Monday", time: "09:00 - 12:00", moduleCode: "INTE 22303", moduleName: "Artificial Intelligence", venue: "A8 - 203" },
                    { id: 2, date: "2025-12-03", day: "Wednesday", time: "09:00 - 12:00", moduleCode: "INTE 22343", moduleName: "Data Structures", venue: "A8 - 203" },
                ]);
            } else {
                setExamData([]);
            }
        }
    }, [selectedBatch]);

    // --- PERMISSIONS ---
    const isAcademicAdvisor = () => {
        const checkRole = (user.role && (user.role.toLowerCase().includes("lecturer") || user.role.toLowerCase().includes("advisor"))) ? user.position || user.role : user.role;
        return can(checkRole, "lecturer.editAcademicTimetable");
    };
    const canEdit = isAcademicAdvisor();

    // --- HELPERS ---
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = [
        "08:00", "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00"
    ];

    const getPortalName = (role) => {
        const r = role?.toLowerCase() || "";
        if (r.includes("lecturer") || r.includes("hod") || r.includes("advisor") || r.includes("treasurer")) return "Lecturer Portal";
        if (r.includes("junior staff")) return "Junior Staff Portal";
        return "Student Portal";
    };

    // --- ACADEMIC ACTIONS ---
    const handleCellClick = (day, time) => {
        const key = `${day}-${time.split(':')[0]}`;
        setEditCellKey(key);
        setEditingEntryIndex(null);
        setShowEditModal(true);
        setCellForm({ isLunchBreak: false, moduleCode: "", moduleName: "", lecturer: "", type: "Lecture", stream: "All", category: "Compulsory", venue: "", credits: "", color: "bg-teal-50 border-teal-500 text-teal-900" });
    };

    const saveAcademicEntry = () => {
        if (!canEdit) return;

        let entryColor;
        let entryData;

        if (cellForm.isLunchBreak) {
            entryColor = "bg-yellow-100 border-yellow-400 text-yellow-800";
            entryData = {
                moduleCode: "",
                moduleName: "Lunch Break",
                lecturer: "",
                type: "Lunch",
                stream: "All",
                category: "Compulsory",
                venue: "",
                credits: "",
                color: entryColor
            };
        } else {
            if (!cellForm.moduleCode) return;
            const colorMap = {
                "Lecture": "bg-teal-50 border-teal-500 text-teal-900",
                "Lab": "bg-blue-50 border-blue-500 text-blue-900",
                "Tutorial": "bg-purple-50 border-purple-500 text-purple-900"
            };
            entryColor = colorMap[cellForm.type] || colorMap["Lecture"];
            entryData = { ...cellForm, color: entryColor };
        }

        const currentEntries = academicData[editCellKey] || [];
        const newEntries = [...currentEntries, entryData];
        const updatedData = { ...academicData, [editCellKey]: newEntries };
        setAcademicData(updatedData);
        const batchKeyStr = selectedBatch.replace(/[\/\s]/g, '_');
        localStorage.setItem(`timetable_academic_${batchKeyStr}`, JSON.stringify(updatedData));
        setCellForm({ isLunchBreak: false, moduleCode: "", moduleName: "", lecturer: "", type: "Lecture", stream: "All", category: "Compulsory", venue: "", credits: "", color: "bg-teal-50 border-teal-500 text-teal-900" });
        setShowEditModal(false);
    };

    const deleteAcademicEntry = (idx) => {
        if (!canEdit) return;
        const currentEntries = academicData[editCellKey] || [];
        const newEntries = currentEntries.filter((_, i) => i !== idx);
        const updatedData = { ...academicData, [editCellKey]: newEntries };
        setAcademicData(updatedData);
        const batchKeyStr = selectedBatch.replace(/[\/\s]/g, '_');
        localStorage.setItem(`timetable_academic_${batchKeyStr}`, JSON.stringify(updatedData));
    };

    const saveExamEntry = () => {
        if (!canEdit) return;
        const newItem = { id: Date.now(), ...examForm };
        const updated = [...examData, newItem];
        setExamData(updated);
        const batchKeyStr = selectedBatch.replace(/[\/\s]/g, '_');
        localStorage.setItem(`timetable_exam_${batchKeyStr}`, JSON.stringify(updated));
        setExamForm({ date: "", day: "", time: "", moduleCode: "", moduleName: "", venue: "" });
        setShowExamModal(false);
    };

    const deleteExamEntry = (examId) => {
        if (!canEdit) return;
        const updated = examData.filter(exam => exam.id !== examId);
        setExamData(updated);
        const batchKeyStr = selectedBatch.replace(/[\/\s]/g, '_');
        localStorage.setItem(`timetable_exam_${batchKeyStr}`, JSON.stringify(updated));
    };

    const downloadPDF = async (ref, filename) => {
        const element = ref.current;
        if (!element) return;
        const canvas = await html2canvas(element, { scale: 2 });
        const data = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
    };

    const portalName = getPortalName(user.role);

    return (
        <div className="flex min-h-screen bg-[#E9F6F5]">
            <Sidebar
                userName={user.name}
                batch={user.batch}
                role={user.role}
                position={user.position}
                portalName={portalName}
                onLogout={() => { localStorage.clear(); navigate("/"); }}
            />

            <div className="flex-1 flex flex-col min-h-screen h-screen overflow-hidden">
                <TopHeader
                    title="Timetable"
                    username={user.username}
                    subtitle={portalName}
                />

                <main className="p-8 flex-1 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-2 text-slate-800">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <div>
                                    <h2 className="text-lg font-bold">Timetable</h2>
                                    <p className="text-sm text-slate-500">View and manage academic and exam timetables</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <select
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-teal-500"
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                >
                                    <option value="2021/2022">2021/2022 Batch</option>
                                    <option value="2022/2023">2022/2023 Batch</option>
                                    <option value="2023/2024">2023/2024 Batch</option>
                                    <option value="2024/2025">2024/2025 Batch</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-0 bg-slate-100 p-1 rounded-full w-fit">
                                <button
                                    onClick={() => setActiveTab("academic")}
                                    className={`px-6 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'academic' ? 'bg-white shadow text-black' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Academic Timetable
                                </button>
                                <button
                                    onClick={() => setActiveTab("exam")}
                                    className={`px-6 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'exam' ? 'bg-white shadow text-black' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Exam Timetable
                                </button>
                            </div>

                            <button
                                onClick={() => downloadPDF(activeTab === 'academic' ? pdfRef : examPdfRef, `${activeTab}_timetable.pdf`)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Download PDF
                            </button>
                        </div>

                        {activeTab === "academic" && (
                            <div ref={pdfRef} className="bg-white overflow-x-auto pb-4">
                                <div className="min-w-[800px] border border-slate-200 rounded-lg overflow-hidden">
                                    <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-slate-50 border-b border-slate-200">
                                        <div className="p-3 text-sm font-bold text-slate-600 text-center border-r border-slate-200 flex items-center justify-center">Time</div>
                                        {days.map(d => (
                                            <div key={d} className="p-3 text-sm font-bold text-slate-800 text-center border-r border-slate-200 last:border-r-0">{d}</div>
                                        ))}
                                    </div>

                                    {timeSlots.map((time, idx) => {
                                        const isLunch = time === "12:00";
                                        const nextTime = timeSlots[idx + 1] || "17:00";

                                        return (
                                            <div key={time} className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-slate-200 last:border-b-0">
                                                <div className={`p-2 text-xs font-semibold text-slate-500 border-r border-slate-200 flex items-center justify-center text-center ${isLunch ? 'bg-yellow-50/50' : ''}`}>
                                                    {time} - {nextTime}
                                                </div>
                                                {days.map(day => {
                                                    const key = `${day}-${time.split(':')[0]}`;
                                                    const entries = academicData[key] || [];
                                                    return (
                                                        <div key={key} className={`relative min-h-[80px] ${isLunch ? 'bg-yellow-50/10' : ''}`}>
                                                            <TimetableCell
                                                                entries={entries}
                                                                onClick={() => handleCellClick(day, time)}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 flex gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-teal-50 border border-teal-500"></div> Lecture</div>
                                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-50 border border-blue-500"></div> Lab</div>
                                </div>
                            </div>
                        )}

                        {activeTab === "exam" && (
                            <div className="space-y-4">
                                {canEdit && (
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setShowExamModal(true)}
                                            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700"
                                        >
                                            + Add Exam
                                        </button>
                                    </div>
                                )}

                                <div ref={examPdfRef} className="border border-slate-200 rounded-lg overflow-hidden min-w-[800px]">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                            <tr>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Day</th>
                                                <th className="p-4">Time</th>
                                                <th className="p-4">Module Code</th>
                                                <th className="p-4">Module Name</th>
                                                <th className="p-4">Venue</th>
                                                {canEdit && <th className="p-4 text-center">Actions</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {examData.length === 0 ? (
                                                <tr><td colSpan={canEdit ? 7 : 6} className="p-8 text-center text-slate-400">No exams scheduled</td></tr>
                                            ) : (
                                                examData.map(ex => (
                                                    <tr key={ex.id} className="border-b border-slate-100 hover:bg-slate-50 group">
                                                        <td className="p-4 text-slate-600">{ex.date}</td>
                                                        <td className="p-4 text-slate-600">{ex.day}</td>
                                                        <td className="p-4 text-slate-600 font-medium">{ex.time}</td>
                                                        <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700">{ex.moduleCode}</span></td>
                                                        <td className="p-4 font-semibold text-slate-800">{ex.moduleName}</td>
                                                        <td className="p-4 text-slate-600">{ex.venue}</td>
                                                        {canEdit && (
                                                            <td className="p-4 text-center">
                                                                <button
                                                                    onClick={() => deleteExamEntry(ex.id)}
                                                                    className="px-3 py-1.5 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                                    title="Delete exam entry"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <AddModulePopup
                    showModal={showEditModal}
                    setShowModal={setShowEditModal}
                    editCellKey={editCellKey}
                    academicData={academicData}
                    canEdit={canEdit}
                    cellForm={cellForm}
                    setCellForm={setCellForm}
                    saveAcademicEntry={saveAcademicEntry}
                    deleteAcademicEntry={deleteAcademicEntry}
                />

                {showExamModal && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Add Exam Schedule</h3>
                            <div className="space-y-4">
                                <input type="date" className="w-full px-4 py-3 border-2 border-slate-400 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" value={examForm.date} onChange={e => setExamForm({ ...examForm, date: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input className="px-4 py-3 border-2 border-slate-400 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Day" value={examForm.day} onChange={e => setExamForm({ ...examForm, day: e.target.value })} />
                                    <input className="px-4 py-3 border-2 border-slate-400 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Time" value={examForm.time} onChange={e => setExamForm({ ...examForm, time: e.target.value })} />
                                </div>
                                <input className="w-full px-4 py-3 border-2 border-slate-400 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Module Code" value={examForm.moduleCode} onChange={e => setExamForm({ ...examForm, moduleCode: e.target.value })} />
                                <input className="w-full px-4 py-3 border-2 border-slate-400 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Module Name" value={examForm.moduleName} onChange={e => setExamForm({ ...examForm, moduleName: e.target.value })} />
                                <input className="w-full px-4 py-3 border-2 border-slate-400 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Venue" value={examForm.venue} onChange={e => setExamForm({ ...examForm, venue: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button onClick={() => setShowExamModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-700 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                                <button onClick={saveExamEntry} className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-md transition-colors">Save Exam</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
