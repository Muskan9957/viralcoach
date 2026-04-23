const Anthropic = require('@anthropic-ai/sdk');

const MODEL       = 'claude-sonnet-4-6';           // Quality model for creative tasks
const MODEL_FAST  = 'claude-haiku-4-5-20251001';   // Fast model for scoring/rewriting

// ─── Language instruction helper ─────────────────────────────────
const LANG_INSTRUCTIONS = {
  hi:       'IMPORTANT: Write ALL content entirely in Hindi (Devanagari script). Every word must be in Hindi only.',
  hinglish: 'IMPORTANT: Write ALL content in Hinglish — a natural mix of Hindi and English used by Indian millennials. Use Roman script (not Devanagari). Example: "Aaj main tumhe bataunga ek secret jo 10k followers dilayega."',
  es:       'IMPORTANT: Write ALL content entirely in Spanish. Every word must be in Spanish only.',
  fr:       'IMPORTANT: Write ALL content entirely in French. Every word must be in French only.',
  pt:       'IMPORTANT: Write ALL content entirely in Portuguese (Brazilian). Every word must be in Portuguese only.',
  de:       'IMPORTANT: Write ALL content entirely in German. Every word must be in German only.',
  ar:       'IMPORTANT: Write ALL content entirely in Arabic. Every word must be in Arabic only. Use right-to-left text naturally.',
  id:       'IMPORTANT: Write ALL content entirely in Bahasa Indonesia. Every word must be in Bahasa Indonesia only.',
  ja:       'IMPORTANT: Write ALL content entirely in Japanese. Every word must be in Japanese only.',
  ko:       'IMPORTANT: Write ALL content entirely in Korean. Every word must be in Korean only.',
}

const getLangInstruction = (language) => LANG_INSTRUCTIONS[language] || ''

// ─── Helper — client created per-call so it always picks up the env var ─
const ask = async (prompt, maxTokens = 1024, model = MODEL) => {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    messages  : [{ role: 'user', content: prompt }],
  });
  return response.content[0].text.trim();
};

// ─────────────────────────────────────────────────────────────────
// 1. GENERATE SCRIPT
// ─────────────────────────────────────────────────────────────────
const generateScript = async ({ topic, niche, tone, language = 'en' }) => {
  const langInstruction = getLangInstruction(language)
  const prompt = `
You are an expert short-form content coach who specializes in viral Instagram Reels and YouTube Shorts.
${langInstruction ? '\n' + langInstruction + '\n' : ''}
Generate a high-performing short-form video script for the following:
- Topic : ${topic}
- Niche  : ${niche || 'general'}
- Tone   : ${tone  || 'engaging and conversational'}

The script must follow this exact structure:

HOOK (first 3 seconds — must stop the scroll immediately):
[Write 1-2 sentences. Use curiosity, a bold claim, a question, or a shocking statement.]

BODY (the main value — 45-75 seconds when spoken):
[3-5 punchy points or a mini story. Keep sentences short. No filler words.]

CTA (call to action — last 5 seconds):
[One clear action: follow, comment, save, or share. Make it feel natural, not forced.]

---
Rules:
- Total speaking time must be 60-90 seconds (roughly 150-225 words)
- Write like you are talking to a friend, not presenting to a boardroom
- Do NOT use hashtags, emojis, or stage directions
- Return ONLY the script, no extra commentary

Script:
`;

  const raw = await ask(prompt, 800);

  // Parse the three sections from the response
  const hookMatch = raw.match(/HOOK[^:]*:\s*([\s\S]*?)(?=BODY|$)/i);
  const bodyMatch = raw.match(/BODY[^:]*:\s*([\s\S]*?)(?=CTA|$)/i);
  const ctaMatch  = raw.match(/CTA[^:]*:\s*([\s\S]*?)$/i);

  return {
    hook      : hookMatch ? hookMatch[1].trim() : '',
    body      : bodyMatch ? bodyMatch[1].trim() : '',
    cta       : ctaMatch  ? ctaMatch[1].trim()  : '',
    fullScript: raw,
  };
};

