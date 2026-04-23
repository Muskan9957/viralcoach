const express    = require('express');
const { body }   = require('express-validator');
const { protect: auth } = require('../middleware/auth');
const { generate } = require('../controllers/remixController');

const router = express.Router();

router.post(
  '/generate',
  auth,
  [
    body('hook').optional().trim().isLength({ max: 1000 }).withMessage('Hook must be under 1000 characters.'),
    body('body').optional().trim().isLength({ max: 1000 }).withMessage('Body must be under 1000 characters.'),
    body('cta').optional().trim().isLength({ max: 1000 }).withMessage('CTA must be under 1000 characters.'),
    body('topic').optional().trim().isLength({ max: 1000 }).withMessage('Topic must be under 1000 characters.'),
  ],
  generate
);

module.exports = router;
