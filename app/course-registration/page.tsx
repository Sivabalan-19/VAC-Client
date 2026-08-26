"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CourseRegistrationPage() {
  const router = useRouter();

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Form State
  const [courseType, setCourseType] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseMode, setCourseMode] = useState("online");
  const [creditCategory, setCreditCategory] = useState("vac");
  const [courseName, setCourseName] = useState("");
  const [courseDetails, setCourseDetails] = useState("");
  const [maxIntake, setMaxIntake] = useState("");
  const [deptYear, setDeptYear] = useState("");

  // Notification state
  const [notifications, setNotifications] = useState(false);

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
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    router.replace("/login");
  };

  const handleReset = () => {
    setCourseType("");
    setCourseCategory("");
    setCourseMode("online");
    setCreditCategory("vac");
    setCourseName("");
    setCourseDetails("");
    setMaxIntake("");
    setDeptYear("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting course:", {
      courseType,
      courseCategory,
      courseMode,
      creditCategory,
      courseName,
      courseDetails,
      maxIntake,
      deptYear,
    });
    alert("Course Registration Proposal Saved for Step 2!");
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f4f7fe] dark:bg-[#0b1437] transition-colors duration-300 font-sans">
      {/* 1. Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-[#e0e5f2] dark:border-[#1b2559] bg-white dark:bg-[#111c44] p-8 h-screen sticky top-0 transition-colors duration-300 z-10">
        <div>
          {/* Logo / Title */}
          <div className="mb-10 px-4">
            <h1 className="text-[20px] font-extrabold tracking-wider text-[#1b2559] dark:text-white uppercase">
              VAC <span className="font-normal text-[#4318ff] dark:text-[#5b38ff] lowercase italic font-serif">portal</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center gap-3.5 py-3.5 px-5 rounded-2xl text-[#a3aed0] hover:text-[#1b2559] dark:hover:text-white hover:bg-[#f4f7fe] dark:hover:bg-[#1b254b]/30 text-[15px] font-medium transition-all duration-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              My Courses
            </a>

            <a
              href="#"
              className="flex items-center gap-3.5 py-3.5 px-5 rounded-2xl text-[#4318ff] dark:text-white bg-[#f4f7fe] dark:bg-[#1b254b] text-[15px] font-bold transition-all duration-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Course Registration
            </a>

            <a
              href="#"
              className="flex items-center gap-3.5 py-3.5 px-5 rounded-2xl text-[#a3aed0] hover:text-[#1b2559] dark:hover:text-white hover:bg-[#f4f7fe] dark:hover:bg-[#1b254b]/30 text-[15px] font-medium transition-all duration-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reports
            </a>
          </nav>
        </div>

        {/* Sidebar Graphics and Logout */}
        <div className="space-y-6">
          {/* Custom SVG Illustration */}
          <div className="px-4">
            <svg viewBox="0 0 200 150" fill="none" className="w-full max-h-[130px] opacity-90 dark:opacity-80">
              <circle cx="100" cy="75" r="55" fill="#e9edfc" className="dark:fill-[#1b254b]" />
              <rect x="55" y="40" width="90" height="60" rx="6" fill="#4318ff" fillOpacity="0.08" stroke="#4318ff" strokeWidth="1.5" />
              <line x1="55" y1="85" x2="145" y2="85" stroke="#4318ff" strokeWidth="1.5" />
              <path d="M90 100 L110 100 L100 115 Z" fill="#4318ff" />
              <circle cx="85" cy="62" r="10" stroke="#4318ff" strokeWidth="1.5" strokeDasharray="3 2" />
              <path d="M108 65 L118 50 L126 58 L134 45" stroke="#4318ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3.5 py-3.5 px-5 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-[15px] font-bold transition-all duration-200 text-left cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign-Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-5 md:p-10 transition-colors duration-300">
        {/* Header bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div>
            <h2 className="text-[26px] font-bold text-[#1b2559] dark:text-white tracking-tight">
              Course Request
            </h2>
          </div>

          <div className="flex items-center gap-3.5 bg-white dark:bg-[#111c44] rounded-full px-4 py-2 border border-[#e0e5f2] dark:border-[#1b2559] shadow-sm transition-all duration-200 self-end sm:self-auto">
            {/* Notification bell */}
            <button
              onClick={() => setNotifications(!notifications)}
              className="relative p-2 text-[#a3aed0] hover:text-[#1b2559] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle notifications"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>

            {/* Dark Mode toggle pill */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-[#a3aed0] hover:text-[#1b2559] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle dark theme"
            >
              {darkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 18.36l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* 3. Main card container */}
        <div className="mt-8 bg-white dark:bg-[#111c44] rounded-[24px] p-6 md:p-8 shadow-sm transition-colors duration-300">
          {/* Header of form card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f4f7fe] dark:border-[#1b2559] pb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1b2559] dark:text-white uppercase tracking-wider">
                Event Details
              </h3>
            </div>
            
            <div className="flex flex-col items-start sm:items-end gap-1.5 w-full sm:max-w-[340px]">
              <span className="text-xs font-semibold text-[#a3aed0] dark:text-gray-400">Step 1 of 2</span>
              <div className="w-full h-1.5 bg-[#f4f7fe] dark:bg-[#0b1437] rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-[#4318ff] dark:bg-[#5b38ff] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Guidelines Notes Box */}
          <div className="mt-6 bg-[#f4f7fe] dark:bg-[#0b1437]/50 border border-[#e0e5f2] dark:border-[#1b2559] rounded-[16px] p-5">
            <h4 className="text-sm font-bold text-[#1b2559] dark:text-white mb-2">Note</h4>
            <ul className="space-y-1.5 text-xs font-medium text-[#a3aed0] dark:text-gray-400 leading-relaxed uppercase">
              <li>1. The faculty members are requested to submit the proposal with their bitsathy mail id only (no need to submit the hard copy of the proposal).</li>
              <li>2. Type everything in capital letters.</li>
            </ul>
          </div>

          {/* Form */}
          <form className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6" onSubmit={handleSubmit}>
            {/* Left Column */}
            <div className="space-y-6">
              {/* Type of Course (Event) */}
              <div>
                <label className="block text-sm font-bold text-[#1b2559] dark:text-white mb-2.5">
                  Type of Event <span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
                </label>
                <select
                  required
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value)}
                  className="w-full h-[54px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent px-5 text-sm text-[#1b2559] dark:text-white outline-none transition-all focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] dark:focus:border-[#5b38ff]"
                >
                  <option value="" disabled className="dark:bg-[#111c44]">Select Type</option>
                  <option value="THEORY" className="dark:bg-[#111c44]">THEORY COURSE</option>
                  <option value="PRACTICAL" className="dark:bg-[#111c44]">PRACTICAL LAB</option>
                  <option value="INTEGRATED" className="dark:bg-[#111c44]">INTEGRATED THEORY + LAB</option>
                  <option value="SEMINAR" className="dark:bg-[#111c44]">SEMINAR/WORKSHOP</option>
                </select>
              </div>

              {/* Sub Category */}
              <div>
                <label className="block text-sm font-bold text-[#1b2559] dark:text-white mb-2.5">
                  Sub Category <span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
                </label>
                <select
                  required
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="w-full h-[54px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent px-5 text-sm text-[#1b2559] dark:text-white outline-none transition-all focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] dark:focus:border-[#5b38ff]"
                >
                  <option value="" disabled className="dark:bg-[#111c44]">Select Category</option>
                  <option value="SOFTWARE_DEV" className="dark:bg-[#111c44]">SOFTWARE DEVELOPMENT & CODING</option>
                  <option value="DATA_AI" className="dark:bg-[#111c44]">DATA SCIENCE, CLOUD & AI</option>
                  <option value="CORE_ENGG" className="dark:bg-[#111c44]">CORE ENGINEERING & DESIGN</option>
                  <option value="SOFT_SKILLS" className="dark:bg-[#111c44]">HUMANITIES & COMMUNICATIONS</option>
                  <option value="BIZ_MGMT" className="dark:bg-[#111c44]">BUSINESS, PROJECTS & MANAGEMENT</option>
                </select>
                <p className="mt-2 text-xs text-[#a3aed0] dark:text-gray-400">
                  If any of the category is not available in the list, Kindly contact VAC Team.
                </p>
              </div>

              {/* Mode of the Event */}
              <div>
                <label className="block text-sm font-bold text-[#1b2559] dark:text-white mb-3">
                  Mode of the Event <span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Online option */}
                  <label
                    className={`flex items-center gap-3 px-5 py-4 rounded-[16px] border cursor-pointer select-none transition-all duration-200 ${
                      courseMode === "online"
                        ? "border-[#4318ff] bg-[#f4f7fe]/50 dark:border-[#5b38ff] dark:bg-[#1b254b]/30"
                        : "border-[#e0e5f2] dark:border-[#1b2559] hover:bg-gray-50/50 dark:hover:bg-navy-800/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="courseMode"
                      value="online"
                      checked={courseMode === "online"}
                      onChange={() => setCourseMode("online")}
                      className="h-4.5 w-4.5 accent-[#4318ff] dark:accent-[#5b38ff] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#1b2559] dark:text-white">Online</span>
                  </label>

                  {/* Offline option */}
                  <label
                    className={`flex items-center gap-3 px-5 py-4 rounded-[16px] border cursor-pointer select-none transition-all duration-200 ${
                      courseMode === "offline"
                        ? "border-[#4318ff] bg-[#f4f7fe]/50 dark:border-[#5b38ff] dark:bg-[#1b254b]/30"
                        : "border-[#e0e5f2] dark:border-[#1b2559] hover:bg-gray-50/50 dark:hover:bg-navy-800/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="courseMode"
                      value="offline"
                      checked={courseMode === "offline"}
                      onChange={() => setCourseMode("offline")}
                      className="h-4.5 w-4.5 accent-[#4318ff] dark:accent-[#5b38ff] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#1b2559] dark:text-white">Offline</span>
                  </label>
                </div>
              </div>

              {/* Activity Category (Adapted to Credits Type) */}
              <div>
                <label className="block text-sm font-bold text-[#1b2559] dark:text-white mb-3">
                  Activity Category <span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* VAC Credits */}
                  <label
                    className={`flex items-center gap-3 px-5 py-4 rounded-[16px] border cursor-pointer select-none transition-all duration-200 ${
                      creditCategory === "vac"
                        ? "border-[#4318ff] bg-[#f4f7fe]/50 dark:border-[#5b38ff] dark:bg-[#1b254b]/30"
                        : "border-[#e0e5f2] dark:border-[#1b2559] hover:bg-gray-50/50 dark:hover:bg-navy-800/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="creditCategory"
                      value="vac"
                      checked={creditCategory === "vac"}
                      onChange={() => setCreditCategory("vac")}
                      className="h-4.5 w-4.5 accent-[#4318ff] dark:accent-[#5b38ff] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#1b2559] dark:text-white">VAC Credits</span>
                  </label>

                  {/* Audit Credits */}
                  <label
                    className={`flex items-center gap-3 px-5 py-4 rounded-[16px] border cursor-pointer select-none transition-all duration-200 ${
                      creditCategory === "audit"
                        ? "border-[#4318ff] bg-[#f4f7fe]/50 dark:border-[#5b38ff] dark:bg-[#1b254b]/30"
                        : "border-[#e0e5f2] dark:border-[#1b2559] hover:bg-gray-50/50 dark:hover:bg-navy-800/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="creditCategory"
                      value="audit"
                      checked={creditCategory === "audit"}
                      onChange={() => setCreditCategory("audit")}
                      className="h-4.5 w-4.5 accent-[#4318ff] dark:accent-[#5b38ff] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#1b2559] dark:text-white">Honor Points</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Name of the Event (Course) */}
              <div>
                <label className="block text-sm font-bold text-[#1b2559] dark:text-white mb-2.5">
                  Name of the Event <span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value.toUpperCase())}
                  placeholder="AI TECHNOLOGY - FUTURE OF INDUSTRIAL REVOLUTION"
                  className="w-full h-[54px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent px-5 text-sm text-[#1b2559] dark:text-white placeholder:text-[#a3aed0] outline-none transition-all focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] dark:focus:border-[#5b38ff] uppercase"
                />
                <p className="mt-2 text-xs text-[#a3aed0] dark:text-gray-400">
                  Kindly mention the Name of the clubs / Technical Societies / Department associations along with the course name.
                </p>
              </div>

              {/* Details about the Event */}
              <div>
                <label className="block text-sm font-bold text-[#1b2559] dark:text-white mb-2.5">
                  Details about the Event
                </label>
                <textarea
                  value={courseDetails}
                  onChange={(e) => setCourseDetails(e.target.value)}
                  placeholder="Default Text"
                  className="w-full h-[120px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent p-5 text-sm text-[#1b2559] dark:text-white placeholder:text-[#a3aed0] outline-none transition-all focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] dark:focus:border-[#5b38ff] resize-none"
                />
              </div>

              {/* Maximum Points */}
              <div>
                <label className="block text-sm font-bold text-[#1b2559] dark:text-white mb-2.5">
                  Maximum Points Per Student <span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={maxIntake}
                  onChange={(e) => setMaxIntake(e.target.value)}
                  placeholder="0000"
                  className="w-full h-[54px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent px-5 text-sm text-[#1b2559] dark:text-white placeholder:text-[#a3aed0] outline-none transition-all focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] dark:focus:border-[#5b38ff]"
                />
              </div>

              {/* Department and Year */}
              <div>
                <label className="block text-sm font-bold text-[#1b2559] dark:text-white mb-2.5">
                  Department and Year <span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
                </label>
                <select
                  required
                  value={deptYear}
                  onChange={(e) => setDeptYear(e.target.value)}
                  className="w-full h-[54px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent px-5 text-sm text-[#1b2559] dark:text-white outline-none transition-all focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] dark:focus:border-[#5b38ff]"
                >
                  <option value="" disabled className="dark:bg-[#111c44]">select department and year</option>
                  <option value="CSE_2" className="dark:bg-[#111c44]">COMPUTER SCIENCE & ENGG - II YEAR</option>
                  <option value="CSE_3" className="dark:bg-[#111c44]">COMPUTER SCIENCE & ENGG - III YEAR</option>
                  <option value="IT_2" className="dark:bg-[#111c44]">INFORMATION TECHNOLOGY - II YEAR</option>
                  <option value="ECE_3" className="dark:bg-[#111c44]">ELECTRONICS & COMM ENGG - III YEAR</option>
                  <option value="MECH_4" className="dark:bg-[#111c44]">MECHANICAL ENGG - IV YEAR</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="col-span-1 lg:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-[#f4f7fe] dark:border-[#1b2559]">
              {/* Trash Request button */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto h-[54px] rounded-[16px] bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-500 text-sm font-bold px-6 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Trash Request
              </button>

              {/* Next Section button */}
              <button
                type="submit"
                className="w-full sm:w-auto h-[54px] rounded-[16px] bg-[#4318ff] hover:bg-[#3311db] text-white text-sm font-bold px-8 flex items-center justify-center gap-2 shadow-lg shadow-[#4318ff]/15 hover:shadow-xl hover:shadow-[#4318ff]/25 cursor-pointer transition-all duration-200"
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
