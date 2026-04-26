import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store'
import { api } from '../api'
import { useLang } from '../i18n.jsx'
import { useTextToSpeech } from '../components/VoiceAssistant'
import WeeklyReport from '../components/WeeklyReport'
import { usePrefs } from '../hooks/usePrefs'

/* ─── Creator palette ────────────────────────────────────────────── */
const C = {
  cyan:   '#00D4FF',
  pink:   '#FF2D8B',
  lime:   '#A8FF3C',
  amber:  '#FFB800',
  coral:  '#FF5F4C',
  violet: '#A855F7',
  teal:   '#00D4B1',
}

const gradeColor = { A: C.lime, B: C.amber, C: C.coral, D: C.pink, F: '#FF4757' }

const BADGE_META = {
  FIRST_SCRIPT: { emoji: '🎬', label: 'First Script'    },
  SCRIPTS_10:   { emoji: '📚', label: '10 Scripts'       },
  SCRIPTS_50:   { emoji: '🏆', label: '50 Scripts'       },
  PERFECT_HOOK: { emoji: '💯', label: 'Perfect Hook'     },
  ANALYZER_5:   { emoji: '📊', label: '5 Analyses'       },
  STREAK_7:     { emoji: '🔥', label: '7-Day Streak'     },
  STREAK_30:    { emoji: '⚡', label: '30-Day Streak'    },
}

const CATEGORY_COLORS = {
  Entertainment: C.pink,    Finance: C.lime,    Lifestyle: C.amber,
  Sports:        C.violet,  Business: C.teal,   Tech:      C.cyan,
  Content:       C.pink,    Strategy: C.amber,  Health:    C.lime,
  Fashion:       C.coral,   Bollywood: C.pink,  Cricket:   C.lime,
  Education:     C.violet,  Food:      C.coral,
}

/* time-of-day mood */
function getTimeMood() {
  const h = new Date().getHours()
  if (h < 5)  return { key: 'evening', emoji: '🌙', label: 'late-night creator', color: C.violet }
  if (h < 12) return { key: 'morning', emoji: '☀️', label: 'fresh start', color: C.amber  }
  if (h < 17) return { key: 'afternoon', emoji: '🔆', label: 'in the zone', color: C.cyan   }
  if (h < 21) return { key: 'evening', emoji: '✨', label: 'golden hour', color: C.coral  }
  return            { key: 'evening', emoji: '🌙', label: 'late-night creator', color: C.violet }
}

