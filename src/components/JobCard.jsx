const pill = {
  fontSize: 11,
  padding: '2px 9px',
  borderRadius: 20,
  color: 'var(--text-secondary)',
  cursor: 'default',
  whiteSpace: 'nowrap',
  background: '#F1F5F9',
  border: '1px solid var(--border-light)',
}

export default function JobCard({ job, onSelect, isSelected, onFavorite, isFavorited = false }) {
  const handleFavorite = (e) => {
    e.stopPropagation()
    onFavorite?.(job)
  }

  return (
    <div
      onClick={() => onSelect(job)}
      className={`card${isSelected ? ' active' : ''}`}
      style={{
        padding: '14px 16px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Top row: company · date · heart */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
          letterSpacing: '0.04em',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {job.company}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }}>
          {job.postedAt}
        </span>
        <button
          onClick={handleFavorite}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            padding: 0,
            lineHeight: 1,
            flexShrink: 0,
            color: isFavorited ? '#ef4444' : 'var(--text-tertiary)',
            transition: 'color 0.15s ease',
          }}
          title={isFavorited ? 'Remove from favourites' : 'Save job'}
        >
          {isFavorited ? '♥' : '☆'}
        </button>
      </div>

      {/* Title — 2-line clamp */}
      <div style={{
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginTop: 4,
        marginBottom: 8,
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {job.title}
      </div>

      {/* Tag pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: job.salary ? 8 : 0 }}>
        {job.location && (
          <span style={pill}>📍 {job.location}</span>
        )}
        {job.remote && (
          <span style={pill}>{job.remote}</span>
        )}
        {job.type && (
          <span style={pill}>{job.type}</span>
        )}
      </div>

      {/* Salary */}
      {job.salary && (
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--orange-primary)' }}>
          {job.salary}
        </div>
      )}
    </div>
  )
}
