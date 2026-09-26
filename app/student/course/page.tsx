"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../context/StoreContext";
import StudentSidebar from "../components/StudentSidebar";

interface CourseItem {
  sno: string;
  date: string;
  name: string;
  type: string;
  mode: "Online" | "Offline";
  credit: number;
  organizer: string;
  available: number;
  details?: string;
}

export default function StudentCoursePage() {
  const router = useRouter();
  const { darkMode } = useStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByMode, setSortByMode] = useState("all");

  // Selected Course details modal state
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  // Pagination State
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock Course Data (clean & simplified)
  const [courses] = useState<CourseItem[]>([
    {
      sno: "01",
      date: "03/02/2024",
      name: "Course on Next.js 15 & AI Integration",
      type: "Technical Skills",
      mode: "Online",
      credit: 4,
      organizer: "abcd/CS1121",
      available: 10,
      details: "Hands-on experience with modern Next.js features, Server Actions, React Server Components (RSCs), and integrating Gemini models inside your applications.",
    },
    {
      sno: "02",
      date: "03/02/2024",
      name: "Cybersecurity Bootcamp Course: Defensive Practices",
      type: "Technical Skills",
      mode: "Offline",
      credit: 4,
      organizer: "abcd/CS1121",
      available: 40,
      details: "Learn the fundamentals of penetration testing, incident response, network monitoring, and system hardening techniques.",
    },
    {
      sno: "03",
      date: "03/02/2024",
      name: "UI/UX Design Course: Glassmorphism & Figma",
      type: "Technical Skills",
      mode: "Online",
      credit: 4,
      organizer: "abcd/CS1121",
      available: 10,
      details: "A comprehensive deep dive into design systems, grid layouts, auto layout v5 in Figma, accessibility testing, and crafting fluid premium pages.",
    },
    {
      sno: "04",
      date: "03/02/2024",
      name: "Generative AI Course: Hackathon and Pitching",
      type: "Technical Skills",
      mode: "Offline",
      credit: 4,
      organizer: "abcd/CS1121",
      available: 10,
      details: "Bring your AI-centric ideas to life! Pitch to domain experts, receive mentoring on scaling ML models, and complete the VAC course.",
    },
    {
      sno: "05",
      date: "05/02/2024",
      name: "Advanced Data Structures & Algorithms Course",
      type: "Technical Skills",
      mode: "Online",
      credit: 4,
      organizer: "abcd/CS1122",
      available: 15,
      details: "Solve complex tree, graph, dynamic programming, and greedy algorithm problems. Ideal for coding interview preparation.",
    },
    {
      sno: "06",
      date: "07/02/2024",
      name: "Full Stack Web Development with Go & React",
      type: "Technical Skills",
      mode: "Offline",
      credit: 4,
      organizer: "abcd/CS1123",
      available: 30,
      details: "Build a highly scalable backend microservice using Golang and hook it up with a responsive React frontend client using Tailwind CSS.",
    },
  ]);

  // Initialize Theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleRegisterCourse = (course: CourseItem) => {
    const existing = localStorage.getItem("registered_courses");
    const list = existing ? JSON.parse(existing) : [];

    if (list.some((item: any) => item.sno === course.sno)) {
      alert(`You are already registered for: ${course.name}`);
      return;
    }

    const newList = [...list, { ...course, status: "Registered" }];
    localStorage.setItem("registered_courses", JSON.stringify(newList));
    alert(`Successfully registered for Course: ${course.name}`);
    setSelectedCourse(null);
  };

  // Filter and Sort Logic
  const filteredCourses = courses
    .filter((course) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        course.name.toLowerCase().includes(query) ||
        course.organizer.toLowerCase().includes(query) ||
        course.type.toLowerCase().includes(query) ||
        course.mode.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortByMode === "online") {
        if (a.mode === "Online" && b.mode !== "Online") return -1;
        if (a.mode !== "Online" && b.mode === "Online") return 1;
      } else if (sortByMode === "offline") {
        if (a.mode === "Offline" && b.mode !== "Offline") return -1;
        if (a.mode !== "Offline" && b.mode === "Offline") return 1;
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
  }, [searchQuery, sortByMode, rowsPerPage]);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">
      <StudentSidebar activeTab="/student/course" />

      {/* MAIN CONTENT FLEX WRAPPER */}
      <div className="flex pt-16 w-full min-h-screen">
        {/* Sidebar Desktop Spacer */}
        <div className="hidden lg:block w-64 shrink-0" />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 min-w-0 space-y-6">
          {/* Header Bar */}
          <header className="flex justify-between items-center w-full mb-2">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
              <span>Course Registration</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Courses Master</span>
            </div>
          </header>

        {/* 3. MAIN TABLE CARD */}
        <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
          {/* Filters Bar */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Courses Master
            </h2>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-52 md:w-60 rounded-lg border border-indigo-100 dark:border-indigo-900/30 bg-slate-50 dark:bg-slate-950 pl-8 pr-4 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Mode Filter */}
              <select
                value={sortByMode}
                onChange={(e) => setSortByMode(e.target.value)}
                className="h-9 rounded-lg border border-indigo-100 dark:border-indigo-900/30 bg-slate-50 dark:bg-slate-950 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:border-indigo-500"
              >
                <option value="all">All Modes</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-900/20">
                  <th className="py-3 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">S.No</th>
                  <th className="py-3 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">Date</th>
                  <th className="py-3 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">Course Name</th>
                  <th className="py-3 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">Type</th>
                  <th className="py-3 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">Mode</th>
                  <th className="py-3 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide text-right">Credit</th>
                  <th className="py-3 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">Organizer</th>
                  <th className="py-3 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">Seats</th>
                  <th className="py-3 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {paginatedCourses.length > 0 ? (
                  paginatedCourses.map((row) => (
                    <tr
                      key={row.sno}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-850/20 transition-colors"
                    >
                      <td className="py-4 px-5 text-[13px] font-semibold text-slate-700 dark:text-slate-300">{row.sno}</td>
                      <td className="py-4 px-5 text-[13px] font-semibold text-slate-700 dark:text-slate-300">{row.date}</td>
                      <td className="py-4 px-5 text-sm font-semibold text-slate-900 dark:text-white max-w-[240px] truncate">
                        {row.name}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-500 dark:text-slate-400">{row.type}</td>
                      <td className="py-4 px-5 text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${row.mode === "Online"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400 font-bold text-[13px] tracking-wide bg-transparent"
                          }`}>
                          {row.mode}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-xs font-bold text-slate-900 dark:text-white text-right">
                        {row.credit}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-500 dark:text-slate-400">{row.organizer}</td>
                      <td className="py-4 px-5 text-xs">
                        <span className={`font-semibold ${row.available <= 10 ? "text-amber-600 dark:text-amber-400" : "text-slate-600 dark:text-slate-400"}`}>
                          {row.available} left
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedCourse(row)}
                          className="h-7 px-3.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer select-none"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-xs font-medium text-slate-400 dark:text-slate-600">
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-900/20">
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Rows per page</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="h-8 rounded-lg border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-slate-950 px-2 text-xs text-slate-700 dark:text-slate-300 outline-none"
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
                  className="h-7.5 w-7.5 flex items-center justify-center rounded-md border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
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
                  className="h-7.5 w-7.5 flex items-center justify-center rounded-md border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
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
      </div>
      {/* 4. DIALOG MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/30 w-full max-w-[500px] shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  {selectedCourse.mode} • {selectedCourse.type}
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
                    {selectedCourse.credit} Credit
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-3">
                  <span className="block text-[10px] font-semibold text-slate-450 uppercase">Organizer</span>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedCourse.organizer}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-3">
                  <span className="block text-[10px] font-semibold text-slate-450 uppercase">Available</span>
                  <span className={`block text-xs font-bold mt-0.5 ${selectedCourse.available <= 10 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                    {selectedCourse.available} Seats left
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-semibold text-slate-450 uppercase mb-1">Description</span>
                <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
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
              <button
                type="button"
                onClick={() => handleRegisterCourse(selectedCourse)}
                className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Register Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
