"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Copy,
  Check,
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const priorityStyle = getPriorityColor(question.priority);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `Question: ${question.question}\nPriority: ${question.priority}\nCategory: ${question.category}\nContext: ${question.context}\nTesting: ${question.whatInterviewerIsTesting?.join(", ")}\nStrategy:\n${question.sampleTalkingPoints?.map((tp) => `- ${tp}`).join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-md border transition-colors ${
        isPracticed
          ? "border-emerald-200 bg-emerald-50/20"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {/* Question Header */}
      <div className="flex items-start justify-between gap-3 p-3.5 sm:p-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Checkbox toggle */}
          <button
            type="button"
            onClick={() => onTogglePracticed(question.id)}
            title={isPracticed ? "Mark uncompleted" : "Mark completed"}
            className="mt-0.5 shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isPracticed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <Circle className="h-4 w-4 text-slate-300 hover:text-blue-600" />
            )}
          </button>

          {/* Question info */}
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-xs font-semibold text-slate-400">
                #{String(index + 1).padStart(2, "0")}
              </span>

              {/* Priority badge */}
              <span
                className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.2 text-[10px] font-medium ${priorityStyle.badge}`}
              >
                <span className={`h-1 w-1 rounded-full ${priorityStyle.dot}`} />
                {question.priority}
              </span>

              {/* Category badge */}
              <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.2 text-[10px] uppercase text-slate-600 font-medium">
                {question.category}
              </span>
            </div>

            <h4
              onClick={() => setIsExpanded(!isExpanded)}
              className={`cursor-pointer text-xs sm:text-sm font-medium leading-relaxed ${
                isPracticed
                  ? "text-slate-500 line-through decoration-slate-300"
                  : "text-slate-900 hover:text-blue-600"
              }`}
            >
              {question.question}
            </h4>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy question"
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand answer strategy"}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Strategy Area */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-3.5 sm:p-4 text-xs space-y-2.5">
          {question.context && (
            <div className="text-slate-600">
              <span className="font-semibold text-slate-900 mr-1">Context:</span>
              <span>{question.context}</span>
            </div>
          )}

          {question.whatInterviewerIsTesting && question.whatInterviewerIsTesting.length > 0 && (
            <div className="space-y-1">
              <span className="font-semibold text-slate-900">Evaluation Criteria:</span>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {question.whatInterviewerIsTesting.map((item, idx) => (
                  <span
                    key={idx}
                    className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {question.sampleTalkingPoints && question.sampleTalkingPoints.length > 0 && (
            <div className="rounded border border-slate-200 bg-white p-3 space-y-1">
              <div className="font-semibold text-slate-900">
                Recommended Talking Points:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                {question.sampleTalkingPoints.map((pt, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
