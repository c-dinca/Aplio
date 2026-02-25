import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth()

  const [mode,     setMode]     = useState('login')
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
      if (mode === 'register') await register(email, password, name)
      else await login(email, password)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

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
          width: '100%', maxWidth: 420,
          padding: 32,
          background: 'var(--surface)',
          borderRadius: 'var(--r-xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem', fontWeight: 700,
          color: 'var(--text-head)',
          margin: '0 0 6px',
        }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{
          fontSize: '0.85rem', color: 'var(--text-muted)',
          margin: '0 0 24px', lineHeight: 1.5,
        }}>
          {mode === 'login'
            ? 'Sign in to access your saved CV and favorites.'
            : 'Join Aplio to save your progress across devices.'}
        </p>

        {error && (
          <div style={{
            padding: '10px 14px', marginBottom: 16,
            background: 'var(--red-50)',
            border: '1px solid var(--red-border)',
            borderRadius: 'var(--r-sm)',
            fontSize: '0.82rem', color: 'var(--red-500)',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'register' && (
            <input type="text" placeholder="Name" value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle} />
          )}
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={inputStyle} />
          <input type="password" placeholder="Password (min 6 characters)" value={password}
            onChange={e => setPassword(e.target.value)} required minLength={6}
            style={inputStyle} />

          <button type="submit" className="btn btn-lg btn-primary"
            disabled={loading}
            style={{
              width: '100%', justifyContent: 'center',
              marginTop: 4,
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
          textAlign: 'center', marginTop: 18,
          fontSize: '0.82rem', color: 'var(--text-muted)',
        }}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => { setMode('register'); setError('') }}
                style={{ background: 'none', border: 'none', padding: 0,
                  color: 'var(--primary)', fontWeight: 700, cursor: 'pointer',
                  fontSize: '0.82rem', fontFamily: 'var(--font-body)' }}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError('') }}
                style={{ background: 'none', border: 'none', padding: 0,
                  color: 'var(--primary)', fontWeight: 700, cursor: 'pointer',
                  fontSize: '0.82rem', fontFamily: 'var(--font-body)' }}>
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
  padding: '12px 16px',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-body)',
  background: 'var(--gray-100)',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--r-md)',
  color: 'var(--text-head)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
}
