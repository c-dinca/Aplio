import { useState } from 'react'

export default function CvModal({ initialText, onSave, onClose }) {
  const [text, setText] = useState(initialText || '')

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
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
          padding: 32,
          background: 'var(--surface)',
          borderRadius: 'var(--r-xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column', gap: 16,
          maxHeight: '85vh',
        }}
      >
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem', fontWeight: 700,
            color: 'var(--text-head)', margin: 0,
          }}>
            Your CV
          </h2>
          <p style={{
            fontSize: '0.82rem', color: 'var(--text-muted)',
            margin: '4px 0 0',
          }}>
            Paste your CV as plain text. It will be used for AI analysis.
          </p>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your CV here..."
          style={{
            width: '100%',
            flex: 1,
            minHeight: 300,
            resize: 'vertical',
            padding: '16px 18px',
            fontSize: '0.88rem',
            lineHeight: 1.7,
            fontFamily: 'var(--font-body)',
            color: 'var(--text-head)',
            background: 'var(--gray-100)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--r-md)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-md btn-outline-gray" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-md btn-primary" onClick={() => onSave(text)}>
            Save CV
          </button>
        </div>
      </div>
    </div>
  )
}
