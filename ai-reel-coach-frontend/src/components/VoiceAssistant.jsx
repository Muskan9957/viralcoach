import { useState, useRef } from 'react'
import { useLang } from '../i18n.jsx'

// Language codes for Web Speech API
const LANG_CODES = {
  en:       'en-US',
  es:       'es-ES',
  fr:       'fr-FR',
  pt:       'pt-BR',
  de:       'de-DE',
  ar:       'ar-SA',
  id:       'id-ID',
  ja:       'ja-JP',
  ko:       'ko-KR',
  hi:       'hi-IN',
}

// ─── Pick the best available voice ────────────────────────────────
let cachedVoice = {}

function getBestVoice(langCode) {
  if (cachedVoice[langCode]) return cachedVoice[langCode]

  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  const matching = voices.filter(v =>
    v.lang === langCode || v.lang.startsWith(langCode.split('-')[0])
  )
  if (!matching.length) return null

  const google    = matching.find(v => v.name.includes('Google'))
  if (google) { cachedVoice[langCode] = google; return google }

  const microsoft = matching.find(v => v.name.includes('Microsoft'))
  if (microsoft) { cachedVoice[langCode] = microsoft; return microsoft }

  const female    = matching.find(v =>
    /female|zira|heera|swara|priya|aditi|raveena/i.test(v.name)
  )
  if (female) { cachedVoice[langCode] = female; return female }

  cachedVoice[langCode] = matching[0]
  return matching[0]
}

// Reset cache when new voices load
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    cachedVoice = {}
  })
}

// ─── Split text into small chunks Chrome can handle reliably ───────
// Chrome's speechSynthesis breaks on long strings (>~200 chars).
// We split at sentence boundaries and keep chunks short.
function chunkText(text) {
  // Split on sentence-ending punctuation including Hindi दण्ड ।
  const sentences = text
    .replace(/([.!?।\n]+)\s*/g, '$1|||')
    .split('|||')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  const chunks = []
  for (const sentence of sentences) {
    if (sentence.length <= 180) {
      chunks.push(sentence)
    } else {
      // Further split long sentences on commas / semicolons
      const parts = sentence.split(/[,;]\s*/)
      let current = ''
      for (const part of parts) {
        if (current && (current + ', ' + part).length > 180) {
          chunks.push(current.trim())
          current = part
        } else {
          current = current ? current + ', ' + part : part
        }
      }
      if (current.trim()) chunks.push(current.trim())
    }
  }
  return chunks.filter(c => c.length > 0)
}

// ─── Text to Speech — chunked queue approach ─────────────────────
// Fixes Chrome's ~15s cutoff and lag by speaking one sentence at a time.
export function useTextToSpeech() {
  const { lang }       = useLang()
  const [speaking, setSpeaking] = useState(false)
  const cancelledRef   = useRef(false)
  const chunksRef      = useRef([])
  const indexRef       = useRef(0)

  const speakNextChunk = (langCode) => {
    if (cancelledRef.current || indexRef.current >= chunksRef.current.length) {
      setSpeaking(false)
      return
    }

    const text    = chunksRef.current[indexRef.current]
    const voice   = getBestVoice(langCode)
    const utt     = new SpeechSynthesisUtterance(text)

    utt.lang   = langCode
    utt.rate   = 1.0
    utt.pitch  = 1.05
    utt.volume = 1
    if (voice) utt.voice = voice

    utt.onend = () => {
      if (!cancelledRef.current) {
        indexRef.current++
        speakNextChunk(langCode)
      }
    }

    utt.onerror = (e) => {
      // 'interrupted' fires when we cancel intentionally — ignore it
      if (e.error === 'interrupted' || e.error === 'canceled') return
      setSpeaking(false)
    }

    window.speechSynthesis.speak(utt)
  }

  const speak = (text) => {
    if (!('speechSynthesis' in window) || !text?.trim()) return

    // Cancel any ongoing speech
    cancelledRef.current = true
    window.speechSynthesis.cancel()

    const langCode = LANG_CODES[lang] || 'en-IN'
    const chunks   = chunkText(text)
    if (!chunks.length) return

    chunksRef.current = chunks
    indexRef.current  = 0
    cancelledRef.current = false
    setSpeaking(true)

    // Chrome loads voices asynchronously — wait if needed
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener(
        'voiceschanged',
        () => speakNextChunk(langCode),
        { once: true }
      )
    } else {
      // Small delay ensures cancel() has fully cleared before we start
      setTimeout(() => speakNextChunk(langCode), 80)
    }
  }

  const stopSpeaking = () => {
    cancelledRef.current = true
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  return { speaking, speak, stopSpeaking }
}

// ─── Speech to Text ───────────────────────────────────────────────
// Uses continuous:true so Chrome never hard-cuts mid-sentence.
// Auto-submits after SILENCE_MS of no new words.
// Stop button submits immediately.
const SILENCE_MS = 2500

