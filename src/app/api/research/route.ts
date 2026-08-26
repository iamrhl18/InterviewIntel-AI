import { NextRequest, NextResponse } from "next/server";
import { ResearchRequest, ApiResponse, ResearchReport } from "@/types/interview";
import { scrapeCompanyWebsite, ScrapedCompanyData } from "@/lib/scraper";
import { generateInterviewIntelligence } from "@/lib/gemini";

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<ResearchReport>>> {
  try {
    const body = await req.json();

    const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
    const companyUrl = typeof body.companyUrl === "string" ? body.companyUrl.trim() : "";
    const jobRole = typeof body.jobRole === "string" ? body.jobRole.trim() : "";
    const experienceLevel = body.experienceLevel;

    // Validation
    if (!companyName && !companyUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide either a Company Name or Company URL to begin research.",
        },
        { status: 400 }
      );
    }

    if (!jobRole) {
      return NextResponse.json(
        {
          success: false,
          error: "Job Role is required to generate tailored interview intelligence.",
        },
        { status: 400 }
      );
    }

    const validLevels = ["Fresher", "0-2 years", "3+ years"];
    if (!validLevels.includes(experienceLevel)) {
      return NextResponse.json(
        {
          success: false,
          error: "Experience Level must be 'Fresher', '0-2 years', or '3+ years'.",
        },
        { status: 400 }
      );
    }

    const requestParams: ResearchRequest = {
      companyName: companyName || undefined,
      companyUrl: companyUrl || undefined,
      jobRole,
      experienceLevel,
    };

    // Step 1: Optional live web scraping if company URL is supplied
    let scrapedData: ScrapedCompanyData | null = null;
    if (companyUrl) {
      try {
        scrapedData = await scrapeCompanyWebsite(companyUrl);
      } catch (scrapeErr) {
        console.warn("Website scraping encountered non-fatal issue:", scrapeErr);
      }
    }

    // Step 2: Generate intelligence report using Gemini LLM engine with grounding
    const { report, isMockFallback, fallbackReason } = await generateInterviewIntelligence(
      requestParams,
      scrapedData
    );

    return NextResponse.json({
      success: true,
      data: report,
      isMockFallback,
      fallbackReason,
      message: isMockFallback
        ? report.fallbackMessage || "Report generated in offline reference mode."
        : "Live AI intelligence report generated successfully.",
    });
  } catch (error: unknown) {
    console.error("API Route Error in /api/research:", error);
    const message = error instanceof Error ? error.message : "An unexpected server error occurred.";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
