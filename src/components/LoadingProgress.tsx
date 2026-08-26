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
    desc: "Extracting metadata, product architecture, and public company signals...",
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
    desc: "Mapping High/Medium/Low priorities, STAR frameworks, and verified citations...",
    icon: ShieldCheck,
  },
];

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  companyName,
  companyUrl,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(1), 1500);
    const timer2 = setTimeout(() => setActiveStep(2), 3500);
    const timer3 = setTimeout(() => setActiveStep(3), 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-8 rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-100">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Synthesizing Intelligence Report
          </h3>
          <p className="text-xs text-slate-500">
            Researching {companyName || companyUrl || "Target Company"} and generating grounded interview prep
          </p>
        </div>
      </div>

      {/* Steps List */}
      <div className="mt-6 space-y-3">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = activeStep > idx;
          const isCurrent = activeStep === idx;

          return (
            <div
              key={step.title}
              className={`flex items-start gap-3 rounded-md border p-3.5 transition-colors ${
                isCurrent
                  ? "border-blue-200 bg-blue-50/40"
                  : isDone
                  ? "border-slate-200 bg-slate-50/60"
                  : "border-slate-100 bg-white opacity-40"
              }`}
            >
              <div className="pt-0.5">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                ) : (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] font-medium text-slate-400">
                    {idx + 1}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? "text-blue-900"
                        : isDone
                        ? "text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    {step.title}
                  </h4>
                  {isCurrent && (
                    <span className="text-[11px] font-medium text-blue-600">
                      Processing...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[11px] font-medium text-emerald-600">
                      Complete
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${Math.min(100, (activeStep + 1) * 25)}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Live web signal extraction & Gemini analysis</span>
          <span>{Math.min(100, (activeStep + 1) * 25)}%</span>
        </div>
      </div>
    </div>
  );
};
