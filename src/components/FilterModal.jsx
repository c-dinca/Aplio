import { useState, useRef, useEffect } from 'react'

// ── Filter categories ────────────────────────────────────────────────
const FILTERS = {
  'Remote Work': ['On-site', 'Hybrid', 'Remote', 'Temporarily Remote'],
  'Contract Type': ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Temporary'],
  'Salary': [
    'Any', 'Up to €20k', '€20k – €40k', '€40k – €60k',
    '€60k – €80k', '€80k – €100k', '€100k+',
  ],
  'Sectors': [
    'IT & Software', 'Finance & Banking', 'Healthcare',
    'Engineering', 'Marketing', 'Sales', 'Education',
    'Legal', 'Manufacturing', 'Retail', 'Consulting',
  ],
  'Dates': ['Last 24 hours', 'Last 3 days', 'Last 7 days', 'Last 14 days', 'Last 30 days'],
  'Work Schedule': ['Day shift', 'Night shift', 'Flexible', 'Weekend', 'Rotating'],
  'Languages': ['English', 'French', 'German', 'Spanish', 'Romanian', 'Italian', 'Portuguese', 'Dutch'],
  'Education Level': ['High School', 'Associate', "Bachelor's", "Master's", 'PhD', 'Not required'],
  'Posted By': ['Employer', 'Staffing Agency'],
  'Company': [],
}

const FILTER_KEYS = Object.keys(FILTERS)

export default function FilterModal({ selections, onChange, onClose }) {
  const [local, setLocal] = useState(selections || {})
  const [companyInput, setCompanyInput] = useState('')
  const backdropRef = useRef(null)

  const totalCount = Object.values(local).reduce((n, arr) => n + arr.length, 0)

  const toggle = (category, value) => {
    setLocal(prev => {
      const current = prev[category] || []
      if (value === '__clear__') {
        const next = { ...prev }
        delete next[category]
        return next
      }
      const has = current.includes(value)
      return {
        ...prev,
        [category]: has ? current.filter(v => v !== value) : [...current, value],
      }
    })
  }

  const clearAll = () => setLocal({})

  const apply = () => {
    onChange(local)
    onClose()
  }

  return (
    <div
      ref={backdropRef}
      onClick={e => { if (e.target === backdropRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        background: 'rgba(15,22,41,0.4)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-in"
        style={{
          width: '100%', maxWidth: 580,
          maxHeight: '85vh',
          background: 'var(--surface)',
          borderRadius: 'var(--r-xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          flexShrink: 0,
          padding: 'var(--sp-5) var(--sp-6)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem', fontWeight: 700,
              color: 'var(--text-head)', margin: 0,
            }}>
              Filters
            </h2>
            {totalCount > 0 && (
              <span style={{
                fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2, display: 'block',
              }}>
                {totalCount} filter{totalCount !== 1 ? 's' : ''} applied
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            {totalCount > 0 && (
              <button
                className="btn btn-sm btn-ghost"
                onClick={clearAll}
                style={{ fontSize: '0.8rem' }}
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 18, color: 'var(--text-muted)', padding: 4,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filter categories */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: 'var(--sp-4) var(--sp-6)',
        }}>
          {FILTER_KEYS.map(key => {
            const options = FILTERS[key]
            const selected = local[key] || []
            const isCompany = key === 'Company'

            return (
              <div key={key} style={{ marginBottom: 'var(--sp-5)' }}>
                {/* Category header */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 'var(--sp-3)',
                }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                  }}>
                    {key}
                  </span>
                  {selected.length > 0 && (
                    <button
                      onClick={() => toggle(key, '__clear__')}
                      style={{
                        fontSize: '0.7rem', color: 'var(--primary)',
                        background: 'none', border: 'none',
                        cursor: 'pointer', fontWeight: 600,
                        fontFamily: 'var(--font-body)', padding: 0,
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Options */}
                {isCompany ? (
                  <div>
                    <input
                      type="text"
                      placeholder="Type company name and press Enter..."
                      value={companyInput}
                      onChange={e => setCompanyInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && companyInput.trim()) {
                          toggle(key, companyInput.trim())
                          setCompanyInput('')
                        }
                      }}
                      style={{
                        width: '100%', padding: '9px 14px', fontSize: '0.82rem',
                        border: '1.5px solid var(--border)', borderRadius: 'var(--r-md)',
                        fontFamily: 'var(--font-body)', outline: 'none',
                        background: 'var(--bg)', color: 'var(--text-head)',
                        transition: 'border-color 0.15s ease',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    {selected.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'var(--sp-2)' }}>
                        {selected.map(c => (
                          <span
                            key={c}
                            style={{
                              fontSize: '0.75rem', padding: '4px 10px',
                              background: 'var(--blue-50)', color: 'var(--primary)',
                              borderRadius: 'var(--r-full)', fontWeight: 600,
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              border: '1px solid var(--blue-100)',
                            }}
                          >
                            {c}
                            <span
                              onClick={() => toggle(key, c)}
                              style={{ cursor: 'pointer', opacity: 0.7, fontSize: '0.7rem' }}
                            >✕</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 6,
                  }}>
                    {options.map(opt => {
                      const checked = selected.includes(opt)
                      return (
                        <button
                          key={opt}
                          onClick={() => toggle(key, opt)}
                          style={{
                            padding: '6px 14px',
                            fontSize: '0.78rem',
                            fontWeight: checked ? 700 : 500,
                            fontFamily: 'var(--font-body)',
                            borderRadius: 'var(--r-full)',
                            border: `1.5px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
                            background: checked ? 'var(--blue-50)' : 'var(--surface)',
                            color: checked ? 'var(--primary)' : 'var(--text-body)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                          }}
                        >
                          {checked && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          flexShrink: 0,
          padding: 'var(--sp-4) var(--sp-6)',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 'var(--sp-3)',
        }}>
          <button
            className="btn btn-md btn-outline-gray"
            onClick={onClose}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Cancel
          </button>
          <button
            className="btn btn-md btn-primary"
            onClick={apply}
            style={{ flex: 2, justifyContent: 'center' }}
          >
            Apply {totalCount > 0 ? `(${totalCount})` : ''} Filters
          </button>
        </div>
      </div>
    </div>
  )
}
