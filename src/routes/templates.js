const router = require('express').Router()
const { protect: auth } = require('../middleware/auth')
const { list, create, remove } = require('../controllers/templateController')

router.get('/',     auth, list)
router.post('/',    auth, create)
router.delete('/:id', auth, remove)

module.exports = router
