"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FacultySidebar from "../components/FacultySidebar";
import { useStore } from "../../context/StoreContext";
import {
  fetchFacultyDashboard,
  fetchFacultyCourses,
  type FacultyDashboard,
  type FacultyCourse,
} from "../api";

export default function FacultyDashboardPage() {
  const router = useRouter();
  const { user, darkMode } = useStore();

  const [dashboard, setDashboard] = useState<FacultyDashboard>({
    totalCourses: 0,
    pendingCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    uniqueInstructors: 0,
  });
  const [courses, setCourses] = useState<FacultyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [dashData, coursesData] = await Promise.all([
          fetchFacultyDashboard(),
          fetchFacultyCourses(),
        ]);
        if (cancelled) return;
        setDashboard(dashData);
        setCourses(coursesData);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load faculty dashboard.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Helper function to extract Month and Day for Calendar inspiration badge
  const getCalendarDate = (dateStr?: string | null) => {
    if (!dateStr) return { month: "AUG", day: "28" };
    try {
      const datePart = dateStr.split("T")[0] || dateStr.split(" ")[0];
      const parts = datePart.split("-");
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const month = months[monthIdx] || "AUG";
      const day = parts[2] || "28";
      return { month, day };
    } catch {
      return { month: "AUG", day: "28" };
    }
  };

  // Helper for status badge color
  const getStatusBadgeStyle = (statusText?: string) => {
    if (!statusText) return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
    if (statusText.includes("Opened") || statusText.includes("Attendance") || statusText.includes("Approved")) {
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
    }
    if (statusText.includes("Completed")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
    }
    return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED SIDEBAR */}
      <FacultySidebar activeTab="/faculty/dashboard" />

      {/* 2. MAIN CONTENT FLEX WRAPPER */}
      <div className="flex pt-16 w-full min-h-screen">
        {/* Sidebar Desktop Spacer */}
        <div className="hidden lg:block w-64 shrink-0" />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 min-w-0 space-y-6">
          {/* Top Header Banner */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Faculty Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name || "Faculty Member"}</span>! Overview of your Value Added Courses and student attendance.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* METRICS STAT CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Card 1: Total Courses */}
            <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-md transition">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Total Courses</span>
              <div className="flex items-center justify-between">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#2563eb] dark:text-[#3b82f6]">
                  {loading ? "..." : dashboard.totalCourses}
                </p>
                <div className="w-12 h-12 rounded-2xl bg-[#dbeafe] dark:bg-blue-950/70 text-[#2563eb] dark:text-[#3b82f6] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">Active & Proposed VACs</span>
            </div>

            {/* Card 2: Registered Students */}
            <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-md transition">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Registered Students</span>
              <div className="flex items-center justify-between">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#16a34a] dark:text-[#22c55e]">
                  {loading ? "..." : dashboard.totalStudents}
                </p>
                <div className="w-12 h-12 rounded-2xl bg-[#dcfce7] dark:bg-emerald-950/70 text-[#16a34a] dark:text-[#22c55e] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">Enrolled in courses</span>
            </div>

            {/* Card 3: Active Courses */}
            <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-md transition">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Active Courses</span>
              <div className="flex items-center justify-between">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#9333ea] dark:text-[#a855f7]">
                  {loading ? "..." : dashboard.activeCourses}
                </p>
                <div className="w-12 h-12 rounded-2xl bg-[#f3e8ff] dark:bg-purple-950/70 text-[#9333ea] dark:text-[#a855f7] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">Attendance open</span>
            </div>

            {/* Card 4: Pending Courses */}
            <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-md transition">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Pending Approval</span>
              <div className="flex items-center justify-between">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#d97706] dark:text-[#f59e0b]">
                  {loading ? "..." : dashboard.pendingCourses}
                </p>
                <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] dark:bg-amber-950/70 text-[#d97706] dark:text-[#f59e0b] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">Awaiting admin review</span>
            </div>
          </div>

          {/* RECENT VAC COURSES LIST */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assigned Value Added Courses</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">View real-time course roster, schedule, and attendance status.</p>
              </div>

              <button
                onClick={() => router.push("/faculty/course")}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                View All Courses ({courses.length}) →
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400 text-xs">Loading course list...</div>
            ) : courses.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">No courses found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.slice(0, 6).map((course) => {
                  const calDate = getCalendarDate(course.startDate);

                  return (
                    <div
                      key={course.id}
                      onClick={() => router.push(`/faculty/course/${course.id}`)}
                      className="group bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      {/* Course Image */}
                      <div className="relative h-40 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                        <img
                          src={course.imageUrl || "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop"}
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 shadow-sm">
                            {course.type}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md text-center w-11 flex flex-col items-center">
                          <div className="bg-blue-600 text-[9px] font-bold text-white w-full py-0.5">
                            {calDate.month}
                          </div>
                          <div className="text-slate-900 dark:text-white font-extrabold text-xs py-0.5">
                            {calDate.day}
                          </div>
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                              {course.code}
                            </span>
                            <span className="text-[11px] text-slate-400">•</span>
                            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                              {course.category}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {course.name}
                          </h3>

                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {course.details || "No details provided."}
                          </p>
                        </div>

                        {/* Registered Count */}
                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadgeStyle(course.statusText)}`}>
                            {course.statusText}
                          </span>

                          <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                            {course.registeredCount} Enrolled →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
