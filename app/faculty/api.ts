import { apiRequest } from "../lib/api";

export type FacultyCourse = {
  id: number;
  name: string;
  code: string;
  type: string;
  category: string;
  mode: "Online" | "Offline" | "Hybrid" | string;
  statusText: string;
  currentStep?: number;
  imageUrl?: string | null;
  details?: string;
  instructor: string;
  organizer?: string;
  department: string;
  maxIntake: number;
  registeredCount: number;
  attendedCount: number;
  regStartDate?: string | null;
  regEndDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  credits: number;
  rejectionReason?: string | null;
};

export type FacultyDashboard = {
  totalCourses: number;
  pendingCourses: number;
  activeCourses: number;
  totalStudents: number;
  uniqueInstructors: number;
};

export type FacultyStudent = {
  id: string;
  studentName: string;
  rollNo: string;
  department: string;
  year: string;
  email: string;
  registeredDate: string;
  attendanceStatus: "Present" | "Absent";
  markedTime?: string | null;
};

export type FacultyCourseInput = {
  name: string;
  code: string;
  type?: string;
  category?: string;
  mode?: "Online" | "Offline" | "Hybrid";
  instructor: string;
  department: string;
  maxIntake?: number;
  credits?: number;
  details?: string;
  imageUrl?: string | null;
  regStartDate?: string | null;
  regEndDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  organizer?: string;
};

export async function fetchFacultyDashboard() {
  const data = await apiRequest<{ dashboard: FacultyDashboard }>("/api/faculty/dashboard");
  return data.dashboard;
}

export async function fetchFacultyCourses(filters?: {
  status?: string;
  search?: string;
  mode?: string;
  category?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== "all") params.set("status", filters.status);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.mode && filters.mode !== "all") params.set("mode", filters.mode);
  if (filters?.category && filters.category !== "all") params.set("category", filters.category);

  const query = params.toString() ? `?${params.toString()}` : "";
  const data = await apiRequest<{ courses: FacultyCourse[] }>(`/api/faculty/courses${query}`);
  return data.courses ?? [];
}

export async function fetchFacultyEvents(filters?: {
  status?: string;
  search?: string;
  mode?: string;
  category?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== "all") params.set("status", filters.status);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.mode && filters.mode !== "all") params.set("mode", filters.mode);
  if (filters?.category && filters.category !== "all") params.set("category", filters.category);

  const query = params.toString() ? `?${params.toString()}` : "";
  const data = await apiRequest<{ courses: FacultyCourse[] }>(`/api/faculty/events${query}`);
  return data.courses ?? [];
}

export async function createFacultyCourse(course: FacultyCourseInput) {
  return apiRequest<{ message: string; course: FacultyCourse }>("/api/faculty/courses", {
    method: "POST",
    body: JSON.stringify(course),
  });
}

export async function fetchFacultyCourseDetails(courseId: number | string) {
  const data = await apiRequest<{ course: FacultyCourse }>(`/api/faculty/courses/${courseId}`);
  return data.course;
}

export async function fetchFacultyCourseStudents(courseId: number | string) {
  const data = await apiRequest<{ students: FacultyStudent[] }>(`/api/faculty/courses/${courseId}/students`);
  return data.students ?? [];
}

export async function updateFacultyStudentAttendance(
  courseId: number | string,
  studentId: number | string,
  status: "Present" | "Absent"
) {
  return apiRequest<{ message: string; attendance: unknown }>(
    `/api/faculty/courses/${courseId}/students/${studentId}/attendance`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

export async function markAllFacultyStudentsPresent(courseId: number | string) {
  return apiRequest<{ message: string; updated: number }>(
    `/api/faculty/courses/${courseId}/attendance/mark-all-present`,
    {
      method: "POST",
    }
  );
}

export const markAllFacultyPresent = markAllFacultyStudentsPresent;

