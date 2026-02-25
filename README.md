<div align="center">

# **Aplio**
### Your AI-Powered Job Search Companion

*Search real jobs. Analyze your CV. Generate tailored cover letters. Land more interviews.*

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Claude](https://img.shields.io/badge/Claude_Sonnet-4-F97316?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com/)
[![Adzuna](https://img.shields.io/badge/Adzuna_API-Jobs-2563EB?style=for-the-badge)](https://developer.adzuna.com/)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<br/>

> **78% of resumes never reach a human.** Aplio levels the playing field —
> using the same AI that companies use to screen candidates, now working *for you*.

<br/>

[🚀 Live Demo](#) · [📖 Docs](#) · [🐛 Report a Bug](../../issues) · [💡 Request a Feature](../../issues)

---

</div>

<br/>

## ✦ What is Aplio?

Aplio is a full-stack job search application that combines **live job listings** with **Claude AI** to help you apply smarter — not harder.

Instead of sending the same CV to 50 jobs and hoping for the best, Aplio tells you *exactly* how well you fit each role, rewrites your CV with the right keywords, and generates a cover letter in seconds — all tailored to the specific job you're applying for.

<br/>

## ✦ Features

<table>
<tr>
<td width="50%">

### 🔍 Live Job Search
- **50+ real listings** per query via Adzuna API
- Filter by **Remote / Hybrid / On-site**
- Filter by **Junior / Mid / Senior**
- Filter by **minimum salary**
- Smart fallback to sample jobs when offline
- Favorites saved across sessions

</td>
<td width="50%">

### 🤖 AI CV Analysis
- **Match Score (0–100)** for any job
- **Strengths & Gaps** breakdown
- **Interview Probability** — Low / Medium / High
- **Key thing to mention** in your application
- **Likely interview questions** to prep for

</td>
</tr>
<tr>
<td width="50%">

### ✍️ Cover Letter Generator
- Tailored to your CV + the job description
- Choose your **tone**: Professional, Friendly, or Direct
- Copy to clipboard or **download as .txt**
- Ready to send in under 30 seconds

</td>
<td width="50%">

### 📄 Adaptive CV Rewriter
- AI rewrites your CV for the specific role
- Reorders sections to **lead with what matters**
- Mirrors **ATS keywords** from the job description
- `[CHANGED]` markers highlight every edit

</td>
</tr>
</table>

<br/>

## ✦ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React 19 | Latest concurrent features |
| **Build** | Vite 8 | Instant HMR, blazing fast builds |
| **Styling** | Tailwind CSS 4 + custom tokens | Utility-first with design system |
| **Routing** | React Router 7 | File-based, modern API |
| **Animations** | Framer Motion | Smooth, physics-based UI |
| **AI Engine** | Claude Sonnet 4 (Anthropic) | Best-in-class reasoning + JSON output |
| **Job Data** | Adzuna API | 10M+ live listings globally |
| **PDF Export** | jsPDF + html2canvas | Client-side, no server needed |
| **Typography** | Clash Display + Cabinet Grotesk | Distinctive, readable |

<br/>

## ✦ Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- [Adzuna API](https://developer.adzuna.com/) account — free tier works perfectly
- [Anthropic API](https://console.anthropic.com/) key — pay-per-use, ~$0.02 per analysis

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/aplio.git
cd aplio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

Open `.env` and add your keys:

```env
VITE_ADZUNA_APP_ID=your_app_id_here
VITE_ADZUNA_APP_KEY=your_app_key_here
VITE_ANTHROPIC_API_KEY=your_claude_api_key_here
```

### Run locally

```bash
npm run dev
# → http://localhost:5173
```

> **Security note:** The Vite dev server proxies all Claude API calls through `/api/claude`.
> Your API key is injected at the proxy level and **never sent to the browser**.

### Build for production

```bash
npm run build
npm run preview
```

<br/>

## ✦ Project Structure

```
aplio/
├── public/                      # Static assets
├── src/
│   ├── components/
│   │   ├── AiCoachPanel.jsx     # Match score, strengths, gaps, interview Q's
│   │   ├── BottomNav.jsx        # Mobile navigation bar
│   │   ├── CoverLetterModal.jsx # Cover letter generator with tone selector
│   │   ├── CvEditor.jsx         # CV editor with [CHANGED] diff view
│   │   ├── CvModal.jsx          # CV paste / input modal
│   │   ├── Header.jsx           # Glassmorphism header
│   │   ├── JobCard.jsx          # Job listing card
│   │   ├── JobDetailPanel.jsx   # Right panel with AI tabs
│   │   ├── JobList.jsx          # Scrollable results list
│   │   ├── SearchBar.jsx        # Search input + filters
│   │   └── Toast.jsx            # Toast notification system
│   ├── hooks/
│   │   ├── useClaude.js         # Claude AI integration
│   │   └── useJobs.js           # Adzuna job fetching
│   ├── pages/
│   │   ├── HomePage.jsx         # Main search + results
│   │   ├── TrackerPage.jsx      # Application tracker (coming soon)
│   │   └── CvPage.jsx           # CV manager (coming soon)
│   ├── styles/
│   │   └── globals.css          # Design tokens + base styles
│   ├── utils/
│   │   └── apiProxy.js          # API endpoint config
│   ├── App.jsx                  # Root + routing
│   └── main.jsx                 # Entry point
├── .env.example
├── vite.config.js               # Vite + proxy config
└── package.json
```

<br/>

## ✦ How It Works

```
User types a job title
        ↓
Adzuna API returns 50 live listings
        ↓
User selects a job + pastes their CV
        ↓
Claude analyzes CV vs. job description
        ↓
Returns: Match Score · Strengths · Gaps
         Interview Probability · Questions
        ↓
User generates a Cover Letter (30s)
        ↓
User requests CV Rewrite (ATS-optimized)
        ↓
Apply with confidence ✓
```

<br/>

## ✦ Security

| Concern | How Aplio handles it |
|---------|---------------------|
| API key exposure | Keys live server-side only — never in the browser bundle |
| Sensitive data | No CV content is stored — processed in memory, then discarded |
| LocalStorage | Only job results and favorites — no personal data |
| CORS | All external calls go through the Vite proxy |

<br/>

## ✦ Pricing

| Plan | Price | What you get |
|------|-------|--------------|
| **Free** | $0 / month | 5 CV analyses · 2 cover letters · Unlimited job search |
| **Pro** | $12 / month · $99 / year | Unlimited everything · CV rewriting · PDF export · Priority support |
| **Lifetime** | $79 one-time | All Pro features forever · All future updates included |

<br/>

## ✦ Roadmap

- [x] Live job search with filters
- [x] AI CV analysis (score + gaps + questions)
- [x] AI cover letter generator with tone selector
- [x] AI CV rewriter with ATS optimization
- [x] Favorites & LocalStorage persistence
- [ ] **Application Tracker** — kanban board for your pipeline
- [ ] **CV Manager** — multiple CV versions, switch per role
- [ ] **PDF Export** — polished formatted CV download
- [ ] **Browser Extension** — analyze jobs directly on LinkedIn
- [ ] **Authentication** — sync your data across devices

<br/>

## ✦ Self-Hosting Cost Estimate

Running Aplio yourself is extremely affordable:

| Item | Estimated Cost |
|------|---------------|
| Claude API — per CV analysis | ~$0.02 |
| Claude API — per cover letter | ~$0.01 |
| Claude API — per CV rewrite | ~$0.03 |
| Adzuna API (free tier) | $0 |
| Hosting (Vercel / Netlify free tier) | $0 |
| **100 active users / month total** | **≈ $20 – $40** |

<br/>

## ✦ Contributing

All contributions are welcome — from fixing typos to building full features.

```bash
# 1. Fork the repo and clone it
git clone https://github.com/your-username/aplio.git

# 2. Create a feature branch
git checkout -b feature/your-amazing-feature

# 3. Make your changes, commit with a clear message
git commit -m "feat: add amazing feature"

# 4. Push and open a Pull Request
git push origin feature/your-amazing-feature
```

Please follow the existing code style and open an issue first for major changes.

<br/>

## ✦ License

Distributed under the **MIT License** — see [`LICENSE`](LICENSE) for details.

<br/>

---

<div align="center">

**Aplio** — Built with ❤️ and a lot of Claude API calls.

*If this helped you land a job or an interview — drop a ⭐ It means a lot.*

<br/>

[🐦 Twitter](#) · [💼 LinkedIn](#) · [🌐 aplio.app](#)

</div>
