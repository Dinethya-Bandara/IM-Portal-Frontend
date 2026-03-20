import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import TopHeader from "../components/TopHeader";

function IconBase({ className = "", children }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const LogInIcon = (p) => <IconBase {...p}><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></IconBase>;
const UsersIcon = (p) => <IconBase {...p}><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><circle cx="10" cy="7" r="4" /></IconBase>;
const ActivityIcon = (p) => <IconBase {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></IconBase>;
const TrendingUpIcon = (p) => <IconBase {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></IconBase>;
const TrendingDownIcon = (p) => <IconBase {...p}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></IconBase>;

export default function AdminReports() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Administrator", role: "Admin", username: "admin" });

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try { setUser((prev) => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {}
    }
  }, []);

  const featureUsageData = [
    { name: "View Timetable", count: 852, color: "bg-blue-500" },
    { name: "GPA Calculator", count: 640, color: "bg-teal-500" },
    { name: "Submit Feedback", count: 420, color: "bg-purple-500" },
    { name: "Check Notifications", count: 380, color: "bg-orange-500" },
    { name: "Update Profile", count: 156, color: "bg-pink-500" }
  ];

  const maxCount = Math.max(...featureUsageData.map(d => d.count));

  return (
    <div className="flex min-h-screen bg-[#E9F6F5]">
      <AdminSidebar userName={user.name} role={user.role} onLogout={() => { localStorage.clear(); navigate("/"); }} />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <TopHeader title="System Usage Report" subtitle="Admin Portal" username={user.username} />

        <main className="p-8 flex-1 max-w-7xl mx-auto w-full">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">System Usage & Analytics</h3>
              <p className="text-sm text-slate-500 mt-1">Track system performance and user interactions over the last 30 days</p>
            </div>
            <select className="px-4 py-2 border border-slate-300 bg-white rounded-lg text-sm text-slate-700 font-medium shadow-sm outline-none focus:ring-2 focus:ring-teal-500">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>All Time</option>
            </select>
          </div>

          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
              <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <LogInIcon className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Number of Logins</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-xl font-extrabold text-slate-800">12,450</span>
                  <span className="text-xs font-bold text-green-500 mb-0.5 flex items-center gap-0.5"><TrendingUpIcon className="w-3 h-3" /> 12%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
              <div className="h-14 w-14 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <UsersIcon className="h-7 w-7 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Active Users</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-xl font-extrabold text-slate-800">842</span>
                  <span className="text-xs font-bold text-green-500 mb-0.5 flex items-center gap-0.5"><TrendingUpIcon className="w-3 h-3" /> 4%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
              <div className="h-14 w-14 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <UsersIcon className="h-7 w-7 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Inactive Users</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-xl font-extrabold text-slate-800">114</span>
                  <span className="text-xs font-bold text-red-500 mb-0.5 flex items-center gap-0.5"><TrendingDownIcon className="w-3 h-3" /> 2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Feature Usage Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Feature Usage Breakdown</h3>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">Top 5 Features</span>
              </div>
              
              <div className="flex-1 space-y-6">
                {featureUsageData.map((item, idx) => {
                  const percentage = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-700">{item.name}</span>
                        <span className="text-sm font-bold text-slate-900">{item.count} <span className="text-xs font-medium text-slate-400">interactions</span></span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
