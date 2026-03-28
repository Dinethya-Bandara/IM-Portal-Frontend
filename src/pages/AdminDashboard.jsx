import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";

// ─── Icon helpers ──────────────────────────────────────────────────
function IconBase({ className = "", children }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const HomeIcon       = (p) => <IconBase {...p}><path d="M3 10l9-7 9 7" /><path d="M9 22V12h6v10" /></IconBase>;
const UsersIcon      = (p) => <IconBase {...p}><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><circle cx="10" cy="7" r="4" /></IconBase>;
const UserPlusIcon   = (p) => <IconBase {...p}><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></IconBase>;
const BellIcon       = (p) => <IconBase {...p}><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M13.73 21a2 2 0 01-3.46 0" /></IconBase>;
const ShieldIcon     = (p) => <IconBase {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></IconBase>;
const LogoutIcon     = (p) => <IconBase {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></IconBase>;
const CalendarIcon   = (p) => <IconBase {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></IconBase>;
const BarChartIcon   = (p) => <IconBase {...p}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></IconBase>;
const CheckCircleIcon = (p) => <IconBase {...p}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></IconBase>;





// ─── Main Admin Dashboard ──────────────
export default function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Administrator",
    role: "Admin",
    username: "admin",
    email: "",
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    lecturers: 0,
    juniorStaff: 0
  });

  const [studentStatus, setStudentStatus] = useState({
    activeStudents: 0,
    inactiveStudents: 0
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }

    axios.get("http://localhost:8080/api/users/stats")
      .then(res => {
        setStats(res.data);
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
      });

    axios.get("http://localhost:8080/api/users/student-status")
    .then(res => {
      setStudentStatus(res.data);
    })
    .catch(err => {
      console.error("Error fetching student status:", err);
    });

  }, []);

  const totalStudents = studentStatus.activeStudents + studentStatus.inactiveStudents;

  const activeRate = totalStudents > 0
    ? Math.round((studentStatus.activeStudents / totalStudents) * 100)
    : 0;

  return (
    <div className="flex min-h-screen bg-[#E9F6F5]">
      <AdminSidebar
        userName={user.name}
        role={user.role}
        onLogout={() => {
          localStorage.clear();
          navigate("/");
        }}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header */}
        <AdminTopHeader userName={user.name} username={user.username} />

        <main className="p-8 flex-1">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Dashboard</h3>
              <p className="text-sm text-slate-500 mt-1">Manage users and system settings</p>
            </div>
            <button
              onClick={() => navigate("/admin-approvals")}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-teal-200 transition-all"
            >
              <CheckCircleIcon className="h-5 w-5" />
              User Approvals
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Users"      value={stats.totalUsers} icon={<UsersIcon className="h-6 w-6 text-teal-600" />}    bg="bg-teal-50"    border="border-teal-100" />
            <StatCard label="Students"         value={stats.students} icon={<CapIconS className="h-6 w-6 text-blue-600" />}     bg="bg-blue-50"    border="border-blue-100" />
            <StatCard label="Lecturers"        value={stats.lecturers}  icon={<BookIconS className="h-6 w-6 text-purple-600" />}  bg="bg-purple-50"  border="border-purple-100" />
            <StatCard label="Junior Staff Members"    value={stats.juniorStaff}   icon={<ShieldIcon className="h-6 w-6 text-orange-500" />} bg="bg-orange-50"  border="border-orange-100" />
          </div>

          {/* Bottom panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* User Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <UsersIcon className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-800">User Status</h3>
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm grid place-items-center">
                      <ActiveDotIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Active Users</p>
                      <p className="text-xs text-slate-500 mt-0.5">Level 1 – Level 4 students</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-green-600">{studentStatus.activeStudents}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm grid place-items-center">
                      <InactiveDotIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Inactive Users</p>
                      <p className="text-xs text-slate-500 mt-0.5">Out of 4th years — no longer active</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-red-500">{studentStatus.inactiveStudents}</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Active rate</span>
                    <span className="font-semibold text-slate-700">{activeRate}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${activeRate}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <ShieldIcon className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
              </div>
              <div className="space-y-3 flex-1">
                <QuickAction
                  label="User Approvals"
                  desc="Approve new registration requests"
                  onClick={() => navigate("/admin-approvals")}
                  primary
                />
                <QuickAction
                  label="View Timetable"
                  desc="Academic &amp; exam schedules"
                  onClick={() => navigate("/admin-timetable")}
                />
                <QuickAction
                  label="User Directory"
                  desc="Browse all registered users"
                  onClick={() => navigate("/admin-directory")}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function AdminTopHeader({ userName, username }) {
  const [profileImage, setProfileImage] = useState("");
  const [displayName, setDisplayName] = useState(userName);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("user");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.name) setDisplayName(parsed.name);
          if (parsed.profileImage) setProfileImage(parsed.profileImage);
        } catch (e) {}
      }
    };
    load();
    window.addEventListener("userProfileUpdate", load);
    return () => window.removeEventListener("userProfileUpdate", load);
  }, [userName]);

  return (
    <header className="w-full bg-white px-8 py-5 flex items-center justify-between shadow-sm relative z-10">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Hello, {displayName}!
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Department of Industrial Management — Admin Panel
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
          <span className="text-sm font-semibold text-slate-600">{username || displayName}</span>
        </div>
        <div className="h-10 w-10 rounded-full border-2 border-white ring-2 ring-teal-100 overflow-hidden shadow-sm">
          {profileImage ? (
            <img src={profileImage} alt="profile" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-teal-500 grid place-items-center text-white font-bold text-lg">
              {displayName?.[0]?.toUpperCase() || "A"}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function StatCard({ label, value, icon, bg, border }) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-6 shadow-sm flex items-center gap-4`}>
      <div className="h-12 w-12 rounded-xl bg-white shadow-sm grid place-items-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        <p className="text-sm font-medium text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, desc, time, bg }) {
  const bgMap = {
    teal:   "bg-teal-50 border-teal-100 text-teal-600",
    blue:   "bg-blue-50 border-blue-100 text-blue-600",
    purple: "bg-purple-50 border-purple-100 text-purple-600",
  };
  return (
    <div className={`p-4 rounded-xl border flex gap-4 ${bgMap[bg]}`}>
      <div className="h-8 w-8 rounded-lg grid place-items-center shrink-0 bg-white">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
        <span className="text-[10px] text-slate-400 font-medium block mt-2">{time}</span>
      </div>
    </div>
  );
}

function QuickAction({ label, desc, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${
        primary
          ? "bg-teal-600 border-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-200"
          : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-teal-50 hover:border-teal-200"
      }`}
    >
      <div>
        <p className={`text-sm font-bold ${primary ? "text-white" : "text-slate-800"}`}>{label}</p>
        <p className={`text-xs mt-0.5 ${primary ? "text-teal-100" : "text-slate-500"}`}>{desc}</p>
      </div>
      <ChevronRight className={`h-5 w-5 shrink-0 ${primary ? "text-white" : "text-slate-400"}`} />
    </button>
  );
}

// Inline icon helpers (to avoid import clashes)
function UserPlusIconInline(p) {
  return (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}
function CapIconS(p) {
  return (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10L12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5" />
    </svg>
  );
}
function BookIconS(p) {
  return (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function ChevronRight(p) {
  return (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function ActiveDotIcon(p) {
  return (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function InactiveDotIcon(p) {
  return (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}
