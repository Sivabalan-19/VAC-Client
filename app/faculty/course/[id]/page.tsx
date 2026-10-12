"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import FacultySidebar from "../../components/FacultySidebar";
import { useStore } from "../../../context/StoreContext";
import {
  fetchFacultyCourseDetails,
  fetchFacultyCourseStudents,
  updateFacultyStudentAttendance,
  markAllFacultyStudentsPresent,
  type FacultyCourse,
  type FacultyStudent,
} from "../../api";

interface SessionInfo {
  id: string;
  dayLabel: string;
  dateStr: string;
  sessionName: string;
  timeRange: string;
}

export default function FacultyCourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const courseIdParam = params?.id ? Number(params.id) : 1;

  const { darkMode } = useStore();

  const [course, setCourse] = useState<FacultyCourse | null>(null);
  const [students, setStudents] = useState<FacultyStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusNotification, setStatusNotification] = useState("");
  const [updatingAttendance, setUpdatingAttendance] = useState(false);

  // Multi-day & Multi-session Configuration
  const sessions: SessionInfo[] = [
    { id: "d1s1", dayLabel: "Day 1", dateStr: "28 Aug 2026", sessionName: "Session 1 (Morning)", timeRange: "10:00 AM - 01:00 PM" },
    { id: "d1s2", dayLabel: "Day 1", dateStr: "28 Aug 2026", sessionName: "Session 2 (Afternoon)", timeRange: "02:00 PM - 05:00 PM" },
    { id: "d2s1", dayLabel: "Day 2", dateStr: "29 Aug 2026", sessionName: "Session 1 (Morning)", timeRange: "10:00 AM - 01:00 PM" },
    { id: "d2s2", dayLabel: "Day 2", dateStr: "29 Aug 2026", sessionName: "Session 2 (Afternoon)", timeRange: "02:00 PM - 05:00 PM" },
  ];

  const [activeSessionId, setActiveSessionId] = useState<string>("d1s1");
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const [studentSearch, setStudentSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Present" | "Absent">("all");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const loadCourseData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [courseData, studentsData] = await Promise.all([
        fetchFacultyCourseDetails(courseIdParam),
        fetchFacultyCourseStudents(courseIdParam),
      ]);
      setCourse(courseData);
      setStudents(studentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load course data.");
    } finally {
      setLoading(false);
    }
  }, [courseIdParam]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  // Toggle individual student attendance
  const toggleAttendance = async (studentId: string, newStatus: "Present" | "Absent") => {
    if (!course) return;
    setUpdatingAttendance(true);
    try {
      await updateFacultyStudentAttendance(course.id, studentId, newStatus);
      setStatusNotification(`Attendance updated for student.`);
      await loadCourseData();
      setTimeout(() => setStatusNotification(""), 3000);
    } catch (err) {
      setStatusNotification(err instanceof Error ? err.message : "Failed to update attendance.");
      setTimeout(() => setStatusNotification(""), 3000);
    } finally {
      setUpdatingAttendance(false);
    }
  };

  // Mark all students present
  const handleMarkAllPresent = async () => {
    if (!course) return;
    setUpdatingAttendance(true);
    try {
      const res = await markAllFacultyStudentsPresent(course.id);
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

  const attendedCount = students.filter((s) => s.attendanceStatus === "Present").length;
  const totalStudentsCount = students.length;
  const attendanceRate = totalStudentsCount > 0 ? Math.round((attendedCount / totalStudentsCount) * 100) : 0;

  // Filter students for display
  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.studentName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.rollNo?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.department?.toLowerCase().includes(studentSearch.toLowerCase());

    const matchesStatus = statusFilter === "all" || st.attendanceStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 font-sans">
        Loading faculty course details...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 p-8 text-center space-y-4 font-sans">
        <p className="text-rose-500 font-bold">{error || "Course not found"}</p>
        <button
          onClick={() => router.push("/faculty/course")}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs cursor-pointer"
        >
          ← Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED SIDEBAR */}
      <FacultySidebar activeTab={`/faculty/course/${course.id}`} />

      {/* 2. MAIN CONTENT FLEX WRAPPER */}
      <div className="flex pt-16 w-full min-h-screen">
        {/* Sidebar Desktop Spacer */}
        <div className="hidden lg:block w-64 shrink-0" />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 min-w-0 space-y-6">
          {/* TOP OF PAGE: COURSE TOPIC TITLE & BACK BUTTON */}
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
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  {course.statusText}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                {course.name}
              </h1>
            </div>

            <button
              onClick={() => router.push("/faculty/course")}
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

          {/* TWO COLUMN SUMMARY & EVENT HERO */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Course Banner & Overview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-sm">
                <img
                  src={course.imageUrl || "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop"}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                      {course.category} • {course.credits} Credits
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">{course.name}</p>
                    <p className="text-xs text-slate-300">Location: {course.location || "Online"} • Capacity: {course.registeredCount} / {course.maxIntake}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Course Description & Objectives
                </h2>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {course.details || "No course description provided."}
                </p>
              </div>
            </div>

            {/* Right 1 Col: Event Metrics */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Attendance Metrics
                </h2>

                <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Present / Enrolled</p>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    {attendedCount} / {totalStudentsCount}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    {attendanceRate}% Current Turnout
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    disabled={updatingAttendance || students.length === 0}
                    onClick={handleMarkAllPresent}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Mark All Enrolled Present
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SESSIONS & LIVE ATTENDANCE TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Session Switcher Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Event Sessions Schedule
                </h2>
                <span className="text-xs text-slate-400">Select session to view roster</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {sessions.map((s) => {
                  const isActive = activeSessionId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSessionId(s.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-950 dark:text-blue-100 border-2 border-blue-600 dark:border-blue-400 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          isActive ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}>
                          {s.dayLabel} • {s.dateStr}
                        </span>
                      </div>
                      <p className="text-xs font-bold truncate">{s.sessionName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{s.timeRange}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Session Roster: {activeSession.dayLabel} — {activeSession.sessionName}
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
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

                <div className="flex items-center gap-1">
                  {(["all", "Present", "Absent"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                        statusFilter === filter
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ROSTER TABLE */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Department & Year</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Toggle Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const isPresent = student.attendanceStatus === "Present";

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
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                                isPresent
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${isPresent ? "bg-emerald-500" : "bg-rose-500"}`}
                              />
                              {student.attendanceStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <button
                                disabled={updatingAttendance}
                                onClick={() => toggleAttendance(student.id, "Present")}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  isPresent
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                                }`}
                              >
                                Present
                              </button>
                              <button
                                disabled={updatingAttendance}
                                onClick={() => toggleAttendance(student.id, "Absent")}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  !isPresent
                                    ? "bg-rose-600 text-white shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:text-rose-600"
                                }`}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
