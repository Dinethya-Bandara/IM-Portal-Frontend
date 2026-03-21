import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminUserApprovals() {
    const navigate = useNavigate();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [user, setUser] = useState({ name: "Administrator", role: "Admin", username: "admin" });

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try { setUser(prev => ({ ...prev, ...JSON.parse(savedUser) })); } catch (e) { }
        }
        
        loadRequests();
    }, []);

    const BASE_URL = "http://localhost:8080";

    const loadRequests = async () => {
        try {
            const pendingCand = await axios.get(`${BASE_URL}/api/candidates/getAllPending`);

            console.log("FULL RESPONSE:", JSON.stringify(pendingCand));

            const allPendingCand = Array.isArray(pendingCand.data)
                ? pendingCand.data
                : pendingCand.data.data || pendingCand.data.content || [];

            const normalize = (status) => status?.toLowerCase().trim();

            console.log("Normalized Pending Requests:", allPendingCand);

            setPendingRequests(
                allPendingCand.map(r => ({
                    ...r,
                    status: normalize(r.status)
                }))
            );

            console.log("Normalized Pending Requests:", pendingRequests);
            //Approved Candidates
            const approvedCand = await axios.get(`${BASE_URL}/api/candidates/getAllApproved`);

            console.log("FULL RESPONSE:",approvedCand);

            const allApprovedCand = Array.isArray(approvedCand.data)
                ? approvedCand.data
                : approvedCand.data.data || approvedCand.data.content || [];

            setApprovedRequests(
                allApprovedCand.map(r => ({
                    ...r,
                    status: normalize(r.status)
                }))
            );

        } catch (err) {
            console.error(err);
        }
    };

    const handleAction = async (id, action) => {
    try {
        const status = action === "approve" ? "APPROVED" : "REJECTED";

        await axios.put(
            `${BASE_URL}/api/candidates/${id}/status?status=${status}`
        );

        alert(`Candidate ${status}`);
        loadRequests();


    } catch (err) {
        console.error(err);
        alert("Error updating status");
    }
};

    const handleCreateAccounts = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/api/users/create_users`);
            alert(res.data);

            loadRequests();

        } catch (err) {
            console.error(err);
            alert("Error creating users");
        }
    };

    const renderTable = (data, title, isPending) => (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12">
            <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h4 className="text-lg font-bold text-slate-800">{title}</h4>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-500 border border-slate-100 italic">
                    {data.length} {data.length === 1 ? 'Entry' : 'Entries'}
                </span>
            </div>
            {data.length === 0 ? (
                <div className="p-12 text-center">
                    <p className="text-slate-400 text-sm italic font-medium">No registrations in this section.</p>
                    <pre className="text-xs text-red-400 mt-2"> {JSON.stringify(data, null, 2)} </pre>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">User Details</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Role & Batch</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Document</th>
                                {isPending && <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.map((req) => {
                                console.log("REQ:", req);

                                return(
                                <tr key={req.id || req.candidateId} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="font-bold text-slate-900 text-base">{req.firstName} {req.lastName}</div>
                                        <div className="text-xs text-slate-400 mt-0.5 font-medium">Ref: {req.id}</div>
                                    </td>
                                    <td className="px-6 py-6 font-medium">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold mb-1">
                                            {req.role?.roleName}
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
                                                <span className="font-medium text-slate-900 truncate max-w-[200px]">{req.universityEmail}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-slate-400 w-12 uppercase">Pers:</span>
                                                <span className="font-medium text-slate-900">{req.personalEmail}</span>
                                            </div>
                                            {req.contactNumber && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-400 w-12 uppercase">Contact:</span>
                                                    <span className="font-medium text-teal-600">{req.contactNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-medium">
                                        {req.studentIdUrl ? (
                                            <div className="h-16 w-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group cursor-pointer bg-slate-50 flex items-center justify-center">
                                                {req.studentIdUrl ? (
                                    
                                                    <img src={req.studentIdUrl} alt="ID" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">PDF Document</span>
                                                    </div>
                                                )}
                                                
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                    <button 
                                                        onClick={() => window.open(`data:image/jpeg;base64,${req.studentIdUrl}`)}
                                                        className="text-white text-[10px] font-bold"
                                                    >View Full</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic text-sm font-normal">No document</span>
                                        )}
                                    </td>
                                    {isPending && (
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
                                    )}
                                </tr>
                            
                            );
             })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

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
                    <div className="mb-12">
                        <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">System Registration Requests</h3>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Manage and provision new user accounts for the IM Portal</p>
                    </div>

                    {/* Pending Section */}
                    {renderTable(pendingRequests, "Pending Registrations", true)}

                    {/* Approved Section */}
                    {renderTable(approvedRequests, "Approved Registrations", false)}

                    {/* Final Action Button */}
                    <div className="flex justify-end pt-4 pb-12">
                        <button 
                            onClick={handleCreateAccounts}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-teal-600/20 active:scale-95 transition-all flex items-center gap-3 group text-sm"
                        >
                            <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Create User Accounts
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
