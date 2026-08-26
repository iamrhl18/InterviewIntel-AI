"use client";

import React from "react";
import { CheckCircle2, MessageSquare } from "lucide-react";
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
      {/* 5 Focused Preparation Recommendations */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Preparation Strategy & Recommendations
          </h3>
          <p className="text-xs text-slate-500">
            Actionable steps calibrated for {roleName} at {companyName}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, idx) => (
            <div
              key={tip.id || idx}
              className="flex flex-col justify-between rounded-md border border-slate-200 bg-white p-4 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-semibold text-blue-600">
                    Step {idx + 1}
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-600">
                    {tip.category}
                  </span>
                </div>

                <h4 className="mt-2.5 text-xs font-semibold text-slate-900">
                  {tip.tip}
                </h4>
              </div>

              <div className="mt-3 rounded border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Action: </span>
                {tip.actionableStep}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reverse Interview Questions */}
      {suggestedQuestionsToAsk && suggestedQuestionsToAsk.length > 0 && (
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-semibold text-slate-900">
              Questions to Ask the Interviewer
            </h4>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            High-signal questions to ask at the conclusion of your technical or behavioral rounds
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {suggestedQuestionsToAsk.map((q, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-800"
              >
                <span className="font-mono font-bold text-blue-600 shrink-0">
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
