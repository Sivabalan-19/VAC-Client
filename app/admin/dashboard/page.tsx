"use client";

import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import { useStore } from "../../context/StoreContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { courses, updateCourseStatus } = useStore();

  // Compute Admin Dashboard Metrics
  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.statusText.includes("Completed")).length;
  const pendingCourses = courses.filter((c) => c.statusText.includes("Pending")).length;
  const totalStudents = courses.reduce((acc, c) => acc + c.registeredCount, 0);

  // Faculty count (unique instructors)
  const uniqueInstructors = Array.from(new Set(courses.map((c) => c.instructor))).length;

  const handleApproveCourse = (id: number) => {
    updateCourseStatus(id, "Attendance Opened");
  };


  const getStatusBadge = (statusText: string) => {
    if (statusText.includes("Opened") || statusText.includes("Attendance") || statusText.includes("Approved")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
          {statusText}
        </span>
      );
    }
    if (statusText.includes("Completed")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
          {statusText}
        </span>
      );
    }
    if (statusText.includes("Reject")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
          {statusText}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60 shadow-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
        {statusText}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED ADMIN SIDEBAR */}
      <AdminSidebar activeTab="/admin/dashboard" />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-normal text-slate-900 dark:text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review courses, approvals, and enrollment activity.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/course")}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Manage Courses
            </button>
          </div>
        </div>

        {/* METRICS STAT CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Total Courses */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 border-l-2 border-l-indigo-500 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-normal uppercase tracking-wide text-slate-500 dark:text-slate-400">Total Courses</span>
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-normal tracking-tight text-slate-900 dark:text-white">{totalCourses}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Available in the catalogue</p>
          </div>

          {/* Card 2: Pending Approvals */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 border-l-2 border-l-amber-500 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-normal uppercase tracking-wide text-slate-500 dark:text-slate-400">Pending Approvals</span>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-normal tracking-tight text-slate-900 dark:text-white">{pendingCourses}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Awaiting review</p>
          </div>

          {/* Card 3: Total Enrolled & Faculty */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 border-l-2 border-l-sky-500 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-normal uppercase tracking-wide text-slate-500 dark:text-slate-400">Enrolled Students</span>
              <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-normal tracking-tight text-slate-900 dark:text-white">{totalStudents}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Across {uniqueInstructors} instructors</p>
          </div>
        </div>

        {/* Course review list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Course Review</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Review course status and enrollment activity.</p>
            </div>
            <button
              onClick={() => router.push("/admin/course")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all ({courses.length})
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Code & Course Name</th>
                  <th className="py-3.5 px-4">Faculty Instructor</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Mode / Type</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors align-middle">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shrink-0">
                          {course.code}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{course.name}</p>
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
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all duration-150 cursor-pointer"
                        >
                          View Details
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
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
  );
}
