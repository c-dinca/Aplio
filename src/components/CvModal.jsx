import { useState } from 'react'

export default function CvModal({ initialText = '', onSave, onClose }) {
  const [text, setText] = useState(initialText)

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 600,
          padding: 28,
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h2 style={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 6px',
        }}>
          Paste your CV
        </h2>

        <p style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          margin: '0 0 18px',
          lineHeight: 1.6,
        }}>
          Plain text. Saved locally — only sent to AI when you use analysis features.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your CV here..."
          style={{
            display: 'block',
            width: '100%',
            height: 300,
            fontFamily: 'monospace',
            fontSize: 12,
            padding: 16,
            boxSizing: 'border-box',
            resize: 'vertical',
            outline: 'none',
            background: '#FAFBFD',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            lineHeight: 1.6,
          }}
        />

        <div style={{
          display: 'flex',
          gap: 10,
          marginTop: 18,
          justifyContent: 'flex-end',
        }}>
          <button
            className="btn-secondary"
            onClick={onClose}
            style={{ padding: '9px 20px' }}
          >
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={() => onSave(text)}
            style={{ padding: '9px 20px' }}
          >
            Save CV
          </button>
        </div>
      </div>
    </div>
  )
}
