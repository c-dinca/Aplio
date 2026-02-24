import { Router } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../db.js'
import { authMiddleware, signToken } from '../middleware/auth.js'

const router = Router()

// ── Register ─────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const hash = await bcrypt.hash(password, 12)
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, settings, created_at',
      [email.toLowerCase(), hash, name || '']
    )

    const user  = result.rows[0]
    const token = signToken(user.id)

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, settings: user.settings } })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Login ────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const result = await pool.query(
      'SELECT id, email, name, password, settings FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user  = result.rows[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = signToken(user.id)

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, settings: user.settings } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Get profile ──────────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, settings, created_at FROM users WHERE id = $1',
      [req.userId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ user: result.rows[0] })
  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Update profile ───────────────────────────────────────────────────────────
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, settings } = req.body
    const fields = []
    const values = []
    let idx = 1

    if (name !== undefined) {
      fields.push(`name = $${idx++}`)
      values.push(name)
    }
    if (settings !== undefined) {
      fields.push(`settings = $${idx++}`)
      values.push(JSON.stringify(settings))
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nothing to update' })
    }

    fields.push(`updated_at = NOW()`)
    values.push(req.userId)

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, email, name, settings`,
      values
    )

    res.json({ user: result.rows[0] })
  } catch (err) {
    console.error('Update profile error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
