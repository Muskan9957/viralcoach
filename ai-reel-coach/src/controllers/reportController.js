const prisma    = require('../config/prisma')
const aiService = require('../services/aiService')

// Helper: get the Monday of the current ISO week as YYYY-MM-DD
const getMondayOfCurrentWeek = () => {
  const now  = new Date()
  const day  = now.getDay() // 0 = Sunday, 1 = Monday, …
  const diff = (day === 0 ? -6 : 1 - day) // shift so Monday = 0
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  return monday.toISOString().slice(0, 10)
}

// ─── GET /api/reports/weekly ──────────────────────────────────────
const getWeekly = async (req, res, next) => {
  try {
    const userId    = req.user.id
    const weekStart = getMondayOfCurrentWeek()

    // 1. Return cached report if it exists for this week
    const existing = await prisma.weeklyReport.findUnique({
      where: { userId_weekStart: { userId, weekStart } },
    })
    if (existing) {
      return res.json({
        weekStart,
        report: existing.report,
        stats : JSON.parse(existing.stats),
        cached: true,
      })
    }

    // 2. Compute stats for the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()

    const [scripts, hookScores, analyses, user] = await Promise.all([
      prisma.script.findMany({
        where  : { userId, createdAt: { gte: new Date(sevenDaysAgo) } },
        orderBy: { hookScore: 'desc' },
        select : { topic: true, hookScore: true },
      }),
      prisma.hookScore.findMany({
        where : { userId, createdAt: { gte: new Date(sevenDaysAgo) } },
        select: { score: true },
      }),
      prisma.performanceLog.count({
        where: { userId, createdAt: { gte: new Date(sevenDaysAgo) } },
      }),
      prisma.user.findUnique({ where: { id: userId }, select: { streak: true, language: true } }),
    ])

    const avgHookScore = hookScores.length
      ? Math.round(hookScores.reduce((sum, h) => sum + h.score, 0) / hookScores.length)
      : 0

    const topTopic = scripts.length > 0 ? scripts[0].topic : null

    const stats = {
      scripts     : scripts.length,
      avgHookScore,
      analyses,
      topTopic,
      streak      : user ? user.streak : 0,
    }

    // 3. Generate AI report
    const language = user ? user.language : 'en'
    const report   = await aiService.generateWeeklyReport(stats, language)

    // 4. Save to DB
    await prisma.weeklyReport.create({
      data: {
        userId,
        weekStart,
        report,
        stats: JSON.stringify(stats),
      },
    })

    return res.json({
      weekStart,
      report,
      stats,
      cached: false,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getWeekly }
