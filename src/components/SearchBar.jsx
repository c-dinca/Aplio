import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [query,    setQuery]    = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = (e) => {
    e?.preventDefault()
    onSearch(query, location)
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--surface)',
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      padding: '8px 8px 8px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: 'var(--shadow-sm)',
      transition: 'all 0.2s',
      maxWidth: '100%',
    }}
    onFocus={e => {
      e.currentTarget.style.borderColor = 'var(--primary)'
      e.currentTarget.style.boxShadow = '0 0 0 3px var(--blue-50), var(--shadow-sm)'
    }}
    onBlur={e => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
      }
    }}
    >
      {/* Search icon */}
      <span style={{ color: 'var(--text-muted)', fontSize: '1rem', flexShrink: 0 }}>🔍</span>

      {/* Query input */}
      <input
        type="text"
        placeholder="Job title, company, or keyword..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--text-head)',
          background: 'transparent',
          minWidth: 120,
        }}
      />

      {/* Divider */}
      <div style={{
        width: 1, height: 24,
        background: 'var(--border)',
        flexShrink: 0,
      }} />

      {/* Location input */}
      <input
        type="text"
        placeholder="Location..."
        value={location}
        onChange={e => setLocation(e.target.value)}
        style={{
          width: 140,
          border: 'none',
          outline: 'none',
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--text-head)',
          background: 'transparent',
          flexShrink: 0,
        }}
      />

      {/* Search button */}
      <button
        type="submit"
        className="btn btn-md btn-primary btn-pill"
        style={{ flexShrink: 0 }}
      >
        Search
      </button>
    </form>
  )
}
