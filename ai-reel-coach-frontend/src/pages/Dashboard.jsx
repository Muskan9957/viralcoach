import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store'
import { api } from '../api'
import { useLang } from '../i18n.jsx'
import { useTextToSpeech } from '../components/VoiceAssistant'
import WeeklyReport from '../components/WeeklyReport'
import { usePrefs } from '../hooks/usePrefs'

const gradeColor = { A: '#00C9A7', B: '#FFD60A', C: '#FF9F43', D: '#FF6B6B', F: '#FF4757' }

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
  Entertainment: '#00C8FF', Finance: '#00C9A7', Lifestyle: '#FFD60A',
  Sports: '#7B5CF0', Business: '#00C9A7', Tech: '#7B5CF0',
  Content: '#00C8FF', Strategy: '#FFD60A', Health: '#00C9A7',
  Fashion: '#7B5CF0', Bollywood: '#00C8FF', Cricket: '#138808',
  Education: '#7B5CF0', Food: '#FFD60A',
}

function TrendingBrief({ userName }) {
  const { speak, speaking, stopSpeaking } = useTextToSpeech()
  const [greeting, setGreeting] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [played, setPlayed]     = useState(false)

  useEffect(() => {
    api.getGreeting('Global')
      .then(data => setGreeting(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const playGreeting = () => {
    if (!greeting) return
    if (speaking) { stopSpeaking(); return }
    speak(`Good ${getTimeGreeting()} ${userName}! ${greeting.greeting}`)
    setPlayed(true)
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      marginBottom: 28,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.4), rgba(0,200,255,0.6), rgba(123,92,240,0.4), transparent)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          TODAY'S BRIEF
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={playGreeting}
          disabled={!greeting}
          style={{
            padding: '5px 12px', borderRadius: 7,
            border: '1px solid var(--border)',
            background: speaking ? 'rgba(0,212,177,0.1)' : 'transparent',
            color: speaking ? 'var(--teal)' : 'var(--text-faint)',
            cursor: greeting ? 'pointer' : 'not-allowed',
            fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
            display: 'flex', alignItems: 'center', gap: 5,
            transition: 'all 0.15s',
          }}
        >
          {speaking ? '⏹ Stop' : played ? '🔊 Replay' : '▶ Listen'}
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>Loading today's trends...</span>
        </div>
      ) : greeting ? (
        <>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
            {greeting.greeting}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {greeting.trends?.slice(0, 3).map((trend, i) => {
              const color = CATEGORY_COLORS[trend.category] || 'var(--accent)'
              return (
                <div key={i} style={{
                  flex: '1 1 180px', padding: '12px 14px',
                  background: 'var(--surface2)', borderRadius: 10,
                  borderLeft: `2px solid ${color}`,
                }}>
                  <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                    {trend.category}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem', marginBottom: 3, color: 'var(--text)' }}>
                    {trend.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-faint)', lineHeight: 1.5 }}>
                    {trend.description}
                  </div>
                  <Link to="/generate" state={{ topic: trend.title }} style={{ display: 'inline-block', marginTop: 6, fontSize: '0.7rem', color, textDecoration: 'none', fontWeight: 600 }}>
                    Write script →
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

function getTimeGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function CreatorScoreCard({ score }) {
  const [copied, setCopied] = useState(false)

  if (!score) return null

  const { score: val, breakdown = {}, level } = score
  const segments = [
    { key: 'consistency',  label: 'Consistency',  color: '#00C9A7' },
    { key: 'hookQuality',  label: 'Hook Quality', color: '#00C8FF' },
    { key: 'performance',  label: 'Performance',  color: '#7B5CF0' },
    { key: 'streakBonus',  label: 'Streak Bonus', color: '#FFD60A' },
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
      padding: '22px 24px',
      marginBottom: 28,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
        {/* Score + Level */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: '3.2rem', fontFamily: 'var(--font-head)', fontWeight: 800, lineHeight: 1, background: 'linear-gradient(135deg, #00E5FF 0%, #00C8FF 50%, #7B5CF0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 16px rgba(0,200,255,0.25))' }}>
            {val}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {level || 'Rising Creator'}
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Creator Score Breakdown
          </div>
          {/* Bar */}
          <div style={{ display: 'flex', height: 8, borderRadius: 99, overflow: 'hidden', gap: 2, marginBottom: 10 }}>
            {segments.map(seg => {
              const val = breakdown[seg.key] || 0
              const pct = (val / total) * 100
              return (
                <div
                  key={seg.key}
                  title={`${seg.label}: ${val}`}
                  style={{ flex: pct, background: seg.color, minWidth: pct > 0 ? 4 : 0, borderRadius: 2, transition: 'flex 0.4s ease' }}
                />
              )
            })}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {segments.map(seg => (
              <div key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                  {seg.label} {breakdown[seg.key] ?? '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Share button */}
        <button
          onClick={shareScore}
          style={{
            padding: '8px 16px', borderRadius: 8,
            border: '1px solid var(--border)',
            background: copied ? 'rgba(0,212,177,0.08)' : 'transparent',
            color: copied ? 'var(--teal)' : 'var(--text-muted)',
            fontSize: '0.8rem', fontFamily: 'var(--font-body)',
            cursor: 'pointer', transition: 'all 0.15s',
            flexShrink: 0, alignSelf: 'flex-start',
          }}
        >
          {copied ? '✓ Copied' : '↗ Share Score'}
        </button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user }          = useAuth()
  const { t }             = useLang()
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

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-head)', fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8,
            }}>
              Good {getTimeGreeting()},{' '}
              <span style={{ background: 'linear-gradient(135deg, #00E5FF, #00C8FF, #7B5CF0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {firstName} ✦
              </span>
            </h1>
            <p className="page-sub">
              Here's your content overview for today.
            </p>
          </div>
        </div>
      </div>

      {/* Today's Brief */}
      <TrendingBrief userName={firstName} />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {/* Scripts stat */}
        <div style={{
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: 24,
          display: 'flex', flexDirection: 'column', gap: 4,
          transition: 'border-color 0.2s, transform 0.2s',
          background: 'linear-gradient(135deg, rgba(0,200,255,0.08) 0%, rgba(13,10,28,0.92) 60%)',
          borderLeft: '2px solid rgba(0,200,255,0.5)',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,200,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-faint)', marginBottom: 4 }}>Scripts</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #00C8FF, #4DD9FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
            {scripts.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 2 }}>All time</div>
        </div>
        {/* Usage stat */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,212,177,0.08) 0%, rgba(13,10,28,0.92) 60%)',
          border: '1px solid rgba(255,255,255,0.08)', borderLeft: '2px solid rgba(0,212,177,0.5)',
          borderRadius: 'var(--radius-lg)', padding: 24,
          display: 'flex', flexDirection: 'column', gap: 4,
          transition: 'border-color 0.2s, transform 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,201,167,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-faint)', marginBottom: 4 }}>This Month</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--teal)', lineHeight: 1 }}>
            {used}<span style={{ fontSize: '1.1rem', color: 'var(--text-faint)', fontWeight: 600 }}>/{limit}</span>
          </div>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill, width: `${Math.min(pct, 100)}%`, background: pct > 80 ? 'linear-gradient(90deg, #FF5F1F, #FF3CAC)' : 'linear-gradient(90deg, #00C9A7, #00E0BB)' }} />
          </div>
        </div>
        {/* Analyses stat */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(123,97,255,0.08) 0%, rgba(13,10,28,0.92) 60%)',
          border: '1px solid rgba(255,255,255,0.08)', borderLeft: '2px solid rgba(123,97,255,0.5)',
          borderRadius: 'var(--radius-lg)', padding: 24,
          display: 'flex', flexDirection: 'column', gap: 4,
          transition: 'border-color 0.2s, transform 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(123,97,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-faint)', marginBottom: 4 }}>Analyses</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#7B61FF', lineHeight: 1 }}>
            {logs.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 2 }}>Videos reviewed</div>
        </div>
      </div>

      {/* Creator Score */}
      <CreatorScoreCard score={creatorScore} />

      {/* Streak */}
      {streak > 0 && (
        <div style={styles.streakCard}>
          <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>🔥</div>
          <div>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent)' }}>{streak}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>day streak</span>
          </div>
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2 style={styles.sectionTitle}>Badges</h2>
          <div style={styles.badgesRow}>
            {badges.map((badge, i) => {
              const meta = BADGE_META[badge.type || badge] || { emoji: '⭐', label: badge.type || badge }
              return (
                <div key={i} style={styles.badgeChip} title={meta.label}>
                  <span style={{ fontSize: '1.2rem' }}>{meta.emoji}</span>
                  <span style={styles.badgeLabel}>{meta.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 28 }}>
        {[
          { to: '/generate',    icon: '✦', label: 'Generate Script', accent: true },
          { to: '/score',       icon: '◎', label: 'Score Hook',       accent: false },
          { to: '/coach',       icon: '🤖', label: 'Ask AI Coach',    accent: false },
          { to: '/trending',    icon: '📈', label: 'Trending',        accent: false },
          { to: '/performance', icon: '◈', label: 'Analyze',          accent: false },
          { to: '/calendar',    icon: '📅', label: 'Calendar',        accent: false },
        ].map(({ to, icon, label, accent }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div style={{
              background: accent ? 'linear-gradient(135deg, #00E5FF, #7B5CF0)' : 'var(--surface)',
              border: accent ? 'none' : '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: accent ? '0 4px 20px rgba(0,200,255,0.3)' : 'none',
              color: accent ? '#fff' : 'var(--text-muted)',
              fontWeight: 600, fontSize: '0.875rem',
            }}
              onMouseEnter={e => {
                if (!accent) {
                  e.currentTarget.style.background = 'var(--surface2)'
                  e.currentTarget.style.borderColor = 'var(--border-bright)'
                  e.currentTarget.style.color = 'var(--text)'
                } else {
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,200,255,0.5)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={e => {
                if (!accent) {
                  e.currentTarget.style.background = 'var(--surface)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                } else {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,200,255,0.3)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <span style={{ fontSize: '1rem' }}>{icon}</span>
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </div>


      <WeeklyReport />

      {user?.plan === 'FREE' && (
        <div style={{
          marginTop: 36,
          background: 'linear-gradient(135deg, rgba(0,229,255,0.07) 0%, rgba(0,200,255,0.06) 40%, rgba(123,92,240,0.07) 100%)',
          border: '1px solid rgba(0,200,255,0.18)',
          borderRadius: 'var(--radius-lg)', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 0 40px rgba(0,200,255,0.06)',
        }}>
          {/* Top gradient line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #00E5FF, #00C8FF 50%, #7B5CF0)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
          <div style={{ position: 'absolute', top: -30, right: -20, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -20, left: '40%', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,92,240,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.05rem', marginBottom: 4, background: 'linear-gradient(135deg, #00E5FF, #7B5CF0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Unlock unlimited scripts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Free plan — {used}/{limit} used this month · Upgrade to Pro for ₹799/mo</div>
          </div>
          <Link to="/pricing" className="btn btn-primary btn-sm" style={{ position: 'relative', zIndex: 1, textDecoration: 'none' }}>
            Upgrade to Pro →
          </Link>
        </div>
      )}

    </div>
  )
}

const styles = {
  progressBg: { height: 5, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99, transition: 'width 0.6s ease' },
  streakCard: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
  },
  sectionTitle: { fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700, marginBottom: 12 },
  badgesRow: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 },
  badgeChip: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 8, flexShrink: 0, minWidth: 80,
  },
  badgeLabel: { fontSize: '0.65rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' },
  upgradeBanner: {
    marginTop: 36, background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '18px 22px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap',
  },
}
