"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FacultyCreateCoursePage() {
  const router = useRouter();

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Form State (Same variables and logic as course-registration/page.tsx)
  const [courseType, setCourseType] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseMode, setCourseMode] = useState("online");
  const [creditCategory, setCreditCategory] = useState("vac");
  const [courseName, setCourseName] = useState("");
  const [courseDetails, setCourseDetails] = useState("");
  const [maxIntake, setMaxIntake] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>("syllabus_draft.pdf");
  const [deptYear, setDeptYear] = useState("");

  // Notification state
  const [notifications, setNotifications] = useState(false);

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

  const handleReset = () => {
    setCourseType("");
    setCourseCategory("");
    setCourseMode("online");
    setCreditCategory("vac");
    setCourseName("");
    setCourseDetails("");
    setMaxIntake("");
    setUploadedFile(null);
    setDeptYear("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting course proposal:", {
      courseType,
      courseCategory,
      courseMode,
      creditCategory,
      courseName,
      courseDetails,
      maxIntake,
      uploadedFile,
      deptYear,
    });
    alert("Course Registration Proposal Saved for Step 2!");
  };

  const simulateFileUpload = () => {
    setUploadedFile("syllabus_draft_v2.pdf");
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-955 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 h-screen sticky top-0 transition-colors duration-300 z-10">
        <div>
          {/* Logo / Title */}
          <div className="mb-8 px-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              REWARD <span className="font-light text-indigo-650 dark:text-indigo-400 italic">POINTS</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <a
              onClick={() => router.push("/faculty/my-event")}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              My Courses
            </a>

            <a
              onClick={() => router.push("/faculty/create")}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Course Request
            </a>

            <a
              href="#"
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm font-medium transition-all duration-200"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reports
            </a>
          </nav>
        </div>

        {/* Sidebar Graphics (Online Image Illustration) and Logout Button */}
        <div className="space-y-6">
          {/* Online Image Illustration for Sidebar (Simple & Clean style) */}
          <div className="px-2">
            <div className="relative rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-850 p-2 flex flex-col items-center border border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=200&auto=format&fit=crop"
                alt="Workspace Collaboration"
                className="w-full h-24 object-cover rounded-lg opacity-85 dark:opacity-75"
                loading="lazy"
              />
            </div>
          </div>

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
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 transition-colors duration-300 overflow-y-auto h-screen">
        {/* Header Bar */}
        <header className="flex justify-between items-center w-full mb-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
            <span>Faculty Panel</span>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-550 font-semibold text-indigo-600 dark:text-indigo-400">Course Request</span>
          </div>

          {/* Icons and Theme Toggle Button */}
          <div className="flex items-center gap-3">
             <button
              onClick={() => setNotifications(!notifications)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm cursor-pointer transition-colors relative"
              aria-label="Notifications"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>

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
          </div>
        </header>

        {/* Title */}
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Course Request
        </h2>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm max-w-5xl">
          {/* Progress Bar & Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                COURSE DETAILS
              </h3>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Step 1 of 2
              </span>
            </div>
            <div className="flex gap-2">
              <div className="h-1 flex-1 bg-indigo-650 dark:bg-indigo-500 rounded-full" />
              <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-full" />
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Note Block */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
              <h4 className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Note</h4>
              <ol className="list-decimal list-inside text-[11px] font-semibold text-slate-500 dark:text-slate-400 space-y-1">
                <li>THE FACULTY MEMBERS ARE REQUESTED TO SUBMIT THE PROPOSAL WITH THEIR BITSATHY MAIL ID ONLY (NO NEED TO SUBMIT THE HARD COPY OF THE PROPOSAL).</li>
                <li>TYPE EVERYTHING IN CAPITAL LETTERS</li>
              </ol>
            </div>

            {/* Grid 2 cols */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Left Column */}
              <div className="space-y-6">
                {/* Type of Course */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Type of Course <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    required
                    value={courseType}
                    onChange={(e) => setCourseType(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-750 dark:text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="THEORY">THEORY COURSE</option>
                    <option value="PRACTICAL">PRACTICAL LAB</option>
                    <option value="INTEGRATED">INTEGRATED THEORY + LAB</option>
                    <option value="SEMINAR">SEMINAR/WORKSHOP</option>
                  </select>
                </div>

                {/* Sub Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Sub Category <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    required
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-750 dark:text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="" disabled>Select Category</option>
                    <option value="SOFTWARE_DEV">SOFTWARE DEVELOPMENT & CODING</option>
                    <option value="DATA_AI">DATA SCIENCE, CLOUD & AI</option>
                    <option value="CORE_ENGG">CORE ENGINEERING & DESIGN</option>
                    <option value="SOFT_SKILLS">HUMANITIES & COMMUNICATIONS</option>
                    <option value="BIZ_MGMT">BUSINESS, PROJECTS & MANAGEMENT</option>
                  </select>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    If any of the category is not available in the list, Kindly contact VAC Team.
                  </p>
                </div>

                {/* Mode of the Course */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Mode of the Course <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className={`flex items-center gap-2 flex-1 h-10 px-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                      courseMode === "online" 
                        ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400" 
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                    }`}>
                      <input 
                        type="radio" 
                        name="courseMode"
                        value="online"
                        checked={courseMode === "online"}
                        onChange={() => setCourseMode("online")}
                        className="h-4 w-4 accent-indigo-650" 
                      />
                      <span>Online</span>
                    </label>
                    <label className={`flex items-center gap-2 flex-1 h-10 px-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                      courseMode === "offline" 
                        ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400" 
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                    }`}>
                      <input 
                        type="radio" 
                        name="courseMode"
                        value="offline"
                        checked={courseMode === "offline"}
                        onChange={() => setCourseMode("offline")}
                        className="h-4 w-4 accent-indigo-650" 
                      />
                      <span>Offline</span>
                    </label>
                  </div>
                </div>

                {/* Activity Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Activity Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className={`flex items-center gap-2 flex-1 h-10 px-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                      creditCategory === "vac" 
                        ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400" 
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                    }`}>
                      <input 
                        type="radio" 
                        name="creditCategory"
                        value="vac"
                        checked={creditCategory === "vac"}
                        onChange={() => setCreditCategory("vac")}
                        className="h-4 w-4 accent-indigo-650" 
                      />
                      <span>VAC Credits</span>
                    </label>
                    <label className={`flex items-center gap-2 flex-1 h-10 px-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                      creditCategory === "audit" 
                        ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400" 
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                    }`}>
                      <input 
                        type="radio" 
                        name="creditCategory"
                        value="audit"
                        checked={creditCategory === "audit"}
                        onChange={() => setCreditCategory("audit")}
                        className="h-4 w-4 accent-indigo-650" 
                      />
                      <span>Honor Points</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Name of the Course */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Name of the Course <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value.toUpperCase())}
                    placeholder="AI TECHNOLOGY - FUTURE OF INDUSTRIAL REVOLUTION"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-450 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all uppercase"
                  />
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-snug">
                    Kindly mention the Name of the clubs / Technical Societies / Department associations along with the course name.
                  </p>
                </div>

                {/* Details about the Course */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Details about the Course
                  </label>
                  <textarea 
                    value={courseDetails}
                    onChange={(e) => setCourseDetails(e.target.value)}
                    placeholder="Default Text"
                    className="w-full h-24 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-450 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
                  />
                </div>

                {/* Maximum Points and Rubric */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      Maximum Points Per Student <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      required
                      value={maxIntake}
                      onChange={(e) => setMaxIntake(e.target.value)}
                      placeholder="0000"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-center tracking-widest"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Rubric Sheet <span className="text-rose-500">*</span>
                    </label>
                    
                    {uploadedFile ? (
                      <div className="flex flex-col gap-1">
                        <div className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer truncate max-w-[100px]">
                            {uploadedFile}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => setUploadedFile(null)}
                            className="text-slate-400 hover:text-rose-500 font-bold text-xs cursor-pointer ml-1"
                          >
                            X
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 pl-1">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          File saved
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={simulateFileUpload}
                        className="w-full h-10 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-indigo-600 hover:border-indigo-500 transition-all cursor-pointer bg-white dark:bg-slate-900"
                      >
                        + Upload reference material
                      </button>
                    )}
                  </div>
                </div>

                {/* Department and Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Department and Year <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    required
                    value={deptYear}
                    onChange={(e) => setDeptYear(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-750 dark:text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="" disabled>select department and year</option>
                    <option value="CSE_2">COMPUTER SCIENCE & ENGG - II YEAR</option>
                    <option value="CSE_3">COMPUTER SCIENCE & ENGG - III YEAR</option>
                    <option value="IT_2">INFORMATION TECHNOLOGY - II YEAR</option>
                    <option value="ECE_3">ELECTRONICS & COMM ENGG - III YEAR</option>
                    <option value="MECH_4">MECHANICAL ENGG - IV YEAR</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <button 
                type="button" 
                onClick={handleReset}
                className="flex items-center gap-2 h-10 px-5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Trash Request
              </button>
              
              <button 
                type="submit" 
                className="flex items-center gap-2 h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Next Section
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
