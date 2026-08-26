"use client";

import React, { useState } from "react";
import {
  Building2,
  Globe,
  Briefcase,
  Layers,
  ArrowRight,
  AlertCircle,
  Check,
  Sparkles,
} from "lucide-react";
import { ExperienceLevel, ResearchRequest } from "@/types/interview";

interface ResearchFormProps {
  onSubmit: (data: ResearchRequest) => void;
  isLoading: boolean;
}

interface PresetOption {
  label: string;
  companyName: string;
  companyUrl: string;
  jobRole: string;
  experienceLevel: ExperienceLevel;
}

const PRESETS: PresetOption[] = [
  {
    label: "Stripe",
    companyName: "Stripe",
    companyUrl: "https://stripe.com",
    jobRole: "Senior Backend Engineer",
    experienceLevel: "3+ years",
  },
  {
    label: "Google",
    companyName: "Google",
    companyUrl: "https://google.com",
    jobRole: "Software Engineer",
    experienceLevel: "Fresher",
  },
  {
    label: "Figma",
    companyName: "Figma",
    companyUrl: "https://figma.com",
    jobRole: "Frontend Engineer",
    experienceLevel: "0-2 years",
  },
  {
    label: "Datadog",
    companyName: "Datadog",
    companyUrl: "https://datadoghq.com",
    jobRole: "Systems & SRE Engineer",
    experienceLevel: "3+ years",
  },
];

const SUGGESTED_ROLES = [
  "Software Engineer",
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Developer",
  "DevOps / SRE",
  "Data Engineer",
  "Product Manager",
  "Engineering Manager",
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
      setValidationError("Please enter a Company Name or Company URL.");
      return;
    }

    if (!trimmedRole) {
      setValidationError("Please specify a Job Role to tailor the interview intelligence.");
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
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Quick Test Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Quick Presets:</span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <span>{preset.label}</span>
              <span className="text-[10px] text-slate-400">({preset.experienceLevel})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Research Parameters
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Provide the target company and role details. The engine will extract official company signals and generate 28 targeted interview questions.
            </p>
          </div>

          {validationError && (
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Grid: Company Name & Company URL */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Company Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="companyName"
                className="block text-xs font-medium text-slate-700"
              >
                Company Name <span className="text-slate-400 font-normal">(Optional if URL provided)</span>
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="e.g. Stripe, Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-60"
              />
            </div>

            {/* Company URL */}
            <div className="space-y-1.5">
              <label
                htmlFor="companyUrl"
                className="block text-xs font-medium text-slate-700"
              >
                Company URL <span className="text-slate-400 font-normal">(Optional if name provided)</span>
              </label>
              <input
                id="companyUrl"
                type="text"
                placeholder="e.g. https://stripe.com"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Job Role */}
          <div className="space-y-2">
            <label
              htmlFor="jobRole"
              className="block text-xs font-medium text-slate-700"
            >
              Job Role <span className="text-red-500">*</span>
            </label>
            <input
              id="jobRole"
              type="text"
              placeholder="e.g. Senior Backend Engineer, Full Stack Developer, Product Manager"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              disabled={isLoading}
              required
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-60"
            />

            {/* Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-slate-400">Suggestions:</span>
              {SUGGESTED_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setJobRole(role)}
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Experience Level
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {(
                [
                  {
                    level: "Fresher" as ExperienceLevel,
                    title: "Fresher / Entry Level",
                    desc: "Core fundamentals & problem solving",
                  },
                  {
                    level: "0-2 years" as ExperienceLevel,
                    title: "0 - 2 Years (Junior)",
                    desc: "Hands-on execution & team workflows",
                  },
                  {
                    level: "3+ years" as ExperienceLevel,
                    title: "3+ Years (Mid / Senior)",
                    desc: "System design, scale & trade-offs",
                  },
                ] as const
              ).map((item) => {
                const isSelected = experienceLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setExperienceLevel(item.level)}
                    className={`flex flex-col rounded-md border p-3 text-left transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">
                        {item.title}
                      </span>
                      {isSelected && (
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-2 w-2" />
                        </span>
                      )}
                    </div>
                    <span className="mt-0.5 text-[11px] text-slate-500">
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Researching Company & Synthesizing Intel...</span>
                </>
              ) : (
                <>
                  <span>Research Company</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
