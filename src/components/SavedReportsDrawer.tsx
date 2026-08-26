"use client";

import React from "react";
import {
  X,
  History,
  Trash2,
  ExternalLink,
  Building2,
  Briefcase,
  ArrowRight,
  Clock,
} from "lucide-react";
import { ResearchReport } from "@/types/interview";
import { formatDate } from "@/lib/utils";

interface SavedReportsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedReports: ResearchReport[];
  onSelectReport: (report: ResearchReport) => void;
  onDeleteReport: (id: string) => void;
  onClearAll: () => void;
}

export const SavedReportsDrawer: React.FC<SavedReportsDrawerProps> = ({
  isOpen,
  onClose,
  savedReports,
  onSelectReport,
  onDeleteReport,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white p-6 shadow-2xl dark:bg-slate-900 flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Saved Research History
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List */}
            <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
              {savedReports.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  <p>No saved reports yet.</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Researched companies will automatically be saved here for quick review.
                  </p>
                </div>
              ) : (
                savedReports.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-indigo-300 hover:bg-indigo-50/20 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-indigo-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        onClick={() => {
                          onSelectReport(item);
                          onClose();
                        }}
                        className="cursor-pointer flex-1"
                      >
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                            {item.companyName}
                          </h4>
                          <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                            {item.experienceLevel}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                          {item.targetRole}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(item.generatedAt)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteReport(item.id)}
                        title="Delete from history"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer actions */}
          {savedReports.length > 0 && (
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                onClick={onClearAll}
                className="w-full rounded-xl border border-red-200 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Clear All History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