/* ─── Today's Brief ──────────────────────────────────────────────── */
function TrendingBrief({ userName }) {
  const { t, lang } = useLang()
  const { speak, speaking, stopSpeaking } = useTextToSpeech()
  const [greeting, setGreeting] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [played, setPlayed]     = useState(false)

  useEffect(() => {
    setLoading(true)
    setGreeting(null)
    api.getGreeting('Global', lang)
      .then(data => setGreeting(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [lang])

  const playGreeting = () => {
    if (!greeting) return
    if (speaking) { stopSpeaking(); return }
    speak(`${t('dash_greeting_' + getTimeMood().key)} ${userName}! ${greeting.greeting}`)
    setPlayed(true)
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px 26px',
      marginBottom: 28,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* multi-color top stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${C.cyan}, ${C.pink} 50%, ${C.amber})`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: C.pink, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.pink, boxShadow: `0 0 8px ${C.pink}` }} />
          {t('dash_todays_brief')}
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={playGreeting}
          disabled={!greeting}
          style={{
            padding: '6px 14px', borderRadius: 99,
            border: `1px solid ${speaking ? C.teal : 'var(--border)'}`,
            background: speaking ? `${C.teal}1A` : 'transparent',
            color: speaking ? C.teal : 'var(--text-faint)',
            cursor: greeting ? 'pointer' : 'not-allowed',
            fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.15s',
          }}
        >
          {speaking ? '⏸' : '▶'} {speaking ? t('dash_stop') : played ? t('dash_replay') : t('dash_listen')}
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>{t('dash_loading_trends')}</span>
        </div>
      ) : greeting ? (
        <>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.65 }}>
            {greeting.greeting}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {greeting.trends?.slice(0, 3).map((trend, i) => {
              const color = CATEGORY_COLORS[trend.category] || C.cyan
              return (
                <div key={i} style={{
                  flex: '1 1 200px', padding: '14px 16px',
                  background: `${color}10`,
                  border: `1px solid ${color}33`,
                  borderRadius: 14,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
                    background: color, boxShadow: `0 0 12px ${color}66`,
                  }} />
                  <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 6 }}>
                    {trend.category}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 4, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                    {trend.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-faint)', lineHeight: 1.5 }}>
                    {trend.description}
                  </div>
                  <Link
                    to="/generate"
                    state={{ topic: trend.title }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      marginTop: 10, fontSize: '0.74rem', color, textDecoration: 'none', fontWeight: 700,
                    }}
                  >
                    {t('dash_write_script')} <span style={{ transition: 'transform 0.2s' }}>→</span>
                  </Link>
                </div>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}

/* ─── Creator Score ──────────────────────────────────────────────── */
function CreatorScoreCard({ score }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)

  if (!score) return null

  const { score: val, breakdown = {}, level } = score
  const segments = [
    { key: 'consistency',  label: t('dash_seg_consistency'), color: C.lime  },
    { key: 'hookQuality',  label: t('dash_seg_hook'),        color: C.cyan  },
    { key: 'performance',  label: t('dash_seg_performance'), color: C.pink  },
    { key: 'streakBonus',  label: t('dash_seg_streak'),      color: C.amber },
  ]
  const total = segments.reduce((acc, s) => acc + (breakdown[s.key] || 0), 0) || 1

  const shareScore = async () => {
    try {
      await navigator.clipboard.writeText(`My ViralCoach Creator Score: ${val} — ${level || 'Rising Creator'} 🚀`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px 26px', marginBottom: 28,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* ambient color blobs */}
      <div style={{ position: 'absolute', top: -40, right: -30, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${C.pink}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -20, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${C.lime}1A 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
        {/* Score + Level */}
        <div style={{ flexShrink: 0, position: 'relative' }}>
          <div style={{
            fontSize: '4rem', fontFamily: 'var(--font-creator)',
            fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em',
            background: `linear-gradient(135deg, ${C.cyan} 0%, ${C.pink} 55%, ${C.amber} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: `drop-shadow(0 0 24px ${C.pink}55)`,
          }}>
            {val}
          </div>
          {/* sticker-style level badge */}
          <div style={{
            display: 'inline-block', marginTop: 8,
            padding: '5px 12px', borderRadius: 99,
            background: `${C.pink}1A`, border: `1.5px solid ${C.pink}55`,
            fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
            color: C.pink, textTransform: 'uppercase', letterSpacing: '0.08em',
            transform: 'rotate(-1.5deg)',
          }}>
            ✦ {level || 'Rising Creator'}
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 12 }}>
            {t('dash_score_breakdown')}
          </div>
          {/* Bar */}
          <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden', gap: 3, marginBottom: 12 }}>
            {segments.map(seg => {
              const v = breakdown[seg.key] || 0
              const pct = (v / total) * 100
              return (
                <div
                  key={seg.key}
                  title={`${seg.label}: ${v}`}
                  style={{
                    flex: pct, minWidth: pct > 0 ? 6 : 0, borderRadius: 99,
                    background: seg.color,
                    boxShadow: `0 0 10px ${seg.color}66`,
                    transition: 'flex 0.4s ease',
                  }}
                />
              )
            })}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {segments.map(seg => (
              <div key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: seg.color, flexShrink: 0, boxShadow: `0 0 6px ${seg.color}88` }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {seg.label} <span style={{ color: 'var(--text)', fontWeight: 700 }}>{breakdown[seg.key] ?? '—'}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Share button */}
        <button
          onClick={shareScore}
          style={{
            padding: '10px 18px', borderRadius: 12,
            border: `1.5px solid ${copied ? C.teal : C.pink}66`,
            background: copied ? `${C.teal}14` : `${C.pink}14`,
            color: copied ? C.teal : C.pink,
            fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.15s',
            flexShrink: 0, alignSelf: 'flex-start',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          {copied ? '✓' : '↗'} {copied ? t('dash_score_copied') : t('dash_share_score')}
        </button>
      </div>
    </div>
  )
}

/* ─── Stat tile ──────────────────────────────────────────────────── */
function StatTile({ label, value, sub, color, icon, progress }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid var(--border)`,
      borderRadius: 'var(--radius-lg)',
      padding: '20px 22px',
      position: 'relative', overflow: 'hidden',
      transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = `${color}55`
        e.currentTarget.style.boxShadow = `0 16px 40px ${color}1F`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Color blob bg */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}1F 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8,
            background: `${color}1A`, border: `1px solid ${color}33`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.82rem',
          }}>{icon}</span>
          <span style={{
            fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.12em', color: 'var(--text-muted)',
          }}>{label}</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-creator)', fontSize: '2.6rem', fontWeight: 800,
          letterSpacing: '-0.04em', lineHeight: 1, color, marginBottom: 6,
          filter: `drop-shadow(0 0 14px ${color}3F)`,
        }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: '0.74rem', color: 'var(--text-faint)' }}>{sub}</div>
        )}
        {progress != null && (
          <div style={{ height: 5, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden', marginTop: 10 }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${Math.min(progress, 100)}%`,
              background: progress > 80
                ? `linear-gradient(90deg, ${C.coral}, ${C.pink})`
                : `linear-gradient(90deg, ${color}, ${color}CC)`,
              boxShadow: `0 0 8px ${color}66`,
              transition: 'width 0.6s ease',
            }} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Quick action card ──────────────────────────────────────────── */
function ActionCard({ to, icon, label, color }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)',
        border: `1px solid var(--border)`,
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        transition: 'all 0.18s ease',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${color}66`
          e.currentTarget.style.background = `${color}0A`
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = `0 10px 24px ${color}1F`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.background = 'var(--surface)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <span style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}33`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', color,
        }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
          {label}
        </span>
      </div>
    </Link>
  )
}

