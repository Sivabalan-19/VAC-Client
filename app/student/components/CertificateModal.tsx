"use client";

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { StudentCourse } from "../api";

interface CertificateModalProps {
  course: StudentCourse;
  studentName: string;
  studentRollNo?: string;
  studentDept?: string;
  onClose: () => void;
}

export default function CertificateModal({
  course,
  studentName,
  studentRollNo,
  studentDept,
  onClose,
}: CertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const collegeName = "BANNARI AMMAN INSTITUTE OF TECHNOLOGY";
  const collegeSubtitle = "An Autonomous Institution Affiliated to Anna University • Accredited by NAAC with 'A+' Grade";
  const collegeLocation = "Sathyamangalam - 638401, Erode District, Tamil Nadu";
  const instructorName = course.instructor || "Dr. Sarah Connor";
  const deanName = "Dr. C. Palanisamy";
  const deanTitle = "Principal & Academic Head";
  
  const certId = `BIT-VAC-${new Date().getFullYear()}-${course.id.toString().padStart(4, "0")}-${(studentRollNo || "STD").replace(/[^a-zA-Z0-9]/g, "")}`;
  const issueDate = course.completedOn || new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Download high-resolution PNG using html2canvas
  const handleDownloadImage = async () => {
    if (!certificateRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // 3x scale for ultra crisp print quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeStudentName = studentName.replace(/[^a-zA-Z0-9]/g, "_");
      const safeCourseCode = (course.code || `Course_${course.id}`).replace(/[^a-zA-Z0-9]/g, "_");
      link.href = image;
      link.download = `BIT_Certificate_${safeStudentName}_${safeCourseCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error generating certificate image:", err);
      alert("Failed to download image. You can use 'Print / Save PDF' instead.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(certId);
    alert(`Certificate Verification ID copied: ${certId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      {/* Container */}
      <div className="relative w-full max-w-5xl my-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              100% Attendance Verified • Official Institutional Credential
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Copy Credential ID */}
            <button
              onClick={handleCopyId}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 transition"
              title="Copy ID to clipboard"
            >
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy ID
            </button>

            {/* Direct Image Download */}
            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm transition disabled:opacity-60 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloading ? "Generating PNG..." : "Download Certificate (PNG)"}
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H9v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / PDF
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
              title="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* The Printable Certificate Container */}
        <div className="p-4 sm:p-8 bg-slate-200 dark:bg-slate-950 flex justify-center overflow-x-auto">
          <div
            ref={certificateRef}
            id="certificate-print-area"
            className="relative w-full max-w-[960px] aspect-[1.414/1] bg-white text-slate-900 shadow-2xl p-6 sm:p-9 select-none overflow-hidden flex flex-col justify-between"
            style={{
              fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
              background: "radial-gradient(circle at center, #ffffff 0%, #fdfcf8 100%)",
            }}
          >
            {/* Outer Geometric Frame (Navy + Polished Gold) */}
            <div className="absolute inset-3 sm:inset-4 border-4 border-[#0F1E36] pointer-events-none" />
            <div className="absolute inset-5 sm:inset-6 border border-[#C5A059] pointer-events-none" />
            <div className="absolute inset-6 sm:inset-7 border-2 border-[#D4AF37]/50 pointer-events-none" />

            {/* Corner Decorative Brackets */}
            <div className="absolute top-3.5 left-3.5 w-10 h-10 border-t-4 border-l-4 border-[#C5A059] pointer-events-none" />
            <div className="absolute top-3.5 right-3.5 w-10 h-10 border-t-4 border-r-4 border-[#C5A059] pointer-events-none" />
            <div className="absolute bottom-3.5 left-3.5 w-10 h-10 border-b-4 border-l-4 border-[#C5A059] pointer-events-none" />
            <div className="absolute bottom-3.5 right-3.5 w-10 h-10 border-b-4 border-r-4 border-[#C5A059] pointer-events-none" />

            {/* Subtle Watermark Crest in Center Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
              <img
                src="/logo.png"
                alt="Background Watermark"
                className="w-[450px] h-[450px] object-contain grayscale"
              />
            </div>

            {/* Header: Bannari Amman Institute of Technology Logo & Branding */}
            <div className="relative z-10 text-center pt-1">
              <div className="flex justify-center items-center gap-3 mb-1.5">
                {/* Official College Logo from Login Page */}
                <img
                  src="/logo.png"
                  alt="Bannari Amman Institute of Technology Logo"
                  className="h-16 sm:h-20 object-contain drop-shadow-md"
                />
              </div>

              <h1 className="text-xs sm:text-sm md:text-base font-bold tracking-[0.2em] text-[#0F1E36] uppercase">
                {collegeName}
              </h1>
              <p className="text-[9px] sm:text-[10px] tracking-wider text-[#8A733E] font-medium uppercase mt-0.5">
                {collegeSubtitle}
              </p>
              <p className="text-[8px] sm:text-[9px] text-slate-500 font-sans tracking-wide">
                {collegeLocation}
              </p>

              <div className="flex items-center justify-center gap-3 my-2">
                <div className="h-[1px] w-20 sm:w-28 bg-gradient-to-r from-transparent via-[#C5A059] to-[#C5A059]" />
                <div className="w-2 h-2 rotate-45 bg-[#C5A059]" />
                <div className="h-[1px] w-20 sm:w-28 bg-gradient-to-l from-transparent via-[#C5A059] to-[#C5A059]" />
              </div>

              <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider text-[#0F1E36] uppercase">
                Certificate of Completion & Merit
              </h2>
            </div>

            {/* Body: Recipient & Course Attainment */}
            <div className="relative z-10 text-center my-auto px-4 sm:px-8">
              <p className="text-[11px] sm:text-xs text-slate-500 italic font-serif">
                This is to proudly certify that
              </p>

              {/* Student Name */}
              <div className="my-2 sm:my-2.5">
                <span className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#0F1E36] tracking-wide inline-block border-b-2 border-[#D4AF37] pb-1 px-4 sm:px-8">
                  {studentName}
                </span>
                {(studentRollNo || studentDept) && (
                  <p className="text-[10px] sm:text-xs text-slate-600 font-sans tracking-wider mt-1.5 font-medium">
                    {studentRollNo && `Roll No: ${studentRollNo}`}
                    {studentRollNo && studentDept && " • "}
                    {studentDept && `${studentDept}`}
                  </p>
                )}
              </div>

              <p className="text-[11px] sm:text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed">
                has successfully fulfilled all academic curriculum requirements and demonstrated exemplary discipline in the Value-Added Course
              </p>

              {/* Course Title & Code */}
              <div className="my-2 bg-[#0F1E36]/5 py-2 px-5 rounded border border-[#C5A059]/30 inline-block max-w-2xl">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#0F1E36] tracking-wide uppercase">
                  {course.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-[#8A733E] font-sans font-semibold mt-0.5">
                  {course.code ? `Course Code: ${course.code} • ` : ""}{course.type} ({course.mode}) • {course.credit} Credits
                </p>
              </div>

              {/* 100% Attendance Distinction Ribbon Highlight */}
              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/25 to-amber-500/15 border border-amber-600/40 text-amber-950 text-[10px] sm:text-xs font-bold tracking-wider uppercase font-sans shadow-xs">
                  <svg className="w-3.5 h-3.5 text-amber-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  ★ 100% Attendance Distinction Awarded ★
                </span>
              </div>
            </div>

            {/* Footer: Signatures, Rosette Badge, Dean */}
            <div className="relative z-10 grid grid-cols-3 items-end pt-3 pb-2 px-2 sm:px-6 border-t border-[#C5A059]/30">
              {/* Instructor Signature (Left) */}
              <div className="text-center">
                <div className="h-10 sm:h-12 flex items-end justify-center pb-1">
                  <span
                    className="text-lg sm:text-2xl text-[#1E3A8A] font-serif italic tracking-wide"
                    style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive" }}
                  >
                    {instructorName}
                  </span>
                </div>
                <div className="w-28 sm:w-36 h-[1px] bg-slate-400 mx-auto" />
                <p className="text-[10px] sm:text-xs font-bold text-[#0F1E36] mt-1 font-sans">{instructorName}</p>
                <p className="text-[9px] text-slate-500 font-sans">Course Instructor / Coordinator</p>
              </div>

              {/* Center Medallion Seal & Verification */}
              <div className="flex flex-col items-center justify-center">
                {/* Golden Rosette Badge */}
                <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#99732B] via-[#E6C687] to-[#B38728] shadow-lg border-2 border-white">
                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-dashed border-white/60 flex flex-col items-center justify-center text-center">
                    <span className="text-[8px] font-black tracking-widest text-[#0F1E36] uppercase font-sans">100%</span>
                    <span className="text-[6px] font-bold text-[#0F1E36] uppercase tracking-tighter">PERFECT</span>
                  </div>
                </div>
                <p className="text-[8px] sm:text-[9px] text-slate-500 font-sans mt-1">Issued: {issueDate}</p>
              </div>

              {/* Dean Signature (Right) */}
              <div className="text-center">
                <div className="h-10 sm:h-12 flex items-end justify-center pb-1">
                  <span
                    className="text-lg sm:text-2xl text-[#1E3A8A] font-serif italic tracking-wide"
                    style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive" }}
                  >
                    {deanName}
                  </span>
                </div>
                <div className="w-28 sm:w-36 h-[1px] bg-slate-400 mx-auto" />
                <p className="text-[10px] sm:text-xs font-bold text-[#0F1E36] mt-1 font-sans">{deanName}</p>
                <p className="text-[9px] text-slate-500 font-sans">{deanTitle}</p>
              </div>
            </div>

            {/* Bottom Security Bar */}
            <div className="relative z-10 flex items-center justify-between text-[8px] sm:text-[9px] text-slate-400 font-sans pt-1 border-t border-slate-100">
              <span>Bannari Amman Institute of Technology (BIT)</span>
              <span className="font-mono font-semibold text-slate-600">ID: {certId}</span>
              <span>Autonomous Academic Validation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific style tag to isolate certificate and maintain styling */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-print-area,
          #certificate-print-area * {
            visibility: visible;
          }
          #certificate-print-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            margin: 0 !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
