import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { label: 'Jobs',    icon: '🔍', path: '/'        },
  { label: 'CV',      icon: '📄', path: '/cv'       },
  { label: 'Tracker', icon: '📋', path: '/tracker'  },
]

export default function BottomNav() {
  const navigate   = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav
      className="glass flex md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 64,
        alignItems: 'stretch',
        borderRadius: 0,
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
              gap: 3,
              background: 'none',
              border: 'none',
              borderTop: isActive
                ? '2px solid var(--blue-primary)'
                : '2px solid transparent',
              color: isActive ? 'var(--blue-primary)' : 'var(--text-secondary)',
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 10,
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              transition: 'color 0.15s ease',
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
