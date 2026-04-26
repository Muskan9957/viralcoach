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

/* ─── Time-of-day mood ──────────────────────────────────────────── */
function getTimeMood() {
  const h = new Date().getHours()
  if (h < 5)  return { key: 'evening',  emoji: '🌙', label: 'late-night creator', color: C.violet }
  if (h < 12) return { key: 'morning',  emoji: '☀️', label: 'fresh start',         color: C.amber  }
  if (h < 17) return { key: 'afternoon',emoji: '🔆', label: 'in the zone',         color: C.cyan   }
  if (h < 21) return { key: 'evening',  emoji: '✨', label: 'golden hour',         color: C.coral  }
  return            { key: 'evening',  emoji: '🌙', label: 'late-night creator', color: C.violet }
}

/* ─── Reusable: noise texture + gradient mesh background ─────────── */
const noiseUrl = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"

function MeshBg({ colors = [C.cyan, C.pink, C.amber], opacity = 0.18, noise = 0.045 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 'inherit' }}>
      <div style={{
        position: 'absolute', top: '-30%', left: '-20%', width: '80%', height: '120%',
        background: `radial-gradient(ellipse, ${colors[0]}${Math.round(opacity*255).toString(16).padStart(2,'0')} 0%, transparent 60%)`,
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute', top: '20%', right: '-15%', width: '70%', height: '120%',
        background: `radial-gradient(ellipse, ${colors[1]}${Math.round(opacity*255).toString(16).padStart(2,'0')} 0%, transparent 60%)`,
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-30%', left: '30%', width: '60%', height: '100%',
        background: `radial-gradient(ellipse, ${colors[2]}${Math.round(opacity*255).toString(16).padStart(2,'0')} 0%, transparent 60%)`,
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: noiseUrl, opacity: noise, mixBlendMode: 'overlay',
      }} />
    </div>
  )
}

/* ─── Story-card chip / sticker ──────────────────────────────────── */
function Sticker({ children, color = C.pink, tilt = 0, style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', borderRadius: 99,
      background: `${color}1A`, border: `1.5px solid ${color}55`,
      color, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      transform: tilt ? `rotate(${tilt}deg)` : undefined,
      ...style,
    }}>
      {children}
    </span>
  )
}

/* ─── Bento Tile wrapper ─────────────────────────────────────────── */
function BentoTile({ span = 4, rowSpan = 1, color = C.cyan, mesh = null, padding = 22, children, style = {}, hover = true }) {
  return (
    <div
      style={{
        gridColumn: `span ${span}`,
        gridRow: `span ${rowSpan}`,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 22,
        padding,
        position: 'relative', overflow: 'hidden',
        transition: 'transform 0.22s, border-color 0.22s, box-shadow 0.22s',
        ...style,
      }}
      onMouseEnter={hover ? (e => {
        e.currentTarget.style.borderColor = `${color}55`
        e.currentTarget.style.boxShadow = `0 18px 50px ${color}1F`
      }) : undefined}
      onMouseLeave={hover ? (e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }) : undefined}
    >
      {mesh && <MeshBg colors={mesh} />}
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  )
}

