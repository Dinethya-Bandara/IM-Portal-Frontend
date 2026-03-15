import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";

export default function AdminUserApprovals() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState({ name: "Administrator", role: "Admin", username: "admin" });

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try { setUser(prev => ({ ...prev, ...JSON.parse(savedUser) })); } catch (e) { }
        }
        
        loadRequests();
    }, []);

    const loadRequests = () => {
        const savedRequests = JSON.parse(localStorage.getItem("registration_requests") || "[]");
        setRequests(savedRequests.filter(r => r.status === "pending"));
    };

    const handleAction = async (id, action) => {
        const allRequests = JSON.parse(localStorage.getItem("registration_requests") || "[]");
        const request = allRequests.find(r => r.id === id);
        
        if (!request) return;

        // Simulate an API call to the backend
        console.log(`Processing ${action} for user: ${request.firstName} ${request.lastName}...`);
        
        // Update local status
        const updatedRequests = allRequests.map(r => {
            if (r.id === id) {
                return { ...r, status: action === "approve" ? "approved" : "rejected" };
            }
            return r;
        });
        
        localStorage.setItem("registration_requests", JSON.stringify(updatedRequests));
        
        if (action === "approve") {
            // In a real system, we would call an API like:
            // await axios.post(`${BASE_URL}/api/users/create`, { ...request });
            
            // For prototyping, we simulate success
            alert(`SUCCESS: Account for ${request.firstName} ${request.lastName} has been fully provisioned and activated.`);
            console.log("Mock API: User account created successfully.");
        } else {
            alert(`NOTICE: Registration request for ${request.firstName} ${request.lastName} has been rejected.`);
        }
        
        loadRequests();
    };

    return (
        <div className="flex min-h-screen bg-[#E9F6F5]">
            <AdminSidebar 
                userName={user.name} 
                role={user.role} 
                onLogout={() => { localStorage.clear(); navigate("/"); }} 
            />

            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <TopHeader title="User Approvals" subtitle="Registration Management" username={user.username} />

                <main className="p-8 flex-1 max-w-full">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-slate-800">Pending Registrations</h3>
                        <p className="text-sm text-slate-500 mt-1">Review and approve new user account requests</p>
                    </div>

                    {requests.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-6">
                                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-slate-800">No Pending Requests</h4>
                            <p className="text-slate-500 mt-2">All registration requests have been processed.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">User Details</th>
                                            <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Role & Batch</th>
                                            <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                                            <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Document</th>
                                            <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {requests.map((req) => (
                                            <tr key={req.id} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-6 py-6">
                                                    <div className="font-bold text-slate-900 text-base">{req.firstName} {req.lastName}</div>
                                                    <div className="text-xs text-slate-400 mt-0.5 font-medium">Ref: {req.id}</div>
                                                </td>
                                                <td className="px-6 py-6 font-medium">
                                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold mb-1">
                                                        {req.role}
                                                    </div>
                                                    {(req.batch || req.level) && (
                                                        <div className="text-sm text-slate-600">
                                                            {req.batch && <span>Batch: {req.batch}</span>}
                                                            {req.level && <span className="ml-2">• Level {req.level}</span>}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="text-sm text-slate-700">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold text-slate-400 w-12 uppercase">Univ:</span>
                                                            <span className="font-medium">{req.studentEmail || req.universityEmail}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold text-slate-400 w-12 uppercase">Pers:</span>
                                                            <span className="font-medium">{req.personalEmail}</span>
                                                        </div>
                                                        {req.telephone && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-bold text-slate-400 w-12 uppercase">Contact:</span>
                                                                <span className="font-medium text-teal-600">{req.telephone}</span>
                                                            </div>
                                                        )}
                                                        {req.studentNumber && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs font-bold text-slate-400 w-12 uppercase">No:</span>
                                                                <span className="font-medium text-blue-600">{req.studentNumber}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-medium">
                                                    {req.studentIdImage ? (
                                                        <div className="h-16 w-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group cursor-pointer bg-slate-50 flex items-center justify-center">
                                                            {req.studentIdImage.startsWith("data:application/pdf") ? (
                                                                <div className="flex flex-col items-center">
                                                                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                                    </svg>
                                                                    <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">PDF Document</span>
                                                                </div>
                                                            ) : (
                                                                <img src={req.studentIdImage} alt="ID" className="w-full h-full object-cover" />
                                                            )}
                                                            
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                                <button 
                                                                    onClick={() => window.open(req.studentIdImage)}
                                                                    className="text-white text-[10px] font-bold"
                                                                >View Full</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-sm font-normal">No document</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button 
                                                            onClick={() => handleAction(req.id, "approve")}
                                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-green-200 transition-all active:scale-95 text-sm"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAction(req.id, "reject")}
                                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-red-200 transition-all active:scale-95 text-sm"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
