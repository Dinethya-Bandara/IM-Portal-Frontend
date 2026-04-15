import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";
import { can, getPortal } from "../auth/permissions";

export default function LecturerFeedback() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "Nuwan",
        role: "Lecturer",
        position: "Academic Advisor",
        username: "Nuwan"
    });

    const [allFeedbacks, setAllFeedbacks] = useState([]);

    const [selectedFeedback, setSelectedFeedback] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);

                // ✅ FETCH HERE (after user is ready)
                fetch(`http://localhost:8080/api/feedback?username=${parsedUser.username}`)
                    .then(res => res.json())
                    .then(data => {
                        const formatted = data.map(f => ({
                            id: f.id,
                            text: f.message,
                            date: new Date(f.createdAt).toLocaleDateString(),
                            isNew: !f.read,
                            category: "General",
                            color: "blue"
                        }));

                        setAllFeedbacks(formatted);
                    });

            } catch (e) {}
        }
    }, []);

    const stats = {
        total: allFeedbacks.length,
        unread: allFeedbacks.filter(f => f.isNew).length
    };

    const CategoryBadge = ({ category, color }) => {
        const colors = {
            blue: "bg-blue-50 text-blue-600 border-blue-100",
            purple: "bg-purple-50 text-purple-600 border-purple-100",
            yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
            pink: "bg-pink-50 text-pink-600 border-pink-100"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${colors[color] || colors.blue}`}>
                {category}
            </span>
        );
    };

    const portal = getPortal(user.role);
    let portalName = "Student Portal";
    if (portal === "LECTURER") portalName = "Lecturer Portal";
    else if (portal === "STAFF") portalName = "Junior Staff Portal";

    return (
        <div className="flex min-h-screen bg-[#E9F6F5] overflow-hidden">
            <Sidebar
                userName={user.name}
                role={user.role}
                position={user.position}
                portalName={portalName}
                onLogout={() => { localStorage.clear(); navigate("/"); }}
            />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <TopHeader
                    title="Student Feedback"
                    username={user.name}
                    subtitle={portalName}
                />

                <main className="p-10 flex-1 overflow-y-auto no-scrollbar">
                    <div className="bg-white rounded-[2rem] shadow-sm p-6 max-w-[95%] mx-auto border border-white/20">

                        {/* Header Box */}
                        <div className="flex items-start gap-4 mb-10">
                            <div className="mt-1 flex items-center justify-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-slate-800">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Anonymous Feedback</h3>
                                    {stats.unread > 0 && (
                                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">{stats.unread} New</span>
                                    )}
                                </div>
                                <p className="text-sm font-semibold text-slate-400 mt-0.5">View anonymous feedback from students</p>
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div className="flex gap-4 mb-5">
                            <select className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none">
                                <option>All Categories</option>
                            </select>
                            <select className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none">
                                <option>All Feedback</option>
                            </select>
                        </div>

                        {/* Summary Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-white border border-slate-100 p-8 py-1 rounded-[1.2rem] shadow-sm">
                                <h4 className="text-2xl font-bold text-slate-900 mb-1">{stats.total}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Feedback</p>
                            </div>
                            <div className="bg-white border border-slate-100 p-8 py-1 rounded-[1.2rem] shadow-sm">
                                <h4 className="text-2xl font-bold text-red-600 mb-1">{stats.unread}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unread</p>
                            </div>
                        </div>

                        {/* Feedback List */}
                        <div className="space-y-4">
                            {allFeedbacks.map((fb) => (
                                <div key={fb.id} className={`p-3 rounded-2xl border transition-all ${fb.isNew ? 'border-blue-400 bg-white ring-4 ring-blue-50/50' : 'border-slate-100 bg-slate-50/30'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <CategoryBadge category={fb.category} color={fb.color} />
                                            {fb.isNew && (
                                                <span className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">New</span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 tracking-tight">{fb.date}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-2 mb-6">
                                        {fb.text}
                                    </p>
                                    <button
                                        onClick={async () => {
                                            setSelectedFeedback(fb);

                                            if (fb.isNew) {
                                                await fetch(`http://localhost:8080/api/feedback/${fb.id}/read?username=${user.username}`, {
                                                    method: "PUT"
                                                });

                                                // update UI instantly
                                                setAllFeedbacks(prev =>
                                                    prev.map(item =>
                                                        item.id === fb.id ? { ...item, isNew: false } : item
                                                    )
                                                );
                                            }
                                        }}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        Read Full Feedback
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Popup Modal */}
            {selectedFeedback && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <CategoryBadge category={selectedFeedback.category} color={selectedFeedback.color} />
                                <span className="text-xs font-bold text-slate-400">{selectedFeedback.date}</span>
                            </div>
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-800"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-10">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                </div>
                                Full Feedback Message
                            </h3>
                            <p className="text-lg font-medium text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-6 bg-blue-50/20 py-4 rounded-r-xl">
                                "{selectedFeedback.text}"
                            </p>
                        </div>
                        <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-50 flex justify-end">
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="px-8 py-3 bg-[#1a6b64] text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-600/20 hover:opacity-90 active:scale-95 transition-all"
                            >
                                Close Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
