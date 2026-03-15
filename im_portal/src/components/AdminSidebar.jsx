import React from "react";
import logo from "../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

function IconBase({ className = "", children }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const HomeIcon     = (p) => <IconBase {...p}><path d="M3 10l9-7 9 7" /><path d="M9 22V12h6v10" /></IconBase>;
const UserPlusIcon = (p) => <IconBase {...p}><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></IconBase>;
const UsersIcon    = (p) => <IconBase {...p}><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><circle cx="10" cy="7" r="4" /></IconBase>;
const BellIcon     = (p) => <IconBase {...p}><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M13.73 21a2 2 0 01-3.46 0" /></IconBase>;
const CalendarIcon = (p) => <IconBase {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></IconBase>;
const BarChartIcon = (p) => <IconBase {...p}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></IconBase>;
const ShieldIcon   = (p) => <IconBase {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></IconBase>;
const LogoutIcon   = (p) => <IconBase {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></IconBase>;

const ClockIcon    = (p) => <IconBase {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></IconBase>;

const adminNavItems = [
  { label: "Overview",        icon: HomeIcon,     path: "/admin-dashboard" },
  { label: "Register User",   icon: UserPlusIcon, path: "/create-account" },
  { label: "Timetable",       icon: ClockIcon,    path: "/admin-timetable" },
  { label: "User Directory",  icon: UsersIcon,    path: "/admin-directory" },
  { label: "Notifications",   icon: BellIcon,     path: "/admin-notifications" },
  { label: "Calendar",        icon: CalendarIcon, path: "/admin-calendar" },
  { label: "Reports",         icon: BarChartIcon, path: "/admin-reports" },
];

export default function AdminSidebar({ userName = "Administrator", role = "Admin", onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentName, setCurrentName] = React.useState(userName);

  React.useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("user");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.name) setCurrentName(parsed.name);
        } catch (e) {}
      }
    };
    load();
    window.addEventListener("userProfileUpdate", load);
    return () => window.removeEventListener("userProfileUpdate", load);
  }, [userName]);

  return (
    <aside className="w-[280px] min-h-screen bg-white flex flex-col shadow-sm relative z-20 border-r border-slate-100">
      {/* Brand */}
      <div className="px-8 py-8 flex items-center gap-4 border-b border-slate-50">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <div>
          <h5 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">IM PORTAL</h5>
          <p className="text-xs text-slate-500 font-medium">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
        {adminNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg text-sm font-semibold transition-all relative ${
                isActive
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-600 rounded-r-md" />
              )}
              <Icon className={`h-6 w-6 ${isActive ? "text-teal-600" : "text-slate-500"}`} />
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
          <div className="inline-block rounded-lg bg-teal-600 text-white px-4 py-1.5 text-xs font-bold shadow-md shadow-teal-200">
            Administrator
          </div>
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
