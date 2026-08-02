"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CourseProposal {
  id: number;
  name: string;
  type: string;
  statusText: string;
  currentStep: number;
  steps: number[];
  imageUrl: string;
  details: string;
}

export default function FacultyMyEventPage() {
  const router = useRouter();

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Selected Course Proposal details modal state
  const [selectedProposal, setSelectedProposal] = useState<CourseProposal | null>(null);

  // Mock Course Proposals data with Unsplash images
  const [proposals] = useState<CourseProposal[]>([
    {
      id: 1,
      name: "AI TECHNOLOGY - FUTURE OF INDUSTRIAL REVOLUTION",
      type: "Webinar",
      statusText: "Course Approval Pending...",
      currentStep: 1,
      steps: [1, 2, 3],
      imageUrl: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=400&auto=format&fit=crop",
      details: "Webinar explaining key industrial integrations with generative AI models and automation paradigms. Guest Speaker: Dr. Sarah Connor.",
    },
    {
      id: 2,
      name: "BLOCKCHAIN DECENTRALIZED PLATFORMS",
      type: "Guest Lecturer",
      statusText: "Approval Pending...",
      currentStep: 1,
      steps: [1, 2, 3],
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=400&auto=format&fit=crop",
      details: "Guest lecture covering decentralized ledger technology, smart contract security standards, and audits.",
    },
    {
      id: 3,
      name: "IoT INTERNET OF THINGS SYSTEM ARCHITECTURE",
      type: "Clubs & Societies",
      statusText: "Student Registration Pending...",
      currentStep: 2,
      steps: [2, 3, 4],
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop",
      details: "Club-led workshop focused on microcontroller telemetry, ESP32 node interfaces, and MQTT telemetry logs.",
    },
    {
      id: 4,
      name: "UI/UX DESIGN FRAMEWORKS & WIREFRAMING",
      type: "Seminar",
      statusText: "Attendance Opened",
      currentStep: 3,
      steps: [3, 4, 5],
      imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=400&auto=format&fit=crop",
      details: "Seminar outlining responsive auto layouts, typography scales, accessibility checklists, and user testing paradigms.",
    },
    {
      id: 5,
      name: "NEXT-GEN CLOUD PLATFORMS",
      type: "Guest Lecturer",
      statusText: "Attendance Update Pending...",
      currentStep: 4,
      steps: [4, 5, 6],
      imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400&auto=format&fit=crop",
      details: "Guest lecture detailing container management systems, CI/CD setups, and edge caching techniques.",
    },
    {
      id: 6,
      name: "CYBER RANGE LAB: THREAT INTELLIGENCE",
      type: "Seminar",
      statusText: "Points Update Pending...",
      currentStep: 5,
      steps: [5, 6, 7],
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop",
      details: "Defensive CTF security exercises teaching network packet investigations, intrusion logging, and malware defenses.",
    },
    {
      id: 7,
      name: "PRODUCT DESIGN PRINCIPLES: DISCOVERY TO DELIVERY",
      type: "Clubs & Societies",
      statusText: "Rewards Results Pending...",
      currentStep: 6,
      steps: [6, 7, 8],
      imageUrl: "https://images.unsplash.com/photo-1531535934027-687f96798505?q=80&w=400&auto=format&fit=crop",
      details: "Club session dealing with user validation steps, wireframing cycles, and pitch presentations.",
    },
    {
      id: 8,
      name: "DEVOPS DEPLOYMENTS: KUBERNETES & SYSTEM HEALTH",
      type: "Webinar",
      statusText: "Course Completed Successfully",
      currentStep: 8,
      steps: [6, 7, 8],
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop",
      details: "Webinar showing container cluster deployments, load balancing systems, and status health logging.",
    },
  ]);

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

  // Filter Logic
  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" ||
      proposal.type.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

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
              onClick={() => router.push("/faculty/my-event")}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              My Courses
            </a>

            <a
              onClick={() => router.push("/faculty/create")}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm font-medium transition-all duration-200 cursor-pointer"
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
      <main className="flex-1 p-6 md:p-8 transition-colors duration-300 overflow-y-auto h-screen">
        {/* Header Bar */}
        <header className="flex justify-between items-center w-full mb-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
            <span>Faculty Panel</span>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-550 font-semibold">My Courses</span>
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

        {/* Filters and Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            My Courses
          </h2>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-48 md:w-56 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-8 pr-4 text-xs text-slate-850 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Type Filter Dropdown */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:border-indigo-500"
            >
              <option value="all">Sort by Type</option>
              <option value="webinar">Webinar</option>
              <option value="guest lecturer">Guest Lecturer</option>
              <option value="seminar">Seminar</option>
              <option value="clubs">Clubs & Societies</option>
            </select>
          </div>
        </div>

        {/* Proposals Grid List */}
        {filteredProposals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-colors duration-300"
              >
                {/* Image Thumbnail */}
                <div className="h-32 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850/50">
                  <img
                    src={proposal.imageUrl}
                    alt={proposal.type}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase rounded bg-white/95 dark:bg-slate-900/95 shadow-sm border border-slate-200/50 dark:border-slate-700/50 text-indigo-600 dark:text-indigo-400">
                      {proposal.type}
                    </span>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 max-w-[85%]">
                        {proposal.name}
                      </h4>
                      <button
                        onClick={() => setSelectedProposal(proposal)}
                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        view
                      </button>
                    </div>
                  </div>

                  {/* Stepper Timeline Graphics */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between px-2">
                      {proposal.steps.map((stepNum, idx) => {
                        const isActive = stepNum <= proposal.currentStep;
                        return (
                          <div key={idx} className="flex items-center flex-1 last:flex-initial">
                            {/* Circle Node */}
                            <div className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                              isActive
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700"
                            }`}>
                              {stepNum}
                            </div>
                            
                            {/* Connective Line */}
                            {idx < proposal.steps.length - 1 && (
                              <div className={`h-0.5 flex-1 mx-2 transition-colors ${
                                stepNum < proposal.currentStep
                                  ? "bg-emerald-500"
                                  : "bg-slate-200 dark:bg-slate-850"
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Status Text label */}
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-455 text-center leading-normal pt-1 select-none">
                      {proposal.statusText}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center transition-colors">
            <span className="text-xs text-slate-455 font-bold block uppercase tracking-wider">No Proposals Found</span>
            <p className="text-xs text-slate-400 mt-1">Refine your search tags or submit a new proposal course.</p>
          </div>
        )}
      </main>

      {/* 3. DETAILS DIALOG MODAL */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-slate-955/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-[500px] shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  {selectedProposal.type} PROPOSAL
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedProposal.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProposal(null)}
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
                  <span className="block text-[10px] font-semibold text-slate-450 uppercase">Type</span>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedProposal.type}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-3">
                  <span className="block text-[10px] font-semibold text-slate-450 uppercase">Progress Status</span>
                  <span className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {selectedProposal.statusText}
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-semibold text-slate-450 uppercase mb-1">Details Summary</span>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedProposal.details}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/20">
              <button
                type="button"
                onClick={() => setSelectedProposal(null)}
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
