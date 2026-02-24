import { useState, useEffect } from 'react'
import SearchBar       from '../components/SearchBar'
import JobList         from '../components/JobList'
import JobDetailPanel  from '../components/JobDetailPanel'
import { useJobs }     from '../hooks/useJobs'
import { useToast }    from '../components/Toast'

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage({ cvText = '' }) {
  const { jobs, loading, error, searchJobs, favorites, toggleFavorite } = useJobs()
  const { showToast } = useToast()

  const [selectedJob,      setSelectedJob]      = useState(null)
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const [sortBy,           setSortBy]           = useState('Relevance')

  // Surface API errors as toasts
  useEffect(() => {
    if (error) showToast('Live search unavailable — showing cached results', 'error')
  }, [error]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (query, location, filters) => {
    const result = await searchJobs(query, location, filters)
    if (result.ok && !result.usedFallback) {
      showToast(`Found ${result.count} live jobs`, 'success')
    } else if (result.ok && result.usedFallback && (query || location)) {
      showToast('No live results — showing sample jobs', 'info')
    }
  }

  const handleSelectJob = (job) => {
    setSelectedJob(job)
    setShowMobileDetail(true)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden', width: '100%',
    }}>
      {/* ── Search bar ── */}
      <div style={{ padding: '12px 16px', flexShrink: 0 }}>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* ── Left: job list ── */}
        <div
          className={showMobileDetail ? 'hidden md:block' : ''}
          style={{
            width: 'min(400px, 100%)',
            flexShrink: 0,
            overflowY: 'auto',
            padding: '0 12px 16px 16px',
          }}
        >
          <JobList
            jobs={jobs}
            loading={loading}
            onSelectJob={handleSelectJob}
            selectedJobId={selectedJob?.id}
            sortBy={sortBy}
            onSort={setSortBy}
            favorites={favorites}
            onFavorite={(job) => toggleFavorite(job.id, job)}
          />
        </div>

        {/* ── Right: job detail ── */}
        <div
          className={showMobileDetail ? '' : 'hidden md:block'}
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            padding: '0 16px 16px 4px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <JobDetailPanel
            job={selectedJob}
            cvText={cvText}
            onBack={() => setShowMobileDetail(false)}
          />
        </div>
      </div>
    </div>
  )
}
