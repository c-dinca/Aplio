import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Context ───────────────────────────────────────────────────────────────────
const ToastCtx = createContext(null)

// ── Visual config per type ────────────────────────────────────────────────────
const TYPE_META = {
  success: { symbol: '✓', color: '#16a34a', bg: 'rgba(34,197,94,0.14)' },
  error:   { symbol: '✕', color: '#dc2626', bg: 'rgba(239,68,68,0.14)' },
  info:    { symbol: 'i', color: 'var(--blue-primary)', bg: 'rgba(37,99,235,0.10)' },
}

// ── Provider (add to App root) ────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const dismiss = useCallback(
    (id) => setToasts(prev => prev.filter(t => t.id !== id)),
    [],
  )

  return (
    <ToastCtx.Provider value={showToast}>
      {children}

      {/* Portal-like overlay: fixed, above everything, non-blocking */}
      <div style={{
        position: 'fixed',
        bottom: 88,        // clears BottomNav (64px) + safe gap on mobile
        right: 16,
        zIndex: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
        pointerEvents: 'none',
      }}>
        <AnimatePresence>
          {toasts.map(toast => {
            const meta = TYPE_META[toast.type] ?? TYPE_META.info
            return (
              <motion.div
                key={toast.id}
                initial={{ x: 48, opacity: 0 }}
                animate={{ x: 0,  opacity: 1 }}
                exit={{    x: 48, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="glass"
                onClick={() => dismiss(toast.id)}
                style={{
                  width: 300,
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  cursor: 'pointer',
                  pointerEvents: 'all',
                  background: 'rgba(255,255,255,0.88)',
                }}
              >
                {/* Icon badge */}
                <span style={{
                  flexShrink: 0,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: meta.bg,
                  color: meta.color,
                  fontWeight: 700,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  marginTop: 1,
                }}>
                  {meta.symbol}
                </span>

                {/* Message */}
                <span style={{
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  lineHeight: 1.45,
                  flex: 1,
                }}>
                  {toast.message}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

// ── Consumer hook ─────────────────────────────────────────────────────────────
export function useToast() {
  const showToast = useContext(ToastCtx)
  if (!showToast) throw new Error('useToast must be used within <ToastProvider>')
  return { showToast }
}
