"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FacultySidebar from "../components/FacultySidebar";

export default function FacultyCreateCoursePage() {
  const router = useRouter();

  // Wizard Step State: 1 = Basic Info, 2 = Dates & Schedule, 3 = Faculty & Overview
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseType, setCourseType] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  
  const [instructor, setInstructor] = useState("");
  const [department, setDepartment] = useState("");
  const [deptYear, setDeptYear] = useState("");

  const [courseMode, setCourseMode] = useState("online");
  const [creditCategory, setCreditCategory] = useState("vac");
  const [credits, setCredits] = useState("2");
  const [maxIntake, setMaxIntake] = useState("");

  // Registration Dates
  const [regStartDate, setRegStartDate] = useState("");
  const [regEndDate, setRegEndDate] = useState("");

  // Event Schedule Dates
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventDays, setEventDays] = useState("2");
  const [sessionsPerDay, setSessionsPerDay] = useState("2");
  const [location, setLocation] = useState("");

  const [selectedImage, setSelectedImage] = useState("https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop");
  const [courseDetails, setCourseDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("New Value Added Course proposal submitted successfully!");
    router.push("/faculty/course");
  };

  const imagePresets = [
    { label: "AI & Data Science", url: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop" },
    { label: "Blockchain & Web3", url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop" },
    { label: "IoT & Hardware", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop" },
    { label: "UI/UX & Design", url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop" },
    { label: "Cloud & DevOps", url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. UNIFIED SIDEBAR */}
      <FacultySidebar activeTab="/faculty/create" />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create Course Proposal
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Multi-step wizard with real-time course card preview.
            </p>
          </div>

          <button
            onClick={() => router.push("/faculty/course")}
            className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm cursor-pointer"
          >
            ← Back to My Course
          </button>
        </div>

        {/* 3-STEP WIZARD PROGRESS BAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <button
              onClick={() => setCurrentStep(1)}
              className={`py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                currentStep === 1
                  ? "bg-indigo-600 text-white shadow-sm"
                  : currentStep > 1
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              <span className="hidden sm:inline">Basic Info & Banner</span>
            </button>

            <button
              onClick={() => setCurrentStep(2)}
              className={`py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                currentStep === 2
                  ? "bg-indigo-600 text-white shadow-sm"
                  : currentStep > 2
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
              <span className="hidden sm:inline">Registration & Event Dates</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className={`py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                currentStep === 3
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
              <span className="hidden sm:inline">Faculty & Overview</span>
            </button>
          </div>
        </div>

        {/* SPLIT LAYOUT: WIZARD FORM (LEFT) + LIVE CARD PREVIEW (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT: STEPPER FORM FIELDS */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: BASIC INFO & BANNER */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Course Title / Topic *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AI TECHNOLOGY - FUTURE OF INDUSTRIAL REVOLUTION"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Course Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. VAC-AI-101"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Course Type *
                      </label>
                      <select
                        required
                        value={courseType}
                        onChange={(e) => setCourseType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                      >
                        <option value="">Select Course Type</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Guest Lecturer">Guest Lecturer</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Clubs & Societies">Clubs & Societies</option>
                        <option value="Workshop">Hands-on Workshop</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Category / Domain *
                      </label>
                      <select
                        required
                        value={courseCategory}
                        onChange={(e) => setCourseCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                      >
                        <option value="">Select Domain</option>
                        <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
                        <option value="Cyber Security & Web3">Cyber Security & Web3</option>
                        <option value="Embedded Systems">Embedded Systems & IoT</option>
                        <option value="Design & Media">Design & UI/UX</option>
                        <option value="Cloud Computing">Cloud Computing & DevOps</option>
                      </select>
                    </div>
                  </div>

                  {/* Banner Image Presets */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Select Featured Banner Preset:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {imagePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(preset.url)}
                          className={`relative rounded-xl overflow-hidden border-2 h-16 text-left transition cursor-pointer ${
                            selectedImage === preset.url
                              ? "border-indigo-600 ring-2 ring-indigo-500 shadow-sm"
                              : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                            <span className="text-[9px] font-bold text-white leading-tight">{preset.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Next Step: Dates & Schedule →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: REGISTRATION DATES & EVENT SCHEDULE */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* CARD 1: COURSE REGISTRATION WINDOW */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Course Registration Window
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Registration Start Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={regStartDate}
                          onChange={(e) => setRegStartDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Registration End Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={regEndDate}
                          onChange={(e) => setRegEndDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: EVENT SCHEDULE & VENUE */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Event Schedule & Venue Setup
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Event Start Date & Time * (Calendar Badge)
                        </label>
                        <input
                          type="datetime-local"
                          required
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Event End Date & Time *
                        </label>
                        <input
                          type="datetime-local"
                          required
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Venue / Platform Link *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Computer Lab 304 / Zoom Link"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Delivery Mode
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {["online", "offline", "hybrid"].map((mode) => (
                            <button
                              type="button"
                              key={mode}
                              onClick={() => setCourseMode(mode)}
                              className={`py-2 px-1.5 rounded-xl text-xs font-bold capitalize border transition cursor-pointer ${
                                courseMode === mode
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                  : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Event Duration (Total Days)
                        </label>
                        <select
                          value={eventDays}
                          onChange={(e) => setEventDays(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                        >
                          <option value="1">1 Day Event</option>
                          <option value="2">2 Days Event</option>
                          <option value="3">3 Days Event</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Sessions Per Day
                        </label>
                        <select
                          value={sessionsPerDay}
                          onChange={(e) => setSessionsPerDay(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                        >
                          <option value="1">1 Session per Day</option>
                          <option value="2">2 Sessions per Day</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Next Step: Faculty & Overview →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: FACULTY & OVERVIEW */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Lead Instructor Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Sarah Connor"
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Department *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Computer Science"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Target Student Cohort
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3rd Year CSE / IT"
                        value={deptYear}
                        onChange={(e) => setDeptYear(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Credit Category
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: "vac", label: "VAC" },
                          { id: "audit", label: "Audit" },
                        ].map((c) => (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => setCreditCategory(c.id)}
                            className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              creditCategory === c.id
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Course Credits
                      </label>
                      <select
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                      >
                        <option value="1">1 Credit</option>
                        <option value="2">2 Credits</option>
                        <option value="3">3 Credits</option>
                        <option value="4">4 Credits</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Max Intake (Seats) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 60"
                        value={maxIntake}
                        onChange={(e) => setMaxIntake(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Course Description & Overview *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Provide a detailed summary of course objectives, practical learning outcomes, and prerequisites..."
                      value={courseDetails}
                      onChange={(e) => setCourseDetails(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Submit Course Proposal
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: STICKY LIVE CARD PREVIEW */}
          <div className="lg:col-span-1 sticky top-8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Card Preview
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                Real-time Preview
              </span>
            </div>

            {/* LIVE PREVIEW COURSE CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md">
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />

                {/* Top Left: Type */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-sm">
                    {courseType || "Webinar"}
                  </span>
                </div>

                {/* Top Right: Desk Calendar Leaf derived from Event Start Date */}
                <div className="absolute top-3 right-3 z-10 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 text-center w-12 flex flex-col items-center">
                  <div className="bg-rose-600 text-[9px] font-bold tracking-wider uppercase text-white w-full py-0.5">
                    {startDate ? new Date(startDate).toLocaleString("en-US", { month: "short" }).toUpperCase() : "AUG"}
                  </div>
                  <div className="text-slate-900 dark:text-white font-extrabold text-sm py-1 leading-snug">
                    {startDate ? new Date(startDate).getDate() : "28"}
                  </div>
                </div>

                {/* Bottom Mode */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900/80 text-white backdrop-blur-sm">
                    {courseMode} • {credits} Credits
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {courseCode || "VAC-CODE"}
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                    {courseCategory || "Domain Category"}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {courseName || "Untitled Course Proposal Title"}
                </h3>

                {/* Registration Dates Preview */}
                {(regStartDate || regEndDate) && (
                  <div className="text-[10px] text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">Registration Window:</span>
                    <span>{regStartDate || "N/A"} to {regEndDate || "N/A"}</span>
                  </div>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {courseDetails || "Your course overview description will appear here as you type."}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Proposal Draft
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                    View Details →
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
