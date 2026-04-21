const router = require('express').Router()
const { protect: auth } = require('../middleware/auth')
const { list, create, update, remove } = require('../controllers/calendarController')

router.get('/',    auth, list)
router.post('/',   auth, create)
router.patch('/:id', auth, update)
router.delete('/:id', auth, remove)

module.exports = router
