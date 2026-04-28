const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/auth')

// ─── ElevenLabs TTS ───────────────────────────────────────────────
// These are ElevenLabs' built-in premade voices — available on ALL plans.
// "Adam" has a warm, clear tone that works well for Indian English content.
// Swap VOICE_ID below with any ID from elevenlabs.io/voice-library
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'   // Adam — deep, clear, works on all plans

router.post('/', auth, async (req, res) => {
  const { text, lang = 'en-IN' } = req.body
  if (!text?.trim()) return res.status(400).json({ error: 'text required' })

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) return res.status(503).json({ error: 'TTS_NOT_CONFIGURED' })

  try {
    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
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
