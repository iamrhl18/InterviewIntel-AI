"use client";

import React from "react";
import { ShieldCheck, ExternalLink, Info, CheckCircle2, FileCheck } from "lucide-react";
import { SourceCitation } from "@/types/interview";

interface SectionSourcesProps {
  sources: SourceCitation[];
  confidenceRating: {
    score: number;
    label: string;
    explanation: string;
  };
}

export const SectionSources: React.FC<SectionSourcesProps> = ({
  sources,
  confidenceRating,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Data Grounding & Verified Sources
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {confidenceRating.explanation}
          </p>
        </div>

        {/* Score pill */}
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2 dark:border-emerald-900/60 dark:bg-emerald-950/40">
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Grounding Rating
            </div>
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              {confidenceRating.label}
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-sm font-black text-white shadow-sm">
            {confidenceRating.score}%
          </div>
        </div>
      </div>

      {/* Sources List */}
      <div className="mt-5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Referenced Domains & Knowledge Bases:
        </h4>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {sources.map((source, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs dark:border-slate-800/80 dark:bg-slate-950/40"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                  <FileCheck className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{source.title}</span>
                </div>
                {source.note && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {source.note}
                  </p>
                )}
              </div>

              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  <span>Visit</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
