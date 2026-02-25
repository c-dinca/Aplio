import { useState, useEffect } from 'react'
import { useClaude } from '../hooks/useClaude'
import AiCoachPanel from './AiCoachPanel'
import CoverLetterModal from './CoverLetterModal'

const STOP_WORDS = new Set(
  'and.or.the.a.an.to.of.in.for.with.is.are.be.by.as.on.at.from.that.this.it.we.you.our.your.will.can.have.has.been.not.all.also.up.its.their.which.they.but.about.more.other.into.than.if.what.use.using.build.work.team.experience.strong.good.excellent.required.preferred.must.ability.skills.able.knowledge.including.such.may.both.some.should.level.working.years.responsible.role.position.plus.bonus.benefits.looking.join.help.make.great'.split('.')
)

function extractKeywords(text = '') {
  const words = text.match(/\b[A-Za-z][a-zA-Z0-9.#+]{2,}\b/g) ?? []
  const freq = {}
  words.forEach(w => {
    const lw = w.toLowerCase()
    if (!STOP_WORDS.has(lw)) freq[lw] = (freq[lw] ?? 0) + 1
  })
  return Object.entries(freq).sort(([, a], [, b]) => b - a).slice(0, 14).map(([w]) => w)
}

const TABS = [
  { id: 'details',  label: '📋 Overview' },
  { id: 'analysis', label: '🤖 AI Analysis' },
  { id: 'cv',       label: '📄 Adapted CV' },
]

/* ── Donut Chart ── */
function DonutChart({ matched, total }) {
  const pct = total > 0 ? Math.round((matched / total) * 100) : 0
  const radius = 44
  const stroke = 8
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference
  const color = pct >= 75 ? 'var(--green-500)' : pct >= 50 ? 'var(--accent)' : 'var(--red-500)'

  return (
    <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius}
          fill="none" stroke="var(--gray-100)" strokeWidth={stroke} />
        <circle cx="55" cy="55" r={radius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem',
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}>
          {pct}%
        </span>
        <span style={{
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          fontWeight: 500,
        }}>
          match
        </span>
      </div>
    </div>
  )
}

export default function JobDetailPanel({ job, cvText }) {
  const { analyzeJob, adaptCv } = useClaude()
  const [activeTab,      setActiveTab]      = useState('details')
  const [analysis,       setAnalysis]       = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [adaptedCv,      setAdaptedCv]      = useState(null)
  const [adaptLoading,   setAdaptLoading]   = useState(false)
  const [showCoverLetter, setShowCoverLetter] = useState(false)

  // Reset when job changes
  useEffect(() => {
    setAnalysis(null)
    setAdaptedCv(null)
    setActiveTab('details')
  }, [job?.id])

  const runAnalysis = async () => {
    if (!job || !cvText) return
    setAnalysisLoading(true)
    try {
      const result = await analyzeJob(job, cvText)
      setAnalysis(result)
    } catch {} finally { setAnalysisLoading(false) }
  }

  const runAdapt = async () => {
    if (!job || !cvText) return
    setAdaptLoading(true)
    try {
      const result = await adaptCv(job, cvText)
      setAdaptedCv(result)
    } catch {} finally { setAdaptLoading(false) }
  }

  const keywords = extractKeywords(job?.description)
  const cvLower = (cvText || '').toLowerCase()
  const matchedKw = keywords.filter(kw => cvLower.includes(kw))
  const missingKw = keywords.filter(kw => !cvLower.includes(kw))

  const initials = (job.company || '??')
    .split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: 0,
    }}>
      {/* ── STICKY HEADER ── */}
      <div style={{
        flexShrink: 0,
        background: 'linear-gradient(180deg, rgba(37,99,235,0.04) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--sp-5) var(--sp-6)',
      }}>
        {/* Company + Apply */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--sp-3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: 'var(--r-sm)',
              background: 'linear-gradient(135deg, var(--blue-500), var(--blue-700))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: '0.8rem',
              fontFamily: 'var(--font-display)',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <div style={{
                fontSize: '0.72rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                color: 'var(--text-muted)',
              }}>
                {job.company}
              </div>
            </div>
          </div>
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-md btn-primary btn-pill"
            style={{ flexShrink: 0 }}
          >
            Apply →
          </a>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.35rem', fontWeight: 700,
          color: 'var(--text-head)',
          margin: '0 0 var(--sp-3)', lineHeight: 1.25,
        }}>
          {job.title}
        </h1>

        {/* Tags + Salary row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--sp-2)',
          alignItems: 'center',
        }}>
          {job.location && <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>📍 {job.location}</span>}
          {job.remote && <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{job.remote}</span>}
          {job.type && <span className="badge badge-outline" style={{ fontSize: '0.72rem' }}>{job.type}</span>}
          {job.salary && (
            <span style={{
              fontWeight: 700,
              color: 'var(--primary)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-display)',
              marginLeft: 'auto',
            }}>
              {job.salary}
            </span>
          )}
        </div>
      </div>

      {/* ── SEGMENTED PILL TABS ── */}
      <div style={{
        flexShrink: 0,
        padding: 'var(--sp-3) var(--sp-6)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="tab-group">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-pill ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: 'var(--sp-5) var(--sp-6)',
      }}>
        <div key={activeTab} className="fade-in">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              {/* Job description */}
              <div>
                <div style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--sp-3)',
                }}>Description</div>
                <p style={{
                  fontSize: '0.88rem', color: 'var(--text-body)',
                  lineHeight: 1.8, margin: 0,
                }}>
                  {job.description}
                </p>
              </div>

              {/* Keyword Match Card */}
              {keywords.length > 0 && (
                <div style={{
                  background: 'var(--gray-100)',
                  borderRadius: 'var(--r-lg)',
                  padding: 'var(--sp-6)',
                }}>
                  <div style={{
                    fontSize: '0.72rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    marginBottom: 'var(--sp-4)',
                  }}>Keyword Match</div>

                  <div style={{
                    display: 'flex',
                    gap: 'var(--sp-6)',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}>
                    {/* Donut chart */}
                    <DonutChart matched={matchedKw.length} total={keywords.length} />

                    {/* Right side */}
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--text-head)',
                        marginBottom: 'var(--sp-1)',
                      }}>
                        Your CV covers {keywords.length > 0 ? Math.round((matchedKw.length / keywords.length) * 100) : 0}% of this role
                      </div>
                      <div style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        marginBottom: 'var(--sp-3)',
                      }}>
                        {matchedKw.length} of {keywords.length} keywords matched
                      </div>

                      {/* Two-column keywords */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-1)' }}>
                        {keywords.map(kw => {
                          const inCv = cvLower.includes(kw)
                          return (
                            <span key={kw} style={{
                              fontSize: '0.72rem', padding: '3px 10px', borderRadius: 99,
                              background: inCv ? 'var(--green-50)' : 'var(--orange-50)',
                              color: inCv ? 'var(--green-500)' : 'var(--orange-600)',
                              border: `1px solid ${inCv ? 'var(--green-border)' : 'var(--orange-100)'}`,
                              fontWeight: 600,
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {inCv ? '✓ ' : ''}{kw}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── AI ANALYSIS TAB ── */}
          {activeTab === 'analysis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              {!analysis && !analysisLoading && (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--sp-10) var(--sp-6)',
                }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 'var(--r-full)',
                    background: 'var(--blue-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    margin: '0 auto var(--sp-4)',
                  }}>
                    🤖
                  </div>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--text-head)',
                    marginBottom: 'var(--sp-2)',
                    fontFamily: 'var(--font-display)',
                  }}>
                    Analyze your fit
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    marginBottom: 'var(--sp-5)',
                    lineHeight: 1.5,
                    maxWidth: 320,
                    margin: '0 auto var(--sp-5)',
                  }}>
                    Get AI-powered insights on how well your CV matches this role
                  </div>
                  <button
                    className="btn btn-md btn-primary btn-pill"
                    onClick={runAnalysis}
                    disabled={!cvText}
                    style={{ opacity: cvText ? 1 : 0.5 }}
                  >
                    🤖 Run AI Analysis
                  </button>
                  {!cvText && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 'var(--sp-3)' }}>
                      Add your CV first to enable analysis
                    </p>
                  )}
                </div>
              )}
              <AiCoachPanel analysis={analysis} loading={analysisLoading} />
            </div>
          )}

          {/* ── ADAPTED CV TAB ── */}
          {activeTab === 'cv' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              {!adaptedCv && !adaptLoading && (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--sp-10) var(--sp-6)',
                }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 'var(--r-full)',
                    background: 'var(--orange-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    margin: '0 auto var(--sp-4)',
                  }}>
                    ✨
                  </div>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--text-head)',
                    marginBottom: 'var(--sp-2)',
                    fontFamily: 'var(--font-display)',
                  }}>
                    Adapt your CV
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    marginBottom: 'var(--sp-5)',
                    lineHeight: 1.5,
                    maxWidth: 320,
                    margin: '0 auto var(--sp-5)',
                  }}>
                    Let AI tailor your CV specifically for this position
                  </div>
                  <button
                    className="btn btn-md btn-accent btn-pill"
                    onClick={runAdapt}
                    disabled={!cvText}
                    style={{ opacity: cvText ? 1 : 0.5 }}
                  >
                    ✨ Adapt CV for this Job
                  </button>
                  {!cvText && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 'var(--sp-3)' }}>
                      Add your CV first to enable adaptation
                    </p>
                  )}
                </div>
              )}

              {adaptLoading && (
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-lg)',
                  padding: 'var(--sp-10)', textAlign: 'center',
                }}>
                  <div style={{
                    width: 36, height: 36,
                    border: '3px solid var(--blue-100)',
                    borderTop: '3px solid var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto var(--sp-4)',
                  }} />
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Adapting your CV…
                  </div>
                </div>
              )}

              {adaptedCv && (
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-lg)',
                  padding: 'var(--sp-6)',
                }}>
                  <div style={{
                    fontSize: '0.72rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: 'var(--primary)', marginBottom: 'var(--sp-4)',
                  }}>✦ Adapted CV</div>
                  <div style={{
                    fontSize: '0.88rem', lineHeight: 1.8,
                    color: 'var(--text-head)',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}
                    dangerouslySetInnerHTML={{
                      __html: adaptedCv
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/\[CHANGED\]([\s\S]*?)\[\/CHANGED\]/g,
                          (_, t) => `<span style="background:#fef08a;border-radius:3px;padding:1px 3px">${t}</span>`)
                        .replace(/\n/g, '<br>')
                    }}
                  />
                  <div style={{ marginTop: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-2)' }}>
                    <button className="btn btn-sm btn-outline-gray" onClick={runAdapt}>
                      ↺ Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── STICKY BOTTOM ACTION BAR ── */}
      <div style={{
        flexShrink: 0,
        padding: 'var(--sp-3) var(--sp-6)',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        gap: 'var(--sp-3)',
      }}>
        <button
          className="btn btn-md btn-outline"
          onClick={() => setShowCoverLetter(true)}
          disabled={!cvText}
          style={{
            flex: 1,
            justifyContent: 'center',
            opacity: cvText ? 1 : 0.5,
          }}
        >
          ✉ Cover Letter
        </button>
        <a
          href={job.url}
          target="_blank"
          rel="noreferrer"
          className="btn btn-md btn-primary"
          style={{ flex: 1, justifyContent: 'center', textAlign: 'center' }}
        >
          Apply Now →
        </a>
      </div>

      {showCoverLetter && (
        <CoverLetterModal job={job} cvText={cvText} onClose={() => setShowCoverLetter(false)} />
      )}
    </div>
  )
}
