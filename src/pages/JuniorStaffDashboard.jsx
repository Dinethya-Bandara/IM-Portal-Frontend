import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";

export default function JuniorStaffDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "Kasuni",
        role: "Junior Staff",
        position: "Clerk",
        username: "staff-01"
    });

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(prev => ({ ...prev, ...parsed }));
            } catch (e) { }
        }
    }, []);

    const portalName = "Junior Staff Portal";

    return (
        <div className="flex min-h-screen bg-[#b9d9d7] overflow-hidden">
            <Sidebar
                userName={user.name}
                role={user.role}
                position={user.position}
                portalName={portalName}
                onLogout={() => { localStorage.clear(); navigate("/"); }}
            />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <TopHeader
                    title={`Hello, ${user.name}`}
                    username={user.name}
                    subtitle={portalName}
                />

                <main className="p-8 flex-1 overflow-y-auto no-scrollbar">
                    {/* Top Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Timetables Card */}
                        <div onClick={() => navigate('/timetable')} className="bg-white p-6 rounded-[1.5rem] shadow-sm cursor-pointer hover:shadow-md transition-shadow group">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Timetables</h3>
                            <p className="text-sm font-semibold text-slate-400">View academic & exam schedules</p>
                        </div>

                        {/* Event Calendar Card */}
                        <div onClick={() => navigate('/calendar')} className="bg-white p-6 rounded-[1.5rem] shadow-sm cursor-pointer hover:shadow-md transition-shadow group">
                            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Event Calendar</h3>
                            <p className="text-sm font-semibold text-slate-400">Manage department events</p>
                        </div>

                        {/* Staff Directory Card */}
                        <div onClick={() => navigate('/directory')} className="bg-white p-6 rounded-[1.5rem] shadow-sm cursor-pointer hover:shadow-md transition-shadow group">
                            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Staff Directory</h3>
                            <p className="text-sm font-semibold text-slate-400">Contact information</p>
                        </div>
                    </div>

                    {/* Main Content Areas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Upcoming Events */}
                        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex flex-col h-full">
                            <h3 className="text-md font-bold text-slate-700 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Upcoming Events
                            </h3>

                            <div className="space-y-4 flex-1">
                                <div className="border border-slate-100 rounded-xl p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg w-14 h-14 shrink-0">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">NOV</span>
                                        <span className="text-xl font-bold text-slate-800">25</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">IMSSA Annual General Meeting</div>
                                        <div className="text-xs font-semibold text-slate-400 mt-1">Main Auditorium • 3:00 PM</div>
                                    </div>
                                </div>

                                <div className="border border-slate-100 rounded-xl p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg w-14 h-14 shrink-0">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">DEC</span>
                                        <span className="text-xl font-bold text-slate-800">01</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">Final Exam Week Begins</div>
                                        <div className="text-xs font-semibold text-slate-400 mt-1">Check exam timetable</div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => navigate('/calendar')} className="mt-6 w-full py-3 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                                View Full Calendar
                            </button>
                        </div>

                        {/* Recent Updates */}
                        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex flex-col h-full">
                            <h3 className="text-md font-bold text-slate-700 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                Recent Updates
                            </h3>

                            <div className="space-y-4 flex-1">
                                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                                    <div className="font-bold text-slate-800 text-xs mb-1">Event calendar access granted</div>
                                    <div className="text-[11px] font-semibold text-slate-400">You can now manage department events</div>
                                </div>

                                <div className="bg-green-50/50 rounded-xl p-4 border border-green-100/50">
                                    <div className="font-bold text-slate-800 text-xs mb-1">Exam timetable published</div>
                                    <div className="text-[11px] font-semibold text-slate-400">Available for all batches</div>
                                </div>
                            </div>

                            <button onClick={() => navigate('/notifications')} className="mt-6 w-full py-3 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                                View All Updates
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
