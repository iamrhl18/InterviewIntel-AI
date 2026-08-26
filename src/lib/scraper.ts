import * as cheerio from "cheerio";

export interface ScrapedCompanyData {
  url: string;
  domain: string;
  title: string;
  description: string;
  siteName?: string;
  headings: string[];
  mainTextSnippet: string;
  detectedTechKeywords: string[];
  rawSummary: string;
  success: boolean;
  error?: string;
}

export async function scrapeCompanyWebsite(rawUrl: string): Promise<ScrapedCompanyData> {
  let targetUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  let domain = "";
  try {
    const parsed = new URL(targetUrl);
    domain = parsed.hostname.replace(/^www\./, "");
  } catch {
    domain = rawUrl;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        url: targetUrl,
        domain,
        title: "",
        description: "",
        headings: [],
        mainTextSnippet: "",
        detectedTechKeywords: [],
        rawSummary: `HTTP ${response.status} ${response.statusText}`,
        success: false,
        error: `Could not fetch website (Status ${response.status})`,
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $("script, style, noscript, svg, iframe, canvas, link, meta, style").remove();

    const title = $("title").first().text().trim() || $("meta[property='og:title']").attr("content") || "";
    const description =
      $("meta[name='description']").attr("content") ||
      $("meta[property='og:description']").attr("content") ||
      "";
    const siteName = $("meta[property='og:site_name']").attr("content") || "";

    const headings: string[] = [];
    $("h1, h2, h3").each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (text && text.length > 3 && text.length < 140 && !headings.includes(text)) {
        headings.push(text);
      }
    });

    const paragraphs: string[] = [];
    $("p, li, article, section").each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (text && text.length > 25 && text.length < 350) {
        paragraphs.push(text);
      }
    });

    const uniqueParagraphs = Array.from(new Set(paragraphs)).slice(0, 15);
    const mainTextSnippet = uniqueParagraphs.join("\n\n").slice(0, 3000);

    // Simple keyword extraction
    const techKeywords = [
      "AI", "Machine Learning", "Cloud", "SaaS", "Kubernetes", "TypeScript", "React",
      "Python", "Go", "Rust", "Java", "Microservices", "Fintech", "HealthTech",
      "E-commerce", "Enterprise", "B2B", "B2C", "Security", "DevOps", "Data Platform",
      "API", "Scalability", "Distributed Systems"
    ];

    const detectedTechKeywords = techKeywords.filter((kw) =>
      new RegExp(`\\b${kw}\\b`, "i").test(html)
    );

    const rawSummary = `
Domain: ${domain}
Title: ${title}
Description: ${description}
Key Headings: ${headings.slice(0, 8).join(" | ")}
Extracted Content: ${mainTextSnippet.slice(0, 1500)}
Detected Themes: ${detectedTechKeywords.join(", ")}
`.trim();

    return {
      url: targetUrl,
      domain,
      title,
      description,
      siteName,
      headings: headings.slice(0, 10),
      mainTextSnippet,
      detectedTechKeywords,
      rawSummary,
      success: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Scraping failed";
    return {
      url: targetUrl,
      domain,
      title: "",
      description: "",
      headings: [],
      mainTextSnippet: "",
      detectedTechKeywords: [],
      rawSummary: "",
      success: false,
      error: message,
    };
  }
}
