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
    const apiKey = (process.env.FAL_API_KEY || '').trim()
    if (!apiKey) {
      console.error('FAL_API_KEY not set')
      return res.status(503).json({ error: 'Avatar generation not configured.' })
    }

    // Log key prefix so we can verify Railway is reading it correctly
    console.log('fal.ai: key prefix =', apiKey.substring(0, 10) + '..., length =', apiKey.length)

    const stylePrompt = AVATAR_STYLES[style] || AVATAR_STYLES.cyberpunk
    const prompt = `${stylePrompt}, square avatar portrait, centered composition, high quality digital art, no text, no watermark`

    // Use official fal-ai SDK
    const falModule = await import('@fal-ai/serverless-client')
    const fal = falModule.fal || falModule.default
    fal.config({ credentials: apiKey })

    const result = await fal.subscribe('fal-ai/flux/schnell', {
      input: { prompt, image_size: 'square_hd', num_inference_steps: 4, num_images: 1 },
    })

    console.log('fal.ai result:', JSON.stringify(result).slice(0, 200))

    const imageUrl = result?.images?.[0]?.url
    if (!imageUrl) {
      console.error('fal.ai: no url in result:', JSON.stringify(result))
      return res.status(502).json({ error: 'No image returned from fal.ai.' })
    }

    res.json({ url: imageUrl })
  } catch (err) {
    console.error('fal.ai error:', err.message, err.status || '', err.body || '')
    res.status(502).json({ error: `Avatar generation failed: ${err.message}` })
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
