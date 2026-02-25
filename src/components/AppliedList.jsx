import { useState } from 'react'

const STATUS_OPTIONS = ['Applied', 'Interview', 'Offer', 'Rejected']
const STATUS_COLORS = {
  Applied:   { bg: 'var(--blue-50)',   text: 'var(--blue-600)',  border: 'var(--border)' },
  Interview: { bg: '#FFF7ED',          text: '#EA580C',          border: '#FDBA74' },
  Offer:     { bg: 'var(--green-50)',  text: 'var(--green-500)', border: 'var(--green-border)' },
  Rejected:  { bg: '#FEF2F2',          text: '#DC2626',          border: '#FCA5A5' },
}

export default function AppliedList({
  applications,
  selectedAppId,
  onSelectApp,
  onChangeStatus,
  onRemoveApp,
  onAddApplication
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ title: '', company: '' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newItem.title.trim() || !newItem.company.trim()) return
    onAddApplication({ ...newItem, notes: '' })
    setNewItem({ title: '', company: '' })
    setShowAdd(false)
  }

  // Calculate stats
  const stats = STATUS_OPTIONS.map(s => ({
    label: s,
    count: applications.filter(a => a.status === s).length,
    ...STATUS_COLORS[s],
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {/* Header and Stats */}
      <div style={{ padding: 'var(--sp-4)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 700, margin: 0 }}>
            Applied Jobs
          </h2>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setShowAdd(!showAdd)}
          >
            {showAdd ? '✕' : '+ Add'}
          </button>
        </div>

        {/* Mini stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: s.bg, border: `1px solid ${s.border}`,
              borderRadius: 'var(--r-sm)', padding: '6px 4px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: s.text, lineHeight: 1 }}>{s.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div style={{ padding: 'var(--sp-3)', background: 'var(--blue-50)', borderBottom: '1px solid var(--border)' }}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              autoFocus
              placeholder="Job title..." value={newItem.title}
              onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
              style={{
                padding: '8px 12px', fontSize: '0.85rem',
                border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', outline: 'none'
              }}
            />
            <input
              placeholder="Company..." value={newItem.company}
              onChange={e => setNewItem(p => ({ ...p, company: e.target.value }))}
              style={{
                padding: '8px 12px', fontSize: '0.85rem',
                border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="submit" className="btn btn-sm btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
              <button type="button" className="btn btn-sm btn-outline-gray" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Application List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-2)' }}>
        {applications.length === 0 ? (
           <div style={{ textAlign: 'center', padding: 'var(--sp-6)', color: 'var(--text-muted)' }}>
             <div style={{ fontSize: 32, marginBottom: 'var(--sp-2)' }}>📋</div>
             <p style={{ fontSize: '0.85rem' }}>No applications yet</p>
           </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {applications.map(app => {
              const active = selectedAppId === app.id
              const sc = STATUS_COLORS[app.status]

              return (
                <div
                  key={app.id}
                  onClick={() => onSelectApp(app)}
                  style={{
                    background: active ? 'var(--blue-50)' : 'var(--surface)',
                    border: '1px solid',
                    borderColor: active ? 'var(--blue-200)' : 'var(--border)',
                    borderRadius: 'var(--r-md)',
                    padding: 'var(--sp-3)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', gap: 10 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 32, height: 32, borderRadius: 'var(--r-sm)', shrink: 0,
                      background: 'linear-gradient(135deg, var(--gray-700), var(--gray-900))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: '0.7rem'
                    }}>
                      {app.company.substring(0, 2).toUpperCase()}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-head)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {app.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-body)' }}>{app.company}</div>
                    </div>
                  </div>

                  {/* Status & Date Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <select
                        value={app.status}
                        onChange={e => { e.stopPropagation(); onChangeStatus(app.id, e.target.value) }}
                        onClick={e => e.stopPropagation()}
                        style={{
                          padding: '2px 6px', fontSize: '0.65rem', fontWeight: 600,
                          borderRadius: 'var(--r-sm)', border: `1px solid ${sc.border}`,
                          background: sc.bg, color: sc.text, cursor: 'pointer', outline: 'none',
                        }}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemoveApp(app.id) }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >✕</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
