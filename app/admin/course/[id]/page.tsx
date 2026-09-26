"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import { useStore } from "../../../context/StoreContext";

export default function AdminCourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const courseIdParam = params?.id ? Number(params.id) : 1;

  const { courses, updateCourseStatus } = useStore();

  // Find course or fallback to course 1
  const course = courses.find((c) => c.id === courseIdParam) || courses[0];
  const [studentSearch, setStudentSearch] = useState("");
  const [statusNotification, setStatusNotification] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReasonInput, setRejectReasonInput] = useState(course.rejectionReason || "");

  const handleUpdateStatus = (newStatus: string, reason?: string) => {
    updateCourseStatus(course.id, newStatus, reason);
    setStatusNotification(`Course status updated to "${newStatus}"`);
    setTimeout(() => setStatusNotification(""), 4000);
  };

  const handleConfirmReject = () => {
    if (!rejectReasonInput.trim()) return;
    handleUpdateStatus("Rejected", rejectReasonInput);
    setShowRejectModal(false);
  };


  const getStatusBadgeStyle = (statusText: string) => {
    if (statusText.includes("Opened") || statusText.includes("Attendance") || statusText.includes("Approved")) {
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

  const filteredStudents = course.students.filter((st) => {
    const query = studentSearch.toLowerCase();
    return (
      st.studentName.toLowerCase().includes(query) ||
      st.rollNo.toLowerCase().includes(query) ||
      st.department.toLowerCase().includes(query) ||
      st.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED ADMIN SIDEBAR */}
      <AdminSidebar activeTab={`/admin/course/${course.id}`} />

      {/* 2. MAIN CONTENT FLEX WRAPPER (Top clearance + zero sidebar gap) */}
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
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${course.statusText.includes("Opened") || course.statusText.includes("Attendance") || course.statusText.includes("Approved") ? "bg-emerald-500" : course.statusText.includes("Completed") ? "bg-blue-500" : course.statusText.includes("Reject") ? "bg-rose-500" : "bg-amber-500"}`} />
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

          {/* NOTIFICATION TOAST */}
          {statusNotification && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-sm">
              <span>{statusNotification}</span>
              <button onClick={() => setStatusNotification("")} className="text-emerald-600 dark:text-emerald-400 font-extrabold">✕</button>
            </div>
          )}

          {/* REJECTION REASON ALERT BANNER (If rejected) */}
          {course.statusText.includes("Reject") && course.rejectionReason && (
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Course Proposal Rejected - Governance Feedback
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-200 pl-6 leading-relaxed">
                "{course.rejectionReason}"
              </p>
            </div>
          )}

          {/* HERO IMAGE BANNER */}
          <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
            <img
              src={course.imageUrl}
              alt={course.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 2-COLUMN GRID: FACULTY DETAILS (LEFT) + ADMIN ACTIONS & COURSE STATS (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* LEFT: FACULTY INFORMATION & COURSE OVERVIEW */}
            <div className="lg:col-span-2 space-y-6">
              {/* FACULTY DETAILS CARD */}
              <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 shadow-sm transition-colors duration-300 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Faculty & Instructor Information
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    Assigned Lead
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xl flex items-center justify-center">
                    {course.instructor.charAt(0)}
                  </div>

                  <div className="space-y-1 flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {course.instructor}
                    </h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      {course.department}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Lead Academic Facilitator & Course Coordinator
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Faculty Email</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {course.instructor.toLowerCase().replace(/[^a-z]/g, "")}@univ.edu
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Department Code</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {course.department.split(" ").map(w => w[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Approval Status</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      Verified Faculty Member
                    </span>
                  </div>
                </div>
              </div>

              {/* COURSE DESCRIPTION & DETAILS CARD */}
              <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 shadow-sm transition-colors duration-300 space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Course Description & Syllabus</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {course.details}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Registration Dates</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                      {course.regStartDate} to {course.regEndDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Event Schedule</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{course.startDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Venue / Platform</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{course.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Course Category</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{course.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Mode & Type</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{course.mode} • {course.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Academic Credits</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{course.credits} Credits</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: ADMIN CONTROLS & CAPACITY METRICS */}
            <div className="space-y-6">
              {/* ADMIN STATUS CONTROLS */}
              <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 shadow-sm transition-colors duration-300 space-y-4">
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Admin Governance Controls
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a decision to update the course lifecycle state.
                </p>

                {/* THREE BUTTONS: APPROVE, REJECT, PENDING */}
                <div className="space-y-2.5">
                  {/* 1. APPROVE BUTTON */}
                  <button
                    onClick={() => handleUpdateStatus("Attendance Opened")}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${course.statusText.includes("Opened") || course.statusText.includes("Attendance") || course.statusText.includes("Approved")
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Approve Course
                    </span>
                    {(course.statusText.includes("Opened") || course.statusText.includes("Attendance") || course.statusText.includes("Approved")) && <span>Active</span>}
                  </button>

                  {/* 2. REJECT BUTTON */}
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${course.statusText.includes("Reject")
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject Proposal
                    </span>
                    {course.statusText.includes("Reject") && <span>Rejected</span>}
                  </button>

                  {/* 3. PENDING BUTTON */}
                  <button
                    onClick={() => handleUpdateStatus("Approval Pending...")}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${course.statusText.includes("Pending")
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Set Pending
                    </span>
                    {course.statusText.includes("Pending") && <span>Pending</span>}
                  </button>
                </div>
              </div>

              {/* ENROLLMENT & ATTENDANCE SUMMARY */}
              <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Enrollment Capacity
                </h2>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Students</p>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    {course.registeredCount} / {course.maxIntake}
                  </p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                    {Math.round((course.registeredCount / course.maxIntake) * 100)}% Seat Capacity Filled
                  </p>

                  <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((course.registeredCount / course.maxIntake) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REGISTERED STUDENTS ROSTER TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 shadow-sm transition-colors duration-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registered Student Roster</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">List of students enrolled in this Value Added Course</p>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search student or roll..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/30 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
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

            <div className="overflow-x-auto border border-blue-100 dark:border-blue-900/50 rounded-lg">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-blue-50/40 dark:bg-blue-900/20 text-slate-700 dark:text-slate-300 capitalize tracking-wide font-bold border-b border-blue-100 dark:border-blue-900/50">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Department & Year</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Attendance Record</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 font-medium">
                        No enrolled students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
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
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-xs border ${student.attendanceStatus === "Present"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
                              : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60"
                              }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full shrink-0 ${student.attendanceStatus === "Present" ? "bg-emerald-500" : "bg-rose-500"
                                }`}
                            />
                            {student.attendanceStatus}
                          </span>
                        </td>
                      </tr>
                    ))
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
                    <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Rejection Reason / Feedback:
                  </label>
                  <textarea
                    rows={4}
                    value={rejectReasonInput}
                    onChange={(e) => setRejectReasonInput(e.target.value)}
                    placeholder="E.g., Syllabus does not meet institutional credit requirements. Module 3 requires additional practical hours..."
                    className="w-full p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReject}
                    disabled={!rejectReasonInput.trim()}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition cursor-pointer"
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