/* ─── Today's Brief ──────────────────────────────────────────────── */
function TrendingBrief({ userName }) {
  const { t, lang } = useLang()
  const { speak, speaking, stopSpeaking } = useTextToSpeech()
  const [greeting, setGreeting] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [played, setPlayed]     = useState(false)

  useEffect(() => {
    setLoading(true); setGreeting(null)
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
    <BentoTile span={12} color={C.pink} padding={26}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <Sticker color={C.pink}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.pink, boxShadow: `0 0 8px ${C.pink}`, animation: 'pulse 2s ease-in-out infinite' }} />
          {t('dash_todays_brief')}
        </Sticker>
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
            transition: 'all 0.15s',
          }}
        >
          {speaking ? t('dash_stop') : played ? t('dash_replay') : t('dash_listen')}
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>{t('dash_loading_trends')}</span>
        </div>
      ) : greeting ? (
        <>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.65, maxWidth: 760 }}>
            {greeting.greeting}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 10,
          }}>
            {greeting.trends?.slice(0, 3).map((trend, i) => {
              const color = CATEGORY_COLORS[trend.category] || C.cyan
              return (
                <Link
                  key={i}
                  to="/generate"
                  state={{ topic: trend.title }}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{
                    height: '100%',
                    padding: 16,
                    background: `linear-gradient(150deg, ${color}1A 0%, ${color}08 60%, transparent 100%)`,
                    border: `1px solid ${color}33`,
                    borderRadius: 16,
                    position: 'relative', overflow: 'hidden',
                    transition: 'transform 0.2s, border-color 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = `${color}77` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${color}33` }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <Sticker color={color} style={{ padding: '3px 9px', fontSize: '0.62rem' }}>
                        {trend.category}
                      </Sticker>
                      <span style={{ color, fontSize: '1rem' }}>↗</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 6, color: 'var(--text)', letterSpacing: '-0.015em', lineHeight: 1.3 }}>
                      {trend.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', lineHeight: 1.5 }}>
                      {trend.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      ) : null}
    </BentoTile>
  )
}

/* ─── Creator Score (story-card) ─────────────────────────────────── */
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
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <BentoTile span={4} rowSpan={2} color={C.pink} mesh={[C.cyan, C.pink, C.amber]} padding={26}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', minHeight: 280 }}>
        <div>
          <Sticker color={C.pink} style={{ marginBottom: 14 }}>
            ✦ Creator Score
          </Sticker>
          <div style={{
            fontSize: 'clamp(3.6rem, 9vw, 5.2rem)',
            fontFamily: 'var(--font-creator)', fontWeight: 800,
            lineHeight: 0.92, letterSpacing: '-0.05em',
            background: `linear-gradient(135deg, ${C.cyan} 0%, ${C.pink} 55%, ${C.amber} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: `drop-shadow(0 0 32px ${C.pink}55)`,
            marginBottom: 12,
          }}>
            {val}
          </div>
          <div style={{
            fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
            color: 'var(--text)', letterSpacing: '0.06em',
          }}>
            {level || 'Rising Creator'}
          </div>
        </div>

        <div>
          {/* Bar */}
          <div style={{ display: 'flex', height: 8, borderRadius: 99, overflow: 'hidden', gap: 3, marginBottom: 12 }}>
            {segments.map(seg => {
              const v = breakdown[seg.key] || 0
              const pct = (v / total) * 100
              return (
                <div key={seg.key} title={`${seg.label}: ${v}`} style={{
                  flex: pct, minWidth: pct > 0 ? 5 : 0, borderRadius: 99,
                  background: seg.color, boxShadow: `0 0 10px ${seg.color}66`,
                  transition: 'flex 0.4s ease',
                }} />
              )
            })}
          </div>
          {/* Legend grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px', marginBottom: 14 }}>
            {segments.map(seg => (
              <div key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: seg.color, flexShrink: 0, boxShadow: `0 0 5px ${seg.color}88` }} />
                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.02em' }}>
                  {seg.label} <span style={{ color: 'var(--text)', fontWeight: 700 }}>{breakdown[seg.key] ?? '—'}</span>
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={shareScore}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 12,
              border: `1.5px solid ${copied ? C.teal : C.pink}66`,
              background: copied ? `${C.teal}14` : `${C.pink}14`,
              color: copied ? C.teal : C.pink,
              fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {copied ? '✓' : '↗'} {copied ? t('dash_score_copied') : t('dash_share_score')}
          </button>
        </div>
      </div>
    </BentoTile>
  )
}

/* ─── Stat Tile ──────────────────────────────────────────────────── */
function StatTile({ span = 4, label, value, sub, color, icon, progress, accent }) {
  return (
    <BentoTile span={span} color={color} padding={20}>
      {accent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9,
          background: `${color}1A`, border: `1px solid ${color}33`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.88rem', color,
        }}>{icon}</span>
        <span style={{
          fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.12em', color: 'var(--text-muted)',
        }}>{label}</span>
      </div>
      <div style={{
        fontFamily: 'var(--font-creator)', fontSize: '2.6rem', fontWeight: 800,
        letterSpacing: '-0.04em', lineHeight: 1, color, marginBottom: 6,
        filter: `drop-shadow(0 0 12px ${color}3F)`,
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
    </BentoTile>
  )
}

/* ─── Streak story-tile ──────────────────────────────────────────── */
function StreakTile({ streak, t }) {
  return (
    <BentoTile span={4} color={C.amber} mesh={[C.amber, C.coral, C.pink]} padding={22}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: 130 }}>
        <Sticker color={C.amber}>
          🔥 Streak
        </Sticker>
        <div>
          <div style={{
            fontFamily: 'var(--font-creator)', fontWeight: 800,
            fontSize: 'clamp(2.6rem, 6vw, 3.8rem)', lineHeight: 0.95,
            color: C.amber, letterSpacing: '-0.04em',
            filter: `drop-shadow(0 0 16px ${C.amber}66)`,
          }}>
            {streak}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>
            {t('dash_day_streak')}
          </div>
        </div>
      </div>
    </BentoTile>
  )
}

/* ─── Upgrade story-tile ─────────────────────────────────────────── */
function UpgradeTile({ used, limit, t }) {
  return (
    <BentoTile span={4} color={C.pink} mesh={[C.cyan, C.pink, C.amber]} padding={22}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: 130, gap: 14 }}>
        <div>
          <Sticker color={C.amber} style={{ marginBottom: 12 }}>
            ⚡ {used}/{limit} used
          </Sticker>
          <div style={{
            fontFamily: 'var(--font-creator)', fontWeight: 800,
            fontSize: '1.4rem', letterSpacing: '-0.025em', lineHeight: 1.1,
            background: `linear-gradient(135deg, ${C.cyan}, ${C.pink} 60%, ${C.amber})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: 6,
          }}>
            {t('dash_unlock_title')}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {t('dash_free_desc')}
          </div>
        </div>
        <Link to="/pricing" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', textDecoration: 'none' }}>
          {t('dash_upgrade_btn')}
        </Link>
      </div>
    </BentoTile>
  )
}

