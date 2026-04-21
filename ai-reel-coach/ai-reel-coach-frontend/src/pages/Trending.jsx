import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useLang } from '../i18n.jsx'
import { useToast } from '../components/Toast'
import { usePrefs } from '../hooks/usePrefs'

// ─── Frontend topic cache ──────────────────────────────────────────
// Keyed by "niche:lang". Stored in localStorage with a 30-min TTL.
// Returns topics instantly on repeat visits; refreshes silently in bg.
const CACHE_TTL_MS = 30 * 60 * 1000  // 30 minutes

function cacheKey(niche, lang)   { return `vc_trending_${niche}_${lang}` }

function readCache(niche, lang) {
  try {
    const raw = localStorage.getItem(cacheKey(niche, lang))
    if (!raw) return null
    const { topics, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL_MS) return null
    return topics
  } catch { return null }
}

function writeCache(niche, lang, topics) {
  try {
    localStorage.setItem(cacheKey(niche, lang), JSON.stringify({ topics, ts: Date.now() }))
  } catch {}
}

const NICHES = [
  { value: 'general',   label: 'General'   },
  { value: 'fitness',   label: 'Fitness'   },
  { value: 'food',      label: 'Food'      },
  { value: 'travel',    label: 'Travel'    },
  { value: 'tech',      label: 'Tech'      },
  { value: 'fashion',   label: 'Fashion'   },
  { value: 'finance',   label: 'Finance'   },
  { value: 'lifestyle', label: 'Lifestyle' },
]

