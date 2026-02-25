import { useState, useEffect } from 'react'
import { useClaude } from '../hooks/useClaude'

const TONES = ['Professional', 'Friendly', 'Direct']

export default function CoverLetterModal({ job, cvText, onClose }) {
  const { generateCoverLetter, loading } = useClaude()
  const [tone,   setTone]   = useState('Professional')
  const [letter, setLetter] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = async (t = tone) => {
    try { setLetter(await generateCoverLetter(job, cvText, t.toLowerCase())) } catch {}
  }

  useEffect(() => {
    if (job && cvText) generate()
  }, [])

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
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
        style={{
          width: '100%', maxWidth: 580,
          padding: 28,
          background: 'var(--surface)',
          borderRadius: 'var(--r-xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column', gap: 16,
          maxHeight: '90vh', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem', fontWeight: 700,
              color: 'var(--text-head)',
            }}>Cover Letter</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 3 }}>
              {job?.title} · {job?.company}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'var(--gray-100)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)', cursor: 'pointer',
              fontSize: 18, color: 'var(--text-muted)',
            }}
          >×</button>
        </div>

        {/* Tone buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {TONES.map(t => (
            <button
              key={t}
              onClick={() => { setTone(t); generate(t) }}
              disabled={loading}
              className={`btn btn-sm ${tone === t ? 'btn-primary' : 'btn-outline-gray'}`}
              style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
          {loading && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 5,
              background: 'rgba(255,255,255,0.8)',
              borderRadius: 'var(--r-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <div style={{
                width: 22, height: 22,
                border: '2px solid var(--blue-100)',
                borderTop: '2px solid var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Writing…</span>
            </div>
          )}
          <textarea
            value={letter}
            onChange={e => setLetter(e.target.value)}
            rows={12}
            placeholder="Your cover letter will appear here…"
            style={{
              width: '100%', resize: 'vertical',
              padding: '14px 16px',
              borderRadius: 'var(--r-md)',
              fontSize: '0.88rem', lineHeight: 1.75,
              color: 'var(--text-head)',
              background: 'var(--gray-100)',
              border: '1.5px solid var(--border)',
              fontFamily: 'var(--font-body)',
              outline: 'none', boxSizing: 'border-box',
              minHeight: 280,
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            className="btn btn-sm btn-outline-gray"
            onClick={() => {
              navigator.clipboard.writeText(letter)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            disabled={!letter}
            style={{ opacity: letter ? 1 : 0.5 }}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
          <button
            className="btn btn-sm btn-outline-gray"
            onClick={() => {
              const blob = new Blob([letter], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `cover_letter_${job?.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() ?? 'job'}.txt`
              a.click()
              URL.revokeObjectURL(url)
            }}
            disabled={!letter}
            style={{ opacity: letter ? 1 : 0.5 }}
          >
            Download .txt
          </button>
          <button className="btn btn-sm btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
