"use client";

import React, { useState } from "react";
import {
  Building2,
  Globe,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Zap,
  Check,
  AlertCircle,
} from "lucide-react";
import { ExperienceLevel, ResearchRequest } from "@/types/interview";

interface ResearchFormProps {
  onSubmit: (data: ResearchRequest) => void;
  isLoading: boolean;
}

interface PresetOption {
  label: string;
  badge: string;
  companyName: string;
  companyUrl: string;
  jobRole: string;
  experienceLevel: ExperienceLevel;
  icon: string;
}

const PRESETS: PresetOption[] = [
  {
    label: "Stripe",
    badge: "Fintech Scale",
    companyName: "Stripe",
    companyUrl: "https://stripe.com",
    jobRole: "Senior Backend Engineer",
    experienceLevel: "3+ years",
    icon: "💳",
  },
  {
    label: "Google",
    badge: "Big Tech",
    companyName: "Google",
    companyUrl: "https://google.com",
    jobRole: "Associate Software Engineer",
    experienceLevel: "Fresher",
    icon: "🔍",
  },
  {
    label: "Figma",
    badge: "Product & WebGL",
    companyName: "Figma",
    companyUrl: "https://figma.com",
    jobRole: "Frontend Infrastructure Engineer",
    experienceLevel: "0-2 years",
    icon: "🎨",
  },
  {
    label: "Datadog",
    badge: "Cloud Observability",
    companyName: "Datadog",
    companyUrl: "https://datadoghq.com",
    jobRole: "Solutions Architect & SRE",
    experienceLevel: "3+ years",
    icon: "📊",
  },
];

const SUGGESTED_ROLES = [
  "Software Engineer",
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Developer",
  "DevOps / SRE Engineer",
  "Data Scientist / ML Engineer",
  "Product Manager",
  "System Architect",
];

export const ResearchForm: React.FC<ResearchFormProps> = ({ onSubmit, isLoading }) => {
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("3+ years");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedName = companyName.trim();
    const trimmedUrl = companyUrl.trim();
    const trimmedRole = jobRole.trim();

    if (!trimmedName && !trimmedUrl) {
      setValidationError("Please provide at least a Company Name or a Company URL.");
      return;
    }

    if (!trimmedRole) {
      setValidationError("Please enter or select a Job Role to tailor your questions.");
      return;
    }

    onSubmit({
      companyName: trimmedName || undefined,
      companyUrl: trimmedUrl || undefined,
      jobRole: trimmedRole,
      experienceLevel,
    });
  };

  const handleApplyPreset = (preset: PresetOption) => {
    setCompanyName(preset.companyName);
    setCompanyUrl(preset.companyUrl);
    setJobRole(preset.jobRole);
    setExperienceLevel(preset.experienceLevel);
    setValidationError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Quick Presets Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          Quick Test Presets:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => handleApplyPreset(preset)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
          >
            <span>{preset.icon}</span>
            <span className="font-semibold">{preset.label}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              ({preset.experienceLevel})
            </span>
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-8 dark:border-slate-800/90 dark:bg-slate-900/95 dark:shadow-none">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header intro */}
          <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Target Company & Interview Profile
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter the target company and role details. Our engine performs real-time URL analysis and grounds 8 dimensions of interview intelligence.
            </p>
          </div>

          {validationError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Grid: Company Name & URL */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Input 1: Company Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="companyName"
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  <Building2 className="h-3.5 w-3.5 text-indigo-500" />
                  1. Company Name
                </label>
                <span className="text-[11px] font-medium text-slate-400">Optional</span>
              </div>
              <div className="relative">
                <input
                  id="companyName"
                  type="text"
                  placeholder="e.g. Stripe, Airbnb, Datadog, Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Official or well-known name of the company.
              </p>
            </div>

            {/* Input 2: Company URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="companyUrl"
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  <Globe className="h-3.5 w-3.5 text-indigo-500" />
                  2. Company URL
                </label>
                <span className="text-[11px] font-medium text-slate-400">Optional</span>
              </div>
              <div className="relative">
                <input
                  id="companyUrl"
                  type="text"
                  placeholder="e.g. https://stripe.com or stripe.com"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Direct website link enables real-time page scraping & tech extraction.
              </p>
            </div>
          </div>

          {/* Input 3: Job Role (Required) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="jobRole"
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                3. Target Job Role <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Required
              </span>
            </div>
            <input
              id="jobRole"
              type="text"
              placeholder="e.g. Full Stack Developer, Senior Backend Engineer, Product Manager"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              disabled={isLoading}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
            />

            {/* Quick Suggestions for Job Roles */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400">Suggestions:</span>
              {SUGGESTED_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setJobRole(role)}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Input 4: Experience Level (Segmented buttons) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Layers className="h-3.5 w-3.5 text-indigo-500" />
                4. Candidate Experience Level
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                Calibrates question difficulty
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(
                [
                  {
                    level: "Fresher" as ExperienceLevel,
                    title: "Fresher / Entry",
                    desc: "Focus on fundamentals, core CS & projects",
                    badge: "Entry Level",
                  },
                  {
                    level: "0-2 years" as ExperienceLevel,
                    title: "0 - 2 Years",
                    desc: "Hands-on execution & team collaboration",
                    badge: "Junior / Mid",
                  },
                  {
                    level: "3+ years" as ExperienceLevel,
                    title: "3+ Years",
                    desc: "System design, scale & technical leadership",
                    badge: "Senior & Lead",
                  },
                ] as const
              ).map((item) => {
                const isSelected = experienceLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setExperienceLevel(item.level)}
                    className={`relative flex flex-col rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20 dark:border-indigo-500 dark:bg-indigo-950/30"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isSelected
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {item.title}
                      </span>
                      {isSelected && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 hover:shadow-xl hover:shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Synthesizing Company Intel & Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Research Company & Generate Intel</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
