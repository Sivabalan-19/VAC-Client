"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_COURSES, Course, StudentAttendance } from "../faculty/data/mockCourses";

export type Role = "student" | "faculty" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  rollNo?: string;
  department?: string;
  avatar?: string;
}

export interface SessionInfo {
  id: string;
  dayLabel: string;
  dateStr: string;
  sessionName: string;
  timeRange: string;
}

export const DEFAULT_SESSIONS: SessionInfo[] = [
  { id: "d1s1", dayLabel: "Day 1", dateStr: "28 Aug 2026", sessionName: "Session 1 (Morning)", timeRange: "10:00 AM - 01:00 PM" },
  { id: "d1s2", dayLabel: "Day 1", dateStr: "28 Aug 2026", sessionName: "Session 2 (Afternoon)", timeRange: "02:00 PM - 05:00 PM" },
  { id: "d2s1", dayLabel: "Day 2", dateStr: "29 Aug 2026", sessionName: "Session 1 (Morning)", timeRange: "10:00 AM - 01:00 PM" },
  { id: "d2s2", dayLabel: "Day 2", dateStr: "29 Aug 2026", sessionName: "Session 2 (Afternoon)", timeRange: "02:00 PM - 05:00 PM" },
];

export const DEMO_USERS: Record<Role, User> = {
  student: {
    id: "S001",
    name: "Aarav Sharma",
    email: "student@example.com",
    role: "student",
    rollNo: "21CSE01",
    department: "Computer Science & Engineering",
  },
  faculty: {
    id: "F001",
    name: "Dr. Sarah Connor",
    email: "faculty@example.com",
    role: "faculty",
    department: "Computer Science & Engineering",
  },
  admin: {
    id: "A001",
    name: "Dr. Robert Vance",
    email: "admin@example.com",
    role: "admin",
    department: "Dean of Academics",
  },
};

