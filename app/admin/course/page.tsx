"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import { INITIAL_COURSES, Course } from "../../faculty/data/mockCourses";

export default function AdminCourseListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get("tab") || "all";

  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [activeTab, setActiveTab] = useState<string>(initialTabParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl.toLowerCase());
    }
  }, [searchParams]);

  // Helper for calendar date badge
  const getCalendarDate = (dateStr: string) => {
    if (!dateStr) return { month: "AUG", day: "28" };
    try {
      const datePart = dateStr.split(" ")[0];
      const parts = datePart.split("-");
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const month = months[monthIdx] || "AUG";
      const day = parts[2] || "28";
      return { month, day };
    } catch {
      return { month: "AUG", day: "28" };
    }
  };

  // Helper for status badge color
  const getStatusBadgeStyle = (statusText: string) => {
    if (statusText.includes("Opened") || statusText.includes("Attendance")) {
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
    }
    if (statusText.includes("Completed")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
    }
    return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
  };

  // Tab count metrics
  const countAll = courses.length;
  const countActive = courses.filter((c) => c.statusText.includes("Opened") || c.statusText.includes("Attendance")).length;
  const countCompleted = courses.filter((c) => c.statusText.includes("Completed")).length;
  const countPending = courses.filter((c) => c.statusText.includes("Pending")).length;

  // Filter Logic
  const filteredCourses = courses.filter((course) => {
    // 1. Tab Filter
    let matchesTab = true;
    if (activeTab === "active") {
      matchesTab = course.statusText.includes("Opened") || course.statusText.includes("Attendance");
    } else if (activeTab === "completed") {
      matchesTab = course.statusText.includes("Completed");
    } else if (activeTab === "pending") {
      matchesTab = course.statusText.includes("Pending");
    }

    // 2. Search Query
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      course.name.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query) ||
      course.department.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query);

    // 3. Mode Filter
    const matchesMode =
      selectedMode === "all" || course.mode.toLowerCase() === selectedMode.toLowerCase();

    // 4. Category Filter
    const matchesCategory =
      selectedCategory === "all" || course.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesTab && matchesSearch && matchesMode && matchesCategory;
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/admin/course?tab=${tabId}`, { scroll: false });
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED ADMIN SIDEBAR */}
      <AdminSidebar activeTab="/admin/course" />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              Course Management
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
                {courses.length} Total
              </span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Filter courses by status tabs, review faculty assignments, and access full course details.
            </p>
          </div>
        </div>

        {/* TAB FILTER CONTROL BAR (Active, Completed, Pending, All) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Courses", count: countAll, badgeClass: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" },
            { id: "active", label: "Active", count: countActive, badgeClass: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" },
            { id: "completed", label: "Completed", count: countCompleted, badgeClass: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300" },
            { id: "pending", label: "Pending", count: countPending, badgeClass: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  isActive
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md scale-[1.01]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                      : tab.badgeClass
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH AND ADVANCED FILTERS BAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input Box */}
            <div className="relative w-full md:flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by course title, code (e.g. VAC-AI-101), faculty instructor, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results count badge */}
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium self-end md:self-auto">
              Showing <span className="font-bold text-slate-900 dark:text-white">{filteredCourses.length}</span> of {courses.length} courses
            </div>
          </div>

          {/* Mode & Category Filter Selector Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-400">Mode:</span>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="all">All Modes</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-400">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Embedded Systems">Embedded Systems</option>
                  <option value="Design & Media">Design & Media</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                </select>
              </div>
            </div>

            {(searchQuery || selectedMode !== "all" || selectedCategory !== "all" || activeTab !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedMode("all");
                  setSelectedCategory("all");
                  handleTabChange("all");
                }}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* COURSES CARDS GRID */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-slate-800 dark:text-slate-200 font-bold text-base">No courses found matching criteria.</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Try switching tabs (Active, Completed, Pending) or clear filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedMode("all");
                setSelectedCategory("all");
                handleTabChange("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 transition"
            >
              Show All Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const calDate = getCalendarDate(course.startDate);

              return (
                <div
                  key={course.id}
                  onClick={() => router.push(`/admin/course/${course.id}`)}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Image Header with Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={course.imageUrl}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Left: Course Type Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                        {course.type}
                      </span>
                    </div>

                    {/* Top Right: Tear-off Date Leaf Badge */}
                    <div className="absolute top-3 right-3 z-10 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 text-center w-12 flex flex-col items-center">
                      <div className="bg-rose-600 text-[9px] font-bold tracking-wider uppercase text-white w-full py-0.5">
                        {calDate.month}
                      </div>
                      <div className="text-slate-900 dark:text-white font-extrabold text-sm py-1 leading-snug">
                        {calDate.day}
                      </div>
                    </div>

                    {/* Bottom Mode Tag */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900/80 text-white backdrop-blur-sm">
                        {course.mode} • {course.credits} Credits
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {course.code}
                        </span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                          {course.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {course.name}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {course.details}
                      </p>
                    </div>

                    {/* FACULTY / INSTRUCTOR INFO BOX */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                        {course.instructor.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {course.instructor}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {course.department}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Status Badge & Open Details Link */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${getStatusBadgeStyle(course.statusText)}`}>
                        {course.statusText}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
