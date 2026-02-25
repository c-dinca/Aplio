function Skeleton({ height = 16, width = '100%', style }) {
  return <div className="skeleton" style={{ height, width, borderRadius: 8, flexShrink: 0, ...style }} />
}

function AnalysisSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-5)' }}>
        <Skeleton height={96} width={96} style={{ borderRadius: '50%' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          <Skeleton height={14} width="60%" />
          <Skeleton height={10} />
          <Skeleton height={10} width="40%" />
        </div>
      </div>
      <Skeleton height={6} />
      <Skeleton height={6} width="70%" />
      <Skeleton height={6} width="85%" />
    </div>
  )
}

function ScoreColor(score) {
  if (score >= 75) return 'var(--green-500)'
  if (score >= 50) return 'var(--accent)'
  return 'var(--red-500)'
}

export default function AiCoachPanel({ analysis, loading }) {
  if (loading) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: 'var(--sp-8)',
      }}>
        <div style={{
          fontSize: '0.72rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          color: 'var(--text-muted)', marginBottom: 'var(--sp-5)',
        }}>AI Analysis</div>
        <AnalysisSkeleton />
      </div>
    )
  }

  if (!analysis) return null

  const color = ScoreColor(analysis.score)
  const radius = 48
  const stroke = 9
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (analysis.score / 100) * circumference

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: 'var(--sp-8)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        fontSize: '0.72rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.1em',
        color: 'var(--text-muted)', marginBottom: 'var(--sp-6)',
      }}>AI Analysis Result</div>

      {/* Score Ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
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
              fontSize: '1.5rem', fontWeight: 700,
              color,
              lineHeight: 1,
            }}>
              {analysis.score}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              / 100
            </span>
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem', fontWeight: 700,
            color: 'var(--text-head)', marginBottom: 'var(--sp-1)',
          }}>
            {analysis.score >= 75 ? 'Strong Match' : analysis.score >= 50 ? 'Moderate Match' : 'Weak Match'}
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--sp-1)',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: analysis.interview_probability === 'High' ? 'var(--green-500)'
              : analysis.interview_probability === 'Medium' ? 'var(--accent)' : 'var(--red-500)',
            marginBottom: 'var(--sp-2)',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'currentColor', display: 'inline-block',
            }} />
            {analysis.interview_probability} interview probability
          </div>
          {analysis.interview_probability_reason && (
            <div style={{
              fontSize: '0.8rem', color: 'var(--text-muted)',
              lineHeight: 1.55, maxWidth: 280,
            }}>
              {analysis.interview_probability_reason}
            </div>
          )}
        </div>
      </div>

      {/* Score Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-8)' }}>
        {[
          { label: 'Skills', value: analysis.score, fill: 'var(--primary)' },
          { label: 'Experience', value: Math.max(0, analysis.score - 10), fill: 'var(--primary)' },
          { label: 'Keywords', value: Math.max(0, analysis.score - 20), fill: 'var(--accent)' },
        ].map(bar => (
          <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: 80, flexShrink: 0 }}>
              {bar.label}
            </span>
            <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: bar.fill,
                width: `${bar.value}%`,
                transition: 'width 1s ease',
              }} />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-body)', width: 28, textAlign: 'right' }}>
              {bar.value}
            </span>
          </div>
        ))}
      </div>

      {/* Strengths */}
      {analysis.match_reasons?.length > 0 && (
        <div style={{ marginBottom: 'var(--sp-6)' }}>
          <div style={{
            fontSize: '0.72rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: 'var(--green-500)', marginBottom: 'var(--sp-3)',
          }}>✓ Strengths</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {analysis.match_reasons.map((r, i) => (
              <div key={i} style={{
                fontSize: '0.85rem', color: 'var(--text-head)',
                display: 'flex', gap: 'var(--sp-2)', lineHeight: 1.55,
                padding: 'var(--sp-2) var(--sp-3)',
                background: 'var(--green-50)',
                borderRadius: 'var(--r-sm)',
              }}>
                <span style={{ color: 'var(--green-500)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gaps */}
      {analysis.gaps?.length > 0 && (
        <div style={{ marginBottom: 'var(--sp-6)' }}>
          <div style={{
            fontSize: '0.72rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: 'var(--accent)', marginBottom: 'var(--sp-3)',
          }}>⚠ Gaps</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {analysis.gaps.map((g, i) => (
              <div key={i} style={{
                fontSize: '0.85rem', color: 'var(--text-head)',
                display: 'flex', gap: 'var(--sp-2)', lineHeight: 1.55,
                padding: 'var(--sp-2) var(--sp-3)',
                background: 'var(--orange-50)',
                borderRadius: 'var(--r-sm)',
              }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>⚠</span>
                <span>{g}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key thing */}
      {analysis.key_thing && (
        <div style={{
          background: 'linear-gradient(135deg, var(--blue-50), var(--orange-50))',
          border: '1px solid var(--orange-100)',
          borderRadius: 'var(--r-md)',
          padding: 'var(--sp-4) var(--sp-5)',
          marginBottom: 'var(--sp-5)',
        }}>
          <div style={{
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)',
            marginBottom: 'var(--sp-2)', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            💡 Key Thing to Mention
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-head)', fontWeight: 600, lineHeight: 1.55 }}>
            {analysis.key_thing}
          </div>
        </div>
      )}

      {/* Interview Questions */}
      {analysis.interview_questions?.length > 0 && (
        <div>
          <div style={{
            fontSize: '0.72rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: 'var(--text-muted)', marginBottom: 'var(--sp-3)',
          }}>Likely Interview Questions</div>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {analysis.interview_questions.map((q, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-head)', lineHeight: 1.6 }}>{q}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
