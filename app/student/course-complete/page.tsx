"use client";

import { useEffect, useState } from "react";
import { useStore } from "../../context/StoreContext";
import StudentSidebar from "../components/StudentSidebar";
import CertificateModal from "../components/CertificateModal";
import {
  courseMode,
  fetchCompletedCourses,
  fetchStudentDashboard,
  formatDisplayDate,
  type StudentCourse,
} from "../api";

export default function CourseCompletePage() {
    const { darkMode, user } = useStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [completedCourses, setCompletedCourses] = useState<StudentCourse[]>([]);
    const [completionRate, setCompletionRate] = useState(0);
    const [selectedCertCourse, setSelectedCertCourse] = useState<StudentCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    useEffect(() => {
        let cancelled = false;

        async function loadCompleted() {
            setLoading(true);
            setError("");
            try {
                const [courses, dashboard] = await Promise.all([
                    fetchCompletedCourses(),
                    fetchStudentDashboard(),
                ]);
                if (cancelled) return;
                setCompletedCourses(courses);
                setCompletionRate(dashboard.completionRate);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Unable to load completed courses.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadCompleted();
        return () => {
            cancelled = true;
        };
    }, []);

    const totalCredits = completedCourses.reduce((total, course) => total + (course.credit || 0), 0);
    const onlineCount = completedCourses.filter((course) => courseMode(course.mode) === "Online").length;
    const offlineCount = completedCourses.filter((course) => courseMode(course.mode) === "Offline").length;
    const filteredCourses = completedCourses.filter((course) => {
        const query = searchQuery.trim().toLowerCase();
        return !query || `${course.name} ${course.type} ${course.mode} ${course.organizer}`.toLowerCase().includes(query);
    });

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">
            <StudentSidebar activeTab="/student/course-complete" />

            {/* MAIN CONTENT FLEX WRAPPER */}
            <div className="flex pt-16 w-full min-h-screen">
                {/* Sidebar Desktop Spacer */}
                <div className="hidden lg:block w-64 shrink-0" />

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-8 min-w-0 space-y-6">
                    {error ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                            {error}
                        </div>
                    ) : null}
                    {loading ? <p className="text-sm text-slate-500 dark:text-slate-400">Loading completed courses...</p> : null}
                    <header className="flex items-start justify-between gap-4 mb-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Student Portal</p>
                            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Course Complete</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A record of your completed learning journey.</p>
                        </div>
                    </header>

                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Completed Courses</span>
                            <div className="flex items-center justify-between">
                                <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#2563eb] dark:text-[#3b82f6]">{completedCourses.length}</p>
                                <div className="w-12 h-12 rounded-2xl bg-[#dbeafe] dark:bg-blue-950/70 text-[#2563eb] dark:text-[#3b82f6] flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Credits Earned</span>
                            <div className="flex items-center justify-between">
                                <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#16a34a] dark:text-[#22c55e]">{totalCredits}</p>
                                <div className="w-12 h-12 rounded-2xl bg-[#dcfce7] dark:bg-emerald-950/70 text-[#16a34a] dark:text-[#22c55e] flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Completion Rate</span>
                            <div className="flex items-center justify-between">
                                <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#16a34a] dark:text-[#22c55e]">{completionRate}%</p>
                                <div className="w-12 h-12 rounded-2xl bg-[#ffedd5] dark:bg-orange-950/70 text-[#16a34a] dark:text-[#22c55e] flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Completed Course Records</h3>
                                <p className="mt-1 text-xs text-slate-400">Successfully completed courses and earned credits</p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <label className="relative block">
                                    <span className="sr-only">Search completed courses</span>
                                    <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m2.1-5.15a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0Z" /></svg>
                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        placeholder="Search courses"
                                        className="h-9 w-full sm:w-52 rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                    />
                                </label>
                                <div className="flex gap-2 text-xs font-semibold">
                                    <span className="rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-3 py-1.5">Online {onlineCount}</span>
                                    <span className="rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 px-3 py-1.5">Offline {offlineCount}</span>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left">
                                <thead>
                                    <tr className="border-b border-blue-100 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-900/20">
                                        <th className="px-5 py-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">Course Name</th>
                                        <th className="px-5 py-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">Type</th>
                                        <th className="px-5 py-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">Mode</th>
                                        <th className="px-5 py-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide text-right">Credit</th>
                                        <th className="px-5 py-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">Completed On</th>
                                        <th className="px-5 py-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">Status</th>
                                        <th className="px-5 py-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide text-right">Certificate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {filteredCourses.length > 0 ? filteredCourses.map((course) => {
                                        const meetsAttendanceRequirement = (course.attendancePercentage ?? 100) >= 50;
                                        return (
                                            <tr key={course.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                                                <td className="px-5 py-4">
                                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{course.name}</div>
                                                    <div className="mt-1 text-xs text-slate-400">
                                                        {course.code ? `${course.code} • ` : ""}{course.organizer}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">{course.type}</td>
                                                <td className="px-5 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300">{courseMode(course.mode)}</td>
                                                <td className="px-5 py-4 text-right text-sm font-bold text-blue-600 dark:text-blue-400">{course.credit}</td>
                                                <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">{formatDisplayDate(course.completedOn)}</td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Completed
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    {meetsAttendanceRequirement ? (
                                                        <button
                                                            onClick={() => setSelectedCertCourse(course)}
                                                            type="button"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 hover:from-amber-400 hover:to-yellow-500 border border-amber-500/50 shadow-sm transition hover:scale-105 active:scale-95"
                                                        >
                                                            <svg className="w-3.5 h-3.5 text-amber-900" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 011.364 1.363l-.8 1.6 1.582 3.954A1 1 0 0118 12h-1.323l-1.582 3.954.8 1.599a1 1 0 01-1.363 1.364l-1.6-.8-3.954 1.582A1 1 0 019 18v-1.323l-3.954-1.582-1.599.8a1 1 0 01-1.364-1.363l.8-1.6L1.301 10.378A1 1 0 012 9h1.323l1.582-3.954-.8-1.599a1 1 0 011.363-1.364l1.6.8L9.619 2.301A1 1 0 0110 2zm0 4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                                                            </svg>
                                                            View Certificate
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                                            {course.attendancePercentage}% Attendance (50% required)
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-16 text-center">
                                                <svg className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m2.1-5.15a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0Z" /></svg>
                                                <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">No completed courses found</p>
                                                <p className="mt-1 text-xs text-slate-400">Try a different course name, type, or mode.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>

            {selectedCertCourse && (
                <CertificateModal
                    course={selectedCertCourse}
                    studentName={user?.name || "Aarav Sharma"}
                    studentRollNo={user?.rollNo || "21CSE01"}
                    studentDept={user?.department || "Computer Science & Engineering"}
                    onClose={() => setSelectedCertCourse(null)}
                />
            )}
        </div>
    );
}
