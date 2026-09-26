"use client";

import { useRouter } from "next/navigation";
import FacultySidebar from "../components/FacultySidebar";
import { useStore } from "../../context/StoreContext";

export default function FacultyDashboardPage() {
  const router = useRouter();
  const { courses } = useStore();

  // Compute Dashboard Metrics
  const totalCourses = courses.length;
  const totalRegistered = courses.reduce((acc, c) => acc + c.registeredCount, 0);
  const totalAttended = courses.reduce((acc, c) => acc + c.attendedCount, 0);
  const overallAttendancePercentage = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;
  const activeEventsCount = courses.filter((c) => c.statusText.includes("Attendance") || c.statusText.includes("Opened")).length;


  // Helper function to extract Month and Day for Calendar inspiration badge
  const getCalendarDate = (dateStr: string) => {
    if (!dateStr) return { month: "AUG", day: "28" };
    try {
      const datePart = dateStr.split(" ")[0];
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
  const getStatusBadgeStyle = (statusText: string) => {
    if (statusText.includes("Opened") || statusText.includes("Attendance")) {
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
              Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">Dr. Sarah Connor</span>! Overview of your Value Added Courses and student attendance.
            </p>
          </div>

          {/* METRICS STAT CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Card 1: Total Courses */}
            <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-md transition">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Total Courses</span>
              <div className="flex items-center justify-between">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#2563eb] dark:text-[#3b82f6]">{totalCourses}</p>
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
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#16a34a] dark:text-[#22c55e]">{totalRegistered}</p>
                <div className="w-12 h-12 rounded-2xl bg-[#dcfce7] dark:bg-emerald-950/70 text-[#16a34a] dark:text-[#22c55e] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">Across all course batches</span>
            </div>

            {/* Card 3: Total Attended */}
            <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-md transition">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Total Attended</span>
              <div className="flex items-center justify-between">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#ea580c] dark:text-[#fb923c]">{totalAttended}</p>
                <div className="w-12 h-12 rounded-2xl bg-[#ffedd5] dark:bg-orange-950/70 text-[#ea580c] dark:text-[#fb923c] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">{overallAttendancePercentage}% Attendance Rate</span>
            </div>

            {/* Card 4: Active Events */}
            <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-md transition">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Active Sessions</span>
              <div className="flex items-center justify-between">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#dc2626] dark:text-[#f87171]">{activeEventsCount}</p>
                <div className="w-12 h-12 rounded-2xl bg-[#fee2e2] dark:bg-red-950/70 text-[#dc2626] dark:text-[#f87171] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">Attendance Marking Open</span>
            </div>
          </div>

          {/* SECTION: COURSES OVERVIEW CARDS */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Value Added Courses</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Click on any card to view detailed course information and mark student attendance</p>
              </div>
              <button
                onClick={() => router.push("/faculty/course")}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View All ({courses.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => {
                const calDate = getCalendarDate(course.startDate);

                return (
                  <div
                    key={course.id}
                    onClick={() => router.push(`/faculty/course/${course.id}`)}
                    className="group bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    {/* Card Banner Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Left Top Corner: Course Type Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                          {course.type}
                        </span>
                      </div>

                      {/* Right Top Corner: Calendar Tear-Off Leaf Badge */}
                      <div className="absolute top-3 right-3 z-10 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 text-center w-12 flex flex-col items-center">
                        <div className="bg-rose-600 text-[9px] font-bold tracking-wider uppercase text-white w-full py-0.5">
                          {calDate.month}
                        </div>
                        <div className="text-slate-900 dark:text-white font-extrabold text-sm py-1 leading-snug">
                          {calDate.day}
                        </div>
                      </div>

                      {/* Bottom Mode Tag */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900/80 text-white backdrop-blur-md">
                          {course.mode}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {course.code}
                          </span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{course.category}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course.name}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                          {course.details}
                        </p>
                      </div>

                      {/* Tightened Card Footer: Highlighted Event Status Badge & View Details Link */}
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${getStatusBadgeStyle(course.statusText)}`}>
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${course.statusText.includes("Opened") || course.statusText.includes("Attendance") ? "bg-emerald-500" : course.statusText.includes("Completed") ? "bg-blue-500" : "bg-amber-500"}`} />
                          {course.statusText}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Manage Attendance →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECENT ATTENDANCE ACTIVITY TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Recent Event Attendance Activity</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Latest student check-ins across active VAC sessions</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-blue-50/40 dark:bg-blue-900/20 text-slate-700 dark:text-slate-300 capitalize tracking-wide font-bold border-b border-blue-100 dark:border-blue-900/50">
                  <tr>
                    <th className="py-3 px-4">Course Name</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Check-in Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {courses[0].students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{courses[0].name}</td>
                      <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">{student.studentName}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{student.rollNo}</td>
                      <td className="py-3 px-4 text-slate-500">{student.department}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${student.attendanceStatus === "Present"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                            }`}
                        >
                          {student.attendanceStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{student.markedTime || "N/A"}</td>
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
