# Aplio — AI-Powered Job Search

**Aplio** helps job seekers find, analyze, and apply to jobs smarter using AI.

## Features

- 🔍 **Job Search** — Search 50+ live jobs via Adzuna API
- 🤖 **AI Analysis** — Claude analyzes how your CV matches each job
- ✨ **CV Adaptation** — AI rewrites your CV for specific roles
- ✉️ **Cover Letters** — Generate tailored cover letters in seconds
- 👤 **User Accounts** — Register/login to save your CV and favorites
- ⭐ **Favorites** — Save jobs and access them across devices

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS 4 |
| Backend | Express.js + PostgreSQL |
| Auth | JWT + bcrypt |
| AI | Claude (Anthropic) via server-side proxy |
| Jobs API | Adzuna |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Setup

```bash
# Clone
git clone git@github.com:c-dinca/Aplio.git
cd Aplio

# Install
npm install

# Database
psql postgres -c "CREATE DATABASE aplio;"

# Environment
cp .env.example .env
# Edit .env with your API keys

# Run (both frontend + backend)
npm run dev:all
```

Open [http://localhost:5173](http://localhost:5173)

## Environment Variables

See `.env.example` for the required variables:

| Variable | Description |
|----------|-------------|
| `VITE_ADZUNA_APP_ID` | Adzuna API app ID |
| `VITE_ADZUNA_APP_KEY` | Adzuna API key |
| `ANTHROPIC_API_KEY` | Claude API key (server-side only) |
| `JWT_SECRET` | JWT signing secret |
| `DATABASE_URL` | PostgreSQL connection string |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run server` | Start Express API server |
| `npm run dev:all` | Start both concurrently |
| `npm run build` | Build for production |

## License

MIT
