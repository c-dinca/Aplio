import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth()

  const [mode,     setMode]     = useState('login') // 'login' | 'register'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        await register(email, password, name)
      } else {
        await login(email, password)
      }
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        background: 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420,
          padding: 28,
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h2 style={{
          fontSize: 20, fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 4px',
        }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{
          fontSize: 13, color: 'var(--text-secondary)',
          margin: '0 0 20px', lineHeight: 1.5,
        }}>
          {mode === 'login'
            ? 'Sign in to access your saved CV and favorites.'
            : 'Join Aplio to save your progress across devices.'}
        </p>

        {error && (
          <div style={{
            padding: '10px 14px', marginBottom: 16,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13, color: '#dc2626',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%', padding: '12px 0',
              fontSize: 14, marginTop: 4,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading
              ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
              : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{
          textAlign: 'center', marginTop: 16,
          fontSize: 13, color: 'var(--text-secondary)',
        }}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => { setMode('register'); setError('') }}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  color: 'var(--blue-primary)', fontWeight: 600,
                  cursor: 'pointer', fontSize: 13,
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); setError('') }}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  color: 'var(--blue-primary)', fontWeight: 600,
                  cursor: 'pointer', fontSize: 13,
                }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  fontSize: 14,
  background: '#FAFBFD',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
}
