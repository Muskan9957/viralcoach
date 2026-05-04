import { useState, useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { api } from '../api'
import { useToast } from '../components/Toast'
import { useLang } from '../i18n.jsx'
import { MicButton, SpeakButton } from '../components/VoiceAssistant'
import { usePrefs } from '../hooks/usePrefs'

import { detectAndSaveRegion, getSavedRegion, saveRegion, REGIONS } from '../utils/detectRegion'

const REFINE_CHIPS = [
  { label: '🔥 Stronger hook',       instruction: 'Make the hook much more scroll-stopping with higher emotional intensity and specificity.' },
  { label: '✂️ Make it shorter',     instruction: 'Make the entire script more concise — cut 30% of the words while keeping all the value.' },
  { label: '😂 Add humour',          instruction: 'Add clever humour and wit throughout — make it more entertaining and fun to watch.' },
  { label: '🎯 More specific',       instruction: 'Replace vague statements with concrete numbers, specific examples, and real details.' },
  { label: '😱 More FOMO',          instruction: 'Amplify fear of missing out — make the viewer feel they CANNOT afford to skip this.' },
  { label: '🇮🇳 More Indian feel',   instruction: 'Add more Indian cultural references, examples, and context relevant to Indian audiences.' },
  { label: '💡 Better CTA',         instruction: 'Rewrite the call-to-action to be more compelling, specific, and urgent.' },
  { label: '📖 More storytelling',  instruction: 'Reframe using personal story structure — make it feel more human and relatable.' },
]


const TONES  = ['motivational', 'educational', 'funny', 'storytelling', 'controversial', 'conversational']
const NICHES = ['fitness', 'finance', 'food', 'travel', 'tech', 'fashion', 'lifestyle', 'education', 'comedy', 'business']

const SCRIPT_LANGS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'de', label: 'German' },
  { value: 'ar', label: 'Arabic' },
  { value: 'id', label: 'Bahasa' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
]

const SCRIPT_LANG_KEY = 'arc_script_lang'
const getSavedScriptLang = () => localStorage.getItem(SCRIPT_LANG_KEY) || 'en'

const gradeColor = { A: '#00C9A7', B: '#00C9A7', C: '#FFD60A', D: '#FF9F43', F: '#FF6B6B' }
const gradeLabel = { A: 'Excellent', B: 'Good', C: 'Average', D: 'Weak', F: 'Poor' }

