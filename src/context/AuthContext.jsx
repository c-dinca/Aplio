import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const LS_TOKEN = 'aplio_token'

function getStoredToken() {
  try { return localStorage.getItem(LS_TOKEN) } catch { return null }
}

function apiCall(path, options = {}) {
  const token = getStoredToken()
  return fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Load profile on mount if token exists ───────────────────────────────
  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      setLoading(false)
      return
    }
    apiCall('/api/auth/me')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setUser(data.user))
      .catch(() => {
        localStorage.removeItem(LS_TOKEN)
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Register ────────────────────────────────────────────────────────────
  const register = useCallback(async (email, password, name) => {
    const res = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Registration failed')
    localStorage.setItem(LS_TOKEN, data.token)
    setUser(data.user)
    return data.user
  }, [])

  // ── Login ───────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    localStorage.setItem(LS_TOKEN, data.token)
    setUser(data.user)
    return data.user
  }, [])

  // ── Logout ──────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(LS_TOKEN)
    setUser(null)
  }, [])

  // ── Save CV ─────────────────────────────────────────────────────────────
  const saveCv = useCallback(async (cvText) => {
    const res = await apiCall('/api/cv', {
      method: 'PUT',
      body: JSON.stringify({ cv_text: cvText }),
    })
    if (!res.ok) throw new Error('Failed to save CV')
  }, [])

  // ── Load CV ─────────────────────────────────────────────────────────────
  const loadCv = useCallback(async () => {
    const res = await apiCall('/api/cv')
    if (!res.ok) return ''
    const data = await res.json()
    return data.cv_text || ''
  }, [])

  // ── Favorites ───────────────────────────────────────────────────────────
  const loadFavorites = useCallback(async () => {
    const res = await apiCall('/api/favorites')
    if (!res.ok) return []
    const data = await res.json()
    return data.favorites
  }, [])

  const addFavorite = useCallback(async (jobId, jobData) => {
    await apiCall('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId, job_data: jobData }),
    })
  }, [])

  const removeFavorite = useCallback(async (jobId) => {
    await apiCall(`/api/favorites/${jobId}`, { method: 'DELETE' })
  }, [])

  // ── Update profile ──────────────────────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    const res = await apiCall('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Update failed')
    setUser(data.user)
    return data.user
  }, [])

  const value = {
    user, loading,
    register, login, logout,
    saveCv, loadCv,
    loadFavorites, addFavorite, removeFavorite,
    updateProfile,
    isLoggedIn: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
