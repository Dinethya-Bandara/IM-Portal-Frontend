import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TopHeader from "../components/TopHeader";
import TimetableCell from "../components/TimetableCell";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AddModulePopup from "../components/AddModulePopup";
import axios from "axios";

export default function AdminTimetablePage() {
  const navigate = useNavigate();
  const pdfRef = useRef();
  const examPdfRef = useRef();

  const [user, setUser] = useState({ name: "Administrator", role: "Admin", username: "admin" });
  const [activeTab, setActiveTab] = useState("academic");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [academicData, setAcademicData] = useState({});
  const [examData, setExamData] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editCellKey, setEditCellKey] = useState(null);
  const [showExamModal, setShowExamModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  

  const [examForm, setExamForm] = useState({ date: "", day: "", time: "", moduleCode: "", moduleName: "", venue: "" });
  const [cellForm, setCellForm] = useState({
    isLunchBreak: false, moduleCode: "", moduleName: "", lecturer: "", type: "Lecture", stream: "All", category: "Compulsory", venue: "", credits: "", color: "bg-teal-50 border-teal-500 text-teal-900"
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchAcademicTimetable();
      fetchExamTimetable();
    }
  }, [selectedBatch]);

  useEffect(() => {
    console.log("STATE batches:", batches);
  }, [batches]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

  const handleCellClick = (day, time) => {
    setErrorMessage("");
    const key = `${day}-${time.split(":")[0]}`;
    setEditCellKey(key);
    setShowEditModal(true);
    setCellForm({ isLunchBreak: false, moduleCode: "", moduleName: "", lecturer: "", type: "Lecture", stream: "All", category: "Compulsory", venue: "", credits: "", color: "bg-teal-50 border-teal-500 text-teal-900" });
  };

  const fetchBatches = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/batches");

      console.log("API RESPONSE:", res.data);

      setBatches(res.data);

    } catch (err) {
      console.error("Error fetching batches", err);
    }
  };

  const saveAcademicEntry = async () => {
    try {
      setErrorMessage("");
      let entryData;

      if (cellForm.isLunchBreak) {
        entryData = {
          courseCode: null,   // ✅ IMPORTANT
          day: editCellKey.split("-")[0],
          timeSlot: editCellKey.split("-")[1],
          batchId: selectedBatch,
          timetableType: "ACADEMIC",
          lectureType: null,
          stream: null,
          isCompulsory: null,
          venue: null,
          isLunchBreak: true
        };
      } else {
        if (!cellForm.moduleCode) return;

        entryData = {
          courseCode: cellForm.moduleCode,
          lectureType: cellForm.type,
          timetableType: "ACADEMIC",
          day: editCellKey.split("-")[0],
          isCompulsory: cellForm.category === "Compulsory",
          timeSlot: editCellKey.split("-")[1],
          batchId: selectedBatch,
          stream: cellForm.stream,
          venue: cellForm.venue,
          isLunchBreak: false
        };
      }

      console.log("ENTRY DATA:", entryData);
      await axios.post("http://localhost:8080/api/timetable", entryData);

      // Refresh data from backend
      fetchAcademicTimetable();

      setShowEditModal(false);

    } catch (error) {
      console.log("ERROR RESPONSE:", error.response?.data);

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Something went wrong";

      setErrorMessage(message);
    }
  };

  const deleteAcademicEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/timetable/${id}`);
      fetchAcademicTimetable();
    } catch (error) {
      console.error(error);
    }
  };

  const saveExamEntry = async () => {
    try {
      setErrorMessage("");
      const newItem = {
        batchId: selectedBatch,
        timetableType: "EXAM",

        courseCode: examForm.moduleCode,
        timeSlot: examForm.time, 
        venue: examForm.venue,
        date: examForm.date,

        day: examForm.day
      };

      console.log("EXAM DATA:", newItem);

      await axios.post("http://localhost:8080/api/timetable", newItem);

      fetchExamTimetable();
      setShowExamModal(false);

    } catch (error) {
      console.log("ERROR RESPONSE:", error.response?.data);

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Something went wrong";

      setErrorMessage(message);
    }
  };

  const deleteExamEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/timetable/${id}`);
      fetchExamTimetable();
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPDF = async (ref, filename) => {
    const el = ref.current;
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2 });
    const data = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pw = pdf.internal.pageSize.getWidth();
    const ph = (canvas.height * pw) / canvas.width;
    pdf.addImage(data, "PNG", 0, 0, pw, ph);
    pdf.save(filename);
  };

  const fetchAcademicTimetable = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/timetable?batchId=${selectedBatch}&type=ACADEMIC`
      );

      const data = response.data;

      // convert backend array into frontend format
      const formatted = {};

      data.forEach(item => {
        const key = `${item.day}-${item.timeSlot}`;
        if (!formatted[key]) formatted[key] = [];
        formatted[key].push(item);
      });

      setAcademicData(formatted);

    } catch (error) {
      console.error("Error fetching academic timetable", error);
    }
  };

  const fetchExamTimetable = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/timetable?batchId=${selectedBatch}&type=EXAM`
      );

      console.log("EXAM DATA FROM BACKEND:", response.data);

      setExamData(response.data);

    } catch (error) {
      console.error("Error fetching exams", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#E9F6F5]">
      <AdminSidebar userName={user.name} role={user.role} onLogout={() => { localStorage.clear(); navigate("/"); }} />

      <div className="flex-1 flex flex-col min-h-screen h-screen overflow-hidden">
        <TopHeader title="Timetable" username={user.username} subtitle="Admin Portal" />

        <main className="p-8 flex-1 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full flex flex-col">

            {/* Header row */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2 text-slate-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h2 className="text-lg font-bold">Timetable</h2>
                  <p className="text-sm text-slate-500">View &amp; manage academic and exam timetables</p>
                </div>
              </div>

              <select
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(Number(e.target.value))}
              >
                <option value="">Select Batch</option>

                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.batch}
                  </option>
                ))}
              </select>
            </div>

            {/* Tab row */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-0 bg-slate-100 p-1 rounded-full w-fit">
                <button onClick={() => setActiveTab("academic")} className={`px-6 py-2 rounded-full text-sm font-semibold transition ${activeTab === "academic" ? "bg-white shadow text-black" : "text-slate-500 hover:text-slate-700"}`}>Academic Timetable</button>
                <button onClick={() => setActiveTab("exam")} className={`px-6 py-2 rounded-full text-sm font-semibold transition ${activeTab === "exam" ? "bg-white shadow text-black" : "text-slate-500 hover:text-slate-700"}`}>Exam Timetable</button>
              </div>
              <button
                onClick={() => downloadPDF(activeTab === "academic" ? pdfRef : examPdfRef, `${activeTab}_timetable.pdf`)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download PDF
              </button>
            </div>

            {/* Academic grid */}
            {activeTab === "academic" && (
              <div ref={pdfRef} className="bg-white overflow-x-auto pb-4">
                <div className="min-w-[800px] border border-slate-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-slate-50 border-b border-slate-200">
                    <div className="p-3 text-sm font-bold text-slate-600 text-center border-r border-slate-200 flex items-center justify-center">Time</div>
                    {days.map(d => <div key={d} className="p-3 text-sm font-bold text-slate-800 text-center border-r border-slate-200 last:border-r-0">{d}</div>)}
                  </div>

                  {timeSlots.map((time, idx) => {
                    const isLunch = time === "12:00";
                    const nextTime = timeSlots[idx + 1] || "17:00";
                    if (isLunch) {
                      return (
                        <div key={time} className="grid grid-cols-[100px_1fr] bg-yellow-50/50 border-b border-slate-200 h-[60px]">
                          <div className="p-2 text-xs font-semibold text-slate-500 border-r border-slate-200 flex items-center justify-center text-center">{time} - {nextTime}<br />Lunch</div>
                          <div className="flex items-center justify-center text-sm font-medium text-slate-400 italic">Lunch Break</div>
                        </div>
                      );
                    }
                    return (
                      <div key={time} className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-slate-200 last:border-b-0">
                        <div className="p-2 text-xs font-semibold text-slate-500 border-r border-slate-200 flex items-center justify-center">{time} - {nextTime}</div>
                        {days.map(day => {
                          const key = `${day}-${time.split(":")[0]}`;
                          return (
                            <div key={key} className="relative min-h-[80px]">
                              <TimetableCell entries={academicData[key] || []} onClick={() => handleCellClick(day, time)} />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-teal-50 border border-teal-500" /> Lecture</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-50 border border-blue-500" /> Lab</div>
                </div>
              </div>
            )}

            {/* Exam table */}
            {activeTab === "exam" && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button onClick={() => setShowExamModal(true)} className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700">
                    + Add Exam
                  </button>
                </div>
                <div ref={examPdfRef} className="border border-slate-200 rounded-lg overflow-hidden min-w-[800px]">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-4">Date</th><th className="p-4">Day</th><th className="p-4">Time</th>
                        <th className="p-4">Module Code</th><th className="p-4">Module Name</th><th className="p-4">Venue</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examData.length === 0 ? (
                        <tr><td colSpan={7} className="p-8 text-center text-slate-400">No exams scheduled</td></tr>
                      ) : (
                        examData.map(ex => (
                          <tr key={ex.id} className="border-b border-slate-100 hover:bg-slate-50 group">
                            <td className="p-4 text-slate-600">{ex.date}</td>
                            <td className="p-4 text-slate-600">{ex.day}</td>
                            <td className="p-4 text-slate-600 font-medium">{ex.timeSlot}</td>
                            <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700">{ex.courseCode}</span></td>
                            <td className="p-4 font-semibold text-slate-800">{ex.moduleName}</td>
                            <td className="p-4 text-slate-600">{ex.venue}</td>
                            <td className="p-4 text-center">
                              <button onClick={() => deleteExamEntry(ex.id)}
                                className="px-3 py-1.5 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                Delete
                              </button>
                            </td>
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

        {/* Academic slot modal */}
        <AddModulePopup
            showModal={showEditModal}
            setShowModal={setShowEditModal}
            editCellKey={editCellKey}
            academicData={academicData}
            canEdit={true}
            cellForm={cellForm}
            setCellForm={setCellForm}
            saveAcademicEntry={saveAcademicEntry}
            deleteAcademicEntry={deleteAcademicEntry}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
        />

        {/* Exam add modal */}
        {showExamModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Add Exam Schedule</h3>
              <div className="space-y-4">
                <input type="date" className="w-full px-4 py-3 border-2 border-slate-400 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500" value={examForm.date} onChange={e => setExamForm({ ...examForm, date: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <input className="px-4 py-3 border-2 border-slate-400 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Day" value={examForm.day} onChange={e => setExamForm({ ...examForm, day: e.target.value })} />
                  <input className="px-4 py-3 border-2 border-slate-400 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Time" value={examForm.time} onChange={e => setExamForm({ ...examForm, time: e.target.value })} />
                </div>
                <input className="w-full px-4 py-3 border-2 border-slate-400 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Module Code" value={examForm.moduleCode} onChange={e => setExamForm({ ...examForm, moduleCode: e.target.value })} />
                <input className="w-full px-4 py-3 border-2 border-slate-400 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Module Name" value={examForm.moduleName} onChange={e => setExamForm({ ...examForm, moduleName: e.target.value })} />
                <input className="w-full px-4 py-3 border-2 border-slate-400 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Venue" value={examForm.venue} onChange={e => setExamForm({ ...examForm, venue: e.target.value })} />
              </div>

              {errorMessage && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => {setShowExamModal(false); setErrorMessage("");}} className="px-5 py-2.5 text-sm font-bold text-slate-700 border-2 border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                <button onClick={saveExamEntry} className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-md">Save Exam</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
