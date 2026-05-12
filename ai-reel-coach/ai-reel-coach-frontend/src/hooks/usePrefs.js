/**
 * usePrefs — reads onboarding preferences from localStorage
 * and exposes them in a clean, ready-to-use shape.
 */
export function usePrefs() {
  let raw = {}
  try { raw = JSON.parse(localStorage.getItem('vs_prefs') || '{}') } catch {}

  const niches        = Array.isArray(raw.niches)  ? raw.niches  : []
  const goals         = Array.isArray(raw.goals)   ? raw.goals   : []
  const platform      = raw.platform || null
  const targetAudience = raw.targetAudience || localStorage.getItem('arc_audience') || 'India'

  // First niche, capitalised — useful as a default dropdown value
  const primaryNiche = niches[0] || ''

  // Human-readable summary for the AI system prompt
  const nicheContext = niches.length
    ? `Creator niche(s): ${niches.join(', ')}.`
    : ''
  const goalContext = goals.length
    ? `Creator goals: ${goals.join(', ')}.`
    : ''
  const platformContext = platform
    ? `Primary platform: ${platform}.`
    : ''

  const aiContext = [nicheContext, goalContext, platformContext].filter(Boolean).join(' ')

  return { niches, goals, platform, primaryNiche, aiContext, targetAudience }
}
