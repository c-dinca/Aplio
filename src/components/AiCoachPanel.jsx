function scoreColor(s) {
  if (s >= 75) return '#22c55e'
  if (s >= 50) return '#f97316'
  return '#ef4444'
}

function SkeletonBlock({ height = 16, width = '100%', style }) {
  return (
    <div
      className="skeleton"
      style={{ height, width, borderRadius: 6, flexShrink: 0, ...style }}
    />
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <SkeletonBlock height={72} width={72} style={{ borderRadius: 12 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SkeletonBlock height={12} width="60%" />
          <SkeletonBlock height={8} />
          <SkeletonBlock height={12} width="40%" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SkeletonBlock height={11} width="30%" />
        <SkeletonBlock height={12} />
        <SkeletonBlock height={12} width="70%" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SkeletonBlock height={11} width="25%" />
        <SkeletonBlock height={12} />
        <SkeletonBlock height={12} width="80%" />
      </div>
    </div>
  )
}

export default function AiCoachPanel({ analysis, loading, onAnalyze, hasCV }) {
  if (!hasCV) {
    return (
      <div style={{
        padding: 32,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 12, color: 'var(--text-secondary)',
      }}>
        <span style={{ fontSize: 36 }}>📄</span>
        <span style={{ fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>
          Add your CV first to unlock AI analysis
        </span>
      </div>
    )
  }

  if (!analysis && !loading) {
    return (
      <div style={{
        padding: 32,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 14, color: 'var(--text-secondary)',
      }}>
        <span style={{ fontSize: 36 }}>🤖</span>
        <span style={{ fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>
          Analyze how well your CV matches this job
        </span>
        <button
          className="btn-primary"
          onClick={onAnalyze}
          style={{ marginTop: 4 }}
        >
          ✦ Run AI Analysis
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <LoadingSkeleton />
      </div>
    )
  }

  const color     = scoreColor(analysis.score)
  const probColor = analysis.interview_probability === 'High'   ? '#22c55e'
                  : analysis.interview_probability === 'Medium' ? '#f97316'
                  : '#ef4444'

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Score + progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 12, flexShrink: 0,
          background: `${color}14`,
          border: `2px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color, fontFamily: 'monospace',
        }}>
          {analysis.score}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
            Match score
          </div>
          <div style={{ height: 6, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${analysis.score}%`,
              background: color,
              borderRadius: 99,
              transition: 'width 0.6s ease',
            }} />
          </div>

          <div style={{ marginTop: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
              background: `${probColor}14`, color: probColor,
              border: `1px solid ${probColor}30`,
            }}>
              {analysis.interview_probability} Interview Chance
            </span>
          </div>

          {analysis.interview_probability_reason && (
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 5, lineHeight: 1.5 }}>
              {analysis.interview_probability_reason}
            </div>
          )}
        </div>
      </div>

      {/* Strengths */}
      {analysis.match_reasons?.length > 0 && (
        <div>
          <div className="section-label" style={{ color: '#22c55e' }}>✓ Strengths</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {analysis.match_reasons.map((r, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-primary)', display: 'flex', gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gaps */}
      {analysis.gaps?.length > 0 && (
        <div>
          <div className="section-label" style={{ color: '#f97316' }}>⚠ Gaps</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {analysis.gaps.map((g, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-primary)', display: 'flex', gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: '#f97316', fontWeight: 700, flexShrink: 0 }}>⚠</span>
                <span>{g}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {analysis.key_thing && (
        <div style={{
          background: 'rgba(249,115,22,0.05)',
          border: '1px solid rgba(249,115,22,0.15)',
          borderRadius: 'var(--radius-sm)', padding: '12px 14px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', marginBottom: 4 }}>
            KEY THING TO MENTION
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.5 }}>
            {analysis.key_thing}
          </div>
        </div>
      )}

      {analysis.cover_letter_tip && (
        <div>
          <div className="section-label">Cover Letter Tip</div>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.65 }}>
            "{analysis.cover_letter_tip}"
          </div>
        </div>
      )}

      {analysis.interview_questions?.length > 0 && (
        <div>
          <div className="section-label">Likely Interview Questions</div>
          <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {analysis.interview_questions.map((q, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.55 }}>{q}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
