import { useState } from 'react'
import { CLAUDE_ENDPOINT, claudeHeaders } from '../utils/apiProxy'

const MODEL = 'claude-sonnet-4-20250514'

// ── Low-level fetch ───────────────────────────────────────────────────────────

async function callClaude(systemPrompt, userPrompt, maxTokens = 1500) {
  const res = await fetch(CLAUDE_ENDPOINT, {
    method:  'POST',
    headers: claudeHeaders(),
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: maxTokens,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Claude API error ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.content[0].text
}

// ── JSON helper — strips ```json fences if Claude added them ─────────────────

function parseJson(text) {
  const clean = text
    .trim()
    .replace(/^```(?:json)?\n?/i, '')
    .replace(/\n?```\s*$/i, '')
    .trim()
  return JSON.parse(clean)
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useClaude() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // ── Shared wrapper: sets loading/error, propagates throws ────────────────
  async function run(fn) {
    setLoading(true)
    setError(null)
    try {
      return await fn()
    } catch (err) {
      setError(err.message ?? String(err))
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ── analyzeJob ────────────────────────────────────────────────────────────
  const analyzeJob = (job, cvText) => run(async () => {
    const text = await callClaude(
      'You are a professional recruiter and career coach. Respond ONLY with valid JSON, no markdown.',
      `Analyze this CV against this job description.

JOB: ${job.title} at ${job.company}
DESCRIPTION: ${job.description}
CV: ${cvText}

Return JSON:
{
  "score": <0-100>,
  "match_reasons": ["reason 1", "reason 2", "reason 3"],
  "gaps": ["gap 1", "gap 2"],
  "cover_letter_tip": "what to emphasize",
  "interview_questions": ["probable question 1", "probable question 2", "probable question 3"],
  "key_thing": "most important thing to mention",
  "interview_probability": "Low|Medium|High",
  "interview_probability_reason": "one sentence explanation"
}`,
    )
    return parseJson(text)
  })

  // ── adaptCv ───────────────────────────────────────────────────────────────
  const adaptCv = (job, cvText) => run(() =>
    callClaude(
      'You are an expert CV writer. Return ONLY the adapted CV text, no commentary, no markdown.',
      `Rewrite this CV optimized for the job below. Keep ALL facts accurate — never invent experience.
Reorder sections to prioritize what's most relevant. Adjust wording to mirror job description language.
Wrap sections you significantly changed with [CHANGED] and [/CHANGED] tags.

JOB: ${job.title} at ${job.company}
KEY REQUIREMENTS: ${job.description.substring(0, 700)}

CV:
${cvText}`,
      2500,
    )
  )

  // ── generateCoverLetter ───────────────────────────────────────────────────
  const generateCoverLetter = (job, cvText, tone = 'professional') => run(() =>
    callClaude(
      'You are an expert cover letter writer.',
      `Write a ${tone} cover letter (~250 words) for ${job.title} at ${job.company}. \
Use facts from the CV only. Do not invent. Start directly with the content, \
no 'Dear Hiring Manager' header needed.

JOB: ${job.description.substring(0, 500)}
CV: ${cvText}`,
      800,
    )
  )

  // ── batchMatchScores ──────────────────────────────────────────────────────
  const batchMatchScores = async (jobs, cvText) => {
    const subset = jobs.slice(0, 5)
    setLoading(true)
    setError(null)
    try {
      const text = await callClaude(
        'Respond ONLY with a JSON array, no other text.',
        `Score each job 0-100 match against this CV.

CV SUMMARY: ${cvText.substring(0, 400)}

JOBS:
${subset
  .map(j => `ID:${j.id} TITLE:${j.title} at ${j.company} DESC:${j.description.substring(0, 150)}`)
  .join('\n\n')}

Return: [{"id":"...","score":0-100},...]`,
        600,
      )
      const arr = parseJson(text)
      return Object.fromEntries(arr.map(({ id, score }) => [String(id), Number(score)]))
    } catch {
      return {}   // graceful degradation — cards just show no badge
    } finally {
      setLoading(false)
    }
  }

  return { analyzeJob, adaptCv, generateCoverLetter, batchMatchScores, loading, error }
}
