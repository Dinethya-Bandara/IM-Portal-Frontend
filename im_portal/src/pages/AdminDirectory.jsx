import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";

export default function AdminDirectory() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Administrator", role: "Admin", username: "admin" });

  const [activeTab, setActiveTab] = useState("staff");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [staffDirectory, setStaffDirectory] = useState([]);
  const [studentDirectory, setStudentDirectory] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", position: "", room: "" });

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try { setUser(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {}
    }
    const savedStaff = localStorage.getItem("staff_directory");
    if (savedStaff) {
      setStaffDirectory(JSON.parse(savedStaff));
    } else {
      setStaffDirectory([
        { id: 1, name: "Prof. R. Jayawardena", position: "Professor", email: "r.jayawardena@university.lk", phone: "+94 77 123 4567", room: "Room 301, IM Block", addedBy: "admin" },
        { id: 2, name: "Dr. K. Silva", position: "Senior Lecturer (Academic Coordinator)", email: "k.silva@university.lk", phone: "+94 77 234 5678", room: "Room 305, IM Block", addedBy: "admin" },
      ]);
    }
    const savedStudents = localStorage.getItem("student_directory");
    if (savedStudents) setStudentDirectory(JSON.parse(savedStudents));
  }, []);

  const handleAddEntry = () => {
    if (!formData.name || !formData.email || !formData.position) {
      alert("Please fill in all required fields (Name, Email, Position)");
      return;
    }
    const newEntry = { id: Date.now(), ...formData, addedBy: user.username };
    if (activeTab === "staff") {
      const updated = [...staffDirectory, newEntry];
      setStaffDirectory(updated);
      localStorage.setItem("staff_directory", JSON.stringify(updated));
    } else {
      const updated = [...studentDirectory, newEntry];
      setStudentDirectory(updated);
      localStorage.setItem("student_directory", JSON.stringify(updated));
    }
    setFormData({ name: "", email: "", phone: "", position: "", room: "" });
    setShowAddModal(false);
  };

  const handleDelete = (id, type) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    if (type === "staff") {
      const updated = staffDirectory.filter(e => e.id !== id);
      setStaffDirectory(updated);
      localStorage.setItem("staff_directory", JSON.stringify(updated));
    } else {
      const updated = studentDirectory.filter(e => e.id !== id);
      setStudentDirectory(updated);
      localStorage.setItem("student_directory", JSON.stringify(updated));
    }
  };

  const currentDirectory = activeTab === "staff" ? staffDirectory : studentDirectory;
  const filteredDirectory = currentDirectory.filter(entry =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#E9F6F5]">
      <AdminSidebar
        userName={user.name}
        role={user.role}
        onLogout={() => { localStorage.clear(); navigate("/"); }}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <TopHeader title="Directory" username={user.username} subtitle="Admin Portal" />

        <main className="p-8 flex-1 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-7xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Directory</h2>
                <p className="text-sm text-slate-500 mt-1">Browse staff and student contact information</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-0 bg-slate-100 p-1 rounded-full w-fit">
                <button onClick={() => setActiveTab("staff")} className={`px-6 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'staff' ? 'bg-white shadow text-black' : 'text-slate-500 hover:text-slate-700'}`}>Staff Directory</button>
                <button onClick={() => setActiveTab("students")} className={`px-6 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'students' ? 'bg-white shadow text-black' : 'text-slate-500 hover:text-slate-700'}`}>Student Leaders</button>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Add Entry
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-slate-700" />
              </div>
            </div>

            {filteredDirectory.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">No entries found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDirectory.map(entry => (
                  <div key={entry.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow relative group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{entry.name}</h3>
                        <p className="text-sm text-slate-500">{entry.position}</p>
                      </div>
                      <button onClick={() => handleDelete(entry.id, activeTab)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div>{entry.email}</div>
                      {entry.phone && <div>{entry.phone}</div>}
                      {entry.room && <div>{entry.room}</div>}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                      <a href={`mailto:${entry.email}`} className="flex-1 text-center py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium">Email</a>
                      {entry.phone && <a href={`tel:${entry.phone}`} className="flex-1 text-center py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium">Call</a>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Add New Entry</h3>
            <p className="text-sm text-slate-500 mb-6">Adding to {activeTab === "staff" ? "Staff Directory" : "Student Leaders"}</p>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name", placeholder: activeTab === "staff" ? "e.g. Prof. John Doe" : "e.g. Kasun Perera" },
                { label: "Position / Role", key: "position", placeholder: activeTab === "staff" ? "e.g. Senior Lecturer" : "e.g. IMSSA President" },
                { label: "Email Address", key: "email", placeholder: "john.doe@university.lk" },
                { label: "Phone", key: "phone", placeholder: "+94 ..." },
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{f.label}</label>
                  <input className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all text-slate-800 placeholder-slate-400"
                    placeholder={f.placeholder} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                </div>
              ))}
              {activeTab === "staff" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Office / Room</label>
                  <input className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all text-slate-800 placeholder-slate-400"
                    placeholder="Room 303" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} />
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleAddEntry} className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all">Add Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
