import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pool, { initDB } from './db.js'
import authRoutes      from './routes/auth.js'
import cvRoutes        from './routes/cv.js'
import favoritesRoutes from './routes/favorites.js'
import claudeRoutes    from './routes/claude.js'

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json({ limit: '5mb' }))

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/cv',        cvRoutes)
app.use('/api/favorites', favoritesRoutes)
app.use('/api/claude',    claudeRoutes)

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ── Start ────────────────────────────────────────────────────────────────────
async function start() {
  try {
    await initDB()
    app.listen(PORT, () => {
      console.log(`\n  ✓ API server running on http://localhost:${PORT}\n`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
