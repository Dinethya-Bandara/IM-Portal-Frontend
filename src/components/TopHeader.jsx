import React, { useState, useEffect } from "react";

export default function TopHeader({
  title = "Hello, Ruwan Wickramasinghe",
  subtitle = "Department of Industrial Management",
  username = "Ruwan Wickramasinghe",
  avatarUrl,
}) {
  const [profileImage, setProfileImage] = useState("");
  const [displayName, setDisplayName] = useState(username);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.profileImage) {
            setProfileImage(parsed.profileImage);
          }
          if (parsed.name) {
            setDisplayName(parsed.name);
          }
        } catch (e) { }
      }
    };

    loadUser();

    // Listen for custom event
    window.addEventListener("userProfileUpdate", loadUser);
    return () => window.removeEventListener("userProfileUpdate", loadUser);
  }, [username]);

  const displayImage = avatarUrl || profileImage;

  return (
    <header className="w-full bg-white px-8 py-5 flex items-center justify-between shadow-sm relative z-10">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
          <span className="text-sm font-semibold text-slate-600">
            {displayName}
          </span>
        </div>

        <div className="h-10 w-10 rounded-full border-2 border-white ring-2 ring-slate-100 overflow-hidden shadow-sm">
          {displayImage ? (
            <img
              src={displayImage}
              alt="profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-cyan-500 grid place-items-center text-white font-bold text-lg">
              {displayName?.[0] || "R"}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
