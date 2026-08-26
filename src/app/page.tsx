"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ResearchForm } from "@/components/ResearchForm";
import { LoadingProgress } from "@/components/LoadingProgress";
import { ReportDashboard } from "@/components/ReportDashboard";
import { SavedReportsDrawer } from "@/components/SavedReportsDrawer";
import { ResearchRequest, ResearchReport, ApiResponse } from "@/types/interview";
import { AlertCircle, Layers } from "lucide-react";

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
      // Storage ignore
    }
  }, []);

  const saveReportToHistory = (newReport: ResearchReport) => {
    setSavedReports((prev) => {
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
        // Storage ignore
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

      setTimeout(() => {
        const reportEl = document.getElementById("report-container");
        if (reportEl) {
          reportEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
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

  const handleNavigateSection = (section: "research" | "prep" | "mock") => {
    if (section === "research") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById("report-container");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar
        historyCount={savedReports.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
        isMockFallback={isMockFallback}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 flex-1 space-y-6">
        {/* Compact Hero Section */}
        <section className="text-center space-y-2 pt-2 sm:pt-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Prepare smarter for your next interview.
          </h1>

          <p className="mx-auto max-w-xl text-xs sm:text-sm text-slate-500">
            Research a company, understand what matters, and practice questions tailored to your role.
          </p>

          {/* Subtle capabilities row */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              10 Company Questions
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              10 Role Questions
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              8 Behavioral Questions
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Grounded Source Citations
            </span>
          </div>
        </section>

        {/* Research Input Form */}
        <section className="relative">
          <ResearchForm onSubmit={handleResearchSubmit} isLoading={isLoading} />
        </section>

        {/* Error Notification */}
        {error && (
          <div className="mx-auto max-w-3xl rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <div>
                <span className="font-semibold text-red-900">Request Failed: </span>
                <span>{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading Progress State */}
        {isLoading && (
          <section className="py-2">
            <LoadingProgress
              companyName={activeRequest?.companyName}
              companyUrl={activeRequest?.companyUrl}
            />
          </section>
        )}

        {/* Generated Report Dashboard */}
        {report && !isLoading && (
          <section id="report-container" className="pt-2 scroll-mt-16">
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

      {/* Modern Clean SaaS Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Layers className="h-3.5 w-3.5 text-blue-600" />
            <span>InterviewIntel</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-normal">Technical & Corporate Interview Intelligence</span>
          </div>
          <p className="text-[11px] text-slate-400">
            All company claims verified with public web and domain sources.
          </p>
        </div>
      </footer>
    </div>
  );
}
