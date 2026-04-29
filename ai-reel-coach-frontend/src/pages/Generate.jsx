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
  { value: 'en', label: '🇬🇧 English' },
  { value: 'hi', label: '🇮🇳 Hindi' },
  { value: 'es', label: '🇪🇸 Spanish' },
  { value: 'fr', label: '🇫🇷 French' },
  { value: 'pt', label: '🇧🇷 Portuguese' },
  { value: 'de', label: '🇩🇪 German' },
  { value: 'ar', label: '🇦🇪 Arabic' },
  { value: 'id', label: '🇮🇩 Bahasa' },
  { value: 'ja', label: '🇯🇵 Japanese' },
  { value: 'ko', label: '🇰🇷 Korean' },
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
  const [loading, setLd]        = useState(false)
  const [result, setResult]     = useState(null)
  const [copied, setCopied]     = useState(false)

  // Refinement state
  const [versions, setVersions]         = useState([])       // history of all versions
  const [activeVer, setActiveVer]       = useState(0)        // index into versions (0 = latest)
  const [refineInput, setRefineInput]   = useState('')
  const [refining, setRefining]         = useState(false)
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
    setResult(null)
    setVersions([])
    setActiveVer(0)
    setRefineInput('')
    try {
      saveRegion(form.audience)
      localStorage.setItem(SCRIPT_LANG_KEY, form.scriptLang)
      const data = await api.generate({ ...form, language: form.scriptLang })
      setResult(data)
      // Seed version history with v1
      setVersions([{ ...data.script, label: 'v1 · Original' }])
      setActiveVer(0)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLd(false)
    }
  }

  const refine = async (customInstruction) => {
    const instruction = customInstruction || refineInput.trim()
    if (!instruction) { toast('Tell me what to change', 'error'); return }
    if (!result?.script) return
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
      const newVer = {
        ...data.script,
        label: `v${versions.length + 1} · ${instruction.slice(0, 28)}${instruction.length > 28 ? '…' : ''}`,
      }
      const newVersions = [newVer, ...versions]
      setVersions(newVersions)
      setActiveVer(0)
      setResult(prev => ({ ...prev, script: data.script }))
      setRefineInput('')
      setTimeout(() => refineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setRefining(false)
    }
  }

  const switchVersion = (idx) => {
    const ver = versions[idx]
    setActiveVer(idx)
    setResult(prev => ({
      ...prev,
      script: { ...ver, hookScore: prev.script.hookScore },
    }))
  }

  const copyScript = () => {
    if (!result?.script?.fullScript) return
    navigator.clipboard.writeText(result.script.fullScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast('Copied!', 'success')
  }

  const hookScore = versions[activeVer]?.hookScore || result?.script?.hookScore
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
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <textarea
                className="textarea"
                placeholder="e.g. How I grew from 0 to 10k followers in 90 days"
                value={form.topic}
                onChange={set('topic')}
                rows={3}
                required
                maxLength={1000}
                style={{ flex: 1, resize: 'vertical', fontSize: '1rem' }}
              />
              <MicButton
                onResult={text => setForm(f => ({ ...f, topic: text }))}
                style={{ marginTop: 4, flexShrink: 0 }}
              />
            </div>
          </div>

          {/* Niche + Tone + Region + Script Language */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(148px, 1fr))', gap: 16 }}>
            <div className="field">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Niche</label>
              <select className="select" value={form.niche} onChange={set('niche')}>
                <option value="">General</option>
                {NICHES.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
              </select>
            </div>
            <div className="field">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tone</label>
              <select className="select" value={form.tone} onChange={set('tone')}>
                {TONES.map(tone => <option key={tone} value={tone}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</option>)}
              </select>
            </div>
            <div className="field">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                Target Region
                {form.audience && (
                  <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '1px 7px', borderRadius: 99, textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>
                    📍 auto
                  </span>
                )}
              </label>
              <select className="select" value={form.audience} onChange={set('audience')}>
                <option value="">— Select region —</option>
                {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="field">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Script Language
              </label>
              <select className="select" value={form.scriptLang} onChange={set('scriptLang')}>
                {SCRIPT_LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>

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
        </form>
      </div>

      {/* Loading State — prominent, in the flow */}
      {loading && (
        <div className="card" style={{
          textAlign: 'center',
          padding: '48px 24px',
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
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {t('generate_crafting')}
          </p>
        </div>
      )}

      {/* Result — full width, auto-scrolled to */}
      {result && (
        <div ref={resultRef} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Hook Score Banner */}
          {hookScore && (
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
          )}

          {/* Script Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.15rem', marginBottom: 4 }}>
                  {t('generate_your_script')}
                </h2>
                <p style={{ color: 'var(--text-faint)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
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

          {/* ── Script Refinement Panel ───────────────────────────── */}
          <div ref={refineRef} className="card" style={{ border: '1px solid rgba(255,95,31,0.25)', background: 'linear-gradient(135deg, rgba(255,95,31,0.04), rgba(255,60,172,0.04))' }}>
            {/* Version History Pills */}
            {versions.length > 1 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                  Version History
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {versions.map((v, i) => (
                    <button
                      key={i}
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

            {/* Header */}
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1rem', marginBottom: 4 }}>
                ✦ Refine This Script
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Tell the AI what to change — or tap a quick action below.
              </p>
            </div>

            {/* Quick Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {REFINE_CHIPS.map(chip => (
                <button
                  key={chip.label}
                  onClick={() => refine(chip.instruction)}
                  disabled={refining}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: '1px solid var(--border)',
                    background: 'var(--surface2)',
                    color: 'var(--text-muted)',
                    cursor: refining ? 'not-allowed' : 'pointer',
                    opacity: refining ? 0.5 : 1,
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!refining) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Custom instruction */}
            <div style={{ display: 'flex', gap: 10 }}>
              <textarea
                className="textarea"
                placeholder='Or describe your own change… e.g. "make it funnier and add a cricket reference"'
                value={refineInput}
                onChange={e => setRefineInput(e.target.value)}
                rows={2}
                maxLength={500}
                style={{ flex: 1, resize: 'vertical', fontSize: '0.9rem' }}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) refine() }}
              />
              <button
                onClick={() => refine()}
                disabled={refining || !refineInput.trim()}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-end', height: 44, paddingInline: 20, whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {refining ? <><span className="spinner" /> Refining…</> : 'Refine →'}
              </button>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: 6 }}>
              Tip: refinements don't use your generation quota · Ctrl+Enter to submit
            </div>
          </div>

          {/* Generate another button */}
          <button
            onClick={() => { setResult(null); setVersions([]); setActiveVer(0); setRefineInput(''); setForm({ topic: '', niche: primaryNiche, tone: 'motivational', audience: getSavedRegion(), scriptLang: getSavedScriptLang() }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="btn btn-ghost btn-full"
            style={{ marginBottom: 32 }}
          >
            {t('generate_another')}
          </button>
        </div>
      )}
    </div>
  )
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
