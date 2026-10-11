"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore, Role, DEMO_USERS } from "../context/StoreContext";
import { checkHealth } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, darkMode, toggleDarkMode } = useStore();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [facultyType, setFacultyType] = useState<"internal" | "external">("internal");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverHealth, setServerHealth] = useState<"online" | "checking" | "offline">("checking");

  useEffect(() => {
    checkHealth()
      .then((res) => {
        if (res?.status === "ok") setServerHealth("online");
        else setServerHealth("offline");
      })
      .catch(() => setServerHealth("offline"));
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    let matchedRole: Role = role;
    if (normalizedEmail.includes("faculty") || normalizedPassword.includes("faculty")) {
      matchedRole = "faculty";
    } else if (normalizedEmail.includes("admin") || normalizedPassword.includes("admin")) {
      matchedRole = "admin";
    } else if (normalizedEmail.includes("student") || normalizedPassword.includes("student")) {
      matchedRole = "student";
    }

    try {
      await login(matchedRole, normalizedEmail, normalizedPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role,
        facultyType: role === "faculty" ? facultyType : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (quickRole: Role) => {
    const demo = DEMO_USERS[quickRole];
    const demoPassword = quickRole === "student" ? "Password123!" : `${quickRole}123`;
    setEmail(demo.email);
    setPassword(demoPassword);
    setRole(quickRole);
    setError("");
    setIsLoading(true);
    try {
      await login(quickRole, demo.email, demoPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row bg-[#f4f7fe] dark:bg-[#0b1437] transition-colors duration-300">
      {/* Mobile Dark Mode Toggle */}
      <button
        type="button"
        onClick={toggleDarkMode}
        className="lg:hidden absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#111c44] text-[#1b2559] dark:text-white shadow-md transition-all active:scale-95 z-20 cursor-pointer"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 18.36l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        )}
      </button>

      {/* Left Section - Login / Register Form */}
      <section className="flex flex-1 flex-col justify-center items-center px-6 py-12 sm:px-12 md:px-20 xl:px-24 bg-white dark:bg-[#0b1437] transition-colors duration-300 relative">
        <div className="w-full max-w-[440px]">
          {/* Server API Health Pill */}
          <div className="mb-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                serverHealth === "online"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : serverHealth === "checking"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  serverHealth === "online"
                    ? "bg-emerald-500 animate-pulse"
                    : serverHealth === "checking"
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
              />
              {serverHealth === "online"
                ? "Backend API Online"
                : serverHealth === "checking"
                ? "Connecting to API..."
                : "API Offline"}
            </span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-[#1b2559] dark:text-white leading-[44px]">
              {isRegisterMode ? "Create Account" : "Sign In"}
            </h1>
            <p className="mt-2 text-[15px] font-normal text-[#a3aed0] dark:text-gray-400">
              {isRegisterMode
                ? "Register a student, faculty, or admin account for VAC"
                : "Enter your email and password to sign in!"}
            </p>
          </div>

          {!isRegisterMode && (
            /* Quick Demo Login Switcher */
            <div className="mb-6 p-3 rounded-2xl bg-[#f4f7fe] dark:bg-[#111c44] border border-[#e0e5f2] dark:border-[#1b2559]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#a3aed0] dark:text-gray-400 mb-2">
                Instant Demo Access:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("student")}
                  className="py-2 px-2.5 rounded-xl bg-white dark:bg-[#0b1437] hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-[#e0e5f2] dark:border-[#1b2559] text-xs font-bold text-blue-600 dark:text-blue-400 transition cursor-pointer shadow-xs text-center"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("faculty")}
                  className="py-2 px-2.5 rounded-xl bg-white dark:bg-[#0b1437] hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-[#e0e5f2] dark:border-[#1b2559] text-xs font-bold text-violet-600 dark:text-violet-400 transition cursor-pointer shadow-xs text-center"
                >
                  Faculty
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin")}
                  className="py-2 px-2.5 rounded-xl bg-white dark:bg-[#0b1437] hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-[#e0e5f2] dark:border-[#1b2559] text-xs font-bold text-slate-800 dark:text-slate-200 transition cursor-pointer shadow-xs text-center"
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={isRegisterMode ? handleSignUp : handleSignIn}>
            {/* Full Name Field (Register Mode Only) */}
            {isRegisterMode && (
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-sm font-medium text-[#1b2559] dark:text-white"
                >
                  Full Name<span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full h-[50px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent px-5 text-sm text-[#1b2559] dark:text-white placeholder:text-[#a3aed0] outline-none transition-all focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] dark:focus:border-[#5b38ff]"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#1b2559] dark:text-white"
              >
                Email<span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@example.com"
                className="w-full h-[50px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent px-5 text-sm text-[#1b2559] dark:text-white placeholder:text-[#a3aed0] outline-none transition-all focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] dark:focus:border-[#5b38ff]"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#1b2559] dark:text-white"
              >
                Password<span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full h-[50px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent pl-5 pr-12 text-sm text-[#1b2559] dark:text-white placeholder:text-[#a3aed0] outline-none transition-all focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] dark:focus:border-[#5b38ff]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#a3aed0] hover:text-[#1b2559] dark:hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 013.914-4.896M8.288 8.288A3 3 0 0012 12a3 3 0 00.34-.015m5.918 2.375A10.025 10.025 0 0021.542 12c-1.274-4.057-5.064-7-9.542-7-1.077 0-2.112.17-3.085.485m10.076 10.076l-1.92-1.92M8.288 8.288L5.12 5.12m0 0L19.07 19.07" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection (Register Mode Only) */}
            {isRegisterMode && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#1b2559] dark:text-white">
                    Select Role<span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["student", "faculty", "admin"] as Role[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition cursor-pointer ${
                          role === r
                            ? "bg-[#4318ff] text-white border-[#4318ff] shadow-sm"
                            : "bg-white dark:bg-[#111c44] text-[#1b2559] dark:text-white border-[#e0e5f2] dark:border-[#1b2559] hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {role === "faculty" && (
                  <div>
                    <label
                      htmlFor="facultyType"
                      className="mb-1.5 block text-sm font-medium text-[#1b2559] dark:text-white"
                    >
                      Faculty Type<span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
                    </label>
                    <select
                      id="facultyType"
                      value={facultyType}
                      onChange={(e) => setFacultyType(e.target.value as "internal" | "external")}
                      className="w-full h-[50px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent px-4 text-sm text-[#1b2559] dark:text-white outline-none focus:border-[#4318ff]"
                    >
                      <option value="internal" className="text-black dark:text-white dark:bg-[#111c44]">
                        Internal Faculty
                      </option>
                      <option value="external" className="text-black dark:text-white dark:bg-[#111c44]">
                        External / Guest Faculty
                      </option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {!isRegisterMode && (
              /* Checkbox and Forgot Password */
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 text-sm text-[#1b2559] dark:text-white select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-[#e0e5f2] dark:border-[#1b2559] accent-[#4318ff] dark:accent-[#5b38ff] cursor-pointer"
                  />
                  Keep me logged in
                </label>

                <a
                  href="#"
                  className="text-sm font-medium text-[#4318ff] dark:text-[#5b38ff] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] rounded-[16px] bg-[#4318ff] hover:bg-[#3311db] text-white text-base font-bold shadow-lg shadow-[#4318ff]/15 hover:shadow-xl hover:shadow-[#4318ff]/25 transition-all duration-200 active:scale-[0.99] cursor-pointer mt-2"
            >
              {isLoading
                ? isRegisterMode
                  ? "Creating Account..."
                  : "Signing in..."
                : isRegisterMode
                ? "Create Account"
                : "Sign In"}
            </button>

            {error ? (
              <p className="text-sm font-medium text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900">
                {error}
              </p>
            ) : null}

            {/* Toggle Between Sign In and Register */}
            <div className="text-sm text-[#1b2559] dark:text-white pt-1 text-center">
              {isRegisterMode ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setError("");
                    }}
                    className="font-bold text-[#4318ff] dark:text-[#5b38ff] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Not registered yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(true);
                      setError("");
                    }}
                    className="font-bold text-[#4318ff] dark:text-[#5b38ff] hover:underline cursor-pointer"
                  >
                    Create an Account
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Right Section - Branding Banner */}
      <section className="hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden h-screen select-none bg-[#f4f7fe] dark:bg-[#0b1437]">
        <div className="w-full h-full relative flex flex-col items-center justify-center rounded-bl-[100px] xl:rounded-bl-[120px] overflow-hidden">
          {/* Wave Background */}
          <Image
            src="/loginback.png"
            alt="Fluid Waves Background"
            fill
            priority
            className="object-cover pointer-events-none"
          />

          {/* Logo overlay */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <Image
              src="/logo.png"
              alt="Bannari Amman Institute of Technology Logo"
              width={380}
              height={380}
              className="object-contain drop-shadow-md"
              priority
            />
          </div>

          {/* Learn More Card */}
          <div className="relative z-10 mt-10 w-full max-w-[280px] rounded-2xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-md">
            <p className="text-xs font-light tracking-wide text-white/80">Learn more</p>
            <a
              href="https://bitsathy.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-lg font-bold text-white hover:underline cursor-pointer"
            >
              bitsathy.ac.in
            </a>
          </div>
        </div>

        {/* Floating Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="absolute bottom-12 right-12 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#4318ff] to-[#3311db] text-white shadow-lg shadow-[#4318ff]/30 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 18.36l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>
      </section>
    </main>
  );
}
