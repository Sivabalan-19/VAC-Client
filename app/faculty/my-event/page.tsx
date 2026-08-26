"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FacultySidebar from "../components/FacultySidebar";
import { INITIAL_COURSES, Course } from "../data/mockCourses";

export default function FacultyMyEventPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [courses] = useState<Course[]>(INITIAL_COURSES);

  // Filter Logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" ||
      course.type.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED SIDEBAR */}
      <FacultySidebar activeTab="/faculty/courses" />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* HEADER WITH CREATE COURSE BUTTON AT TOP RIGHT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Courses
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select any course card to open course details and manage live event student attendance.
            </p>
          </div>

          {/* CREATE COURSE BUTTON - TOP RIGHT OF COURSE PAGE */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/faculty/create")}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              + Create Course
            </button>
          </div>
        </div>

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
              placeholder="Search course name or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {["all", "Webinar", "Guest Lecturer", "Seminar", "Clubs & Societies"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition capitalize ${
                  selectedType === type
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* COURSES CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const attendancePercent =
              course.registeredCount > 0
                ? Math.round((course.attendedCount / course.registeredCount) * 100)
                : 0;

            return (
              <div
                key={course.id}
                onClick={() => router.push(`/faculty/courses/${course.id}`)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={course.imageUrl}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-indigo-600 dark:text-indigo-400 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                      {course.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900/80 text-white backdrop-blur-md">
                      {course.mode}
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

                  {/* Attendance & Step Progress */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Total Attended:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {course.attendedCount}
                        </span>{" "}
                        / {course.registeredCount} Students ({attendancePercent}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${attendancePercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="px-2 py-0.5 rounded text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 font-semibold">
                        {course.statusText}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
