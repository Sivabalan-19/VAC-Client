"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import FacultySidebar from "../components/FacultySidebar";
import { useStore } from "../../context/StoreContext";
import { fetchFacultyCourses, type FacultyCourse } from "../api";

export default function FacultyCourseListPage() {
  const router = useRouter();
  const { darkMode } = useStore();
  const [courses, setCourses] = useState<FacultyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [onlyActiveEvents, setOnlyActiveEvents] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchFacultyCourses({
        search: searchQuery || undefined,
        mode: selectedMode,
        category: selectedCategory,
      });
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedMode, selectedCategory]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Helper for calendar date badge
  const getCalendarDate = (dateStr?: string | null) => {
    if (!dateStr) return { month: "AUG", day: "28" };
    try {
      const datePart = dateStr.split("T")[0] || dateStr.split(" ")[0];
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
  const getStatusBadgeStyle = (statusText?: string) => {
    if (!statusText || statusText.includes("Pending")) {
      return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
    }
    if (statusText.includes("Opened") || statusText.includes("Attendance") || statusText.includes("Approved") || statusText.includes("Registration")) {
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
    }
    if (statusText.includes("Completed")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
    }
    if (statusText.includes("Reject")) {
      return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800";
    }
    return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
  };

  // Client-side additional filtering
  const filteredCourses = courses.filter((course) => {
    const matchesType =
      selectedType === "all" ||
      course.type?.toLowerCase().includes(selectedType.toLowerCase());

    const matchesActive = !onlyActiveEvents || course.statusText?.includes("Attendance") || course.statusText?.includes("Opened");

    return matchesType && matchesActive;
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED SIDEBAR */}
      <FacultySidebar activeTab="/faculty/course" />

      {/* 2. MAIN CONTENT FLEX WRAPPER */}
      <div className="flex pt-16 w-full min-h-screen">
        {/* Sidebar Desktop Spacer */}
        <div className="hidden lg:block w-64 shrink-0" />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 min-w-0 space-y-6">
          {/* HEADER WITH CREATE COURSE BUTTON AT TOP RIGHT */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                My Courses
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800">
                  {courses.length} Available
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage your Value Added Courses, view registered students, and record live event attendance.
              </p>
            </div>

            {/* CREATE COURSE BUTTON - TOP RIGHT OF COURSE PAGE */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/faculty/create")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create Course
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
                  placeholder="Search course title, code (e.g. VAC-AI-101), instructor, department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing <span className="font-bold text-blue-600 dark:text-blue-400">{filteredCourses.length}</span> of {courses.length} courses
              </div>
            </div>

            {/* Filter Pill Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                >
                  <option value="all">All Modes</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Embedded Systems">Embedded Systems</option>
                  <option value="Design & Media">Design & Media</option>
                </select>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={onlyActiveEvents}
                    onChange={(e) => setOnlyActiveEvents(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  Only Active Events
                </label>
              </div>

              {(searchQuery || selectedMode !== "all" || selectedCategory !== "all" || selectedType !== "all" || onlyActiveEvents) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedMode("all");
                    setSelectedCategory("all");
                    setOnlyActiveEvents(false);
                  }}
                  className="text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* COURSES CARDS GRID */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading courses from server...</div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-slate-800 dark:text-slate-200 font-bold text-base">No courses found matching criteria.</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Try adjusting your search terms or filter selections.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSelectedMode("all");
                  setSelectedCategory("all");
                  setOnlyActiveEvents(false);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const calDate = getCalendarDate(course.startDate);

                return (
                  <div
                    key={course.id}
                    onClick={() => router.push(`/faculty/course/${course.id}`)}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    {/* Thumbnail Image Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={course.imageUrl || "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop"}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top Left: Course Type Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                          {course.type}
                        </span>
                      </div>

                      {/* Top Right: Desk Calendar Tear-Off Leaf Badge */}
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
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {course.code}
                          </span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                            {course.category}
                          </span>
                        </div>

                        {course.location && (
                          <div className="mb-2 flex items-center gap-1.5 text-xs">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              <span className="text-rose-500">📍</span> {course.location}
                            </span>
                          </div>
                        )}

                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course.name}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                          {course.details || "No description provided."}
                        </p>
                      </div>

                      {/* Tightened Card Footer */}
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${getStatusBadgeStyle(course.statusText)}`}>
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${!course.statusText?.includes("Pending") && (course.statusText?.includes("Opened") || course.statusText?.includes("Attendance") || course.statusText?.includes("Approved") || course.statusText?.includes("Registration")) ? "bg-emerald-500" : course.statusText?.includes("Completed") ? "bg-blue-500" : course.statusText?.includes("Reject") ? "bg-rose-500" : "bg-amber-500"}`} />
                          {course.statusText}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
    </div>
  );
}
