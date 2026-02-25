import { useState, useEffect } from 'react'
import Sidebar         from '../components/Sidebar'
import FilterModal     from '../components/FilterModal'
import JobList         from '../components/JobList'
import JobDetailPanel  from '../components/JobDetailPanel'
import AppliedView     from '../components/AppliedView'
import { useJobs }     from '../hooks/useJobs'
import { useToast }    from '../components/Toast'

export default function HomePage({ view = 'search', cvText = '', onEditCv, onLogin, isLoggedIn, user, onLogout }) {
  const { jobs, loading, error, searchJobs, favorites, toggleFavorite } = useJobs()
  const { showToast } = useToast()

  const [selectedJob,      setSelectedJob]      = useState(null)
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const [sortBy,           setSortBy]           = useState('Relevance')
  const [showFilters,      setShowFilters]      = useState(false)
  const [filterSelections, setFilterSelections] = useState({})
  const [showFavorites,    setShowFavorites]    = useState(false)

  const filterCount = Object.values(filterSelections).reduce((n, arr) => n + arr.length, 0)
  const favoritesCount = favorites?.length || 0

  useEffect(() => {
    if (error) showToast('Live search unavailable — showing cached results', 'error')
  }, [error]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (query, location) => {
    if (showFavorites) setShowFavorites(false)
    const result = await searchJobs(query, location)
    if (result.ok && !result.usedFallback) {
      showToast(`Found ${result.count} live jobs`, 'success')
    } else if (result.ok && result.usedFallback && (query || location)) {
      showToast('No live results — showing sample jobs', 'info')
    }
  }

  // Jobs to display — all or favorites only
  const displayJobs = showFavorites
    ? jobs.filter(j => favorites.includes(j.id))
    : jobs

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', width: '100%' }}>
      {/* Column 1: Sidebar */}
      <div className="desktop-only" style={{ height: '100%' }}>
        <Sidebar
          onSearch={handleSearch}
          onEditCv={onEditCv}
          onLogin={onLogin}
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={onLogout}
          filterCount={filterCount}
          onOpenFilters={() => setShowFilters(true)}
          showFavorites={showFavorites}
          onToggleFavorites={(forceState) => setShowFavorites(f => typeof forceState === 'boolean' ? forceState : !f)}
          favoritesCount={favoritesCount}
        />
      </div>

      {/* Conditionally render Search vs Applied views */}
      {view === 'applied' ? (
        <AppliedView 
          showMobileDetail={showMobileDetail} 
          setShowMobileDetail={setShowMobileDetail} 
        />
      ) : (
        <>
          {/* Column 2: Job Feed */}
          <div
            className={showMobileDetail ? 'desktop-only' : ''}
            style={{
              display: 'flex',
              width: 'var(--feed-w)', flexShrink: 0, flexDirection: 'column',
              height: '100%', borderRight: '1px solid var(--border)',
              background: 'var(--bg)', overflow: 'hidden',
            }}
          >
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-4) var(--sp-4)' }}>
              <JobList
                jobs={displayJobs}
                loading={loading}
                onSelectJob={job => { setSelectedJob(job); setShowMobileDetail(true) }}
                selectedJobId={selectedJob?.id}
                sortBy={sortBy}
                onSort={setSortBy}
                favorites={favorites}
                onFavorite={job => toggleFavorite(job.id, job)}
                cvText={cvText}
                headerLabel={showFavorites ? '★ Favorites' : null}
              />
            </div>
          </div>

          {/* Column 3: Job Detail */}
          <div
            className={showMobileDetail ? '' : 'desktop-only'}
            style={{
              display: 'flex',
              flex: 1, minWidth: 0, flexDirection: 'column',
              height: '100%', overflow: 'hidden', background: 'var(--surface)',
            }}
          >
            {selectedJob ? (
              <>
                <div className="mobile-only" style={{
                  flexShrink: 0, padding: 'var(--sp-3) var(--sp-4)',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <button className="btn btn-sm btn-outline-gray"
                    onClick={() => setShowMobileDetail(false)}>← Back</button>
                </div>
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <JobDetailPanel job={selectedJob} cvText={cvText} />
                </div>
              </>
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '100%', gap: 'var(--sp-4)',
                color: 'var(--text-muted)', padding: 'var(--sp-10)',
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 'var(--r-full)',
                  background: 'var(--blue-50)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 36,
                }}>💼</div>
                <span style={{
                  fontSize: '1.1rem', fontFamily: 'var(--font-display)',
                  fontWeight: 700, color: 'var(--text-head)',
                }}>Select a job to view details</span>
                <span style={{ fontSize: '0.88rem', textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
                  Browse the list on the left or search for something specific using the sidebar
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Filter Modal */}
      {showFilters && (
        <FilterModal
          selections={filterSelections}
          onChange={setFilterSelections}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  )
}
