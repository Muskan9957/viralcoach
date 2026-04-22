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

    const STYLE_MAP = {
      cyberpunk:   'bottts',
      anime:       'adventurer',
      fantasy:     'personas',
      neon:        'rings',
      minimal:     'shapes',
      cosmic:      'identicon',
      pixel:       'pixel-art',
      watercolor:  'lorelei',
    }

    const dicebearStyle = STYLE_MAP[style] || 'bottts'
    const seed = Math.random().toString(36).substring(2, 12)
    const imageUrl = `https://api.dicebear.com/8.x/${dicebearStyle}/png?seed=${seed}&size=256`

    res.json({ url: imageUrl })
  } catch (err) {
    console.error('Avatar error:', err.message)
    res.status(502).json({ error: 'Avatar generation failed.' })
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
