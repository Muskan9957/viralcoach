import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useLang } from '../i18n.jsx'

const CATEGORIES = ['All', 'Fitness', 'Finance', 'Food', 'Tech', 'Motivation', 'Relationships', 'Business', 'Health']
const TYPES      = ['All', 'Question', 'Bold Claim', 'Story', 'Statistic', 'Controversy', 'How-To']

const CATEGORY_COLORS = {
  Fitness:       '#00C8FF',
  Finance:       '#00C9A7',
  Food:          '#FFD60A',
  Tech:          '#7B61FF',
  Motivation:    '#7B5CF0',
  Relationships: '#4DD9FF',
  Business:      '#00C9A7',
  Health:        '#4CAF50',
}

const TYPE_COLORS = {
  'Question':    '#FFD60A',
  'Bold Claim':  '#00C8FF',
  'Story':       '#7B5CF0',
  'Statistic':   '#00C9A7',
  'Controversy': '#FF6B6B',
  'How-To':      '#7B61FF',
}

// Highlight [placeholders] inside template text
function HighlightedTemplate({ text }) {
  const parts = text.split(/(\[[^\]]+\])/g)
  return (
    <span>
      {parts.map((part, i) =>
        /^\[.*\]$/.test(part) ? (
          <span key={i} style={{ color: 'var(--accent)', fontWeight: 600 }}>{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

export default function HookLibrary() {
  const navigate = useNavigate()
  const { t } = useLang()
  const [templates, setTemplates] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [category,  setCategory]  = useState('all')
  const [type,      setType]      = useState('all')
  const [search,    setSearch]    = useState('')
  const [debSearch, setDebSearch] = useState('')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getHookLibrary({ category, type, search: debSearch })
      setTemplates(data.templates || [])
    } catch (err) {
      setError(err.message || 'Failed to load hook library')
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }, [category, type, debSearch])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const useHook = (template) => {
    navigate('/generate', { state: { hook: template.template, topic: template.example } })
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">{t('hooks_title')}</h1>
        <p className="page-sub">{t('hooks_sub')}</p>
      </div>

      {/* Filter bar */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap',
        marginBottom: 28, alignItems: 'center',
      }}>
        <select
          className="input"
          style={{ flex: '1 1 140px', maxWidth: 180 }}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c === 'All' ? 'all' : c}>{c}</option>
          ))}
        </select>

        <select
          className="input"
          style={{ flex: '1 1 140px', maxWidth: 180 }}
          value={type}
          onChange={e => setType(e.target.value)}
        >
          {TYPES.map(t => (
            <option key={t} value={t === 'All' ? 'all' : t}>{t}</option>
          ))}
        </select>

        <input
          className="input"
          style={{ flex: '2 1 200px' }}
          type="text"
          placeholder={t('hooks_search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ color: '#FF6B6B', fontSize: '0.85rem', marginBottom: 16, padding: '10px 14px', background: 'rgba(255,107,107,0.08)', borderRadius: 8, border: '1px solid rgba(255,107,107,0.2)' }}>
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={s.grid}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{
              height: 160, borderRadius: 'var(--radius-lg)',
              background: 'var(--surface)', border: '1px solid var(--border)',
              opacity: 0.5,
            }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && templates.length === 0 && !error && (
        <div className="empty-state">
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{t('hooks_empty')}</p>
          <p style={{ color: 'var(--text-faint)', fontSize: '0.82rem' }}>
            {t('hooks_empty_sub')}
          </p>
        </div>
      )}

      {/* Template grid */}
      {!loading && templates.length > 0 && (
        <div style={s.grid}>
          {templates.map((tmpl) => {
            const catColor  = CATEGORY_COLORS[tmpl.category] || 'var(--accent)'
            const typeColor = TYPE_COLORS[tmpl.type] || 'var(--text-muted)'
            return (
              <div key={tmpl.id} className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Badges row */}
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  <span style={{ ...s.badge, color: catColor, background: `${catColor}15`, borderColor: `${catColor}35` }}>
                    {tmpl.category}
                  </span>
                  <span style={{ ...s.badge, color: typeColor, background: `${typeColor}15`, borderColor: `${typeColor}35` }}>
                    {tmpl.type}
                  </span>
                </div>

                {/* Template text with highlighted placeholders */}
                <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text)', fontWeight: 500 }}>
                  <HighlightedTemplate text={tmpl.template} />
                </p>

                {/* Example */}
                {tmpl.example && (
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-faint)', lineHeight: 1.55, fontStyle: 'italic' }}>
                    {t('hooks_eg')} {tmpl.example}
                  </p>
                )}

                {/* Tags */}
                {tmpl.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 'auto' }}>
                    {tmpl.tags.slice(0, 4).map((tag, i) => (
                      <span key={i} style={{ fontSize: '0.68rem', color: 'var(--text-faint)', background: 'var(--surface3)', borderRadius: 5, padding: '2px 7px', fontFamily: 'var(--font-mono)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => useHook(tmpl)}
                  style={{
                    marginTop: 4,
                    padding: '9px 14px', borderRadius: 8,
                    border: '1px solid var(--accent)',
                    background: 'rgba(255,95,31,0.08)',
                    color: 'var(--accent)',
                    fontSize: '0.82rem', fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,95,31,0.18)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,95,31,0.08)'
                  }}
                >
                  {t('hooks_use')}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const s = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
  },
  badge: {
    fontSize: '0.65rem', fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    padding: '3px 9px', borderRadius: 99,
    border: '1px solid',
  },
}
