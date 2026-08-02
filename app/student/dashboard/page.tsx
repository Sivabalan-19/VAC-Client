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

  // Detailed points split up list (replacing event terminology with course)
  const pointsSplitUp = [
    { label: "Technical Courses(0)", value: "0.00" },
    { label: "Skills", value: "0.00" },
    { label: "Assignments(0)", value: "0.00" },
    { label: "Interview(0)", value: "0.00" },
    { label: "Technical Society Courses(0)", value: "0.00" },
    { label: "Product Development", value: "0.00" },
    { label: "TAC", value: "0.00" },
    { label: "Special Lab Initiatives(0)", value: "0.00" },
    { label: "Extra-Curricular Activities(0)", value: "0.00" },
    { label: "Student Initiatives", value: "0.00" },
    { label: "External Courses", value: "0.00" },
    { label: "Cumulative Points", value: "0.00" },
    { label: "REWARD POINTS FROM HONOR POINTS", value: "0.00" },
  ];

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
              href="#"
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm font-medium transition-all duration-200"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Points Container
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
              
              {/* Visual chart mock */}
              <div className="flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Second Year Course Points Graph
                </span>
                
                {/* Bar chart representation */}
                <div className="h-48 flex items-end gap-6 border-b border-l border-slate-100 dark:border-slate-800 p-4 mt-4 relative">
                  
                  {/* Left scale indicators */}
                  <div className="absolute left-2 top-2 text-[10px] text-slate-400">500</div>
                  <div className="absolute left-2 top-16 text-[10px] text-slate-400">300</div>
                  <div className="absolute left-2 top-32 text-[10px] text-slate-400">100</div>

                  {/* Bar 1 */}
                  <div className="flex-1 flex flex-col items-center gap-2 z-10">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-350">245.12</span>
                    <div className="w-12 bg-amber-400 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: "98px" }}></div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-1">Average Points</span>
                  </div>

                  {/* Bar 2 */}
                  <div className="flex-1 flex flex-col items-center gap-2 z-10">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">435.34</span>
                    <div className="w-12 bg-indigo-500 dark:bg-indigo-600 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: "174px" }}></div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-1">Overall Points</span>
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
                    Points Details
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span>Average Reward Points:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">2567</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span>Total Reward Points Earned:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">1500</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                      Need Improvement
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold shadow-sm cursor-default"
                  >
                    Position #145/240
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Card: Points Summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
              <div className="flex items-center gap-2 mb-6">
                <svg className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Points Summary
                </h3>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Total Points */}
                <div className="bg-indigo-600 dark:bg-indigo-700 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Total Points</span>
                  <span className="text-base font-extrabold mt-3">RP 2238</span>
                </div>

                {/* Balance Points */}
                <div className="bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Balance Points</span>
                  <span className="text-base font-extrabold mt-3">RP 1274</span>
                </div>

                {/* Redeemed Points */}
                <div className="bg-amber-500 dark:bg-amber-600 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Redeemed Points</span>
                  <span className="text-base font-extrabold mt-3">RP 1903</span>
                </div>

                {/* Penalties Points */}
                <div className="bg-rose-500 dark:bg-rose-600 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Penalties Points</span>
                  <span className="text-base font-extrabold mt-3">RP 00</span>
                </div>
              </div>

              {/* Semester Carry Forwards Notes */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 rounded-xl p-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="max-w-[190px]">Eligible carry in points from previous semester (2023 - ODD)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold ml-2">RP 1000</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 rounded-xl p-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="max-w-[190px]">Eligible carry forward points to next semester (2023 - EVEN)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold ml-2">RP 1000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Split Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-indigo-650" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  Detailed Points Split up
                </h3>
                <span className="text-[10px] text-slate-400 mt-1 block">2023-2024 Even Semester</span>
              </div>
            </div>

            {/* Tab */}
            <div className="mb-4">
              <span className="inline-flex px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950 text-xs font-semibold rounded-lg">
                Course Points Details
              </span>
            </div>

            {/* Split up List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-y-auto max-h-[360px] pr-2">
              {pointsSplitUp.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-500 dark:text-slate-450">{item.label}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