// ─────────────────────────────────────────────────────────────────
// 2. SCORE A HOOK
// ─────────────────────────────────────────────────────────────────
const scoreHook = async (hookText, language = 'en') => {
  const langInstruction = getLangInstruction(language)
  const prompt = `
You are a viral content strategist who has analyzed thousands of short-form video hooks.
${langInstruction ? '\n' + langInstruction + ' Write the "reasons" array values in that language, but keep the JSON keys in English.\n' : ''}
Score this hook for its scroll-stopping potential on Instagram Reels / YouTube Shorts:

HOOK: "${hookText}"

Evaluate it on these 5 factors (20 points each):
1. Emotional trigger (does it spark curiosity, fear, excitement, or desire?)
2. Curiosity gap (does it make the viewer NEED to watch more?)
3. Clarity (is it instantly understandable in 2 seconds?)
4. Specificity (does it use concrete details rather than vague claims?)
5. Scroll-stopping power (would YOU stop scrolling for this?)

Return your response in this EXACT JSON format (no extra text):
{
  "score": <number 1-100>,
  "grade": "<A|B|C|D|F>",
  "status": "<Post Ready|Needs Improvement|Rewrite Recommended>",
  "reasons": [
    "<specific reason 1>",
    "<specific reason 2>",
    "<specific reason 3>"
  ]
}

Scoring guide:
- 75-100 → "Post Ready" (Grade A or B)
- 50-74  → "Needs Improvement" (Grade C)
- 0-49   → "Rewrite Recommended" (Grade D or F)
`;

  const raw = await ask(prompt, 400, MODEL_FAST); // Fast model — scoring is straightforward

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);
    // Ensure reasons is always an array
    if (!Array.isArray(parsed.reasons)) parsed.reasons = [String(parsed.reasons)];
    return parsed;
  } catch {
    // Fallback if AI doesn't return clean JSON
    return {
      score  : 50,
      grade  : 'C',
      status : 'Needs Improvement',
      reasons: ['Could not parse detailed feedback. Try again.'],
    };
  }
};

// ─────────────────────────────────────────────────────────────────
// 3. REWRITE A HOOK
// ─────────────────────────────────────────────────────────────────
const rewriteHook = async (originalHook, originalScore, language = 'en') => {
  const langInstruction = getLangInstruction(language)
  const prompt = `
You are a viral content strategist. This hook scored ${originalScore}/100 and needs improvement.
${langInstruction ? '\n' + langInstruction + ' Write the rewritten hook and changes explanation in that language, but keep the JSON keys in English.\n' : ''}
ORIGINAL HOOK: "${originalHook}"

Rewrite it to score at least ${Math.min(originalScore + 15, 95)}/100.
Keep the same topic and intent — only improve the wording.

Return your response in this EXACT JSON format (no extra text):
{
  "rewrittenHook": "<your improved hook>",
  "changes": "<1-2 sentences explaining exactly what you changed and why>"
}
`;

  const raw = await ask(prompt, 400, MODEL_FAST); // Fast model — rewriting is a simple task

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      rewrittenHook: originalHook,
      changes      : 'Could not generate rewrite. Please try again.',
    };
  }
};

