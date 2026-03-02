import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import FormField from "../components/FormField";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";

export default function LecturerProfile() {
    const navigate = useNavigate();

    // Initial user state for Lecturer
    const [user, setUser] = useState({
        name: "",
        email: "",
        contact: "",
        role: "Lecturer",
        position: "Senior Lecturer",
        about: "No description added yet",
        profileImage: "", // Base64 or URL
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState("");
    const [tempImage, setTempImage] = useState("");

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                const merged = { ...user, ...parsed };
                setUser(merged);
                setTempName(merged.name);
                setTempImage(merged.profileImage);
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, []);

    const handleSave = () => {
        const updatedUser = { ...user, name: tempName, profileImage: tempImage };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Dispatch event to update Sidebar and TopHeader
        window.dispatchEvent(new Event("userProfileUpdate"));

        setIsEditing(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const portalName = "Lecturer Portal";

    return (
        <div className="flex min-h-screen bg-[#b9d9d7] overflow-hidden">
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

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <TopHeader
                    title="My Profile"
                    subtitle="Department of Industrial Management"
                    username={user.name}
                    avatarUrl={user.profileImage}
                />

                <main className="p-10 flex-1 overflow-y-auto no-scrollbar">
                    <div className="bg-white rounded-[2rem] shadow-sm p-12 max-w-[1200px] mx-auto border border-white/20">
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex items-center justify-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-slate-800">
                                    <UserIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Lecturer Profile</h3>
                                    <p className="text-sm font-semibold text-slate-400 mt-0.5">View and manage your academic profile</p>
                                </div>
                            </div>

                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1a6b64] text-white rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-all active:scale-95"
                                >
                                    <EditIcon className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setTempName(user.name);
                                            setTempImage(user.profileImage);
                                        }}
                                        className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <PrimaryButton
                                        text="Save Changes"
                                        className="px-5 py-2.5 rounded-xl text-sm shadow-md"
                                        onClick={handleSave}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Profile Avatar */}
                        <div className="flex flex-col items-center mb-16">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden mb-6 bg-slate-100 ring-2 ring-slate-50">
                                    {tempImage ? (
                                        <img src={tempImage} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full grid place-items-center text-slate-300">
                                            <UserIcon className="w-16 h-16" />
                                        </div>
                                    )}
                                </div>

                                {isEditing && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        <CameraIcon className="w-8 h-8" />
                                    </label>
                                )}
                            </div>

                            <h3 className="text-3xl font-bold text-slate-800 mb-2">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="text-center bg-slate-50 border border-slate-200 rounded-lg px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a6b64] w-[400px]"
                                    />
                                ) : (user.name || "Lecturer Name")}
                            </h3>

                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Academic Position</p>
                                <p className="text-sm font-bold text-slate-600 italic">{user.position || "Senior Lecturer"}</p>
                            </div>
                        </div>

                        <hr className="border-slate-50 mb-8" />

                        {/* Personal Information */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <PersonalIcon className="w-5 h-5 text-slate-400" />
                                <h3 className="text-lg font-bold text-slate-800">Academic & Personal Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                <FormField
                                    label="Full Name *"
                                    value={isEditing ? tempName : user.name}
                                    onChange={(e) => setTempName(e.target.value)}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-slate-50 cursor-not-allowed italic font-medium" : "bg-white"}
                                    placeholder="Enter your full name"
                                />
                                <FormField
                                    label="Email Address (KLN) *"
                                    value={user.email}
                                    disabled={true}
                                    className="bg-slate-50 cursor-not-allowed italic font-medium"
                                />
                                <FormField
                                    label="Contact Number"
                                    value={user.contact || ""}
                                    disabled={true}
                                    className="bg-slate-50 cursor-not-allowed italic font-medium"
                                    placeholder="No contact added"
                                />
                                <FormField
                                    label="Role"
                                    value={user.role}
                                    disabled={true}
                                    className="bg-slate-50 cursor-not-allowed italic font-medium"
                                />
                                <FormField
                                    label="Departmental Position"
                                    value={user.position || "Senior Lecturer"}
                                    disabled={true}
                                    className="bg-slate-50 cursor-not-allowed italic font-medium"
                                />
                            </div>

                            <div className="mt-8">
                                <label className="mb-2 block text-xs font-bold text-slate-700">Biography / About Me</label>
                                <div className="w-full bg-slate-50 rounded-xl px-5 py-8 text-sm font-semibold text-slate-400 italic text-center border border-slate-100/50">
                                    {user.about}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Icons
function UserIcon(p) { return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>; }
function EditIcon(p) { return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>; }
function CameraIcon(p) { return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>; }
function PersonalIcon(p) { return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>; }
