export type ExperienceLevel = "Fresher" | "0-2 years" | "3+ years";

export type QuestionPriority = "HIGH" | "MEDIUM" | "LOW";

export type QuestionCategory = "company" | "role" | "hr";

export type CertaintyLevel = "verified" | "high_confidence" | "inferred";

export type FallbackReason =
  | "MISSING_API_KEY"
  | "INVALID_API_KEY"
  | "QUOTA_EXCEEDED"
  | "API_ERROR"
  | "NONE";

export interface SourceCitation {
  title: string;
  url?: string;
  type: "official_site" | "careers_page" | "news" | "tech_blog" | "general_knowledge";
  note?: string;
}

export interface CompanyOverview {
  companyName: string;
  tagline?: string;
  industry: string;
  founded: string;
  headquarters: string;
  companySize?: string;
  mainProducts: string[];
  majorTechnologies: string[];
  businessModel?: string;
  targetMarket?: string;
  certainty: CertaintyLevel;
  uncertaintyNotes?: string;
  primarySources: SourceCitation[];
}

export interface CandidateIntelPoint {
  id: string;
  headline: string;
  detail: string;
  whyItMattersForInterview: string;
  category: "culture" | "strategy" | "engineering" | "product" | "financial" | "leadership";
  sourceOrConfidence?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  priority: QuestionPriority;
  priorityRationale: string;
  context: string;
  whatInterviewerIsTesting: string[];
  sampleTalkingPoints: string[];
  suggestedFramework?: string;
  experienceFitNotes?: string;
}

export interface RecentDevelopment {
  id: string;
  title: string;
  summary: string;
  timeframe: string;
  sourceName?: string;
  sourceUrl?: string;
  howToBringUpInInterview: string;
}

export interface PrepTip {
  id: string;
  tip: string;
  category: "research" | "technical" | "behavioral" | "strategic" | "questions_to_ask";
  actionableStep: string;
}

export interface ResearchReport {
  id: string;
  companyName: string;
  targetRole: string;
  experienceLevel: ExperienceLevel;
  generatedAt: string;
  inputUrl?: string;
  companyOverview: CompanyOverview;
  whatYouShouldKnow: CandidateIntelPoint[]; // 5-8 points
  companyQuestions: InterviewQuestion[]; // 10 questions
  roleSpecificQuestions: InterviewQuestion[]; // 10 questions
  hrQuestions: InterviewQuestion[]; // 8 questions
  recentDevelopments: RecentDevelopment[];
  prepTips: PrepTip[]; // 5 recommendations
  suggestedQuestionsToAskInterviewer?: {
    question: string;
    category?: string;
    rationale?: string;
  }[];
  confidenceRating: {
    score: number; // 0-100
    label: string;
    explanation: string;
  };
  sourcesCited: SourceCitation[];
  fallbackReason?: FallbackReason;
  fallbackMessage?: string;
}

export interface ResearchRequest {
  companyName?: string;
  companyUrl?: string;
  jobRole: string;
  experienceLevel: ExperienceLevel;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  isMockFallback?: boolean;
  fallbackReason?: FallbackReason;
  message?: string;
}
