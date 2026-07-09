"use client";

import { useEffect, useState } from "react";

type Row = {
  course: string;
  cycle: string[];
  intervalMs: number;
};

const ROWS: Row[] = [
  {
    course: "DIGITAL MARKETING",
    cycle: ["PENDING", "APPROVED", "OPEN"],
    intervalMs: 2600,
  },
  {
    course: "DATA ANALYTICS",
    cycle: ["PENDING", "APPROVED", "OPEN", "FULL"],
    intervalMs: 3100,
  },
  {
    course: "PUBLIC SPEAKING",
    cycle: ["PENDING", "OPEN", "FULL"],
    intervalMs: 2300,
  },
  {
    course: "PHOTOGRAPHY",
    cycle: ["PENDING", "APPROVED", "CLOSED"],
    intervalMs: 3600,
  },
];

function statusColor(status: string) {
  switch (status) {
    case "OPEN":
      return "text-emerald-400";

    case "APPROVED":
      return "text-blue-400";

    case "FULL":
      return "text-amber-400";

    case "CLOSED":
      return "text-rose-400";

    default:
      return "text-slate-300";
  }
}

function FlapRow({ course, cycle, intervalMs }: Row) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % cycle.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [cycle.length, intervalMs]);

  const status = cycle[index];

  return (
    <div className="flex items-center justify-between border-b border-slate-700 py-3 font-mono text-[13px] tracking-wide last:border-b-0">
      <span className="text-slate-200">{course}</span>

      <span
        key={status}
        className={`w-24 animate-flap text-right ${statusColor(status)}`}
      >
        {status}
      </span>
    </div>
  );
}

export default function EnrollmentStatusBoard() {
  return (
    <div className="w-full max-w-sm">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
        Enrollment Register · Live Status
      </p>

      <div className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-1 shadow-xl">
        {ROWS.map((row) => (
          <FlapRow key={row.course} {...row} />
        ))}
      </div>

      <style jsx global>{`
        @keyframes flap {
          0% {
            transform: rotateX(90deg);
            opacity: 0;
          }
          60% {
            transform: rotateX(-8deg);
            opacity: 1;
          }
          100% {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }

        .animate-flap {
          display: inline-block;
          transform-origin: top center;
          animation: flap 420ms ease-out;
        }
      `}</style>
    </div>
  );
}
