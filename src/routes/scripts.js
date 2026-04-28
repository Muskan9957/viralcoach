const express    = require('express');
const { body }   = require('express-validator');
const controller = require('../controllers/scriptController');
const { protect }    = require('../middleware/auth');
const { aiLimiter }  = require('../middleware/rateLimiter');

const router = express.Router();

// All script routes require login
router.use(protect);

// POST /api/scripts/generate
router.post(
  '/generate',
  aiLimiter,
  [
    body('topic').trim().notEmpty().withMessage('Topic is required.').isLength({ max: 1000 }).withMessage('Topic must be under 1000 characters.'),
    body('niche').optional().trim().isLength({ max: 100 }),
    body('tone').optional().trim().isIn(['educational', 'funny', 'motivational', 'storytelling', 'controversial', 'conversational'])
      .withMessage('Tone must be one of: educational, funny, motivational, storytelling, controversial, conversational'),
  ],
  controller.generate
);

// POST /api/scripts/refine  — iterate/refine an existing script (does NOT count against generation quota)
router.post(
  '/refine',
  [
    body('hook').trim().notEmpty().withMessage('hook is required'),
    body('body').trim().notEmpty().withMessage('body is required'),
    body('cta').trim().notEmpty().withMessage('cta is required'),
    body('instruction').trim().notEmpty().withMessage('Refinement instruction is required').isLength({ max: 500 }),
  ],
  controller.refine
);

// GET /api/scripts
router.get('/', controller.getAll);

// GET /api/scripts/:id
router.get('/:id', controller.getOne);

module.exports = router;
