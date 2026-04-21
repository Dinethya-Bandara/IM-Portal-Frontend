import React, { useState } from "react";
import logo from "../assets/logo.png";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { getPortal } from "../auth/permissions";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Extract role safely from any backend response shape
  const extractRole = (data) => {
    // Most common shapes:
    // 1) { role: "Undergraduate" }
    // 2) { roleName: "Undergraduate" }
    // 3) { role: { roleName: "Undergraduate" } }
    // 4) { user: { roleName: "Undergraduate" } }
    return (
      data?.role ||
      data?.roleName ||
      data?.role?.roleName ||
      data?.user?.role ||
      data?.user?.roleName ||
      data?.user?.role?.roleName ||
      ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      console.log("LOGIN RESPONSE:", data);

      const role = extractRole(data);

      // Build a clean user object for UI
      const userObj = {
        email: data?.email || email,
        name: data?.name || data?.user?.name || "",
        username: data?.username || data?.user?.username || email.split("@")[0],
        batch: data?.batch || data?.user?.batch || "",
        position: data?.position || data?.user?.position || "",
        role, 
        level: data?.level || data?.user?.level || "",
      };

      // Store
      localStorage.setItem("user", JSON.stringify(userObj));
      if (data?.token) localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);

      window.dispatchEvent(new Event("userProfileUpdate"));

      // Route by portal
      const portal = getPortal(role);

      if (portal === "ADMIN") navigate("/admin-dashboard");
      else if (portal === "LECTURER") navigate("/lecturer-dashboard");
      else if (portal === "STAFF") navigate("/junior-staff-dashboard");
      else if (portal === "STUDENT") navigate("/student-dashboard");
      else {
        // If role is missing, show clear error instead of sending to wrong page
        setError("Login failed!");
        navigate("/login");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#A7D9D6] flex items-center justify-center px-4">
      <div className="relative bg-white rounded-lg shadow-lg w-[500px] min-h-[550px] pt-12 px-8 pb-8">
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute top-4 left-8 text-black text-5xl bg-transparent p-0 border-none rounded-none shadow-none hover:text-teal-600 transition-colors"
          >
            ‹
          </button>

          <img src={logo} alt="IM Portal Logo" className="h-20 mx-auto mb-4" />
          <h2 className="font-[Arimo,sans-serif] text-2xl font-semibold mb-6 text-black text-center">
            Login to IM PORTAL
          </h2>
          <p className="font-[Arimo,sans-serif] text-sm text-gray-500 text-center">
            Department of Industrial Management
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1 text-black">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1 text-black">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
              />
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>

          <div>
            <PrimaryButton
              type="submit"
              text={loading ? "Signing In..." : "Sign In"}
              className="w-full shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
