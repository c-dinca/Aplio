import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''

// ── Proxy Claude API ─────────────────────────────────────────────────────────
// The API key is injected server-side and never reaches the browser.
router.post('/messages', authMiddleware, async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key':         ANTHROPIC_API_KEY,
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.text()

    res.status(response.status)
      .set('Content-Type', response.headers.get('content-type') || 'application/json')
      .send(data)
  } catch (err) {
    console.error('Claude proxy error:', err)
    res.status(502).json({ error: 'Failed to reach Claude API' })
  }
})

export default router
