"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { PrepTip } from "@/types/interview";

interface SuggestedQuestion {
  question: string;
  category?: string;
  rationale?: string;
}

interface SectionPrepTipsProps {
  tips: PrepTip[];
  suggestedQuestionsToAsk?: SuggestedQuestion[];
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
    <div className="space-y-4">
      {/* Focused Preparation Recommendations */}
      <div className="space-y-2.5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Preparation Recommendations (5)
          </h3>
          <p className="text-xs text-slate-500">
            Actionable steps calibrated for {roleName} at {companyName}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, idx) => (
            <div
              key={tip.id || idx}
              className="flex flex-col justify-between rounded-md border border-slate-200 bg-white p-3.5 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs font-semibold text-blue-600">
                    Step {idx + 1}
                  </span>

                  <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium uppercase text-slate-600">
                    {tip.category}
                  </span>
                </div>

                <h4 className="mt-2 text-xs font-semibold text-slate-900">
                  {tip.tip}
                </h4>
              </div>

              <div className="mt-2.5 rounded border border-slate-100 bg-slate-50 p-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">
                  Action:{" "}
                </span>
                {tip.actionableStep}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Questions to Ask the Interviewer */}
      {suggestedQuestionsToAsk &&
        suggestedQuestionsToAsk.length > 0 && (
          <div className="space-y-2.5 rounded-md border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-blue-600" />

              <h4 className="text-xs font-semibold text-slate-900">
                Questions to Ask the Interviewer
              </h4>
            </div>

            <p className="text-xs text-slate-500">
              High-signal questions to ask at the conclusion of your rounds
            </p>

            <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
              {suggestedQuestionsToAsk.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded border border-slate-100 bg-slate-50/70 p-2.5"
                >
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 font-mono text-xs font-bold text-blue-600">
                      {idx + 1}.
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs leading-relaxed text-slate-800">
                        {q.question}
                      </p>

                      {q.category && (
                        <span className="mt-1.5 inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-500">
                          {q.category}
                        </span>
                      )}

                      {q.rationale && (
                        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                          {q.rationale}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};