// ─────────────────────────────────────────────────────────────────
// 4. ANALYZE PERFORMANCE
// ─────────────────────────────────────────────────────────────────
const analyzePerformance = async ({ topic, hookUsed, views, watchTimePercent, likes, shares, comments, pastLogs, language = 'en' }) => {
  const langInstruction = getLangInstruction(language)
  const pastContext = pastLogs && pastLogs.length > 0
    ? `\n\nThis creator's past content patterns:\n${pastLogs.map(l =>
        `- Topic: "${l.topic}" | Views: ${l.views} | Watch Time: ${l.watchTimePercent}%`
      ).join('\n')}`
    : '';

  const prompt = `
You are a data-driven content coach analyzing a creator's video performance.
${langInstruction ? '\n' + langInstruction + '\n' : ''}
VIDEO DETAILS:
- Topic        : ${topic}
- Hook used    : "${hookUsed}"
- Views        : ${views}
- Watch time   : ${watchTimePercent}%
- Likes        : ${likes}
- Shares       : ${shares}
- Comments     : ${comments}
${pastContext}

Write a plain-English performance analysis (3-4 paragraphs, no jargon):
1. What worked well and why
2. What likely hurt performance
3. One specific thing to do differently next time
4. A confidence-boosting closing line

Keep it conversational — like advice from a smart friend, not a corporate report.
`;

  return await ask(prompt, 600);
};

// ─────────────────────────────────────────────────────────────────
// 5. GET TRENDING TOPICS
// ─────────────────────────────────────────────────────────────────
const getTrendingTopics = async (niche = 'general', language = 'en') => {
  const langInstruction = getLangInstruction(language) ||
    'Respond in English.'

  const prompt = `
You are a viral content strategist tracking what's hot on Instagram Reels and YouTube Shorts RIGHT NOW.

${langInstruction}

Generate 10 trending topic ideas for a creator in the "${niche}" niche.
Each topic should be:
- Highly specific (not generic)
- Timely and relevant
- Optimized for short-form video (60-90 seconds)
- Likely to get high engagement

Return ONLY a JSON array of 10 strings. No extra text. Example:
["Topic 1", "Topic 2", ...]
`
  const raw = await ask(prompt, 600)
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('No JSON array')
    return JSON.parse(match[0])
  } catch {
    const fallbackTopics = {
      hi: ['30 दिनों में 1000 फॉलोअर्स कैसे पाए','नए क्रिएटर्स की सबसे बड़ी गलती','मेरी कंटेंट क्रिएशन रूटीन','वीडियो पर व्यूज़ क्यों नहीं आते','हुक फॉर्मूला जो हमेशा काम करता है','रोज़ काम आने वाले कंटेंट टूल्स','एक दिन में 30 वीडियो कैसे रिकॉर्ड करें','मेरी एडिटिंग वर्कफ़्लो','क्वालिटी से ज़्यादा कंसिस्टेंसी क्यों ज़रूरी है','वायरल होने की असली सच्चाई'],
      hinglish: ['30 days mein 1000 followers kaise paye','Naye creators ki sabse badi galti','Meri honest content creation routine','Videos pe views kyun nahi aate','Hook formula jo hamesha kaam karta hai','Daily use hone wale content tools','Ek din mein 30 videos kaise record karein','Mera editing workflow revealed','Consistency quality se zyada kyun zaroori hai','Viral hone ki sach mein kya reality hai'],
      es: ['Cómo gané 1000 seguidores en 30 días','El mayor error de los nuevos creadores','Mi rutina honesta de creación de contenido','Por qué tus videos no tienen vistas','La fórmula de gancho que siempre funciona','Herramientas de contenido que uso a diario','Cómo grabar 30 videos en un día','Mi flujo de edición revelado','Por qué la consistencia supera a la calidad','La verdad sobre hacerse viral'],
      fr: ['Comment j\'ai gagné 1000 abonnés en 30 jours','La plus grande erreur des nouveaux créateurs','Ma routine honnête de création de contenu','Pourquoi vos vidéos n\'ont pas de vues','La formule d\'accroche qui fonctionne toujours','Outils de contenu que j\'utilise quotidiennement','Comment enregistrer 30 vidéos en une journée','Mon flux de montage révélé','Pourquoi la régularité bat la qualité','La vérité sur devenir viral'],
      pt: ['Como conquistei 1000 seguidores em 30 dias','O maior erro dos novos criadores','Minha rotina honesta de criação de conteúdo','Por que seus vídeos não têm visualizações','A fórmula de gancho que sempre funciona','Ferramentas de conteúdo que uso diariamente','Como gravar 30 vídeos em um dia','Meu fluxo de edição revelado','Por que consistência supera qualidade','A verdade sobre se tornar viral'],
      de: ['Wie ich in 30 Tagen 1000 Follower gewann','Der größte Fehler neuer Creator','Meine ehrliche Content-Creation-Routine','Warum deine Videos keine Aufrufe bekommen','Die Hook-Formel, die immer funktioniert','Content-Tools, die ich täglich nutze','Wie man 30 Videos an einem Tag aufnimmt','Mein Bearbeitungs-Workflow enthüllt','Warum Konsistenz Qualität schlägt','Die Wahrheit über virales werden'],
      ar: ['كيف حصلت على 1000 متابع في 30 يوماً','أكبر خطأ يرتكبه المبدعون الجدد','روتيني الصادق في إنشاء المحتوى','لماذا مقاطع الفيديو الخاصة بك لا تحصل على مشاهدات','صيغة الخطاف التي تعمل دائماً','أدوات المحتوى التي أستخدمها يومياً','كيفية تسجيل 30 مقطعاً في يوم واحد','سير عمل التحرير الخاص بي','لماذا الاستمرارية تتفوق على الجودة','الحقيقة حول الانتشار الفيروسي'],
      id: ['Cara mendapat 1000 followers dalam 30 hari','Kesalahan terbesar kreator baru','Rutina pembuatan konten saya yang jujur','Kenapa video kamu tidak dapat views','Formula hook yang selalu berhasil','Tools konten yang saya gunakan setiap hari','Cara merekam 30 video dalam satu hari','Alur kerja editing saya terungkap','Kenapa konsistensi mengalahkan kualitas','Kebenaran tentang menjadi viral'],
      ja: ['30日で1000フォロワーを獲得した方法','新人クリエイターの最大の失敗','私の正直なコンテンツ制作ルーティン','なぜあなたの動画に再生数がつかないのか','いつでも機能するフック公式','毎日使うコンテンツツール','1日で30本の動画を撮る方法','私の編集ワークフロー公開','なぜ継続性が質を上回るのか','バイラルになる真実'],
      ko: ['30일 만에 팔로워 1000명 얻는 방법','신규 크리에이터의 가장 큰 실수','나의 솔직한 콘텐츠 제작 루틴','영상 조회수가 안 나오는 이유','항상 효과적인 훅 공식','매일 사용하는 콘텐츠 툴','하루에 영상 30개 찍는 방법','내 편집 워크플로우 공개','일관성이 품질을 이기는 이유','바이럴이 되는 진실'],
    }
    return fallbackTopics[language] || [
      'How I gained 1000 followers in 30 days',
      'The biggest mistake new creators make',
      'My honest content creation routine',
      'Why your videos get 0 views',
      'The hook formula that always works',
      'Content creation tools I use daily',
      'How to batch record 30 videos in one day',
      'My editing workflow revealed',
      'Why consistency beats quality',
      'The truth about going viral',
    ]
  }
}

