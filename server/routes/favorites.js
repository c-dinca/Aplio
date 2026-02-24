import { Router } from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// ── List favorites ───────────────────────────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT job_id, job_data, created_at FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    )
    res.json({ favorites: result.rows })
  } catch (err) {
    console.error('List favorites error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Add favorite ─────────────────────────────────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { job_id, job_data } = req.body
    if (!job_id || !job_data) {
      return res.status(400).json({ error: 'job_id and job_data are required' })
    }

    await pool.query(
      `INSERT INTO favorites (user_id, job_id, job_data) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, job_id) DO NOTHING`,
      [req.userId, job_id, JSON.stringify(job_data)]
    )

    res.status(201).json({ ok: true })
  } catch (err) {
    console.error('Add favorite error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Remove favorite ──────────────────────────────────────────────────────────
router.delete('/:jobId', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND job_id = $2',
      [req.userId, req.params.jobId]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error('Remove favorite error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
