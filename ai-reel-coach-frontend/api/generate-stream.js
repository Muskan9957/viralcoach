import Anthropic from '@anthropic-ai/sdk'

export const config = { runtime: 'edge' }

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

// Approx 130 words per minute of speaking
function durationToWords(duration) {
  const mins = parseFloat(duration)
  if (!mins || isNaN(mins)) return { min: 150, max: 225, label: '60-90 seconds' }
  const words = Math.round(mins * 130)
  return {
    min  : Math.max(80, Math.round(words * 0.9)),
    max  : Math.round(words * 1.1),
    label: `${mins} minute${mins !== 1 ? 's' : ''}`,
  }
}

function buildPrompt({ topic, niche, tone, language, voiceInstruction, duration }) {
  const lang   = LANG[language] || ''
  const voice  = voiceInstruction ? `\nVOICE STYLE (follow strictly):\n${voiceInstruction}` : ''
  const wc     = durationToWords(duration)

  return `You are an expert short-form content coach for viral Instagram Reels and YouTube Shorts.
${lang ? '\n' + lang + '\n' : ''}
Generate a high-performing short-form video script:
- Topic   : ${topic}
- Niche   : ${niche || 'general'}
- Tone    : ${tone  || 'conversational'}
- Duration: ${wc.label} (${wc.min}–${wc.max} spoken words)
${voice}

HOOK (first 3 seconds — stop the scroll):
[1-2 sentences. Curiosity, bold claim, or shocking statement.]

BODY (main value):
[Punchy points or mini story. Short sentences. No filler. Match the duration.]

CTA (last 5 seconds):
[One clear action: follow, comment, save, or share.]

Rules: Approx ${wc.min}–${wc.max} spoken words. Write like talking to a friend. No hashtags or emojis. Return only the script.

Script:`
}

export default async function handler(req) {
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
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

  if (!RAILWAY || !ANTHROPIC_KEY) {
    return new Response(JSON.stringify({ error: 'misconfigured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await req.json()
  const { topic, niche, tone, language = 'en', voiceInstruction, duration } = body

  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const send = async (data) => writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

  ;(async () => {
    try {
      // Stream from Anthropic immediately — no blocking quota check
      const client  = new Anthropic({ apiKey: ANTHROPIC_KEY })
      const wc      = durationToWords(duration)
      const maxTok  = Math.min(1200, Math.max(500, Math.round(wc.max * 1.5)))
      const prompt  = buildPrompt({ topic, niche, tone, language, voiceInstruction, duration })

      const stream = client.messages.stream({
        model     : 'claude-haiku-4-5-20251001',
        max_tokens: maxTok,
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

      // Parse sections
      const hook     = fullText.match(/HOOK[^:]*:\s*([\s\S]*?)(?=BODY|$)/i)?.[1]?.trim()  || ''
      const bodyText = fullText.match(/BODY[^:]*:\s*([\s\S]*?)(?=CTA|$)/i)?.[1]?.trim()   || ''
      const cta      = fullText.match(/CTA[^:]*:\s*([\s\S]*?)$/i)?.[1]?.trim()            || ''

      // Save to Railway (quota, streak, badges) — after streaming completes
      const saveRes  = await fetch(`${RAILWAY}/api/scripts/save`, {
        method : 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body   : JSON.stringify({ topic, niche, tone, language, hook, body: bodyText, cta, fullScript: fullText }),
      })

      if (!saveRes.ok) {
        const err = await saveRes.json().catch(() => ({}))
        // Quota exceeded — still show the script but warn
        await send({
          type : 'script',
          data : { topic, hook, body: bodyText, cta, fullScript: fullText },
          error: err.error || null,
        })
      } else {
        const saved = await saveRes.json()
        await send({
          type     : 'script',
          data     : { id: saved.id, topic, hook, body: bodyText, cta, fullScript: fullText },
          usage    : { used: saved.used, limit: saved.limit },
          newBadges: saved.newBadges,
        })
      }

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
