const router = require('express').Router()
const { protect: auth } = require('../middleware/auth')
const { getWeekly } = require('../controllers/reportController')

router.get('/weekly', auth, getWeekly)

module.exports = router
