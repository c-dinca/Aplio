import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import CvModal   from './components/CvModal'
import AuthModal from './components/AuthModal'

import HomePage       from './pages/HomePage'
import TrackerPage   from './pages/TrackerPage'
import CvPage        from './pages/CvPage'
import FavoritesPage from './pages/FavoritesPage'

function AppInner() {
  const { isLoggedIn, saveCv, loadCv, loading: authLoading, user, logout } = useAuth()

  const [cvText,        setCvText]        = useState('')
  const [showCvModal,   setShowCvModal]   = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Load CV from backend when logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadCv().then(text => {
        if (text) setCvText(text)
      }).catch(() => {})
    }
  }, [isLoggedIn, loadCv])

  const handleSaveCv = async (text) => {
    setCvText(text)
    setShowCvModal(false)
    // Persist to backend if logged in
    if (isLoggedIn) {
      try { await saveCv(text) } catch { /* silent fallback */ }
    }
  }

  if (authLoading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 14,
        fontFamily: 'var(--font-body)',
      }}>
        Loading…
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
        <main style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <Routes>
            <Route path="/" element={
              <HomePage
                cvText={cvText}
                onEditCv={() => setShowCvModal(true)}
                onLogin={() => setShowAuthModal(true)}
                isLoggedIn={isLoggedIn}
                user={user}
                onLogout={logout}
              />
            } />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/cv" element={<CvPage cvText={cvText} setShowCvModal={setShowCvModal} />} />
            <Route path="/favorites" element={<FavoritesPage cvText={cvText} />} />
            <Route path="/applied" element={
              <HomePage
                view="applied"
                cvText={cvText}
                onEditCv={() => setShowCvModal(true)}
                onLogin={() => setShowAuthModal(true)}
                isLoggedIn={isLoggedIn}
                user={user}
                onLogout={logout}
              />
            } />
          </Routes>
        </main>

        {showCvModal && (
          <CvModal
            initialText={cvText}
            onSave={handleSaveCv}
            onClose={() => setShowCvModal(false)}
          />
        )}

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </AuthProvider>
  )
}
