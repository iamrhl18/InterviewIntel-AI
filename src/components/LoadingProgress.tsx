"use client";

import React, { useEffect, useState } from "react";
import { Globe, Cpu, HelpCircle, ShieldCheck, CheckCircle2 } from "lucide-react";

interface LoadingProgressProps {
  companyName?: string;
  companyUrl?: string;
}

const STEPS = [
  {
    title: "Domain Intelligence & Web Scraping",
    desc: "Extracting metadata, architecture, and public company signals...",
    icon: Globe,
  },
  {
    title: "Synthesizing Tech Stack & Business Model",
    desc: "Analyzing core engineering stack, revenue engines, and competitive moats...",
    icon: Cpu,
  },
  {
    title: "Calibrating Role & Company Interview Questions",
    desc: "Generating 10 company, 10 role-specific, and 8 HR culture questions...",
    icon: HelpCircle,
  },
  {
    title: "Source Grounding & Priority Matrix",
    desc: "Mapping High/Medium/Low priorities, STAR frameworks, and citations...",
    icon: ShieldCheck,
  },
];

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  companyName,
  companyUrl,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(1), 1400);
    const timer2 = setTimeout(() => setActiveStep(2), 3200);
    const timer3 = setTimeout(() => setActiveStep(3), 5200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto my-6 rounded-lg border border-slate-300 bg-white p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-blue-600 border border-blue-100">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Synthesizing Intelligence Report
          </h3>
          <p className="text-xs text-slate-500">
            Researching {companyName || companyUrl || "Target Company"}
          </p>
        </div>
      </div>

      {/* Steps List */}
      <div className="mt-4 space-y-2">
        {STEPS.map((step, idx) => {
          const isDone = activeStep > idx;
          const isCurrent = activeStep === idx;

          return (
            <div
              key={step.title}
              className={`flex items-start gap-2.5 rounded border p-2.5 text-xs transition-colors ${
                isCurrent
                  ? "border-blue-200 bg-blue-50/40"
                  : isDone
                  ? "border-slate-200 bg-slate-50/60"
                  : "border-slate-100 bg-white opacity-40"
              }`}
            >
              <div className="pt-0.5">
                {isDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                ) : (
                  <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-slate-300 text-[9px] text-slate-400">
                    {idx + 1}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-medium ${
                      isCurrent
                        ? "text-blue-900"
                        : isDone
                        ? "text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    {step.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-medium text-blue-600">
                      Processing...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-medium text-emerald-600">
                      Done
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${Math.min(100, (activeStep + 1) * 25)}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Live web signal extraction & analysis</span>
          <span>{Math.min(100, (activeStep + 1) * 25)}%</span>
        </div>
      </div>
    </div>
  );
};
