import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JobCard from '../components/JobCard'
import JobDetailPanel from '../components/JobDetailPanel'
import { useJobs, MOCK_JOBS } from '../hooks/useJobs'

export default function FavoritesPage({ cvText = '' }) {
  const navigate = useNavigate()
  const { jobs, favorites, toggleFavorite } = useJobs()
  const [selectedJob, setSelectedJob] = useState(null)

  // Build favorite job objects — try from loaded jobs first, then mock
  const allKnown = [...jobs, ...MOCK_JOBS]
  const favoriteJobs = favorites
    .map(id => allKnown.find(j => j.id === id))
    .filter(Boolean)

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      width: '100%',
    }}>
      {/* Left column: favorites list */}
      <div style={{
        width: 'var(--feed-w)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRight: '1px solid var(--border)',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: 'var(--sp-5) var(--sp-4)',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none', border: '1.5px solid var(--border)',
                borderRadius: 'var(--r-sm)', padding: '6px 12px',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                fontSize: '0.82rem', fontWeight: 600,
                color: 'var(--text-body)', display: 'flex',
                alignItems: 'center', gap: 6,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.color = 'var(--primary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-body)'
              }}
            >
              ← Back
            </button>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--text-head)',
            }}>
              ⭐ Favorite Jobs
            </div>
          </div>
          <div style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}>
            {favoriteJobs.length === 0
              ? 'No favorites yet'
              : `${favoriteJobs.length} saved job${favoriteJobs.length !== 1 ? 's' : ''}`
            }
          </div>
        </div>

        {/* List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--sp-4)',
        }}>
          {favoriteJobs.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', gap: 'var(--sp-4)',
              color: 'var(--text-muted)', padding: 'var(--sp-10)',
              textAlign: 'center',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 'var(--r-full)',
                background: 'var(--orange-50)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 32,
              }}>⭐</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '1rem', color: 'var(--text-head)',
              }}>
                No favorites yet
              </div>
              <div style={{ fontSize: '0.85rem', lineHeight: 1.5, maxWidth: 260 }}>
                Click the star icon on any job card to save it here for later
              </div>
              <button
                className="btn btn-md btn-primary"
                onClick={() => navigate('/')}
                style={{ marginTop: 'var(--sp-2)' }}
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {favoriteJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onClick={() => setSelectedJob(job)}
                  isSelected={selectedJob?.id === job.id}
                  isFavorite={true}
                  onFavorite={(j) => toggleFavorite(j.id, j)}
                  cvText={cvText}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right column: detail */}
      <div
        className="desktop-only"
        style={{
          flex: 1, minWidth: 0,
          display: 'flex', flexDirection: 'column',
          height: '100%', overflow: 'hidden',
          background: 'var(--surface)',
        }}
      >
        {selectedJob ? (
          <JobDetailPanel job={selectedJob} cvText={cvText} />
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: 'var(--sp-4)',
            color: 'var(--text-muted)', padding: 'var(--sp-10)',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 'var(--r-full)',
              background: 'var(--orange-50)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 36,
            }}>⭐</div>
            <span style={{
              fontSize: '1.1rem', fontFamily: 'var(--font-display)',
              fontWeight: 700, color: 'var(--text-head)',
            }}>
              Select a favorite to view details
            </span>
            <span style={{ fontSize: '0.88rem', textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
              Click on a saved job from the list to see its full details here
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