// ─────────────────────────────────────────────────────────────────
// 6. GENERATE WEEKLY REPORT
// ─────────────────────────────────────────────────────────────────
const generateWeeklyReport = async (stats, language = 'en') => {
  const base = getLangInstruction(language)
  const langInstruction = base
    ? `${base} Be warm and encouraging.`
    : 'Write in English. Be warm and encouraging.'

  const prompt = `
You are a personal content coach writing a creator's weekly performance summary.

${langInstruction}

Creator's stats for this week:
- Scripts generated: ${stats.scripts}
- Average hook score: ${stats.avgHookScore}/100
- Videos analyzed: ${stats.analyses}
- Top performing topic: "${stats.topTopic || 'N/A'}"
- Current streak: ${stats.streak} days

Write a short, motivating weekly report (3-4 sentences max) that:
1. Celebrates what they did well
2. Gives ONE specific tip for next week
3. Ends with an encouraging line

Be like a friend, not a corporate report. Keep it short.
`
  return await ask(prompt, 400)
}

// ─────────────────────────────────────────────────────────────────
// 7. GET REGIONAL GREETING + TRENDING NEWS
// ─────────────────────────────────────────────────────────────────
const getRegionalGreeting = async (region = 'India', language = 'en') => {
  const langInstruction = getLangInstruction(language)
  const prompt = `You are a sharp, professional content strategist briefing an Indian creator on today's social media landscape.
${langInstruction ? '\n' + langInstruction + ' Write the greeting sentence and trend descriptions in that language, but keep JSON keys and category names in English.\n' : '\nWrite in clean, concise English. Be warm but not overly casual — think smart friend, not cheerleader.\n'}
Focus on topics Indian audiences actually engage with — Bollywood, cricket, Indian startups, festivals, food, finance, pop culture, etc.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "greeting": "One crisp sentence (max 20 words) about what's happening in India's creator space today — insightful, not generic",
  "trends": [
    {"title": "Specific trend name", "description": "Why this matters for creators — 1 sentence, actionable", "category": "Entertainment"},
    {"title": "Specific trend name", "description": "Why this matters for creators — 1 sentence, actionable", "category": "Business"},
    {"title": "Specific trend name", "description": "Why this matters for creators — 1 sentence, actionable", "category": "Lifestyle"}
  ]
}

Categories: Entertainment, Cricket, Finance, Tech, Food, Education, Lifestyle, Fashion, Business, Health, Bollywood`

  const raw = await ask(prompt, 600, MODEL_FAST)
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON')
    return JSON.parse(jsonMatch[0])
  } catch {
    const fallbacks = {
      hi: {
        greeting: `${region} का सोशल मीडिया आज बज़ रहा है — चलो कुछ वायरल बनाते हैं!`,
        trends: [
          { title: 'शॉर्ट-फॉर्म वीडियो ट्रेंड', description: 'Reels और Shorts अभी फीड पर छाए हुए हैं।', category: 'Content' },
          { title: 'क्रिएटर इकोनॉमी की वृद्धि', description: 'ब्रांड्स अब माइक्रो-इन्फ्लुएंसर्स में ज़्यादा निवेश कर रहे हैं।', category: 'Business' },
          { title: 'असली कहानियां', description: 'रॉ, अनफिल्टर्ड कंटेंट पॉलिश्ड वीडियो से बेहतर प्रदर्शन कर रहा है।', category: 'Strategy' },
        ],
      },
      hinglish: {
        greeting: `${region} ka social media aaj buzz kar raha hai — chalo kuch viral banate hain!`,
        trends: [
          { title: 'Short-form video trends', description: 'Reels aur Shorts abhi feeds pe chhaye hue hain.', category: 'Content' },
          { title: 'Creator economy ka growth', description: 'Brands ab micro-influencers mein zyada invest kar rahe hain.', category: 'Business' },
          { title: 'Authentic storytelling', description: 'Raw, unfiltered content polished videos se better perform kar raha hai.', category: 'Strategy' },
        ],
      },
      es: {
        greeting: `¡Las redes sociales de ${region} están en llamas hoy — creemos algo viral!`,
        trends: [
          { title: 'Tendencias de video corto', description: 'Los Reels y Shorts dominan los feeds ahora mismo.', category: 'Content' },
          { title: 'Economía de creadores', description: 'Las marcas invierten cada vez más en micro-influencers.', category: 'Business' },
          { title: 'Contenido auténtico', description: 'El contenido sin filtros supera a los videos pulidos.', category: 'Strategy' },
        ],
      },
      fr: {
        greeting: `Les réseaux sociaux de ${region} sont en effervescence aujourd'hui — créons quelque chose de viral !`,
        trends: [
          { title: 'Tendances vidéo courte', description: 'Les Reels et Shorts dominent les fils d\'actualité en ce moment.', category: 'Content' },
          { title: 'Économie des créateurs', description: 'Les marques investissent de plus en plus dans les micro-influenceurs.', category: 'Business' },
          { title: 'Contenu authentique', description: 'Le contenu brut surpasse les vidéos soignées.', category: 'Strategy' },
        ],
      },
      pt: {
        greeting: `As redes sociais de ${region} estão agitadas hoje — vamos criar algo viral!`,
        trends: [
          { title: 'Tendências de vídeo curto', description: 'Reels e Shorts estão dominando os feeds agora.', category: 'Content' },
          { title: 'Economia de criadores', description: 'As marcas estão investindo cada vez mais em micro-influenciadores.', category: 'Business' },
          { title: 'Conteúdo autêntico', description: 'Conteúdo bruto supera vídeos polidos em desempenho.', category: 'Strategy' },
        ],
      },
      de: {
        greeting: `Die sozialen Medien von ${region} sind heute im Trend — lass uns etwas Virales erstellen!`,
        trends: [
          { title: 'Kurzvideotrends', description: 'Reels und Shorts dominieren gerade die Feeds.', category: 'Content' },
          { title: 'Creator-Wirtschaft', description: 'Marken investieren mehr denn je in Mikro-Influencer.', category: 'Business' },
          { title: 'Authentischer Content', description: 'Ungefilterte Inhalte übertreffen polierte Videos.', category: 'Strategy' },
        ],
      },
      ar: {
        greeting: `وسائل التواصل الاجتماعي في ${region} تشتعل اليوم — لنصنع شيئاً يتداوله الجميع!`,
        trends: [
          { title: 'اتجاهات الفيديو القصير', description: 'ريلز وشورتس يهيمنان على الخلاصات الآن.', category: 'Content' },
          { title: 'اقتصاد المبدعين', description: 'تستثمر العلامات التجارية أكثر في المؤثرين الصغار.', category: 'Business' },
          { title: 'المحتوى الأصيل', description: 'المحتوى الخام يتفوق على مقاطع الفيديو المصقولة.', category: 'Strategy' },
        ],
      },
      id: {
        greeting: `Media sosial ${region} sedang ramai hari ini — mari buat konten yang viral!`,
        trends: [
          { title: 'Tren video pendek', description: 'Reels dan Shorts mendominasi feed saat ini.', category: 'Content' },
          { title: 'Ekonomi kreator', description: 'Brand semakin banyak berinvestasi ke micro-influencer.', category: 'Business' },
          { title: 'Konten autentik', description: 'Konten mentah mengungguli video yang dipoles.', category: 'Strategy' },
        ],
      },
      ja: {
        greeting: `${region}のソーシャルメディアが今日も盛り上がっています — バイラルなコンテンツを作りましょう！`,
        trends: [
          { title: 'ショート動画トレンド', description: 'リールとショーツが今フィードを席巻しています。', category: 'Content' },
          { title: 'クリエイターエコノミー', description: 'ブランドがマイクロインフルエンサーへの投資を増やしています。', category: 'Business' },
          { title: 'ありのままのコンテンツ', description: '加工なしのコンテンツが磨かれた動画を上回っています。', category: 'Strategy' },
        ],
      },
      ko: {
        greeting: `${region}의 소셜 미디어가 오늘도 뜨겁습니다 — 바이럴 콘텐츠를 만들어봅시다!`,
        trends: [
          { title: '숏폼 비디오 트렌드', description: '릴스와 쇼츠가 지금 피드를 장악하고 있습니다.', category: 'Content' },
          { title: '크리에이터 이코노미', description: '브랜드들이 마이크로 인플루언서에 더 많이 투자하고 있습니다.', category: 'Business' },
          { title: '진정성 있는 콘텐츠', description: '날것의 콘텐츠가 정제된 영상보다 더 좋은 성과를 냅니다.', category: 'Strategy' },
        ],
      },
    }
    const fb = fallbacks[language] || {
      greeting: `Welcome back! ${region}'s social media is buzzing today — let's create something viral!`,
      trends: [
        { title: 'Short-form video trends', description: 'Reels and Shorts are dominating feeds right now.', category: 'Content' },
        { title: 'Creator economy growth', description: 'More brands are investing in micro-influencers.', category: 'Business' },
        { title: 'Authentic storytelling', description: 'Raw, unfiltered content is outperforming polished videos.', category: 'Strategy' },
      ],
    }
    // Mark as fallback so the controller skips caching this response
    return { ...fb, _isFallback: true }
  }
}

