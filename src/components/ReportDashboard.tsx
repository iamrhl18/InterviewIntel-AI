"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Printer,
  Copy,
  Check,
  Search,
  Filter,
  Play,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Clock,
  CheckCircle2,
  Send,
  Sparkles,
} from "lucide-react";
import { ResearchReport, QuestionPriority, QuestionCategory } from "@/types/interview";
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
  const [mockCategory, setMockCategory] = useState<"ALL" | "company" | "role" | "hr">("company");
  const [mockNotes, setMockNotes] = useState<Record<string, string>>({});
  const [mockSubmitted, setMockSubmitted] = useState<Record<string, boolean>>({});
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

  // Questions for current mock section
  const mockQuestionsList = useMemo(() => {
    if (mockCategory === "company") return report.companyQuestions;
    if (mockCategory === "role") return report.roleSpecificQuestions;
    if (mockCategory === "hr") return report.hrQuestions;
    return allQuestions;
  }, [mockCategory, report, allQuestions]);

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

  const currentMockQuestion = mockQuestionsList[mockIndex] || mockQuestionsList[0];
  const isCurrentMockSubmitted = Boolean(mockSubmitted[currentMockQuestion?.id]);

  const handleStartMockInterview = () => {
    setActiveTab("mock_interview");
    setIsTimerRunning(true);
    const mockEl = document.getElementById("mock-interview-section");
    mockEl?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitAnswer = (questionId: string) => {
    setMockSubmitted((prev) => ({ ...prev, [questionId]: true }));
    togglePracticed(questionId);
  };

  return (
    <div className="w-full space-y-5">
      {/* Demo / Offline Mode Notice */}
      {isMockFallback && (
        <div className="rounded border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
          <span className="font-semibold">Notice:</span>{" "}
          {report.fallbackMessage ||
            `Viewing offline reference data for ${report.companyName}. Add GEMINI_API_KEY in .env.local to enable real-time Gemini AI web synthesis.`}
        </div>
      )}

      {/* Main Report Header Card */}
      <div className="rounded-lg border border-slate-300 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-800">
                {report.companyName}
              </span>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                {report.targetRole}
              </span>
              <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-800 font-medium">
                {report.experienceLevel}
              </span>
            </div>

            <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Interview Intelligence Report
            </h1>
            <p className="text-xs text-slate-500">
              Generated {formatDate(report.generatedAt)} • Grounded with {report.sourcesCited.length} verified domain sources
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleStartMockInterview}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-blue-700"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Start Mock Interview</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
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

            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span>Print PDF</span>
            </button>
          </div>
        </div>

        {/* Preparation Stats Row */}
        <div className="mt-4 border-t border-slate-100 pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="rounded border border-slate-200 bg-slate-50/50 p-2.5">
              <span className="text-[11px] font-medium text-slate-500">Total Questions</span>
              <div className="mt-0.5 text-base font-semibold text-slate-900">
                {allQuestions.length}
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50/50 p-2.5">
              <span className="text-[11px] font-medium text-slate-500">High Priority</span>
              <div className="mt-0.5 text-base font-semibold text-red-600">
                {highPriorityCount}
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50/50 p-2.5">
              <span className="text-[11px] font-medium text-slate-500">Key Insights</span>
              <div className="mt-0.5 text-base font-semibold text-slate-900">
                {report.whatYouShouldKnow.length}
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50/50 p-2.5">
              <span className="text-[11px] font-medium text-slate-500">Verification</span>
              <div className="mt-0.5 text-base font-semibold text-emerald-600">
                {report.confidenceRating.score}% ({report.confidenceRating.label})
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
            { key: "overview", label: "Company Overview", count: null },
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
              label: "Role Questions",
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
              label: "Mock Assessment",
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
                className={`inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] ${
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
          <div className="rounded-lg border border-slate-300 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    Mock Assessment
                  </span>
                  <span className="text-xs text-slate-500">
                    {report.companyName} • {report.targetRole}
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-semibold text-slate-900">
                  Question {mockIndex + 1} of {mockQuestionsList.length}
                </h3>
              </div>

              {/* Set selector & Timer */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded border border-slate-200 bg-slate-50 p-0.5 text-xs">
                  {(
                    [
                      { key: "company", label: "Company (10)" },
                      { key: "role", label: "Role (10)" },
                      { key: "hr", label: "HR (8)" },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => {
                        setMockCategory(cat.key);
                        setMockIndex(0);
                      }}
                      className={`rounded px-2 py-0.5 text-[11px] font-medium transition ${
                        mockCategory === cat.key
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>{formatTimer(mockTimerSeconds)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                >
                  {isTimerRunning ? "Pause" : "Resume"}
                </button>
              </div>
            </div>

            {/* Linear Progress */}
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${((mockIndex + 1) / mockQuestionsList.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Assessment Layout */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left: Question Prompt & Context */}
            <div className="space-y-4 lg:col-span-6">
              <div className="rounded-lg border border-slate-300 bg-white p-5 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      Q{String(mockIndex + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`rounded border px-1.5 py-0.2 text-[10px] font-medium ${
                        currentMockQuestion.priority === "HIGH"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : currentMockQuestion.priority === "MEDIUM"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {currentMockQuestion.priority} PRIORITY
                    </span>
                    <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.2 text-[10px] uppercase text-slate-600">
                      {currentMockQuestion.category}
                    </span>
                  </div>

                  {practicedIds.has(currentMockQuestion.id) && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Answered
                    </span>
                  )}
                </div>

                <h2 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  {currentMockQuestion.question}
                </h2>

                {currentMockQuestion.context && (
                  <div className="rounded border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">Context: </span>
                    {currentMockQuestion.context}
                  </div>
                )}

                {currentMockQuestion.whatInterviewerIsTesting && (
                  <div className="space-y-1 text-xs">
                    <span className="font-medium text-slate-700">
                      Assessment Criteria:
                    </span>
                    <div className="flex flex-wrap gap-1">
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
              </div>

              {/* Evaluation Panel (Revealed after submission or on demand) */}
              {isCurrentMockSubmitted && (
                <div className="rounded-lg border border-slate-300 bg-white p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Strategy & Evaluation Benchmark
                    </h4>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                      Completed
                    </span>
                  </div>

                  {currentMockQuestion.sampleTalkingPoints && (
                    <div className="space-y-1.5 text-xs">
                      <span className="font-medium text-slate-800">
                        Key Points to Check in Your Answer:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {currentMockQuestion.sampleTalkingPoints.map((pt, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentMockQuestion.suggestedFramework && (
                    <div className="text-[11px] text-slate-500 pt-1">
                      Suggested Framework: <span className="font-medium text-slate-700">{currentMockQuestion.suggestedFramework}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Answer Input & Submission Workbench */}
            <div className="space-y-3 lg:col-span-6">
              <div className="flex flex-col justify-between rounded-lg border border-slate-300 bg-white p-5 shadow-xs min-h-[380px]">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="candidateAnswer"
                      className="text-xs font-semibold text-slate-700"
                    >
                      Answer Input
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Technical breakdown or STAR notes
                    </span>
                  </div>
                  <textarea
                    id="candidateAnswer"
                    rows={12}
                    placeholder="Write your structured response, system trade-offs, or talking points..."
                    value={mockNotes[currentMockQuestion.id] || ""}
                    onChange={(e) =>
                      setMockNotes((prev) => ({
                        ...prev,
                        [currentMockQuestion.id]: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 bg-slate-50/50 p-3 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Submit & Navigation Bar */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => handleSubmitAnswer(currentMockQuestion.id)}
                    className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
                  >
                    <Send className="h-3 w-3" />
                    <span>{isCurrentMockSubmitted ? "Update Submission" : "Submit Answer"}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={mockIndex === 0}
                      onClick={() => setMockIndex((prev) => Math.max(0, prev - 1))}
                      className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Prev</span>
                    </button>

                    <button
                      type="button"
                      disabled={mockIndex === mockQuestionsList.length - 1}
                      onClick={() =>
                        setMockIndex((prev) =>
                          Math.min(mockQuestionsList.length - 1, prev + 1)
                        )
                      }
                      className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <span>Next</span>
                      <ArrowRight className="h-3 w-3" />
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
        <section id="section-overview" className="space-y-4">
          <SectionOverview overview={report.companyOverview} />
          <SectionWhatToKnow points={report.whatYouShouldKnow} />
        </section>
      )}

      {/* TAB: PRIORITY QUESTIONS MATRIX */}
      {(activeTab === "all_intel" || activeTab === "priority_matrix") && (
        <section id="section-priority-matrix" className="space-y-3">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Questions Priority Matrix ({filteredQuestions.length})
              </h2>
              <p className="text-xs text-slate-500">
                Filter questions by urgency level, category, or search keywords
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white py-1 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-200 bg-white p-2.5">
            {/* Priority filter */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-medium text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Priority:
              </span>
              {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((p) => {
                const isSelected = priorityFilter === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriorityFilter(p)}
                    className={`rounded px-2 py-0.5 text-[11px] font-medium transition ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p === "ALL" ? "All" : p}
                  </button>
                );
              })}
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-medium text-slate-500 mr-1">Category:</span>
              {(["ALL", "company", "role", "hr"] as const).map((cat) => {
                const isSelected = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`rounded px-2 py-0.5 text-[11px] font-medium uppercase transition ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat === "ALL" ? "All" : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Questions List */}
          <div className="space-y-2">
            {filteredQuestions.length === 0 ? (
              <div className="rounded border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
                No questions found matching criteria.
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
        <section id="section-company-questions" className="space-y-2.5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Company Questions (10)
            </h2>
            <p className="text-xs text-slate-500">
              Targeted questions on product architecture, business model, and engineering scale
            </p>
          </div>

          <div className="space-y-2">
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
        <section id="section-role-questions" className="space-y-2.5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Role-Specific Questions: {report.targetRole} (10)
            </h2>
            <p className="text-xs text-slate-500">
              Technical assessment questions calibrated for {report.experienceLevel} candidates
            </p>
          </div>

          <div className="space-y-2">
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
        <section id="section-hr-questions" className="space-y-2.5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              HR & Behavioral Culture Questions (8)
            </h2>
            <p className="text-xs text-slate-500">
              Behavioral and situational questions evaluating team collaboration and operating principles
            </p>
          </div>

          <div className="space-y-2">
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
        <section id="section-recent-news" className="space-y-3">
          <SectionRecentNews
            developments={report.recentDevelopments}
            companyName={report.companyName}
          />
        </section>
      )}

      {/* TAB: PREPARATION STRATEGY */}
      {(activeTab === "all_intel" || activeTab === "prep_tips") && (
        <section id="section-prep-tips" className="space-y-3">
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
        <section id="section-sources" className="space-y-3">
          <SectionSources
            sources={report.sourcesCited}
            confidenceRating={report.confidenceRating}
          />
        </section>
      )}
    </div>
  );
};