export default function Generate() {
  const toast      = useToast()
  const { t, lang } = useLang()
  const location   = useLocation()
  const resultRef  = useRef(null)
  const { primaryNiche } = usePrefs()

  const [form, setForm] = useState({
    topic:      '',
    niche:      primaryNiche,
    tone:       'motivational',
    duration:   '',
    audience:   getSavedRegion(),     // blank until detected or set by user
    scriptLang: getSavedScriptLang(), // script language — independent of app UI language
  })

  // Auto-detect region on first visit (runs once, only if nothing saved)
  useEffect(() => {
    if (!getSavedRegion()) {
      detectAndSaveRegion().then(region => {
        if (region) setForm(f => ({ ...f, audience: region }))
      })
    }
  }, [])
  const [loading, setLd]              = useState(false)
  const [streaming, setStreaming]     = useState(false)
  const [streamText, setStreamText]   = useState('')
  const [hookScoreLoading, setHookScoreLoading] = useState(false)
  const [result, setResult]           = useState(null)
  const [copied, setCopied]           = useState(false)
  const [micInterim, setMicInterim]   = useState('')
  const [voiceProfile, setVoiceProfile] = useState(null)

  // Load voice profile on mount — shows indicator when active
  useEffect(() => {
    api.getVoiceProfile()
      .then(data => { if (data.profile) setVoiceProfile(data.profile) })
      .catch(() => {})
  }, [])

  // Refinement / re-roll state
  const [versions, setVersions]       = useState([])
  const [activeVer, setActiveVer]     = useState(0)
  const [refining, setRefining]       = useState(false)
  const [rerolling, setRerolling]     = useState(false)
  const [rerollCount, setRerollCount] = useState(0)   // free retakes used (max 5 per topic)
  const MAX_RETAKES = 5
  const refineRef = useRef(null)

  useEffect(() => {
    const stateTopic = location.state?.topic
    if (stateTopic) {
      setForm(f => ({ ...f, topic: stateTopic }))
      window.history.replaceState({}, document.title)
    } else {
      const stored = localStorage.getItem('arc_prefill_topic')
      if (stored) {
        setForm(f => ({ ...f, topic: stored }))
        localStorage.removeItem('arc_prefill_topic')
      }
    }
  }, [location.state])

  // Auto-scroll to result when it arrives
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [result])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (!form.topic.trim()) { toast('Please enter a topic', 'error'); return }

    setLd(true)
    setStreaming(false)
    setStreamText('')
    setResult(null)
    setVersions([])
    setActiveVer(0)
    setRerollCount(0)
    setHookScoreLoading(false)

    try {
      saveRegion(form.audience)
      localStorage.setItem(SCRIPT_LANG_KEY, form.scriptLang)

      const voiceInstruction = voiceProfile?.promptInstruction || undefined

      // Try streaming — fall back to regular endpoint on any failure
      let res
      try {
        res = await api.generateStream({ ...form, language: form.scriptLang, voiceInstruction })
      } catch {
        res = null
      }

      if (!res || !res.ok || !res.body) {
        setStreaming(false)
        setLd(true)
        const data = await api.generate({ ...form, language: form.scriptLang })
        setResult(data)
        setVersions([{ ...data.script, label: 'v1 · Original' }])
        setActiveVer(0)
        setLd(false)
        return
      }

      setLd(false)
      setStreaming(true)

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let   buffer  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() // keep incomplete last chunk

        for (const part of parts) {
          const line = part.trim()
          if (!line.startsWith('data:')) continue
          try {
            const event = JSON.parse(line.slice(5).trim())

            if (event.type === 'chunk') {
              setStreamText(prev => prev + event.text)

            } else if (event.type === 'script') {
              setStreaming(false)
              setHookScoreLoading(true)
              const scriptData = { ...event.data, hookScore: null }
              setResult({ script: scriptData, usage: event.usage, newBadges: event.newBadges })
              setVersions([{ ...scriptData, label: 'v1 · Original' }])
              setActiveVer(0)

            } else if (event.type === 'hookScore') {
              setHookScoreLoading(false)
              setResult(prev => prev
                ? { ...prev, script: { ...prev.script, hookScore: event.data } }
                : prev
              )

            } else if (event.type === 'error') {
              throw new Error(event.message)
            }
          } catch (parseErr) {
            if (parseErr.message !== 'Unexpected end of JSON input') {
              toast(parseErr.message, 'error')
              setStreaming(false)
              setLd(false)
            }
          }
        }
      }
    } catch (err) {
      toast(err.message, 'error')
      setStreaming(false)
      setLd(false)
    }
  }

  // Re-roll — fresh script on same topic, FREE, capped at MAX_RETAKES per topic
  const reroll = async () => {
    if (!form.topic.trim()) return
    if (rerollCount >= MAX_RETAKES) {
      toast(`You've used all ${MAX_RETAKES} free retakes for this topic. Start a new topic to continue.`, 'error')
      return
    }
    setRerolling(true)
    try {
      const data = await api.retakeScript({ ...form, language: form.scriptLang })
      const n = versions.length + 1
      const newVer = { ...data.script, label: `Take ${n}` }
      setVersions(prev => [newVer, ...prev])
      setActiveVer(0)
      setResult(prev => ({ ...prev, script: data.script }))
      setRerollCount(c => c + 1)
      setTimeout(() => refineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setRerolling(false)
    }
  }

  // Refine — targeted chip tweak, no quota cost
  const refine = async (instruction) => {
    if (!instruction || !result?.script) return
    setRefining(true)
    try {
      const current = versions[activeVer] || result.script
      const data = await api.refineScript({
        hook       : current.hook,
        body       : current.body,
        cta        : current.cta,
        instruction,
        language   : form.scriptLang,
        audience   : form.audience,
        topic      : form.topic,
      })
      const chipLabel = instruction.length > 30 ? instruction.slice(0, 30) + '…' : instruction
      const newVer = { ...data.script, label: `Take ${versions.length + 1} · ${chipLabel}` }
      setVersions(prev => [newVer, ...prev])
      setActiveVer(0)
      setResult(prev => ({ ...prev, script: data.script }))
      setTimeout(() => refineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setRefining(false)
    }
  }

  const switchVersion = (idx) => {
    setActiveVer(idx)
    setResult(prev => ({ ...prev, script: versions[idx] }))
  }

  const copyScript = () => {
    if (!result?.script?.fullScript) return
    navigator.clipboard.writeText(result.script.fullScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast('Copied!', 'success')
  }

  const hookScore = result?.script?.hookScore
  const grade = hookScore ? (hookScore.score >= 90 ? 'A' : hookScore.score >= 75 ? 'B' : hookScore.score >= 60 ? 'C' : hookScore.score >= 50 ? 'D' : 'F') : null
  const color = grade ? gradeColor[grade] : '#00C9A7'

  return (
    <div className="page-enter" style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>{t('generate_title')}</h1>
          <Link to="/scripts" style={{ fontSize: '0.8rem', color: 'var(--text-faint)', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {t('generate_view_history')}
          </Link>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: 6 }}>
          {t('generate_speak')}
        </p>
      </div>

      {/* Form Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Topic — most important field, big and prominent */}
          <div className="field">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t('generate_topic_label')}
              </label>
              <span style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: form.topic.length > 900 ? '#FF6B6B' : form.topic.length > 700 ? 'var(--yellow)' : 'var(--text-faint)',
                transition: 'color 0.2s',
              }}>
                {form.topic.length}/1000
              </span>
            </div>
            {/* Language select */}
            <div style={{ marginBottom: 8 }}>
              <select
                value={form.scriptLang}
                onChange={set('scriptLang')}
                title="Script language"
                className="select"
                style={{ width: 140, fontSize: '0.82rem', height: 34 }}
              >
                {SCRIPT_LANGS.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Textarea + mic side by side — mic stays small, textarea gets full width */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <textarea
                className="textarea"
                placeholder="e.g. How I grew from 0 to 10k followers in 90 days"
                value={micInterim || form.topic}
                onChange={e => {
                  // Typing always clears interim + updates form — never blocked
                  setMicInterim('')
                  setForm(f => ({ ...f, topic: e.target.value }))
                }}
                rows={3}
                required
                maxLength={1000}
                style={{
                  flex: 1, minWidth: 0, resize: 'vertical', fontSize: '1rem',
                  opacity: micInterim ? 0.75 : 1,
                  fontStyle: micInterim ? 'italic' : 'normal',
                  transition: 'opacity 0.15s, font-style 0s',
                }}
              />
              <MicButton
                onResult={text => setForm(f => ({ ...f, topic: text.slice(0, 1000) }))}
                onInterim={text => setMicInterim(text.slice(0, 1000))}
                lang={form.scriptLang}
                style={{ marginTop: 4 }}
              />
            </div>
          </div>

          {/* Row 1 — Niche + Tone + Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="field">
              <label style={fieldLabelStyle}>Niche</label>
              <select className="select" value={form.niche} onChange={set('niche')}>
                <option value="">General</option>
                {NICHES.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
              </select>
            </div>
            <div className="field">
              <label style={fieldLabelStyle}>Tone</label>
              <select className="select" value={form.tone} onChange={set('tone')}>
                {TONES.map(tone => <option key={tone} value={tone}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</option>)}
              </select>
            </div>
            <div className="field">
              <label style={fieldLabelStyle}>Duration (min)</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. 2.5"
                value={form.duration}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                  setForm(f => ({ ...f, duration: val }))
                }}
                maxLength={5}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Row 2 — Target Region (full width) */}
          <div className="field">
            <label style={{ ...fieldLabelStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
              Target Region
              {form.audience && (
                <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '1px 6px', borderRadius: 99, textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>
                  📍 auto
                </span>
              )}
            </label>
            <select className="select" value={form.audience} onChange={set('audience')}>
              <option value="">— Select region —</option>
              {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          {/* Voice profile active indicator */}
          {voiceProfile && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 14px', borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(0,200,255,0.07), rgba(160,110,255,0.07))',
              border: '1px solid rgba(0,200,255,0.2)',
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>🎙</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00C8FF' }}>
                  ✦ Writing with your Creator DNA
                </span>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {voiceProfile.summary}
                </p>
              </div>
              <a href="/my-voice" style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textDecoration: 'none', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                edit →
              </a>
            </div>
          )}

          {/* Button area — transforms once a result exists */}
          {!result ? (
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ height: 52, fontSize: '1rem', fontWeight: 700, letterSpacing: '0.02em' }}
            >
              {loading
                ? <><span className="spinner" /> {t('generate_writing')}</>
                : `✦ ${t('generate_btn')}`}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              {/* Primary: try another take on current settings */}
              <button
                type="button"
                onClick={reroll}
                disabled={rerolling || refining || rerollCount >= MAX_RETAKES}
                className="btn btn-primary"
                style={{ flex: 1, height: 52, fontSize: '0.95rem', fontWeight: 700 }}
              >
                {rerolling
                  ? <><span className="spinner" /> Generating…</>
                  : rerollCount >= MAX_RETAKES
                    ? '↺ No retakes left'
                    : <>↺ Try another take <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.65 }}>({MAX_RETAKES - rerollCount} left)</span></>}
              </button>
              {/* Secondary: clear and start a new topic */}
              <button
                type="button"
                onClick={() => { setResult(null); setVersions([]); setActiveVer(0); setRerollCount(0); setForm({ topic: '', niche: primaryNiche, tone: 'motivational', audience: getSavedRegion(), scriptLang: getSavedScriptLang() }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="btn btn-ghost"
                style={{ height: 52, paddingInline: 20, fontSize: '0.9rem', whiteSpace: 'nowrap' }}
              >
                New topic
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Initial loading — waiting for first chunk */}
      {loading && (
        <div className="card" style={{
          textAlign: 'center', padding: '48px 24px',
          background: 'linear-gradient(135deg, rgba(255,95,31,0.05), rgba(255,60,172,0.05))',
          border: '1px solid rgba(255,95,31,0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: 'var(--accent)',
                animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
            {t('generate_ai_writing')}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('generate_crafting')}</p>
        </div>
      )}

      {/* Live streaming text */}
      {streaming && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(255,95,31,0.04), rgba(160,110,255,0.04))',
          border: '1px solid rgba(160,110,255,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: `pulse 1s ease ${i * 0.18}s infinite`,
                }} />
              ))}
            </div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Writing your script…
            </span>
          </div>
          <pre style={{
            fontFamily: 'var(--font-body, inherit)',
            fontSize: '0.93rem',
            lineHeight: 1.75,
            color: 'var(--text)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
          }}>
            {streamText}
            <span style={{
              display: 'inline-block', width: 2, height: '1em',
              background: 'var(--accent)', marginLeft: 2, verticalAlign: 'text-bottom',
              animation: 'cursorBlink 0.9s step-end infinite',
            }} />
          </pre>
        </div>
      )}

      {/* Result — full width, auto-scrolled to */}
      {result && (
        <div ref={resultRef} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Hook Score — loading pill while scoring in background */}
          {hookScoreLoading && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 18px', borderRadius: 'var(--radius-lg)',
              background: 'var(--surface2)', border: '1px solid var(--border)',
            }}>
              <span className="spinner" style={{ width: 14, height: 14, flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
                Scoring your hook…
              </span>
            </div>
          )}

          {/* Hook Score Banner */}
          {hookScore && (
            <>
            <div style={{
              background: `linear-gradient(135deg, ${color}18, transparent)`,
              border: `1px solid ${color}40`,
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              flexWrap: 'wrap',
            }}>
              {/* Big score */}
              <div style={{ textAlign: 'center', minWidth: 70 }}>
                <div style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '3rem',
                  fontWeight: 900,
                  color,
                  lineHeight: 1,
                  textShadow: `0 0 30px ${color}60`,
                }}>
                  {hookScore.score}
                  <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-faint)', opacity: 0.6 }}>/100</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
                  {t('generate_score_label')}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color,
                  }}>Grade {grade} — {gradeLabel[grade]}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: `${color}22`,
                    color,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                  }}>{hookScore.status}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {hookScore.reasons?.slice(0, 2).map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 7 }} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contextual hook improvement CTA */}
            <div style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: `1px solid ${color}25`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                {hookScore.score < 80
                  ? 'Hook can be stronger — test alternatives'
                  : 'Great hook! Want to test a variant?'}
              </span>
              <Link
                to="/score"
                state={{ hook: result.script.hook }}
                style={{
                  fontSize: '0.8rem', fontWeight: 700,
                  color,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '5px 14px', borderRadius: 20,
                  background: `${color}15`,
                  border: `1px solid ${color}35`,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                }}
              >
                {hookScore.score < 80 ? '⚡ Improve hook →' : '↺ Try a variant →'}
              </Link>
            </div>
            </>
          )}

          {/* Script Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.15rem', margin: 0 }}>
                    {t('generate_your_script')}
                  </h2>
                  <span style={{
                    fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
                    padding: '2px 8px', borderRadius: 99, letterSpacing: '0.06em',
                    background: 'linear-gradient(135deg, rgba(255,180,0,0.15), rgba(255,95,31,0.15))',
                    border: '1px solid rgba(255,160,0,0.3)', color: '#FFB800',
                  }}>⚡ Viral edited</span>
                </div>
                {result.script?.viralEditNote && (
                  <p style={{ color: 'var(--text-faint)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', margin: '2px 0 0', fontStyle: 'italic' }}>
                    {result.script.viralEditNote}
                  </p>
                )}
                <p style={{ color: 'var(--text-faint)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                  {form.topic}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <SpeakButton text={result.script?.fullScript} />
                <button onClick={copyScript} className="btn btn-ghost btn-sm">
                  {copied ? `✓ ${t('generate_copied')}` : t('generate_copy_all')}
                </button>
              </div>
            </div>

            {/* duration banner removed — user picks duration in form */}
            {false && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 16px', borderRadius: 10, marginBottom: 20,
                background: 'rgba(0,200,255,0.07)',
                border: '1px solid rgba(0,200,255,0.2)',
              }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: 1 }}>⏱</span>
                <div>
                  <span style={{
                    fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: '#00C8FF', display: 'block', marginBottom: 3,
                  }}>
                    Ideal Reel Length
                  </span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5 }}>
                    {result.script.idealDuration}
                  </span>
                </div>
              </div>
            )}

            {/* Hook */}
            <div style={sectionStyle('#00C8FF')}>
              <div style={labelStyle}>🎣 {t('generate_hook').toUpperCase()} — {form.scriptLang === 'hi' ? 'पहले 3 सेकंड' : 'First 3 seconds'}</div>
              <p style={scriptTextStyle}>{result.script.hook}</p>
            </div>

            {/* Body */}
            <div style={sectionStyle('#00C9A7')}>
              <div style={labelStyle}>📖 {t('generate_body').toUpperCase()} — {form.scriptLang === 'hi' ? 'मुख्य मूल्य' : 'Main value'}</div>
              <p style={{ ...scriptTextStyle, whiteSpace: 'pre-line' }}>{result.script.body}</p>
            </div>

            {/* CTA */}
            <div style={sectionStyle('#FFD60A')}>
              <div style={labelStyle}>📣 {t('generate_cta').toUpperCase()}</div>
              <p style={scriptTextStyle}>{result.script.cta}</p>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                {result.usage?.used}/{result.usage?.limit} {t('generate_usage')}
              </span>
              {result.newBadges?.length > 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--yellow)', fontWeight: 600 }}>
                  {t('generate_new_badge')}
                </span>
              )}
            </div>
          </div>

          {/* ── Visual Direction ─────────────────────────────────── */}
          {result.script?.visual && (
            <div className="card" style={{ borderLeft: '3px solid #A78BFA' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: '1.1rem' }}>🎬</span>
                <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1rem', margin: 0 }}>Visual Direction</h3>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', background: 'var(--surface2)', padding: '2px 8px', borderRadius: 99 }}>shoot guide</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Background */}
                <div>
                  <div style={visualLabelStyle}>📍 Background</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>{result.script.visual.background}</p>
                </div>
                {/* Style */}
                <div>
                  <div style={visualLabelStyle}>🎥 Shooting Style</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text)', margin: 0 }}>{result.script.visual.style}</p>
                </div>
                {/* B-roll */}
                {result.script.visual.broll?.length > 0 && (
                  <div>
                    <div style={visualLabelStyle}>🎞 B-Roll Ideas</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                      {result.script.visual.broll.map((shot, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ color: '#A78BFA', fontWeight: 700, flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginTop: 2 }}>{i + 1}.</span>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{shot}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Color + Text overlay in a row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={visualLabelStyle}>🎨 Colour Mood</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{result.script.visual.colorMood}</p>
                  </div>
                  <div>
                    <div style={visualLabelStyle}>✍️ Text Overlay</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{result.script.visual.textOverlay}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Music Vibe ───────────────────────────────────────── */}
          {result.script?.music && (
            <div className="card" style={{ borderLeft: '3px solid #34D399' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: '1.1rem' }}>🎵</span>
                <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1rem', margin: 0 }}>Music Vibe</h3>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', background: 'var(--surface2)', padding: '2px 8px', borderRadius: 99 }}>background score</span>
              </div>
              {/* Genre / Mood / BPM chips */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                {[
                  { icon: '🎸', label: result.script.music.genre },
                  { icon: '💫', label: result.script.music.mood },
                  { icon: '⚡', label: `${result.script.music.bpm} BPM` },
                ].map(chip => (
                  <span key={chip.label} style={{
                    padding: '5px 12px', borderRadius: 20,
                    fontSize: '0.8rem', fontWeight: 600,
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                  }}>
                    {chip.icon} {chip.label}
                  </span>
                ))}
              </div>
              {/* Search tip */}
              <div style={{ marginBottom: 14 }}>
                <div style={visualLabelStyle}>🔍 Search for</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text)', margin: '4px 0 0', fontStyle: 'italic', background: 'var(--surface2)', padding: '8px 12px', borderRadius: 8 }}>
                  "{result.script.music.searchQuery}"
                </p>
              </div>
              {/* Tip */}
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
                💡 {result.script.music.tip}
              </div>
              {/* Free music source links */}
              <div>
                <div style={visualLabelStyle}>🆓 Free Music Sources</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {[
                    { name: 'Pixabay Music', url: 'https://pixabay.com/music/' },
                    { name: 'Mixkit', url: 'https://mixkit.co/free-stock-music/' },
                    { name: 'Uppbeat', url: 'https://uppbeat.io/' },
                    { name: 'YouTube Audio Library', url: 'https://studio.youtube.com/channel/audio' },
                  ].map(src => (
                    <a
                      key={src.name}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '5px 12px', borderRadius: 20,
                        fontSize: '0.78rem', fontWeight: 600,
                        background: 'rgba(52,211,153,0.1)',
                        border: '1px solid rgba(52,211,153,0.3)',
                        color: '#34D399',
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      {src.name} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Tweak chips + version history ────────────────────── */}
          <div ref={refineRef} style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>tweak this take</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* Refine chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {REFINE_CHIPS.map(chip => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => refine(chip.instruction)}
                  disabled={refining || rerolling}
                  style={{
                    padding: '7px 15px',
                    borderRadius: 20,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid var(--border)',
                    background: 'var(--surface2)',
                    color: 'var(--text-muted)',
                    cursor: (refining || rerolling) ? 'not-allowed' : 'pointer',
                    opacity: (refining || rerolling) ? 0.45 : 1,
                    transition: 'border-color 0.15s, color 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!refining && !rerolling) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  {refining ? <><span className="spinner" style={{ width: 10, height: 10 }} /></> : null}
                  {chip.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', marginTop: -8 }}>
              Tweaks don't use your generation quota
            </div>

            {/* Row 3 — Version history (only when multiple takes exist) */}
            {versions.length > 1 && (
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  Your takes
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {versions.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => switchVersion(i)}
                      style={{
                        padding: '5px 14px',
                        borderRadius: 20,
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        border: `1px solid ${i === activeVer ? 'var(--accent)' : 'var(--border)'}`,
                        background: i === activeVer ? 'var(--accent-dim)' : 'transparent',
                        color: i === activeVer ? 'var(--accent)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const visualLabelStyle = {
  fontSize: '0.68rem',
  fontFamily: 'var(--font-mono)',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--text-faint)',
  marginBottom: 4,
}

const fieldLabelStyle = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

const sectionStyle = (accentColor) => ({
  marginBottom: 20,
  padding: '16px 20px',
  borderRadius: 12,
  background: 'var(--surface2)',
  borderLeft: `3px solid ${accentColor}`,
})

const labelStyle = {
  fontSize: '0.7rem',
  fontFamily: 'var(--font-mono)',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--text-faint)',
  marginBottom: 10,
}

const scriptTextStyle = {
  fontSize: '0.975rem',
  lineHeight: 1.75,
  color: 'var(--text)',
  margin: 0,
}
