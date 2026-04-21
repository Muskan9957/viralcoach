const aiService = require('../services/aiService');

// ─── POST /api/captions/generate ──────────────────────────────────
const generate = async (req, res, next) => {
  try {
    const { topic, niche, tone } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'topic is required' });
    }

    const result = await aiService.generateCaptions({
      topic: topic.trim(),
      niche: niche ? niche.trim() : undefined,
      tone : tone  ? tone.trim()  : undefined,
    });

    return res.json({
      message : 'Captions generated successfully!',
      topic,
      captions: result.captions,
      hashtags: result.hashtags,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { generate };
