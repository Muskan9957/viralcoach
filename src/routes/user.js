const router  = require('express').Router()
const axios   = require('axios')
const { protect: auth } = require('../middleware/auth')
const { getProfile, updateLanguage, getBadges } = require('../controllers/userController')
const prisma  = require('../config/prisma')

router.get('/profile',      auth, getProfile)
router.patch('/language',   auth, updateLanguage)
router.get('/badges',       auth, getBadges)

router.patch('/onboarded', auth, async (req, res, next) => {
  try {
    await prisma.user.update({ where: { id: req.user.id }, data: { onboarded: true } })
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// ─── POST /api/user/generate-avatar ───────────────────────────────
const AVATAR_STYLES = {
  cyberpunk:   'cyberpunk neon city warrior, glowing blue and purple circuits, futuristic helmet visor, high tech aesthetic',
  anime:       'anime character portrait, vibrant expressive eyes, clean line art, Studio Ghibli inspired, soft pastel tones',
  fantasy:     'epic fantasy character, mystical aura, glowing runes, ethereal light, painterly digital art',
  neon:        'bold neon portrait, vibrant electric colors, dark background, synthwave aesthetic, glowing outlines',
  minimal:     'minimalist geometric avatar, clean shapes, flat design, modern and professional',
  cosmic:      'cosmic space explorer, galaxy background, stars and nebula, deep blues and purples, cinematic',
  pixel:       'pixel art character avatar, retro 16-bit style, colorful, game sprite aesthetic',
  watercolor:  'watercolor painted portrait, soft brushstrokes, dreamy artistic style, pastel colors',
}

router.post('/generate-avatar', auth, async (req, res, next) => {
  try {
    const { style = 'cyberpunk' } = req.body
    const apiKey = (process.env.HF_API_KEY || '').trim()
    if (!apiKey) {
      return res.status(503).json({ error: 'Avatar generation not configured.' })
    }

    const stylePrompt = AVATAR_STYLES[style] || AVATAR_STYLES.cyberpunk
    const prompt = `${stylePrompt}, square avatar portrait, centered composition, high quality digital art, no text, no watermark`

    console.log('HuggingFace: generating avatar, style=', style)

    const hfRes = await axios.post(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 60000,
      }
    )

    // HF returns raw image bytes — convert to base64 data URL
    const base64 = Buffer.from(hfRes.data).toString('base64')
    const contentType = hfRes.headers['content-type'] || 'image/jpeg'
    const dataUrl = `data:${contentType};base64,${base64}`

    res.json({ url: dataUrl })
  } catch (err) {
    const status = err.response?.status
    const msg = err.response?.data ? Buffer.from(err.response.data).toString('utf8').slice(0, 200) : err.message
    console.error('HuggingFace error: HTTP', status, msg)
    res.status(502).json({ error: `Avatar generation failed (${status || err.message}).` })
  }
})

// ─── PATCH /api/user/avatar ────────────────────────────────────────
router.patch('/avatar', auth, async (req, res, next) => {
  try {
    const { url } = req.body
    if (!url) return res.status(400).json({ error: 'url is required' })
    await prisma.user.update({ where: { id: req.user.id }, data: { avatar: url } })
    res.json({ ok: true, avatar: url })
  } catch (err) { next(err) }
})

module.exports = router
