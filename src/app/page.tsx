"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ResearchForm } from "@/components/ResearchForm";
import { LoadingProgress } from "@/components/LoadingProgress";
import { ReportDashboard } from "@/components/ReportDashboard";
import { SavedReportsDrawer } from "@/components/SavedReportsDrawer";
import { ResearchRequest, ResearchReport, ApiResponse } from "@/types/interview";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  BookOpen,
  ArrowDown,
  Building2,
  Cpu,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Home() {
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockFallback, setIsMockFallback] = useState(false);
  const [activeRequest, setActiveRequest] = useState<ResearchRequest | null>(null);
  const [savedReports, setSavedReports] = useState<ResearchReport[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("interviewintel_history");
      if (saved) {
        setSavedReports(JSON.parse(saved));
      }
    } catch {
      // Storage parsing ignore
    }
  }, []);

  const saveReportToHistory = (newReport: ResearchReport) => {
    setSavedReports((prev) => {
      // Remove any existing duplicate by ID or exact company/role match
      const filtered = prev.filter(
        (r) =>
          r.id !== newReport.id &&
          !(
            r.companyName.toLowerCase() === newReport.companyName.toLowerCase() &&
            r.targetRole.toLowerCase() === newReport.targetRole.toLowerCase() &&
            r.experienceLevel === newReport.experienceLevel
          )
      );
      const updated = [newReport, ...filtered].slice(0, 15);
      try {
        localStorage.setItem("interviewintel_history", JSON.stringify(updated));
      } catch {
        // Storage full ignore
      }
      return updated;
    });
  };

  const handleResearchSubmit = async (request: ResearchRequest) => {
    setIsLoading(true);
    setError(null);
    setActiveRequest(request);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const json: ApiResponse<ResearchReport> = await res.json();

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "Failed to generate company research report.");
      }

      setReport(json.data);
      setIsMockFallback(Boolean(json.isMockFallback));
      saveReportToHistory(json.data);

      // Smooth scroll down to the report container
      setTimeout(() => {
        const reportEl = document.getElementById("report-container");
        if (reportEl) {
          reportEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected network error occurred.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
    setActiveRequest(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setSavedReports((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem("interviewintel_history", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handleClearAllHistory = () => {
    setSavedReports([]);
    try {
      localStorage.removeItem("interviewintel_history");
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar
        historyCount={savedReports.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
        isMockFallback={isMockFallback}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 pt-4 sm:pt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-2xs dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI-Powered Corporate Research & Grounded Question Generator</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
            Ace Your Interview With{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Company-Grounded Intelligence
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            Research any company in seconds. Extract verified tech stacks, business models, and generate 28 targeted questions categorized into High, Medium, and Low priorities.
          </p>

          {/* Value props badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 border border-slate-200 shadow-2xs dark:bg-slate-900 dark:border-slate-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 10 Company Questions
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 border border-slate-200 shadow-2xs dark:bg-slate-900 dark:border-slate-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 10 Role Questions
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 border border-slate-200 shadow-2xs dark:bg-slate-900 dark:border-slate-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 8 HR Culture Questions
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 border border-slate-200 shadow-2xs dark:bg-slate-900 dark:border-slate-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Verified Sources Grounding
            </span>
          </div>
        </section>

        {/* Search & Input Form */}
        <section className="relative">
          <ResearchForm onSubmit={handleResearchSubmit} isLoading={isLoading} />
        </section>

        {/* Error Notification */}
        {error && (
          <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-200">
                  Research Generation Error
                </h4>
                <p className="mt-1 text-xs">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Progress State */}
        {isLoading && (
          <section className="py-4">
            <LoadingProgress
              companyName={activeRequest?.companyName}
              companyUrl={activeRequest?.companyUrl}
            />
          </section>
        )}

        {/* Generated Report Dashboard */}
        {report && !isLoading && (
          <section id="report-container" className="pt-4 scroll-mt-20">
            <ReportDashboard report={report} isMockFallback={isMockFallback} />
          </section>
        )}
      </main>

      {/* History Drawer */}
      <SavedReportsDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedReports={savedReports}
        onSelectReport={(selected) => {
          setReport(selected);
          setError(null);
          setTimeout(() => {
            document.getElementById("report-container")?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}
        onDeleteReport={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Modern Footer */}
      <footer className="border-t border-slate-200/80 bg-white/80 py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span>InterviewIntel AI</span>
            <span>•</span>
            <span className="font-normal text-slate-500">
              Corporate Intelligence & Interview Preparation
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Powered by Next.js, TypeScript, Tailwind CSS & Google Gemini. All company claims grounded with source links.
          </p>
        </div>
      </footer>
    </div>
  );
}
