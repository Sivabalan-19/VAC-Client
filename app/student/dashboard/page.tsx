"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboardPage() {
  const router = useRouter();

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Dynamic state for registered courses & faculty
  const [currentCoursesCount, setCurrentCoursesCount] = useState(4);
  const [currentFaculty, setCurrentFaculty] = useState({
    name: "Dr. R. Arunkumar",
    id: "CS1121",
    department: "Computer Science & Engineering",
    course: "Course on Next.js 15 & AI Integration",
    email: "arunkumar.cse@university.edu",
  });

  // Attendance metrics
  const totalDays = 90;
  const attendedDays = 81;
  const absentDays = totalDays - attendedDays;
  const attendancePercentage = ((attendedDays / totalDays) * 100).toFixed(1);

  // Initialize Theme & load courses
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme ? JSON.parse(savedTheme) : false;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Load dynamic registered courses if available
    const loaded = localStorage.getItem("registered_courses");
    if (loaded) {
      try {
        const parsed = JSON.parse(loaded);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCurrentCoursesCount(parsed.length);
          if (parsed[0].organizer) {
            setCurrentFaculty((prev) => ({
              ...prev,
              course: parsed[0].name || prev.course,
              id: parsed[0].organizer || prev.id,
            }));
          }
        }
      } catch (e) {
        console.error("Failed to parse registered courses", e);
      }
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
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. SIDEBAR (Unchanged) */}
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
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Student Dashboard
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              Academic Term 2023–2024 (Even Semester)
            </div>
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

        {/* Dashboard Content Container */}
        <div className="space-y-6 max-w-6xl">
          
          {/* 1. ATTENDANCE VS TOTAL DAYS CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Left Column: Visual Bar Chart & Trend */}
              <div className="flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Attendance vs Total Days
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Semester Attendance (Target ≥ 75%)
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-2.5 py-1 rounded-md">
                    {attendancePercentage}% Overall
                  </span>
                </div>
                
                {/* Bar chart representation with reduced width */}
                <div className="h-48 max-w-[280px] mx-auto w-full flex items-end justify-center gap-10 border-b border-l border-slate-100 dark:border-slate-800 p-4 mt-3 relative">
                  
                  {/* Left scale indicators */}
                  <div className="absolute left-2 top-2 text-[10px] text-slate-400">100%</div>
                  <div className="absolute left-2 top-14 text-[10px] text-slate-400">75%</div>
                  <div className="absolute left-2 top-26 text-[10px] text-slate-400">50%</div>
                  <div className="absolute left-2 top-38 text-[10px] text-slate-400">25%</div>

                  {/* Bar 1: Total Working Days */}
                  <div className="flex flex-col items-center gap-2 z-10 w-20">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-350">
                      {totalDays} Days
                    </span>
                    <div
                      className="w-12 bg-slate-300 dark:bg-slate-700 rounded-t-lg transition-all duration-500 hover:opacity-90"
                      style={{ height: "140px" }}
                    ></div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-1 text-center">
                      Total Days
                    </span>
                  </div>

                  {/* Bar 2: Days Attended / Attendance Percentage */}
                  <div className="flex flex-col items-center gap-2 z-10 w-20">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {attendancePercentage}%
                    </span>
                    <div
                      className="w-12 bg-gradient-to-t from-indigo-600 to-indigo-500 dark:from-indigo-700 dark:to-indigo-500 rounded-t-lg transition-all duration-500 hover:opacity-90 shadow-sm"
                      style={{ height: `${(attendedDays / totalDays) * 140}px` }}
                    ></div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-1 text-center">
                      Attended ({attendedDays}d)
                    </span>
                  </div>
                </div>

                {/* Sub-metrics inside left area: Theory vs Lab */}
                <div className="grid grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
                  <div className="bg-slate-50 dark:bg-slate-950/40 rounded-lg p-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Theory Classes</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">92.0% (46/50)</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/40 rounded-lg p-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lab / Practical</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">87.5% (35/40)</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/40 rounded-lg p-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Leaves Left</span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">13 Days Safe</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Quick Attendance Statistics & Details */}
              <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-6">
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/20 text-center space-y-3.5">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Attendance Breakdown
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 pb-1.5 border-b border-slate-100 dark:border-slate-850">
                      <span>Total Semester Days:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{totalDays} Days</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 pb-1.5 border-b border-slate-100 dark:border-slate-850">
                      <span>Days Present:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{attendedDays} Days</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 pb-1.5 border-b border-slate-100 dark:border-slate-850">
                      <span>Unexcused Absent:</span>
                      <span className="font-bold text-rose-500">{absentDays - 3} Days</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 pb-1.5 border-b border-slate-100 dark:border-slate-850">
                      <span>OD / Medical Approved:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">3 Days</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span>Attendance Buffer:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">+15.0% above 75%</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Eligible for Semester Exams
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold shadow-sm cursor-default"
                  >
                    Attendance Status: {attendancePercentage}% (Safe Zone)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CREDITS & COURSE SUMMARY CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Credits & Course Summary
                </h3>
              </div>

              <button
                type="button"
                onClick={() => router.push("/student/my-course")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                View All Enrolled Courses →
              </button>
            </div>

            {/* 4 Cards Grid: Total Credits, Redeemed Credits, Available Credits, Current Courses */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Total Credits */}
              <div className="bg-indigo-600 dark:bg-indigo-700 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Total Credits</span>
                <span className="text-base font-extrabold mt-3">24.0 Credits</span>
              </div>

              {/* Redeemed Credits */}
              <div className="bg-amber-500 dark:bg-amber-600 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Redeemed Credits</span>
                <span className="text-base font-extrabold mt-3">18.0 Credits</span>
              </div>

              {/* Available / Balance Credits */}
              <div className="bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Available Credits</span>
                <span className="text-base font-extrabold mt-3">6.0 Credits</span>
              </div>

              {/* Current Courses */}
              <div className="bg-purple-600 dark:bg-purple-700 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Current Courses</span>
                <span className="text-base font-extrabold mt-3">{currentCoursesCount} Enrolled</span>
              </div>
            </div>

            {/* Sub-Row: Detailed Points Distribution & Enrolled Courses Quick Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Honour Credits</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">16.0 Earned</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                  Target: 20.0
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Reward Credits</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">8.0 Earned</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                  Activities / Labs
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Standing</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">Gold Standing</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  Top 10%
                </span>
              </div>
            </div>

            {/* Enrolled Courses Quick Badges Row */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Enrolled Course Progress
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">Next.js 15 & AI</span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">80% Done</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">Cybersecurity</span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">65% Done</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">UI/UX Design</span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">90% Done</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">Generative AI</span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">45% Done</span>
                </div>
              </div>
            </div>

            {/* Current Faculty In-Charge Detailed Banner */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
              <div className="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                
                {/* 1. Faculty Details (Left) */}
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm shrink-0">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Current Faculty In-Charge
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        • {currentFaculty.id}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {currentFaculty.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {currentFaculty.department}
                    </p>
                  </div>
                </div>

                {/* 2. Office & Availability (Center - filling the empty space) */}
                <div className="border-t md:border-t-0 md:border-l md:border-r border-slate-200 dark:border-slate-800 pt-3 md:pt-0 md:px-4 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] uppercase font-semibold">Faculty Office:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Room 304, CS Block</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] uppercase font-semibold">Consultation Hours:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">03:00 PM – 05:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] uppercase font-semibold">Status:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Available
                    </span>
                  </div>
                </div>

                {/* 3. Active Course & Contact (Right) */}
                <div className="text-left md:text-right border-t md:border-t-0 border-slate-200 dark:border-slate-800 pt-3 md:pt-0">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Active Course</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[240px] truncate block">
                    {currentFaculty.course}
                  </span>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium block mt-0.5">
                    {currentFaculty.email}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                    Next Session: Thu, 10:00 AM @ Lab 3
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}


