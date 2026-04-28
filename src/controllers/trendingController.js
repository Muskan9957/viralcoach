const prisma    = require('../config/prisma')
const aiService = require('../services/aiService')

// ─── In-memory greeting cache (per process, instant after first hit) ─
const greetingMem = new Map()

// ─── GET /api/trending/greeting?region=India&language=hi ─────────
// Cached per region+language+day in memory AND DB so it's instant on repeat visits.
const getGreeting = async (req, res, next) => {
  const region   = (req.query.region   || 'India').trim()
  const userLang = (req.query.language || 'en').trim()
  const today    = new Date().toISOString().slice(0, 10)
  const memKey   = `${region}:${userLang}:${today}`
  const dbNiche  = `_greeting_${region}`

  // 1. Memory hit — instant
  if (greetingMem.has(memKey)) {
    return res.json(greetingMem.get(memKey))
  }

  // 2. DB cache hit — fast (survives server restarts)
  try {
    const dbRow = await prisma.trendingCache.findUnique({
      where: { niche_language_date: { niche: dbNiche, language: userLang, date: today } },
    })
    if (dbRow) {
      const cached = JSON.parse(dbRow.topics)
      greetingMem.set(memKey, cached)
      return res.json(cached)
    }

    // 3. Stale DB (yesterday or earlier) — return immediately, refresh silently
    const stale = await prisma.trendingCache.findFirst({
      where: { niche: dbNiche, language: userLang },
      orderBy: { date: 'desc' },
    })
    if (stale) {
      const staleData = JSON.parse(stale.topics)
      greetingMem.set(memKey, staleData)   // treat as today so no re-fetch this session
      res.json(staleData)
      // Silently regenerate for tomorrow's visits
      aiService.getRegionalGreeting(region, userLang)
        .then(fresh => {
          const { _isFallback, ...d } = fresh
          greetingMem.set(memKey, d)
          prisma.trendingCache.upsert({
            where:  { niche_language_date: { niche: dbNiche, language: userLang, date: today } },
            create: { niche: dbNiche, language: userLang, date: today, topics: JSON.stringify(d) },
            update: { topics: JSON.stringify(d) },
          }).catch(() => {})
        }).catch(() => {})
      return
    }
  } catch {}

  // 4. No cache at all — must call AI (first ever request for this combo)
  try {
    const data = await aiService.getRegionalGreeting(region, userLang)
    const { _isFallback, ...responseData } = data
    greetingMem.set(memKey, responseData)
    prisma.trendingCache.upsert({
      where:  { niche_language_date: { niche: dbNiche, language: userLang, date: today } },
      create: { niche: dbNiche, language: userLang, date: today, topics: JSON.stringify(responseData) },
      update: { topics: JSON.stringify(responseData) },
    }).catch(() => {})
    return res.json(responseData)
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
