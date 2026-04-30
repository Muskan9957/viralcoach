import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../api'
import { useToast } from '../components/Toast'
import { useLang } from '../i18n.jsx'
import { MicButton, SpeakButton } from '../components/VoiceAssistant'

const gradeColor  = { A: '#00C9A7', B: '#88F0D0', C: '#FF9F43', D: '#FF6B47', F: '#FF6B6B' }
const gradeLabel  = { A: 'Excellent', B: 'Good', C: 'Average', D: 'Weak', F: 'Poor' }

const SCORE_LANGS = [
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

function BigScoreRing({ score }) {
  const r    = 68
  const circ = 2 * Math.PI * r
  const fill = circ - (score / 100) * circ
  const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'F'
  const color = gradeColor[grade]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--surface3)" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={fill}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
          style={{ filter: `drop-shadow(0 0 12px ${color})`, transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="80" y="71" textAnchor="middle" fontFamily="var(--font-head)" fontSize="30" fontWeight="800" fill="var(--text)">{score}</text>
        <text x="80" y="85" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--text-faint)">out of 100</text>
        <text x="80" y="100" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill={color}>
          {grade} — {gradeLabel[grade]}
        </text>
      </svg>
    </div>
  )
}

export default function Score() {
  const toast    = useToast()
  const { t, lang } = useLang()
  const location = useLocation()

  const [hook, setHook]         = useState('')
  const [hookLang, setHookLang] = useState(() => localStorage.getItem('arc_script_lang') || 'en')
  const [loading, setLd]        = useState(false)
  const [result, setResult]     = useState(null)
  const [accepted, setAccepted] = useState(false)
  const [micInterim, setMicInterim] = useState('')  // live speech preview

  // Pre-fill hook from Templates page
  useEffect(() => {
    const stateHook = location.state?.hook
    if (stateHook) {
      setHook(stateHook)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const scoreHook = async e => {
    e.preventDefault()
    if (!hook.trim()) { toast('Please enter a hook', 'error'); return }
    setLd(true); setResult(null); setAccepted(false)
    try {
      const data = await api.scoreHook({ hookText: hook, language: hookLang })
      setResult(data.hookScore)
      toast('Hook scored!', 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLd(false)
    }
  }

  const statusColor = s =>
    s === 'Post Ready' ? '#00C9A7' :
    s === 'Needs Improvement' ? '#FF9F43' : '#FF6B6B'

  // TTS text for the result
  const ttsText = result
    ? `Your hook scored ${result.score} out of 100. Grade ${result.score >= 90 ? 'A' : result.score >= 75 ? 'B' : result.score >= 60 ? 'C' : result.score >= 50 ? 'D' : 'F'}. ${result.reasons?.join('. ')}`
    : null

  return (
    <div className="page-enter">
      <h1 className="page-title">{t('score_title')}</h1>
      <p className="page-sub">{t('score_sub')}</p>

      <div style={styles.layout}>
        {/* Form */}
        <div className="card" style={{ position: 'sticky', top: 40 }}>
          <h2 style={styles.cardTitle}>{t('score_label')}</h2>
          <form onSubmit={scoreHook} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="field">
              {/* Label + char counter row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                <label style={{ marginBottom: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {t('score_hook_text')}
                </label>
                <span style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: hook.length > 900 ? '#FF6B6B' : hook.length > 700 ? 'var(--yellow)' : 'var(--text-faint)',
                  transition: 'color 0.2s',
                }}>
                  {hook.length}/1000
                </span>
              </div>

              {/* Language select — full-width row above textarea (same pattern as Generate page) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <select
                  value={hookLang}
                  onChange={e => { setHookLang(e.target.value); localStorage.setItem('arc_script_lang', e.target.value) }}
                  title="Language for mic & scoring"
                  className="select"
                  style={{ width: 130, fontSize: '0.82rem', height: 34, padding: '0 8px' }}
                >
                  {SCORE_LANGS.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                  language · tap 🎙 to speak
                </span>
              </div>

              {/* Textarea + mic side by side */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <textarea
                  className="textarea"
                  placeholder={'e.g. "I was broke at 25. Here\'s what changed everything."'}
                  value={micInterim || hook}
                  onChange={e => { if (!micInterim) setHook(e.target.value.slice(0, 1000)) }}
                  rows={5}
                  required
                  maxLength={1000}
                  style={{
                    flex: 1, minWidth: 0, resize: 'vertical', fontSize: '0.95rem', lineHeight: 1.6,
                    opacity: micInterim ? 0.75 : 1,
                    fontStyle: micInterim ? 'italic' : 'normal',
                    transition: 'opacity 0.15s',
                  }}
                />
                <MicButton
                  onResult={text => { setMicInterim(''); setHook(text.slice(0, 1000)) }}
                  onInterim={text => setMicInterim(text.slice(0, 1000))}
                  lang={hookLang}
                  style={{ marginTop: 4 }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading
                ? <><span className="spinner" />{t('score_scoring')}</>
                : t('score_btn_score')}
            </button>
          </form>

          {/* Tips */}
          <div style={styles.tips}>
            <div style={styles.tipsTitle}>{t('score_tips_title')}</div>
            {[t('score_tip_1'), t('score_tip_2'), t('score_tip_3'), t('score_tip_4')].map((tip, i) => (
              <div key={i} style={styles.tip}><span style={{ color: 'var(--teal)' }}>✓</span> {tip}</div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div>
          {!result && !loading && (
            <div className="card" style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="empty-state">
                <div className="icon">◎</div>
                <p style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  {t('score_empty')}
                </p>
                <p>{t('score_empty_sub')}</p>
              </div>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Big score */}
              <div className="card" style={styles.scoreCard}>
                <BigScoreRing score={result.score} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.4rem' }}>
                      {result.score}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>/100</span>
                    </span>
                    <span style={{
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '600',
                      padding: '4px 12px',
                      borderRadius: '99px',
                      background: `${statusColor(result.status)}22`,
                      color: statusColor(result.status),
                      border: `1px solid ${statusColor(result.status)}44`,
                    }}>
                      {result.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    {t('score_reasons_label')}
                  </div>
                  <div className="reasons">
                    {result.reasons?.map((r, i) => (
                      <div key={i} className="reason-item">
                        <div className="reason-dot" />
                        {r}
                      </div>
                    ))}
                  </div>

                  {/* TTS button */}
                  <div style={{ marginTop: 16 }}>
                    <SpeakButton text={ttsText} />
                  </div>
                </div>
              </div>

              {/* Scored hook display */}
              <div className="card card-sm">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  {t('score_scored_hook')}
                </div>
                <div style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text)', borderLeft: '3px solid var(--accent)', paddingLeft: '14px' }}>
                  "{hook}"
                </div>
              </div>

              {/* Action row */}
              {result.score < 75 && (
                <div className="card card-sm" style={{ background: 'var(--accent-dim)', border: '1px solid rgba(255,95,31,0.2)' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>
                    {t('score_weak_title')}
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6 }}>
                    {t('score_weak_body')}
                  </p>
                  <a href="/generate" className="btn btn-primary btn-sm">{t('score_weak_btn')}</a>
                </div>
              )}

              {result.score >= 75 && (
                <div className="card card-sm" style={{ background: 'var(--teal-dim)', border: '1px solid rgba(0,201,167,0.2)' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--teal)', marginBottom: 6 }}>
                    {t('score_ready_title')}
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                    {t('score_ready_body')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(380px, 440px) 1fr',
    gap: 28,
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontFamily: 'var(--font-head)',
    fontWeight: '700',
    fontSize: '1rem',
    marginBottom: '20px',
  },
  scoreCard: {
    display: 'flex',
    gap: 28,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  tips: {
    marginTop: 24,
    padding: '16px',
    background: 'var(--surface2)',
    borderRadius: 'var(--radius)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  tipsTitle: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-faint)',
    marginBottom: 6,
  },
  tip: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    display: 'flex',
    gap: 8,
  },
}
