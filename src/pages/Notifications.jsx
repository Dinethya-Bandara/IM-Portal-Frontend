import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "Dinethya Samuduni",
        role: "IMSSA President",
        level: "Level 2",
        batch: "2022/2023",
        username: "bandara-im22117"
    });

    const [notifications, setNotifications] = useState([]);
    const [userReadStatus, setUserReadStatus] = useState({});
    const [userDeletedIds, setUserDeletedIds] = useState([]);
    const [filterUnread, setFilterUnread] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const [announcementForm, setAnnouncementForm] = useState({
        title: "",
        message: "",
        category: "All Levels",
        priority: "Normal"
    });

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(prev => ({ ...prev, ...parsed }));
            } catch (e) { }
        }

        // Load notifications
        const savedNotifications = localStorage.getItem("announcements");
        if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
        } else {
            // Mock data
            setNotifications([
                {
                    id: 1,
                    title: "Lecture Cancelled - IM2303",
                    message: "Today's 2:00 PM Operations Research lecture has been cancelled due to unforeseen circumstances. Make-up class will be scheduled next week.",
                    from: "Academic Coordinator",
                    category: "Level 2",
                    priority: "High",
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: 2,
                    title: "Exam Timetable Updated",
                    message: "The final examination timetable for December 2025 has been published. Please check the Timetable section for details.",
                    from: "Academic Coordinator",
                    category: "All Levels",
                    priority: "High",
                    timestamp: new Date(Date.now() - 7200000).toISOString()
                },
                {
                    id: 3,
                    title: "IMSSA Annual General Meeting",
                    message: "The IMSSA Annual General Meeting will be held on November 25, 2025 at 5:00 PM in the Main Auditorium. All members are requested to attend.",
                    from: "IMSSA President",
                    category: "All Levels",
                    priority: "Normal",
                    timestamp: new Date(Date.now() - 604800000).toISOString()
                }
            ]);
        }

        // Load user's read status
        const savedReadStatus = localStorage.getItem(`read_status_${user.username}`);
        if (savedReadStatus) {
            setUserReadStatus(JSON.parse(savedReadStatus));
        }

        // Load user's deleted notifications
        const savedDeleted = localStorage.getItem(`deleted_notifications_${user.username}`);
        if (savedDeleted) {
            setUserDeletedIds(JSON.parse(savedDeleted));
        }
    }, [user.username]);

    const canCreateAnnouncement = user.role?.toLowerCase().includes("lecturer") ||
        user.role?.toLowerCase().includes("hod") ||
        user.role?.toLowerCase().includes("academic advisor") ||
        user.role?.toLowerCase().includes("staff");

    const handleAddAnnouncement = () => {
        if (!announcementForm.title || !announcementForm.message) {
            alert("Please fill in title and message");
            return;
        }

        const newAnnouncement = {
            id: Date.now(),
            ...announcementForm,
            from: user.name,
            timestamp: new Date().toISOString()
        };

        const updated = [newAnnouncement, ...notifications];
        setNotifications(updated);
        localStorage.setItem("announcements", JSON.stringify(updated));

        setAnnouncementForm({ title: "", message: "", category: "All Levels", priority: "Normal" });
        setShowAddModal(false);
    };

    const markAsRead = (id) => {
        const updated = { ...userReadStatus, [id]: true };
        setUserReadStatus(updated);
        localStorage.setItem(`read_status_${user.username}`, JSON.stringify(updated));
    };

    const markAllAsRead = () => {
        const updated = {};
        visibleNotifications.forEach(n => {
            updated[n.id] = true;
        });
        const merged = { ...userReadStatus, ...updated };
        setUserReadStatus(merged);
        localStorage.setItem(`read_status_${user.username}`, JSON.stringify(merged));
    };

    const deleteNotification = (id) => {
        const updated = [...userDeletedIds, id];
        setUserDeletedIds(updated);
        localStorage.setItem(`deleted_notifications_${user.username}`, JSON.stringify(updated));
    };

    const isNotificationForUser = (notification) => {
        if (notification.category === "All Levels") return true;
        if (notification.category === user.level) return true;
        return false;
    };

    const visibleNotifications = notifications
        .filter(n => !userDeletedIds.includes(n.id))
        .filter(n => isNotificationForUser(n))
        .filter(n => !filterUnread || !userReadStatus[n.id]);

    const unreadCount = visibleNotifications.filter(n => !userReadStatus[n.id]).length;

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now - then;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    };

    const getPortalName = (role) => {
        const r = role?.toLowerCase() || "";
        if (r.includes("lecturer") || r.includes("hod") || r.includes("advisor") || r.includes("treasurer")) return "Lecturer Portal";
        if (r.includes("staff")) return "Junior Staff Portal";
        return "Student Portal";
    };

    const getPriorityColor = (priority) => {
        if (priority === "High") return "bg-red-100 text-red-700 border-red-200";
        if (priority === "Urgent") return "bg-orange-100 text-orange-700 border-orange-200";
        return "bg-blue-100 text-blue-700 border-blue-200";
    };

    return (
        <div className="flex min-h-screen bg-[#E9F6F5]">
            <Sidebar
                userName={user.name}
                batch={user.batch}
                role={user.role}
                position={user.position}
                portalName={getPortalName(user.role)}
                onLogout={() => { localStorage.clear(); navigate("/"); }}
            />

            <div className="flex-1 flex flex-col min-h-screen">
                <TopHeader
                    title="Notifications"
                    username={user.username}
                    subtitle={getPortalName(user.role)}
                />

                <main className="p-8 flex-1 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-sm p-8 max-w-7xl mx-auto">

                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-600 relative">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Notifications & Alerts</h2>
                                    <p className="text-sm text-slate-500 mt-1">Stay updated with important messages and announcements</p>
                                </div>
                            </div>

                            {canCreateAnnouncement && (
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    New Announcement
                                </button>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setFilterUnread(false)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${!filterUnread ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    All ({visibleNotifications.length})
                                </button>
                                <button
                                    onClick={() => setFilterUnread(true)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filterUnread ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Unread ({unreadCount})
                                </button>
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    Mark All as Read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        {visibleNotifications.length === 0 ? (
                            <div className="text-center py-16">
                                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                                <p className="text-slate-400 text-sm">No notifications to display</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {visibleNotifications.map(notification => {
                                    const isRead = userReadStatus[notification.id];
                                    return (
                                        <div
                                            key={notification.id}
                                            className={`p-5 rounded-xl border transition-all ${isRead ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-100'}`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className={`mt-1 p-2 rounded-lg ${isRead ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-slate-800">{notification.title}</h3>
                                                            {notification.priority !== "Normal" && (
                                                                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getPriorityColor(notification.priority)}`}>
                                                                    {notification.priority}
                                                                </span>
                                                            )}
                                                            {!isRead && (
                                                                <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold">New</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-600 leading-relaxed mb-2">{notification.message}</p>
                                                        <div className="flex items-center gap-4 text-xs text-slate-400">
                                                            <span>From: {notification.from}</span>
                                                            <span>•</span>
                                                            <span>{notification.category}</span>
                                                            <span>•</span>
                                                            <span>{getTimeAgo(notification.timestamp)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    {!isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Mark as Read"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* Add Announcement Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Announcement</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={announcementForm.title}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                                    placeholder="Announcement title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Message *</label>
                                <textarea
                                    value={announcementForm.message}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                                    rows="4"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 resize-none"
                                    placeholder="Write your announcement message..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Target Audience</label>
                                    <select
                                        value={announcementForm.category}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                                    >
                                        <option>All Levels</option>
                                        <option>Level 1</option>
                                        <option>Level 2</option>
                                        <option>Level 3</option>
                                        <option>Level 4</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
                                    <select
                                        value={announcementForm.priority}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                                    >
                                        <option>Normal</option>
                                        <option>High</option>
                                        <option>Urgent</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddAnnouncement}
                                className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Post Announcement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
