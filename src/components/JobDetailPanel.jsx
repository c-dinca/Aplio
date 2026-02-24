import { useState, useEffect, useCallback, useRef } from 'react'
import { useClaude }      from '../hooks/useClaude'
import AiCoachPanel       from './AiCoachPanel'
import CvEditor           from './CvEditor'
import CoverLetterModal   from './CoverLetterModal'

// ── Keyword extraction ────────────────────────────────────────────────────────
const STOP = new Set([
  'and','or','the','a','an','to','of','in','for','with','is','are','be','by',
  'as','on','at','from','that','this','it','we','you','our','your','will',
  'can','have','has','been','not','all','also','up','its','their','which',
  'they','but','about','more','other','into','than','if','what','use','using',
  'build','work','team','experience','strong','good','excellent','required',
  'preferred','must','ability','skills','able','knowledge','including','such',
  'may','both','some','should','level','working','years','responsible','role',
  'position','plus','bonus','benefits','looking','join','help','make','great',
])

function extractKeywords(desc = '') {
  const words = desc.match(/\b[A-Za-z][a-zA-Z0-9.#+]{2,}\b/g) ?? []
  const freq  = {}
  words.forEach(w => {
    const lw = w.toLowerCase()
    if (!STOP.has(lw)) freq[lw] = (freq[lw] ?? 0) + 1
  })
  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 14)
    .map(([w]) => w)
}

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = ['details', 'analysis', 'cv']
const TAB_LABELS = { details: 'Details', analysis: 'AI Analysis', cv: 'Adapted CV' }

// ── Component ─────────────────────────────────────────────────────────────────
export default function JobDetailPanel({ job, cvText, onBack }) {
  const { analyzeJob, adaptCv } = useClaude()

  const [activeTab,       setActiveTab]       = useState('details')
  const [analysis,        setAnalysis]        = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [adaptedCv,       setAdaptedCv]       = useState(null)
  const [adaptLoading,    setAdaptLoading]    = useState(false)
  const [cvEdited,        setCvEdited]        = useState(null)
  const [resetKey,        setResetKey]        = useState(0)
  const [showCoverLetter, setShowCoverLetter] = useState(false)

  // Track which job we've loaded AI for
  const lastJobId = useRef(null)

  // Reset when job changes
  useEffect(() => {
    if (job?.id !== lastJobId.current) {
      lastJobId.current = job?.id
      setActiveTab('details')
      setAnalysis(null)
      setAnalysisLoading(false)
      setAdaptedCv(null)
      setAdaptLoading(false)
      setCvEdited(null)
      setResetKey(k => k + 1)
    }
  }, [job?.id])

  // ── Lazy AI triggers ──────────────────────────────────────────────────────
  const handleAnalyze = useCallback(() => {
    if (!job || !cvText || analysisLoading) return
    setAnalysisLoading(true)
    analyzeJob(job, cvText)
      .then(r => setAnalysis(r))
      .catch(() => {})
      .finally(() => setAnalysisLoading(false))
  }, [job, cvText, analyzeJob, analysisLoading])

  const handleAdaptCv = useCallback(() => {
    if (!job || !cvText || adaptLoading) return
    setAdaptLoading(true)
    adaptCv(job, cvText)
      .then(r => setAdaptedCv(r))
      .catch(() => {})
      .finally(() => setAdaptLoading(false))
  }, [job, cvText, adaptCv, adaptLoading])

  const handleReset = () => {
    setAdaptedCv(null)
    setCvEdited(null)
    setResetKey(k => k + 1)
  }

  const handleRegenerate = () => {
    if (!job || !cvText) return
    setAdaptedCv(null)
    setAdaptLoading(true)
    adaptCv(job, cvText)
      .then(r => setAdaptedCv(r))
      .catch(() => {})
      .finally(() => setAdaptLoading(false))
  }

  // Keywords matching
  const keywords   = extractKeywords(job?.description)
  const cvForMatch = (cvEdited ?? adaptedCv ?? cvText ?? '').toLowerCase()

  if (!job) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: 14, color: 'var(--text-secondary)',
      }}>
        <span style={{ fontSize: 48 }}>💼</span>
        <span style={{ fontSize: 14 }}>Select a job to view details</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* Mobile back button */}
      {onBack && (
        <div className="md:hidden" style={{ flexShrink: 0, marginBottom: 8 }}>
          <button
            className="btn-secondary"
            onClick={onBack}
            style={{ fontSize: 13, padding: '6px 14px' }}
          >
            ← Back to results
          </button>
        </div>
      )}

      {/* Tab bar */}
      <div className="tab-bar" style={{ flexShrink: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-item${activeTab === tab ? ' active' : ''}`}
            onClick={() => {
              setActiveTab(tab)
              // Auto-trigger AI on first tab visit
              if (tab === 'analysis' && !analysis && !analysisLoading && cvText) {
                handleAnalyze()
              }
              if (tab === 'cv' && !adaptedCv && !adaptLoading && cvText) {
                handleAdaptCv()
              }
            }}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        background: '#fff',
        borderRadius: '0 0 var(--radius-md) var(--radius-md)',
        border: '1px solid var(--border-light)',
        borderTop: 'none',
      }}>

        {/* ── Details tab ── */}
        {activeTab === 'details' && (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Job header */}
            <div>
              <div style={{
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                color: 'var(--text-tertiary)', letterSpacing: '0.05em', marginBottom: 4,
              }}>
                {job.company}
              </div>
              <h2 style={{
                fontSize: 20, fontWeight: 700, color: 'var(--text-primary)',
                margin: '0 0 10px', lineHeight: 1.3,
              }}>
                {job.title}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {[job.location, job.remote, job.type].filter(Boolean).map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              {job.salary && (
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--orange-primary)' }}>
                  {job.salary}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="section-label">Description</div>
              <p style={{
                fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.8,
                margin: 0, whiteSpace: 'pre-line',
              }}>
                {job.description}
              </p>
            </div>

            {/* Keywords */}
            {keywords.length > 0 && (
              <div>
                <div className="section-label">Keywords</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {keywords.map(kw => {
                    const found = cvForMatch.includes(kw)
                    return (
                      <span key={kw} style={{
                        fontSize: 11, padding: '3px 10px', borderRadius: 99,
                        background: found ? 'rgba(34,197,94,0.08)' : 'rgba(249,115,22,0.08)',
                        color: found ? '#16a34a' : '#c2410c',
                        border: `1px solid ${found ? 'rgba(34,197,94,0.2)' : 'rgba(249,115,22,0.2)'}`,
                        fontWeight: 500,
                      }}>
                        {kw}
                      </span>
                    )
                  })}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>Green</span> = in CV &nbsp;·&nbsp;
                  <span style={{ color: '#c2410c', fontWeight: 600 }}>Orange</span> = missing
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button
                className="btn-secondary"
                onClick={() => setShowCoverLetter(true)}
                disabled={!cvText}
                style={{
                  flex: 1,
                  opacity: cvText ? 1 : 0.5,
                  cursor: cvText ? 'pointer' : 'not-allowed',
                }}
              >
                ✉ Cover Letter
              </button>
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{
                  flex: 1, textAlign: 'center', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                Apply →
              </a>
            </div>
          </div>
        )}

        {/* ── AI Analysis tab ── */}
        {activeTab === 'analysis' && (
          <AiCoachPanel
            analysis={analysis}
            loading={analysisLoading}
            onAnalyze={handleAnalyze}
            hasCV={!!cvText}
          />
        )}

        {/* ── Adapted CV tab ── */}
        {activeTab === 'cv' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {!cvText ? (
              <div style={{
                padding: 32,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 12, color: 'var(--text-secondary)',
              }}>
                <span style={{ fontSize: 36 }}>📄</span>
                <span style={{ fontSize: 13 }}>Add your CV first to see an adapted version</span>
              </div>
            ) : !adaptedCv && !adaptLoading ? (
              <div style={{
                padding: 32,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 14, color: 'var(--text-secondary)',
              }}>
                <span style={{ fontSize: 36 }}>✨</span>
                <span style={{ fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>
                  AI will adapt your CV specifically for this role
                </span>
                <button className="btn-primary" onClick={handleAdaptCv}>
                  ✦ Adapt My CV
                </button>
              </div>
            ) : (
              <CvEditor
                cvText={cvText}
                adaptedCv={adaptedCv}
                onEdit={setCvEdited}
                loading={adaptLoading}
                onRegenerate={handleRegenerate}
                onReset={handleReset}
                job={job}
                resetKey={resetKey}
              />
            )}
          </div>
        )}
      </div>

      {showCoverLetter && (
        <CoverLetterModal
          job={job}
          cvText={cvEdited ?? adaptedCv ?? cvText}
          onClose={() => setShowCoverLetter(false)}
        />
      )}
    </div>
  )
}
