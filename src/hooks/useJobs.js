import { useState } from 'react'

// ── localStorage keys ─────────────────────────────────────────────────────────
const LS_SEARCH = 'aplio_last_search'
const LS_FAVS   = 'aplio_favorites'

// ── Mock fallback (6 jobs) ────────────────────────────────────────────────────
export const MOCK_JOBS = [
  {
    id: 'm1',
    title: 'Senior Node.js Backend Engineer',
    company: 'Bitdefender',
    location: 'Bucharest, Romania',
    salary: '€54k – €78k/yr',
    type: 'Full-time',
    remote: 'Hybrid',
    url: 'https://www.bitdefender.com/en-us/careers',
    description:
      'Join our core infrastructure team building scalable microservices with Node.js, PostgreSQL, and Kafka. You will own service design, code review, and on-call rotation for critical security-product pipelines.',
    postedAt: '2d ago',
  },
  {
    id: 'm2',
    title: 'React Frontend Developer',
    company: 'UiPath',
    location: 'Cluj-Napoca, Romania',
    salary: '€46k – €62k/yr',
    type: 'Full-time',
    remote: 'Remote',
    url: 'https://www.uipath.com/company/careers',
    description:
      'Build next-gen automation UIs in React and TypeScript. Work closely with product and design to ship features used by 10 M+ users worldwide. Strong emphasis on performance, accessibility, and design systems.',
    postedAt: '1d ago',
  },
  {
    id: 'm3',
    title: 'Application Security Engineer',
    company: 'ING Tech Romania',
    location: 'Bucharest, Romania',
    salary: '€60k – €84k/yr',
    type: 'Full-time',
    remote: 'Hybrid',
    url: 'https://ing.jobs/romania',
    description:
      'Own the SAST/DAST pipeline, perform threat modelling, and run penetration tests on our banking platform. Collaborate with dev teams to triage and remediate findings within SLA.',
    postedAt: '3d ago',
  },
  {
    id: 'm4',
    title: 'Full-Stack JavaScript Engineer',
    company: 'Cegeka Romania',
    location: 'Timișoara, Romania',
    salary: '€38k – €58k/yr',
    type: 'Full-time',
    remote: 'On-site',
    url: 'https://cegeka.com/en/jobs',
    description:
      'Build and maintain customer-facing web applications with React, Node.js, and MongoDB. Participate in agile ceremonies and contribute to architectural decisions in a cross-functional squad.',
    postedAt: '5d ago',
  },
  {
    id: 'm5',
    title: 'Junior Security Analyst',
    company: 'Orange Romania',
    location: 'Bucharest, Romania',
    salary: '€22k – €31k/yr',
    type: 'Full-time',
    remote: 'Hybrid',
    url: 'https://www.orange.ro/cariere',
    description:
      'Monitor SIEM dashboards, triage alerts, investigate incidents, and escalate threats. Ideal for someone passionate about cybersecurity starting their career in a structured SOC environment.',
    postedAt: '1w ago',
  },
  {
    id: 'm6',
    title: 'DevOps / Platform Engineer',
    company: 'Endava',
    location: 'Cluj-Napoca, Romania',
    salary: '€52k – €72k/yr',
    type: 'Full-time',
    remote: 'Hybrid',
    url: 'https://careers.endava.com',
    description:
      'Design and operate Kubernetes-based platforms on AWS, automate CI/CD with GitHub Actions and ArgoCD, and drive SRE practices across multiple product teams.',
    postedAt: '4d ago',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function writeLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage quota */ }
}

/** Detect Romanian location → 'ro', otherwise → 'gb'. */
function getCountryCode(location) {
  const l = (location ?? '').toLowerCase().trim()
  if (!l) return 'gb'
  if (l.includes('romania')) return 'ro'
  // match 'ro' as a standalone token (e.g. "Node.js, ro")
  if (l.split(/[\s,;]+/).includes('ro')) return 'ro'
  return 'gb'
}

