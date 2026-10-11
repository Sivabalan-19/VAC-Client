"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import FacultySidebar from "../components/FacultySidebar";
import { fetchFacultyEvents, type FacultyCourse } from "../api";

export default function FacultyMyEventPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<FacultyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchFacultyEvents({
        search: searchQuery || undefined,
      });
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load events.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Filter Logic
  const filteredCourses = courses.filter((course) => {
    const matchesType =
      selectedType === "all" ||
      course.type?.toLowerCase().includes(selectedType.toLowerCase());
    return matchesType;
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED SIDEBAR */}
      <FacultySidebar activeTab="/faculty/events" />

      {/* 2. MAIN CONTENT FLEX WRAPPER */}
      <div className="flex pt-16 w-full min-h-screen">
        {/* Sidebar Desktop Spacer */}
        <div className="hidden lg:block w-64 shrink-0" />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 min-w-0 space-y-6">
          {/* HEADER WITH CREATE COURSE BUTTON AT TOP RIGHT */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Events
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select any event card to open course details and manage live event student attendance.
              </p>
            </div>

            {/* CREATE COURSE BUTTON - TOP RIGHT OF COURSE PAGE */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/faculty/create")}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                + Create Course
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* SEARCH & CATEGORY FILTER BAR */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
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
                placeholder="Search event name or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {["all", "Webinar", "Guest Lecturer", "Seminar", "Clubs & Societies"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition capitalize cursor-pointer ${
                    selectedType === type
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* COURSES CARDS GRID */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading events from server...</div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-slate-800 dark:text-slate-200 font-bold text-base">No events found matching criteria.</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Try adjusting search filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => router.push(`/faculty/course/${course.id}`)}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={course.imageUrl || "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop"}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 shadow-sm">
                        {course.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                          {course.code}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                          {course.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.name}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {course.details || "No course description."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {course.statusText}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                        Manage Attendance →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
