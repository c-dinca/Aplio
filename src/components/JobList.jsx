import JobCard from './JobCard'

const SORT_OPTIONS = ['Relevance', 'Date', 'Salary']

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
        <div className="skeleton" style={{ height: 11, width: '42%' }} />
        <div style={{ flex: 1 }} />
        <div className="skeleton" style={{ height: 11, width: 36 }} />
      </div>
      <div className="skeleton" style={{ height: 14, width: '82%', marginBottom: 5 }} />
      <div className="skeleton" style={{ height: 14, width: '58%', marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 6 }}>
        <div className="skeleton" style={{ height: 20, width: 110, borderRadius: 20 }} />
        <div className="skeleton" style={{ height: 20, width: 64, borderRadius: 20 }} />
      </div>
    </div>
  )
}

export default function JobList({
  jobs,
  loading,
  onSelectJob,
  selectedJobId,
  onSort,
  sortBy = 'Relevance',
  favorites = [],
  onFavorite,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Sticky results header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: '8px 4px',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        background: 'var(--bg-base)',
      }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {loading
            ? 'Searching…'
            : `${jobs.length} result${jobs.length !== 1 ? 's' : ''}`}
        </span>
        <select
          value={sortBy}
          onChange={e => onSort?.(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 12,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : jobs.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 20px',
            gap: 12,
          }}>
            <span style={{ fontSize: 44 }}>🔍</span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Search for jobs above
            </span>
          </div>
        ) : (
          jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onSelectJob}
              isSelected={job.id === selectedJobId}
              isFavorited={favorites.includes(job.id)}
              onFavorite={onFavorite}
            />
          ))
        )}
      </div>
    </div>
  )
}
