const prisma = require('../config/prisma')

// ─── GET /api/calendar?month=YYYY-MM ─────────────────────────────
const list = async (req, res, next) => {
  try {
    const { month } = req.query // expects YYYY-MM
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'month query param is required in YYYY-MM format.' })
    }

    const entries = await prisma.calendarEntry.findMany({
      where: {
        userId: req.user.id,
        date  : { startsWith: month },
      },
      orderBy: { date: 'asc' },
    })

    return res.json({ entries })
  } catch (err) {
    next(err)
  }
}

// ─── POST /api/calendar ───────────────────────────────────────────
const create = async (req, res, next) => {
  try {
    const { date, title, status, note, scriptId } = req.body

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'date is required in YYYY-MM-DD format.' })
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required.' })
    }

    // If a scriptId is provided, verify it belongs to this user
    if (scriptId) {
      const script = await prisma.script.findFirst({ where: { id: scriptId, userId: req.user.id } })
      if (!script) return res.status(404).json({ error: 'Script not found.' })
    }

    const VALID_STATUSES = ['PLANNED', 'DRAFTED', 'PUBLISHED']
    const resolvedStatus = status && VALID_STATUSES.includes(status) ? status : 'PLANNED'

    const entry = await prisma.calendarEntry.create({
      data: {
        userId  : req.user.id,
        date,
        title   : title.trim(),
        status  : resolvedStatus,
        note    : note || null,
        scriptId: scriptId || null,
      },
    })

    return res.status(201).json({ message: 'Calendar entry created.', entry })
  } catch (err) {
    next(err)
  }
}

// ─── PATCH /api/calendar/:id ──────────────────────────────────────
const update = async (req, res, next) => {
  try {
    const existing = await prisma.calendarEntry.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!existing) return res.status(404).json({ error: 'Calendar entry not found.' })

    const { status, title, note } = req.body
    const VALID_STATUSES = ['PLANNED', 'DRAFTED', 'PUBLISHED']

    const updateData = {}
    if (title !== undefined) updateData.title = title.trim()
    if (note  !== undefined) updateData.note  = note
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` })
      }
      updateData.status = status
    }

    const entry = await prisma.calendarEntry.update({
      where: { id: req.params.id },
      data : updateData,
    })

    return res.json({ message: 'Calendar entry updated.', entry })
  } catch (err) {
    next(err)
  }
}

// ─── DELETE /api/calendar/:id ─────────────────────────────────────
const remove = async (req, res, next) => {
  try {
    const existing = await prisma.calendarEntry.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!existing) return res.status(404).json({ error: 'Calendar entry not found.' })

    await prisma.calendarEntry.delete({ where: { id: req.params.id } })

    return res.json({ message: 'Calendar entry deleted.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, create, update, remove }