export function useSpeechToText(onResult) {
  const { lang } = useLang()
  const [listening, setListening]     = useState(false)
  const [interimText, setInterimText] = useState('')
  const recognitionRef  = useRef(null)
  const finalRef        = useRef('')
  const stoppedRef      = useRef(false)
  const flushedRef      = useRef(false)
  const silenceTimer    = useRef(null)
  const SR_ref          = useRef(null)
  const langRef         = useRef('en-IN')
  const onResultRef     = useRef(onResult)
  // Track highest result index already committed — prevents Chrome from
  // re-delivering old final results (e.resultIndex can be 0 for old items)
  const lastFinalIdxRef = useRef(-1)
  onResultRef.current   = onResult

  const clearSilenceTimer = () => {
    if (silenceTimer.current) { clearTimeout(silenceTimer.current); silenceTimer.current = null }
  }

  const flush = () => {
    if (flushedRef.current) return
    flushedRef.current = true
    clearSilenceTimer()
    stoppedRef.current = true
    try { recognitionRef.current?.stop() } catch {}
    setListening(false)
    setInterimText('')
    const text = finalRef.current.trim()
    finalRef.current = ''
    if (text) onResultRef.current(text)
  }

  const armSilenceTimer = () => {
    clearSilenceTimer()
    silenceTimer.current = setTimeout(flush, SILENCE_MS)
  }

  const startSession = () => {
    if (stoppedRef.current || !SR_ref.current) return
    // Reset per-session index so each new recognition instance starts clean
    lastFinalIdxRef.current = -1

    const recognition           = new SR_ref.current()
    recognition.lang            = langRef.current
    recognition.interimResults  = true
    recognition.maxAlternatives = 1
    recognition.continuous      = true   // holds the mic open; Chrome never cuts mid-sentence

    recognition.onresult = (e) => {
      let interim = '', newFinal = ''

      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          // FIX 1: Only process a final result if its index is strictly newer
          // than the last one we committed. Chrome sometimes fires resultIndex=0
          // for events that include already-finalized earlier results.
          if (i > lastFinalIdxRef.current) {
            newFinal += e.results[i][0].transcript
            lastFinalIdxRef.current = i
          }
        } else {
          interim += e.results[i][0].transcript
        }
      }

      if (newFinal) {
        const trimmed  = newFinal.trim()
        const existing = finalRef.current
        // FIX 2: Cross-session guard — Chrome sometimes replays the last phrase
        // when a session restarts. Skip if it's identical to what we just appended.
        if (trimmed && !existing.endsWith(trimmed)) {
          finalRef.current = (existing + (existing ? ' ' : '') + trimmed).trim()
        }
      }

      // Reset timer on ANY speech activity
      if (newFinal || interim) armSilenceTimer()
      setInterimText(interim || finalRef.current)
    }

    recognition.onend = () => {
      // Only fires if Chrome times out (~60s) or we called stop()
      if (stoppedRef.current) { flush(); return }
      // Chrome timed out — restart transparently, silence timer still running
      setTimeout(startSession, 80)
    }

    recognition.onerror = (e) => {
      if (e.error === 'not-allowed') {
        alert('Microphone permission denied.')
        stoppedRef.current = true
        setListening(false); setInterimText('')
        clearSilenceTimer()
        return
      }
      if (e.error === 'aborted' || e.error === 'interrupted') return
      if (!stoppedRef.current) setTimeout(startSession, 200)
    }

    recognitionRef.current = recognition
    try { recognition.start() } catch {}
  }

  const startListening = async () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Speech recognition requires Chrome or Edge browser.'); return }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(t => t.stop())
    } catch {
      alert('Microphone access denied. Please allow mic in browser settings.')
      return
    }

    try { recognitionRef.current?.abort() } catch {}
    clearSilenceTimer()

    SR_ref.current     = SR
    langRef.current    = LANG_CODES[lang] || 'en-IN'
    finalRef.current   = ''
    stoppedRef.current = false
    flushedRef.current = false
    setListening(true)
    setInterimText('')
    startSession()
  }

  const stopListening = flush

  return { listening, interimText, startListening, stopListening }
}

// ─── Mic Button ───────────────────────────────────────────────────
export function MicButton({ onResult, style = {} }) {
  const { t } = useLang()
  const { listening, interimText, startListening, stopListening } = useSpeechToText(onResult)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
      <button
        type="button"
        onClick={listening ? stopListening : startListening}
        title={listening ? t('voice_listening') : t('voice_speak')}
        style={{
          width: 40, height: 40, borderRadius: '50%',
          border: listening ? '2px solid var(--accent)' : '1px solid var(--border)',
          background: listening ? 'var(--accent-dim)' : 'var(--surface2)',
          color: listening ? 'var(--accent)' : 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
          animation: listening ? 'pulseGlow 1s ease infinite' : 'none',
          transition: 'all 0.2s',
          ...style,
        }}
      >
        {listening ? '⏹' : '🎙'}
      </button>
      {listening && (
        <span style={{
          fontSize: '0.62rem',
          color: interimText ? 'var(--text-muted)' : 'var(--accent)',
          fontFamily: 'var(--font-mono)',
          maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', textAlign: 'center',
        }}>
          {interimText || t('voice_listening')}
        </span>
      )}
    </div>
  )
}

// ─── Speaker Button ───────────────────────────────────────────────
export function SpeakButton({ text, style = {} }) {
  const { speaking, speak, stopSpeaking } = useTextToSpeech()
  if (!text) return null
  return (
    <button
      type="button"
      onClick={speaking ? stopSpeaking : () => speak(text)}
      title={speaking ? 'Stop' : 'Read aloud'}
      style={{
        padding: '6px 14px', borderRadius: 8,
        border: '1px solid var(--border)',
        background: speaking ? 'var(--accent-dim)' : 'var(--surface2)',
        color: speaking ? 'var(--accent)' : 'var(--text-muted)',
        cursor: 'pointer', fontSize: '0.8rem',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {speaking ? '⏹ Stop' : '🔊 Read Aloud'}
    </button>
  )
}
