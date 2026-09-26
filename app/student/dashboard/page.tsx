"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboardPage() {
  const router = useRouter();

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme ? JSON.parse(savedTheme) : false;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem("theme", JSON.stringify(nextDark));
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSignOut = () => {
    router.push("/login");
  };

  const completedCourses = [
    { name: "Next.js 15 & AI Integration", type: "Technical Skills", mode: "Online", credit: 4, completedOn: "15 Mar 2024" },
    { name: "Cybersecurity Defensive Practices", type: "Technical Skills", mode: "Offline", credit: 4, completedOn: "28 Feb 2024" },
    { name: "UI/UX Design & Figma", type: "Design Skills", mode: "Online", credit: 4, completedOn: "12 Feb 2024" },
    { name: "Data Structures & Algorithms", type: "Technical Skills", mode: "Offline", credit: 4, completedOn: "30 Jan 2024" },
  ];

  const totalCredits = completedCourses.reduce((total, course) => total + course.credit, 0);
  const yearAverage = 8.4;
  const completionRate = 100;
  const onlineCourses = completedCourses.filter((course) => course.mode === "Online").length;
  const offlineCourses = completedCourses.filter((course) => course.mode === "Offline").length;
  const averageCreditEarned = 12;

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 h-screen sticky top-0 transition-colors duration-300 z-10">
        <div>
          {/* Logo / Title */}
          <div className="mb-8 px-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              REWARD <span className="font-light text-indigo-600 dark:text-indigo-400 italic">POINTS</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <a
              onClick={() => router.push("/student/dashboard")}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </a>

            <a
              onClick={() => router.push("/student/course-complete")}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm font-medium transition-all duration-200"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Course Complete
            </a>

            {/* Course Register Menu */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-3 py-2 px-3 text-slate-900 dark:text-white text-sm font-bold">
                <svg className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Course Register
              </div>
              <div className="flex flex-col space-y-0.5 pl-4">
                <a
                  onClick={() => router.push("/student/course")}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm font-medium transition-all duration-200 cursor-pointer"
                >
                  Course Master
                </a>
                <a
                  onClick={() => router.push("/student/my-course")}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm font-medium transition-all duration-200 cursor-pointer"
                >
                  My Courses
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Logout Button */}
        <div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-sm font-semibold transition-all duration-200 text-left cursor-pointer"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign-Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 transition-colors duration-300 overflow-y-auto h-screen">
        {/* Header Bar */}
        <header className="flex justify-between items-center w-full mb-6">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Dashboard
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm cursor-pointer transition-colors"
            aria-label="Toggle dark theme"
          >
            {darkMode ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 18.36l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
        </header>

        {/* Dashboard Grid Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left Column (takes 2 span size on larger viewports) */}
          <div className="xl:col-span-2 space-y-6">

            {/* Top row: Graph & Quick Stats Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors duration-300">

              {/* Semester comparison chart */}
              <div className="flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Course Completion Progress
                    </span>
                    <p className="mt-1 text-xs text-slate-400">Completed courses by semester</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">4 total</span>
                </div>

                <div className="mt-6 grid grid-cols-[38px_1fr] gap-3">
                  <div className="flex h-44 flex-col justify-between pb-7 text-[10px] text-slate-400">
                    <span>4</span>
                    <span>2</span>
                    <span>0</span>
                  </div>
                  <div className="relative h-44 border-b border-slate-200 dark:border-slate-800">
                    <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-slate-200 dark:border-slate-800" />
                    <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-slate-200 dark:border-slate-800" />
                    <div className="flex h-full items-end justify-around gap-8 px-6">
                      <div className="flex h-full flex-1 flex-col items-center justify-end">
                        <span className="mb-2 text-xs font-bold text-slate-700 dark:text-slate-200">2 courses</span>
                        <div className="w-14 rounded-t-md bg-amber-400 transition-opacity duration-150 hover:opacity-80" style={{ height: "50%" }} />
                        <span className="mt-3 text-[10px] font-semibold text-slate-400">Semester 1</span>
                      </div>
                      <div className="flex h-full flex-1 flex-col items-center justify-end">
                        <span className="mb-2 text-xs font-bold text-slate-700 dark:text-slate-200">2 courses</span>
                        <div className="w-14 rounded-t-md bg-indigo-500 transition-opacity duration-150 hover:opacity-80" style={{ height: "50%" }} />
                        <span className="mt-3 text-[10px] font-semibold text-slate-400">Semester 2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick statistics details split */}
              <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-6">
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/20 text-center space-y-4">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Completion Details
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span>Courses completed:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{completedCourses.length}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span>Credits earned:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{totalCredits}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span>Year average:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{yearAverage}/10</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                      On Track
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold shadow-sm cursor-default"
                  >
                    {completedCourses.length} Courses Completed
                  </button>
                </div>
              </div>
            </div>

            {/* Credit comparison chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Credit Comparison</h3>
                  <p className="mt-1 text-xs text-slate-400">Your earned credits compared with the student average</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">Current year</span>
              </div>

              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-[112px_1fr_64px] items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your Credits</span>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-indigo-500 transition-all duration-200" style={{ width: `${(totalCredits / 20) * 100}%` }} />
                  </div>
                  <span className="text-right text-xs font-bold text-slate-700 dark:text-slate-200">{totalCredits} credits</span>
                </div>
                <div className="grid grid-cols-[112px_1fr_64px] items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Student Average</span>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-amber-400 transition-all duration-200" style={{ width: `${(averageCreditEarned / 20) * 100}%` }} />
                  </div>
                  <span className="text-right text-xs font-bold text-slate-700 dark:text-slate-200">{averageCreditEarned} credits</span>
                </div>
                <div className="flex justify-between pl-[115px] text-[10px] text-slate-400">
                  <span>0 credits</span>
                  <span>20 credits</span>
                </div>
              </div>

            </div>

            {/* Bottom Card: Course Completion Summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
              <div className="flex items-center gap-2 mb-6">
                <svg className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Course Completion Summary
                </h3>
              </div>

              {/* Academic summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 border-l-4 border-l-indigo-500 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completed Courses</span>
                  <span className="text-xl font-extrabold mt-3 text-slate-900 dark:text-white">{completedCourses.length}</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 border-l-4 border-l-emerald-500 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Credits Earned</span>
                  <span className="text-xl font-extrabold mt-3 text-slate-900 dark:text-white">{totalCredits}</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 border-l-4 border-l-amber-500 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Year Average</span>
                  <span className="text-xl font-extrabold mt-3 text-slate-900 dark:text-white">{yearAverage}<span className="text-xs font-semibold text-slate-400">/10</span></span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 border-l-4 border-l-sky-500 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completion Rate</span>
                  <span className="text-xl font-extrabold mt-3 text-slate-900 dark:text-white">{completionRate}%</span>
                </div>
              </div>

              {/* Completion Notes */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 rounded-xl p-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="max-w-[190px]">Latest completed course</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold ml-2">15 Mar 2024</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 rounded-xl p-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="max-w-[190px]">Learning mode split</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold ml-2">{onlineCourses} online / {offlineCourses} offline</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Split Table */}
          <div className="self-start bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300 flex flex-col w-full">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-indigo-650" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  Completed Courses
                </h3>
                <span className="text-[10px] text-slate-400 mt-1 block">2023-2024 Academic Year</span>
              </div>
            </div>

            {/* Tab */}
            <div className="mb-4">
              <span className="inline-flex px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950 text-xs font-semibold rounded-lg">
                Course Completion Details
              </span>
            </div>

            {/* Split up List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-y-auto max-h-[360px] pr-2">
              {completedCourses.map((course) => (
                <div key={course.name} className="py-3 space-y-1 text-xs font-medium">
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold truncate">{course.name}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">Completed</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>{course.type} · {course.mode}</span>
                    <span>{course.credit} Credits · {course.completedOn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
