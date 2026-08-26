"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import { INITIAL_COURSES, Course } from "../../../faculty/data/mockCourses";

export default function AdminCourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const courseIdParam = params?.id ? Number(params.id) : 1;

  // Find course or fallback to course 1
  const initialCourse = INITIAL_COURSES.find((c) => c.id === courseIdParam) || INITIAL_COURSES[0];
  const [course, setCourse] = useState<Course>(initialCourse);
  const [studentSearch, setStudentSearch] = useState("");
  const [statusNotification, setStatusNotification] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReasonInput, setRejectReasonInput] = useState(course.rejectionReason || "");

  const handleUpdateStatus = (newStatus: string, reason?: string) => {
    setCourse((prev) => ({
      ...prev,
      statusText: newStatus,
      rejectionReason: reason !== undefined ? reason : prev.rejectionReason,
    }));
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
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
    }
    if (statusText.includes("Completed")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
    }
    if (statusText.includes("Reject")) {
      return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800";
    }
    return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
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
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED ADMIN SIDEBAR */}
      <AdminSidebar activeTab={`/admin/course/${course.id}`} />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
        {/* TOP BANNER & BACK BUTTON */}
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
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadgeStyle(course.statusText)}`}>
                {course.statusText}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {course.name}
            </h1>
          </div>

          <button
            onClick={() => router.push("/admin/course")}
            className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm cursor-pointer"
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
        <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Faculty & Instructor Information
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Assigned Lead
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {course.instructor.charAt(0)}
                </div>

                <div className="space-y-1 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {course.instructor}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Course Description & Syllabus</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {course.details}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Registration Dates</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
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
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                    course.statusText.includes("Opened") || course.statusText.includes("Attendance") || course.statusText.includes("Approved")
                      ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30"
                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200/60 dark:border-emerald-800/60"
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
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                    course.statusText.includes("Reject")
                      ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-600/30"
                      : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200/60 dark:border-rose-800/60"
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
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                    course.statusText.includes("Pending")
                      ? "bg-amber-600 text-white shadow-md ring-2 ring-amber-600/30"
                      : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200/60 dark:border-amber-800/60"
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Enrollment Capacity
              </h2>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Students</p>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                  {course.registeredCount} / {course.maxIntake}
                </p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                  {Math.round((course.registeredCount / course.maxIntake) * 100)}% Seat Capacity Filled
                </p>

                <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round((course.registeredCount / course.maxIntake) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REGISTERED STUDENTS ROSTER TABLE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
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
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
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
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-xs border ${
                            student.attendanceStatus === "Present"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
                              : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                              student.attendanceStatus === "Present" ? "bg-emerald-500" : "bg-rose-500"
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
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
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
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
  );
}
