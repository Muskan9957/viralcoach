const express = require('express')
const router  = express.Router()

// ─── Microsoft Edge Neural TTS ────────────────────────────────────
// Free, no API key. Same engine as Edge browser Read Aloud.
const VOICE_MAP = {
  'en-IN': 'en-IN-NeerjaNeural',
  'hi-IN': 'hi-IN-SwaraNeural',
  'es-ES': 'es-ES-ElviraNeural',
  'fr-FR': 'fr-FR-DeniseNeural',
  'pt-BR': 'pt-BR-FranciscaNeural',
  'de-DE': 'de-DE-KatjaNeural',
  'ar-SA': 'ar-SA-ZariyahNeural',
  'id-ID': 'id-ID-GadisNeural',
  'ja-JP': 'ja-JP-NanamiNeural',
  'ko-KR': 'ko-KR-SunHiNeural',
}

router.post('/', async (req, res) => {
  const { text, lang = 'en-IN' } = req.body
  if (!text?.trim()) return res.status(400).json({ error: 'text required' })

  try {
    const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts')
    const voice = VOICE_MAP[lang] || 'en-IN-NeerjaNeural'

    const tts = new MsEdgeTTS()
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)

    // toStream() returns a Node Readable — collect chunks via events
    const stream = tts.toStream(text.slice(0, 2500))
    const buffer = await new Promise((resolve, reject) => {
      const chunks = []
      stream.on('data',  chunk => chunks.push(chunk))
      stream.on('end',   ()    => resolve(Buffer.concat(chunks)))
      stream.on('error', err   => reject(err))
    })

    res.set('Content-Type',  'audio/mpeg')
    res.set('Cache-Control', 'public, max-age=3600')
    res.send(buffer)
  } catch (err) {
    console.error('[TTS] Edge TTS error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
