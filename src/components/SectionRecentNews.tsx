"use client";

import React from "react";
import { Newspaper, Calendar, ExternalLink, MessageSquareQuote, Sparkles } from "lucide-react";
import { RecentDevelopment } from "@/types/interview";

interface SectionRecentNewsProps {
  developments: RecentDevelopment[];
  companyName: string;
}

export const SectionRecentNews: React.FC<SectionRecentNewsProps> = ({
  developments,
  companyName,
}) => {
  if (!developments || developments.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500">
          No verified recent announcements flagged for this profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Developments & Strategic Initiatives
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recent updates at {companyName} with talking point suggestions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {developments.map((dev, idx) => (
          <div
            key={dev.id || idx}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  {dev.timeframe}
                </span>
                {dev.sourceName && (
                  <span className="text-[11px] font-medium text-slate-400">
                    {dev.sourceName}
                  </span>
                )}
              </div>

              <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                {dev.title}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {dev.summary}
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-950/50">
              <div className="flex items-start gap-1.5">
                <MessageSquareQuote className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Interview Angle:
                  </span>{" "}
                  <span className="text-slate-600 dark:text-slate-300">
                    {dev.howToBringUpInInterview}
                  </span>
                </div>
              </div>

              {dev.sourceUrl && (
                <div className="mt-2 text-right">
                  <a
                    href={dev.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    <span>View Reference</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
