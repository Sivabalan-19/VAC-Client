"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../context/StoreContext";
import StudentSidebar from "../components/StudentSidebar";

interface CompletedCourse {
  name: string;
  type: string;
  mode: "Online" | "Offline";
  credit: number;
  completedOn: string;
  organizer: string;
}

const completedCourses: CompletedCourse[] = [
  {
    name: "Next.js 15 & AI Integration",
    type: "Technical Skills",
    mode: "Online",
    credit: 4,
    completedOn: "15 Mar 2024",
    organizer: "Computer Science Department",
  },
  {
    name: "Cybersecurity Defensive Practices",
    type: "Technical Skills",
    mode: "Offline",
    credit: 4,
    completedOn: "28 Feb 2024",
    organizer: "Cybersecurity Club",
  },
  {
    name: "UI/UX Design & Figma",
    type: "Design Skills",
    mode: "Online",
    credit: 4,
    completedOn: "12 Feb 2024",
    organizer: "Design Society",
  },
  {
    name: "Data Structures & Algorithms",
    type: "Technical Skills",
    mode: "Offline",
    credit: 4,
    completedOn: "30 Jan 2024",
    organizer: "Computer Science Department",
  },
];

export default function CourseCompletePage() {
  const router = useRouter();
  const { darkMode } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const totalCredits = completedCourses.reduce((total, course) => total + course.credit, 0);
  const onlineCount = completedCourses.filter((course) => course.mode === "Online").length;
  const offlineCount = completedCourses.filter((course) => course.mode === "Offline").length;
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
          <header className="flex items-start justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">Student Portal</p>
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
              <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#16a34a] dark:text-[#22c55e]">100%</p>
              <div className="w-12 h-12 rounded-2xl bg-[#ffedd5] dark:bg-orange-950/70 text-[#16a34a] dark:text-[#22c55e] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
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
                  className="h-9 w-full sm:w-52 rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
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
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Course Name</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Type</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Mode</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-right">Credit</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Completed On</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredCourses.length > 0 ? filteredCourses.map((course) => (
                  <tr key={course.name} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{course.name}</div>
                      <div className="mt-1 text-xs text-slate-400">{course.organizer}</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">{course.type}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300">{course.mode}</td>
                    <td className="px-5 py-4 text-right text-sm font-bold text-indigo-600 dark:text-indigo-400">{course.credit}</td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">{course.completedOn}</td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Completed</span></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
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
    </div>
  );
}
