import {
  STUDENT_VIEW_ROLES,
  STUDENT_EVENT_EDIT_ROLES,
  LECTURER_ROLES,
  JUNIOR_STAFF_ROLES,
  ADMIN_ROLES,
  ACADEMIC_ADVISOR_ONLY,
} from "./roles";

export function getRole() {
  return localStorage.getItem("role") || "";
}

/**
 * Normalizes roles for consistent comparison (lowercase)
 */
const normalize = (role) => role?.toLowerCase().trim() || "";

export function getPortal(role) {
  const r = normalize(role);
  if (ADMIN_ROLES.map(normalize).includes(r)) return "ADMIN";
  if (LECTURER_ROLES.map(normalize).includes(r)) return "LECTURER";
  if (JUNIOR_STAFF_ROLES.map(normalize).includes(r)) return "STAFF";
  if (STUDENT_VIEW_ROLES.map(normalize).includes(r)) return "STUDENT";
  // Fallback check: if it contains 'student' it's probably a student
  if (r.includes("student")) return "STUDENT";
  return "UNKNOWN";
}

export function can(role, permission) {
  const r = normalize(role);

  // Admins can do everything
  if (ADMIN_ROLES.map(normalize).includes(r)) return true;

  switch (permission) {

    //COMMON (shared pages)
    case "common.view":
      return (
        STUDENT_VIEW_ROLES.map(normalize).includes(r) ||
        LECTURER_ROLES.map(normalize).includes(r) ||
        JUNIOR_STAFF_ROLES.map(normalize).includes(r) ||
        ADMIN_ROLES.map(normalize).includes(r)
      );

    // Student portal
    case "student.view":
      return STUDENT_VIEW_ROLES.map(normalize).includes(r);

    case "student.editProfile":
      return STUDENT_VIEW_ROLES.map(normalize).includes(r);

    case "student.sendFeedback":
      // Usually undergraduates can send feedback
      return STUDENT_VIEW_ROLES.map(normalize).includes(r);

    case "student.editEventCalendar":
      // Only student leaders (not basic undergraduates) can edit
      return STUDENT_EVENT_EDIT_ROLES.map(normalize).includes(r);

    // Lecturer portal
    case "lecturer.view":
      return LECTURER_ROLES.map(normalize).includes(r);

    case "lecturer.editProfile":
      return LECTURER_ROLES.map(normalize).includes(r);

    case "lecturer.editAcademicTimetable":
      return ACADEMIC_ADVISOR_ONLY.map(normalize).includes(r);

    case "lecturer.viewExamPreferences":
      return ACADEMIC_ADVISOR_ONLY.map(normalize).includes(r);

    case "lecturer.sendAnnouncements":
      return LECTURER_ROLES.map(normalize).includes(r);

    case "lecturer.editStaffDirectory":
      return LECTURER_ROLES.map(normalize).includes(r) || JUNIOR_STAFF_ROLES.map(normalize).includes(r);

    case "lecturer.viewStudentDirectory":
      return LECTURER_ROLES.map(normalize).includes(r) || JUNIOR_STAFF_ROLES.map(normalize).includes(r);

    case "lecturer.viewStudentFeedback":
      return LECTURER_ROLES.map(normalize).includes(r);

    case "staff.view":
      return JUNIOR_STAFF_ROLES.map(normalize).includes(r);

    case "admin.view":
      return ADMIN_ROLES.map(normalize).includes(r);

    default:
      return false;
  }
}
