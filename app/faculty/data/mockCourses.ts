export interface StudentAttendance {
  id: string;
  studentName: string;
  rollNo: string;
  department: string;
  year: string;
  email: string;
  registeredDate: string;
  attendanceStatus: "Present" | "Absent" | "Pending";
  markedTime?: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  type: string; // Webinar, Guest Lecturer, Seminar, Clubs & Societies, Workshop
  category: string;
  mode: "Online" | "Offline" | "Hybrid";
  statusText: string;
  currentStep: number;
  steps: number[];
  imageUrl: string;
  details: string;
  instructor: string;
  department: string;
  deptYear?: string;
  maxIntake: number;
  registeredCount: number;
  attendedCount: number;
  regStartDate: string; // Registration Start Date
  regEndDate: string;   // Registration End Date
  startDate: string;    // Event Start Date (Used for Calendar Badge on photo!)
  endDate: string;      // Event End Date
  location: string;
  credits: number;
  rejectionReason?: string;
  students: StudentAttendance[];
}

export const INITIAL_COURSES: Course[] = [
  {
    id: 1,
    name: "AI TECHNOLOGY - FUTURE OF INDUSTRIAL REVOLUTION",
    code: "VAC-AI-101",
    type: "Webinar",
    category: "Artificial Intelligence",
    mode: "Online",
    statusText: "Attendance Opened",
    currentStep: 3,
    steps: [1, 2, 3, 4],
    imageUrl: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop",
    details: "Webinar explaining key industrial integrations with generative AI models and automation paradigms. Guest Speaker: Dr. Sarah Connor.",
    instructor: "Dr. Sarah Connor & Prof. Alan Turing",
    department: "Computer Science & Engineering",
    maxIntake: 60,
    registeredCount: 54,
    attendedCount: 46,
    regStartDate: "2026-08-15",
    regEndDate: "2026-08-25",
    startDate: "2026-08-28 10:00 AM",
    endDate: "2026-08-29 05:00 PM",
    location: "Google Meet / Lab 304",
    credits: 2,
    students: [
      { id: "S001", studentName: "Aarav Sharma", rollNo: "21CSE01", department: "CSE", year: "3rd Year", email: "aarav.s@univ.edu", registeredDate: "2026-08-20", attendanceStatus: "Present", markedTime: "10:05 AM" },
      { id: "S002", studentName: "Bhavna Patel", rollNo: "21CSE04", department: "CSE", year: "3rd Year", email: "bhavna.p@univ.edu", registeredDate: "2026-08-20", attendanceStatus: "Present", markedTime: "10:06 AM" },
      { id: "S003", studentName: "Chirag Verma", rollNo: "21ECE12", department: "ECE", year: "3rd Year", email: "chirag.v@univ.edu", registeredDate: "2026-08-21", attendanceStatus: "Absent" },
      { id: "S004", studentName: "Divya Nair", rollNo: "22IT05", department: "IT", year: "2nd Year", email: "divya.n@univ.edu", registeredDate: "2026-08-21", attendanceStatus: "Present", markedTime: "10:12 AM" },
      { id: "S005", studentName: "Eshan Gupta", rollNo: "21CSE22", department: "CSE", year: "3rd Year", email: "eshan.g@univ.edu", registeredDate: "2026-08-22", attendanceStatus: "Present", markedTime: "10:15 AM" },
      { id: "S006", studentName: "Farhan Khan", rollNo: "22ECE18", department: "ECE", year: "2nd Year", email: "farhan.k@univ.edu", registeredDate: "2026-08-22", attendanceStatus: "Absent" },
      { id: "S007", studentName: "Gauri Joshi", rollNo: "21IT33", department: "IT", year: "3rd Year", email: "gauri.j@univ.edu", registeredDate: "2026-08-23", attendanceStatus: "Present", markedTime: "10:08 AM" },
      { id: "S008", studentName: "Harsh Vardhan", rollNo: "21ME09", department: "ME", year: "3rd Year", email: "harsh.v@univ.edu", registeredDate: "2026-08-23", attendanceStatus: "Present", markedTime: "10:18 AM" },
    ]
  },
  {
    id: 2,
    name: "BLOCKCHAIN DECENTRALIZED PLATFORMS",
    code: "VAC-BC-202",
    type: "Guest Lecturer",
    category: "Cyber Security & Web3",
    mode: "Hybrid",
    statusText: "Approval Pending...",
    currentStep: 1,
    steps: [1, 2, 3, 4],
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop",
    details: "Guest lecture covering decentralized ledger technology, smart contract security standards, and audits.",
    instructor: "Dr. Satoshi Nakamoto (Guest)",
    department: "Information Technology",
    maxIntake: 50,
    registeredCount: 42,
    attendedCount: 35,
    regStartDate: "2026-08-20",
    regEndDate: "2026-08-30",
    startDate: "2026-09-02 02:00 PM",
    endDate: "2026-09-02 05:00 PM",
    location: "Auditorium Hall B",
    credits: 2,
    students: [
      { id: "S001", studentName: "Aarav Sharma", rollNo: "21CSE01", department: "CSE", year: "3rd Year", email: "aarav.s@univ.edu", registeredDate: "2026-08-20", attendanceStatus: "Present" },
      { id: "S002", studentName: "Bhavna Patel", rollNo: "21CSE04", department: "CSE", year: "3rd Year", email: "bhavna.p@univ.edu", registeredDate: "2026-08-20", attendanceStatus: "Present" }
    ]
  },
  {
    id: 3,
    name: "IOT & EMBEDDED SYSTEM PROTOCOLS",
    code: "VAC-IOT-301",
    type: "Workshop",
    category: "Embedded Systems",
    mode: "Offline",
    statusText: "Attendance Opened",
    currentStep: 3,
    steps: [1, 2, 3, 4],
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
    details: "Hands-on hardware programming workshop on ESP32, MQTT protocols, and real-time sensor cloud streaming.",
    instructor: "Prof. Nikola Tesla",
    department: "Electronics & Communication",
    maxIntake: 45,
    registeredCount: 40,
    attendedCount: 38,
    regStartDate: "2026-08-25",
    regEndDate: "2026-09-05",
    startDate: "2026-09-10 09:30 AM",
    endDate: "2026-09-10 04:30 PM",
    location: "IoT Hardware Lab 102",
    credits: 3,
    students: [
      { id: "S001", studentName: "Aarav Sharma", rollNo: "21CSE01", department: "CSE", year: "3rd Year", email: "aarav.s@univ.edu", registeredDate: "2026-08-20", attendanceStatus: "Present" }
    ]
  },
  {
    id: 4,
    name: "PRODUCT UI/UX DESIGN SYSTEM",
    code: "VAC-UI-405",
    type: "Seminar",
    category: "Design & Media",
    mode: "Online",
    statusText: "Course Completed",
    currentStep: 4,
    steps: [1, 2, 3, 4],
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop",
    details: "Interactive design workshop on crafting design tokens, component architecture, and accessibility standards.",
    instructor: "Ms. Jony Ive",
    department: "Design & Media",
    maxIntake: 80,
    registeredCount: 78,
    attendedCount: 72,
    regStartDate: "2026-08-01",
    regEndDate: "2026-08-10",
    startDate: "2026-08-12 11:00 AM",
    endDate: "2026-08-12 02:00 PM",
    location: "Online Seminar Room 1",
    credits: 1,
    students: []
  },
  {
    id: 5,
    name: "CLOUD INFRASTRUCTURE & DEVOPS",
    code: "VAC-CLD-502",
    type: "Clubs & Societies",
    category: "Cloud Computing",
    mode: "Online",
    statusText: "Approval Pending...",
    currentStep: 1,
    steps: [1, 2, 3, 4],
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop",
    details: "Deep dive into Docker containerization, Kubernetes orchestration, and automated CI/CD deployment pipelines.",
    instructor: "Dr. Linus Torvalds",
    department: "Computer Science & Engineering",
    maxIntake: 100,
    registeredCount: 88,
    attendedCount: 80,
    regStartDate: "2026-09-01",
    regEndDate: "2026-09-12",
    startDate: "2026-09-15 10:00 AM",
    endDate: "2026-09-15 01:00 PM",
    location: "Google Meet",
    credits: 2,
    students: []
  }
];
