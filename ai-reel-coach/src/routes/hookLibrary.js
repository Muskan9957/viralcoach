const express = require('express');
const { protect: auth } = require('../middleware/auth');
const { getLibrary, useHook } = require('../controllers/hookLibraryController');

const router = express.Router();

router.get('/library',      auth, getLibrary);
router.post('/library/use', auth, useHook);

module.exports = router;
