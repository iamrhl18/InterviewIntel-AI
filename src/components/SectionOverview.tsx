"use client";

import React from "react";
import {
  Building2,
  Calendar,
  MapPin,
  Users,
  Layers,
  Cpu,
  ShieldCheck,
  ExternalLink,
  DollarSign,
  AlertTriangle,
  Info,
} from "lucide-react";
import { CompanyOverview } from "@/types/interview";
import { getCertaintyBadge } from "@/lib/utils";

interface SectionOverviewProps {
  overview: CompanyOverview;
}

export const SectionOverview: React.FC<SectionOverviewProps> = ({ overview }) => {
  const certaintyStyle = getCertaintyBadge(overview.certainty);

  return (
    <div className="space-y-6">
      {/* Overview Top Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {overview.companyName}
              </h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${certaintyStyle.badge}`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {certaintyStyle.label}
              </span>
            </div>
            {overview.tagline && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {overview.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Fact Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Industry */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800/80 dark:bg-slate-950/40">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
              <Layers className="h-3.5 w-3.5 text-indigo-500" />
              Industry
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {overview.industry}
            </p>
          </div>

          {/* Founded */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800/80 dark:bg-slate-950/40">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" />
              Founded
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {overview.founded}
            </p>
          </div>

          {/* Headquarters */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800/80 dark:bg-slate-950/40">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-indigo-500" />
              Headquarters
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {overview.headquarters}
            </p>
          </div>

          {/* Company Size */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800/80 dark:bg-slate-950/40">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
              <Users className="h-3.5 w-3.5 text-indigo-500" />
              Headcount
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {overview.companySize || "Growth Stage"}
            </p>
          </div>
        </div>

        {/* Business Model */}
        {overview.businessModel && (
          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/40 p-4 dark:border-slate-800/60 dark:bg-slate-950/30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              Revenue & Business Model
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {overview.businessModel}
            </p>
          </div>
        )}

        {/* Two Columns: Products & Tech Stack */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Main Products / Services */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Building2 className="h-4 w-4 text-indigo-500" />
                Main Products & Services
              </h4>
              <span className="text-xs text-slate-400">
                {overview.mainProducts.length} core lines
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {overview.mainProducts.map((product, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-2xs dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {product}
                </span>
              ))}
            </div>
          </div>

          {/* Major Technologies & Focus Areas */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Cpu className="h-4 w-4 text-indigo-500" />
                Major Technologies & Focus Areas
              </h4>
              <span className="text-xs text-slate-400">
                {overview.majorTechnologies.length} domains
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {overview.majorTechnologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-1.5 text-xs font-medium text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Uncertainty Notes callout if present */}
        {overview.uncertaintyNotes && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-bold">Data Grounding Note:</span> {overview.uncertaintyNotes}
            </div>
          </div>
        )}

        {/* Primary Sources */}
        {overview.primarySources && overview.primarySources.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Verified Sources & Documentation:
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {overview.primarySources.map((source, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300"
                >
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                  <span>{source.title}</span>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-500 hover:underline dark:text-indigo-400"
                    >
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
