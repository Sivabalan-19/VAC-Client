"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import { useStore } from "../../context/StoreContext";
import {
  fetchAdminCourses,
  createAdminCourse,
  type AdminCourse,
  type AdminCourseInput,
} from "../api";

function AdminCourseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get("tab") || "all";

  const { darkMode } = useStore();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<string>(initialTabParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Create Course Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newCourse, setNewCourse] = useState<AdminCourseInput>({
    name: "",
    code: "",
    type: "Webinar",
    category: "Artificial Intelligence",
    mode: "Online",
    instructor: "Dr. Robert Vance",
    department: "Computer Science & Engineering",
    maxIntake: 60,
    credits: 2,
    details: "",
    imageUrl: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop",
    startDate: "2026-08-28T10:00:00Z",
    endDate: "2026-08-29T17:00:00Z",
    location: "Google Meet / Lab 304",
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl.toLowerCase());
    }
  }, [searchParams]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminCourses({
        status: activeTab === "all" ? undefined : activeTab,
        search: searchQuery || undefined,
        mode: selectedMode,
        category: selectedCategory,
      });
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, selectedMode, selectedCategory]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateLoading(true);
    try {
      await createAdminCourse(newCourse);
      setShowCreateModal(false);
      setNewCourse({
        name: "",
        code: "",
        type: "Webinar",
        category: "Artificial Intelligence",
        mode: "Online",
        instructor: "Dr. Robert Vance",
        department: "Computer Science & Engineering",
        maxIntake: 60,
        credits: 2,
        details: "",
        imageUrl: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop",
        startDate: "2026-08-28T10:00:00Z",
        endDate: "2026-08-29T17:00:00Z",
        location: "Google Meet / Lab 304",
      });
      await loadCourses();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Unable to create course.");
    } finally {
      setCreateLoading(false);
    }
  };

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
  const getStatusBadgeStyle = (statusText: string) => {
    if (statusText.includes("Opened") || statusText.includes("Attendance") || statusText.includes("Approved")) {
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60";
    }
    if (statusText.includes("Completed")) {
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60";
    }
    if (statusText.includes("Reject")) {
      return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60";
    }
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60";
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/admin/course?tab=${tabId}`, { scroll: false });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">
      {/* 1. UNIFIED ADMIN SIDEBAR & HEADER */}
      <AdminSidebar activeTab="/admin/course" />

      {/* 2. MAIN CONTENT FLEX WRAPPER */}
      <div className="flex pt-16 w-full min-h-screen">
        {/* Sidebar Desktop Spacer */}
        <div className="hidden lg:block w-64 shrink-0" />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 min-w-0 space-y-6">
          {/* HEADER SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                Course Management
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800">
                  {courses.length} Total
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Filter courses by status tabs, review faculty assignments, and manage approvals.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Course
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* TAB FILTER CONTROL BAR */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Courses" },
              { id: "active", label: "Active" },
              { id: "completed", label: "Completed" },
              { id: "pending", label: "Pending" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{tab.label}</span>
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                Showing <span className="font-bold text-blue-600 dark:text-blue-400">{courses.length}</span> courses
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
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>

          {/* COURSES CARDS GRID */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading courses from server...</div>
          ) : courses.length === 0 ? (
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
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                Show All Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
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
                        src={course.imageUrl || "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop"}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Left: Course Type Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                          {course.type}
                        </span>
                      </div>

                      {/* Top Right: Date Leaf Badge */}
                      <div className="absolute top-3 right-3 z-10 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 text-center w-12 flex flex-col items-center">
                        <div className="bg-blue-600 text-[9px] font-bold tracking-wider uppercase text-white w-full py-0.5">
                          {calDate.month}
                        </div>
                        <div className="text-slate-900 dark:text-white font-extrabold text-sm py-1 leading-snug">
                          {calDate.day}
                        </div>
                      </div>

                      {/* Bottom Mode Tag */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-950/80 text-white backdrop-blur-sm">
                          {course.mode} • {course.credits} Credits
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                            {course.code}
                          </span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                            {course.category}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course.name}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                          {course.details || "No course description provided."}
                        </p>
                      </div>

                      {/* FACULTY / INSTRUCTOR INFO BOX */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                          {course.instructor?.charAt(0) || "I"}
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
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${getStatusBadgeStyle(course.statusText)}`}>
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${course.statusText.includes("Opened") || course.statusText.includes("Attendance") || course.statusText.includes("Approved") ? "bg-emerald-500" : course.statusText.includes("Completed") ? "bg-blue-500" : "bg-amber-500"}`} />
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

          {/* CREATE COURSE MODAL */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New Course</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {createError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200">
                    {createError}
                  </p>
                )}

                <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Course Title *</label>
                    <input
                      type="text"
                      required
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      placeholder="e.g. AI Technology and Industrial Revolution"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Course Code *</label>
                      <input
                        type="text"
                        required
                        value={newCourse.code}
                        onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                        placeholder="VAC-AI-101"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Mode *</label>
                      <select
                        value={newCourse.mode}
                        onChange={(e) => setNewCourse({ ...newCourse, mode: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Instructor *</label>
                      <input
                        type="text"
                        required
                        value={newCourse.instructor}
                        onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Department *</label>
                      <input
                        type="text"
                        required
                        value={newCourse.department}
                        onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Max Intake</label>
                      <input
                        type="number"
                        min="1"
                        value={newCourse.maxIntake}
                        onChange={(e) => setNewCourse({ ...newCourse, maxIntake: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Credits</label>
                      <input
                        type="number"
                        min="1"
                        value={newCourse.credits}
                        onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Details / Description</label>
                    <textarea
                      rows={3}
                      value={newCourse.details}
                      onChange={(e) => setNewCourse({ ...newCourse, details: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createLoading}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                    >
                      {createLoading ? "Creating..." : "Save Course"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminCourseListPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">Loading courses...</div>}>
      <AdminCourseContent />
    </Suspense>
  );
}
