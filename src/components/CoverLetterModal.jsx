import { useState, useEffect } from 'react'
import { useClaude } from '../hooks/useClaude'

const TONES = ['Professional', 'Friendly', 'Direct']

export default function CoverLetterModal({ job, cvText, onClose }) {
  const { generateCoverLetter, loading } = useClaude()
  const [tone,   setTone]   = useState('Professional')
  const [letter, setLetter] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = async (t = tone) => {
    try {
      const text = await generateCoverLetter(job, cvText, t.toLowerCase())
      setLetter(text)
    } catch {
      // error surfaced via useClaude.error
    }
  }

  // Auto-generate on open
  useEffect(() => {
    if (job && cvText) generate()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleToneChange = (t) => {
    setTone(t)
    generate(t)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([letter], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    const slug = job?.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() ?? 'job'
    a.download = `cover_letter_${slug}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 560,
          borderRadius: 'var(--radius-lg)', padding: 24,
          display: 'flex', flexDirection: 'column', gap: 16,
          maxHeight: '90vh', overflowY: 'auto',
          background: '#fff',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              Cover Letter
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
              {job?.title} · {job?.company}
            </div>
          </div>
          <button
            className="btn-secondary"
            onClick={onClose}
            style={{
              width: 32, height: 32, flexShrink: 0, padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: 'var(--text-secondary)',
            }}
          >
            ×
          </button>
        </div>

        {/* Tone selector */}
        <div style={{ display: 'flex', gap: 6 }}>
          {TONES.map(t => (
            <button
              key={t}
              onClick={() => handleToneChange(t)}
              disabled={loading}
              className={tone === t ? 'btn-primary' : 'btn-secondary'}
              style={{
                fontSize: 12, padding: '6px 14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                borderRadius: 20,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div style={{ position: 'relative' }}>
          {loading && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 5,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <div style={{
                width: 20, height: 20,
                border: '2px solid var(--border-light)',
                borderTop: '2px solid var(--blue-primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Writing…</span>
            </div>
          )}
          <textarea
            value={letter}
            onChange={e => setLetter(e.target.value)}
            rows={12}
            placeholder="Your cover letter will appear here…"
            style={{
              width: '100%', resize: 'vertical',
              padding: '14px 16px', borderRadius: 'var(--radius-sm)',
              fontSize: 13, lineHeight: 1.75,
              color: 'var(--text-primary)',
              background: '#FAFBFD',
              border: '1px solid var(--border-light)',
              outline: 'none', boxSizing: 'border-box',
              minHeight: 300,
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary"
            onClick={handleCopy}
            disabled={!letter}
            style={{
              color: copied ? '#22c55e' : undefined,
              opacity: letter ? 1 : 0.5,
            }}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>

          <button
            className="btn-secondary"
            onClick={handleDownload}
            disabled={!letter}
            style={{ opacity: letter ? 1 : 0.5 }}
          >
            Download .txt
          </button>

          <button className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
