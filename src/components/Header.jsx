import { useAuth } from '../context/AuthContext'

export default function Header({ onEditCv, onLogin }) {
  const { user, isLoggedIn, logout } = useAuth()

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 20,
      paddingRight: 20,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
    }}>
      {/* Logo */}
      <div style={{
        fontWeight: 700,
        fontSize: 20,
        userSelect: 'none',
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
      }}>
        Ap<span style={{ color: 'var(--orange-primary)' }}>li</span>o
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            {/* User name */}
            <span style={{
              fontSize: 13, color: 'var(--text-secondary)',
              fontWeight: 500, marginRight: 4,
            }}>
              {user?.name || user?.email?.split('@')[0] || 'User'}
            </span>

            <button
              className="btn-secondary"
              onClick={onEditCv}
              style={{ fontSize: 13, padding: '7px 14px' }}
            >
              ✏️ Edit CV
            </button>

            <button
              className="btn-secondary"
              onClick={logout}
              style={{ fontSize: 13, padding: '7px 14px', color: 'var(--text-secondary)' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="btn-secondary"
              onClick={onEditCv}
              style={{ fontSize: 13, padding: '7px 14px' }}
            >
              ✏️ Edit CV
            </button>

            <button
              className="btn-primary"
              onClick={onLogin}
              style={{ fontSize: 13, padding: '7px 16px' }}
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </header>
  )
}
