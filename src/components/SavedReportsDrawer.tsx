"use client";

import React from "react";
import { X, History, Trash2, Clock, Building2, Briefcase } from "lucide-react";
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white p-6 shadow-xl flex flex-col justify-between border-l border-slate-200">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Saved Research Reports
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="mt-4 space-y-2.5 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
              {savedReports.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  <p>No saved reports.</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Generated company reports are automatically saved here locally.
                  </p>
                </div>
              ) : (
                savedReports.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-md border border-slate-200 bg-white p-3.5 transition-colors hover:border-slate-300 hover:bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        onClick={() => {
                          onSelectReport(item);
                          onClose();
                        }}
                        className="cursor-pointer flex-1 space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600">
                            {item.companyName}
                          </h4>
                          <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.2 text-[10px] text-slate-600">
                            {item.experienceLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {item.targetRole}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(item.generatedAt)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteReport(item.id)}
                        title="Delete from saved reports"
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer actions */}
          {savedReports.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <button
                onClick={onClearAll}
                className="w-full rounded-md border border-red-200 bg-white py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Clear All Saved Reports
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