/* ─── Dashboard ──────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user }          = useAuth()
  const { t, lang }       = useLang()
  const { niches, goals, platform } = usePrefs()
  const [scripts, setSc]  = useState([])
  const [logs, setLogs]   = useState([])
  const [badges, setBadges] = useState([])
  const [profile, setProfile] = useState(null)
  const [creatorScore, setCreatorScore] = useState(null)
  const [loading, setLd]  = useState(true)

  useEffect(() => {
    Promise.all([
      api.getScripts().catch(() => ({ scripts: [] })),
      api.perfHistory().catch(() => ({ logs: [] })),
      api.getBadges().catch(() => ({ badges: [] })),
      api.getUserProfile().catch(() => null),
      api.getCreatorScore().catch(() => null),
    ])
      .then(([s, p, b, prof, cs]) => {
        setSc(s.scripts || [])
        setLogs(p.logs || [])
        setBadges(b.badges || [])
        setProfile(prof)
        setCreatorScore(cs)
      })
      .finally(() => setLd(false))
  }, [])

  const limit  = { FREE: 5, STARTER: 50, PRO: '∞' }[user?.plan] || 5
  const used   = user?.generationsUsed || 0
  const pct    = limit === '∞' ? 100 : Math.round((used / limit) * 100)
  const streak = profile?.streak || 0
  const firstName = user?.name?.split(' ')[0] || 'Creator'
  const mood = getTimeMood()

  return (
    <div className="page-enter">

      {/* ─── Hero greeting ───────────────────────────────────────── */}
      <div style={{ marginBottom: 28, position: 'relative' }}>
        {/* mood pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '5px 12px', borderRadius: 99,
          background: `${mood.color}14`,
          border: `1px solid ${mood.color}40`,
          marginBottom: 14,
        }}>
          <span style={{ fontSize: '0.95rem' }}>{mood.emoji}</span>
          <span style={{
            fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
            color: mood.color, textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            {mood.label}
          </span>
          <span style={{
            fontSize: '0.7rem', color: 'var(--text-faint)',
            paddingLeft: 8, marginLeft: 4, borderLeft: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
          }}>
            {new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-creator)', fontWeight: 800,
          fontSize: 'clamp(2.1rem, 4.5vw, 3rem)',
          letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 10,
        }}>
          {t('dash_greeting_' + mood.key)},{' '}
          <span style={{
            background: `linear-gradient(135deg, ${C.cyan} 0%, ${C.pink} 50%, ${C.amber} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: `drop-shadow(0 0 24px ${C.pink}3F)`,
          }}>
            {firstName}
          </span>
          <span style={{ color: C.amber }}> ✦</span>
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 0, maxWidth: 600, lineHeight: 1.55 }}>
          {t('dash_overview')}
        </p>
      </div>

      {/* ─── Today's Brief ───────────────────────────────────────── */}
      <TrendingBrief userName={firstName} />

      {/* ─── Stats row ───────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 14, marginBottom: 28,
      }}>
        <StatTile
          icon="✦" label={t('weekly_scripts')}
          value={scripts.length} sub={t('dash_all_time')}
          color={C.cyan}
        />
        <StatTile
          icon="⚡" label={t('dash_this_month')}
          value={<span>{used}<span style={{ fontSize: '1.4rem', color: 'var(--text-faint)', fontWeight: 600 }}>/{limit}</span></span>}
          color={C.pink} progress={pct}
        />
        <StatTile
          icon="◈" label={t('weekly_analyses')}
          value={logs.length} sub={t('dash_videos_reviewed')}
          color={C.lime}
        />
      </div>

      {/* ─── Creator Score ───────────────────────────────────────── */}
      <CreatorScoreCard score={creatorScore} />

      {/* ─── Streak — sticker style ──────────────────────────────── */}
      {streak > 0 && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 14,
          padding: '14px 22px',
          background: `linear-gradient(135deg, ${C.amber}1A, ${C.coral}14)`,
          border: `1.5px solid ${C.amber}55`,
          borderRadius: 18,
          transform: 'rotate(-1deg)',
          boxShadow: `0 10px 28px ${C.amber}1F`,
          marginBottom: 28,
        }}>
          <div style={{ fontSize: '1.9rem', lineHeight: 1, filter: `drop-shadow(0 0 8px ${C.amber}AA)` }}>🔥</div>
          <div>
            <span style={{
              fontFamily: 'var(--font-creator)', fontWeight: 800, fontSize: '1.65rem',
              color: C.amber, letterSpacing: '-0.02em',
            }}>{streak}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text)', marginLeft: 8, fontWeight: 600 }}>{t('dash_day_streak')}</span>
          </div>
        </div>
      )}

      {/* ─── Badges ──────────────────────────────────────────────── */}
      {badges.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{
            fontFamily: 'var(--font-head)', fontSize: '0.78rem', fontWeight: 700,
            color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em',
            marginBottom: 12,
          }}>{t('dash_badges')}</h2>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {badges.map((badge, i) => {
              const meta = BADGE_META[badge.type || badge] || { emoji: '⭐', label: badge.type || badge }
              const tilt = (i % 3 - 1) * 1.2 // -1.2°, 0°, 1.2° rotation
              return (
                <div key={i} title={meta.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '10px 14px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 12, flexShrink: 0, minWidth: 90,
                  transform: `rotate(${tilt}deg)`,
                  transition: 'transform 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0) scale(1.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = `rotate(${tilt}deg)` }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{meta.emoji}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    {meta.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Quick actions — vivid color per tile ────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontFamily: 'var(--font-head)', fontSize: '0.78rem', fontWeight: 700,
          color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em',
          marginBottom: 12,
        }}>Jump back in</h2>
        <div style={{
          display: 'grid', gap: 10,
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        }}>
          <ActionCard to="/generate"    icon="✦"  label={t('dash_action_generate')} color={C.cyan} />
          <ActionCard to="/score"       icon="◎"  label={t('dash_action_score')}    color={C.pink} />
          <ActionCard to="/coach"       icon="🤖" label={t('dash_action_coach')}    color={C.violet} />
          <ActionCard to="/trending"    icon="📈" label={t('dash_action_trending')} color={C.lime} />
          <ActionCard to="/performance" icon="◈"  label={t('dash_action_analyze')}  color={C.amber} />
          <ActionCard to="/calendar"    icon="📅" label={t('dash_action_calendar')} color={C.coral} />
        </div>
      </div>

      <WeeklyReport />

      {/* ─── Upgrade banner — punchy ─────────────────────────────── */}
      {user?.plan === 'FREE' && (
        <div style={{
          marginTop: 36,
          background: `linear-gradient(135deg, ${C.cyan}10 0%, ${C.pink}0F 50%, ${C.amber}10 100%)`,
          border: `1px solid ${C.pink}28`,
          borderRadius: 'var(--radius-lg)',
          padding: '22px 26px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
          position: 'relative', overflow: 'hidden',
          boxShadow: `0 0 50px ${C.pink}10`,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${C.cyan}, ${C.pink} 50%, ${C.amber})`,
          }} />
          <div style={{ position: 'absolute', top: -40, right: -30, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${C.pink}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: '40%', width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${C.amber}1F 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-creator)', fontWeight: 800, fontSize: '1.25rem', marginBottom: 6,
              letterSpacing: '-0.02em',
              background: `linear-gradient(135deg, ${C.cyan}, ${C.pink} 60%, ${C.amber})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {t('dash_unlock_title')}
            </div>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              <span style={{ color: C.pink, fontWeight: 700 }}>{used}/{limit}</span> {t('generate_usage')} · {t('dash_free_desc')}
            </div>
          </div>
          <Link to="/pricing" className="btn btn-primary btn-sm" style={{ position: 'relative', zIndex: 1, textDecoration: 'none' }}>
            {t('dash_upgrade_btn')} →
          </Link>
        </div>
      )}

    </div>
  )
}
