import { apiRequest } from "../lib/api";

export type AdminCourse = {
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

export type AdminDashboard = {
  totalCourses: number;
  pendingCourses: number;
  activeCourses: number;
  totalStudents: number;
  uniqueInstructors: number;
};

export type AdminStudent = {
  id: string;
  studentName: string;
  rollNo: string;
  department: string;
  year: string;
  email: string;
  registeredDate: string;
  attendanceStatus: "Present" | "Absent";
  markedTime?: string | null;
  enrollmentStatus?: "Registered" | "Completed" | "Cancelled";
  completedDate?: string | null;
  creditsAwarded?: boolean;
  attendancePercentage?: number;
};

export type AdminCourseInput = {
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
  statusText?: string;
};

export async function fetchAdminDashboard() {
  const data = await apiRequest<{ dashboard: AdminDashboard }>("/api/admin/dashboard");
  return data.dashboard;
}

export async function fetchAdminCourses(filters?: {
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
  const data = await apiRequest<{ courses: AdminCourse[] }>(`/api/admin/courses${query}`);
  return data.courses ?? [];
}

export async function createAdminCourse(course: AdminCourseInput) {
  return apiRequest<{ message: string; course: AdminCourse }>("/api/admin/courses", {
    method: "POST",
    body: JSON.stringify(course),
  });
}

export async function fetchAdminCourseDetails(courseId: number | string) {
  const data = await apiRequest<{ course: AdminCourse }>(`/api/admin/courses/${courseId}`);
  return data.course;
}

export async function updateAdminCourseStatus(
  courseId: number | string,
  statusText: string,
  rejectionReason?: string
) {
  const body: { statusText: string; rejectionReason?: string } = { statusText };
  if (rejectionReason !== undefined) {
    body.rejectionReason = rejectionReason;
  }
  return apiRequest<{ message: string; course: AdminCourse }>(`/api/admin/courses/${courseId}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function fetchAdminCourseStudents(courseId: number | string) {
  const data = await apiRequest<{ students: AdminStudent[] }>(`/api/admin/courses/${courseId}/students`);
  return data.students ?? [];
}

export async function updateAdminStudentAttendance(
  courseId: number | string,
  studentId: number | string,
  status: "Present" | "Absent"
) {
  return apiRequest<{ message: string; attendance: unknown }>(
    `/api/admin/courses/${courseId}/students/${studentId}/attendance`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

export async function markAllAdminStudentsPresent(courseId: number | string) {
  return apiRequest<{ message: string; updated: number }>(
    `/api/admin/courses/${courseId}/attendance/mark-all-present`,
    {
      method: "POST",
    }
  );
}

export const markAllAdminPresent = markAllAdminStudentsPresent;

export async function awardAdminStudentCredit(
  courseId: number | string,
  studentId: number | string
) {
  return apiRequest<{
    message: string;
    awarded: boolean;
    credits: number;
  }>(`/api/admin/courses/${courseId}/students/${studentId}/award-credits`, {
    method: "POST",
  });
}
