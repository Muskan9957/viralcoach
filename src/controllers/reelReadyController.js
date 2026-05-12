const aiService = require('../services/aiService');

// POST /api/reel-ready/analyze
const analyze = async (req, res, next) => {
  try {
    const { frames, mediaTypes, audience = 'India', language = 'en' } = req.body;

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return res.status(400).json({ error: 'No frames provided.' });
    }

    // 1. Analyse the visual content
    const analysis = await aiService.analyzeReelContent({
      imageBase64Array: frames,
      mediaTypes: mediaTypes || frames.map(() => 'image/jpeg'),
      audience,
      language,
    });

    // 2. Get song picks based on what the AI understood about the content
    const songResult = await aiService.recommendSongs({
      hook    : analysis.script?.slice(0, 120) || '',
      body    : analysis.script || '',
      cta     : '',
      topic   : analysis.topic   || '',
      niche   : analysis.niche   || 'general',
      tone    : analysis.tone    || 'motivational',
      mood    : analysis.mood    || '',
      audience,
      language,
    });

    return res.json({ analysis, songs: songResult.songs || [] });
  } catch (err) {
    next(err);
  }
};

module.exports = { analyze };
