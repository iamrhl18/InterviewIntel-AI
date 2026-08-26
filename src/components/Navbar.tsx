"use client";

import React from "react";
import {
  Layers,
  History,
  Search,
  BookOpen,
  CheckCircle2,
  FileCheck,
  Plus,
} from "lucide-react";

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
  onReset: () => void;
  isMockFallback?: boolean;
  onNavigateSection?: (section: "research" | "prep" | "mock") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  historyCount,
  onOpenHistory,
  onReset,
  isMockFallback = false,
  onNavigateSection,
}) => {
  const handleNavClick = (section: "research" | "prep" | "mock") => {
    if (onNavigateSection) {
      onNavigateSection(section);
    } else {
      if (section === "research") {
        onReset();
      } else {
        const el = document.getElementById(
          section === "prep" ? "report-container" : "section-mock-interview"
        );
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Brand */}
        <div
          onClick={onReset}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white shadow-xs">
            <Layers className="h-4 w-4 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-slate-900">
              InterviewIntel
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
              v1.0
            </span>
          </div>
        </div>

        {/* Center / Right Nav Items */}
        <div className="flex items-center gap-1 sm:gap-6">
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => handleNavClick("research")}
              className="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Company Research
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("prep")}
              className="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Interview Prep
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("mock")}
              className="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Mock Interview
            </button>
          </nav>

          <div className="h-4 w-px bg-slate-200 hidden md:block" />

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Status indicator (subtle) */}
            {isMockFallback ? (
              <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>Demo Intel Active</span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Live Grounding Active</span>
              </div>
            )}

            {/* Saved Reports Drawer Trigger */}
            <button
              onClick={onOpenHistory}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
            >
              <History className="h-3.5 w-3.5 text-slate-500" />
              <span>Saved Reports</span>
              {historyCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-100 px-1 text-[10px] font-semibold text-slate-700">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Primary Action / New Search */}
            <button
              onClick={onReset}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Research</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
