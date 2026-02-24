import { useRef, useEffect, useState, useCallback } from 'react'

// Escape HTML, highlight [CHANGED] blocks, convert newlines to <br>
function processForDisplay(text) {
  if (!text) return ''
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const highlighted = escaped.replace(
    /\[CHANGED\]([\s\S]*?)\[\/CHANGED\]/g,
    (_, inner) =>
      `<span style="background:#fef08a;border-radius:3px;padding:1px 2px">${inner}</span>`,
  )
  return highlighted.replace(/\n/g, '<br>')
}

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export default function CvEditor({
  cvText,
  adaptedCv,
  onEdit,
  loading,
  onRegenerate,
  onReset,
  job,
  resetKey,
}) {
  const editorRef    = useRef(null)
  const [downloading, setDownloading] = useState(false)

  const isAdapted   = !!adaptedCv
  const displayText = adaptedCv ?? cvText ?? ''

  // Sync innerHTML whenever the source or resetKey changes
  useEffect(() => {
    if (!editorRef.current) return
    editorRef.current.innerHTML = processForDisplay(displayText)
  }, [adaptedCv, cvText, resetKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleInput = useCallback(() => {
    if (editorRef.current && onEdit) {
      onEdit(editorRef.current.innerText)
    }
  }, [onEdit])

  const handleDownloadPdf = async () => {
    if (!editorRef.current || !displayText) return
    setDownloading(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const el     = editorRef.current
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const pdf      = new jsPDF({ unit: 'mm', format: 'a4' })
      const pageW    = pdf.internal.pageSize.getWidth()
      const pageH    = pdf.internal.pageSize.getHeight()
      const margin   = 20
      const contentW = pageW - margin * 2
      const contentH = pageH - margin * 2

      const imgData  = canvas.toDataURL('image/png')
      const scaledW  = contentW
      const scaledH  = (canvas.height / canvas.width) * contentW

      let position = 0
      pdf.addImage(imgData, 'PNG', margin, margin, scaledW, scaledH)

      let remaining = scaledH - contentH
      while (remaining > 0) {
        position += contentH
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', margin, margin - position, scaledW, scaledH)
        remaining -= contentH
      }

      const title = job?.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() ?? 'cv'
      pdf.save(`cv_${title}.pdf`)
    } catch (err) {
      console.error('PDF download failed', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        padding: '10px 16px', flexShrink: 0,
        borderBottom: '1px solid var(--border-light)',
        background: '#FAFBFD',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
          {isAdapted ? '✦ Adapted CV' : 'Your CV'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginRight: 'auto' }}>
          {countWords(displayText)} words
        </div>

        {isAdapted && onReset && (
          <button
            className="btn-secondary"
            onClick={onReset}
            style={{ fontSize: 11, padding: '4px 12px' }}
          >
            Reset
          </button>
        )}

        {isAdapted && onRegenerate && (
          <button
            className="btn-secondary"
            onClick={onRegenerate}
            disabled={loading}
            style={{
              fontSize: 11, padding: '4px 12px',
              color: 'var(--blue-primary)',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            ↺ Regenerate
          </button>
        )}

        <button
          className="btn-secondary"
          onClick={handleDownloadPdf}
          disabled={downloading || !displayText}
          style={{
            fontSize: 11, padding: '4px 12px',
            opacity: (downloading || !displayText) ? 0.6 : 1,
          }}
        >
          {downloading ? '⏳ Saving…' : '⬇ PDF'}
        </button>
      </div>

      {/* ── Editor area ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>

        {/* Loading overlay */}
        {loading && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(255,255,255,0.85)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            <div style={{
              width: 32, height: 32,
              border: '3px solid var(--border-light)',
              borderTop: '3px solid var(--blue-primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Adapting CV…</div>
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable={!loading}
          suppressContentEditableWarning
          onInput={handleInput}
          style={{
            height: '100%', overflowY: 'auto',
            padding: '20px 24px',
            fontSize: 13, lineHeight: 1.8,
            color: 'var(--text-primary)',
            outline: 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: '#fff',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  )
}
