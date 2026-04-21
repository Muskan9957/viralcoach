const router = require('express').Router()
const { protect: auth } = require('../middleware/auth')
const { getProfile, updateLanguage, getBadges } = require('../controllers/userController')

router.get('/profile',      auth, getProfile)
router.patch('/language',   auth, updateLanguage)
router.get('/badges',       auth, getBadges)

module.exports = router
