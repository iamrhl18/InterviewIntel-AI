"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Target,
  Sparkles,
  HelpCircle,
  Award,
  Layers,
  Lightbulb,
} from "lucide-react";
import { InterviewQuestion } from "@/types/interview";
import { getPriorityColor } from "@/lib/utils";

interface QuestionCardProps {
  question: InterviewQuestion;
  index: number;
  isPracticed: boolean;
  onTogglePracticed: (id: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  isPracticed,
  onTogglePracticed,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const priorityStyle = getPriorityColor(question.priority);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `Question: ${question.question}\n\nPriority: ${question.priority}\n\nContext: ${question.context}\n\nWhat They're Testing: ${question.whatInterviewerIsTesting.join(", ")}\n\nTalking Points:\n${question.sampleTalkingPoints.map((tp) => `- ${tp}`).join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
        isPracticed
          ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/15"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-start gap-3.5 flex-1">
          {/* Practiced Checkbox Button */}
          <button
            type="button"
            onClick={() => onTogglePracticed(question.id)}
            title={isPracticed ? "Mark as unpracticed" : "Mark as practiced"}
            className="mt-0.5 shrink-0 transition-transform active:scale-90"
          >
            {isPracticed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
            ) : (
              <Circle className="h-5 w-5 text-slate-300 hover:text-indigo-500 dark:text-slate-600 dark:hover:text-indigo-400" />
            )}
          </button>

          {/* Question title & badges */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                Q{index + 1}
              </span>

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${priorityStyle.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dot}`} />
                {question.priority} PRIORITY
              </span>

              {/* Category */}
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {question.category}
              </span>

              {question.suggestedFramework && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-800/40">
                  <Award className="h-3 w-3" />
                  {question.suggestedFramework}
                </span>
              )}
            </div>

            <h4
              className={`text-base font-semibold leading-snug tracking-tight ${
                isPracticed
                  ? "text-slate-700 line-through decoration-emerald-500/50 dark:text-slate-300"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {question.question}
            </h4>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy question and talking points"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand details"}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Breakdown */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 text-xs space-y-3 dark:border-slate-800 dark:bg-slate-950/40">
          {/* Priority rationale */}
          {question.priorityRationale && (
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 shrink-0 dark:text-white">
                Why this matters:
              </span>
              <span>{question.priorityRationale}</span>
            </div>
          )}

          {/* Context */}
          {question.context && (
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 shrink-0 dark:text-white">
                Context & Angle:
              </span>
              <span>{question.context}</span>
            </div>
          )}

          {/* What they are testing */}
          {question.whatInterviewerIsTesting && question.whatInterviewerIsTesting.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-indigo-500" />
                What the Interviewer Is Testing:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {question.whatInterviewerIsTesting.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-2xs border border-slate-200/80 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sample Talking Points */}
          {question.sampleTalkingPoints && question.sampleTalkingPoints.length > 0 && (
            <div className="space-y-1.5 rounded-lg border border-indigo-100 bg-indigo-50/40 p-3 dark:border-indigo-950/60 dark:bg-indigo-950/20">
              <span className="font-semibold text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Recommended Talking Points & Strategy:
              </span>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                {question.sampleTalkingPoints.map((point, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Experience fit notes if available */}
          {question.experienceFitNotes && (
            <div className="text-[11px] text-slate-400 dark:text-slate-500 italic">
              Level calibration: {question.experienceFitNotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
