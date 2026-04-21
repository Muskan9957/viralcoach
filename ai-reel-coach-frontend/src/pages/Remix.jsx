import { useState, useRef, useEffect } from 'react'
import { api } from '../api'

const PLATFORMS = [
  { key: 'twitter',   label: 'Twitter / X',        icon: '𝕏', color: '#1DA1F2' },
  { key: 'linkedin',  label: 'LinkedIn',            icon: 'in', color: '#0077B5' },
  { key: 'youtube',   label: 'YouTube Shorts',      icon: '▶',  color: '#FF0000' },
  { key: 'caption',   label: 'Instagram Caption',   icon: '◈',  color: '#C13584' },
]

function PulsingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', marginLeft: 8 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />
      ))}
    </span>
  )
}

export default function Remix() {
  const [hook,    setHook]    = useState('')
  const [body,    setBody]    = useState('')
  const [cta,     setCta]     = useState('')
  const [topic,   setTopic]   = useState('')
  const [fullScript, setFullScript] = useState('')
  const [showPaste, setShowPaste]   = useState(false)
  const [loading, setLoading]       = useState(false)
  const [result,  setResult]        = useState(null)
  const [error,   setError]         = useState('')
  const [copied,  setCopied]        = useState({})

  const resultsRef = useRef(null)

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  const autoParse = () => {
    if (!fullScript.trim()) return
    const lines = fullScript.trim().split('\n').filter(Boolean)
    // Heuristic: first line = hook, last line = cta, middle = body
    const h = lines[0] || ''
    const c = lines[lines.length - 1] || ''
    const b = lines.slice(1, -1).join('\n') || ''
    setHook(h)
    setBody(b)
    setCta(c)
    setShowPaste(false)
    setFullScript('')
  }

  const handleRemix = async (e) => {
    e.preventDefault()
    if (!hook.trim() && !body.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await api.remixContent({ hook, body, cta, topic })
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyPlatform = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(prev => ({ ...prev, [key]: true }))
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000)
    } catch {}
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">Content Remix</h1>
        <p className="page-sub">Turn one Reel script into content for every platform.</p>
      </div>

      <form onSubmit={handleRemix} style={{ maxWidth: 720 }}>
        {/* Paste full script toggle */}
        <div style={{ marginBottom: 18 }}>
          <button
            type="button"
            onClick={() => setShowPaste(p => !p)}
            style={{
              ...s.ghostBtn,
              color: showPaste ? 'var(--accent)' : 'var(--text-muted)',
              borderColor: showPaste ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {showPaste ? '✕ Close' : '⊕ Paste full script and auto-parse'}
          </button>
        </div>

        {showPaste && (
          <div style={{ marginBottom: 18 }}>
            <textarea
              className="input"
              style={{ width: '100%', minHeight: 120, resize: 'vertical', fontFamily: 'var(--font-body)' }}
              placeholder="Paste your full script here. We'll split it into Hook, Body, and CTA automatically."
              value={fullScript}
              onChange={e => setFullScript(e.target.value)}
            />
            <button
              type="button"
              onClick={autoParse}
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 8 }}
            >
              Auto-Parse
            </button>
          </div>
        )}

        {/* Hook */}
        <div className="field" style={{ marginBottom: 16 }}>
          <label style={s.label}>Hook <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(opening line)</span></label>
          <textarea
            className="input"
            style={{ width: '100%', minHeight: 72, resize: 'vertical', fontFamily: 'var(--font-body)' }}
            placeholder="e.g. I gained 10k followers in 30 days by doing ONE thing..."
            value={hook}
            onChange={e => setHook(e.target.value)}
          />
        </div>

        {/* Body */}
        <div className="field" style={{ marginBottom: 16 }}>
          <label style={s.label}>Body <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(main content)</span></label>
          <textarea
            className="input"
            style={{ width: '100%', minHeight: 100, resize: 'vertical', fontFamily: 'var(--font-body)' }}
            placeholder="e.g. Most creators make the mistake of posting without a strategy..."
            value={body}
            onChange={e => setBody(e.target.value)}
          />
        </div>

        {/* CTA */}
        <div className="field" style={{ marginBottom: 16 }}>
          <label style={s.label}>CTA <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(call to action)</span></label>
          <textarea
            className="input"
            style={{ width: '100%', minHeight: 60, resize: 'vertical', fontFamily: 'var(--font-body)' }}
            placeholder="e.g. Follow for daily creator tips"
            value={cta}
            onChange={e => setCta(e.target.value)}
          />
        </div>

        {/* Topic */}
        <div className="field" style={{ marginBottom: 24 }}>
          <label style={s.label}>Topic <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(optional, helps AI)</span></label>
          <input
            className="input"
            style={{ width: '100%' }}
            type="text"
            placeholder="e.g. Content strategy, fitness, finance..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
        </div>

        {error && (
          <div style={{ color: '#FF6B6B', fontSize: '0.85rem', marginBottom: 14, padding: '10px 14px', background: 'rgba(255,107,107,0.08)', borderRadius: 8, border: '1px solid rgba(255,107,107,0.2)' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || (!hook.trim() && !body.trim())}
          style={{ minWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {loading ? (<>Remixing{<PulsingDots />}</>) : '⚡ Remix for All Platforms'}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div ref={resultsRef} style={{ marginTop: 40, maxWidth: 900 }}>
          <h2 style={{ ...s.sectionTitle, marginBottom: 20 }}>Platform Content</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: 16,
          }}>
            {PLATFORMS.map(({ key, label, icon, color }) => {
              const text = result[key]
              if (!text) return null
              return (
                <div key={key} className="card" style={{ padding: '20px', borderTop: `3px solid ${color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${color}22`,
                      border: `1px solid ${color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: key === 'linkedin' ? '0.7rem' : '0.9rem',
                      color, fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {icon}
                    </span>
                    <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                      {label}
                    </span>
                    <div style={{ flex: 1 }} />
                    <button
                      onClick={() => copyPlatform(text, key)}
                      style={{
                        ...s.copyBtn,
                        color: copied[key] ? 'var(--teal)' : 'var(--text-muted)',
                        borderColor: copied[key] ? 'var(--teal)' : 'var(--border)',
                      }}
                    >
                      {copied[key] ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  label: {
    display: 'block', fontSize: '0.8rem', fontWeight: 600,
    color: 'var(--text-muted)', marginBottom: 6,
    fontFamily: 'var(--font-body)', letterSpacing: '0.01em',
  },
  sectionTitle: {
    fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700, margin: 0,
  },
  copyBtn: {
    padding: '5px 12px', borderRadius: 7,
    border: '1px solid var(--border)',
    background: 'transparent',
    fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
    cursor: 'pointer', transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  ghostBtn: {
    padding: '7px 14px', borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'transparent',
    fontSize: '0.8rem', fontFamily: 'var(--font-body)',
    cursor: 'pointer', transition: 'all 0.15s',
  },
}
