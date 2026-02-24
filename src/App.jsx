import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import Header    from './components/Header'
import BottomNav from './components/BottomNav'
import CvModal   from './components/CvModal'
import AuthModal from './components/AuthModal'

import HomePage   from './pages/HomePage'
import TrackerPage from './pages/TrackerPage'
import CvPage     from './pages/CvPage'

function AppInner() {
  const { isLoggedIn, saveCv, loadCv, loading: authLoading } = useAuth()

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
        background: 'var(--bg-base)', color: 'var(--text-secondary)', fontSize: 14,
      }}>
        Loading…
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-base)' }}>
        <Header
          onEditCv={() => setShowCvModal(true)}
          onLogin={() => setShowAuthModal(true)}
        />

        <main style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <Routes>
            <Route path="/"        element={<HomePage    cvText={cvText} />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/cv"      element={<CvPage      cvText={cvText} setShowCvModal={setShowCvModal} />} />
          </Routes>
        </main>

        <BottomNav />

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
