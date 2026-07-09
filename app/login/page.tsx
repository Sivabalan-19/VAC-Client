"use client";

import { useState } from "react";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import EnrollmentStatusBoard from "./elemnt";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

type Role = "student" | "faculty" | "admin";

const ROLES: { id: Role; label: string }[] = [
  { id: "student", label: "Student" },
  { id: "faculty", label: "Faculty" },
  { id: "admin", label: "Admin" },
];

export default function LoginPage() {
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main
      className={`${fraunces.variable} ${plexMono.variable} ${inter.variable} md:overflow-hidden h-screen bg-slate-900 font-[var(--font-sans)]`}
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        {/* Left Section */}
        <section className="flex flex-1 flex-col justify-between bg-slate-900 px-8 py-10 md:px-12 md:py-14">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-500 text-indigo-400 font-semibold">
              VC
            </span>

            <div>
              <h2 className="font-[var(--font-display)] text-lg text-white">
                Value Courses
              </h2>

              <p className="text-xs text-slate-400">
                Enrollment Management Portal
              </p>
            </div>
          </div>

          <div className="my-12 md:my-0">
            <h1 className="max-w-md font-[var(--font-display)] text-4xl font-semibold leading-tight text-white md:text-5xl">
              Every seat tracked,
              <br />
              every enrollment
              <br />
              managed effortlessly.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
              Manage student enrollments, approvals and course capacity through
              one centralized portal built for faculty, administrators and
              students.
            </p>

            <div className="mt-12">
              <EnrollmentStatusBoard />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <p className="text-sm text-slate-500">
              © 2026 Value Courses Portal
            </p>
          </div>
        </section>

        {/* Right Section */}
        <section className="flex flex-1 items-center justify-center bg-slate-50 px-8 py-10 md:px-12 md:py-14">
          <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-slate-900">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue to the Value Courses Portal.
            </p>

            <div className="mt-8 flex rounded-xl border border-slate-300 bg-slate-100 p-1">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    role === r.id
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label
                  htmlFor="identifier"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  {role === "student"
                    ? "Roll Number or Email"
                    : "Email Address"}
                </label>

                <input
                  id="identifier"
                  type="text"
                  placeholder={
                    role === "student"
                      ? "e.g. 22CS001 or student@college.edu"
                      : "you@college.edu"
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-600"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded accent-indigo-600"
                  />
                  Keep me signed in
                </label>

                <a
                  href="#"
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                Sign in as {ROLES.find((r) => r.id === role)?.label}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs uppercase tracking-wider text-slate-400">
                    Secure Login
                  </span>
                </div>
              </div>

              <p className="text-center text-sm leading-6 text-slate-500">
                New Faculty or Admin account?
                <br />
                Contact your department administrator for access.
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
