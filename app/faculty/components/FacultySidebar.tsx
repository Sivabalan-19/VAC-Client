"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface FacultySidebarProps {
  activeTab?: string;
}

export default function FacultySidebar({ activeTab }: FacultySidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Determine current active item from route if activeTab not explicitly set
  const currentPath = activeTab || pathname;
  const isDashboard = currentPath.includes("/faculty/dashboard") || currentPath === "/faculty";
  const isMyCourse = currentPath === "/faculty/course" || currentPath === "/faculty/my-event" || currentPath.includes("/faculty/course/");
  const isCreateCourse = currentPath.includes("/faculty/create");

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            VAC
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">
            FACULTY <span className="text-indigo-600 dark:text-indigo-400">PORTAL</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Desktop Sidebar & Mobile Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-10 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-500/20">
                VAC
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  VAC <span className="text-indigo-600 dark:text-indigo-400 font-light italic">Platform</span>
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Faculty Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {/* Dashboard Link */}
            <button
              onClick={() => {
                router.push("/faculty/dashboard");
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${
                isDashboard
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 shadow-sm border border-indigo-100 dark:border-indigo-900/50"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>

            {/* My Course Link */}
            <button
              onClick={() => {
                router.push("/faculty/course");
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${
                isMyCourse
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 shadow-sm border border-indigo-100 dark:border-indigo-900/50"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              My Course
            </button>

            {/* Create Course Link */}
            <button
              onClick={() => {
                router.push("/faculty/create");
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${
                isCreateCourse
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 shadow-sm border border-indigo-100 dark:border-indigo-900/50"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Create Course
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          {/* User Profile Summary */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-sm">
              FC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Dr. Sarah Connor</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">sarah.c@univ.edu</p>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-xs font-medium"
          >
            <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-semibold">Toggle</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-all duration-200 text-left"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
