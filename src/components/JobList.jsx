import JobCard from './JobCard'

function Skeleton({ height = 16, width = '100%', style }) {
  return <div className="skeleton" style={{ height, width, ...style }} />
}

function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: 'var(--sp-4)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Skeleton height={36} width={36} style={{ borderRadius: 'var(--r-sm)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton height={10} width={80} style={{ borderRadius: 6 }} />
          </div>
        </div>
        <Skeleton height={22} width={56} style={{ borderRadius: 99 }} />
      </div>
      <Skeleton height={14} width="80%" style={{ borderRadius: 6, marginBottom: 'var(--sp-3)' }} />
      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--sp-3)' }}>
        <Skeleton height={22} width={60} style={{ borderRadius: 99 }} />
        <Skeleton height={22} width={70} style={{ borderRadius: 99 }} />
        <Skeleton height={22} width={80} style={{ borderRadius: 99 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton height={14} width="35%" style={{ borderRadius: 6 }} />
        <Skeleton height={12} width="15%" style={{ borderRadius: 6 }} />
      </div>
    </div>
  )
}

export default function JobList({
  jobs, loading, onSelectJob, selectedJobId,
  sortBy, onSort, favorites = [], onFavorite, cvText, headerLabel,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 0 var(--sp-2)',
      }}>
        <span style={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: 'var(--text-head)',
          fontFamily: 'var(--font-display)',
        }}>
          {loading ? 'Searching…' : headerLabel || `${jobs.length} Results`}
        </span>

        <select
          value={sortBy}
          onChange={e => onSort(e.target.value)}
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            background: 'transparent',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--r-sm)',
            padding: '5px 10px',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          <option value="Relevance">Relevance</option>
          <option value="Recent">Date</option>
          <option value="Salary">Salary</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
      ) : jobs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--sp-12) var(--sp-6)',
          color: 'var(--text-muted)',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--r-full)',
            background: 'var(--gray-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            margin: '0 auto var(--sp-4)',
          }}>
            🔍
          </div>
          <div style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--text-head)',
            marginBottom: 'var(--sp-2)',
            fontFamily: 'var(--font-display)',
          }}>
            No jobs found
          </div>
          <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
            Try searching for a different keyword or location
          </div>
        </div>
      ) : (
        jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onClick={onSelectJob}
            isSelected={selectedJobId === job.id}
            isFavorite={favorites.includes(job.id)}
            onFavorite={onFavorite}
            cvText={cvText}
          />
        ))
      )}
    </div>
  )
}
