const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/auth')

// ─── Google Cloud Text-to-Speech ─────────────────────────────────
// Neural2 voices are human-grade quality.
// Indian English (en-IN-Neural2-D) sounds like a real Indian speaker.
// Free tier: 1 million characters / month.
// Setup: Google Cloud Console → enable "Cloud Text-to-Speech API" → API key
// Add to backend .env:  GOOGLE_TTS_KEY=AIza...
const VOICES = {
  'en-IN': { languageCode: 'en-IN', name: 'en-IN-Neural2-D' },   // male, Indian English
  'hi-IN': { languageCode: 'hi-IN', name: 'hi-IN-Neural2-B' },   // male, Hindi
  'en-US': { languageCode: 'en-US', name: 'en-US-Neural2-D' },
  'es-ES': { languageCode: 'es-ES', name: 'es-ES-Neural2-B' },
  'fr-FR': { languageCode: 'fr-FR', name: 'fr-FR-Neural2-B' },
  'de-DE': { languageCode: 'de-DE', name: 'de-DE-Neural2-B' },
  'pt-BR': { languageCode: 'pt-BR', name: 'pt-BR-Neural2-B' },
  'ja-JP': { languageCode: 'ja-JP', name: 'ja-JP-Neural2-C' },
  'ko-KR': { languageCode: 'ko-KR', name: 'ko-KR-Neural2-C' },
  'ar-SA': { languageCode: 'ar-XA', name: 'ar-XA-Neural2-B' },
}

router.post('/', auth, async (req, res) => {
  const { text, lang = 'en-IN' } = req.body
  if (!text?.trim()) return res.status(400).json({ error: 'text required' })

  const apiKey = process.env.GOOGLE_TTS_KEY
  if (!apiKey) return res.status(503).json({ error: 'TTS_NOT_CONFIGURED' })

  try {
    const voice    = VOICES[lang] || VOICES['en-IN']
    const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`

    const resp = await fetch(endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input:       { text: text.slice(0, 4800) },   // API limit 5000 bytes
        voice,
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate:  1.0,
          pitch:         0,
          effectsProfileId: ['headphone-class-device'],
        },
      }),
    })

    const data = await resp.json()
    if (!resp.ok) {
      console.error('[TTS] Google error:', data?.error?.message)
      return res.status(resp.status).json({ error: data?.error?.message || 'TTS failed' })
    }

    const audio = Buffer.from(data.audioContent, 'base64')
    res.set('Content-Type',  'audio/mpeg')
    res.set('Cache-Control', 'public, max-age=86400')   // cache 24h — same text = same audio
    res.send(audio)
  } catch (err) {
    console.error('[TTS]', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