interface StoreContextType {
  user: User | null;
  courses: Course[];
  registeredCourseIds: number[];
  sessionAttendance: Record<number, Record<string, Record<string, "Present" | "Absent">>>;
  darkMode: boolean;
  isLoaded: boolean;
  login: (role: Role, email?: string, password?: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  toggleDarkMode: () => void;
  registerCourse: (courseId: number) => { success: boolean; message: string };
  cancelRegistration: (courseId: number) => { success: boolean; message: string };
  createCourse: (courseData: Partial<Course>) => Course;
  updateCourseStatus: (courseId: number, statusText: string, rejectionReason?: string) => void;
  updateStudentAttendance: (courseId: number, sessionId: string, studentId: string, status: "Present" | "Absent") => void;
  markAllPresent: (courseId: number, sessionId: string) => void;
  getCourseAttendanceMetrics: (courseId: number) => {
    sessionRates: Record<string, number>;
    overallRate: number;
    totalEnrolled: number;
    attendedEnrolled: number;
  };
  getStudentAttendanceSummary: () => {
    totalDays: number;
    attendedDays: number;
    absentDays: number;
    percentage: number;
  };
  resetStore: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "vac_in_memory_store_v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(DEMO_USERS.student);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  
  // Default pre-registered course IDs for student Aarav Sharma (Course 1, 2, 3, 4)
  const [registeredCourseIds, setRegisteredCourseIds] = useState<number[]>([1, 2, 3, 4]);

  // Initial session attendance map
  const [sessionAttendance, setSessionAttendance] = useState<Record<number, Record<string, Record<string, "Present" | "Absent">>>>(() => {
    const initial: Record<number, Record<string, Record<string, "Present" | "Absent">>> = {};
    INITIAL_COURSES.forEach((course) => {
      initial[course.id] = {};
      DEFAULT_SESSIONS.forEach((s) => {
        initial[course.id][s.id] = {};
        course.students.forEach((st) => {
          initial[course.id][s.id][st.id] = st.attendanceStatus === "Present" ? "Present" : "Absent";
        });
      });
    });
    return initial;
  });

  // Apply dark mode to document
  const applyTheme = (isDark: boolean) => {
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Initialize Store from LocalStorage / Seed on client mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const isDark = savedTheme ? JSON.parse(savedTheme) : false;
      setDarkMode(isDark);
      applyTheme(isDark);

      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.courses && Array.isArray(parsed.courses)) {
          setCourses(parsed.courses);
        }
        if (parsed.registeredCourseIds && Array.isArray(parsed.registeredCourseIds)) {
          setRegisteredCourseIds(parsed.registeredCourseIds);
        }
        if (parsed.sessionAttendance) {
          setSessionAttendance(parsed.sessionAttendance);
        }
        if (parsed.user) {
          setUser(parsed.user);
        }
      } else {
        // First load: seed user
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedU = JSON.parse(storedUser);
            if (parsedU.role && DEMO_USERS[parsedU.role as Role]) {
              setUser(DEMO_USERS[parsedU.role as Role]);
            }
          } catch {
            // keep default student
          }
        }
      }
    } catch (e) {
      console.error("Failed to load store from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          courses,
          registeredCourseIds,
          sessionAttendance,
          user,
        })
      );
    } catch (e) {
      console.error("Failed to persist store to localStorage", e);
    }
  }, [courses, registeredCourseIds, sessionAttendance, user, isLoaded]);

  // Toggle Dark Mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", JSON.stringify(next));
      applyTheme(next);
      return next;
    });
  }, []);

  // Authentication Login
  const login = useCallback((role: Role, email?: string, password?: string) => {
    const matchedUser = DEMO_USERS[role];
    const loggedUser: User = {
      ...matchedUser,
      email: email?.trim() || matchedUser.email,
    };
    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify({ ...loggedUser, isLoggedIn: true }));

    const roleRoutes: Record<Role, string> = {
      student: "/student/dashboard",
      faculty: "/faculty/dashboard",
      admin: "/admin/dashboard",
    };
    router.push(roleRoutes[role]);
  }, [router]);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    router.push("/login");
  }, [router]);

  // Fast switch role for live demo
  const switchRole = useCallback((role: Role) => {
    const newUser = DEMO_USERS[role];
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify({ ...newUser, isLoggedIn: true }));
    const roleRoutes: Record<Role, string> = {
      student: "/student/dashboard",
      faculty: "/faculty/dashboard",
      admin: "/admin/dashboard",
    };
    router.push(roleRoutes[role]);
  }, [router]);

  // Register Course for Student
  const registerCourse = useCallback((courseId: number): { success: boolean; message: string } => {
    const studentUser = user || DEMO_USERS.student;
    const targetCourse = courses.find((c) => c.id === courseId);

    if (!targetCourse) {
      return { success: false, message: "Course not found." };
    }

    if (registeredCourseIds.includes(courseId)) {
      return { success: false, message: `You are already registered for ${targetCourse.name}` };
    }

    if (targetCourse.registeredCount >= targetCourse.maxIntake) {
      return { success: false, message: "Sorry, this course is already at full capacity." };
    }

    const newStudent: StudentAttendance = {
      id: studentUser.id,
      studentName: studentUser.name,
      rollNo: studentUser.rollNo || "21CSE01",
      department: studentUser.department || "CSE",
      year: "3rd Year",
      email: studentUser.email,
      registeredDate: new Date().toISOString().split("T")[0],
      attendanceStatus: "Present",
      markedTime: "10:00 AM",
    };

    setCourses((prevCourses) =>
      prevCourses.map((c) => {
        if (c.id === courseId) {
          const alreadyExists = c.students.some((s) => s.id === newStudent.id || s.rollNo === newStudent.rollNo);
          const updatedStudents = alreadyExists ? c.students : [...c.students, newStudent];
          return {
            ...c,
            registeredCount: c.registeredCount + 1,
            students: updatedStudents,
          };
        }
        return c;
      })
    );

    setRegisteredCourseIds((prev) => [...prev, courseId]);

    // Add student to session attendance
    setSessionAttendance((prev) => {
      const courseSessions = prev[courseId] || {};
      const updatedSessions = { ...courseSessions };
      DEFAULT_SESSIONS.forEach((s) => {
        if (!updatedSessions[s.id]) updatedSessions[s.id] = {};
        updatedSessions[s.id][newStudent.id] = "Present";
      });
      return {
        ...prev,
        [courseId]: updatedSessions,
      };
    });

    return { success: true, message: `Successfully registered for ${targetCourse.name}!` };
  }, [courses, registeredCourseIds, user]);

  // Cancel Registration
  const cancelRegistration = useCallback((courseId: number): { success: boolean; message: string } => {
    const studentUser = user || DEMO_USERS.student;
    const targetCourse = courses.find((c) => c.id === courseId);

    if (!targetCourse) {
      return { success: false, message: "Course not found." };
    }

    setCourses((prevCourses) =>
      prevCourses.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            registeredCount: Math.max(0, c.registeredCount - 1),
            students: c.students.filter((s) => s.id !== studentUser.id && s.rollNo !== studentUser.rollNo),
          };
        }
        return c;
      })
    );

    setRegisteredCourseIds((prev) => prev.filter((id) => id !== courseId));

    return { success: true, message: `Registration cancelled for ${targetCourse.name}.` };
  }, [courses, user]);

  // Create Course (Faculty or Admin)
  const createCourse = useCallback((courseData: Partial<Course>): Course => {
    const nextId = courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
    const newCourse: Course = {
      id: nextId,
      name: courseData.name || "NEW VALUE ADDED COURSE",
      code: courseData.code || `VAC-NEW-${nextId}01`,
      type: courseData.type || "Webinar",
      category: courseData.category || "Artificial Intelligence",
      mode: (courseData.mode as any) || "Online",
      statusText: courseData.statusText || "Approval Pending...",
      currentStep: courseData.currentStep || 1,
      steps: [1, 2, 3, 4],
      imageUrl:
        courseData.imageUrl ||
        "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop",
      details:
        courseData.details ||
        "Comprehensive Value Added Course covering modern engineering, practical techniques, and real-world implementations.",
      instructor: courseData.instructor || user?.name || "Dr. Sarah Connor",
      department: courseData.department || user?.department || "Computer Science & Engineering",
      maxIntake: Number(courseData.maxIntake) || 60,
      registeredCount: 0,
      attendedCount: 0,
      regStartDate: courseData.regStartDate || new Date().toISOString().split("T")[0],
      regEndDate: courseData.regEndDate || "2026-09-15",
      startDate: courseData.startDate || "2026-09-20 10:00 AM",
      endDate: courseData.endDate || "2026-09-21 05:00 PM",
      location: courseData.location || "Lab 304 / Online Portal",
      credits: Number(courseData.credits) || 2,
      students: [],
    };

    setCourses((prev) => [newCourse, ...prev]);

    // Initialize sessions for the new course
    setSessionAttendance((prev) => {
      const newCourseSessions: Record<string, Record<string, "Present" | "Absent">> = {};
      DEFAULT_SESSIONS.forEach((s) => {
        newCourseSessions[s.id] = {};
      });
      return {
        ...prev,
        [newCourse.id]: newCourseSessions,
      };
    });

    return newCourse;
  }, [courses, user]);

  // Update Course Status (Admin / Governance)
  const updateCourseStatus = useCallback((courseId: number, statusText: string, rejectionReason?: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const isApproved = statusText.includes("Opened") || statusText.includes("Attendance") || statusText.includes("Approved");
          return {
            ...c,
            statusText,
            currentStep: isApproved ? 3 : c.currentStep,
            rejectionReason: rejectionReason !== undefined ? rejectionReason : c.rejectionReason,
          };
        }
        return c;
      })
    );
  }, []);

  // Update Individual Student Attendance for a Course & Session
  const updateStudentAttendance = useCallback(
    (courseId: number, sessionId: string, studentId: string, status: "Present" | "Absent") => {
      setSessionAttendance((prev) => {
        const courseSessions = prev[courseId] || {};
        const sessionRecord = courseSessions[sessionId] || {};
        return {
          ...prev,
          [courseId]: {
            ...courseSessions,
            [sessionId]: {
              ...sessionRecord,
              [studentId]: status,
            },
          },
        };
      });

      // Update student's primary attendance status on the course
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id === courseId) {
            const updatedStudents = c.students.map((st) =>
              st.id === studentId ? { ...st, attendanceStatus: status, markedTime: status === "Present" ? "10:00 AM" : undefined } : st
            );
            const attendedCount = updatedStudents.filter((s) => s.attendanceStatus === "Present").length;
            return {
              ...c,
              attendedCount,
              students: updatedStudents,
            };
          }
          return c;
        })
      );
    },
    []
  );

  // Mark All Present for a Session
  const markAllPresent = useCallback((courseId: number, sessionId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedStudents: StudentAttendance[] = c.students.map((st) => ({
            ...st,
            attendanceStatus: "Present",
            markedTime: "10:00 AM",
          }));
          return {
            ...c,
            attendedCount: updatedStudents.length,
            students: updatedStudents,
          };
        }
        return c;
      })
    );

    setSessionAttendance((prev) => {
      const courseSessions = prev[courseId] || {};
      const updatedSession: Record<string, "Present" | "Absent"> = {};
      const targetCourse = courses.find((c) => c.id === courseId);
      if (targetCourse) {
        targetCourse.students.forEach((st) => {
          updatedSession[st.id] = "Present";
        });
      }
      return {
        ...prev,
        [courseId]: {
          ...courseSessions,
          [sessionId]: updatedSession,
        },
      };
    });
  }, [courses]);

  // Compute Course Attendance Metrics
  const getCourseAttendanceMetrics = useCallback(
    (courseId: number) => {
      const course = courses.find((c) => c.id === courseId);
      const totalEnrolled = course ? course.students.length : 0;
      const courseSessions = sessionAttendance[courseId] || {};
      const sessionRates: Record<string, number> = {};

      let totalPossible = DEFAULT_SESSIONS.length * totalEnrolled;
      let totalActual = 0;

      DEFAULT_SESSIONS.forEach((s) => {
        const records = courseSessions[s.id] || {};
        const presentCount = Object.values(records).filter((st) => st === "Present").length;
        sessionRates[s.id] = totalEnrolled > 0 ? Math.round((presentCount / totalEnrolled) * 100) : 0;
        totalActual += presentCount;
      });

      const overallRate = totalPossible > 0 ? Math.round((totalActual / totalPossible) * 100) : 0;
      const attendedEnrolled = course ? course.students.filter((st) => st.attendanceStatus === "Present").length : 0;

      return {
        sessionRates,
        overallRate,
        totalEnrolled,
        attendedEnrolled,
      };
    },
    [courses, sessionAttendance]
  );

  // Compute Student Attendance Summary
  const getStudentAttendanceSummary = useCallback(() => {
    const totalDays = 90;
    const baseAttended = 81;
    // Calculate bonus/penalty from registered courses
    const studentEnrolledCourses = courses.filter((c) => registeredCourseIds.includes(c.id));
    let presentSessions = 0;
    let totalSessions = 0;

    studentEnrolledCourses.forEach((c) => {
      const courseSessions = sessionAttendance[c.id] || {};
      DEFAULT_SESSIONS.forEach((s) => {
        totalSessions++;
        const studentStatus = courseSessions[s.id]?.[user?.id || "S001"];
        if (studentStatus === "Present") {
          presentSessions++;
        }
      });
    });

    const attendedDays = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * totalDays) : baseAttended;
    const absentDays = totalDays - attendedDays;
    const percentage = Number(((attendedDays / totalDays) * 100).toFixed(1));

    return {
      totalDays,
      attendedDays,
      absentDays,
      percentage,
    };
  }, [courses, registeredCourseIds, sessionAttendance, user]);

  // Reset Store to defaults
  const resetStore = useCallback(() => {
    setCourses(INITIAL_COURSES);
    setRegisteredCourseIds([1, 2, 3, 4]);
    setUser(DEMO_USERS.student);

    const initialAttendance: Record<number, Record<string, Record<string, "Present" | "Absent">>> = {};
    INITIAL_COURSES.forEach((course) => {
      initialAttendance[course.id] = {};
      DEFAULT_SESSIONS.forEach((s) => {
        initialAttendance[course.id][s.id] = {};
        course.students.forEach((st) => {
          initialAttendance[course.id][s.id][st.id] = st.attendanceStatus === "Present" ? "Present" : "Absent";
        });
      });
    });
    setSessionAttendance(initialAttendance);

    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        user,
        courses,
        registeredCourseIds,
        sessionAttendance,
        darkMode,
        isLoaded,
        login,
        logout,
        switchRole,
        toggleDarkMode,
        registerCourse,
        cancelRegistration,
        createCourse,
        updateCourseStatus,
        updateStudentAttendance,
        markAllPresent,
        getCourseAttendanceMetrics,
        getStudentAttendanceSummary,
        resetStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
