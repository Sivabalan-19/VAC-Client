"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FacultySidebar from "../../components/FacultySidebar";
import { useStore } from "../../../context/StoreContext";

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

  const {
    courses,
    sessionAttendance,
    updateStudentAttendance,
    markAllPresent: storeMarkAllPresent,
    getCourseAttendanceMetrics,
  } = useStore();

  // Find course or fallback to course 1
  const course = courses.find((c) => c.id === courseIdParam) || courses[0];

  // Multi-day & Multi-session Configuration (2 Days, 2 Sessions per day = 4 Total Sessions)
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

  // Get current active session attendance list from Store
  const courseSessions = sessionAttendance[course.id] || {};
  const currentSessionRecords = courseSessions[activeSessionId] || {};
  const currentSessionAttendedCount = Object.values(currentSessionRecords).filter((status) => status === "Present").length;
  const totalStudentsCount = course.students.length;
  const currentSessionRate = totalStudentsCount > 0 ? Math.round((currentSessionAttendedCount / totalStudentsCount) * 100) : 0;

  // Compute Overall Course Attendance Rate across all sessions from Store
  const { overallRate: overallCourseRate, attendedEnrolled: totalActualCheckins } = getCourseAttendanceMetrics(course.id);


  // Toggle individual student attendance for active session
  const toggleAttendance = (studentId: string, newStatus: "Present" | "Absent") => {
    updateStudentAttendance(course.id, activeSessionId, studentId, newStatus);
  };

  // Mark all students present for active session
  const markAllPresent = () => {
    storeMarkAllPresent(course.id, activeSessionId);
  };

  // Filter students for display
  const filteredStudents = course.students.filter((st) => {
    const matchesSearch =
      st.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.rollNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.department.toLowerCase().includes(studentSearch.toLowerCase());
    
    const currentStatus = currentSessionRecords[st.id] || (st.attendanceStatus === "Present" ? "Present" : "Absent");
    const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });


  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED SIDEBAR */}
      <FacultySidebar activeTab={`/faculty/course/${course.id}`} />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
        {/* TOP OF PAGE: COURSE TOPIC TITLE & BACK BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {course.code}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {course.type}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {course.mode}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {course.name}
            </h1>
          </div>

          <button
            onClick={() => router.push("/faculty/course")}
            className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm cursor-pointer"
          >
            ← Back to My Course
          </button>
        </div>

        {/* FULL SCREEN / FULL WIDTH EVENT HERO IMAGE */}
        <div className="relative w-full h-80 sm:h-96 md:h-[400px] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
          <img
            src={course.imageUrl}
            alt={course.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* BELOW FULL IMAGE: EVENT DETAILS (LEFT) + ATTENDANCE STATISTICS (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* EVENT DETAILS */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Event Overview & Details</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {course.details}
              </p>
            </div>

            {/* Event Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Registration Dates</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                  {course.regStartDate} to {course.regEndDate}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Event Start Date</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{course.startDate}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Lead Instructor</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{course.instructor}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Department</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{course.department}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Location / Platform</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{course.location}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Intake / Credits</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{course.maxIntake} Seats ({course.credits} Credits)</span>
              </div>
            </div>
          </div>

          {/* ATTENDANCE STATISTICS */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Attendance Statistics
            </h2>

            {/* Active Session Attendance Rate */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Session Attendance</p>
              <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{currentSessionRate}%</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                {currentSessionAttendedCount} / {totalStudentsCount} Students Attended
              </p>

              {/* Progress bar */}
              <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentSessionRate}%` }}
                />
              </div>
            </div>

            {/* Overall Course Attendance Rate */}
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Overall Course Average</span>
                <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{overallCourseRate}%</span>
              </div>
              <div className="mt-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${overallCourseRate}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Total Across 2 Days & 4 Event Sessions
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={markAllPresent}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
              >
                Mark All Present (Current Session)
              </button>
              <button
                onClick={() => alert("Event attendance report exported successfully!")}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Export Attendance Report
              </button>
            </div>
          </div>
        </div>

        {/* ATTENDANCE SECTION: SEPARATED BY DATES & SESSIONS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Student Attendance Management</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select date and session below to mark or view attendance for specific event time slots.
            </p>
          </div>

          {/* DATES & SESSIONS SELECTOR TABS */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Select Date & Session (2 Days, 2 Sessions per Day):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                const sessionAttended = Object.values(courseSessions[s.id] || {}).filter((status) => status === "Present").length;
                const sessionPct = totalStudentsCount > 0 ? Math.round((sessionAttended / totalStudentsCount) * 100) : 0;

                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-md"
                        : "bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        isActive ? "bg-indigo-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}>
                        {s.dayLabel} • {s.dateStr}
                      </span>
                      <span className={`text-xs font-extrabold ${isActive ? "text-emerald-400 dark:text-emerald-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {sessionPct}%
                      </span>
                    </div>
                    <p className="text-xs font-bold truncate">{s.sessionName}</p>
                    <p className={`text-[11px] mt-0.5 ${isActive ? "text-slate-300 dark:text-slate-600" : "text-slate-400"}`}>
                      {s.timeRange}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE SESSION INFO BAR & SEARCH FILTER */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                Active Session: {activeSession.dayLabel} ({activeSession.dateStr}) — {activeSession.sessionName}
              </div>
            </div>

            {/* Student Search & Status Filter */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Filter student name or roll..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                    statusFilter === "all"
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  All ({totalStudentsCount})
                </button>
                <button
                  onClick={() => setStatusFilter("Present")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                    statusFilter === "Present"
                      ? "bg-emerald-600 text-white font-semibold"
                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  Present ({currentSessionAttendedCount})
                </button>
                <button
                  onClick={() => setStatusFilter("Absent")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                    statusFilter === "Absent"
                      ? "bg-rose-600 text-white font-semibold"
                      : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  Absent ({totalStudentsCount - currentSessionAttendedCount})
                </button>
              </div>
            </div>
          </div>

          {/* STUDENT ATTENDANCE ROSTER TABLE FOR ACTIVE SESSION */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Department & Year</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Session Status</th>
                  <th className="py-3 px-4 text-center">Give Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((student) => {
                  const status = currentSessionRecords[student.id] || "Absent";

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                            {student.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{student.studentName}</p>
                            <p className="text-[10px] text-slate-400">{student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {student.rollNo}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {student.department} ({student.year})
                      </td>
                      <td className="py-3 px-4 text-slate-500">{student.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            status === "Present"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {status === "Present" ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => toggleAttendance(student.id, "Present")}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              status === "Present"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => toggleAttendance(student.id, "Absent")}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              status === "Absent"
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
