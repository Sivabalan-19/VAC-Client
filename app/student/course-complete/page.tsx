"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "true";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem("theme", JSON.stringify(nextDark));
    document.documentElement.classList.toggle("dark", nextDark);
  };

  const totalCredits = completedCourses.reduce((total, course) => total + course.credit, 0);
  const onlineCount = completedCourses.filter((course) => course.mode === "Online").length;
  const offlineCount = completedCourses.filter((course) => course.mode === "Offline").length;
  const filteredCourses = completedCourses.filter((course) => {
    const query = searchQuery.trim().toLowerCase();
    return !query || `${course.name} ${course.type} ${course.mode} ${course.organizer}`.toLowerCase().includes(query);
  });

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 h-screen sticky top-0">
        <div>
          <div className="mb-8 px-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              VAC <span className="font-light text-indigo-600 dark:text-indigo-400 italic">PORTAL</span>
            </h1>
          </div>
          <nav className="space-y-1">
            <button onClick={() => router.push("/student/dashboard")} className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm font-medium text-left cursor-pointer">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" /></svg>
              Dashboard
            </button>
            <button onClick={() => router.push("/student/course-complete")} className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 text-sm font-semibold text-left cursor-pointer">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              Course Complete
            </button>
            <div className="pt-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Course Register</div>
            <button onClick={() => router.push("/student/course")} className="w-full flex items-center gap-3 py-2.5 px-7 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm font-medium text-left cursor-pointer">
              Course Master
            </button>
            <button onClick={() => router.push("/student/my-course")} className="w-full flex items-center gap-3 py-2.5 px-7 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm font-medium text-left cursor-pointer">
              My Courses
            </button>
          </nav>
        </div>
        <button onClick={() => router.push("/login")} className="w-full py-2.5 px-3 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-sm font-semibold text-left cursor-pointer">
          Sign-Out
        </button>
      </aside>

      <main className="flex-1 p-5 md:p-8">
        <header className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">Student Portal</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Course Complete</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A record of your completed learning journey.</p>
          </div>
          <button onClick={toggleDarkMode} className="h-9 w-9 flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer transition-colors" aria-label="Toggle dark theme">
            {darkMode ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg> : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.75 15.1A9.5 9.5 0 0 1 8.9 2.25 9.5 9.5 0 1 0 21.75 15.1Z" /></svg>}
          </button>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 border-l-indigo-500 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completed Courses</span>
            <strong className="block mt-3 text-3xl text-slate-900 dark:text-white">{completedCourses.length}</strong>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 border-l-emerald-500 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Credits Earned</span>
            <strong className="block mt-3 text-3xl text-slate-900 dark:text-white">{totalCredits}</strong>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 border-l-amber-500 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completion Rate</span>
            <strong className="block mt-3 text-3xl text-slate-900 dark:text-white">100%</strong>
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
  );
}