// ─────────────────────────────────────────────────────────────────
// 8. TRANSLATE CONTENT
// ─────────────────────────────────────────────────────────────────
const translateContent = async (content, targetLanguage) => {
  if (targetLanguage === 'en') return content

  const langMap = { hi: 'Hindi', es: 'Spanish', fr: 'French', pt: 'Portuguese' }
  const langName = langMap[targetLanguage] || targetLanguage

  const prompt = `Translate the following content to ${langName}. Keep the same tone, energy, and structure. Only return the translated text, nothing else.

Content:
${content}`

  return await ask(prompt, 1200)
}

// ─────────────────────────────────────────────────────────────────
// 9. GENERATE CAPTIONS + HASHTAGS
// ─────────────────────────────────────────────────────────────────
const generateCaptions = async ({ topic, niche, tone, language = 'en' }) => {
  const langInstruction = getLangInstruction(language)
  const prompt = `You are an expert Instagram caption writer who specializes in viral short-form content.
${langInstruction ? '\n' + langInstruction + ' Write all caption text in that language, but keep the JSON keys and style names in English.\n' : ''}
Generate 4 caption styles and 25 relevant hashtags for this content:
- Topic : ${topic}
- Niche  : ${niche || 'general'}
- Tone   : ${tone  || 'engaging'}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "captions": [
    {"style": "Short", "text": "..."},
    {"style": "Story", "text": "..."},
    {"style": "Question", "text": "..."},
    {"style": "Bold", "text": "..."}
  ],
  "hashtags": ["tag1", "tag2", "tag3", "...", "tag25"]
}

Caption style guide:
- Short: 1-2 punchy lines, high energy, max 50 words
- Story: mini narrative that hooks and delivers value, 80-120 words
- Question: opens with a question that sparks curiosity or debate, 40-70 words
- Bold: controversial or confident statement that invites engagement, 40-70 words

Hashtag rules:
- Mix of niche-specific, broad, and trending tags
- No # symbol in the JSON values — just the tag text
- 25 tags exactly`;

  const raw = await ask(prompt, 900, MODEL_FAST);

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed.captions)) throw new Error('captions not array');
    if (!Array.isArray(parsed.hashtags)) throw new Error('hashtags not array');
    return parsed;
  } catch {
    return {
      captions: [
        { style: 'Short', text: `${topic} — the truth no one talks about. Save this before it disappears.` },
        { style: 'Story', text: `I almost gave up on ${topic}. Then one thing changed everything. Here's the story and what I learned that completely flipped my results.` },
        { style: 'Question', text: `What if everything you knew about ${topic} was wrong? Drop your thoughts below.` },
        { style: 'Bold', text: `${topic} is the #1 skill you need right now. No debate.` },
      ],
      hashtags: ['reels', 'viral', 'trending', 'explore', 'fyp', 'motivation', 'growth', 'content', 'creator', 'tips', 'advice', 'lifestyle', 'instagood', 'instagram', 'reelsinstagram', 'video', 'shortsvideo', 'trending2024', 'creatoreconomy', 'contentcreator', 'smallcreator', 'reelsviral', 'instareels', 'learnontiktok', 'educate'],
    };
  }
};

