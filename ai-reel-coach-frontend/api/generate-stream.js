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

function parseScript(fullText) {
  // Strip markdown bold/italic that models sometimes add
  const text = fullText.replace(/\*\*/g, '').replace(/\*/g, '')

  const hookIdx = text.search(/\bHOOK\s*[:(]/i)
  const bodyIdx = text.search(/\bBODY\s*[:(]/i)
  const ctaIdx  = text.search(/\bCTA\s*[:(]/i)

  let hook = '', body = '', cta = ''

  if (hookIdx !== -1) {
    const end = bodyIdx !== -1 ? bodyIdx : (ctaIdx !== -1 ? ctaIdx : text.length)
    hook = text.slice(hookIdx, end).replace(/^HOOK[^:\n]*[:\n]\s*/i, '').trim()
  }
  if (bodyIdx !== -1) {
    const end = ctaIdx !== -1 ? ctaIdx : text.length
    body = text.slice(bodyIdx, end).replace(/^BODY[^:\n]*[:\n]\s*/i, '').trim()
  }
  if (ctaIdx !== -1) {
    cta = text.slice(ctaIdx).replace(/^CTA[^:\n]*[:\n]\s*/i, '').trim()
  }

  // Last-resort fallback: if none parsed, dump everything into body
  if (!hook && !body && !cta) body = fullText.trim()

  return { hook, body, cta }
}

function buildPrompt({ topic, niche, tone, language, voiceInstruction, duration }) {
  const lang   = LANG[language] || ''
  const voice  = voiceInstruction ? `\nVOICE STYLE (follow strictly):\n${voiceInstruction}` : ''
  const wc     = durationToWords(duration)

  return `You are an expert short-form content coach for viral Instagram Reels and YouTube Shorts.
${lang ? '\n' + lang + '\n' : ''}
Write a short-form video script with EXACTLY these three sections labelled HOOK:, BODY:, and CTA:

Topic   : ${topic}
Niche   : ${niche || 'general'}
Tone    : ${tone  || 'conversational'}
Duration: ${wc.label} (${wc.min}–${wc.max} spoken words)
${voice}

HOOK:
[1-2 sentences. First 3 seconds. Curiosity, bold claim, or shocking statement that stops the scroll.]

BODY:
[Punchy points or mini story. Short sentences. No filler. Match the duration target.]

CTA:
[One clear action for the last 5 seconds: follow, comment, save, or share.]

Important: keep the labels HOOK:, BODY:, and CTA: exactly as shown. ${wc.min}–${wc.max} spoken words total. Write like talking to a friend. No hashtags, no emojis.`
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
      const { hook, body: bodyText, cta } = parseScript(fullText)

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
