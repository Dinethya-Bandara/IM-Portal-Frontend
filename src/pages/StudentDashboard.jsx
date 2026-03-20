import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import DashboardTile from "../components/DashboardTile";
import { useNavigate } from "react-router-dom";
import { can, getRole, getPortal } from "../auth/permissions";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(getRole());

  const [user, setUser] = useState({
    name: "Dinethya Samuduni",
    role: "IMSSA President",
    batch: "Batch 22/23",
    username: "bandara-im22117",
    position: "Undergraduate",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(prev => ({ ...prev, ...parsed }));
        if (parsed.role) setRole(parsed.role);
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const portalName = "Student Portal";

  return (
    <div className="flex min-h-screen bg-[#E9F6F5]">
      <Sidebar
        userName={user.name}
        batch={user.batch}
        role={user.role}
        position={user.position}
        portalName={portalName}
        onLogout={() => {
          localStorage.clear();
          navigate("/");
        }}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <TopHeader
          title={`Hello, ${user.name}!`}
          username={user.username}
          subtitle={portalName}
        />

        <main className="p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardTile
              title="Timetables"
              subtitle="View academic & exam schedules"
              icon="clock"
              colorClass="text-blue-600"
              onClick={() => navigate("/timetable")}
            />
            <DashboardTile
              title="Calendar"
              subtitle="Academic & event calendar"
              icon="calendar"
              colorClass="text-green-600"
              onClick={() => navigate("/calendar")}
            />
            {can(role, "student.sendFeedback") && (
              <DashboardTile
                title="Preferences"
                subtitle="Submit module & pathway choices"
                icon="preference"
                colorClass="text-purple-600"
                onClick={() => navigate("/exam-preferences")}
              />
            )}
            <DashboardTile
              title="GPA Calculator"
              subtitle="Calculate your GPA"
              icon="calc"
              colorClass="text-orange-500"
              onClick={() => navigate("/gpa-calculator")}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <BellIcon className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-800">Recent Notifications</h3>
              </div>
              <div className="space-y-4 flex-1">
                <Notification
                  title="Lecture Cancelled - IM3201"
                  desc="Today's 2:00 PM lecture has been cancelled"
                  time="2 hours ago"
                  icon={<MailIcon className="h-4 w-4" />}
                  bg="blue"
                />
                <Notification
                  title="Exam Timetable Updated"
                  desc="Final exam schedule is now available"
                  time="1 day ago"
                  icon={<CheckIcon className="h-4 w-4" />}
                  bg="green"
                />
              </div>
              <button
                onClick={() => navigate("/notifications")}
                className="mt-6 w-full py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                View All Notifications
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CalendarLineIcon className="h-5 w-5 text-slate-400" />
                  <h3 className="text-lg font-bold text-slate-800">Upcoming Events</h3>
                </div>
                {can(role, "student.editEventCalendar") && (
                  <button
                    onClick={() => navigate("/calendar")}
                    className="text-sm font-medium text-teal-600 hover:underline"
                  >
                    Manage Events
                  </button>
                )}
              </div>
              <div className="space-y-4 flex-1">
                <Event
                  month="NOV"
                  day="25"
                  title="IMSSA Annual General Meeting"
                  desc="Main Auditorium • 3:00 PM"
                />
                <Event
                  month="DEC"
                  day="01"
                  title="Final Exam Week Begins"
                  desc="Check exam timetable for details"
                />
              </div>
              <button
                onClick={() => navigate("/calendar")}
                className="mt-6 w-full py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                View Full Calendar
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Notification({ title, desc, time, icon, bg }) {
  const bgMap = {
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    green: "bg-green-50 border-green-100 text-green-600",
  };
  return (
    <div className={`p-4 rounded-xl border flex gap-4 ${bgMap[bg]}`}>
      <div className="h-8 w-8 rounded-lg grid place-items-center shrink-0 bg-white">{icon}</div>
      <div>
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
        <span className="text-[10px] text-slate-400 font-medium block mt-2">{time}</span>
      </div>
    </div>
  );
}

function Event({ month, day, title, desc }) {
  return (
    <div className="flex items-center gap-4 p-2">
      <div className="h-14 w-12 bg-slate-100 rounded-lg flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase">{month}</span>
        <span className="text-xl font-bold text-slate-800">{day}</span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function BellIcon(p) { return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>; }
function MailIcon(p) { return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><polyline points="22,6 12,13 2,6" /></svg>; }
function CheckIcon(p) { return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>; }
function CalendarLineIcon(p) { return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>; }
