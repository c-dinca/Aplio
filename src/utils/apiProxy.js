/**
 * Claude API endpoint and headers.
 * All Claude requests now go through our Express backend which injects
 * the API key server-side. Auth token is required.
 */
export const CLAUDE_ENDPOINT = '/api/claude/messages'

/** Returns headers for Claude requests, including auth token. */
export function claudeHeaders() {
  const token = localStorage.getItem('aplio_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}
