import { Router } from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// ── Get CV ───────────────────────────────────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT cv_text FROM users WHERE id = $1', [req.userId])
    res.json({ cv_text: result.rows[0]?.cv_text || '' })
  } catch (err) {
    console.error('Get CV error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Save CV ──────────────────────────────────────────────────────────────────
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { cv_text } = req.body
    if (cv_text === undefined) {
      return res.status(400).json({ error: 'cv_text is required' })
    }

    await pool.query(
      'UPDATE users SET cv_text = $1, updated_at = NOW() WHERE id = $2',
      [cv_text, req.userId]
    )

    res.json({ ok: true })
  } catch (err) {
    console.error('Save CV error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
