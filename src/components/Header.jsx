import { useAuth } from '../context/AuthContext'

export default function Header({ onEditCv, onLogin }) {
  const { user, isLoggedIn, logout } = useAuth()

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      margin: '0 16px',
      marginTop: 12,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.25rem',
        color: 'var(--gray-900)',
        userSelect: 'none',
      }}>
        Ap<span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>li</span>o
      </div>

      {/* Nav Links — desktop */}
      <div style={{
        display: 'flex',
        gap: 4,
      }}>
        {['Search', 'Favorites', 'My CV'].map((label) => (
          <button
            key={label}
            onClick={label === 'My CV' ? onEditCv : undefined}
            style={{
              fontSize: '0.88rem',
              fontWeight: label === 'Search' ? 700 : 500,
              color: label === 'Search' ? 'var(--primary)' : 'var(--text-muted)',
              background: label === 'Search' ? 'var(--blue-50)' : 'transparent',
              padding: '7px 14px',
              borderRadius: 'var(--r-md)',
              cursor: 'pointer',
              border: 'none',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isLoggedIn ? (
          <>
            <span style={{
              fontSize: '0.85rem',
              color: 'var(--text-body)',
              fontWeight: 500,
            }}>
              {user?.name || user?.email?.split('@')[0]}
            </span>
            <button
              className="btn btn-sm btn-outline-gray"
              onClick={logout}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-sm btn-outline-gray"
              onClick={onLogin}
            >
              Log in
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={onEditCv}
            >
              ✏️ My CV
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
