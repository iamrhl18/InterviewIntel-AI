"use client";

import React from "react";
import { Calendar, ExternalLink } from "lucide-react";
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
      <div className="rounded-md border border-slate-200 bg-white p-5 text-center text-xs text-slate-500">
        No recent developments recorded for {companyName}.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          Recent Developments ({developments.length})
        </h3>
        <p className="text-xs text-slate-500">
          Recent company news and strategic context to reference during rounds
        </p>
      </div>

      <div className="divide-y divide-slate-100 rounded-md border border-slate-200 bg-white shadow-xs">
        {developments.map((dev, idx) => (
          <div key={dev.id || idx} className="p-3.5 sm:p-4 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  {dev.timeframe}
                </span>
                {dev.sourceName && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                    {dev.sourceName}
                  </span>
                )}
              </div>

              {dev.sourceUrl && (
                <a
                  href={dev.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                >
                  <span>Source</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
              {dev.title}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              {dev.summary}
            </p>

            <div className="rounded border border-slate-100 bg-slate-50 p-2 text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Interview context: </span>
              <span>{dev.howToBringUpInInterview}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
