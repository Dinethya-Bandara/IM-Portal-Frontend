import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";
import { can } from "../auth/permissions";

export default function SubmitFeedback() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "Dinethya Samuduni",
        role: "Undergraduate",
        batch: "2022/2023",
        username: "bandara-im22117",
        position: ""
    });

    const [feedback, setFeedback] = useState("");
    const [myFeedbacks, setMyFeedbacks] = useState([]);
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(prev => ({ ...prev, ...parsed }));
            } catch (e) { }
        }

        const savedFeedbacks = localStorage.getItem("anonymous_feedbacks");
        if (savedFeedbacks) {
            const allData = JSON.parse(savedFeedbacks);
            setAllFeedbacks(allData);
            const mine = allData.filter(f => f.username === user.username);
            setMyFeedbacks(mine);
        }
    }, [user.username]);

    const isLecturer = user.role?.toLowerCase().includes("lecturer") || user.role?.toLowerCase().includes("hod") || user.role?.toLowerCase().includes("advisor");
    const portalName = isLecturer ? "Lecturer Portal" : "Student Portal";

    const handleSubmit = () => {
        if (!feedback.trim()) {
            alert("Please write your feedback before submitting.");
            return;
        }
        const newFeedback = {
            id: Date.now(),
            username: user.username,
            name: user.name,
            feedback: feedback,
            timestamp: new Date().toLocaleString(),
            anonymous: true
        };
        const updated = [...allFeedbacks, newFeedback];
        setAllFeedbacks(updated);
        setMyFeedbacks([...myFeedbacks, newFeedback]);
        localStorage.setItem("anonymous_feedbacks", JSON.stringify(updated));
        setFeedback("");
        setShowSuccessModal(true);
    };

    const openDeleteModal = (id) => {
        setFeedbackToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDeleteForMe = () => {
        setMyFeedbacks(myFeedbacks.filter(f => f.id !== feedbackToDelete));
        setShowDeleteModal(false);
        setFeedbackToDelete(null);
    };

    const handleDeleteForEveryone = () => {
        const updated = allFeedbacks.filter(f => f.id !== feedbackToDelete);
        setAllFeedbacks(updated);
        setMyFeedbacks(myFeedbacks.filter(f => f.id !== feedbackToDelete));
        localStorage.setItem("anonymous_feedbacks", JSON.stringify(updated));
        setShowDeleteModal(false);
        setFeedbackToDelete(null);
    };

    const handleLecturerDelete = (id) => {
        const updated = allFeedbacks.filter(f => f.id !== id);
        setAllFeedbacks(updated);
        localStorage.setItem("anonymous_feedbacks", JSON.stringify(updated));
    };

    return (
        <div className="flex min-h-screen bg-[#E9F6F5]">
            <Sidebar
                userName={user.name}
                batch={user.batch}
                role={user.role}
                position={user.position}
                portalName={portalName}
                onLogout={() => { localStorage.clear(); navigate("/"); }}
            />

            <div className="flex-1 flex flex-col min-h-screen">
                <TopHeader
                    title="Feedback"
                    username={user.username}
                    subtitle={portalName}
                />

                <main className="p-8 flex-1 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Anonymous Feedback</h2>
                                <p className="text-sm text-slate-500 mt-1">Submit or view anonymous feedback</p>
                            </div>
                        </div>

                        {!isLecturer ? (
                            <div className="space-y-6 mb-12">
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Write your feedback here... Be specific and constructive"
                                    rows="8"
                                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                                />
                                <button onClick={handleSubmit} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">Submit Feedback</button>

                                <div className="border-t border-slate-100 pt-8">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">My Submissions</h3>
                                    <div className="space-y-4">
                                        {myFeedbacks.map(fb => (
                                            <div key={fb.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4 relative group">
                                                <div className="text-xs text-slate-400 mb-2">{fb.timestamp}</div>
                                                <p className="text-sm text-slate-700">{fb.feedback}</p>
                                                <button onClick={() => openDeleteModal(fb.id)} className="absolute top-3 right-3 p-2 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4">All Feedbacks</h3>
                                <div className="space-y-4">
                                    {allFeedbacks.map(fb => (
                                        <div key={fb.id} className="bg-slate-50 border border-slate-100 rounded-xl p-5 relative group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="text-xs text-slate-400">Anonymous Student • {fb.timestamp}</div>
                                                <button onClick={() => handleLecturerDelete(fb.id)} className="p-2 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                                            </div>
                                            <p className="text-sm text-slate-700">{fb.feedback}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {showSuccessModal && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl p-8 max-w-md w-full text-center"><h3 className="text-xl font-bold mb-2">Submitted!</h3><button onClick={() => setShowSuccessModal(false)} className="bg-teal-600 text-white px-6 py-2 rounded">Close</button></div></div>}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Delete Feedback</h3>
                        <div className="space-y-3">
                            <button onClick={handleDeleteForMe} className="w-full bg-slate-100 p-3 rounded font-semibold">Delete for Me</button>
                            <button onClick={handleDeleteForEveryone} className="w-full bg-red-600 text-white p-3 rounded font-semibold">Delete for Everyone</button>
                            <button onClick={() => setShowDeleteModal(false)} className="w-full border p-3 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
