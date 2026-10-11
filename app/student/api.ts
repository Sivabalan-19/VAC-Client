import { apiRequest } from "../lib/api";

export type StudentCourse = {
  id: number;
  date?: string;
  name: string;
  type: string;
  mode: string;
  credit: number;
  organizer: string;
  available?: number;
  details?: string;
  status?: string;
  completedOn?: string;
};

export type StudentDashboard = {
  completedCourses: number;
  totalCredits: number;
  enrolledCourses: number;
  onlineCourses: number;
  offlineCourses: number;
  latestCompletedOn: string | null;
  completionRate: number;
};

export async function fetchAvailableCourses() {
  const data = await apiRequest<{ courses: StudentCourse[] }>("/api/students/courses");
  return data.courses ?? [];
}

export async function registerForCourse(courseId: number) {
  return apiRequest<{ message: string; enrollment: { id: string; status: string } }>(
    `/api/students/courses/${courseId}/register`,
    { method: "POST" }
  );
}

export async function fetchMyCourses() {
  const data = await apiRequest<{ courses: StudentCourse[] }>("/api/students/my-courses");
  return data.courses ?? [];
}

export async function cancelCourseRegistration(courseId: number) {
  return apiRequest<{ message: string }>(`/api/students/my-courses/${courseId}`, {
    method: "DELETE",
  });
}

export async function fetchCompletedCourses() {
  const data = await apiRequest<{ courses: StudentCourse[] }>("/api/students/completed-courses");
  return data.courses ?? [];
}

export async function fetchStudentDashboard() {
  const data = await apiRequest<{ dashboard: StudentDashboard }>("/api/students/dashboard");
  return data.dashboard;
}

export function courseMode(mode: string): "Online" | "Offline" {
  return mode === "Offline" ? "Offline" : "Online";
}

export function formatDisplayDate(value?: string | null) {
  if (!value) return "—";
  if (value.includes("/")) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