/** Build the Adzuna API endpoint URL. */
function buildAdzunaUrl(query, location) {
  const country = getCountryCode(location)
  const params  = new URLSearchParams({
    app_id:           import.meta.env.VITE_ADZUNA_APP_ID  ?? '',
    app_key:          import.meta.env.VITE_ADZUNA_APP_KEY ?? '',
    what:             query,
    where:            location,
    results_per_page: '50',
    'content-type':   'application/json',
  })
  return {
    url:     `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params}`,
    country,
  }
}

/** Convert Adzuna raw result → internal job shape. */
function mapJob(raw, country) {
  const sym = country === 'ro' ? '€' : '£'
  const lo  = raw.salary_min ? Math.round(raw.salary_min / 1000) : 0
  const hi  = raw.salary_max ? Math.round(raw.salary_max / 1000) : 0
  const salary =
    lo && hi ? `${sym}${lo}k – ${sym}${hi}k/yr`
    : lo      ? `from ${sym}${lo}k/yr`
    : null

  return {
    id:          String(raw.id),
    title:       raw.title        ?? '',
    company:     raw.company?.display_name ?? 'Unknown',
    location:    raw.location?.display_name ?? '',
    salary,
    type:        'Full-time',
    remote:      'Hybrid',
    url:         raw.redirect_url ?? '#',
    description: raw.description  ?? '',
    postedAt:    formatPostedAt(raw.created),
  }
}

function formatPostedAt(iso) {
  if (!iso) return 'recently'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days === 0)  return 'today'
  if (days === 1)  return '1d ago'
  if (days < 7)   return `${days}d ago`
  if (days < 14)  return '1w ago'
  if (days < 60)  return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useJobs() {
  const [jobs,      setJobs]      = useState(() => readLS(LS_SEARCH, []))
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const [favorites, setFavorites] = useState(() => readLS(LS_FAVS, []))

  // ── Sync favorites from backend on mount ──────────────────────────────
  const loadFavoritesFromBackend = async () => {
    const token = localStorage.getItem('aplio_token')
    if (!token) return

    try {
      const res = await fetch('/api/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        const ids = data.favorites.map(f => f.job_id)
        setFavorites(ids)
        writeLS(LS_FAVS, ids)
      }
    } catch {
      // fallback to localStorage (already loaded)
    }
  }

  // Load on mount
  useState(() => { loadFavoritesFromBackend() })

  /**
   * Fetch jobs from Adzuna. Falls back to MOCK_JOBS on any error.
   * Returns { ok, count, usedFallback } so callers can show toast messages.
   */
  const searchJobs = async (query, location /*, filters unused for API call */) => {
    // Empty search → show all mocks immediately
    if (!query.trim() && !location.trim()) {
      setJobs(MOCK_JOBS)
      setError(null)
      return { ok: true, count: MOCK_JOBS.length, usedFallback: true }
    }

    setLoading(true)
    setError(null)

    try {
      const { url, country } = buildAdzunaUrl(query, location)
      const res = await fetch(url)

      if (!res.ok) throw new Error(`Adzuna responded with HTTP ${res.status}`)

      const data   = await res.json()
      const mapped = (data.results ?? []).map(r => mapJob(r, country))

      // If Adzuna returned empty results, surface mocks instead of a blank list
      const result = mapped.length > 0 ? mapped : MOCK_JOBS

      setJobs(result)
      writeLS(LS_SEARCH, result)
      return { ok: true, count: result.length, usedFallback: mapped.length === 0 }

    } catch (err) {
      const msg = err.message ?? 'Unknown error'
      setError(msg)
      setJobs(MOCK_JOBS)
      return { ok: false, error: msg }

    } finally {
      setLoading(false)
    }
  }

  /** Toggle a job in the persistent favourites list. Also syncs to backend. */
  const toggleFavorite = (jobId, jobData = null) => {
    const token = localStorage.getItem('aplio_token')

    setFavorites(prev => {
      const isRemoving = prev.includes(jobId)
      const next = isRemoving
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
      writeLS(LS_FAVS, next)

      // Sync to backend (fire-and-forget)
      if (token) {
        if (isRemoving) {
          fetch(`/api/favorites/${jobId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {})
        } else if (jobData) {
          fetch('/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ job_id: jobId, job_data: jobData }),
          }).catch(() => {})
        }
      }

      return next
    })
  }

  return { jobs, loading, error, searchJobs, favorites, toggleFavorite }
}

