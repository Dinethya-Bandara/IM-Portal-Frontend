import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./NavBar.css";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role === "admin") {
        setIsAdmin(true);
      }
    } catch (e) { }
  }, []);

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToAbout = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById("about-us")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document
        .getElementById("about-us")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex w-full h-22 py-2 px-6 items-center justify-between bg-white shadow-sm">
      {/* left div */}
      <div className="flex h-full items-center">
        <img src={logo} className="h-10 w-auto" alt="IM Portal Logo" />
        <div>
          <div className="text-3xl font-bold ml-3 text-slate-900 tracking-tight">IM PORTAL</div>
          <div className="ml-3 text-xs text-slate-400 font-medium tracking-wide">Department of Industrial Management</div>
        </div>
      </div>

      {/* nav links */}
      <div className="flex gap-4">
        <button
          onClick={goHome}
          className="text-slate-600 font-bold py-2 px-5 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all active:scale-95"
        >
          Home
        </button>
        <button
          onClick={goToAbout}
          className="text-slate-600 font-bold py-2 px-5 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all active:scale-95"
        >
          About
        </button>
      </div>

      {/* action set */}
      <div className="flex h-full gap-4 items-center">
        <PrimaryButton
          onClick={() => navigate("/login")}
          text="Login"
          className="px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-md shadow-teal-600/10"
        />
        {isAdmin && (
          <PrimaryButton
            onClick={() => navigate("/create-account")}
            text="Sign Up"
            className="px-8 py-2.5 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-bold rounded-xl transition-all"
          />
        )}
      </div>
    </div>
  );
}