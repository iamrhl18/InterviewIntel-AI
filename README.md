# InterviewIntel AI 🎯

An AI-powered corporate research and interview intelligence dashboard. InterviewIntel AI researches any company from a company name or website URL, performs live domain scraping and LLM analysis, and generates a structured interview preparation report tailored to the candidate's target job role and experience level.

---

## 🚀 Key Features

### 1. **Company Overview & Verified Identity**
- Company name, industry, founding year, global headquarters, and headcount.
- Core products/services and major technologies/business focus areas.
- Business & monetization model breakdown.
- Grounding certainty indicators (`Verified Source`, `High Confidence`, `Industry Inferred`).

### 2. **What You Should Know**
- 5–8 critical company intelligence points a candidate must know before stepping into the interview.
- "Why this matters in the interview" strategic context for every claim.

### 3. **Company Interview Questions (10 Questions)**
- 10 company-specific questions probing architecture, competitive advantages, business scale, and product moats.
- Context & "What the interviewer is testing".
- Structured talking points and answering frameworks.

### 4. **Role-Specific Questions (10 Questions)**
- 10 functional and technical questions tailored directly to the target role (e.g. Frontend, Backend, Full Stack, SRE, ML, Product Management).
- Calibrated across 3 experience levels:
  - **Fresher / Entry**: Core CS fundamentals, problem decomposition, coursework/projects.
  - **0–2 Years**: Hands-on debugging, trade-offs, testing, and team execution.
  - **3+ Years**: System design, distributed architecture, scalability, and technical leadership.

### 5. **HR & Culture Questions (8 Questions)**
- 8 behavioral questions grounded in the company's operating principles and work pace.
- Answer strategies using the **STAR Method** (Situation, Task, Action, Result).

### 6. **Recent Developments & News**
- Timeline of recent company announcements, product launches, or funding.
- Actionable tips on how to bring them up tactfully in conversation.

### 7. **Interactive Priority Questions Matrix**
- Classifies all questions into **HIGH PRIORITY**, **MEDIUM PRIORITY**, and **LOW PRIORITY**.
- Interactive filters by priority and category.
- Search filter for topics and keywords.
- Interactive **"Mark as Practiced"** checklist with progress tracking and celebration confetti.

### 8. **Preparation Tips & Questions to Ask**
- 5 concise, actionable preparation recommendations.
- Reverse-interview questions to ask the interviewer.

### 9. **Sources & Grounding Verification**
- Transparent list of all referenced websites, official career portals, and technical documentation.

### 10. **Export & Persistence**
- Copy Full Report as structured Markdown.
- Clean PDF / Print export view.
- Search history saved to browser LocalStorage.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Web Scraping:** Cheerio (safe real-time HTML text & metadata extractor)
- **LLM Engine:** Google Gemini API (`@google/genai`)
- **Animations & Effects:** Canvas Confetti

---

## 📋 Prerequisites & Installation

### 1. Prerequisites
- Node.js 18.x or higher (Node 20+ recommended)
- npm or yarn

### 2. Clone / Open Directory
```bash
cd C:\Users\dgmp7\.gemini\antigravity\scratch\interviewintel-ai
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Tip:** You can obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
>
> **Note:** If no API key is provided, InterviewIntel AI runs in **Demo Mode** with high-quality built-in intelligence data, allowing you to test all UI and reporting features immediately!

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start researching companies.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
interviewintel-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── research/
│   │   │       └── route.ts          # Server-side research API route
│   │   ├── globals.css               # Tailwind CSS & Print styles
│   │   ├── layout.tsx                # Root layout & font configuration
│   │   └── page.tsx                  # Main application dashboard
│   ├── components/
│   │   ├── Navbar.tsx                # Header navigation & history trigger
│   │   ├── ResearchForm.tsx          # Inputs, presets, and validation
│   │   ├── LoadingProgress.tsx       # Multi-step progress animation
│   │   ├── ReportDashboard.tsx       # Main 8-section report & matrix
│   │   ├── QuestionCard.tsx          # Question card with talking points
│   │   ├── SectionOverview.tsx       # Section 1: Company Overview
│   │   ├── SectionWhatToKnow.tsx     # Section 2: What You Should Know
│   │   ├── SectionRecentNews.tsx     # Section 6: Recent Developments
│   │   ├── SectionPrepTips.tsx       # Section 8: Preparation Tips
│   │   ├── SectionSources.tsx        # Sources & Grounding Verification
│   │   └── SavedReportsDrawer.tsx    # LocalStorage history slide-over
│   ├── lib/
│   │   ├── gemini.ts                 # Gemini LLM client & fallback generator
│   │   ├── scraper.ts                # Real-time web scraper (Cheerio)
│   │   └── utils.ts                  # Styling and formatting utilities
│   └── types/
│       └── interview.ts              # TypeScript schemas and data models
├── .env.example
├── .env.local
├── package.json
└── README.md
```

---

## 🛡 Grounding & Accuracy Principles

1. **No Fact Invention:** Uncertain details are explicitly flagged with `uncertaintyNotes` or labeled as `Industry Inferred`.
2. **Official Source Priority:** Information extracted directly from the company's official domain is given top grounding weight.
3. **Role Specificity:** Questions avoid generic boilerplate and reflect real-world architectural and behavioral interview standards.

---

## 📄 License
MIT