// Skeleton card
function SkeletonCard() {
  return (
    <div style={{
      padding: '20px',
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ height: 14, width: '80%', background: 'var(--surface3)', borderRadius: 6, animation: 'pulse 1.5s ease infinite' }} />
      <div style={{ height: 12, width: '60%', background: 'var(--surface3)', borderRadius: 6, animation: 'pulse 1.5s ease infinite' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <div style={{ height: 32, flex: 1, background: 'var(--surface3)', borderRadius: 8, animation: 'pulse 1.5s ease infinite' }} />
        <div style={{ height: 32, width: 36, background: 'var(--surface3)', borderRadius: 8, animation: 'pulse 1.5s ease infinite' }} />
      </div>
    </div>
  )
}

export default function Trending() {
  const { lang, t }  = useLang()
  const navigate     = useNavigate()
  const toast        = useToast()
  const { primaryNiche } = usePrefs()

  // Default to their onboarding niche if it matches a known option, else 'general'
  const VALID_NICHES = ['general','fitness','food','travel','tech','fashion','finance','lifestyle']
  const defaultNiche = VALID_NICHES.includes(primaryNiche) ? primaryNiche : 'general'

  const [niche,      setNiche]      = useState(defaultNiche)
  const [topics,     setTopics]     = useState(() => readCache(defaultNiche, lang) || [])
  const [loading,    setLoading]    = useState(() => !readCache(defaultNiche, lang))
  const [refreshing, setRefreshing] = useState(false)
  const [saved,      setSaved]      = useState(new Set())
  const [saving,     setSaving]     = useState(null)
  const abortRef = useRef(null)

  const fetchTopics = useCallback(async ({ silent = false } = {}) => {
    // Cancel any in-flight request for a previous niche
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    if (silent) setRefreshing(true)
    else        setLoading(true)

    try {
      const data = await api.getTrending(niche, lang)
      const fresh = data.topics || []
      setTopics(fresh)
      writeCache(niche, lang, fresh)
    } catch (err) {
      if (err?.name === 'AbortError') return
      if (!silent) {
        setTopics([])
        toast('Could not load trending topics', 'error')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [niche, lang])

  useEffect(() => {
    const cached = readCache(niche, lang)
    if (cached) {
      // Show cached topics instantly, refresh quietly in background
      setTopics(cached)
      setLoading(false)
      fetchTopics({ silent: true })
    } else {
      setTopics([])
      setLoading(true)
      fetchTopics()
    }
  }, [niche, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerate = (topic) => {
    // Pass topic to Generate page via localStorage as fallback + navigation state
    localStorage.setItem('arc_prefill_topic', topic)
    navigate('/generate', { state: { topic } })
  }

  const handleBookmark = async (topic, idx) => {
    setSaving(idx)
    try {
      await api.createTemplate({
        name: topic.slice(0, 80),
        type: 'hook',
        content: topic,
        source: 'trending',
        niche,
      })
      setSaved(s => new Set([...s, idx]))
      toast('Saved as template!', 'success')
    } catch (err) {
      toast(err.message || 'Could not save template', 'error')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">{t('trending_title')}</h1>
        <p className="page-sub">Discover what's viral in your niche and turn it into a script instantly.</p>
      </div>

      {/* Niche selector */}
      <div style={tStyles.nicheBar}>
        {NICHES.map(n => (
          <button
            key={n.value}
            onClick={() => setNiche(n.value)}
            style={{
              ...tStyles.nicheBtn,
              border: niche === n.value ? '2px solid var(--accent)' : '1px solid var(--border)',
              background: niche === n.value ? 'var(--accent-dim)' : 'var(--surface2)',
              color: niche === n.value ? 'var(--accent)' : 'var(--text-muted)',
              fontWeight: niche === n.value ? 600 : 400,
            }}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* Refresh button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        {refreshing && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
            updating…
          </span>
        )}
        <button
          onClick={() => fetchTopics()}
          disabled={loading || refreshing}
          className="btn btn-ghost btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: (loading || refreshing) ? 'spin 1s linear infinite' : 'none' }}>
            <path d="M23 4v6h-6"/>
            <path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Topics grid */}
      <div style={tStyles.grid}>
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : topics.length === 0
            ? (
              <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 24px' }}>
                <div className="empty-state">
                  <div className="icon">📡</div>
                  <p style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    No trending topics found
                  </p>
                  <p>Try refreshing or selecting a different niche.</p>
                  <button onClick={fetchTopics} className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>
                    Try Again
                  </button>
                </div>
              </div>
            )
            : topics.map((topic, i) => {
              const topicText = typeof topic === 'string' ? topic : topic.text || topic.title || JSON.stringify(topic)
              const isSaved   = saved.has(i)
              return (
                <div key={i} className="card card-sm" style={tStyles.topicCard}>
                  <div style={tStyles.topicRank}>#{i + 1}</div>
                  <div style={tStyles.topicText}>{topicText}</div>
                  <div style={tStyles.cardActions}>
                    <button
                      onClick={() => handleGenerate(topicText)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      Generate Script →
                    </button>
                    <button
                      onClick={() => handleBookmark(topicText, i)}
                      disabled={isSaved || saving === i}
                      title={isSaved ? 'Saved' : 'Save as template'}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: isSaved ? '1px solid var(--teal)' : '1px solid var(--border)',
                        background: isSaved ? 'var(--teal-dim)' : 'var(--surface2)',
                        color: isSaved ? 'var(--teal)' : 'var(--text-muted)',
                        cursor: isSaved ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        flexShrink: 0,
                        transition: 'all 0.15s',
                      }}
                    >
                      {isSaved ? '✓' : saving === i ? '…' : '🔖'}
                    </button>
                  </div>
                </div>
              )
            })
        }
      </div>
    </div>
  )
}

const tStyles = {
  nicheBar: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  nicheBtn: {
    padding: '8px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: '0.82rem',
    transition: 'all 0.15s',
    fontFamily: 'var(--font-body)',
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16,
  },
  topicCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    transition: 'border-color 0.15s, transform 0.15s',
  },
  topicRank: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    color: 'var(--text-faint)',
    letterSpacing: '0.06em',
  },
  topicText: {
    fontSize: '0.9rem',
    lineHeight: 1.5,
    fontWeight: 500,
    flex: 1,
    color: 'var(--text)',
  },
  cardActions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginTop: 4,
  },
}
