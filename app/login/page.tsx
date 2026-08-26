"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore, Role, DEMO_USERS } from "../context/StoreContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, darkMode, toggleDarkMode } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Match role based on email or credentials
    let matchedRole: Role = "student";
    if (normalizedEmail.includes("faculty") || normalizedPassword.includes("faculty")) {
      matchedRole = "faculty";
    } else if (normalizedEmail.includes("admin") || normalizedPassword.includes("admin")) {
      matchedRole = "admin";
    } else if (normalizedEmail.includes("student") || normalizedPassword.includes("student")) {
      matchedRole = "student";
    }

    login(matchedRole, normalizedEmail, normalizedPassword);
    setIsLoading(false);
  };

  const handleQuickLogin = (role: Role) => {
    const demo = DEMO_USERS[role];
    setEmail(demo.email);
    setPassword(`${role}123`);
    login(role, demo.email, `${role}123`);
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

      {/* Left Section - Login Form */}
      <section className="flex flex-1 flex-col justify-center items-center px-6 py-12 sm:px-12 md:px-20 xl:px-24 bg-white dark:bg-[#0b1437] transition-colors duration-300 relative">
        <div className="w-full max-w-[420px]">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[36px] font-bold tracking-tight text-[#1b2559] dark:text-white leading-[44px]">
              Sign In
            </h1>
            <p className="mt-2 text-[15px] font-normal text-[#a3aed0] dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          {/* Quick Demo Login Switcher */}
          <div className="mb-6 p-3 rounded-2xl bg-[#f4f7fe] dark:bg-[#111c44] border border-[#e0e5f2] dark:border-[#1b2559]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#a3aed0] dark:text-gray-400 mb-2">
              Instant Demo Access:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("student")}
                className="py-2 px-2.5 rounded-xl bg-white dark:bg-[#0b1437] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-[#e0e5f2] dark:border-[#1b2559] text-xs font-bold text-indigo-600 dark:text-indigo-400 transition cursor-pointer shadow-xs text-center"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("faculty")}
                className="py-2 px-2.5 rounded-xl bg-white dark:bg-[#0b1437] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-[#e0e5f2] dark:border-[#1b2559] text-xs font-bold text-violet-600 dark:text-violet-400 transition cursor-pointer shadow-xs text-center"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="py-2 px-2.5 rounded-xl bg-white dark:bg-[#0b1437] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-[#e0e5f2] dark:border-[#1b2559] text-xs font-bold text-slate-800 dark:text-slate-200 transition cursor-pointer shadow-xs text-center"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSignIn}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#1b2559] dark:text-white"
              >
                Email<span className="text-[#4318ff] dark:text-[#5b38ff]">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@simmmple.com"
                className="w-full h-[54px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent px-5 text-sm text-[#1b2559] dark:text-white placeholder:text-[#a3aed0] outline-none transition-all focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] dark:focus:border-[#5b38ff]"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#1b2559] dark:text-white"
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
                  placeholder="Min. 8 characters"
                  className="w-full h-[54px] rounded-[16px] border border-[#e0e5f2] dark:border-[#1b2559] bg-transparent pl-5 pr-12 text-sm text-[#1b2559] dark:text-white placeholder:text-[#a3aed0] outline-none transition-all focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] dark:focus:border-[#5b38ff]"
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

            {/* Checkbox and Forgot Password */}
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

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[54px] rounded-[16px] bg-[#4318ff] hover:bg-[#3311db] text-white text-base font-bold shadow-lg shadow-[#4318ff]/15 hover:shadow-xl hover:shadow-[#4318ff]/25 transition-all duration-200 active:scale-[0.99] cursor-pointer mt-2"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {error ? (
              <p className="text-sm font-medium text-rose-500">{error}</p>
            ) : null}

            {/* Not Registered Line */}
            <div className="text-sm text-[#1b2559] dark:text-white pt-1">
              Not registered yet?{" "}
              <a
                href="#"
                className="font-bold text-[#4318ff] dark:text-[#5b38ff] hover:underline"
              >
                Create an Account
              </a>
            </div>

            {/* Or Separator */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-[1px] bg-[#e0e5f2] dark:bg-[#1b2559]"></div>
              <span className="text-sm text-[#a3aed0] dark:text-gray-400 font-normal">or</span>
              <div className="flex-1 h-[1px] bg-[#e0e5f2] dark:bg-[#1b2559]"></div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="w-full h-[54px] rounded-[16px] bg-[#f4f7fe] dark:bg-[#111c44] hover:bg-[#e9eefb] dark:hover:bg-[#1a275a] flex items-center justify-center text-sm font-medium text-[#1b2559] dark:text-white transition-all active:scale-[0.99] cursor-pointer"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
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
