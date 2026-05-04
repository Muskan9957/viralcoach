import Anthropic from '@anthropic-ai/sdk'

export const config = { runtime: 'edge' }

// ─── Language instructions ────────────────────────────────────────
const LANG = {
  hi      : 'IMPORTANT: Write ALL content entirely in Hindi (Devanagari script).',
  hinglish: 'IMPORTANT: Write ALL content in Hinglish — natural Hindi+English mix, Roman script.',
  es      : 'IMPORTANT: Write ALL content entirely in Spanish.',
  fr      : 'IMPORTANT: Write ALL content entirely in French.',
  pt      : 'IMPORTANT: Write ALL content entirely in Portuguese (Brazilian).',
  de      : 'IMPORTANT: Write ALL content entirely in German.',
  ar      : 'IMPORTANT: Write ALL content entirely in Arabic.',
  id      : 'IMPORTANT: Write ALL content entirely in Bahasa Indonesia.',
  ja      : 'IMPORTANT: Write ALL content entirely in Japanese.',
  ko      : 'IMPORTANT: Write ALL content entirely in Korean.',
}

function buildPrompt({ topic, niche, tone, language, voiceInstruction }) {
  const lang  = LANG[language] || ''
  const voice = voiceInstruction ? `\nVOICE STYLE (follow strictly):\n${voiceInstruction}` : ''
  return `You are an expert short-form content coach for viral Instagram Reels and YouTube Shorts.
${lang ? '\n' + lang + '\n' : ''}
Generate a high-performing short-form video script:
- Topic: ${topic}
- Niche: ${niche || 'general'}
- Tone: ${tone || 'conversational'}
${voice}

HOOK (first 3 seconds — stop the scroll):
[1-2 sentences. Curiosity, bold claim, or shocking statement.]

BODY (main value):
[3-5 punchy points or mini story. Short sentences. No filler.]

CTA (last 5 seconds):
[One clear action: follow, comment, save, or share.]

Rules: 150-225 words total. Write like talking to a friend. No hashtags or emojis.

Script:`
}

// ─── Edge handler ─────────────────────────────────────────────────
export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    })
  }

  const RAILWAY = process.env.RAILWAY_API_URL
  if (!RAILWAY) {
    return new Response(JSON.stringify({ error: 'Server misconfigured: missing RAILWAY_API_URL' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await req.json()
  const { topic, niche, tone, language = 'en', voiceInstruction } = body

  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  const send = async (data) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
  }

  // Run everything async — response starts streaming immediately
  ;(async () => {
    try {
      // 1. Check quota on Railway (fast, no AI)
      const quotaRes = await fetch(`${RAILWAY}/api/scripts/check-quota`, {
        headers: { Authorization: authHeader },
      })

      if (!quotaRes.ok) {
        const err = await quotaRes.json().catch(() => ({}))
        await send({ type: 'error', message: err.error || 'Quota exceeded or session expired' })
        await writer.close()
        return
      }

      const { used, limit } = await quotaRes.json()

      // 2. Stream from Anthropic — words appear in browser instantly
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      const prompt = buildPrompt({ topic, niche, tone, language, voiceInstruction })

      const stream = client.messages.stream({
        model     : 'claude-haiku-4-5-20251001',
        max_tokens: 700,
        messages  : [{ role: 'user', content: prompt }],
      })

      let fullText = ''
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta?.type === 'text_delta' &&
          event.delta.text
        ) {
          fullText += event.delta.text
          await send({ type: 'chunk', text: event.delta.text })
        }
      }

      // 3. Parse sections
      const hook     = fullText.match(/HOOK[^:]*:\s*([\s\S]*?)(?=BODY|$)/i)?.[1]?.trim()     || ''
      const bodyText = fullText.match(/BODY[^:]*:\s*([\s\S]*?)(?=CTA|$)/i)?.[1]?.trim()      || ''
      const cta      = fullText.match(/CTA[^:]*:\s*([\s\S]*?)$/i)?.[1]?.trim()               || ''

      // 4. Save to Railway (quota decrement, streak, badges)
      const saveRes = await fetch(`${RAILWAY}/api/scripts/save`, {
        method : 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body   : JSON.stringify({ topic, niche, tone, language, hook, body: bodyText, cta, fullScript: fullText }),
      })

      const saveData = saveRes.ok ? await saveRes.json() : {}

      await send({
        type     : 'script',
        data     : { id: saveData.id, topic, hook, body: bodyText, cta, fullScript: fullText },
        usage    : { used: used + 1, limit },
        newBadges: saveData.newBadges,
      })

    } catch (err) {
      await send({ type: 'error', message: err.message || 'Generation failed' })
    }

    await writer.close()
  })()

  return new Response(readable, {
    headers: {
      'Content-Type'               : 'text/event-stream',
      'Cache-Control'              : 'no-cache',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
