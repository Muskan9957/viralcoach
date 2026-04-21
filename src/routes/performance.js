const express    = require('express');
const { body }   = require('express-validator');
const controller = require('../controllers/performanceController');
const { protect }   = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect);

// POST /api/performance/analyze
router.post(
  '/analyze',
  aiLimiter,
  [
    body('topic').trim().notEmpty().withMessage('Topic is required.'),
    body('hookUsed').trim().notEmpty().withMessage('Hook text is required.'),
    body('views').isInt({ min: 0 }).withMessage('Views must be a positive number.'),
    body('watchTimePercent').isFloat({ min: 0, max: 100 }).withMessage('Watch time must be 0–100.'),
    body('likes').isInt({ min: 0 }),
    body('shares').isInt({ min: 0 }),
    body('comments').isInt({ min: 0 }),
  ],
  controller.analyze
);

// GET /api/performance/history
router.get('/history', controller.history);

// GET /api/performance/history/:id
router.get('/history/:id', controller.getOne);

module.exports = router;
