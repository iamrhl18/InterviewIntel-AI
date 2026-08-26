"use client";

import React from "react";
import { Layers, History, Plus } from "lucide-react";

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
        const el = document.getElementById("report-container");
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand */}
        <div
          onClick={onReset}
          className="flex cursor-pointer items-center gap-2"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-white">
            <Layers className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            InterviewIntel
          </span>
        </div>

        {/* Center / Right Nav Items */}
        <div className="flex items-center gap-1 sm:gap-4">
          <nav className="hidden md:flex items-center gap-0.5 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => handleNavClick("research")}
              className="rounded px-2.5 py-1.5 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Company Research
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("prep")}
              className="rounded px-2.5 py-1.5 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Interview Prep
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("mock")}
              className="rounded px-2.5 py-1.5 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Mock Interview
            </button>
          </nav>

          <div className="hidden h-3.5 w-px bg-slate-200 md:block" />

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {isMockFallback && (
              <span className="hidden lg:inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                Offline Mode
              </span>
            )}

            <button
              onClick={onOpenHistory}
              type="button"
              className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <History className="h-3.5 w-3.5 text-slate-400" />
              <span>Saved Reports</span>
              {historyCount > 0 && (
                <span className="rounded bg-slate-100 px-1 py-0.2 text-[10px] font-semibold text-slate-600">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={onReset}
              type="button"
              className="inline-flex items-center gap-1 rounded bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
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
