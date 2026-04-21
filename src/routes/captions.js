const express = require('express');
const { protect: auth } = require('../middleware/auth');
const { generate } = require('../controllers/captionController');

const router = express.Router();

router.post('/generate', auth, generate);

module.exports = router;