// ─────────────────────────────────────────────────────────────────
// 10. REMIX CONTENT
// ─────────────────────────────────────────────────────────────────
const remixContent = async ({ hook, body, cta, topic, language = 'en' }) => {
  const langInstruction = getLangInstruction(language)
  const scriptText = `HOOK: ${hook}\n\nBODY: ${body}\n\nCTA: ${cta}`;

  const prompt = `You are a multi-platform content strategist. Take this short-form video script and reformat it for 4 different platforms.
${langInstruction ? '\n' + langInstruction + ' Write all platform content in that language, but keep the JSON keys in English.\n' : ''}

Original Reel script about "${topic}":
${scriptText}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "twitter": "...",
  "linkedin": "...",
  "youtube": "...",
  "caption": "..."
}

Platform rules:
- twitter: A tweet thread (3-5 tweets). Use numbering like "1/" "2/" etc. Each tweet max 280 chars. Make it conversational and punchy.
- linkedin: A professional LinkedIn post (150-250 words). Start with a bold hook line. Use line breaks for readability. End with a question to drive comments.
- youtube: A YouTube Shorts script (same energy as the Reel but slightly longer intro). Format as: HOOK / CONTENT / CTA. Max 150 words.
- caption: An Instagram caption (60-100 words). Engaging, conversational, ends with a CTA line. No hashtags.`;

  const raw = await ask(prompt, 1000, MODEL_FAST);

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      twitter   : `1/ ${hook}\n\n2/ ${body.substring(0, 200)}\n\n3/ ${cta}`,
      linkedin  : `${hook}\n\n${body}\n\n${cta}\n\nWhat do you think? Drop a comment below.`,
      youtube   : `HOOK: ${hook}\n\nCONTENT: ${body}\n\nCTA: ${cta}`,
      caption   : `${hook} ${body.substring(0, 100)}... ${cta}`,
    };
  }
};

