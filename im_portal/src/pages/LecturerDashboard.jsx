import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import DashboardTile from "../components/DashboardTile";
import { useNavigate } from "react-router-dom";

export default function LecturerDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "Ruwan Wickramasinghe",
        role: "Lecturer",
        position: "Academic Coordinator",
        username: "Ruwan Wickramasinghe"
    });

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    const portalName = "Lecturer Portal";

    return (
        <div className="flex h-screen bg-[#b9d9d7] overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                userName={user.name}
                role={user.role}
                position={user.position}
                portalName={portalName}
                onLogout={() => {
                    localStorage.clear();
                    navigate("/");
                }}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                <TopHeader
                    title={`Hello, ${user.name}`}
                    username={user.name}
                    subtitle={portalName}
                />

                <main className="p-10 flex-1 overflow-y-auto no-scrollbar">
                    {/* Dashboard Tiles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 mr-4">
                        <DashboardTile
                            title="Timetables"
                            subtitle="View academic & exam schedules"
                            icon="clock"
                            colorClass="text-blue-600"
                            onClick={() => navigate("/timetable")}
                        />
                        <DashboardTile
                            title="Upload Timetables"
                            subtitle="Manage academic schedules"
                            icon="upload"
                            colorClass="text-emerald-500"
                            onClick={() => navigate("/edit-timetable")}
                        />
                        <DashboardTile
                            title="Messages"
                            subtitle="Send announcements"
                            icon="message"
                            colorClass="text-purple-600"
                            onClick={() => navigate("/notifications")}
                        />
                        <DashboardTile
                            title="Calendar"
                            subtitle="View academic calendar"
                            icon="calendar"
                            colorClass="text-orange-500"
                            onClick={() => navigate("/calendar")}
                        />
                    </div>

                    {/* Recent Activity Panel */}
                    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm max-w-[650px]">
                        <div className="flex items-center gap-2 mb-6">
                            <ActivityIcon className="h-5 w-5 text-slate-800" />
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recent Activity</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Activity Item: Message Sent */}
                            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/30 flex gap-4">
                                <div className="mt-1 h-10 w-10 rounded-xl bg-blue-100 text-blue-600 grid place-items-center shrink-0 shadow-sm">
                                    <MessageIcon className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="text-base font-bold text-slate-900 leading-tight">Message sent to 22/23 Batch</h4>
                                    <p className="text-xs text-slate-500 mt-1">Lecture cancellation notice</p>
                                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">2 hours ago</span>
                                </div>
                            </div>

                            {/* Activity Item: Exam Timetable Updated */}
                            <div className="p-4 rounded-2xl bg-green-50/50 border border-green-100/30 flex gap-4">
                                <div className="mt-1 h-10 w-10 rounded-xl bg-green-100 text-green-600 grid place-items-center shrink-0 shadow-sm">
                                    <FileIcon className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="text-base font-bold text-slate-900 leading-tight">Exam timetable updated</h4>
                                    <p className="text-xs text-slate-500 mt-1">Published for all batches</p>
                                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">1 day ago</span>
                                </div>
                            </div>
                        </div>

                        {/* View All Button */}
                        <div className="mt-6 pt-1">
                            <button
                                onClick={() => { }}
                                className="w-full py-3 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all bg-white shadow-sm"
                            >
                                View All Activity
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Icons
function ActivityIcon(p) {
    return (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 7h18s-3 0-3-7" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}
function MessageIcon(p) {
    return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
function FileIcon(p) {
    return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
}
