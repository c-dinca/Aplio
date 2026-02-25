import { useState } from 'react'
import AppliedList from './AppliedList'
import AppliedDetailPanel from './AppliedDetailPanel'

const MOCK_APPLIED = [
  { 
    id: 1, 
    title: 'Senior React Developer', 
    company: 'Google', 
    date: '2026-02-20T10:00:00Z', 
    status: 'Interview', 
    notes: 'Phone screen scheduled for next week.', 
    requirements: ['React', 'TypeScript', 'Node.js', 'System Design'], 
    jobDescription: 'We are looking for a Senior React Developer to join our core Search team. You will be responsible for building high-performance, accessible, and scalable user interfaces. Strong experience with React concurrent mode, modern hooks, and state management is required.' 
  },
  { 
    id: 2, 
    title: 'Full-Stack Engineer', 
    company: 'Meta', 
    date: '2026-02-18T10:00:00Z', 
    status: 'Applied', 
    notes: '', 
    requirements: ['GraphQL', 'Relay', 'React', 'Hack/PHP'], 
    jobDescription: 'Join our Reality Labs team to build the future of the metaverse. We need full stack engineers who can bridge the gap between complex backend services and immersive frontend experiences.' 
  },
  { 
    id: 3, 
    title: 'Frontend Lead', 
    company: 'Stripe', 
    date: '2026-02-15T10:00:00Z', 
    status: 'Offer', 
    notes: 'Offer received! Negotiating base salary.', 
    requirements: ['React', 'Design Systems', 'Leadership', 'Accessibility'], 
    jobDescription: 'Lead the frontend architecture for our core payments dashboard. You will guide a team of 4 engineers and work closely with product and design to establish our new design system.' 
  }
]

export default function AppliedView({ showMobileDetail, setShowMobileDetail }) {
  const [applications, setApplications] = useState(MOCK_APPLIED)
  const [selectedAppId, setSelectedAppId] = useState(MOCK_APPLIED[0]?.id)
  
  const selectedApp = applications.find(a => a.id === selectedAppId)

  const handleStatusChange = (id, status) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const handleUpdateApp = (id, updates) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  const handleRemoveApp = (id) => {
    setApplications(prev => prev.filter(a => a.id !== id))
    if (selectedAppId === id) setSelectedAppId(null)
  }

  const handleAddApp = (newApp) => {
    const id = Date.now()
    setApplications(prev => [
      { id, ...newApp, date: new Date().toISOString(), status: 'Applied', requirements: [], jobDescription: 'Added manually. No job description available.' },
      ...prev
    ])
    setSelectedAppId(id)
  }

  return (
    <>
      {/* Column 2: Applied List */}
      <div
        className={showMobileDetail ? 'desktop-only' : ''}
        style={{
          display: 'flex', width: 'var(--feed-w)', flexShrink: 0, flexDirection: 'column',
          height: '100%', borderRight: '1px solid var(--border)', background: 'var(--bg)', overflow: 'hidden'
        }}
      >
        <AppliedList
          applications={applications}
          selectedAppId={selectedAppId}
          onSelectApp={(app) => { setSelectedAppId(app.id); setShowMobileDetail(true) }}
          onChangeStatus={handleStatusChange}
          onRemoveApp={handleRemoveApp}
          onAddApplication={handleAddApp}
        />
      </div>

      {/* Column 3: Applied Detail */}
      <div
        className={showMobileDetail ? '' : 'desktop-only'}
        style={{
          display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column',
          height: '100%', overflow: 'hidden', background: 'var(--surface)'
        }}
      >
        {selectedApp ? (
          <>
            <div className="mobile-only" style={{ flexShrink: 0, padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
              <button className="btn btn-sm btn-outline-gray" onClick={() => setShowMobileDetail(false)}>← Back</button>
            </div>
            <AppliedDetailPanel 
              app={selectedApp} 
              onUpdateApp={(updates) => handleUpdateApp(selectedApp.id, updates)} 
            />
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 'var(--sp-4)', color: 'var(--text-muted)' }}>
             <p>Select an application to view details</p>
          </div>
        )}
      </div>
    </>
  )
}
