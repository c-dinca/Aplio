import { useState } from 'react'

const WORK_TYPES  = ['Remote', 'Hybrid', 'On-site']
const SENIORITIES = ['Junior', 'Mid', 'Senior']

function Pill({ label, active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={active ? 'btn-primary' : 'btn-secondary'}
      style={{
        padding: '5px 14px',
        fontSize: 12,
        cursor: 'pointer',
        borderRadius: 20,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

export default function SearchBar({ onSearch }) {
  const [query,       setQuery]       = useState('')
  const [location,    setLocation]    = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [workTypes,   setWorkTypes]   = useState(new Set())
  const [seniorities, setSeniorities] = useState(new Set())
  const [salaryMin,   setSalaryMin]   = useState('')

  const handleSearch = () =>
    onSearch(query, location, { workTypes, seniorities, salaryMin })

  const handleKey = (e) => { if (e.key === 'Enter') handleSearch() }

  const toggleSet = (set, setter, val) => {
    const next = new Set(set)
    next.has(val) ? next.delete(val) : next.add(val)
    setter(next)
  }

  const inputStyle = {
    background: '#fff',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-sm)',
    height: 40,
    padding: '0 14px',
    fontSize: 13,
    color: 'var(--text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
    }}>
      {/* Main row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <input
          style={{ ...inputStyle, flex: '1 1 180px', minWidth: 0 }}
          placeholder="Job title or skills..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
        />
        <input
          style={{ ...inputStyle, flex: '0 1 200px', minWidth: 120 }}
          placeholder="Location or Remote"
          value={location}
          onChange={e => setLocation(e.target.value)}
          onKeyDown={handleKey}
          onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
        />
        {/* Filter toggle */}
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowFilters(v => !v)}
          title="Toggle filters"
          style={{
            width: 40,
            height: 40,
            fontSize: 16,
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            background: showFilters ? 'var(--blue-light)' : undefined,
            color: showFilters ? 'var(--blue-primary)' : undefined,
          }}
        >
          ⚙
        </button>
        {/* Search */}
        <button
          type="button"
          className="btn-primary"
          onClick={handleSearch}
          style={{ height: 40, padding: '0 22px', flexShrink: 0 }}
        >
          Search
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <span style={labelStyle}>Work</span>
            {WORK_TYPES.map(t => (
              <Pill
                key={t} label={t}
                active={workTypes.has(t)}
                onToggle={() => toggleSet(workTypes, setWorkTypes, t)}
              />
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <span style={labelStyle}>Level</span>
            {SENIORITIES.map(s => (
              <Pill
                key={s} label={s}
                active={seniorities.has(s)}
                onToggle={() => toggleSet(seniorities, setSeniorities, s)}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={labelStyle}>Salary</span>
            <input
              type="number"
              min={0}
              style={{ ...inputStyle, width: 160, height: 34 }}
              placeholder="Min salary €"
              value={salaryMin}
              onChange={e => setSalaryMin(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  minWidth: 44,
}
