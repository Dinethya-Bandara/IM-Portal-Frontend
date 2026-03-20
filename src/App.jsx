import { Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResetSuccessful from "./pages/ResetSuccessful";

import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import JuniorStaffDashboard from "./pages/JuniorStaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDirectory from "./pages/AdminDirectory";
import AdminNotifications from "./pages/AdminNotifications";
import AdminCalendarPage from "./pages/AdminCalendarPage";
import AdminTimetablePage from "./pages/AdminTimetablePage";
import AdminReports from "./pages/AdminReports";
import DetailsForm from "./pages/DetailsForm";
import AdminUserApprovals from "./pages/AdminUserApprovals";

import RegPassword from "./pages/RegPassword";
import CalendarPage from "./pages/CalendarPage";
import TimetablePage from "./pages/TimetablePage";
import ExamPreferences from "./pages/ExamPreferences";
import SubmitFeedback from "./pages/SubmitFeedback";
import Directory from "./pages/Directory";
import GPACalculator from "./pages/GPACalculator";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import LecturerFeedback from "./pages/LecturerFeedback";
import LecturerProfile from "./pages/LecturerProfile";
import JuniorStaffProfile from "./pages/JuniorStaffProfile";

import RequirePermission from "./components/RequirePermission";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route path="/student-register-password" element={<RegPassword />} />
      <Route path="/otp" element={<Otp />} />

      {/* Password reset flow */}
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-success" element={<ResetSuccessful />} />

      {/* Protected dashboards */}
      <Route
        path="/student-dashboard"
        element={
          <RequirePermission permission="student.view">
            <StudentDashboard />
          </RequirePermission>
        }
      />

      <Route
        path="/lecturer-dashboard"
        element={
          <RequirePermission permission="lecturer.view">
            <LecturerDashboard />
          </RequirePermission>
        }
      />

      <Route
        path="/junior-staff-dashboard"
        element={
          <RequirePermission permission="staff.view">
            <JuniorStaffDashboard />
          </RequirePermission>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <RequirePermission permission="admin.view">
            <AdminDashboard />
          </RequirePermission>
        }
      />

      <Route
        path="/admin-directory"
        element={
          <RequirePermission permission="admin.view">
            <AdminDirectory />
          </RequirePermission>
        }
      />

      <Route
        path="/admin-notifications"
        element={
          <RequirePermission permission="admin.view">
            <AdminNotifications />
          </RequirePermission>
        }
      />

      <Route
        path="/admin-calendar"
        element={
          <RequirePermission permission="admin.view">
            <AdminCalendarPage />
          </RequirePermission>
        }
      />

      <Route
        path="/admin-timetable"
        element={
          <RequirePermission permission="admin.view">
            <AdminTimetablePage />
          </RequirePermission>
        }
      />

      <Route
        path="/admin-reports"
        element={
          <RequirePermission permission="admin.view">
            <AdminReports />
          </RequirePermission>
        }
      />

      <Route
        path="/admin-approvals"
        element={
          <RequirePermission permission="admin.view">
            <AdminUserApprovals />
          </RequirePermission>
        }
      />

      {/* Publicly accessible details form */}
      <Route path="/details-form" element={<DetailsForm />} />

      {/* Student portal pages (you can protect them too later) */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/timetable" element={<TimetablePage />} />
      <Route path="/exam-preferences" element={<ExamPreferences />} />
      <Route path="/feedback" element={<SubmitFeedback />} />
      <Route path="/directory" element={<Directory />} />
      <Route path="/gpa-calculator" element={<GPACalculator />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/lecturer-feedback" element={<LecturerFeedback />} />
      <Route path="/lecturer-profile" element={<LecturerProfile />} />
      <Route path="/junior-staff-profile" element={<JuniorStaffProfile />} />
    </Routes>
  );
}
