"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  Briefcase,
  Layers,
  Sparkles,
  Printer,
  Copy,
  Check,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  Compass,
  FileText,
  HeartHandshake,
  Newspaper,
  BookOpen,
  ShieldCheck,
  Download,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";
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
  | "sources";

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
      // Ignore storage error
    }
  }, [report.id]);

  const togglePracticed = (id: string) => {
    setPracticedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Trigger celebratory confetti if completing all questions
        if (next.size === allQuestions.length) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
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
      // Priority filter
      if (priorityFilter !== "ALL" && q.priority !== priorityFilter) return false;
      // Category filter
      if (categoryFilter !== "ALL" && q.category !== categoryFilter) return false;
      // Search query
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
  const mediumPriorityCount = allQuestions.filter((q) => q.priority === "MEDIUM").length;
  const lowPriorityCount = allQuestions.filter((q) => q.priority === "LOW").length;

  const practicedPercentage = Math.round(
    (practicedIds.size / (allQuestions.length || 1)) * 100
  );

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    let md = `# Interview Preparation Report: ${report.companyName}\n`;
    md += `**Target Role:** ${report.targetRole} (${report.experienceLevel})\n`;
    md += `**Generated At:** ${formatDate(report.generatedAt)}\n\n`;

    md += `## 1. Company Overview\n`;
    md += `- **Industry:** ${report.companyOverview.industry}\n`;
    md += `- **Founded:** ${report.companyOverview.founded}\n`;
    md += `- **Headquarters:** ${report.companyOverview.headquarters}\n`;
    md += `- **Main Products:** ${report.companyOverview.mainProducts.join(", ")}\n`;
    md += `- **Major Tech:** ${report.companyOverview.majorTechnologies.join(", ")}\n\n`;

    md += `## 2. What You Should Know\n`;
    report.whatYouShouldKnow.forEach((pt, i) => {
      md += `### ${i + 1}. ${pt.headline}\n${pt.detail}\n*Why it matters:* ${pt.whyItMattersForInterview}\n\n`;
    });

    md += `## 3. Company Interview Questions (10 Questions)\n`;
    report.companyQuestions.forEach((q, i) => {
      md += `### Q${i + 1} [${q.priority} PRIORITY]: ${q.question}\n`;
      md += `- Context: ${q.context}\n`;
      md += `- Strategy: ${q.sampleTalkingPoints.join("; ")}\n\n`;
    });

    md += `## 4. Role-Specific Questions (${report.targetRole} - 10 Questions)\n`;
    report.roleSpecificQuestions.forEach((q, i) => {
      md += `### Q${i + 1} [${q.priority} PRIORITY]: ${q.question}\n`;
      md += `- Strategy: ${q.sampleTalkingPoints.join("; ")}\n\n`;
    });

    md += `## 5. HR & Culture Questions (8 Questions)\n`;
    report.hrQuestions.forEach((q, i) => {
      md += `### Q${i + 1} [${q.priority} PRIORITY]: ${q.question}\n`;
      md += `- Strategy: ${q.sampleTalkingPoints.join("; ")}\n\n`;
    });

    md += `## 6. Recent Developments\n`;
    report.recentDevelopments.forEach((d) => {
      md += `- **${d.title} (${d.timeframe}):** ${d.summary}\n`;
    });

    md += `\n## 7. Preparation Tips\n`;
    report.prepTips.forEach((t, i) => {
      md += `${i + 1}. **${t.tip}:** ${t.actionableStep}\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Demo Mode Notice if applicable */}
      {isMockFallback && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 shadow-xs dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <Sparkles className="h-4 w-4" />
            <span>Running in Zero-Configuration Demo Mode</span>
          </div>
          <p className="mt-1">
            This comprehensive report was synthesized using our built-in offline intelligence engine. To enable live AI web search & extraction for any custom company, add your free Gemini API key to <code className="rounded bg-amber-100 px-1 py-0.5 font-mono dark:bg-amber-900/60">.env.local</code> as <code className="rounded bg-amber-100 px-1 py-0.5 font-mono dark:bg-amber-900/60">GEMINI_API_KEY</code>.
          </p>
        </div>
      )}

      {/* Main Report Header Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Building2 className="h-3.5 w-3.5" />
                {report.companyName}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                {report.targetRole}
              </span>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {report.experienceLevel}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Interview Intelligence Report
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Generated on {formatDate(report.generatedAt)} • Grounded on verified domain data & LLM synthesis
            </p>
          </div>

          {/* Top Actions & Practice Tracker */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Progress counter pill */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="text-right">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Prep Progress
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {practicedIds.size} / {allQuestions.length} Practiced ({practicedPercentage}%)
                </div>
              </div>
              <div className="h-8 w-8 rounded-full border-2 border-indigo-500/20 flex items-center justify-center relative">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  {practicedPercentage}%
                </span>
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyMarkdown}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-400" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Intel Stats Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-slate-100 pt-6 dark:border-slate-800">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/40">
            <span className="text-[11px] font-medium text-slate-400">Total Questions</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {allQuestions.length} Curated
            </div>
          </div>
          <div className="rounded-xl bg-red-50/50 p-3 dark:bg-red-950/20">
            <span className="text-[11px] font-medium text-red-500">High Priority</span>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">
              {highPriorityCount} Must-Know
            </div>
          </div>
          <div className="rounded-xl bg-amber-50/50 p-3 dark:bg-amber-950/20">
            <span className="text-[11px] font-medium text-amber-600">Company Intel</span>
            <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
              {report.whatYouShouldKnow.length} Insights
            </div>
          </div>
          <div className="rounded-xl bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
            <span className="text-[11px] font-medium text-emerald-600">Grounding Score</span>
            <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
              {report.confidenceRating.score}% Verified
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="-mb-px flex space-x-2 overflow-x-auto pb-1" aria-label="Tabs">
          {[
            { key: "all_intel", label: "Full Report (All 8 Sections)", icon: FileText, count: null },
            { key: "overview", label: "1. Overview & Insights", icon: Building2, count: null },
            {
              key: "priority_matrix",
              label: "2. Priority Questions Matrix",
              icon: Flame,
              count: allQuestions.length,
            },
            {
              key: "company_questions",
              label: "3. Company Questions",
              icon: Building2,
              count: report.companyQuestions.length,
            },
            {
              key: "role_questions",
              label: "4. Role-Specific",
              icon: Briefcase,
              count: report.roleSpecificQuestions.length,
            },
            {
              key: "hr_questions",
              label: "5. HR & Culture",
              icon: HeartHandshake,
              count: report.hrQuestions.length,
            },
            {
              key: "recent_news",
              label: "6. Recent Developments",
              icon: Newspaper,
              count: report.recentDevelopments.length,
            },
            {
              key: "prep_tips",
              label: "7. Prep Tips & Questions to Ask",
              icon: BookOpen,
              count: report.prepTips.length,
            },
            {
              key: "sources",
              label: "8. Sources & Grounding",
              icon: ShieldCheck,
              count: report.sourcesCited.length,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`group inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-3 text-xs font-semibold transition-all ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
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

      {/* TAB CONTENT: FULL REPORT (All 8 Sections sequentially) */}
      {(activeTab === "all_intel" || activeTab === "overview") && (
        <section id="section-overview" className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              1
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Company Overview & Verified Identity
            </h2>
          </div>
          <SectionOverview overview={report.companyOverview} />

          <div className="mt-8 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              What You Should Know Before the Interview
            </h2>
          </div>
          <SectionWhatToKnow points={report.whatYouShouldKnow} />
        </section>
      )}

      {/* TAB CONTENT: PRIORITY QUESTIONS MATRIX */}
      {(activeTab === "all_intel" || activeTab === "priority_matrix") && (
        <section id="section-priority-matrix" className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {activeTab === "priority_matrix" ? "★" : "3"}
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Interactive Priority Questions Matrix
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Filter by priority urgency, search topics, or mark questions as practiced
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/60">
            {/* Priority filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Priority:
              </span>
              {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((p) => {
                const isSelected = priorityFilter === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriorityFilter(p)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {p === "ALL" ? "All Priorities" : `${p} Priority`}
                  </button>
                );
              })}
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
              {(["ALL", "company", "role", "hr"] as const).map((cat) => {
                const isSelected = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat === "ALL" ? "All Categories" : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Questions List */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
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

      {/* TAB CONTENT: COMPANY INTERVIEW QUESTIONS (10 QUESTIONS) */}
      {(activeTab === "all_intel" || activeTab === "company_questions") && (
        <section id="section-company-questions" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {activeTab === "company_questions" ? "★" : "4"}
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Company-Specific Interview Questions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  10 questions specifically testing your understanding of {report.companyName}&apos;s product and business moat
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
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

      {/* TAB CONTENT: ROLE-SPECIFIC QUESTIONS (10 QUESTIONS) */}
      {(activeTab === "all_intel" || activeTab === "role_questions") && (
        <section id="section-role-questions" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {activeTab === "role_questions" ? "★" : "5"}
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Role-Specific Questions: {report.targetRole}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  10 targeted technical/functional questions calibrated for {report.experienceLevel} candidates
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
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

      {/* TAB CONTENT: HR & CULTURE QUESTIONS (8 QUESTIONS) */}
      {(activeTab === "all_intel" || activeTab === "hr_questions") && (
        <section id="section-hr-questions" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {activeTab === "hr_questions" ? "★" : "6"}
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  HR & Behavioral Culture Questions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  8 behavioral questions tailored to {report.companyName}&apos;s work pace, values, and operating principles
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
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

      {/* TAB CONTENT: RECENT DEVELOPMENTS */}
      {(activeTab === "all_intel" || activeTab === "recent_news") && (
        <section id="section-recent-news" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {activeTab === "recent_news" ? "★" : "7"}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Developments & Announcements
            </h2>
          </div>
          <SectionRecentNews
            developments={report.recentDevelopments}
            companyName={report.companyName}
          />
        </section>
      )}

      {/* TAB CONTENT: PREP TIPS & QUESTIONS TO ASK */}
      {(activeTab === "all_intel" || activeTab === "prep_tips") && (
        <section id="section-prep-tips" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {activeTab === "prep_tips" ? "★" : "8"}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Preparation Tips & Reverse Interview Questions
            </h2>
          </div>
          <SectionPrepTips
            tips={report.prepTips}
            suggestedQuestionsToAsk={report.suggestedQuestionsToAskInterviewer}
            companyName={report.companyName}
            roleName={report.targetRole}
          />
        </section>
      )}

      {/* TAB CONTENT: SOURCES & GROUNDING */}
      {(activeTab === "all_intel" || activeTab === "sources") && (
        <section id="section-sources" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {activeTab === "sources" ? "★" : "✓"}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Sources & Grounding Verification
            </h2>
          </div>
          <SectionSources
            sources={report.sourcesCited}
            confidenceRating={report.confidenceRating}
          />
        </section>
      )}
    </div>
  );
};
