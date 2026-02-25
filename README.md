<div align="center">

# **Aplio**

### The job search app I built because every other one sucked.

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Claude](https://img.shields.io/badge/Claude_Sonnet-4-F97316?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com/)
[![Adzuna](https://img.shields.io/badge/Adzuna_API-Jobs-2563EB?style=for-the-badge)](https://developer.adzuna.com/)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

---

</div>

<br/>

## TBH

I looked everywhere for a single app that could search real jobs, analyze my CV against them, generate cover letters, and rewrite my resume, all in one place. Couldn't find one. The ones that came close wanted my money *and* my personal data, with zero transparency about what happens behind the scenes. Cool. Very trustworthy. Definitely not selling my info to some randoms on the dark web.

So I built my own. **Aplio is fully open source.** Every line of code is right here. No mystery backend harvesting your data. No "trust us bro" privacy policy. You can literally read the source code and see that your CV gets processed in memory and then thrown away like my social life during development.

If you want to install it locally and run it yourself, genuinely, good luck and enjoy. It's yours. Fork it, break it, make it better. I'm not your mom, I can't force you to do anything. 

If you don't want to deal with that, I also put it in the cloud because I'm a nice person. **But** — and this is important — running Claude AI costs actual money. Yeah, I know, shocking. Every time you analyze a CV, that's my wallet crying. So if you're using the hosted version, maybe don't want me to starve, because if I starve, this app dies, and then *you* don't have an app to help you not starve either. It's a whole ecosystem. We're in this together.

<br/>

## What it actually does

**You search for jobs. Real ones.** Aplio pulls 50+ live listings from the Adzuna API. Not some stale database from 2019 — actual jobs that actual companies posted.

**Then the AI kicks in.** Paste your CV, click a job, and Claude will:

- Give you a **match score from 0 to 100** — how well you actually fit the role
- Break down your **strengths and gaps** — what you're nailing and what's missing
- Predict your **interview probability** — Low, Medium, or High
- Tell you the **one key thing to mention** in your application
- Generate **likely interview questions** so you can prep instead of panic

**Need a cover letter?** Done in 30 seconds. Pick a tone — Professional, Friendly, or Direct — and it writes one tailored to your CV and the specific job. Copy it, download it, send it.

**Need your CV rewritten?** The AI rewrites it for the specific role you're applying to. It reorders sections, mirrors ATS keywords from the job description, and marks every change with `[CHANGED]` so you can see exactly what it did. No black box. No "we improved your resume" with zero explanation.

<br/>

## Features at a glance

| Feature | What it does |
|---------|-------------|
| **Live Job Search** | 50+ real listings per search, filter by remote/hybrid/on-site, experience level, and minimum salary |
| **AI CV Analysis** | Match score, strengths, gaps, interview probability, predicted questions |
| **Cover Letter Generator** | Tailored to your CV + the job, with tone selection, copy & download |
| **CV Rewriter** | ATS-optimized rewrite with highlighted changes and PDF export |
| **Favorites** | Save jobs across sessions, synced to your account or localStorage |
| **Application Tracker** | Kanban-style pipeline — Applied, Interview, Offer, Rejected *(in progress)* |
| **Auth** | Register/login, your data follows you across devices |

<br/>

## Tech stack (for the nerds)

| What | Why |
|------|-----|
| React 19 | Because I like living on the edge |
| Vite 8 | Hot reload so fast it finishes before you save |
| Tailwind CSS 4 | Writing CSS by hand is a punishment, not a skill |
| Framer Motion | Makes everything feel smooth and expensive |
| Claude Sonnet 4 | The brain behind all the AI stuff — best reasoning model I could find |
| Adzuna API | 10M+ live job listings globally, free tier is generous |
| Express 5 | Backend that proxies everything so your API keys stay safe |
| PostgreSQL | Your data has to live somewhere. This is somewhere reliable |
| jsPDF + html2canvas | PDF export that happens entirely in your browser |

<br/>

## Running it yourself

### You'll need

- **Node.js** 18+ and **npm**
- An [Adzuna API](https://developer.adzuna.com/) account (free tier is plenty)
- An [Anthropic API](https://console.anthropic.com/) key (pay-per-use, ~$0.02 per analysis — you'll survive)
- PostgreSQL running somewhere (local or cloud, doesn't matter)

### Setup

```bash
# Clone it
git clone https://github.com/c-dinca/Aplio.git
cd Aplio

# Install dependencies
npm install

# Set up your environment
cp .env.example .env
```

Open `.env` and add your keys:

```env
VITE_ADZUNA_APP_ID=your_app_id
VITE_ADZUNA_APP_KEY=your_app_key
ANTHROPIC_API_KEY=your_claude_api_key
JWT_SECRET=literally_any_random_string
DATABASE_URL=postgresql://user:pass@localhost:5432/aplio
```

### Run it

```bash
npm run dev:all
# Frontend → http://localhost:5173
# Backend  → http://localhost:3001
```

> **Your API key never touches the browser.** All Claude calls go through the Express backend. Your secrets are safe. Pinky promise backed by actual code you can read.

### Build for production

```bash
npm run build
npm run preview
```

<br/>

## How it works (the simple version)

```
You type a job title
        ↓
Adzuna returns 50+ real listings
        ↓
You pick a job and paste your CV
        ↓
Claude reads both and does the thinking
        ↓
You get: Match Score · Strengths · Gaps · Interview Probability · Questions
        ↓
You generate a cover letter (30 seconds)
        ↓
You get your CV rewritten for that specific role
        ↓
You apply like someone who actually prepared
```

<br/>

## Security — because I'm not about to be *that* developer

| Concern | How it's handled |
|---------|-----------------|
| API keys | Server-side only. Never in the browser bundle. Never. |
| Your CV | Processed in memory, then discarded. Not stored, not logged, not sold |
| Passwords | Hashed with bcrypt (12 rounds). I literally cannot read your password |
| Auth tokens | JWT with 30-day expiry. Stored in localStorage, not cookies |
| External calls | Everything goes through the backend proxy. No direct browser-to-API calls |

<br/>

## Self-hosting costs (it's cheaper than your coffee habit)

| Item | Cost |
|------|------|
| Claude API — per CV analysis | ~$0.02 |
| Claude API — per cover letter | ~$0.01 |
| Claude API — per CV rewrite | ~$0.03 |
| Adzuna API (free tier) | $0 |

You will spend more on energy drinks in a week than running this app for a month. Priorities. 

<br/>

## Roadmap

- [x] Live job search with filters
- [x] AI CV analysis — score, gaps, interview questions
- [x] AI cover letter generator with tone selector
- [x] AI CV rewriter with ATS optimization
- [x] Favorites & persistence
- [x] User authentication
- [ ] **Application Tracker** — full kanban board for your job pipeline
- [ ] **CV Manager** — multiple CV versions, switch per role
- [ ] **PDF Export** — polished formatted CV download
- [ ] **Browser Extension** — analyze jobs directly on LinkedIn
- [ ] Whatever else makes sense when I get there

<br/>

## Contributing

Want to help? Genuinely welcome. Whether it's fixing a typo or building a whole feature — the door's open.

```bash
# Fork it, clone it
git clone https://github.com/your-username/Aplio.git

# Make a branch
git checkout -b feature/your-thing

# Do your thing, commit it
git commit -m "feat: your thing"

# Push and open a PR
git push origin feature/your-thing
```

For big changes, open an issue first so we can talk about it. For small fixes, just send the PR. I'm not going to gatekeep a typo fix.

<br/>

## License

MIT. Do whatever you want with it. Seriously. See [`LICENSE`](LICENSE).

<br/>

---

<div align="center">

**Aplio** — Born out of frustration, built with Claude API calls and questionable amounts of caffeine.

*If this helped you land a job or even just an interview — a star would genuinely make my day.*

[Report a Bug](../../issues) · [Request a Feature](../../issues)

</div>