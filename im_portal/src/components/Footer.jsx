import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.email === "admin@kln.ac.lk") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (e) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
    // Listen for storage changes in case of login/logout
    window.addEventListener("userProfileUpdate", checkAdmin);
    return () => window.removeEventListener("userProfileUpdate", checkAdmin);
  }, []);

  return (
    <div className="w-full bg-[#072d2c]/95 backdrop-blur-sm text-white py-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Column 1: Logo & Info */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="IM Portal" className="h-10 w-auto" />
            <span className="font-bold text-lg">IM PORTAL</span>
          </div>
          <p className="text-sm text-gray-400">
            Department of Industrial Management,<br />
            University of Kelaniya
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col">
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="cursor-pointer hover:text-white" onClick={() => navigate("/")}>Home</li>
            <li className="cursor-pointer hover:text-white" onClick={() => {
              navigate("/");
              setTimeout(() => document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth" }), 100);
            }}>About</li>
            <li className="cursor-pointer hover:text-white">Events</li>
            <li className="cursor-pointer hover:text-white">Contact</li>
          </ul>
        </div>

        {/* Column 3: Portal Access */}
        <div className="flex flex-col">
          <h3 className="font-bold text-lg mb-4">Portal Access</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="cursor-pointer hover:text-white" onClick={() => navigate("/login")}>Student Login</li>
            <li className="cursor-pointer hover:text-white" onClick={() => navigate("/login")}>Lecturer Login</li>
            <li className="cursor-pointer hover:text-white" onClick={() => navigate("/login")}>Junior Staff Login</li>
            {isAdmin && (
              <li className="cursor-pointer hover:text-white" onClick={() => navigate("/create-account")}>Register</li>
            )}
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Department of Industrial Management, University of Kelaniya. All rights reserved.
      </div>
    </div>
  );
}