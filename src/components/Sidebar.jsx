import React from "react";
import logo from "../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

// Simple icons component
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

const HomeIcon = (p) => <IconBase {...p}><path d="M3 10l9-7 9 7" /><path d="M9 22V12h6v10" /></IconBase>;
const ClockIcon = (p) => <IconBase {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></IconBase>;
const CalendarIcon = (p) => <IconBase {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></IconBase>;
const CheckListIcon = (p) => <IconBase {...p}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></IconBase>;
const MailIcon = (p) => <IconBase {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></IconBase>;
const UsersIcon = (p) => <IconBase {...p}><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><circle cx="10" cy="7" r="4" /></IconBase>;
const CalculatorIcon = (p) => <IconBase {...p}><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M8 7h8M8 11h8M8 15h8" /></IconBase>;
const BellIcon = (p) => <IconBase {...p}><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M13.73 21a2 2 0 01-3.46 0" /></IconBase>;
const UserIcon = (p) => <IconBase {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></IconBase>;
const LogoutIcon = (p) => <IconBase {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></IconBase>;

import { can } from "../auth/permissions";

const studentNavItems = [
  { label: "Overview", icon: HomeIcon, path: "/student-dashboard", permission: "student.view" },
  { label: "Timetable", icon: ClockIcon, path: "/timetable", permission: "student.view" },
  { label: "Calendar", icon: CalendarIcon, path: "/calendar", permission: "student.view" },
  { label: "Exam Preferences", icon: CheckListIcon, path: "/exam-preferences", permission: "student.sendFeedback" },
  { label: "Submit Feedback", icon: MailIcon, path: "/feedback", permission: "student.sendFeedback" },
  { label: "Directory", icon: UsersIcon, path: "/directory", permission: "student.view" },
  { label: "GPA Calculator", icon: CalculatorIcon, path: "/gpa-calculator", permission: "student.view" },
  { label: "Notifications", icon: BellIcon, path: "/notifications", permission: "student.view" },
  { label: "Profile", icon: UserIcon, path: "/profile", permission: "student.editProfile" },
];

const lecturerNavItems = [
  { label: "Overview", icon: HomeIcon, path: "/lecturer-dashboard", permission: "lecturer.view" },
  { label: "Timetable", icon: ClockIcon, path: "/timetable", permission: "lecturer.view" },
  { label: "Exam Preferences", icon: (p) => <IconBase {...p}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></IconBase>, path: "/exam-preferences", permission: "lecturer.viewExamPreferences" },
  { label: "Calendar", icon: CalendarIcon, path: "/calendar", permission: "lecturer.view" },
  { label: "Student Feedback", icon: (p) => <IconBase {...p}><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></IconBase>, path: "/lecturer-feedback", permission: "lecturer.viewStudentFeedback" },
  { label: "Messages", icon: (p) => <IconBase {...p}><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></IconBase>, path: "/notifications", permission: "lecturer.sendAnnouncements" },
  { label: "Directory", icon: UsersIcon, path: "/directory", permission: "lecturer.viewStudentDirectory" },
  { label: "Profile", icon: UserIcon, path: "/lecturer-profile", permission: "lecturer.editProfile" },
];

const juniorStaffNavItems = [
  { label: "Overview", icon: HomeIcon, path: "/junior-staff-dashboard", permission: "staff.view" },
  { label: "View Timetable", icon: ClockIcon, path: "/timetable", permission: "staff.view" },
  { label: "Calendar", icon: CalendarIcon, path: "/calendar", permission: "staff.view" },
  { label: "Student Feedback", icon: (p) => <IconBase {...p}><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></IconBase>, path: "/lecturer-feedback", permission: "staff.view" },
  { label: "Messages", icon: (p) => <IconBase {...p}><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></IconBase>, path: "/notifications", permission: "staff.view" },
  { label: "Directory", icon: UsersIcon, path: "/directory", permission: "staff.view" },
  { label: "Profile", icon: UserIcon, path: "/junior-staff-profile", permission: "staff.view" },
];

export default function Sidebar({
  userName = "Nuwan",
  batch = "Batch 22/23",
  role = "Lecturer",
  position = "Academic Advisor",
  portalName = "Lecturer Portal",
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentName, setCurrentName] = React.useState(userName);

  React.useEffect(() => {
    const loadName = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.name) {
            setCurrentName(parsed.name);
          }
        } catch (e) { }
      }
    };
    loadName();
    window.addEventListener("userProfileUpdate", loadName);
    return () => window.removeEventListener("userProfileUpdate", loadName);
  }, [userName]);

  const isJuniorStaff = portalName.toLowerCase().includes("junior");
  const isLecturerPortal = portalName.toLowerCase().includes("lecturer") || isJuniorStaff;

  let rawItems = studentNavItems;
  if (isJuniorStaff) rawItems = juniorStaffNavItems;
  else if (isLecturerPortal) rawItems = lecturerNavItems;

  let checkRole = role;

  if (role?.toLowerCase().includes("junior")) {
    checkRole = "staff";
  } else if (role?.toLowerCase().includes("lecturer")) {
    checkRole = "lecturer";
  } else if (role?.toLowerCase().includes("student")) {
    checkRole = "student";
  }

  const navItems = rawItems.filter(item => {
    if (!item.permission) return true;
    return can(checkRole, item.permission);
  });

  const isLecturer = portalName.toLowerCase().includes("lecturer");

  return (
    <aside className="w-[280px] min-h-screen bg-white flex flex-col shadow-sm relative z-20 border-r border-slate-100">
      {/* Brand */}
      <div className="px-8 py-8 flex items-center gap-4 border-b border-slate-50">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <div>
          <h5 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">IM PORTAL</h5>
          <p className="text-xs text-slate-500 font-medium">{portalName}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.label === "Overview" && location.pathname === "/lecturer-dashboard");
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg text-sm font-semibold transition-all relative ${isActive
                ? "bg-blue-50/50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 rounded-r-md"></div>}
              <Icon className={`h-6 w-6 ${isActive ? "text-blue-600 font-bold" : "text-slate-500"}`} />
              <span className={isActive ? "font-bold" : "font-medium"}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-8 border-t border-slate-100 bg-white">
        <div className="mb-6">
          <h4 className="text-lg font-bold text-slate-900 leading-none mb-1">{currentName}</h4>
          <p className="text-sm font-medium text-slate-500 mb-3">{role}</p>
          {(position) && (
            <div className="inline-block rounded-lg bg-blue-600 text-white px-4 py-1.5 text-xs font-bold shadow-md shadow-blue-200">
              {position}
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-all active:scale-95 shadow-sm"
        >
          <LogoutIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
