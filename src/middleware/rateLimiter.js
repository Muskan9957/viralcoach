const rateLimit = require('express-rate-limit');

/**
 * FREE tier enforcement — checked inside controllers using DB counts.
 * This middleware provides IP-level protection against abuse.
 */

// General API limiter — 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max     : 100,
  message : { error: 'Too many requests. Please slow down and try again shortly.' },
  standardHeaders: true,
  legacyHeaders  : false,
});

// AI endpoint limiter — stricter, 20 per 15 minutes per IP
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max     : 20,
  message : { error: 'Too many AI requests. Please wait a moment before trying again.' },
  standardHeaders: true,
  legacyHeaders  : false,
});

module.exports = { apiLimiter, aiLimiter };