// ─────────────────────────────────────────────────────────────────
// 11. COACH CHAT
// ─────────────────────────────────────────────────────────────────
const coachChat = async ({ message, history = [], userContext, language = 'en' }) => {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const statsStr = userContext
    ? `Creator stats: ${userContext.scriptsCount || 0} scripts created, avg hook score ${userContext.avgHookScore || 'N/A'}/100, current streak ${userContext.streak || 0} days, plan: ${userContext.plan || 'FREE'}${userContext.recentTopics && userContext.recentTopics.length > 0 ? `, recent topics: ${userContext.recentTopics.slice(0, 5).join(', ')}` : ''}.`
    : '';

  const onboardingStr = userContext?.onboardingContext
    ? ` ${userContext.onboardingContext}`
    : '';

  const contextStr = [statsStr, onboardingStr].filter(Boolean).join(' ') || 'No creator context available yet.';

  const langInstruction = getLangInstruction(language)
  const langSuffix = langInstruction ? ` ${langInstruction} Always respond in that language.` : ''

  const systemPrompt = `You are a sharp, expert content coach for Indian short-form video creators on Instagram Reels and YouTube Shorts. ${contextStr} Always tailor advice specifically to the creator's niche and goals when provided. Be direct, practical, and specific. No fluff, no generic advice. Give actionable tips they can use today. Keep replies under 200 words unless a longer explanation is genuinely needed.${langSuffix}`;

  // Keep last 10 messages of history
  const trimmedHistory = (history || []).slice(-10);

  const messages = [
    ...trimmedHistory.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  const response = await client.messages.create({
    model     : MODEL,
    max_tokens: 600,
    system    : systemPrompt,
    messages,
  });

  return { reply: response.content[0].text.trim() };
};

module.exports = {
  generateScript,
  scoreHook,
  rewriteHook,
  analyzePerformance,
  getTrendingTopics,
  generateWeeklyReport,
  translateContent,
  getRegionalGreeting,
  generateCaptions,
  remixContent,
  coachChat,
};
