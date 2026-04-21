const prisma    = require('../config/prisma')
const aiService = require('../services/aiService')

// ─── GET /api/trending/greeting?region=India ─────────────────────
const getGreeting = async (req, res, next) => {
  try {
    const region   = (req.query.region || 'India').trim()
    const today    = new Date().toISOString().slice(0, 10)
    const niche    = `greeting_${region.toLowerCase().replace(/\s+/g, '_')}`
    const language = 'greeting'

    // Check cache (reuse TrendingCache, one entry per region per day)
    const cached = await prisma.trendingCache.findUnique({
      where: { niche_language_date: { niche, language, date: today } },
    })
    if (cached) return res.json(JSON.parse(cached.topics))

    // Generate fresh
    const data = await aiService.getRegionalGreeting(region)

    // Persist
    await prisma.trendingCache.create({
      data: { niche, language, topics: JSON.stringify(data), date: today },
    })

    return res.json(data)
  } catch (err) {
    next(err)
  }
}

// ─── Background refresh helper ────────────────────────────────────
// Generates fresh topics for today and upserts into cache.
// Never throws — errors are swallowed so they don't affect the response.
const refreshInBackground = (niche, language, today) => {
  aiService.getTrendingTopics(niche, language)
    .then(topics =>
      prisma.trendingCache.upsert({
        where  : { niche_language_date: { niche, language, date: today } },
        create : { niche, language, topics: JSON.stringify(topics), date: today },
        update : { topics: JSON.stringify(topics) },
      })
    )
    .catch(err => console.error('[trending] background refresh failed:', err.message))
}

// ─── GET /api/trending?niche=fitness&language=en ──────────────────
const get = async (req, res, next) => {
  try {
    const niche    = (req.query.niche    || 'general').toLowerCase().trim()
    const language = (req.query.language || 'en').toLowerCase().trim()
    const today    = new Date().toISOString().slice(0, 10)

    // 1. Today's cache — respond instantly
    const todayCache = await prisma.trendingCache.findUnique({
      where: { niche_language_date: { niche, language, date: today } },
    })
    if (todayCache) {
      return res.json({ niche, language, date: today, topics: JSON.parse(todayCache.topics), cached: true })
    }

    // 2. Stale cache (any previous day) — respond instantly, refresh in background
    const staleCache = await prisma.trendingCache.findFirst({
      where  : { niche, language },
      orderBy: { date: 'desc' },
    })
    if (staleCache) {
      // Send stale data right away so the user sees content immediately
      res.json({ niche, language, date: staleCache.date, topics: JSON.parse(staleCache.topics), cached: true, stale: true })
      // Quietly generate today's topics in background for the next visit
      refreshInBackground(niche, language, today)
      return
    }

    // 3. No cache at all (first-ever request for this niche) — must wait for AI
    const topics = await aiService.getTrendingTopics(niche, language)
    await prisma.trendingCache.create({
      data: { niche, language, topics: JSON.stringify(topics), date: today },
    })
    return res.json({ niche, language, date: today, topics, cached: false })

  } catch (err) {
    next(err)
  }
}

module.exports = { get, getGreeting }
