const prisma = require('../config/prisma')

const VALID_TYPES = ['SCRIPT', 'HOOK', 'CTA']

// ─── GET /api/templates?type=HOOK|SCRIPT|CTA ─────────────────────
const list = async (req, res, next) => {
  try {
    const { type } = req.query

    const where = { userId: req.user.id }
    if (type) {
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({ error: `type must be one of: ${VALID_TYPES.join(', ')}` })
      }
      where.type = type
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return res.json({ templates })
  } catch (err) {
    next(err)
  }
}

// ─── POST /api/templates ──────────────────────────────────────────
const create = async (req, res, next) => {
  try {
    const { name, type, content } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'name is required.' })
    }
    if (!type || !VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: `type is required and must be one of: ${VALID_TYPES.join(', ')}` })
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'content is required.' })
    }

    const template = await prisma.template.create({
      data: {
        userId : req.user.id,
        name   : name.trim(),
        type,
        content: content.trim(),
      },
    })

    return res.status(201).json({ message: 'Template created.', template })
  } catch (err) {
    next(err)
  }
}

// ─── DELETE /api/templates/:id ────────────────────────────────────
const remove = async (req, res, next) => {
  try {
    const existing = await prisma.template.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!existing) return res.status(404).json({ error: 'Template not found.' })

    await prisma.template.delete({ where: { id: req.params.id } })

    return res.json({ message: 'Template deleted.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, create, remove }
