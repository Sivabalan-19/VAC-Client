"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "../../context/StoreContext";

interface AdminSidebarProps {
  activeTab?: string;
}

export default function AdminSidebar({ activeTab }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, darkMode, toggleDarkMode, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPath = activeTab || pathname;
  const isDashboard = currentPath.includes("/admin/dashboard") || currentPath === "/admin";
  const isCoursePage = currentPath.includes("/admin/course");

  const userInitials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  return (
    <>
      {/* 1. TOP NAVBAR HEADER (Full width across top matching screenshot) */}
      <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[#f8fafc] dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between transition-colors">
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition"
            aria-label="Toggle drawer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo Badge Icon + Text */}
          <div
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              &lt;/&gt;
            </div>
            <span className="font-heading font-extrabold text-lg text-blue-600 dark:text-blue-400 tracking-tight">
              VAC <span className="text-slate-800 dark:text-white font-bold">Portal</span>
            </span>
          </div>
        </div>

        {/* Right: Theme Toggle & Profile Avatar Pill */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-2xs cursor-pointer transition"
            title="Toggle theme"
          >
            {darkMode ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 18.36l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="h-4 w-4 fill-current text-slate-700" viewBox="0 0 24 24">
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          {/* Avatar Circle */}
          <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-heading font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer select-none">
            {userInitials}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* 2. LEFT SIDEBAR RAIL (Below top navbar header matching screenshot design) */}
      <aside
        className={`fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-[#f8fafc] dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-4 pt-2">
          {/* Navigation Items List */}
          <nav className="space-y-1">
            {/* Dashboard Link */}
            <button
              onClick={() => {
                router.push("/admin/dashboard");
                setMobileOpen(false);
              }}
              className={`w-full relative flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-heading font-semibold transition-all duration-200 text-left ${
                isDashboard
                  ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-2xs font-bold after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-blue-600 after:rounded-l-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-900/50"
              }`}
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </button>

            {/* Courses Management Link */}
            <button
              onClick={() => {
                router.push("/admin/course");
                setMobileOpen(false);
              }}
              className={`w-full relative flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-heading font-semibold transition-all duration-200 text-left ${
                isCoursePage
                  ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-2xs font-bold after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-blue-600 after:rounded-l-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-900/50"
              }`}
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Manage Courses
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Sign Out */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => {
              logout();
            }}
            className="w-full flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-heading font-bold transition-all duration-200 text-left cursor-pointer"
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
