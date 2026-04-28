const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/auth')

// ─── ElevenLabs TTS ───────────────────────────────────────────────
// Free tier: 10,000 chars/month  |  elevenlabs.io → Profile → API key
// Add to .env:  ELEVENLABS_API_KEY=sk_...
//
// Voice IDs used (from ElevenLabs public voice library):
//   en-IN  →  "Grandma Aparna"  (warm Indian English female)
//   hi-IN  →  "Meera"           (natural Hindi/Indian female)
//   default → "Rachel"          (clear, neutral English)
//
// You can swap any voice ID from: https://elevenlabs.io/voice-library
const VOICE_IDS = {
  'en-IN': 'cgSgspJ2msm6clMCkdW9',   // Grandma Aparna — Indian English
  'hi-IN': 'cgSgspJ2msm6clMCkdW9',   // same voice handles Hindi well
}
const DEFAULT_VOICE = '21m00Tcm4TlvDq8ikWAM'   // Rachel — neutral fallback

router.post('/', auth, async (req, res) => {
  const { text, lang = 'en-IN' } = req.body
  if (!text?.trim()) return res.status(400).json({ error: 'text required' })

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) return res.status(503).json({ error: 'TTS_NOT_CONFIGURED' })

  const voiceId = VOICE_IDS[lang] || DEFAULT_VOICE

  try {
    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key':   apiKey,
          'Content-Type': 'application/json',
          'Accept':       'audio/mpeg',
        },
        body: JSON.stringify({
          text: text.slice(0, 2500),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability:        0.50,
            similarity_boost: 0.75,
            style:            0.35,
            use_speaker_boost: true,
          },
        }),
      }
    )

    if (!resp.ok) {
      const err = await resp.text()
      console.error('[TTS] ElevenLabs error:', err)
      return res.status(resp.status).json({ error: 'TTS request failed' })
    }

    const buffer = Buffer.from(await resp.arrayBuffer())
    res.set('Content-Type',  'audio/mpeg')
    res.set('Cache-Control', 'public, max-age=86400')
    res.send(buffer)
  } catch (err) {
    console.error('[TTS]', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
