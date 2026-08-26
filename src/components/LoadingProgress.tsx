"use client";

import React, { useEffect, useState } from "react";
import { Globe, Cpu, HelpCircle, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface LoadingProgressProps {
  companyName?: string;
  companyUrl?: string;
}

const STEPS = [
  {
    title: "Domain Intelligence & Web Scraping",
    desc: "Fetching meta tags, headings, product keywords and public architecture signals...",
    icon: Globe,
  },
  {
    title: "Extracting Core Tech Stack & Business Model",
    desc: "Synthesizing revenue engines, target markets, scale vectors, and engineering practices...",
    icon: Cpu,
  },
  {
    title: "Calibrating Role & Company Interview Questions",
    desc: "Tailoring 10 company-specific, 10 role-specific, and 8 HR culture questions...",
    icon: HelpCircle,
  },
  {
    title: "Grounding Sources & Priority Classification",
    desc: "Mapping High/Med/Low priority matrices, STAR framework tips, and citing official links...",
    icon: ShieldCheck,
  },
];

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  companyName,
  companyUrl,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(1), 1600);
    const timer2 = setTimeout(() => setActiveStep(2), 3800);
    const timer3 = setTimeout(() => setActiveStep(3), 6200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-slate-800/90 dark:bg-slate-900/95">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-50 dark:ring-indigo-950/60">
          <Sparkles className="h-7 w-7 text-white animate-spin" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Conducting Real-Time Company Intelligence
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Researching {companyName || companyUrl || "Target Company"} and generating grounded interview questions
        </p>
      </div>

      {/* Steps List */}
      <div className="mt-8 space-y-4">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = activeStep > idx;
          const isCurrent = activeStep === idx;
          const isPending = activeStep < idx;

          return (
            <div
              key={step.title}
              className={`flex items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${
                isCurrent
                  ? "border-indigo-500/60 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-500/20 dark:border-indigo-500/40 dark:bg-indigo-950/30"
                  : isDone
                  ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                  : "border-slate-100 bg-slate-50/50 opacity-40 dark:border-slate-800/60 dark:bg-slate-950/30"
              }`}
            >
              <div className="pt-0.5">
                {isDone ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                ) : isCurrent ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm animate-pulse">
                    <Icon className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                    <span className="text-xs font-semibold">{idx + 1}</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? "text-indigo-900 dark:text-indigo-300"
                        : isDone
                        ? "text-emerald-900 dark:text-emerald-300"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {step.title}
                  </h4>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />
                      In Progress
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Completed
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live status bar */}
      <div className="mt-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-600 transition-all duration-500"
            style={{ width: `${Math.min(100, (activeStep + 1) * 25)}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Parsing live web & LLM synthesis</span>
          <span>{Math.min(100, (activeStep + 1) * 25)}% Ready</span>
        </div>
      </div>
    </div>
  );
};
