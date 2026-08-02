"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CourseItem {
  sno: string;
  date: string;
  name: string;
  type: string;
  category: string;
  points: number;
  organizer: string;
  status: string;
  details?: string;
}

export default function StudentMyCoursePage() {
  const router = useRouter();

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByCategory, setSortByCategory] = useState("all");

  // Selected Course details modal state
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  // Registered Courses State (loaded from localStorage)
  const [registeredCourses, setRegisteredCourses] = useState<CourseItem[]>([]);

  // Pagination State
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Load registered courses from localStorage
  useEffect(() => {
    const loaded = localStorage.getItem("registered_courses");
    if (loaded) {
      try {
        setRegisteredCourses(JSON.parse(loaded));
      } catch (e) {
        console.error("Failed to parse registered courses", e);
      }
    }
  }, []);

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

  // Cancel Registration
  const handleCancelRegistration = (sno: string) => {
    if (confirm("Are you sure you want to cancel your registration for this course?")) {
      const updated = registeredCourses.filter((c) => c.sno !== sno);
      setRegisteredCourses(updated);
      localStorage.setItem("registered_courses", JSON.stringify(updated));
    }
  };

  // Filter and Sort Logic
  const filteredCourses = registeredCourses
    .filter((course) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        course.name.toLowerCase().includes(query) ||
        course.organizer.toLowerCase().includes(query) ||
        course.type.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortByCategory === "honour") {
        if (a.category === "Honour Points" && b.category !== "Honour Points") return -1;
        if (a.category !== "Honour Points" && b.category === "Honour Points") return 1;
      } else if (sortByCategory === "reward") {
        if (a.category === "Reward Points" && b.category !== "Reward Points") return -1;
        if (a.category !== "Reward Points" && b.category === "Reward Points") return 1;
      }
      return 0;
    });

  // Pagination calculations
  const totalRows = filteredCourses.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortByCategory, rowsPerPage]);

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
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm font-medium transition-all duration-200 cursor-pointer"
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

            {/* Course Register menu (Active) */}
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
                  className="flex items-center gap-3 py-2 px-3 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 text-sm font-semibold transition-all duration-200 cursor-pointer"
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
      <main className="flex-1 p-6 md:p-8 transition-colors duration-300">
        {/* Header Bar */}
        <header className="flex justify-between items-center w-full mb-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
            <span>Course Registration</span>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">My Courses</span>
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

        {/* 3. MAIN TABLE CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
          {/* Filters Bar */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              My Courses
            </h2>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-52 md:w-60 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-8 pr-4 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Category Filter */}
              <select
                value={sortByCategory}
                onChange={(e) => setSortByCategory(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                <option value="honour">Honour Points</option>
                <option value="reward">Reward Points</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-3 px-5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">S.No</th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Date</th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Course Name</th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Type</th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Category</th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase text-right">Points</th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Organizer</th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Status</th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {paginatedCourses.length > 0 ? (
                  paginatedCourses.map((row) => (
                    <tr
                      key={row.sno}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-850/20 transition-colors"
                    >
                      <td className="py-4 px-5 text-xs font-medium text-slate-400 dark:text-slate-500">{row.sno}</td>
                      <td className="py-4 px-5 text-xs font-medium text-slate-600 dark:text-slate-400">{row.date}</td>
                      <td className="py-4 px-5 text-sm font-semibold text-slate-900 dark:text-white max-w-[240px] truncate">
                        {row.name}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-500 dark:text-slate-400">{row.type}</td>
                      <td className="py-4 px-5 text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          row.category === "Honour Points"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                        }`}>
                          {row.category}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-xs font-bold text-slate-900 dark:text-white text-right">
                        {row.points.toFixed(1)}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-500 dark:text-slate-400">{row.organizer}</td>
                      <td className="py-4 px-5 text-xs">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          {row.status || "Registered"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCourse(row)}
                            className="h-7 px-3 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer select-none"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelRegistration(row.sno)}
                            className="h-7 px-3 rounded-md border border-rose-100 hover:bg-rose-50 text-rose-600 dark:border-rose-950/30 dark:hover:bg-rose-950/20 text-xs font-medium transition-colors cursor-pointer select-none"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-24">
                      {/* Empty State matching screenshot "No Data Found" */}
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                        {/* Beautiful Padlock + Clock SVG icon */}
                        <div className="relative mb-3 text-slate-300 dark:text-slate-800">
                          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                            {/* Lock body */}
                            <rect x="5" y="10" width="14" height="11" rx="2" strokeWidth="1.5" />
                            {/* Shackle */}
                            <path d="M8 10V7a4 4 0 118 0v3" strokeWidth="1.5" strokeLinecap="round" />
                            {/* Keyhole */}
                            <circle cx="12" cy="14" r="1" fill="currentColor" />
                            <path d="M12 15v2" strokeLinecap="round" />
                          </svg>
                          {/* Small Clock Overlay */}
                          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
                            <svg className="h-4.5 w-4.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="9" />
                              <path d="M12 8v4l2.5 1.5" strokeLinecap="round" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          No Data Found
                        </span>
                        <p className="text-xs text-slate-400/80 dark:text-slate-650 mt-1 max-w-[280px] text-center leading-relaxed">
                          You haven't registered for any courses yet. Go to the Course Master tab to register.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Rows per page</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 text-xs text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="h-7.5 w-7.5 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                  aria-label="Previous Page"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="h-7.5 w-7.5 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                  aria-label="Next Page"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. DIALOG MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-[500px] shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  {selectedCourse.category} • {selectedCourse.type}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedCourse.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold p-1.5 transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-3">
                  <span className="block text-[10px] font-semibold text-slate-450 uppercase">Date</span>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedCourse.date}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-3">
                  <span className="block text-[10px] font-semibold text-slate-450 uppercase">Credits</span>
                  <span className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {selectedCourse.points.toFixed(1)} Points
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-3">
                  <span className="block text-[10px] font-semibold text-slate-450 uppercase">Organizer</span>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedCourse.organizer}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-3">
                  <span className="block text-[10px] font-semibold text-slate-450 uppercase">Status</span>
                  <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {selectedCourse.status || "Registered"}
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-semibold text-slate-450 uppercase mb-1">Description</span>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedCourse.details}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/20">
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="h-9 px-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
