const express = require('express');
const { protect: auth } = require('../middleware/auth');
const { getCreatorScore } = require('../controllers/creatorScoreController');

const router = express.Router();

router.get('/creator', auth, getCreatorScore);

module.exports = router;
