const express  = require('express');
const passport = require('../config/passport');
const jwt      = require('jsonwebtoken');
const router   = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ─── Helper: make JWT and redirect to frontend ────────────────────
const finishOAuth = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.redirect(`${FRONTEND_URL}/?error=oauth_failed`);
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, plan: user.plan },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  // Redirect to frontend with token in query param — frontend stores it
  res.redirect(`${FRONTEND_URL}/?token=${token}&name=${encodeURIComponent(user.name || '')}&plan=${user.plan}`);
};

// ─── Google ───────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/?error=google_failed` }),
  finishOAuth
);

// ─── X / Twitter ──────────────────────────────────────────────────
router.get('/twitter',
  passport.authenticate('twitter', { session: false })
);
router.get('/twitter/callback',
  passport.authenticate('twitter', { session: false, failureRedirect: `${FRONTEND_URL}/?error=twitter_failed` }),
  finishOAuth
);

// ─── YouTube (same as Google, different scope) ────────────────────
router.get('/youtube',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly'],
    session: false,
  })
);
// YouTube shares Google's callback URL

// ─── Instagram ────────────────────────────────────────────────────
router.get('/instagram',
  passport.authenticate('instagram', { session: false })
);
router.get('/instagram/callback',
  passport.authenticate('instagram', { session: false, failureRedirect: `${FRONTEND_URL}/?error=instagram_failed` }),
  finishOAuth
);

module.exports = router;
