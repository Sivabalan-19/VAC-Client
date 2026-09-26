"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import { useStore } from "../../context/StoreContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { courses, darkMode } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Compute Admin Dashboard Metrics
  const totalCourses = courses.length;
  const activeCourses = courses.filter(
    (c) => c.statusText.includes("Opened") || c.statusText.includes("Attendance") || c.statusText.includes("Approved")
  ).length;
  const pendingCourses = courses.filter((c) => c.statusText.includes("Pending")).length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.registeredCount || 0), 0);
  const uniqueInstructors = Array.from(new Set(courses.map((c) => c.instructor))).length;

  const getStatusBadge = (statusText: string) => {
    if (statusText.includes("Opened") || statusText.includes("Attendance") || statusText.includes("Approved")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
          {statusText}
        </span>
      );
    }
    if (statusText.includes("Completed")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
          {statusText}
        </span>
      );
    }
    if (statusText.includes("Reject")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/70 dark:border-rose-800/60">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
          {statusText}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
        {statusText}
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">
      {/* 1. UNIFIED ADMIN SIDEBAR & HEADER */}
      <AdminSidebar activeTab="/admin/dashboard" />

      {/* 2. MAIN CONTENT FLEX WRAPPER (Top clearance + zero sidebar gap) */}
      <div className="flex pt-16 w-full min-h-screen">
        {/* Sidebar Desktop Spacer */}
        <div className="hidden lg:block w-64 shrink-0" />

        {/* Main Content Area */}
        <main className="flex-1 p-5 md:p-8 min-w-0 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 dark:text-white tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sm font-sans text-slate-500 dark:text-slate-400 mt-1">
                Review courses, approvals, and enrollment activity.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/admin/course")}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                Manage Courses
              </button>
            </div>
          </div>

        {/* METRICS STAT CARDS GRID (Exact Match to Screenshot Design) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Courses (Blue Number + Pastel Blue Calendar Icon) */}
          <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Total Courses</span>
            <div className="flex items-center justify-between">
              <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#2563eb] dark:text-[#3b82f6]">{totalCourses}</p>
              <div className="w-12 h-12 rounded-2xl bg-[#dbeafe] dark:bg-blue-950/70 text-[#2563eb] dark:text-[#3b82f6] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </div>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">Available in the catalogue</span>
          </div>

          {/* Card 2: Pending Approvals (Green Number + Pastel Green Clock Icon) */}
          <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Pending Approvals</span>
            <div className="flex items-center justify-between">
              <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#16a34a] dark:text-[#22c55e]">{pendingCourses}</p>
              <div className="w-12 h-12 rounded-2xl bg-[#dcfce7] dark:bg-emerald-950/70 text-[#16a34a] dark:text-[#22c55e] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">Awaiting review</span>
          </div>

          {/* Card 3: Active Courses (Purple Number + Pastel Purple Check Icon) */}
          <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Active Courses</span>
            <div className="flex items-center justify-between">
              <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#9333ea] dark:text-[#a855f7]">{activeCourses}</p>
              <div className="w-12 h-12 rounded-2xl bg-[#f3e8ff] dark:bg-purple-950/70 text-[#9333ea] dark:text-[#a855f7] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">Open for enrollment</span>
          </div>

          {/* Card 4: Enrolled Students (Orange Number + Pastel Orange Target Icon) */}
          <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Enrolled Students</span>
            <div className="flex items-center justify-between">
              <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#ea580c] dark:text-[#f97316]">{totalStudents}</p>
              <div className="w-12 h-12 rounded-2xl bg-[#ffedd5] dark:bg-orange-950/70 text-[#ea580c] dark:text-[#f97316] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">Across {uniqueInstructors} instructors</span>
          </div>
        </div>

        {/* Course review list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-heading font-bold text-slate-800 dark:text-white">Recent Course Proposals</h2>
              <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-0.5">Review course status and enrollment activity.</p>
            </div>
            <button
              onClick={() => router.push("/admin/course")}
              className="text-xs font-heading font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all ({courses.length})
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-heading font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Code & Course Name</th>
                  <th className="py-3.5 px-4">Faculty Instructor</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Mode / Type</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors align-middle">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-code text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shrink-0">
                          {course.code}
                        </span>
                        <div>
                          <p className="font-heading font-bold text-slate-800 dark:text-white line-clamp-1">{course.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{course.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {course.instructor}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{course.department}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {course.mode}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-[11px] text-slate-500">{course.type}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(course.statusText)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => router.push(`/admin/course/${course.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-heading font-bold shadow-xs transition-all duration-150 cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
