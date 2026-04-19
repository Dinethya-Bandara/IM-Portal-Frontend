import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";

export default function AdminCalendarPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Administrator", role: "Admin", username: "admin" });

  const [activeTab, setActiveTab] = useState("academic");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDateForAdd, setSelectedDateForAdd] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", color: "" });

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleDateString("default", { month: "long" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const openAddModal = (day) => {
    const d = new Date(year, month, day);
    d.setHours(12, 0, 0, 0);
    setSelectedDateForAdd(d);
    setShowAddModal(true);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !selectedDateForAdd) return;

    const payload = {
      title: newEvent.title,
      description: newEvent.description,
      color: newEvent.color,
      date: selectedDateForAdd.toISOString().split("T")[0],
      calendarType: activeTab
    };

    try {
      await fetch("http://localhost:8080/api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      setNewEvent({ title: "", description: "", color: "" });
      setShowAddModal(false);

      fetchEvents(); // refresh UI
    } catch (err) {
      console.error("Error saving event", err);
    }
  };

  const handleDeleteEvent = async (e, id) => {
    e.stopPropagation();

    try {
      await fetch(`http://localhost:8080/api/calendar/${id}`, {
        method: "DELETE"
      });

      // refresh from DB
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event", err);
    }
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    return d < today;
  };

  const renderCalendarCells = () => {
    const cells = [];
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="bg-slate-50 border border-slate-200 h-32" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const currentCellDate = new Date(year, month, day);
      const dateStr = currentCellDate.toDateString();
      const isPast = isPastDate(currentCellDate);
      
      const cellDate = new Date(year, month, day)
        .toISOString()
        .split("T")[0];

      const dayEvents = events.filter(
        e =>
          e.date === cellDate &&
          e.calendarType === activeTab
      );
      const isToday = new Date().toDateString() === dateStr;

      cells.push(
        <div key={day} onClick={() => {if (!isPast) openAddModal(day);}}
          className={`border border-slate-200 h-32 relative group transition-colors overflow-hidden flex flex-col
            ${!isPast ? 'cursor-pointer hover:bg-slate-50' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
            ${isToday ? 'bg-blue-50/30' : 'bg-white'}
          `}
        >
          <span className={`text-sm font-semibold p-2 ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>{day}</span>
          <div className="flex-1 flex flex-col gap-0.5 overflow-y-auto">
            {dayEvents.map(evt => {
              const colorClass = evt.color || (evt.title.toLowerCase().includes('mid') ? 'bg-green-100 text-green-900 border-l-4 border-green-500' : evt.title.toLowerCase().includes('final') ? 'bg-red-100 text-red-900 border-l-4 border-red-500' : 'bg-blue-100 text-blue-900 border-l-4 border-blue-500');
              return (
                <div key={evt.id} className={`text-xs p-1.5 shadow-sm min-h-[40px] relative group/evt ${colorClass} hover:brightness-95 transition`}>
                  <div className="font-bold leading-tight">{evt.title}</div>
                  {evt.description && <div className="text-[10px] opacity-90 leading-tight mt-0.5 line-clamp-2">{evt.description}</div>}
                  {!isPast && (
                    <button
                      onClick={(e) => handleDeleteEvent(e, evt.id)}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/10 hover:bg-black/20 text-black/60 opacity-0 group-hover/evt:opacity-100 transition"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return cells;
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/calendar/type/${activeTab}`);

      if (!res.ok) {
        console.error("API error:", res.status);
        setEvents([]); // prevent crash
        return;
      }

      const data = await res.json();

      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching events", err);
      setEvents([]);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#E9F6F5]">
      <AdminSidebar userName={user.name} role={user.role} onLogout={() => { localStorage.clear(); navigate("/"); }} />

      <div className="flex-1 flex flex-col min-h-screen h-screen overflow-hidden">
        <TopHeader title="Calendar" username={user.username} subtitle="Admin Portal" />

        <main className="p-8 flex-1 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 text-slate-800 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <div>
                <h2 className="text-lg font-bold">Calendar</h2>
                <p className="text-sm text-slate-500">View and manage events &amp; academic schedules</p>
              </div>
            </div>

            <div className="flex items-center gap-0 bg-slate-100 p-1 rounded-full w-fit mb-6">
              <button onClick={() => setActiveTab("academic")} className={`px-6 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'academic' ? 'bg-white shadow text-black' : 'text-slate-500 hover:text-slate-700'}`}>Academic Calendar</button>
              <button onClick={() => setActiveTab("event")} className={`px-6 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'event' ? 'bg-white shadow text-black' : 'text-slate-500 hover:text-slate-700'}`}>Event Calendar</button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-end gap-2">
                <h2 className="text-2xl font-bold text-slate-800">{monthName}</h2>
                <span className="text-2xl font-normal text-slate-500 mb-0.5">{year}</span>
                <button onClick={goToToday} className="ml-4 px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 text-slate-700">Today</button>
              </div>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 text-slate-600">‹</button>
                <button onClick={nextMonth} className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 text-slate-600">›</button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-t border-l border-r border-slate-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="py-3 text-center text-sm font-medium text-slate-500 bg-white border-b border-slate-200">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 border-l border-b border-r border-slate-200 flex-1 bg-slate-50 overflow-y-auto">
              {renderCalendarCells()}
            </div>

            <div className="flex gap-4 mt-4 text-xs text-slate-500">
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm" /> Exam/Test</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-200 rounded-sm" /> Deadline</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-sm" /> General</div>
            </div>
          </div>
        </main>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Add to {activeTab === 'academic' ? 'Academic' : 'Event'} Calendar</h3>
              <p className="text-sm text-slate-500 mb-4">Date: {selectedDateForAdd?.toLocaleDateString()}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-800"
                    value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="e.g. Mid Semester Exam" autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description (Optional)</label>
                  <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-800" rows="3"
                    value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Add details..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Color</label>
                  <div className="flex gap-3">
                    {[{ color: "bg-green-100 text-green-800", label: "Green" }, { color: "bg-red-100 text-red-800", label: "Red" }, { color: "bg-blue-100 text-blue-800", label: "Blue" }, { color: "bg-purple-100 text-purple-800", label: "Purple" }].map(c => (
                      <button key={c.label} onClick={() => setNewEvent({ ...newEvent, color: c.color })}
                        className={`w-8 h-8 rounded-full border-2 ${c.color.replace("text", "border")} ${newEvent.color === c.color ? "ring-2 ring-offset-2 ring-slate-400" : ""}`} aria-label={c.label} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={handleAddEvent} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg">Save Event</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
