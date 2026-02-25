const STOP_WORDS = new Set(
  'and.or.the.a.an.to.of.in.for.with.is.are.be.by.as.on.at.from.that.this.it.we.you.our.your.will.can.have.has.been.not.all.also.up.its.their.which.they.but.about.more.other.into.than.if.what.use.using.build.work.team.experience.strong.good.excellent.required.preferred.must.ability.skills.able.knowledge.including.such.may.both.some.should.level.working.years.responsible.role.position.plus.bonus.benefits.looking.join.help.make.great'.split('.')
)

function getMatchScore(jobDesc = '', cvText = '') {
  if (!cvText || !jobDesc) return null
  const words = jobDesc.match(/\b[A-Za-z][a-zA-Z0-9.#+]{2,}\b/g) ?? []
  const freq = {}
  words.forEach(w => {
    const lw = w.toLowerCase()
    if (!STOP_WORDS.has(lw)) freq[lw] = (freq[lw] ?? 0) + 1
  })
  const keywords = Object.entries(freq).sort(([, a], [, b]) => b - a).slice(0, 12).map(([w]) => w)
  if (keywords.length === 0) return null
  const cvLower = cvText.toLowerCase()
  const matched = keywords.filter(kw => cvLower.includes(kw)).length
  return Math.round((matched / keywords.length) * 100)
}

function MatchBadge({ score }) {
  if (score === null) return null
  const color = score >= 75 ? 'var(--green-500)' : score >= 50 ? 'var(--accent)' : 'var(--red-500)'
  const bg = score >= 75 ? 'var(--green-50)' : score >= 50 ? 'var(--orange-50)' : 'var(--red-50)'
  const border = score >= 75 ? 'var(--green-border)' : score >= 50 ? 'var(--orange-100)' : 'var(--red-border)'
  return (
    <span style={{
      fontSize: '0.7rem',
      fontWeight: 700,
      padding: '3px 10px',
      borderRadius: 'var(--r-full)',
      background: bg,
      color: color,
      border: `1px solid ${border}`,
      fontFamily: 'var(--font-body)',
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      whiteSpace: 'nowrap',
    }}>
      {score}% Match
    </span>
  )
}

export default function JobCard({ job, onClick, isSelected, isFavorite, onFavorite, cvText }) {
  const initials = (job.company || '??')
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const matchScore = getMatchScore(job.description, cvText)

  return (
    <div
      onClick={() => onClick(job)}
      style={{
        background: isSelected ? 'var(--blue-50)' : 'var(--surface)',
        border: `1px solid ${isSelected ? 'var(--blue-300)' : 'var(--border)'}`,
        borderRadius: 'var(--r-md)',
        padding: 'var(--sp-4)',
        boxShadow: isSelected ? '0 0 0 3px rgba(37,99,235,0.08)' : 'var(--shadow-sm)',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.borderColor = 'var(--blue-100)'
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = 'var(--border)'
        }
      }}
    >
      {/* Left accent stripe */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 4,
        background: isSelected ? 'var(--primary)' : 'transparent',
        transition: 'background 0.15s',
        borderRadius: '0 2px 2px 0',
      }} />

      {/* Top: company + match score */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--sp-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: 'var(--r-sm)',
            background: 'linear-gradient(135deg, var(--blue-500), var(--blue-700))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '0.65rem',
            fontFamily: 'var(--font-display)',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <span style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}>
            {job.company}
          </span>
        </div>

        <MatchBadge score={matchScore} />
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.9rem',
        fontWeight: 700,
        color: 'var(--text-head)',
        marginBottom: 'var(--sp-2)',
        lineHeight: 1.35,
      }}>
        {job.title}
      </div>

      {/* Tags row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--sp-1)',
        marginBottom: 'var(--sp-3)',
      }}>
        {job.remote && (
          <span className="badge badge-blue" style={{ fontSize: '0.68rem', padding: '3px 10px' }}>
            {job.remote}
          </span>
        )}
        {job.type && (
          <span className="badge badge-outline" style={{ fontSize: '0.68rem', padding: '3px 10px' }}>
            {job.type}
          </span>
        )}
        {job.location && (
          <span className="badge badge-outline" style={{ fontSize: '0.68rem', padding: '3px 10px' }}>
            📍 {job.location.split(',')[0]}
          </span>
        )}
      </div>

      {/* Bottom: salary + posted + bookmark */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontWeight: 700,
          color: 'var(--primary)',
          fontSize: '0.88rem',
          fontFamily: 'var(--font-display)',
        }}>
          {job.salary || '—'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {job.postedAt}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onFavorite?.(job) }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 16, padding: 2, lineHeight: 1,
              color: isFavorite ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'color 0.15s, transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  )
}
