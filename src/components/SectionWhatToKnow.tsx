"use client";

import React from "react";
import {
  Compass,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Cpu,
  HeartHandshake,
  DollarSign,
  Crown,
  CheckCircle2,
} from "lucide-react";
import { CandidateIntelPoint } from "@/types/interview";

interface SectionWhatToKnowProps {
  points: CandidateIntelPoint[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "engineering":
      return <Cpu className="h-4 w-4 text-blue-500" />;
    case "strategy":
      return <TrendingUp className="h-4 w-4 text-purple-500" />;
    case "culture":
      return <HeartHandshake className="h-4 w-4 text-emerald-500" />;
    case "product":
      return <Lightbulb className="h-4 w-4 text-amber-500" />;
    case "financial":
      return <DollarSign className="h-4 w-4 text-green-500" />;
    case "leadership":
      return <Crown className="h-4 w-4 text-rose-500" />;
    default:
      return <Compass className="h-4 w-4 text-indigo-500" />;
  }
};

export const SectionWhatToKnow: React.FC<SectionWhatToKnowProps> = ({ points }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            What You Should Know Before the Interview
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {points.length} critical intelligence takeaways to demonstrate unmatched company awareness
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {points.map((pt, idx) => (
          <div
            key={pt.id || idx}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-slate-100 p-1.5 dark:bg-slate-800">
                    {getCategoryIcon(pt.category)}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {pt.category}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Point #{idx + 1}
                </span>
              </div>

              <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                {pt.headline}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {pt.detail}
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-indigo-50/50 p-3 text-xs dark:bg-indigo-950/30">
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-900 shrink-0 dark:text-indigo-300">
                  Why this matters:
                </span>
                <span className="text-indigo-950/80 dark:text-indigo-200/90 leading-normal">
                  {pt.whyItMattersForInterview}
                </span>
              </div>
              {pt.sourceOrConfidence && (
                <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  <span>Source: {pt.sourceOrConfidence}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
