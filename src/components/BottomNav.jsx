import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { label: 'Jobs',      icon: '🔍', path: '/'          },
  { label: 'Favorites', icon: '⭐', path: '/favorites'  },
  { label: 'Tracker',   icon: '📋', path: '/tracker'    },
]

export default function BottomNav() {
  const navigate   = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav
      className="mobile-only"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 68,
        display: 'flex',
        alignItems: 'stretch',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {TABS.map((tab) => {
        const isActive = pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              background: 'none',
              border: 'none',
              borderTop: isActive
                ? '3px solid var(--primary)'
                : '3px solid transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
