const { validationResult } = require('express-validator');
const prisma         = require('../config/prisma');
const aiService      = require('../services/aiService');
const planService    = require('../services/planService');
const { checkAndAwardBadges, updateStreak } = require('../services/badgeService');

// ─── POST /api/scripts/generate ──────────────────────────────────
const generate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // 1. Check plan limits
    const { allowed, used, limit } = await planService.checkGenerationLimit(req.user.id);
    if (!allowed) {
      return res.status(403).json({
        error  : `You have used all ${limit} script generations for this month.`,
        upgrade: 'Upgrade your plan to generate more scripts.',
        used, limit,
      });
    }

    // 2. Generate script via AI
    const { topic, niche, tone, language, audience } = req.body;
    const { hook, body, cta, fullScript, idealDuration } = await aiService.generateScript({ topic, niche, tone, language, audience });

    // 3. Score hook + generate visual/music directions in parallel
    const [hookScoreData, visualMusic] = await Promise.all([
      aiService.scoreHook(hook, language),
      aiService.generateVisualMusic({ topic, niche, hook, audience }),
    ]);

    // 4. Save script to database
    const script = await prisma.script.create({
      data: {
        userId: req.user.id,
        topic,
        niche : niche || null,
        tone  : tone  || null,
        hook,
        body,
        cta,
        fullScript,
        hookScore: hookScoreData.score,
      },
    });

    // 5. Save hook score record (needs script.id — can't fully parallelize with step 4)
    await prisma.hookScore.create({
      data: {
        userId  : req.user.id,
        scriptId: script.id,
        hookText: hook,
        score   : hookScoreData.score,
        grade   : hookScoreData.grade,
        status  : hookScoreData.status,
        reasons : JSON.stringify(hookScoreData.reasons),
      },
    });

    // 6 & 7. Increment usage + update streak in parallel — they don't depend on each other
    await Promise.all([
      planService.incrementGenerations(req.user.id),
      updateStreak(req.user.id),
    ]);
    const newBadges = await checkAndAwardBadges(req.user.id);

    const response = {
      message: 'Script generated successfully!',
      script : {
        id           : script.id,
        topic,
        hook,
        body,
        cta,
        fullScript,
        idealDuration: idealDuration || null,
        hookScore    : hookScoreData,
        visual       : visualMusic?.visual || null,
        music        : visualMusic?.music  || null,
      },
      usage: { used: used + 1, limit },
    };

    if (newBadges.length > 0) {
      response.newBadges = newBadges;
    }

    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/scripts/retake ─────────────────────────────────────
// Fresh script on the same topic — does NOT consume the monthly quota.
// The 5-per-topic cap is enforced on the client; this endpoint just
// generates and scores without touching generationsUsed.
const retake = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { topic, niche, tone, language, audience } = req.body;
    const { hook, body, cta, fullScript, idealDuration } = await aiService.generateScript({ topic, niche, tone, language, audience });
    const [hookScoreData, visualMusic] = await Promise.all([
      aiService.scoreHook(hook, language),
      aiService.generateVisualMusic({ topic, niche, hook, audience }),
    ]);

    return res.json({
      script: {
        hook, body, cta, fullScript,
        idealDuration: idealDuration || null,
        hookScore    : hookScoreData,
        visual       : visualMusic?.visual || null,
        music        : visualMusic?.music  || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/scripts/refine ─────────────────────────────────────
// Iterates on an existing script without consuming the generation quota.
const refine = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { hook, body, cta, instruction, language, audience, topic } = req.body;
    const refined = await aiService.refineScript({ hook, body, cta, instruction, language, audience, topic });

    // Re-score the new hook so the UI can show grade change
    const hookScoreData = await aiService.scoreHook(refined.hook, language);

    return res.json({
      script: {
        hook     : refined.hook,
        body     : refined.body,
        cta      : refined.cta,
        fullScript: refined.fullScript,
        hookScore: hookScoreData,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/scripts ─────────────────────────────────────────────
const getAll = async (req, res, next) => {
  try {
    const scripts = await prisma.script.findMany({
      where  : { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select : {
        id        : true,
        topic     : true,
        hook      : true,
        hookScore : true,
        createdAt : true,
      },
    });
    return res.json({ scripts });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/scripts/:id ─────────────────────────────────────────
const getOne = async (req, res, next) => {
  try {
    const script = await prisma.script.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!script) return res.status(404).json({ error: 'Script not found.' });
    return res.json({ script });
  } catch (err) {
    next(err);
  }
};

module.exports = { generate, retake, refine, getAll, getOne };