/* ─── Quick action pill (horizontal scroll) ──────────────────────── */
function ActionPill({ to, icon, label, color }) {
  return (
    <Link to={to} style={{ textDecoration: 'none', flexShrink: 0 }}>
      <div style={{
        background: 'var(--surface)',
        border: `1px solid var(--border)`,
        borderRadius: 99,
        padding: '9px 16px 9px 9px',
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer', transition: 'all 0.18s ease',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${color}77`
          e.currentTarget.style.background = `${color}10`
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.background = 'var(--surface)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <span style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: `${color}1F`, border: `1px solid ${color}55`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.92rem', color,
        }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
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
    <div className="page-enter dash-bento">
      <style>{`
        .dash-bento {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 14px;
        }
        .dash-bento > * { min-width: 0; }
        @media (max-width: 980px) {
          .dash-bento { grid-template-columns: repeat(6, 1fr); }
          .dash-bento > [data-bento-mob="full"] { grid-column: span 6 !important; }
          .dash-bento > [data-bento-mob="half"] { grid-column: span 3 !important; }
        }
        @media (max-width: 580px) {
          .dash-bento { grid-template-columns: 1fr; }
          .dash-bento > * { grid-column: 1 / -1 !important; grid-row: auto !important; }
        }
        @keyframes meshDriftA {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(2%, -2%) scale(1.05); }
        }
      `}</style>

      {/* ─── Hero greeting (span 8) ──────────────────────────────── */}
      <div data-bento-mob="full" style={{
        gridColumn: 'span 8', gridRow: 'span 1',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 22,
        padding: '32px 32px 28px',
        position: 'relative', overflow: 'hidden',
        minHeight: 180,
      }}>
        <MeshBg colors={[C.cyan, C.pink, C.amber]} opacity={0.22} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Sticker color={mood.color}>
              {mood.emoji} {mood.label}
            </Sticker>
            <span style={{
              fontSize: '0.7rem', color: 'var(--text-faint)',
              fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.04em',
            }}>
              {new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-creator)', fontWeight: 800,
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            letterSpacing: '-0.045em', lineHeight: 1.02, marginBottom: 12,
          }}>
            {t('dash_greeting_' + mood.key)},{' '}
            <span style={{
              background: `linear-gradient(135deg, ${C.cyan} 0%, ${C.pink} 50%, ${C.amber} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: `drop-shadow(0 0 32px ${C.pink}55)`,
            }}>
              {firstName}
            </span>
            <span style={{ color: C.amber }}> ✦</span>
          </h1>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', maxWidth: 600, lineHeight: 1.55 }}>
            {t('dash_overview')}
          </p>
        </div>
      </div>

      {/* ─── Creator Score (span 4, rowspan 2) ──────────────────── */}
      {creatorScore && <CreatorScoreCard score={creatorScore} />}
      {!creatorScore && (
        <div data-bento-mob="full" style={{
          gridColumn: 'span 4', gridRow: 'span 2',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 22, minHeight: 280,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
            Score loading…
          </span>
        </div>
      )}

      {/* ─── Stats row: cyan / pink / lime, each span 2.66 ≈ 3+3+2 ─ */}
      <div data-bento-mob="half" style={{ gridColumn: 'span 3', gridRow: 'span 1' }}>
        <StatTile
          span={12} icon="✦" label={t('weekly_scripts')}
          value={scripts.length} sub={t('dash_all_time')}
          color={C.cyan} accent
        />
      </div>
      <div data-bento-mob="half" style={{ gridColumn: 'span 3', gridRow: 'span 1' }}>
        <StatTile
          span={12} icon="⚡" label={t('dash_this_month')}
          value={<span>{used}<span style={{ fontSize: '1.4rem', color: 'var(--text-faint)', fontWeight: 600 }}>/{limit}</span></span>}
          color={C.pink} progress={pct} accent
        />
      </div>
      <div data-bento-mob="full" style={{ gridColumn: 'span 2', gridRow: 'span 1' }}>
        <StatTile
          span={12} icon="◈" label={t('weekly_analyses')}
          value={logs.length} sub={t('dash_videos_reviewed')}
          color={C.lime} accent
        />
      </div>

      {/* ─── Today's brief (span 12) ────────────────────────────── */}
      <TrendingBrief userName={firstName} />

      {/* ─── Streak + Upgrade row (only when applicable) ────────── */}
      {streak > 0 && <StreakTile streak={streak} t={t} />}
      {user?.plan === 'FREE' && <UpgradeTile used={used} limit={limit} t={t} />}

      {/* ─── Badges (span 12) ───────────────────────────────────── */}
      {badges.length > 0 && (
        <div data-bento-mob="full" style={{
          gridColumn: 'span 12',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 22, padding: 22, position: 'relative', overflow: 'hidden',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-head)', fontSize: '0.78rem', fontWeight: 700,
            color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em',
            marginBottom: 12,
          }}>{t('dash_badges')}</h2>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {badges.map((badge, i) => {
              const meta = BADGE_META[badge.type || badge] || { emoji: '⭐', label: badge.type || badge }
              const tilt = (i % 3 - 1) * 1.2
              return (
                <div key={i} title={meta.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '10px 14px',
                  background: 'var(--surface2)',
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

      {/* ─── Quick actions: horizontal scroll-strip (span 12) ───── */}
      <div data-bento-mob="full" style={{
        gridColumn: 'span 12',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 22, padding: 22, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{
            fontFamily: 'var(--font-creator)', fontWeight: 800, fontSize: '1.05rem',
            color: 'var(--text)', letterSpacing: '-0.02em', margin: 0,
          }}>Jump back in</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>swipe →</span>
        </div>
        <div style={{
          display: 'flex', gap: 10, overflowX: 'auto',
          paddingBottom: 6, scrollSnapType: 'x mandatory',
        }}>
          <ActionPill to="/generate"    icon="✦"  label={t('dash_action_generate')} color={C.cyan} />
          <ActionPill to="/score"       icon="◎"  label={t('dash_action_score')}    color={C.pink} />
          <ActionPill to="/coach"       icon="🤖" label={t('dash_action_coach')}    color={C.violet} />
          <ActionPill to="/trending"    icon="📈" label={t('dash_action_trending')} color={C.lime} />
          <ActionPill to="/performance" icon="◈"  label={t('dash_action_analyze')}  color={C.amber} />
          <ActionPill to="/calendar"    icon="📅" label={t('dash_action_calendar')} color={C.coral} />
        </div>
      </div>

      {/* ─── Weekly report (span 12) ────────────────────────────── */}
      <div data-bento-mob="full" style={{ gridColumn: 'span 12' }}>
        <WeeklyReport />
      </div>

    </div>
  )
}
