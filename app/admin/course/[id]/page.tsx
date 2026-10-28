"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import { DEFAULT_SESSIONS, useStore } from "../../../context/StoreContext";
import {
  fetchAdminCourseDetails,
  fetchAdminCourseStudents,
  updateAdminCourseStatus,
  updateAdminStudentAttendance,
  markAllAdminPresent,
  awardAdminStudentCredit,
  type AdminCourse,
  type AdminStudent,
} from "../../api";

export default function AdminCourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const courseIdParam = params?.id ? Number(params.id) : 1;

  const { darkMode } = useStore();

  const [course, setCourse] = useState<AdminCourse | null>(null);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [sessionAttendanceMap, setSessionAttendanceMap] = useState<
    Record<string, Record<string, "Present" | "Absent">>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [studentSearch, setStudentSearch] = useState("");
  const [bulkSessionId, setBulkSessionId] = useState(DEFAULT_SESSIONS[0].id);
  const [statusNotification, setStatusNotification] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingAttendance, setUpdatingAttendance] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReasonInput, setRejectReasonInput] = useState("");
  const [awardingCredits, setAwardingCredits] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const loadCourseData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [courseData, studentsData] = await Promise.all([
        fetchAdminCourseDetails(courseIdParam),
        Promise.all(
          DEFAULT_SESSIONS.map(async (session) => ({
            sessionId: session.id,
            students: await fetchAdminCourseStudents(courseIdParam, session.id),
          }))
        ),
      ]);
      setCourse(courseData);
      setStudents(studentsData[0]?.students ?? []);
      setSessionAttendanceMap(
        Object.fromEntries(
          studentsData.map(({ sessionId, students: roster }) => [
            sessionId,
            Object.fromEntries(roster.map((student) => [student.id, student.attendanceStatus])),
          ])
        )
      );
      if (courseData.rejectionReason) {
        setRejectReasonInput(courseData.rejectionReason);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load course data.");
    } finally {
      setLoading(false);
    }
  }, [courseIdParam]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  const handleUpdateStatus = async (newStatus: string, reason?: string) => {
    if (!course) return;
    setUpdatingStatus(true);
    try {
      await updateAdminCourseStatus(course.id, newStatus, reason);
      setStatusNotification(`Course status updated to "${newStatus}"`);
      await loadCourseData();
      setTimeout(() => setStatusNotification(""), 4000);
    } catch (err) {
      setStatusNotification(err instanceof Error ? err.message : "Failed to update course status.");
      setTimeout(() => setStatusNotification(""), 4000);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReasonInput.trim()) return;
    await handleUpdateStatus("Rejected", rejectReasonInput.trim());
    setShowRejectModal(false);
  };

  const handleToggleAttendance = async (
    studentId: string,
    sessionId: string,
    currentStatus: "Present" | "Absent"
  ) => {
    if (!course) return;
    const nextStatus: "Present" | "Absent" = currentStatus === "Present" ? "Absent" : "Present";
    setUpdatingAttendance(true);
    try {
      await updateAdminStudentAttendance(course.id, studentId, nextStatus, sessionId);
      await loadCourseData();
    } catch (err) {
      setStatusNotification(err instanceof Error ? err.message : "Failed to update attendance.");
      setTimeout(() => setStatusNotification(""), 3000);
    } finally {
      setUpdatingAttendance(false);
    }
  };

  const handleMarkAllPresent = async () => {
    if (!course) return;
    setUpdatingAttendance(true);
    try {
      const res = await markAllAdminPresent(course.id, bulkSessionId);
      setStatusNotification(res.message);
      await loadCourseData();
      setTimeout(() => setStatusNotification(""), 4000);
    } catch (err) {
      setStatusNotification(err instanceof Error ? err.message : "Failed to mark all present.");
      setTimeout(() => setStatusNotification(""), 4000);
    } finally {
      setUpdatingAttendance(false);
    }
  };

  const handleAwardSingleStudentCredit = async (studentId: string) => {
    if (!course) return;
    setAwardingCredits(true);
    try {
      const res = await awardAdminStudentCredit(course.id, studentId);
      setStatusNotification(res.message);
      await loadCourseData();
      setTimeout(() => setStatusNotification(""), 4000);
    } catch (err) {
      setStatusNotification(err instanceof Error ? err.message : "Failed to award credit.");
      setTimeout(() => setStatusNotification(""), 4000);
    } finally {
      setAwardingCredits(false);
    }
  };

  const getStatusBadgeStyle = (statusText?: string) => {
    if (!statusText) return "text-amber-700 dark:text-amber-400";
    if (statusText.includes("Opened") || statusText.includes("Attendance") || statusText.includes("Approved") || statusText.includes("Registration")) {
      return "text-emerald-700 dark:text-emerald-400";
    }
    if (statusText.includes("Completed")) {
      return "text-blue-700 dark:text-blue-400";
    }
    if (statusText.includes("Reject")) {
      return "text-rose-700 dark:text-rose-400";
    }
    return "text-amber-700 dark:text-amber-400";
  };

  const filteredStudents = students.filter((st) => {
    const query = studentSearch.toLowerCase();
    return (
      st.studentName.toLowerCase().includes(query) ||
      st.rollNo.toLowerCase().includes(query) ||
      st.department.toLowerCase().includes(query) ||
      st.email.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 font-sans">
        Loading course details...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 p-8 text-center space-y-4 font-sans">
        <p className="text-rose-500 font-bold">{error || "Course not found"}</p>
        <button
          onClick={() => router.push("/admin/course")}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs cursor-pointer"
        >
          ← Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED ADMIN SIDEBAR */}
      <AdminSidebar activeTab={`/admin/course/${course.id}`} />

      {/* 2. MAIN CONTENT FLEX WRAPPER */}
      <div className="flex pt-16 w-full min-h-screen">
        {/* Sidebar Desktop Spacer */}
        <div className="hidden lg:block w-64 shrink-0" />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 min-w-0 space-y-6">
          {/* TOP BANNER & BACK BUTTON */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 text-xs font-semibold">
                <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800">
                  {course.code}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {course.type}
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {course.mode}
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(course.statusText)}`}>
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${(course.statusText?.includes("Opened") || course.statusText?.includes("Attendance") || course.statusText?.includes("Approved") || course.statusText?.includes("Registration")) && !course.statusText?.includes("Pending") ? "bg-emerald-500" : course.statusText?.includes("Completed") ? "bg-blue-500" : course.statusText?.includes("Reject") ? "bg-rose-500" : "bg-amber-500"}`} />
                  {course.statusText}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                {course.name}
              </h1>
            </div>

            <button
              onClick={() => router.push("/admin/course")}
              className="self-start sm:self-auto px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              ← Back to Courses
            </button>
          </div>

          {/* STATUS NOTIFICATION BANNER */}
          {statusNotification && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-900 flex items-center justify-between">
              <span>{statusNotification}</span>
              <button onClick={() => setStatusNotification("")} className="cursor-pointer">✕</button>
            </div>
          )}

          {/* 4-STAGE WORKFLOW LIFECYCLE TRACKER */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
              <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                course.statusText?.includes("Pending") || course.statusText?.includes("Reject")
                  ? "bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500"
              }`}>
                <span className="text-[10px] font-mono uppercase tracking-wider">Step 1</span>
                <span className="font-bold">Faculty Proposal</span>
                <span className="text-[10px] font-normal">{course.statusText?.includes("Pending") ? "Awaiting Review" : course.statusText?.includes("Reject") ? "Rejected" : "Submitted"}</span>
              </div>

              <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                (course.statusText?.includes("Registration") || course.statusText?.includes("Approved")) && !course.statusText?.includes("Pending")
                  ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs"
                  : course.statusText?.includes("Attendance") || course.statusText?.includes("Completed")
                  ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  : "bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 text-slate-400"
              }`}>
                <span className="text-[10px] font-mono uppercase tracking-wider">Step 2</span>
                <span className="font-bold">Approved & Open</span>
                <span className="text-[10px] font-normal">{(course.statusText?.includes("Registration") || course.statusText?.includes("Approved")) && !course.statusText?.includes("Pending") ? "Students Enrolling" : "Student Registration"}</span>
              </div>

              <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                course.statusText?.includes("Attendance") || (course.statusText?.includes("Opened") && !course.statusText?.includes("Registration"))
                  ? "bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 font-bold shadow-xs"
                  : course.statusText?.includes("Completed")
                  ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  : "bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 text-slate-400"
              }`}>
                <span className="text-[10px] font-mono uppercase tracking-wider">Step 3</span>
                <span className="font-bold">Event Active</span>
                <span className="text-[10px] font-normal">Attendance Tracking</span>
              </div>

              <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                course.statusText?.includes("Completed")
                  ? "bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 font-bold shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 text-slate-400"
              }`}>
                <span className="text-[10px] font-mono uppercase tracking-wider">Step 4</span>
                <span className="font-bold">Completed</span>
                <span className="text-[10px] font-normal">Credits & Records</span>
              </div>
            </div>
          </div>

          {/* APPROVAL CALLOUT BANNER FOR PENDING COURSES */}
          {course.statusText?.includes("Pending") && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-xs">
              <div className="flex items-start gap-3 text-amber-900 dark:text-amber-200">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-extrabold text-sm text-amber-900 dark:text-amber-100">
                    Faculty Proposal Pending Admin Approval
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-xs mt-0.5">
                    This course was submitted by faculty and is currently <strong>hidden from students</strong>. Approve this course to open student registration.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  disabled={updatingStatus}
                  onClick={() => handleUpdateStatus("Ready For Registration")}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>✓ Approve & Open Registration</span>
                </button>
                <button
                  disabled={updatingStatus}
                  onClick={() => setShowRejectModal(true)}
                  className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* TWO-COLUMN LAYOUT: COURSE OVERVIEW & ADMIN ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Course Overview & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Hero Banner */}
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-sm">
                <img
                  src={course.imageUrl || "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop"}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                      {course.category} • {course.credits} Academic Credits
                    </p>
                    <p className="text-xs text-slate-300">
                      Instructor: {course.instructor} ({course.department}) • <span className="text-yellow-300 font-semibold">📍 Venue: {course.location || "Textile Seminar Hall"}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Info Cards */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Course Overview & Description</h2>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {course.details || "No course description provided."}
                </p>

                {course.rejectionReason && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs">
                    <span className="font-bold text-rose-700 dark:text-rose-400">Rejection Feedback: </span>
                    <span className="text-rose-600 dark:text-rose-300">{course.rejectionReason}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Department</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{course.department}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Instructor</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{course.instructor}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Schedule</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {course.startDate ? new Date(course.startDate).toLocaleDateString() : "TBD"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Location</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{course.location || "Online Portal"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Admin Status Controls & Enrollment Metrics */}
            <div className="space-y-6">
              {/* STATUS UPDATE ACTION PANEL */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Admin Approval & Status
                </h2>

                <div className="space-y-2">
                  {/* 1. Approve & Open for Registration */}
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus("Ready For Registration")}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                      (course.statusText?.includes("Registration") || course.statusText?.includes("Approved")) && !course.statusText?.includes("Pending")
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span>✓ Approve & Open Registration</span>
                      <span className="text-[10px] font-normal opacity-80">Students can register</span>
                    </div>
                    {((course.statusText?.includes("Registration") || course.statusText?.includes("Approved")) && !course.statusText?.includes("Pending")) && <span>Active</span>}
                  </button>

                  {/* 2. Open Attendance */}
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus("Attendance Opened")}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                      course.statusText?.includes("Attendance") || (course.statusText?.includes("Opened") && !course.statusText?.includes("Registration"))
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span>Open Event Attendance</span>
                      <span className="text-[10px] font-normal opacity-80">Event session is live</span>
                    </div>
                    {(course.statusText?.includes("Attendance") || (course.statusText?.includes("Opened") && !course.statusText?.includes("Registration"))) && <span>Active</span>}
                  </button>

                  {/* 3. Reject Proposal */}
                  <button
                    disabled={updatingStatus}
                    onClick={() => setShowRejectModal(true)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                      course.statusText?.includes("Reject")
                        ? "bg-rose-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span>Reject Proposal</span>
                    {course.statusText?.includes("Reject") && <span>Rejected</span>}
                  </button>

                  {/* 4. Set Pending Review */}
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus("Approval Pending...")}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                      course.statusText?.includes("Pending")
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span>Set Pending Review</span>
                    {course.statusText?.includes("Pending") && <span>Pending</span>}
                  </button>

                  {/* 5. Course Completed */}
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus("Course Completed")}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                      course.statusText?.includes("Completed")
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span>Course Completed</span>
                    {course.statusText?.includes("Completed") && <span>Done</span>}
                  </button>
                </div>
              </div>

              {/* ENROLLMENT CAPACITY */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Enrollment Capacity
                </h2>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Students</p>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    {course.registeredCount} / {course.maxIntake}
                  </p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                    {course.maxIntake > 0 ? Math.round((course.registeredCount / course.maxIntake) * 100) : 0}% Capacity Filled
                  </p>
                </div>
              </div>

              {/* COURSE CREDITS AWARD PANEL */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Student Credits
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
                    {course.credits} Credits / Student
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Awarded Students</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {students.filter((s) => s.creditsAwarded || s.enrollmentStatus === "Completed").length} / {students.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${students.length > 0 ? (students.filter((s) => s.creditsAwarded || s.enrollmentStatus === "Completed").length / students.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    Award credits to each student individually when attendance reaches at least 50%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* REGISTERED STUDENTS ROSTER TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registered Student Roster</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {students.length} enrolled student(s) • Click a session status to toggle Present/Absent
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <select
                  aria-label="Session for mark all present"
                  value={bulkSessionId}
                  onChange={(event) => setBulkSessionId(event.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300"
                >
                  {DEFAULT_SESSIONS.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.dayLabel} · {session.sessionName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={updatingAttendance || students.length === 0}
                  onClick={handleMarkAllPresent}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  Mark All Present
                </button>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search student or roll..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <svg
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Department & Year</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Attendance %</th>
                    <th className="py-3 px-4">Session Attendance</th>
                    <th className="py-3 px-4">Credits Status</th>
                    <th className="py-3 px-4 text-center">Credit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-400 font-medium">
                        No enrolled students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const isCompleted = student.enrollmentStatus === "Completed" || !!student.creditsAwarded;
                      const attendancePercentage = student.attendancePercentage;
                      const hasAttendancePercentage = typeof attendancePercentage === "number";
                      const meetsAttendanceRequirement = hasAttendancePercentage && attendancePercentage >= 50;

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                                {student.studentName?.charAt(0) || "S"}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{student.studentName}</p>
                                <p className="text-[10px] text-slate-400">ID: {student.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {student.rollNo}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {student.department} {student.year ? `(${student.year})` : ""}
                          </td>
                          <td className="py-3 px-4 text-slate-500">{student.email}</td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <span className={`font-bold ${
                                !hasAttendancePercentage
                                  ? "text-slate-500 dark:text-slate-400"
                                  : meetsAttendanceRequirement
                                    ? "text-emerald-700 dark:text-emerald-300"
                                    : "text-rose-700 dark:text-rose-300"
                              }`}>
                                {hasAttendancePercentage ? `${attendancePercentage}%` : "Unavailable"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="grid min-w-48 grid-cols-2 gap-1.5">
                              {DEFAULT_SESSIONS.map((session) => {
                                const sessionStatus =
                                  sessionAttendanceMap[session.id]?.[student.id] ?? "Absent";
                                return (
                                  <button
                                    key={session.id}
                                    type="button"
                                    disabled={updatingAttendance}
                                    onClick={() =>
                                      handleToggleAttendance(student.id, session.id, sessionStatus)
                                    }
                                    aria-label={`${session.dayLabel}, ${session.sessionName}: ${sessionStatus}. Toggle attendance.`}
                                    title={`${session.dayLabel}, ${session.sessionName}: ${sessionStatus}`}
                                    className={`rounded-md border px-2 py-1 text-[10px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                      sessionStatus === "Present"
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                                        : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    }`}
                                  >
                                    {session.dayLabel.replace("Day ", "D")} · S
                                    {session.sessionName.split(" ")[1]}: {sessionStatus}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                ✓ {course.credits} Cr Awarded
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Pending ({course.credits} Cr)
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {isCompleted ? (
                              <span className="text-[11px] text-slate-400 font-semibold">Awarded</span>
                            ) : (
                              <button
                                type="button"
                                disabled={awardingCredits || !meetsAttendanceRequirement}
                                onClick={() => handleAwardSingleStudentCredit(student.id)}
                                title={
                                  !hasAttendancePercentage
                                    ? "Attendance percentage is unavailable from the API"
                                    : meetsAttendanceRequirement
                                      ? undefined
                                      : "At least 50% attendance is required"
                                }
                                className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 text-blue-700 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 dark:text-blue-300 font-bold text-[11px] transition cursor-pointer border border-blue-200 dark:border-blue-800"
                              >
                                {!hasAttendancePercentage
                                  ? "Attendance unavailable"
                                  : meetsAttendanceRequirement
                                    ? `Award ${course.credits} Cr`
                                    : "Below 50%"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* REJECTION REASON MODAL DIALOG */}
          {showRejectModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base">
                    Reject Course Proposal
                  </div>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please provide the official rejection feedback or reason for faculty review:
                </p>

                <div>
                  <textarea
                    rows={4}
                    value={rejectReasonInput}
                    onChange={(e) => setRejectReasonInput(e.target.value)}
                    placeholder="E.g., The syllabus needs additional practical hours."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReject}
                    disabled={!rejectReasonInput.trim()}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
