import { useState, useEffect } from 'react'
import { api } from '../api'
import { useToast } from '../components/Toast'
import { useAuth } from '../store'

const MAX_SAMPLES = 3
const MIN_CHARS   = 80   // per sample — too short to be useful

const PLACEHOLDER = [
  `e.g. paste a caption you've written, a script you filmed, or just how you naturally talk in your videos...`,
  `e.g. another past caption or script — the more samples you give, the more accurate your voice profile`,
  `e.g. a third sample (optional but makes the profile stronger)`,
]

const TRAIT_ICONS = {
  energy       : '⚡',
  sentenceStyle: '📝',
  vocabulary   : '📚',
  humor        : '😄',
  structure    : '🏗️',
  signature    : '✍️',
}

export default function MyVoice() {
  const toast        = useToast()
  const { user }     = useAuth()
  const isPremium    = user?.plan === 'STARTER' || user?.plan === 'PRO'

  const [samples, setSamples]   = useState(['', '', ''])
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(true)
  const [deleting, setDeleting] = useState(false)

  // Load existing profile on mount
  useEffect(() => {
    api.getVoiceProfile()
      .then(data => { if (data.profile) setProfile(data.profile) })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  const analyze = async () => {
    const filled = samples.filter(s => s.trim().length >= MIN_CHARS)
    if (filled.length === 0) {
      toast(`Paste at least one sample (${MIN_CHARS}+ characters)`, 'error')
      return
    }
    setLoading(true)
    try {
      const data = await api.analyzeVoice(filled)
      setProfile(data.profile)
      toast('Voice profile saved!', 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const deleteProfile = async () => {
    if (!window.confirm('Delete your voice profile? Scripts will no longer be personalised.')) return
    setDeleting(true)
    try {
      await api.deleteVoiceProfile()
      setProfile(null)
      setSamples(['', '', ''])
      toast('Voice profile deleted', 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  if (fetching) return (
    <div className="page-enter" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <span className="spinner" style={{ width: 28, height: 28 }} />
    </div>
  )

  return (
    <div className="page-enter" style={{ maxWidth: 740, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <h1 className="page-title" style={{ margin: 0 }}>Creator DNA</h1>
          <span style={{
            padding: '3px 12px', borderRadius: 99,
            fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            background: 'linear-gradient(135deg, rgba(0,200,255,0.15), rgba(160,110,255,0.15))',
            border: '1px solid rgba(0,200,255,0.3)',
            color: '#00C8FF',
          }}>
            ✦ Premium
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 560 }}>
          Paste samples of your past captions, scripts, or how you naturally talk.
          The AI extracts your voice fingerprint — every script it generates will sound like <em>you</em>, not a generic AI.
        </p>
      </div>

      {/* FREE plan gate */}
      {!isPremium && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(255,95,31,0.06), rgba(160,110,255,0.06))',
          border: '1px solid rgba(160,110,255,0.2)',
          textAlign: 'center', padding: '40px 28px',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🎙</div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.2rem', marginBottom: 10 }}>
            Unlock Your Creator DNA
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Train the AI on your style so every script sounds authentically like you — your humour, your energy, your patterns.
          </p>
          <a href="/pricing" className="btn btn-primary" style={{ display: 'inline-block' }}>
            Upgrade to Starter or Pro →
          </a>
        </div>
      )}

      {/* Premium: show profile if exists, otherwise show input form */}
      {isPremium && !profile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h2 style={cardTitleStyle}>Paste Your Content Samples</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.6 }}>
              Give 1–3 samples of your real content — past captions, scripts you've filmed, or voice notes transcribed.
              The more authentic, the better the fingerprint.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {samples.map((s, i) => (
                <div key={i} className="field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={fieldLabelStyle}>
                      Sample {i + 1}{i > 0 ? ' (optional)' : ''}
                    </label>
                    <span style={{
                      fontSize: '0.68rem', fontFamily: 'var(--font-mono)',
                      color: s.length < MIN_CHARS && s.length > 0 ? '#FF9F43' : 'var(--text-faint)',
                    }}>
                      {s.length} chars{s.length > 0 && s.length < MIN_CHARS ? ` · need ${MIN_CHARS - s.length} more` : ''}
                    </span>
                  </div>
                  <textarea
                    className="textarea"
                    placeholder={PLACEHOLDER[i]}
                    value={s}
                    onChange={e => {
                      const next = [...samples]
                      next[i] = e.target.value
                      setSamples(next)
                    }}
                    rows={5}
                    style={{ fontSize: '0.9rem', lineHeight: 1.65 }}
                  />
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary btn-full"
              onClick={analyze}
              disabled={loading || samples.filter(s => s.trim().length >= MIN_CHARS).length === 0}
              style={{ marginTop: 24, height: 52, fontSize: '1rem', fontWeight: 700 }}
            >
              {loading
                ? <><span className="spinner" /> Analysing your voice…</>
                : '✦ Analyse My Voice'}
            </button>
          </div>

          <div className="card card-sm" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              What makes a good sample?
            </div>
            {[
              'A caption you wrote for a reel you loved',
              'A script you actually filmed — hook, body, CTA',
              'A voice note transcript of how you naturally explain something',
              'A thread or post you wrote without overthinking it',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--teal)', flexShrink: 0 }}>✓</span> {tip}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Premium: voice profile display */}
      {isPremium && profile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Summary card */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(0,200,255,0.06), rgba(160,110,255,0.06))',
            border: '1px solid rgba(0,200,255,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00C8FF', marginBottom: 6 }}>
                  Your Voice Fingerprint
                </div>
                <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', margin: 0, lineHeight: 1.45 }}>
                  "{profile.summary}"
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 99, fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)', fontWeight: 600,
                  background: 'rgba(0,201,167,0.12)', border: '1px solid rgba(0,201,167,0.25)',
                  color: '#00C9A7',
                }}>
                  ✓ Active
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)', margin: 0, fontFamily: 'var(--font-mono)' }}>
              Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
              {profile.sampleCount ? ` · ${profile.sampleCount} sample${profile.sampleCount > 1 ? 's' : ''}` : ''}
            </p>
          </div>

          {/* Traits grid */}
          <div className="card">
            <h2 style={cardTitleStyle}>Style Breakdown</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {Object.entries(TRAIT_ICONS).map(([key, icon]) => {
                const val = profile[key]
                if (!val) return null
                const label = {
                  energy       : 'Energy & Delivery',
                  sentenceStyle: 'Sentence Style',
                  vocabulary   : 'Vocabulary',
                  humor        : 'Humor',
                  structure    : 'Content Structure',
                  signature    : 'Signature Patterns',
                }[key]
                return (
                  <div key={key} style={{
                    padding: '14px 16px', borderRadius: 10,
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: '1rem' }}>{icon}</span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-faint)' }}>
                        {label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{val}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* What the AI does with it */}
          <div className="card card-sm" style={{ background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.15)' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#00C8FF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              What the AI is told about you
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.65, fontStyle: 'italic' }}>
              "{profile.promptInstruction}"
            </p>
          </div>

          {/* Re-train + Delete */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn btn-ghost"
              onClick={() => setProfile(null)}
              style={{ flex: 1, minWidth: 140 }}
            >
              ↺ Re-train with new samples
            </button>
            <button
              className="btn"
              onClick={deleteProfile}
              disabled={deleting}
              style={{
                flex: 1, minWidth: 140,
                background: 'rgba(255,107,107,0.08)',
                border: '1px solid rgba(255,107,107,0.25)',
                color: '#FF6B6B',
              }}
            >
              {deleting ? <><span className="spinner" /> Deleting…</> : '🗑 Delete Profile'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const cardTitleStyle = {
  fontFamily: 'var(--font-head)',
  fontWeight: 700,
  fontSize: '1rem',
  marginBottom: 16,
}

const fieldLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}
