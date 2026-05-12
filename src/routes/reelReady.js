const express    = require('express');
const { protect }   = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const controller = require('../controllers/reelReadyController');

const router = express.Router();
router.use(protect);

// POST /api/reel-ready/analyze
// Body: { frames: string[], mediaTypes: string[], audience: string, language: string }
router.post('/analyze', aiLimiter, controller.analyze);

module.exports = router;
