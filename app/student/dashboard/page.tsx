"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../context/StoreContext";
import StudentSidebar from "../components/StudentSidebar";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { darkMode } = useStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">
      <StudentSidebar activeTab="/student/dashboard" />

      {/* MAIN CONTENT FLEX WRAPPER */}
      <div className="flex pt-16 w-full min-h-screen">
        {/* Sidebar Desktop Spacer */}
        <div className="hidden lg:block w-64 shrink-0" />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 min-w-0 space-y-6">

            {/* Bottom Card: Course Completion Summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-sm transition-colors duration-300">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                    Course Completion Summary
                  </h3>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">2023–2024</span>
              </div>

              {/* Academic summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Year Average</span>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#ea580c] dark:text-[#fb923c]">{yearAverage}<span className="text-xl md:text-2xl font-semibold opacity-60">/10</span></p>
                    <div className="w-12 h-12 rounded-2xl bg-[#ffedd5] dark:bg-orange-950/70 text-[#ea580c] dark:text-[#fb923c] flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">Completion Rate</span>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl md:text-4xl font-heading font-extrabold text-[#16a34a] dark:text-[#22c55e]">{completionRate}%</p>
                    <div className="w-12 h-12 rounded-2xl bg-[#fee2e2] dark:bg-red-950/70 text-[#16a34a] dark:text-[#22c55e] flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Notes */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 border-t border-slate-100 dark:border-slate-800 pt-5">
                <div className="flex items-center justify-between py-3 text-xs text-slate-500 dark:text-slate-400 border-b md:border-b-0 border-slate-100 dark:border-slate-800">
                  <span>Latest completed course</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">15 Mar 2024</span>
                </div>
                <div className="flex items-center justify-between py-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>Learning mode split</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{onlineCourses} online / {offlineCourses} offline</span>
                </div>
              </div>
            </div>
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
    </div>
  );
}
