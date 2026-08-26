"use client";

import React from "react";
import { CheckCircle2, MessageSquare, Sparkles, BookOpen, Target, Award } from "lucide-react";
import { PrepTip } from "@/types/interview";

interface SectionPrepTipsProps {
  tips: PrepTip[];
  suggestedQuestionsToAsk?: string[];
  companyName: string;
  roleName: string;
}

export const SectionPrepTips: React.FC<SectionPrepTipsProps> = ({
  tips,
  suggestedQuestionsToAsk,
  companyName,
  roleName,
}) => {
  return (
    <div className="space-y-6">
      {/* 5 Prep Tips Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Preparation Recommendations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              5 focused preparation steps tailored for {roleName} at {companyName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, idx) => (
            <div
              key={tip.id || idx}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Step {idx + 1}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {tip.category}
                  </span>
                </div>

                <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  {tip.tip}
                </h4>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">Action:</span>{" "}
                {tip.actionableStep}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Value Questions to Ask Interviewer */}
      {suggestedQuestionsToAsk && suggestedQuestionsToAsk.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 dark:border-indigo-950 dark:bg-indigo-950/20">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-base font-bold text-indigo-950 dark:text-indigo-200">
              Questions to Ask Your Interviewer
            </h4>
          </div>
          <p className="mt-1 text-xs text-indigo-900/70 dark:text-indigo-300/70">
            Impress the panel at the end of your interview with these non-generic questions
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {suggestedQuestionsToAsk.map((q, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-xl border border-white/60 bg-white/90 p-3.5 shadow-2xs text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <span className="font-bold text-indigo-600 shrink-0">
                  {idx + 1}.
                </span>
                <span className="leading-relaxed">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
