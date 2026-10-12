import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex">
      <Link
        href="/student/dashboard"
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
      >
        VAC Portal
      </Link>
      <p className="mt-8 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Support
      </p>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
        Mind Peace assistant
      </p>
    </aside>
  );
}
