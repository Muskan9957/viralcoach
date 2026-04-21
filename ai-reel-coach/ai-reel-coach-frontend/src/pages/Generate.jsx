import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../api'
import { useToast } from '../components/Toast'
import { useLang } from '../i18n.jsx'
import { MicButton, SpeakButton } from '../components/VoiceAssistant'
import { usePrefs } from '../hooks/usePrefs'

const TONES = ['motivational', 'educational', 'funny', 'storytelling', 'controversial', 'conversational']
const NICHES = ['fitness', 'finance', 'food', 'travel', 'tech', 'fashion', 'lifestyle', 'education', 'comedy', 'business']

const gradeColor = { A: '#00C9A7', B: '#00C9A7', C: '#FFD60A', D: '#FF9F43', F: '#FF6B6B' }
const gradeLabel = { A: 'Excellent', B: 'Good', C: 'Average', D: 'Weak', F: 'Poor' }

export default function Generate() {
  const toast      = useToast()
  const { t }      = useLang()
  const location   = useLocation()
  const resultRef  = useRef(null)
  const { primaryNiche } = usePrefs()

  const [form, setForm]     = useState({ topic: '', niche: primaryNiche, tone: 'motivational' })
  const [loading, setLd]    = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

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
    try {
      const data = await api.generate(form)
      setResult(data)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLd(false)
    }
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
        <h1 className="page-title" style={{ marginBottom: 8 }}>{t('generate_title')}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Speak or type your idea — get a viral-ready script in seconds.
        </p>
      </div>

      {/* Form Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Topic — most important field, big and prominent */}
          <div className="field">
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Your Topic *
            </label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <textarea
                className="textarea"
                placeholder="e.g. How I grew from 0 to 10k followers in 90 days"
                value={form.topic}
                onChange={set('topic')}
                rows={2}
                required
                style={{ flex: 1, resize: 'none', fontSize: '1rem' }}
              />
              <MicButton
                onResult={text => setForm(f => ({ ...f, topic: text }))}
                style={{ marginTop: 4, flexShrink: 0 }}
              />
            </div>
          </div>

          {/* Niche + Tone in a row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ height: 52, fontSize: '1rem', fontWeight: 700, letterSpacing: '0.02em' }}
          >
            {loading
              ? <><span className="spinner" /> Writing your script...</>
              : '✦ Generate Script'}
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
            AI is writing your script
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Crafting hook → body → CTA and scoring your hook...
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
                  Hook Score
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
                  Your Script
                </h2>
                <p style={{ color: 'var(--text-faint)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                  {form.topic}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <SpeakButton text={result.script?.fullScript} />
                <button onClick={copyScript} className="btn btn-ghost btn-sm">
                  {copied ? '✓ Copied!' : '⎘ Copy All'}
                </button>
              </div>
            </div>

            {/* Hook */}
            <div style={sectionStyle('#00C8FF')}>
              <div style={labelStyle}>🎣 HOOK — First 3 seconds</div>
              <p style={scriptTextStyle}>{result.script.hook}</p>
            </div>

            {/* Body */}
            <div style={sectionStyle('#00C9A7')}>
              <div style={labelStyle}>📖 BODY — Main value</div>
              <p style={{ ...scriptTextStyle, whiteSpace: 'pre-line' }}>{result.script.body}</p>
            </div>

            {/* CTA */}
            <div style={sectionStyle('#FFD60A')}>
              <div style={labelStyle}>📣 CALL TO ACTION</div>
              <p style={scriptTextStyle}>{result.script.cta}</p>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                {result.usage?.used}/{result.usage?.limit} generations used this month
              </span>
              {result.newBadges?.length > 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--yellow)', fontWeight: 600 }}>
                  🏆 New badge unlocked!
                </span>
              )}
            </div>
          </div>

          {/* Generate another button */}
          <button
            onClick={() => { setResult(null); setForm({ topic: '', niche: '', tone: 'motivational' }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="btn btn-ghost btn-full"
            style={{ marginBottom: 32 }}
          >
            ↑ Generate Another Script
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
