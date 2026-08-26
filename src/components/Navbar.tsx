"use client";

import React from "react";
import { Sparkles, History, Compass, FileText, CheckCircle2, ShieldCheck, KeyRound } from "lucide-react";

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
  onReset: () => void;
  isMockFallback?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  historyCount,
  onOpenHistory,
  onReset,
  isMockFallback = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div
          onClick={onReset}
          className="group flex cursor-pointer items-center gap-3 transition-transform hover:scale-[1.01]"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                InterviewIntel<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
              </span>
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-indigo-800">
                v1.0 MVP
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              Corporate Intelligence & Targeted Interview Engine
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Status Indicator */}
          {isMockFallback ? (
            <div className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20 md:flex dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/60">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Demo Mode (Using Built-in Intel)</span>
            </div>
          ) : (
            <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 md:flex dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800/60">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Grounded Web & AI Engine Active</span>
            </div>
          )}

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <History className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>Saved Intel</span>
            {historyCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                {historyCount}
              </span>
            )}
          </button>

          {/* New Search */}
          <button
            onClick={onReset}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Research</span>
          </button>
        </div>
      </div>
    </header>
  );
};
