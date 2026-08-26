"use client";

import React from "react";
import { ShieldCheck, ExternalLink, FileCheck } from "lucide-react";
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
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      {/* Grounding Header & Score */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <h3 className="text-base font-semibold text-slate-900">
              Source Grounding & Verification
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {confidenceRating.explanation}
          </p>
        </div>

        {/* Clean linear progress score block */}
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 sm:w-64">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Verification Level</span>
            <span className="font-semibold text-slate-900">{confidenceRating.score}% ({confidenceRating.label})</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-600"
              style={{ width: `${confidenceRating.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sources List */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Referenced Knowledge Sources & Links:
        </h4>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {sources.map((source, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 rounded-md border border-slate-200 bg-slate-50/50 p-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-900">
                  <FileCheck className="h-3.5 w-3.5 text-slate-500" />
                  <span>{source.title}</span>
                </div>
                {source.note && (
                  <p className="text-[11px] text-slate-500">
                    {source.note}
                  </p>
                )}
              </div>

              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline shrink-0"
                >
                  <span>Link</span>
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
