"use client";

import React from "react";
import { Calendar, ExternalLink, MessageSquare } from "lucide-react";
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
      <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
        No recent developments found for {companyName}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Recent Developments & Strategic Initiatives
          </h3>
          <p className="text-xs text-slate-500">
            Recent announcements and how to reference them in conversation
          </p>
        </div>
      </div>

      {/* Clean Timeline / List format */}
      <div className="divide-y divide-slate-100 rounded-md border border-slate-200 bg-white shadow-xs">
        {developments.map((dev, idx) => (
          <div key={dev.id || idx} className="p-4 sm:p-5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  {dev.timeframe}
                </span>
                {dev.sourceName && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
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
                  <span>Source Reference</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            <h4 className="text-sm font-semibold text-slate-900">
              {dev.title}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              {dev.summary}
            </p>

            <div className="rounded border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-700">
              <span className="font-semibold text-slate-900">How to bring this up: </span>
              <span>{dev.howToBringUpInInterview}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
