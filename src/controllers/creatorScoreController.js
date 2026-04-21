const prisma = require('../config/prisma');

// ─── Derive level label from score ────────────────────────────────
const getLevel = (score) => {
  if (score <= 20) return 'Beginner';
  if (score <= 40) return 'Rising Creator';
  if (score <= 60) return 'Consistent Creator';
  if (score <= 80) return 'Viral Ready';
  return 'Top Creator';
};

// ─── GET /api/score/creator ───────────────────────────────────────
const getCreatorScore = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Date boundary: last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch everything in parallel
    const [scriptsThisMonth, allHookScores, performanceLogs, user] = await Promise.all([
      prisma.script.findMany({
        where  : { userId, createdAt: { gte: thirtyDaysAgo } },
        select : { id: true },
      }),
      prisma.hookScore.findMany({
        where  : { userId },
        select : { score: true },
        orderBy: { createdAt: 'desc' },
        take   : 50, // use last 50 hook scores for avg
      }),
      prisma.performanceLog.findMany({
        where  : { userId },
        select : { watchTimePercent: true },
      }),
      prisma.user.findUnique({
        where : { id: userId },
        select: { streak: true },
      }),
    ]);

    const streak = user?.streak || 0;
    const scriptCount = scriptsThisMonth.length;

    // ─── Consistency score (0-25): 5 points per script, capped at 25
    const consistency = Math.min(scriptCount * 5, 25);

    // ─── Hook quality (0-35): avg hookScore / 100 * 35
    let hookQuality = 0;
    let avgHookScore = 0;
    if (allHookScores.length > 0) {
      const sum = allHookScores.reduce((acc, h) => acc + h.score, 0);
      avgHookScore = Math.round(sum / allHookScores.length);
      hookQuality = Math.round((avgHookScore / 100) * 35);
    }

    // ─── Performance (0-25): avg watchTimePercent/100 * 25
    let performance = 0;
    if (performanceLogs.length > 0) {
      const sum = performanceLogs.reduce((acc, p) => acc + p.watchTimePercent, 0);
      const avg = sum / performanceLogs.length;
      performance = Math.round((avg / 100) * 25);
    }

    // ─── Streak bonus (0-15): streak * 1.5, capped at 15
    const streakBonus = Math.min(Math.round(streak * 1.5), 15);

    // ─── Total
    const score = Math.round(consistency + hookQuality + performance + streakBonus);

    return res.json({
      score,
      breakdown: {
        consistency,
        hookQuality,
        performance,
        streakBonus,
      },
      scriptsThisMonth: scriptCount,
      avgHookScore,
      level: getLevel(score),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCreatorScore };
