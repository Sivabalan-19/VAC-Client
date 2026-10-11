"use client";

import { useState, useCallback } from "react";

export function CollaborativeEditor() {
  const [value, setValue] = useState(
    "// Welcome to Collaborative Workspace\n// Share notes, code snippets, and meeting points here...\n\n"
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  const handleClear = useCallback(() => {
    if (window.confirm("Clear all notes in the collaborative editor?")) {
      setValue("");
    }
  }, []);

  const linesCount = value.split("\n").length;
  const wordsCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charsCount = value.length;

  return (
    <div className="h-full w-full flex flex-col bg-white text-slate-900 overflow-hidden select-text">
      {/* Editor Sub-toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50/80 border-b border-slate-200 text-xs text-slate-600 select-none">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 font-mono">
            {linesCount} {linesCount === 1 ? "line" : "lines"}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 font-mono">{wordsCount} words</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 font-mono">{charsCount} chars</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-white border border-slate-200 transition-colors cursor-pointer"
            title="Copy all content"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            title="Clear content"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-white">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Start typing your notes or code here..."
          spellCheck={false}
          style={{
            color: "#0f172a",
            backgroundColor: "#ffffff",
            caretColor: "#4f46e5",
          }}
          className="w-full h-full p-4 text-sm font-mono leading-relaxed bg-white text-slate-900 placeholder:text-slate-400 border-none outline-none resize-none scrollbar-none overflow-y-auto selection:bg-indigo-100 selection:text-indigo-900"
        />
      </div>
    </div>
  );
}
