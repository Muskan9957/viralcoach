const prisma = require('../config/prisma');

// ─── GET /api/hooks/library ───────────────────────────────────────
// Query params: category=all, type=all, search=
const getLibrary = async (req, res, next) => {
  try {
    const { category = 'all', type = 'all', search = '' } = req.query;

    const where = {};

    if (category && category !== 'all') {
      where.category = category;
    }
    if (type && type !== 'all') {
      where.type = type;
    }
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      where.OR = [
        { template: { contains: s } },
        { example : { contains: s } },
        { tags    : { contains: s } },
      ];
    }

    const hooks = await prisma.hookTemplate.findMany({
      where,
      orderBy: [{ category: 'asc' }, { type: 'asc' }],
    });

    // Get unique categories and types for filter dropdowns
    const allHooks = await prisma.hookTemplate.findMany({
      select: { category: true, type: true },
    });
    const categories = [...new Set(allHooks.map(h => h.category))].sort();
    const types      = [...new Set(allHooks.map(h => h.type))].sort();

    return res.json({
      hooks,
      total: hooks.length,
      filters: { categories, types },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/hooks/library/use ─────────────────────────────────
// Logs usage — no-op for now
const useHook = async (req, res, next) => {
  try {
    // No-op: just return 200
    // Future: track which templates users engage with
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLibrary, useHook };
