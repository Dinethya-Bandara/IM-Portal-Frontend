import { Navigate } from "react-router-dom";
import { can, getRole } from "../auth/permissions";

export default function RequirePermission({ permission, children }) {
  const role = getRole();
  const token = localStorage.getItem("token");

  // If you want to enforce login but don't have tokens implemented yet, 
  // we check for any value in 'role' as a proxy for 'logged in'.
  const isLoggedIn = !!token || !!role;

  if (!isLoggedIn) {
    console.warn("RequirePermission: No token or role found. Redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  if (!can(role, permission)) {
    console.warn(`RequirePermission: Role '${role}' does not have permission '${permission}'. Redirecting to home...`);
    return <Navigate to="/" replace />;
  }

  return children;
}
