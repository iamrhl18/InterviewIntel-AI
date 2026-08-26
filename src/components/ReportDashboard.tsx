"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  Briefcase,
  Layers,
  Printer,
  Copy,
  Check,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  FileText,
  HeartHandshake,
  Newspaper,
  BookOpen,
  ShieldCheck,
  Play,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Clock,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { ResearchReport, QuestionPriority, QuestionCategory, InterviewQuestion } from "@/types/interview";
import { formatDate } from "@/lib/utils";
import { QuestionCard } from "./QuestionCard";
import { SectionOverview } from "./SectionOverview";
import { SectionWhatToKnow } from "./SectionWhatToKnow";
import { SectionRecentNews } from "./SectionRecentNews";
import { SectionPrepTips } from "./SectionPrepTips";
import { SectionSources } from "./SectionSources";

interface ReportDashboardProps {
  report: ResearchReport;
  isMockFallback?: boolean;
}

type TabKey =
  | "all_intel"
  | "overview"
  | "priority_matrix"
  | "company_questions"
  | "role_questions"
  | "hr_questions"
  | "recent_news"
  | "prep_tips"
  | "sources"
  | "mock_interview";

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  report,
  isMockFallback = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("all_intel");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | QuestionPriority>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | QuestionCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [practicedIds, setPracticedIds] = useState<Set<string>>(new Set());

  // Mock Interview State
  const [mockIndex, setMockIndex] = useState(0);
  const [mockNotes, setMockNotes] = useState<Record<string, string>>({});
  const [showMockHints, setShowMockHints] = useState(false);
  const [mockTimerSeconds, setMockTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // All 28 questions consolidated (10 company + 10 role + 8 HR)
  const allQuestions = useMemo(() => {
    return [
      ...report.companyQuestions,
      ...report.roleSpecificQuestions,
      ...report.hrQuestions,
    ];
  }, [report]);

  // Load practiced IDs from localStorage for this report ID
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`interviewintel_practiced_${report.id}`);
      if (saved) {
        setPracticedIds(new Set(JSON.parse(saved)));
      }
    } catch {
      // Ignore
    }
  }, [report.id]);

  // Timer effect for mock interview
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && activeTab === "mock_interview") {
      interval = setInterval(() => {
        setMockTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, activeTab]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const togglePracticed = (id: string) => {
    setPracticedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(
          `interviewintel_practiced_${report.id}`,
          JSON.stringify(Array.from(next))
        );
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Filtered list of questions
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (priorityFilter !== "ALL" && q.priority !== priorityFilter) return false;
      if (categoryFilter !== "ALL" && q.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesContext = q.context?.toLowerCase().includes(query);
        const matchesPoints = q.sampleTalkingPoints?.some((pt) =>
          pt.toLowerCase().includes(query)
        );
        if (!matchesQuestion && !matchesContext && !matchesPoints) return false;
      }
      return true;
    });
  }, [allQuestions, priorityFilter, categoryFilter, searchQuery]);

  const highPriorityCount = allQuestions.filter((q) => q.priority === "HIGH").length;
  const practicedPercentage = Math.round(
    (practicedIds.size / (allQuestions.length || 1)) * 100
  );

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    let md = `# Interview Preparation: ${report.companyName}\n`;
    md += `Role: ${report.targetRole} (${report.experienceLevel})\n`;
    md += `Date: ${formatDate(report.generatedAt)}\n\n`;

    md += `## 1. Company Overview\n`;
    md += `- Industry: ${report.companyOverview.industry}\n`;
    md += `- Founded: ${report.companyOverview.founded}\n`;
    md += `- Headquarters: ${report.companyOverview.headquarters}\n`;
    md += `- Products: ${report.companyOverview.mainProducts.join(", ")}\n`;
    md += `- Tech Stack: ${report.companyOverview.majorTechnologies.join(", ")}\n\n`;

    md += `## 2. Key Insights\n`;
    report.whatYouShouldKnow.forEach((pt, i) => {
      md += `${i + 1}. **${pt.headline}:** ${pt.detail}\n`;
    });

    md += `\n## 3. Interview Questions (${allQuestions.length} Questions)\n`;
    allQuestions.forEach((q, i) => {
      md += `### Q${i + 1} [${q.priority}]: ${q.question}\n`;
      md += `- Strategy: ${q.sampleTalkingPoints.join("; ")}\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentMockQuestion = allQuestions[mockIndex] || allQuestions[0];

  const handleStartMockInterview = () => {
    setActiveTab("mock_interview");
    setIsTimerRunning(true);
    const mockEl = document.getElementById("mock-interview-section");
    mockEl?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full space-y-6">
      {/* Demo Mode Notice */}
      {isMockFallback && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
          <span className="font-semibold">Notice:</span> Currently viewing offline reference intelligence for {report.companyName}. To enable live scraping for any custom company, set <code className="font-mono text-amber-900">GEMINI_API_KEY</code> in <code className="font-mono text-amber-900">.env.local</code>.
        </div>
      )}

      {/* Main Report Header Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-800">
                {report.companyName}
              </span>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                {report.targetRole}
              </span>
              <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800">
                {report.experienceLevel}
              </span>
            </div>

            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Interview Intelligence Report
            </h1>
            <p className="text-xs text-slate-500">
              Generated {formatDate(report.generatedAt)} • Grounded with {report.sourcesCited.length} verified domain sources
            </p>
          </div>

          {/* Actions & Mock Interview CTA */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Start Mock Interview CTA */}
            <button
              onClick={handleStartMockInterview}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-blue-700"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Start Mock Interview</span>
            </button>

            {/* Copy Report */}
            <button
              onClick={handleCopyMarkdown}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            {/* Print / PDF */}
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span>Print PDF</span>
            </button>
          </div>
        </div>

        {/* Preparation Progress & Stats */}
        <div className="mt-5 border-t border-slate-100 pt-5 space-y-4">
          {/* Progress Indicator */}
          <div className="rounded-md border border-slate-100 bg-slate-50/60 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                Preparation Progress ({practicedIds.size} of {allQuestions.length} completed)
              </span>
              <span className="font-semibold text-slate-900">{practicedPercentage}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${practicedPercentage}%` }}
              />
            </div>
          </div>

          {/* 4 Clean Metric Tiles */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <span className="text-[11px] font-medium text-slate-500">Total Questions</span>
              <div className="mt-0.5 text-lg font-semibold text-slate-900">
                {allQuestions.length}
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-3">
              <span className="text-[11px] font-medium text-slate-500">High Priority</span>
              <div className="mt-0.5 text-lg font-semibold text-red-600">
                {highPriorityCount}
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-3">
              <span className="text-[11px] font-medium text-slate-500">Key Insights</span>
              <div className="mt-0.5 text-lg font-semibold text-slate-900">
                {report.whatYouShouldKnow.length}
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-3">
              <span className="text-[11px] font-medium text-slate-500">Grounding Score</span>
              <div className="mt-0.5 text-lg font-semibold text-emerald-600">
                {report.confidenceRating.score}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Tabs">
          {[
            { key: "all_intel", label: "Full Report", count: null },
            { key: "overview", label: "Overview & Insights", count: null },
            {
              key: "priority_matrix",
              label: "Questions Matrix",
              count: allQuestions.length,
            },
            {
              key: "company_questions",
              label: "Company Questions",
              count: report.companyQuestions.length,
            },
            {
              key: "role_questions",
              label: "Role-Specific",
              count: report.roleSpecificQuestions.length,
            },
            {
              key: "hr_questions",
              label: "HR & Culture",
              count: report.hrQuestions.length,
            },
            {
              key: "recent_news",
              label: "Recent News",
              count: report.recentDevelopments.length,
            },
            {
              key: "prep_tips",
              label: "Prep Strategy",
              count: report.prepTips.length,
            },
            {
              key: "sources",
              label: "Sources",
              count: report.sourcesCited.length,
            },
            {
              key: "mock_interview",
              label: "Mock Assessment Mode",
              count: null,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key as TabKey);
                  if (tab.key === "mock_interview") {
                    setIsTimerRunning(true);
                  }
                }}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-medium ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* MOCK INTERVIEW ASSESSMENT INTERFACE */}
      {activeTab === "mock_interview" && (
        <section id="mock-interview-section" className="space-y-4">
          {/* Assessment Header */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    Live Assessment Session
                  </span>
                  <span className="text-xs text-slate-500">
                    {report.companyName} • {report.targetRole}
                  </span>
                </div>
                <h3 className="mt-1 text-base font-semibold text-slate-900">
                  Question {mockIndex + 1} of {allQuestions.length}
                </h3>
              </div>

              {/* Timer & Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-medium text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formatTimer(mockTimerSeconds)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  {isTimerRunning ? "Pause" : "Resume"}
                </button>

                <button
                  type="button"
                  onClick={() => setMockTimerSeconds(0)}
                  className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-400 hover:text-slate-600"
                  title="Reset Timer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Linear Progress across questions */}
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${((mockIndex + 1) / allQuestions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Assessment Question & Answer Workbench */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left: Question Prompt */}
            <div className="space-y-4 lg:col-span-6">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    Q{String(mockIndex + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 text-xs font-medium ${
                      currentMockQuestion.priority === "HIGH"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : currentMockQuestion.priority === "MEDIUM"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {currentMockQuestion.priority} PRIORITY
                  </span>
                  <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs uppercase text-slate-600">
                    {currentMockQuestion.category}
                  </span>
                </div>

                <h2 className="text-base font-semibold text-slate-900 leading-snug">
                  {currentMockQuestion.question}
                </h2>

                {currentMockQuestion.context && (
                  <div className="rounded border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">Interviewer Context: </span>
                    {currentMockQuestion.context}
                  </div>
                )}

                {/* What they test */}
                {currentMockQuestion.whatInterviewerIsTesting && (
                  <div className="space-y-1.5 text-xs">
                    <span className="font-medium text-slate-700">
                      Evaluation Criteria:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentMockQuestion.whatInterviewerIsTesting.map((item, idx) => (
                        <span
                          key={idx}
                          className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hint toggle */}
                <div className="border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowMockHints(!showMockHints)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
                  >
                    {showMockHints ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Hide Strategy & Talking Points</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>Show Recommended Response Points</span>
                      </>
                    )}
                  </button>

                  {showMockHints && currentMockQuestion.sampleTalkingPoints && (
                    <div className="mt-3 rounded border border-blue-100 bg-blue-50/40 p-3 text-xs text-slate-700 space-y-1">
                      <div className="font-semibold text-blue-900">
                        Suggested Framework & Strategy:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        {currentMockQuestion.sampleTalkingPoints.map((pt, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Candidate Answer & Notes Space */}
            <div className="space-y-4 lg:col-span-6">
              <div className="flex flex-col justify-between h-full rounded-lg border border-slate-200 bg-white p-6 shadow-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="candidateNotes"
                      className="text-xs font-semibold text-slate-700"
                    >
                      Candidate Response / Rough Notes
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Auto-saved locally for this question
                    </span>
                  </div>
                  <textarea
                    id="candidateNotes"
                    rows={12}
                    placeholder="Type your structured answer, bullet points, system design architecture, or STAR structure here..."
                    value={mockNotes[currentMockQuestion.id] || ""}
                    onChange={(e) =>
                      setMockNotes((prev) => ({
                        ...prev,
                        [currentMockQuestion.id]: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-200 bg-slate-50/50 p-3 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Bottom navigation controls */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => togglePracticed(currentMockQuestion.id)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                      practicedIds.has(currentMockQuestion.id)
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>
                      {practicedIds.has(currentMockQuestion.id)
                        ? "Marked as Answered"
                        : "Mark as Answered"}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={mockIndex === 0}
                      onClick={() => {
                        setMockIndex((prev) => Math.max(0, prev - 1));
                        setShowMockHints(false);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      disabled={mockIndex === allQuestions.length - 1}
                      onClick={() => {
                        setMockIndex((prev) =>
                          Math.min(allQuestions.length - 1, prev + 1)
                        );
                        setShowMockHints(false);
                      }}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-40"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB: OVERVIEW & INSIGHTS */}
      {(activeTab === "all_intel" || activeTab === "overview") && (
        <section id="section-overview" className="space-y-6">
          <SectionOverview overview={report.companyOverview} />
          <SectionWhatToKnow points={report.whatYouShouldKnow} />
        </section>
      )}

      {/* TAB: PRIORITY QUESTIONS MATRIX */}
      {(activeTab === "all_intel" || activeTab === "priority_matrix") && (
        <section id="section-priority-matrix" className="space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Questions Priority Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Filter by priority level, category, or search specific topics
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-3">
            {/* Priority filter */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs font-medium text-slate-500 mr-1.5 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Priority:
              </span>
              {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((p) => {
                const isSelected = priorityFilter === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriorityFilter(p)}
                    className={`rounded px-2 py-1 text-xs font-medium transition ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p === "ALL" ? "All Priorities" : `${p}`}
                  </button>
                );
              })}
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs font-medium text-slate-500 mr-1.5">Category:</span>
              {(["ALL", "company", "role", "hr"] as const).map((cat) => {
                const isSelected = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`rounded px-2 py-1 text-xs font-medium uppercase transition ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat === "ALL" ? "All Categories" : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Questions List */}
          <div className="space-y-2.5">
            {filteredQuestions.length === 0 ? (
              <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                No questions found matching your filter criteria.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <QuestionCard
                  key={q.id || idx}
                  question={q}
                  index={idx}
                  isPracticed={practicedIds.has(q.id)}
                  onTogglePracticed={togglePracticed}
                />
              ))
            )}
          </div>
        </section>
      )}

      {/* TAB: COMPANY QUESTIONS (10) */}
      {(activeTab === "all_intel" || activeTab === "company_questions") && (
        <section id="section-company-questions" className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Company-Specific Interview Questions
            </h2>
            <p className="text-xs text-slate-500">
              10 targeted questions testing business model, engineering trade-offs, and product architecture
            </p>
          </div>

          <div className="space-y-2.5">
            {report.companyQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id || idx}
                question={q}
                index={idx}
                isPracticed={practicedIds.has(q.id)}
                onTogglePracticed={togglePracticed}
              />
            ))}
          </div>
        </section>
      )}

      {/* TAB: ROLE SPECIFIC (10) */}
      {(activeTab === "all_intel" || activeTab === "role_questions") && (
        <section id="section-role-questions" className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Role-Specific Technical Questions ({report.targetRole})
            </h2>
            <p className="text-xs text-slate-500">
              10 technical questions calibrated for {report.experienceLevel} candidates
            </p>
          </div>

          <div className="space-y-2.5">
            {report.roleSpecificQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id || idx}
                question={q}
                index={idx}
                isPracticed={practicedIds.has(q.id)}
                onTogglePracticed={togglePracticed}
              />
            ))}
          </div>
        </section>
      )}

      {/* TAB: HR & CULTURE (8) */}
      {(activeTab === "all_intel" || activeTab === "hr_questions") && (
        <section id="section-hr-questions" className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              HR & Behavioral Culture Questions
            </h2>
            <p className="text-xs text-slate-500">
              8 behavioral questions evaluating cultural alignment and operating values
            </p>
          </div>

          <div className="space-y-2.5">
            {report.hrQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id || idx}
                question={q}
                index={idx}
                isPracticed={practicedIds.has(q.id)}
                onTogglePracticed={togglePracticed}
              />
            ))}
          </div>
        </section>
      )}

      {/* TAB: RECENT DEVELOPMENTS */}
      {(activeTab === "all_intel" || activeTab === "recent_news") && (
        <section id="section-recent-news" className="space-y-4">
          <SectionRecentNews
            developments={report.recentDevelopments}
            companyName={report.companyName}
          />
        </section>
      )}

      {/* TAB: PREPARATION STRATEGY */}
      {(activeTab === "all_intel" || activeTab === "prep_tips") && (
        <section id="section-prep-tips" className="space-y-4">
          <SectionPrepTips
            tips={report.prepTips}
            suggestedQuestionsToAsk={report.suggestedQuestionsToAskInterviewer}
            companyName={report.companyName}
            roleName={report.targetRole}
          />
        </section>
      )}

      {/* TAB: SOURCES & GROUNDING */}
      {(activeTab === "all_intel" || activeTab === "sources") && (
        <section id="section-sources" className="space-y-4">
          <SectionSources
            sources={report.sourcesCited}
            confidenceRating={report.confidenceRating}
          />
        </section>
      )}
    </div>
  );
};
