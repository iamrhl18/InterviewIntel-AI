"use client";

import React from "react";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { CompanyOverview } from "@/types/interview";
import { getCertaintyBadge } from "@/lib/utils";

interface SectionOverviewProps {
  overview: CompanyOverview;
}

export const SectionOverview: React.FC<SectionOverviewProps> = ({ overview }) => {
  const certaintyStyle = getCertaintyBadge(overview.certainty);

  return (
    <div className="rounded-lg border border-slate-300 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      {/* Top Title & Certainty */}
      <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">
              {overview.companyName}
            </h3>
            <span
              className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.2 text-[11px] font-medium ${certaintyStyle.badge}`}
            >
              <ShieldCheck className="h-3 w-3" />
              {certaintyStyle.label}
            </span>
          </div>
          {overview.tagline && (
            <p className="mt-0.5 text-xs text-slate-500">
              {overview.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Structured Key Facts Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="rounded border border-slate-200 bg-slate-50/50 p-2.5">
          <span className="text-[11px] font-medium text-slate-500">Industry</span>
          <p className="mt-0.5 text-xs font-semibold text-slate-900">
            {overview.industry}
          </p>
        </div>

        <div className="rounded border border-slate-200 bg-slate-50/50 p-2.5">
          <span className="text-[11px] font-medium text-slate-500">Founded</span>
          <p className="mt-0.5 text-xs font-semibold text-slate-900">
            {overview.founded}
          </p>
        </div>

        <div className="rounded border border-slate-200 bg-slate-50/50 p-2.5">
          <span className="text-[11px] font-medium text-slate-500">Headquarters</span>
          <p className="mt-0.5 text-xs font-semibold text-slate-900">
            {overview.headquarters}
          </p>
        </div>

        <div className="rounded border border-slate-200 bg-slate-50/50 p-2.5">
          <span className="text-[11px] font-medium text-slate-500">Headcount</span>
          <p className="mt-0.5 text-xs font-semibold text-slate-900">
            {overview.companySize || "Growth / Scale"}
          </p>
        </div>
      </div>

      {/* Business Model */}
      {overview.businessModel && (
        <div className="rounded border border-slate-200 bg-slate-50/50 p-3 text-xs">
          <div className="font-semibold text-slate-900">
            Business Model & Revenue Architecture
          </div>
          <p className="mt-1 text-slate-600 leading-relaxed">
            {overview.businessModel}
          </p>
        </div>
      )}

      {/* Products & Tech Stack */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Core Products / Services */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold text-slate-900">
            Core Products & Services
          </h4>
          <div className="flex flex-wrap gap-1">
            {overview.mainProducts.map((product, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700 font-medium"
              >
                {product}
              </span>
            ))}
          </div>
        </div>

        {/* Major Technologies */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold text-slate-900">
            Major Technologies & Technical Domains
          </h4>
          <div className="flex flex-wrap gap-1">
            {overview.majorTechnologies.map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] text-blue-800 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Uncertainty Note */}
      {overview.uncertaintyNotes && (
        <div className="rounded border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
          <span className="font-semibold">Note:</span> {overview.uncertaintyNotes}
        </div>
      )}

      {/* Primary Sources */}
      {overview.primarySources && overview.primarySources.length > 0 && (
        <div className="border-t border-slate-100 pt-2.5 text-xs">
          <span className="text-[11px] font-medium text-slate-400">
            Referenced sources:
          </span>
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            {overview.primarySources.map((source, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] text-slate-600"
              >
                <span>{source.title}</span>
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
