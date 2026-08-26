"use client";

import React from "react";
import { CandidateIntelPoint } from "@/types/interview";

interface SectionWhatToKnowProps {
  points: CandidateIntelPoint[];
}

export const SectionWhatToKnow: React.FC<SectionWhatToKnowProps> = ({ points }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Key Company Insights
          </h3>
          <p className="text-xs text-slate-500">
            Critical background points to understand before walking into the interview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {points.map((pt, idx) => (
          <div
            key={pt.id || idx}
            className="flex flex-col justify-between rounded-md border border-slate-200 bg-white p-4 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  {pt.category}
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Insight {idx + 1}
                </span>
              </div>

              <h4 className="mt-2.5 text-xs font-semibold text-slate-900 leading-snug">
                {pt.headline}
              </h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {pt.detail}
              </p>
            </div>

            <div className="mt-3 rounded border border-slate-100 bg-slate-50 p-2.5 text-xs">
              <span className="font-semibold text-slate-900">Why it matters: </span>
              <span className="text-slate-600">{pt.whyItMattersForInterview}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
