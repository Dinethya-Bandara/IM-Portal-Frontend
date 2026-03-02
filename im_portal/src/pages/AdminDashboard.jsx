import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import DashboardTile from "../components/DashboardTile";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "System Admin",
        role: "Admin",
        username: "admin"
    });

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                setUser(prev => ({ ...prev, ...JSON.parse(savedUser) }));
            } catch (e) { }
        }
    }, []);

    const portalName = "Admin Portal";

    return (
        <div className="flex min-h-screen bg-[#E9F6F5]">
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

            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <TopHeader
                    title={`Admin Panel`}
                    username={user.name}
                    subtitle={portalName}
                />

                <main className="p-8 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <DashboardTile
                            title="User Management"
                            subtitle="Manage student & staff accounts"
                            icon="users"
                            colorClass="text-blue-600"
                            onClick={() => navigate("/create-account")}
                        />
                        <DashboardTile
                            title="System Logs"
                            subtitle="View application activity"
                            icon="clock"
                            colorClass="text-slate-600"
                            onClick={() => { }}
                        />
                        <DashboardTile
                            title="Settings"
                            subtitle="Portal configuration"
                            icon="settings"
                            colorClass="text-teal-600"
                            onClick={() => { }}
                        />
                        <DashboardTile
                            title="Database"
                            subtitle="Backup and restore data"
                            icon="database"
                            colorClass="text-red-500"
                            onClick={() => { }}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Registrations</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <div className="text-sm font-semibold">John Doe</div>
                                        <div className="text-xs text-slate-500">Student • Batch 22/23</div>
                                    </div>
                                    <div className="text-xs text-slate-400">10 mins ago</div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <div className="text-sm font-semibold">Dr. Saman</div>
                                        <div className="text-xs text-slate-500">Lecturer</div>
                                    </div>
                                    <div className="text-xs text-slate-400">1 hour ago</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">System Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Database</span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Online</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Storage</span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">92% Free</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
